/**
 * 👋 Exemplo 1: Pipeline de Boas-vindas
 */

const DeckEngine = require("../../index");

async function exemploBoasVindas() {
  // Criar engine
  const engine = new DeckEngine({ version: "v2" });

  // Criar pipeline de boas-vindas
  const boasVindas = engine.createDeck("boas-vindas");

  // Etapa 1: Saudar
  boasVindas.addCard("saudar", async (dados) => {
    console.log(`👋 Olá, ${dados.nome}!`);
    return { ...dados, saudacao: "feita" };
  });

  // Etapa 2: Dar boas-vindas
  boasVindas.addCard("dar-boas-vindas", async (dados) => {
    console.log(`🎉 Bem-vindo ao DeckEngine, ${dados.nome}!`);
    return { ...dados, boasVindas: "dadas" };
  });

  // Etapa 3: Despedir
  boasVindas.addCard("despedir", async (dados) => {
    console.log(`👍 Ótimo te conhecer, ${dados.nome}! Divirta-se!`);
    return { ...dados, despedida: "feita" };
  });

  // Executar o pipeline
  console.log("🚀 Iniciando pipeline de boas-vindas...\n");

  const resultado = await engine.playMatch("boas-vindas", {
    nome: "Amigo",
    data: new Date().toLocaleDateString(),
  });

  console.log("\n✅ Pipeline concluído!");
  console.log("📊 Status final:", resultado.success ? "SUCESSO" : "ERRO");

  // 🛑 Finalizar engine (agora funciona corretamente!)
  await engine.shutdown();
  console.log("\n👋 Script finalizado - o processo vai parar sozinho!");
}

// Executar
exemploBoasVindas().catch(console.error);
