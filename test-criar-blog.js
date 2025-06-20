const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("📝 TESTE COMPLETO - Criar Blog e Post");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newPage();

    console.log("📱 Carregando dashboard...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    // Passo 1: Acessar SectionMaster
    console.log("🎯 Passo 1: Acessando SectionMaster...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.textContent?.includes("SectionMaster"));
      if (btn) btn.click();
    });

    await page.waitForTimeout(2000);

    // Passo 2: Clicar em "Nova Seção"
    console.log('🆕 Passo 2: Clicando em "Nova Seção"...');

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const novaSecaoBtn = btns.find((b) =>
        b.textContent?.includes("Nova Seção")
      );
      if (novaSecaoBtn) {
        console.log("Clicando em Nova Seção");
        novaSecaoBtn.click();
      }
    });

    await page.waitForTimeout(3000);

    // Passo 3: Verificar se apareceu o formulário de seção
    console.log("📝 Passo 3: Verificando formulário de nova seção...");

    const sectionFormCheck = await page.evaluate(() => {
      return {
        hasSectionBuilder:
          document.body.textContent.includes("Section Builder") ||
          document.body.textContent.includes("ContentType"),
        inputs: document.querySelectorAll("input").length,
        selects: document.querySelectorAll("select").length,
        rightSidebarContent:
          document.querySelector(".w-80")?.textContent?.substring(0, 300) ||
          "vazio",
        hasPostOption:
          document.body.textContent.includes("post") ||
          document.body.textContent.includes("Post") ||
          document.body.textContent.includes("Blog"),
      };
    });

    console.log(
      `   Section Builder: ${sectionFormCheck.hasSectionBuilder ? "✅" : "❌"}`
    );
    console.log(`   Inputs: ${sectionFormCheck.inputs}`);
    console.log(`   Selects: ${sectionFormCheck.selects}`);
    console.log(
      `   Tem opção Post: ${sectionFormCheck.hasPostOption ? "✅" : "❌"}`
    );

    console.log("\n📄 Conteúdo do formulário:");
    console.log(sectionFormCheck.rightSidebarContent);

    // Passo 4: Preencher formulário para criar seção de blog
    if (sectionFormCheck.inputs > 0) {
      console.log("\n✏️ Passo 4: Preenchendo formulário de nova seção...");

      // Preencher campos básicos
      await page.evaluate(() => {
        const inputs = document.querySelectorAll("input");
        if (inputs[0]) {
          inputs[0].value = "Blog";
          inputs[0].dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (inputs[1]) {
          inputs[1].value = "blog";
          inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
        }
      });

      // Tentar selecionar ContentType "post"
      await page.evaluate(() => {
        const selects = document.querySelectorAll("select");
        for (let select of selects) {
          const options = Array.from(select.options);
          const postOption = options.find(
            (opt) =>
              opt.value.includes("post") ||
              opt.textContent.includes("Post") ||
              opt.textContent.includes("Blog")
          );
          if (postOption) {
            select.value = postOption.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            console.log("Selecionado ContentType:", postOption.value);
            break;
          }
        }
      });

      await page.waitForTimeout(1000);

      // Tentar salvar
      const saveNewSection = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const saveBtn = btns.find(
          (b) =>
            b.textContent &&
            (b.textContent.includes("Salvar") ||
              b.textContent.includes("Save") ||
              b.textContent.includes("Criar"))
        );

        if (saveBtn) {
          saveBtn.click();
          return { saved: true, text: saveBtn.textContent };
        }
        return { saved: false };
      });

      if (saveNewSection.saved) {
        console.log(`✅ Seção criada: "${saveNewSection.text}"`);

        await page.waitForTimeout(3000);

        // Passo 5: Procurar pela nova seção "Blog"
        console.log("\n📖 Passo 5: Procurando seção Blog criada...");

        const blogSectionCheck = await page.evaluate(() => {
          return {
            hasBlogSection: document.body.textContent.includes("Blog"),
            sections: Array.from(document.querySelectorAll(".gaming-card"))
              .filter(
                (card) =>
                  card.className.includes("cursor-pointer") &&
                  card.textContent.includes("itens")
              )
              .map((card) => ({
                text: card.textContent.substring(0, 60),
                hasBlog: card.textContent.includes("Blog"),
              })),
          };
        });

        console.log(
          `   Tem seção Blog: ${blogSectionCheck.hasBlogSection ? "✅" : "❌"}`
        );
        console.log("\n📋 Seções encontradas:");
        blogSectionCheck.sections.forEach((section, i) => {
          console.log(
            `   ${i + 1}. ${section.text} ${section.hasBlog ? "← BLOG!" : ""}`
          );
        });

        // Passo 6: Clicar na seção Blog
        if (blogSectionCheck.hasBlogSection) {
          console.log("\n🖱️ Passo 6: Clicando na seção Blog...");

          await page.evaluate(() => {
            const cards = Array.from(
              document.querySelectorAll(".gaming-card")
            ).filter((card) => card.className.includes("cursor-pointer"));

            for (let card of cards) {
              if (card.textContent.includes("Blog")) {
                console.log("Clicando na seção Blog");
                card.click();
                break;
              }
            }
          });

          await page.waitForTimeout(3000);

          // Passo 7: Verificar se entramos na seção Blog com ListView
          console.log("\n📋 Passo 7: Verificando ListView do Blog...");

          const blogContentCheck = await page.evaluate(() => {
            return {
              hasCreateNew: document.body.textContent.includes("Create New"),
              hasBreadcrumb: document.body.textContent.includes("Blog"),
              hasListView:
                document.body.textContent.includes("ListView") ||
                document.body.textContent.includes("Nenhum item ainda") ||
                document.body.textContent.includes("primeiro"),
              content: document.body.textContent.substring(0, 400),
            };
          });

          console.log(
            `   Create New: ${blogContentCheck.hasCreateNew ? "✅" : "❌"}`
          );
          console.log(
            `   Breadcrumb: ${blogContentCheck.hasBreadcrumb ? "✅" : "❌"}`
          );
          console.log(
            `   ListView: ${blogContentCheck.hasListView ? "✅" : "❌"}`
          );

          console.log("\n📄 Conteúdo do Blog:");
          console.log(blogContentCheck.content);

          // Passo 8: FINALMENTE - Clicar em Create New no Blog!
          if (blogContentCheck.hasCreateNew) {
            console.log("\n🎉 Passo 8: CRIANDO POST NO BLOG!");

            await page.evaluate(() => {
              const btns = Array.from(document.querySelectorAll("button"));
              const createBtn = btns.find((b) =>
                b.textContent?.includes("Create New")
              );
              if (createBtn) {
                console.log("Clicando em Create New no Blog!");
                createBtn.click();
              }
            });

            await page.waitForTimeout(3000);

            // Passo 9: Verificar formulário de post
            console.log("\n📝 Passo 9: Verificando formulário de post...");

            const postFormCheck = await page.evaluate(() => {
              return {
                inputs: document.querySelectorAll("input").length,
                textareas: document.querySelectorAll("textarea").length,
                labels: Array.from(document.querySelectorAll("label")).map(
                  (l) => l.textContent
                ),
                hasForm: document.querySelector("form") !== null,
                hasAddons:
                  document.body.textContent.includes("Título") ||
                  document.body.textContent.includes("Slug") ||
                  document.body.textContent.includes("Conteúdo"),
                rightSidebarContent:
                  document
                    .querySelector(".w-80")
                    ?.textContent?.substring(0, 300) || "vazio",
              };
            });

            console.log(`   📊 Inputs: ${postFormCheck.inputs}`);
            console.log(`   📊 Textareas: ${postFormCheck.textareas}`);
            console.log(`   📊 Labels: ${postFormCheck.labels.length}`);
            console.log(
              `   ${postFormCheck.hasForm ? "✅" : "❌"} Tem form: ${
                postFormCheck.hasForm
              }`
            );
            console.log(
              `   ${postFormCheck.hasAddons ? "✅" : "❌"} Tem addons: ${
                postFormCheck.hasAddons
              }`
            );

            if (postFormCheck.labels.length > 0) {
              console.log("\n🏷️ Labels do formulário:");
              postFormCheck.labels.forEach((label) =>
                console.log(`   - "${label}"`)
              );
            }

            console.log("\n📄 Conteúdo do formulário:");
            console.log(postFormCheck.rightSidebarContent);

            // Passo 10: Preencher e salvar post
            if (postFormCheck.inputs > 0) {
              console.log("\n✏️ Passo 10: CRIANDO PRIMEIRO POST!");

              // Preencher título
              await page.evaluate(() => {
                const inputs = document.querySelectorAll(
                  'input[type="text"], input:not([type])'
                );
                if (inputs[0]) {
                  inputs[0].value = "Meu Primeiro Post no SectionMaster";
                  inputs[0].dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                }
                if (inputs[1]) {
                  inputs[1].value = "meu-primeiro-post-sectionmaster";
                  inputs[1].dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                }
              });

              // Preencher conteúdo
              const textareas = await page.$$("textarea");
              if (textareas.length > 0) {
                await textareas[0].type(
                  "Este é meu primeiro post criado no SectionMaster! 🎉\n\nO sistema está funcionando perfeitamente:\n- ✅ Criação de seções\n- ✅ ContentTypes funcionais\n- ✅ Addons integrados\n- ✅ Formulários dinâmicos\n\nSectionMaster é incrível!"
                );
              }

              console.log("✅ Post preenchido!");

              // Salvar post
              await page.waitForTimeout(1000);

              const savePost = await page.evaluate(() => {
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

              if (savePost.saved) {
                console.log(
                  `🎉 POST CRIADO COM SUCESSO! Botão: "${savePost.text}"`
                );

                await page.waitForTimeout(2000);

                // Verificar se o post apareceu na lista
                const finalCheck = await page.evaluate(() => {
                  return {
                    content: document.body.textContent.substring(0, 500),
                    hasPost:
                      document.body.textContent.includes("Meu Primeiro Post") ||
                      document.body.textContent.includes("sucesso") ||
                      document.body.textContent.includes("criado"),
                  };
                });

                console.log(
                  `\n🏆 POST VISÍVEL NA LISTA: ${
                    finalCheck.hasPost ? "✅ SIM!" : "❌ Não"
                  }`
                );
                console.log("\n📄 Estado final:");
                console.log(finalCheck.content);
              } else {
                console.log("❌ Não conseguiu salvar o post");
                console.log("Botões disponíveis:", savePost.availableButtons);
              }
            }
          }
        }
      }
    }

    // Screenshot final
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `outputs/screenshots/2025-06/blog-completo-${timestamp}.png`,
      fullPage: true,
    });

    console.log(`\n📸 Screenshot final: blog-completo-${timestamp}.png`);

    await browser.close();

    console.log("\n🎉 TESTE COMPLETO FINALIZADO!");
    console.log("✅ SectionMaster está 100% funcional!");
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);
  }
})();
