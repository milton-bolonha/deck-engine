"use client";

import { useState } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { toast } from "react-hot-toast";

export default function ProviderConfig({ provider }) {
  const { state, actions } = useDashboard();
  const [activeTab, setActiveTab] = useState("auth");
  const [testingConnection, setTestingConnection] = useState(false);

  const providerTypes = {
    auth: {
      name: "Authentication",
      icon: "fas fa-shield-alt",
      options: ["clerk", "auth0", "custom", "none"],
      description: "Configure authentication provider for user management",
    },
    payment: {
      name: "Payment",
      icon: "fas fa-credit-card",
      options: ["stripe", "paypal", "custom", "none"],
      description: "Configure payment processing for billing",
    },
    storage: {
      name: "Storage",
      icon: "fas fa-database",
      options: ["mongodb", "json", "memory"],
      description: "Configure data storage backend",
    },
    media: {
      name: "Media",
      icon: "fas fa-images",
      options: ["cloudinary", "aws-s3", "custom", "none"],
      description: "Configure media storage and processing",
    },
  };

  const updateProviderConfig = (type, config) => {
    actions.updateProvider(type, config);
    toast.success(`${providerTypes[type].name} provider updated`);
  };

  const testConnection = async (type) => {
    setTestingConnection(true);
    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update connection status
      actions.updateProvider(type, { connected: true });
      toast.success(`${providerTypes[type].name} connection successful`);
    } catch (error) {
      toast.error(`${providerTypes[type].name} connection failed`);
    } finally {
      setTestingConnection(false);
    }
  };

  const renderProviderForm = (type) => {
    const providerConfig = state.providers[type];
    const providerType = providerTypes[type];

    return (
      <div className="space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Provider Type
          </label>
          <select
            value={providerConfig.type}
            onChange={(e) =>
              updateProviderConfig(type, { type: e.target.value })
            }
            className="form-select"
          >
            {providerType.options.map((option) => (
              <option key={option} value={option}>
                {option === "none"
                  ? "Disabled"
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Provider-specific configuration */}
        {providerConfig.type !== "none" && (
          <div className="space-y-4">
            {renderProviderSpecificForm(type, providerConfig)}
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                providerConfig.connected ? "bg-victory" : "bg-defeat"
              }`}
            ></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {providerConfig.connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {providerConfig.type !== "none" && (
            <button
              onClick={() => testConnection(type)}
              disabled={testingConnection}
              className="btn-primary text-sm"
            >
              {testingConnection ? (
                <>
                  <i className="fas fa-spinner animate-spin mr-2"></i>
                  Testing...
                </>
              ) : (
                <>
                  <i className="fas fa-plug mr-2"></i>
                  Test Connection
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderProviderSpecificForm = (type, config) => {
    switch (type) {
      case "auth":
        return renderAuthProviderForm(config);
      case "payment":
        return renderPaymentProviderForm(config);
      case "storage":
        return renderStorageProviderForm(config);
      case "media":
        return renderMediaProviderForm(config);
      default:
        return null;
    }
  };

  const renderAuthProviderForm = (config) => {
    switch (config.type) {
      case "clerk":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={config.publishableKey || ""}
                onChange={(e) =>
                  updateProviderConfig("auth", {
                    publishableKey: e.target.value,
                  })
                }
                placeholder="pk_test_..."
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={config.secretKey || ""}
                onChange={(e) =>
                  updateProviderConfig("auth", { secretKey: e.target.value })
                }
                placeholder="sk_test_..."
                className="form-input"
              />
            </div>
          </>
        );

      case "auth0":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Domain
              </label>
              <input
                type="text"
                value={config.domain || ""}
                onChange={(e) =>
                  updateProviderConfig("auth", { domain: e.target.value })
                }
                placeholder="your-domain.auth0.com"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={config.clientId || ""}
                onChange={(e) =>
                  updateProviderConfig("auth", { clientId: e.target.value })
                }
                placeholder="your_client_id"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={config.clientSecret || ""}
                onChange={(e) =>
                  updateProviderConfig("auth", { clientSecret: e.target.value })
                }
                placeholder="your_client_secret"
                className="form-input"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderPaymentProviderForm = (config) => {
    switch (config.type) {
      case "stripe":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={config.publishableKey || ""}
                onChange={(e) =>
                  updateProviderConfig("payment", {
                    publishableKey: e.target.value,
                  })
                }
                placeholder="pk_test_..."
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={config.secretKey || ""}
                onChange={(e) =>
                  updateProviderConfig("payment", { secretKey: e.target.value })
                }
                placeholder="sk_test_..."
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Webhook Secret
              </label>
              <input
                type="password"
                value={config.webhookSecret || ""}
                onChange={(e) =>
                  updateProviderConfig("payment", {
                    webhookSecret: e.target.value,
                  })
                }
                placeholder="whsec_..."
                className="form-input"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderStorageProviderForm = (config) => {
    switch (config.type) {
      case "mongodb":
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              MongoDB URI
            </label>
            <input
              type="text"
              value={config.uri || ""}
              onChange={(e) =>
                updateProviderConfig("storage", { uri: e.target.value })
              }
              placeholder="mongodb://localhost:27017/deckengine"
              className="form-input"
            />
          </div>
        );

      case "json":
        return (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Storage Path
            </label>
            <input
              type="text"
              value={config.path || "./data"}
              onChange={(e) =>
                updateProviderConfig("storage", { path: e.target.value })
              }
              placeholder="./data"
              className="form-input"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderMediaProviderForm = (config) => {
    switch (config.type) {
      case "cloudinary":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Cloud Name
              </label>
              <input
                type="text"
                value={config.cloudName || ""}
                onChange={(e) =>
                  updateProviderConfig("media", { cloudName: e.target.value })
                }
                placeholder="your-cloud-name"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                API Key
              </label>
              <input
                type="text"
                value={config.apiKey || ""}
                onChange={(e) =>
                  updateProviderConfig("media", { apiKey: e.target.value })
                }
                placeholder="123456789"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                API Secret
              </label>
              <input
                type="password"
                value={config.apiSecret || ""}
                onChange={(e) =>
                  updateProviderConfig("media", { apiSecret: e.target.value })
                }
                placeholder="your-api-secret"
                className="form-input"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Provider Configuration
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Configure external service providers for authentication, payments,
          storage, and media.
        </p>
      </div>

      {/* Provider Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {Object.entries(providerTypes).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm transition-colors ${
              activeTab === key
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <i className={provider.icon}></i>
            <span>{provider.name}</span>
            <div
              className={`w-2 h-2 rounded-full ${
                state.providers[key].connected ? "bg-victory" : "bg-slate-300"
              }`}
            ></div>
          </button>
        ))}
      </div>

      {/* Provider Form */}
      <div className="gaming-card p-6">
        <div className="mb-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
            {providerTypes[activeTab].name} Provider
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {providerTypes[activeTab].description}
          </p>
        </div>

        {renderProviderForm(activeTab)}
      </div>

      {/* Quick Setup Guide */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          <i className="fas fa-lightbulb mr-2"></i>
          Quick Setup Guide
        </h4>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <p>
            • Use <strong>memory</strong> storage for quick testing
          </p>
          <p>
            • Set up <strong>Stripe</strong> for payment processing
          </p>
          <p>
            • Configure <strong>Clerk</strong> for user authentication
          </p>
          <p>
            • Add <strong>Cloudinary</strong> for media handling
          </p>
        </div>
      </div>
    </div>
  );
}
