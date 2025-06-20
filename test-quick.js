const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🎯 TESTE RÁPIDO - SectionMaster Funcionando");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: true,
    });

    const page = await browser.newPage();

    console.log("📱 Acessando dashboard...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    const status = await page.evaluate(() => {
      return {
        title: document.title,
        hasSectionMaster: document.body.textContent.includes("SectionMaster"),
        hasDevMode: document.body.textContent.includes("DEV MODE"),
        isWorking:
          !document.body.textContent.includes("500") &&
          !document.body.textContent.includes("Error") &&
          document.title.length > 0,
      };
    });

    console.log("📊 Status Final:");
    console.log(`   ✅ Título: "${status.title}"`);
    console.log(
      `   ${status.hasSectionMaster ? "✅" : "❌"} SectionMaster: ${
        status.hasSectionMaster
      }`
    );
    console.log(
      `   ${status.hasDevMode ? "✅" : "❌"} DevMode: ${status.hasDevMode}`
    );
    console.log(
      `   ${status.isWorking ? "✅" : "❌"} Dashboard funcionando: ${
        status.isWorking
      }`
    );

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/final-status-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`📸 Screenshot salvo: final-status-${timestamp}.png`);

    await browser.close();

    if (status.isWorking && status.hasSectionMaster) {
      console.log("\n🎉 SUCESSO! SectionMaster está funcionando!");
    } else {
      console.log("\n⚠️ Ainda há problemas para resolver");
    }
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);
  }
})();
