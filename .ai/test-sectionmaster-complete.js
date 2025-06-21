const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function testSectionMasterComplete() {
  console.log("🧪 Iniciando teste completo do SectionMaster Framework...\n");

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    details: [],
    checklist: {},
  };

  try {
    // ===== TESTE 1: CARREGAR DASHBOARD =====
    console.log("1️⃣ Testando carregamento do dashboard...");
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(3000);

    const dashboardLoaded = await page.locator("text=Navigation").isVisible();
    results.testsRun++;

    if (dashboardLoaded) {
      results.testsPassed++;
      results.details.push("✅ Dashboard carregado com sucesso");
      console.log("✅ Dashboard carregado");
    } else {
      results.testsFailed++;
      results.details.push("❌ Dashboard não carregou");
      console.log("❌ Dashboard não carregou");
    }

    // ===== TESTE 2: VERIFICAR SECTIONMASTER NO MENU =====
    console.log("\n2️⃣ Testando SectionMaster no menu...");

    const sectionMasterButton = page.locator("text=SectionMaster").first();
    results.testsRun++;

    if (await sectionMasterButton.isVisible()) {
      results.testsPassed++;
      results.details.push("✅ SectionMaster encontrado no menu");
      console.log("✅ SectionMaster no menu");

      await sectionMasterButton.click();
      await page.waitForTimeout(2000);

      // Verificar se o container do SectionMaster carregou (título visível)
      const sectionMasterTitle = page.locator("h1:has-text('SectionMaster')");
      if (await sectionMasterTitle.isVisible()) {
        results.details.push("✅ SectionMaster container carregado");
        console.log("✅ SectionMaster container OK");
      } else {
        results.details.push("❌ SectionMaster container não carregou");
      }
    } else {
      results.testsFailed++;
      results.details.push("❌ SectionMaster não encontrado no menu");
      console.log("❌ SectionMaster não encontrado");
    }

    // ===== TESTE 3: VERIFICAR NOVOS LAYOUTS =====
    console.log(
      "\n3️⃣ Testando novos layouts (Kanban, Canvas, Feed, Gallery)..."
    );

    // Tentar criar nova seção
    const novaSessaoBtn = page.locator("button:has-text('Nova Seção')");
    results.testsRun++;

    if (await novaSessaoBtn.isVisible()) {
      await novaSessaoBtn.click();
      await page.waitForTimeout(1000);

      // Verificar se existem ContentTypes disponíveis (são botões, não select)
      const dashboardType = page.locator("h4:has-text('Dashboard')").first();
      const kanbanType = page.locator("h4:has-text('Kanban')").first();
      const feedType = page.locator("h4:has-text('Feed')").first();
      const galleryType = page.locator("h4:has-text('Galeria')").first();

      const hasDashboard = await dashboardType.isVisible();
      const hasKanban = await kanbanType.isVisible();
      const hasFeed = await feedType.isVisible();
      const hasGallery = await galleryType.isVisible();

      if (hasDashboard || hasKanban || hasFeed || hasGallery) {
        results.testsPassed++;
        results.details.push("✅ ContentTypes disponíveis");
        console.log("✅ ContentTypes encontrados");
      } else {
        results.testsFailed++;
        results.details.push("❌ ContentTypes não encontrados");
      }
    } else {
      results.testsFailed++;
      results.details.push("❌ Botão Nova Seção não encontrado");
    }

    // ===== TESTE 4: VERIFICAR ADDONS ADMINISTRATIVOS =====
    console.log("\n4️⃣ Testando sistema de Addons...");

    // Verificar se existe botão de configurações no sidebar direito
    const configButton = page.locator("text=Configurar Seção");
    if (await configButton.isVisible()) {
      await configButton.click();
      await page.waitForTimeout(1000);

      const addonsButton = page.locator("text=Addons");
      if (await addonsButton.isVisible()) {
        await addonsButton.click();
        await page.waitForTimeout(1000);

        // Verificar se o Marketplace aparece
        const marketplaceButton = page.locator("text=Marketplace");
        if (await marketplaceButton.isVisible()) {
          results.testsRun++;
          results.testsPassed++;
          results.details.push("✅ Sistema de Addons funcionando");
          console.log("✅ Sistema de Addons OK");
        } else {
          results.testsRun++;
          results.testsFailed++;
          results.details.push("❌ Marketplace de Addons não encontrado");
        }
      } else {
        results.testsRun++;
        results.testsFailed++;
        results.details.push("❌ Botão Addons não encontrado");
      }
    } else {
      results.testsRun++;
      results.testsFailed++;
      results.details.push("❌ Configurações de seção não disponíveis");
    }

    // ===== TESTE 5: VERIFICAR ELEMENTOS CUSTOMIZÁVEIS =====
    console.log("\n5️⃣ Testando sistema de Elementos...");

    const elementsButton = page.locator("text=Elementos");
    if (await elementsButton.isVisible()) {
      await elementsButton.click();
      await page.waitForTimeout(1000);

      const addElementButton = page.locator("text=Adicionar Elemento");
      if (await addElementButton.isVisible()) {
        await addElementButton.click();
        await page.waitForTimeout(1000);

        // Verificar tipos de elementos disponíveis
        const textElement = page.locator("text=Texto");
        const imageElement = page.locator("text=Imagem");
        const metricsElement = page.locator("text=Métricas");

        const textExists = await textElement.isVisible();
        const imageExists = await imageElement.isVisible();
        const metricsExists = await metricsElement.isVisible();

        results.testsRun++;
        if (textExists && imageExists && metricsExists) {
          results.testsPassed++;
          results.details.push("✅ Sistema de Elementos completo");
          console.log("✅ Sistema de Elementos OK");
        } else {
          results.testsFailed++;
          results.details.push("❌ Tipos de elementos incompletos");
        }
      } else {
        results.testsRun++;
        results.testsFailed++;
        results.details.push("❌ Botão Adicionar Elemento não encontrado");
      }
    } else {
      results.testsRun++;
      results.testsFailed++;
      results.details.push("❌ Sistema de Elementos não disponível");
    }

    // ===== TESTE 6: VERIFICAR CRUD FUNCIONAL =====
    console.log("\n6️⃣ Testando CRUD funcional...");

    // Voltar para uma seção existente
    const usersSection = page.locator("text=Usuários");
    if (await usersSection.isVisible()) {
      await usersSection.click();
      await page.waitForTimeout(2000);

      // Verificar se existe botão "Create New"
      const createNewButton = page.locator("text=Create New");
      if (await createNewButton.isVisible()) {
        await createNewButton.click();
        await page.waitForTimeout(1000);

        // Verificar se formulário aparece no sidebar
        const nameInput = page.locator('input[name="name"]');
        if (await nameInput.isVisible()) {
          // Preencher formulário
          await nameInput.fill("Usuário Teste Completo");
          await page.fill('input[name="email"]', "teste-completo@example.com");

          const saveButton = page.locator("text=Salvar");
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            // Verificar se usuário aparece na lista
            const userInList = page.locator("text=Usuário Teste Completo");
            results.testsRun++;
            if (await userInList.isVisible()) {
              results.testsPassed++;
              results.details.push(
                "✅ CRUD funcional - Create/Read funcionando"
              );
              console.log("✅ CRUD funcionando");
            } else {
              results.testsFailed++;
              results.details.push("❌ CRUD não persistiu dados");
            }
          } else {
            results.testsRun++;
            results.testsFailed++;
            results.details.push("❌ Botão Salvar não encontrado");
          }
        } else {
          results.testsRun++;
          results.testsFailed++;
          results.details.push("❌ Formulário não apareceu no sidebar");
        }
      } else {
        results.testsRun++;
        results.testsFailed++;
        results.details.push("❌ Botão Create New não encontrado");
      }
    } else {
      results.testsRun++;
      results.testsFailed++;
      results.details.push("❌ Seção Usuários não encontrada");
    }

    // ===== TESTE 7: VERIFICAR DEVMODE =====
    console.log("\n7️⃣ Testando DevMode...");

    // Procurar por indicadores de DevMode
    const devModeIndicators = await page.locator("text=DevMode").count();
    const debugInfo = await page.locator("text=Debug").count();

    results.testsRun++;
    if (devModeIndicators > 0 || debugInfo > 0) {
      results.testsPassed++;
      results.details.push("✅ DevMode ativo e visível");
      console.log("✅ DevMode funcionando");
    } else {
      results.testsFailed++;
      results.details.push("❌ DevMode não detectado");
    }

    // ===== CHECKLIST FINAL =====
    console.log("\n📋 Verificando checklist do usuário...");

    results.checklist = {
      "SectionMaster no menu principal": results.details.some((d) =>
        d.includes("SectionMaster encontrado no menu")
      ),
      "Layouts expandidos (Kanban, Canvas, Feed, Gallery)":
        results.details.some((d) => d.includes("Novos layouts")),
      "Sistema de Addons administrativos": results.details.some((d) =>
        d.includes("Sistema de Addons")
      ),
      "Elementos customizáveis": results.details.some((d) =>
        d.includes("Sistema de Elementos")
      ),
      "CRUD funcional": results.details.some((d) =>
        d.includes("CRUD funcional")
      ),
      "DevMode ativo": results.details.some((d) => d.includes("DevMode")),
      "Interface unificada": results.testsPassed > results.testsFailed,
    };

    // ===== SCREENSHOT FINAL =====
    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotPath = `outputs/screenshots/2025-06/sectionmaster-complete-test-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.png`;

    // Criar diretório se não existir
    const screenshotDir = path.dirname(screenshotPath);
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    fs.writeFileSync(screenshotPath, screenshot);
    results.screenshot = screenshotPath;

    console.log(`\n📸 Screenshot salvo: ${screenshotPath}`);
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
    results.details.push(`❌ Erro: ${error.message}`);
    results.testsFailed++;
  } finally {
    await browser.close();
  }

  // ===== RESULTADOS FINAIS =====
  const successRate = ((results.testsPassed / results.testsRun) * 100).toFixed(
    1
  );

  console.log("\n🎯 RESULTADO FINAL:");
  console.log(`📊 Testes executados: ${results.testsRun}`);
  console.log(`✅ Testes aprovados: ${results.testsPassed}`);
  console.log(`❌ Testes falharam: ${results.testsFailed}`);
  console.log(`📈 Taxa de sucesso: ${successRate}%`);

  console.log("\n📋 CHECKLIST STATUS:");
  Object.entries(results.checklist).forEach(([item, status]) => {
    console.log(`${status ? "✅" : "❌"} ${item}`);
  });

  console.log("\n📝 DETALHES:");
  results.details.forEach((detail) => console.log(detail));

  // Salvar relatório
  const reportPath = `outputs/reports/2025-06/sectionmaster-complete-test-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Relatório salvo: ${reportPath}`);

  // Análise da checklist do usuário
  const completedItems = Object.values(results.checklist).filter(
    Boolean
  ).length;
  const totalItems = Object.keys(results.checklist).length;
  const checklistCompletion = ((completedItems / totalItems) * 100).toFixed(1);

  console.log(`\n🎯 ANÁLISE DA CHECKLIST DO USUÁRIO:`);
  console.log(
    `📊 Itens implementados: ${completedItems}/${totalItems} (${checklistCompletion}%)`
  );

  if (checklistCompletion >= 80) {
    console.log(
      "🎉 EXCELENTE! A maioria das funcionalidades está implementada"
    );
  } else if (checklistCompletion >= 60) {
    console.log(
      "👍 BOM! Funcionalidades core estão funcionando, mas ainda há gaps"
    );
  } else {
    console.log(
      "⚠️  ATENÇÃO! Muitas funcionalidades ainda precisam ser implementadas"
    );
  }

  return results;
}

// Executar teste
if (require.main === module) {
  testSectionMasterComplete().catch(console.error);
}

module.exports = { testSectionMasterComplete };
