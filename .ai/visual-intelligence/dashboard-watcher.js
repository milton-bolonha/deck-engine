// 🤖 AI Dashboard Visual Watcher - REAL AUTOMATION + SEMANTIC ANALYSIS
const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");

class DashboardWatcher {
  constructor() {
    this.baseUrl = "http://localhost:3001";
    this.outputDir = path.join(__dirname, "../outputs");

    // Criar estrutura organizada por data
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const monthFolder = `${year}-${month}`;

    this.screenshotDir = path.join(this.outputDir, "screenshots", monthFolder);
    this.reportDir = path.join(this.outputDir, "reports", monthFolder);

    // Garantir que as pastas existem
    fs.ensureDirSync(this.screenshotDir);
    fs.ensureDirSync(this.reportDir);

    console.log(`📁 Organized outputs for ${monthFolder}`);
    console.log(`📸 Screenshots: ${this.screenshotDir}`);
    console.log(`📋 Reports: ${this.reportDir}`);

    // Inicializar análise semântica
    this.semanticData = {
      components: [],
      navigation: [],
      interactions: [],
      performance: {},
      errors: [],
      suggestions: [],
    };
  }

  async launch() {
    console.log("🚀 Launching AI Dashboard Watcher...");

    try {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1920, height: 1080 });

      // Habilitar análise de performance
      await this.page.tracing.start({
        path: path.join(this.outputDir, "performance-trace.json"),
      });

