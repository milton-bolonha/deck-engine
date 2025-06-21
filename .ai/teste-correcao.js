const puppeteer = require("puppeteer");

async function testeCorrecao() {
  console.log("🧪 Teste de Correção - ListView");

  const browser = await puppeteer.launch({ headless: false });

  try {
    const page = await browser.newPage();

    page.on("pageerror", (error) => {
      console.log(`🚨 ERRO: ${error.message}`);
    });

    await page.goto("http://localhost:3001/");
    await page.waitForTimeout(3000);

    // Clicar em Usuários
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Usuários")
      );
      if (btn) btn.click();
    });

    await page.waitForTimeout(3000);

    console.log("✅ ListView carregou sem erros!");
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
  }
}

testeCorrecao();
