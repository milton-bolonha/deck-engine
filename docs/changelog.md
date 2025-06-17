# 📝 Changelog

Todas as mudanças notáveis do DeckEngine serão documentadas neste arquivo.

## [2.0.0] - 2024-XX-XX

### 🏗️ MAJOR: Modularização Completa + CLI

- **BREAKING**: Arquivo principal agora é apenas um proxy para `src/deck-engine.js`
- **Arquitetura Modular**: Dividido em 7 módulos especializados:
  - `src/deck-engine.js` - Core principal e orquestração
  - `src/deck.js` - Sistema de Decks
  - `src/match.js` - Sistema de Partidas
  - `src/arena.js` - Sistema de Arenas (filas)
  - `src/metrics.js` - Sistema de Métricas
  - `src/events.js` - Sistema de Eventos
  - `src/utils.js` - Utilitários compartilhados

### 🎮 NOVO: Interface CLI

- **CLI Global**: `npm install -g pipesnow-deck-engine`
- **Comandos Disponíveis**:
  - `deck-engine create <nome>` - Criar novo deck com template
  - `deck-engine run <deck>` - Executar deck existente
  - `deck-engine list` - Listar decks disponíveis
  - `deck-engine health` - Verificar saúde do sistema
  - `deck-engine demo` - Demonstração interativa
  - `deck-engine version` - Mostrar versão
  - `deck-engine help` - Ajuda completa

### 📦 NOVO: Pacote NPM Profissional

- **Dual Use**: Biblioteca + CLI em um pacote
- **TypeScript Definitions**: Suporte completo com `index.d.ts`
- **Estrutura NPM**: Configuração profissional para publicação
- **Documentação Organizada**: Pasta `docs/` com guias específicos

### ✅ Benefícios

- **Zero Breaking Changes**: API pública mantida 100% compatível
- **Manutenibilidade**: Cada módulo ~200-300 linhas vs 1300+ original
- **Clareza**: Responsabilidades bem definidas por módulo
- **Testabilidade**: Possibilidade de testes unitários por sistema
- **Usabilidade**: CLI para criação rápida de pipelines

### 🔧 Melhorias

- Documentação organizada em `docs/`
- README atualizado com instalação npm
- Templates automáticos via CLI
- Fluxo de trabalho simplificado

## [1.0.0] - 2024-06-16

### 🎉 Primeira Release

### ✨ Adicionado

- 🎴 Sistema principal DeckEngine com terminologia Hearthstone
- 🃏 Suporte a cartas (cards) como steps de pipeline
- ⚔️ Sistema de partidas (matches) para execução de decks
- 🏟️ Arenas para gerenciamento de filas (queues)
- 📊 Sistema completo de métricas e estatísticas
- 🎯 Sistema de eventos interno para observabilidade
- 🔄 Retry configurável com backoff exponencial
- 🆔 Sistema de idempotência para evitar execuções duplicadas
- 🎛️ Controles avançados (pause, resume, cancel)
- 🧹 Sistema de limpeza automática de dados antigos
- 🏥 Health check para monitoramento do sistema

### 🎮 API Principal

- `createDeck()` - Criar novos decks com cartas
- `playMatch()` - Iniciar partida assíncrona
- `playAndWait()` - Iniciar partida e aguardar resultado
- `playMatches()` - Múltiplas partidas em lote
- `getStats()` - Estatísticas completas do sistema
- `healthCheck()` - Verificação de saúde do sistema

### 🃏 Recursos das Cartas

- Cartas podem ser funções simples ou objetos complexos
- Metadados por carta (nome, descrição, custo, tipo)
- Estados de cartas (in_hand, playing, played, failed, discarded)
- Condições para execução condicional

### 📊 Métricas e Observabilidade

- Métricas em tempo real por deck e carta
- Duração média de execução
- Taxa de sucesso/falha
- Estatísticas detalhadas por arena
- Sistema de eventos para integração externa

---

### 🚀 Próximas Versões Planejadas

#### [2.1.0] - Planejado

- [ ] UI web para visualização de decks e partidas
- [ ] Integração com OpenTelemetry
- [ ] Templates de decks comuns
- [ ] Persistência opcional em banco de dados
- [ ] API REST para controle remoto

#### [2.2.0] - Planejado

- [ ] Plugin para VS Code
- [ ] Dashboard de métricas
- [ ] Sistema de triggers automáticos (cron, webhooks)
- [ ] Suporte a cartas paralelas
- [ ] Rate limiting avançado

#### [3.0.0] - Visão Futura

- [ ] Cluster mode para alta disponibilidade
- [ ] Interface gráfica de deck builder
- [ ] Sistema de permissões e usuários
- [ ] Integração com Kubernetes
- [ ] Machine learning para otimização automática

---

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
