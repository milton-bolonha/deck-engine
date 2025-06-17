// 🎮 Exemplos Avançados do Deck Engine
const DeckEngine = require("./deck-engine.js");

// 🚀 Configurar engine com todas as funcionalidades
const engine = new DeckEngine({
  devMode: true,
  verboseLogging: true,
  maxRetries: 3,
  maxConcurrency: 10,
  enableMetrics: true,
  enableEventSystem: true,
  defaultArena: "production",
});

// 📊 Sistema de eventos global
engine.on("engine:initialized", (data) => {
  console.log("🎮 Engine inicializado:", data.version);
});

engine.on("deck:created", (data) => {
  console.log(`🎴 Novo deck criado: ${data.deckName}`);
});

engine.on("match:victory", (data) => {
  console.log(`🏆 Vitória! Match ${data.matchId} do deck ${data.deckName}`);
});

engine.on("match:defeat", (data) => {
  console.log(`💀 Derrota! Match ${data.matchId} do deck ${data.deckName}`);
});

// 🛒 Exemplo: E-commerce Pipeline Completo
const ecommerceDeck = engine.createDeck("ecommerce-order", {
  title: "Pipeline de Pedidos E-commerce",
  description:
    "Processamento completo de pedidos com validação, pagamento e fulfillment",
  version: "2.0.0",
  arena: "critical",

  cards: [
    {
      name: "validate-customer",
      description: "Validar dados do cliente e histórico",
      type: "validation",
      cost: 1,
      async play(context) {
        context.log("info", "🔍 Validando cliente...");
        const { customerId } = context.payload;

        await context.wait(150);

        if (!customerId || customerId.startsWith("fake_")) {
          throw new Error("Cliente inválido ou suspeito");
        }

        return {
          customerValid: true,
          creditScore: 850,
          tier: "premium",
        };
      },
    },

    {
      name: "check-inventory",
      description: "Verificar disponibilidade em estoque",
      type: "validation",
      cost: 2,
      async play(context) {
        context.log("info", "📦 Verificando estoque...");
        const { items } = context.payload;

        await context.wait(200);

        for (const item of items) {
          if (item.quantity > 10) {
            throw new Error(`Estoque insuficiente para ${item.product}`);
          }
        }

        return {
          stockValid: true,
          reservedItems: items.map((item) => ({
            ...item,
            reservationId: `RSV-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 4)}`,
          })),
        };
      },
    },

    {
      name: "calculate-pricing",
      description: "Calcular preços, impostos e descontos",
      type: "calculation",
      cost: 1,
      async play(context) {
        context.log("info", "💰 Calculando preços...");
        const { items, customerTier } = context.payload;

        await context.wait(100);

        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const discount = customerTier === "premium" ? subtotal * 0.1 : 0;
        const tax = (subtotal - discount) * 0.08;
        const total = subtotal - discount + tax;

        return {
          pricing: {
            subtotal,
            discount,
            tax,
            total,
            currency: "BRL",
          },
        };
      },
    },

    {
      name: "process-payment",
      description: "Processar pagamento via gateway",
      type: "external",
      cost: 3,
      async play(context) {
        context.log("info", "💳 Processando pagamento...");
        const { payment, total } = context.payload;

        // Simular latência de API externa
        await context.wait(500);

        if (
          payment.method === "credit_card" &&
          payment.number.includes("0000")
        ) {
          throw new Error("Cartão de crédito recusado");
        }

        return {
          paymentResult: {
            transactionId: `TXN-${Date.now()}`,
            status: "approved",
            method: payment.method,
            amount: total,
            processedAt: new Date().toISOString(),
          },
        };
      },
    },

    {
      name: "create-shipment",
      description: "Criar ordem de envio",
      type: "fulfillment",
      cost: 2,
      async play(context) {
        context.log("info", "🚚 Criando ordem de envio...");
        const { shippingAddress, reservedItems } = context.payload;

        await context.wait(300);

        return {
          shipment: {
            trackingNumber: `TRK-${Date.now()}`,
            carrier: "FastDelivery",
            estimatedDelivery: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
            address: shippingAddress,
            items: reservedItems,
          },
        };
      },
    },

    {
      name: "send-confirmation",
      description: "Enviar confirmação por email/SMS",
      type: "notification",
      cost: 1,
      async play(context) {
        context.log("info", "📧 Enviando confirmação...");
        const { customerEmail, transactionId, trackingNumber } =
          context.payload;

        await context.wait(100);

        return {
          notifications: [
            {
              type: "email",
              to: customerEmail,
              template: "order-confirmation",
              data: { transactionId, trackingNumber },
              sentAt: new Date().toISOString(),
            },
            {
              type: "sms",
              message: `Pedido confirmado! Rastreamento: ${trackingNumber}`,
              sentAt: new Date().toISOString(),
            },
          ],
        };
      },
    },
  ],

  // 🎯 Eventos específicos do deck
  onMatchStart: (context) => {
    console.log(
      `🎬 Iniciando processamento do pedido ${context.payload.orderId}`
    );
  },

  onCardPlayed: (context, card, result) => {
    console.log(`🃏 Carta "${card.name}" jogada com sucesso`);
  },

  onVictory: (context) => {
    const { orderId, transactionId } = context.payload;
    console.log(`✅ Pedido ${orderId} processado! Transação: ${transactionId}`);
  },

  onDefeat: (context) => {
    const { orderId } = context.payload;
    console.log(`❌ Falha no processamento do pedido ${orderId}`);
  },

  // ⚙️ Configurações avançadas
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 30000,
    randomize: true,
  },

  arena: {
    name: "orders",
    concurrencyLimit: 5,
    priority: 10,
  },

  maxDuration: 45000, // 45 segundos
});

