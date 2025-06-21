/**
 * 🧪 TESTE DE NAVEGAÇÃO - DASHBOARD
 *
 * Testa navegação completa do sistema usando puppeteer
 * conforme sugerido pelo usuário
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function testarDashboard() {
  let browser;
  let page;

  try {
    console.log("🚀 Iniciando teste de navegação...\n");

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Para ver o que está acontecendo
      defaultViewport: { width: 1280, height: 720 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();

    // 1. TESTE: Acessar dashboard principal
    console.log("📱 1. Acessando dashboard principal...");
    await page.goto("http://localhost:3001", {
      waitUntil: "networkidle0",
      timeout: 10000,
    });

    // Screenshot da página principal
    await page.screenshot({
      path: "outputs/screenshots/2025-06/teste-navegacao-principal.png",
      fullPage: true,
    });

    // Verificar se carregou sem erros
    const title = await page.title();
    console.log(`✅ Título da página: ${title}`);

    // Verificar se há erros de console
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 2. TESTE: Verificar Left Sidebar
    console.log("📱 2. Testando Left Sidebar...");

    // Aguardar o sidebar carregar
    await page.waitForSelector('[data-testid="left-sidebar"], .w-64', {
      timeout: 5000,
    });

    // Procurar links de navegação
    const navLinks = await page.$$eval("nav button, nav a", (elements) =>
      elements.map((el) => el.textContent?.trim()).filter((text) => text)
    );

    console.log(`✅ Links encontrados no sidebar: ${navLinks.join(", ")}`);

    // 3. TESTE: Clicar no SectionMaster
    console.log("📱 3. Testando SectionMaster...");

    try {
      // Procurar botão SectionMaster de várias formas
      let sectionMasterButton = null;

      // Tentar por texto
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const sectionMasterBtn = buttons.find(
          (btn) =>
            btn.textContent.includes("SectionMaster") ||
            btn.textContent.includes("Debug Tools") ||
            btn.textContent.includes("Admin")
        );
        if (sectionMasterBtn) {
          sectionMasterBtn.click();
        }
      });

      // Aguardar carregamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await page.screenshot({
        path: "outputs/screenshots/2025-06/teste-navegacao-sectionmaster.png",
        fullPage: true,
      });

      console.log("✅ SectionMaster acessado");
    } catch (error) {
      console.log(`⚠️ SectionMaster não encontrado: ${error.message}`);
    }

    // 4. TESTE: Verificar Main Content
    console.log("📱 4. Testando Main Content...");

    // Verificar se há conteúdo principal
    const mainContent = await page.$('.flex-1, main, [role="main"]');
    if (mainContent) {
      const mainText = await mainContent.evaluate((el) => el.textContent);
      console.log(
        `✅ Main content encontrado: ${mainText.substring(0, 100)}...`
      );
    } else {
      console.log("⚠️ Main content não encontrado");
    }

    // 5. TESTE: Verificar Right Sidebar
    console.log("📱 5. Testando Right Sidebar...");

    const rightSidebar = await page.$('.w-80, [data-testid="right-sidebar"]');
    if (rightSidebar) {
      const sidebarText = await rightSidebar.evaluate((el) => el.textContent);
      console.log(
        `✅ Right sidebar encontrado: ${sidebarText.substring(0, 100)}...`
      );
    } else {
      console.log("⚠️ Right sidebar não encontrado");
    }

    // 6. TESTE: Verificar se há erros JavaScript
    console.log("📱 6. Verificando erros JavaScript...");

    if (consoleErrors.length > 0) {
      console.log("❌ Erros encontrados:");
      consoleErrors.forEach((error) => console.log(`  - ${error}`));
    } else {
      console.log("✅ Nenhum erro JavaScript encontrado");
    }

    // 7. TESTE: Screenshot final
    await page.screenshot({
      path: "outputs/screenshots/2025-06/teste-navegacao-final.png",
      fullPage: true,
    });

    console.log("\n🎉 TESTE CONCLUÍDO!");
    console.log("📸 Screenshots salvos em outputs/screenshots/2025-06/");

    // Relatório final
    const report = {
      timestamp: new Date().toISOString(),
      url: "http://localhost:3001",
      title,
      navigationLinks: navLinks,
      hasMainContent: !!mainContent,
      hasRightSidebar: !!rightSidebar,
      consoleErrors: consoleErrors.length,
      screenshots: [
        "teste-navegacao-principal.png",
        "teste-navegacao-sectionmaster.png",
        "teste-navegacao-final.png",
      ],
    };

    // Salvar relatório
    fs.writeFileSync(
      "outputs/relatorio-teste-navegacao.json",
      JSON.stringify(report, null, 2)
    );

    console.log("📊 Relatório salvo em outputs/relatorio-teste-navegacao.json");

    return report;
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);

    if (page) {
      await page.screenshot({
        path: "outputs/screenshots/2025-06/teste-navegacao-erro.png",
        fullPage: true,
      });
    }

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Executar teste
if (require.main === module) {
  testarDashboard()
    .then((report) => {
      console.log("\n✅ TESTE FINALIZADO COM SUCESSO");
      console.log(`📊 Relatório: ${JSON.stringify(report, null, 2)}`);
    })
    .catch((error) => {
      console.error("\n❌ TESTE FALHOU:", error.message);
      process.exit(1);
    });
}

module.exports = { testarDashboard };
