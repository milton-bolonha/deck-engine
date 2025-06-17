// Exemplo de uso do Deck Engine - Sistema de Pipelines como Hearthstone
const DeckEngine = require("./deck-engine.js");

// Inicializar o engine
const engine = new DeckEngine({
  devMode: true,
  verboseLogging: true,
  maxRetries: 3,
  maxConcurrency: 5,
});

// Exemplo 1: Deck simples com função única
const processOrderDeck = engine.createDeck("process-order", {
  title: "Processamento de Pedidos",
  arena: "orders", // Nome da fila/arena

  // Função principal da "partida"
  async play(context) {
    context.log("info", "Iniciando processamento do pedido");

    const { orderId, customerId, items } = context.payload;

    // Validar estoque
    await context.wait(100); // Simular API call
    context.log("info", "Estoque validado");

    // Processar pagamento
    await context.wait(200);
    context.log("info", "Pagamento processado");

    // Enviar para fulfillment
    await context.wait(150);
    context.log("info", "Enviado para fulfillment");

    return {
      orderId,
      status: "processed",
      processedAt: new Date().toISOString(),
    };
  },

  // Configurações de retry
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },

  // Callbacks de eventos
  onVictory: (context) => {
    console.log(`✅ Pedido ${context.payload.orderId} processado com sucesso!`);
  },

  onDefeat: (context) => {
    console.log(`❌ Falha ao processar pedido ${context.payload.orderId}`);
  },
});

// Exemplo 2: Deck com sequência de cartas (steps)
const emailCampaignDeck = engine.createDeck("email-campaign", {
  title: "Campanha de Email Marketing",
  arena: "marketing",

  // Sequência de cartas (cada uma é um step)
  cards: [
    {
      name: "validate-recipients",
      async play(context) {
        context.log("info", "Validando lista de destinatários");
        const { recipients } = context.payload;

        // Filtrar emails válidos
        const validEmails = recipients.filter(
          (email) => email.includes("@") && email.includes(".")
        );

        context.log("info", `${validEmails.length} emails válidos encontrados`);
        return { validEmails };
      },
    },

    {
      name: "personalize-content",
      async play(context) {
        context.log("info", "Personalizando conteúdo");
        const { template, validEmails } = context.payload;

        await context.wait(500); // Simular personalização

        const personalizedEmails = validEmails.map((email) => ({
          to: email,
          content: template.replace("{{email}}", email),
        }));

        return { personalizedEmails };
      },
    },

    {
      name: "send-emails",
      async play(context) {
        context.log("info", "Enviando emails");
        const { personalizedEmails } = context.payload;

        // Simular envio em lotes
        for (let i = 0; i < personalizedEmails.length; i += 10) {
          const batch = personalizedEmails.slice(i, i + 10);
          await context.wait(200); // Simular envio do lote
          context.log(
            "info",
            `Lote ${Math.floor(i / 10) + 1} enviado (${batch.length} emails)`
          );
        }

        return {
          totalSent: personalizedEmails.length,
          sentAt: new Date().toISOString(),
        };
      },
    },
  ],

  onVictory: (context) => {
    console.log(
      `📧 Campanha enviada com sucesso! Total: ${context.result.totalSent} emails`
    );
  },
});

// Exemplo 3: Deck complexo com init e cleanup
const dataProcessingDeck = engine.createDeck("data-processing", {
  title: "Processamento de Dados",
  arena: "data",

  // Inicialização
  async init(context) {
    context.log("info", "Inicializando conexões de banco");
    // Simular conexão com DB
    await context.wait(100);
  },

  // Processamento principal
  async play(context) {
    const { dataSource, filters } = context.payload;

    context.log("info", `Processando dados de: ${dataSource}`);

    // Simular processamento pesado
    await context.wait(2000);

    const processedData = {
      source: dataSource,
      records: Math.floor(Math.random() * 1000),
      processedAt: new Date().toISOString(),
    };

    return processedData;
  },

  // Limpeza
  async cleanup(context) {
    context.log("info", "Fechando conexões");
    await context.wait(50);
  },

  // Configurações específicas
  maxDuration: 30000, // 30 segundos
  retry: {
    maxAttempts: 2,
    factor: 1.5,
  },
});

// Função para demonstrar o uso
async function demonstrarUso() {
  console.log("🎮 Iniciando demonstração do Deck Engine\n");

  try {
    // 1. Jogar uma partida simples
    console.log("1️⃣ Processando um pedido...");
    const orderResult = await processOrderDeck.playAndWait({
      orderId: "ORDER-123",
      customerId: "CUST-456",
      items: [{ id: "ITEM-1", qty: 2 }],
    });
    console.log("Resultado:", orderResult);
    console.log("");

    // 2. Campanha de email
    console.log("2️⃣ Executando campanha de email...");
    const campaignResult = await emailCampaignDeck.playAndWait({
      recipients: ["user1@test.com", "user2@test.com", "invalid-email"],
      template: "Olá {{email}}, temos uma oferta especial!",
    });
    console.log("Resultado:", campaignResult);
    console.log("");

    // 3. Múltiplas partidas simultâneas
    console.log("3️⃣ Processando múltiplos pedidos...");
    const batchResult = await processOrderDeck.playMatches([
      { orderId: "ORDER-200", customerId: "CUST-100" },
      { orderId: "ORDER-201", customerId: "CUST-101" },
      { orderId: "ORDER-202", customerId: "CUST-102" },
    ]);
    console.log("Resultado do lote:", batchResult);
    console.log("");

    // 4. Adicionar carta dinamicamente
    console.log("4️⃣ Adicionando carta ao deck...");
    emailCampaignDeck.addCard("track-opens", async (context) => {
      context.log("info", "Configurando tracking de abertura");
      await context.wait(100);
      return { trackingEnabled: true };
    });

    // 5. Estatísticas do sistema
    console.log("5️⃣ Estatísticas do sistema:");
    console.log(JSON.stringify(engine.getStats(), null, 2));
  } catch (error) {
    console.error("Erro durante demonstração:", error);
  }
}

// Executar demonstração se for chamado diretamente
if (require.main === module) {
  demonstrarUso();
}

module.exports = {
  engine,
  processOrderDeck,
  emailCampaignDeck,
  dataProcessingDeck,
  demonstrarUso,
};
