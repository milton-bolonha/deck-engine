/**
 * 🌍 Environment Configuration
 * Configurações centralizadas de ambiente
 */

const path = require("path");

// Carregar .env se existir
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

const config = {
  // ====================
  // SERVER SETTINGS
  // ====================
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    environment: process.env.NODE_ENV || "development",
    timezone: process.env.TZ || "America/Sao_Paulo",
  },

  // ====================
  // SECURITY
  // ====================
  security: {
    jwtSecret:
      process.env.JWT_SECRET || "deck-engine-secret-key-change-in-production",
    apiKeyPrefix: process.env.API_KEY_PREFIX || "deck_",
    corsOrigin: process.env.CORS_ORIGIN || "*",
    rateLimitGlobal: parseInt(process.env.RATE_LIMIT_GLOBAL) || 1000,
    rateLimitExecution: parseInt(process.env.RATE_LIMIT_EXECUTION) || 50,
  },

  // ====================
  // DATABASE (Fase 2)
  // ====================
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/deckengine",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    redis: {
      uri: process.env.REDIS_URI || "redis://localhost:6379",
      ttl: {
        deck: parseInt(process.env.CACHE_DECK_TTL) || 3600, // 1h
        match: parseInt(process.env.CACHE_MATCH_TTL) || 86400, // 24h
        metrics: parseInt(process.env.CACHE_METRICS_TTL) || 300, // 5min
      },
    },
  },

  // ====================
  // INTEGRATIONS (Fase 2)
  // ====================
  integrations: {
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    clerk: {
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
    webhook: {
      timeout: parseInt(process.env.WEBHOOK_TIMEOUT) || 30000,
      retries: parseInt(process.env.WEBHOOK_RETRIES) || 3,
    },
  },

  // ====================
  // DECKENGINE SETTINGS
  // ====================
  deckEngine: {
    version: process.env.DECK_ENGINE_VERSION || "v2",
    logging: (process.env.DECK_ENGINE_LOGGING || "console").split(","),
    concurrency: parseInt(process.env.DECK_ENGINE_CONCURRENCY) || 10,
    timeout: parseInt(process.env.DECK_ENGINE_TIMEOUT) || 300000, // 5min
    cleanup: {
      enabled: process.env.DECK_ENGINE_CLEANUP !== "false",
      interval: parseInt(process.env.DECK_ENGINE_CLEANUP_INTERVAL) || 3600000, // 1h
      maxAge: parseInt(process.env.DECK_ENGINE_CLEANUP_MAX_AGE) || 86400000, // 24h
    },
  },

  // ====================
  // MONITORING (Fase 2)
  // ====================
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === "true",
    interval: parseInt(process.env.MONITORING_INTERVAL) || 60000, // 1min
    retention:
      parseInt(process.env.MONITORING_RETENTION) || 7 * 24 * 60 * 60 * 1000, // 7 dias
  },
};

// Validação de configurações críticas
function validateConfig() {
  const required = [];

  if (config.server.environment === "production") {
    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET === config.security.jwtSecret
    ) {
      required.push("JWT_SECRET deve ser definido em produção");
    }
  }

  if (required.length > 0) {
    console.error("❌ Configurações obrigatórias faltando:");
    required.forEach((msg) => console.error(`  - ${msg}`));
    process.exit(1);
  }
}

// Auto-validar em produção
if (config.server.environment === "production") {
  validateConfig();
}

module.exports = config;
