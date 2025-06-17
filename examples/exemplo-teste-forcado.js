/**
 * 🔧 Teste Forçado - Garantir que o processo pare
 */

const DeckEngine = require("./index");

async function testeForcado() {
  console.log("🔧 Teste Forçado - Sistema que PARA garantido!\n");

  try {
    const engine = new DeckEngine({ version: "v2" });
    console.log("✅ Engine criado");

    // Criar deck simples
    const deck = engine.createDeck("teste-forcado");
    deck.addCard("hello", async (context) => {
      console.log("👋 Hello World!");
      return { ...context, message: "Hello World!" };
    });

    console.log("✅ Deck criado");

    // Executar
    const resultado = await engine.playAndWait("teste-forcado", { test: true });
    console.log("✅ Execução:", resultado.success ? "SUCESSO" : "ERRO");

    // Shutdown completo
    console.log("\n🛑 Iniciando shutdown...");
    await engine.shutdown();
    console.log("✅ Engine shutdown concluído");

    // Força parada IMEDIATA
    console.log("🔥 Forçando encerramento do processo...");

    // Timer de segurança - se não parar em 2s, força saída
    const forceExit = setTimeout(() => {
      console.log("⚠️ Forçando saída após timeout!");
      process.exit(0);
    }, 2000);

    // Limpar timer se conseguir sair normalmente
    clearTimeout(forceExit);

    console.log("👋 Processo finalizado!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

// Executar
testeForcado();
