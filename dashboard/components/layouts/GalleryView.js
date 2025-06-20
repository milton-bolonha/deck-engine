import React, { useState, useRef } from "react";

const GalleryView = ({
  contentType,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  isDevMode = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid, masonry, list
  const fileInputRef = useRef(null);

  // Filtrar e ordenar dados
  const filteredData = data
    .filter((item) => filter === "all" || item.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at || b.id) - new Date(a.created_at || a.id)
          );
        case "oldest":
          return (
            new Date(a.created_at || a.id) - new Date(b.created_at || b.id)
          );
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Obter categorias únicas
  const categories = [
    ...new Set(data.map((item) => item.category).filter(Boolean)),
  ];

  // Upload múltiplo de imagens
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            image: e.target.result,
            description: "",
            alt_text: file.name,
            category: "Sem categoria",
            created_at: new Date().toISOString(),
          };
          onAdd && onAdd(newImage);
        };
        reader.readAsDataURL(file);
      }
    });

    setShowUploadModal(false);
  };

  // Abrir modal de imagem
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Fechar modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Grid responsivo
  const getGridClasses = () => {
    switch (viewMode) {
      case "masonry":
        return "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4";
      case "list":
        return "grid grid-cols-1 gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {contentType?.name || "Galeria"}
          </h2>
          <p className="text-gray-600 mt-1">
            {contentType?.description || "Visualização em galeria"}
          </p>
        </div>

        {isDevMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              🚧 <strong>DevMode:</strong> Gallery View • Grid Responsivo
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Filtros por categoria */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="name">Nome A-Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Grid"
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              onClick={() => setViewMode("masonry")}
              className={`px-3 py-2 transition-colors ${
                viewMode === "masonry"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Masonry"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Lista"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-upload mr-2"></i>
            Upload
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <span>{filteredData.length} imagens</span>
        {filter !== "all" && <span>• Filtrado por: {filter}</span>}
        <span>
          • Ordenado por:{" "}
          {sortBy === "newest"
            ? "Mais recentes"
            : sortBy === "oldest"
            ? "Mais antigas"
            : "Nome A-Z"}
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <i className="fas fa-images text-4xl mb-4"></i>
            <p className="text-lg font-medium mb-2">Galeria vazia</p>
            <p className="text-sm mb-4">
              Faça upload de suas primeiras imagens
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-upload mr-2"></i>
              Fazer Upload
            </button>
          </div>
        ) : (
          <div className={getGridClasses()}>
            {filteredData.map((image) => (
              <div
                key={image.id}
                className={`bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow ${
                  viewMode === "masonry" ? "break-inside-avoid mb-4" : ""
                } ${viewMode === "list" ? "flex" : ""}`}
              >
                {/* Image */}
                <div
                  className={`relative cursor-pointer ${
                    viewMode === "list"
                      ? "w-32 h-24 flex-shrink-0"
                      : "aspect-square"
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.image}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <i className="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl"></i>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {image.title}
                    </h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => onEdit && onEdit(image)}
                        className="text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Editar"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(image.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Excluir"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>

                  {image.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {image.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {image.category && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {image.category}
                      </span>
                    )}
                    {image.created_at && (
                      <span>
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedImage.title}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-4">
              <img
                src={selectedImage.image}
                alt={selectedImage.alt_text || selectedImage.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />

              {selectedImage.description && (
                <p className="text-gray-600 mt-4">
                  {selectedImage.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                {selectedImage.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {selectedImage.category}
                  </span>
                )}
                {selectedImage.created_at && (
                  <span>
                    {new Date(selectedImage.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
