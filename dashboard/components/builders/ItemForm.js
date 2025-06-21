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

export default function ItemForm({
  item,
  section,
  onChange,
  isDevMode = false,
}) {
  const { state, actions } = useDashboard();

  // Usar props diretos ou fallback para dados do state
  const currentItem = item || state.selectedItem;
  const currentSection = section || state.currentSection;
  const formConfig = state.rightSidebarContent?.data;

  if (!currentSection) {
    return (
      <div className="p-4 text-center text-gray-500">
        <i className="fas fa-exclamation-circle text-2xl mb-3"></i>
        <p>Nenhuma seção selecionada</p>
      </div>
    );
  }

  // Verificação de segurança para contentType
  const contentType = currentSection.contentType || {
    name: "Item",
    icon: "fas fa-file",
    fields: {},
  };

  const [formData, setFormData] = useState(currentItem || {});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize form with default values from ContentType fields
    if (!currentItem) {
      const initialData = {};
      Object.entries(contentType.fields || {}).forEach(
        ([fieldName, fieldConfig]) => {
          if (fieldConfig.default !== undefined) {
            initialData[fieldName] = fieldConfig.default;
          }
        }
      );
      setFormData(initialData);
    } else {
      setFormData(currentItem);
    }
  }, [currentItem, contentType.fields]);

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
      const now = new Date().toISOString();
      const itemData = {
        ...formData,
        id: currentItem?.id || Date.now().toString(),
        updatedAt: now,
        createdAt: currentItem?.createdAt || now,
      };

      console.log("💾 ItemForm: Salvando item:", itemData);

      // 1. Tentar usar actions.saveItem do contexto (método preferido)
      if (currentSection?.sectionId && actions?.saveItem) {
        console.log("✅ Usando actions.saveItem do contexto");
        await actions.saveItem(currentSection.sectionId, itemData);
      }
      // 2. Chamar callback se fornecido (para quando usado em modal)
      else if (formConfig?.onSave) {
        console.log("✅ Usando callback onSave");
        await formConfig.onSave(itemData);
      }
      // 3. Chamar onChange para quando usado como componente direto
      else if (onChange) {
        console.log("✅ Usando prop onChange");
        onChange(itemData);
      }
      // 4. Fallback - apenas log
      else {
        console.log("⚠️ Nenhum método de salvamento disponível");
        console.log("Dados que seriam salvos:", itemData);
      }

      console.log("✅ Item processado:", itemData);

      // Forçar atualização da lista principal via evento personalizado
      if (typeof window !== "undefined") {
        const updateEvent = new CustomEvent("itemUpdated", {
          detail: {
            sectionId: currentSection.sectionId,
            itemData,
            action: currentItem ? "edit" : "create",
          },
        });
        window.dispatchEvent(updateEvent);
        console.log("📡 Evento itemUpdated disparado");
      }

      // Reset form if creating new item
      if (!currentItem) {
        setFormData({});
        console.log("🔄 Formulário resetado para novo item");
      }

      // Fechar formulário após salvar (para melhor UX)
      if (formConfig?.onCancel) {
        setTimeout(() => {
          formConfig.onCancel();
        }, 500); // Pequeno delay para mostrar feedback de sucesso
      }
    } catch (error) {
      console.error("❌ Erro ao salvar item:", error);
      setErrors({ general: "Erro ao salvar item: " + error.message });
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
    // Extrair key dos commonProps para evitar aviso do React
    const { key, ...commonProps } = {
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
        return <TextInputAddon key={fieldName} {...commonProps} />;

      case "Slug":
        return (
          <SlugAddon
            key={fieldName}
            {...commonProps}
            sourceField={formData.title || formData.name}
          />
        );

      case "WYSIWYG":
        return <WYSIWYGAddon key={fieldName} {...commonProps} />;

      case "ImageUpload":
        return <ImageUploadAddon key={fieldName} {...commonProps} />;

      case "Textarea":
        return <TextareaAddon key={fieldName} {...commonProps} />;

      case "Select":
        return <SelectAddon key={fieldName} {...commonProps} />;

      case "NumberInput":
        return <NumberInputAddon key={fieldName} {...commonProps} />;

      case "Checkbox":
        return <CheckboxAddon key={fieldName} {...commonProps} />;

      case "DatePicker":
        return <DatePickerAddon key={fieldName} {...commonProps} />;

      // Fallback cases for missing addons
      case "SEOFields":
      case "CategorySystem":
      case "TagSystem":
        return (
          <TextInputAddon
            key={fieldName}
            {...commonProps}
            placeholder={`${addonId} (em desenvolvimento)`}
          />
        );

      default:
        // Fallback to basic input
        return <TextInputAddon key={fieldName} {...commonProps} />;
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
    const availableAddons = currentSection.availableAddons || [];
    const suggestedAddon = typeAddonMap[fieldConfig.type];

    if (suggestedAddon && availableAddons.includes(suggestedAddon)) {
      return suggestedAddon;
    }

    // Fallback to TextInput
    return "TextInput";
  };

  const renderFormFields = () => {
    // Verificação de segurança antes de acessar fields
    if (!contentType || !contentType.fields) {
      return (
        <div className="p-4 text-center text-gray-500">
          <i className="fas fa-exclamation-triangle text-2xl mb-3"></i>
          <p>Tipo de conteúdo não configurado</p>
          <p className="text-sm mt-2">
            Configure o ContentType para esta seção
          </p>
        </div>
      );
    }

    const fields = contentType.fields || {};
    const renderedFields = [];

    // Render fields defined in ContentType
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      const addonId = getAddonForField(fieldName, fieldConfig);
      renderedFields.push(renderAddon(addonId, fieldName, fieldConfig));
    });

    // Render additional addons that aren't mapped to fields
    const availableAddons = currentSection.availableAddons || [];
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
          <i
            className={`${contentType?.icon || "fas fa-file"} mr-2`}
            aria-hidden="true"
          ></i>
          {currentItem ? "Editar" : "Criar"} {contentType?.name || "Item"}
        </h2>

        <button
          onClick={() => formConfig?.onCancel && formConfig.onCancel()}
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
            onClick={() => formConfig?.onCancel && formConfig.onCancel()}
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
                {currentItem ? "Atualizar" : "Criar"}
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
            <div>ContentType: {contentType?.id || "undefined"}</div>
            <div>
              Available Addons: {currentSection.availableAddons?.join(", ")}
            </div>
            <div>Form Data: {JSON.stringify(formData, null, 2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
