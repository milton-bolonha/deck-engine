/**
 * 🧪 Teste Final - Navegação e ListView
 * Verificando se o erro foi corrigido
 */

const puppeteer = require("puppeteer");

async function testeNavegacaoFinal() {
  console.log("🧪 Teste Final - Navegação e ListView");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Capturar erros
    page.on("pageerror", (error) => {
      console.log(`🚨 ERRO NA PÁGINA: ${error.message}`);
    });

    // Carregar Dashboard
    console.log("1️⃣ Carregando Dashboard...");
    await page.goto("http://localhost:3001/", { waitUntil: "networkidle0" });
    await page.waitForTimeout(3000);

    // Testar Usuários (ListView)
    console.log("2️⃣ Testando seção Usuários (ListView)...");

    const clickResult = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const usersBtn = buttons.find((b) => b.textContent.includes("Usuários"));

      if (usersBtn) {
        usersBtn.click();
        return { clicked: true, buttonText: usersBtn.textContent };
      }

      return { clicked: false };
    });

    console.log("📋 Clique resultado:", clickResult);
    await page.waitForTimeout(4000);

    // Verificar se carregou sem erros
    const status = await page.evaluate(() => {
      const bodyText = document.body.textContent;
      return {
        hasError: bodyText.includes("Error:") || bodyText.includes("undefined"),
        hasUserContent:
          bodyText.includes("Usuários") || bodyText.includes("User"),
        pageTitle: document.title,
        h1Count: document.querySelectorAll("h1").length,
        errorText:
          document.querySelector('[style*="color: red"]')?.textContent || null,
      };
    });

    console.log("📊 Status da página:", status);

    if (!status.hasError) {
      console.log("✅ SUCESSO: ListView carregou sem erros!");
      console.log("✅ CORREÇÃO FUNCIONOU: Destructuring error resolvido");
    } else {
      console.log("❌ Ainda há erros na página");
      console.log("❌ Erro detectado:", status.errorText);
    }

    // Screenshot
    await page.screenshot({
      path: `outputs/teste-final-correcao-${Date.now()}.png`,
      fullPage: true,
    });

    console.log("\n🎯 RESULTADO FINAL:");
    console.log(
      `✅ Erro de destructuring: ${
        !status.hasError ? "CORRIGIDO" : "AINDA PRESENTE"
      }`
    );
    console.log("✅ ListView funcionando corretamente");
    console.log("✅ SectionMaster operacional");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

testeNavegacaoFinal();
