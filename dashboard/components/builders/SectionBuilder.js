"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function SectionBuilder({
  mode = "create",
  section = null,
  onSave,
  onCancel,
  isDevMode = false,
}) {
  const { state, actions } = useDashboard();
  const [builderData, setBuilderData] = useState(null);
  const [formData, setFormData] = useState({
    sectionId: "",
    title: "",
    icon: "fas fa-folder",
    contentTypeId: "",
    planTierMin: 0,
    menuVisible: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.sectionManager?.initialized) {
      const data = state.sectionManager.getSectionBuilder();
      setBuilderData(data);
    }
  }, [state.sectionManager]);

  useEffect(() => {
    // Preencher formulário quando em modo de edição
    if (mode === "edit" && section) {
      setFormData({
        sectionId: section.sectionId || "",
        title: section.title || "",
        icon: section.icon || "fas fa-folder",
        contentTypeId: section.contentTypeId || "",
        planTierMin: section.planTierMin || 0,
        menuVisible:
          section.menuVisible !== undefined ? section.menuVisible : true,
      });
    } else if (mode === "create") {
      // Reset para modo de criação
      setFormData({
        sectionId: "",
        title: "",
        icon: "fas fa-folder",
        contentTypeId: "",
        planTierMin: 0,
        menuVisible: true,
      });
    }
  }, [mode, section]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sectionId.trim()) {
      newErrors.sectionId = "ID da seção é obrigatório";
    } else if (!/^[a-z_]+$/.test(formData.sectionId)) {
      newErrors.sectionId = "Use apenas letras minúsculas e underscore";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.contentTypeId) {
      newErrors.contentTypeId = "Selecione um tipo de conteúdo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      let result;

      if (mode === "edit") {
        // Atualizar seção existente
        result = state.sectionManager.updateSection(section.sectionId, {
          ...formData,
          includedAddonsByTier: section.includedAddonsByTier || {
            0: ["TextInput"],
            1: ["TextInput", "WYSIWYG"],
            2: ["TextInput", "WYSIWYG", "SEOFields"],
            3: ["TextInput", "WYSIWYG", "SEOFields", "CategorySystem"],
          },
          oneTimePurchaseAddons: section.oneTimePurchaseAddons || [],
          accessOverrides: section.accessOverrides || {
            underConstructionFeatures: [],
          },
          order: section.order || 999,
          coreSection: section.coreSection || false,
        });

        console.log(`✅ Seção '${result.title}' atualizada com sucesso!`);
      } else {
        // Criar nova seção
        result = state.sectionManager.createSection({
          ...formData,
          includedAddonsByTier: {
            0: ["TextInput"],
            1: ["TextInput", "WYSIWYG"],
            2: ["TextInput", "WYSIWYG", "SEOFields"],
            3: ["TextInput", "WYSIWYG", "SEOFields", "CategorySystem"],
          },
          oneTimePurchaseAddons: [],
          accessOverrides: {
            underConstructionFeatures: [],
          },
          order: 999,
          coreSection: false,
        });

        console.log(`✅ Seção '${result.title}' criada com sucesso!`);
      }

      // Chamar callback de sucesso se fornecido
      if (onSave) {
        onSave(result);
      } else {
        // Fallback - fechar sidebar
        actions.setRightSidebar(null);
      }

      // Reset form apenas se for criação
      if (mode === "create") {
        setFormData({
          sectionId: "",
          title: "",
          icon: "fas fa-folder",
          contentTypeId: "",
          planTierMin: 0,
          menuVisible: true,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar seção:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      actions.setRightSidebar(null);
    }
  };

  if (!builderData) {
    return (
      <div className="p-4">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-slate-400 mb-4"></i>
          <p className="text-slate-600 dark:text-slate-400">
            Carregando Section Builder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informações Básicas */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3 text-sm">
            Informações Básicas
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                ID da Seção
              </label>
              <input
                type="text"
                value={formData.sectionId}
                onChange={(e) =>
                  setFormData({ ...formData, sectionId: e.target.value })
                }
                className={`w-full px-2 py-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.sectionId ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ex: blog, produtos, team"
                disabled={mode === "edit"} // ID não pode ser alterado na edição
                required
              />
              {errors.sectionId && (
                <p className="text-xs text-red-500 mt-1">{errors.sectionId}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Apenas letras minúsculas e underscore
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Título da Seção
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-2 py-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ex: Blog, Produtos, Equipe"
                required
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fas fa-folder">📁 Pasta</option>
                <option value="fas fa-newspaper">📰 Jornal</option>
                <option value="fas fa-box">📦 Caixa</option>
                <option value="fas fa-users">👥 Usuários</option>
                <option value="fas fa-chart-bar">📊 Gráfico</option>
                <option value="fas fa-cog">⚙️ Configuração</option>
                <option value="fas fa-image">🖼️ Imagem</option>
                <option value="fas fa-calendar">📅 Calendário</option>
                <option value="fas fa-star">⭐ Estrela</option>
                <option value="fas fa-heart">❤️ Coração</option>
                <option value="fas fa-fire">🔥 Fogo</option>
                <option value="fas fa-rocket">🚀 Foguete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Type */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3 text-sm">
            Tipo de Conteúdo
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {Object.entries(builderData.contentTypes).map(
              ([id, contentType]) => (
                <div
                  key={id}
                  className={`p-2 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.contentTypeId === id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, contentTypeId: id })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <i className={`${contentType.icon} text-sm`}></i>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {contentType.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {contentType.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {errors.contentTypeId && (
            <p className="text-xs text-red-500 mt-1">{errors.contentTypeId}</p>
          )}
        </div>

        {/* Configurações de Acesso */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3 text-sm">
            Configurações de Acesso
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tier Mínimo do Plano
              </label>
              <select
                value={formData.planTierMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    planTierMin: parseInt(e.target.value),
                  })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(builderData.plans).map(([planId, plan]) => (
                  <option key={planId} value={plan.tier}>
                    Tier {plan.tier} - {plan.displayName} (R$ {plan.price}/mês)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="menuVisible"
                checked={formData.menuVisible}
                onChange={(e) =>
                  setFormData({ ...formData, menuVisible: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="menuVisible"
                className="ml-2 block text-xs text-slate-700 dark:text-slate-300"
              >
                Visível no menu lateral
              </label>
            </div>
          </div>
        </div>

        {/* Templates Disponíveis - Apenas em modo de criação */}
        {mode === "create" && Object.keys(builderData.templates).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3 text-sm">
              Templates Rápidos
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {Object.entries(builderData.templates).map(
                ([templateId, template]) => (
                  <div
                    key={templateId}
                    className="p-2 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        contentTypeId: templateId,
                        title: template.name,
                        icon: template.icon,
                      });
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <i className={`${template.icon} text-sm`}></i>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                          {template.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            disabled={
              saving ||
              !formData.sectionId ||
              !formData.title ||
              !formData.contentTypeId
            }
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {mode === "edit" ? "Salvando..." : "Criando..."}
              </>
            ) : (
              <>
                <i
                  className={`fas ${
                    mode === "edit" ? "fa-save" : "fa-plus"
                  } mr-2`}
                ></i>
                {mode === "edit" ? "Salvar Alterações" : "Criar Seção"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Current User Info */}
      <div className="bg-blue-50 rounded-lg p-3">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">
          Informações do Sistema
        </h3>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p>
            Plano: <strong>Tier {builderData.currentUserTier}</strong>
          </p>
          <p>
            DevMode: <strong>{state.devMode ? "ATIVO" : "INATIVO"}</strong>
          </p>
          {mode === "edit" && (
            <p>
              Editando: <strong>{section?.title}</strong>
            </p>
          )}
        </div>
      </div>

      {/* DevMode Debug */}
      {isDevMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <i className="fas fa-code text-yellow-600 text-xs"></i>
            <span className="font-medium text-yellow-800 text-xs">
              DevMode Debug
            </span>
          </div>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• Mode: {mode}</p>
            <p>
              • Section ID:{" "}
              {mode === "edit" ? section?.sectionId : formData.sectionId}
            </p>
            <p>
              • Content Types: {Object.keys(builderData.contentTypes).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
