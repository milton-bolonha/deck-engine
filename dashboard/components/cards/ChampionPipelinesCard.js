"use client";

export default function ChampionPipelinesCard({ pipelines }) {
  // Sort pipelines by success rate and total runs
  const championPipelines = pipelines
    .filter((p) => p.metrics)
    .sort((a, b) => {
      const scoreA =
        a.metrics.successRate * 0.7 + (a.metrics.totalRuns * 0.3) / 1000;
      const scoreB =
        b.metrics.successRate * 0.7 + (b.metrics.totalRuns * 0.3) / 1000;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-trophy text-gaming-gold mr-2"></i>
          Champion Pipelines
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Top performers
        </span>
      </div>

      {championPipelines.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-trophy text-4xl text-slate-300 dark:text-slate-600 mb-3"></i>
          <p className="text-slate-500 dark:text-slate-400">
            No pipeline data available yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {championPipelines.map((pipeline, index) => (
            <div
              key={pipeline.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0
                      ? "bg-gaming-gold"
                      : index === 1
                      ? "bg-gaming-silver"
                      : index === 2
                      ? "bg-gaming-bronze"
                      : "bg-slate-400"
                  }`}
                >
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {pipeline.metrics.totalRuns} executions
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-victory">
                  {(pipeline.metrics.successRate * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  success rate
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
