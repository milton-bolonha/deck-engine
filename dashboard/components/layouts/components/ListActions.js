"use client";

export default function ListActions({
  selectedCount,
  onBulkDelete,
  onClearSelection,
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center gap-3">
        <i className="fas fa-check-circle text-blue-600 dark:text-blue-400"></i>
        <span className="text-sm text-blue-800 dark:text-blue-300">
          {selectedCount}{" "}
          {selectedCount === 1 ? "item selecionado" : "itens selecionados"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClearSelection}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded transition-colors"
        >
          Limpar seleção
        </button>

        <button
          onClick={onBulkDelete}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center gap-2"
        >
          <i className="fas fa-trash"></i>
          Excluir selecionados
        </button>
      </div>
    </div>
  );
}
