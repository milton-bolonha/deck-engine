/**
 * 🎯 Exemplo Prático - Integração com API do DeckEngine
 *
 * Demonstra como usar o DeckEngine via API REST
 */

const axios = require("axios");

const API_BASE = "http://localhost:3000";

async function exemploCompleto() {
  console.log("🎯 Exemplo Prático - API DeckEngine\n");

  try {
    // 1️⃣ Verificar se API está funcionando
    console.log("1️⃣ Verificando saúde da API...");
    const health = await axios.get(`${API_BASE}/api/health`);
    console.log("✅ API funcionando:", health.data.status);

    // 2️⃣ Criar deck para processamento de usuários
    console.log('\n2️⃣ Criando deck "user-onboarding"...');
    await axios.post(`${API_BASE}/api/decks`, {
      name: "user-onboarding",
      config: {
        concurrency: 3,
        timeout: 30000,
      },
    });
    console.log("✅ Deck criado!");

    // 3️⃣ Simular processamento de um usuário
    console.log("\n3️⃣ Processando usuário individual...");
    const singleUser = await axios.post(
      `${API_BASE}/api/decks/user-onboarding/execute`,
      {
        payload: {
          email: "joao@exemplo.com",
          name: "João Silva",
          source: "website",
        },
        waitForResult: true,
      }
    );

    if (singleUser.data.success) {
      console.log("✅ Usuário processado com sucesso!");
      console.log("📋 ID do match:", singleUser.data.result.matchId);
    }

    // 4️⃣ Processamento em lote
    console.log("\n4️⃣ Processamento em lote de usuários...");
    const usuarios = [
      { email: "ana@exemplo.com", name: "Ana Santos", source: "facebook" },
      { email: "bruno@exemplo.com", name: "Bruno Costa", source: "google" },
      { email: "carla@exemplo.com", name: "Carla Dias", source: "direct" },
      { email: "diego@exemplo.com", name: "Diego Lima", source: "referral" },
    ];

    const loteResult = await axios.post(
      `${API_BASE}/api/decks/user-onboarding/batch`,
      {
        payloads: usuarios,
        options: {
          concurrency: 2,
        },
      }
    );

    console.log(
      `✅ ${loteResult.data.totalExecuted} usuários processados em lote!`
    );

    // 5️⃣ Verificar status do sistema
    console.log("\n5️⃣ Status do sistema...");
    const status = await axios.get(`${API_BASE}/api/system/status`);
    console.log("📊 Decks ativos:", status.data.system.decks.total);
    console.log(
      "💾 Uso de memória:",
      Math.round(status.data.server.memory.heapUsed / 1024 / 1024),
      "MB"
    );

    // 6️⃣ Listar todos os decks
    console.log("\n6️⃣ Listando decks disponíveis...");
    const decks = await axios.get(`${API_BASE}/api/decks`);
    console.log("🃏 Decks encontrados:");
    decks.data.decks.forEach((deck) => {
      console.log(`  - ${deck.name} (${deck.status.matches.total} matches)`);
    });

    console.log("\n🎉 Exemplo completo executado com sucesso!");
    console.log("\n📖 Acesse a documentação completa em:");
    console.log(`   ${API_BASE}/api/docs`);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.error("❌ Erro: API não está rodando!");
      console.log("\n🚀 Para iniciar a API:");
      console.log("   cd server");
      console.log("   npm install");
      console.log("   npm start");
    } else {
      console.error("❌ Erro durante execução:", error.message);
      if (error.response?.data) {
        console.error("📝 Detalhes:", error.response.data);
      }
    }
  }
}

// 🎯 Exemplo de integração real - E-commerce
async function exemploEcommerce() {
  console.log("\n🛒 Exemplo E-commerce - Pipeline de Pedidos\n");

  try {
    // Criar deck para processamento de pedidos
    await axios.post(`${API_BASE}/api/decks`, {
      name: "process-order",
      config: { concurrency: 5 },
    });

    // Simular pedidos chegando
    const pedidos = [
      {
        orderId: "ORD001",
        customerId: "CUST123",
        items: ["produto-a", "produto-b"],
        total: 99.99,
      },
      {
        orderId: "ORD002",
        customerId: "CUST456",
        items: ["produto-c"],
        total: 49.99,
      },
      {
        orderId: "ORD003",
        customerId: "CUST789",
        items: ["produto-a", "produto-c", "produto-d"],
        total: 149.99,
      },
    ];

    console.log(`📦 Processando ${pedidos.length} pedidos...`);

    const resultados = await axios.post(
      `${API_BASE}/api/decks/process-order/batch`,
      {
        payloads: pedidos,
      }
    );

    console.log(`✅ ${resultados.data.totalExecuted} pedidos processados!`);
    console.log(
      "💰 Total processado: R$",
      pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2)
    );
  } catch (error) {
    console.error(
      "❌ Erro no exemplo e-commerce:",
      error.response?.data || error.message
    );
  }
}

// 🎯 Exemplo de webhook receiver
async function exemploWebhook() {
  console.log("\n🔗 Exemplo Webhook - Receber eventos externos\n");

  try {
    // Criar deck para processar webhooks
    await axios.post(`${API_BASE}/api/decks`, {
      name: "webhook-processor",
      config: { concurrency: 10 },
    });

    // Simular webhook do Stripe
    const stripeWebhook = {
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_abc123",
          amount: 2999,
          currency: "brl",
          customer: "cus_def456",
        },
      },
      created: Date.now(),
    };

    console.log("💳 Processando webhook do Stripe...");

    const webhookResult = await axios.post(
      `${API_BASE}/api/decks/webhook-processor/execute`,
      {
        payload: stripeWebhook,
        waitForResult: true,
      }
    );

    if (webhookResult.data.success) {
      console.log("✅ Webhook processado com sucesso!");
    }
  } catch (error) {
    console.error(
      "❌ Erro no exemplo webhook:",
      error.response?.data || error.message
    );
  }
}

// Executar todos os exemplos
async function executarTodos() {
  await exemploCompleto();
  await exemploEcommerce();
  await exemploWebhook();

  console.log("\n🎯 Todos os exemplos executados!");
  console.log("\n💡 Agora você pode:");
  console.log("   - Criar seus próprios decks via API");
  console.log("   - Integrar com sistemas externos");
  console.log("   - Monitorar via endpoints de status");
  console.log("   - Usar em produção com Docker/Vercel");
}

executarTodos().catch(console.error);
