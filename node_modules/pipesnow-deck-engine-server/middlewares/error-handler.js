/**
 * 🚨 Error Handler Middleware
 * Tratamento centralizado de erros da API
 */

const config = require("../config/environment");

/**
 * Tipos de erro conhecidos
 */
const ERROR_TYPES = {
  VALIDATION: "ValidationError",
  DECK_NOT_FOUND: "DeckNotFoundError",
  MATCH_FAILED: "MatchExecutionError",
  RATE_LIMIT: "RateLimitError",
  AUTH_FAILED: "AuthenticationError",
  PERMISSION_DENIED: "PermissionError",
  INTERNAL: "InternalServerError",
};

/**
 * Mapeia tipos de erro para status codes
 */
const ERROR_STATUS_MAP = {
  [ERROR_TYPES.VALIDATION]: 400,
  [ERROR_TYPES.DECK_NOT_FOUND]: 404,
  [ERROR_TYPES.MATCH_FAILED]: 422,
  [ERROR_TYPES.RATE_LIMIT]: 429,
  [ERROR_TYPES.AUTH_FAILED]: 401,
  [ERROR_TYPES.PERMISSION_DENIED]: 403,
  [ERROR_TYPES.INTERNAL]: 500,
};

/**
 * Detecta tipo de erro baseado na mensagem ou propriedades
 */
function detectErrorType(error) {
  // Erros do DeckEngine
  if (error.message.includes("Deck") && error.message.includes("not found")) {
    return ERROR_TYPES.DECK_NOT_FOUND;
  }

  if (
    error.message.includes("validation") ||
    error.name === "ValidationError"
  ) {
    return ERROR_TYPES.VALIDATION;
  }

  if (error.message.includes("Match execution failed")) {
    return ERROR_TYPES.MATCH_FAILED;
  }

  if (error.message.includes("Rate limit")) {
    return ERROR_TYPES.RATE_LIMIT;
  }

  if (
    error.message.includes("Authentication") ||
    error.name === "JsonWebTokenError"
  ) {
    return ERROR_TYPES.AUTH_FAILED;
  }

  if (
    error.message.includes("Permission") ||
    error.message.includes("Forbidden")
  ) {
    return ERROR_TYPES.PERMISSION_DENIED;
  }

  return ERROR_TYPES.INTERNAL;
}

/**
 * Formata erro para resposta da API
 */
function formatErrorResponse(error, req) {
  const errorType = detectErrorType(error);
  const statusCode = ERROR_STATUS_MAP[errorType] || 500;

  const baseResponse = {
    success: false,
    error: {
      type: errorType,
      message: error.message,
      timestamp: new Date().toISOString(),
      requestId: req.requestId || "unknown",
    },
  };

  // Adicionar detalhes em desenvolvimento
  if (config.server.environment === "development") {
    baseResponse.error.stack = error.stack;
    baseResponse.error.details = {
      name: error.name,
      code: error.code,
      path: req.path,
      method: req.method,
    };
  }

  // Adicionar campos específicos por tipo de erro
  switch (errorType) {
    case ERROR_TYPES.VALIDATION:
      if (error.details) {
        baseResponse.error.validation = error.details;
      }
      break;

    case ERROR_TYPES.RATE_LIMIT:
      baseResponse.error.retryAfter = error.retryAfter || "1 minute";
      break;

    case ERROR_TYPES.MATCH_FAILED:
      if (error.matchId) {
        baseResponse.error.matchId = error.matchId;
      }
      break;
  }

  return { statusCode, response: baseResponse };
}

/**
 * Middleware principal de tratamento de erros
 */
function errorHandler(error, req, res, next) {
  // Evitar duplo processamento
  if (res.headersSent) {
    return next(error);
  }

  // Log do erro
  const errorLog = {
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      body: req.body, // Cuidado: pode conter dados sensíveis
    },
  };

  // Log estruturado
  if (error.status >= 500 || !error.status) {
    console.error("🚨 SERVER ERROR:", JSON.stringify(errorLog, null, 2));
  } else {
    console.warn(
      "⚠️  CLIENT ERROR:",
      JSON.stringify(
        {
          ...errorLog,
          request: {
            // Log reduzido para erros de cliente
            method: req.method,
            url: req.originalUrl,
          },
        },
        null,
        2
      )
    );
  }

  // Formatar resposta
  const { statusCode, response } = formatErrorResponse(error, req);

  // Enviar resposta
  res.status(statusCode).json(response);
}

/**
 * Middleware para capturar 404
 */
function notFoundHandler(req, res) {
  const response = {
    success: false,
    error: {
      type: "NotFoundError",
      message: `Endpoint não encontrado: ${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString(),
      requestId: req.requestId || "unknown",
      suggestion: "Verifique a documentação em /api/docs",
    },
  };

  res.status(404).json(response);
}

/**
 * Cria erro customizado
 */
function createError(type, message, details = {}) {
  const error = new Error(message);
  error.name = type;
  error.type = type;
  Object.assign(error, details);
  return error;
}

/**
 * Wrapper para async handlers (evita try/catch em cada handler)
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  ERROR_TYPES,
  errorHandler,
  notFoundHandler,
  createError,
  asyncHandler,
};
