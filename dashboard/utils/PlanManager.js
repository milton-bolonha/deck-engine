/**
 * 🎯 PlanManager - Gerenciamento de planos e tiers
 * Sistema de planos hierárquicos com herança de funcionalidades
 */

import { getDataProvider } from "./DataProvider";

export class PlanManager {
  constructor() {
    this.dataProvider = getDataProvider();
    this.plans = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Usar dados internos do DataProvider
      this.plans = this.dataProvider.getPlans();
      this.initialized = true;
      console.log(
        "💎 PlanManager initialized with",
        Object.keys(this.plans).length,
        "plans"
      );
    } catch (error) {
      console.error("❌ Failed to load plans:", error);
      // Fallback para dados vazios
      this.plans = {};
      this.initialized = true;
    }
  }

  // ===== PLAN ACCESS =====

  getPlan(planId) {
    return this.plans?.[planId] || null;
  }

  getAllPlans() {
    return this.plans || {};
  }

  getPlansOrderedByTier() {
    return Object.values(this.plans || {}).sort((a, b) => a.tier - b.tier);
  }

  // ===== TIER MANAGEMENT =====

  getUserTier(planId) {
    const plan = this.getPlan(planId);
    return plan ? plan.tier : 0;
  }

  getPlanByTier(tier) {
    return Object.values(this.plans || {}).find((plan) => plan.tier === tier);
  }

  // ===== UPGRADE/DOWNGRADE =====

  canUpgradeTo(currentPlanId, targetPlanId) {
    const currentPlan = this.getPlan(currentPlanId);
    const targetPlan = this.getPlan(targetPlanId);

    if (!currentPlan || !targetPlan) return false;

    return targetPlan.tier > currentPlan.tier;
  }

  getUpgradeOptions(currentPlanId) {
    const currentPlan = this.getPlan(currentPlanId);
    if (!currentPlan) return [];

    return Object.values(this.plans || {})
      .filter((plan) => plan.tier > currentPlan.tier)
      .sort((a, b) => a.tier - b.tier);
  }

  // ===== LIMIT CHECKING =====

  checkLimit(planId, limitType, currentUsage) {
    const plan = this.getPlan(planId);
    if (!plan) return false;

    const limit = plan.limits[limitType];

    // -1 significa ilimitado
    if (limit === -1) return true;

    return currentUsage < limit;
  }

  getLimitStatus(planId, limitType, currentUsage) {
    const plan = this.getPlan(planId);
    if (!plan) return null;

    const limit = plan.limits[limitType];

    return {
      current: currentUsage,
      limit: limit === -1 ? "Ilimitado" : limit,
      percentage: limit === -1 ? 0 : (currentUsage / limit) * 100,
      exceeded: limit !== -1 && currentUsage >= limit,
    };
  }

  // ===== BILLING CALCULATIONS =====

  calculateUpgradePrice(currentPlanId, targetPlanId, billingCycle = "month") {
    const currentPlan = this.getPlan(currentPlanId);
    const targetPlan = this.getPlan(targetPlanId);

    if (!currentPlan || !targetPlan || targetPlan.tier <= currentPlan.tier) {
      return null;
    }

    // Cálculo básico (pode ser mais complexo com proration)
    const priceDifference = targetPlan.price - currentPlan.price;

    return {
      currentPlan: currentPlan.displayName,
      targetPlan: targetPlan.displayName,
      monthlyDifference: priceDifference,
      currency: targetPlan.currency,
      savings: billingCycle === "year" ? priceDifference * 2 : 0, // Exemplo: 2 meses grátis no anual
    };
  }

  // ===== FEATURE COMPARISON =====

  comparePlans(planIds) {
    const comparison = {};

    planIds.forEach((planId) => {
      const plan = this.getPlan(planId);
      if (plan) {
        comparison[planId] = {
          name: plan.displayName,
          tier: plan.tier,
          price: plan.price,
          features: plan.features,
          limits: plan.limits,
        };
      }
    });

    return comparison;
  }

  getFeatureDifferences(currentPlanId, targetPlanId) {
    const currentPlan = this.getPlan(currentPlanId);
    const targetPlan = this.getPlan(targetPlanId);

    if (!currentPlan || !targetPlan) return null;

    const newFeatures = targetPlan.features.filter(
      (feature) => !currentPlan.features.includes(feature)
    );

    const improvedLimits = {};
    Object.keys(targetPlan.limits).forEach((limitType) => {
      const currentLimit = currentPlan.limits[limitType];
      const targetLimit = targetPlan.limits[limitType];

      if (
        targetLimit === -1 ||
        (currentLimit !== -1 && targetLimit > currentLimit)
      ) {
        improvedLimits[limitType] = {
          from: currentLimit === -1 ? "Ilimitado" : currentLimit,
          to: targetLimit === -1 ? "Ilimitado" : targetLimit,
        };
      }
    });

    return {
      newFeatures,
      improvedLimits,
    };
  }
}

// Singleton
let planManagerInstance = null;

export function getPlanManager() {
  if (!planManagerInstance) {
    planManagerInstance = new PlanManager();
  }
  return planManagerInstance;
}
