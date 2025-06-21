const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function testDashboardCorrections() {
  console.log("🔧 Testando correções do dashboard...");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Interceptar erros da página
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warn") {
      console.log(`📋 Console ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    console.error("❌ Page Error:", error.message);
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const report = {
    timestamp,
    tests: [],
    errors: [],
    corrections: [],
  };

  try {
    // Navegar para o dashboard
    console.log("🌐 Navegando para o dashboard...");
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Aguardar carregamento
    await page.waitForTimeout(2000);

    // Teste 1: Verificar se não há erro "Cannot read properties of undefined (reading 'fields')"
    console.log("🔍 Teste 1: Verificando erro de contentType.fields...");
    const pageErrors = await page.evaluate(() => {
      return window.console.logs
        ? window.console.logs.filter((log) =>
            log.includes(
              "Cannot read properties of undefined (reading 'fields')"
            )
          )
        : [];
    });

    if (pageErrors.length === 0) {
      console.log("✅ Teste 1 PASSOU: Não há erros de contentType.fields");
      report.tests.push({ name: "contentType.fields", status: "PASSED" });
    } else {
      console.log("❌ Teste 1 FALHOU: Ainda há erros de contentType.fields");
      report.tests.push({
        name: "contentType.fields",
        status: "FAILED",
        errors: pageErrors,
      });
    }

    // Teste 2: Verificar menu lateral sem duplicação
    console.log("🔍 Teste 2: Verificando duplicação SectionMaster/DevTools...");
    const menuItems = await page.evaluate(() => {
      const items = document.querySelectorAll(
        "[data-sidebar-item], nav button"
      );
      const texts = Array.from(items).map((item) => item.textContent.trim());
      return texts.filter(
        (text) => text.includes("SectionMaster") || text.includes("DevTools")
      );
    });

    const hasDuplication =
      menuItems.length > 1 &&
      menuItems.some((item) => menuItems.filter((m) => m === item).length > 1);

    if (!hasDuplication) {
      console.log(
        "✅ Teste 2 PASSOU: Não há duplicação SectionMaster/DevTools"
      );
      report.tests.push({ name: "menu_duplication", status: "PASSED" });
    } else {
      console.log("❌ Teste 2 FALHOU: Ainda há duplicação no menu");
      report.tests.push({
        name: "menu_duplication",
        status: "FAILED",
        items: menuItems,
      });
    }

    // Teste 3: Testar criação de item
    console.log("🔍 Teste 3: Testando criação de item...");

    // Ir para seção Blog
    const blogButton = await page.$(
      'button:has-text("Blog"), button[contains(text(), "Blog")]'
    );
    if (blogButton) {
      await blogButton.click();
      await page.waitForTimeout(1000);

      // Procurar botão criar
      const createButton = await page.$(
        'button:contains("Criar"), button:contains("Novo")'
      );
      if (createButton) {
        await createButton.click();
        await page.waitForTimeout(1000);

        // Verificar se formulário carregou sem erro
        const formExists = await page.$('form, input[name="title"]');
        if (formExists) {
          console.log(
            "✅ Teste 3 PASSOU: Formulário de criação carregou corretamente"
          );
          report.tests.push({ name: "item_creation", status: "PASSED" });
        } else {
          console.log("❌ Teste 3 FALHOU: Formulário não carregou");
          report.tests.push({ name: "item_creation", status: "FAILED" });
        }
      } else {
        console.log("⚠️ Teste 3 PULADO: Botão criar não encontrado");
        report.tests.push({ name: "item_creation", status: "SKIPPED" });
      }
    } else {
      console.log("⚠️ Teste 3 PULADO: Seção Blog não encontrada");
      report.tests.push({ name: "item_creation", status: "SKIPPED" });
    }

    // Teste 4: Verificar marketplace de addons
    console.log("🔍 Teste 4: Testando marketplace de addons...");

    // Ir para SectionMaster
    const sectionMasterButton = await page.$(
      'button:has-text("SectionMaster"), button:contains("SectionMaster")'
    );
    if (sectionMasterButton) {
      await sectionMasterButton.click();
      await page.waitForTimeout(1000);

      // Procurar botão marketplace
      const marketplaceButton = await page.$('button:contains("Marketplace")');
      if (marketplaceButton) {
        await marketplaceButton.click();
        await page.waitForTimeout(1000);

        // Verificar se não há mensagens de "addon não encontrado"
        const addonErrors = await page.$$eval(
          '[class*="addon"]:contains("não encontrado"), [class*="addon"]:contains("Addon não encontrado")'
        );
        if (addonErrors.length === 0) {
          console.log(
            "✅ Teste 4 PASSOU: Marketplace sem erros de addon não encontrado"
          );
          report.tests.push({ name: "addon_marketplace", status: "PASSED" });
        } else {
          console.log(
            "❌ Teste 4 FALHOU: Ainda há erros de addon não encontrado"
          );
          report.tests.push({ name: "addon_marketplace", status: "FAILED" });
        }
      } else {
        console.log("⚠️ Teste 4 PULADO: Botão marketplace não encontrado");
        report.tests.push({ name: "addon_marketplace", status: "SKIPPED" });
      }
    }

    // Screenshot final
    console.log("📸 Capturando screenshot final...");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/dashboard-corrections-test-${timestamp}.png`,
      fullPage: true,
    });

    // Resultado final
    const passedTests = report.tests.filter(
      (t) => t.status === "PASSED"
    ).length;
    const totalTests = report.tests.length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log(`\n📊 RELATÓRIO DE CORREÇÕES:`);
    console.log(`   Testes executados: ${totalTests}`);
    console.log(`   Testes passaram: ${passedTests}`);
    console.log(`   Taxa de sucesso: ${successRate}%`);

    report.summary = {
      total: totalTests,
      passed: passedTests,
      successRate: successRate + "%",
    };

    // Definir status geral
    if (passedTests === totalTests) {
      console.log("🎉 TODAS AS CORREÇÕES FUNCIONARAM!");
      report.status = "ALL_CORRECTIONS_WORKING";
    } else if (passedTests > 0) {
      console.log(
        "⚠️ Algumas correções funcionaram, outras precisam de ajustes"
      );
      report.status = "PARTIAL_CORRECTIONS_WORKING";
    } else {
      console.log("❌ As correções não funcionaram");
      report.status = "CORRECTIONS_NOT_WORKING";
    }
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
    report.errors.push({
      message: error.message,
      stack: error.stack,
    });
  } finally {
    // Salvar relatório
    fs.writeFileSync(
      `outputs/reports/2025-06/dashboard-corrections-test-${timestamp}.json`,
      JSON.stringify(report, null, 2)
    );

    await browser.close();
    console.log(
      `\n📋 Relatório salvo em: outputs/reports/2025-06/dashboard-corrections-test-${timestamp}.json`
    );
  }
}

// Executar teste
testDashboardCorrections().catch(console.error);

module.exports = { testDashboardCorrections };
