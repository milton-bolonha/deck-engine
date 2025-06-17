/**
 * 🎮 DeckEngine - Sistema de Pipeline com Metáforas de Gaming
 *
 * Transforme suas operações complexas em partidas épicas!
 * Pipeline = Deck | Step = Card | Execution = Match
 */

const Utils = require("./utils");
const EventSystem = require("./events");
const MetricsSystem = require("./metrics");
const ArenaSystem = require("./arena");
const DeckSystem = require("./deck");
const MatchSystem = require("./match");

class DeckEngine {
  constructor(options = {}) {
    // 🎯 Estados das partidas e cartas
    this.MATCH_STATES = {
      WAITING: "waiting",
      QUEUED: "queued",
      PLAYING: "playing",
      VICTORY: "victory",
      DEFEAT: "defeat",
      PAUSED: "paused",
      CANCELLED: "cancelled",
      CRASHED: "crashed",
      TIMED_OUT: "timed_out",
      EXPIRED: "expired",
    };

    this.CARD_STATES = {
      IN_HAND: "in_hand",
      PLAYING: "playing",
      PLAYED: "played",
      FAILED: "failed",
      DISCARDED: "discarded",
    };

    // 🏗️ Inicializar sistemas
    this.eventSystem = new EventSystem(options.enableEvents !== false);
    this.metricsSystem = new MetricsSystem(options.enableMetrics !== false);
    this.arenaSystem = new ArenaSystem();
    this.deckSystem = new DeckSystem(this.eventSystem);
    this.matchSystem = new MatchSystem(
      this.eventSystem,
      this.metricsSystem,
      this.MATCH_STATES,
      this.CARD_STATES
    );

    // 🎪 Arena principal
    this.arenaSystem.initializeArena("main", {
      concurrencyLimit: options.concurrencyLimit || 10,
      priority: 0,
    });

    // ⚡ Processamento contínuo
    this.processing = false;
    this.processInterval = null;

    // 🧹 Limpeza automática
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, options.cleanupInterval || 300000); // 5 minutos

