# 🎮 DeckEngine CLI - Guia de Uso

## 🚀 Instalação

### Instalação Global (Recomendada para CLI)

```bash
npm install -g pipesnow-deck-engine
```

### Instalação Local

```bash
npm install pipesnow-deck-engine
# Usar com: npx deck-engine
```

## 📋 Comandos Disponíveis

### 🎯 `deck-engine help`

Mostra ajuda completa com todos os comandos disponíveis.

### 📝 `deck-engine create <nome>`

Cria um novo deck (pipeline) com template pronto para uso.

**Exemplo:**

```bash
deck-engine create processamento-pedidos
```

**Resultado:** Cria arquivo `processamento-pedidos.deck.js` com estrutura básica:

- Card "inicio" - inicialização
- Card "processar" - processamento principal
- Card "finalizar" - conclusão

### ⚔️ `deck-engine run <nome>`

Executa um deck existente.

**Exemplo:**

```bash
deck-engine run processamento-pedidos
```

### 📋 `deck-engine list`

Lista todos os decks disponíveis no diretório atual (arquivos `.deck.js`).

### 🏥 `deck-engine health`

Verifica a saúde do sistema DeckEngine:

- Status geral
- Uptime
- Versão
- Status das arenas
- Tamanho da fila

### 🎯 `deck-engine demo`

Executa uma demonstração interativa do DeckEngine.

### 📊 `deck-engine version`

Mostra a versão atual do DeckEngine.

## 🎴 Estrutura de um Deck

Quando você executa `deck-engine create nome-deck`, é criado um arquivo com esta estrutura:

```javascript
const DeckEngine = require("pipesnow-deck-engine");

// Criar engine
const engine = new DeckEngine();

// Criar deck
const deck = engine.createDeck("nome-deck", {
  concurrency: 3,
  timeout: 30000,
  retryDelay: 1000,
});

// Adicionar cards (etapas)
deck
  .addCard("inicio", async (context) => {
    console.log("🚀 Iniciando processamento...");
    return { ...context, started: true, timestamp: new Date() };
  })

  .addCard("processar", async (context) => {
    console.log("⚙️ Processando dados...");
    // Sua lógica aqui
    return { ...context, processed: true };
  })

  .addCard("finalizar", async (context) => {
    console.log("✅ Finalizando...");
    return { ...context, completed: true };
  });

// Exportar para uso CLI
module.exports = { engine, deck };

// Executar se chamado diretamente
if (require.main === module) {
  async function executar() {
    try {
      const resultado = await engine.playMatch("nome-deck", {
        context: { dados: "exemplo" },
      });
      console.log("🎉 Sucesso!", resultado);
    } catch (error) {
      console.error("❌ Erro:", error.message);
    }
  }
  executar();
}
```

## 🔧 Fluxo de Trabalho Típico

### 1. Criar um novo pipeline

```bash
deck-engine create meu-processo
```

### 2. Editar o arquivo gerado

Abrir `meu-processo.deck.js` e customizar os cards conforme necessário.

### 3. Executar o pipeline

```bash
deck-engine run meu-processo
```

### 4. Verificar status

```bash
deck-engine health
```

### 5. Listar todos os pipelines

```bash
deck-engine list
```

## 🎨 Exemplos de Uso

### E-commerce Pipeline

```bash
deck-engine create processar-pedido
# Editar para incluir: validar-estoque, processar-pagamento, enviar-email
deck-engine run processar-pedido
```

### CI/CD Pipeline

```bash
deck-engine create deploy-app
# Editar para incluir: build, test, deploy, notify
deck-engine run deploy-app
```

### Processamento de Dados

```bash
deck-engine create etl-dados
# Editar para incluir: extract, transform, load, validate
deck-engine run etl-dados
```

## 🛠️ Troubleshooting

### Comando não encontrado

```bash
# Reinstalar globalmente
npm install -g pipesnow-deck-engine

# Ou usar npx
npx pipesnow-deck-engine help
```

### Deck não executa

```bash
# Verificar se arquivo existe
deck-engine list

# Verificar saúde do sistema
deck-engine health

# Ver demo para referência
deck-engine demo
```

## 🎮 Conceitos Lembrete

- **🃏 Deck** = Pipeline (conjunto de etapas)
- **🎯 Card** = Step (uma etapa específica)
- **⚔️ Match** = Execução (uma rodada do pipeline)
- **🏟️ Arena** = Queue (fila de execuções)

---

🎮 **PipesNow DeckEngine** - Transformando pipelines complexos em jogos divertidos!
