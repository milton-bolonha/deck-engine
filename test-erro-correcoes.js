const puppeteer = require("puppeteer");

async function testErrorCorrections() {
  console.log("🔧 Teste de Correções de Erros");
  console.log("=====================================");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Interceptar erros do console
    const errors = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
      console.log("❌ Erro JavaScript:", error.message);
    });

    // Interceptar erros do console
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
        console.log("❌ Console Error:", msg.text());
      }
    });

    console.log("📍 Navegando para o dashboard...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

    // Aguardar o dashboard carregar
    await page.waitForTimeout(3000);

    console.log("🎯 Testando navegação para SectionMaster...");
    try {
      await page.click("text=SectionMaster");
      await page.waitForTimeout(2000);
      console.log("✅ SectionMaster carregou sem erros");
    } catch (error) {
      console.log("❌ Erro ao carregar SectionMaster:", error.message);
    }

    console.log("🎯 Testando diferentes seções...");
    const sections = ["blog", "users", "products"];

    for (const sectionId of sections) {
      try {
        await page.click(`text=${sectionId}`);
        await page.waitForTimeout(1500);
        console.log(`✅ Seção ${sectionId} carregou sem erros`);
      } catch (error) {
        console.log(`❌ Erro na seção ${sectionId}:`, error.message);
      }
    }

    // Testar RightSidebar
    console.log("🎯 Testando RightSidebar...");
    try {
      // Tentar clicar em algum botão que abra o sidebar
      const buttons = await page.$$("button");
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        await buttons[i].click();
        await page.waitForTimeout(500);
      }
      console.log("✅ RightSidebar testado sem erros");
    } catch (error) {
      console.log("❌ Erro no RightSidebar:", error.message);
    }

    // Resumo dos erros
    console.log("\n📊 RESUMO DOS ERROS:");
    console.log("=====================================");

    if (errors.length === 0) {
      console.log("🎉 SUCESSO: Nenhum erro JavaScript detectado!");
    } else {
      console.log(`❌ ${errors.length} erros detectados:`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    await page.screenshot({
      path: "test-error-corrections.png",
      fullPage: true,
    });
    console.log("📸 Screenshot salvo: test-error-corrections.png");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testErrorCorrections().catch(console.error);
