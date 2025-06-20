/**
 * 🔬 SUPER Diagnóstico - SectionMaster
 * Teste ultra detalhado para capturar TODOS os problemas
 */

const puppeteer = require("puppeteer");
const fs = require("fs");

async function superDiagnosis() {
  console.log("🔬 SUPER Diagnóstico - SectionMaster Framework");

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 🔥 CAPTURAR TODOS OS LOGS E ERROS
    const allLogs = [];
    const allErrors = [];

    page.on("console", (msg) => {
      const logEntry = `${msg.type()}: ${msg.text()}`;
      allLogs.push(logEntry);
      if (
        msg.text().includes("MainContent") ||
        msg.text().includes("SectionMaster") ||
        msg.text().includes("🎯")
      ) {
        console.log(`📋 IMPORTANTE: ${logEntry}`);
      }
    });

    page.on("pageerror", (error) => {
      const errorEntry = `PAGE ERROR: ${error.message}`;
      allErrors.push(errorEntry);
      console.log(`🚨 PAGE ERROR: ${error.message}`);
    });

    // 1. Carregar dashboard
    console.log("1️⃣ Carregando dashboard...");
    await page.goto("http://localhost:3001/", { waitUntil: "networkidle0" });
    await page.waitForTimeout(4000);

    // 2. Estado inicial
    console.log("2️⃣ Verificando estado inicial...");
    const initialState = await page.evaluate(() => {
      return {
        totalButtons: document.querySelectorAll("button").length,
        hasMainContent:
          document.querySelector('main, [class*="main"]') !== null,
        allH1s: Array.from(document.querySelectorAll("h1")).map(
          (h) => h.textContent
        ),
        selectedSection: window.selectedSection || "unknown",
      };
    });
    console.log("📊 Estado inicial:", initialState);

    // 3. Encontrar e clicar SectionMaster
    console.log("3️⃣ Clicando em SectionMaster...");
    const clickResult = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sectionMasterBtn = buttons.find((btn) =>
        btn.textContent.includes("SectionMaster")
      );

      if (sectionMasterBtn) {
        console.log("🎯 CLICANDO em SectionMaster agora...");
        sectionMasterBtn.click();
        return { success: true, buttonText: sectionMasterBtn.textContent };
      }

      return { success: false };
    });

    console.log("🎯 Resultado do clique:", clickResult);
    await page.waitForTimeout(6000); // Esperar bastante tempo

    // 4. Verificar mudanças após clique
    console.log("4️⃣ Verificando após clique...");
    const afterClick = await page.evaluate(() => {
      const mainContent = document.querySelector(
        'main, [class*="main"], .main-content'
      );

      return {
        hasMainContent: !!mainContent,
        mainContentHTML:
          mainContent?.innerHTML?.slice(0, 300) || "NO MAIN CONTENT",
        allH1s: Array.from(document.querySelectorAll("h1")).map((h) => ({
          text: h.textContent,
          visible: h.offsetHeight > 0 && h.offsetWidth > 0,
        })),
        sectionMasterInH1: Array.from(document.querySelectorAll("h1")).some(
          (h) =>
            h.textContent.includes("SectionMaster") &&
            h.offsetHeight > 0 &&
            h.offsetWidth > 0
        ),
        createButtonVisible: Array.from(
          document.querySelectorAll("button")
        ).some(
          (btn) =>
            btn.textContent.includes("Nova Seção") && btn.offsetHeight > 0
        ),
        totalVisibleElements: document.querySelectorAll("*").length,
        reactErrors:
          document.querySelector('[style*="color: red"]')?.textContent || null,
      };
    });

    console.log("📊 APÓS CLIQUE:");
    Object.entries(afterClick).forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });

    // 5. Screenshot final
    await page.screenshot({
      path: `outputs/super-diagnosis-${Date.now()}.png`,
      fullPage: true,
    });

    // 6. Análise final
    const success =
      afterClick.sectionMasterInH1 && afterClick.createButtonVisible;

    console.log(`\n🎯 RESULTADO: ${success ? "✅ SUCESSO" : "❌ FALHA"}`);

    if (!success) {
      console.log("🚨 PROBLEMAS DETECTADOS:");
      if (!afterClick.sectionMasterInH1)
        console.log("   - SectionMaster title não visível");
      if (!afterClick.createButtonVisible)
        console.log('   - Botão "Nova Seção" não visível');
      if (allErrors.length > 0)
        console.log(`   - ${allErrors.length} erros JavaScript`);
    }

    console.log("\n📋 LOGS IMPORTANTES:");
    allLogs
      .filter(
        (log) =>
          log.includes("MainContent") ||
          log.includes("SectionMaster") ||
          log.includes("🎯") ||
          log.includes("REDUCER") ||
          log.includes("ACTION")
      )
      .forEach((log) => console.log(`   ${log}`));

    if (allErrors.length > 0) {
      console.log("\n🔥 ERROS:");
      allErrors.forEach((error) => console.log(`   ${error}`));
    }

    // Salvar relatório
    const report = {
      initialState,
      clickResult,
      afterClick,
      allLogs,
      allErrors,
      success,
    };
    fs.writeFileSync(
      `outputs/super-diagnosis-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await browser.close();
  }
}

superDiagnosis();
