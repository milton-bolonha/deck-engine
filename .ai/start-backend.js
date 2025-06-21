const { spawn } = require("child_process");
const fs = require("fs");

console.log("🚀 INICIANDO SERVIDOR BACKEND");
console.log("=====================================");

// Verificar se existe servidor
if (!fs.existsSync("server/server.js")) {
  console.log("❌ Arquivo server/server.js não encontrado");
  console.log("   O dashboard funciona standalone sem backend");
  console.log("   Apenas APIs de métricas ficarão indisponíveis");
  process.exit(1);
}

// Verificar se existe package.json do servidor
if (!fs.existsSync("server/package.json")) {
  console.log("❌ server/package.json não encontrado");
  process.exit(1);
}

console.log("📦 Instalando dependências do servidor...");

// Instalar dependências
const npm = spawn("npm", ["install"], {
  cwd: "server",
  stdio: "inherit",
});

npm.on("close", (code) => {
  if (code !== 0) {
    console.log("❌ Erro ao instalar dependências");
    process.exit(1);
  }

  console.log("✅ Dependências instaladas");
  console.log("🚀 Iniciando servidor na porta 3000...");

  // Iniciar servidor
  const server = spawn("npm", ["run", "dev"], {
    cwd: "server",
    stdio: "inherit",
  });

  server.on("close", (code) => {
    console.log(`Servidor encerrado com código ${code}`);
  });

  // Aguardar Ctrl+C
  process.on("SIGINT", () => {
    console.log("\n🛑 Parando servidor...");
    server.kill("SIGINT");
    process.exit(0);
  });
});

console.log("\nPara parar o servidor: Ctrl+C");
console.log("Dashboard: http://localhost:3001");
console.log("API Server: http://localhost:3000");
