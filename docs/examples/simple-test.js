/**
 * 🧪 Teste Simples DeckEngine V2
 */

async function testBasic() {
  console.log("🧪 Teste Simples DeckEngine V2\n");

  try {
    // Importar
    const DeckEngineApp = require("../../index");
    console.log("✅ Import funcionou");

    // Criar engine
    const engine = new DeckEngineApp({ version: "v2" });
    console.log("✅ Engine criado");

    // Health check inicial
    const health = engine.healthCheck();
    console.log("✅ Health check:", health.status);

    // Criar deck simples
    const deck = engine.createDeck("test-simple");
    console.log("✅ Deck criado");

    // Adicionar carta simples
    deck.addCard("hello", async (context) => {
      console.log("🎴 Executando carta hello");
      return { message: "Hello World!", timestamp: Date.now() };
    });
    console.log("✅ Carta adicionada");

    // Testar execução (versão síncrona)
    console.log("🎮 Iniciando execução...");
    const result = await engine.playAndWait("test-simple", { test: true });
    console.log(
      "✅ Execução completada:",
      result.success ? "SUCCESS" : "FAILED"
    );

    if (result.success) {
      console.log("📊 Resultado:", result.result?.message || "sem resultado");
    } else {
      console.log("❌ Erro:", result.errors || "erro desconhecido");
    }

    console.log("\n🎉 TESTE SIMPLES CONCLUÍDO COM SUCESSO!");
  } catch (error) {
    console.error("❌ ERRO:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Executar
testBasic();
