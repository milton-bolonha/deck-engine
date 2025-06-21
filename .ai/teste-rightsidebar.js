/**
 * 🧪 Teste RightSidebar - Verificação da Correção
 */

const puppeteer = require("puppeteer");

async function testeRightSidebar() {
  console.log("🧪 Testando RightSidebar após correção");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Capturar erros
    let hasError = false;
    page.on("pageerror", (error) => {
      console.log(`🚨 ERRO: ${error.message}`);
      hasError = true;
    });

    // Carregar Dashboard
    console.log("1️⃣ Carregando Dashboard...");
    await page.goto("http://localhost:3001/", { waitUntil: "networkidle0" });
    await page.waitForTimeout(3000);

    // Ir para SectionMaster
    console.log("2️⃣ Entrando no SectionMaster...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent.includes("SectionMaster"));
      if (btn) btn.click();
    });
    await page.waitForTimeout(3000);

    // Clicar em "Nova Seção" para testar RightSidebar
    console.log('3️⃣ Clicando em "Nova Seção" para testar RightSidebar...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent.includes("Nova Seção"));
      if (btn) btn.click();
    });
    await page.waitForTimeout(3000);

    if (!hasError) {
      console.log("✅ RightSidebar carregou sem erros!");
      console.log("✅ Correção do .replace() funcionou");
    } else {
      console.log("❌ Ainda há erros no RightSidebar");
    }

    // Screenshot final
    await page.screenshot({
      path: `outputs/teste-rightsidebar-${Date.now()}.png`,
      fullPage: true,
    });

    console.log("\n🎯 RESULTADO:");
    console.log(`✅ RightSidebar: ${!hasError ? "FUNCIONANDO" : "COM ERRO"}`);
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

testeRightSidebar();
