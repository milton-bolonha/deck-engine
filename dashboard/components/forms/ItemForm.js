"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

// Import addon components
import TextInputAddon from "../addons/TextInputAddon";
import SlugAddon from "../addons/SlugAddon";
import WYSIWYGAddon from "../addons/WYSIWYGAddon";
import ImageUploadAddon from "../addons/ImageUploadAddon";
import TextareaAddon from "../addons/TextareaAddon";
import SelectAddon from "../addons/SelectAddon";
import NumberInputAddon from "../addons/NumberInputAddon";
import CheckboxAddon from "../addons/CheckboxAddon";
import DatePickerAddon from "../addons/DatePickerAddon";

export default function ItemForm() {
  const { state } = useDashboard();
  const formConfig = state.rightSidebarContent?.data;

  if (!formConfig) return null;

  const { sectionId, sectionConfig, item, onSave, onCancel } = formConfig;
  const { contentType } = sectionConfig;

  const [formData, setFormData] = useState(item || {});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize form with default values from ContentType fields
    if (!item) {
      const initialData = {};
      Object.entries(contentType.fields || {}).forEach(
        ([fieldName, fieldConfig]) => {
          if (fieldConfig.default !== undefined) {
            initialData[fieldName] = fieldConfig.default;
          }
        }
      );
      setFormData(initialData);
    }
  }, [item, contentType.fields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    // Validate required fields
    const validationErrors = {};
    Object.entries(contentType.fields || {}).forEach(
      ([fieldName, fieldConfig]) => {
        if (fieldConfig.required && !formData[fieldName]) {
          validationErrors[fieldName] = "Campo obrigatório";
        }
      }
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaving(false);
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving item:", error);
      setErrors({ general: "Erro ao salvar item" });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const renderAddon = (addonId, fieldName, fieldConfig) => {
    const commonProps = {
      key: fieldName,
      name: fieldName,
      value: formData[fieldName] || "",
      onChange: (value) => handleFieldChange(fieldName, value),
      error: errors[fieldName],
      required: fieldConfig.required,
      label: getFieldLabel(fieldName),
      ...fieldConfig,
    };

    switch (addonId) {
      case "TextInput":
        return <TextInputAddon {...commonProps} />;

      case "Slug":
        return (
          <SlugAddon
            {...commonProps}
            sourceField={formData.title || formData.name}
          />
        );

      case "WYSIWYG":
        return <WYSIWYGAddon {...commonProps} />;

      case "ImageUpload":
        return <ImageUploadAddon {...commonProps} />;

      case "Textarea":
        return <TextareaAddon {...commonProps} />;

      case "Select":
        return <SelectAddon {...commonProps} />;

      case "NumberInput":
        return <NumberInputAddon {...commonProps} />;

      case "Checkbox":
        return <CheckboxAddon {...commonProps} />;

      case "DatePicker":
        return <DatePickerAddon {...commonProps} />;

      // Fallback cases for missing addons
      case "SEOFields":
      case "CategorySystem":
      case "TagSystem":
        return (
          <TextInputAddon
            {...commonProps}
            placeholder={`${addonId} (em desenvolvimento)`}
          />
        );

      default:
        // Fallback to basic input
        return <TextInputAddon {...commonProps} />;
    }
  };

  const getFieldLabel = (fieldName) => {
    const labels = {
      title: "Título",
      name: "Nome",
      slug: "URL Amigável",
      content: "Conteúdo",
      excerpt: "Resumo",
      description: "Descrição",
      status: "Status",
      email: "Email",
      role: "Função",
      phone: "Telefone",
      featured_image: "Imagem Destacada",
      category: "Categoria",
      tags: "Tags",
    };

    return (
      labels[fieldName] ||
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    );
  };

  const getAddonForField = (fieldName, fieldConfig) => {
    // Map field types to addons
    const typeAddonMap = {
      text: "TextInput",
      textarea: "TextInput",
      email: "TextInput",
      slug: "Slug",
      wysiwyg: "WYSIWYG",
      image: "ImageUpload",
      select: "TextInput", // Will be enhanced later
      number: "TextInput",
    };

    // Check if specific addon is available for this field
    const availableAddons = sectionConfig.availableAddons || [];
    const suggestedAddon = typeAddonMap[fieldConfig.type];

    if (suggestedAddon && availableAddons.includes(suggestedAddon)) {
      return suggestedAddon;
    }

    // Fallback to TextInput
    return "TextInput";
  };

  const renderFormFields = () => {
    const fields = contentType.fields || {};
    const renderedFields = [];

    // Render fields defined in ContentType
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      const addonId = getAddonForField(fieldName, fieldConfig);
      renderedFields.push(renderAddon(addonId, fieldName, fieldConfig));
    });

    // Render additional addons that aren't mapped to fields
    const availableAddons = sectionConfig.availableAddons || [];
    const fieldNames = Object.keys(fields);

    availableAddons.forEach((addonId) => {
      // Skip if already rendered
      if (addonId === "SEOFields" && !fieldNames.includes("seo")) {
        renderedFields.push(
          renderAddon(addonId, "seo", {
            type: "text",
            placeholder: "SEO Fields (em desenvolvimento)",
          })
        );
      }
      if (addonId === "CategorySystem" && !fieldNames.includes("category")) {
        renderedFields.push(
          renderAddon(addonId, "category", {
            type: "text",
            placeholder: "Categoria (em desenvolvimento)",
          })
        );
      }
      if (addonId === "TagSystem" && !fieldNames.includes("tags")) {
        renderedFields.push(
          renderAddon(addonId, "tags", {
            type: "text",
            placeholder: "Tags (em desenvolvimento)",
          })
        );
      }
    });

    return renderedFields;
  };

  return (
    <div className="p-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className={`${contentType.icon} mr-2`} aria-hidden="true"></i>
          {item ? "Editar" : "Criar"} {contentType.name}
        </h2>

        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label="Fechar formulário"
        >
          <i className="fas fa-times text-xl" aria-hidden="true"></i>
        </button>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.general}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFormFields()}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <i
                  className="fas fa-spinner fa-spin mr-2"
                  aria-hidden="true"
                ></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2" aria-hidden="true"></i>
                {item ? "Atualizar" : "Criar"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Debug Info (only in dev mode) */}
      {state.devMode && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Debug Info
          </h4>
          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div>ContentType: {contentType.id}</div>
            <div>
              Available Addons: {sectionConfig.availableAddons?.join(", ")}
            </div>
            <div>Form Data: {JSON.stringify(formData, null, 2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
