/**
 * 🧪 Teste da PipesNow DeckEngine API
 *
 * Teste completo da arquitetura híbrida
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🧪 Testando PipesNow DeckEngine API...\n");

async function testAPI() {
  try {
    // ====================
    // HEALTH CHECKS
    // ====================
    console.log("🏥 Testando Health Checks...");

    const healthResponse = await api.get("/api/system/health");
    console.log(`✅ Health Check: ${healthResponse.data.status}`);
    console.log(`   Uptime: ${Math.round(healthResponse.data.uptime)}s`);

    const detailedHealthResponse = await api.get("/api/system/health/detailed");
    console.log(`✅ Detailed Health: ${detailedHealthResponse.data.status}`);
    console.log(
      `   Checks: ${JSON.stringify(detailedHealthResponse.data.checks)}`
    );

    // ====================
    // SYSTEM STATUS
    // ====================
    console.log("\n📊 Testando System Status...");

    const statusResponse = await api.get("/api/system/status");
    console.log(
      `✅ System Status: ${statusResponse.data.success ? "OK" : "Error"}`
    );
    console.log(
      `   Node Version: ${statusResponse.data.data.server.nodeVersion}`
    );
    console.log(
      `   Memory Usage: ${Math.round(
        statusResponse.data.data.server.memory.heapUsed / 1024 / 1024
      )}MB`
    );

    const metricsResponse = await api.get("/api/system/metrics");
    console.log(`✅ Metrics: ${metricsResponse.data.success ? "OK" : "Error"}`);
    console.log(
      `   Total Decks: ${metricsResponse.data.data.metrics.decks.total}`
    );

    // ====================
    // DECK MANAGEMENT
    // ====================
    console.log("\n🎮 Testando Deck Management...");

    // Listar decks
    const deckListResponse = await api.get("/api/decks");
    console.log(
      `✅ List Decks: ${deckListResponse.data.success ? "OK" : "Error"}`
    );
    console.log(`   Total Decks: ${deckListResponse.data.data.total}`);

    // Criar deck de teste
    const createDeckResponse = await api.post("/api/decks", {
      name: "test-deck",
      config: {
        concurrency: 3,
        timeout: 30000,
      },
    });
    console.log(
      `✅ Create Deck: ${createDeckResponse.data.success ? "OK" : "Error"}`
    );
    console.log(`   Deck Name: ${createDeckResponse.data.data.deck.name}`);

    // Obter deck específico
    const getDeckResponse = await api.get("/api/decks/test-deck");
    console.log(
      `✅ Get Deck: ${getDeckResponse.data.success ? "OK" : "Error"}`
    );
    console.log(
      `   Matches Total: ${getDeckResponse.data.data.deck.matches.total}`
    );

    // Validar deck
    const validateDeckResponse = await api.post(
      "/api/decks/test-deck/validate"
    );
    console.log(
      `✅ Validate Deck: ${validateDeckResponse.data.success ? "OK" : "Error"}`
    );
    console.log(`   Valid: ${validateDeckResponse.data.data.valid}`);

    // ====================
    // MATCH EXECUTION
    // ====================
    console.log("\n⚔️ Testando Match Execution...");

    // Executar match único
    try {
      const executeMatchResponse = await api.post("/api/matches", {
        deckName: "test-deck",
        payload: {
          test: "data",
          userId: "test-user-123",
        },
        waitForResult: true,
      });
      console.log(
        `✅ Execute Match: ${
          executeMatchResponse.data.success ? "OK" : "Error"
        }`
      );
      console.log(
        `   Match Status: ${executeMatchResponse.data.execution.status}`
      );
    } catch (error) {
      console.log(
        `⚠️  Execute Match: Expected error (deck sem cards) - ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }

    // Execução em lote
    try {
      const batchResponse = await api.post("/api/matches/batch", {
        deckName: "test-deck",
        payloads: [
          { userId: "user1", action: "test" },
          { userId: "user2", action: "test" },
          { userId: "user3", action: "test" },
        ],
      });
      console.log(
        `✅ Batch Execution: ${batchResponse.data.success ? "OK" : "Error"}`
      );
      console.log(`   Total Executed: ${batchResponse.data.batch.total}`);
    } catch (error) {
      console.log(
        `⚠️  Batch Execution: Expected error (deck sem cards) - ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }

    // ====================
    // CLEANUP
    // ====================
    console.log("\n🧹 Testando System Cleanup...");

    const cleanupResponse = await api.post("/api/system/cleanup", {
      maxAge: 3600000, // 1 hora
    });
    console.log(
      `✅ System Cleanup: ${cleanupResponse.data.success ? "OK" : "Error"}`
    );

    // Backup
    const backupResponse = await api.post("/api/system/backup");
    console.log(
      `✅ System Backup: ${backupResponse.data.success ? "OK" : "Error"}`
    );
    console.log(`   Backup ID: ${backupResponse.data.data.backup.id}`);

    // ====================
    // ERROR HANDLING
    // ====================
    console.log("\n❌ Testando Error Handling...");

    try {
      await api.post("/api/decks", {
        // Nome faltando - deve dar erro de validação
        config: { concurrency: 1 },
      });
    } catch (error) {
      console.log(
        `✅ Validation Error: ${error.response.status} - ${error.response.data.error.message}`
      );
    }

    try {
      await api.get("/api/decks/deck-inexistente");
    } catch (error) {
      console.log(
        `✅ Not Found Error: ${error.response.status} - ${error.response.data.error.message}`
      );
    }

    try {
      await api.get("/api/endpoint-inexistente");
    } catch (error) {
      console.log(
        `✅ 404 Handler: ${error.response.status} - ${error.response.data.error.message}`
      );
    }

    // ====================
    // API INFO
    // ====================
    console.log("\n📚 Testando API Info...");

    const apiInfoResponse = await api.get("/api");
    console.log(`✅ API Info: ${apiInfoResponse.data.message}`);
    console.log(`   Version: ${apiInfoResponse.data.version}`);
    console.log(`   Architecture: ${apiInfoResponse.data.architecture}`);

    const rootResponse = await api.get("/");
    console.log(`✅ Root Endpoint: ${rootResponse.data.message}`);
    console.log(`   Documentation: ${rootResponse.data.documentation}`);

    console.log("\n🎉 Todos os testes da API concluídos!");
    console.log(`\n📍 API está rodando em: ${BASE_URL}`);
    console.log(`📖 Documentação: ${BASE_URL}/api/docs`);
    console.log(`🏥 Health Check: ${BASE_URL}/api/system/health`);
  } catch (error) {
    console.error("❌ Erro nos testes:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\n📌 Execute primeiro: npm start");
      console.log("   Ou: node server.js");
    }
  }
}

// Executar testes
testAPI();
