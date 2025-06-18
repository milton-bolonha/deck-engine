/**
 * 🔍 Request Logger Middleware
 * Logging inteligente de requests HTTP
 */

const config = require("../config/environment");

/**
 * Middleware de logging de requests
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Capturar informações do request
  const logData = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    contentLength: req.get("Content-Length"),
    requestId: generateRequestId(),
  };

  // Adicionar request ID nos headers
  req.requestId = logData.requestId;
  res.setHeader("X-Request-ID", logData.requestId);

  // Log do request inicial (apenas em desenvolvimento)
  if (process.env.NODE_ENV === "development") {
    console.log(`🔄 ${logData.method} ${logData.url} [${logData.requestId}]`);
  }

  // Hook no final da response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);

    // Log da response
    const responseLog = {
      ...logData,
      status: res.statusCode,
      duration: `${duration}ms`,
      responseSize: data ? Buffer.byteLength(data) : 0,
    };

    // Console log formatado
    console.log(
      `${statusColor}${res.statusCode}${"\x1b[0m"} ${logData.method} ${
        logData.url
      } ` + `${duration}ms [${logData.requestId}]`
    );

    // Log estruturado para produção
    if (config.server.environment === "production") {
      console.log(JSON.stringify(responseLog));
    }

    // Log de requests lentos (>1s)
    if (duration > 1000) {
      console.warn(
        `⚠️  SLOW REQUEST: ${logData.method} ${logData.url} took ${duration}ms`
      );
    }

    // Log de erros
    if (res.statusCode >= 400) {
      const errorLevel = res.statusCode >= 500 ? "ERROR" : "WARN";
      console.error(
        `❌ ${errorLevel}: ${res.statusCode} ${logData.method} ${logData.url}`
      );
    }

    originalSend.call(this, data);
  };

  next();
}

/**
 * Gera ID único para o request
 */
function generateRequestId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Retorna cor ANSI baseada no status code
 */
function getStatusColor(status) {
  if (status >= 500) return "\x1b[31m"; // Vermelho
  if (status >= 400) return "\x1b[33m"; // Amarelo
  if (status >= 300) return "\x1b[36m"; // Ciano
  if (status >= 200) return "\x1b[32m"; // Verde
  return "\x1b[37m"; // Branco
}

/**
 * Middleware de log de erros não tratados
 */
function errorLogger(err, req, res, next) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    },
  };

  console.error("🚨 UNHANDLED ERROR:", JSON.stringify(errorLog, null, 2));
  next(err);
}

module.exports = {
  requestLogger,
  errorLogger,
};
