"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function DetailView({
  sectionId,
  sectionConfig,
  data,
  onDataChange,
  onRefresh,
}) {
  const { actions } = useDashboard();
  const [currentItem, setCurrentItem] = useState(null);

  const { contentType } = sectionConfig;

  useEffect(() => {
    // For detail view, show the first item or create a new one
    if (data.length > 0) {
      setCurrentItem(data[0]);
    } else {
      // Create default item for detail view
      const defaultItem = {
        id: "default",
        title: `${contentType?.name || "Item"} Principal`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentItem(defaultItem);
    }
  }, [data, contentType?.name]);

  const handleEdit = () => {
    actions.setRightSidebar({
      type: "item-form",
      data: {
        sectionId,
        sectionConfig,
        item: currentItem,
        onSave: handleSave,
        onCancel: () => actions.setRightSidebar(null),
      },
    });
  };

  const handleSave = (formData) => {
    const now = new Date().toISOString();

    if (data.length > 0) {
      // Update existing item
      const newData = [{ ...formData, id: currentItem.id, updatedAt: now }];
      onDataChange(newData);
      setCurrentItem(newData[0]);
    } else {
      // Create new item
      const newItem = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      onDataChange([newItem]);
      setCurrentItem(newItem);
    }

    actions.setRightSidebar(null);
  };

  const renderField = (key, value) => {
    if (!value) return null;

    const fieldConfig = contentType?.fields?.[key];

    if (key === "id" || key === "createdAt" || key === "updatedAt") return null;

    const getFieldLabel = (field) => {
      const labels = {
        title: "Título",
        name: "Nome",
        content: "Conteúdo",
        description: "Descrição",
        status: "Status",
        email: "Email",
        role: "Função",
        phone: "Telefone",
      };

      return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
    };

    const formatValue = (value, type) => {
      if (type === "wysiwyg" || key === "content") {
        return (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        );
      }

      if (type === "select" || key === "status") {
        const statusColors = {
          published: "bg-green-100 text-green-800",
          draft: "bg-yellow-100 text-yellow-800",
          scheduled: "bg-blue-100 text-blue-800",
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
        };

        const colorClass = statusColors[value] || "bg-gray-100 text-gray-800";

        return (
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full ${colorClass}`}
          >
            {value}
          </span>
        );
      }

      if (type === "image" || key.includes("image") || key.includes("photo")) {
        return (
          <img
            src={value}
            alt={getFieldLabel(key)}
            className="max-w-md h-auto rounded-lg"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        );
      }

      return <span>{String(value)}</span>;
    };

    return (
      <div key={key} className="mb-6">
        <dt className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {getFieldLabel(key)}
        </dt>
        <dd className="text-slate-900 dark:text-slate-100">
          {formatValue(value, fieldConfig?.type)}
        </dd>
      </div>
    );
  };

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <i
            className={`${sectionConfig.icon} text-2xl text-blue-500`}
            aria-hidden="true"
          ></i>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {sectionConfig.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {contentType?.description || "Visualização detalhada"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="px-3 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Atualizar"
          >
            <i className="fas fa-refresh" aria-hidden="true"></i>
          </button>

          <button
            onClick={handleEdit}
            className="btn-primary"
            aria-label="Editar"
          >
            <i className="fas fa-edit mr-2" aria-hidden="true"></i>
            Editar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="gaming-card p-8">
        <dl className="space-y-6">
          {Object.entries(currentItem).map(([key, value]) =>
            renderField(key, value)
          )}
        </dl>

        {/* Meta Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
            {currentItem.createdAt && (
              <div>
                <span className="font-medium">Criado em:</span>{" "}
                {new Date(currentItem.createdAt).toLocaleString("pt-BR")}
              </div>
            )}

            {currentItem.updatedAt && (
              <div>
                <span className="font-medium">Atualizado em:</span>{" "}
                {new Date(currentItem.updatedAt).toLocaleString("pt-BR")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
