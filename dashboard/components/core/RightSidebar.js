"use client";

import React from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import SectionInfo from "../sections/SectionInfo";
import PipelineForm from "../pipeline/PipelineForm";
import PipelineDetails from "../pipeline/PipelineDetails";
import MatchDebugger from "../debug/MatchDebugger";
import UserForm from "../forms/UserForm";
import BillingForm from "../forms/BillingForm";
import AddonPurchase from "../forms/AddonPurchase";
import ProviderConfig from "../forms/ProviderConfig";
import SectionBuilder from "../builders/SectionBuilder";
import ItemForm from "../builders/ItemForm";
import AddonManager from "../managers/AddonManager";
import ElementManager from "../builders/ElementManager";

export default function RightSidebar({ isDevMode = false }) {
  const context = useDashboard();

  if (!context) {
    console.error("❌ RightSidebar: DashboardContext não encontrado");
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 text-center text-red-500">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>Contexto não disponível</p>
        </div>
      </div>
    );
  }

  const { state, dispatch, actions } = context;

  // Verificação adicional para dispatch
  if (!dispatch) {
    console.error("❌ RightSidebar: dispatch não está disponível no contexto");
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 text-center text-red-500">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>Dispatch não disponível</p>
        </div>
      </div>
    );
  }

  const {
    rightSidebarContent,
    selectedItem,
    selectedSection,
    selectedElement,
    currentSection,
  } = state;

  // Função auxiliar para dispatch seguro
  const safeDispatch = (action) => {
    // Tentar usar actions primeiro se disponível para certas operações
    if (
      action.type === "SET_RIGHT_SIDEBAR_CONTENT" &&
      actions?.setRightSidebarContent
    ) {
      try {
        actions.setRightSidebarContent(action.payload);
        return;
      } catch (error) {
        console.error("❌ RightSidebar: Erro ao usar action", error);
      }
    }

    if (!dispatch) {
      console.error(
        "❌ RightSidebar: Tentativa de dispatch sem função disponível",
        action
      );
      return;
    }
    try {
      dispatch(action);
    } catch (error) {
      console.error(
        "❌ RightSidebar: Erro ao executar dispatch",
        error,
        action
      );
    }
  };

  const handleItemChange = (updatedItem) => {
    // Usar a nova action saveItem que realmente persiste os dados
    const currentSectionId = (selectedSection || currentSection)?.sectionId;
    if (currentSectionId && actions?.saveItem) {
      actions.saveItem(currentSectionId, updatedItem);
    } else {
      // Fallback para o método antigo se necessário
      safeDispatch({
        type: "UPDATE_ITEM",
        payload: { item: updatedItem },
      });
    }
  };

  const handleAddonChange = (sectionId, newAddons) => {
    safeDispatch({
      type: "UPDATE_SECTION_ADDONS",
      payload: { sectionId, addons: newAddons },
    });
  };

  const handleElementsChange = (sectionId, newElements) => {
    safeDispatch({
      type: "UPDATE_SECTION_ELEMENTS",
      payload: { sectionId, elements: newElements },
    });
  };

  const handleElementSelect = (element) => {
    safeDispatch({
      type: "SELECT_ELEMENT",
      payload: { element },
    });
  };

  const renderContent = () => {
    // Extrair o tipo do rightSidebarContent
    const contentType =
      typeof rightSidebarContent === "object" && rightSidebarContent?.type
        ? rightSidebarContent.type
        : rightSidebarContent;

    switch (contentType) {
      case "item-form":
        if (!selectedItem && !currentSection) {
          return (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-info-circle text-2xl mb-3"></i>
              <p>Selecione um item para editar ou criar um novo</p>
            </div>
          );
        }

        // Debug log
        console.log("🔧 RightSidebar ItemForm:", {
          selectedItem,
          currentSection,
          hasContentType: !!currentSection?.contentType,
        });

        return (
          <div className="p-3">
            <ItemForm
              item={selectedItem}
              section={currentSection}
              onChange={handleItemChange}
              isDevMode={isDevMode}
            />
          </div>
        );

      case "addon-manager":
        if (!selectedSection) {
          return (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-puzzle-piece text-2xl mb-3"></i>
              <p>Selecione uma seção para gerenciar addons</p>
            </div>
          );
        }

        // Debug log para addon-manager
        console.log("🔧 RightSidebar AddonManager:", {
          selectedSection,
          contentType: selectedSection?.contentType,
          currentSection,
          currentSectionContentType: currentSection?.contentType,
        });

        const addonContentType =
          selectedSection?.contentType || currentSection?.contentType;

        return (
          <div className="p-3">
            <AddonManager
              section={selectedSection || currentSection}
              contentType={addonContentType}
              onAddonsChange={(addons) =>
                handleAddonChange(
                  (selectedSection || currentSection)?.sectionId,
                  addons
                )
              }
              currentPlan={state.currentPlan || "tier3"}
              isDevMode={isDevMode}
            />
          </div>
        );

      case "section-config":
        if (!selectedSection) {
          return (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-cogs text-2xl mb-3"></i>
              <p>Selecione uma seção para configurar</p>
            </div>
          );
        }

        return (
          <div className="p-3">
            <div className="space-y-4">
              {/* Section Header */}
              <div className="pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i
                      className={`${selectedSection.icon} text-green-600 text-sm`}
                    ></i>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Configurações da Seção
                    </h3>
                    <p className="text-xs text-gray-600">
                      {selectedSection.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() =>
                    safeDispatch({
                      type: "SET_RIGHT_SIDEBAR_CONTENT",
                      payload: "addon-manager",
                    })
                  }
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center"
                >
                  <i className="fas fa-puzzle-piece text-blue-600 mb-2 block text-lg"></i>
                  <span className="text-sm font-medium block">
                    Gerenciar Addons
                  </span>
                  <span className="text-xs text-gray-500">
                    Funcionalidades e elementos da seção
                  </span>
                </button>
              </div>

              {/* Section Stats */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm">
                  Estatísticas
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Layout:</span>
                    <span className="font-medium">
                      {selectedSection.contentType?.layoutType || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Itens:</span>
                    <span className="font-medium">
                      {state.sectionData[selectedSection.sectionId]?.length ||
                        0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Addons Ativos:</span>
                    <span className="font-medium">
                      {selectedSection.availableAddons?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "section-builder":
        const sectionBuilderData = state.rightSidebar?.data || {};
        const builderMode = sectionBuilderData.mode || "create";
        const builderSection = sectionBuilderData.section || null;

        return (
          <div className="h-full flex flex-col">
            {/* Header mais compacto */}
            <div className="p-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-layer-group text-purple-600 text-sm"></i>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {builderMode === "create" ? "Nova Seção" : "Editar Seção"}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {builderMode === "create"
                      ? "Criar uma nova seção personalizada"
                      : `Editando: ${builderSection?.title || "Seção"}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Content com scroll */}
            <div className="flex-1 overflow-y-auto">
              <SectionBuilder
                mode={builderMode}
                section={builderSection}
                onSave={sectionBuilderData.onSave}
                onCancel={sectionBuilderData.onCancel}
                isDevMode={isDevMode}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <div className="text-center text-gray-500">
              <i className="fas fa-mouse-pointer text-3xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Painel de Configurações
              </h3>
              <p className="text-sm mb-4">
                Selecione um item, seção ou elemento para ver as opções de
                configuração
              </p>

              {/* Quick Access */}
              <div className="space-y-2">
                <button
                  onClick={() =>
                    safeDispatch({
                      type: "SET_RIGHT_SIDEBAR_CONTENT",
                      payload: "section-config",
                    })
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-cogs text-blue-600"></i>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Configurar Seção
                      </div>
                      <div className="text-xs text-gray-500">
                        Addons e elementos
                      </div>
                    </div>
                  </div>
                </button>

                {isDevMode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-code text-yellow-600 text-sm"></i>
                      <span className="font-medium text-yellow-800 text-sm">
                        DevMode Ativo
                      </span>
                    </div>
                    <div className="text-xs text-yellow-700">
                      Funcionalidades de desenvolvimento disponíveis
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header mais compacto */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Configurações
          </h2>

          {rightSidebarContent &&
            (typeof rightSidebarContent === "object"
              ? rightSidebarContent.type !== "default"
              : rightSidebarContent !== "default") && (
              <button
                onClick={() =>
                  safeDispatch({
                    type: "SET_RIGHT_SIDEBAR_CONTENT",
                    payload: "default",
                  })
                }
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Voltar"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
        </div>

        {rightSidebarContent &&
          (typeof rightSidebarContent === "object"
            ? rightSidebarContent.type !== "default"
            : rightSidebarContent !== "default") && (
            <div className="mt-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {(() => {
                  // Se rightSidebarContent é um objeto, usar o type
                  if (
                    typeof rightSidebarContent === "object" &&
                    rightSidebarContent.type
                  ) {
                    return rightSidebarContent.type
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                  }

                  // Se é uma string, usar diretamente
                  if (typeof rightSidebarContent === "string") {
                    return rightSidebarContent
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                  }

                  // Fallback
                  return "Configurações";
                })()}
              </span>
            </div>
          )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>

      {/* Footer */}
      {isDevMode && (
        <div className="p-2 border-t border-gray-200 bg-blue-50 flex-shrink-0">
          <div className="text-xs text-blue-600">
            <div className="flex items-center gap-2 mb-1">
              <i className="fas fa-code"></i>
              <span className="font-medium">DevMode Debug</span>
            </div>
            <div>
              Content:{" "}
              {typeof rightSidebarContent === "object"
                ? rightSidebarContent?.type || "object"
                : rightSidebarContent || "null"}
            </div>
            <div>Section: {selectedSection?.sectionId || "none"}</div>
            <div>Element: {selectedElement?.id || "none"}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function getSidebarTitle(type) {
  const titles = {
    "create-form": "Create New",
    "pipeline-details": "Pipeline Details",
    "match-debugger": "Match Debugger",
    "addon-purchase": "Addon Purchase",
    "provider-config": "Provider Config",
    "pipeline-templates": "Templates",
    "section-builder": "Section Builder",
    "item-form": "Item Form",
  };

  return titles[type] || "Details";
}
