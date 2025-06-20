"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { getSectionManager } from "../../utils/SectionManager";
import { getDataProvider } from "../../utils/DataProvider";

// Layout Components
import ListView from "../layouts/ListView";
import GridView from "../layouts/GridView";
import DetailView from "../layouts/DetailView";
import DashboardView from "../layouts/DashboardView";
import KanbanView from "../layouts/KanbanView";
import CanvasView from "../layouts/CanvasView";
import FeedView from "../layouts/FeedView";
import GalleryView from "../layouts/GalleryView";

const DynamicSectionContainer = ({
  sectionId,
  isDevMode = false,
  onSectionChange,
}) => {
  const { state, actions } = useDashboard();
  const [sectionData, setSectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [section, setSection] = useState(null);
  const [contentType, setContentType] = useState(null);

  const sectionManager = getSectionManager();
  const dataProvider = getDataProvider();

  useEffect(() => {
    loadSectionData();
  }, [sectionId]);

  const loadSectionData = async () => {
    try {
      setLoading(true);
      setError(null);

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

      setSection(currentSection);
      setContentType(currentContentType);

      // Definir a seção atual no contexto global
      const sectionConfig = {
        ...currentSection,
        contentType: currentContentType,
        title: currentSection.title,
        icon: currentSection.icon,
      };
      actions.setCurrentSection(sectionConfig);

      // Carregar dados da seção
      let data = dataProvider.getSectionData(sectionId);

      // Se não há dados salvos, usar dummy data
      if (!data || data.length === 0) {
        data = dataProvider.getDummyData(sectionId);
      }

      setSectionData(data);
    } catch (err) {
      console.error("Erro ao carregar seção:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handlers para ações CRUD
  const handleAdd = (newItem) => {
    const updatedData = [...sectionData, newItem];
    setSectionData(updatedData);
    dataProvider.setSectionData(sectionId, updatedData);
    onSectionChange && onSectionChange(sectionId, "add", newItem);
  };

  const handleEdit = (editedItem) => {
    const updatedData = sectionData.map((item) =>
      item.id === editedItem.id ? editedItem : item
    );
    setSectionData(updatedData);
    dataProvider.setSectionData(sectionId, updatedData);
    onSectionChange && onSectionChange(sectionId, "edit", editedItem);
  };

  const handleDelete = (itemId) => {
    const updatedData = sectionData.filter((item) => item.id !== itemId);
    setSectionData(updatedData);
    dataProvider.setSectionData(sectionId, updatedData);
    onSectionChange && onSectionChange(sectionId, "delete", itemId);
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
    if (!contentType || !section) return null;

    const layoutProps = {
      sectionConfig: {
        ...section,
        contentType,
        title: section.title,
        icon: section.icon,
      },
      data: sectionData,
      onAdd: handleAdd,
      onEdit: handleEdit,
      onDelete: handleDelete,
      isDevMode,
      sectionId,
    };

    switch (contentType.layoutType) {
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
            contentType={contentType}
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
                Layout não suportado: {contentType.layoutType}
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
                <strong>🔧 DevMode:</strong> {section?.title} •{" "}
                {contentType?.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Layout: {contentType?.layoutType} • Items: {sectionData.length}{" "}
                • ContentType: {contentType?.id}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log("Section Data:", {
                    section,
                    contentType,
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
