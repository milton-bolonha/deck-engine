/**
 * 🎯 MASTER COMPREHENSIVE TEST - SectionMaster Framework
 * Sistema de testes abrangente baseado no checklist completo
 * Validação de TODAS as features principais sem dependência visual
 */

const puppeteer = require("puppeteer");
const fs = require("fs");

class SectionMasterTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      modules: {},
      criticalIssues: [],
      featureStatus: {},
      performance: {},
      errors: [],
    };

    this.page = null;
    this.browser = null;
  }

  async initialize() {
    console.log("🚀 Inicializando Master Comprehensive Test");
    console.log("=".repeat(80));

    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    // Capturar erros
    this.page.on("pageerror", (error) => {
      this.results.errors.push({
        type: "PAGE_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    // Carregar dashboard
    await this.page.goto("http://localhost:3001/", {
      waitUntil: "networkidle0",
    });
    await this.page.waitForTimeout(3000);
  }

  // ===== MÓDULO 1: NÚCLEO ESTRUTURAL =====
  async testNucleoEstruturalModule() {
    console.log("\n📊 MÓDULO 1: NÚCLEO ESTRUTURAL");

    const moduleResults = {
      contentTypes: await this.testContentTypes(),
      sections: await this.testSections(),
      sidebars: await this.testSidebars(),
      subsections: await this.testSubsections(),
      navigation: await this.testNavigation(),
    };

    this.results.modules.nucleoEstrutural = moduleResults;

    // Verificar críticos
    if (!moduleResults.contentTypes.passed || !moduleResults.sections.passed) {
      this.results.criticalIssues.push(
        "NÚCLEO ESTRUTURAL: ContentTypes ou Seções não funcionais"
      );
    }

    return moduleResults;
  }

  async testContentTypes() {
    console.log("  📋 Testando ContentTypes...");

    const result = await this.page.evaluate(() => {
      // Verificar se existem ContentTypes no sistema
      const contentTypesData = window.dataProvider?.getContentTypes() || {};
      const contentTypeIds = Object.keys(contentTypesData);

      return {
        exists: contentTypeIds.length > 0,
        count: contentTypeIds.length,
        types: contentTypeIds,
        hasEssentials: ["dashboard", "users", "kanban", "feed"].every((type) =>
          contentTypeIds.includes(type)
        ),
        layoutTypes: Object.values(contentTypesData).map((ct) => ct.layoutType),
        fieldStructure: Object.values(contentTypesData).every(
          (ct) => ct.fields && typeof ct.fields === "object"
        ),
      };
    });

    const passed =
      result.exists && result.hasEssentials && result.fieldStructure;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} ContentTypes: ${
        result.count
      } tipos, essenciais: ${result.hasEssentials}`
    );

    return { passed, details: result };
  }

  async testSections() {
    console.log("  📁 Testando Seções...");

    const result = await this.page.evaluate(() => {
      const sectionManager = window.sectionManager;
      if (!sectionManager?.initialized) return { exists: false };

      const sections = sectionManager.getAccessibleSections();

      return {
        exists: sections.length > 0,
        count: sections.length,
        hasCore: sections.some((s) => s.coreSection),
        hasCustom: sections.some((s) => !s.coreSection),
        sectionsWithIcons: sections.filter((s) => s.icon).length,
        sectionsWithContentType: sections.filter((s) => s.contentTypeId).length,
      };
    });

    const passed = result.exists && result.count >= 4;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Seções: ${result.count} seções, core: ${
        result.hasCore
      }`
    );

    return { passed, details: result };
  }

  updateTestCount(passed) {
    this.results.totalTests++;
    if (passed) {
      this.results.passedTests++;
    } else {
      this.results.failedTests++;
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.testNucleoEstruturalModule();

      console.log("\n📊 RESULTADO INICIAL:");
      console.log(
        `Testes: ${this.results.passedTests}/${this.results.totalTests}`
      );
    } catch (error) {
      console.error("❌ Erro:", error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Executar o Master Test
const tester = new SectionMasterTester();
tester.run();
