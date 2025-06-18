/**
 * 🛡️ Authentication Middleware
 * Sistema multi-tier de autenticação
 */

const jwt = require("jsonwebtoken");
const config = require("../config/environment");

/**
 * Tipos de autenticação suportados
 */
const AUTH_TYPES = {
  API_KEY: "api_key",
  JWT: "jwt",
  ADMIN: "admin",
};

/**
 * Extrai token do header Authorization
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  // Bearer token (JWT)
  if (authHeader.startsWith("Bearer ")) {
    return { type: AUTH_TYPES.JWT, token: authHeader.substring(7) };
  }

  // API Key
  if (authHeader.startsWith("ApiKey ")) {
    return { type: AUTH_TYPES.API_KEY, token: authHeader.substring(7) };
  }

  // Admin token
  if (authHeader.startsWith("Admin ")) {
    return { type: AUTH_TYPES.ADMIN, token: authHeader.substring(6) };
  }

  return null;
}

/**
 * Valida API Key (Fase 2 - implementação completa)
 */
async function validateApiKey(apiKey) {
  // TODO: Implementar validação em banco de dados na Fase 2

  // Por enquanto, validação simples
  if (!apiKey.startsWith(config.security.apiKeyPrefix)) {
    return { valid: false, reason: "Invalid API key format" };
  }

  return {
    valid: true,
    user: {
      id: "api_user",
      type: "api",
      permissions: ["basic"],
    },
  };
}

/**
 * Valida JWT Token (Fase 2 - implementação completa)
 */
async function validateJWT(token) {
  try {
    const decoded = jwt.verify(token, config.security.jwtSecret);

    // TODO: Verificar se usuário ainda existe no banco na Fase 2

    return {
      valid: true,
      user: {
        id: decoded.sub,
        email: decoded.email,
        type: "user",
        permissions: decoded.permissions || ["basic"],
      },
    };
  } catch (error) {
    return {
      valid: false,
      reason: error.message,
    };
  }
}

/**
 * Valida Admin Token (Fase 2 - implementação completa)
 */
async function validateAdminToken(token) {
  // TODO: Implementar validação de admin token segura na Fase 2

  // Por enquanto, comparação simples (APENAS PARA DESENVOLVIMENTO)
  const adminToken =
    process.env.ADMIN_TOKEN || "admin-secret-change-in-production";

  if (token !== adminToken) {
    return { valid: false, reason: "Invalid admin token" };
  }

  return {
    valid: true,
    user: {
      id: "admin",
      type: "admin",
      permissions: ["admin", "all"],
    },
  };
}

/**
 * Middleware de autenticação opcional
 */
async function optionalAuth(req, res, next) {
  const tokenData = extractToken(req);

  if (!tokenData) {
    req.user = null;
    return next();
  }

  let validation;

  switch (tokenData.type) {
    case AUTH_TYPES.API_KEY:
      validation = await validateApiKey(tokenData.token);
      break;
    case AUTH_TYPES.JWT:
      validation = await validateJWT(tokenData.token);
      break;
    case AUTH_TYPES.ADMIN:
      validation = await validateAdminToken(tokenData.token);
      break;
    default:
      return next();
  }

  if (validation.valid) {
    req.user = validation.user;
    req.authType = tokenData.type;
  }

  next();
}

/**
 * Middleware de autenticação obrigatória
 */
async function requireAuth(req, res, next) {
  const tokenData = extractToken(req);

  if (!tokenData) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Provide Authorization header with valid token",
    });
  }

  let validation;

  switch (tokenData.type) {
    case AUTH_TYPES.API_KEY:
      validation = await validateApiKey(tokenData.token);
      break;
    case AUTH_TYPES.JWT:
      validation = await validateJWT(tokenData.token);
      break;
    case AUTH_TYPES.ADMIN:
      validation = await validateAdminToken(tokenData.token);
      break;
    default:
      return res.status(401).json({
        error: "Invalid authentication method",
        supported: ["Bearer", "ApiKey", "Admin"],
      });
  }

  if (!validation.valid) {
    return res.status(401).json({
      error: "Authentication failed",
      reason: validation.reason,
    });
  }

  req.user = validation.user;
  req.authType = tokenData.type;
  next();
}

/**
 * Middleware de autenticação admin obrigatória
 */
async function requireAdmin(req, res, next) {
  await requireAuth(req, res, (err) => {
    if (err) return next(err);

    if (req.user.type !== "admin") {
      return res.status(403).json({
        error: "Admin access required",
        message: "This endpoint requires admin privileges",
      });
    }

    next();
  });
}

/**
 * Middleware para verificar permissões específicas
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    await requireAuth(req, res, (err) => {
      if (err) return next(err);

      if (
        !req.user.permissions.includes(permission) &&
        !req.user.permissions.includes("all")
      ) {
        return res.status(403).json({
          error: "Insufficient permissions",
          required: permission,
          current: req.user.permissions,
        });
      }

      next();
    });
  };
}

/**
 * Gera API Key (Fase 2 - será implementado com banco)
 */
function generateApiKey() {
  const prefix = config.security.apiKeyPrefix;
  const random =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return `${prefix}${random}`;
}

/**
 * Gera JWT Token (Fase 2 - será implementado com banco)
 */
function generateJWT(payload, options = {}) {
  const defaultOptions = {
    expiresIn: "24h",
    issuer: "deckengine-api",
  };

  return jwt.sign(payload, config.security.jwtSecret, {
    ...defaultOptions,
    ...options,
  });
}

module.exports = {
  AUTH_TYPES,
  optionalAuth,
  requireAuth,
  requireAdmin,
  requirePermission,
  generateApiKey,
  generateJWT,
};
