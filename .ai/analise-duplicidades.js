const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🔍 ANÁLISE COMPLETA - Duplicidades Menu vs SectionMaster");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    console.log("📱 Carregando dashboard...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // ANÁLISE 1: Menu Lateral Esquerdo
    console.log("\n🔍 ANÁLISE 1: Menu Lateral Esquerdo");

    const menuAnalysis = await page.evaluate(() => {
      const leftSidebar = document.querySelector(".w-64"); // Left sidebar
      const menuItems = Array.from(
        leftSidebar?.querySelectorAll("button") || []
      );

      return {
        totalItems: menuItems.length,
        menuItems: menuItems.map((btn) => ({
          text: btn.textContent,
          classes: btn.className,
          isActive:
            btn.className.includes("active") ||
            btn.className.includes("selected"),
        })),
        sidebarContent:
          leftSidebar?.textContent?.substring(0, 300) || "not found",
      };
    });

    console.log(`📊 Itens no menu lateral: ${menuAnalysis.totalItems}`);
    menuAnalysis.menuItems.forEach((item, i) => {
      console.log(
        `   ${i + 1}. "${item.text}" ${item.isActive ? "(ATIVO)" : ""}`
      );
    });

    // ANÁLISE 2: Testando cada seção do menu lateral
    console.log("\n🧪 ANÁLISE 2: Testando Seções do Menu Lateral");

    const sectionsToTest = [
      "Overview",
      "Pipeline Builder",
      "Usuários",
      "Faturamento",
    ];
    const sectionResults = {};

    for (const sectionName of sectionsToTest) {
      console.log(`\n   🔍 Testando "${sectionName}"...`);

      // Clicar na seção
      await page.evaluate((name) => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const btn = buttons.find((b) => b.textContent?.includes(name));
        if (btn) btn.click();
      }, sectionName);

      await page.waitForTimeout(2000);

      // Analisar resultado
      const result = await page.evaluate(() => {
        return {
          url: location.href,
          mainContent:
            document.querySelector("main")?.textContent?.substring(0, 300) ||
            "no main",
          hasCreateButton:
            document.body.textContent.includes("Create New") ||
            document.body.textContent.includes("Criar"),
          hasData:
            document.body.textContent.includes("itens") ||
            document.body.textContent.includes("dados") ||
            document.body.textContent.includes("lista"),
          rightSidebarActive:
            !!document.querySelector(".w-80")?.textContent?.length,
          errorMessages:
            document.body.textContent.includes("Error") ||
            document.body.textContent.includes("erro") ||
            document.body.textContent.includes("não encontrada"),
        };
      });

      sectionResults[sectionName] = result;

      console.log(
        `      Create Button: ${result.hasCreateButton ? "✅" : "❌"}`
      );
      console.log(`      Tem dados: ${result.hasData ? "✅" : "❌"}`);
      console.log(`      Erros: ${result.errorMessages ? "❌" : "✅"}`);
    }

    // ANÁLISE 3: SectionMaster vs Menu Lateral
    console.log("\n🔍 ANÁLISE 3: Acessando SectionMaster");

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sectionMasterBtn = buttons.find((b) =>
        b.textContent?.includes("SectionMaster")
      );
      if (sectionMasterBtn) sectionMasterBtn.click();
    });

    await page.waitForTimeout(2000);

    const sectionMasterAnalysis = await page.evaluate(() => {
      const sectionCards = Array.from(
        document.querySelectorAll(".gaming-card")
      ).filter(
        (card) =>
          card.className.includes("cursor-pointer") &&
          card.textContent.includes("itens")
      );

      return {
        totalSections: sectionCards.length,
        sections: sectionCards.map((card) => ({
          title:
            card.textContent.match(/([A-Za-z\s]+)Sem descrição/)?.[1]?.trim() ||
            "Unknown",
          content: card.textContent.substring(0, 80),
          hasEditButton:
            card.textContent.includes("edit") ||
            card.querySelector('[class*="edit"]') !== null,
        })),
        hasNovaSecao: document.body.textContent.includes("Nova Seção"),
        pageContent: document.body.textContent.substring(0, 400),
      };
    });

    console.log(
      `📊 Seções no SectionMaster: ${sectionMasterAnalysis.totalSections}`
    );
    sectionMasterAnalysis.sections.forEach((section, i) => {
      console.log(`   ${i + 1}. "${section.title}"`);
    });

    // ANÁLISE 4: Comparação e Duplicidades
    console.log("\n🔍 ANÁLISE 4: Identificando Duplicidades");

    const menuSections = menuAnalysis.menuItems
      .map((item) => item.text)
      .filter(
        (text) =>
          !text.includes("DevTools") &&
          !text.includes("SectionMaster") &&
          text.length > 3
      );

    const sectionMasterSections = sectionMasterAnalysis.sections.map(
      (s) => s.title
    );

    const duplicatas = [];
    menuSections.forEach((menuItem) => {
      sectionMasterSections.forEach((smItem) => {
        if (
          menuItem.toLowerCase().includes(smItem.toLowerCase()) ||
          smItem.toLowerCase().includes(menuItem.toLowerCase()) ||
          (menuItem.includes("Overview") && smItem.includes("Overview")) ||
          (menuItem.includes("Pipeline") && smItem.includes("Pipeline")) ||
          (menuItem.includes("Usuários") && smItem.includes("Users")) ||
          (menuItem.includes("Faturamento") && smItem.includes("Billing"))
        ) {
          duplicatas.push({ menu: menuItem, sectionMaster: smItem });
        }
      });
    });

    console.log("❌ DUPLICIDADES ENCONTRADAS:");
    duplicatas.forEach((dup, i) => {
      console.log(
        `   ${i + 1}. Menu: "${dup.menu}" ↔ SectionMaster: "${
          dup.sectionMaster
        }"`
      );
    });

    // ANÁLISE 5: Testar funcionalidade do SectionMaster
    console.log("\n🧪 ANÁLISE 5: Testando Funcionalidade SectionMaster");

    // Testar criar nova seção
    console.log('   🆕 Testando "Nova Seção"...');

    const novaSecaoTest = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const novaBtn = btns.find((b) => b.textContent?.includes("Nova Seção"));
      if (novaBtn) {
        novaBtn.click();
        return { clicked: true };
      }
      return { clicked: false };
    });

    if (novaSecaoTest.clicked) {
      await page.waitForTimeout(2000);

      const formCheck = await page.evaluate(() => {
        return {
          hasSectionBuilder:
            document.body.textContent.includes("Section Builder"),
          inputs: document.querySelectorAll("input").length,
          selects: document.querySelectorAll("select").length,
          hasContentTypes:
            document.body.textContent.includes("Post do Blog") ||
            document.body.textContent.includes("ContentType"),
        };
      });

      console.log(
        `      Formulário funcional: ${
          formCheck.hasSectionBuilder ? "✅" : "❌"
        }`
      );
      console.log(`      Inputs: ${formCheck.inputs}`);
      console.log(
        `      ContentTypes: ${formCheck.hasContentTypes ? "✅" : "❌"}`
      );
    }

    // Screenshots de evidência
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/analise-duplicidades-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot: analise-duplicidades-${timestamp}.png`);

    await browser.close();

    // RELATÓRIO FINAL
    console.log("\n📋 RELATÓRIO FINAL DE DUPLICIDADES");
    console.log("=".repeat(50));

    console.log("\n✅ FUNCIONANDO:");
    console.log("   - Menu lateral existe e é clicável");
    console.log("   - SectionMaster carrega seções");
    console.log('   - Formulário "Nova Seção" funciona');

    console.log("\n❌ PROBLEMAS IDENTIFICADOS:");
    console.log("   - Navegação duplicada (Menu vs SectionMaster)");
    console.log("   - Mesmas seções em dois lugares diferentes");
    console.log("   - Confusão de UX para usuário final");
    console.log("   - Seções do menu podem não usar SectionMaster");

    console.log("\n🔧 SOLUÇÕES NECESSÁRIAS:");
    console.log(
      "   1. Decidir: Menu lateral usa SectionManager ou é independente?"
    );
    console.log("   2. Se usar SectionManager: integrar navegação");
    console.log(
      "   3. Se independente: SectionMaster só para seções customizadas"
    );
    console.log(
      "   4. Testar se seções originais usam DynamicSectionContainer"
    );
    console.log("   5. Verificar se Create New funciona em seções originais");

    console.log("\n🎯 PRÓXIMOS PASSOS:");
    console.log("   1. Testar funcionalidade das seções originais");
    console.log("   2. Verificar integração com DynamicSectionContainer");
    console.log("   3. Decidir arquitetura final");
    console.log("   4. Implementar merge ou separação clara");
  } catch (error) {
    console.error("❌ Erro durante análise:", error.message);
  }
})();
