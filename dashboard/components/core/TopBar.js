"use client";

import { useDashboard } from "../../contexts/DashboardContext";

export default function TopBar() {
  const { state } = useDashboard();

  return (
    <div className="h-16 bg-white dark:bg-deck-card border-b border-gray-200 dark:border-deck-border flex items-center justify-between px-6">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-gaming rounded-lg flex items-center justify-center">
            <i className="fas fa-cubes text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold font-gaming text-slate-900 dark:text-slate-100">
              DeckEngine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              NÜktpls Dashboard
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              state.isConnected ? "bg-victory animate-pulse" : "bg-defeat"
            }`}
          ></div>
          <span
            className={`text-sm ${
              state.isConnected ? "text-victory" : "text-defeat"
            }`}
          >
            {state.isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Right Side - User Menu & System Status */}
      <div className="flex items-center space-x-4">
        {/* System Health Indicator */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              state.systemHealth.status === "healthy"
                ? "bg-victory"
                : state.systemHealth.status === "degraded"
                ? "bg-yellow-400"
                : "bg-defeat"
            }`}
          ></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            System {state.systemHealth.status || "Unknown"}
          </span>
        </div>

        {/* Active Matches Counter */}
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            <i className="fas fa-bolt mr-1"></i>
            {state.activeMatches.length} active
          </span>
        </div>

        {/* Dev Mode Indicator */}
        {state.devMode && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded text-xs font-medium">
            DEV MODE
          </div>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white text-sm"></i>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {state.user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {state.userRoles.join(", ") || "Super Admin"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
