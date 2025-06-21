console.log("🧪 Teste de Storage Simples - Serverless");

// Mock do localStorage para testar
const mockStorage = {};
const localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => {
    mockStorage[key] = value;
  },
  removeItem: (key) => {
    delete mockStorage[key];
  },
};

// Sistema de storage simples
class SimpleStore {
  constructor() {
    this.key = "pipesnow_data";
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Erro ao carregar:", e);
    }

    // Dados padrão
    return {
      sections: {
        blog: {
          items: [],
          addons: ["TextInput", "WYSIWYG", "Slug"],
          settings: { layout: "list" },
        },
        users: {
          items: [],
          addons: ["TextInput", "ImageUpload"],
          settings: { layout: "table" },
        },
      },
    };
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
      console.log("💾 Dados salvos");
      return true;
    } catch (e) {
      console.error("❌ Erro ao salvar:", e);
      return false;
    }
  }

  // ITENS
  getItems(sectionId) {
    return this.data.sections[sectionId]?.items || [];
  }

  addItem(sectionId, item) {
    if (!this.data.sections[sectionId]) {
      this.data.sections[sectionId] = { items: [], addons: [], settings: {} };
    }

    const newItem = {
      ...item,
      id: item.id || "item-" + Date.now(),
      createdAt: new Date().toISOString(),
    };

    this.data.sections[sectionId].items.push(newItem);
    this.save();
    return newItem;
  }

  updateItem(sectionId, itemData) {
    const items = this.getItems(sectionId);
    const index = items.findIndex((item) => item.id === itemData.id);

    if (index !== -1) {
      items[index] = { ...items[index], ...itemData };
      this.save();
      return items[index];
    }
    return null;
  }

  // ADDONS
  getAddons(sectionId) {
    return this.data.sections[sectionId]?.addons || [];
  }

  addAddon(sectionId, addonId) {
    if (!this.data.sections[sectionId]) {
      this.data.sections[sectionId] = { items: [], addons: [], settings: {} };
    }

    const addons = this.data.sections[sectionId].addons;
    if (!addons.includes(addonId)) {
      addons.push(addonId);
      this.save();
      return true;
    }
    return false;
  }

  removeAddon(sectionId, addonId) {
    const addons = this.getAddons(sectionId);
    const index = addons.indexOf(addonId);
    if (index !== -1) {
      addons.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // DEBUG
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  getStats() {
    const stats = { sections: 0, items: 0, addons: 0 };
    Object.values(this.data.sections).forEach((section) => {
      stats.sections++;
      stats.items += section.items?.length || 0;
      stats.addons += section.addons?.length || 0;
    });
    return stats;
  }
}

// TESTE
async function testarStorage() {
  console.log("\n🔧 Iniciando teste de storage...");

  const store = new SimpleStore();

  console.log("📊 Estado inicial:", store.getStats());

  // Teste 1: Adicionar item
  console.log("\n➕ Teste 1: Adicionando item ao blog...");
  const novoPost = store.addItem("blog", {
    title: "Post de Teste",
    content: "Conteúdo do post...",
    status: "draft",
  });
  console.log("✅ Post criado:", novoPost.id);

  // Teste 2: Listar itens
  console.log("\n📋 Teste 2: Listando itens...");
  const items = store.getItems("blog");
  console.log("📝 Itens no blog:", items.length);
  items.forEach((item) => console.log(`  - ${item.title} (${item.id})`));

  // Teste 3: Atualizar item
  console.log("\n✏️ Teste 3: Atualizando item...");
  const updated = store.updateItem("blog", {
    id: novoPost.id,
    title: "Post de Teste - ATUALIZADO",
    status: "published",
  });
  console.log("✅ Post atualizado:", updated.title);

  // Teste 4: Gerenciar addons
  console.log("\n🧩 Teste 4: Gerenciando addons...");
  console.log("Addons atuais blog:", store.getAddons("blog"));

  store.addAddon("blog", "ImageUpload");
  console.log("✅ Addon adicionado");
  console.log("Addons após adição:", store.getAddons("blog"));

  store.removeAddon("blog", "Slug");
  console.log("❌ Addon removido");
  console.log("Addons após remoção:", store.getAddons("blog"));

  // Teste 5: Persistência
  console.log("\n💾 Teste 5: Testando persistência...");
  const store2 = new SimpleStore(); // Nova instância
  const itemsRecuperados = store2.getItems("blog");
  console.log("📊 Itens recuperados:", itemsRecuperados.length);
  console.log("✅ Dados persistiram:", itemsRecuperados[0]?.title);

  // Estatísticas finais
  console.log("\n📊 ESTATÍSTICAS FINAIS:");
  const finalStats = store.getStats();
  console.log(`  Seções: ${finalStats.sections}`);
  console.log(`  Itens: ${finalStats.items}`);
  console.log(`  Addons: ${finalStats.addons}`);

  console.log("\n🎉 TESTE CONCLUÍDO - Storage funcionando!");
  console.log("\n📋 Estrutura atual:");
  console.log(store.exportData());
}

testarStorage().catch(console.error);
