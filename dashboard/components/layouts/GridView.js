"use client";

import { useState } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import ListHeader from "./components/ListHeader";
import ListActions from "./components/ListActions";

export default function GridView({
  sectionId,
  sectionConfig,
  data,
  onDataChange,
  onRefresh,
}) {
  const { actions } = useDashboard();
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { contentType } = sectionConfig;

  // Filter data
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreate = () => {
    actions.setRightSidebar({
      type: "item-form",
      data: {
        sectionId,
        sectionConfig,
        item: null,
        onSave: handleSave,
        onCancel: () => actions.setRightSidebar(null),
      },
    });
  };

  const handleEdit = (item) => {
    actions.setRightSidebar({
      type: "item-form",
      data: {
        sectionId,
        sectionConfig,
        item,
        onSave: handleSave,
        onCancel: () => actions.setRightSidebar(null),
      },
    });
  };

  const handleDelete = (item) => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar "${
          item.title || item.name || "este item"
        }"?`
      )
    ) {
      const newData = data.filter((d) => d.id !== item.id);
      onDataChange(newData);
    }
  };

  const handleSave = (formData) => {
    const now = new Date().toISOString();

    if (formData.id) {
      // Update existing item
      const newData = data.map((item) =>
        item.id === formData.id ? { ...formData, updatedAt: now } : item
      );
      onDataChange(newData);
    } else {
      // Create new item
      const newItem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      onDataChange([...data, newItem]);
    }

    actions.setRightSidebar(null);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (
      window.confirm(
        `Tem certeza que deseja deletar ${selectedItems.length} itens?`
      )
    ) {
      const newData = data.filter((item) => !selectedItems.includes(item.id));
      onDataChange(newData);
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const renderGridItem = (item) => {
    const title = item.title || item.name || "Sem título";
    const subtitle = item.excerpt || item.description || item.status || "";
    const imageUrl = item.featured_image || item.image || item.thumbnail;

    return (
      <div
        key={item.id}
        className={`gaming-card p-4 hover:shadow-lg transition-all cursor-pointer ${
          selectedItems.includes(item.id) ? "ring-2 ring-blue-500" : ""
        }`}
      >
        {/* Selection Checkbox */}
        <div className="flex items-start justify-between mb-3">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-label={`Selecionar ${title}`}
          />

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="text-blue-600 hover:text-blue-800"
              aria-label={`Editar ${title}`}
            >
              <i className="fas fa-edit" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="text-red-600 hover:text-red-800"
              aria-label={`Deletar ${title}`}
            >
              <i className="fas fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="mb-3">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
            {title}
          </h3>

          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {subtitle}
            </p>
          )}

          {/* Status Badge */}
          {item.status && (
            <div className="flex items-center justify-between text-xs">
              <span
                className={`px-2 py-1 rounded-full ${
                  item.status === "published"
                    ? "bg-green-100 text-green-800"
                    : item.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.status}
              </span>

              {item.createdAt && (
                <span className="text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <ListHeader
        title={sectionConfig.title}
        icon={sectionConfig.icon}
        itemCount={filteredData.length}
        totalCount={data.length}
        contentType={contentType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreate={handleCreate}
        onRefresh={onRefresh}
      />

      {selectedItems.length > 0 && (
        <ListActions
          selectedCount={selectedItems.length}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => setSelectedItems([])}
        />
      )}

      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map(renderGridItem)}
        </div>
      ) : (
        <div className="text-center py-12">
          <i
            className={`${
              contentType?.icon || "fas fa-th"
            } text-4xl text-slate-400 mb-4`}
          ></i>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {data.length === 0
              ? "Nenhum item ainda"
              : "Nenhum resultado encontrado"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {data.length === 0
              ? `Comece criando seu primeiro ${
                  contentType?.name?.toLowerCase() || "item"
                }`
              : "Tente ajustar sua busca"}
          </p>
          {data.length === 0 && (
            <button onClick={handleCreate} className="btn-primary">
              <i className="fas fa-plus mr-2" aria-hidden="true"></i>
              Criar {contentType?.name || "Item"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
