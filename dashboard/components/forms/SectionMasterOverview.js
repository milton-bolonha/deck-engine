"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function SectionMasterOverview() {
  const { state, actions } = useDashboard();
  const [systemData, setSystemData] = useState(null);

  useEffect(() => {
    if (state.sectionManager?.initialized) {
      const data = {
        systemInfo: state.sectionManager.getSystemInfo(),
        accessibleSections: state.sectionManager.getAccessibleSections(),
        addonsByCategory: state.sectionManager.getAddonsByCategory(),
        currentPlan: state.sectionManager.getCurrentPlan(),
        contentTypes: state.sectionManager.getAllContentTypes(),
      };
      setSystemData(data);
    }
  }, [state.sectionManager, state.devMode, state.underConstruction]);

  if (!systemData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-slate-400 mb-4"></i>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando SectionMaster...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-crown mr-2"></i>
          SectionMaster Overview
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={actions.toggleDevMode}
            className={`px-3 py-1 text-xs rounded-full ${
              state.devMode
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            DevMode {state.devMode ? "ON" : "OFF"}
          </button>

          <button
            onClick={actions.toggleUnderConstruction}
            className={`px-3 py-1 text-xs rounded-full ${
              state.underConstruction
                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            UnderConstruction {state.underConstruction ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gaming-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">
            {systemData.systemInfo.totalSections}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Seções Totais
          </div>
        </div>

        <div className="gaming-card p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {systemData.systemInfo.totalContentTypes}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            ContentTypes
          </div>
        </div>

        <div className="gaming-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">
            {systemData.systemInfo.totalAddons}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Addons Disponíveis
          </div>
        </div>

        <div className="gaming-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">
            Tier {systemData.systemInfo.userTier}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Plano Atual
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="gaming-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-rocket mr-2"></i>
          Ações Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() =>
              actions.setRightSidebar({
                type: "section-builder",
                data: {},
              })
            }
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-center hover:border-blue-500 transition-colors"
          >
            <i className="fas fa-plus text-2xl text-blue-500 mb-2"></i>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              Criar Nova Seção
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Use templates ou crie do zero
            </div>
          </button>

          <div className="p-4 border-2 border-dashed border-green-300 rounded-lg text-center opacity-50">
            <i className="fas fa-file-code text-2xl text-green-500 mb-2"></i>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              Criar ContentType
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Em breve!
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-purple-300 rounded-lg text-center opacity-50">
            <i className="fas fa-store text-2xl text-purple-500 mb-2"></i>
            <div className="font-medium text-slate-900 dark:text-slate-100">
              Addon Store
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Em breve!
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Sections */}
      <div className="gaming-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-list mr-2"></i>
          Seções Acessíveis ({systemData.accessibleSections.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemData.accessibleSections.map((section) => (
            <div
              key={section.sectionId}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${section.icon} text-xl`}></i>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {section.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {section.contentTypeId} • Tier {section.planTierMin}+
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {section.availableAddons.length} addons
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Data Preview */}
      {state.currentSectionData.length > 0 && (
        <div className="gaming-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            <i className="fas fa-database mr-2"></i>
            Dados da Seção Atual: {state.selectedSection}
          </h3>

          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Modo: {state.devMode ? "Dados Reais (DevMode)" : "Dados Dummy"}
          </div>

          <div className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-lg overflow-auto max-h-64">
            <pre>{JSON.stringify(state.currentSectionData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
