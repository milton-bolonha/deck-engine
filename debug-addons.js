const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🔍 DEBUG ADDONS - Por que não carregam?");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // Testar Overview (dashboard)
    console.log("🧪 Testando Overview (ContentType: dashboard)");

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const overviewBtn = buttons.find((b) =>
        b.textContent?.includes("Overview")
      );
      if (overviewBtn) overviewBtn.click();
    });

    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const createBtn = buttons.find((b) =>
        b.textContent?.includes("Create New")
      );
      if (createBtn) createBtn.click();
    });

    await page.waitForTimeout(3000);

    const overviewFormCheck = await page.evaluate(() => {
      return {
        rightSidebarContent:
          document.querySelector(".w-80")?.textContent || "vazio",
        hasItemForm: document.body.textContent.includes("Item Form"),
        inputs: document.querySelectorAll("input").length,
        labels: Array.from(document.querySelectorAll("label")).map(
          (l) => l.textContent
        ),
        hasError:
          document.body.textContent.includes("Error") ||
          document.body.textContent.includes("erro") ||
          document.body.textContent.includes("não"),
        formHTML:
          document.querySelector(".w-80")?.innerHTML?.substring(0, 500) ||
          "vazio",
      };
    });

    console.log("📊 Overview Form Debug:");
    console.log(
      `   Item Form ativo: ${overviewFormCheck.hasItemForm ? "✅" : "❌"}`
    );
    console.log(`   Inputs: ${overviewFormCheck.inputs}`);
    console.log(`   Labels: ${overviewFormCheck.labels.length}`);
    console.log(`   Tem erro: ${overviewFormCheck.hasError ? "❌" : "✅"}`);

    if (overviewFormCheck.labels.length > 0) {
      console.log("   🏷️ Labels encontrados:");
      overviewFormCheck.labels.forEach((label) =>
        console.log(`      - "${label}"`)
      );
    }

    console.log("\n📄 Conteúdo do sidebar:");
    console.log(overviewFormCheck.rightSidebarContent.substring(0, 200));

    // Testar Usuários (user_profile)
    console.log("\n🧪 Testando Usuários (ContentType: user_profile)");

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const usersBtn = buttons.find((b) => b.textContent?.includes("Usuários"));
      if (usersBtn) usersBtn.click();
    });

    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const createBtn = buttons.find((b) =>
        b.textContent?.includes("Create New")
      );
      if (createBtn) createBtn.click();
    });

    await page.waitForTimeout(3000);

    const usersFormCheck = await page.evaluate(() => {
      return {
        inputs: document.querySelectorAll("input").length,
        labels: Array.from(document.querySelectorAll("label")).map(
          (l) => l.textContent
        ),
        hasAddons:
          document.body.textContent.includes("Nome") ||
          document.body.textContent.includes("Email") ||
          document.body.textContent.includes("Função"),
        rightSidebarContent:
          document.querySelector(".w-80")?.textContent?.substring(0, 300) ||
          "vazio",
      };
    });

    console.log("📊 Usuários Form Debug:");
    console.log(`   Inputs: ${usersFormCheck.inputs}`);
    console.log(`   Labels: ${usersFormCheck.labels.length}`);
    console.log(
      `   Addons de usuário: ${usersFormCheck.hasAddons ? "✅" : "❌"}`
    );

    if (usersFormCheck.labels.length > 0) {
      console.log("   🏷️ Labels encontrados:");
      usersFormCheck.labels.forEach((label) =>
        console.log(`      - "${label}"`)
      );
    }

    // Comparar com SectionMaster - seção de Post
    console.log("\n🧪 Comparando com SectionMaster - Post do Blog");

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sectionMasterBtn = buttons.find((b) =>
        b.textContent?.includes("SectionMaster")
      );
      if (sectionMasterBtn) sectionMasterBtn.click();
    });

    await page.waitForTimeout(2000);

    // Criar seção de post
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const novaBtn = btns.find((b) => b.textContent?.includes("Nova Seção"));
      if (novaBtn) novaBtn.click();
    });

    await page.waitForTimeout(2000);

    await page.evaluate(() => {
      const inputs = document.querySelectorAll("input");
      if (inputs[0]) {
        inputs[0].value = "Blog Debug";
        inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = "blog-debug";
        inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
      }

      const selects = document.querySelectorAll("select");
      for (let select of selects) {
        const options = Array.from(select.options);
        const postOption = options.find(
          (opt) =>
            opt.value.includes("post") || opt.textContent.includes("Post")
        );
        if (postOption) {
          select.value = postOption.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          break;
        }
      }
    });

    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const saveBtn = btns.find(
        (b) =>
          b.textContent?.includes("Criar") || b.textContent?.includes("Salvar")
      );
      if (saveBtn) saveBtn.click();
    });

    await page.waitForTimeout(3000);

    // Clicar na seção de blog criada
    await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll(".gaming-card")
      ).filter((card) => card.className.includes("cursor-pointer"));

      for (let card of cards) {
        if (card.textContent.includes("Blog Debug")) {
          card.click();
          break;
        }
      }
    });

    await page.waitForTimeout(3000);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const createBtn = buttons.find((b) =>
        b.textContent?.includes("Create New")
      );
      if (createBtn) createBtn.click();
    });

    await page.waitForTimeout(3000);

    const blogFormCheck = await page.evaluate(() => {
      return {
        inputs: document.querySelectorAll("input").length,
        textareas: document.querySelectorAll("textarea").length,
        labels: Array.from(document.querySelectorAll("label")).map(
          (l) => l.textContent
        ),
        hasAddons:
          document.body.textContent.includes("Título") ||
          document.body.textContent.includes("Slug") ||
          document.body.textContent.includes("Conteúdo"),
        rightSidebarContent:
          document.querySelector(".w-80")?.textContent?.substring(0, 400) ||
          "vazio",
      };
    });

    console.log("📊 Blog Form Debug:");
    console.log(`   Inputs: ${blogFormCheck.inputs}`);
    console.log(`   Textareas: ${blogFormCheck.textareas}`);
    console.log(`   Labels: ${blogFormCheck.labels.length}`);
    console.log(`   Addons de blog: ${blogFormCheck.hasAddons ? "✅" : "❌"}`);

    if (blogFormCheck.labels.length > 0) {
      console.log("   🏷️ Labels encontrados:");
      blogFormCheck.labels.forEach((label) =>
        console.log(`      - "${label}"`)
      );
    }

    // Screenshot final
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/debug-addons-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot: debug-addons-${timestamp}.png`);

    await browser.close();

    // ANÁLISE COMPARATIVA
    console.log("\n" + "=".repeat(50));
    console.log("📋 ANÁLISE COMPARATIVA DOS FORMULÁRIOS");
    console.log("=".repeat(50));

    console.log("\n📊 RESULTADOS:");
    console.log(
      `   Overview (dashboard): ${overviewFormCheck.inputs} inputs, ${overviewFormCheck.labels.length} labels`
    );
    console.log(
      `   Usuários (user_profile): ${usersFormCheck.inputs} inputs, ${usersFormCheck.labels.length} labels`
    );
    console.log(
      `   Blog (post): ${blogFormCheck.inputs} inputs, ${blogFormCheck.textareas} textareas, ${blogFormCheck.labels.length} labels`
    );

    console.log("\n🔍 POSSÍVEIS CAUSAS:");
    console.log("   1. ContentTypes dashboard/user_profile têm poucos campos?");
    console.log("   2. Addons não estão sendo aplicados corretamente?");
    console.log("   3. ItemForm não renderiza campos para esses ContentTypes?");
    console.log("   4. DynamicSectionContainer não passa dados corretos?");
  } catch (error) {
    console.error("❌ Erro durante debug:", error.message);
  }
})();