    this.eventSystem.emit("engine:initialized", {
      version: "2.0.0",
      systems: ["events", "metrics", "arena", "deck", "match"],
    });
  }

  // 🎴 ============ CRIAÇÃO DE DECKS ============
  createDeck(deckName, config = {}) {
    const deck = this.deckSystem.createDeck(deckName, config);

    // Inicializar arena se especificada
    if (deck.arena.name !== "main") {
      this.arenaSystem.initializeArena(deck.arena.name, {
        concurrencyLimit: deck.arena.concurrencyLimit,
        priority: deck.arena.priority,
      });
    }

    // Inicializar métricas do deck
    this.metricsSystem.initializeDeckStats(deckName);

    // Criar proxy enriquecido
    const proxy = this.deckSystem.createDeckProxy(deck);

    // Adicionar métodos do engine
    proxy.playMatch = (payload, options) =>
      this.playMatch(deckName, payload, options);
    proxy.playAndWait = (payload, options) =>
      this.playAndWait(deckName, payload, options);
    proxy.playMatches = (payloads, options) =>
      this.playMatches(deckName, payloads, options);
    proxy.getMatches = (options) =>
      this.matchSystem.getMatchesByDeck(deckName, options);
    proxy.getStatus = () => this.getDeckStatus(deckName);
    proxy.getStats = () => this.metricsSystem.getDeckStats(deckName);

    return proxy;
  }

  // 🎮 ============ EXECUÇÃO DE PARTIDAS ============
  async playMatch(deckName, payload = {}, options = {}) {
    const deck = this.deckSystem.getDeck(deckName);
    if (!deck) throw new Error(`Deck "${deckName}" não encontrado`);
    if (!deck.enabled) throw new Error(`Deck "${deckName}" está desabilitado`);

    // Verificar idempotência
    const idempotencyKey =
      options.idempotencyKey ||
      (deck.idempotencyKey
        ? Utils.generateIdempotencyKey(deckName, payload)
        : null);

    if (idempotencyKey && this.matchSystem.checkIdempotency(idempotencyKey)) {
      this.eventSystem.emit("match:idempotent", { deckName, idempotencyKey });
      return { success: true, cached: true };
    }

    // Criar partida
    const matchId = options.matchId || Utils.generateUUID();
    const match = await this.matchSystem.createMatch(matchId, deck, payload, {
      ...options,
      idempotencyKey,
    });

    // Armazenar idempotência
    if (idempotencyKey) {
      this.matchSystem.storeIdempotency(
        idempotencyKey,
        match,
        deck.idempotencyKeyTTL
      );
    }

    // Colocar na fila
    this.arenaSystem.enqueueMatch(deck.arena.name, matchId);
    match.state = this.MATCH_STATES.QUEUED;

    this.eventSystem.emit("match:queued", {
      matchId,
      deckName,
      arenaName: deck.arena.name,
    });

    // Iniciar processamento se não estiver rodando
    if (!this.processing) {
      this.startProcessing();
    }

    return { matchId, queued: true, arena: deck.arena.name };
  }

  async playAndWait(deckName, payload = {}, options = {}) {
    const result = await this.playMatch(deckName, payload, options);

    if (result.cached) return result;

    const matchId = result.matchId;

    // Aguardar conclusão
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout aguardando partida ${matchId}`));
      }, options.timeout || 60000);

      const checkResult = () => {
        const match = this.matchSystem.getMatch(matchId);
        if (!match) {
          clearTimeout(timeout);
          reject(new Error(`Partida ${matchId} não encontrada`));
          return;
        }

        if (Utils.isFinalState(match.state, this.MATCH_STATES)) {
          clearTimeout(timeout);

          if (match.state === this.MATCH_STATES.VICTORY) {
            resolve({ success: true, result: match.result, match });
          } else {
            resolve({ success: false, errors: match.errors, match });
          }
        } else {
          setTimeout(checkResult, 100);
        }
      };

      checkResult();
    });
  }

  async playMatches(deckName, payloads, options = {}) {
    const promises = payloads.map((payload, index) =>
      this.playMatch(deckName, payload, {
        ...options,
        matchId: options.generateIds ? Utils.generateUUID() : undefined,
      })
    );

    if (options.waitAll) {
      const results = await Promise.all(promises);

      // Aguardar todas as execuções
      const matchIds = results.filter((r) => r.matchId).map((r) => r.matchId);
      return await Promise.all(
        matchIds.map((matchId) => this.waitForMatch(matchId, options.timeout))
      );
    }

    return await Promise.all(promises);
  }

  async waitForMatch(matchId, timeout = 60000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout aguardando partida ${matchId}`));
      }, timeout);

      const checkResult = () => {
        const match = this.matchSystem.getMatch(matchId);
        if (!match) {
          clearTimeout(timeoutId);
          reject(new Error(`Partida ${matchId} não encontrada`));
          return;
        }

        if (Utils.isFinalState(match.state, this.MATCH_STATES)) {
          clearTimeout(timeoutId);
          resolve({
            success: match.state === this.MATCH_STATES.VICTORY,
            result: match.result,
            errors: match.errors,
            match,
          });
        } else {
          setTimeout(checkResult, 100);
        }
      };

      checkResult();
    });
  }

  // ⚡ ============ PROCESSAMENTO ============
  async startProcessing() {
    if (this.processing) return;

    this.processing = true;
    this.eventSystem.emit("engine:processing:started");

    this.processInterval = setInterval(async () => {
      await this.processNextMatches();
    }, 100);
  }

  stopProcessing() {
    if (!this.processing) return;

    this.processing = false;
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }

    this.eventSystem.emit("engine:processing:stopped");
  }

  async processNextMatches() {
    const arenas = this.arenaSystem.getAllArenas();

    for (const arena of arenas) {
      if (!this.arenaSystem.canProcessMore(arena.name)) continue;

      const matchId = this.arenaSystem.getNextMatch(arena.name);
      if (!matchId) continue;

      const match = this.matchSystem.getMatch(matchId);
      if (!match) continue;

      const deck = this.deckSystem.getDeck(match.deckName);
      if (!deck || !deck.enabled || deck.paused) continue;

      // Processar em background
      this.processMatch(match, deck, arena.name).catch((error) => {
        console.error(`Erro processando partida ${matchId}:`, error);
      });
    }
  }

  async processMatch(match, deck, arenaName) {
    try {
      this.eventSystem.emit("match:started", {
        matchId: match.id,
        deckName: deck.name,
        arenaName,
      });

      const result = await this.matchSystem.playMatch(match, deck);

      // Completar na arena
      this.arenaSystem.completeMatch(arenaName, match.id, result.success);

      if (result.success) {
        this.eventSystem.emit("match:completed", {
          matchId: match.id,
          deckName: deck.name,
          result: result.result,
        });
      }
    } catch (error) {
      this.arenaSystem.completeMatch(arenaName, match.id, false);
      this.eventSystem.emit("match:error", {
        matchId: match.id,
        deckName: deck.name,
        error: error.message,
      });
    }
  }

  // 📊 ============ INFORMAÇÕES E CONTROLE ============
  getDeckStatus(deckName) {
    const deck = this.deckSystem.getDeck(deckName);
    if (!deck) return null;

    const matches = this.matchSystem.getMatchesByDeck(deckName);
    const arenaStatus = this.arenaSystem.getArenaStatus(deck.arena.name);

    return {
      name: deck.name,
      enabled: deck.enabled,
      paused: deck.paused,
      cardCount: deck.cards.length,
      matches: {
        total: matches.length,
        waiting: matches.filter((m) => m.state === this.MATCH_STATES.WAITING)
          .length,
        queued: matches.filter((m) => m.state === this.MATCH_STATES.QUEUED)
          .length,
        playing: matches.filter((m) => m.state === this.MATCH_STATES.PLAYING)
          .length,
        victories: matches.filter((m) => m.state === this.MATCH_STATES.VICTORY)
          .length,
        defeats: matches.filter((m) => m.state === this.MATCH_STATES.DEFEAT)
          .length,
      },
      arena: arenaStatus,
      stats: this.metricsSystem.getDeckStats(deckName),
    };
  }

  getGlobalStatus() {
    return {
      engine: {
        processing: this.processing,
        version: "2.0.0",
      },
      decks: {
        total: this.deckSystem.getDeckCount(),
        enabled: this.deckSystem.getEnabledDecks().length,
        names: this.deckSystem.getDeckNames(),
      },
      arenas: this.arenaSystem.getAllArenas(),
      matches: {
        total: this.matchSystem.getAllMatches().length,
      },
      metrics: this.metricsSystem.getAllStats(),
      events: {
        enabled: this.eventSystem.enabled,
        handlers: this.eventSystem.getEventCount(),
      },
    };
  }

  healthCheck() {
    const status = this.getGlobalStatus();
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        processing: this.processing ? "ok" : "stopped",
        decks: status.decks.total > 0 ? "ok" : "no_decks",
        arenas: status.arenas.length > 0 ? "ok" : "no_arenas",
        events: this.eventSystem.enabled ? "ok" : "disabled",
        metrics: this.metricsSystem.enabled ? "ok" : "disabled",
      },
    };

    // Determinar status geral
    const criticalIssues = Object.values(health.checks).filter(
      (check) => !["ok", "disabled"].includes(check)
    );

    if (criticalIssues.length > 0) {
      health.status = "degraded";
    }

    return health;
  }

  // 🧹 ============ LIMPEZA E MANUTENÇÃO ============
  cleanup(maxAge = 86400000) {
    // 24h
    const results = {
      matches: this.matchSystem.cleanup(maxAge),
      timestamp: new Date().toISOString(),
    };

    this.eventSystem.emit("engine:cleanup", results);
    return results;
  }

  // 🎯 ============ EVENTOS GLOBAIS ============
  on(event, handler) {
    this.eventSystem.on(event, handler);
  }

  off(event, handler) {
    this.eventSystem.off(event, handler);
  }

  // 🔧 ============ UTILITÁRIOS ============
  getDeck(deckName) {
    return this.deckSystem.getDeck(deckName);
  }

  getAllDecks() {
    return this.deckSystem.getAllDecks();
  }

  getMatch(matchId) {
    return this.matchSystem.getMatch(matchId);
  }

  pauseArena(arenaName) {
    this.arenaSystem.pauseArena(arenaName);
  }

  resumeArena(arenaName) {
    this.arenaSystem.resumeArena(arenaName);
  }

  getMetrics() {
    return this.metricsSystem.getAllStats();
  }

  resetMetrics() {
    this.metricsSystem.reset();
  }

  // 🔄 ============ SHUTDOWN ============
  async shutdown() {
    this.stopProcessing();

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.eventSystem.emit("engine:shutdown");
    this.eventSystem.clear();
  }
}

module.exports = DeckEngine;
