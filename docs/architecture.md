# 🎮 DeckEngine - Arquitetura e Documentação Técnica

Sistema de pipelines assíncronos inspirado no Hearthstone, onde **Decks são Pipelines**, **Cards são Steps** e **Matches são Execuções**.

## 🎯 Conceitos Fundamentais

### Metáfora do Hearthstone

- **🎴 Deck** = Pipeline (conjunto de steps)
- **🃏 Card** = Step individual do pipeline
- **⚔️ Match** = Execução do pipeline
- **🏟️ Arena** = Queue (fila de execução)
- **🏆 Victory** = Execução bem-sucedida
- **💀 Defeat** = Execução falhou

### Baixa Complexidade, Altas Capacidades

O sistema foi projetado para ser **cognitivamente simples** mas **tecnicamente poderoso**:

- Interface familiar (gaming)
- Abstrações bem definidas
- Funcionalidades empresariais completas

## 🏗️ Arquitetura Modular

### Estrutura de Módulos

```
src/
├── deck-engine.js    # 🎮 Core principal - orquestração
├── deck.js          # 🎴 Sistema de Decks - criação e gerenciamento
├── match.js         # ⚔️ Sistema de Matches - execução e controle
├── arena.js         # 🏟️ Sistema de Arenas - filas e concorrência
├── metrics.js       # 📊 Sistema de Métricas - observabilidade
├── events.js        # 🎯 Sistema de Eventos - comunicação
└── utils.js         # 🛠️ Utilitários - funções auxiliares
```

### Separação de Responsabilidades

#### 🎮 DeckEngine (Core)

- Orquestração geral do sistema
- Integração entre módulos
- Interface principal

#### 🎴 Deck System

- Criação e configuração de decks
- Gerenciamento de cards
- Templates e clonagem

#### ⚔️ Match System

- Execução de matches
- Controle de estados
- Retry e timeout

#### 🏟️ Arena System

- Gerenciamento de filas
- Controle de concorrência
- Prioridades

#### 📊 Metrics System

- Coleta de métricas
- Performance tracking
- Estatísticas de uso

#### 🎯 Events System

- Comunicação assíncrona
- Hooks e callbacks
- Observabilidade

## 🔄 Fluxo de Execução

### 1. Criação de Deck

```javascript
const deck = engine.createDeck("meu-pipeline", {
  concurrency: 3,
  timeout: 30000,
});
```

### 2. Adição de Cards

```javascript
deck.addCard("validar", async (context) => {
  // Validação
  return validatedData;
});
```

### 3. Execução de Match

```javascript
const match = await engine.playMatch("meu-pipeline", {
  context: { dados: "entrada" },
});
```

## 🎭 Estados e Transições

### Match States

```
WAITING → QUEUED → PLAYING → VICTORY/DEFEAT
             ↓
        PAUSED ↔ PLAYING
             ↓
     CANCELLED/CRASHED/TIMED_OUT
```

### Card States

```
IN_HAND → PLAYING → PLAYED/FAILED
           ↓
       DISCARDED
```

## 🔧 Sistemas de Controle

### Retry System

- Backoff exponencial
- Jitter para evitar thundering herd
- Configurável por deck/card/global

### Timeout System

- Timeout por card
- Timeout por match
- Timeout global

### Idempotency

- Chaves de idempotência automáticas
- Prevenção de execuções duplicadas
- Cache de resultados

## 📊 Observabilidade

### Métricas Coletadas

- Tempo de execução por card
- Taxa de sucesso/erro
- Throughput por deck
- Utilização de recursos

### Eventos Emitidos

- `deck:created`
- `match:started`
- `match:completed`
- `card:played`
- `error:occurred`

### Logs Estruturados

```javascript
{
  level: 'info',
  message: 'Card executed',
  matchId: 'match-123',
  deckName: 'my-pipeline',
  cardName: 'validate',
  duration: 150
}
```

## 🚀 Funcionalidades Avançadas

### Batch Processing

```javascript
const results = await deck.playMatches([
  { orderId: 1 },
  { orderId: 2 },
  { orderId: 3 },
]);
```

### Conditional Cards

```javascript
deck.addCard(
  "notify",
  async (context) => {
    // Executar apenas se condição
  },
  {
    condition: () => context.shouldNotify,
  }
);
```

### Rollback Support

```javascript
deck.addCard(
  "process",
  async (context) => {
    // Processamento
  },
  {
    rollback: async (context) => {
      // Reverter alterações
    },
  }
);
```

## 🔗 Integrações

### CLI Integration

- Comando `deck-engine create`
- Comando `deck-engine run`
- Comando `deck-engine health`

### NPM Package

- Biblioteca JavaScript
- Definições TypeScript
- CLI global

### Ecosystem Ready

- Webhooks
- Metrics export
- Health checks
- Graceful shutdown

## 🎨 Patterns de Uso

### Pipeline de E-commerce

```javascript
const orderPipeline = engine
  .createDeck("process-order")
  .addCard("validate-stock")
  .addCard("process-payment")
  .addCard("ship-order")
  .addCard("send-confirmation");
```

### Pipeline de CI/CD

```javascript
const deployPipeline = engine
  .createDeck("deploy-app")
  .addCard("build")
  .addCard("test")
  .addCard("deploy")
  .addCard("health-check");
```

### Pipeline de Dados

```javascript
const etlPipeline = engine
  .createDeck("process-data")
  .addCard("extract")
  .addCard("transform")
  .addCard("load")
  .addCard("validate");
```

## 📈 Performance

### Otimizações

- Execução assíncrona nativa
- Pool de connections reutilizável
- Cache de resultados
- Lazy loading

### Limites Configuráveis

- Max concorrência por arena
- Max matches por deck
- Max memory usage
- Max execution time

---

🎮 **PipesNow DeckEngine** - Onde complexidade vira diversão!
