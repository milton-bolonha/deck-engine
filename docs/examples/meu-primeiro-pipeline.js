/**
 * 🎮 Meu Primeiro Pipeline - Onboarding DeckEngine V2
 *
 * Este é um exemplo bem simples para você começar!
 */

// 1️⃣ Importar o DeckEngine
const DeckEngine = require("../../index");

async function meuPrimeiroPipeline() {
  console.log("🌟 Iniciando meu primeiro pipeline!\n");

  try {
    // 2️⃣ Criar o engine
    const engine = new DeckEngine({ version: "v2" });
    console.log("✅ Engine criado com sucesso!");

    // 3️⃣ Criar um deck (pipeline)
    const meuDeck = engine.createDeck("meu-primeiro-deck", {
      concurrency: 1, // Processar uma coisa por vez
    });
    console.log('✅ Deck criado: "meu-primeiro-deck"');

    // 4️⃣ Adicionar cards (etapas) ao deck
    meuDeck
      .addCard("saudar", async (context) => {
        console.log("👋 Olá! Primeira etapa funcionando!");
        return {
          ...context,
          saudacao: "Olá mundo!",
          etapa1: "concluída",
        };
      })
      .addCard("processar", async (context) => {
        console.log("⚙️ Processando seus dados...");

        // Simular um processamento
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          ...context,
          processado: true,
          resultado: "Dados processados com sucesso!",
          etapa2: "concluída",
        };
      })
      .addCard("finalizar", async (context) => {
        console.log("🎉 Finalizando pipeline!");
        return {
          ...context,
          finalizado: true,
          mensagem: "Pipeline concluído com sucesso!",
          etapa3: "concluída",
        };
      });

    console.log("✅ Cards adicionados ao deck");

    // 5️⃣ Executar o pipeline
    console.log("\n🚀 Executando o pipeline...\n");

    const resultado = await engine.playMatch("meu-primeiro-deck", {
      usuario: "Você",
      inicio: new Date().toISOString(),
      dados: "Dados de exemplo",
    });

    // 6️⃣ Ver o resultado
    console.log("\n📊 RESULTADO FINAL:");
    console.log("==================");
    console.log(JSON.stringify(resultado, null, 2));

    console.log("\n🎉 PARABÉNS! Seu primeiro pipeline funcionou! 🎉");
    console.log("💡 Agora você já sabe como criar pipelines com o DeckEngine!");

    // 🛑 IMPORTANTE: Finalizar o engine para parar o script
    await engine.shutdown();
    console.log("\n👋 Script finalizado!");
  } catch (error) {
    console.error("❌ Oops, algo deu errado:", error.message);
    console.log("💬 Não se preocupe, isso acontece! Vamos tentar novamente.");
  }
}

// 7️⃣ Executar o exemplo
meuPrimeiroPipeline()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
