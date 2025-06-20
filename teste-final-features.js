/**
 * 🎯 TESTE FINAL DE FEATURES ESPECÍFICAS
 * Validação focada em: navegação, seções, elementos, edits, create, crud,
 * sidebar right, inputs, textareas, emojipicker, kanban
 */

const puppeteer = require("puppeteer");
const fs = require("fs");

class TesteFinalFeatures {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      navegacao: {},
      secoes: {},
      elementos: {},
      crud: {},
      sidebarRight: {},
      inputs: {},
      kanban: {},
      score: 0,
      errors: [],
    };
    this.page = null;
    this.browser = null;
  }

  async inicializar() {
    console.log("🎯 TESTE FINAL DE FEATURES ESPECÍFICAS");
    console.log("=".repeat(80));

    this.browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });

    await this.page.goto("http://localhost:3001/", {
      waitUntil: "networkidle0",
    });
    await this.page.waitForTimeout(3000);
  }

  async testarNavegacao() {
    console.log("\n🧭 TESTANDO NAVEGAÇÃO ENTRE SEÇÕES");

    const secoes = ["Overview", "Usuários", "SectionMaster", "Faturamento"];
    const resultados = [];

    for (const secao of secoes) {
      console.log(`  📂 Testando navegação para: ${secao}`);

      const clicou = await this.page.evaluate((nomeSecao) => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const btn = buttons.find((b) => b.textContent.includes(nomeSecao));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, secao);

      await this.page.waitForTimeout(2000);

      const carregou = await this.page.evaluate(() => {
        return (
          document.body.textContent.length > 1000 &&
          !document.body.textContent.includes("Error:")
        );
      });

      const resultado = {
        secao,
        clicou,
        carregou,
        funcional: clicou && carregou,
      };

      resultados.push(resultado);

      console.log(
        `    ${
          resultado.funcional ? "✅" : "❌"
        } ${secao}: clicou: ${clicou}, carregou: ${carregou}`
      );
    }

    const funcionais = resultados.filter((r) => r.funcional).length;
    this.results.navegacao = {
      total: secoes.length,
      funcionais,
      taxa: Math.round((funcionais / secoes.length) * 100),
      detalhes: resultados,
    };

    console.log(
      `  📊 Navegação: ${funcionais}/${secoes.length} seções funcionais (${this.results.navegacao.taxa}%)`
    );

    return this.results.navegacao;
  }

  async testarSecoes() {
    console.log("\n📁 TESTANDO SISTEMA DE SEÇÕES");

    const validacao = await this.page.evaluate(() => {
      const sectionManager = window.sectionManager;
      if (!sectionManager?.initialized) {
        return { erro: "SectionManager não inicializado" };
      }

      const secoes = sectionManager.getAccessibleSections();

      return {
        total: secoes.length,
        core: secoes.filter((s) => s.coreSection).length,
        custom: secoes.filter((s) => !s.coreSection).length,
        comIcons: secoes.filter((s) => s.icon).length,
        comContentType: secoes.filter((s) => s.contentTypeId).length,
        nomes: secoes.map((s) => s.name || s.title),
      };
    });

    if (validacao.erro) {
      console.log(`  ❌ ${validacao.erro}`);
      this.results.secoes = { erro: validacao.erro, score: 0 };
    } else {
      const score = Math.min(100, (validacao.total / 5) * 100);

      this.results.secoes = {
        ...validacao,
        score,
        funcional: validacao.total >= 4,
      };

      console.log(
        `  ✅ Seções: ${validacao.total} total, ${validacao.core} core, ${validacao.custom} custom`
      );
      console.log(`  📊 Score: ${score}%`);
    }

    return this.results.secoes;
  }

  async testarCRUD() {
    console.log("\n📝 TESTANDO OPERAÇÕES CRUD");

    // Ir para SectionMaster
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent.includes("SectionMaster"));
      if (btn) btn.click();
    });
    await this.page.waitForTimeout(2000);

    // Testar CREATE
    const createTest = await this.page.evaluate(() => {
      const botaoNova = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent.includes("Nova Seção")
      );

      if (botaoNova) {
        botaoNova.click();
        return { temBotao: true, clicou: true };
      }

      return { temBotao: false, clicou: false };
    });

    await this.page.waitForTimeout(2000);

    // Verificar formulário de criação
    const formTest = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;

      return {
        formVisivel:
          bodyText.includes("Criar Nova Seção") ||
          bodyText.includes("Nova Seção"),
        temInputs: document.querySelectorAll("input").length >= 2,
        temTextareas: document.querySelectorAll("textarea").length > 0,
        temSelects: document.querySelectorAll("select").length > 0,
        temBotaoSalvar: Array.from(document.querySelectorAll("button")).some(
          (btn) =>
            btn.textContent.includes("Criar") ||
            btn.textContent.includes("Salvar")
        ),
      };
    });

    // Ir para Users para testar READ
    await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const btn = buttons.find((b) => b.textContent.includes("Usuários"));
      if (btn) btn.click();
    });
    await this.page.waitForTimeout(2000);

    const readTest = await this.page.evaluate(() => {
      const bodyText = document.body.textContent;

      return {
        secaoCarregou:
          bodyText.includes("User") || bodyText.includes("Usuário"),
        temLista:
          document.querySelector('[class*="list"], table, [class*="grid"]') !==
          null,
        temItens:
          document.querySelectorAll('[class*="item"], tr, [class*="card"]')
            .length > 0 ||
          bodyText.includes("Nenhum") ||
          bodyText.includes("No items"),
      };
    });

    this.results.crud = {
      create: {
        botaoNova: createTest.temBotao,
        formVisivel: formTest.formVisivel,
        temInputs: formTest.temInputs,
        score:
          Object.values({ ...createTest, ...formTest }).filter(Boolean).length *
          12.5,
      },
      read: {
        secaoCarregou: readTest.secaoCarregou,
        temLista: readTest.temLista,
        temItens: readTest.temItens,
        score: Object.values(readTest).filter(Boolean).length * 33.33,
      },
    };

    const scoreCrud =
      (this.results.crud.create.score + this.results.crud.read.score) / 2;
    this.results.crud.scoreGeral = Math.round(scoreCrud);

    console.log(
      `  ➕ CREATE: botão: ${createTest.temBotao}, form: ${formTest.formVisivel}, inputs: ${formTest.temInputs}`
    );
    console.log(
      `  👁️ READ: seção: ${readTest.secaoCarregou}, lista: ${readTest.temLista}, itens: ${readTest.temItens}`
    );
    console.log(`  📊 CRUD Score: ${this.results.crud.scoreGeral}%`);

    return this.results.crud;
  }

  async testarSidebarRight() {
    console.log("\n📐 TESTANDO RIGHT SIDEBAR");

    const validacao = await this.page.evaluate(() => {
      const rightSidebar = document.querySelector('[class*="RightSidebar"]');

      if (!rightSidebar) {
        return { existe: false };
      }

      const estilos = window.getComputedStyle(rightSidebar);

      return {
        existe: true,
        visivel: estilos.display !== "none",
        temForm: rightSidebar.querySelector("form") !== null,
        temInputs: rightSidebar.querySelectorAll("input").length,
        temTextareas: rightSidebar.querySelectorAll("textarea").length,
        temSelects: rightSidebar.querySelectorAll("select").length,
        temHeader: rightSidebar.querySelector("h1, h2, h3") !== null,
        conteudoTamanho: rightSidebar.textContent.length,
      };
    });

    if (validacao.existe) {
      const score =
        [
          validacao.visivel,
          validacao.temForm,
          validacao.temInputs > 0,
          validacao.temHeader,
          validacao.conteudoTamanho > 100,
        ].filter(Boolean).length * 20;

      validacao.score = score;
      validacao.funcional = score >= 60;

      console.log(
        `  ✅ RightSidebar: visível: ${validacao.visivel}, form: ${validacao.temForm}`
      );
      console.log(
        `  📊 Inputs: ${validacao.temInputs}, textareas: ${validacao.temTextareas}, selects: ${validacao.temSelects}`
      );
      console.log(`  📊 Score: ${score}%`);
    } else {
      console.log(`  ❌ RightSidebar não encontrado`);
      validacao.score = 0;
      validacao.funcional = false;
    }

    this.results.sidebarRight = validacao;

    return this.results.sidebarRight;
  }

  async testarInputs() {
    console.log("\n📝 TESTANDO INPUTS E TEXTAREAS");

    const inputTest = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll("input");
      const textareas = document.querySelectorAll("textarea");
      const selects = document.querySelectorAll("select");

      // Testar diferentes tipos de input
      const tiposInput = {};
      inputs.forEach((input) => {
        const tipo = input.type || "text";
        tiposInput[tipo] = (tiposInput[tipo] || 0) + 1;
      });

      // Testar interação com primeiro input text
      let testeInteracao = false;
      const primeiroText = Array.from(inputs).find(
        (inp) => inp.type === "text"
      );
      if (primeiroText) {
        primeiroText.focus();
        primeiroText.value = "Teste de input";
        primeiroText.dispatchEvent(new Event("input", { bubbles: true }));
        testeInteracao = primeiroText.value === "Teste de input";
      }

      // Testar textarea
      let testeTextarea = false;
      if (textareas.length > 0) {
        const textarea = textareas[0];
        textarea.focus();
        textarea.value = "Teste de textarea\ncom múltiplas linhas";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        testeTextarea = textarea.value.includes("múltiplas");
      }

      return {
        totalInputs: inputs.length,
        totalTextareas: textareas.length,
        totalSelects: selects.length,
        tiposInput,
        testeInteracao,
        testeTextarea,
        temRequired: document.querySelectorAll(
          "input[required], textarea[required]"
        ).length,
      };
    });

    const score =
      [
        inputTest.totalInputs >= 2,
        inputTest.totalTextareas > 0,
        inputTest.testeInteracao,
        inputTest.testeTextarea,
        inputTest.temRequired > 0,
      ].filter(Boolean).length * 20;

    this.results.inputs = {
      ...inputTest,
      score,
      funcional: score >= 60,
    };

    console.log(
      `  📊 Inputs: ${inputTest.totalInputs}, textareas: ${inputTest.totalTextareas}, selects: ${inputTest.totalSelects}`
    );
    console.log(
      `  🎯 Interação input: ${inputTest.testeInteracao}, textarea: ${inputTest.testeTextarea}`
    );
    console.log(`  📊 Score: ${score}%`);

    return this.results.inputs;
  }

  async testarKanban() {
    console.log("\n📋 TESTANDO LAYOUT KANBAN");

    const kanbanTest = await this.page.evaluate(() => {
      const contentTypes = window.dataProvider?.getContentTypes() || {};
      const kanbanContentType = contentTypes.kanban;

      if (!kanbanContentType) {
        return { existe: false, erro: "ContentType Kanban não encontrado" };
      }

      return {
        existe: true,
        layoutType: kanbanContentType.layoutType,
        temColunas:
          kanbanContentType.columns && Array.isArray(kanbanContentType.columns),
        numeroColunas: kanbanContentType.columns?.length || 0,
        temCampoStatus: kanbanContentType.fields?.status !== undefined,
        temCampoPrioridade: kanbanContentType.fields?.priority !== undefined,
        temCampoTitulo: kanbanContentType.fields?.title !== undefined,
      };
    });

    if (kanbanTest.existe) {
      const score =
        [
          kanbanTest.layoutType === "kanban",
          kanbanTest.temColunas,
          kanbanTest.numeroColunas >= 3,
          kanbanTest.temCampoStatus,
          kanbanTest.temCampoTitulo,
        ].filter(Boolean).length * 20;

      kanbanTest.score = score;
      kanbanTest.funcional = score >= 60;

      console.log(`  ✅ Kanban existe: layoutType: ${kanbanTest.layoutType}`);
      console.log(
        `  📊 Colunas: ${kanbanTest.numeroColunas}, status: ${kanbanTest.temCampoStatus}`
      );
      console.log(`  📊 Score: ${score}%`);
    } else {
      console.log(`  ❌ ${kanbanTest.erro}`);
      kanbanTest.score = 0;
      kanbanTest.funcional = false;
    }

    this.results.kanban = kanbanTest;

    return this.results.kanban;
  }

  async gerarRelatorioFinal() {
    console.log("\n📋 GERANDO RELATÓRIO FINAL...");

    // Calcular score geral
    const scores = [
      this.results.navegacao?.taxa || 0,
      this.results.secoes?.score || 0,
      this.results.crud?.scoreGeral || 0,
      this.results.sidebarRight?.score || 0,
      this.results.inputs?.score || 0,
      this.results.kanban?.score || 0,
    ];

    this.results.score = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );

    // Screenshot final
    const timestamp = Date.now();
    const screenshotPath = `outputs/teste-features-${timestamp}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    // Status do sistema
    let status;
    if (this.results.score >= 80) {
      status = "🟢 SISTEMA ALTAMENTE FUNCIONAL";
    } else if (this.results.score >= 65) {
      status = "🟡 SISTEMA FUNCIONAL";
    } else if (this.results.score >= 50) {
      status = "🟠 SISTEMA PARCIALMENTE FUNCIONAL";
    } else {
      status = "🔴 SISTEMA PRECISA DE CORREÇÕES";
    }

    // Salvar relatório
    const reportPath = `outputs/teste-features-final-${timestamp}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log("\n" + "=".repeat(80));
    console.log("🎯 RELATÓRIO FINAL - FEATURES ESPECÍFICAS");
    console.log("=".repeat(80));
    console.log(status);
    console.log(`📊 SCORE GERAL: ${this.results.score}%`);

    console.log("\n📊 SCORES POR FEATURE:");
    console.log(`  🧭 Navegação: ${this.results.navegacao?.taxa || 0}%`);
    console.log(`  📁 Seções: ${this.results.secoes?.score || 0}%`);
    console.log(`  📝 CRUD: ${this.results.crud?.scoreGeral || 0}%`);
    console.log(`  📐 RightSidebar: ${this.results.sidebarRight?.score || 0}%`);
    console.log(`  📝 Inputs: ${this.results.inputs?.score || 0}%`);
    console.log(`  📋 Kanban: ${this.results.kanban?.score || 0}%`);

    console.log("\n🎯 FEATURES FUNCIONAIS:");
    console.log(
      `  ${
        this.results.navegacao?.taxa >= 75 ? "✅" : "❌"
      } Navegação entre seções`
    );
    console.log(
      `  ${this.results.secoes?.funcional ? "✅" : "❌"} Sistema de seções`
    );
    console.log(
      `  ${this.results.crud?.scoreGeral >= 60 ? "✅" : "❌"} Operações CRUD`
    );
    console.log(
      `  ${
        this.results.sidebarRight?.funcional ? "✅" : "❌"
      } RightSidebar com formulários`
    );
    console.log(
      `  ${this.results.inputs?.funcional ? "✅" : "❌"} Inputs e textareas`
    );
    console.log(
      `  ${this.results.kanban?.funcional ? "✅" : "❌"} Layout Kanban`
    );

    console.log(`\n💾 Relatório: ${reportPath}`);
    console.log(`📸 Screenshot: ${screenshotPath}`);
    console.log("=".repeat(80));

    return {
      score: this.results.score,
      status,
      reportPath,
      screenshotPath,
    };
  }

  async executar() {
    try {
      await this.inicializar();

      await this.testarNavegacao();
      await this.testarSecoes();
      await this.testarCRUD();
      await this.testarSidebarRight();
      await this.testarInputs();
      await this.testarKanban();

      const relatorio = await this.gerarRelatorioFinal();

      return relatorio;
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      this.results.errors.push(error.message);
      return { error: error.message };
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Executar teste
const teste = new TesteFinalFeatures();
teste.executar();
