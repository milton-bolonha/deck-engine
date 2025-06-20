"use client";

import { useState, useEffect } from "react";

export default function NumberInputAddon({
  name,
  value = "",
  onChange,
  label,
  placeholder,
  required = false,
  error,
  disabled = false,
  min,
  max,
  step = 1,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange && onChange(newValue ? Number(newValue) : "");
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

      <input
        id={name}
        name={name}
        type="number"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
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

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}

      {(min !== undefined || max !== undefined) && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {min !== undefined && max !== undefined
            ? `Entre ${min} e ${max}`
            : min !== undefined
            ? `Mínimo: ${min}`
            : `Máximo: ${max}`}
        </p>
      )}
    </div>
  );
}
