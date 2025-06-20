const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🎨 TESTE CSS - Sidebar Direito");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // Analisar estrutura completa da página
    const pageStructure = await page.evaluate(() => {
      const body = document.body;
      const main = document.querySelector("main");
      const dashboardLayout = document.querySelector('[class*="flex"]') || body;

      // Procurar por todos elementos com classes relacionadas a sidebar
      const sidebarElements = Array.from(document.querySelectorAll("*")).filter(
        (el) => {
          const classes = el.className || "";
          const id = el.id || "";
          return (
            classes.includes("sidebar") ||
            classes.includes("right") ||
            classes.includes("w-80") ||
            id.includes("sidebar") ||
            id.includes("right")
          );
        }
      );

      // Procurar por elementos com width específico (w-80 = 320px)
      const w80Elements = Array.from(
        document.querySelectorAll('[class*="w-80"]')
      );

      // Analizar estrutura de flex
      const flexElements = Array.from(
        document.querySelectorAll('[class*="flex"]')
      );

      return {
        bodyClasses: body.className,
        hasMain: !!main,
        mainClasses: main?.className || "sem main",

        totalElements: document.querySelectorAll("*").length,

        sidebarElements: sidebarElements.map((el) => ({
          tag: el.tagName,
          classes: el.className,
          id: el.id,
          visible: el.offsetWidth > 0 && el.offsetHeight > 0,
          width: el.offsetWidth,
          height: el.offsetHeight,
          display: getComputedStyle(el).display,
          position: getComputedStyle(el).position,
        })),

        w80Elements: w80Elements.map((el) => ({
          tag: el.tagName,
          classes: el.className,
          visible: el.offsetWidth > 0,
          width: el.offsetWidth,
          computedWidth: getComputedStyle(el).width,
        })),

        flexStructure: flexElements.slice(0, 5).map((el) => ({
          tag: el.tagName,
          classes: el.className,
          children: el.children.length,
          width: el.offsetWidth,
          flexDirection: getComputedStyle(el).flexDirection,
        })),

        // Verificar se há CSS que possa estar ocultando
        potentialHidden: Array.from(document.querySelectorAll("*")).filter(
          (el) => {
            const style = getComputedStyle(el);
            return (
              style.display === "none" ||
              style.visibility === "hidden" ||
              style.width === "0px" ||
              style.height === "0px"
            );
          }
        ).length,
      };
    });

    console.log("🏗️ Estrutura da página:");
    console.log(`   Body classes: ${pageStructure.bodyClasses}`);
    console.log(`   Tem main: ${pageStructure.hasMain}`);
    console.log(`   Main classes: ${pageStructure.mainClasses}`);
    console.log(`   Total elementos: ${pageStructure.totalElements}`);
    console.log(
      `   Elementos potencialmente ocultos: ${pageStructure.potentialHidden}`
    );

    console.log("\n📏 Elementos sidebar encontrados:");
    if (pageStructure.sidebarElements.length === 0) {
      console.log("   ❌ Nenhum elemento sidebar encontrado!");
    } else {
      pageStructure.sidebarElements.forEach((el, i) => {
        console.log(`   ${i + 1}. ${el.tag} - ${el.classes}`);
        console.log(
          `      Visível: ${el.visible}, Width: ${el.width}px, Display: ${el.display}`
        );
      });
    }

    console.log("\n📐 Elementos w-80 (width: 320px):");
    if (pageStructure.w80Elements.length === 0) {
      console.log("   ❌ Nenhum elemento w-80 encontrado!");
    } else {
      pageStructure.w80Elements.forEach((el, i) => {
        console.log(
          `   ${i + 1}. ${el.tag} - Visível: ${el.visible}, Width: ${
            el.width
          }px (${el.computedWidth})`
        );
      });
    }

    console.log("\n🎯 Estrutura Flex:");
    pageStructure.flexStructure.forEach((el, i) => {
      console.log(`   ${i + 1}. ${el.tag} - ${el.classes}`);
      console.log(
        `      Children: ${el.children}, Width: ${el.width}px, Direction: ${el.flexDirection}`
      );
    });

    // Tentar forçar o sidebar aparecer
    console.log("\n🔧 Tentando forçar sidebar...");

    const forceResult = await page.evaluate(() => {
      // Procurar por divs com w-80 e tentar torná-los visíveis
      const w80Divs = document.querySelectorAll('div[class*="w-80"]');
      let modified = 0;

      w80Divs.forEach((div) => {
        div.style.display = "block";
        div.style.visibility = "visible";
        div.style.width = "320px";
        div.style.backgroundColor = "red"; // Para debug
        div.style.height = "100vh";
        modified++;
      });

      return {
        modified,
        w80Count: w80Divs.length,
        now: {
          w80Visible: Array.from(
            document.querySelectorAll('div[class*="w-80"]')
          ).filter((el) => el.offsetWidth > 0).length,
        },
      };
    });

    console.log(`   Modificados: ${forceResult.modified} elementos`);
    console.log(`   w-80 total: ${forceResult.w80Count}`);
    console.log(`   w-80 visíveis agora: ${forceResult.now.w80Visible}`);

    await page.waitForTimeout(2000);

    // Screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/sidebar-debug-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot: sidebar-debug-${timestamp}.png`);

    await browser.close();
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
})();
