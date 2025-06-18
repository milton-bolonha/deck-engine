"use client";

import { useDashboard } from "../../contexts/DashboardContext";

export default function LiveMatchesCard({ matches }) {
  const { actions } = useDashboard();

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-bolt text-victory mr-2"></i>
          Live Matches
        </h2>
        <span
          className={`status-indicator ${
            matches.length > 0 ? "status-running" : "status-offline"
          }`}
        >
          {matches.length} active
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-bolt text-4xl text-slate-300 dark:text-slate-600 mb-3"></i>
          <p className="text-slate-500 dark:text-slate-400 mb-3">
            No active executions
          </p>
          <button
            onClick={() => actions.setSelectedSection("pipelines")}
            className="text-primary-500 hover:text-primary-700 text-sm"
          >
            Create a pipeline to get started
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.slice(0, 3).map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              onClick={() => actions.setSelectedMatch(match)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-victory rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {match.deckName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Started {new Date(match.startedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="status-running text-xs">{match.status}</span>
              </div>
            </div>
          ))}

          {matches.length > 3 && (
            <button
              onClick={() => actions.setSelectedSection("execution")}
              className="w-full text-center py-2 text-primary-500 hover:text-primary-700 text-sm"
            >
              View all {matches.length} matches
            </button>
          )}
        </div>
      )}
    </div>
  );
}
