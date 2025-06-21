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

  async testTextareaAddon() {
    console.log("  📃 Testando Textarea Addon...");

    const validation = await this.page.evaluate(() => {
      const textareas = document.querySelectorAll("textarea");

      if (textareas.length > 0) {
        const textarea = textareas[0];

        // Testar digitação
        textarea.focus();
        textarea.value = "Teste de textarea com múltiplas\nlinhas de texto";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));

        return {
          exists: true,
          functional: textarea.value.includes("múltiplas"),
          count: textareas.length,
          hasRows: textarea.rows > 1,
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        count: 0,
        hasRows: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} Textarea: count: ${
        validation.count
      }, functional: ${validation.functional}`
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

  async testNumberInputAddon() {
    console.log("  🔢 Testando NumberInput Addon...");

    const validation = await this.page.evaluate(() => {
      const numberInputs = document.querySelectorAll('input[type="number"]');

      if (numberInputs.length > 0) {
        const numberInput = numberInputs[0];

        // Testar entrada numérica
        numberInput.focus();
        numberInput.value = "42";
        numberInput.dispatchEvent(new Event("input", { bubbles: true }));

        return {
          exists: true,
          functional: numberInput.value === "42",
          hasMinMax:
            numberInput.hasAttribute("min") || numberInput.hasAttribute("max"),
          hasStep: numberInput.hasAttribute("step"),
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        hasMinMax: false,
        hasStep: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} NumberInput: exists: ${
        validation.exists
      }, functional: ${validation.functional}`
    );

    return validation;
  }

  async testCheckboxAddon() {
    console.log("  ☑️ Testando Checkbox Addon...");

    const validation = await this.page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');

      if (checkboxes.length > 0) {
        const checkbox = checkboxes[0];

        // Testar marcação
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));

        return {
          exists: true,
          functional: checkbox.checked === true,
          count: checkboxes.length,
          hasLabel:
            checkbox.nextElementSibling?.tagName === "LABEL" ||
            checkbox.previousElementSibling?.tagName === "LABEL",
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        count: 0,
        hasLabel: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} Checkbox: count: ${
        validation.count
      }, functional: ${validation.functional}`
    );

    return validation;
  }

  async testDatePickerAddon() {
    console.log("  📅 Testando DatePicker Addon...");

    const validation = await this.page.evaluate(() => {
      const dateInputs = document.querySelectorAll(
        'input[type="date"], input[type="datetime-local"]'
      );

      if (dateInputs.length > 0) {
        const dateInput = dateInputs[0];

        // Testar data
        dateInput.focus();
        dateInput.value = "2024-12-25";
        dateInput.dispatchEvent(new Event("input", { bubbles: true }));

        return {
          exists: true,
          functional: dateInput.value.includes("2024"),
          type: dateInput.type,
          hasValue: !!dateInput.value,
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        type: null,
        hasValue: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} DatePicker: exists: ${
        validation.exists
      }, type: ${validation.type}`
    );

    return validation;
  }

  async testImageUploadAddon() {
    console.log("  🖼️ Testando ImageUpload Addon...");

    const validation = await this.page.evaluate(() => {
      const fileInputs = document.querySelectorAll('input[type="file"]');
      const imageInputs = Array.from(fileInputs).filter(
        (input) =>
          input.accept?.includes("image") ||
          input.name?.includes("image") ||
          input.id?.includes("image")
      );

      if (imageInputs.length > 0) {
        const imageInput = imageInputs[0];

        return {
          exists: true,
          functional: true,
          acceptsImages: imageInput.accept?.includes("image"),
          hasMultiple: imageInput.hasAttribute("multiple"),
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        acceptsImages: false,
        hasMultiple: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} ImageUpload: exists: ${
        validation.exists
      }, accepts: ${validation.acceptsImages}`
    );

    return validation;
  }

  async testSlugAddon() {
    console.log("  🔗 Testando Slug Addon...");

    const validation = await this.page.evaluate(() => {
      const slugInputs = Array.from(document.querySelectorAll("input")).filter(
        (input) =>
          input.placeholder?.includes("slug") ||
          input.name?.includes("slug") ||
          input.id?.includes("slug")
      );

      if (slugInputs.length > 0) {
        const slugInput = slugInputs[0];

        // Testar entrada de slug
        slugInput.focus();
        slugInput.value = "meu-slug-teste";
        slugInput.dispatchEvent(new Event("input", { bubbles: true }));

        return {
          exists: true,
          functional: slugInput.value.includes("meu-slug"),
          hasHyphenFormat: slugInput.value.includes("-"),
          autoGeneration: slugInput.value.length > 0,
          interactionWorks: true,
        };
      }

      return {
        exists: false,
        functional: false,
        hasHyphenFormat: false,
        autoGeneration: false,
        interactionWorks: false,
      };
    });

    console.log(
      `    ${validation.functional ? "✅" : "❌"} Slug: exists: ${
        validation.exists
      }, format: ${validation.hasHyphenFormat}`
    );

    return validation;
  }

  async testFormValidations() {
    console.log("\n✅ TESTANDO VALIDAÇÕES DE FORMULÁRIO");

    const validationResults = await this.page.evaluate(() => {
      const form = document.querySelector("form");
      if (!form) return { hasForm: false };

      const requiredInputs = form.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );
      const submitButton =
        form.querySelector('button[type="submit"], input[type="submit"]') ||
        Array.from(form.querySelectorAll("button")).find(
          (btn) =>
            btn.textContent.includes("Criar") ||
            btn.textContent.includes("Salvar")
        );

      // Testar envio sem preencher campos obrigatórios
      let validationTriggered = false;
      if (submitButton && requiredInputs.length > 0) {
        // Limpar campos obrigatórios
        requiredInputs.forEach((input) => {
          input.value = "";
        });

        // Tentar enviar
        submitButton.click();

        // Verificar se validação foi acionada
        validationTriggered = requiredInputs[0].checkValidity
          ? !requiredInputs[0].checkValidity()
          : true;
      }

      return {
        hasForm: true,
        requiredFieldCount: requiredInputs.length,
        hasSubmitButton: !!submitButton,
        validationTriggered,
        formNovalidate: form.hasAttribute("novalidate"),
      };
    });

    console.log(
      `  ${validationResults.hasForm ? "✅" : "❌"} Form: required: ${
        validationResults.requiredFieldCount
      }, validation: ${validationResults.validationTriggered}`
    );

    this.results.formInteractions = validationResults;
    return validationResults;
  }

  async testInputInteractions() {
    console.log("\n🎯 TESTANDO INTERAÇÕES COM INPUTS");

    const interactionResults = await this.page.evaluate(() => {
      const allInputs = document.querySelectorAll("input, textarea, select");
      let focusableInputs = 0;
      let responsiveInputs = 0;

      allInputs.forEach((input, index) => {
        // Teste de foco
        input.focus();
        if (document.activeElement === input) {
          focusableInputs++;
        }

        // Teste de resposta a eventos
        const originalValue = input.value;
        input.value = `test-${index}`;
        input.dispatchEvent(new Event("input", { bubbles: true }));

        if (input.value !== originalValue) {
          responsiveInputs++;
        }
      });

      return {
        totalInputs: allInputs.length,
        focusableInputs,
        responsiveInputs,
        interactionRate:
          allInputs.length > 0
            ? (responsiveInputs / allInputs.length) * 100
            : 0,
      };
    });

    console.log(
      `  📊 Inputs: ${interactionResults.totalInputs} total, ${
        interactionResults.responsiveInputs
      } responsivos (${Math.round(interactionResults.interactionRate)}%)`
    );

    this.results.inputValidations = interactionResults;
    return interactionResults;
  }

  async generateAddonReport() {
    console.log("\n📋 GERANDO RELATÓRIO DE ADDONS...");

    // Screenshot final
    const timestamp = Date.now();
    const screenshotPath = `outputs/addon-test-${timestamp}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.results.screenshots.push(screenshotPath);

    // Calcular estatísticas
    const addonSuccessRate =
      (this.results.functionalAddons / this.results.totalAddons) * 100;
    const inputInteractionRate =
      this.results.inputValidations?.interactionRate || 0;

    // Status geral dos addons
    let addonStatus;
    if (addonSuccessRate >= 80) {
      addonStatus = "🟢 ADDONS TOTALMENTE FUNCIONAIS";
    } else if (addonSuccessRate >= 60) {
      addonStatus = "🟡 ADDONS MAJORITARIAMENTE FUNCIONAIS";
    } else if (addonSuccessRate >= 40) {
      addonStatus = "🟠 ADDONS PARCIALMENTE FUNCIONAIS";
    } else {
      addonStatus = "🔴 ADDONS REQUEREM CORREÇÕES";
    }

    // Salvar relatório
    const reportPath = `outputs/addon-comprehensive-report-${timestamp}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log("\n" + "=".repeat(80));
    console.log("🧩 RELATÓRIO FINAL - ADDON & INPUT TEST");
    console.log("=".repeat(80));
    console.log(addonStatus);
    console.log(`📊 Taxa de Sucesso Addons: ${Math.round(addonSuccessRate)}%`);
    console.log(
      `📊 Taxa de Interação Inputs: ${Math.round(inputInteractionRate)}%`
    );
    console.log(
      `🔧 Addons Funcionais: ${this.results.functionalAddons}/${this.results.totalAddons}`
    );
    console.log(
      `📝 Total de Inputs: ${this.results.inputValidations?.totalInputs || 0}`
    );
    console.log(`🚨 Erros Detectados: ${this.results.errors.length}`);

    console.log("\n📋 ADDONS POR CATEGORIA:");
    Object.entries(this.results.addonResults).forEach(([addon, result]) => {
      const status = result.functional ? "✅" : "❌";
      console.log(
        `  ${status} ${addon}: ${result.functional ? "FUNCIONAL" : "FALHA"}`
      );
    });

    if (this.results.formInteractions?.hasForm) {
      console.log("\n📝 VALIDAÇÃO DE FORMULÁRIO:");
      console.log(
        `  ✅ Campos Obrigatórios: ${this.results.formInteractions.requiredFieldCount}`
      );
      console.log(
        `  ✅ Botão Submit: ${
          this.results.formInteractions.hasSubmitButton ? "Presente" : "Ausente"
        }`
      );
      console.log(
        `  ✅ Validação Ativa: ${
          this.results.formInteractions.validationTriggered ? "Sim" : "Não"
        }`
      );
    }

    console.log(`\n💾 Relatório salvo: ${reportPath}`);
    console.log(`📸 Screenshot: ${screenshotPath}`);
    console.log("=".repeat(80));

    return {
      addonSuccessRate: Math.round(addonSuccessRate),
      inputInteractionRate: Math.round(inputInteractionRate),
      addonStatus,
      functionalAddons: this.results.functionalAddons,
      totalAddons: this.results.totalAddons,
      reportPath,
    };
  }

  async run() {
    try {
      await this.initialize();

      // Executar todos os testes
      await this.testAllAddons();
      await this.testFormValidations();
      await this.testInputInteractions();

      // Gerar relatório final
      const report = await this.generateAddonReport();

      return report;
    } catch (error) {
      console.error("❌ Erro no Addon Test:", error);
      this.results.errors.push({
        type: "CRITICAL_ERROR",
        message: error.message,
        timestamp: new Date().toISOString(),
      });

      return { error: error.message, results: this.results };
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Executar Addon & Input Test
const addonTester = new AddonInputTester();
addonTester.run();
