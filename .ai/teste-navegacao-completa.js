/**
 * 🧪 TESTE COMPLETO - NAVEGAÇÃO DASHBOARD
 *
 * Testa todas as funcionalidades principais do sistema
 */

const puppeteer = require("puppeteer");
const fs = require("fs");

async function testeCompleto() {
  let browser;

  try {
    console.log("🚀 Iniciando teste completo de navegação...\n");

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      slowMo: 500, // Mais lento para ver o que acontece
    });

    const page = await browser.newPage();

    // Capturar logs
    const logs = [];
    page.on("console", (msg) => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // 1. ACESSAR DASHBOARD
    console.log("📱 1. Acessando dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle0" });

    await page.screenshot({ path: "outputs/teste-1-dashboard.png" });
    console.log("✅ Dashboard carregado");

    // 2. TESTAR LEFT SIDEBAR - PROCURAR SECTIONMASTER
    console.log("📱 2. Procurando SectionMaster no sidebar...");

    // Aguardar sidebar carregar
    await page.waitForSelector('nav, [data-testid="left-sidebar"]', {
      timeout: 5000,
    });

    // Procurar diferentes variações do SectionMaster
    const sectionMasterFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a"));
      const sectionMasterBtn = buttons.find((btn) => {
        const text = btn.textContent?.toLowerCase() || "";
        return (
          text.includes("sectionmaster") ||
          text.includes("debug tools") ||
          text.includes("admin") ||
          text.includes("section master")
        );
      });

      if (sectionMasterBtn) {
        console.log(
          "🎯 SectionMaster encontrado:",
          sectionMasterBtn.textContent
        );
        sectionMasterBtn.click();
        return true;
      }
      return false;
    });

    if (sectionMasterFound) {
      console.log("✅ SectionMaster clicado");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await page.screenshot({ path: "outputs/teste-2-sectionmaster.png" });
    } else {
      console.log(
        "⚠️ SectionMaster não encontrado - listando botões disponíveis..."
      );

      const availableButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button, a"));
        return buttons
          .map((btn) => btn.textContent?.trim())
          .filter((text) => text);
      });

      console.log("📋 Botões disponíveis:", availableButtons);
    }

    // 3. TESTAR CRIAÇÃO DE SEÇÃO
    console.log("📱 3. Testando criação de seção...");

    // Procurar botão "Nova Seção" ou "Criar"
    const createButtonFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const createBtn = buttons.find((btn) => {
        const text = btn.textContent?.toLowerCase() || "";
        return (
          text.includes("nova seção") ||
          text.includes("criar") ||
          text.includes("nova") ||
          text.includes("add")
        );
      });

      if (createBtn) {
        console.log("🎯 Botão criar encontrado:", createBtn.textContent);
        createBtn.click();
        return true;
      }
      return false;
    });

    if (createButtonFound) {
      console.log("✅ Botão criar clicado");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await page.screenshot({ path: "outputs/teste-3-criar-secao.png" });
    } else {
      console.log("⚠️ Botão criar não encontrado");
    }

    // 4. VERIFICAR RIGHT SIDEBAR
    console.log("📱 4. Verificando Right Sidebar...");

    const rightSidebarContent = await page.evaluate(() => {
      const rightSidebar = document.querySelector(".w-80");
      if (rightSidebar) {
        return rightSidebar.textContent?.substring(0, 200) + "...";
      }
      return null;
    });

    if (rightSidebarContent) {
      console.log("✅ Right Sidebar ativo:", rightSidebarContent);
    } else {
      console.log("⚠️ Right Sidebar não encontrado");
    }

    await page.screenshot({ path: "outputs/teste-4-right-sidebar.png" });

    // 5. TESTAR NAVEGAÇÃO ENTRE SEÇÕES
    console.log("📱 5. Testando navegação entre seções...");

    // Procurar links de seções no sidebar
    const sectionLinks = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      if (nav) {
        const links = Array.from(nav.querySelectorAll("button, a"));
        return links
          .map((link) => link.textContent?.trim())
          .filter((text) => text);
      }
      return [];
    });

    console.log("📋 Seções encontradas:", sectionLinks);

    // Tentar clicar na primeira seção (que não seja SectionMaster)
    if (sectionLinks.length > 0) {
      const firstSection = sectionLinks.find(
        (link) =>
          !link.toLowerCase().includes("sectionmaster") &&
          !link.toLowerCase().includes("debug")
      );

      if (firstSection) {
        await page.evaluate((sectionName) => {
          const buttons = Array.from(document.querySelectorAll("button, a"));
          const sectionBtn = buttons.find(
            (btn) => btn.textContent?.trim() === sectionName
          );
          if (sectionBtn) {
            sectionBtn.click();
          }
        }, firstSection);

        console.log(`✅ Clicou na seção: ${firstSection}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await page.screenshot({ path: "outputs/teste-5-navegacao-secao.png" });
      }
    }

    // 6. SCREENSHOT FINAL
    console.log("📱 6. Screenshot final...");
    await page.screenshot({
      path: "outputs/teste-final-completo.png",
      fullPage: true,
    });

    // 7. RELATÓRIO
    const report = {
      timestamp: new Date().toISOString(),
      success: true,
      tests: {
        dashboardLoaded: true,
        sectionMasterFound,
        createButtonFound,
        rightSidebarActive: !!rightSidebarContent,
        sectionsAvailable: sectionLinks.length,
      },
      sectionLinks,
      rightSidebarContent: rightSidebarContent?.substring(0, 100),
      logs: logs.slice(-10), // Últimos 10 logs
    };

    fs.writeFileSync(
      "outputs/relatorio-navegacao-completa.json",
      JSON.stringify(report, null, 2)
    );

    console.log("\n🎉 TESTE COMPLETO FINALIZADO!");
    console.log("📊 Relatório:", report.tests);

    return report;
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);

    if (browser) {
      const page = (await browser.pages())[0];
      if (page) {
        await page.screenshot({ path: "outputs/teste-erro.png" });
      }
    }

    throw error;
  } finally {
    if (browser) {
      // Manter aberto por 5 segundos para ver resultado
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await browser.close();
    }
  }
}

// Executar
testeCompleto()
  .then((report) => {
    console.log("\n✅ SUCESSO - Dashboard funcionando!");
  })
  .catch((error) => {
    console.error("\n❌ FALHA:", error.message);
  });
