/**
 * 🎮 Deck Routes
 * Rotas para operações de decks
 */

const express = require("express");
const router = express.Router();

// Importar handlers
const {
  listDecks,
  createDeck,
  getDeck,
  deleteDeck,
  validateDeck,
} = require("../handlers/decks");

// Rotas básicas
router.get("/", listDecks);
router.post("/", createDeck);
router.get("/:name", getDeck);
router.delete("/:name", deleteDeck);

// Funcionalidades avançadas
router.post("/:name/validate", validateDeck);

module.exports = router;
