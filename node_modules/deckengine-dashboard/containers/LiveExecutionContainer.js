"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function LiveExecutionContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Live Execution Monitor
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitore execuções de pipelines em tempo real
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              state.isConnected ? "bg-victory animate-pulse" : "bg-defeat"
            }`}
          ></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {state.activeMatches.length} execuções ativas
          </span>
        </div>
      </div>

      {/* Active Matches */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Execuções Ativas
        </h2>

        {state.activeMatches.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-bolt text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <p className="text-slate-500 dark:text-slate-400">
              Nenhuma execução ativa no momento
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
              Execute um pipeline para ver o monitoramento em tempo real
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.activeMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {match.deckName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Iniciado: {new Date(match.startedAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`status-indicator ${
                      match.status === "running"
                        ? "status-running"
                        : match.status === "completed"
                        ? "status-online"
                        : "status-offline"
                    }`}
                  >
                    {match.status}
                  </span>

                  <button
                    onClick={() => {
                      // Set match for debugging in right sidebar
                    }}
                    className="text-primary-500 hover:text-primary-700 text-sm"
                  >
                    <i className="fas fa-bug mr-1"></i>
                    Debug
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Execution History */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Histórico Recente
        </h2>

        <div className="space-y-3">
          {/* Mock execution history */}
          {[
            {
              id: 1,
              pipeline: "User Onboarding",
              status: "success",
              time: "2 min ago",
            },
            {
              id: 2,
              pipeline: "Data Processing",
              status: "error",
              time: "5 min ago",
            },
            {
              id: 3,
              pipeline: "Email Campaign",
              status: "success",
              time: "8 min ago",
            },
          ].map((execution) => (
            <div
              key={execution.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-3">
                <i
                  className={`fas ${
                    execution.status === "success"
                      ? "fa-check-circle text-victory"
                      : execution.status === "error"
                      ? "fa-times-circle text-defeat"
                      : "fa-clock text-yellow-500"
                  }`}
                ></i>
                <span className="text-slate-900 dark:text-slate-100">
                  {execution.pipeline}
                </span>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {execution.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
