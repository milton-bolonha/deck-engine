/**
 * 🧩 AddonManager - Gerenciamento de Addons
 * Sistema modular para controle de addons e permissões
 */

import { getDataProvider } from "./DataProvider.js";

export class AddonManager {
  constructor() {
    this.dataProvider = getDataProvider();
    this.addons = null;
    this.userPurchases = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Usar dados internos do DataProvider
      this.addons = this.dataProvider.getAddons();
      this.initialized = true;
      console.log(
        "🧩 AddonManager initialized with",
        Object.keys(this.addons).length,
        "addons"
      );
    } catch (error) {
      console.error("❌ Failed to load addons:", error);
      // Fallback para dados vazios
      this.addons = {};
      this.initialized = true;
    }
  }

  // ===== ADDON ACCESS =====

  getAddon(addonId) {
    return this.addons?.[addonId] || null;
  }

  getAllAddons() {
    return this.addons || {};
  }

  getAddonsByCategory() {
    const categories = {};

    Object.values(this.addons || {}).forEach((addon) => {
      if (!categories[addon.category]) {
        categories[addon.category] = [];
      }
      categories[addon.category].push(addon);
    });

    return categories;
  }

  // ===== PERMISSION CHECKING =====

  isAddonAvailable(
    addonId,
    userTier,
    devMode = false,
    underConstruction = false
  ) {
    const addon = this.getAddon(addonId);
    if (!addon) return false;

    // DevMode libera tudo
    if (devMode) return true;

    // UnderConstruction libera addons em construção
    if (underConstruction && addon.underConstruction) return true;

    // Verificar se está incluído no plano
    if (addon.unlockType === "includedInPlan") {
      return addon.includedInPlans.some((plan) => {
        const tierNumber = parseInt(plan.replace("tier", ""));
        return tierNumber <= userTier;
      });
    }

    // Verificar se foi comprado
    if (addon.unlockType === "oneTimePurchase") {
      return this.userPurchases.includes(addonId);
    }

    return false;
  }

  getAvailableAddons(userTier, devMode = false, underConstruction = false) {
    const available = [];

    Object.keys(this.addons || {}).forEach((addonId) => {
      if (
        this.isAddonAvailable(addonId, userTier, devMode, underConstruction)
      ) {
        available.push(this.addons[addonId]);
      }
    });

    return available;
  }

  // ===== PURCHASE MANAGEMENT =====

  purchaseAddon(addonId) {
    const addon = this.getAddon(addonId);
    if (!addon || addon.unlockType !== "oneTimePurchase") {
      throw new Error("Addon não disponível para compra");
    }

    if (this.userPurchases.includes(addonId)) {
      throw new Error("Addon já foi comprado");
    }

    this.userPurchases.push(addonId);
    console.log(`💳 Addon ${addonId} purchased for ${addon.price}`);

    return {
      success: true,
      addonId,
      price: addon.price,
    };
  }

  getUserPurchases() {
    return this.userPurchases;
  }

  // ===== ADDON RENDERING =====

  renderAddonPreview(addonId) {
    const addon = this.getAddon(addonId);
    if (!addon) return null;

    return {
      id: addon.id,
      name: addon.name,
      category: addon.category,
      description: addon.description,
      isAvailable: false, // Será calculado externamente
      needsPurchase: addon.unlockType === "oneTimePurchase",
      price: addon.price,
      underConstruction: addon.underConstruction,
    };
  }
}

// Singleton
let addonManagerInstance = null;

export function getAddonManager() {
  if (!addonManagerInstance) {
    addonManagerInstance = new AddonManager();
  }
  return addonManagerInstance;
}
