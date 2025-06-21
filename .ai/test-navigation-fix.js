const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function testNavigationIssues() {
  console.log("🧪 TESTE DE NAVEGAÇÃO ENTRE SEÇÕES");
  console.log("=====================================");

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
    devtools: false,
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();

  // Capturar erros de console
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`❌ Console Error: ${msg.text()}`);
    }
  });

  // Capturar erros de rede
  page.on("response", (response) => {
    if (response.status() >= 400) {
      errors.push(`❌ Network Error: ${response.status()} - ${response.url()}`);
    }
  });

  try {
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });
    console.log("✅ Dashboard carregado");

    // Screenshot inicial
    await page.screenshot({
      path: `outputs/screenshots/2025-06/navigation-test-inicial-${
        new Date().toISOString().replace(/:/g, "-").split(".")[0]
      }.png`,
      fullPage: true,
    });

    // Aguardar carregamento
    await page.waitForTimeout(2000);

    // Testar cada seção do menu
    const sectionsToTest = [
      "overview",
      "pipelines",
      "users",
      "billing",
      "sectionmaster",
    ];

    for (let sectionId of sectionsToTest) {
      console.log(`\n🔍 Testando navegação para: ${sectionId}`);

      try {
        // Clicar na seção
        const sectionButton = await page.$(
          `button[onclick*="${sectionId}"], button:has-text("${sectionId}")`
        );
        if (!sectionButton) {
          // Tentar encontrar por texto
          const buttons = await page.$$("button");
          let found = false;

          for (let button of buttons) {
            const text = await page.evaluate((el) => el.textContent, button);
            const lowText = text.toLowerCase().trim();
            if (
              lowText.includes(sectionId.toLowerCase()) ||
              (sectionId === "overview" && lowText.includes("overview")) ||
              (sectionId === "pipelines" && lowText.includes("pipeline")) ||
              (sectionId === "users" && lowText.includes("user")) ||
              (sectionId === "billing" && lowText.includes("billing")) ||
              (sectionId === "sectionmaster" &&
                lowText.includes("sectionmaster"))
            ) {
              console.log(`  📍 Clicando em: "${text}"`);
              await button.click();
              found = true;
              break;
            }
          }

          if (!found) {
            console.log(`  ❌ Botão não encontrado para: ${sectionId}`);
            continue;
          }
        } else {
          await sectionButton.click();
        }

        // Aguardar navegação
        await page.waitForTimeout(1500);

        // Verificar se conteúdo mudou
        const mainContent = await page.$eval(
          '.main-content, main, [role="main"]',
          (el) => el.textContent.slice(0, 200)
        );
        console.log(`  ✅ Conteúdo carregado: ${mainContent.slice(0, 50)}...`);

        // Screenshot da seção
        await page.screenshot({
          path: `outputs/screenshots/2025-06/navigation-${sectionId}-${
            new Date().toISOString().replace(/:/g, "-").split(".")[0]
          }.png`,
          fullPage: true,
        });

        console.log(`  ✅ Screenshot salvo para: ${sectionId}`);
      } catch (sectionError) {
        console.log(
          `  ❌ Erro ao navegar para ${sectionId}:`,
          sectionError.message
        );
        errors.push(`Navigation Error (${sectionId}): ${sectionError.message}`);
      }
    }

    // Teste específico do SectionMaster
    console.log(`\n🔧 TESTE ESPECÍFICO DO SECTIONMASTER:`);
    try {
      // Navegar para SectionMaster
      const sectionMasterBtn = await page.$$eval("button", (buttons) => {
        const btn = buttons.find((b) =>
          b.textContent.toLowerCase().includes("sectionmaster")
        );
        if (btn) btn.click();
        return !!btn;
      });

      if (sectionMasterBtn) {
        await page.waitForTimeout(2000);

        // Verificar se tem seções listadas
        const sectionsFound = await page.$$eval("*", (elements) => {
          return elements.some(
            (el) =>
              el.textContent &&
              (el.textContent.includes("Overview") ||
                el.textContent.includes("Blog") ||
                el.textContent.includes("Dashboard"))
          );
        });

        console.log(
          `  ${sectionsFound ? "✅" : "❌"} Seções ${
            sectionsFound ? "encontradas" : "NÃO encontradas"
          }`
        );

        // Testar criar nova seção
        const newSectionBtn = await page.$(
          'button:has-text("Nova Seção"), button:has-text("Create"), button:has-text("Criar")'
        );
        if (newSectionBtn) {
          await newSectionBtn.click();
          await page.waitForTimeout(1000);
          console.log(`  ✅ Botão "Nova Seção" funciona`);
        } else {
          console.log(`  ❌ Botão "Nova Seção" não encontrado`);
        }
      } else {
        console.log(`  ❌ SectionMaster não encontrado no menu`);
      }
    } catch (smError) {
      console.log(`  ❌ Erro no teste SectionMaster:`, smError.message);
    }

    // Relatório de erros
    console.log(`\n📊 RELATÓRIO DE ERROS:`);
    if (errors.length === 0) {
      console.log("✅ Nenhum erro detectado!");
    } else {
      errors.forEach((error) => console.log(error));
    }

    // Salvar relatório detalhado
    const report = {
      timestamp: new Date().toISOString(),
      sectionsTestedCount: sectionsToTest.length,
      errorsFound: errors,
      status: errors.length === 0 ? "SUCCESS" : "ISSUES_FOUND",
    };

    fs.writeFileSync(
      `outputs/reports/2025-06/navigation-test-${
        new Date().toISOString().replace(/:/g, "-").split(".")[0]
      }.json`,
      JSON.stringify(report, null, 2)
    );
  } catch (error) {
    console.error("❌ Erro crítico no teste:", error);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

testNavigationIssues();
