export default function ListActions({
  selectedCount = 0,
  onBulkDelete,
  onClearSelection,
  onBulkEdit,
  onBulkExport,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-white text-sm"></i>
            </div>
            <span className="text-blue-900 font-medium">
              {selectedCount}{" "}
              {selectedCount === 1 ? "item selecionado" : "itens selecionados"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
          >
            <i className="fas fa-times mr-1"></i>
            Limpar seleção
          </button>

          <div className="w-px h-6 bg-blue-300"></div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-2">
            {onBulkEdit && (
              <button
                onClick={onBulkEdit}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
              >
                <i className="fas fa-edit mr-1"></i>
                Editar
              </button>
            )}

            {onBulkExport && (
              <button
                onClick={onBulkExport}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
              >
                <i className="fas fa-download mr-1"></i>
                Exportar
              </button>
            )}

            {onBulkDelete && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Tem certeza que deseja deletar ${selectedCount} ${
                        selectedCount === 1 ? "item" : "itens"
                      }?`
                    )
                  ) {
                    onBulkDelete();
                  }
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                <i className="fas fa-trash mr-1"></i>
                Deletar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
