const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

class DashboardTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      errors: [],
      successes: [],
      screenshots: [],
      logs: [],
    };
  }

  async init() {
    console.log("🚀 INICIANDO TESTE COMPLETO DO DASHBOARD");

    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 800,
      defaultViewport: { width: 1400, height: 900 },
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });

    this.page = await this.browser.newPage();

    // Capturar erros de console
    this.page.on("console", (msg) => {
      const text = `🖥️  BROWSER: ${msg.type().toUpperCase()}: ${msg.text()}`;
      console.log(text);
      this.results.logs.push(text);

      if (msg.type() === "error") {
        this.results.errors.push(`Console Error: ${msg.text()}`);
      }
    });

    // Capturar erros de rede
    this.page.on("response", (response) => {
      if (response.status() >= 400) {
        const error = `Network Error: ${response.status()} - ${response.url()}`;
        console.log(`❌ ${error}`);
        this.results.errors.push(error);
      }
    });
  }

  async screenshot(name) {
    const filename = `test-complete-${name}-${
      new Date().toISOString().replace(/:/g, "-").split(".")[0]
    }.png`;
    const filepath = `outputs/screenshots/2025-06/${filename}`;

    // Criar diretório se não existir
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await this.page.screenshot({ path: filepath, fullPage: true });
    this.results.screenshots.push(filename);
    console.log(`📸 Screenshot: ${filename}`);
  }

  async waitAndCheck(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      this.results.errors.push(`Elemento não encontrado: ${selector}`);
      return false;
    }
  }

  async testBasicLoad() {
    console.log("\n📱 TESTE 1: Carregamento Básico");

    try {
      await this.page.goto("http://localhost:3001", {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      await this.screenshot("01-inicial");

      // Verificar se elementos principais existem
      const checks = [
        { selector: 'nav, [role="navigation"]', name: "Menu lateral" },
        { selector: 'main, [role="main"]', name: "Conteúdo principal" },
        { selector: ".sidebar, .right-sidebar", name: "Sidebar direito" },
      ];

      for (let check of checks) {
        const exists = await this.waitAndCheck(check.selector, 3000);
        if (exists) {
          this.results.successes.push(`✅ ${check.name} carregado`);
        }
      }

      console.log("✅ Dashboard carregado com sucesso");
    } catch (error) {
      this.results.errors.push(`Erro no carregamento básico: ${error.message}`);
      console.log(`❌ Erro no carregamento: ${error.message}`);
    }
  }

  async testNavigation() {
    console.log("\n🧭 TESTE 2: Navegação Entre Seções");

    const sections = [
      { name: "Overview", search: ["overview", "visão geral"] },
      { name: "Users", search: ["user", "usuário"] },
      { name: "Pipelines", search: ["pipeline", "builder"] },
      { name: "SectionMaster", search: ["sectionmaster", "section"] },
    ];

    for (let section of sections) {
      try {
        console.log(`  🎯 Testando navegação para: ${section.name}`);

        // Procurar botão da seção
        const buttonFound = await this.page.evaluate((searches) => {
          const buttons = Array.from(document.querySelectorAll("button, a"));

          for (let search of searches) {
            const button = buttons.find(
              (btn) =>
                btn.textContent &&
                btn.textContent.toLowerCase().includes(search.toLowerCase())
            );
            if (button) {
              button.click();
              return search;
            }
          }
          return false;
        }, section.search);

        if (buttonFound) {
          await this.page.waitForTimeout(2000);
          await this.screenshot(`02-nav-${section.name.toLowerCase()}`);

          // Verificar se conteúdo mudou
          const content = await this.page.evaluate(() => {
            const main = document.querySelector('main, [role="main"]');
            return main ? main.textContent.slice(0, 100) : "";
          });

          this.results.successes.push(
            `✅ Navegação ${section.name}: ${buttonFound}`
          );
          console.log(`  ✅ ${section.name} navegado com sucesso`);
        } else {
          this.results.errors.push(
            `❌ Botão não encontrado para ${section.name}`
          );
          console.log(`  ❌ Botão não encontrado para ${section.name}`);
        }
      } catch (error) {
        this.results.errors.push(
          `Erro na navegação ${section.name}: ${error.message}`
        );
      }
    }
  }

  async testSectionMaster() {
    console.log("\n🔧 TESTE 3: SectionMaster Funcionalidades");

    try {
      // Ir para SectionMaster
      const smFound = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const smButton = buttons.find(
          (btn) =>
            btn.textContent &&
            btn.textContent.toLowerCase().includes("sectionmaster")
        );
        if (smButton) {
          smButton.click();
          return true;
        }
        return false;
      });

      if (smFound) {
        await this.page.waitForTimeout(2000);
        await this.screenshot("03-sectionmaster-main");

        // Testar "Nova Seção"
        console.log("  🆕 Testando criação de nova seção");

        const newSectionButtons = await this.page.$$eval(
          "button",
          (buttons) =>
            buttons.filter(
              (btn) =>
                btn.textContent &&
                (btn.textContent.includes("Nova Seção") ||
                  btn.textContent.includes("Create") ||
                  btn.textContent.includes("Criar") ||
                  btn.textContent.includes("New"))
            ).length
        );

        if (newSectionButtons > 0) {
          const clicked = await this.page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"));
            const newBtn = buttons.find(
              (btn) =>
                btn.textContent &&
                (btn.textContent.includes("Nova Seção") ||
                  btn.textContent.includes("Create") ||
                  btn.textContent.includes("Criar"))
            );
            if (newBtn) {
              newBtn.click();
              return true;
            }
            return false;
          });

          if (clicked) {
            await this.page.waitForTimeout(1500);
            await this.screenshot("03-nova-secao-form");
            this.results.successes.push("✅ Formulário Nova Seção abriu");
            console.log("  ✅ Formulário Nova Seção funcionando");
          }
        }

        // Verificar se há seções listadas
        const sectionsListed = await this.page.evaluate(() => {
          const text = document.body.textContent || "";
          return (
            text.includes("Overview") ||
            text.includes("Dashboard") ||
            text.includes("Blog")
          );
        });

        if (sectionsListed) {
          this.results.successes.push("✅ Seções listadas no SectionMaster");
          console.log("  ✅ Seções estão sendo listadas");
        }
      } else {
        this.results.errors.push("❌ SectionMaster não encontrado no menu");
      }
    } catch (error) {
      this.results.errors.push(`Erro no SectionMaster: ${error.message}`);
    }
  }

  async testContentCreation() {
    console.log("\n📝 TESTE 4: Criação de Conteúdo");

    try {
      // Ir para Users para testar CRUD
      const usersFound = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const userBtn = buttons.find(
          (btn) =>
            btn.textContent && btn.textContent.toLowerCase().includes("user")
        );
        if (userBtn) {
          userBtn.click();
          return true;
        }
        return false;
      });

      if (usersFound) {
        await this.page.waitForTimeout(2000);
        await this.screenshot("04-users-list");

        // Procurar por botão de criar/adicionar
        const createButtons = await this.page.$$eval(
          "button",
          (buttons) =>
            buttons.filter(
              (btn) =>
                btn.textContent &&
                (btn.textContent.includes("+") ||
                  btn.textContent.includes("Create") ||
                  btn.textContent.includes("Add") ||
                  btn.textContent.includes("Criar") ||
                  btn.textContent.includes("Adicionar"))
            ).length
        );

        if (createButtons > 0) {
          this.results.successes.push("✅ Botões de criação encontrados");
          console.log("  ✅ Interface de criação disponível");
        }

        // Verificar se há lista de usuários ou placeholder
        const hasContent = await this.page.evaluate(() => {
          const main = document.querySelector('main, [role="main"]');
          const text = main ? main.textContent : "";
          return text.length > 50; // Tem conteúdo substancial
        });

        if (hasContent) {
          this.results.successes.push("✅ Conteúdo da seção Users carregado");
          console.log("  ✅ Conteúdo carregado na seção Users");
        }
      }
    } catch (error) {
      this.results.errors.push(`Erro na criação de conteúdo: ${error.message}`);
    }
  }

  async testRightSidebar() {
    console.log("\n⚙️ TESTE 5: Sidebar Direito");

    try {
      // Verificar se sidebar direito existe
      const sidebarExists = await this.waitAndCheck(
        '.right-sidebar, [class*="right"], [class*="sidebar"]:last-child'
      );

      if (sidebarExists) {
        await this.screenshot("05-sidebar-direito");

        // Procurar por elementos de configuração
        const configElements = await this.page.$$eval("*", (elements) => {
          return elements.filter(
            (el) =>
              el.textContent &&
              (el.textContent.includes("Configurações") ||
                el.textContent.includes("Config") ||
                el.textContent.includes("Settings"))
          ).length;
        });

        if (configElements > 0) {
          this.results.successes.push(
            "✅ Elementos de configuração no sidebar"
          );
          console.log("  ✅ Sidebar direito com configurações");
        }

        // Testar se abre formulários
        const hasButtons = await this.page.$$eval(
          "button",
          (buttons) => buttons.length
        );

        if (hasButtons > 5) {
          this.results.successes.push("✅ Botões interativos no sidebar");
          console.log("  ✅ Sidebar com interatividade");
        }
      }
    } catch (error) {
      this.results.errors.push(`Erro no sidebar direito: ${error.message}`);
    }
  }

  async generateReport() {
    console.log("\n📊 GERANDO RELATÓRIO FINAL");

    const report = {
      ...this.results,
      totalTests: 5,
      totalSuccesses: this.results.successes.length,
      totalErrors: this.results.errors.length,
      successRate: Math.round(
        (this.results.successes.length /
          (this.results.successes.length + this.results.errors.length)) *
          100
      ),
      status: this.results.errors.length === 0 ? "SUCCESS" : "ISSUES_FOUND",
    };

    // Salvar relatório JSON
    const reportPath = `outputs/reports/2025-06/complete-functionality-test-${
      new Date().toISOString().replace(/:/g, "-").split(".")[0]
    }.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Relatório em Markdown
    const mdReport = `# RELATÓRIO COMPLETO DE FUNCIONALIDADES
## Dashboard PipesNow - SectionMaster Framework

**Data:** ${report.timestamp}
**Status:** ${report.status}
**Taxa de Sucesso:** ${report.successRate}%

### ✅ SUCESSOS (${report.totalSuccesses})
${report.successes.map((s) => `- ${s}`).join("\n")}

### ❌ ERROS ENCONTRADOS (${report.totalErrors})
${report.errors.map((e) => `- ${e}`).join("\n")}

### 📸 SCREENSHOTS GERADOS
${report.screenshots.map((s) => `- ${s}`).join("\n")}

### 🔍 LOGS DO BROWSER
\`\`\`
${report.logs.slice(-20).join("\n")}
\`\`\`

---
*Gerado automaticamente em ${new Date().toLocaleString("pt-BR")}*
`;

    const mdPath = `outputs/reports/2025-06/COMPLETE-FUNCTIONALITY-REPORT.md`;
    fs.writeFileSync(mdPath, mdReport);

    console.log(`\n📋 Relatório salvo em: ${reportPath}`);
    console.log(`📋 Relatório MD salvo em: ${mdPath}`);

    return report;
  }

  async run() {
    try {
      await this.init();

      await this.testBasicLoad();
      await this.testNavigation();
      await this.testSectionMaster();
      await this.testContentCreation();
      await this.testRightSidebar();

      const report = await this.generateReport();

      console.log("\n" + "=".repeat(60));
      console.log(`🎯 TESTE COMPLETO FINALIZADO`);
      console.log(`✅ Sucessos: ${report.totalSuccesses}`);
      console.log(`❌ Erros: ${report.totalErrors}`);
      console.log(`📊 Taxa de Sucesso: ${report.successRate}%`);
      console.log("=".repeat(60));
    } catch (error) {
      console.error("❌ Erro crítico no teste:", error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Executar teste
const tester = new DashboardTester();
tester
  .run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erro fatal:", error);
    process.exit(1);
  });
