"use client";

import { useState } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import ItemForm from "../forms/ItemForm";
import ItemList from "./components/ItemList";
import ListHeader from "./components/ListHeader";
import ListActions from "./components/ListActions";

export default function ListView({
  sectionId,
  sectionConfig,
  data,
  onAdd,
  onEdit,
  onDelete,
  isDevMode,
}) {
  const { actions } = useDashboard();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const { contentType } = sectionConfig;

  // Filter and sort data
  const filteredData = data
    .filter((item) => {
      if (!searchTerm) return true;
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      const multiplier = sortDirection === "asc" ? 1 : -1;
      return aVal.localeCompare(bVal) * multiplier;
    });

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);

    // Limpar item selecionado e definir seção atual no contexto global
    actions.setSelectedItem(null);
    actions.setCurrentSection(sectionConfig);
    actions.setRightSidebarContent("item-form");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);

    // Definir item selecionado e seção atual no contexto global
    actions.setSelectedItem(item);
    actions.setCurrentSection(sectionConfig);
    actions.setRightSidebarContent("item-form");
  };

  const handleDelete = (item) => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar "${
          item.title || item.name || "este item"
        }"?`
      )
    ) {
      onDelete(item.id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (
      window.confirm(
        `Tem certeza que deseja deletar ${selectedItems.length} itens?`
      )
    ) {
      selectedItems.forEach((itemId) => onDelete(itemId));
      setSelectedItems([]);
    }
  };

  const handleSave = (formData) => {
    const now = new Date().toISOString();

    if (editingItem) {
      // Update existing item
      const updatedItem = { ...formData, id: editingItem.id, updatedAt: now };
      onEdit(updatedItem);
    } else {
      // Create new item
      const newItem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      onAdd(newItem);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    actions.setSelectedItem(null);
    actions.setRightSidebarContent("default");
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
        onRefresh={() => {}}
      />

      {selectedItems.length > 0 && (
        <ListActions
          selectedCount={selectedItems.length}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => setSelectedItems([])}
        />
      )}

      <div className="gaming-card overflow-hidden">
        <ItemList
          items={filteredData}
          contentType={contentType}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <i
            className={`${
              contentType?.icon || "fas fa-list"
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
              : "Tente ajustar sua busca ou filtros"}
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
