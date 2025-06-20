"use client";

export default function ListHeader({
  title,
  icon,
  itemCount,
  totalCount,
  contentType,
  searchTerm,
  onSearchChange,
  onCreate,
  onRefresh,
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* Title and Icon */}
        <div className="flex items-center gap-3">
          {icon && <i className={`${icon} text-2xl text-blue-600`}></i>}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
              {totalCount !== itemCount && ` de ${totalCount} total`}
            </p>
          </div>
        </div>

        {/* Content Type Badge */}
        {contentType && (
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
            {contentType.name}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Atualizar"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          )}

          <button
            onClick={onCreate}
            className="btn-primary flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Criar {contentType?.name || "Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
