const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🔍 DEBUG - Estado do Dashboard");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // Clicar em SectionMaster
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.textContent?.includes("SectionMaster"));
      if (btn) btn.click();
    });

    await page.waitForTimeout(2000);

    // Debug 1: Estado inicial
    console.log("🎯 Estado inicial do SectionMaster:");
    const initialState = await page.evaluate(() => {
      return {
        hasRightSidebar: !!document.querySelector(
          '[class*="right"], [class*="sidebar"]'
        ),
        hasMainContent: !!document.querySelector(
          '[class*="main"], [class*="content"]'
        ),
        totalWidth: document.body.scrollWidth,
        layout: document.body.className,
        sectionsVisible: document.body.textContent.includes("Overview"),
        debugInfo: window.location.href,
      };
    });

    Object.entries(initialState).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Clicar numa seção
    await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll("div"));
      for (let div of divs) {
        if (
          div.textContent?.includes("Overview") &&
          div.textContent?.includes("itens")
        ) {
          console.log("Clicando na seção Overview");
          div.click();
          break;
        }
      }
    });

    await page.waitForTimeout(3000);

    // Debug 2: Estado após clicar na seção
    console.log("\n📋 Estado após entrar na seção:");
    const sectionState = await page.evaluate(() => {
      return {
        url: location.href,
        hasCreateBtn: document.body.textContent.includes("Create New"),
        hasListView: !!document.querySelector('[class*="list"]'),
        mainContentClasses:
          document.querySelector("main")?.className || "sem main",
        rightSidebarExists: !!document.querySelector('[class*="right"]'),
        rightSidebarVisible:
          document.querySelector('[class*="right"]')?.style.display !== "none",
        bodyClasses: document.body.className,
        totalButtons: document.querySelectorAll("button").length,
        buttonTexts: Array.from(document.querySelectorAll("button"))
          .map((b) => b.textContent)
          .filter((t) => t),
      };
    });

    Object.entries(sectionState).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    if (sectionState.hasCreateBtn) {
      console.log("\n🆕 Clicando em Create New...");

      // Debug antes de clicar
      const beforeClick = await page.evaluate(() => {
        return {
          rightSidebarContent:
            document
              .querySelector('[class*="right"]')
              ?.textContent?.substring(0, 100) || "sem conteúdo",
          mainContentHeight: document.querySelector("main")?.scrollHeight || 0,
        };
      });

      console.log("   Estado ANTES do clique:");
      Object.entries(beforeClick).forEach(([key, value]) => {
        console.log(`     ${key}: ${value}`);
      });

      // Clicar no Create New
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const createBtn = btns.find(
          (b) =>
            b.textContent?.includes("Create New") ||
            b.textContent?.includes("Criar")
        );
        if (createBtn) {
          console.log("Clicando em Create New:", createBtn.textContent);
          createBtn.click();
        }
      });

      await page.waitForTimeout(3000);

      // Debug 3: Estado após clicar Create New
      console.log("\n📝 Estado APÓS clicar Create New:");
      const formState = await page.evaluate(() => {
        return {
          url: location.href,
          inputs: document.querySelectorAll("input").length,
          textareas: document.querySelectorAll("textarea").length,
          forms: document.querySelectorAll("form").length,
          rightSidebarContent:
            document
              .querySelector('[class*="right"]')
              ?.textContent?.substring(0, 200) || "sem sidebar",
          rightSidebarClasses:
            document.querySelector('[class*="right"]')?.className ||
            "sem classes",
          hasItemForm:
            document.body.textContent.includes("ItemForm") ||
            document.body.textContent.includes("Item Form") ||
            document.body.textContent.includes("Título") ||
            document.body.textContent.includes("TextInput"),
          sidebarWidth:
            document.querySelector('[class*="right"]')?.offsetWidth || 0,
          errorMessages:
            document.body.textContent.includes("Error") ||
            document.body.textContent.includes("erro"),
        };
      });

      Object.entries(formState).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });

      if (formState.inputs === 0 && formState.textareas === 0) {
        console.log("\n❌ PROBLEMA: Formulário não apareceu!");

        // Debug mais profundo
        const deepDebug = await page.evaluate(() => {
          // Tentar encontrar todos os elementos de formulário
          const allInputs = document.querySelectorAll(
            "input, textarea, select"
          );
          const allForms = document.querySelectorAll("form");
          const rightSidebar = document.querySelector('[class*="right"]');

          return {
            totalInputsInPage: allInputs.length,
            totalFormsInPage: allForms.length,
            rightSidebarExists: !!rightSidebar,
            rightSidebarHTML: rightSidebar
              ? rightSidebar.innerHTML.substring(0, 300)
              : "não existe",
            pageTitle: document.title,
            hasReactErrors:
              document.body.textContent.includes("React") &&
              document.body.textContent.includes("Error"),
          };
        });

        console.log("\n🔍 DEBUG PROFUNDO:");
        Object.entries(deepDebug).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
      }
    }

    // Screenshot final
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/debug-state-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot: debug-state-${timestamp}.png`);

    await browser.close();
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
})();
