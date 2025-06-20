"use client";

import { useState, useEffect } from "react";

export default function SelectAddon({
  name,
  value = "",
  onChange,
  label,
  options = [],
  required = false,
  error,
  disabled = false,
  placeholder = "Selecione uma opção",
  multiple = false,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = multiple
      ? Array.from(e.target.selectedOptions, (option) => option.value)
      : e.target.value;

    setInternalValue(newValue);
    onChange && onChange(newValue);
  };

  // Normalize options
  const normalizedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return option;
  });

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

      <select
        id={name}
        name={name}
        value={internalValue}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        multiple={multiple}
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
      >
        {!multiple && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}

      {multiple && internalValue?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {internalValue.map((val) => {
            const option = normalizedOptions.find((opt) => opt.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded"
              >
                {option?.label || val}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
