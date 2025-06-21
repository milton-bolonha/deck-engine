const puppeteer = require("puppeteer");
const fs = require("fs");

async function testCorreções() {
  console.log("🔧 Verificando correções implementadas...");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  // Capturar erros da página
  const pageErrors = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
    console.error("❌ Erro de página:", error.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`🔍 Console Error: ${msg.text()}`);
    }
  });

  try {
    // Aguardar um tempo para o servidor inicializar
    console.log("⏳ Aguardando servidor inicializar...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("🌐 Navegando para o dashboard...");
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForTimeout(3000);

    // Verificar se a página carregou
    const title = await page.title();
    console.log(`📄 Título da página: ${title}`);

    // Screenshot inicial
    await page.screenshot({
      path: `outputs/screenshots/2025-06/dashboard-test-inicial-${timestamp}.png`,
      fullPage: true,
    });

    const resultados = [];

    // Teste 1: Verificar se não há o erro fatal de contentType.fields
    console.log("\n🔍 Teste 1: Verificando erro fatal contentType.fields...");
    const hasFatalError = pageErrors.some((error) =>
      error.includes("Cannot read properties of undefined (reading 'fields')")
    );

    if (!hasFatalError) {
      console.log("✅ PASSOU: Não há erro fatal de contentType.fields");
      resultados.push({ teste: "contentType.fields", status: "✅ PASSOU" });
    } else {
      console.log("❌ FALHOU: Ainda há erro fatal de contentType.fields");
      resultados.push({ teste: "contentType.fields", status: "❌ FALHOU" });
    }

    // Teste 2: Verificar navegação no menu
    console.log("\n🔍 Teste 2: Testando navegação no menu...");
    try {
      // Procurar seção Blog
      await page.waitForSelector("nav", { timeout: 5000 });
      const blogButton = await page.$x("//button[contains(text(), 'Blog')]");

      if (blogButton.length > 0) {
        await blogButton[0].click();
        await page.waitForTimeout(2000);

        console.log("✅ PASSOU: Conseguiu navegar para Blog");
        resultados.push({ teste: "navegacao_blog", status: "✅ PASSOU" });
      } else {
        console.log("⚠️ AVISO: Botão Blog não encontrado");
        resultados.push({ teste: "navegacao_blog", status: "⚠️ AVISO" });
      }
    } catch (error) {
      console.log("❌ FALHOU: Erro na navegação:", error.message);
      resultados.push({ teste: "navegacao_blog", status: "❌ FALHOU" });
    }

    // Teste 3: Verificar SectionMaster
    console.log("\n🔍 Teste 3: Verificando SectionMaster...");
    try {
      const sectionMasterButton = await page.$x(
        "//button[contains(text(), 'SectionMaster')]"
      );

      if (sectionMasterButton.length > 0) {
        await sectionMasterButton[0].click();
        await page.waitForTimeout(2000);

        console.log("✅ PASSOU: Conseguiu acessar SectionMaster");
        resultados.push({ teste: "sectionmaster_acesso", status: "✅ PASSOU" });
      } else {
        console.log("⚠️ AVISO: SectionMaster não encontrado");
        resultados.push({ teste: "sectionmaster_acesso", status: "⚠️ AVISO" });
      }
    } catch (error) {
      console.log("❌ FALHOU: Erro no SectionMaster:", error.message);
      resultados.push({ teste: "sectionmaster_acesso", status: "❌ FALHOU" });
    }

    // Screenshot final
    await page.screenshot({
      path: `outputs/screenshots/2025-06/dashboard-test-final-${timestamp}.png`,
      fullPage: true,
    });

    // Relatório final
    console.log("\n📊 RELATÓRIO FINAL DE CORREÇÕES:");
    console.log("=".repeat(50));

    resultados.forEach((resultado) => {
      console.log(`${resultado.status} ${resultado.teste}`);
    });

    const passou = resultados.filter((r) => r.status.includes("✅")).length;
    const total = resultados.length;

    console.log("\n📈 RESUMO:");
    console.log(`   Testes que passaram: ${passou}/${total}`);
    console.log(`   Taxa de sucesso: ${((passou / total) * 100).toFixed(1)}%`);

    if (pageErrors.length === 0) {
      console.log("\n🎉 EXCELENTE! Dashboard carregou sem erros fatais.");
    } else {
      console.log(`\n⚠️ Encontrados ${pageErrors.length} erros de página.`);
    }

    // Salvar relatório
    const relatorio = {
      timestamp,
      resultados,
      erros: pageErrors,
      resumo: {
        passou,
        total,
        taxa_sucesso: `${((passou / total) * 100).toFixed(1)}%`,
      },
    };

    fs.writeFileSync(
      `outputs/reports/2025-06/test-correcoes-${timestamp}.json`,
      JSON.stringify(relatorio, null, 2)
    );

    console.log(
      `\n💾 Relatório salvo: outputs/reports/2025-06/test-correcoes-${timestamp}.json`
    );
  } catch (error) {
    console.error("\n❌ ERRO CRÍTICO:", error.message);
  } finally {
    await browser.close();
  }
}

testCorreções().catch(console.error);