      console.log("✅ Browser launched successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to launch browser:", error.message);
      return false;
    }
  }

  async analyzePageStructure() {
    console.log("🧠 Analyzing page semantic structure...");

    try {
      // Analisar estrutura semântica da página
      const structure = await this.page.evaluate(() => {
        const components = [];
        const navigation = [];

        // Detectar tipos de componentes
        const cards = document.querySelectorAll(
          '.card, [class*="card"], .dashboard-card, [data-testid*="card"]'
        );
        const forms = document.querySelectorAll('form, [role="form"]');
        const buttons = document.querySelectorAll(
          'button, [role="button"], input[type="submit"]'
        );
        const navItems = document.querySelectorAll(
          'nav a, .nav-link, [role="tab"], [role="menuitem"]'
        );
        const inputs = document.querySelectorAll("input, textarea, select");
        const modals = document.querySelectorAll(
          '[role="dialog"], .modal, [data-testid*="modal"]'
        );

        // Analisar cards/componentes
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          components.push({
            type: "card",
            id: card.id || `card-${index}`,
            classes: card.className,
            text: card.textContent?.substring(0, 100) || "",
            position: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            visible: rect.width > 0 && rect.height > 0,
          });
        });

        // Analisar formulários
        forms.forEach((form, index) => {
          components.push({
            type: "form",
            id: form.id || `form-${index}`,
            action: form.action || "",
            method: form.method || "GET",
            inputs: form.querySelectorAll("input, textarea, select").length,
          });
        });

        // Analisar navegação
        navItems.forEach((nav, index) => {
          navigation.push({
            type: "navigation",
            href: nav.href || "",
            text: nav.textContent?.trim() || "",
            active:
              nav.classList.contains("active") ||
              nav.getAttribute("aria-current") === "page",
          });
        });

        return {
          components,
          navigation,
          totalButtons: buttons.length,
          totalInputs: inputs.length,
          totalModals: modals.length,
          pageTitle: document.title,
          url: window.location.href,
        };
      });

      this.semanticData.components = structure.components;
      this.semanticData.navigation = structure.navigation;
      this.semanticData.pageInfo = {
        title: structure.pageTitle,
        url: structure.url,
        totalButtons: structure.totalButtons,
        totalInputs: structure.totalInputs,
        totalModals: structure.totalModals,
      };

      console.log(
        `🧠 Found ${structure.components.length} components, ${structure.navigation.length} nav items`
      );
      return true;
    } catch (error) {
      console.error("❌ Error analyzing structure:", error.message);
      this.semanticData.errors.push(`Structure analysis: ${error.message}`);
      return false;
    }
  }

  async generateMermaidDiagram() {
    console.log("📊 Generating Mermaid topology diagram...");

    const components = this.semanticData.components;
    const navigation = this.semanticData.navigation;

    let mermaid = `graph TD\n`;
    mermaid += `    Dashboard["🎛️ Dashboard (${
      this.semanticData.pageInfo?.title || "Unknown"
    })"]\\n\\n`;

    // Adicionar componentes principais
    components.forEach((comp, index) => {
      const icon =
        comp.type === "card" ? "📊" : comp.type === "form" ? "📝" : "🧩";
      const cleanId = `comp${index}`;
      mermaid += `    ${cleanId}["${icon} ${comp.type.toUpperCase()} - ${
        comp.id
      }"]\\n`;
      mermaid += `    Dashboard --> ${cleanId}\\n`;
    });

    // Adicionar navegação
    if (navigation.length > 0) {
      mermaid += `\\n    Nav["🧭 Navigation"]\\n`;
      mermaid += `    Dashboard --> Nav\\n`;

      navigation.forEach((nav, index) => {
        if (nav.text) {
          const cleanNavId = `nav${index}`;
          mermaid += `    ${cleanNavId}["${nav.active ? "▶️" : "📄"} ${
            nav.text
          }"]\\n`;
          mermaid += `    Nav --> ${cleanNavId}\\n`;
        }
      });
    }

    return mermaid;
  }

  async generateTestSuggestions() {
    console.log("🧪 Generating automated test suggestions...");

    const suggestions = [];
    const components = this.semanticData.components;
    const navigation = this.semanticData.navigation;
    const pageInfo = this.semanticData.pageInfo;

    // Sugestões baseadas em componentes
    const cardComponents = components.filter((c) => c.type === "card");
    if (cardComponents.length > 0) {
      suggestions.push({
        type: "Visual Regression",
        description: `Testar ${cardComponents.length} cards para mudanças visuais`,
        code: `// Puppeteer test for cards\\nconst cards = await page.$$('.card');\\nexpect(cards).toHaveLength(${cardComponents.length});`,
      });
    }

    const formComponents = components.filter((c) => c.type === "form");
    if (formComponents.length > 0) {
      suggestions.push({
        type: "Form Validation",
        description: `Testar ${formComponents.length} formulários`,
        code: `// Test form submission\\nconst forms = await page.$$('form');\\n// Add validation tests for each form`,
      });
    }

    // Sugestões baseadas em navegação
    if (navigation.length > 0) {
      suggestions.push({
        type: "Navigation Flow",
        description: `Testar ${navigation.length} links de navegação`,
        code: `// Test navigation flow\\nconst navLinks = await page.$$('nav a');\\n// Test each navigation path`,
      });
    }

    // Sugestões baseadas em performance
    if (pageInfo?.totalInputs > 5) {
      suggestions.push({
        type: "Performance",
        description: "Dashboard com muitos inputs - verificar performance",
        code: `// Performance test\\nconst metrics = await page.metrics();\\nexpect(metrics.JSHeapUsedSize).toBeLessThan(50000000);`,
      });
    }

    // Sugestões de acessibilidade
    suggestions.push({
      type: "Accessibility",
      description: "Verificar conformidade de acessibilidade",
      code: `// Accessibility test with axe-core\\nconst axeResults = await page.evaluate(() => axe.run());\\nexpect(axeResults.violations).toHaveLength(0);`,
    });

    this.semanticData.suggestions = suggestions;
    return suggestions;
  }

  async captureFullDashboard() {
    console.log("📱 Accessing dashboard at:", this.baseUrl);

    try {
      const startTime = Date.now();

      // Acessar o dashboard
      await this.page.goto(this.baseUrl, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      const loadTime = Date.now() - startTime;
      this.semanticData.performance.loadTime = loadTime;

      console.log(`✅ Dashboard loaded successfully (${loadTime}ms)`);

      // Analisar estrutura semântica
      await this.analyzePageStructure();

      // Capturar screenshot completo
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `dashboard-full-${timestamp}.png`;
      const filepath = path.join(this.screenshotDir, filename);

      await this.page.screenshot({
        path: filepath,
        fullPage: true,
      });

      console.log("📸 Full dashboard screenshot saved:", filename);
      return { success: true, filename, filepath };
    } catch (error) {
      console.error("❌ Error capturing dashboard:", error.message);
      this.semanticData.errors.push(`Dashboard capture: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async interactWithElements() {
    console.log("🎯 Starting semantic dashboard interaction...");

    try {
      // Aguardar elementos carregarem
      await this.page.waitForTimeout(2000);

      const interactions = [];

      // Verificar se existem cards no dashboard
      const cards = await this.page.$$(
        '.card, [class*="card"], .dashboard-card'
      );
      console.log(`📊 Found ${cards.length} dashboard cards`);

      // Capturar screenshot de cada seção com análise semântica
      for (let i = 0; i < Math.min(cards.length, 3); i++) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `dashboard-section-${i + 1}-${timestamp}.png`;
        const filepath = path.join(this.screenshotDir, filename);

        await cards[i].screenshot({ path: filepath });

        // Analisar conteúdo semântico do card
        const cardData = await cards[i].evaluate((element) => ({
          text: element.textContent?.substring(0, 200) || "",
          classes: element.className,
          id: element.id,
          hasButtons: element.querySelectorAll("button").length,
          hasInputs: element.querySelectorAll("input").length,
          hasLinks: element.querySelectorAll("a").length,
        }));

        interactions.push({
          type: "section_screenshot",
          element: `section-${i + 1}`,
          filename,
          timestamp,
          semanticData: cardData,
        });

        console.log(`📸 Section ${i + 1} screenshot saved:`, filename);
      }

      // Tentar clicar em navegação se existir
      const navLinks = await this.page.$$('nav a, .nav-link, [role="tab"]');
      if (navLinks.length > 0) {
        console.log(`🔗 Found ${navLinks.length} navigation links`);

        // Clicar no primeiro link de navegação
        await navLinks[0].click();
        await this.page.waitForTimeout(1000);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `dashboard-nav-click-${timestamp}.png`;
        const filepath = path.join(this.screenshotDir, filename);

        await this.page.screenshot({ path: filepath, fullPage: true });

        const navData = await navLinks[0].evaluate((element) => ({
          href: element.href,
          text: element.textContent?.trim(),
          active: element.classList.contains("active"),
        }));

        interactions.push({
          type: "navigation_click",
          element: "first-nav-link",
          filename,
          timestamp,
          semanticData: navData,
        });

        console.log("🔗 Navigation interaction completed:", filename);
      }

      this.semanticData.interactions = interactions;
      return { success: true, interactions };
    } catch (error) {
      console.error("❌ Error during interaction:", error.message);
      this.semanticData.errors.push(`Interaction: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async generateReport(results) {
    console.log("📋 Generating enhanced semantic automation report...");

    const timestamp = new Date().toISOString();
    const reportFilename = `dashboard-automation-report-${timestamp.replace(
      /[:.]/g,
      "-"
    )}.md`;
    const reportPath = path.join(this.reportDir, reportFilename);

    // Informações de organização
    const now = new Date();
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Gerar diagrama Mermaid e sugestões de teste
    const mermaidDiagram = await this.generateMermaidDiagram();
    const testSuggestions = await this.generateTestSuggestions();

    let report = `# 🤖 Dashboard AI Automation Report (Enhanced)

**Generated:** ${timestamp}  
**Target:** ${this.baseUrl}  
**Status:** ${results.success ? "✅ SUCCESS" : "❌ FAILED"}  
**Month:** ${currentMonth} ${currentYear}  
**Screenshots Folder:** \`${path.basename(this.screenshotDir)}\`  
**Reports Folder:** \`${path.basename(this.reportDir)}\`  

## 📊 Executive Summary

`;

    if (results.success) {
      const pageInfo = this.semanticData.pageInfo || {};
      const components = this.semanticData.components || [];
      const navigation = this.semanticData.navigation || [];

      report += `- ✅ Dashboard successfully accessed
- 📸 Screenshots captured: ${results.screenshots || 0}
- 🎯 Interactions performed: ${results.interactions?.length || 0}
- 📁 Output directory: ${this.screenshotDir}
- 📅 Organized by month: ${currentMonth} ${currentYear}
- ⚡ Load time: ${this.semanticData.performance?.loadTime || "N/A"}ms
- 🧩 Components found: ${components.length}
- 🧭 Navigation items: ${navigation.length}
- 🎛️ Interactive elements: ${pageInfo.totalButtons || 0} buttons, ${
        pageInfo.totalInputs || 0
      } inputs

## 🧠 Semantic Structure Analysis

### 📋 Page Information
- **Title:** ${pageInfo.title || "Unknown"}
- **URL:** ${pageInfo.url || this.baseUrl}
- **Components detected:** ${components.length}
- **Forms detected:** ${components.filter((c) => c.type === "form").length}
- **Cards detected:** ${components.filter((c) => c.type === "card").length}

### 🧩 Component Breakdown
`;

      // Listar componentes encontrados
      components.forEach((comp, index) => {
        report += `${index + 1}. **${comp.type.toUpperCase()}** - \`${comp.id}\`
   - Classes: ${comp.classes || "none"}
   - Visible: ${comp.visible ? "✅" : "❌"}
   - Text preview: "${comp.text?.substring(0, 50) || "N/A"}..."

`;
      });

      report += `
## 🧭 Navigation Structure
`;

      if (navigation.length > 0) {
        navigation.forEach((nav, index) => {
          report += `${index + 1}. **${nav.text || "Unnamed"}** ${
            nav.active ? "(Active)" : ""
          }
   - URL: ${nav.href || "N/A"}
   - Type: ${nav.type}

`;
        });
      } else {
        report += `- No navigation elements detected

`;
      }

      report += `
## 🎨 Topological Visualization

\`\`\`mermaid
${mermaidDiagram}
\`\`\`

## 📸 Screenshots Captured

`;

      if (results.interactions) {
        results.interactions.forEach((interaction, index) => {
          report += `${index + 1}. **${interaction.type}** - \`${
            interaction.filename
          }\`
   - Element: ${interaction.element}
   - Timestamp: ${interaction.timestamp}`;

          if (interaction.semanticData) {
            report += `
   - Semantic data: ${JSON.stringify(
     interaction.semanticData,
     null,
     2
   ).substring(0, 100)}...`;
          }

          report += `

`;
        });
      }

      report += `
## 🧪 Automated Test Suggestions

`;

      testSuggestions.forEach((suggestion, index) => {
        report += `### ${index + 1}. ${suggestion.type}
**Description:** ${suggestion.description}

\`\`\`javascript
${suggestion.code}
\`\`\`

`;
      });

      report += `
## ⚠️ Technical Alerts

`;

      if (this.semanticData.errors.length > 0) {
        this.semanticData.errors.forEach((error) => {
          report += `- ⚠️ ${error}
`;
        });
      } else {
        report += `- ✅ No technical issues detected

`;
      }

      report += `
## 🎯 Next Steps & Recommendations

- Review captured screenshots in: \`${this.screenshotDir}\`
- Analyze dashboard performance and UI consistency
- Implement suggested automated tests
- Set up visual regression testing pipeline
- Configure alerts for visual changes
- Compare with previous month's reports
- Consider accessibility improvements based on analysis

## 📁 File Organization

Screenshots e relatórios são organizados automaticamente por mês:
- \`screenshots/${currentYear}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/\`
- \`reports/${currentYear}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/\`

## 🔍 Performance Metrics

- **Page Load Time:** ${this.semanticData.performance?.loadTime || "N/A"}ms
- **Components Analyzed:** ${components.length}
- **Interactions Tested:** ${results.interactions?.length || 0}
- **Screenshots Generated:** ${results.screenshots || 0}

`;
    } else {
      report += `- ❌ Dashboard access failed
- 🔍 Error: ${results.error}
- 🔧 Check if dashboard is running on ${this.baseUrl}

## 🛠️ Troubleshooting

1. Ensure dashboard is running: \`npm run dev\`
2. Verify dashboard URL is accessible
3. Check browser permissions and dependencies
4. Review error logs in semantic data

`;
    }

    report += `---
*Generated by Enhanced AI Dashboard Watcher - ${currentMonth} ${currentYear}*  
*Semantic Analysis • Visual Automation • Test Suggestions*`;

    fs.writeFileSync(reportPath, report, "utf8");
    console.log("📋 Enhanced report generated:", reportFilename);
    console.log("📁 Report saved in:", this.reportDir);

    return reportFilename;
  }

  async run() {
    console.log("🤖 AI Dashboard Watcher - ENHANCED SEMANTIC AUTOMATION");
    console.log("=".repeat(60));

    // 1. Lançar browser
    const launchSuccess = await this.launch();
    if (!launchSuccess) {
      return { success: false, error: "Failed to launch browser" };
    }

    // 2. Capturar dashboard completo com análise semântica
    const captureResult = await this.captureFullDashboard();

    let interactions = [];
    if (captureResult.success) {
      // 3. Interagir com elementos semanticamente
      const interactionResult = await this.interactWithElements();
      if (interactionResult.success) {
        interactions = interactionResult.interactions;
      }
    }

    // 4. Finalizar tracing de performance
    try {
      await this.page.tracing.stop();
      console.log("📊 Performance trace saved");
    } catch (error) {
      console.log("⚠️ Performance trace not available");
    }

    // 5. Fechar browser
    await this.browser.close();
    console.log("🔒 Browser closed");

    // 6. Gerar relatório semântico aprimorado
    const results = {
      success: captureResult.success,
      error: captureResult.error,
      screenshots: interactions.length + (captureResult.success ? 1 : 0),
      interactions,
    };

    const reportFilename = await this.generateReport(results);

    console.log("=".repeat(60));
    console.log("🎉 ENHANCED AI Dashboard Automation COMPLETED!");
    console.log("📁 Screenshots:", this.screenshotDir);
    console.log("📋 Enhanced Report:", reportFilename);
    console.log("🧠 Semantic analysis included");
    console.log("🧪 Test suggestions generated");

    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const watcher = new DashboardWatcher();

  watcher
    .run()
    .then((results) => {
      if (results.success) {
        console.log("✅ Enhanced automation completed successfully!");
        process.exit(0);
      } else {
        console.error("❌ Automation failed:", results.error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Unexpected error:", error);
      process.exit(1);
    });
}

module.exports = DashboardWatcher;
