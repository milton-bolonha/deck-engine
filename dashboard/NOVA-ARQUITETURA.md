# 🏗️ NOVA ARQUITETURA - CLEAN ARCHITECTURE + DOMAIN-DRIVEN DESIGN

## 🎯 VISÃO GERAL

Dashboard reorganizado seguindo **Clean Architecture**, **Domain-Driven Design** e **boas práticas React**, com foco em escalabilidade, manutenibilidade e separação de responsabilidades.

## 📁 NOVA ESTRUTURA

```
dashboard/
├── 🎨 presentation/           # Presentation Layer
│   ├── components/            # Componentes organizados por função
│   │   ├── ui/               # Componentes básicos (Button, Input, Card)
│   │   ├── forms/            # Formulários completos
│   │   ├── tables/           # Tabelas e listas
│   │   ├── charts/           # Gráficos e visualizações
│   │   ├── layout/           # Componentes de layout
│   │   └── features/         # Componentes específicos por domínio
│   ├── pages/                # Page components
│   └── hooks/                # Custom hooks para UI
│
├── 🎮 application/            # Application Layer
│   ├── use-cases/            # Use cases (business actions)
│   ├── stores/               # Estado global (Zustand/Context)
│   ├── services/             # Application services
│   └── dto/                  # Data Transfer Objects
│
├── 🏗️ domain/                # Domain Layer
│   ├── entities/             # Domain entities
│   ├── repositories/         # Repository interfaces
│   ├── rules/                # Business rules
│   └── types/                # Domain types
│
├── 🔌 infrastructure/         # Infrastructure Layer
│   ├── api/                  # API clients
│   ├── storage/              # Local/Session storage
│   ├── adapters/             # External service adapters
│   └── config/               # Configuration
│
├── 🧪 shared/                # Shared utilities
│   ├── constants/            # App constants
│   ├── utils/                # Pure utility functions
│   ├── types/                # Shared TypeScript types
│   └── validators/           # Validation schemas
│
└── 📱 app/                   # Next.js app structure
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
```

## 🎯 PRINCÍPIOS ARQUITETURAIS

### 1. **SEPARAÇÃO DE RESPONSABILIDADES**

#### 🎨 **Presentation Layer** - O que o usuário vê

- **Responsabilidade**: Renderização, interação do usuário, estado visual
- **Não pode**: Acessar APIs diretamente, conter lógica de negócio
- **Pode**: Chamar hooks, gerenciar estado local de UI

#### 🎮 **Application Layer** - Orquestração

- **Responsabilidade**: Coordenar use cases, gerenciar estado global
- **Não pode**: Conhecer detalhes de UI ou infraestrutura
- **Pode**: Chamar use cases, coordenar fluxos complexos

#### 🏗️ **Domain Layer** - Coração da aplicação

- **Responsabilidade**: Regras de negócio, entidades, lógica core
- **Não pode**: Depender de outras camadas
- **Pode**: Definir contratos (interfaces) para infraestrutura

#### 🔌 **Infrastructure Layer** - Detalhes de implementação

- **Responsabilidade**: APIs, storage, serviços externos
- **Não pode**: Conter lógica de negócio
- **Pode**: Implementar interfaces definidas pelo domínio

### 2. **DOMAIN-DRIVEN DESIGN**

#### **Domínios Identificados (baseados no sistema real):**

```typescript
// Domínios principais do sistema
export const DOMAINS = {
  PIPELINE: "pipeline", // DeckEngine - Criação e execução de pipelines
  SECTION: "section", // SectionMaster - Gestão de seções dinâmicas
  CONTENT_TYPE: "contentType", // ContentTypeManager - Tipos de conteúdo
  ADDON: "addon", // AddonManager - Marketplace de addons
  USER: "user", // Gestão de usuários e permissões
  PLAN: "plan", // PlanManager - Planos e billing
  ANALYTICS: "analytics", // Métricas e relatórios
  SYSTEM: "system", // Saúde do sistema, configurações
} as const;
```

### 3. **COMPONENTIZAÇÃO PROFISSIONAL**

#### **Organização Clara e Direta:**

