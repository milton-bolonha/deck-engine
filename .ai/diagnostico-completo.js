const fs = require("fs");
const path = require("path");

console.log("🔍 DIAGNÓSTICO COMPLETO DO PROJETO");
console.log("=====================================");

// 1. Verificar estrutura de arquivos críticos
const criticalFiles = [
  "dashboard/package.json",
  "dashboard/components/layout/MainContent.js",
  "dashboard/components/layout/LeftSidebar.js",
  "dashboard/components/layout/RightSidebar.js",
  "dashboard/contexts/DashboardContext.js",
  "dashboard/utils/SectionManager.js",
  "dashboard/containers/SectionMasterContainer.js",
];

console.log("\n📁 VERIFICANDO ARQUIVOS CRÍTICOS:");
for (let file of criticalFiles) {
  if (fs.existsSync(file)) {
    const size = fs.statSync(file).size;
    console.log(`  ✅ ${file} (${size} bytes)`);
  } else {
    console.log(`  ❌ ${file} - ARQUIVO FALTANDO`);
  }
}

// 2. Verificar imports problemáticos
const checkImports = (filePath) => {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf8");
  const imports = content.match(/import.*from.*['"][^'"]+['"];?/g) || [];

  const problems = [];
  for (let imp of imports) {
    const match = imp.match(/from\s+['"]([^'"]+)['"]/);
    if (match) {
      const importPath = match[1];

      // Verificar imports relativos
      if (importPath.startsWith(".")) {
        const fullPath = path.resolve(path.dirname(filePath), importPath);

        // Tentar várias extensões
        const extensions = ["", ".js", ".jsx", "/index.js"];
        let found = false;

        for (let ext of extensions) {
          if (fs.existsSync(fullPath + ext)) {
            found = true;
            break;
          }
        }

        if (!found) {
          problems.push(`Import não encontrado: ${importPath} em ${filePath}`);
        }
      }
    }
  }

  return problems;
};

console.log("\n🔗 VERIFICANDO IMPORTS:");
let importProblems = [];
for (let file of criticalFiles) {
  if (fs.existsSync(file)) {
    const problems = checkImports(file);
    importProblems = importProblems.concat(problems);
  }
}

if (importProblems.length === 0) {
  console.log("  ✅ Todos os imports parecem corretos");
} else {
  console.log("  ❌ PROBLEMAS DE IMPORT ENCONTRADOS:");
  importProblems.forEach((p) => console.log(`    - ${p}`));
}

// 3. Verificar erros de sintaxe básicos
const checkSyntax = (filePath) => {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf8");
  const errors = [];

  // Verificar parênteses
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Parênteses desbalanceados: ${openParens} vs ${closeParens}`);
  }

  // Verificar chaves
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Chaves desbalanceadas: ${openBraces} vs ${closeBraces}`);
  }

  // Verificar strings não fechadas
  const singleQuotes = (content.match(/'/g) || []).length;
  const doubleQuotes = (content.match(/"/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    errors.push(`Aspas simples não fechadas`);
  }
  if (doubleQuotes % 2 !== 0) {
    errors.push(`Aspas duplas não fechadas`);
  }

  return errors;
};

console.log("\n🔧 VERIFICANDO SINTAXE BÁSICA:");
let syntaxProblems = [];
for (let file of criticalFiles) {
  if (fs.existsSync(file)) {
    const problems = checkSyntax(file);
    if (problems.length > 0) {
      syntaxProblems.push(`${file}: ${problems.join(", ")}`);
    }
  }
}

if (syntaxProblems.length === 0) {
  console.log("  ✅ Sintaxe básica parece correta");
} else {
  console.log("  ❌ PROBLEMAS DE SINTAXE:");
  syntaxProblems.forEach((p) => console.log(`    - ${p}`));
}

// 4. Verificar package.json
console.log("\n📦 VERIFICANDO PACKAGE.JSON:");
if (fs.existsSync("dashboard/package.json")) {
  try {
    const pkg = JSON.parse(fs.readFileSync("dashboard/package.json", "utf8"));
    console.log(`  ✅ Nome: ${pkg.name}`);
    console.log(`  ✅ Versão: ${pkg.version}`);
    console.log(`  ✅ Scripts: ${Object.keys(pkg.scripts || {}).join(", ")}`);
    console.log(
      `  ✅ Dependências: ${Object.keys(pkg.dependencies || {}).length} pacotes`
    );
  } catch (error) {
    console.log(`  ❌ Erro ao ler package.json: ${error.message}`);
  }
} else {
  console.log("  ❌ package.json não encontrado");
}

// 5. Verificar node_modules
console.log("\n📚 VERIFICANDO NODE_MODULES:");
if (fs.existsSync("dashboard/node_modules")) {
  const modules = fs.readdirSync("dashboard/node_modules").length;
  console.log(`  ✅ ${modules} módulos instalados`);
} else {
  console.log("  ❌ node_modules não encontrado - EXECUTE npm install");
}

// 6. Verificar se há .next
console.log("\n⚡ VERIFICANDO BUILD NEXT.JS:");
if (fs.existsSync("dashboard/.next")) {
  console.log("  ✅ Pasta .next existe");
} else {
  console.log("  ⚠️  Pasta .next não encontrada - primeira execução");
}

// 7. Relatório final
console.log("\n" + "=".repeat(50));
console.log("📋 RESUMO DO DIAGNÓSTICO:");

const totalProblems = importProblems.length + syntaxProblems.length;

if (totalProblems === 0) {
  console.log("✅ NENHUM PROBLEMA CRÍTICO ENCONTRADO");
  console.log("   O projeto parece estar estruturalmente correto");
  console.log("   Problemas podem ser de runtime ou dependências");
} else {
  console.log(`❌ ${totalProblems} PROBLEMAS ENCONTRADOS`);
  console.log("   Corrija os erros acima antes de executar");
}

console.log("\n🚀 PRÓXIMOS PASSOS RECOMENDADOS:");
console.log("1. cd dashboard");
console.log("2. npm install (se node_modules faltando)");
console.log("3. npm run dev");
console.log("4. Verificar http://localhost:3001");

console.log("\n" + "=".repeat(50));
