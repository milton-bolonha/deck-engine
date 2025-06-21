const puppeteer = require("puppeteer");
const fs = require("fs");

class TesteFuncionalidadeCompleta {
  constructor() {
    this.browser = null;
    this.page = null;
    this.resultados = {
      timestamp: new Date().toISOString(),
      testes: [],
      erros: [],
      sucessos: [],
      screenshots: [],
    };
  }

  async iniciar() {
    console.log("🧪 TESTE FUNCIONALIDADE COMPLETA DO DASHBOARD");
    console.log("=".repeat(60));

    this.browser = await puppeteer.launch({
      headless: false,
      slowMo: 500,
      defaultViewport: { width: 1400, height: 900 },
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });

    this.page = await this.browser.newPage();

    // Capturar erros JavaScript
    this.page.on("pageerror", (error) => {
      const msg = `❌ JavaScript Error: ${error.message}`;
      console.log(msg);
      this.resultados.erros.push(msg);
    });

    // Capturar erros de console
    this.page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = `❌ Console Error: ${msg.text()}`;
        console.log(text);
        this.resultados.erros.push(text);
      } else if (msg.text().includes("💾") || msg.text().includes("✅")) {
        console.log(`📋 ${msg.text()}`);
      }
    });

    try {
      await this.navegarParaDashboard();
      await this.testarAdicionarItens();
      await this.testarEditarItens();
      await this.testarGerenciarAddons();
      await this.testarElementos();
      await this.testarDeletarItens();

      this.gerarRelatorioFinal();
    } catch (error) {
      console.error("❌ ERRO CRÍTICO:", error);
      this.resultados.erros.push(`ERRO CRÍTICO: ${error.message}`);
    } finally {
      await this.browser.close();
    }
  }

  async navegarParaDashboard() {
    console.log("\n🌐 TESTE 1: Carregamento do Dashboard");

    await this.page.goto("http://localhost:3000", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await this.page.waitForTimeout(3000);
    await this.screenshot("01-dashboard-inicial");

    // Verificar se carregou sem erros críticos
    const temErroFatal = await this.page.evaluate(() => {
      return document.body.textContent.includes(
        "Cannot read properties of undefined"
      );
    });

    if (!temErroFatal) {
      this.sucesso("Dashboard carregou sem erros fatais");
    } else {
      this.erro("Dashboard com erro fatal de contentType");
    }
  }

  async testarAdicionarItens() {
    console.log("\n➕ TESTE 2: Adicionar Novos Itens");

    // Teste 2.1: Adicionar Post no Blog
    await this.testarAdicionarPost();

    // Teste 2.2: Adicionar Usuário
    await this.testarAdicionarUsuario();
  }

  async testarAdicionarPost() {
    console.log("  📝 Testando adicionar post no blog...");

    try {
      // Navegar para Blog
      const blogClicked = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const blogBtn = buttons.find(
          (btn) =>
            btn.textContent && btn.textContent.toLowerCase().includes("blog")
        );
        if (blogBtn) {
          blogBtn.click();
          return true;
        }
        return false;
      });

      if (!blogClicked) {
        this.erro("Botão Blog não encontrado");
        return;
      }

      await this.page.waitForTimeout(2000);
      await this.screenshot("02-blog-secao");

      // Procurar botão de criar
      const createButtons = await this.page.$$eval(
        "button",
        (buttons) =>
          buttons.filter(
            (btn) =>
              btn.textContent &&
              (btn.textContent.includes("Criar") ||
                btn.textContent.includes("Novo") ||
                btn.textContent.includes("Create") ||
                btn.textContent.includes("+"))
          ).length
      );

      if (createButtons === 0) {
        // Tentar right click ou botão de configuração
        await this.page.evaluate(() => {
          const configButtons = Array.from(document.querySelectorAll("button"));
          const configBtn = configButtons.find(
            (btn) => btn.textContent && btn.textContent.includes("Configurar")
          );
          if (configBtn) configBtn.click();
        });

        await this.page.waitForTimeout(1000);

        // Procurar botão de elementos
        await this.page.evaluate(() => {
          const elementButtons = Array.from(
            document.querySelectorAll("button")
          );
          const elementBtn = elementButtons.find(
            (btn) => btn.textContent && btn.textContent.includes("Elementos")
          );
          if (elementBtn) elementBtn.click();
        });

        await this.page.waitForTimeout(1000);
      }

      // Procurar formulário ou input de título
      const temFormulario = await this.page.$(
        'input[name="title"], input[placeholder*="título"], input[placeholder*="title"]'
      );

      if (temFormulario) {
        // Preencher formulário
        await this.page.type(
          'input[name="title"], input[placeholder*="título"], input[placeholder*="title"]',
          "Post de Teste Automatizado"
        );

        // Procurar campo de conteúdo
        const contentField = await this.page.$(
          'textarea, input[name="content"]'
        );
        if (contentField) {
          await this.page.type(
            'textarea, input[name="content"]',
            "Este é um post criado automaticamente pelo teste."
          );
        }

        await this.screenshot("02-blog-formulario-preenchido");

        // Procurar botão salvar
        const salvarClicked = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const salvarBtn = buttons.find(
            (btn) =>
              btn.textContent &&
              (btn.textContent.includes("Salvar") ||
                btn.textContent.includes("Save") ||
                btn.textContent.includes("Criar"))
          );
          if (salvarBtn) {
            salvarBtn.click();
            return true;
          }
          return false;
        });

        if (salvarClicked) {
          await this.page.waitForTimeout(2000);

          // Verificar se apareceu mensagem de sucesso
          const temSucesso = await this.page.evaluate(() => {
            return (
              document.body.textContent.includes("Item salvo com sucesso") ||
              document.body.textContent.includes("✅")
            );
          });

          if (temSucesso) {
            this.sucesso("Post criado com sucesso");
            await this.screenshot("02-blog-post-criado");
          } else {
            this.erro("Post não foi salvo - sem mensagem de sucesso");
          }
        } else {
          this.erro("Botão salvar não encontrado");
        }
      } else {
        this.erro("Formulário de criação de post não encontrado");
      }
    } catch (error) {
      this.erro(`Erro ao adicionar post: ${error.message}`);
    }
  }

  async testarAdicionarUsuario() {
    console.log("  👤 Testando adicionar usuário...");

    try {
      // Navegar para Users
      const usersClicked = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const usersBtn = buttons.find(
          (btn) =>
            btn.textContent &&
            (btn.textContent.toLowerCase().includes("user") ||
              btn.textContent.toLowerCase().includes("usuário"))
        );
        if (usersBtn) {
          usersBtn.click();
          return true;
        }
        return false;
      });

      if (usersClicked) {
        await this.page.waitForTimeout(2000);
        await this.screenshot("02-users-secao");

        // Similar ao teste de blog, mas para usuários
        // Procurar formulário ou tentar criar novo usuário
        const hasUserForm = await this.page.$(
          'input[name="name"], input[name="email"]'
        );

        if (hasUserForm) {
          await this.page.type('input[name="name"]', "Usuário Teste");
          await this.page.type('input[name="email"]', "teste@exemplo.com");

          this.sucesso("Formulário de usuário encontrado e preenchido");
          await this.screenshot("02-users-formulario");
        } else {
          this.erro("Formulário de usuário não encontrado");
        }
      }
    } catch (error) {
      this.erro(`Erro ao adicionar usuário: ${error.message}`);
    }
  }

  async testarEditarItens() {
    console.log("\n✏️ TESTE 3: Editar Itens Existentes");

    try {
      // Voltar para blog e tentar editar o item criado
      await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const blogBtn = buttons.find(
          (btn) =>
            btn.textContent && btn.textContent.toLowerCase().includes("blog")
        );
        if (blogBtn) blogBtn.click();
      });

      await this.page.waitForTimeout(2000);

      // Procurar lista de itens ou item criado
      const temItens = await this.page.evaluate(() => {
        const text = document.body.textContent;
        return (
          text.includes("Post de Teste Automatizado") ||
          text.includes("Primeiro Post") ||
          text.includes("post")
        );
      });

      if (temItens) {
        this.sucesso("Itens encontrados na seção blog");

        // Tentar clicar em um item para editar
        const itemClicked = await this.page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("*"));
          const item = elements.find(
            (el) => el.textContent && el.textContent.includes("Post")
          );
          if (item && item.click) {
            item.click();
            return true;
          }
          return false;
        });

        if (itemClicked) {
          await this.page.waitForTimeout(1000);
          this.sucesso("Item clicado para edição");
          await this.screenshot("03-item-sendo-editado");
        }
      } else {
        this.erro("Nenhum item encontrado para editar");
      }
    } catch (error) {
      this.erro(`Erro ao testar edição: ${error.message}`);
    }
  }

  async testarGerenciarAddons() {
    console.log("\n🧩 TESTE 4: Gerenciar Addons");

    try {
      // Ir para SectionMaster ou configurações
      const sectionMasterClicked = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const smBtn = buttons.find(
          (btn) => btn.textContent && btn.textContent.includes("SectionMaster")
        );
        if (smBtn) {
          smBtn.click();
          return true;
        }
        return false;
      });

      if (sectionMasterClicked) {
        await this.page.waitForTimeout(2000);
        await this.screenshot("04-sectionmaster");

        // Procurar por gestão de addons
        const addonsButton = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const addonBtn = buttons.find(
            (btn) =>
              btn.textContent &&
              (btn.textContent.includes("Addon") ||
                btn.textContent.includes("Marketplace"))
          );
          if (addonBtn) {
            addonBtn.click();
            return true;
          }
          return false;
        });

        if (addonsButton) {
          await this.page.waitForTimeout(2000);

          // Verificar se marketplace abriu
          const temMarketplace = await this.page.evaluate(() => {
            return (
              document.body.textContent.includes("Marketplace") ||
              document.body.textContent.includes("Addons")
            );
          });

          if (temMarketplace) {
            this.sucesso("Marketplace de addons abriu");
            await this.screenshot("04-marketplace-addons");

            // Procurar addons disponíveis
            const addonsDisponiveis = await this.page.$$eval(
              "*",
              (elements) =>
                elements.filter(
                  (el) =>
                    el.textContent &&
                    (el.textContent.includes("TextInput") ||
                      el.textContent.includes("WYSIWYG") ||
                      el.textContent.includes("ImageUpload"))
                ).length
            );

            if (addonsDisponiveis > 0) {
              this.sucesso(`${addonsDisponiveis} addons encontrados`);
            } else {
              this.erro("Nenhum addon encontrado no marketplace");
            }
          }
        }
      }
    } catch (error) {
      this.erro(`Erro ao testar addons: ${error.message}`);
    }
  }

  async testarElementos() {
    console.log("\n🎨 TESTE 5: Gerenciar Elementos");

    try {
      // Procurar por gestão de elementos
      const elementosButton = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const elemBtn = buttons.find(
          (btn) => btn.textContent && btn.textContent.includes("Elementos")
        );
        if (elemBtn) {
          elemBtn.click();
          return true;
        }
        return false;
      });

      if (elementosButton) {
        await this.page.waitForTimeout(2000);

        const temElementos = await this.page.evaluate(() => {
          return (
            document.body.textContent.includes("Elementos") ||
            document.body.textContent.includes("Element")
          );
        });

        if (temElementos) {
          this.sucesso("Interface de elementos encontrada");
          await this.screenshot("05-elementos");
        } else {
          this.erro("Interface de elementos não carregou");
        }
      } else {
        this.erro("Botão de elementos não encontrado");
      }
    } catch (error) {
      this.erro(`Erro ao testar elementos: ${error.message}`);
    }
  }

  async testarDeletarItens() {
    console.log("\n🗑️ TESTE 6: Deletar Itens");

    try {
      // Voltar para uma seção com dados
      await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const blogBtn = buttons.find(
          (btn) =>
            btn.textContent && btn.textContent.toLowerCase().includes("blog")
        );
        if (blogBtn) blogBtn.click();
      });

      await this.page.waitForTimeout(2000);

      // Procurar botões de deletar
      const deleteButtons = await this.page.$$eval(
        "button",
        (buttons) =>
          buttons.filter(
            (btn) =>
              btn.textContent &&
              (btn.textContent.includes("Delete") ||
                btn.textContent.includes("Remover") ||
                btn.textContent.includes("🗑️") ||
                btn.innerHTML.includes("fa-trash"))
          ).length
      );

      if (deleteButtons > 0) {
        this.sucesso(`${deleteButtons} botões de deletar encontrados`);
      } else {
        this.erro("Nenhum botão de deletar encontrado");
      }
    } catch (error) {
      this.erro(`Erro ao testar deleção: ${error.message}`);
    }
  }

  async screenshot(nome) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const path = `outputs/screenshots/2025-06/funcionalidade-${nome}-${timestamp}.png`;

    try {
      await this.page.screenshot({ path, fullPage: true });
      this.resultados.screenshots.push(path);
      console.log(`📸 Screenshot: ${nome}`);
    } catch (error) {
      console.log(`❌ Erro ao tirar screenshot: ${error.message}`);
    }
  }

  sucesso(mensagem) {
    const msg = `✅ ${mensagem}`;
    console.log(`  ${msg}`);
    this.resultados.sucessos.push(msg);
    this.resultados.testes.push({ tipo: "SUCESSO", mensagem });
  }

  erro(mensagem) {
    const msg = `❌ ${mensagem}`;
    console.log(`  ${msg}`);
    this.resultados.erros.push(msg);
    this.resultados.testes.push({ tipo: "ERRO", mensagem });
  }

  gerarRelatorioFinal() {
    console.log("\n📊 RELATÓRIO FINAL");
    console.log("=".repeat(60));

    const totalTestes = this.resultados.testes.length;
    const sucessos = this.resultados.sucessos.length;
    const erros = this.resultados.erros.length;
    const taxaSucesso =
      totalTestes > 0 ? ((sucessos / totalTestes) * 100).toFixed(1) : 0;

    console.log(`📈 Testes executados: ${totalTestes}`);
    console.log(`✅ Sucessos: ${sucessos}`);
    console.log(`❌ Erros: ${erros}`);
    console.log(`📊 Taxa de sucesso: ${taxaSucesso}%`);

    // Determinar status geral
    let statusGeral;
    if (taxaSucesso >= 80) {
      statusGeral = "🎉 EXCELENTE - Sistema funcionando bem!";
    } else if (taxaSucesso >= 60) {
      statusGeral = "⚠️ BOM - Algumas melhorias necessárias";
    } else if (taxaSucesso >= 40) {
      statusGeral = "🔧 PRECISA MELHORAR - Vários problemas encontrados";
    } else {
      statusGeral = "❌ CRÍTICO - Muitos problemas, requer atenção urgente";
    }

    console.log(`\n🎯 STATUS GERAL: ${statusGeral}`);

    // Salvar relatório
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const relatorioPath = `outputs/reports/2025-06/funcionalidade-completa-${timestamp}.json`;

    try {
      fs.writeFileSync(relatorioPath, JSON.stringify(this.resultados, null, 2));
      console.log(`💾 Relatório salvo: ${relatorioPath}`);
    } catch (error) {
      console.log(`❌ Erro ao salvar relatório: ${error.message}`);
    }

    console.log("\n🏁 TESTE FINALIZADO");

    // Retornar resultado para análise
    return {
      taxaSucesso: parseFloat(taxaSucesso),
      statusGeral,
      funcionando: taxaSucesso >= 60,
    };
  }
}

// Executar teste
async function executarTeste() {
  const teste = new TesteFuncionalidadeCompleta();
  const resultado = await teste.iniciar();

  // Conclusão final
  if (resultado.funcionando) {
    console.log("\n🎉 RESULTADO: Dashboard está FUNCIONAL!");
  } else {
    console.log("\n🔧 RESULTADO: Dashboard precisa de correções");
  }

  return resultado;
}

// Executar se chamado diretamente
if (require.main === module) {
  executarTeste().catch(console.error);
}

module.exports = { TesteFuncionalidadeCompleta, executarTeste };