- **ui/**: Componentes básicos reutilizáveis (Button, Input, Card, Modal)
- **forms/**: Formulários completos (UserForm, SectionForm, PipelineForm)
- **tables/**: Tabelas e listas (DataTable, SectionList, PipelineList)
- **charts/**: Gráficos e visualizações (PerformanceChart, AnalyticsChart)
- **layout/**: Componentes de layout (Sidebar, Header, MainLayout)
- **features/**: Componentes específicos por domínio (PipelineCanvas, SectionBuilder)

#### **Padrão Container/Presenter:**

```typescript
// Container - Lógica e estado
function PipelineBuilderContainer() {
  const { pipelines, createPipeline } = usePipelineStore();
  // ... lógica

  return <PipelineBuilderView {...props} />;
}

// View - UI pura
function PipelineBuilderView({ pipelines, onCreatePipeline }) {
  // ... apenas renderização
}
```

## 🔧 IMPLEMENTAÇÃO PRÁTICA

### **1. Estado Global Modular (Zustand)**

```typescript
// application/stores/pipeline-store.ts
interface PipelineStore {
  pipelines: Pipeline[];
  selectedPipeline: Pipeline | null;
  isLoading: boolean;

  // Actions
  loadPipelines: () => Promise<void>;
  createPipeline: (data: CreatePipelineDTO) => Promise<Pipeline>;
  selectPipeline: (id: string) => void;
}

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  pipelines: [],
  selectedPipeline: null,
  isLoading: false,

  loadPipelines: async () => {
    set({ isLoading: true });
    const pipelines = await pipelineService.getAll();
    set({ pipelines, isLoading: false });
  },

  createPipeline: async (data) => {
    const pipeline = await createPipelineUseCase.execute(data);
    set((state) => ({ pipelines: [...state.pipelines, pipeline] }));
    return pipeline;
  },

  selectPipeline: (id) => {
    const pipeline = get().pipelines.find((p) => p.id === id);
    set({ selectedPipeline: pipeline });
  },
}));
```

### **2. Use Cases Claros**

```typescript
// application/use-cases/pipeline/create-pipeline.use-case.ts
export class CreatePipelineUseCase {
  constructor(
    private pipelineRepository: PipelineRepository,
    private validationService: ValidationService
  ) {}

  async execute(data: CreatePipelineDTO): Promise<Pipeline> {
    // 1. Validar entrada
    await this.validationService.validate(data, pipelineSchema);

    // 2. Aplicar regras de negócio
    const pipeline = Pipeline.create(data);

    // 3. Salvar
    return await this.pipelineRepository.save(pipeline);
  }
}
```

### **3. Componentes Puros**

```typescript
// presentation/components/composite/pipeline-card.tsx
interface PipelineCardProps {
  pipeline: Pipeline;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export function PipelineCard({
  pipeline,
  onSelect,
  onDelete,
  isSelected = false,
}: PipelineCardProps) {
  return (
    <Card className={cn("cursor-pointer", isSelected && "ring-2 ring-primary")}>
      <CardHeader>
        <CardTitle>{pipeline.name}</CardTitle>
        <CardDescription>{pipeline.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <MetricBadge
          label="Cards"
          value={pipeline.cardCount}
          variant="outline"
        />
      </CardContent>
      <CardActions>
        <Button variant="ghost" onClick={() => onSelect(pipeline.id)}>
          Editar
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete(pipeline.id)}
          className="text-destructive"
        >
          Deletar
        </Button>
      </CardActions>
    </Card>
  );
}
```

## 🎮 GAMING METAPHORS MANTIDAS

```typescript
// domain/entities/pipeline.ts
export class Pipeline {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly cards: Card[],
    public readonly config: PipelineConfig
  ) {}

  // Gaming methods
  startMatch(payload: MatchPayload): Match {
    return Match.create(this, payload);
  }

  get isChampion(): boolean {
    return this.metrics.successRate > 0.95;
  }

  get battleRating(): number {
    return Math.floor(this.metrics.averageExecutionTime / 100);
  }
}
```

## 📊 BENEFÍCIOS DA NOVA ARQUITETURA

### ✅ **Escalabilidade**

- Cada camada pode evoluir independentemente
- Fácil adição de novos domínios
- Componentes reutilizáveis e testáveis

### ✅ **Manutenibilidade**

- Responsabilidades claras
- Fácil localização de bugs
- Refatoração segura

### ✅ **Testabilidade**

- Use cases isolados
- Componentes puros
- Mocks simples para infraestrutura

### ✅ **Developer Experience**

- Estrutura previsível
- Nomenclatura consistente
- TypeScript para type safety

### ✅ **Performance**

- State granular
- Componentes otimizados
- Lazy loading por domínio

## 🚀 MIGRAÇÃO GRADUAL

### **Fase 1: Foundation (Semana 1)**

- [ ] Criar nova estrutura de pastas
- [ ] Migrar componentes core
- [ ] Setup do estado com Zustand
- [ ] Definir tipos TypeScript

### **Fase 2: Core Domains (Semana 2)**

- [ ] Domínio Pipeline
- [ ] Domínio User
- [ ] Use cases principais
- [ ] API adapters

### **Fase 3: Advanced Features (Semana 3)**

- [ ] Domínio Analytics
- [ ] Domínio Billing
- [ ] SectionMaster refatorado
- [ ] Testes unitários

### **Fase 4: Polish & Optimization (Semana 4)**

- [ ] Performance optimization
- [ ] Error boundaries
- [ ] Accessibility
- [ ] Documentation

## 🎯 RESULTADO ESPERADO

**Dashboard escalável, manutenível e performático, seguindo as melhores práticas da indústria, com separação clara de responsabilidades e pronto para crescimento empresarial.**

---

**🎮 Clean Architecture meets Gaming Metaphors!**
_"Arquitetura limpa é o deck perfeito - cada carta no lugar certo"_ ✨
