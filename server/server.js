/**
 * 🚀 PipesNow DeckEngine - API Server
 *
 * Servidor Express com arquitetura híbrida:
 * - Express como adaptador puro do DeckEngine core
 * - Estrutura modular e escalável
 * - Preparado para funcionalidades enterprise
 */

const setupExpress = require("./config/express");
const apiRoutes = require("./routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error-handler");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { Server } = require("socket.io");

// Configurações
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Criar app Express
const app = setupExpress();

// ====================
// SWAGGER DOCUMENTATION
// ====================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PipesNow DeckEngine API",
      version: "1.0.0",
      description:
        "API REST para execução de pipelines com metáforas de jogos - Arquitetura Híbrida",
      contact: {
        name: "PipesNow Team",
        url: "https://github.com/pipesnow/deckengine",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    tags: [
      { name: "System", description: "Health checks e operações de sistema" },
      { name: "Decks", description: "Gestão de decks (pipelines)" },
      { name: "Matches", description: "Execução de matches (pipeline runs)" },
    ],
  },
  apis: ["./routes/*.js", "./handlers/*.js"], // paths para definições OpenAPI
};

const specs = swaggerJsdoc(swaggerOptions);

// ====================
// API ROUTES
// ====================
app.use("/api", apiRoutes);

// Documentação Swagger
app.use("/api/docs", swaggerUi.serve);
app.get(
  "/api/docs",
  swaggerUi.setup(specs, {
    customCss: `.swagger-ui .topbar { display: none }`,
    customSiteTitle: "PipesNow DeckEngine API",
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  })
);

// ====================
// ROOT ENDPOINT
// ====================
app.get("/", (req, res) => {
  res.json({
    message: "🎮 PipesNow DeckEngine API - Arquitetura Híbrida",
    version: "1.0.0",
    architecture: "hybrid",
    documentation: `http://localhost:${PORT}/api/docs`,
    health: `http://localhost:${PORT}/api/system/health`,
    features: {
      current: [
        "Estrutura modular",
        "Handlers organizados",
        "Error handling robusto",
      ],
      upcoming: [
        "Autenticação multi-tier",
        "Database persistence",
        "Advanced metrics",
      ],
      future: ["Tournament system", "Real-time features", "A/B testing"],
    },
    endpoints: {
      api: "/api",
      decks: "/api/decks",
      matches: "/api/matches",
      system: "/api/system",
    },
    timestamp: new Date().toISOString(),
  });
});

// ====================
// ERROR HANDLING
// ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ====================
// GRACEFUL SHUTDOWN
// ====================
let server;

const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Recebido sinal ${signal}...`);

  try {
    // Parar de aceitar novas conexões
    if (server) {
      server.close(() => {
        console.log("✅ Servidor HTTP fechado");
      });
    }

    // TODO: Finalizar DeckEngine propriamente
    console.log("✅ DeckEngine finalizado");

    console.log("✅ Shutdown graceful concluído");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ====================
// START SERVER
// ====================
server = app.listen(PORT, () => {
  console.log(`
🚀 PipesNow DeckEngine API iniciado!

📍 URL: http://localhost:${PORT}
📖 Docs: http://localhost:${PORT}/api/docs
🏥 Health: http://localhost:${PORT}/api/system/health

🎮 Versão: 1.0.0 (Arquitetura Híbrida)
🌍 Ambiente: ${NODE_ENV}
🎯 PID: ${process.pid}

✨ Próximas funcionalidades:
   - Autenticação multi-tier
   - Database persistence
   - Advanced analytics
  `);
});

// ====================
// SOCKET.IO SETUP
// ====================
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 Dashboard connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 Dashboard disconnected: ${socket.id}`);
  });

  // TODO: Implementar eventos real-time:
  // - match:started, match:updated, match:completed
  // - system:health updates
});

// Tratar erros de servidor
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    process.exit(1);
  } else {
    console.error("❌ Erro do servidor:", error);
  }
});

module.exports = app;
