"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function SectionBuilder() {
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

  useEffect(() => {
    if (state.sectionManager?.initialized) {
      const data = state.sectionManager.getSectionBuilder();
      setBuilderData(data);
    }
  }, [state.sectionManager]);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const newSection = state.sectionManager.createSection({
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

      alert(`✅ Seção '${newSection.title}' criada com sucesso!`);

      // Reset form
      setFormData({
        sectionId: "",
        title: "",
        icon: "fas fa-folder",
        contentTypeId: "",
        planTierMin: 0,
        menuVisible: true,
      });
    } catch (error) {
      console.error("Erro ao criar seção:", error);
      alert(`Erro: ${error.message}`);
    }
  };

  if (!builderData) {
    return (
      <div className="p-6">
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
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-plus mr-2"></i>
          Criar Nova Seção
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informações Básicas */}
        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
            Informações Básicas
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                ID da Seção
              </label>
              <input
                type="text"
                value={formData.sectionId}
                onChange={(e) =>
                  setFormData({ ...formData, sectionId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: blog, produtos, team"
                pattern="^[a-z_]+$"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Apenas letras minúsculas e underscore
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Título da Seção
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: Blog, Produtos, Equipe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fas fa-folder">📁 Pasta</option>
                <option value="fas fa-newspaper">📰 Jornal</option>
                <option value="fas fa-box">📦 Caixa</option>
                <option value="fas fa-users">👥 Usuários</option>
                <option value="fas fa-chart-bar">📊 Gráfico</option>
                <option value="fas fa-cog">⚙️ Configuração</option>
                <option value="fas fa-image">🖼️ Imagem</option>
                <option value="fas fa-calendar">📅 Calendário</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Type */}
        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
            Tipo de Conteúdo
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(builderData.contentTypes).map(
              ([id, contentType]) => (
                <div
                  key={id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.contentTypeId === id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, contentTypeId: id })
                  }
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${contentType.icon} text-xl`}></i>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
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
        </div>

        {/* Configurações de Acesso */}
        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
            Configurações de Acesso
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
              >
                Visível no menu lateral
              </label>
            </div>
          </div>
        </div>

        {/* Templates Disponíveis */}
        {Object.keys(builderData.templates).length > 0 && (
          <div className="gaming-card p-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
              Templates Rápidos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(builderData.templates).map(
                ([templateId, template]) => (
                  <div
                    key={templateId}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        contentTypeId: templateId,
                        title: template.name,
                        icon: template.icon,
                      });
                    }}
                  >
                    <div className="text-center">
                      <i className={`${template.icon} text-2xl mb-2`}></i>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {template.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {template.description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={
              !formData.sectionId || !formData.title || !formData.contentTypeId
            }
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-plus mr-2"></i>
            Criar Seção
          </button>

          <button
            type="button"
            onClick={() => actions.setRightSidebar(null)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Current User Info */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
          Seu Plano Atual
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p>
            Plano: <strong>Tier {builderData.currentUserTier}</strong>
          </p>
          <p>
            DevMode: <strong>{state.devMode ? "ATIVO" : "INATIVO"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
