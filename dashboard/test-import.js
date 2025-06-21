/**
 * 🧪 TESTE SIMPLES DE IMPORTS
 * Verifica se todos os componentes principais podem ser importados
 */

console.log("🧪 Testando imports principais...\n");

// Função para testar import
function testImport(name, path) {
  try {
    require(path);
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
    return false;
  }
}

// Testar imports principais
const tests = [
  ["DashboardLayout", "./components/core/DashboardLayout.js"],
  ["LeftSidebar", "./components/core/LeftSidebar.js"],
  ["RightSidebar", "./components/core/RightSidebar.js"],
  ["MainContent", "./components/core/MainContent.js"],
  ["DynamicSectionContainer", "./components/core/DynamicSectionContainer.js"],

  ["ListView", "./components/views/ListView.js"],
  ["SectionBuilder", "./components/builders/SectionBuilder.js"],
  ["AddonManager", "./components/managers/AddonManager.js"],
  ["SectionInfo", "./components/sections/SectionInfo.js"],
  ["PipelineForm", "./components/pipeline/PipelineForm.js"],
];

let passed = 0;
let failed = 0;

tests.forEach(([name, path]) => {
  if (testImport(name, path)) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n📊 Resultado: ${passed} ✅ | ${failed} ❌`);

if (failed === 0) {
  console.log("🎉 TODOS OS IMPORTS FUNCIONANDO!");
  process.exit(0);
} else {
  console.log("⚠️ HÁ PROBLEMAS COM IMPORTS");
  process.exit(1);
}
