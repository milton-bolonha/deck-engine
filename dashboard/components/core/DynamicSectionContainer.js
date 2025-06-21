"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { getSectionManager } from "../../utils/SectionManager";
import { getDataProvider } from "../../utils/DataProvider";

// Layout Components
import ListView from "../views/ListView";
import GridView from "../views/GridView";
import DetailView from "../views/DetailView";
import DashboardView from "../views/DashboardView";
import KanbanView from "../views/KanbanView";
import CanvasView from "../views/CanvasView";
import FeedView from "../views/FeedView";
import GalleryView from "../views/GalleryView";

const DynamicSectionContainer = ({
  sectionId,
  isDevMode = false,
  onSectionChange,
}) => {
  const { state, actions } = useDashboard();
  const [sectionData, setSectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionConfig, setSectionConfig] = useState(null);

  const sectionManager = getSectionManager();
  const dataProvider = getDataProvider();

  useEffect(() => {
    loadSectionData();
  }, [sectionId]);

  // Listener para atualizações de itens via ItemForm
  useEffect(() => {
    const handleItemUpdate = (event) => {
      const { sectionId: eventSectionId, itemData, action } = event.detail;

      // Só processar se for da seção atual
      if (eventSectionId === sectionId) {
        console.log(`🔄 Recebido evento itemUpdated para ${sectionId}:`, {
          action,
          itemData,
        });

        // Recarregar dados da seção
        const updatedData = actions.loadSectionData(sectionId);
        setSectionData(updatedData);

        console.log(
          `✅ Lista atualizada após ${action} - ${updatedData.length} itens`
        );
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("itemUpdated", handleItemUpdate);

      return () => {
        window.removeEventListener("itemUpdated", handleItemUpdate);
      };
    }
  }, [sectionId, actions]);

  const loadSectionData = async () => {
    try {
      setLoading(true);
      console.log(`📦 DynamicSectionContainer: Carregando seção ${sectionId}`);

      // Garantir que o SectionManager está inicializado
      if (!sectionManager.initialized) {
        await sectionManager.initialize();
      }

      // Buscar informações da seção
      const sections = sectionManager.getAccessibleSections();
      const currentSection = sections.find((s) => s.sectionId === sectionId);

      if (!currentSection) {
        throw new Error(`Seção não encontrada: ${sectionId}`);
      }

      // Buscar ContentType
      const contentTypes = dataProvider.getContentTypes();
      const currentContentType = contentTypes[currentSection.contentTypeId];

      if (!currentContentType) {
        throw new Error(
          `ContentType não encontrado: ${currentSection.contentTypeId}`
        );
      }

      // Definir a seção atual no contexto global
      const sectionConfig = {
        ...currentSection,
        contentType: currentContentType,
        title: currentSection.title,
        icon: currentSection.icon,
        availableAddons: actions.getAvailableAddonsForSection(sectionId),
      };
      actions.setCurrentSection(sectionConfig);

      // Carregar dados da seção
      let data = dataProvider.getSectionData(sectionId);

      // Se não há dados salvos, usar dummy data
      if (!data || data.length === 0) {
        data = dataProvider.getDummyData(sectionId);
      }

      setSectionData(data);
      setSectionConfig(sectionConfig);

      console.log(`📊 Seção ${sectionId} carregada:`, {
        dataCount: data?.length || 0,
        contentType: currentContentType.id,
        addons: sectionConfig.availableAddons.length,
      });
    } catch (err) {
      console.error("Erro ao carregar seção:", err);
      setError(err.message);
      setSectionData([]);
    } finally {
      setLoading(false);
    }
  };

  const getLayoutType = (sectionId, contentType) => {
    // Mapear seções para layouts específicos
    const sectionLayouts = {
      blog: "list",
      users: "list",
      overview: "dashboard",
      products: "grid",
      pages: "list",
    };

    return sectionLayouts[sectionId] || contentType?.layoutType || "list";
  };

  // Handlers para ações CRUD
  const handleAdd = async (itemData) => {
    try {
      console.log(`➕ Adicionando item na seção ${sectionId}:`, itemData);
      await actions.saveItem(sectionId, itemData);

      // Recarregar dados para atualizar a lista
      const updatedData = actions.loadSectionData(sectionId);
      setSectionData(updatedData);

      console.log(
        `✅ Item adicionado e lista atualizada com ${updatedData.length} itens`
      );
      onSectionChange && onSectionChange(sectionId, "add", itemData);
    } catch (error) {
      console.error("❌ Erro ao adicionar item:", error);
    }
  };

  const handleEdit = async (itemData) => {
    try {
      console.log(`✏️ Editando item na seção ${sectionId}:`, itemData);
      await actions.saveItem(sectionId, itemData);

      // Recarregar dados para atualizar a lista
      const updatedData = actions.loadSectionData(sectionId);
      setSectionData(updatedData);

      console.log(`✅ Item editado e lista atualizada`);
      onSectionChange && onSectionChange(sectionId, "edit", itemData);
    } catch (error) {
      console.error("❌ Erro ao editar item:", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      console.log(`🗑️ Removendo item ${itemId} da seção ${sectionId}`);
      await actions.deleteItem(sectionId, itemId);

      // Recarregar dados para atualizar a lista
      const updatedData = actions.loadSectionData(sectionId);
      setSectionData(updatedData);

      console.log(`✅ Item removido e lista atualizada`);
      onSectionChange && onSectionChange(sectionId, "delete", itemId);
    } catch (error) {
      console.error("❌ Erro ao remover item:", error);
    }
  };

  // Handlers específicos para layouts especiais
  const handleMove = (movedItem) => {
    handleEdit(movedItem);
  };

  const handleLike = (likedItem) => {
    handleEdit(likedItem);
  };

  const handleComment = (commentedItem) => {
    handleEdit(commentedItem);
  };

  const handleUpdateCanvas = (canvasData) => {
    const updatedData = sectionData.map((item) =>
      item.id === canvasData.id ? { ...item, ...canvasData } : item
    );
    setSectionData(updatedData);
    dataProvider.setSectionData(sectionId, updatedData);
    onSectionChange && onSectionChange(sectionId, "canvas-update", canvasData);
  };

  // Renderizar layout baseado no layoutType
  const renderLayout = () => {
    if (!sectionConfig) return null;

    const layoutType = getLayoutType(sectionId, sectionConfig.contentType);

    const layoutProps = {
      sectionId,
      sectionConfig,
      data: sectionData,
      onAdd: handleAdd,
      onEdit: handleEdit,
      onDelete: handleDelete,
      isDevMode,
    };

    switch (layoutType) {
      case "list":
        return <ListView {...layoutProps} />;

      case "grid":
        return <GridView {...layoutProps} />;

      case "detail":
        return <DetailView {...layoutProps} />;

      case "dashboard":
        return <DashboardView {...layoutProps} />;

      case "kanban":
        return <KanbanView {...layoutProps} onMove={handleMove} />;

      case "canvas":
        return (
          <CanvasView {...layoutProps} onUpdateCanvas={handleUpdateCanvas} />
        );

      case "feed":
        return (
          <FeedView
            {...layoutProps}
            contentType={sectionConfig.contentType}
            onLike={handleLike}
            onComment={handleComment}
          />
        );

      case "gallery":
        return <GalleryView {...layoutProps} />;

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
              <p className="text-gray-600">
                Layout não suportado: {layoutType}
              </p>
              {isDevMode && (
                <p className="text-sm text-gray-500 mt-2">
                  Layouts disponíveis: list, grid, detail, dashboard, kanban,
                  canvas, feed, gallery
                </p>
              )}
            </div>
          </div>
        );
    }
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Carregando seção...</p>
          {isDevMode && (
            <p className="text-sm text-gray-500 mt-2">SectionId: {sectionId}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600 mb-2">Erro ao carregar seção</p>
          <p className="text-sm text-gray-500">{error}</p>
          {isDevMode && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Debug Info:</strong>
                <br />
                SectionId: {sectionId}
                <br />
                Error: {error}
              </p>
            </div>
          )}
          <button
            onClick={loadSectionData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {isDevMode && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800">
                <strong>🔧 DevMode:</strong> {sectionConfig?.title} •{" "}
                {sectionConfig?.contentType.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Layout: {sectionConfig?.contentType.layoutType} • Items:{" "}
                {sectionData.length} • ContentType:{" "}
                {sectionConfig?.contentType.id}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log("Section Data:", {
                    sectionConfig,
                    sectionData,
                  });
                }}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Debug
              </button>
              <button
                onClick={loadSectionData}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      )}

      {renderLayout()}
    </div>
  );
};

export default DynamicSectionContainer;
