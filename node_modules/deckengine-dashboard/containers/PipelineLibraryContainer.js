"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function PipelineLibraryContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Pipeline Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Biblioteca de templates e pipelines salvos
          </p>
        </div>

        <button
          onClick={() => {
            // Set creating mode
          }}
          className="btn-primary"
        >
          <i className="fas fa-plus mr-2"></i>
          Novo Template
        </button>
      </div>

      {/* Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="gaming-card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {pipeline.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {pipeline.description}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  pipeline.type === "user-management"
                    ? "bg-blue-100 text-blue-800"
                    : pipeline.type === "billing"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {pipeline.type}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <span>
                  <i className="fas fa-play mr-1"></i>
                  {pipeline.metrics?.totalRuns || 0}
                </span>
                <span>
                  <i className="fas fa-check mr-1"></i>
                  {((pipeline.metrics?.successRate || 0) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="text-slate-400 hover:text-slate-600 text-sm">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-slate-400 hover:text-slate-600 text-sm">
                  <i className="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {state.pipelines.length === 0 && (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-file-code text-4xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <p className="text-slate-500 dark:text-slate-400">
              Nenhum pipeline salvo ainda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
