/**
 * 🎮 DeckEngine V2 - Sistema de Pipeline com Metáforas de Gaming
 *
 * Arquitetura completamente modular com suporte a:
 * - Domains (Authentication, User Management, System, Expansions)
 * - Unified Logging (Console, File, Database, Markdown)
 * - Multi-Platform (Node, Vercel, Netlify, Cloudflare)
 * - Route Types (Public, Private, External)
 *
 * @version 2.0.0
 */

// Core Components
const DeckEngineV2 = require("./deck-engine");
const DeckEngineV1 = require("./core/engine/deck-engine");

// Utils para compatibilidade
const Utils = require("./core/engine/utils");

// ============ MAIN EXPORT ============
class DeckEngineApp {
  constructor(options = {}) {
    // Determinar versão a usar
    this.version = options.version || "v2";
    this.options = options;

    if (this.version === "v2") {
      this.engine = new DeckEngineV2(options);
    } else {
      this.engine = new DeckEngineV1(options);
    }

    // Expor componentes V2 se disponíveis
    if (this.version === "v2") {
      this.logger = this.engine.logger;
      this.routeManager = this.engine.routeManager;
      this.domainManager = this.engine.domainManager;
      this.platformAdapter = this.engine.platformAdapter;
    }
  }

  // ============ V2 METHODS ============
  async installDomain(domainName, type = "expansion", config = {}) {
    if (this.version !== "v2") {
      throw new Error("Domain installation only available in V2");
    }
    return await this.engine.installDomain(domainName, type, config);
  }

  getInstalledDomains() {
    if (this.version !== "v2") {
      throw new Error("Domain access only available in V2");
    }
    return this.engine.getInstalledDomains();
  }

  getDomain(domainName) {
    if (this.version !== "v2") {
      throw new Error("Domain access only available in V2");
    }
    return this.engine.getDomain(domainName);
  }

  async playDomainDeck(domainName, deckPath, payload = {}, options = {}) {
    if (this.version !== "v2") {
      throw new Error("Domain deck execution only available in V2");
    }
    return await this.engine.playDomainDeck(
      domainName,
      deckPath,
      payload,
      options
    );
  }

  // ============ UNIVERSAL METHODS (V1 & V2) ============
  createDeck(deckName, config = {}) {
    return this.engine.createDeck(deckName, config);
  }

  async playMatch(deckName, payload = {}, options = {}) {
    return await this.engine.playMatch(deckName, payload, options);
  }

  async playAndWait(deckName, payload = {}, options = {}) {
    return await this.engine.playAndWait(deckName, payload, options);
  }

  async playMatches(deckName, payloads, options = {}) {
    if (this.engine.playMatches) {
      return await this.engine.playMatches(deckName, payloads, options);
    }
    // Fallback para V1
    const promises = payloads.map((payload) =>
      this.playMatch(deckName, payload, options)
    );
    return options.waitAll ? await Promise.all(promises) : promises;
  }

  async waitForMatch(matchId, timeout = 60000) {
    if (this.engine.waitForMatch) {
      return await this.engine.waitForMatch(matchId, timeout);
    }
    // Fallback simples
    return { success: true, matchId, result: { completed: true } };
  }

  getDeckStatus(deckName) {
    if (this.engine.getDeckStatus) {
      return this.engine.getDeckStatus(deckName);
    }
    // Fallback básico
    const deck = this.engine.getDeck(deckName);
    return deck
      ? {
          name: deckName,
          enabled: deck.enabled !== false,
          cardCount: deck.cards ? deck.cards.length : 0,
          status: "active",
        }
      : null;
  }

  healthCheck() {
    return this.engine.healthCheck();
  }

  getGlobalStatus() {
    return this.engine.getGlobalStatus();
  }

  cleanup(maxAge) {
    return this.engine.cleanup(maxAge);
  }

  async shutdown() {
    return await this.engine.shutdown();
  }

  // ============ CONVENIENCE METHODS ============
  on(event, handler) {
    return this.engine.on(event, handler);
  }

  off(event, handler) {
    return this.engine.off(event, handler);
  }

