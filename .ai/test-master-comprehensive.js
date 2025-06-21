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

  async testSidebars() {
    console.log("  📐 Testando Sidebars...");

    const result = await this.page.evaluate(() => {
      const leftSidebar = document.querySelector(
        '[class*="LeftSidebar"], .left-sidebar'
      );
      const rightSidebar = document.querySelector(
        '[class*="RightSidebar"], .right-sidebar'
      );
      const mainContent = document.querySelector(
        '[class*="MainContent"], main'
      );

      return {
        leftSidebarExists: !!leftSidebar,
        rightSidebarExists: !!rightSidebar,
        mainContentExists: !!mainContent,
        threeColumnLayout: !!(leftSidebar && rightSidebar && mainContent),
        leftSidebarButtons: leftSidebar
          ? leftSidebar.querySelectorAll("button").length
          : 0,
        rightSidebarVisible: rightSidebar
          ? window.getComputedStyle(rightSidebar).display !== "none"
          : false,
      };
    });

    const passed = result.threeColumnLayout && result.leftSidebarButtons > 0;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Layout 3-colunas: ${
        result.threeColumnLayout
      }, botões: ${result.leftSidebarButtons}`
    );

    return { passed, details: result };
  }

  async testSubsections() {
    console.log("  📂 Testando Subseções...");

    // Ir para SectionMaster
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent.includes("SectionMaster"));
      if (btn) btn.click();
    });
    await this.page.waitForTimeout(2000);

    const result = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;

      return {
        sectionMasterVisible: bodyText.includes("SectionMaster"),
        novaSessaoButton: Array.from(document.querySelectorAll("button")).some(
          (btn) => btn.textContent.includes("Nova Seção")
        ),
        sectionsGrid: document.querySelector('[class*="grid"]') !== null,
        createForm: bodyText.includes("Criar") || bodyText.includes("Nova"),
        statistics:
          bodyText.includes("Seções Totais") || bodyText.includes("Itens"),
      };
    });

    const passed = result.sectionMasterVisible && result.novaSessaoButton;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} SectionMaster: visible: ${
        result.sectionMasterVisible
      }, create: ${result.novaSessaoButton}`
    );

    return { passed, details: result };
  }

  async testNavigation() {
    console.log("  🧭 Testando Navegação...");

    const navigationTests = [];
    const sectionsToTest = ["Overview", "Usuários", "SectionMaster"];

    for (const sectionName of sectionsToTest) {
      const testResult = await this.page.evaluate((section) => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const btn = buttons.find((b) => b.textContent.includes(section));

        if (btn) {
          btn.click();
          return { clicked: true, section };
        }
        return { clicked: false, section };
      }, sectionName);

      await this.page.waitForTimeout(1500);

      const contentChanged = await this.page.evaluate(() => {
        return document.body.textContent.length > 1000; // Conteúdo carregou
      });

      navigationTests.push({
        section: sectionName,
        clickable: testResult.clicked,
        contentLoaded: contentChanged,
      });
    }

    const passed = navigationTests.every(
      (test) => test.clickable && test.contentLoaded
    );
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Navegação: ${
        navigationTests.filter((t) => t.clickable).length
      }/${sectionsToTest.length} funcionais`
    );

    return { passed, details: navigationTests };
  }

  // ===== MÓDULO 2: ADDONS & EXTENSÕES =====
  async testAddonsExtensionsModule() {
    console.log("\n🧩 MÓDULO 2: ADDONS & EXTENSÕES");

    const moduleResults = {
      addonCatalog: await this.testAddonCatalog(),
      addonTiers: await this.testAddonTiers(),
      fieldTypes: await this.testFieldTypes(),
      addonManager: await this.testAddonManager(),
    };

    this.results.modules.addonsExtensions = moduleResults;
    return moduleResults;
  }

  async testAddonCatalog() {
    console.log("  📦 Testando Catálogo de Addons...");

    const result = await this.page.evaluate(() => {
      const addonManager = window.addonManager;
      if (!addonManager) return { exists: false };

      const addons = addonManager.getAllAddons
        ? addonManager.getAllAddons()
        : {};
      const addonKeys = Object.keys(addons);

      const essentialAddons = [
        "TextInput",
        "WYSIWYG",
        "ImageUpload",
        "SEOFields",
        "CategorySystem",
        "TagSystem",
        "Slug",
      ];

      return {
        exists: addonKeys.length > 0,
        count: addonKeys.length,
        hasEssentials: essentialAddons.every((addon) =>
          addonKeys.includes(addon)
        ),
        essentialCount: essentialAddons.filter((addon) =>
          addonKeys.includes(addon)
        ).length,
        addonsList: addonKeys,
      };
    });

    const passed = result.exists && result.essentialCount >= 5;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Addons: ${result.count} total, ${
        result.essentialCount
      }/7 essenciais`
    );

    return { passed, details: result };
  }

  async testAddonTiers() {
    console.log("  🏆 Testando Sistema de Tiers...");

    const result = await this.page.evaluate(() => {
      const planManager = window.planManager;
      if (!planManager) return { exists: false };

      const plans = planManager.getAllPlans ? planManager.getAllPlans() : {};
      const tierLevels = Object.values(plans)
        .map((p) => p.tier)
        .filter((t) => t !== undefined);

      return {
        exists: Object.keys(plans).length > 0,
        planCount: Object.keys(plans).length,
        hasTiers: tierLevels.length > 0,
        maxTier: Math.max(...tierLevels, 0),
        tierSystem: tierLevels.length >= 3,
      };
    });

    const passed = result.exists && result.tierSystem;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Tiers: ${
        result.planCount
      } planos, max tier: ${result.maxTier}`
    );

    return { passed, details: result };
  }

  async testFieldTypes() {
    console.log("  📝 Testando Tipos de Campo...");

    // Ir para Nova Seção para testar formulários
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sectionMasterBtn = buttons.find((b) =>
        b.textContent.includes("SectionMaster")
      );
      if (sectionMasterBtn) sectionMasterBtn.click();
    });
    await this.page.waitForTimeout(1500);

    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const novaSessaoBtn = buttons.find((b) =>
        b.textContent.includes("Nova Seção")
      );
      if (novaSessaoBtn) novaSessaoBtn.click();
    });
    await this.page.waitForTimeout(2000);

    const result = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;

      const fieldTypes = [
        "text",
        "textarea",
        "wysiwyg",
        "email",
        "number",
        "select",
        "image",
        "date",
        "checkbox",
      ];

      const formExists = document.querySelector("form") !== null;
      const inputsExist = document.querySelectorAll("input").length > 0;
      const textareasExist = document.querySelectorAll("textarea").length > 0;
      const selectsExist = document.querySelectorAll("select").length > 0;

      return {
        formExists,
        inputsExist,
        textareasExist,
        selectsExist,
        inputCount: document.querySelectorAll("input").length,
        hasFormElements: formExists && inputsExist,
        formVisible:
          bodyText.includes("Criar Nova Seção") ||
          bodyText.includes("Informações Básicas"),
      };
    });

    const passed = result.formExists && result.hasFormElements;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Formulários: ${
        result.inputCount
      } inputs, form: ${result.formExists}`
    );

    return { passed, details: result };
  }

  async testAddonManager() {
    console.log("  ⚙️ Testando Addon Manager...");

    const result = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;

      return {
        sectionBuilderVisible: bodyText.includes("Criar Nova Seção"),
        contentTypeSelector: bodyText.includes("Tipo de Conteúdo"),
        addonConfiguration:
          bodyText.includes("Configurações") || bodyText.includes("Addons"),
        rightSidebarForm:
          document.querySelector(
            '.right-sidebar form, [class*="RightSidebar"] form'
          ) !== null,
        managementInterface:
          bodyText.includes("Informações Básicas") &&
          bodyText.includes("Ícone"),
      };
    });

    const passed = result.sectionBuilderVisible && result.contentTypeSelector;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Manager: builder: ${
        result.sectionBuilderVisible
      }, selector: ${result.contentTypeSelector}`
    );

    return { passed, details: result };
  }

  // ===== MÓDULO 3: CRUD & INTERAÇÕES =====
  async testCrudInteractionsModule() {
    console.log("\n📊 MÓDULO 3: CRUD & INTERAÇÕES");

    const moduleResults = {
      createFunctionality: await this.testCreateFunctionality(),
      readFunctionality: await this.testReadFunctionality(),
      updateFunctionality: await this.testUpdateFunctionality(),
      deleteFunctionality: await this.testDeleteFunctionality(),
      formValidation: await this.testFormValidation(),
    };

    this.results.modules.crudInteractions = moduleResults;
    return moduleResults;
  }

  async testCreateFunctionality() {
    console.log("  ➕ Testando CREATE...");

    // Ir para seção Users para testar CRUD
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const usersBtn = buttons.find((b) => b.textContent.includes("Usuários"));
      if (usersBtn) usersBtn.click();
    });
    await this.page.waitForTimeout(2000);

    const result = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;
      const createButtons = Array.from(
        document.querySelectorAll("button")
      ).filter(
        (btn) =>
          btn.textContent.includes("Create") ||
          btn.textContent.includes("Criar") ||
          btn.textContent.includes("Nova") ||
          btn.textContent.includes("Add")
      );

      return {
        hasCreateButton: createButtons.length > 0,
        createButtonText: createButtons.map((btn) => btn.textContent),
        userSectionLoaded:
          bodyText.includes("User") || bodyText.includes("Usuário"),
        listViewVisible:
          document.querySelector('[class*="list"], .list, table') !== null,
        hasAddButton: Array.from(document.querySelectorAll("button")).some(
          (btn) =>
            btn.textContent.includes("+") || btn.textContent.includes("Add")
        ),
      };
    });

    const passed = result.hasCreateButton && result.userSectionLoaded;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} CREATE: button: ${
        result.hasCreateButton
      }, section: ${result.userSectionLoaded}`
    );

    return { passed, details: result };
  }

  async testReadFunctionality() {
    console.log("  👁️ Testando READ...");

    const result = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;
      const lists = document.querySelectorAll(
        '[class*="list"], .list, table, [class*="grid"]'
      );
      const items = document.querySelectorAll(
        '[class*="item"], .item, tr, [class*="card"]'
      );

      return {
        hasListView: lists.length > 0,
        hasItems: items.length > 0,
        itemCount: items.length,
        hasDataDisplay:
          bodyText.includes("No items") ||
          bodyText.includes("Nenhum") ||
          items.length > 0,
        listStructure: Array.from(lists).map((list) => ({
          tagName: list.tagName,
          className: list.className,
          childrenCount: list.children.length,
        })),
      };
    });

    const passed = result.hasListView && result.hasDataDisplay;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} READ: lista: ${result.hasListView}, itens: ${
        result.itemCount
      }`
    );

    return { passed, details: result };
  }

  async testUpdateFunctionality() {
    console.log("  ✏️ Testando UPDATE...");

    const result = await this.page.evaluate(() => {
      const editButtons = Array.from(
        document.querySelectorAll('button, [role="button"]')
      ).filter(
        (btn) =>
          btn.textContent.includes("Edit") ||
          btn.textContent.includes("Editar") ||
          btn.innerHTML.includes("fa-edit") ||
          btn.innerHTML.includes("fa-pencil")
      );

      const editIcons = document.querySelectorAll(
        '.fa-edit, .fa-pencil, [class*="edit"]'
      );

      return {
        hasEditButtons: editButtons.length > 0,
        hasEditIcons: editIcons.length > 0,
        editButtonCount: editButtons.length,
        editIconCount: editIcons.length,
        hasEditCapability: editButtons.length > 0 || editIcons.length > 0,
      };
    });

    const passed = result.hasEditCapability;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} UPDATE: buttons: ${
        result.editButtonCount
      }, icons: ${result.editIconCount}`
    );

    return { passed, details: result };
  }

  async testDeleteFunctionality() {
    console.log("  🗑️ Testando DELETE...");

    const result = await this.page.evaluate(() => {
      const deleteButtons = Array.from(
        document.querySelectorAll('button, [role="button"]')
      ).filter(
        (btn) =>
          btn.textContent.includes("Delete") ||
          btn.textContent.includes("Deletar") ||
          btn.textContent.includes("Remove") ||
          btn.innerHTML.includes("fa-trash") ||
          btn.innerHTML.includes("fa-delete")
      );

      const deleteIcons = document.querySelectorAll(
        '.fa-trash, .fa-delete, [class*="delete"]'
      );

      return {
        hasDeleteButtons: deleteButtons.length > 0,
        hasDeleteIcons: deleteIcons.length > 0,
        deleteButtonCount: deleteButtons.length,
        deleteIconCount: deleteIcons.length,
        hasDeleteCapability: deleteButtons.length > 0 || deleteIcons.length > 0,
      };
    });

    const passed = result.hasDeleteCapability;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} DELETE: buttons: ${
        result.deleteButtonCount
      }, icons: ${result.deleteIconCount}`
    );

    return { passed, details: result };
  }

  async testFormValidation() {
    console.log("  ✅ Testando Validação de Formulários...");

    const result = await this.page.evaluate(() => {
      const forms = document.querySelectorAll("form");
      const requiredFields = document.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );
      const validationMessages = document.querySelectorAll(
        '.error, .invalid, [class*="error"], [class*="invalid"]'
      );

      return {
        hasFormValidation: forms.length > 0,
        requiredFieldCount: requiredFields.length,
        hasRequiredFields: requiredFields.length > 0,
        hasValidationMessages: validationMessages.length > 0,
        formCount: forms.length,
      };
    });

    const passed = result.hasFormValidation && result.hasRequiredFields;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Validação: forms: ${
        result.formCount
      }, required: ${result.requiredFieldCount}`
    );

    return { passed, details: result };
  }

  // ===== MÓDULO 4: LAYOUTS ESPECIAIS =====
  async testSpecialLayoutsModule() {
    console.log("\n🎨 MÓDULO 4: LAYOUTS ESPECIAIS");

    const moduleResults = {
      kanbanLayout: await this.testKanbanLayout(),
      dashboardLayout: await this.testDashboardLayout(),
      feedLayout: await this.testFeedLayout(),
      gridLayout: await this.testGridLayout(),
      canvasLayout: await this.testCanvasLayout(),
    };

    this.results.modules.specialLayouts = moduleResults;
    return moduleResults;
  }

  async testKanbanLayout() {
    console.log("  📋 Testando Layout Kanban...");

    const result = await this.page.evaluate(() => {
      const contentTypesData = window.dataProvider?.getContentTypes() || {};
      const kanbanContentType = contentTypesData.kanban;

      return {
        kanbanExists: !!kanbanContentType,
        hasKanbanLayout: kanbanContentType?.layoutType === "kanban",
        hasColumns:
          kanbanContentType?.columns &&
          Array.isArray(kanbanContentType.columns),
        columnCount: kanbanContentType?.columns?.length || 0,
        hasKanbanFields:
          kanbanContentType?.fields &&
          kanbanContentType.fields.status &&
          kanbanContentType.fields.priority,
      };
    });

    const passed = result.kanbanExists && result.hasKanbanLayout;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Kanban: exists: ${
        result.kanbanExists
      }, columns: ${result.columnCount}`
    );

    return { passed, details: result };
  }

  async testDashboardLayout() {
    console.log("  📊 Testando Layout Dashboard...");

    // Ir para Overview (dashboard)
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const overviewBtn = buttons.find((b) =>
        b.textContent.includes("Overview")
      );
      if (overviewBtn) overviewBtn.click();
    });
    await this.page.waitForTimeout(2000);

    const result = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;
      const metrics = document.querySelectorAll(
        '[class*="metric"], .metric, [class*="stat"], .stat'
      );
      const cards = document.querySelectorAll('[class*="card"], .card');
      const dashboardElements = document.querySelectorAll(
        '[class*="dashboard"], .dashboard'
      );

      return {
        hasDashboardView:
          bodyText.includes("Overview") || bodyText.includes("Dashboard"),
        hasMetrics: metrics.length > 0,
        hasCards: cards.length > 0,
        hasDashboardElements: dashboardElements.length > 0,
        metricCount: metrics.length,
        cardCount: cards.length,
      };
    });

    const passed =
      result.hasDashboardView && (result.hasMetrics || result.hasCards);
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Dashboard: view: ${
        result.hasDashboardView
      }, métricas: ${result.metricCount}`
    );

    return { passed, details: result };
  }

  async testFeedLayout() {
    console.log("  📱 Testando Layout Feed...");

    const result = await this.page.evaluate(() => {
      const contentTypesData = window.dataProvider?.getContentTypes() || {};
      const feedContentType = contentTypesData.feed;

      return {
        feedExists: !!feedContentType,
        hasFeedLayout: feedContentType?.layoutType === "feed",
        hasFeedFields:
          feedContentType?.fields &&
          feedContentType.fields.content &&
          feedContentType.fields.author,
        hasSocialFeatures:
          feedContentType?.fields &&
          (feedContentType.fields.likes || feedContentType.fields.comments),
      };
    });

    const passed = result.feedExists && result.hasFeedLayout;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Feed: exists: ${
        result.feedExists
      }, social: ${result.hasSocialFeatures}`
    );

    return { passed, details: result };
  }

  async testGridLayout() {
    console.log("  🔲 Testando Layout Grid...");

    const result = await this.page.evaluate(() => {
      const contentTypesData = window.dataProvider?.getContentTypes() || {};
      const galleryContentType = contentTypesData.gallery;

      const gridElements = document.querySelectorAll('[class*="grid"], .grid');

      return {
        galleryExists: !!galleryContentType,
        hasGridLayout: galleryContentType?.layoutType === "grid",
        hasGridElements: gridElements.length > 0,
        gridElementCount: gridElements.length,
        hasImageFields:
          galleryContentType?.fields &&
          galleryContentType.fields.image &&
          galleryContentType.fields.title,
      };
    });

    const passed = result.galleryExists && result.hasGridLayout;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Grid: exists: ${
        result.galleryExists
      }, elements: ${result.gridElementCount}`
    );

    return { passed, details: result };
  }

  async testCanvasLayout() {
    console.log("  🎨 Testando Layout Canvas...");

    const result = await this.page.evaluate(() => {
      const contentTypesData = window.dataProvider?.getContentTypes() || {};
      const pipelineContentType = contentTypesData.pipeline;

      return {
        pipelineExists: !!pipelineContentType,
        hasCanvasLayout: pipelineContentType?.layoutType === "canvas",
        hasCanvasFields:
          pipelineContentType?.fields &&
          pipelineContentType.fields.nodes &&
          pipelineContentType.fields.connections,
        hasCustomElements:
          pipelineContentType?.customElements &&
          pipelineContentType.customElements.canvas,
      };
    });

    const passed = result.pipelineExists && result.hasCanvasLayout;
    this.updateTestCount(passed);

    console.log(
      `    ${passed ? "✅" : "❌"} Canvas: exists: ${
        result.pipelineExists
      }, custom: ${result.hasCustomElements}`
    );

    return { passed, details: result };
  }

  // ===== UTILS =====
  updateTestCount(passed) {
    this.results.totalTests++;
    if (passed) {
      this.results.passedTests++;
    } else {
      this.results.failedTests++;
    }
  }

  async generateReport() {
    console.log("\n📋 GERANDO RELATÓRIO FINAL...");

    // Calcular performance
    this.results.performance = {
      successRate: (
        (this.results.passedTests / this.results.totalTests) *
        100
      ).toFixed(1),
      moduleCount: Object.keys(this.results.modules).length,
      criticalIssueCount: this.results.criticalIssues.length,
      errorCount: this.results.errors.length,
    };

    // Feature status
    this.results.featureStatus = {
      nucleoEstruturalOK: this.results.modules.nucleoEstrutural
        ? Object.values(this.results.modules.nucleoEstrutural).every(
            (m) => m.passed
          )
        : false,
      addonsSystemOK: this.results.modules.addonsExtensions
        ? Object.values(this.results.modules.addonsExtensions).filter(
            (m) => m.passed
          ).length >= 2
        : false,
      crudFunctionalOK: this.results.modules.crudInteractions
        ? Object.values(this.results.modules.crudInteractions).filter(
            (m) => m.passed
          ).length >= 3
        : false,
      layoutsOK: this.results.modules.specialLayouts
        ? Object.values(this.results.modules.specialLayouts).filter(
            (m) => m.passed
          ).length >= 2
        : false,
    };

    // Screenshot final
    await this.page.screenshot({
      path: `outputs/master-test-${Date.now()}.png`,
      fullPage: true,
    });

    // Salvar relatório
    const reportPath = `outputs/master-comprehensive-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log(`\n💾 Relatório salvo: ${reportPath}`);

    return this.results;
  }

  async run() {
    try {
      await this.initialize();

      await this.testNucleoEstruturalModule();
      await this.testAddonsExtensionsModule();
      await this.testCrudInteractionsModule();
      await this.testSpecialLayoutsModule();

      const finalReport = await this.generateReport();

      console.log("\n" + "=".repeat(80));
      console.log("🎯 RESULTADO FINAL DO MASTER TEST");
      console.log("=".repeat(80));
      console.log(
        `📊 Taxa de Sucesso: ${finalReport.performance.successRate}%`
      );
      console.log(
        `✅ Testes Aprovados: ${finalReport.passedTests}/${finalReport.totalTests}`
      );
      console.log(`🚨 Issues Críticas: ${finalReport.criticalIssueCount}`);
      console.log(`⚠️ Erros JavaScript: ${finalReport.errorCount}`);

      console.log("\n📋 STATUS POR MÓDULO:");
      console.log(
        `  Núcleo Estrutural: ${
          finalReport.featureStatus.nucleoEstruturalOK ? "✅" : "❌"
        }`
      );
      console.log(
        `  Sistema de Addons: ${
          finalReport.featureStatus.addonsSystemOK ? "✅" : "❌"
        }`
      );
      console.log(
        `  CRUD Funcional: ${
          finalReport.featureStatus.crudFunctionalOK ? "✅" : "❌"
        }`
      );
      console.log(
        `  Layouts Especiais: ${
          finalReport.featureStatus.layoutsOK ? "✅" : "❌"
        }`
      );

      if (finalReport.criticalIssues.length > 0) {
        console.log("\n🚨 ISSUES CRÍTICAS:");
        finalReport.criticalIssues.forEach((issue) =>
          console.log(`  - ${issue}`)
        );
      }

      console.log("\n🎯 SISTEMA SECTIONMASTER:");
      if (finalReport.performance.successRate >= 70) {
        console.log("🟢 SISTEMA FUNCIONAL - Pronto para uso!");
      } else if (finalReport.performance.successRate >= 50) {
        console.log("🟡 SISTEMA PARCIALMENTE FUNCIONAL - Necessita ajustes");
      } else {
        console.log("🔴 SISTEMA COM PROBLEMAS - Requer correções importantes");
      }

      console.log("=".repeat(80));

      return finalReport;
    } catch (error) {
      console.error("❌ Erro no Master Test:", error);
      this.results.errors.push({
        type: "CRITICAL_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      });

      return this.results;
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
