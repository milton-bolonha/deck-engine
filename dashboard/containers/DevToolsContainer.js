"use client";

import { useDashboard } from "../contexts/DashboardContext";
import SectionMasterContainer from "./SectionMasterContainer";

export default function DevToolsContainer() {
  const { state } = useDashboard();

  if (!state.devMode) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-lock text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Acesso Negado
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            DevMode precisa estar ativo para acessar o SectionMaster
          </p>
        </div>
      </div>
    );
  }

  return <SectionMasterContainer />;
}
