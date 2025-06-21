"use client";

export default function PipelineDetails({ pipeline }) {
  if (!pipeline) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No pipeline selected
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {pipeline.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {pipeline.description || "No description available"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Configuration
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Type:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {pipeline.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Concurrency:
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {pipeline.config?.concurrency || 3}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Timeout:
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {pipeline.config?.timeout || 30000}ms
              </span>
            </div>
          </div>
        </div>

        {pipeline.metrics && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Performance
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Total Runs:
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {pipeline.metrics.totalRuns}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Success Rate:
                </span>
                <span className="font-medium text-victory">
                  {(pipeline.metrics.successRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Avg Time:
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {pipeline.metrics.avgExecutionTime}ms
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button className="btn-primary w-full text-sm">
          <i className="fas fa-edit mr-2"></i>
          Edit Pipeline
        </button>
        <button className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm p-2 border border-slate-300 dark:border-slate-600 rounded transition-colors">
          <i className="fas fa-play mr-2"></i>
          Execute Pipeline
        </button>
      </div>
    </div>
  );
}
