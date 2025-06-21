const puppeteer = require("puppeteer");

async function testQuickSidebar() {
  console.log("🔧 Teste Rápido - RightSidebar");
  console.log("===============================");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Interceptar logs específicos do RightSidebar
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("🔧 RightSidebar")) {
        console.log("📋 RightSidebar Debug:", text);
      } else if (text.includes("🎯 MainContent")) {
        console.log("🎯 MainContent:", text);
      } else if (text.includes("selectedSection")) {
        console.log("📍 Section:", text);
      }
    });

    console.log("📍 Navegando para o dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });
    await page.waitForTimeout(3000);

    console.log("🎯 Aguardando logs de inicialização...");
    await page.waitForTimeout(2000);

    console.log("🎯 Procurando por elementos clicáveis...");

    // Tentar encontrar qualquer elemento que possa ser um item
    const clickableElements = await page.$$(
      'div[class*="border"], div[class*="card"], .bg-white, button'
    );
    console.log(
      `📋 ${clickableElements.length} elementos clicáveis encontrados`
    );

    if (clickableElements.length > 3) {
      console.log("🎯 Testando clique em elemento...");
      await clickableElements[3].click(); // Tentar o 4º elemento para evitar header
      await page.waitForTimeout(1500);
    }

    // Verificar se há botões para testar
    const buttons = await page.$$("button");
    console.log(`🔘 ${buttons.length} botões encontrados`);

    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      try {
        const buttonText = await page.evaluate(
          (el) => el.textContent,
          buttons[i]
        );
        if (
          buttonText.includes("Criar") ||
          buttonText.includes("Nova") ||
          buttonText.includes("Configurar")
        ) {
          console.log(`🎯 Testando botão: "${buttonText}"`);
          await buttons[i].click();
          await page.waitForTimeout(1000);
          break;
        }
      } catch (error) {
        // Ignorar erros de botões
      }
    }

    console.log("🎯 Aguardando mais logs...");
    await page.waitForTimeout(3000);

    // Verificar RightSidebar final
    const rightSidebar = await page.$(".w-80");
    if (rightSidebar) {
      const sidebarContent = await page.evaluate(
        (el) => el.textContent,
        rightSidebar
      );
      console.log("📋 RightSidebar Status:");

      if (sidebarContent.includes("Selecione um item")) {
        console.log("❌ Ainda mostrando estado padrão");
      } else if (
        sidebarContent.includes("ItemForm") ||
        sidebarContent.includes("editar")
      ) {
        console.log("✅ RightSidebar ativo com formulário");
      } else if (sidebarContent.includes("Configurações")) {
        console.log("⚠️ RightSidebar mostrando configurações genéricas");
      } else {
        console.log("🔍 Estado desconhecido:", sidebarContent.substring(0, 50));
      }
    }

    await page.screenshot({ path: "test-quick-sidebar.png" });
    console.log("📸 Screenshot salvo");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

testQuickSidebar().catch(console.error);
