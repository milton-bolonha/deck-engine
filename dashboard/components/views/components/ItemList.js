export default function ItemList({
  items = [],
  contentType,
  onEdit,
  onDelete,
  selectedItems = [],
  onSelectionChange,
  onSort,
  sortField = "title",
  sortDirection = "asc",
}) {
  const handleSelectItem = (itemId) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange && onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = items.map((item) => item.id);
    const newSelection = selectedItems.length === items.length ? [] : allIds;
    onSelectionChange && onSelectionChange(newSelection);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-inbox text-3xl mb-3"></i>
        <p>Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedItems.length === items.length && items.length > 0}
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />

          <div className="flex-1 grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase">
            <button
              onClick={() => onSort && onSort("title")}
              className="text-left hover:text-gray-700 flex items-center space-x-1"
            >
              <span>Título</span>
              {sortField === "title" && (
                <i
                  className={`fas fa-chevron-${
                    sortDirection === "asc" ? "up" : "down"
                  } text-xs`}
                ></i>
              )}
            </button>

            <button
              onClick={() => onSort && onSort("createdAt")}
              className="text-left hover:text-gray-700 flex items-center space-x-1"
            >
              <span>Criado</span>
              {sortField === "createdAt" && (
                <i
                  className={`fas fa-chevron-${
                    sortDirection === "asc" ? "up" : "down"
                  } text-xs`}
                ></i>
              )}
            </button>

            <span>Status</span>
            <span>Ações</span>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />

              <div className="flex-1 grid grid-cols-4 gap-4">
                {/* Title */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.title || item.name || `Item ${item.id}`}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description || item.excerpt || "Sem descrição"}
                  </p>
                </div>

                {/* Created */}
                <div className="text-sm text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("pt-BR")
                    : "-"}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === "published"
                        ? "bg-green-100 text-green-800"
                        : item.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status || "draft"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(item)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(item)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    title="Deletar"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
