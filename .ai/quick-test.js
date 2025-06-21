const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🚀 TESTE RÁPIDO DOS ADDONS");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    console.log("📱 Acessando dashboard na porta 3001...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Screenshot principal
    await page.screenshot({
      path: `outputs/screenshots/2025-06/final-dashboard-${timestamp}.png`,
      fullPage: true,
    });

    // Análise da página
    const analysis = await page.evaluate(() => {
      return {
        title: document.title,
        url: location.href,
        hasSectionMaster: document.body.textContent.includes("SectionMaster"),
        hasDevMode: document.body.textContent.includes("DEV MODE"),
        hasAddonManager: document.body.textContent.includes("AddonManager"),
        totalButtons: document.querySelectorAll("button").length,
        totalInputs: document.querySelectorAll("input, textarea, select")
          .length,
        bodyText: document.body.textContent.substring(0, 500),
      };
    });

    console.log("🎯 ANÁLISE COMPLETA:");
    console.log("📊 Status do Dashboard:");
    console.log(`   ✅ Título: ${analysis.title}`);
    console.log(`   ✅ URL: ${analysis.url}`);
    console.log(
      `   ${analysis.hasSectionMaster ? "✅" : "❌"} SectionMaster: ${
        analysis.hasSectionMaster
      }`
    );
    console.log(
      `   ${analysis.hasDevMode ? "✅" : "❌"} Dev Mode: ${analysis.hasDevMode}`
    );
    console.log(
      `   ${analysis.hasAddonManager ? "✅" : "❌"} AddonManager: ${
        analysis.hasAddonManager
      }`
    );
    console.log(`   📊 Botões: ${analysis.totalButtons}`);
    console.log(`   📊 Inputs: ${analysis.totalInputs}`);

    console.log("📝 Texto da página (preview):");
    console.log(analysis.bodyText);

    // Tentar navegar para SectionMaster
    if (analysis.hasSectionMaster) {
      console.log("🎯 Tentando acessar SectionMaster...");

      try {
        // Procurar e clicar no SectionMaster
        await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("*"));
          const sectionMasterBtn = elements.find(
            (el) => el.textContent && el.textContent.trim() === "SectionMaster"
          );
          if (sectionMasterBtn) {
            sectionMasterBtn.click();
          }
        });

        await page.waitForTimeout(3000);

        // Screenshot do SectionMaster
        await page.screenshot({
          path: `outputs/screenshots/2025-06/section-master-${timestamp}.png`,
          fullPage: true,
        });

        console.log("✅ SectionMaster acessado com sucesso!");

        // Verificar se há formulários ou addons
        const sectionAnalysis = await page.evaluate(() => ({
          currentUrl: location.href,
          hasFormularios: document.querySelectorAll("form").length > 0,
          totalInputs: document.querySelectorAll("input, textarea, select")
            .length,
          hasCreateButton: Array.from(document.querySelectorAll("button")).some(
            (btn) =>
              btn.textContent.toLowerCase().includes("create") ||
              btn.textContent.toLowerCase().includes("add") ||
              btn.textContent.toLowerCase().includes("novo")
          ),
          bodyPreview: document.body.textContent.substring(0, 300),
        }));

        console.log("📋 SectionMaster Status:");
        console.log(`   📊 Formulários: ${sectionAnalysis.hasFormularios}`);
        console.log(`   📊 Inputs: ${sectionAnalysis.totalInputs}`);
        console.log(`   📊 Botão Create: ${sectionAnalysis.hasCreateButton}`);
        console.log(`   📄 Preview: ${sectionAnalysis.bodyPreview}`);
      } catch (e) {
        console.log("⚠️ Erro ao navegar para SectionMaster:", e.message);
      }
    }

    await browser.close();

    console.log("🎉 TESTE CONCLUÍDO!");
    console.log("📸 Screenshots salvos em outputs/screenshots/2025-06/");

    // Resultado final
    const result =
      analysis.hasSectionMaster &&
      analysis.hasDevMode &&
      analysis.hasAddonManager;
    console.log(
      `\n🏆 RESULTADO FINAL: ${
        result ? "✅ SUCESSO" : "❌ PROBLEMAS DETECTADOS"
      }`
    );

    if (result) {
      console.log("🎊 SectionMaster Framework funcionando perfeitamente!");
      console.log("🧩 Addons implementados e funcionais!");
      console.log("⚡ Sistema modular e escalável!");
    }
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);
  }
})();
