"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function DevToolsContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Development Tools
            <i className="fas fa-code text-blue-500 ml-2"></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Ferramentas de debug e desenvolvimento
          </p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-lg text-sm">
          <i className="fas fa-warning mr-2"></i>
          DevMode Only
        </div>
      </div>

      {/* Debug Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="gaming-card p-6 text-center">
          <i className="fas fa-bug text-4xl text-red-500 mb-4"></i>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Pipeline Debugger
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Debug pipelines step-by-step em tempo real
          </p>
          <button className="btn-primary text-sm w-full">
            <i className="fas fa-play mr-2"></i>
            Start Debugger
          </button>
        </div>

        <div className="gaming-card p-6 text-center">
          <i className="fas fa-terminal text-4xl text-green-500 mb-4"></i>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            API Console
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Teste endpoints da API diretamente
          </p>
          <button className="btn-primary text-sm w-full">
            <i className="fas fa-terminal mr-2"></i>
            Open Console
          </button>
        </div>

        <div className="gaming-card p-6 text-center">
          <i className="fas fa-database text-4xl text-purple-500 mb-4"></i>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            State Inspector
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Inspecione estado global do dashboard
          </p>
          <button className="btn-primary text-sm w-full">
            <i className="fas fa-search mr-2"></i>
            Inspect State
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-info-circle mr-2"></i>
          System Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Dashboard Version
            </h3>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              v1.0.0
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              API Connection
            </h3>
            <p
              className={`text-lg font-bold ${
                state.isConnected ? "text-victory" : "text-defeat"
              }`}
            >
              {state.isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              WebSocket Status
            </h3>
            <p
              className={`text-lg font-bold ${
                state.isConnected ? "text-victory" : "text-defeat"
              }`}
            >
              {state.isConnected ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              DevMode
            </h3>
            <p className="text-lg font-bold text-blue-500">
              {state.devMode ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      <div className="gaming-card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              <i className="fas fa-terminal mr-2"></i>
              Debug Console
            </h2>

            <div className="flex items-center space-x-2">
              <button className="text-slate-400 hover:text-slate-600 text-sm">
                <i className="fas fa-broom mr-1"></i>
                Clear
              </button>
              <button className="text-slate-400 hover:text-slate-600 text-sm">
                <i className="fas fa-download mr-1"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="h-64 bg-slate-900 text-green-400 font-mono text-sm p-4 overflow-auto">
          <div className="space-y-1">
            <div className="text-blue-400">[INFO] Dashboard initialized</div>
            <div className="text-green-400">
              [SUCCESS] Connected to DeckEngine API
            </div>
            <div className="text-green-400">
              [SUCCESS] WebSocket connection established
            </div>
            <div className="text-blue-400">
              [DEBUG] Loaded {state.pipelines.length} pipelines
            </div>
            <div className="text-blue-400">
              [DEBUG] {state.activeMatches.length} active matches
            </div>
            <div className="text-yellow-400">
              [WARN] DevMode is active - some features are mocked
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gaming-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            <i className="fas fa-tools mr-2"></i>
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Reset All Data
                </span>
                <i className="fas fa-undo text-slate-400"></i>
              </div>
            </button>

            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Generate Test Data
                </span>
                <i className="fas fa-database text-slate-400"></i>
              </div>
            </button>

            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Export Dashboard State
                </span>
                <i className="fas fa-file-export text-slate-400"></i>
              </div>
            </button>

            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Toggle Dark Mode
                </span>
                <i className="fas fa-moon text-slate-400"></i>
              </div>
            </button>
          </div>
        </div>

        <div className="gaming-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            <i className="fas fa-chart-line mr-2"></i>
            Performance Metrics
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Memory Usage
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                45.2 MB
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Render Time
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                127ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                API Calls
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                12
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                WebSocket Messages
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                34
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
