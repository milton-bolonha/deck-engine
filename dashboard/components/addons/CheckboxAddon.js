"use client";

import { useState, useEffect } from "react";

export default function CheckboxAddon({
  name,
  value = false,
  onChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setInternalValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={internalValue}
            onChange={handleChange}
            required={required}
            disabled={disabled}
            className={`w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            {...props}
          />
        </div>

        <div className="ml-3 text-sm">
          {label && (
            <label
              htmlFor={name}
              className={`font-medium text-slate-700 dark:text-slate-300 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {description && (
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  );
}
