import React, { useState, useEffect } from "react";
import { getDataProvider } from "../../utils/DataProvider";

const AddonManager = ({
  section,
  contentType,
  onAddonsChange,
  currentPlan = "tier3",
  isDevMode = false,
}) => {
  const [availableAddons, setAvailableAddons] = useState([]);
  const [sectionAddons, setSectionAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMarketplace, setShowMarketplace] = useState(false);

  const dataProvider = getDataProvider();

  useEffect(() => {
    loadAddonsData();
  }, [section, contentType]);

  const loadAddonsData = () => {
    try {
      setLoading(true);

      // Verificação de segurança
      if (!contentType) {
        console.error("❌ AddonManager: contentType não foi fornecido");
        setLoading(false);
        return;
      }

      // Obter todos os addons disponíveis
      const allAddons = dataProvider.getAddons();
      const plans = dataProvider.getPlans();
      const currentPlanData = plans[currentPlan];

      console.log("🔧 AddonManager loadAddonsData:", {
        allAddons: Object.keys(allAddons).length,
        currentPlan,
        currentPlanData,
        contentType: contentType?.id,
        section: section?.sectionId,
      });

      // Filtrar addons baseado no ContentType e Plano
      const filtered = Object.values(allAddons).filter((addon) => {
        // Verificar se o addon é compatível com o ContentType
        const isCompatible =
          !addon.compatibleContentTypes ||
          addon.compatibleContentTypes.includes(contentType?.id) ||
          addon.compatibleContentTypes.includes("*") ||
          isDevMode;

        // Verificar se está incluído no plano ou pode ser comprado
        const includedInPlan = section?.includedAddonsByTier?.[
          currentPlanData?.tier || 3
        ]?.includes(addon.id);
        const canPurchase = section?.oneTimePurchaseAddons?.includes(addon.id);
        const isDevModeAvailable = isDevMode && addon.underConstruction;

        return (
          isCompatible &&
          (includedInPlan || canPurchase || isDevModeAvailable || isDevMode)
        );
      });

      console.log("🔧 Filtered addons:", filtered.length);
      setAvailableAddons(filtered);

      // Carregar addons atualmente ativos na seção
      const rawSectionAddons =
        section?.availableAddons || contentType?.availableAddons || [];

      // Filtrar apenas addons que realmente existem
      const availableAddonIds = new Set(Object.keys(allAddons));
      const validSectionAddons = rawSectionAddons.filter((addonId) =>
        availableAddonIds.has(addonId)
      );

      console.log("🔧 Valid section addons:", validSectionAddons);
      setSectionAddons(validSectionAddons);
    } catch (error) {
      console.error("Erro ao carregar addons:", error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar addon à seção
  const handleAddAddon = (addonId) => {
    if (!sectionAddons.includes(addonId)) {
      const updatedAddons = [...sectionAddons, addonId];
      setSectionAddons(updatedAddons);
      onAddonsChange && onAddonsChange(updatedAddons);
      console.log("✅ Addon adicionado:", addonId);
    }
  };

  // Remover addon da seção
  const handleRemoveAddon = (addonId) => {
    const updatedAddons = sectionAddons.filter((id) => id !== addonId);
    setSectionAddons(updatedAddons);
    onAddonsChange && onAddonsChange(updatedAddons);
    console.log("🗑️ Addon removido:", addonId);
  };

  // Verificar status do addon
  const getAddonStatus = (addon) => {
    const plans = dataProvider.getPlans();
    const currentPlanData = plans[currentPlan];

    // 1. Verificar se está incluído no plano atual
    if (addon.includedInPlans?.includes(currentPlan)) {
      return { type: "included", label: "Incluído no plano" };
    }

    // 2. Verificar se está incluído por tier
    const userTier = currentPlanData?.tier || 3;
    if (
      addon.includedInPlans?.some((plan) => {
        const planData = plans[plan];
        return planData && planData.tier <= userTier;
      })
    ) {
      return { type: "included", label: "Incluído no plano" };
    }

    // 3. DevMode libera tudo
    if (isDevMode) {
      return { type: "dev", label: "DevMode Ativo" };
    }

    // 4. Compra única
    if (addon.unlockType === "oneTimePurchase") {
      return { type: "purchase", label: `R$ ${addon.price}` };
    }

    // 5. Em construção
    if (addon.underConstruction) {
      return { type: "construction", label: "Em desenvolvimento" };
    }

    // 6. Disponível por padrão (para addons básicos)
    if (addon.unlockType === "includedInPlan") {
      return { type: "included", label: "Disponível" };
    }

    return { type: "available", label: "Disponível" };
  };

  // Obter addon por ID com fallback seguro
  const getAddonById = (addonId) => {
    const allAddons = dataProvider.getAddons();
    return allAddons[addonId] || null;
  };

  // Agrupar addons por categoria
  const groupedAddons = availableAddons.reduce((groups, addon) => {
    const category = addon.category || "Outros";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addon);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mr-3"></i>
        <span>Carregando addons...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Gerenciar Addons
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Seção: {section?.title} • {sectionAddons.length} addons ativos
          </p>
        </div>

        <button
          onClick={() => setShowMarketplace(!showMarketplace)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <i className="fas fa-store mr-1"></i>
          Marketplace
        </button>
      </div>

      {/* Active Addons */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2 text-sm">
          Addons Ativos
        </h4>
        {sectionAddons.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <i className="fas fa-puzzle-piece text-2xl text-gray-400 mb-2"></i>
            <p className="text-gray-600 text-sm">Nenhum addon ativo</p>
            <p className="text-xs text-gray-500 mt-1">
              Clique em "Marketplace" para adicionar addons
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {sectionAddons.map((addonId) => {
              const addon = getAddonById(addonId);

              if (!addon) {
                // Auto-remove addon não encontrado
                setTimeout(() => handleRemoveAddon(addonId), 100);
                return null;
              }

              const status = getAddonStatus(addon);

              return (
                <div
                  key={addonId}
                  className="bg-white border border-gray-200 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          addon.iconBgColor || "bg-blue-100"
                        }`}
                      >
                        <i
                          className={`${addon.icon} text-xs ${
                            addon.iconColor || "text-blue-600"
                          }`}
                        ></i>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm">
                          {addon.name}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {addon.category}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveAddon(addonId)}
                      className="text-gray-400 hover:text-red-600 transition-colors text-sm"
                      title="Remover addon"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 mt-1">
                    {addon.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status.type === "included"
                          ? "bg-green-100 text-green-700"
                          : status.type === "purchase"
                          ? "bg-yellow-100 text-yellow-700"
                          : status.type === "dev"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status.label}
                    </span>

                    {addon.configurationOptions && (
                      <button className="text-blue-600 hover:text-blue-700 text-xs">
                        <i className="fas fa-cog mr-1"></i>
                        Configurar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Marketplace Modal */}
      {showMarketplace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Marketplace Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Marketplace de Addons
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Compatível com: {contentType?.name} • Plano: {currentPlan}
                </p>
              </div>
              <button
                onClick={() => setShowMarketplace(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Marketplace Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {Object.keys(groupedAddons).length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-store text-4xl text-gray-400 mb-4"></i>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum addon disponível
                  </h4>
                  <p className="text-gray-600">
                    Não há addons compatíveis com este tipo de conteúdo no seu
                    plano atual.
                  </p>
                  {!isDevMode && (
                    <p className="text-sm text-gray-500 mt-2">
                      Ative o DevMode para acessar mais addons em
                      desenvolvimento.
                    </p>
                  )}
                </div>
              ) : (
                Object.keys(groupedAddons).map((category) => (
                  <div key={category} className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <i className="fas fa-folder text-blue-600 mr-2"></i>
                      {category}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupedAddons[category].map((addon) => {
                        const status = getAddonStatus(addon);
                        const isActive = sectionAddons.includes(addon.id);

                        return (
                          <div
                            key={addon.id}
                            className={`border rounded-lg p-3 transition-all ${
                              isActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center ${
                                  addon.iconBgColor || "bg-gray-100"
                                }`}
                              >
                                <i
                                  className={`${addon.icon} text-xs ${
                                    addon.iconColor || "text-gray-600"
                                  }`}
                                ></i>
                              </div>
                              <div className="flex-1 ml-2">
                                <h5 className="font-medium text-gray-900 text-sm">
                                  {addon.name}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  {addon.category}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                              {addon.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  status.type === "included"
                                    ? "bg-green-100 text-green-700"
                                    : status.type === "purchase"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : status.type === "dev"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {status.label}
                              </span>

                              {!isActive ? (
                                <button
                                  onClick={() => handleAddAddon(addon.id)}
                                  disabled={status.type === "blocked"}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  Adicionar
                                </button>
                              ) : (
                                <span className="text-blue-600 text-xs font-medium">
                                  <i className="fas fa-check mr-1"></i>
                                  Ativo
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Marketplace Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {availableAddons.length} addons disponíveis •{" "}
                {sectionAddons.length} ativos
              </div>
              <button
                onClick={() => setShowMarketplace(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DevMode Info */}
      {isDevMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-code text-yellow-600"></i>
            <span className="font-medium text-yellow-800 text-sm">
              DevMode Ativo
            </span>
          </div>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• Addons em construção estão disponíveis</p>
            <p>• Todas as funcionalidades estão desbloqueadas</p>
            <p>• Plano atual: {currentPlan}</p>
            <p>• Disponíveis: {availableAddons.length} addons</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddonManager;
