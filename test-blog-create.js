const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("📝 TESTE: Criar Post numa Seção");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    // Ir para o dashboard
    console.log("🌐 Carregando dashboard...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // Clicar em SectionMaster
    console.log("🎯 Clicando em SectionMaster...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.textContent?.includes("SectionMaster"));
      if (btn) btn.click();
    });

    await page.waitForTimeout(2000);

    // Procurar seções
    const sections = await page.evaluate(() => {
      const text = document.body.textContent;
      return {
        hasOverview: text.includes("Overview"),
        hasBlog: text.includes("Blog"),
        hasCreateButton: text.includes("Create New") || text.includes("Criar"),
        hasCards: document.querySelectorAll('[class*="card"], .card').length,
        preview: text.substring(0, 300),
      };
    });

    console.log("📊 Seções encontradas:");
    console.log(`   Overview: ${sections.hasOverview ? "✅" : "❌"}`);
    console.log(`   Blog: ${sections.hasBlog ? "✅" : "❌"}`);
    console.log(`   Create Button: ${sections.hasCreateButton ? "✅" : "❌"}`);
    console.log(`   Cards: ${sections.hasCards}`);

    console.log("\n📄 Preview:");
    console.log(sections.preview);

    // Tentar clicar numa seção (Overview)
    if (sections.hasOverview) {
      console.log("\n🖱️ Clicando na seção Overview...");

      await page.evaluate(() => {
        const divs = Array.from(document.querySelectorAll("div"));
        for (let div of divs) {
          if (
            div.textContent?.includes("Overview") &&
            div.textContent?.includes("itens")
          ) {
            div.click();
            break;
          }
        }
      });

      await page.waitForTimeout(3000);

      // Verificar se entramos na seção
      const insideSection = await page.evaluate(() => {
        const text = document.body.textContent;
        return {
          hasCreateNew: text.includes("Create New"),
          hasListView: text.includes("ListView") || text.includes("items"),
          hasBreadcrumb: text.includes("›") || text.includes("/"),
          inputs: document.querySelectorAll("input").length,
          buttons: document.querySelectorAll("button").length,
          content: text.substring(0, 400),
        };
      });

      console.log("\n📋 Dentro da seção:");
      console.log(`   Create New: ${insideSection.hasCreateNew ? "✅" : "❌"}`);
      console.log(`   ListView: ${insideSection.hasListView ? "✅" : "❌"}`);
      console.log(
        `   Breadcrumb: ${insideSection.hasBreadcrumb ? "✅" : "❌"}`
      );
      console.log(`   Inputs: ${insideSection.inputs}`);
      console.log(`   Buttons: ${insideSection.buttons}`);

      console.log("\n📄 Conteúdo:");
      console.log(insideSection.content);

      // Tentar clicar em Create New
      if (insideSection.hasCreateNew) {
        console.log("\n🆕 Clicando em Create New...");

        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll("button"));
          const createBtn = btns.find((b) =>
            b.textContent?.includes("Create New")
          );
          if (createBtn) createBtn.click();
        });

        await page.waitForTimeout(3000);

        // Verificar formulário
        const formCheck = await page.evaluate(() => {
          return {
            inputs: document.querySelectorAll("input").length,
            textareas: document.querySelectorAll("textarea").length,
            labels: Array.from(document.querySelectorAll("label")).map(
              (l) => l.textContent
            ),
            hasSidebar:
              document.body.textContent.includes("Sidebar") ||
              document.body.textContent.includes("sidebar"),
            hasAddons:
              document.body.textContent.includes("Título") ||
              document.body.textContent.includes("TextInput"),
            content: document.body.textContent.substring(0, 500),
          };
        });

        console.log("\n📝 Formulário:");
        console.log(`   Inputs: ${formCheck.inputs}`);
        console.log(`   Textareas: ${formCheck.textareas}`);
        console.log(`   Labels: ${formCheck.labels.length}`);
        console.log(`   Sidebar: ${formCheck.hasSidebar ? "✅" : "❌"}`);
        console.log(`   Addons: ${formCheck.hasAddons ? "✅" : "❌"}`);

        if (formCheck.labels.length > 0) {
          console.log("\n🏷️ Labels:");
          formCheck.labels.forEach((label) => console.log(`   - ${label}`));
        }

        console.log("\n📄 Conteúdo do formulário:");
        console.log(formCheck.content);

        // Tentar preencher se houver inputs
        if (formCheck.inputs > 0) {
          console.log("\n✏️ Preenchendo campos...");

          await page.evaluate(() => {
            const inputs = document.querySelectorAll(
              'input[type="text"], input:not([type])'
            );
            if (inputs[0]) {
              inputs[0].value = "Meu Post de Teste";
              inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
            }
            if (inputs[1]) {
              inputs[1].value = "meu-post-teste";
              inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
            }
          });

          const textareas = await page.$$("textarea");
          if (textareas.length > 0) {
            await page.evaluate(() => {
              const textarea = document.querySelector("textarea");
              if (textarea) {
                textarea.value = "Conteúdo do meu post de teste";
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
              }
            });
          }

          console.log("✅ Campos preenchidos");

          // Tentar salvar
          await page.waitForTimeout(1000);

          const saveResult = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            const saveBtn = btns.find(
              (b) =>
                b.textContent?.includes("Salvar") ||
                b.textContent?.includes("Save") ||
                b.textContent?.includes("Criar")
            );

            if (saveBtn && !saveBtn.disabled) {
              saveBtn.click();
              return { saved: true, text: saveBtn.textContent };
            }
            return {
              saved: false,
              buttons: btns.map((b) => b.textContent).filter((t) => t),
            };
          });

          if (saveResult.saved) {
            console.log(`✅ Cliquei para salvar: "${saveResult.text}"`);
          } else {
            console.log("❌ Botão salvar não encontrado");
            console.log("Botões disponíveis:", saveResult.buttons);
          }
        }
      }
    }

    // Screenshot final
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/create-test-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot: create-test-${timestamp}.png`);

    await browser.close();

    console.log("\n🏁 Teste concluído!");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
})();
