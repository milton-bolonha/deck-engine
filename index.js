/**
 * DeckEngine - Sistema de Pipelines Assíncronos 🎮
 *
 * Inspirado no Hearthstone:
 * - Deck = Pipeline
 * - Card = Step
 * - Match = Execução
 * - Arena = Queue
 *
 * @version 1.0.0
 * @author DeckEngine Team
 * @license MIT
 */

const DeckEngine = require("./src/deck-engine");

// Exportações principais
module.exports = DeckEngine;

// Exportações nomeadas para uso avançado
module.exports.DeckEngine = DeckEngine;
module.exports.Deck = require("./src/deck");
module.exports.Match = require("./src/match");
module.exports.Arena = require("./src/arena");
module.exports.Events = require("./src/events");
module.exports.Metrics = require("./src/metrics");
module.exports.Utils = require("./src/utils");

// Versão para facilitar verificação
module.exports.version = require("./package.json").version;

// Exemplo de uso rápido
module.exports.createEngine = (options = {}) => {
  return new DeckEngine(options);
};

module.exports.createDeck = (name, options = {}) => {
  const Deck = require("./src/deck");
  return new Deck(name, options);
};
