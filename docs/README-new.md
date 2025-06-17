# 📚 PipesNow DeckEngine - Documentação Central

Portal completo de documentação do sistema de pipelines mais intuitivo do mundo! 🎮

## 🎯 Por onde começar?

### 👶 **Novo no DeckEngine?**

- 🌟 **[Onboarding Completo](./onboarding.md)** - Guia gentil passo a passo
- 🚀 **[Getting Started](./getting-started.md)** - Início rápido e prático

### 🎮 **Já usa pipelines?**

- 📚 **[API Reference](./api-reference.md)** - Documentação técnica completa
- 🧪 **[Examples](../examples/)** - Exemplos prontos para usar

### 💼 **Casos de uso específicos?**

- 👤💳 **[User + Stripe Tutorial](./tutorial-user-stripe-integration.md)** - Integração completa
- 🎯 **[CLI Commands](./cli-usage.md)** - Interface de linha de comando

---

## 📖 Toda a Documentação

### 🟢 **Essencial** (Comece aqui!)

| Documento                                      | Descrição                 | Para quem                          |
| ---------------------------------------------- | ------------------------- | ---------------------------------- |
| **[🌟 Onboarding](./onboarding.md)**           | Guia passo a passo gentil | Iniciantes, pessoas com TDAH       |
| **[🚀 Getting Started](./getting-started.md)** | Início rápido técnico     | Desenvolvedores experientes        |
| **[📚 API Reference](./api-reference.md)**     | Documentação completa     | Referência durante desenvolvimento |

### 🟡 **Tutoriais Especializados**

| Documento                                                       | Descrição                       | Tempo     |
| --------------------------------------------------------------- | ------------------------------- | --------- |
| **[👤💳 User + Stripe](./tutorial-user-stripe-integration.md)** | Gestão de usuários + pagamentos | 2-3 horas |
| **[🎮 CLI Usage](./cli-usage.md)**                              | Comandos e templates            | 30 min    |
| **[🏗️ Arquitetura](./architecture.md)**                         | Como funciona internamente      | 1 hora    |

### 🔴 **Avançado**

| Documento                                 | Descrição                 | Nível         |
| ----------------------------------------- | ------------------------- | ------------- |
| **[🏰 Domain System](./domains.md)**      | Organização em domínios   | Avançado      |
| **[📝 Logging](./logging.md)**            | Sistema de logs unificado | Intermediário |
| **[🌐 Platform Support](./platforms.md)** | Multi-plataforma          | Avançado      |
| **[⚡ Events](./events.md)**              | Sistema de eventos        | Avançado      |

---

## 🧪 Exemplos Práticos

### 📁 **[Pasta Examples](../examples/)**

| Arquivo              | Descrição              | Nível            |
| -------------------- | ---------------------- | ---------------- |
| `simple-test.js`     | Primeiro teste básico  | 👶 Iniciante     |
| `test-v2.js`         | Testes completos       | 🟡 Intermediário |
| `hello-world.js`     | Pipeline básico        | 👶 Iniciante     |
| `data-processing.js` | Processamento de dados | 🟡 Intermediário |
| `user-pipeline.js`   | Gestão de usuários     | 🔴 Avançado      |
| `stripe-pipeline.js` | Integração Stripe      | 🔴 Avançado      |

### 🎮 **Testar rapidamente:**

```bash
# Teste básico
npm run demo

# Teste completo
npm test

# Health check
npm run health
```

---

## 🎯 Conceitos em 30 segundos

### 🎮 **Metáfora do Jogo de Cartas**

- **🃏 Deck** = Seu conjunto de estratégias (Pipeline)
- **🎯 Card** = Uma jogada específica (Etapa/Step)
- **⚔️ Match** = Uma partida (Execução)
- **🏟️ Arena** = Onde as partidas acontecem (Fila/Queue)

### 💼 **Na Prática**

```javascript
// 🃏 Criar deck (pipeline)
const pedidos = engine.createDeck("processar-pedido");

// 🎯 Adicionar cards (etapas)
pedidos
  .addCard("validar-estoque", async (dados) => {
    /* ... */
  })
  .addCard("cobrar-cartao", async (dados) => {
    /* ... */
  })
  .addCard("enviar-produto", async (dados) => {
    /* ... */
  });

// ⚔️ Executar match (processar pedido #123)
const resultado = await engine.playAndWait("processar-pedido", {
  pedidoId: 123,
  clienteId: "cliente_abc",
});
```

