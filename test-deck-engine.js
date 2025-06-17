// Teste simples do Deck Engine
const DeckEngine = require("./deck-engine.js");

async function testarEngine() {
  console.log("🧪 Testando Deck Engine...\n");

  // Criar engine
  const engine = new DeckEngine({
    devMode: true,
    verboseLogging: true,
  });

  // Criar deck de teste
  const testDeck = engine.createDeck("test-simple", {
    title: "Teste Simples",

    async play(context) {
      context.log("info", "Executando teste simples");
      const { nome } = context.payload;

      await context.wait(100);

      return {
        mensagem: `Olá ${nome}!`,
        timestamp: new Date().toISOString(),
      };
    },

    onVictory: (context) => {
      console.log("✅ Teste concluído com sucesso!");
    },
  });

  try {
    // Testar uma partida simples
    console.log("Iniciando partida...");
    const resultado = await testDeck.playAndWait({
      nome: "Desenvolvedor",
    });

    console.log("Resultado:", resultado);

    // Verificar stats
    console.log("\nEstatísticas:");
    console.log(JSON.stringify(engine.getMetrics(), null, 2));

    console.log("\n🎉 Todos os testes passaram!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

// Executar teste
if (require.main === module) {
  testarEngine();
}

module.exports = { testarEngine };
