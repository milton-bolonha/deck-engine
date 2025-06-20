const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🎯 TESTE FUNCIONAL REAL DO SECTIONMASTER");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      slowMo: 500, // Mais devagar para ver o que acontece
    });

    const page = await browser.newPage();

    // Listeners para debug
    page.on("console", (msg) => console.log(`[BROWSER]:`, msg.text()));
    page.on("pageerror", (error) => console.log(`[ERROR]:`, error.message));

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    console.log("1️⃣ Carregando dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });
    await page.waitForTimeout(2000);

    // Screenshot 1: Dashboard inicial
    await page.screenshot({
      path: `outputs/screenshots/2025-06/real-test-01-dashboard-${timestamp}.png`,
      fullPage: true,
    });
    console.log("📸 Screenshot 1: Dashboard inicial");

    console.log("2️⃣ Procurando e clicando em SectionMaster...");

    // Tentar várias estratégias para encontrar SectionMaster
    let sectionMasterClicked = false;

    try {
      // Estratégia 1: Procurar texto exato
      const sectionMasterButton = await page.waitForSelector(
        "text=SectionMaster",
        { timeout: 5000 }
      );
      if (sectionMasterButton) {
        await sectionMasterButton.click();
        sectionMasterClicked = true;
        console.log("✅ SectionMaster encontrado e clicado (texto exato)");
      }
    } catch (e) {
      console.log("⚠️ Estratégia 1 falhou, tentando estratégia 2...");

      try {
        // Estratégia 2: Procurar por botão que contém "Section"
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button, a"));
          const sectionBtn = buttons.find(
            (btn) =>
              btn.textContent && btn.textContent.includes("SectionMaster")
          );
          if (sectionBtn) {
            sectionBtn.click();
            return true;
          }
          return false;
        });
        sectionMasterClicked = true;
        console.log("✅ SectionMaster clicado (estratégia 2)");
      } catch (e2) {
        console.log("❌ Não conseguiu clicar no SectionMaster");
      }
    }

    if (sectionMasterClicked) {
      await page.waitForTimeout(3000);

      // Screenshot 2: SectionMaster aberto
      await page.screenshot({
        path: `outputs/screenshots/2025-06/real-test-02-sectionmaster-${timestamp}.png`,
        fullPage: true,
      });
      console.log("📸 Screenshot 2: SectionMaster aberto");

      // Analisar o que temos na tela
      const sectionMasterAnalysis = await page.evaluate(() => {
        return {
          url: location.href,
          title: document.title,
          hasCreateButton: !!document.querySelector(
            'button[data-action="create"], button:contains("Create"), button:contains("Criar"), button:contains("Novo")'
          ),
          sections: Array.from(
            document.querySelectorAll(".section, [data-section]")
          ).length,
          forms: document.querySelectorAll("form").length,
          buttons: Array.from(document.querySelectorAll("button"))
            .map((btn) => btn.textContent?.trim())
            .filter((text) => text),
          sidebarRight: !!document.querySelector(
            '.sidebar-right, [class*="right"], [class*="sidebar"]'
          ),
          mainContent: !!document.querySelector(
            '.main-content, [class*="main"], main'
          ),
          bodyText: document.body.textContent.substring(0, 500),
        };
      });

      console.log("📊 Análise do SectionMaster:");
      console.log(`   URL: ${sectionMasterAnalysis.url}`);
      console.log(
        `   Botões disponíveis: ${sectionMasterAnalysis.buttons.join(", ")}`
      );
      console.log(
        `   Tem botão Create: ${sectionMasterAnalysis.hasCreateButton}`
      );
      console.log(`   Seções: ${sectionMasterAnalysis.sections}`);
      console.log(`   Formulários: ${sectionMasterAnalysis.forms}`);
      console.log(`   Sidebar direita: ${sectionMasterAnalysis.sidebarRight}`);
      console.log(`   Main content: ${sectionMasterAnalysis.mainContent}`);

      console.log("3️⃣ Tentando criar uma nova seção...");

      // Procurar botões de criar/adicionar
      const createButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons
          .filter((btn) => {
            const text = btn.textContent?.toLowerCase() || "";
            return (
              text.includes("create") ||
              text.includes("add") ||
              text.includes("novo") ||
              text.includes("criar") ||
              text.includes("+") ||
              text.includes("new")
            );
          })
          .map((btn) => ({
            text: btn.textContent?.trim(),
            visible: btn.offsetParent !== null,
            disabled: btn.disabled,
          }));
      });

      console.log(`🔍 Botões de criar encontrados: ${createButtons.length}`);
      createButtons.forEach((btn, i) => {
        console.log(
          `   ${i + 1}. "${btn.text}" (visível: ${
            btn.visible
          }, ativo: ${!btn.disabled})`
        );
      });

      if (createButtons.length > 0) {
        // Tentar clicar no primeiro botão ativo
        const activeButton = createButtons.find(
          (btn) => btn.visible && !btn.disabled
        );
        if (activeButton) {
          console.log(`🎯 Clicando em: "${activeButton.text}"`);

          await page.evaluate((buttonText) => {
            const buttons = Array.from(document.querySelectorAll("button"));
            const targetBtn = buttons.find(
              (btn) => btn.textContent?.trim() === buttonText
            );
            if (targetBtn) {
              targetBtn.click();
            }
          }, activeButton.text);

          await page.waitForTimeout(3000);

          // Screenshot 3: Modal/Form de criação
          await page.screenshot({
            path: `outputs/screenshots/2025-06/real-test-03-create-form-${timestamp}.png`,
            fullPage: true,
          });
          console.log("📸 Screenshot 3: Formulário de criação");

          console.log("4️⃣ Analisando formulário de criação...");

          // Analisar o formulário que apareceu
          const formAnalysis = await page.evaluate(() => {
            const forms = document.querySelectorAll("form");
            const inputs = document.querySelectorAll("input, textarea, select");
            const labels = Array.from(document.querySelectorAll("label")).map(
              (l) => l.textContent?.trim()
            );
            const addons = Array.from(
              document.querySelectorAll('[class*="addon"], [data-addon]')
            );

            return {
              forms: forms.length,
              inputs: inputs.length,
              inputTypes: Array.from(inputs).map((input) => ({
                type: input.type || input.tagName.toLowerCase(),
                name: input.name,
                placeholder: input.placeholder,
                required: input.required,
              })),
              labels,
              addons: addons.length,
              hasDevMode:
                document.body.textContent.includes("[") &&
                document.body.textContent.includes("]"),
              sidebarVisible: !!document.querySelector(
                '.sidebar-right:not([style*="display: none"]), [class*="right"]:not([style*="display: none"])'
              ),
            };
          });

          console.log("📋 Análise do formulário:");
          console.log(`   Formulários: ${formAnalysis.forms}`);
          console.log(`   Inputs: ${formAnalysis.inputs}`);
          console.log(`   Addons: ${formAnalysis.addons}`);
          console.log(`   DevMode ativo: ${formAnalysis.hasDevMode}`);
          console.log(`   Sidebar visível: ${formAnalysis.sidebarVisible}`);
          console.log(`   Labels: ${formAnalysis.labels.join(", ")}`);

          if (formAnalysis.inputs > 0) {
            console.log("📝 Detalhes dos inputs:");
            formAnalysis.inputTypes.forEach((input, i) => {
              console.log(
                `   ${i + 1}. ${input.type} - ${input.name} "${
                  input.placeholder
                }" ${input.required ? "(obrigatório)" : ""}`
              );
            });
          }

          console.log("5️⃣ Tentando preencher o formulário...");

          // Tentar preencher alguns campos
          try {
            await page.evaluate(() => {
              // Procurar por campos de título/nome
              const titleInputs = Array.from(
                document.querySelectorAll(
                  'input[type="text"], input[name*="title"], input[name*="name"]'
                )
              );
              if (titleInputs.length > 0) {
                titleInputs[0].value = "Meu Blog de Teste";
                titleInputs[0].dispatchEvent(
                  new Event("input", { bubbles: true })
                );
                titleInputs[0].dispatchEvent(
                  new Event("change", { bubbles: true })
                );
              }

              // Procurar por textarea (descrição)
              const textareas = document.querySelectorAll("textarea");
              if (textareas.length > 0) {
                textareas[0].value =
                  "Esta é uma descrição do meu blog de teste para verificar se os addons funcionam.";
                textareas[0].dispatchEvent(
                  new Event("input", { bubbles: true })
                );
                textareas[0].dispatchEvent(
                  new Event("change", { bubbles: true })
                );
              }

              // Procurar por selects
              const selects = document.querySelectorAll("select");
              if (selects.length > 0 && selects[0].options.length > 1) {
                selects[0].selectedIndex = 1;
                selects[0].dispatchEvent(
                  new Event("change", { bubbles: true })
                );
              }
            });

            await page.waitForTimeout(2000);

            // Screenshot 4: Formulário preenchido
            await page.screenshot({
              path: `outputs/screenshots/2025-06/real-test-04-form-filled-${timestamp}.png`,
              fullPage: true,
            });
            console.log("📸 Screenshot 4: Formulário preenchido");

            console.log("6️⃣ Tentando salvar...");

            // Procurar botão de salvar
            const saveButtons = await page.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll("button"));
              return buttons
                .filter((btn) => {
                  const text = btn.textContent?.toLowerCase() || "";
                  return (
                    text.includes("save") ||
                    text.includes("salvar") ||
                    text.includes("create") ||
                    text.includes("submit") ||
                    text.includes("confirmar")
                  );
                })
                .map((btn) => btn.textContent?.trim());
            });

            console.log(
              `💾 Botões de salvar encontrados: ${saveButtons.join(", ")}`
            );

            if (saveButtons.length > 0) {
              await page.evaluate((buttonText) => {
                const buttons = Array.from(document.querySelectorAll("button"));
                const saveBtn = buttons.find((btn) => {
                  const text = btn.textContent?.toLowerCase() || "";
                  return (
                    text.includes("save") ||
                    text.includes("salvar") ||
                    text.includes("create")
                  );
                });
                if (saveBtn) {
                  saveBtn.click();
                }
              });

              await page.waitForTimeout(3000);

              // Screenshot 5: Após salvar
              await page.screenshot({
                path: `outputs/screenshots/2025-06/real-test-05-after-save-${timestamp}.png`,
                fullPage: true,
              });
              console.log("📸 Screenshot 5: Após salvar");
            }
          } catch (e) {
            console.log("⚠️ Erro ao preencher formulário:", e.message);
          }
        } else {
          console.log("❌ Nenhum botão de criar ativo encontrado");
        }
      } else {
        console.log("❌ Nenhum botão de criar encontrado");
      }
    } else {
      console.log("❌ Não conseguiu acessar o SectionMaster");
    }

    // Relatório final do teste real
    console.log("\n🏆 RESULTADO DO TESTE FUNCIONAL:");
    console.log(
      sectionMasterClicked
        ? "✅ SectionMaster acessível"
        : "❌ SectionMaster inacessível"
    );

    await browser.close();
    console.log("\n📸 Screenshots salvos em outputs/screenshots/2025-06/");
    console.log("🎯 Teste funcional concluído!");
  } catch (error) {
    console.error("❌ Erro durante teste funcional:", error.message);
  }
})();
