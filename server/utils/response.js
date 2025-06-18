/**
 * 📤 Response Utilities
 * Utilitários para padronizar responses da API
 */

/**
 * Resposta de sucesso padronizada
 */
function successResponse(res, data, statusCode = 200, meta = {}) {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    data,
    ...meta,
  };

  // Adicionar requestId se disponível
  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(statusCode).json(response);
}

/**
 * Resposta de erro padronizada
 */
function errorResponse(res, message, statusCode = 400, details = {}) {
  const response = {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      message,
      ...details,
    },
  };

  // Adicionar requestId se disponível
  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(statusCode).json(response);
}

/**
 * Resposta paginada
 */
function paginatedResponse(res, data, pagination, statusCode = 200) {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || data.length,
      totalPages: Math.ceil(
        (pagination.total || data.length) / (pagination.limit || 10)
      ),
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
    },
  };

  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(statusCode).json(response);
}

/**
 * Resposta de validação com erros
 */
function validationErrorResponse(res, errors) {
  const response = {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      message: "Validation failed",
      type: "ValidationError",
      details: errors,
    },
  };

  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(422).json(response);
}

/**
 * Resposta para operações assíncronas
 */
function asyncResponse(res, operation, statusCode = 202) {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    operation: {
      id: operation.id,
      status: operation.status || "pending",
      message: operation.message || "Operation queued",
      checkUrl: operation.checkUrl || null,
      estimatedCompletion: operation.estimatedCompletion || null,
    },
  };

  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(statusCode).json(response);
}

/**
 * Resposta de health check
 */
function healthResponse(res, health) {
  const statusCode = health.status === "healthy" ? 200 : 503;

  const response = {
    status: health.status,
    timestamp: new Date().toISOString(),
    version: health.version,
    uptime: health.uptime,
    checks: health.checks || {},
    server: {
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
  };

  return res.status(statusCode).json(response);
}

/**
 * Resposta para métricas
 */
function metricsResponse(res, metrics, timeRange = {}) {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    metrics,
    timeRange: {
      from: timeRange.from || null,
      to: timeRange.to || null,
      period: timeRange.period || "current",
    },
  };

  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(200).json(response);
}

/**
 * Resposta para execução de deck/match
 */
function executionResponse(res, execution, statusCode = 200) {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    execution: {
      id: execution.id || execution.matchId,
      status: execution.status,
      result: execution.result || null,
      duration: execution.duration || null,
      deck: execution.deck || null,
      startedAt: execution.startedAt || null,
      completedAt: execution.completedAt || null,
      error: execution.error || null,
    },
  };

  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(statusCode).json(response);
}

/**
 * Resposta para operações em lote
 */
function batchResponse(res, results, summary = {}) {
  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    batch: {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      duration: summary.duration || null,
    },
    results,
  };

  if (res.req && res.req.requestId) {
    response.requestId = res.req.requestId;
  }

  return res.status(200).json(response);
}

/**
 * Headers de cache
 */
function addCacheHeaders(res, options = {}) {
  const {
    maxAge = 300, // 5 minutos padrão
    private = false,
    noCache = false,
  } = options;

  if (noCache) {
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
  } else {
    const cacheControl = private ? "private" : "public";
    res.set({
      "Cache-Control": `${cacheControl}, max-age=${maxAge}`,
      ETag: generateETag(res.req.originalUrl + Date.now()),
    });
  }

  return res;
}

/**
 * Gera ETag simples
 */
function generateETag(content) {
  return require("crypto")
    .createHash("md5")
    .update(content.toString())
    .digest("hex");
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
  asyncResponse,
  healthResponse,
  metricsResponse,
  executionResponse,
  batchResponse,
  addCacheHeaders,
};