// 🔄 Exemplo: Pipeline de CI/CD
const cicdDeck = engine.createDeck("cicd-pipeline", {
  title: "Pipeline de CI/CD",
  description: "Deploy automatizado com testes e validações",

  cards: [
    {
      name: "checkout-code",
      async play(context) {
        context.log("info", "📥 Fazendo checkout do código...");
        await context.wait(200);
        return {
          branch: context.payload.branch,
          commit: context.payload.commit,
        };
      },
    },

    {
      name: "run-tests",
      async play(context) {
        context.log("info", "🧪 Executando testes...");
        await context.wait(2000);

        const testResults = {
          unit: { passed: 145, failed: 0 },
          integration: { passed: 23, failed: 0 },
          e2e: { passed: 12, failed: 0 },
        };

        return { testResults };
      },
    },

    {
      name: "build-docker",
      async play(context) {
        context.log("info", "🐳 Construindo imagem Docker...");
        await context.wait(1500);

        return {
          dockerImage: `app:${context.payload.commit.slice(0, 8)}`,
          imageSize: "245MB",
          layers: 12,
        };
      },
    },

    {
      name: "deploy-staging",
      async play(context) {
        context.log("info", "🚀 Deploy em staging...");
        await context.wait(800);

        return {
          environment: "staging",
          url: "https://staging.app.com",
          deployedAt: new Date().toISOString(),
        };
      },
    },

    {
      name: "smoke-tests",
      async play(context) {
        context.log("info", "💨 Testes de smoke...");
        await context.wait(500);

        return { smokeTestsPassed: true, responseTime: "150ms" };
      },
    },

    {
      name: "deploy-production",
      conditions: (context) => context.payload.branch === "main",
      async play(context) {
        context.log("info", "🌟 Deploy em produção...");
        await context.wait(1000);

        return {
          environment: "production",
          url: "https://app.com",
          deployedAt: new Date().toISOString(),
        };
      },
    },
  ],

  arena: "builds",

  onVictory: (context) => {
    console.log(
      `🎉 Deploy realizado com sucesso! Commit: ${context.payload.commit}`
    );
  },
});

