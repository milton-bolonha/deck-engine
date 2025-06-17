# 🎮 PipesNow DeckEngine

Sistema de pipelines assíncronos inspirado no **Hearthstone** para Node.js

[![npm version](https://badge.fury.io/js/pipesnow-deck-engine.svg)](https://badge.fury.io/js/pipesnow-deck-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

## 🚀 Instalação

```bash
npm install pipesnow-deck-engine
```

## 📖 Conceitos

- **🃏 Deck** = Pipeline (conjunto de etapas)
- **🎯 Card** = Step (uma etapa do pipeline)
- **⚔️ Match** = Execução (uma rodada do pipeline)
- **🏟️ Arena** = Queue (fila de execuções)

## 🎯 Uso Básico

```javascript
const DeckEngine = require("pipesnow-deck-engine");

// Criar engine
const engine = new DeckEngine();

// Criar um deck (pipeline)
const processamentoDados = engine.createDeck("processamento-dados", {
  concurrency: 3,
  timeout: 30000,
});

// Adicionar cards (etapas)
processamentoDados
  .addCard("validar", async (context) => {
    console.log("🔍 Validando dados...");
    return { ...context, validated: true };
  })
  .addCard("processar", async (context) => {
    console.log("⚙️ Processando...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { ...context, processed: true };
  })
  .addCard("salvar", async (context) => {
    console.log("💾 Salvando resultado...");
    return { ...context, saved: true };
  });

// Executar match (rodar pipeline)
async function exemplo() {
  try {
    const resultado = await engine.playMatch("processamento-dados", {
      context: { dados: "exemplo" },
    });

    console.log("✅ Sucesso:", resultado);
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

exemplo();
```

## 🔧 Uso Avançado

### Importações Modulares

```javascript
// Importação padrão
const DeckEngine = require("pipesnow-deck-engine");

// Importações específicas
const { Deck, Match, Arena } = require("pipesnow-deck-engine");

// Funções de conveniência
const { createEngine, createDeck } = require("pipesnow-deck-engine");
```

### Cards com Opções Avançadas

```javascript
deck.addCard(
  "card-complexo",
  async (context) => {
    // Sua lógica aqui
  },
  {
    retries: 3,
    timeout: 5000,
    condition: () => context.shouldRun,
    rollback: async (context) => {
      // Lógica de rollback
    },
    idempotent: true,
  }
);
```

### Monitoramento e Métricas

```javascript
const engine = new DeckEngine({ enableMetrics: true });

// Verificar saúde
console.log(engine.healthCheck());

// Obter métricas
const metrics = engine.getMetrics();
console.log(metrics.getPerformanceStats());
```

## 📊 API Completa

### DeckEngine

- `createDeck(name, options)` - Criar novo deck
- `getDeck(name)` - Obter deck existente
- `playMatch(deckName, options)` - Executar pipeline
- `healthCheck()` - Verificar saúde do sistema
- `cleanup()` - Limpar recursos

### Deck

- `addCard(name, action, options)` - Adicionar etapa
- `removeCard(name)` - Remover etapa
- `clone(newName)` - Clonar deck
- `toJSON()` / `fromJSON()` - Serialização

### Eventos

```javascript
engine.getEvents().on("match.start", (match) => {
  console.log("Match iniciado:", match.id);
});
```

## 🎮 Exemplos Completos

Veja os arquivos de exemplo incluídos:

- `exemplo-uso.js` - Uso básico
- `exemplos-avancados.js` - Casos complexos

## 🔧 Scripts NPM

```bash
npm test          # Executar testes
npm run demo      # Executar demo
npm run examples  # Executar exemplos avançados
npm run health    # Verificar saúde
```

## 📚 Documentação Completa

- 📖 **[Índice da Documentação](docs/README.md)** - Portal principal
- 🎮 **[Guia CLI](docs/cli-usage.md)** - Interface de linha de comando
- 🏗️ **[Arquitetura](docs/architecture.md)** - Documentação técnica
- 📊 **[Changelog](docs/changelog.md)** - Histórico de versões
- 🚀 **[NPM Guide](docs/npm-publication-guide.md)** - Publicação

## 📝 Licença

MIT - Veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Veja nosso [changelog](docs/changelog.md) para acompanhar as atualizações.

---

**Inspirado no Hearthstone** 🃏 - Porque pipelines podem ser divertidos!

## 🏗️ Arquitetura Modular

O DeckEngine foi organizado em módulos especializados para facilitar manutenção e compreensão:

```
src/
├── deck-engine.js    # 🎮 Core principal - orquestração de todos os sistemas
├── deck.js          # 🎴 Sistema de Decks - criação e gerenciamento
├── match.js         # ⚔️ Sistema de Partidas - execução e controle
├── arena.js         # 🏟️ Sistema de Arenas - filas e concorrência
├── metrics.js       # 📊 Sistema de Métricas - observabilidade
├── events.js        # 🎯 Sistema de Eventos - comunicação
└── utils.js         # 🛠️ Utilitários - funções auxiliares
```

**Benefícios da Modularização:**

- ✅ **Clareza**: Cada módulo tem responsabilidade específica
- ✅ **Manutenibilidade**: Mudanças isoladas por domínio
- ✅ **Testabilidade**: Testes unitários por sistema
- ✅ **Reutilização**: Módulos podem ser usados independentemente
- ✅ **Sem perdas**: 100% das funcionalidades preservadas

## 🎯 Conceitos Fundamentais
