const puppeteer = require("puppeteer");

async function testDashboardConfig() {
  console.log("🎛️ Teste do Botão Configurar Dashboard");
  console.log("======================================");

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Interceptar logs específicos
    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("🔧 RightSidebar")) {
        console.log("📋 RightSidebar Debug:", text);
      } else if (text.includes("🎯 ACTION")) {
        console.log("🎯 Action:", text);
      } else if (
        text.includes("selectedSection") ||
        text.includes("selectedItem")
      ) {
        console.log("📍 Selection:", text);
      }
    });

    console.log("📍 Navegando para o dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });
    await page.waitForTimeout(3000);

    console.log('🎯 Procurando pelo botão "Configurar"...');

    // Procurar especificamente pelo botão Configurar
    const configButtons = await page.$$eval("button", (buttons) =>
      buttons
        .map((btn) => ({
          text: btn.textContent,
          hasConfig:
            btn.textContent.includes("Configurar") ||
            btn.textContent.includes("Cog") ||
            btn.innerHTML.includes("fa-cog"),
        }))
        .filter((btn) => btn.hasConfig)
    );

    console.log(`🔘 ${configButtons.length} botões de configurar encontrados`);
    configButtons.forEach((btn) => console.log(`   - "${btn.text}"`));

    if (configButtons.length > 0) {
      console.log("🎯 Clicando no botão Configurar...");

      // Usar fallback direto com seletores mais simples
      const buttons = await page.$$("button");
      let configClicked = false;

      for (let button of buttons) {
        const text = await page.evaluate((el) => el.textContent, button);
        // Procurar pelo botão "Configurar" que não seja do SectionMaster
        if (
          text === "Configurar" ||
          (text.includes("Configurar") &&
            !text.includes("SectionMaster") &&
            !text.includes("Seção"))
        ) {
          await button.click();
          console.log(`✅ Botão "${text}" clicado`);
          configClicked = true;
          await page.waitForTimeout(2000);
          break;
        }
      }

      if (!configClicked) {
        console.log(
          "⚠️ Botão específico não encontrado, tentando primeiro Configurar..."
        );
        for (let button of buttons) {
          const text = await page.evaluate((el) => el.textContent, button);
          if (text.includes("Configurar")) {
            await button.click();
            console.log(`✅ Botão "${text}" clicado (fallback)`);
            await page.waitForTimeout(2000);
            break;
          }
        }
      }
    } else {
      console.log(
        "⚠️ Nenhum botão Configurar encontrado. Procurando alternativas..."
      );

      // Procurar por qualquer botão com ícone de configuração
      const iconButtons = await page.$$(
        '[class*="fa-cog"], [class*="fa-gear"], [class*="fa-settings"]'
      );
      if (iconButtons.length > 0) {
        console.log(
          `🔧 ${iconButtons.length} ícones de configuração encontrados`
        );
        await iconButtons[0].click();
        console.log("✅ Ícone de configuração clicado");
        await page.waitForTimeout(2000);
      }
    }

    console.log("🎯 Verificando RightSidebar após clique...");

    // Aguardar um pouco mais para logs
    await page.waitForTimeout(1000);

    // Verificar estado do RightSidebar
    const rightSidebar = await page.$(".w-80");
    if (rightSidebar) {
      const sidebarContent = await page.evaluate(
        (el) => el.textContent,
        rightSidebar
      );
      console.log("📋 RightSidebar Content Length:", sidebarContent.length);

      if (sidebarContent.includes("Selecione um item")) {
        console.log("❌ RightSidebar ainda no estado padrão");
        console.log("🔍 Conteúdo:", sidebarContent.substring(0, 100));
      } else if (
        sidebarContent.includes("ItemForm") ||
        sidebarContent.includes("configurar") ||
        sidebarContent.includes("editar")
      ) {
        console.log("✅ RightSidebar ATIVO! Mostrando formulário");
      } else if (
        sidebarContent.includes("dashboard") ||
        sidebarContent.includes("Dashboard")
      ) {
        console.log("🎛️ RightSidebar com conteúdo de dashboard");
      } else {
        console.log(
          "🔍 Estado não identificado:",
          sidebarContent.substring(0, 100)
        );
      }
    } else {
      console.log("❌ RightSidebar não encontrado");
    }

    // Screenshot final
    await page.screenshot({
      path: "test-dashboard-config.png",
      fullPage: true,
    });
    console.log("📸 Screenshot salvo");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

testDashboardConfig().catch(console.error);
