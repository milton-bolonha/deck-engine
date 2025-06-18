/**
 * 🏥 System Handlers
 * Handlers para operações de sistema
 */

const DeckEngine = require("../../index.js");
const {
  successResponse,
  errorResponse,
  healthResponse,
} = require("../utils/response");
const { asyncHandler } = require("../middlewares/error-handler");

// Instância única do DeckEngine
const engine = new DeckEngine();

/**
 * GET /api/health
 * Health check básico
 */
const healthCheck = asyncHandler(async (req, res) => {
  try {
    const health = engine.healthCheck();

    healthResponse(res, {
      ...health,
      server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    healthResponse(res, {
      status: "unhealthy",
      version: "unknown",
      uptime: process.uptime(),
      error: error.message,
    });
  }
});

/**
 * GET /api/health/detailed
 * Health check detalhado
 */
const detailedHealthCheck = asyncHandler(async (req, res) => {
  try {
    const health = engine.healthCheck();
    const globalStatus = engine.getGlobalStatus();

    const checks = {
      engine: health.status === "healthy",
      memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // 500MB
      uptime: process.uptime() > 0,
      decks: globalStatus.decks.count >= 0,
    };

    const allHealthy = Object.values(checks).every((check) => check === true);

    healthResponse(res, {
      status: allHealthy ? "healthy" : "degraded",
      version: health.version,
      uptime: process.uptime(),
      checks,
      details: {
        engine: health,
        system: globalStatus,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
    });
  } catch (error) {
    healthResponse(res, {
      status: "unhealthy",
      version: "unknown",
      uptime: process.uptime(),
      error: error.message,
      checks: { engine: false },
    });
  }
});

/**
 * GET /api/system/status
 * Status completo do sistema
 */
const systemStatus = asyncHandler(async (req, res) => {
  try {
    const globalStatus = engine.getGlobalStatus();
    const health = engine.healthCheck();

    successResponse(res, {
      system: globalStatus,
      health,
      server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    errorResponse(res, `Erro ao obter status: ${error.message}`, 500);
  }
});

/**
 * GET /api/system/metrics
 * Métricas em tempo real
 */
const systemMetrics = asyncHandler(async (req, res) => {
  try {
    const globalStatus = engine.getGlobalStatus();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    // Calcular métricas básicas
    const metrics = {
      performance: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          usage: Math.round(
            (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
          ), // %
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
      },
      decks: {
        total: globalStatus.decks.count,
        active: globalStatus.decks.names.length,
        totalMatches: globalStatus.decks.names.reduce((total, name) => {
          const deckStatus = engine.getDeckStatus(name);
          return total + (deckStatus?.matches?.total || 0);
        }, 0),
      },
      server: {
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    successResponse(res, { metrics });
  } catch (error) {
    errorResponse(res, `Erro ao obter métricas: ${error.message}`, 500);
  }
});

/**
 * POST /api/system/cleanup
 * Executa limpeza do sistema
 */
const systemCleanup = asyncHandler(async (req, res) => {
  try {
    const { maxAge = 86400000 } = req.body; // 24h padrão

    const result = engine.cleanup(maxAge);

    successResponse(res, {
      cleanup: {
        executed: true,
        maxAge: `${maxAge}ms`,
        result,
        executedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    errorResponse(res, `Erro na limpeza: ${error.message}`, 500);
  }
});

/**
 * POST /api/system/backup
 * Backup das configurações
 */
const systemBackup = asyncHandler(async (req, res) => {
  try {
    const globalStatus = engine.getGlobalStatus();

    const backup = {
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      decks: globalStatus.decks.names.map((name) => ({
        name,
        status: engine.getDeckStatus(name),
      })),
      system: {
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
      },
    };

    // TODO: Implementar salvamento real do backup na Fase 2

    successResponse(res, {
      backup: {
        id: `backup-${Date.now()}`,
        size: JSON.stringify(backup).length,
        decks: backup.decks.length,
        created: backup.timestamp,
        note: "Salvamento físico será implementado na Fase 2",
      },
    });
  } catch (error) {
    errorResponse(res, `Erro no backup: ${error.message}`, 500);
  }
});

module.exports = {
  healthCheck,
  detailedHealthCheck,
  systemStatus,
  systemMetrics,
  systemCleanup,
  systemBackup,
};
