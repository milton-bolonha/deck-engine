"use client";

import { useState } from "react";
import { useDashboard } from "../contexts/DashboardContext";
import DynamicSectionContainer from "../components/core/DynamicSectionContainer";

export default function SectionMasterContainer() {
  const { state, actions } = useDashboard();
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [viewMode, setViewMode] = useState("sections"); // "sections" | "content"

  // Debug log
  console.log("🔧 SectionMaster Container - State:", {
    sectionManagerInitialized: state.sectionManager?.initialized,
    devMode: state.devMode,
    sectionsCount: state.sectionManager?.getAccessibleSections()?.length || 0,
  });

  // Obter seções disponíveis
  const getSections = () => {
    if (!state.sectionManager?.initialized) {
      console.warn("⚠️ SectionManager não inicializado ainda");
      return [];
    }

    const sections = state.sectionManager.getAccessibleSections();
    console.log("📊 Seções acessíveis:", sections.length);
    return sections;
  };

  const sections = getSections();

  const handleCreateSection = () => {
    console.log("🎯 Abrindo formulário de nova seção");
    actions.setRightSidebar({
      type: "section-builder",
      data: {
        mode: "create",
        onSave: (newSection) => {
          console.log("Nova seção criada:", newSection);
          actions.setRightSidebar(null);
        },
        onCancel: () => {
          actions.setRightSidebar(null);
        },
      },
    });
  };

  const handleEditSection = (section) => {
    actions.setRightSidebar({
      type: "section-builder",
      data: {
        mode: "edit",
        section,
        onSave: (updatedSection) => {
          console.log("Seção atualizada:", updatedSection);
          actions.setRightSidebar(null);
        },
        onCancel: () => {
          actions.setRightSidebar(null);
        },
      },
    });
  };

  const handleSelectSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setViewMode("content");
  };

  const handleBackToSections = () => {
    setSelectedSectionId(null);
    setViewMode("sections");
  };

  // Renderizar lista de seções
  const renderSectionsList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            SectionMaster
            <i className="fas fa-layer-group text-blue-500 ml-2"></i>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie seções e conteúdo do seu dashboard
          </p>
        </div>

        <button onClick={handleCreateSection} className="btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Nova Seção
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="gaming-card p-4 text-center">
          <i className="fas fa-layer-group text-2xl text-blue-500 mb-2"></i>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {sections.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Seções Totais
          </p>
        </div>

        <div className="gaming-card p-4 text-center">
          <i className="fas fa-file-alt text-2xl text-green-500 mb-2"></i>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {sections.reduce(
              (acc, section) => acc + (section.itemCount || 0),
              0
            )}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Itens de Conteúdo
          </p>
        </div>

        <div className="gaming-card p-4 text-center">
          <i className="fas fa-puzzle-piece text-2xl text-purple-500 mb-2"></i>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {state.sectionManager?.addonManager?.getAllAddons()?.length || 12}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Addons Disponíveis
          </p>
        </div>

        <div className="gaming-card p-4 text-center">
          <i className="fas fa-crown text-2xl text-yellow-500 mb-2"></i>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {state.userPlan === "tier3"
              ? 3
              : state.userPlan === "tier2"
              ? 2
              : state.userPlan === "tier1"
              ? 1
              : 0}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tier Atual
          </p>
        </div>
      </div>

      {/* Lista de Seções */}
      <div className="gaming-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            <i className="fas fa-list mr-2"></i>
            Suas Seções
          </h2>

          {state.devMode && (
            <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
              DevMode: {sections.length} seções carregadas
            </div>
          )}
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-layer-group text-4xl text-slate-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Nenhuma seção ainda
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Comece criando sua primeira seção personalizada
            </p>
            <button onClick={handleCreateSection} className="btn-primary">
              <i className="fas fa-plus mr-2"></i>
              Criar Primeira Seção
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <div
                key={section.sectionId}
                className="gaming-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                onClick={() => handleSelectSection(section.sectionId)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className={`${section.icon} text-lg text-blue-500`}></i>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {section.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSection(section);
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <i className="fas fa-edit text-sm"></i>
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {section.description || "Sem descrição"}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                    {section.contentTypeId}
                  </span>

                  <span className="text-slate-500 dark:text-slate-400">
                    {section.itemCount || 0} itens
                  </span>
                </div>

                {state.devMode && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-mono">
                    ID: {section.sectionId}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar conteúdo da seção
  const renderSectionContent = () => {
    if (!selectedSectionId) return null;

    return (
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={handleBackToSections}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <i className="fas fa-arrow-left mr-1"></i>
            SectionMaster
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-slate-100">
            {sections.find((s) => s.sectionId === selectedSectionId)?.title}
          </span>
        </div>

        {/* Conteúdo Dinâmico da Seção */}
        <DynamicSectionContainer sectionId={selectedSectionId} />
      </div>
    );
  };

  return (
    <div className="p-6 min-h-full">
      {viewMode === "sections" ? renderSectionsList() : renderSectionContent()}
    </div>
  );
}
