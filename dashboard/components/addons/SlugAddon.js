"use client";

import { useState, useEffect } from "react";

export default function SlugAddon({
  name,
  value = "",
  onChange,
  label = "URL Amigável",
  sourceField = "",
  required = false,
  error,
  disabled = false,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [autoGenerate, setAutoGenerate] = useState(!value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    // Auto-generate slug from source field if enabled
    if (autoGenerate && sourceField) {
      const slug = generateSlug(sourceField);
      setInternalValue(slug);
      onChange && onChange(slug);
    }
  }, [sourceField, autoGenerate, onChange]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    setAutoGenerate(false); // Disable auto-generation when user types
    onChange && onChange(newValue);
  };

  const handleRegenerate = () => {
    if (sourceField) {
      const slug = generateSlug(sourceField);
      setInternalValue(slug);
      setAutoGenerate(true);
      onChange && onChange(slug);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {sourceField && (
          <button
            type="button"
            onClick={handleRegenerate}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center"
          >
            <i className="fas fa-sync-alt mr-1"></i>
            Regenerar
          </button>
        )}
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder="minha-pagina-exemplo"
          required={required}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-slate-400 dark:hover:border-slate-500"
          }`}
          {...props}
        />

        {autoGenerate && sourceField && (
          <div className="absolute right-2 top-2">
            <i
              className="fas fa-magic text-green-500 text-sm"
              title="Geração automática ativa"
            ></i>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}

      {internalValue && (
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <i className="fas fa-link mr-1"></i>
          URL: /blog/{internalValue}
        </p>
      )}
    </div>
  );
}
