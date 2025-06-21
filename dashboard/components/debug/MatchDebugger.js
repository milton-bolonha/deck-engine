"use client";

export default function MatchDebugger({ match }) {
  if (!match) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">No match selected</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Match Debugger
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {match.deckName}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </h4>
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
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Timeline
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-sm">
            <p className="text-slate-600 dark:text-slate-400">
              Started: {new Date(match.startedAt).toLocaleString()}
            </p>
            {match.completedAt && (
              <p className="text-slate-600 dark:text-slate-400">
                Completed: {new Date(match.completedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Debug Log
          </h4>
          <div className="bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg h-32 overflow-auto">
            <div>[INFO] Match started</div>
            <div>[DEBUG] Executing step 1</div>
            <div>[DEBUG] Executing step 2</div>
            {match.status === "completed" && (
              <div className="text-green-400">[SUCCESS] Match completed</div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="btn-primary w-full text-sm">
          <i className="fas fa-redo mr-2"></i>
          Restart Match
        </button>
        <button className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm p-2 border border-slate-300 dark:border-slate-600 rounded transition-colors">
          <i className="fas fa-download mr-2"></i>
          Export Debug Log
        </button>
      </div>
    </div>
  );
}
