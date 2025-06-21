"use client";

import { useState } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import SectionMasterOverview from "./SectionMasterOverview";

export default function SectionMasterDebug() {
  const { state, actions } = useDashboard();
  const [activeTab, setActiveTab] = useState("overview");

  const systemInfo = state.sectionManager?.getSystemInfo() || {};

  if (activeTab === "overview") {
    return <SectionMasterOverview />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-cogs mr-2"></i>
          SectionMaster Debug
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === "overview"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("debug")}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === "debug"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Debug
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Modo Atual
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                DevMode:
              </span>
              <span
                className={`text-sm font-bold ${
                  state.devMode ? "text-green-500" : "text-red-500"
                }`}
              >
                {state.devMode ? "ATIVO" : "INATIVO"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                UnderConstruction:
              </span>
              <span
                className={`text-sm font-bold ${
                  state.underConstruction ? "text-orange-500" : "text-gray-500"
                }`}
              >
                {state.underConstruction ? "ATIVO" : "INATIVO"}
              </span>
            </div>
          </div>
        </div>

        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Seção Atual
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ID:
              </span>
              <span className="text-sm font-mono">{state.selectedSection}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Dados:
              </span>
              <span className="text-sm font-bold">
                {state.currentSectionData.length} items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
          Controles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={actions.toggleDevMode}
            className={`btn-primary text-sm ${
              state.devMode ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            <i className="fas fa-code mr-2"></i>
            {state.devMode ? "Desativar" : "Ativar"} DevMode
          </button>

          <button
            onClick={actions.toggleUnderConstruction}
            className={`btn-primary text-sm ${
              state.underConstruction ? "bg-orange-600" : "bg-gray-600"
            }`}
          >
            <i className="fas fa-hard-hat mr-2"></i>
            {state.underConstruction ? "Desativar" : "Ativar"} UnderConstruction
          </button>

          <button
            onClick={() => actions.loadSectionData(state.selectedSection)}
            className="btn-primary text-sm"
          >
            <i className="fas fa-refresh mr-2"></i>
            Recarregar Dados
          </button>
        </div>
      </div>

      {/* Current Data Preview */}
      {state.currentSectionData.length > 0 && (
        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
            Dados da Seção ({state.selectedSection})
          </h3>
          <div className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-lg overflow-auto max-h-64">
            <pre>{JSON.stringify(state.currentSectionData, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
          System Info
        </h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <pre className="text-xs">{JSON.stringify(systemInfo, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
