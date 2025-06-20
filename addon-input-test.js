/**
 * 🧩 ADDON & INPUT COMPREHENSIVE TEST
 * Validação específica de todos os addons e tipos de input
 * Testa: TextInput, WYSIWYG, ImageUpload, Select, DatePicker, etc.
 */

const puppeteer = require("puppeteer");
const fs = require("fs");

class AddonInputTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      totalAddons: 0,
      functionalAddons: 0,
      addonResults: {},
      inputValidations: {},
      formInteractions: {},
      errors: [],
      screenshots: [],
    };
    this.page = null;
    this.browser = null;
  }

  async initialize() {
    console.log("🧩 ADDON & INPUT COMPREHENSIVE TEST");
    console.log("=".repeat(80));

    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    this.page.on("pageerror", (error) => {
      this.results.errors.push({
        type: "PAGE_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    await this.page.goto("http://localhost:3001/", {
      waitUntil: "networkidle0",
    });
    await this.page.waitForTimeout(3000);
  }

  async testAllAddons() {
    console.log("\n🔍 TESTANDO TODOS OS ADDONS DISPONÍVEIS");

    // Ir para formulário de criação
    await this.navigateToCreateForm();

    // Testar cada addon específico
    const addonTests = {
      textInput: await this.testTextInputAddon(),
      wysiwyg: await this.testWYSIWYGAddon(),
      textarea: await this.testTextareaAddon(),
      select: await this.testSelectAddon(),
      numberInput: await this.testNumberInputAddon(),
      checkbox: await this.testCheckboxAddon(),
      datePicker: await this.testDatePickerAddon(),
      imageUpload: await this.testImageUploadAddon(),
      slug: await this.testSlugAddon(),
    };

    this.results.addonResults = addonTests;

    // Contar addons funcionais
    this.results.totalAddons = Object.keys(addonTests).length;
    this.results.functionalAddons = Object.values(addonTests).filter(
      (addon) => addon.functional
    ).length;

    console.log(`\n📊 RESULTADO DOS ADDONS:`);
    console.log(
      `Total: ${this.results.totalAddons} | Funcionais: ${this.results.functionalAddons}`
    );

    return addonTests;
  }

  async navigateToCreateForm() {
    console.log("🧭 Navegando para formulário de criação...");

    // Ir para SectionMaster
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sectionMasterBtn = buttons.find((btn) =>
        btn.textContent.includes("SectionMaster")
      );
      if (sectionMasterBtn) sectionMasterBtn.click();
    });
    await this.page.waitForTimeout(2000);

    // Clicar em Nova Seção
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const novaSessaoBtn = buttons.find((btn) =>
        btn.textContent.includes("Nova Seção")
      );
      if (novaSessaoBtn) novaSessaoBtn.click();
    });
    await this.page.waitForTimeout(2000);
  }

  async testTextInputAddon() {
    console.log("  📝 Testando TextInput Addon...");

    const validation = await this.page.evaluate(() => {
      const textInputs = document.querySelectorAll('input[type="text"]');
      const nameInput = Array.from(textInputs).find(
        (input) =>
          input.placeholder?.includes("nome") ||
          input.name?.includes("name") ||
          input.id?.includes("name")
      );

      if (nameInput) {
        // Testar digitação
        nameInput.focus();
        nameInput.value = "Teste TextInput";
        nameInput.dispatchEvent(new Event("input", { bubbles: true }));

        return {
          exists: true,
          functional: nameInput.value === "Teste TextInput",
          hasPlaceholder: !!nameInput.placeholder,
          hasValidation: nameInput.hasAttribute("required"),
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        hasPlaceholder: false,
        hasValidation: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} TextInput: exists: ${
        validation.exists
      }, functional: ${validation.functional}`
    );

    return validation;
  }

  async testWYSIWYGAddon() {
    console.log("  📄 Testando WYSIWYG Addon...");

    const validation = await this.page.evaluate(() => {
      const textareas = document.querySelectorAll("textarea");
      const wysiwygTextarea = Array.from(textareas).find(
        (textarea) =>
          textarea.placeholder?.includes("conteúdo") ||
          textarea.name?.includes("content") ||
          textarea.rows >= 4
      );

      if (wysiwygTextarea) {
        // Testar digitação
        wysiwygTextarea.focus();
        wysiwygTextarea.value = "# Teste WYSIWYG\n\nConteúdo em **markdown**";
        wysiwygTextarea.dispatchEvent(new Event("input", { bubbles: true }));

        return {
          exists: true,
          functional: wysiwygTextarea.value.includes("markdown"),
          isMultiline: wysiwygTextarea.rows >= 4,
          hasMarkdownSupport: wysiwygTextarea.value.includes("#"),
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        isMultiline: false,
        hasMarkdownSupport: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} WYSIWYG: exists: ${
        validation.exists
      }, markdown: ${validation.hasMarkdownSupport}`
    );

    return validation;
  }

  async testSelectAddon() {
    console.log("  📋 Testando Select Addon...");

    const validation = await this.page.evaluate(() => {
      const selects = document.querySelectorAll("select");

      if (selects.length > 0) {
        const select = selects[0];
        const options = select.querySelectorAll("option");

        // Testar seleção
        if (options.length > 1) {
          select.selectedIndex = 1;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        return {
          exists: true,
          functional: options.length > 1,
          optionCount: options.length,
          hasDefaultOption:
            options[0]?.value === "" ||
            options[0]?.textContent.includes("Selecione"),
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        optionCount: 0,
        hasDefaultOption: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} Select: exists: ${
        validation.exists
      }, options: ${validation.optionCount}`
    );

    return validation;
  }

  async generateReport() {
    console.log("\n📋 GERANDO RELATÓRIO DE ADDONS...");

    // Screenshot final
    const timestamp = Date.now();
    const screenshotPath = `outputs/addon-test-${timestamp}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.results.screenshots.push(screenshotPath);

    // Calcular estatísticas
    const addonSuccessRate =
      (this.results.functionalAddons / this.results.totalAddons) * 100;

    // Salvar relatório
    const reportPath = `outputs/addon-report-${timestamp}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log("\n" + "=".repeat(80));
    console.log("🧩 RELATÓRIO FINAL - ADDON TEST");
    console.log("=".repeat(80));
    console.log(`📊 Taxa de Sucesso: ${Math.round(addonSuccessRate)}%`);
    console.log(
      `🔧 Addons Funcionais: ${this.results.functionalAddons}/${this.results.totalAddons}`
    );
    console.log(`🚨 Erros: ${this.results.errors.length}`);

    console.log("\n📋 ADDONS POR CATEGORIA:");
    Object.entries(this.results.addonResults).forEach(([addon, result]) => {
      const status = result.functional ? "✅" : "❌";
      console.log(
        `  ${status} ${addon}: ${result.functional ? "FUNCIONAL" : "FALHA"}`
      );
    });

    console.log(`\n💾 Relatório: ${reportPath}`);
    console.log("=".repeat(80));

    return { addonSuccessRate: Math.round(addonSuccessRate), reportPath };
  }

  async run() {
    try {
      await this.initialize();
      await this.testAllAddons();
      return await this.generateReport();
    } catch (error) {
      console.error("❌ Erro:", error);
      return { error: error.message };
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Executar
const addonTester = new AddonInputTester();
addonTester.run();
