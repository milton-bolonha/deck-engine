/**
 * 🔍 VERIFICADOR DE IMPORTS - PREVENÇÃO DE CASCATA DE ERROS
 *
 * Script para verificar todos os imports e prevenir erros em cascata
 */

const fs = require("fs");
const path = require("path");

// Mapeamento das pastas onde cada tipo de arquivo deve estar
const IMPORT_MAPPING = {
  // Core components
  DashboardLayout: "components/core/DashboardLayout.js",
  LeftSidebar: "components/core/LeftSidebar.js",
  RightSidebar: "components/core/RightSidebar.js",
  MainContent: "components/core/MainContent.js",
  TopBar: "components/core/TopBar.js",
  DynamicSectionContainer: "components/core/DynamicSectionContainer.js",

  // Views
  ListView: "components/views/ListView.js",
  GridView: "components/views/GridView.js",
  DashboardView: "components/views/DashboardView.js",
  DetailView: "components/views/DetailView.js",
  KanbanView: "components/views/KanbanView.js",
  CanvasView: "components/views/CanvasView.js",
  FeedView: "components/views/FeedView.js",
  GalleryView: "components/views/GalleryView.js",

  // Forms
  UserForm: "components/forms/UserForm.js",
  BillingForm: "components/forms/BillingForm.js",
  AddonPurchase: "components/forms/AddonPurchase.js",
  ProviderConfig: "components/forms/ProviderConfig.js",

  // Builders
  SectionBuilder: "components/builders/SectionBuilder.js",
  ItemForm: "components/builders/ItemForm.js",
  ElementManager: "components/builders/ElementManager.js",

  // Managers
  AddonManager: "components/managers/AddonManager.js",

  // Sections
  SectionInfo: "components/sections/SectionInfo.js",
  SectionMasterOverview: "components/sections/SectionMasterOverview.js",
  SectionMasterDebug: "components/sections/SectionMasterDebug.js",

  // Pipeline
  PipelineForm: "components/pipeline/PipelineForm.js",
  PipelineDetails: "components/pipeline/PipelineDetails.js",
  VisualPipelineCanvas: "components/pipeline/VisualPipelineCanvas.js",
  CardPalette: "components/pipeline/CardPalette.js",
  CodePreview: "components/pipeline/CodePreview.js",
  PipelineToolbar: "components/pipeline/PipelineToolbar.js",

  // Debug
  MatchDebugger: "components/debug/MatchDebugger.js",

  // UI
  LoadingOverlay: "components/ui/LoadingOverlay.js",
  MetricsCard: "components/ui/MetricsCard.js",

  // Cards
  ChampionPipelinesCard: "components/cards/ChampionPipelinesCard.js",
  LiveMatchesCard: "components/cards/LiveMatchesCard.js",
  RecentActivityCard: "components/cards/RecentActivityCard.js",
  SystemHealthCard: "components/cards/SystemHealthCard.js",
};

// Componentes auxiliares que precisam existir
const AUXILIARY_COMPONENTS = {
  "components/views/components/ItemList.js": `export default function ItemList({ items = [], contentType, onEdit, onDelete, selectedItems = [], onSelectionChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{items.length} itens encontrados</p>
      {items.map((item, index) => (
        <div key={item.id || index} className="p-3 border rounded-lg flex justify-between items-center">
          <div>
            <h4 className="font-medium">{item.title || item.name || \`Item \${index + 1}\`}</h4>
            <p className="text-sm text-gray-500">{item.description || 'Sem descrição'}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit && onEdit(item)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Editar
            </button>
            <button 
              onClick={() => onDelete && onDelete(item)}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Deletar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}`,

  "components/views/components/ListHeader.js": `export default function ListHeader({ 
  title, 
  icon, 
  itemCount = 0, 
  totalCount = 0, 
  searchTerm = '', 
  onSearchChange, 
  onCreate 
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <i className={\`\${icon || 'fas fa-list'} text-2xl text-blue-600\`}></i>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">
            {itemCount === totalCount ? \`\${totalCount} itens\` : \`\${itemCount} de \${totalCount} itens\`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          <i className="fas fa-plus mr-2"></i>
          Criar
        </button>
      </div>
    </div>
  );
}`,

  "components/views/components/ListActions.js": `export default function ListActions({ 
  selectedCount = 0, 
  onBulkDelete, 
  onClearSelection 
}) {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <i className="fas fa-check-circle text-blue-600"></i>
        <span className="text-blue-800 font-medium">{selectedCount} itens selecionados</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onClearSelection}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
        >
          Limpar seleção
        </button>
        <button
          onClick={onBulkDelete}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Deletar selecionados
        </button>
      </div>
    </div>
  );
}`,
};

function verificarArquivo(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function criarArquivoFaltante(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
    console.log(`✅ Criado: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao criar ${filePath}:`, error.message);
    return false;
  }
}

function verificarImports() {
  console.log("🔍 VERIFICANDO IMPORTS E ARQUIVOS...\n");

  let arquivosEncontrados = 0;
  let arquivosFaltantes = 0;
  let arquivosCriados = 0;

  // Verificar arquivos principais
  console.log("📁 ARQUIVOS PRINCIPAIS:");
  for (const [nome, caminho] of Object.entries(IMPORT_MAPPING)) {
    const exists = verificarArquivo(caminho);
    if (exists) {
      console.log(`✅ ${nome} → ${caminho}`);
      arquivosEncontrados++;
    } else {
      console.log(`❌ ${nome} → ${caminho} (FALTANDO)`);
      arquivosFaltantes++;
    }
  }

  // Verificar e criar componentes auxiliares
  console.log("\n📁 COMPONENTES AUXILIARES:");
  for (const [caminho, conteudo] of Object.entries(AUXILIARY_COMPONENTS)) {
    const exists = verificarArquivo(caminho);
    if (exists) {
      console.log(`✅ ${caminho}`);
      arquivosEncontrados++;
    } else {
      console.log(`❌ ${caminho} (CRIANDO...)`);
      if (criarArquivoFaltante(caminho, conteudo)) {
        arquivosCriados++;
      }
    }
  }

  // Relatório final
  console.log("\n📊 RELATÓRIO:");
  console.log(`✅ Arquivos encontrados: ${arquivosEncontrados}`);
  console.log(`❌ Arquivos faltantes: ${arquivosFaltantes}`);
  console.log(`🔧 Arquivos criados: ${arquivosCriados}`);

  if (arquivosFaltantes === 0 && arquivosCriados >= 0) {
    console.log("\n🎉 TODOS OS IMPORTS ESTÃO CORRETOS!");
    return true;
  } else {
    console.log("\n⚠️  HÁ ARQUIVOS FALTANTES QUE PRECISAM SER CORRIGIDOS");
    return false;
  }
}

// Executar verificação
if (require.main === module) {
  verificarImports();
}

module.exports = { verificarImports };
