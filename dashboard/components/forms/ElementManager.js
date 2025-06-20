import React, { useState, useEffect } from "react";
import { getDataProvider } from "../../utils/DataProvider";

const ElementManager = ({
  section,
  contentType,
  sectionData,
  onElementsChange,
  selectedElement,
  onElementSelect,
  isDevMode = false,
}) => {
  const [elements, setElements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementTypes, setElementTypes] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);

  const dataProvider = getDataProvider();

  useEffect(() => {
    loadElements();
    loadElementTypes();
  }, [sectionData]);

  const loadElements = () => {
    // Extrair elementos da seção baseado no ContentType
    const extractedElements = [];

    if (contentType?.customElements) {
      // Usar elementos customizados definidos no ContentType
      Object.entries(contentType.customElements).forEach(([key, config]) => {
        extractedElements.push({
          id: key,
          type: config.type,
          position: config.position,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          config: config,
          data: sectionData.find((item) => item.elementId === key) || {},
        });
      });
    } else {
      // Criar elementos baseado nos dados existentes
      if (sectionData && sectionData.length > 0) {
        sectionData.forEach((item, index) => {
          extractedElements.push({
            id: item.id || `element_${index}`,
            type: "content",
            position: "main",
            name: item.title || `Elemento ${index + 1}`,
            data: item,
          });
        });
      }
    }

    setElements(extractedElements);
  };

  const loadElementTypes = () => {
    // Tipos de elementos disponíveis
    const types = [
      {
        id: "text",
        name: "Texto",
        icon: "fas fa-font",
        description: "Bloco de texto simples",
        color: "bg-blue-100 text-blue-600",
      },
      {
        id: "wysiwyg",
        name: "Editor Rich",
        icon: "fas fa-edit",
        description: "Editor de texto rico",
        color: "bg-green-100 text-green-600",
      },
      {
        id: "image",
        name: "Imagem",
        icon: "fas fa-image",
        description: "Upload e exibição de imagem",
        color: "bg-purple-100 text-purple-600",
      },
      {
        id: "metrics",
        name: "Métricas",
        icon: "fas fa-chart-bar",
        description: "Painéis de métricas e gráficos",
        color: "bg-orange-100 text-orange-600",
      },
      {
        id: "list",
        name: "Lista",
        icon: "fas fa-list",
        description: "Lista de itens",
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        id: "gallery",
        name: "Galeria",
        icon: "fas fa-images",
        description: "Galeria de imagens",
        color: "bg-pink-100 text-pink-600",
      },
      {
        id: "video",
        name: "Vídeo",
        icon: "fas fa-play-circle",
        description: "Player de vídeo",
        color: "bg-red-100 text-red-600",
      },
      {
        id: "form",
        name: "Formulário",
        icon: "fas fa-mb-form",
        description: "Formulário customizável",
        color: "bg-yellow-100 text-yellow-600",
      },
    ];

    setElementTypes(types);
  };

  // Adicionar novo elemento
  const handleAddElement = (elementType) => {
    const newElement = {
      id: `element_${Date.now()}`,
      type: elementType.id,
      position: "main",
      name: `Novo ${elementType.name}`,
      config: {
        type: elementType.id,
        position: "main",
      },
      data: getDefaultDataForType(elementType.id),
    };

    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    onElementsChange && onElementsChange(updatedElements);
    setShowAddModal(false);

    // Selecionar automaticamente o novo elemento
    onElementSelect && onElementSelect(newElement);
  };

  // Obter dados padrão para tipo de elemento
  const getDefaultDataForType = (type) => {
    switch (type) {
      case "text":
        return { content: "Texto de exemplo..." };
      case "wysiwyg":
        return { content: "<p>Conteúdo rich text...</p>" };
      case "image":
        return { src: "", alt: "Imagem", caption: "" };
      case "metrics":
        return { title: "Métricas", value: 0, format: "number" };
      case "list":
        return { items: ["Item 1", "Item 2", "Item 3"] };
      case "gallery":
        return { images: [] };
      case "video":
        return { src: "", title: "Vídeo" };
      case "form":
        return { fields: [] };
      default:
        return {};
    }
  };

  // Editar elemento
  const handleEditElement = (elementId, newData) => {
    const updatedElements = elements.map((el) =>
      el.id === elementId ? { ...el, data: { ...el.data, ...newData } } : el
    );
    setElements(updatedElements);
    onElementsChange && onElementsChange(updatedElements);
  };

  // Remover elemento
  const handleRemoveElement = (elementId) => {
    const updatedElements = elements.filter((el) => el.id !== elementId);
    setElements(updatedElements);
    onElementsChange && onElementsChange(updatedElements);

    // Deselecionar se elemento removido estava selecionado
    if (selectedElement?.id === elementId) {
      onElementSelect && onElementSelect(null);
    }
  };

  // Reordenar elementos
  const handleReorderElements = (dragIndex, dropIndex) => {
    const reorderedElements = [...elements];
    const draggedElement = reorderedElements[dragIndex];
    reorderedElements.splice(dragIndex, 1);
    reorderedElements.splice(dropIndex, 0, draggedElement);

    setElements(reorderedElements);
    onElementsChange && onElementsChange(reorderedElements);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, element, index) => {
    setDraggedElement({ element, index });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedElement && draggedElement.index !== dropIndex) {
      handleReorderElements(draggedElement.index, dropIndex);
    }

    setDraggedElement(null);
  };

  // Obter ícone do elemento
  const getElementIcon = (type) => {
    const elementType = elementTypes.find((t) => t.id === type);
    return elementType?.icon || "fas fa-cube";
  };

  // Obter cor do elemento
  const getElementColor = (type) => {
    const elementType = elementTypes.find((t) => t.id === type);
    return elementType?.color || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Elementos da Seção
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {elements.length} elementos • Seção: {section.title}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Adicionar Elemento
        </button>
      </div>

      {/* Elements List */}
      <div className="space-y-2">
        {elements.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <i className="fas fa-cubes text-3xl text-gray-400 mb-3"></i>
            <p className="text-gray-600 mb-2">Nenhum elemento na seção</p>
            <p className="text-sm text-gray-500 mb-4">
              Adicione elementos para começar a construir sua seção
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Primeiro Elemento
            </button>
          </div>
        ) : (
          elements.map((element, index) => (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all ${
                selectedElement?.id === element.id
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : ""
              }`}
              onClick={() => onElementSelect && onElementSelect(element)}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="text-gray-400 cursor-move">
                  <i className="fas fa-grip-vertical"></i>
                </div>

                {/* Element Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getElementColor(
                    element.type
                  )}`}
                >
                  <i className={getElementIcon(element.type)}></i>
                </div>

                {/* Element Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {element.name}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {element.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Posição: {element.position} •
                    {element.data.title && ` Título: ${element.data.title}`}
                    {element.data.content &&
                      ` • Conteúdo: ${element.data.content.substring(
                        0,
                        50
                      )}...`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementSelect && onElementSelect(element);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveElement(element.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remover"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Element Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Adicionar Elemento
                </h3>
                <p className="text-gray-600 mt-1">
                  Escolha o tipo de elemento para adicionar à seção
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elementTypes.map((elementType) => (
                  <button
                    key={elementType.id}
                    onClick={() => handleAddElement(elementType)}
                    className="text-left border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${elementType.color}`}
                      >
                        <i className={elementType.icon}></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {elementType.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {elementType.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DevMode Info */}
      {isDevMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-code text-blue-600"></i>
            <span className="font-medium text-blue-800">
              DevMode - Element Manager
            </span>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Drag & Drop para reordenar elementos</p>
            <p>• Clique para selecionar e editar no sidebar</p>
            <p>• {elements.length} elementos carregados</p>
            <p>• ContentType: {contentType.layoutType}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementManager;
