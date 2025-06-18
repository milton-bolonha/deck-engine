"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function AnalyticsProContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Advanced Analytics
            <i
              className="fas fa-crown text-gaming-gold ml-2"
              title="Premium Feature"
            ></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Analytics avançados com IA e machine learning
          </p>
        </div>

        <div className="bg-gradient-gaming text-white px-4 py-2 rounded-lg text-sm">
          <i className="fas fa-star mr-2"></i>
          Pro Analytics
        </div>
      </div>

      {/* Pro Analytics Content */}
      <div className="gaming-card p-8 text-center">
        <i className="fas fa-chart-pie text-6xl text-gaming-gold mb-4"></i>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Advanced Analytics Pro
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Desbloqueie insights avançados com machine learning e previsões IA
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="text-left">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Features Incluídas:
            </h3>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <i className="fas fa-check text-victory mr-2"></i>Predictive
                Analytics
              </li>
              <li>
                <i className="fas fa-check text-victory mr-2"></i>ML-powered
                Insights
              </li>
              <li>
                <i className="fas fa-check text-victory mr-2"></i>Custom
                Dashboards
              </li>
              <li>
                <i className="fas fa-check text-victory mr-2"></i>Advanced
                Reporting
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Benefícios:
            </h3>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <i className="fas fa-check text-victory mr-2"></i>Reduz erros em
                40%
              </li>
              <li>
                <i className="fas fa-check text-victory mr-2"></i>Melhora
                performance
              </li>
              <li>
                <i className="fas fa-check text-victory mr-2"></i>Insights
                preditivos
              </li>
              <li>
                <i className="fas fa-check text-victory mr-2"></i>ROI tracking
              </li>
            </ul>
          </div>
        </div>

        <button className="btn-gaming-gold">
          <i className="fas fa-crown mr-2"></i>
          Upgrade para Pro Analytics - R$ 99/mês
        </button>
      </div>
    </div>
  );
}
