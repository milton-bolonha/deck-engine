/**
 * ⚔️ Match Routes
 * Rotas para execução de matches
 */

const express = require("express");
const router = express.Router();

// Importar handlers
const {
  executeMatch,
  executeBatch,
  getMatch,
  cancelMatch,
  retryMatch,
} = require("../handlers/matches");

// Rotas de execução
router.post("/", executeMatch);
router.post("/batch", executeBatch);

// Rotas de gerenciamento
router.get("/:matchId", getMatch);
router.delete("/:matchId", cancelMatch);
router.post("/:matchId/retry", retryMatch);

module.exports = router;
