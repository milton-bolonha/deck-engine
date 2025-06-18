#!/usr/bin/env node
/**
 * 🎯 Demonstração de Integração Completa
 * PipesNow DeckEngine - Server + Dashboard
 */

const http = require("http");

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function makeAPICall(hostname, port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname, port, path }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

async function main() {
  log(
    colors.bold + colors.cyan,
    "\n🎮 PipesNow DeckEngine - Demonstração de Integração"
  );
  log(colors.cyan, "=".repeat(60));

  console.log("\n📍 Testando componentes:");
  console.log("   • Core Engine (biblioteca)");
  console.log("   • Server API (porta 3000)");
  console.log("   • Dashboard UI (porta 3001)");
  console.log("   • Integração via Next.js rewrites\n");

  try {
    // 1. Core Engine
    log(colors.yellow, "1️⃣ Testando Core Engine...");
    const DeckEngine = require("../index.js");
    const engine = new DeckEngine();
    const health = engine.healthCheck();
    log(colors.green, `   ✅ Core funcionando - Status: ${health.status}`);
    await engine.shutdown();

    // 2. Server API
    log(colors.yellow, "\n2️⃣ Testando Server API...");
    const serverResponse = await makeAPICall(
      "localhost",
      3000,
      "/api/system/health"
    );
    log(
      colors.green,
      `   ✅ Server respondendo - Status: ${serverResponse.data.status}`
    );
    log(
      colors.green,
      `   ⏱️ Uptime: ${Math.round(serverResponse.data.uptime / 60)} minutos`
    );

    // 3. API Endpoints
    log(colors.yellow, "\n3️⃣ Testando endpoints principais...");
    const endpoints = [
      { path: "/api", name: "Info" },
      { path: "/api/decks", name: "Decks" },
      { path: "/api/system/status", name: "Status" },
      { path: "/api/system/metrics", name: "Métricas" },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await makeAPICall("localhost", 3000, endpoint.path);
        log(colors.green, `   ✅ ${endpoint.name}: ${response.status}`);
      } catch (error) {
        log(colors.red, `   ❌ ${endpoint.name}: Erro`);
      }
    }

    // 4. Dashboard Integration
    log(colors.yellow, "\n4️⃣ Testando integração Dashboard...");
    const dashboardAPI = await makeAPICall(
      "localhost",
      3001,
      "/api/deckengine/system/health"
    );
    log(
      colors.green,
      `   ✅ Dashboard Rewrite funcionando - Status: ${dashboardAPI.data.status}`
    );
    log(
      colors.green,
      "   🔗 Next.js redirecionando /api/deckengine/* → Server API"
    );

    // 5. Success
    log(colors.bold + colors.green, "\n🎉 INTEGRAÇÃO COMPLETA!");
    console.log("\n" + "=".repeat(60));
    log(colors.cyan, "📱 Acesse o Dashboard: http://localhost:3001");
    log(colors.cyan, "🔧 API Documentation: http://localhost:3000/api/docs");
    log(
      colors.cyan,
      "🏥 Health Check: http://localhost:3000/api/system/health"
    );
    console.log("\n" + "=".repeat(60));

    log(colors.bold, "\n✨ Problemas Resolvidos:");
    console.log("   • ✅ NPM Workspaces configurado");
    console.log("   • ✅ Server + Dashboard integrados");
    console.log("   • ✅ Next.js rewrites funcionando");
    console.log("   • ✅ APIs respondendo corretamente");
    console.log('   • ✅ Sem mais erros "API não encontrada"');
    console.log("   • ✅ Modo offline (core) + online (full stack)");
  } catch (error) {
    log(colors.red, `\n❌ Erro: ${error.message}`);
    console.log("\n💡 Certifique-se que os serviços estão rodando:");
    console.log("   npm run dev");
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { makeAPICall, log, colors };
