# 🚀 PLANO DE MIGRAÇÃO - PRESERVANDO TODAS AS FUNCIONALIDADES

## 🎯 **OBJETIVO**

Migrar gradualmente para Clean Architecture **sem perder nenhuma funcionalidade** do sistema atual.

## 📊 **FUNCIONALIDADES MAPEADAS - 100% PRESERVADAS**

### **🏗️ Core Functionality**

✅ **SectionMaster**: "Nave mãe" para criar/editar seções  
✅ **DynamicSectionContainer**: Renderiza seções com layouts dinâmicos  
✅ **8 Layouts diferentes**: List, Grid, Dashboard, Kanban, Canvas, Feed, Gallery, Detail  
✅ **ContentTypeManager**: Define estrutura dos itens (fields) e layouts  
✅ **AddonManager**: Sistema de addons por tier de usuário  
✅ **Right Sidebar contextual**: Muda baseado na ação (item-form, section-config, etc.)  
✅ **CRUD completo**: Criar, editar, deletar itens das seções  
✅ **Gaming metaphors**: Pipeline = Deck, Execution = Match mantidas

### **🔄 Fluxo do Usuário Atual**

1. **Left Sidebar** → Navegar seções + SectionMaster
2. **SectionMaster** → Criar seções definindo ContentType, addons, configs
3. **Entrar na seção** → Main content mostra layout escolhido (list, grid, etc.)
4. **Right Sidebar** → Popula com configs da seção
5. **Editar item** → Right Sidebar muda para ItemForm
6. **Gerenciar addons** → Right Sidebar muda para AddonManager

## 🎯 **ESTRATÉGIA DE MIGRAÇÃO**

### **🚨 FASE 0: CORREÇÃO IMEDIATA (AGORA)**

**Problema**: Imports quebrados impedem funcionamento
**Solução**: Corrigir imports manualmente

```bash
# Imports quebrados encontrados:
components/layout/DashboardLayout  → components/core/DashboardLayout
components/layout/DynamicSectionContainer  → components/core/DynamicSectionContainer
```

### **📈 FASE 1: MIGRAÇÃO GRADUAL (Semanas 1-2)**

**Estratégia**: Dual architecture - novo e antigo coexistindo

#### **1.1 Criar Adapters para Sistema Atual**

```typescript
// infrastructure/adapters/LegacySectionManagerAdapter.ts
export class LegacySectionManagerAdapter implements SectionRepository {
  constructor(private legacySectionManager) {}

  async findAll(): Promise<Section[]> {
    const legacySections = this.legacySectionManager.getAccessibleSections();
    return legacySections.map((legacy) => this.mapToEntity(legacy));
  }

  private mapToEntity(legacySection): Section {
    return Section.create({
      sectionId: legacySection.sectionId,
      title: legacySection.title,
      // ... mapear todos os campos
    });
  }
}
```

#### **1.2 Implementar Stores com Zustand**

```typescript
// application/stores/section-store.ts
interface SectionStore {
  sections: Section[];
  selectedSection: Section | null;
  isLoading: boolean;

  loadSections: () => Promise<void>;
  createSection: (data: CreateSectionDTO) => Promise<Section>;
  selectSection: (id: string) => void;
}
```

#### **1.3 Migrar Componentes UI Primeiro**

- Mover `components/ui/` para `presentation/components/ui/`
- Mover `components/forms/` para `presentation/components/forms/`
- Manter funcionamento 100% igual

### **📈 FASE 2: USE CASES E DOMAIN (Semanas 2-3)**

#### **2.1 Implementar Use Cases**

```typescript
// application/use-cases/section/CreateSectionUseCase.ts
export class CreateSectionUseCase {
  async execute(data: CreateSectionDTO): Promise<Section> {
    // 1. Validar dados
    // 2. Criar entidade Section
    // 3. Salvar via repository
    // 4. Retornar seção criada
  }
}
```

#### **2.2 Migrar Lógica de Negócio**

