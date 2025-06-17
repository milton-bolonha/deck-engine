# 🧪 Examples - PipesNow DeckEngine

Exemplos práticos e prontos para usar do DeckEngine.

## 📋 Lista de Exemplos

### 👶 **Iniciante**

| Arquivo                 | Descrição             | Conceitos                    |
| ----------------------- | --------------------- | ---------------------------- |
| **`simple-test.js`**    | Primeiro teste básico | Engine, deck, card, execução |
| **`hello-world.js`**    | Pipeline de saudação  | Fluxo sequencial simples     |
| **`basic-pipeline.js`** | Pipeline com 3 etapas | Contexto, transformação      |

### 🟡 **Intermediário**

| Arquivo                   | Descrição              | Conceitos                                     |
| ------------------------- | ---------------------- | --------------------------------------------- |
| **`data-processing.js`**  | Processamento de dados | Validação, transformação, tratamento de erros |
| **`batch-processing.js`** | Processamento em lote  | `playMatches()`, concorrência                 |
| **`error-handling.js`**   | Tratamento de erros    | Try/catch, fallbacks, recuperação             |

### 🔴 **Avançado**

| Arquivo                  | Descrição          | Conceitos                           |
| ------------------------ | ------------------ | ----------------------------------- |
| **`user-pipeline.js`**   | Gestão de usuários | Integração com APIs, domains        |
| **`stripe-pipeline.js`** | Integração Stripe  | Pagamentos, webhooks, sincronização |
| **`multi-domain.js`**    | Múltiplos domains  | Sistema avançado de domains         |

## 🚀 Como usar

### 1️⃣ **Executar um exemplo**

```bash
# Na pasta raiz do projeto
node examples/simple-test.js
node examples/hello-world.js
node examples/data-processing.js
```

### 2️⃣ **Executar via NPM**

```bash
npm run demo          # simple-test.js
npm test              # test-v2.js
npm start             # simple-test.js
```

### 3️⃣ **Executar via CLI**

```bash
npx deck-engine demo
npx deck-engine health
```

## 📚 Exemplos Detalhados

### 🌟 **simple-test.js**

**Objetivo:** Primeiro contato com o DeckEngine

```javascript
// Criar engine
const engine = new DeckEngine({ version: "v2" });

// Criar pipeline simples
const deck = engine.createDeck("test-simple");
deck.addCard("hello", async (context) => {
  console.log("👋 Hello World!");
  return { ...context, message: "Hello World!" };
});

// Executar
const resultado = await engine.playAndWait("test-simple", { test: true });
console.log("Resultado:", resultado.success);

// Finalizar
await engine.shutdown();
```

**Aprende:** Conceitos básicos, criação de deck, execução, shutdown

---

### 📊 **data-processing.js**

**Objetivo:** Pipeline de processamento com validação e erro

```javascript
const processarDados = engine.createDeck("processar-dados");

processarDados
  .addCard("validar", async (dados) => {
    if (!dados.email) throw new Error("Email obrigatório");
    return { ...dados, validado: true };
  })
  .addCard("processar", async (dados) => {
    const resultado = {
      ...dados,
      id: Math.random().toString(36),
      timestamp: new Date().toISOString(),
    };
    return resultado;
  })
  .addCard("salvar", async (dados) => {
    console.log(`💾 Salvando usuário ${dados.id}`);
    return { ...dados, salvo: true };
  });

// Testar com dados válidos
const resultado1 = await engine.playAndWait("processar-dados", {
  nome: "João",
  email: "joao@exemplo.com",
});

// Testar com dados inválidos (vai dar erro)
try {
  const resultado2 = await engine.playAndWait("processar-dados", {
    nome: "Maria",
    // email ausente!
  });
} catch (error) {
  console.log("Erro esperado:", error.message);
}
```

**Aprende:** Validação, tratamento de erro, fluxo de dados

---

### 🔄 **batch-processing.js**

**Objetivo:** Processar múltiplos itens simultaneamente

```javascript
const usuarios = [
  { nome: "Ana", email: "ana@exemplo.com" },
  { nome: "Bruno", email: "bruno@exemplo.com" },
  { nome: "Carlos", email: "carlos@exemplo.com" },
];

// Processar todos em paralelo
const resultados = await engine.playMatches("processar-usuario", usuarios, {
  waitAll: true, // Aguardar todos
  concurrency: 2, // Máximo 2 simultâneos
});

console.log(`✅ ${resultados.length} usuários processados!`);
```

**Aprende:** `playMatches()`, concorrência, processamento em lote

---

### 💳 **stripe-pipeline.js**

**Objetivo:** Integração completa com Stripe

```javascript
const stripeDeck = engine.createDeck("stripe-payment");

stripeDeck
  .addCard("validate-purchase", async (context) => {
    // Validar dados da compra
    if (!context.productId || !context.customerId) {
      throw new Error("Dados de compra incompletos");
    }
    return { ...context, validated: true };
  })
  .addCard("create-payment-intent", async (context) => {
    // Criar payment intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: context.amount,
      currency: "brl",
      customer: context.customerId,
    });
    return { ...context, paymentIntentId: paymentIntent.id };
  })
  .addCard("update-database", async (context) => {
    // Atualizar banco de dados
    await database.purchases.create({
      customerId: context.customerId,
      productId: context.productId,
      paymentIntentId: context.paymentIntentId,
      status: "pending",
    });
    return { ...context, dbUpdated: true };
  });

// Executar pipeline de pagamento
const resultado = await engine.playAndWait("stripe-payment", {
  customerId: "cus_abc123",
  productId: "prod_xyz789",
  amount: 2999, // R$ 29,99
});
```

**Aprende:** Integração com APIs, fluxos de pagamento, dados reais

## 🎯 Dicas para Aprender

### 1️⃣ **Comece pelo básico**

- Execute `simple-test.js` primeiro
- Entenda os conceitos fundamentais
- Não pule etapas!

### 2️⃣ **Modifique os exemplos**

- Mude os console.log()
- Adicione suas próprias cards
- Teste cenários diferentes

### 3️⃣ **Combine exemplos**

- Use cards de um exemplo em outro
- Crie pipelines híbridos
- Experimente!

### 4️⃣ **Leia o código**

- Cada exemplo tem comentários
- Entenda o que cada parte faz
- Veja as diferentes abordagens

## 🔧 Comandos Úteis

```bash
# Executar todos os testes
find examples -name "*.js" | xargs -I {} node {}

# Executar apenas iniciantes
node examples/simple-test.js
node examples/hello-world.js

# Executar apenas avançados
node examples/user-pipeline.js
node examples/stripe-pipeline.js

# Health check
npx deck-engine health
```

## 🆘 Problemas Comuns

### ❌ **"Script não para"**

**Solução:** Sempre usar `await engine.shutdown()` no final

### ❌ **"Cannot find module"**

**Solução:** Executar da pasta raiz do projeto

### ❌ **"Timeout error"**

**Solução:** Aumentar timeout nas operações longas

### ❌ **"Cards não executam"**

**Solução:** Verificar se o deck foi criado corretamente

## 📖 Próximos Passos

1. ✅ **Execute todos os exemplos** iniciantes
2. 📖 **Leia a documentação** em `docs/`
3. 🎮 **Experimente o CLI** com templates
4. 🔧 **Crie seu primeiro pipeline** personalizado
5. 🚀 **Explore exemplos avançados**

---

**🎉 Agora é com você! Explore, modifique e crie!** 🚀
