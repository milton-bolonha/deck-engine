const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🔍 TESTE PROFUNDO - Detectando problemas");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    // Capturar erros da página
    const pageErrors = [];
    const consoleMessages = [];
    const networkErrors = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
      console.log(`[PAGE ERROR]: ${error.message}`);
    });

    page.on("console", (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      if (msg.type() === "error") {
        console.log(`[CONSOLE ERROR]: ${msg.text()}`);
      }
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()} ${response.url()}`);
        console.log(`[NETWORK ERROR]: ${response.status()} ${response.url()}`);
      }
    });

    console.log("📱 Carregando dashboard com debug completo...");
    await page.goto("http://localhost:3001", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.waitForTimeout(5000);

    // Análise detalhada
    const detailedAnalysis = await page.evaluate(() => {
      return {
        title: document.title,
        url: location.href,
        hasReact: typeof window.React !== "undefined",
        hasNext: typeof window.__NEXT_DATA__ !== "undefined",
        bodyLength: document.body ? document.body.innerHTML.length : 0,
        hasErrors:
          document.body.textContent.includes("Error") ||
          document.body.textContent.includes("500") ||
          document.body.textContent.includes("404"),
        elementCounts: {
          divs: document.querySelectorAll("div").length,
          buttons: document.querySelectorAll("button").length,
          scripts: document.querySelectorAll("script").length,
          forms: document.querySelectorAll("form").length,
          inputs: document.querySelectorAll("input, textarea, select").length,
        },
        sectionMasterStatus: {
          found: document.body.textContent.includes("SectionMaster"),
          devMode: document.body.textContent.includes("DEV MODE"),
          menuVisible: !!document.querySelector(
            'nav, [class*="sidebar"], [class*="menu"]'
          ),
        },
        firstError:
          document.querySelector('[class*="error"], .error, [data-error]')
            ?.textContent || null,
        bodyPreview: document.body.textContent.substring(0, 300),
      };
    });

    console.log("\n📊 ANÁLISE DETALHADA:");
    console.log(`   📄 Título: "${detailedAnalysis.title}"`);
    console.log(`   🔗 URL: ${detailedAnalysis.url}`);
    console.log(`   ⚛️ React carregado: ${detailedAnalysis.hasReact}`);
    console.log(`   🔷 Next.js carregado: ${detailedAnalysis.hasNext}`);
    console.log(`   📏 Tamanho do body: ${detailedAnalysis.bodyLength} chars`);
    console.log(`   ❌ Tem erros visíveis: ${detailedAnalysis.hasErrors}`);

    console.log("\n🧮 CONTAGEM DE ELEMENTOS:");
    Object.entries(detailedAnalysis.elementCounts).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });

    console.log("\n🎯 STATUS SECTIONMASTER:");
    Object.entries(detailedAnalysis.sectionMasterStatus).forEach(
      ([key, status]) => {
        console.log(`   ${key}: ${status ? "✅" : "❌"} ${status}`);
      }
    );

    if (detailedAnalysis.firstError) {
      console.log(
        `\n⚠️ PRIMEIRO ERRO ENCONTRADO: ${detailedAnalysis.firstError}`
      );
    }

    console.log("\n📄 PREVIEW DO BODY:");
    console.log(detailedAnalysis.bodyPreview);

    console.log("\n🔍 RESUMO DOS PROBLEMAS:");
    console.log(`   Erros de página: ${pageErrors.length}`);
    console.log(`   Erros de rede: ${networkErrors.length}`);
    console.log(`   Mensagens de console: ${consoleMessages.length}`);

    if (pageErrors.length > 0) {
      console.log("\n❌ ERROS DE PÁGINA:");
      pageErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    // Screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/debug-deep-${timestamp}.png`,
      fullPage: true,
    });
    console.log(`\n📸 Screenshot debug salvo: debug-deep-${timestamp}.png`);

    // Tentar clicar no SectionMaster
    if (detailedAnalysis.sectionMasterStatus.found) {
      console.log("\n🎯 Tentando clicar no SectionMaster...");

      try {
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const sectionMasterBtn = buttons.find(
            (btn) =>
              btn.textContent && btn.textContent.includes("SectionMaster")
          );

          if (sectionMasterBtn) {
            sectionMasterBtn.click();
            return true;
          }
          return false;
        });

        await page.waitForTimeout(3000);

        const sectionMasterScreenshot = `outputs/screenshots/2025-06/sectionmaster-clicked-${timestamp}.png`;
        await page.screenshot({
          path: sectionMasterScreenshot,
          fullPage: true,
        });
        console.log(
          `📸 Screenshot SectionMaster clicado: sectionmaster-clicked-${timestamp}.png`
        );
      } catch (e) {
        console.log(`⚠️ Erro ao clicar no SectionMaster: ${e.message}`);
      }
    }

    await browser.close();

    const overallHealth =
      detailedAnalysis.bodyLength > 10000 &&
      !detailedAnalysis.hasErrors &&
      detailedAnalysis.elementCounts.buttons > 5;

    console.log(
      `\n🏆 DIAGNÓSTICO FINAL: ${
        overallHealth ? "✅ SAUDÁVEL" : "⚠️ PROBLEMAS DETECTADOS"
      }`
    );
  } catch (error) {
    console.error("❌ Erro durante teste profundo:", error.message);
  }
})();
