"use client";

import { useState, useEffect } from "react";

export default function WYSIWYGAddon({
  name,
  value = "",
  onChange,
  label = "Editor de Texto Rico",
  required = false,
  error,
  disabled = false,
  placeholder = "Digite seu conteúdo aqui...",
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange && onChange(newValue);
  };

  const insertFormatting = (before, after = "") => {
    const textarea = document.getElementById(name);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = internalValue.substring(start, end);
    const newText = before + selectedText + after;

    const newValue =
      internalValue.substring(0, start) +
      newText +
      internalValue.substring(end);

    setInternalValue(newValue);
    onChange && onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-t-lg">
        <button
          type="button"
          onClick={() => insertFormatting("**", "**")}
          className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          title="Negrito"
        >
          <i className="fas fa-bold"></i>
        </button>

        <button
          type="button"
          onClick={() => insertFormatting("*", "*")}
          className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          title="Itálico"
        >
          <i className="fas fa-italic"></i>
        </button>

        <button
          type="button"
          onClick={() => insertFormatting("[", "](url)")}
          className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          title="Link"
        >
          <i className="fas fa-link"></i>
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>

        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`p-1 ${
            previewMode
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="Preview"
        >
          <i className="fas fa-eye"></i>
        </button>
      </div>

      {/* Editor/Preview */}
      {previewMode ? (
        <div
          className="w-full p-3 border border-t-0 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-b-lg min-h-[120px] prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: internalValue
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
              .replace(/\n/g, "<br>"),
          }}
        />
      ) : (
        <textarea
          id={name}
          name={name}
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={6}
          className={`w-full px-3 py-2 border border-t-0 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
            error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-slate-400 dark:hover:border-slate-500"
          }`}
          {...props}
        />
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Suporte básico para Markdown: **negrito**, *itálico*, [links](url)
      </p>
    </div>
  );
}
