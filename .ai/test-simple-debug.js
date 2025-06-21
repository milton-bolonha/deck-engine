const { chromium } = require("playwright");

async function testSimpleDebug() {
  console.log("🔍 Teste simples de debug do dashboard...\n");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("🌐 Navegando para localhost:3001...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(5000);

    // Verificar se a página carregou
    const title = await page.title();
    console.log(`📄 Título da página: "${title}"`);

    // Verificar elementos básicos
    const elements = {
      Navigation: await page.locator("text=Navigation").isVisible(),
      PipesNow: await page.locator("text=PipesNow").isVisible(),
      Overview: await page.locator("text=Overview").first().isVisible(),
      SectionMaster: await page
        .locator("text=SectionMaster")
        .first()
        .isVisible(),
      "Pipeline Builder": await page
        .locator("text=Pipeline Builder")
        .isVisible(),
      "User Management": await page.locator("text=User Management").isVisible(),
      "DevMode Info": await page.locator("text=DevMode").first().isVisible(),
    };

    console.log("\n🔍 Elementos encontrados:");
    Object.entries(elements).forEach(([name, visible]) => {
      console.log(`${visible ? "✅" : "❌"} ${name}`);
    });

    // Verificar se há erros no console
    console.log("\n📋 Logs do browser:");
    page.on("console", (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === "error") {
        console.log(`❌ ERROR: ${text}`);
      } else if (type === "warn") {
        console.log(`⚠️  WARN: ${text}`);
      } else if (type === "log") {
        console.log(`ℹ️  LOG: ${text}`);
      }
    });

    // Tentar clicar em Overview se estiver visível
    if (elements["Overview"]) {
      console.log("\n🖱️  Clicando em Overview...");
      await page.locator("text=Overview").first().click();
      await page.waitForTimeout(3000);

      const overviewContent = await page
        .locator("text=Painel de controle principal")
        .isVisible();
      console.log(`📊 Overview carregou: ${overviewContent ? "SIM" : "NÃO"}`);

      if (overviewContent) {
        const metricsVisible = await page.locator("text=Pipelines").isVisible();
        const usersVisible = await page.locator("text=Users").isVisible();
        console.log(
          `📈 Métricas visíveis: Pipelines=${
            metricsVisible ? "SIM" : "NÃO"
          }, Users=${usersVisible ? "SIM" : "NÃO"}`
        );
      }
    }

    // Tentar clicar em SectionMaster se estiver visível
    if (elements["SectionMaster"]) {
      console.log("\n🖱️  Clicando em SectionMaster...");
      await page.locator("text=SectionMaster").first().click();
      await page.waitForTimeout(3000);

      const sectionMasterContent = await page
        .locator("text=Gerenciar Seções")
        .isVisible();
      console.log(
        `🎯 SectionMaster carregou: ${sectionMasterContent ? "SIM" : "NÃO"}`
      );

      if (sectionMasterContent) {
        // Procurar por botão Nova Seção
        const novaSessao = await page.locator("text=Nova Seção").isVisible();
        console.log(`➕ Botão Nova Seção: ${novaSessao ? "SIM" : "NÃO"}`);

        if (novaSessao) {
          console.log("\n🖱️  Clicando em Nova Seção...");
          await page.locator("text=Nova Seção").click();
          await page.waitForTimeout(2000);

          const formVisible = await page
            .locator('input[name="title"]')
            .isVisible();
          console.log(
            `📝 Formulário de nova seção: ${formVisible ? "SIM" : "NÃO"}`
          );

          if (formVisible) {
            // Verificar se há options de ContentType
            const selectVisible = await page
              .locator('select[name="contentTypeId"]')
              .isVisible();
            console.log(
              `🔽 Seletor de ContentType: ${selectVisible ? "SIM" : "NÃO"}`
            );

            if (selectVisible) {
              const options = await page
                .locator('select[name="contentTypeId"] option')
                .allTextContents();
              console.log(`🎨 ContentTypes disponíveis: ${options.join(", ")}`);
            }
          }
        }
      }
    }

    // Screenshot final
    const screenshot = await page.screenshot({ fullPage: true });
    const fs = require("fs");
    const path = require("path");

    const screenshotPath = `outputs/screenshots/2025-06/debug-dashboard-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.png`;
    const screenshotDir = path.dirname(screenshotPath);

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    fs.writeFileSync(screenshotPath, screenshot);
    console.log(`\n📸 Screenshot salvo: ${screenshotPath}`);

    // Aguardar interação manual
    console.log(
      "\n⏸️  Dashboard aberto para inspeção manual. Pressione Enter para continuar..."
    );
    await page.waitForTimeout(10000);
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  testSimpleDebug().catch(console.error);
}

module.exports = { testSimpleDebug };
