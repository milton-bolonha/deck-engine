"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function MetaAdminContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Meta Admin
            <i className="fas fa-crown text-gaming-gold ml-2"></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Crie e gerencie seções customizadas do dashboard
          </p>
        </div>

        <div className="bg-gradient-gaming text-white px-4 py-2 rounded-lg text-sm">
          <i className="fas fa-user-crown mr-2"></i>
          Super Admin Only
        </div>
      </div>

      {/* Meta Admin Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="gaming-card p-6 text-center">
          <i className="fas fa-plus-square text-4xl text-primary-500 mb-4"></i>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Create Section
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Crie novas seções personalizadas para o dashboard
          </p>
          <button className="btn-primary text-sm w-full">
            <i className="fas fa-plus mr-2"></i>
            New Section
          </button>
        </div>

        <div className="gaming-card p-6 text-center">
          <i className="fas fa-puzzle-piece text-4xl text-purple-500 mb-4"></i>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Component Builder
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Monte componentes customizados drag & drop
          </p>
          <button className="btn-primary text-sm w-full">
            <i className="fas fa-cubes mr-2"></i>
            Build Component
          </button>
        </div>

        <div className="gaming-card p-6 text-center">
          <i className="fas fa-users-cog text-4xl text-green-500 mb-4"></i>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Role Management
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Configure permissões e roles customizados
          </p>
          <button className="btn-primary text-sm w-full">
            <i className="fas fa-shield-alt mr-2"></i>
            Manage Roles
          </button>
        </div>
      </div>

      {/* Current Sections */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-list mr-2"></i>
          Seções Existentes
        </h2>

        <div className="space-y-3">
          {[
            {
              id: "overview",
              name: "Overview Dashboard",
              type: "core",
              editable: false,
            },
            {
              id: "pipelines",
              name: "Pipeline Builder",
              type: "core",
              editable: false,
            },
            {
              id: "execution",
              name: "Live Execution",
              type: "core",
              editable: false,
            },
            {
              id: "library",
              name: "Pipeline Library",
              type: "core",
              editable: false,
            },
            {
              id: "users",
              name: "User Management",
              type: "admin",
              editable: true,
            },
            {
              id: "billing",
              name: "Billing & Payments",
              type: "admin",
              editable: true,
            },
            {
              id: "analytics",
              name: "Analytics",
              type: "feature",
              editable: true,
            },
            {
              id: "providers",
              name: "Provider Config",
              type: "admin",
              editable: true,
            },
          ].map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    section.type === "core"
                      ? "bg-blue-500"
                      : section.type === "admin"
                      ? "bg-purple-500"
                      : "bg-green-500"
                  }`}
                ></div>

                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {section.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {section.type} section
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {section.editable ? (
                  <>
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-700 text-sm">
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                ) : (
                  <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                    Protected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gaming-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            <i className="fas fa-code mr-2"></i>
            Custom Code Injection
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Injete código personalizado para funcionalidades avançadas
          </p>

          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Custom CSS Injection
                </span>
                <i className="fas fa-chevron-right text-slate-400"></i>
              </div>
            </button>

            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  JavaScript Hooks
                </span>
                <i className="fas fa-chevron-right text-slate-400"></i>
              </div>
            </button>

            <button className="w-full text-left p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Custom API Endpoints
                </span>
                <i className="fas fa-chevron-right text-slate-400"></i>
              </div>
            </button>
          </div>
        </div>

        <div className="gaming-card p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            <i className="fas fa-download mr-2"></i>
            Export/Import
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Exporte configurações ou importe de outros dashboards
          </p>

          <div className="space-y-3">
            <button className="btn-primary text-sm w-full">
              <i className="fas fa-file-export mr-2"></i>
              Export Dashboard Config
            </button>

            <button className="btn-primary text-sm w-full">
              <i className="fas fa-file-import mr-2"></i>
              Import Configuration
            </button>

            <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm w-full p-2 border border-slate-300 dark:border-slate-600 rounded transition-colors">
              <i className="fas fa-undo mr-2"></i>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
