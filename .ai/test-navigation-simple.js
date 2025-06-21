const puppeteer = require("puppeteer");

async function testNavigationSimple() {
  console.log("🧪 TESTE SIMPLES DE NAVEGAÇÃO");

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
    defaultViewport: { width: 1200, height: 800 },
  });

  const page = await browser.newPage();

  // Capturar logs do console
  page.on("console", (msg) => {
    console.log(`🖥️  BROWSER: ${msg.text()}`);
  });

  try {
    console.log("📱 Abrindo dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });

    console.log("📸 Screenshot inicial");
    await page.screenshot({ path: "test-navigation-inicial.png" });

    // Aguardar 3 segundos
    console.log("⏳ Aguardando carregamento...");
    await page.waitForTimeout(3000);

    // Encontrar e clicar em SectionMaster
    console.log("🎯 Procurando SectionMaster...");
    const sectionMasterFound = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const smButton = buttons.find(
        (btn) =>
          btn.textContent &&
          btn.textContent.toLowerCase().includes("sectionmaster")
      );

      if (smButton) {
        console.log("✅ SectionMaster encontrado, clicando...");
        smButton.click();
        return true;
      }
      return false;
    });

    if (sectionMasterFound) {
      console.log("✅ Clicou em SectionMaster");
      await page.waitForTimeout(2000);

      console.log("📸 Screenshot após click");
      await page.screenshot({ path: "test-navigation-sectionmaster.png" });

      // Verificar se conteúdo mudou
      const content = await page.evaluate(() => {
        const main = document.querySelector(
          'main, [role="main"], .main-content'
        );
        return main
          ? main.textContent.slice(0, 200)
          : "Conteúdo não encontrado";
      });

      console.log("📄 Conteúdo atual:", content);
    } else {
      console.log("❌ SectionMaster não encontrado");
    }

    console.log("🏁 Teste concluído");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

testNavigationSimple();
