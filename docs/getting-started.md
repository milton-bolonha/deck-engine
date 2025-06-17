# 🚀 Getting Started - PipesNow DeckEngine

Um guia completo e gentil para começar a usar o DeckEngine.

## 📋 Índice

- [🎯 O que é o DeckEngine?](#-o-que-é-o-deckengine)
- [🧠 Conceitos Fundamentais](#-conceitos-fundamentais)
- [⚡ Instalação Rápida](#-instalação-rápida)
- [👶 Primeiro Pipeline](#-primeiro-pipeline)
- [🎮 Exemplos Práticos](#-exemplos-práticos)
- [🔧 Configurações](#-configurações)
- [❓ FAQ](#-faq)
- [🆘 Solução de Problemas](#-solução-de-problemas)

---

## 🎯 O que é o DeckEngine?

O **DeckEngine** é um sistema de **pipelines assíncronos** que usa **metáforas de jogos** para tornar o desenvolvimento mais intuitivo e divertido.

### 🎲 Por que usar metáforas de jogos?

- **🧠 Mais fácil de lembrar**: "Deck" é mais memorável que "Pipeline"
- **😊 Mais divertido**: Desenvolver fica mais interessante
- **🎯 Conceitos claros**: Cada termo tem um significado específico
- **👥 Melhor comunicação**: "Vou rodar um match" é mais claro que "vou executar o processo"

---

## 🧠 Conceitos Fundamentais

### 🃏 **Deck = Pipeline**

Um **conjunto ordenado de etapas** que processam dados sequencialmente.

**Exemplo:** Pipeline de pedido e-commerce

```
Validar Estoque → Processar Pagamento → Enviar Produto → Notificar Cliente
```

### 🎯 **Card = Step/Etapa**

Uma **tarefa específica** dentro do pipeline.

**Exemplo:** "Validar Estoque" é uma card que verifica se o produto está disponível.

### ⚔️ **Match = Execução**

Uma **rodada/execução** do pipeline com dados específicos.

**Exemplo:** Processar o pedido #12345 é um "match".

### 🏟️ **Arena = Queue/Fila**

O **local onde os matches aguardam** para serem processados.

**Exemplo:** Fila de pedidos aguardando processamento.

---

## ⚡ Instalação Rápida

### 📦 Via NPM

```bash
npm install pipesnow-deck-engine
```

### 🔗 Via Git

```bash
git clone https://github.com/seu-usuario/pipesnow
cd pipesnow
npm install
```

### ✅ Verificar Instalação

```bash
npm run health
```

Deve mostrar:

```
🏥 Status do Sistema V2:
  Status: healthy
  Versão: 2.0.0
  Platform: node
```

---

## 👶 Primeiro Pipeline

### 🔥 Super Simples

```javascript
// 1️⃣ Importar
const DeckEngine = require("pipesnow-deck-engine");

// 2️⃣ Criar engine
const engine = new DeckEngine();

// 3️⃣ Criar pipeline (deck)
const meuPrimeiroDeck = engine.createDeck("saudacao");

// 4️⃣ Adicionar etapas (cards)
meuPrimeiroDeck
  .addCard("dizer-oi", async (dados) => {
    console.log(`👋 Olá, ${dados.nome}!`);
    return { ...dados, saudacao: "feita" };
  })
  .addCard("despedir", async (dados) => {
    console.log(`👍 Tchau, ${dados.nome}!`);
    return { ...dados, despedida: "feita" };
  });

// 5️⃣ Executar
async function executar() {
  const resultado = await engine.playAndWait("saudacao", {
    nome: "João",
  });

  console.log("✅ Resultado:", resultado);

  // 🛑 Importante: sempre finalizar!
  await engine.shutdown();
}

executar();
```

### 📤 Output Esperado

```
👋 Olá, João!
👍 Tchau, João!
✅ Resultado: { success: true, nome: 'João', saudacao: 'feita', despedida: 'feita' }
```

---

## 🎮 Exemplos Práticos

### 📊 Processamento de Dados

```javascript
const processarDados = engine.createDeck("processar-dados");

processarDados
  .addCard("validar", async (dados) => {
    if (!dados.email) throw new Error("Email obrigatório");
    return { ...dados, validado: true };
  })
  .addCard("enriquecer", async (dados) => {
    return {
      ...dados,
      id: Math.random().toString(36),
      timestamp: new Date().toISOString(),
    };
  })
  .addCard("salvar", async (dados) => {
    console.log("💾 Salvando:", dados.id);
    return { ...dados, salvo: true };
  });

// Usar
const resultado = await engine.playAndWait("processar-dados", {
  email: "joao@exemplo.com",
  nome: "João Silva",
});
```

### 🛒 E-commerce Pipeline

```javascript
const pedido = engine.createDeck("processar-pedido");

pedido
  .addCard("validar-estoque", async (dados) => {
    // Verificar se tem estoque
    return { ...dados, estoqueOk: true };
  })
  .addCard("calcular-frete", async (dados) => {
    // Calcular valor do frete
    return { ...dados, frete: 15.9 };
  })
  .addCard("processar-pagamento", async (dados) => {
    // Cobrar cartão
    return { ...dados, pagamentoOk: true };
  })
  .addCard("enviar-produto", async (dados) => {
    // Gerar etiqueta e enviar
    return { ...dados, enviado: true };
  })
  .addCard("notificar-cliente", async (dados) => {
    // Enviar email de confirmação
    return { ...dados, notificado: true };
  });

// Processar pedido
const pedidoResultado = await engine.playAndWait("processar-pedido", {
  clienteId: "cliente123",
  produtoId: "produto456",
  quantidade: 2,
});
```

### 🤖 Múltiplas Execuções

```javascript
// Processar vários pedidos em paralelo
const pedidos = [
  { clienteId: "cliente1", produtoId: "produto1" },
  { clienteId: "cliente2", produtoId: "produto2" },
  { clienteId: "cliente3", produtoId: "produto3" },
];

const resultados = await engine.playMatches("processar-pedido", pedidos, {
  waitAll: true, // Aguardar todos terminarem
});

console.log(`✅ ${resultados.length} pedidos processados!`);
```

---

## 🔧 Configurações

### ⚙️ Opções do Engine

```javascript
const engine = new DeckEngine({
  version: "v2", // Versão (sempre use v2)
  platform: "node", // Plataforma (node/vercel/netlify)
  logging: ["console", "file"], // Onde salvar logs
  standardDomains: [
    // Domains padrão
    "authentication",
    "user-management",
    "system",
  ],
});
```

### 🎯 Opções dos Decks

```javascript
const meuDeck = engine.createDeck("nome-deck", {
  concurrency: 3, // Máximo 3 matches simultâneos
  timeout: 30000, // 30 segundos de timeout
  retries: 2, // Tentar 2 vezes se falhar
  arena: "minha-arena", // Arena específica
});
```

### 📋 Opções de Execução

```javascript
const resultado = await engine.playMatch("deck-name", dados, {
  priority: "high", // Prioridade (high/normal/low)
  timeout: 60000, // Timeout específico
  metadata: {
    // Dados extras
    userId: "user123",
    source: "api",
  },
});
```

---

## ❓ FAQ

### ❔ **Qual a diferença entre `playMatch` e `playAndWait`?**

- **`playMatch`**: Envia para a fila e retorna imediatamente
- **`playAndWait`**: Envia para a fila e espera terminar

```javascript
// Não espera
const matchId = await engine.playMatch("meu-deck", dados);

// Espera resultado
const resultado = await engine.playAndWait("meu-deck", dados);
```

### ❔ **Como processar muitos itens rapidamente?**

Use `playMatches` com concorrência:

```javascript
const resultados = await engine.playMatches("meu-deck", muitosDados, {
  waitAll: true,
  concurrency: 10, // Processar 10 por vez
});
```

### ❔ **O que fazer quando um card falha?**

O pipeline para automaticamente. Você pode:

```javascript
meuDeck.addCard("card-que-pode-falhar", async (dados) => {
  try {
    // Sua lógica aqui
    return { ...dados, sucesso: true };
  } catch (error) {
    // Log do erro
    console.error("Erro:", error.message);

    // Retornar dados com erro marcado
    return { ...dados, erro: error.message, sucesso: false };
  }
});
```

### ❔ **Como saber se um match terminou?**

```javascript
// Opção 1: Aguardar diretamente
const resultado = await engine.playAndWait("deck", dados);

// Opção 2: Aguardar por ID
const matchId = await engine.playMatch("deck", dados);
const resultado = await engine.waitForMatch(matchId, 30000); // 30s timeout
```

### ❔ **Posso usar async/await em cards?**

Sim! É recomendado:

```javascript
meuDeck.addCard("buscar-dados", async (dados) => {
  const resposta = await fetch("https://api.exemplo.com/dados");
  const dadosExtras = await resposta.json();

  return { ...dados, dadosExtras };
});
```

---

## 🆘 Solução de Problemas

### 🐛 **Script não para/fica "pendurado"**

**Sempre use `engine.shutdown()`:**

```javascript
async function meuScript() {
  // Sua lógica aqui...

  // 🛑 SEMPRE no final:
  await engine.shutdown();
}

meuScript().catch(console.error);
```

### 🐛 **"Cannot find module" errors**

Verifique se os caminhos estão corretos:

```javascript
// ✅ Correto
const DeckEngine = require("pipesnow-deck-engine");

// ❌ Errado (paths antigos)
const DeckEngine = require("./v2/index");
```

### 🐛 **Cards não executam na ordem**

Cards são sempre executados **sequencialmente** dentro de um match. Se está fora de ordem, verifique:

1. Se você está aguardando o resultado corretamente
2. Se não há múltiplos matches rodando em paralelo

### 🐛 **Performance lenta**

1. **Ajuste concorrência:**

```javascript
const deck = engine.createDeck("meu-deck", {
  concurrency: 5, // Processar mais em paralelo
});
```

2. **Use playMatches para lotes:**

```javascript
// ✅ Eficiente
const resultados = await engine.playMatches("deck", muitosDados);

// ❌ Lento
for (const item of muitosDados) {
  await engine.playAndWait("deck", item);
}
```

### 🐛 **Logs demais/de menos**

Ajuste o logging:

```javascript
const engine = new DeckEngine({
  logging: ["console"], // Só console
  // logging: ['file']      // Só arquivo
  // logging: []            // Sem logs
});
```

---

## 🎯 Próximos Passos

1. ✅ **Rode os exemplos** em `examples/`
2. 📖 **Leia o tutorial** [User Management + Stripe](./tutorial-user-stripe-integration.md)
3. 🎮 **Experimente o CLI** com `npm run demo`
4. 🏗️ **Crie seu primeiro pipeline** seguindo este guia
5. 🚀 **Explore funcionalidades avançadas** na documentação

---

**🎉 Pronto! Agora você tem tudo que precisa para começar!**

Dúvidas? Consulte a [documentação completa](./README.md) ou os [exemplos práticos](../examples/).
