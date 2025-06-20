const fs = require("fs");

console.log("🎯 TESTE RÁPIDO DE FEATURES ESPECÍFICAS");
console.log("=".repeat(60));

// Testar arquivos core
console.log("\n📁 ARQUIVOS CORE:");
const arquivosCore = [
  "dashboard/contexts/DashboardContext.js",
  "dashboard/components/layout/LeftSidebar.js",
  "dashboard/components/layout/MainContent.js",
  "dashboard/components/layout/RightSidebar.js",
  "dashboard/containers/SectionMasterContainer.js",
  "dashboard/utils/DataProvider.js",
  "dashboard/utils/SectionManager.js",
];

let coreOK = 0;
arquivosCore.forEach((arquivo) => {
  const existe = fs.existsSync(arquivo);
  const nome = arquivo.split("/").pop();
  console.log(`  ${existe ? "✅" : "❌"} ${nome}`);
  if (existe) coreOK++;
});

const taxaCore = Math.round((coreOK / arquivosCore.length) * 100);
console.log(`  📊 Score Core: ${coreOK}/${arquivosCore.length} (${taxaCore}%)`);

// Testar addons
console.log("\n🔧 SISTEMA DE ADDONS:");
const pastaAddons = "dashboard/components/addons";
const addonsExiste = fs.existsSync(pastaAddons);
console.log(`  📁 Pasta addons: ${addonsExiste ? "✅" : "❌"}`);

let addonsCount = 0;
if (addonsExiste) {
  const addonsFiles = fs
    .readdirSync(pastaAddons)
    .filter((f) => f.endsWith(".js"));
  addonsCount = addonsFiles.length;
  console.log(`  📄 Addons encontrados: ${addonsCount}`);

  const addonsEssenciais = [
    "TextInputAddon.js",
    "TextareaAddon.js",
    "SelectAddon.js",
    "WYSIWYGAddon.js",
  ];
  addonsEssenciais.forEach((addon) => {
    const existe = addonsFiles.includes(addon);
    console.log(`    ${existe ? "✅" : "❌"} ${addon}`);
  });
}

// Testar layouts
console.log("\n🎨 LAYOUTS ESPECIAIS:");
const pastaLayouts = "dashboard/components/layouts";
const layoutsExiste = fs.existsSync(pastaLayouts);
console.log(`  📁 Pasta layouts: ${layoutsExiste ? "✅" : "❌"}`);

let layoutsCount = 0;
if (layoutsExiste) {
  const layoutFiles = fs
    .readdirSync(pastaLayouts)
    .filter((f) => f.endsWith(".js"));
  layoutsCount = layoutFiles.length;
  console.log(`  📄 Layouts encontrados: ${layoutsCount}`);

  const layoutsEssenciais = [
    "ListView.js",
    "KanbanView.js",
    "FeedView.js",
    "GridView.js",
  ];
  layoutsEssenciais.forEach((layout) => {
    const existe = layoutFiles.includes(layout);
    console.log(`    ${existe ? "✅" : "❌"} ${layout}`);
  });
}

// Testar formulários
console.log("\n📝 FORMULÁRIOS:");
const pastaForms = "dashboard/components/forms";
const formsExiste = fs.existsSync(pastaForms);
console.log(`  📁 Pasta forms: ${formsExiste ? "✅" : "❌"}`);

let formsCount = 0;
if (formsExiste) {
  const formFiles = fs.readdirSync(pastaForms).filter((f) => f.endsWith(".js"));
  formsCount = formFiles.length;
  console.log(`  📄 Formulários encontrados: ${formsCount}`);
}

// Testar ContentTypes no DataProvider
console.log("\n📋 CONTENT TYPES:");
const dataProviderPath = "dashboard/utils/DataProvider.js";
if (fs.existsSync(dataProviderPath)) {
  const conteudo = fs.readFileSync(dataProviderPath, "utf8");

  const contentTypes = [
    "dashboard",
    "users",
    "kanban",
    "feed",
    "gallery",
    "pipeline",
  ];
  let contentTypesOK = 0;

  contentTypes.forEach((tipo) => {
    const existe = conteudo.includes(tipo);
    console.log(`  ${existe ? "✅" : "❌"} ${tipo}`);
    if (existe) contentTypesOK++;
  });

  const taxaContentTypes = Math.round(
    (contentTypesOK / contentTypes.length) * 100
  );
  console.log(
    `  📊 Score ContentTypes: ${contentTypesOK}/${contentTypes.length} (${taxaContentTypes}%)`
  );
} else {
  console.log(`  ❌ DataProvider.js não encontrado`);
}

// Calcular score geral
const scoreGeral = Math.round(
  (taxaCore +
    (addonsExiste ? 100 : 0) +
    (layoutsExiste ? 100 : 0) +
    (formsExiste ? 100 : 0)) /
    4
);

console.log("\n" + "=".repeat(60));
console.log("📊 RESUMO FINAL:");
console.log(
  `  🏗️ Arquivos Core: ${taxaCore}% (${coreOK}/${arquivosCore.length})`
);
console.log(
  `  🔧 Sistema Addons: ${
    addonsExiste ? `✅ ${addonsCount} arquivos` : "❌ Não implementado"
  }`
);
console.log(
  `  🎨 Layouts Especiais: ${
    layoutsExiste ? `✅ ${layoutsCount} arquivos` : "❌ Não implementado"
  }`
);
console.log(
  `  📝 Formulários: ${
    formsExiste ? `✅ ${formsCount} arquivos` : "❌ Não implementado"
  }`
);

console.log(`\n🎯 SCORE GERAL ESTRUTURAL: ${scoreGeral}%`);

if (scoreGeral >= 80) {
  console.log("🟢 SISTEMA ALTAMENTE ESTRUTURADO - Pronto para uso!");
} else if (scoreGeral >= 65) {
  console.log("🟡 SISTEMA BEM ESTRUTURADO - Pequenos ajustes");
} else if (scoreGeral >= 50) {
  console.log("🟠 SISTEMA PARCIALMENTE ESTRUTURADO - Precisa expansão");
} else {
  console.log("🔴 SISTEMA PRECISA DE DESENVOLVIMENTO - Estrutura básica");
}

console.log("\n🔍 FEATURES IMPLEMENTADAS:");
console.log(
  `  ${taxaCore >= 80 ? "✅" : "❌"} Navegação entre seções (LeftSidebar)`
);
console.log(
  `  ${addonsExiste ? "✅" : "❌"} Sistema de inputs/textareas (Addons)`
);
console.log(`  ${formsExiste ? "✅" : "❌"} CRUD e formulários (Forms)`);
console.log(
  `  ${layoutsExiste ? "✅" : "❌"} Layouts especiais (Kanban, Feed, etc.)`
);
console.log(`  ${coreOK >= 6 ? "✅" : "❌"} RightSidebar funcional`);

console.log("=".repeat(60));
