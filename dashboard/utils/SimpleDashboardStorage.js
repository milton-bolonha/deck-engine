/**
 * 💾 SimpleDashboardStorage - Storage serverless para o dashboard
 * Sistema simples e funcional que realmente funciona
 */

class SimpleDashboardStorage {
  constructor() {
    this.storageKey = "pipesnow_dashboard";
    this.data = this.loadData();
    console.log("💾 SimpleDashboardStorage inicializado");
  }

  // ===== ESTRUTURA DE DADOS =====

  getDefaultData() {
    return {
      // Seções com dados
      sections: {
        blog: {
          name: "Blog",
          icon: "fas fa-newspaper",
          items: [
            {
              id: "blog-1",
              title: "Primeiro Post do Blog",
              content: "Este é o primeiro post do nosso blog...",
              status: "published",
              createdAt: "2025-06-20T10:00:00Z",
              updatedAt: "2025-06-20T10:00:00Z",
            },
          ],
          addons: ["TextInput", "WYSIWYG", "Slug", "ImageUpload"],
          contentType: {
            id: "post",
            name: "Post do Blog",
            fields: {
              title: { type: "text", required: true, label: "Título" },
              content: { type: "wysiwyg", required: true, label: "Conteúdo" },
              status: {
                type: "select",
                options: ["draft", "published"],
                default: "draft",
                label: "Status",
              },
            },
          },
        },

        users: {
          name: "Usuários",
          icon: "fas fa-users",
          items: [
            {
              id: "user-1",
              name: "Admin User",
              email: "admin@exemplo.com",
              role: "admin",
              createdAt: "2025-06-20T09:00:00Z",
              updatedAt: "2025-06-20T09:00:00Z",
            },
          ],
          addons: ["TextInput", "ImageUpload"],
          contentType: {
            id: "user",
            name: "Usuário",
            fields: {
              name: { type: "text", required: true, label: "Nome" },
              email: { type: "email", required: true, label: "E-mail" },
              role: {
                type: "select",
                options: ["admin", "editor", "user"],
                default: "user",
                label: "Função",
              },
            },
          },
        },

        overview: {
          name: "Overview",
          icon: "fas fa-tachometer-alt",
          items: [],
          addons: ["TextInput"],
          contentType: {
            id: "dashboard",
            name: "Dashboard",
            fields: {
              title: { type: "text", required: true, label: "Título" },
            },
          },
        },
      },

      // Addons disponíveis
      availableAddons: {
        TextInput: {
          id: "TextInput",
          name: "Campo de Texto",
          icon: "fas fa-edit",
          category: "Básico",
        },
        WYSIWYG: {
          id: "WYSIWYG",
          name: "Editor Rico",
          icon: "fas fa-align-left",
          category: "Texto",
        },
        Slug: {
          id: "Slug",
          name: "URL Amigável",
          icon: "fas fa-link",
          category: "SEO",
        },
        ImageUpload: {
          id: "ImageUpload",
          name: "Upload de Imagem",
          icon: "fas fa-image",
          category: "Mídia",
        },
        SEOFields: {
          id: "SEOFields",
          name: "Campos SEO",
          icon: "fas fa-search",
          category: "SEO",
        },
      },

      // Configurações
      settings: {
        theme: "light",
        devMode: true,
        currentPlan: "tier3",
      },

      lastUpdated: new Date().toISOString(),
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
        return { ...this.getDefaultData(), ...parsed };
      }
    } catch (error) {
      console.warn("⚠️ Erro ao carregar dados:", error);
    }

    return this.getDefaultData();
  }

  saveData() {
    try {
      if (typeof window === "undefined") return false;

      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      console.log("💾 Dashboard data saved");
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar dados:", error);
      return false;
    }
  }

  // ===== OPERAÇÕES DE SEÇÕES =====

  getSections() {
    return Object.keys(this.data.sections).map((id) => ({
      sectionId: id,
      ...this.data.sections[id],
    }));
  }

  getSection(sectionId) {
    const section = this.data.sections[sectionId];
    if (!section) return null;

    return {
      sectionId,
      title: section.name,
      icon: section.icon,
      contentType: section.contentType,
      availableAddons: section.addons || [],
      ...section,
    };
  }

  // ===== OPERAÇÕES DE ITENS =====

  getSectionItems(sectionId) {
    return this.data.sections[sectionId]?.items || [];
  }

  addItem(sectionId, itemData) {
    if (!this.data.sections[sectionId]) {
      console.error(`❌ Seção ${sectionId} não encontrada`);
      return null;
    }

    const newItem = {
      ...itemData,
      id: itemData.id || `${sectionId}-${Date.now()}`,
      createdAt: itemData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.sections[sectionId].items.push(newItem);
    this.saveData();

    console.log(`✅ Item adicionado a ${sectionId}:`, newItem.id);
    return newItem;
  }

  updateItem(sectionId, itemData) {
    const items = this.getSectionItems(sectionId);
    const index = items.findIndex((item) => item.id === itemData.id);

    if (index === -1) {
      console.warn(`⚠️ Item ${itemData.id} não encontrado`);
      return null;
    }

    items[index] = {
      ...items[index],
      ...itemData,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();
    console.log(`✏️ Item atualizado em ${sectionId}:`, items[index].id);
    return items[index];
  }

  deleteItem(sectionId, itemId) {
    const items = this.getSectionItems(sectionId);
    const filtered = items.filter((item) => item.id !== itemId);

    if (filtered.length !== items.length) {
      this.data.sections[sectionId].items = filtered;
      this.saveData();
      console.log(`🗑️ Item removido de ${sectionId}:`, itemId);
      return true;
    }

    return false;
  }

  // ===== OPERAÇÕES DE ADDONS =====

  getSectionAddons(sectionId) {
    return this.data.sections[sectionId]?.addons || [];
  }

  addAddonToSection(sectionId, addonId) {
    if (!this.data.sections[sectionId]) return false;

    const addons = this.data.sections[sectionId].addons;
    if (!addons.includes(addonId)) {
      addons.push(addonId);
      this.saveData();
      console.log(`🧩 Addon ${addonId} adicionado a ${sectionId}`);
      return true;
    }
    return false;
  }

  removeAddonFromSection(sectionId, addonId) {
    if (!this.data.sections[sectionId]) return false;

    const addons = this.data.sections[sectionId].addons;
    const index = addons.indexOf(addonId);

    if (index !== -1) {
      addons.splice(index, 1);
      this.saveData();
      console.log(`❌ Addon ${addonId} removido de ${sectionId}`);
      return true;
    }
    return false;
  }

  getAvailableAddons() {
    return this.data.availableAddons;
  }

  // ===== OPERAÇÕES DE DEBUG =====

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

  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  resetData() {
    this.data = this.getDefaultData();
    this.saveData();
    console.log("🔄 Dados resetados");
  }
}

// Singleton
let instance = null;

export function getSimpleDashboardStorage() {
  if (!instance) {
    instance = new SimpleDashboardStorage();
  }
  return instance;
}

export default SimpleDashboardStorage;
