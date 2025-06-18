/**
 * 🎮 DeckEngine - Sistema de Pipeline com Metáforas de Gaming
 *
 * Arquitetura completamente modular com suporte a:
 * - Domains (Authentication, User Management, System, Expansions)
 * - Unified Logging (Console, File, Database, Markdown)
 * - Multi-Platform (Node, Vercel, Netlify, Cloudflare)
 * - Route Types (Public, Private, External)
 *
 * @version 1.0.0
 */

// Core Components
const DeckEngineCore = require("./deck-engine");

// Utils
const Utils = require("./core/engine/utils");

// ============ MAIN EXPORT ============
class DeckEngineApp {
  constructor(options = {}) {
    this.options = options;
    this.engine = new DeckEngineCore(options);

    // Expor componentes principais
    this.logger = this.engine.logger;
    this.routeManager = this.engine.routeManager;
    this.domainManager = this.engine.domainManager;
    this.platformAdapter = this.engine.platformAdapter;
  }

  // ============ DOMAIN METHODS ============
  async installDomain(domainName, type = "expansion", config = {}) {
    return await this.engine.installDomain(domainName, type, config);
  }

  getInstalledDomains() {
    return this.engine.getInstalledDomains();
  }

  getDomain(domainName) {
    return this.engine.getDomain(domainName);
  }

  async playDomainDeck(domainName, deckPath, payload = {}, options = {}) {
    return await this.engine.playDomainDeck(
      domainName,
      deckPath,
      payload,
      options
    );
  }

  // ============ CORE METHODS ============
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
    // Fallback para execução sequencial
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

  // ============ EVENT METHODS ============
  on(event, handler) {
    return this.engine.on(event, handler);
  }

  off(event, handler) {
    return this.engine.off(event, handler);
  }
}

// ============ EXPORTS ============

// Export principal
module.exports = DeckEngineApp;

// Named exports para flexibilidade
module.exports.DeckEngine = DeckEngineCore;
module.exports.DeckEngineApp = DeckEngineApp;

// Utils
module.exports.Utils = Utils;

// Convenience function
module.exports.createEngine = (options = {}) => {
  return new DeckEngineApp(options);
};

// ============ USAGE EXAMPLES ============

/*
// Basic usage
const DeckEngine = require('./index');
const engine = new DeckEngine();

// Create and use deck
const userDeck = engine.createDeck('user-onboarding');
userDeck.addCard('validate-email', async (context) => {
  // Validation logic
  return { ...context, emailValid: true };
});

const result = await engine.playAndWait('user-onboarding', {
  email: 'user@example.com'
});
*/

// ============ STARTUP MESSAGE ============
if (process.env.NODE_ENV !== "test") {
  console.log(`
🎮 DeckEngine Loaded!
├─ Version: 1.0.0
├─ Environment: ${process.env.NODE_ENV || "development"}
└─ Ready for action!

Example usage:
const engine = require('./index')();
  `);
}
