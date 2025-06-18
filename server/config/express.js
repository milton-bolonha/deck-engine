/**
 * 🚀 Express Configuration
 * Setup principal do servidor Express para DeckEngine API
 */

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Middlewares customizados
const { requestLogger } = require("../middlewares/request-logger");

/**
 * Configura e retorna instância do Express
 */
function setupExpress() {
  const app = express();

  // ====================
  // SECURITY & PERFORMANCE
  // ====================
  app.use(
    helmet({
      contentSecurityPolicy: false, // Para Swagger UI
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(compression());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    })
  );

  // Body parsing
  app.use(
    express.json({
      limit: process.env.JSON_LIMIT || "10mb",
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: process.env.URL_LIMIT || "10mb",
    })
  );

  // ====================
  // RATE LIMITING
  // ====================

  // Rate limit global
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: process.env.RATE_LIMIT_GLOBAL || 1000,
    message: {
      error: "Rate limit exceeded",
      retryAfter: "15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", globalLimiter);

  // Rate limit específico para execuções
  const executionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: process.env.RATE_LIMIT_EXECUTION || 50,
    message: {
      error: "Execution rate limit exceeded",
      retryAfter: "1 minute",
    },
  });
  app.use("/api/matches", executionLimiter);
  app.use("/api/decks/*/execute", executionLimiter);

  // ====================
  // LOGGING & MONITORING
  // ====================
  app.use(requestLogger);

  // ====================
  // AUTHENTICATION (Preparado para Fase 2)
  // ====================
  // app.use("/api/admin", authMiddleware.requireAdmin);
  // app.use("/api/users", authMiddleware.requireAuth);

  return app;
}

module.exports = setupExpress;
