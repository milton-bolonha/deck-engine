"use client";

export default function PipelinePerformanceChart({ data }) {
  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-chart-line text-blue-500 mr-2"></i>
          Pipeline Performance
        </h2>
        <select className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Placeholder for chart */}
      <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-chart-line text-4xl text-slate-300 dark:text-slate-600 mb-3"></i>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            Performance Chart
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Real chart will be implemented with Recharts
          </p>
        </div>
      </div>

      {/* Summary stats below chart */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Avg Response
          </p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            1.2s
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Success Rate
          </p>
          <p className="text-lg font-semibold text-victory">94.7%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Runs
          </p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            1,247
          </p>
        </div>
      </div>
    </div>
  );
}
