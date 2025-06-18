/**
 * 🎯 Main Router
 * Router principal que organiza todas as rotas
 */

const express = require("express");
const router = express.Router();

// Importar routers
const deckRoutes = require("./decks");
const matchRoutes = require("./matches");
const systemRoutes = require("./system");

// Definir rotas
router.use("/decks", deckRoutes);
router.use("/matches", matchRoutes);
router.use("/system", systemRoutes);

// Rota de informações da API
router.get("/", (req, res) => {
  res.json({
    message: "🎮 PipesNow DeckEngine API",
    version: "2.0.0",
    documentation: "/api/docs",
    endpoints: {
      health: "/api/system/health",
      decks: "/api/decks",
      matches: "/api/matches",
      system: "/api/system",
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
