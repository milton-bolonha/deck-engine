/**
 * 🏥 System Routes
 * Rotas para operações de sistema
 */

const express = require("express");
const router = express.Router();

// Importar handlers
const {
  healthCheck,
  detailedHealthCheck,
  systemStatus,
  systemMetrics,
  systemCleanup,
  systemBackup,
} = require("../handlers/system");

// Health checks
router.get("/health", healthCheck);
router.get("/health/detailed", detailedHealthCheck);

// Status e métricas
router.get("/status", systemStatus);
router.get("/metrics", systemMetrics);

// Operações administrativas
router.post("/cleanup", systemCleanup);
router.post("/backup", systemBackup);

module.exports = router;
