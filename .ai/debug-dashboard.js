const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🔍 Debugging dashboard na porta 3001...");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    // Console log listener
    page.on("console", (msg) => {
      const type = msg.type();
      console.log(`[BROWSER ${type.toUpperCase()}]:`, msg.text());
    });

    // Error listener
    page.on("pageerror", (error) => {
      console.log(`[PAGE ERROR]:`, error.message);
    });

    // Response listener
    page.on("response", (response) => {
      console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
    });

    console.log("Navegando para http://localhost:3001...");
    await page.goto("http://localhost:3001", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Aguardar um pouco mais
    await page.waitForTimeout(3000);

    // Capturar informações da página
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: location.href,
        bodyText: document.body
          ? document.body.innerText.substring(0, 300)
          : "No body",
        hasReact: typeof window.React !== "undefined",
        hasNext: typeof window.__NEXT_DATA__ !== "undefined",
        scripts: Array.from(document.scripts).length,
        stylesheets: Array.from(document.styleSheets).length,
        divs: document.querySelectorAll("div").length,
        buttons: document.querySelectorAll("button").length,
        inputs: document.querySelectorAll("input, textarea, select").length,
        sectionMaster: document.querySelector(
          '[href*="section"], [class*="section"]'
        )
          ? "FOUND"
          : "NOT FOUND",
      };
    });

    console.log("📊 Informações da página:", JSON.stringify(pageInfo, null, 2));

    // Tentar encontrar SectionMaster
    const sectionLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a, button"));
      return links
        .filter(
          (el) =>
            el.textContent.toLowerCase().includes("section") ||
            el.href?.includes("section") ||
            el.textContent.toLowerCase().includes("admin") ||
            el.textContent.toLowerCase().includes("meta")
        )
        .map((el) => ({
          text: el.textContent.trim(),
          href: el.href || "",
          tag: el.tagName,
        }));
    });

    console.log(
      "🔍 Links relacionados ao SectionMaster encontrados:",
      sectionLinks
    );

    // Screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotPath = `outputs/screenshots/2025-06/dashboard-working-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("📸 Screenshot salvo:", screenshotPath);

    // Se encontrou links do SectionMaster, tentar clicar
    if (sectionLinks.length > 0) {
      console.log("🎯 Tentando navegar para SectionMaster...");

      try {
        const link = sectionLinks[0];
        if (link.href) {
          await page.goto(link.href);
        } else {
          await page.click(
            `${link.tag.toLowerCase()}:contains("${link.text}")`
          );
        }

        await page.waitForTimeout(3000);

        const sectionScreenshot = `outputs/screenshots/2025-06/section-master-working-${timestamp}.png`;
        await page.screenshot({ path: sectionScreenshot, fullPage: true });
        console.log("📸 Screenshot SectionMaster salvo:", sectionScreenshot);

        // Tentar criar um novo item para testar addons
        const createButtons = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          return buttons
            .filter(
              (btn) =>
                btn.textContent.toLowerCase().includes("create") ||
                btn.textContent.toLowerCase().includes("add") ||
                btn.textContent.toLowerCase().includes("novo")
            )
            .map((btn) => btn.textContent.trim());
        });

        console.log("➕ Botões de criar encontrados:", createButtons);

        if (createButtons.length > 0) {
          await page.click(`button:contains("${createButtons[0]}")`);
          await page.waitForTimeout(2000);

          const formScreenshot = `outputs/screenshots/2025-06/addons-form-working-${timestamp}.png`;
          await page.screenshot({ path: formScreenshot, fullPage: true });
          console.log("📸 Screenshot formulário com addons:", formScreenshot);

          // Testar alguns addons
          const addonTests = await page.evaluate(() => {
            const inputs = document.querySelectorAll("input, textarea, select");
            return Array.from(inputs).map((input) => ({
              type: input.type || input.tagName.toLowerCase(),
              name: input.name,
              placeholder: input.placeholder,
              required: input.required,
            }));
          });

          console.log("🧩 Addons encontrados no formulário:", addonTests);
        }
      } catch (e) {
        console.log("⚠️ Erro ao navegar para SectionMaster:", e.message);
      }
    }

    await browser.close();
    console.log("✅ Debug concluído!");
  } catch (error) {
    console.error("❌ Erro durante debug:", error.message);
  }
})();
