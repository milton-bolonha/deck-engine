"use client";

import { useState, useRef, useEffect } from "react";

export default function ImageUploadAddon({
  value = "",
  onChange,
  name,
  label,
  required = false,
  devMode = false,
  error = null,
  disabled = false,
  preview = true,
}) {
  const [imageUrl, setImageUrl] = useState(value);
  const fileInputRef = useRef(null);
  const inputId = `image-${name}`;

  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange?.(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    if (imageUrl && imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl("");
    onChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasError = error || (required && !imageUrl);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {devMode && (
            <span className="ml-2 text-xs text-blue-500 font-mono">
              [IMAGE: {name}]
            </span>
          )}
        </label>
      )}

      {/* Preview */}
      {imageUrl && preview && (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remover imagem"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>
      )}

      {/* Upload Input */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          id={inputId}
          name={name}
          onChange={handleFileSelect}
          accept="image/*"
          required={required && !imageUrl}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200 focus:outline-none
            ${
              hasError
                ? "border-red-500"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-500"
            }
            ${
              disabled
                ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-50"
                : "bg-white dark:bg-slate-900"
            }
            text-slate-900 dark:text-slate-100
          `}
        />

        {imageUrl && !disabled && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-4 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            Trocar imagem
          </button>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <i className="fas fa-exclamation-circle text-xs"></i>
          {error || "Uma imagem é obrigatória"}
        </p>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Formatos suportados: JPG, PNG, GIF, WebP. Máximo 5MB.
      </p>
    </div>
  );
}
