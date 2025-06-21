/**
 * 🎯 SectionMaster - Framework dinâmico de seções
 * Sistema completo e modular com todos os managers integrados
 */

import { getAddonManager } from "./AddonManager";
import { getPlanManager } from "./PlanManager";
import { getContentTypeManager } from "./ContentTypeManager";
import { getDataProvider } from "./DataProvider";

class SectionManager {
  constructor() {
    this.devMode = false;
    this.underConstruction = false;
    this.userPlan = "tier0";
    this.sections = null;
    this.initialized = false;

    // Managers integrados
    this.addonManager = getAddonManager();
    this.planManager = getPlanManager();
    this.contentTypeManager = getContentTypeManager();
    this.dataProvider = getDataProvider();

    console.log("🎯 SectionManager criado");
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Inicializar todos os managers
      await Promise.all([
        this.addonManager.initialize(),
        this.planManager.initialize(),
        this.contentTypeManager.initialize(),
      ]);

      // Carregar seções do DataProvider
      this.sections = this.dataProvider.getSections();

      this.initialized = true;
      console.log(
        "🎯 SectionManager fully initialized with",
        Object.keys(this.sections).length,
        "sections"
      );
    } catch (error) {
      console.error("❌ Failed to initialize SectionManager:", error);
      // Fallback
      this.sections = {};
      this.initialized = true;
    }
  }

  // ===== DEVMODE vs UNDERCONSTRUCTION =====

  setDevMode(enabled) {
    this.devMode = enabled;
    console.log(`🔧 DevMode: ${enabled ? "ENABLED" : "DISABLED"}`);
  }

  setUnderConstruction(enabled) {
    this.underConstruction = enabled;
    console.log(`🚧 UnderConstruction: ${enabled ? "ENABLED" : "DISABLED"}`);
  }

  setUserPlan(planId) {
    this.userPlan = planId;
    console.log(`👤 User plan set to: ${planId}`);
  }

  // ===== SECTION MANAGEMENT =====

  getSection(sectionId) {
    if (!this.initialized) return null;

    const section = this.sections[sectionId];
    if (!section) return null;

    // Enriquecer a seção com dados dinâmicos
    const userTier = this.planManager.getUserTier(this.userPlan);
    return {
      ...section,
      contentType: this.getContentType(section.contentTypeId),
      availableAddons: this.getAvailableAddonsForSection(section, userTier),
      canAccess: this.canAccessSection(section, userTier),
    };
  }

  getAccessibleSections() {
    if (!this.initialized) return [];

    const userTier = this.planManager.getUserTier(this.userPlan);
    const sections = [];

    Object.values(this.sections || {}).forEach((section) => {
      if (this.canAccessSection(section, userTier)) {
        sections.push({
          ...section,
          availableAddons: this.getAvailableAddonsForSection(section, userTier),
        });
      }
    });

    return sections
      .filter((section) => section.menuVisible)
      .sort((a, b) => a.order - b.order);
  }

  canAccessSection(section, userTier) {
    // DevMode libera tudo
    if (this.devMode) return true;

    // Verificar tier mínimo
    return userTier >= section.planTierMin;
  }

  getAvailableAddonsForSection(section, userTier) {
    const availableAddons = [];

    // Addons inclusos por tier
    for (let tier = 0; tier <= userTier; tier++) {
      if (section.includedAddonsByTier && section.includedAddonsByTier[tier]) {
        availableAddons.push(...section.includedAddonsByTier[tier]);
      }
    }

    // Addons de compra única (em devMode ou se comprados)
    if (this.devMode) {
      availableAddons.push(...(section.oneTimePurchaseAddons || []));
    }

    // Features em construção
    if (this.devMode || this.underConstruction) {
      const underConstructionFeatures =
        section.accessOverrides?.underConstructionFeatures || [];
      availableAddons.push(...underConstructionFeatures);
    }

    return [...new Set(availableAddons)];
  }

  createSection(sectionData) {
    if (!this.initialized) throw new Error("SectionManager not initialized");

    const id = sectionData.sectionId;

    // Validar ContentType
    const contentType = this.contentTypeManager.getContentType(
      sectionData.contentTypeId
    );
    if (!contentType) {
      throw new Error(
        `ContentType '${sectionData.contentTypeId}' não encontrado`
      );
    }

    const section = {
      ...sectionData,
      createdAt: new Date().toISOString(),
      custom: true,
      order: this.getNextOrder(),
    };

    this.sections[id] = section;

    // Salvar no DataProvider
    this.dataProvider.addCustomSection(section);

    console.log(`🎯 Seção criada: ${id}`);

    return section;
  }

  updateSection(sectionId, updates) {
    if (!this.sections[sectionId]) {
      throw new Error(`Seção '${sectionId}' não encontrada`);
    }

    this.sections[sectionId] = {
      ...this.sections[sectionId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.sections[sectionId];
  }

  deleteSection(sectionId) {
    const section = this.sections[sectionId];
    if (!section) {
      throw new Error(`Seção '${sectionId}' não encontrada`);
    }

    if (section.coreSection) {
      throw new Error("Não é possível deletar seções core do sistema");
    }

    delete this.sections[sectionId];
    console.log(`🎯 Seção deletada: ${sectionId}`);

    return true;
  }

  getNextOrder() {
    const orders = Object.values(this.sections || {}).map((s) => s.order);
    return Math.max(...orders, -1) + 1;
  }

  // ===== DATA MANAGEMENT =====

  getSectionData(sectionId) {
    if (this.devMode) {
      return this.loadRealData(sectionId);
    } else {
      return this.dataProvider.getDummyData(sectionId);
    }
  }

  loadRealData(sectionId) {
    console.log(`📊 [DevMode] Loading real data for: ${sectionId}`);

    // Primeiro tenta carregar dados salvos
    const savedData = this.dataProvider.getSectionData(sectionId);
    if (savedData && savedData.length > 0) {
      return savedData;
    }

    // Senão retorna dados dummy mais realistas para devMode
    return this.dataProvider.getDummyData(sectionId);
  }

  setSectionData(sectionId, data) {
    this.dataProvider.setSectionData(sectionId, data);
    console.log(`💾 Section data updated: ${sectionId}`);
  }

  // ===== INTEGRATION WITH MANAGERS =====

  // Addon methods (proxy para AddonManager)
  getAddon(addonId) {
    return this.addonManager.getAddon(addonId);
  }

  isAddonAvailable(addonId, userTier = null) {
    const tier = userTier || this.planManager.getUserTier(this.userPlan);
    return this.addonManager.isAddonAvailable(
      addonId,
      tier,
      this.devMode,
      this.underConstruction
    );
  }

  getAddonsByCategory() {
    return this.addonManager.getAddonsByCategory();
  }

  // Plan methods (proxy para PlanManager)
  getCurrentPlan() {
    return this.planManager.getPlan(this.userPlan);
  }

  getUpgradeOptions() {
    return this.planManager.getUpgradeOptions(this.userPlan);
  }

  checkLimit(limitType, currentUsage) {
    return this.planManager.checkLimit(this.userPlan, limitType, currentUsage);
  }

  // ContentType methods (proxy para ContentTypeManager)
  getContentType(contentTypeId) {
    return this.contentTypeManager.getContentType(contentTypeId);
  }

  getAllContentTypes() {
    return this.contentTypeManager.getAllContentTypes();
  }

  getContentTypeTemplates() {
    return this.contentTypeManager.getContentTypeTemplates();
  }

  createContentType(contentTypeData) {
    return this.contentTypeManager.createContentType(contentTypeData);
  }

  // ===== SYSTEM INFO =====

  getSystemInfo() {
    return {
      initialized: this.initialized,
      devMode: this.devMode,
      underConstruction: this.underConstruction,
      userPlan: this.userPlan,
      userTier: this.planManager.getUserTier(this.userPlan),
      totalSections: Object.keys(this.sections || {}).length,
      totalContentTypes: Object.keys(
        this.contentTypeManager.getAllContentTypes()
      ).length,
      totalAddons: Object.keys(this.addonManager.getAllAddons()).length,
      totalPlans: Object.keys(this.planManager.getAllPlans()).length,
      timestamp: new Date().toISOString(),
    };
  }

  // ===== SECTION BUILDER =====

  getSectionBuilder() {
    return {
      contentTypes: this.getAllContentTypes(),
      templates: this.getContentTypeTemplates(),
      availableAddons: this.getAddonsByCategory(),
      plans: this.planManager.getAllPlans(),
      currentUserTier: this.planManager.getUserTier(this.userPlan),
    };
  }
}

// Singleton
let instance = null;

export function getSectionManager() {
  if (!instance) {
    instance = new SectionManager();
  }
  return instance;
}

export default SectionManager;
