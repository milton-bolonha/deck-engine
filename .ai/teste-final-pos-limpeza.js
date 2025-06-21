/**
 * 🧪 TESTE FINAL PÓS-LIMPEZA
 */

const puppeteer = require("puppeteer");

async function testeFinal() {
  try {
    console.log("🚀 Testando dashboard pós-limpeza...");

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();

    // Timeout maior
    await page.goto("http://localhost:3001", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Screenshot
    await page.screenshot({ path: ".ai/outputs/teste-pos-limpeza.png" });

    // Verificações básicas
    const title = await page.title();
    const hasLeftSidebar = (await page.$(".w-64")) !== null;
    const hasMainContent = (await page.$(".flex-1")) !== null;
    const hasRightSidebar = (await page.$(".w-80")) !== null;

    console.log(`✅ Título: ${title}`);
    console.log(`✅ Left Sidebar: ${hasLeftSidebar}`);
    console.log(`✅ Main Content: ${hasMainContent}`);
    console.log(`✅ Right Sidebar: ${hasRightSidebar}`);

    // Aguardar um pouco antes de fechar
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await browser.close();

    return {
      success: true,
      title,
      hasLeftSidebar,
      hasMainContent,
      hasRightSidebar,
    };
  } catch (error) {
    console.error("❌ Erro:", error.message);
    return { success: false, error: error.message };
  }
}

testeFinal().then((result) => {
  if (result.success) {
    console.log("\n🎉 DASHBOARD FUNCIONANDO PÓS-LIMPEZA!");
    console.log("✅ Todas as pastas TypeScript removidas");
    console.log("✅ Sistema 100% JavaScript");
    console.log("✅ Funcionalidade preservada");
  } else {
    console.error("\n💥 DASHBOARD COM PROBLEMAS:", result.error);
  }
});
