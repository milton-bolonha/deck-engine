/**
 * 🧪 TESTE SIMPLES - DASHBOARD
 */

const puppeteer = require("puppeteer");

async function testeSimples() {
  try {
    console.log("🚀 Testando dashboard...");

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();

    // Capturar erros de console
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Acessar dashboard
    await page.goto("http://localhost:3001", {
      waitUntil: "networkidle0",
      timeout: 10000,
    });

    // Screenshot
    await page.screenshot({
      path: "outputs/dashboard-teste.png",
      fullPage: true,
    });

    // Verificar título
    const title = await page.title();
    console.log(`📱 Título: ${title}`);

    // Verificar se há erros
    if (errors.length > 0) {
      console.log("❌ Erros encontrados:");
      errors.forEach((error) => console.log(`  - ${error}`));
    } else {
      console.log("✅ Nenhum erro JavaScript");
    }

    // Verificar elementos principais
    const hasLeftSidebar = (await page.$(".w-64")) !== null;
    const hasMainContent = (await page.$(".flex-1")) !== null;
    const hasRightSidebar = (await page.$(".w-80")) !== null;

    console.log(`📋 Left Sidebar: ${hasLeftSidebar ? "✅" : "❌"}`);
    console.log(`📋 Main Content: ${hasMainContent ? "✅" : "❌"}`);
    console.log(`📋 Right Sidebar: ${hasRightSidebar ? "✅" : "❌"}`);

    await browser.close();

    return {
      title,
      errors: errors.length,
      hasLeftSidebar,
      hasMainContent,
      hasRightSidebar,
    };
  } catch (error) {
    console.error("❌ Erro:", error.message);
    throw error;
  }
}

testeSimples()
  .then((result) => {
    console.log("\n🎉 RESULTADO:", result);
  })
  .catch((error) => {
    console.error("\n💥 FALHOU:", error.message);
  });
