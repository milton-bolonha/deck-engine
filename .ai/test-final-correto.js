const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🎯 TESTE FINAL CORRETO - SectionMaster Completo");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    console.log("📱 Carregando dashboard...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // Passo 1: Clicar em SectionMaster
    console.log("🎯 Passo 1: Acessando SectionMaster...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.textContent?.includes("SectionMaster"));
      if (btn) btn.click();
    });

    await page.waitForTimeout(2000);

    // Passo 2: Verificar lista de seções
    console.log("📖 Passo 2: Analisando lista de seções...");

    const sectionsAnalysis = await page.evaluate(() => {
      // Procurar pelos cards das seções (com cursor-pointer e gaming-card)
      const sectionCards = Array.from(
        document.querySelectorAll(".gaming-card")
      ).filter((card) => {
        return (
          card.className.includes("cursor-pointer") &&
          card.textContent.includes("itens")
        );
      });

      return {
        totalCards: sectionCards.length,
        sections: sectionCards.map((card) => ({
          text: card.textContent.substring(0, 100),
          hasClickHandler:
            card.onclick !== null || card.getAttribute("onClick") !== null,
          classes: card.className,
        })),
        pageContent: document.body.textContent.substring(0, 400),
      };
    });

    console.log(
      `📊 Cards de seção encontrados: ${sectionsAnalysis.totalCards}`
    );
    sectionsAnalysis.sections.forEach((section, i) => {
      console.log(`   ${i + 1}. ${section.text.replace(/\s+/g, " ")}`);
    });

    // Passo 3: Clicar no card de uma seção específica
    if (sectionsAnalysis.totalCards > 0) {
      console.log("\n🖱️ Passo 3: Clicando no card da seção...");

      const clickResult = await page.evaluate(() => {
        // Encontrar especificamente um card que seja clicável
        const sectionCards = Array.from(
          document.querySelectorAll(".gaming-card")
        ).filter((card) => {
          return (
            card.className.includes("cursor-pointer") &&
            card.textContent.includes("itens")
          );
        });

        if (sectionCards.length > 0) {
          const firstCard = sectionCards[0];
          console.log(
            "Clicando no card:",
            firstCard.textContent.substring(0, 50)
          );
          firstCard.click();

          return {
            clicked: true,
            cardText: firstCard.textContent.substring(0, 80),
          };
        }

        return { clicked: false };
      });

      if (clickResult.clicked) {
        console.log(`✅ Cliquei no card: "${clickResult.cardText}"`);

        await page.waitForTimeout(3000);

        // Passo 4: Verificar se entramos no conteúdo da seção
        console.log("\n📋 Passo 4: Verificando conteúdo da seção...");

        const contentAnalysis = await page.evaluate(() => {
          return {
            hasBreadcrumb:
              document.body.textContent.includes("SectionMaster /") ||
              document.body.textContent.includes("arrow-left"),
            hasCreateNew: document.body.textContent.includes("Create New"),
            hasDynamicContent:
              document.body.textContent.includes("ListView") ||
              document.body.textContent.includes("GridView") ||
              document.body.textContent.includes("Empty state"),
            content: document.body.textContent.substring(0, 500),
            buttons: Array.from(document.querySelectorAll("button"))
              .map((b) => b.textContent)
              .filter((t) => t),
          };
        });

        console.log(
          `   ${contentAnalysis.hasBreadcrumb ? "✅" : "❌"} Breadcrumb: ${
            contentAnalysis.hasBreadcrumb
          }`
        );
        console.log(
          `   ${contentAnalysis.hasCreateNew ? "✅" : "❌"} Create New: ${
            contentAnalysis.hasCreateNew
          }`
        );
        console.log(
          `   ${
            contentAnalysis.hasDynamicContent ? "✅" : "❌"
          } Conteúdo dinâmico: ${contentAnalysis.hasDynamicContent}`
        );

        console.log("\n📄 Conteúdo atual:");
        console.log(contentAnalysis.content);

        console.log("\n🔘 Botões disponíveis:");
        contentAnalysis.buttons.forEach((btn) => console.log(`   - ${btn}`));

        // Passo 5: Tentar clicar em Create New
        if (contentAnalysis.hasCreateNew) {
          console.log("\n🆕 Passo 5: Clicando em Create New...");

          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            const createBtn = btns.find((b) =>
              b.textContent?.includes("Create New")
            );
            if (createBtn) {
              console.log("Clicando em Create New:", createBtn.textContent);
              createBtn.click();
            }
          });

          await page.waitForTimeout(3000);

          // Passo 6: Verificar formulário final
          console.log("\n📝 Passo 6: Verificando formulário...");

          const formAnalysis = await page.evaluate(() => {
            return {
              inputs: document.querySelectorAll("input").length,
              textareas: document.querySelectorAll("textarea").length,
              labels: Array.from(document.querySelectorAll("label")).map(
                (l) => l.textContent
              ),
              hasForm: document.querySelector("form") !== null,
              hasSidebar:
                document.body.textContent.includes("Item Form") ||
                document.body.textContent.includes("Título") ||
                document.body.textContent.includes("TextInput"),
              rightSidebarExists: !!document.querySelector(".w-80"),
              rightSidebarContent:
                document
                  .querySelector(".w-80")
                  ?.textContent?.substring(0, 200) || "vazio",
              currentUrl: location.href,
            };
          });

          console.log(`   📊 Inputs: ${formAnalysis.inputs}`);
          console.log(`   📊 Textareas: ${formAnalysis.textareas}`);
          console.log(`   📊 Labels: ${formAnalysis.labels.length}`);
          console.log(
            `   ${formAnalysis.hasForm ? "✅" : "❌"} Tem form: ${
              formAnalysis.hasForm
            }`
          );
          console.log(
            `   ${formAnalysis.hasSidebar ? "✅" : "❌"} Sidebar com form: ${
              formAnalysis.hasSidebar
            }`
          );
          console.log(
            `   ${
              formAnalysis.rightSidebarExists ? "✅" : "❌"
            } Sidebar existe: ${formAnalysis.rightSidebarExists}`
          );

          if (formAnalysis.labels.length > 0) {
            console.log("\n🏷️ Labels encontrados:");
            formAnalysis.labels.forEach((label) =>
              console.log(`   - "${label}"`)
            );
          }

          console.log("\n📄 Conteúdo do sidebar:");
          console.log(formAnalysis.rightSidebarContent);

          // Teste final: tentar preencher se houver inputs
          if (formAnalysis.inputs > 0) {
            console.log("\n✏️ Passo 7: Preenchendo formulário...");

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
              await textareas[0].type(
                "Este é o conteúdo do meu primeiro post no SectionMaster!"
              );
            }

            console.log("✅ Formulário preenchido com sucesso!");

            // Tentar salvar
            const saveResult = await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll("button"));
              const saveBtn = btns.find(
                (b) =>
                  b.textContent &&
                  (b.textContent.includes("Salvar") ||
                    b.textContent.includes("Save") ||
                    b.textContent.includes("Criar"))
              );

              if (saveBtn && !saveBtn.disabled) {
                saveBtn.click();
                return { saved: true, text: saveBtn.textContent };
              }
              return {
                saved: false,
                availableButtons: btns
                  .map((b) => b.textContent)
                  .filter((t) => t),
              };
            });

            if (saveResult.saved) {
              console.log(`✅ Post salvo com: "${saveResult.text}"`);
            } else {
              console.log("❌ Não foi possível salvar");
              console.log("Botões disponíveis:", saveResult.availableButtons);
            }
          }
        }
      }
    }

    // Screenshot final
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/test-completo-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot final: test-completo-${timestamp}.png`);

    await browser.close();

    console.log("\n🏆 TESTE COMPLETO FINALIZADO!");
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);
  }
})();
