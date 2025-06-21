"use client";

export default function ListHeader({
  title,
  icon,
  itemCount = 0,
  totalCount = 0,
  contentType,
  searchTerm = "",
  onSearchChange,
  onCreate,
  onRefresh,
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className={`${icon} text-blue-600 text-lg`}></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {totalCount === itemCount
                ? `${totalCount} ${totalCount === 1 ? "item" : "itens"}`
                : `${itemCount} de ${totalCount} itens`}
            </p>
          </div>
        </div>

        {contentType && (
          <div className="hidden md:block">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <i className={`${contentType.icon} mr-1`}></i>
              {contentType.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Atualizar"
        >
          <i className="fas fa-sync-alt"></i>
        </button>

        {/* Create Button - SEMPRE VISÍVEL */}
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Criar {contentType?.name || "Item"}</span>
        </button>
      </div>
    </div>
  );
}
