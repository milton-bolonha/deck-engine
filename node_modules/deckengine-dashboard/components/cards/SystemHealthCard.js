"use client";

export default function SystemHealthCard({ health, connected }) {
  const getHealthColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-victory";
      case "degraded":
        return "text-yellow-500";
      case "unhealthy":
        return "text-defeat";
      default:
        return "text-slate-500";
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case "healthy":
        return "fas fa-check-circle";
      case "degraded":
        return "fas fa-exclamation-triangle";
      case "unhealthy":
        return "fas fa-times-circle";
      default:
        return "fas fa-question-circle";
    }
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-heartbeat text-red-500 mr-2"></i>
          System Health
        </h2>
        <span
          className={`${getHealthColor(health.status)} ${getHealthIcon(
            health.status
          )}`}
        >
          <i className={getHealthIcon(health.status)}></i>
        </span>
      </div>

      <div className="space-y-4">
        {/* Overall Status */}
        <div className="text-center">
          <p className={`text-2xl font-bold ${getHealthColor(health.status)}`}>
            {health.status || "Unknown"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Overall system status
          </p>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              API Status
            </span>
            <span
              className={`status-indicator ${
                connected ? "status-online" : "status-offline"
              }`}
            >
              {connected ? "Online" : "Offline"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Memory Usage
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {health.memory || "45%"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              CPU Usage
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {health.cpu || "23%"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Uptime
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {health.uptime
                ? Math.floor(health.uptime / 3600) +
                  "h " +
                  Math.floor((health.uptime % 3600) / 60) +
                  "m"
                : "2h 34m"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Active Connections
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {health.connections || "42"}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`p-3 rounded-lg text-center text-sm ${
            health.status === "healthy"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : health.status === "degraded"
              ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
              : health.status === "unhealthy"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          {health.status === "healthy" && "✅ All systems operational"}
          {health.status === "degraded" && "⚠️ Some services degraded"}
          {health.status === "unhealthy" && "❌ System issues detected"}
          {!health.status && "❓ Status unknown"}
        </div>
      </div>
    </div>
  );
}
