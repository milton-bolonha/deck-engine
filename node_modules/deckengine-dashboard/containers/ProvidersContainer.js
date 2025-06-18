"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function ProvidersContainer() {
  const { state, actions } = useDashboard();

  const providerTypes = {
    auth: {
      name: "Authentication",
      icon: "fas fa-shield-alt",
      description: "Gerencie autenticação de usuários",
      current: state.providers.auth.type,
      connected: state.providers.auth.connected,
      options: ["clerk", "auth0", "custom", "none"],
    },
    payment: {
      name: "Payment Processing",
      icon: "fas fa-credit-card",
      description: "Configure processamento de pagamentos",
      current: state.providers.payment.type,
      connected: state.providers.payment.connected,
      options: ["stripe", "paypal", "custom", "none"],
    },
    storage: {
      name: "Data Storage",
      icon: "fas fa-database",
      description: "Configure armazenamento de dados",
      current: state.providers.storage.type,
      connected: state.providers.storage.connected,
      options: ["mongodb", "json", "memory"],
    },
    media: {
      name: "Media Storage",
      icon: "fas fa-images",
      description: "Configure armazenamento de mídia",
      current: state.providers.media.type,
      connected: state.providers.media.connected,
      options: ["cloudinary", "aws-s3", "custom", "none"],
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Provider Configuration
            <i className="fas fa-plug text-blue-500 ml-2"></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure integrações com serviços externos
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connected
          </p>
          <p className="text-2xl font-bold text-victory">
            {Object.values(providerTypes).filter((p) => p.connected).length}/
            {Object.values(providerTypes).length}
          </p>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(providerTypes).map(([key, provider]) => (
          <div
            key={key}
            className={`gaming-card p-6 transition-all ${
              provider.connected ? "ring-2 ring-victory/20" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    provider.connected
                      ? "bg-victory/10"
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  <i
                    className={`${provider.icon} text-xl ${
                      provider.connected ? "text-victory" : "text-slate-500"
                    }`}
                  ></i>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {provider.description}
                  </p>
                </div>
              </div>

              <span
                className={`status-indicator ${
                  provider.connected ? "status-online" : "status-offline"
                }`}
              >
                {provider.connected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current Provider
                </label>
                <p className="text-slate-900 dark:text-slate-100 capitalize">
                  {provider.current === "none"
                    ? "Not configured"
                    : provider.current}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    actions.setRightSidebar({
                      type: "provider-config",
                      data: { provider: key },
                    })
                  }
                  className="btn-primary text-sm flex-1"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Configure
                </button>

                {provider.connected && (
                  <button className="text-slate-400 hover:text-slate-600 text-sm px-3 py-2">
                    <i className="fas fa-plug"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Setup Guide */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-rocket mr-2"></i>
          Quick Setup Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              🚀 Desenvolvimento Rápido
            </h3>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Storage:</strong> Use memory (padrão)
              </li>
              <li>
                • <strong>Auth:</strong> Desabilitado (devMode)
              </li>
              <li>
                • <strong>Payment:</strong> Mock data
              </li>
              <li>
                • <strong>Media:</strong> Local storage
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              🏢 Produção Enterprise
            </h3>
            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <li>
                • <strong>Storage:</strong> MongoDB cluster
              </li>
              <li>
                • <strong>Auth:</strong> Clerk ou Auth0
              </li>
              <li>
                • <strong>Payment:</strong> Stripe production
              </li>
              <li>
                • <strong>Media:</strong> Cloudinary ou S3
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Environment Status */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-server mr-2"></i>
          Environment Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <i className="fas fa-code text-2xl text-blue-500 mb-2"></i>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Development
            </p>
            <span className="status-online text-xs">Active</span>
          </div>

          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <i className="fas fa-vial text-2xl text-yellow-500 mb-2"></i>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Staging
            </p>
            <span className="status-offline text-xs">Not configured</span>
          </div>

          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <i className="fas fa-rocket text-2xl text-green-500 mb-2"></i>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Production
            </p>
            <span className="status-offline text-xs">Not configured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
