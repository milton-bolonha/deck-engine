import React, { useState, useMemo } from "react";

const KanbanView = ({
  contentType,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onMove,
  isDevMode = false,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Organizar dados por coluna
  const groupedData = useMemo(() => {
    const columns = contentType?.columns || [
      "todo",
      "in_progress",
      "review",
      "done",
    ];
    const grouped = {};

    columns.forEach((column) => {
      grouped[column] = data.filter((item) => item.status === column);
    });

    return grouped;
  }, [data, contentType?.columns]);

  const columnNames = {
    todo: "A Fazer",
    in_progress: "Em Progresso",
    review: "Revisão",
    done: "Concluído",
  };

  const columnColors = {
    todo: "bg-gray-100 border-gray-300",
    in_progress: "bg-blue-50 border-blue-300",
    review: "bg-yellow-50 border-yellow-300",
    done: "bg-green-50 border-green-300",
  };

  const priorityColors = {
    low: "border-l-gray-400",
    medium: "border-l-blue-400",
    high: "border-l-orange-400",
    urgent: "border-l-red-400",
  };

  // Drag and Drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    setDragOverColumn(column);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedItem && draggedItem.status !== newStatus) {
      const updatedItem = { ...draggedItem, status: newStatus };
      onMove && onMove(updatedItem);
    }

    setDraggedItem(null);
  };

  const handleAddItem = (status) => {
    const newItem = {
      id: Date.now(),
      title: "Novo Item",
      description: "",
      status,
      priority: "medium",
      assignee: "",
      due_date: "",
    };
    onAdd && onAdd(newItem);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {contentType?.name || "Kanban"}
          </h2>
          <p className="text-gray-600 mt-1">
            {contentType?.description || "Visualização em Kanban"}
          </p>
        </div>

        {isDevMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              🚧 <strong>DevMode:</strong> Layout Kanban • Drag & Drop ativo
            </p>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {Object.keys(groupedData).map((column) => (
            <div
              key={column}
              className={`flex-shrink-0 w-80 ${
                columnColors[column]
              } rounded-lg border-2 ${
                dragOverColumn === column ? "border-blue-400 bg-blue-50" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, column)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">
                    {columnNames[column]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-600">
                      {groupedData[column].length}
                    </span>
                    <button
                      onClick={() => handleAddItem(column)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Adicionar item"
                    >
                      <i className="fas fa-plus text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Column Items */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {groupedData[column].map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className={`bg-white rounded-lg border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow border-l-4 ${
                      priorityColors[item.priority || "medium"]
                    } ${draggedItem?.id === item.id ? "opacity-50" : ""}`}
                  >
                    {/* Item Header */}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 flex-1">
                        {item.title}
                      </h4>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>

                    {/* Item Description */}
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>
                    )}

                    {/* Item Footer */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {item.priority && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.priority === "urgent"
                                ? "bg-red-100 text-red-700"
                                : item.priority === "high"
                                ? "bg-orange-100 text-orange-700"
                                : item.priority === "medium"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.priority}
                          </span>
                        )}
                        {item.assignee && (
                          <span className="bg-gray-100 rounded-full px-2 py-1">
                            {item.assignee}
                          </span>
                        )}
                      </div>
                      {item.due_date && (
                        <span className="text-gray-500">
                          {new Date(item.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {groupedData[column].length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <i className="fas fa-inbox text-3xl mb-2"></i>
                    <p className="text-sm">Nenhum item nesta coluna</p>
                    <button
                      onClick={() => handleAddItem(column)}
                      className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Adicionar primeiro item
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
