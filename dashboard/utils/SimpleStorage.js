/**
 * 💾 SimpleStorage - Sistema de storage serverless
 * Armazenamento local simples e funcional
 */

class SimpleStorage {
  constructor() {
    this.storageKey = "pipesnow_dashboard_data";
    this.data = this.loadData();
    console.log("💾 SimpleStorage inicializado");
  }

  // ===== ESTRUTURA DE DADOS =====

  getDefaultData() {
    return {
      // Dados por seção
      sections: {
        blog: {
          items: [
            {
              id: "post-1",
              title: "Primeiro Post",
              content: "Conteúdo do primeiro post...",
              status: "published",
              createdAt: new Date().toISOString(),
            },
          ],
          addons: ["TextInput", "WYSIWYG", "Slug", "ImageUpload"],
          settings: {
            layout: "list",
            itemsPerPage: 10,
          },
        },
        users: {
          items: [
            {
              id: "user-1",
              name: "Usuário Admin",
              email: "admin@example.com",
              role: "admin",
              createdAt: new Date().toISOString(),
            },
          ],
          addons: ["TextInput", "ImageUpload"],
          settings: {
            layout: "table",
            sortBy: "name",
          },
        },
        overview: {
          items: [],
          addons: ["TextInput"],
          settings: {
            layout: "dashboard",
          },
        },
      },

      // Configurações globais
      settings: {
        theme: "light",
        devMode: true,
        userPlan: "tier3",
      },

      // Metadados
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
    };
  }

  // ===== OPERAÇÕES DE STORAGE =====

  loadData() {
    try {
      if (typeof window === "undefined") {
        return this.getDefaultData();
      }

      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("📊 Dados carregados do localStorage");
        return { ...this.getDefaultData(), ...parsed };
      }
    } catch (error) {
      console.warn("⚠️ Erro ao carregar dados:", error);
    }

    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  saveData(data = null) {
    try {
      if (typeof window === "undefined") return;

      const dataToSave = data || this.data;
      dataToSave.lastUpdated = new Date().toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      console.log("💾 Dados salvos no localStorage");

      if (data) this.data = dataToSave;
    } catch (error) {
      console.error("❌ Erro ao salvar dados:", error);
    }
  }

  // ===== OPERAÇÕES DE ITENS =====

  getSectionItems(sectionId) {
    const section = this.data.sections[sectionId];
    return section ? section.items || [] : [];
  }

  setSectionItems(sectionId, items) {
    if (!this.data.sections[sectionId]) {
      this.data.sections[sectionId] = { items: [], addons: [], settings: {} };
    }

    this.data.sections[sectionId].items = items;
    this.saveData();
    console.log(`📝 Items atualizados para ${sectionId}:`, items.length);
  }

  addItem(sectionId, item) {
    const items = this.getSectionItems(sectionId);
    const newItem = {
      ...item,
      id: item.id || "item-" + Date.now(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    this.setSectionItems(sectionId, items);
    console.log(`➕ Item adicionado a ${sectionId}:`, newItem.id);
    return newItem;
  }

  updateItem(sectionId, itemData) {
    const items = this.getSectionItems(sectionId);
    const index = items.findIndex((item) => item.id === itemData.id);

    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...itemData,
        updatedAt: new Date().toISOString(),
      };
      this.setSectionItems(sectionId, items);
      console.log(`✏️ Item atualizado em ${sectionId}:`, itemData.id);
      return items[index];
    }

    console.warn(`⚠️ Item não encontrado: ${itemData.id}`);
    return null;
  }

  deleteItem(sectionId, itemId) {
    const items = this.getSectionItems(sectionId);
    const filtered = items.filter((item) => item.id !== itemId);

    if (filtered.length !== items.length) {
      this.setSectionItems(sectionId, filtered);
      console.log(`🗑️ Item removido de ${sectionId}:`, itemId);
      return true;
    }

    return false;
  }

  // ===== OPERAÇÕES DE ADDONS =====

  getSectionAddons(sectionId) {
    const section = this.data.sections[sectionId];
    return section ? section.addons || [] : [];
  }

  setSectionAddons(sectionId, addons) {
    if (!this.data.sections[sectionId]) {
      this.data.sections[sectionId] = { items: [], addons: [], settings: {} };
    }

    this.data.sections[sectionId].addons = addons;
    this.saveData();
    console.log(`🧩 Addons atualizados para ${sectionId}:`, addons);
  }

  addAddon(sectionId, addonId) {
    const addons = this.getSectionAddons(sectionId);
    if (!addons.includes(addonId)) {
      addons.push(addonId);
      this.setSectionAddons(sectionId, addons);
      console.log(`✅ Addon ${addonId} adicionado a ${sectionId}`);
      return true;
    }
    return false;
  }

  removeAddon(sectionId, addonId) {
    const addons = this.getSectionAddons(sectionId);
    const filtered = addons.filter((id) => id !== addonId);

    if (filtered.length !== addons.length) {
      this.setSectionAddons(sectionId, filtered);
      console.log(`❌ Addon ${addonId} removido de ${sectionId}`);
      return true;
    }
    return false;
  }

  // ===== OPERAÇÕES DE CONFIGURAÇÕES =====

  getSectionSettings(sectionId) {
    const section = this.data.sections[sectionId];
    return section ? section.settings || {} : {};
  }

  setSectionSettings(sectionId, settings) {
    if (!this.data.sections[sectionId]) {
      this.data.sections[sectionId] = { items: [], addons: [], settings: {} };
    }

    this.data.sections[sectionId].settings = {
      ...this.data.sections[sectionId].settings,
      ...settings,
    };
    this.saveData();
    console.log(`⚙️ Configurações atualizadas para ${sectionId}`);
  }

  // ===== OPERAÇÕES GLOBAIS =====

  getAllSections() {
    return Object.keys(this.data.sections);
  }

  getSection(sectionId) {
    return this.data.sections[sectionId] || null;
  }

  createSection(sectionId, sectionData = {}) {
    this.data.sections[sectionId] = {
      items: [],
      addons: [],
      settings: {},
      ...sectionData,
      createdAt: new Date().toISOString(),
    };
    this.saveData();
    console.log(`🆕 Seção criada: ${sectionId}`);
  }

  deleteSection(sectionId) {
    if (this.data.sections[sectionId]) {
      delete this.data.sections[sectionId];
      this.saveData();
      console.log(`🗑️ Seção removida: ${sectionId}`);
      return true;
    }
    return false;
  }

  // ===== OPERAÇÕES DE DEBUG =====

  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.data = { ...this.getDefaultData(), ...imported };
      this.saveData();
      console.log("📥 Dados importados com sucesso");
      return true;
    } catch (error) {
      console.error("❌ Erro ao importar dados:", error);
      return false;
    }
  }

  resetData() {
    this.data = this.getDefaultData();
    this.saveData();
    console.log("🔄 Dados resetados para padrão");
  }

  getStats() {
    const stats = {
      totalSections: Object.keys(this.data.sections).length,
      totalItems: 0,
      totalAddons: 0,
      lastUpdated: this.data.lastUpdated,
    };

    Object.values(this.data.sections).forEach((section) => {
      stats.totalItems += (section.items || []).length;
      stats.totalAddons += (section.addons || []).length;
    });

    return stats;
  }
}

// Singleton
let instance = null;

export function getSimpleStorage() {
  if (!instance) {
    instance = new SimpleStorage();
  }
  return instance;
}

export default SimpleStorage;
