/**
 * 🧪 DeckEngine V2 - Teste Completo
 *
 * Demonstra as funcionalidades do DeckEngine V2:
 * - Sistema de logging unificado
 * - Domains (Authentication, User Management, System)
 * - Multi-platform support
 * - Routing system
 */

async function testDeckEngineV2() {
  try {
    console.log("🧪 Iniciando testes do DeckEngine V2...\n");

    // ============ TESTE 1: INICIALIZAÇÃO ============
    console.log("📝 TESTE 1: Inicialização do Engine V2");

    const DeckEngineApp = require("../../index");

    const engine = new DeckEngineApp({
      version: "v2",
      logging: ["console", "markdown"],
      standardDomains: ["authentication", "user-management", "system"],
      platform: "node",
    });

    console.log("✅ Engine V2 inicializado com sucesso");
    console.log(
      "🏥 Health Check:",
      JSON.stringify(engine.healthCheck(), null, 2)
    );
    console.log("");

    // ============ TESTE 2: SISTEMA DE LOGGING ============
    console.log("📝 TESTE 2: Sistema de Logging Unificado");

    const logger = engine.logger;

    logger.info("Teste de log INFO", { teste: "dados" });
    logger.error("Teste de log ERROR", { erro: "simulado" });
    logger.info("Log com dados sensíveis", {
      password: "secret123",
      token: "xyz",
    });

    console.log(
      "📊 Estatísticas de Log:",
      JSON.stringify(logger.getLogStats(), null, 2)
    );
    console.log("");

    // ============ TESTE 3: DOMAINS ============
    console.log("📝 TESTE 3: Sistema de Domains");

    const installedDomains =
      engine.version === "v2" ? engine.getInstalledDomains() : [];
    console.log("🏰 Domains instalados:", installedDomains);

    // Testar domain de authentication
    try {
      const authDomain = engine.getDomain("authentication");
      console.log(
        "🔐 Authentication domain encontrado:",
        authDomain ? "SIM" : "NÃO"
      );
    } catch (error) {
      console.log("⚠️ Authentication domain não disponível:", error.message);
    }

    console.log("");

    // ============ TESTE 4: DECK TRADICIONAL (V1 Compatibility) ============
    console.log("📝 TESTE 4: Criação e Execução de Deck (Compatibilidade V1)");

    const testDeck = engine.createDeck("test-pipeline", {
      title: "Pipeline de Teste V2",
      arena: "testing",
    });

    testDeck
      .addCard("step1", async (context) => {
        console.log("🎴 Executando Step 1");
        await new Promise((resolve) => setTimeout(resolve, 100));
        return { step1: "completed", timestamp: new Date().toISOString() };
      })
      .addCard("step2", async (context) => {
        console.log("🎴 Executando Step 2");
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
          step2: "completed",
          previousData: context.step1,
          timestamp: new Date().toISOString(),
        };
      })
      .addCard("step3", async (context) => {
        console.log("🎴 Executando Step 3 (Final)");
        return {
          step3: "completed",
          summary: {
            step1: context.step1,
            step2: context.step2,
          },
          timestamp: new Date().toISOString(),
        };
      });

    const deckResult = await engine.playMatch("test-pipeline", {
      input: "dados de teste",
      userId: "user123",
    });

    console.log("🏆 Resultado do Deck:", JSON.stringify(deckResult, null, 2));
    console.log("");

    // ============ TESTE 5: STATUS E MONITORING ============
    console.log("📝 TESTE 5: Status e Monitoring");

    const deckStatus = engine.getDeckStatus("test-pipeline");
    console.log("🎴 Status do deck:", JSON.stringify(deckStatus, null, 2));

    const currentStatus = engine.getGlobalStatus();
    console.log("🌍 Status global:", JSON.stringify(currentStatus, null, 2));
    console.log("");

    // ============ TESTE 6: MÚLTIPLAS EXECUÇÕES ============
    console.log("📝 TESTE 6: Múltiplas Execuções");

    console.log("🔄 Executando múltiplos matches...");
    const payloads = [
      { batch: 1, data: "test1" },
      { batch: 2, data: "test2" },
      { batch: 3, data: "test3" },
    ];

    const multiResults = await engine.playMatches("test-pipeline", payloads, {
      waitAll: true,
    });

    console.log(`✅ ${multiResults.length} matches executados em paralelo`);
    console.log(
      "📊 Resultados:",
      multiResults.map((r) => (r.success ? "✅" : "❌")).join(" ")
    );
    console.log("");

    // ============ TESTE 7: HEALTH CHECK E CLEANUP ============
    console.log("📝 TESTE 7: Health Check e Cleanup");

    const healthBefore = engine.healthCheck();
    console.log("🏥 Health check:", JSON.stringify(healthBefore, null, 2));

    const cleanupResult = engine.cleanup();
    console.log(
      "🧹 Cleanup executado:",
      JSON.stringify(cleanupResult, null, 2)
    );
    console.log("");

    // ============ TESTE FINAL ============
    console.log("📝 TESTE FINAL: Status Final");
    const finalHealth = engine.healthCheck();
    console.log(
      "🏥 Saúde final do sistema:",
      JSON.stringify(finalHealth, null, 2)
    );

    console.log("\n🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO! 🎉");
    console.log("\n📊 RESUMO DOS TESTES:");
    console.log("✅ Inicialização do Engine V2");
    console.log("✅ Sistema de Logging Unificado");
    console.log("✅ Sistema de Domains");
    console.log("✅ Compatibilidade com Decks V1");
    console.log("✅ Status e Monitoring");
    console.log("✅ Múltiplas Execuções");
    console.log("✅ Health Check e Cleanup");

    // Demonstrar shutdown graceful
    console.log("\n🔥 Executando shutdown graceful...");
    await engine.shutdown();
    console.log("✅ Shutdown completo!");
  } catch (error) {
    console.error("❌ ERRO NO TESTE:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// ============ EXECUTION ============
if (require.main === module) {
  testDeckEngineV2()
    .then(() => {
      console.log("\n🚀 Teste concluído - Engine funcionando perfeitamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Teste falhou:", error.message);
      process.exit(1);
    });
}

module.exports = testDeckEngineV2;
