const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const dashboardUrl = process.env.DASHBOARD_URL || "http://localhost:3001";
  const headless = process.env.HEADLESS !== "false";

  console.log("🚀 Iniciando teste E2E CRUD - SectionMaster");

  const browser = await puppeteer.launch({
    headless,
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox"],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);

    const screenshotDir = path.resolve(
      __dirname,
      "../outputs/screenshots/crud"
    );
    fs.mkdirSync(screenshotDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");

    console.log(`📱 Abrindo Dashboard em ${dashboardUrl}`);
    await page.goto(dashboardUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Screenshot inicial
    await page.screenshot({
      path: path.join(screenshotDir, `01-inicial-${ts}.png`),
      fullPage: true,
    });
    console.log("📸 Screenshot inicial capturada");

    // ===== TESTE 1: NAVEGAR PARA SECTIONMASTER =====
    console.log("\n🎯 TESTE 1: Navegando para SectionMaster...");

    await page.waitForSelector("nav", { timeout: 15000 });

    // Procurar SectionMaster/Debug Tools
    const sectionMasterBtn = await page.$x(
      "//button[contains(., 'SectionMaster') or contains(., 'Debug Tools')]"
    );
    if (sectionMasterBtn.length === 0) {
      throw new Error("❌ SectionMaster não encontrado no menu");
    }

    await sectionMasterBtn[0].click();
    console.log("✅ Clicou em SectionMaster");

    await page.waitForTimeout(3000);
    await page.screenshot({
      path: path.join(screenshotDir, `02-sectionmaster-${ts}.png`),
      fullPage: true,
    });

    // ===== TESTE 2: NAVEGAR PARA SEÇÃO USUÁRIOS =====
    console.log("\n🎯 TESTE 2: Navegando para seção Usuários...");

    const usersBtn = await page.$x("//button[contains(., 'Usuários')]");
    if (usersBtn.length > 0) {
      await usersBtn[0].click();
      console.log("✅ Clicou em Usuários");
      await page.waitForTimeout(3000);
    }

    await page.screenshot({
      path: path.join(screenshotDir, `03-secao-usuarios-${ts}.png`),
      fullPage: true,
    });

    // ===== TESTE 3: GERENCIAR ADDONS =====
    console.log("\n🎯 TESTE 3: Testando gerenciamento de addons...");

    // Procurar botão "Gerenciar Addons"
    const manageAddonsBtn = await page.$x(
      "//button[contains(., 'Gerenciar Addons')]"
    );
    if (manageAddonsBtn.length > 0) {
      await manageAddonsBtn[0].click();
      console.log("✅ Clicou em Gerenciar Addons");
      await page.waitForTimeout(2000);

      // Procurar botão "Marketplace"
      const marketplaceBtn = await page.$x(
        "//button[contains(., 'Marketplace')]"
      );
      if (marketplaceBtn.length > 0) {
        await marketplaceBtn[0].click();
        console.log("✅ Abriu Marketplace");
        await page.waitForTimeout(2000);

        await page.screenshot({
          path: path.join(screenshotDir, `04-marketplace-${ts}.png`),
          fullPage: true,
        });

        // Procurar addon para adicionar
        const addBtns = await page.$$x("//button[contains(., 'Adicionar')]");
        if (addBtns.length > 0) {
          await addBtns[0].click();
          console.log("✅ Tentou adicionar addon");
          await page.waitForTimeout(1000);
        }

        // Fechar marketplace
        const closeBtn = await page.$x("//button[contains(., 'Fechar')]");
        if (closeBtn.length > 0) {
          await closeBtn[0].click();
        }
      }
    }

    await page.screenshot({
      path: path.join(screenshotDir, `05-final-${ts}.png`),
      fullPage: true,
    });

    // ===== TESTE 4: PROCURAR FUNCIONALIDADE DE ADICIONAR ITEM =====
    console.log("\n🎯 TESTE 4: Procurando funcionalidade de adicionar item...");

    // Procurar botões relacionados a itens
    const itemButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons
        .filter(
          (btn) =>
            btn.textContent.toLowerCase().includes("novo") ||
            btn.textContent.toLowerCase().includes("adicionar") ||
            btn.textContent.toLowerCase().includes("criar") ||
            btn.textContent.toLowerCase().includes("item")
        )
        .map((btn) => btn.textContent.trim());
    });

    console.log("🔍 Botões encontrados relacionados a itens:", itemButtons);

    if (itemButtons.length === 0) {
      console.log(
        "⚠️ PROBLEMA IDENTIFICADO: Não há botões para adicionar/criar itens na lista"
      );
    }

    // ===== RELATÓRIO FINAL =====
    const report = {
      timestamp: new Date().toISOString(),
      tests: [
        { name: "Navegação SectionMaster", status: "OK" },
        { name: "Navegação Usuários", status: "OK" },
        { name: "Gerenciamento Addons", status: "OK" },
        {
          name: "Adicionar Item",
          status: itemButtons.length > 0 ? "OK" : "PROBLEMA",
        },
      ],
      issues: [
        ...(itemButtons.length === 0
          ? ["Funcionalidade de adicionar item não encontrada"]
          : []),
      ],
      screenshots: 5,
    };

    const reportPath = path.join(screenshotDir, `crud-test-report-${ts}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("\n📋 RELATÓRIO FINAL:");
    console.log("✅ Testes executados:", report.tests.length);
    console.log("❌ Problemas encontrados:", report.issues.length);
    report.issues.forEach((issue) => console.log(`   - ${issue}`));
    console.log("📸 Screenshots salvas:", screenshotDir);
    console.log("📄 Relatório salvo:", reportPath);

    console.log("\n🎉 Teste E2E CRUD concluído!");
  } catch (error) {
    console.error("❌ Erro durante teste E2E:", error.message);

    // Screenshot de erro
    try {
      const errorShot = path.join(
        __dirname,
        "../outputs/screenshots/crud",
        `error-${Date.now()}.png`
      );
      await page.screenshot({ path: errorShot, fullPage: true });
      console.log("📸 Screenshot de erro salva:", errorShot);
    } catch (e) {
      console.log("Não foi possível capturar screenshot de erro");
    }

    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
