const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const dashboardUrl = process.env.DASHBOARD_URL || "http://localhost:3001";
  const headless = process.env.HEADLESS !== "false";
  const browser = await puppeteer.launch({ headless });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);

    console.log(`🚀 Abrindo Dashboard em ${dashboardUrl}`);
    await page.goto(dashboardUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const screenshotDir = path.resolve(__dirname, "../outputs/screenshots");
    fs.mkdirSync(screenshotDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");

    // Screenshot inicial mesmo se não carregar completamente
    const errorShot = path.join(screenshotDir, `error-${ts}.png`);
    await page.screenshot({ path: errorShot, fullPage: true });
    console.log("📸 Screenshot de erro salva:", errorShot);

    // 1) Verifica sidebar esquerdo e link Overview
    await page.waitForSelector("nav", { timeout: 10000 });
    const overviewBtn = await page.$x("//button[contains(., 'Overview')]");
    if (!overviewBtn.length) throw new Error("Botão Overview não encontrado");
    console.log("✅ Overview encontrado");

    // 2) Navega para SectionMaster
    const sectionMasterBtn = await page.$x(
      "//button[contains(., 'SectionMaster') or contains(., 'Debug Tools')]"
    );
    if (!sectionMasterBtn.length)
      throw new Error("SectionMaster não encontrado");
    await sectionMasterBtn[0].click();
    console.log("➡️  Clicado SectionMaster");

    // Screenshot após clicar SectionMaster
    const afterClickShot = path.join(screenshotDir, `after-click-${ts}.png`);
    await page.screenshot({ path: afterClickShot, fullPage: true });
    console.log("📸 Screenshot após clicar SectionMaster:", afterClickShot);

    // Aguardar um pouco para o sidebar carregar
    await page.waitForTimeout(3000);

    // Aguarda RightSidebar carregando SectionBuilder
    await page.waitForXPath(
      "//*[contains(., 'Nova Seção') or contains(., 'Editar Seção') or contains(., 'SectionMaster')]",
      { timeout: 15000 }
    );
    console.log("✅ SectionBuilder carregado");

    // Screenshot
    const mainShot = path.join(screenshotDir, `dashboard-${ts}.png`);
    await page.screenshot({ path: mainShot, fullPage: true });
    console.log("📸 Screenshot salva:", mainShot);

    // 3) Abre Configurações -> Gerenciar Addons se possível
    const configBtn = await page.$x(
      "//button[contains(., 'Configurar Seção') or contains(., 'Gerenciar Addons')]"
    );
    if (configBtn.length) {
      await configBtn[0].click();
      await page.waitForTimeout(1000);
      const marketplaceBtn = await page.$x(
        "//button[contains(., 'Marketplace')]"
      );
      if (marketplaceBtn.length) {
        await marketplaceBtn[0].click();
        await page.waitForXPath("//h3[contains(., 'Marketplace de Addons')]");
        console.log("✅ Marketplace aberto");
        const marketShot = path.join(screenshotDir, `marketplace-${ts}.png`);
        await page.screenshot({ path: marketShot, fullPage: true });
      }
    }

    console.log("🎉 Teste UI concluído sem erros");
  } catch (err) {
    console.error("❌ Erro no teste UI:", err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
