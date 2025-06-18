"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function AddonsContainer() {
  const { state } = useDashboard();

  const addonCategories = {
    ui: {
      name: "UI Components",
      icon: "fas fa-palette",
      addons: [
        {
          id: "calendar",
          name: "Calendar Widget",
          price: 19,
          installed: false,
        },
        { id: "charts", name: "Advanced Charts", price: 29, installed: true },
        { id: "forms", name: "Form Builder Pro", price: 39, installed: false },
      ],
    },
    features: {
      name: "Feature Packs",
      icon: "fas fa-star",
      addons: [
        {
          id: "analytics_pro",
          name: "Analytics Pro",
          price: 99,
          installed: false,
        },
        {
          id: "automation",
          name: "Automation Suite",
          price: 149,
          installed: true,
        },
        {
          id: "ai_insights",
          name: "AI Insights",
          price: 199,
          installed: false,
        },
      ],
    },
    integrations: {
      name: "Integrations",
      icon: "fas fa-plug",
      addons: [
        { id: "slack", name: "Slack Integration", price: 15, installed: true },
        { id: "teams", name: "Microsoft Teams", price: 15, installed: false },
        { id: "discord", name: "Discord Bot", price: 25, installed: false },
      ],
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Addons Store
            <i className="fas fa-shopping-bag text-purple-500 ml-2"></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Expanda suas funcionalidades com addons premium
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Instalados
          </p>
          <p className="text-2xl font-bold text-victory">
            {Object.values(addonCategories).reduce(
              (acc, cat) =>
                acc + cat.addons.filter((addon) => addon.installed).length,
              0
            )}
          </p>
        </div>
      </div>

      {/* Categories */}
      {Object.entries(addonCategories).map(([key, category]) => (
        <div key={key} className="gaming-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              <i className={`${category.icon} mr-2`}></i>
              {category.name}
            </h2>

            <span className="text-sm text-slate-500 dark:text-slate-400">
              {category.addons.length} addons
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.addons.map((addon) => (
              <div
                key={addon.id}
                className={`p-4 border rounded-lg transition-all ${
                  addon.installed
                    ? "border-victory bg-green-50 dark:bg-green-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-primary-300"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {addon.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Premium addon
                    </p>
                  </div>

                  {addon.installed && (
                    <span className="status-online text-xs">Instalado</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    R$ {addon.price}
                    <span className="text-sm font-normal text-slate-500">
                      /mês
                    </span>
                  </span>

                  <button
                    className={`text-sm px-3 py-1 rounded ${
                      addon.installed
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        : "btn-primary"
                    }`}
                    disabled={addon.installed}
                  >
                    {addon.installed ? "Instalado" : "Instalar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* My Addons */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-puzzle-piece mr-2"></i>
          Meus Addons
        </h2>

        <div className="space-y-3">
          {Object.values(addonCategories)
            .flatMap((cat) => cat.addons)
            .filter((addon) => addon.installed)
            .map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {addon.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Ativo - R$ {addon.price}/mês
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">
                    <i className="fas fa-cog mr-1"></i>
                    Config
                  </button>
                  <button className="text-red-500 hover:text-red-700 text-sm">
                    <i className="fas fa-trash mr-1"></i>
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Billing Summary */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-receipt mr-2"></i>
          Resumo de Cobrança
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              Plano Base
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              R$ 79/mês
            </span>
          </div>

          {Object.values(addonCategories)
            .flatMap((cat) => cat.addons)
            .filter((addon) => addon.installed)
            .map((addon) => (
              <div key={addon.id} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {addon.name}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  R$ {addon.price}/mês
                </span>
              </div>
            ))}

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Total Mensal
              </span>
              <span className="text-xl font-bold text-victory">
                R${" "}
                {79 +
                  Object.values(addonCategories)
                    .flatMap((cat) => cat.addons)
                    .filter((addon) => addon.installed)
                    .reduce((acc, addon) => acc + addon.price, 0)}
                /mês
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
