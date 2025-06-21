/**
 * 🏗️ TESTE ESTRUTURAL DE FEATURES
 * Validação da estrutura de arquivos e código independente do dashboard
 * Verifica: Componentes, Addons, ContentTypes, SectionManager, etc.
 */

const fs = require("fs");
const path = require("path");

class TesteEstruturalFeatures {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      estruturaArquivos: {},
      componentesCore: {},
      addonsSystem: {},
      layoutsEspeciais: {},
      formularios: {},
      sectionManager: {},
      score: 0,
      errors: [],
    };
  }

  inicializar() {
    console.log("🏗️ TESTE ESTRUTURAL DE FEATURES");
    console.log("=".repeat(80));
    console.log("Validando estrutura de arquivos e código...\n");
  }

  testarEstruturaArquivos() {
    console.log("📁 TESTANDO ESTRUTURA DE ARQUIVOS");

    const arquivosEssenciais = [
      "dashboard/package.json",
      "dashboard/next.config.js",
      "dashboard/app/layout.js",
      "dashboard/app/page.js",
      "dashboard/contexts/DashboardContext.js",
      "dashboard/components/layout/LeftSidebar.js",
      "dashboard/components/layout/MainContent.js",
      "dashboard/components/layout/RightSidebar.js",
      "dashboard/containers/SectionMasterContainer.js",
      "dashboard/utils/DataProvider.js",
      "dashboard/utils/SectionManager.js",
    ];

    const resultados = {};
    let arquivosEncontrados = 0;

    arquivosEssenciais.forEach((arquivo) => {
      const existe = fs.existsSync(arquivo);
      resultados[arquivo] = {
        existe,
        tamanho: existe ? fs.statSync(arquivo).size : 0,
      };

      if (existe) arquivosEncontrados++;

      console.log(
        `  ${existe ? "✅" : "❌"} ${arquivo} ${
          existe ? `(${resultados[arquivo].tamanho} bytes)` : ""
        }`
      );
    });

    const taxa = Math.round(
      (arquivosEncontrados / arquivosEssenciais.length) * 100
    );

    this.results.estruturaArquivos = {
      total: arquivosEssenciais.length,
      encontrados: arquivosEncontrados,
      taxa,
      detalhes: resultados,
    };

    console.log(
      `  📊 Estrutura: ${arquivosEncontrados}/${arquivosEssenciais.length} arquivos (${taxa}%)\n`
    );

    return this.results.estruturaArquivos;
  }

  testarComponentesCore() {
    console.log("🧩 TESTANDO COMPONENTES CORE");

    const componentesCore = [
      "dashboard/components/layout/LeftSidebar.js",
      "dashboard/components/layout/MainContent.js",
      "dashboard/components/layout/RightSidebar.js",
      "dashboard/components/layout/DashboardLayout.js",
      "dashboard/containers/SectionMasterContainer.js",
      "dashboard/containers/OverviewContainer.js",
    ];

    const resultados = {};
    let componentesFuncionais = 0;

    componentesCore.forEach((componente) => {
      const existe = fs.existsSync(componente);

      if (existe) {
        const conteudo = fs.readFileSync(componente, "utf8");

        const analise = {
          existe: true,
          temExport:
            conteudo.includes("export") || conteudo.includes("module.exports"),
          temReact:
            conteudo.includes("React") ||
            conteudo.includes("useState") ||
            conteudo.includes("useEffect"),
          temJSX: conteudo.includes("<") && conteudo.includes(">"),
          linhas: conteudo.split("\n").length,
          tamanho: conteudo.length,
        };

        const funcional =
          analise.temExport &&
          (analise.temReact || analise.temJSX) &&
          analise.linhas > 10;

        if (funcional) componentesFuncionais++;

        resultados[componente] = { ...analise, funcional };

        console.log(
          `  ${funcional ? "✅" : "❌"} ${path.basename(componente)}: ${
            analise.linhas
          } linhas, React: ${analise.temReact}, JSX: ${analise.temJSX}`
        );
      } else {
        resultados[componente] = { existe: false, funcional: false };
        console.log(`  ❌ ${path.basename(componente)}: não encontrado`);
      }
    });

    const taxa = Math.round(
      (componentesFuncionais / componentesCore.length) * 100
    );

    this.results.componentesCore = {
      total: componentesCore.length,
      funcionais: componentesFuncionais,
      taxa,
      detalhes: resultados,
    };

    console.log(
      `  📊 Componentes Core: ${componentesFuncionais}/${componentesCore.length} funcionais (${taxa}%)\n`
    );

    return this.results.componentesCore;
  }

  testarAddonsSystem() {
    console.log("🔧 TESTANDO SISTEMA DE ADDONS");

    const addonsPasta = "dashboard/components/addons";
    const addonsEssenciais = [
      "TextInputAddon.js",
      "TextareaAddon.js",
      "SelectAddon.js",
      "CheckboxAddon.js",
      "NumberInputAddon.js",
      "DatePickerAddon.js",
      "ImageUploadAddon.js",
      "WYSIWYGAddon.js",
      "SlugAddon.js",
    ];

    const resultados = {};
    let addonsFuncionais = 0;

    // Verificar se pasta de addons existe
    const pastaExiste = fs.existsSync(addonsPasta);
    console.log(
      `  📁 Pasta addons: ${pastaExiste ? "✅" : "❌"} ${addonsPasta}`
    );

    if (pastaExiste) {
      addonsEssenciais.forEach((addon) => {
        const caminhoAddon = path.join(addonsPasta, addon);
        const existe = fs.existsSync(caminhoAddon);

        if (existe) {
          const conteudo = fs.readFileSync(caminhoAddon, "utf8");

          const analise = {
            existe: true,
            temExport:
              conteudo.includes("export") ||
              conteudo.includes("module.exports"),
            temReact:
              conteudo.includes("React") || conteudo.includes("useState"),
            temInput:
              conteudo.includes("<input") ||
              conteudo.includes("<textarea") ||
              conteudo.includes("<select"),
            temProps: conteudo.includes("props") || conteudo.includes("{}"),
            linhas: conteudo.split("\n").length,
          };

          const funcional =
            analise.temExport && analise.temReact && analise.linhas > 15;

          if (funcional) addonsFuncionais++;

          resultados[addon] = { ...analise, funcional };

          console.log(
            `  ${funcional ? "✅" : "❌"} ${addon}: ${
              analise.linhas
            } linhas, input: ${analise.temInput}, props: ${analise.temProps}`
          );
        } else {
          resultados[addon] = { existe: false, funcional: false };
          console.log(`  ❌ ${addon}: não encontrado`);
        }
      });
    }

    const taxa = Math.round((addonsFuncionais / addonsEssenciais.length) * 100);

    this.results.addonsSystem = {
      pastaExiste,
      total: addonsEssenciais.length,
      funcionais: addonsFuncionais,
      taxa,
      detalhes: resultados,
    };

    console.log(
      `  📊 Addons: ${addonsFuncionais}/${addonsEssenciais.length} funcionais (${taxa}%)\n`
    );

    return this.results.addonsSystem;
  }

  testarLayoutsEspeciais() {
    console.log("🎨 TESTANDO LAYOUTS ESPECIAIS");

    const layoutsPasta = "dashboard/components/layouts";
    const layoutsEssenciais = [
      "ListView.js",
      "KanbanView.js",
      "FeedView.js",
      "GridView.js",
      "CanvasView.js",
      "DashboardView.js",
    ];

    const resultados = {};
    let layoutsFuncionais = 0;

    // Verificar se pasta de layouts existe
    const pastaExiste = fs.existsSync(layoutsPasta);
    console.log(
      `  📁 Pasta layouts: ${pastaExiste ? "✅" : "❌"} ${layoutsPasta}`
    );

    if (pastaExiste) {
      layoutsEssenciais.forEach((layout) => {
        const caminhoLayout = path.join(layoutsPasta, layout);
        const existe = fs.existsSync(caminhoLayout);

        if (existe) {
          const conteudo = fs.readFileSync(caminhoLayout, "utf8");

          const analise = {
            existe: true,
            temExport:
              conteudo.includes("export") ||
              conteudo.includes("module.exports"),
            temReact:
              conteudo.includes("React") || conteudo.includes("useState"),
            temJSX: conteudo.includes("<div") || conteudo.includes("<section"),
            temProps: conteudo.includes("props") || conteudo.includes("{}"),
            linhas: conteudo.split("\n").length,
            // Verificações específicas por layout
            kanbanSpecific: layout.includes("Kanban")
              ? conteudo.includes("column") || conteudo.includes("status")
              : null,
            feedSpecific: layout.includes("Feed")
              ? conteudo.includes("item") || conteudo.includes("post")
              : null,
          };

          const funcional =
            analise.temExport && analise.temReact && analise.linhas > 20;

          if (funcional) layoutsFuncionais++;

          resultados[layout] = { ...analise, funcional };

          console.log(
            `  ${funcional ? "✅" : "❌"} ${layout}: ${
              analise.linhas
            } linhas, JSX: ${analise.temJSX}`
          );
        } else {
          resultados[layout] = { existe: false, funcional: false };
          console.log(`  ❌ ${layout}: não encontrado`);
        }
      });
    }

    const taxa = Math.round(
      (layoutsFuncionais / layoutsEssenciais.length) * 100
    );

    this.results.layoutsEspeciais = {
      pastaExiste,
      total: layoutsEssenciais.length,
      funcionais: layoutsFuncionais,
      taxa,
      detalhes: resultados,
    };

    console.log(
      `  📊 Layouts: ${layoutsFuncionais}/${layoutsEssenciais.length} funcionais (${taxa}%)\n`
    );

    return this.results.layoutsEspeciais;
  }

  testarFormularios() {
    console.log("📝 TESTANDO SISTEMA DE FORMULÁRIOS");

    const formulariosPasta = "dashboard/components/forms";
    const formulariosEssenciais = [
      "SectionBuilder.js",
      "ItemForm.js",
      "UserForm.js",
      "ElementManager.js",
      "SectionMasterOverview.js",
    ];

    const resultados = {};
    let formulariosFuncionais = 0;

    // Verificar se pasta de formulários existe
    const pastaExiste = fs.existsSync(formulariosPasta);
    console.log(
      `  📁 Pasta forms: ${pastaExiste ? "✅" : "❌"} ${formulariosPasta}`
    );

    if (pastaExiste) {
      formulariosEssenciais.forEach((form) => {
        const caminhoForm = path.join(formulariosPasta, form);
        const existe = fs.existsSync(caminhoForm);

        if (existe) {
          const conteudo = fs.readFileSync(caminhoForm, "utf8");

          const analise = {
            existe: true,
            temExport:
              conteudo.includes("export") ||
              conteudo.includes("module.exports"),
            temReact:
              conteudo.includes("React") || conteudo.includes("useState"),
            temForm:
              conteudo.includes("<form") || conteudo.includes("onSubmit"),
            temInput:
              conteudo.includes("<input") ||
              conteudo.includes("<textarea") ||
              conteudo.includes("<select"),
            temValidacao:
              conteudo.includes("required") || conteudo.includes("validate"),
            linhas: conteudo.split("\n").length,
          };

          const funcional =
            analise.temExport &&
            analise.temReact &&
            (analise.temForm || analise.temInput) &&
            analise.linhas > 25;

          if (funcional) formulariosFuncionais++;

          resultados[form] = { ...analise, funcional };

          console.log(
            `  ${funcional ? "✅" : "❌"} ${form}: ${
              analise.linhas
            } linhas, form: ${analise.temForm}, input: ${analise.temInput}`
          );
        } else {
          resultados[form] = { existe: false, funcional: false };
          console.log(`  ❌ ${form}: não encontrado`);
        }
      });
    }

    const taxa = Math.round(
      (formulariosFuncionais / formulariosEssenciais.length) * 100
    );

    this.results.formularios = {
      pastaExiste,
      total: formulariosEssenciais.length,
      funcionais: formulariosFuncionais,
      taxa,
      detalhes: resultados,
    };

    console.log(
      `  📊 Formulários: ${formulariosFuncionais}/${formulariosEssenciais.length} funcionais (${taxa}%)\n`
    );

    return this.results.formularios;
  }

  testarSectionManager() {
    console.log("⚙️ TESTANDO SECTION MANAGER");

    const arquivosSectionManager = [
      "dashboard/utils/SectionManager.js",
      "dashboard/utils/DataProvider.js",
      "dashboard/utils/ContentTypeManager.js",
      "dashboard/contexts/DashboardContext.js",
    ];

    const resultados = {};
    let arquivosFuncionais = 0;

    arquivosSectionManager.forEach((arquivo) => {
      const existe = fs.existsSync(arquivo);

      if (existe) {
        const conteudo = fs.readFileSync(arquivo, "utf8");

        const analise = {
          existe: true,
          temClass:
            conteudo.includes("class ") || conteudo.includes("function "),
          temExport:
            conteudo.includes("export") || conteudo.includes("module.exports"),
          temSectionMethods:
            conteudo.includes("getAccessibleSections") ||
            conteudo.includes("sectionManager") ||
            conteudo.includes("ContentType") ||
            conteudo.includes("DataProvider"),
          temInitialization:
            conteudo.includes("initialized") || conteudo.includes("init"),
          linhas: conteudo.split("\n").length,
          comentarios:
            (conteudo.match(/\/\*/g) || []).length +
            (conteudo.match(/\/\//g) || []).length,
        };

        const funcional =
          analise.temClass && analise.temExport && analise.linhas > 30;

        if (funcional) arquivosFuncionais++;

        resultados[arquivo] = { ...analise, funcional };

        console.log(
          `  ${funcional ? "✅" : "❌"} ${path.basename(arquivo)}: ${
            analise.linhas
          } linhas, methods: ${analise.temSectionMethods}, init: ${
            analise.temInitialization
          }`
        );
      } else {
        resultados[arquivo] = { existe: false, funcional: false };
        console.log(`  ❌ ${path.basename(arquivo)}: não encontrado`);
      }
    });

    const taxa = Math.round(
      (arquivosFuncionais / arquivosSectionManager.length) * 100
    );

    this.results.sectionManager = {
      total: arquivosSectionManager.length,
      funcionais: arquivosFuncionais,
      taxa,
      detalhes: resultados,
    };

    console.log(
      `  📊 SectionManager: ${arquivosFuncionais}/${arquivosSectionManager.length} funcionais (${taxa}%)\n`
    );

    return this.results.sectionManager;
  }

  gerarRelatorioFinal() {
    console.log("📋 GERANDO RELATÓRIO FINAL...");

    // Calcular score geral
    const scores = [
      this.results.estruturaArquivos?.taxa || 0,
      this.results.componentesCore?.taxa || 0,
      this.results.addonsSystem?.taxa || 0,
      this.results.layoutsEspeciais?.taxa || 0,
      this.results.formularios?.taxa || 0,
      this.results.sectionManager?.taxa || 0,
    ];

    this.results.score = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );

    // Status do sistema
    let status;
    if (this.results.score >= 85) {
      status = "🟢 ESTRUTURA ALTAMENTE SÓLIDA";
    } else if (this.results.score >= 70) {
      status = "🟡 ESTRUTURA SÓLIDA";
    } else if (this.results.score >= 55) {
      status = "🟠 ESTRUTURA PARCIALMENTE SÓLIDA";
    } else {
      status = "🔴 ESTRUTURA PRECISA DE MELHORIAS";
    }

    // Salvar relatório
    const timestamp = Date.now();
    const reportPath = `outputs/teste-estrutural-${timestamp}.json`;

    // Criar pasta outputs se não existir
    if (!fs.existsSync("outputs")) {
      fs.mkdirSync("outputs");
    }

    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log("\n" + "=".repeat(80));
    console.log("🏗️ RELATÓRIO FINAL - TESTE ESTRUTURAL");
    console.log("=".repeat(80));
    console.log(status);
    console.log(`📊 SCORE GERAL: ${this.results.score}%`);

    console.log("\n📊 SCORES POR CATEGORIA:");
    console.log(
      `  📁 Estrutura de Arquivos: ${
        this.results.estruturaArquivos?.taxa || 0
      }%`
    );
    console.log(
      `  🧩 Componentes Core: ${this.results.componentesCore?.taxa || 0}%`
    );
    console.log(
      `  🔧 Sistema de Addons: ${this.results.addonsSystem?.taxa || 0}%`
    );
    console.log(
      `  🎨 Layouts Especiais: ${this.results.layoutsEspeciais?.taxa || 0}%`
    );
    console.log(`  📝 Formulários: ${this.results.formularios?.taxa || 0}%`);
    console.log(
      `  ⚙️ SectionManager: ${this.results.sectionManager?.taxa || 0}%`
    );

    console.log("\n🎯 CATEGORIAS SÓLIDAS:");
    console.log(
      `  ${
        this.results.estruturaArquivos?.taxa >= 80 ? "✅" : "❌"
      } Estrutura de arquivos essenciais`
    );
    console.log(
      `  ${
        this.results.componentesCore?.taxa >= 70 ? "✅" : "❌"
      } Componentes React funcionais`
    );
    console.log(
      `  ${
        this.results.addonsSystem?.taxa >= 60 ? "✅" : "❌"
      } Sistema de addons implementado`
    );
    console.log(
      `  ${
        this.results.layoutsEspeciais?.taxa >= 50 ? "✅" : "❌"
      } Layouts especiais (Kanban, Feed, etc.)`
    );
    console.log(
      `  ${
        this.results.formularios?.taxa >= 60 ? "✅" : "❌"
      } Sistema de formulários`
    );
    console.log(
      `  ${
        this.results.sectionManager?.taxa >= 75 ? "✅" : "❌"
      } SectionManager e utils`
    );

    // Resumo de implementação
    console.log("\n📈 RESUMO DE IMPLEMENTAÇÃO:");
    const totalArquivos = [
      this.results.estruturaArquivos?.encontrados || 0,
      this.results.componentesCore?.funcionais || 0,
      this.results.addonsSystem?.funcionais || 0,
      this.results.layoutsEspeciais?.funcionais || 0,
      this.results.formularios?.funcionais || 0,
      this.results.sectionManager?.funcionais || 0,
    ].reduce((sum, count) => sum + count, 0);

    const totalPossivel = [
      this.results.estruturaArquivos?.total || 0,
      this.results.componentesCore?.total || 0,
      this.results.addonsSystem?.total || 0,
      this.results.layoutsEspeciais?.total || 0,
      this.results.formularios?.total || 0,
      this.results.sectionManager?.total || 0,
    ].reduce((sum, count) => sum + count, 0);

    console.log(`  📄 Arquivos funcionais: ${totalArquivos}/${totalPossivel}`);
    console.log(
      `  📊 Taxa de implementação: ${Math.round(
        (totalArquivos / totalPossivel) * 100
      )}%`
    );

    console.log(`\n💾 Relatório: ${reportPath}`);
    console.log("=".repeat(80));

    return {
      score: this.results.score,
      status,
      totalArquivos,
      totalPossivel,
      reportPath,
    };
  }

  executar() {
    try {
      this.inicializar();

      this.testarEstruturaArquivos();
      this.testarComponentesCore();
      this.testarAddonsSystem();
      this.testarLayoutsEspeciais();
      this.testarFormularios();
      this.testarSectionManager();

      const relatorio = this.gerarRelatorioFinal();

      return relatorio;
    } catch (error) {
      console.error("❌ Erro no teste estrutural:", error);
      this.results.errors.push(error.message);
      return { error: error.message };
    }
  }
}

// Executar teste estrutural
const teste = new TesteEstruturalFeatures();
teste.executar();
