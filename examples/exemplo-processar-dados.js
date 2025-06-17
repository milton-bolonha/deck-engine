/**
 * 📊 Exemplo 2: Pipeline para Processar Dados
 */

const DeckEngine = require("./index");

async function exemploProcessarDados() {
  console.log("📊 Vamos processar alguns dados!\n");

  const engine = new DeckEngine({ version: "v2" });

  // Criar pipeline de processamento
  const processarDados = engine.createDeck("processar-dados");

  // Etapa 1: Validar dados
  processarDados.addCard("validar", async (dados) => {
    console.log("🔍 Validando dados...");

    if (!dados.email || !dados.nome) {
      throw new Error("Email e nome são obrigatórios!");
    }

    console.log("✅ Dados válidos!");
    return { ...dados, validado: true };
  });

  // Etapa 2: Processar
  processarDados.addCard("processar", async (dados) => {
    console.log("⚙️ Processando dados...");

    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 500));

    const resultado = {
      ...dados,
      processado: true,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Processamento concluído!");
    return resultado;
  });

  // Etapa 3: Salvar
  processarDados.addCard("salvar", async (dados) => {
    console.log("💾 Salvando dados...");

    // Simular salvamento
    console.log(`💾 Dados salvos com ID: ${dados.id}`);

    return { ...dados, salvo: true };
  });

  // Executar com dados de exemplo
  const dadosExemplo = {
    nome: "João Silva",
    email: "joao@exemplo.com",
    idade: 30,
  };

  console.log("📥 Dados de entrada:", dadosExemplo);
  console.log("\n🚀 Iniciando processamento...\n");

  try {
    const resultado = await engine.playMatch("processar-dados", dadosExemplo);

    console.log("\n🎉 SUCESSO!");
    console.log("📤 Dados processados:", {
      id: resultado.id,
      nome: resultado.nome,
      email: resultado.email,
      validado: resultado.validado,
      processado: resultado.processado,
      salvo: resultado.salvo,
    });
  } catch (error) {
    console.log("\n❌ Erro:", error.message);
  }

  // 🛑 IMPORTANTE: Finalizar o engine para parar o script
  await engine.shutdown();
  console.log("\n👋 Script finalizado!");
}

// Executar
exemploProcessarDados()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