- SectionManager → SectionService + SectionRepository
- ContentTypeManager → ContentTypeService + ContentTypeRepository
- AddonManager → AddonService + AddonRepository

### **📈 FASE 3: VIEWS E INTEGRAÇÃO (Semanas 3-4)**

#### **3.1 Migrar Layouts para Presentation**

```typescript
// presentation/components/features/section-views/ListView.tsx
interface ListViewProps {
  section: Section;
  items: SectionItem[];
  onCreateItem: (data: CreateItemDTO) => void;
  onEditItem: (id: string, data: UpdateItemDTO) => void;
  onDeleteItem: (id: string) => void;
}
```

#### **3.2 Conectar com Use Cases**

```typescript
// presentation/hooks/useSectionOperations.ts
export function useSectionOperations(sectionId: string) {
  const createSection = useCreateSectionUseCase();
  const updateSection = useUpdateSectionUseCase();

  return {
    handleCreateItem: (data) => createSection.execute(data),
    handleUpdateItem: (id, data) => updateSection.execute(id, data),
  };
}
```

## 🔧 **MAPEAMENTO ARQUITETURAL**

### **Sistema Atual → Nova Arquitetura**

| Atual                          | Nova Arquitetura                                                                | Responsabilidade    |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------- |
| `contexts/DashboardContext.js` | `application/stores/`                                                           | Estado global       |
| `utils/SectionManager.js`      | `domain/entities/Section.ts` + `application/services/SectionService.ts`         | Lógica de seções    |
| `utils/ContentTypeManager.js`  | `domain/entities/ContentType.ts` + `application/services/ContentTypeService.ts` | Tipos de conteúdo   |
| `components/core/`             | `presentation/components/layout/`                                               | Layout components   |
| `components/views/`            | `presentation/components/features/`                                             | Views específicas   |
| `containers/`                  | `presentation/hooks/` + `application/use-cases/`                                | Lógica de container |

### **Fluxo de Dados**

#### **Atual:**

```
Component → DashboardContext → SectionManager → DataProvider
```

#### **Nova Arquitetura:**

```
Component → Hook → UseCase → Service → Repository → Infrastructure
```

## 🎮 **GAMING METAPHORS PRESERVADAS**

### **Pipeline System (DeckEngine)**

```typescript
// domain/entities/Pipeline.ts - JÁ IMPLEMENTADO
class Pipeline {
  get isChampion(): boolean; // Mantido
  get battleRating(): number; // Mantido

  startMatch(payload): Match; // Gaming terminology
}

// Terminologia preservada:
// - Pipeline = Deck
// - Execution = Match
// - Step = Card
// - Success = Victory
// - Error = Defeat
```

## 📋 **CHECKLIST DE MIGRAÇÃO**

### **✅ Concluído**

- [x] Análise completa do sistema atual
- [x] Mapeamento de todas as funcionalidades
- [x] Nova estrutura de pastas criada
- [x] Domínios identificados corretamente
- [x] Entidade Pipeline implementada
- [x] Constantes e tipos base

### **🔄 Em Andamento**

- [ ] Correção de imports quebrados
- [ ] Entidade Section implementada
- [ ] Repository interfaces

### **📅 Próximos Passos**

- [ ] Adapters para sistema legado
- [ ] Stores com Zustand
- [ ] Use cases principais
- [ ] Migração de componentes
- [ ] Testes de integração

## 🎯 **GARANTIAS**

### **✅ Zero Downtime**

- Sistema atual continua funcionando durante toda migração
- Migração gradual por componente
- Rollback possível a qualquer momento

### **✅ Zero Perda de Funcionalidade**

- Todas as 8 views de layout mantidas
- Right Sidebar contextual preservado
- Sistema de addons mantido
- CRUD completo preservado
- Gaming metaphors mantidas

### **✅ Melhoria de Qualidade**

- Código mais testável
- Responsabilidades claras
- Escalabilidade melhorada
- TypeScript para type safety

---

**🚀 Próxima ação: Corrigir imports quebrados para sistema funcionar imediatamente!**
