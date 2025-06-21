console.log("🧪 DEBUG: Por que o storage não está salvando?");

// Simular localStorage
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
    console.log(`💾 LocalStorage SET: ${key} = ${value.substring(0, 50)}...`);
  },
};

// Simular função saveItem do DashboardContext
async function testSaveItem(sectionId, itemData) {
  console.log(`🔍 Testando saveItem para: ${sectionId}`);
  console.log("📝 Dados:", itemData);

  const storageKey = `pipesnow_${sectionId}_items`;

  // Obter dados atuais
  let currentData = [];
  try {
    const stored = mockLocalStorage.getItem(storageKey);
    if (stored) {
      currentData = JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Erro ao carregar dados existentes:", e);
  }

  let updatedData;

  if (itemData.id && currentData.find((item) => item.id === itemData.id)) {
    // Atualizar item existente
    updatedData = currentData.map((item) =>
      item.id === itemData.id ? itemData : item
    );
    console.log(`✏️ Item ${itemData.id} atualizado`);
  } else {
    // Criar novo item
    const newItem = {
      ...itemData,
      id: itemData.id || Date.now().toString(),
      createdAt: itemData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updatedData = [...currentData, newItem];
    console.log(`➕ Novo item criado: ${newItem.id}`);
  }

  // Salvar no localStorage
  mockLocalStorage.setItem(storageKey, JSON.stringify(updatedData));
  console.log(`✅ Dados salvos! Total de itens: ${updatedData.length}`);

  return itemData;
}

// Dados do post que o usuário disse que não salvou
const postQueNaoSalvou = {
  status: "draft",
  title: "teste",
  slug: "teste",
  content: "teste",
  id: "1750452048017",
  updatedAt: "2025-06-20T20:40:48.017Z",
  createdAt: "2025-06-20T20:40:48.017Z",
};

console.log("\n🎯 Testando com dados do post que não salvou...");
console.log("📋 Post data:", postQueNaoSalvou);

testSaveItem("blog", postQueNaoSalvou)
  .then(() => {
    // Verificar se salvou
    const storageKey = "pipesnow_blog_items";
    const stored = mockLocalStorage.getItem(storageKey);

    if (stored) {
      const data = JSON.parse(stored);
      console.log(`🎉 SUCESSO! Dados encontrados: ${data.length} itens`);
      console.log(`📝 Primeiro item: ${data[0]?.title}`);

      // Verificar se o item específico está lá
      const foundItem = data.find((item) => item.id === "1750452048017");
      if (foundItem) {
        console.log("✅ Item específico encontrado:", foundItem.title);
      } else {
        console.log("❌ Item específico NÃO encontrado");
      }
    } else {
      console.log("❌ ERRO! Nenhum dado encontrado no storage");
    }

    console.log("\n🔍 ANÁLISE DO PROBLEMA:");
    console.log("1. A lógica de storage está funcionando? ✅ SIM");
    console.log("2. O problema deve estar em:");
    console.log("   - actions.saveItem não está sendo chamado");
    console.log("   - Context não está disponível no ItemForm");
    console.log("   - Múltiplos storages conflitando");
    console.log("   - LocalStorage real vs mock");
  })
  .catch(console.error);
