#!/usr/bin/env node

/**
 * 🚀 DeckEngine Dashboard - Setup Híbrido
 * Um script simples que funciona em qualquer OS
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const isWindows = os.platform() === "win32";

console.log("\n🎮 DeckEngine Dashboard - Setup");
console.log("==============================");
console.log(`Platform: ${os.platform()}`);
console.log(`Node.js: ${process.version}\n`);

// Create .env.local if needed
if (!fs.existsSync(".env.local")) {
  console.log("📝 Criando .env.local...");

  const envContent = `# 🎮 DeckEngine Dashboard
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true
`;

  fs.writeFileSync(".env.local", envContent);
  console.log("✅ .env.local criado");
} else {
  console.log("✅ .env.local já existe");
}

// Create directories
console.log("📁 Criando diretórios...");
const dirs = [
  "components/ui",
  "components/layout",
  "components/forms",
  "containers",
  "contexts",
  "data",
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
console.log("✅ Diretórios criados");

// Create sample data
if (!fs.existsSync("data/sample-data.json")) {
  console.log("🎮 Criando dados de exemplo...");

  const sampleData = {
    pipelines: [
      {
        id: "welcome_pipeline",
        name: "Welcome Pipeline",
        description: "Pipeline de boas-vindas",
        cards: ["validate", "welcome", "notify"],
      },
    ],
    user: {
      name: "Dev User",
      role: "admin",
      devMode: true,
    },
  };

  fs.writeFileSync(
    "data/sample-data.json",
    JSON.stringify(sampleData, null, 2)
  );
  console.log("✅ Dados de exemplo criados");
}

console.log("\n🎉 Setup concluído!");
console.log("\n📋 Próximos passos:");
console.log("1. npm run dev");
console.log("2. Abrir http://localhost:3001");
console.log("3. Explorar o dashboard!");
console.log("\n🎮 Pronto para começar!\n");
