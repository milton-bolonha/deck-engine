"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function AnalyticsContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Métricas detalhadas de performance e business
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select className="form-select text-sm">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
          </select>

          <button className="btn-primary text-sm">
            <i className="fas fa-download mr-2"></i>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pipeline Executions
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                1,247
              </p>
              <p className="text-xs text-victory">+15% vs last week</p>
            </div>
            <i className="fas fa-play-circle text-2xl text-blue-500"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-victory">94.7%</p>
              <p className="text-xs text-victory">+2.1% improvement</p>
            </div>
            <i className="fas fa-check-circle text-2xl text-victory"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Avg Response Time
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                1.2s
              </p>
              <p className="text-xs text-victory">-0.3s faster</p>
            </div>
            <i className="fas fa-stopwatch text-2xl text-yellow-500"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Error Rate
              </p>
              <p className="text-2xl font-bold text-defeat">2.1%</p>
              <p className="text-xs text-defeat">+0.5% increase</p>
            </div>
            <i className="fas fa-exclamation-triangle text-2xl text-defeat"></i>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trends */}
        <div className="gaming-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Execution Trends
          </h2>

          <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-center">
              <i className="fas fa-chart-line text-4xl text-slate-300 dark:text-slate-600 mb-2"></i>
              <p className="text-slate-500 dark:text-slate-400">
                Chart will be rendered here
              </p>
            </div>
          </div>
        </div>

        {/* Performance by Pipeline */}
        <div className="gaming-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Performance by Pipeline
          </h2>

          <div className="space-y-4">
            {[
              {
                name: "User Onboarding",
                executions: 423,
                success: 96.2,
                avgTime: "0.8s",
              },
              {
                name: "Email Campaign",
                executions: 312,
                success: 94.1,
                avgTime: "1.2s",
              },
              {
                name: "Data Processing",
                executions: 287,
                success: 91.5,
                avgTime: "2.1s",
              },
              {
                name: "Payment Processing",
                executions: 225,
                success: 98.7,
                avgTime: "0.5s",
              },
            ].map((pipeline) => (
              <div
                key={pipeline.name}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {pipeline.executions} executions
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-victory">
                    {pipeline.success}% success
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {pipeline.avgTime} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Detailed Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Most Active Hours
            </h3>
            <div className="space-y-2">
              {["14:00-15:00", "10:00-11:00", "16:00-17:00"].map(
                (hour, index) => (
                  <div key={hour} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {hour}
                    </span>
                    <span className="text-sm font-medium">
                      {87 - index * 12} exec
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Error Categories
            </h3>
            <div className="space-y-2">
              {["Timeout", "Validation", "Network"].map((category, index) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {category}
                  </span>
                  <span className="text-sm font-medium text-defeat">
                    {12 - index * 3}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Top Performers
            </h3>
            <div className="space-y-2">
              {["Payment Processing", "User Auth", "Email Sending"].map(
                (pipeline, index) => (
                  <div
                    key={pipeline}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {pipeline}
                    </span>
                    <span className="text-sm font-medium text-victory">
                      {99 - index}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