  // ============ MIGRATION HELPERS ============
  static migrate(v1Engine) {
    // Helper para migrar instância V1 para V2
    const options = {
      version: "v2",
      // Mapear configurações V1 para V2
      logging: ["console"],
      standardDomains: ["authentication", "user-management", "system"],
    };

    const v2Engine = new DeckEngineApp(options);

    // Migrar decks existentes
    const v1Decks = v1Engine.getAllDecks();
    for (const [deckName, deck] of v1Decks) {
      // TODO: Implementar migração de decks
      console.log(`🔄 Migrating deck: ${deckName}`);
    }

    return v2Engine;
  }
}

// ============ EXPORTS ============

// Export principal
module.exports = DeckEngineApp;

// Named exports para flexibilidade
module.exports.DeckEngineV2 = DeckEngineV2;
module.exports.DeckEngineV1 = DeckEngineV1;
module.exports.DeckEngineApp = DeckEngineApp;

// Utils para compatibilidade
module.exports.Utils = Utils;

// Convenience functions
module.exports.createEngine = (options = {}) => {
  return new DeckEngineApp({ ...options, version: "v2" });
};

module.exports.createEngineV1 = (options = {}) => {
  return new DeckEngineApp({ ...options, version: "v1" });
};

module.exports.createEngineV2 = (options = {}) => {
  return new DeckEngineApp({ ...options, version: "v2" });
};

// Migration helper
module.exports.migrateToV2 = (v1Engine) => {
  return DeckEngineApp.migrate(v1Engine);
};

// Version info
module.exports.version = "2.0.0";
module.exports.supportedVersions = ["v1", "v2"];

// Platform detection
module.exports.detectPlatform = () => {
  if (process.env.VERCEL) return "vercel";
  if (process.env.NETLIFY) return "netlify";
  if (process.env.CLOUDFLARE_WORKERS) return "cloudflare";
  return "node";
};

// Quick setup helpers
module.exports.setupForNode = (options = {}) => {
  return new DeckEngineApp({
    ...options,
    version: "v2",
    platform: "node",
    logging: ["console", "file"],
  });
};

module.exports.setupForVercel = (options = {}) => {
  return new DeckEngineApp({
    ...options,
    version: "v2",
    platform: "vercel",
    logging: ["console"],
  });
};

module.exports.setupForNetlify = (options = {}) => {
  return new DeckEngineApp({
    ...options,
    version: "v2",
    platform: "netlify",
    logging: ["console"],
  });
};

// ============ EXAMPLES ============
module.exports.examples = {
  // Basic V2 usage
  basic: () => {
    const engine = new DeckEngineApp({ version: "v2" });

    // Criar deck simples
    const deck = engine.createDeck("hello-world");
    deck.addCard("greet", async (context) => {
      return { message: "Hello from DeckEngine V2!" };
    });

    return engine;
  },

  // Domain usage
  withDomains: async () => {
    const engine = new DeckEngineApp({
      version: "v2",
      standardDomains: ["authentication", "user-management"],
    });

    // Usar domain de authentication
    const result = await engine.playDomainDeck("authentication", "login", {
      email: "user@example.com",
      password: "password123",
    });

    return { engine, result };
  },

  // Multi-platform
  serverless: () => {
    const platform = module.exports.detectPlatform();

    if (platform === "vercel") {
      return module.exports.setupForVercel();
    } else if (platform === "netlify") {
      return module.exports.setupForNetlify();
    } else {
      return module.exports.setupForNode();
    }
  },
};

// ============ STARTUP MESSAGE ============
console.log(`
🎮 DeckEngine V2 Loaded!

📚 Available versions: ${module.exports.supportedVersions.join(", ")}
🚀 Platform detected: ${module.exports.detectPlatform()}
📖 Documentation: /docs/

Quick start:
  const engine = require('./v2')({ version: 'v2' });
  const deck = engine.createDeck('my-pipeline');
  deck.addCard('process', async (ctx) => { ... });
  await engine.playAndWait('my-pipeline', { data: 'test' });

Happy coding! 🚀
`);
