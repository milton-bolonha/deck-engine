/**
 * 🤖 AI Workspace Configuration
 * Configuração central para todos os componentes da workspace .ai
 */

export default {
  // ============ GENERAL CONFIG ============
  version: "1.0.0",
  workspace: ".ai",

  // ============ SYSTEM TARGETS ============
  targets: {
    dashboard: {
      url: "http://localhost:3001",
      selectors: {
        healthCard: '[class*="SystemHealthCard"]',
        liveMatches: '[class*="LiveMatchesCard"]',
        connectionStatus: '[class*="connection"]',
        loadingOverlay: '[class*="LoadingOverlay"]',
      },
    },
    api: {
      baseUrl: "http://localhost:3000/api",
      endpoints: {
        health: "/system/health",
        healthDetailed: "/system/health/detailed",
        status: "/system/status",
        metrics: "/system/metrics",
      },
    },
    socket: {
      url: "http://localhost:3000",
      events: [
        "match:started",
        "match:completed",
        "match:error",
        "system:health",
      ],
    },
  },

  // ============ VISUAL INTELLIGENCE CONFIG ============
  visual: {
    screenshot: {
      interval: "*/10 * * * *", // Every 10 minutes
      path: "outputs/screenshots",
      options: {
        fullPage: true,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      },
    },
    regression: {
      threshold: 0.05, // 5% difference triggers alert
      compareRegions: [
        { name: "header", selector: ".h-16" },
        { name: "sidebar", selector: ".w-64" },
        { name: "content", selector: ".flex-1" },
        { name: "health-card", selector: '[class*="SystemHealthCard"]' },
      ],
    },
  },

  // ============ INTELLIGENCE CONFIG ============
  intelligence: {
    patterns: {
      errorAnalysis: {
        timeWindow: "24h",
        minOccurrences: 3,
        categories: [
          "DECK_NOT_FOUND",
          "MATCH_FAILED",
          "RATE_LIMIT",
          "AUTH_FAILED",
          "INTERNAL",
        ],
      },
      performance: {
        metrics: ["memory", "cpu", "uptime", "responseTime"],
        alertThresholds: {
          memory: 85, // %
          cpu: 80, // %
          responseTime: 2000, // ms
        },
      },
    },
    prediction: {
      models: {
        healthDegradation: {
          algorithm: "linear-regression",
          features: ["memory_trend", "error_rate", "response_time"],
        },
      },
    },
  },

  // ============ AUTOMATION CONFIG ============
  automation: {
    monitoring: {
      healthCheck: {
        interval: "*/5 * * * *", // Every 5 minutes
        timeout: 30000,
        retries: 3,
      },
      socketEvents: {
        reconnectDelay: 5000,
        maxReconnects: 10,
      },
    },
    cleanup: {
      screenshots: {
        maxAge: "7d", // Keep 7 days
        maxCount: 1000,
      },
      logs: {
        maxAge: "30d", // Keep 30 days
        maxSize: "100MB",
      },
    },
  },

  // ============ CURSOR INTEGRATION CONFIG ============
  cursor: {
    commands: {
      prefix: "@ai",
      timeout: 30000,
      outputFormat: "markdown",
    },
    templates: {
      healthInsight: {
        includeHistory: true,
        timeRange: "24h",
        includePredictons: true,
      },
      errorAnalysis: {
        groupBy: "type",
        includeStackTrace: false,
        suggestFixes: true,
      },
    },
  },

  // ============ LOGGING CONFIG ============
  logging: {
    level: "info",
    format: "json",
    outputs: {
      console: true,
      file: {
        enabled: true,
        path: "outputs/logs",
        maxSize: "10MB",
        maxFiles: 5,
      },
    },
    structured: {
      timestamp: true,
      requestId: true,
      userId: false,
      performance: true,
    },
  },

  // ============ ALERTS CONFIG ============
  alerts: {
    channels: ["console", "file"],
    levels: {
      info: { color: "blue", icon: "ℹ️" },
      warn: { color: "yellow", icon: "⚠️" },
      error: { color: "red", icon: "❌" },
      success: { color: "green", icon: "✅" },
    },
    rules: {
      visualRegression: {
        threshold: 0.1,
        level: "warn",
        message: "Visual regression detected",
      },
      healthDegradation: {
        threshold: "degraded",
        level: "error",
        message: "System health degraded",
      },
      predictionAlert: {
        confidence: 0.8,
        level: "warn",
        message: "Predicted issue detected",
      },
    },
  },
};