// 📊 Exemplo: Processamento de Dados
const dataDeck = engine.createDeck("data-processing", {
  title: "Pipeline de Processamento de Dados",

  async play(context) {
    const { dataSource, filters } = context.payload;

    context.log("info", `📊 Processando dados de: ${dataSource}`);

    // Simular ETL pesado
    for (let i = 1; i <= 5; i++) {
      context.log("info", `Processando lote ${i}/5...`);
      await context.wait(400);
    }

    const processedData = {
      source: dataSource,
      records: Math.floor(Math.random() * 10000),
      processedAt: new Date().toISOString(),
      filters: filters,
    };

    return processedData;
  },

  arena: "data",
  maxDuration: 30000,
});

// 🎮 Funcionalidades Avançadas

// 1. Sistema de eventos específicos do deck
ecommerceDeck.on("card:played", (data) => {
  console.log(`Carta jogada: ${data.cardName}`);
});

// 2. Clonagem de decks
const ecommerceClone = ecommerceDeck.clone("ecommerce-order-v2");
console.log("Deck clonado:", ecommerceClone.name);

// 3. Export/Import
const exportedDeck = ecommerceDeck.export();
console.log("Deck exportado:", exportedDeck.name);

// 4. Gerenciamento dinâmico de cartas
cicdDeck.addCard("security-scan", async (context) => {
  context.log("info", "🔒 Executando scan de segurança...");
  await context.wait(1000);
  return { vulnerabilities: 0, scanScore: "A+" };
});

// 5. Métricas e health check
async function demonstrarAvancado() {
  console.log("\n🎮 === DEMONSTRAÇÃO AVANÇADA ===\n");

  try {
    // Simular pedido complexo
    console.log("🛒 Processando pedido e-commerce...");
    const pedidoResult = await ecommerceDeck.playAndWait({
      orderId: "ORDER-2024-001",
      customerId: "CUST-premium-123",
      customerEmail: "cliente@email.com",
      items: [
        { product: "Laptop", quantity: 1, price: 2500 },
        { product: "Mouse", quantity: 2, price: 50 },
      ],
      payment: {
        method: "credit_card",
        number: "4111-1111-1111-1111",
      },
      shippingAddress: {
        street: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zip: "01000-000",
      },
    });

    console.log("✅ Pedido processado:", pedidoResult.id);

    // CI/CD Pipeline
    console.log("\n🚀 Executando pipeline CI/CD...");
    const deployResult = await cicdDeck.playAndWait({
      branch: "main",
      commit: "abc123def456",
      author: "developer@company.com",
    });

    console.log("✅ Deploy realizado:", deployResult.id);

    // Múltiplos processamentos de dados
    console.log("\n📊 Processamento em lote de dados...");
    const batchResults = await dataDeck.playMatches([
      { dataSource: "sales_db", filters: { year: 2024 } },
      { dataSource: "customer_db", filters: { active: true } },
      { dataSource: "inventory_db", filters: { inStock: true } },
    ]);

    console.log("✅ Lote processado:", batchResults.successful, "sucessos");

    // Health check do sistema
    console.log("\n🏥 Health Check:");
    console.log(JSON.stringify(engine.healthCheck(), null, 2));

    // Estatísticas detalhadas
    console.log("\n📊 Estatísticas do Sistema:");
    const stats = engine.getStats();
    console.log(`Total de partidas: ${stats.matches.total}`);
    console.log(
      `Taxa de sucesso: ${stats.matches.victories}/${stats.matches.total}`
    );
    console.log(`Duração média: ${stats.metrics.avgMatchDuration}ms`);

    // Stats por deck
    console.log("\n📈 Stats por Deck:");
    console.log("E-commerce:", ecommerceDeck.getStats());
    console.log("CI/CD:", cicdDeck.getStats());
    console.log("Data:", dataDeck.getStats());
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  demonstrarAvancado();
}

module.exports = {
  engine,
  ecommerceDeck,
  cicdDeck,
  dataDeck,
  demonstrarAvancado,
};
