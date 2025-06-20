const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    console.log("🚀 Iniciando teste dos addons...");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

    // Screenshot principal
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputDir = "./outputs/screenshots/2025-06";

    // Criar diretório se não existir
    fs.mkdirSync(outputDir, { recursive: true });

    // 1. Screenshot do dashboard principal
    const mainScreenshot = path.join(
      outputDir,
      `dashboard-main-${timestamp}.png`
    );
    await page.screenshot({ path: mainScreenshot, fullPage: true });
    console.log("✅ Screenshot principal salvo:", mainScreenshot);

    // 2. Tentar navegar para SectionMaster
    console.log("🔍 Procurando SectionMaster...");

    try {
      // Procurar por links/botões do SectionMaster
      const sectionLinks = await page.$$eval("a, button", (elements) =>
        elements
          .filter(
            (el) =>
              el.textContent.toLowerCase().includes("section") ||
              el.href?.includes("section") ||
              el.textContent.toLowerCase().includes("admin")
          )
          .map((el) => ({
            text: el.textContent.trim(),
            href: el.href || "",
            tag: el.tagName,
          }))
      );

      console.log("Links encontrados:", sectionLinks);

      if (sectionLinks.length > 0) {
        // Tentar clicar no primeiro link relevante
        const sectionLink = sectionLinks[0];
        await page.click(`${sectionLink.tag}:contains("${sectionLink.text}")`);
        await page.waitForTimeout(3000);

        const sectionScreenshot = path.join(
          outputDir,
          `section-master-${timestamp}.png`
        );
        await page.screenshot({ path: sectionScreenshot, fullPage: true });
        console.log("✅ Screenshot SectionMaster salvo:", sectionScreenshot);

        // 3. Tentar testar formulários
        console.log("🎯 Testando formulários...");

        try {
          // Procurar por botões "Create" ou "Add"
          const createButtons = await page.$$eval("button", (buttons) =>
            buttons
              .filter(
                (btn) =>
                  btn.textContent.toLowerCase().includes("create") ||
                  btn.textContent.toLowerCase().includes("add") ||
                  btn.textContent.toLowerCase().includes("novo")
              )
              .map((btn) => btn.textContent.trim())
          );

          console.log("Botões de criar encontrados:", createButtons);

          if (createButtons.length > 0) {
            await page.click(`button:contains("${createButtons[0]}")`);
            await page.waitForTimeout(2000);

            const formScreenshot = path.join(
              outputDir,
              `addons-form-${timestamp}.png`
            );
            await page.screenshot({ path: formScreenshot, fullPage: true });
            console.log(
              "✅ Screenshot do formulário com addons salvo:",
              formScreenshot
            );
          }
        } catch (e) {
          console.log("⚠️ Não foi possível testar formulários:", e.message);
        }
      }
    } catch (e) {
      console.log("⚠️ Não foi possível navegar para SectionMaster:", e.message);
    }

    // 4. Análise da página atual
    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      forms: document.querySelectorAll("form").length,
      inputs: document.querySelectorAll("input, textarea, select").length,
      buttons: document.querySelectorAll("button").length,
      sections: document.querySelectorAll('[class*="section"], [id*="section"]')
        .length,
    }));

    console.log("📊 Análise da página:", pageInfo);

    // 5. Relatório final
    const report = {
      timestamp: new Date().toISOString(),
      screenshots: [mainScreenshot],
      pageAnalysis: pageInfo,
      addonsStatus: "Teste concluído",
      recommendations: [
        "Verificar se SectionMaster está no menu",
        "Testar formulários manualmente",
        "Validar todos os addons implementados",
      ],
    };

    const reportPath = path.join(
      "./outputs/reports/2025-06",
      `addons-test-report-${timestamp}.json`
    );
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log("📝 Relatório salvo:", reportPath);

    await browser.close();
    console.log("✅ Teste concluído!");
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.message);
  }
})();
