"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function AutomationContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Automation Suite
            <i className="fas fa-robot text-blue-500 ml-2"></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Automação inteligente de processos e workflows
          </p>
        </div>

        <button className="btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Nova Automação
        </button>
      </div>

      {/* Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Active Rules
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                23
              </p>
            </div>
            <i className="fas fa-cogs text-2xl text-blue-500"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tasks Automated
              </p>
              <p className="text-2xl font-bold text-victory">1,247</p>
            </div>
            <i className="fas fa-robot text-2xl text-victory"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Time Saved
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                84h
              </p>
            </div>
            <i className="fas fa-clock text-2xl text-green-500"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-victory">97.3%</p>
            </div>
            <i className="fas fa-check-circle text-2xl text-victory"></i>
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Regras de Automação Ativas
        </h2>

        <div className="space-y-4">
          {[
            {
              name: "Auto-scale Pipeline Resources",
              trigger: "High CPU usage > 80%",
              action: "Scale up workers",
              status: "active",
              executions: 23,
            },
            {
              name: "Failed Payment Recovery",
              trigger: "Payment failed",
              action: "Send reminder email + retry",
              status: "active",
              executions: 12,
            },
            {
              name: "User Onboarding Flow",
              trigger: "New user signup",
              action: "Welcome email + setup guide",
              status: "active",
              executions: 156,
            },
          ].map((rule, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {rule.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-medium">Trigger:</span> {rule.trigger}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium">Action:</span> {rule.action}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {rule.executions} exec
                    </p>
                    <span
                      className={`status-indicator ${
                        rule.status === "active"
                          ? "status-online"
                          : "status-offline"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 text-sm">
                      <i className="fas fa-pause"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="gaming-card p-6 text-center">
          <i className="fas fa-magic text-3xl text-purple-500 mb-3"></i>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Smart Triggers
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Crie triggers inteligentes baseados em ML
          </p>
          <button className="btn-primary text-sm w-full">
            Create Smart Trigger
          </button>
        </div>

        <div className="gaming-card p-6 text-center">
          <i className="fas fa-workflow text-3xl text-blue-500 mb-3"></i>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Workflow Builder
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Monte workflows complexos visualmente
          </p>
          <button className="btn-primary text-sm w-full">Build Workflow</button>
        </div>

        <div className="gaming-card p-6 text-center">
          <i className="fas fa-chart-bar text-3xl text-green-500 mb-3"></i>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Automation Analytics
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Analise performance das automações
          </p>
          <button className="btn-primary text-sm w-full">View Analytics</button>
        </div>
      </div>
    </div>
  );
}
