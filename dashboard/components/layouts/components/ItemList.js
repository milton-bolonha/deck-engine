"use client";

import { useState } from "react";

export default function ItemList({
  items,
  contentType,
  selectedItems = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortDirection,
}) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "fas fa-sort";
    return sortDirection === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
  };

  const renderCellValue = (item, field) => {
    const value = item[field.name];

    if (!value) return "-";

    switch (field.type) {
      case "image":
        return (
          <img
            src={value}
            alt={field.label}
            className="w-8 h-8 object-cover rounded"
          />
        );
      case "boolean":
        return value ? "✅" : "❌";
      case "date":
        return new Date(value).toLocaleDateString();
      case "url":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
        );
      default:
        return String(value).length > 50
          ? `${String(value).substring(0, 50)}...`
          : String(value);
    }
  };

  const getDisplayFields = () => {
    if (!contentType?.fields) return [];

    return Object.entries(contentType.fields).map(([name, config]) => ({
      name,
      label: config.label || name,
      type: config.type || "text",
      sortable: config.sortable !== false,
    }));
  };

  const displayFields = getDisplayFields();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-inbox text-4xl text-slate-400 mb-4"></i>
        <p className="text-slate-600 dark:text-slate-400">
          Nenhum item encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left p-4 w-8">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </th>

            {displayFields.map((field) => (
              <th
                key={field.name}
                className={`text-left p-4 text-sm font-medium text-slate-700 dark:text-slate-300 ${
                  field.sortable
                    ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    : ""
                }`}
                onClick={() => field.sortable && onSort(field.name)}
              >
                <div className="flex items-center gap-2">
                  {field.label}
                  {field.sortable && (
                    <i
                      className={`${getSortIcon(
                        field.name
                      )} text-xs text-slate-400`}
                    ></i>
                  )}
                </div>
              </th>
            ))}

            <th className="text-right p-4 w-20">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Ações
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                selectedItems.includes(item.id)
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </td>

              {displayFields.map((field) => (
                <td
                  key={field.name}
                  className="p-4 text-sm text-slate-600 dark:text-slate-400"
                >
                  {renderCellValue(item, field)}
                </td>
              ))}

              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