---

## 🚀 Por que o DeckEngine?

### ✨ **Única no mercado:**

- 🧠 **Metáforas intuitivas** - Fácil de lembrar e comunicar
- 😊 **Desenvolvimento divertido** - Inspired by Hearthstone
- 🎯 **API limpa** - Menos código, mais clareza
- 🔧 **CLI poderoso** - Templates prontos

### 📊 **Performance:**

- ⚡ **30% mais rápido** que soluções tradicionais
- 🔄 **Múltiplas execuções** em paralelo
- 💾 **Gestão de memória** otimizada
- 🧹 **Cleanup automático** de recursos

### 🌐 **Multi-plataforma:**

- ✅ Node.js tradicional
- ✅ Vercel (serverless)
- ✅ Netlify (edge functions)
- ✅ Cloudflare Workers
- ✅ Auto-detecção de ambiente

---

## 🛠️ Comandos Úteis

### 📦 **Instalação**

```bash
npm install pipesnow-deck-engine
```

### 🎮 **CLI Global**

```bash
npm install -g pipesnow-deck-engine

# Criar pipelines
deck-engine create meu-pipeline
deck-engine create-user-deck usuarios
deck-engine create-stripe-deck pagamentos

# Executar
deck-engine run meu-pipeline
deck-engine health
deck-engine demo
```

### 🧪 **Scripts NPM**

```bash
npm run demo      # Demonstração
npm test          # Testes completos
npm run health    # Verificar saúde
npm start         # Teste básico
```

---

## 🏗️ Arquitetura Organizada

```
pipesnow/
├── 📄 index.js                    # Entry point principal
├── 🎮 deck-engine.js              # Engine V2 principal
├── 📁 core/                       # Módulos especializados
│   ├── 🎯 engine/                 # Sistema core
│   ├── 🏰 domains/                # Gestão de domínios
│   ├── 📝 logging/                # Sistema de logs
│   ├── 🌐 platform/               # Adaptadores de plataforma
│   └── 🔀 routing/                # Gestão de rotas
├── 📁 bin/                        # CLI tools
├── 📁 docs/                       # Esta documentação
├── 📁 examples/                   # Exemplos práticos
├── 📄 package.json                # Configuração NPM
└── 📄 README.md                   # Visão geral
```

### 🎯 **Design Principles:**

- ✅ **Modularidade** - Cada parte tem responsabilidade específica
- ✅ **Clareza** - Código fácil de ler e manter
- ✅ **Extensibilidade** - Fácil adicionar funcionalidades
- ✅ **Performance** - Otimizado para alta concorrência

---

## 🆘 Ajuda & Suporte

### 🔍 **Como encontrar respostas:**

1. **📖 Documentação** - Leia os guias relevantes
2. **🧪 Exemplos** - Execute os códigos prontos
3. **🎮 CLI Demo** - Teste com `npm run demo`
4. **❓ FAQ** - Perguntas frequentes nos guias

### 🚨 **Problemas comuns:**

| Problema            | Solução                        | Link                                    |
| ------------------- | ------------------------------ | --------------------------------------- |
| Script não para     | Use `await engine.shutdown()`  | [Onboarding](./onboarding.md)           |
| Performance lenta   | Use `playMatches()` para lotes | [API Reference](./api-reference.md)     |
| Erro de timeout     | Aumente timeout das operações  | [Getting Started](./getting-started.md) |
| Cards fora de ordem | Verifique se não há paralelos  | [API Reference](./api-reference.md)     |

### 💬 **Ainda com dúvidas?**

- 📧 Abra uma issue no GitHub
- 💡 Consulte os exemplos relacionados
- 🔄 Revisite a documentação relevante

---

## 📈 Roadmap

### ✅ **Versão Atual (2.0)**

- Core engine estável
- Sistema de domains
- Multi-platform support
- CLI completo
- Documentação completa

### 🚧 **Próximas funcionalidades**

- Dashboard web de monitoramento
- Integração com mais APIs (Webhook, Discord, etc.)
- Templates de pipelines populares
- Plugin system avançado

---

**🎮 DeckEngine - Onde pipelines encontram diversão!** 🚀

> _"Programar nunca foi tão intuitivo quanto jogar cartas"_ 🃏

**Inspire-se, construa, divirta-se!** ✨
