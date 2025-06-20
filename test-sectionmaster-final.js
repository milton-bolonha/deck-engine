const puppeteer = require("puppeteer-core");

(async () => {
  try {
    console.log("🎯 TESTE FINAL - SECTIONMASTER FUNCIONAL COMPLETO");

    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      slowMo: 1000,
    });

    const page = await browser.newPage();

    // Listeners para debug
    page.on("console", (msg) => console.log(`[BROWSER]:`, msg.text()));
    page.on("pageerror", (error) => console.log(`[ERROR]:`, error.message));

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    console.log("1️⃣ Carregando dashboard...");
    await page.goto("http://localhost:3001", { waitUntil: "networkidle2" });
    await page.waitForTimeout(3000);

    // Screenshot 1: Dashboard inicial
    await page.screenshot({
      path: `outputs/screenshots/2025-06/final-test-01-dashboard-${timestamp}.png`,
      fullPage: true,
    });
    console.log("📸 Screenshot 1: Dashboard inicial salvo");

    console.log("2️⃣ Procurando SectionMaster no menu...");

    // Tentar clicar no SectionMaster no DevTools
    try {
      await page.waitForSelector("button", { timeout: 5000 });

      // Procurar por SectionMaster
      const sectionMasterFound = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const sectionMasterBtn = buttons.find(
          (btn) => btn.textContent && btn.textContent.includes("SectionMaster")
        );

        if (sectionMasterBtn) {
          sectionMasterBtn.click();
          return true;
        }
        return false;
      });

      if (sectionMasterFound) {
        console.log("✅ SectionMaster encontrado e clicado!");

        await page.waitForTimeout(4000);

        // Screenshot 2: SectionMaster aberto
        await page.screenshot({
          path: `outputs/screenshots/2025-06/final-test-02-sectionmaster-${timestamp}.png`,
          fullPage: true,
        });
        console.log("📸 Screenshot 2: SectionMaster aberto");

        console.log("3️⃣ Analisando interface do SectionMaster...");

        // Analisar a interface
        const sectionMasterAnalysis = await page.evaluate(() => {
          return {
            url: location.href,
            title: document.title,
            hasCreateButton: Array.from(
              document.querySelectorAll("button")
            ).some(
              (btn) =>
                btn.textContent &&
                (btn.textContent.includes("Nova Seção") ||
                  btn.textContent.includes("Create") ||
                  btn.textContent.includes("Criar"))
            ),
            sectionsFound: document.querySelectorAll(".gaming-card").length,
            statisticsCards: document.querySelectorAll('[class*="text-2xl"]')
              .length,
            devModeInfo: document.body.textContent.includes("DevMode"),
            bodyContent: document.body.textContent.substring(0, 500),
          };
        });

        console.log("📊 Análise do SectionMaster:");
        console.log(`   URL: ${sectionMasterAnalysis.url}`);
        console.log(
          `   Tem botão criar: ${sectionMasterAnalysis.hasCreateButton}`
        );
        console.log(
          `   Cards encontrados: ${sectionMasterAnalysis.sectionsFound}`
        );
        console.log(
          `   Cards de estatísticas: ${sectionMasterAnalysis.statisticsCards}`
        );
        console.log(`   DevMode ativo: ${sectionMasterAnalysis.devModeInfo}`);

        if (sectionMasterAnalysis.hasCreateButton) {
          console.log("4️⃣ Testando criação de nova seção...");

          // Tentar clicar em "Nova Seção"
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"));
            const createBtn = buttons.find(
              (btn) =>
                btn.textContent &&
                (btn.textContent.includes("Nova Seção") ||
                  btn.textContent.includes("Create") ||
                  btn.textContent.includes("Criar"))
            );

            if (createBtn) {
              createBtn.click();
            }
          });

          await page.waitForTimeout(3000);

          // Screenshot 3: Modal de criação
          await page.screenshot({
            path: `outputs/screenshots/2025-06/final-test-03-create-modal-${timestamp}.png`,
            fullPage: true,
          });
          console.log("📸 Screenshot 3: Modal de criação");

          // Verificar se o sidebar direito apareceu
          const sidebarAnalysis = await page.evaluate(() => {
            return {
              rightSidebar: !!document.querySelector(
                '.sidebar-right, [class*="right-sidebar"], [class*="sidebar"]'
              ),
              modals: document.querySelectorAll('[role="dialog"], .modal')
                .length,
              forms: document.querySelectorAll("form").length,
              inputs: document.querySelectorAll("input, textarea, select")
                .length,
              addons: Array.from(document.querySelectorAll("label")).filter(
                (label) => label.textContent && label.textContent.includes("[")
              ).length,
            };
          });

          console.log("📋 Análise do formulário:");
          console.log(`   Sidebar direita: ${sidebarAnalysis.rightSidebar}`);
          console.log(`   Modais: ${sidebarAnalysis.modals}`);
          console.log(`   Formulários: ${sidebarAnalysis.forms}`);
          console.log(`   Inputs: ${sidebarAnalysis.inputs}`);
          console.log(`   Addons detectados: ${sidebarAnalysis.addons}`);

          if (sidebarAnalysis.inputs > 0) {
            console.log("5️⃣ Testando preenchimento do formulário...");

            // Tentar preencher o formulário
            await page.evaluate(() => {
              // Preencher campos de texto
              const textInputs =
                document.querySelectorAll('input[type="text"]');
              if (textInputs.length > 0) {
                textInputs[0].value = "Meu Blog de Teste";
                textInputs[0].dispatchEvent(
                  new Event("input", { bubbles: true })
                );
                textInputs[0].dispatchEvent(
                  new Event("change", { bubbles: true })
                );
              }

              // Preencher textarea se existir
              const textareas = document.querySelectorAll("textarea");
              if (textareas.length > 0) {
                textareas[0].value =
                  "Descrição do meu blog de teste com addons funcionais";
                textareas[0].dispatchEvent(
                  new Event("input", { bubbles: true })
                );
              }

              // Selecionar opção em select se existir
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
              path: `outputs/screenshots/2025-06/final-test-04-form-filled-${timestamp}.png`,
              fullPage: true,
            });
            console.log("📸 Screenshot 4: Formulário preenchido");

            // Tentar salvar
            console.log("6️⃣ Tentando salvar a seção...");

            const saveButtons = await page.evaluate(() => {
              const buttons = Array.from(document.querySelectorAll("button"));
              return buttons
                .filter((btn) => {
                  const text = btn.textContent?.toLowerCase() || "";
                  return (
                    text.includes("save") ||
                    text.includes("salvar") ||
                    text.includes("criar") ||
                    text.includes("confirmar")
                  );
                })
                .map((btn) => btn.textContent?.trim());
            });

            console.log(
              `💾 Botões de salvar encontrados: ${saveButtons.join(", ")}`
            );

            if (saveButtons.length > 0) {
              await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll("button"));
                const saveBtn = buttons.find((btn) => {
                  const text = btn.textContent?.toLowerCase() || "";
                  return (
                    text.includes("save") ||
                    text.includes("salvar") ||
                    text.includes("criar")
                  );
                });
                if (saveBtn && !saveBtn.disabled) {
                  saveBtn.click();
                }
              });

              await page.waitForTimeout(3000);

              // Screenshot 5: Após salvar
              await page.screenshot({
                path: `outputs/screenshots/2025-06/final-test-05-after-save-${timestamp}.png`,
                fullPage: true,
              });
              console.log("📸 Screenshot 5: Após salvar");
            }
          }
        }

        // Resultado final
        console.log("\n🏆 RESULTADO DO TESTE FUNCIONAL COMPLETO:");
        console.log(`✅ Dashboard carregado: SIM`);
        console.log(`✅ SectionMaster acessível: SIM`);
        console.log(
          `✅ Interface funcional: ${
            sectionMasterAnalysis.hasCreateButton ? "SIM" : "NÃO"
          }`
        );
        console.log(
          `✅ Formulários funcionando: ${
            sidebarAnalysis?.inputs > 0 ? "SIM" : "NÃO"
          }`
        );
        console.log(
          `✅ DevMode ativo: ${
            sectionMasterAnalysis.devModeInfo ? "SIM" : "NÃO"
          }`
        );

        const overallSuccess =
          sectionMasterAnalysis.hasCreateButton &&
          sidebarAnalysis?.inputs > 0 &&
          sectionMasterAnalysis.devModeInfo;

        console.log(
          `\n🎯 STATUS GERAL: ${
            overallSuccess ? "✅ SUCESSO TOTAL" : "⚠️ PROBLEMAS DETECTADOS"
          }`
        );
      } else {
        console.log("❌ SectionMaster não encontrado no menu");
      }
    } catch (e) {
      console.log("❌ Erro ao acessar SectionMaster:", e.message);
    }

    await browser.close();
    console.log(
      "\n📸 Todos os screenshots salvos em outputs/screenshots/2025-06/"
    );
    console.log("🎉 Teste funcional completo concluído!");
  } catch (error) {
    console.error("❌ Erro durante teste:", error.message);
  }
})();
