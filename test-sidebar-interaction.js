const puppeteer = require("puppeteer");

async function testSidebarInteraction() {
  console.log("🔧 Teste de Interação com RightSidebar");
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

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
        console.log("❌ Console Error:", msg.text());
      } else if (msg.text().includes("🔧 RightSidebar")) {
        console.log("🔧 Debug:", msg.text());
      }
    });

    console.log("📍 Navegando para o dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });
    await page.waitForTimeout(3000);

    console.log("🎯 Testando navegação para SectionMaster...");
    try {
      // Tentar encontrar SectionMaster no menu
      await page.waitForSelector("nav", { timeout: 5000 });

      // Procurar por texto SectionMaster
      const sectionMasterLink = await page.$x(
        "//a[contains(text(), 'SectionMaster')]"
      );
      if (sectionMasterLink.length > 0) {
        await sectionMasterLink[0].click();
        console.log("✅ SectionMaster clicado");
        await page.waitForTimeout(2000);
      } else {
        console.log(
          "⚠️ Link SectionMaster não encontrado, tentando alternativa..."
        );

        // Verificar se há um seletor direto
        const altSelector = await page.$(
          'a[href*="sectionmaster"], button:has-text("SectionMaster")'
        );
        if (altSelector) {
          await altSelector.click();
          console.log("✅ SectionMaster clicado via seletor alternativo");
          await page.waitForTimeout(2000);
        }
      }
    } catch (error) {
      console.log("❌ Erro ao navegar para SectionMaster:", error.message);
    }

    console.log("🎯 Testando criação de item...");
    try {
      // Procurar botão de criar
      const createButtons = await page.$$("button");
      let createClicked = false;

      for (let button of createButtons) {
        const text = await page.evaluate((el) => el.textContent, button);
        if (
          text.includes("Criar") ||
          text.includes("Nova") ||
          text.includes("Adicionar")
        ) {
          await button.click();
          console.log(`✅ Botão de criar clicado: "${text}"`);
          createClicked = true;
          await page.waitForTimeout(1500);
          break;
        }
      }

      if (!createClicked) {
        console.log("⚠️ Nenhum botão de criar encontrado");
      }
    } catch (error) {
      console.log("❌ Erro ao testar criação:", error.message);
    }

    console.log("🎯 Verificando RightSidebar...");
    try {
      // Verificar se RightSidebar está visível
      const rightSidebar = await page.$(".w-80");
      if (rightSidebar) {
        console.log("✅ RightSidebar encontrado");

        // Verificar conteúdo do sidebar
        const sidebarText = await page.evaluate(
          (el) => el.textContent,
          rightSidebar
        );
        console.log(
          "📝 Conteúdo do RightSidebar:",
          sidebarText.substring(0, 100) + "..."
        );

        if (sidebarText.includes("Selecione um item")) {
          console.log("⚠️ Ainda mostrando mensagem de seleção");
        } else if (sidebarText.includes("Configurações")) {
          console.log("✅ RightSidebar mostrando configurações");
        }
      } else {
        console.log("❌ RightSidebar não encontrado");
      }
    } catch (error) {
      console.log("❌ Erro ao verificar RightSidebar:", error.message);
    }

    console.log("🎯 Testando interação com itens...");
    try {
      // Procurar por itens na lista
      const listItems = await page.$$(
        '[class*="border"], [class*="card"], .bg-white'
      );
      console.log(`📋 ${listItems.length} possíveis itens encontrados`);

      if (listItems.length > 0) {
        // Tentar clicar no primeiro item
        await listItems[0].click();
        console.log("✅ Item clicado");
        await page.waitForTimeout(1500);

        // Verificar se RightSidebar mudou
        const sidebarAfterClick = await page.$(".w-80");
        if (sidebarAfterClick) {
          const sidebarText = await page.evaluate(
            (el) => el.textContent,
            sidebarAfterClick
          );
          if (sidebarText.includes("editar") || sidebarText.includes("form")) {
            console.log("✅ RightSidebar reagiu à seleção do item");
          } else {
            console.log("⚠️ RightSidebar não mudou após seleção");
          }
        }
      }
    } catch (error) {
      console.log("❌ Erro ao testar interação com itens:", error.message);
    }

    // Aguardar mais um pouco para ver se há logs tardios
    await page.waitForTimeout(2000);

    // Screenshot final
    await page.screenshot({
      path: "test-sidebar-interaction.png",
      fullPage: true,
    });
    console.log("📸 Screenshot salvo: test-sidebar-interaction.png");

    console.log("\n📊 RESUMO DO TESTE:");
    console.log("=====================================");

    if (errors.length === 0) {
      console.log("🎉 SUCESSO: Nenhum erro JavaScript crítico detectado!");
    } else {
      console.log(`❌ ${errors.length} erros detectados:`);
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testSidebarInteraction().catch(console.error);
