/**
 * 💾 DataProvider - Sistema de Storage Interno
 * Sistema robusto que não depende de arquivos externos
 */

// Dados internos - sempre disponíveis
const INTERNAL_DATA = {
  addons: {
    TextInput: {
      id: "TextInput",
      name: "Campo de Texto",
      category: "Form",
      description: "Campo básico de entrada de texto",
      includedInPlans: ["tier0", "tier1", "tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    Slug: {
      id: "Slug",
      name: "URL Amigável",
      category: "Form",
      description: "Geração automática de URLs amigáveis",
      includedInPlans: ["tier0", "tier1", "tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    WYSIWYG: {
      id: "WYSIWYG",
      name: "Editor Rico",
      category: "Form",
      description: "Editor WYSIWYG completo",
      includedInPlans: ["tier1", "tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    ImageUpload: {
      id: "ImageUpload",
      name: "Upload de Imagem",
      category: "Mídia",
      description: "Sistema de upload e gerenciamento de imagens",
      includedInPlans: ["tier1", "tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    SEOFields: {
      id: "SEOFields",
      name: "Campos SEO",
      category: "Form",
      description: "Meta tags e otimização SEO",
      includedInPlans: ["tier1", "tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    CategorySystem: {
      id: "CategorySystem",
      name: "Sistema de Categorias",
      category: "Form",
      description: "Organização hierárquica por categorias",
      includedInPlans: ["tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    TagSystem: {
      id: "TagSystem",
      name: "Sistema de Tags",
      category: "Form",
      description: "Tags livres para classificação",
      includedInPlans: ["tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    SocialPostAddOn: {
      id: "SocialPostAddOn",
      name: "Postagem Social",
      category: "Integrações",
      description: "Publicação automática em redes sociais",
      includedInPlans: ["tier2", "tier3"],
      unlockType: "includedInPlan",
      price: 0,
      underConstruction: false,
    },
    ZapierConnector: {
      id: "ZapierConnector",
      name: "Integração Zapier",
      category: "Integrações",
      description: "Conecte com mais de 2000 apps via Zapier",
      includedInPlans: [],
      unlockType: "oneTimePurchase",
      price: 49.99,
      underConstruction: false,
    },
    KanbanBoard: {
      id: "KanbanBoard",
      name: "Quadro Kanban",
      category: "Layout",
      description: "Interface de gerenciamento estilo kanban",
      includedInPlans: [],
      unlockType: "oneTimePurchase",
      price: 29.99,
      underConstruction: false,
    },
    CanvasEditor: {
      id: "CanvasEditor",
      name: "Editor Canvas",
      category: "Visual",
      description: "Editor visual tipo canvas para layouts complexos",
      includedInPlans: [],
      unlockType: "oneTimePurchase",
      price: 79.99,
      underConstruction: true,
    },
    BetaWidget: {
      id: "BetaWidget",
      name: "Widget Beta",
      category: "Visual",
      description: "Widget experimental em desenvolvimento",
      includedInPlans: [],
      unlockType: "oneTimePurchase",
      price: 19.99,
      underConstruction: true,
    },
  },

  plans: {
    tier0: {
      id: "tier0",
      name: "Básico",
      displayName: "Plano Básico",
      tier: 0,
      price: 0,
      currency: "BRL",
      interval: "month",
      features: [
        "Acesso básico ao dashboard",
        "Até 3 seções",
        "Addons básicos inclusos",
        "Suporte por email",
      ],
      limits: {
        sections: 3,
        storage: "1GB",
        apiCalls: 1000,
        users: 1,
      },
    },
    tier1: {
      id: "tier1",
      name: "Pro",
      displayName: "Plano Profissional",
      tier: 1,
      price: 29.99,
      currency: "BRL",
      interval: "month",
      features: [
        "Todas as funcionalidades do Básico",
        "Até 10 seções",
        "Editor WYSIWYG",
        "Upload de imagens",
        "Campos SEO",
        "Suporte prioritário",
      ],
      limits: {
        sections: 10,
        storage: "10GB",
        apiCalls: 10000,
        users: 5,
      },
    },
    tier2: {
      id: "tier2",
      name: "Premium",
      displayName: "Plano Premium",
      tier: 2,
      price: 79.99,
      currency: "BRL",
      interval: "month",
      features: [
        "Todas as funcionalidades do Pro",
        "Seções ilimitadas",
        "Sistema de categorias e tags",
        "Postagem em redes sociais",
        "Analytics avançados",
        "Integrações avançadas",
      ],
      limits: {
        sections: -1,
        storage: "100GB",
        apiCalls: 100000,
        users: 25,
      },
    },
    tier3: {
      id: "tier3",
      name: "Enterprise",
      displayName: "Plano Enterprise",
      tier: 3,
      price: 199.99,
      currency: "BRL",
      interval: "month",
      features: [
        "Todas as funcionalidades do Premium",
        "Pipeline Designer visual",
        "Editor JSON avançado",
        "White-label completo",
        "Suporte 24/7",
        "SLA garantido",
      ],
      limits: {
        sections: -1,
        storage: "1TB",
        apiCalls: -1,
        users: -1,
      },
    },
  },

  contentTypes: {
    dashboard: {
      id: "dashboard",
      name: "Dashboard",
      icon: "fas fa-tachometer-alt",
      description: "Painéis de métricas e dados",
      layoutType: "dashboard",
      elementCount: "single",
      hierarchyAllowed: false,
      availableAddons: ["TextInput", "WYSIWYG", "SEOFields", "CategorySystem"],
      fields: {
        title: { type: "text", required: true },
        layout: { type: "json", required: false },
      },
      customElements: {
        welcomeText: { type: "wysiwyg", position: "top" },
        metrics: { type: "metrics", position: "center" },
        recentActivity: { type: "list", position: "bottom" },
      },
    },
    post: {
      id: "post",
      name: "Post do Blog",
      icon: "fas fa-newspaper",
      description: "Posts para blog",
      layoutType: "list",
      elementCount: "many",
      hierarchyAllowed: false,
      availableAddons: [
        "TextInput",
        "Slug",
        "SEOFields",
        "WYSIWYG",
        "ImageUpload",
        "TagSystem",
        "CategorySystem",
        "SocialPostAddOn",
      ],
      fields: {
        title: { type: "text", required: true },
        slug: { type: "slug", required: true },
        content: { type: "wysiwyg", required: true },
        status: {
          type: "select",
          options: ["draft", "published", "scheduled"],
          default: "draft",
        },
      },
    },
    kanban: {
      id: "kanban",
      name: "Kanban Board",
      icon: "fas fa-columns",
      description: "Gestão visual de projetos",
      layoutType: "kanban",
      elementCount: "many",
      hierarchyAllowed: false,
      availableAddons: [
        "TextInput",
        "WYSIWYG",
        "CategorySystem",
        "TagSystem",
        "ImageUpload",
      ],
      fields: {
        title: { type: "text", required: true },
        description: { type: "textarea", required: false },
        priority: {
          type: "select",
          options: ["low", "medium", "high", "urgent"],
          default: "medium",
        },
        status: {
          type: "select",
          options: ["todo", "in_progress", "review", "done"],
          default: "todo",
        },
        assignee: { type: "text", required: false },
        due_date: { type: "date", required: false },
      },
      columns: ["todo", "in_progress", "review", "done"],
    },
    pipeline: {
      id: "pipeline",
      name: "Pipeline Visual",
      icon: "fas fa-project-diagram",
      description: "Designer visual de pipelines",
      layoutType: "canvas",
      elementCount: "many",
      hierarchyAllowed: true,
      availableAddons: [
        "PipelineDesigner",
        "CodeEditor",
        "CanvasEditor",
        "TextInput",
        "WYSIWYG",
      ],
      fields: {
        name: { type: "text", required: true },
        description: { type: "textarea", required: false },
        trigger: {
          type: "select",
          options: ["manual", "webhook", "schedule", "event"],
          default: "manual",
        },
        status: {
          type: "select",
          options: ["draft", "active", "paused", "archived"],
          default: "draft",
        },
        nodes: { type: "json", required: false },
        connections: { type: "json", required: false },
      },
      customElements: {
        canvas: { type: "pipeline-canvas", position: "center" },
        properties: { type: "properties-panel", position: "right" },
        toolbar: { type: "pipeline-toolbar", position: "top" },
      },
    },
    page: {
      id: "page",
      name: "Página",
      icon: "fas fa-file-alt",
      description: "Páginas estáticas do site",
      layoutType: "single",
      elementCount: "single",
      hierarchyAllowed: true,
      availableAddons: [
        "TextInput",
        "Slug",
        "SEOFields",
        "WYSIWYG",
        "ImageUpload",
      ],
      fields: {
        title: { type: "text", required: true },
        slug: { type: "slug", required: true },
        content: { type: "wysiwyg", required: false },
        status: {
          type: "select",
          options: ["draft", "published", "scheduled"],
          default: "draft",
        },
      },
    },
    user_profile: {
      id: "user_profile",
      name: "Perfil de Usuário",
      icon: "fas fa-user",
      description: "Gestão de perfis de usuário",
      layoutType: "detail",
      elementCount: "single",
      hierarchyAllowed: false,
      availableAddons: [
        "TextInput",
        "ImageUpload",
        "CategorySystem",
        "TagSystem",
      ],
      fields: {
        name: { type: "text", required: true },
        email: { type: "email", required: true },
        role: {
          type: "select",
          options: ["admin", "editor", "user"],
          default: "user",
        },
      },
    },
    gallery: {
      id: "gallery",
      name: "Galeria",
      icon: "fas fa-images",
      description: "Galeria de imagens e mídia",
      layoutType: "grid",
      elementCount: "many",
      hierarchyAllowed: false,
      availableAddons: [
        "ImageUpload",
        "TextInput",
        "TagSystem",
        "CategorySystem",
      ],
      fields: {
        title: { type: "text", required: true },
        image: { type: "image", required: true },
        description: { type: "textarea", required: false },
        alt_text: { type: "text", required: false },
        category: { type: "text", required: false },
      },
    },
    feed: {
      id: "feed",
      name: "Feed Social",
      icon: "fas fa-stream",
      description: "Feed de atividades e posts",
      layoutType: "feed",
      elementCount: "many",
      hierarchyAllowed: false,
      availableAddons: [
        "TextInput",
        "WYSIWYG",
        "ImageUpload",
        "SocialPostAddOn",
        "TagSystem",
      ],
      fields: {
        content: { type: "textarea", required: true },
        image: { type: "image", required: false },
        author: { type: "text", required: true },
        timestamp: { type: "datetime", required: true },
        likes: { type: "number", default: 0 },
        comments: { type: "json", default: [] },
      },
    },
    users: {
      id: "users",
      name: "Usuários",
      icon: "fas fa-users",
      description: "Sistema de gestão de usuários",
      layoutType: "list",
      elementCount: "many",
      hierarchyAllowed: false,
      availableAddons: [
        "TextInput",
        "ImageUpload",
        "CategorySystem",
        "TagSystem",
        "SEOFields",
      ],
      fields: {
        name: { type: "text", required: true, label: "Nome" },
        email: { type: "email", required: true, label: "E-mail" },
        role: {
          type: "select",
          options: [
            { value: "admin", label: "Administrador" },
            { value: "editor", label: "Editor" },
            { value: "user", label: "Usuário" },
          ],
          default: "user",
          required: true,
          label: "Função",
        },
        status: {
          type: "select",
          options: [
            { value: "active", label: "Ativo" },
            { value: "inactive", label: "Inativo" },
            { value: "pending", label: "Pendente" },
          ],
          default: "pending",
          required: true,
          label: "Status",
        },
        created_at: { type: "date", required: false, label: "Data de Criação" },
        last_login: { type: "date", required: false, label: "Último Login" },
      },
    },
  },

  sections: {
    overview: {
      sectionId: "overview",
      title: "Overview",
      icon: "fas fa-tachometer-alt",
      contentTypeId: "dashboard",
      planTierMin: 0,
      order: 0,
      includedAddonsByTier: {
        0: ["TextInput"],
        1: ["TextInput", "WYSIWYG"],
        2: ["TextInput", "WYSIWYG", "SEOFields"],
        3: ["TextInput", "WYSIWYG", "SEOFields", "CategorySystem"],
      },
      oneTimePurchaseAddons: [],
      accessOverrides: {
        underConstructionFeatures: [],
      },
      menuVisible: true,
      coreSection: true,
    },
    pipelines: {
      sectionId: "pipelines",
      title: "Pipeline Builder",
      icon: "fas fa-project-diagram",
      contentTypeId: "dashboard",
      planTierMin: 0,
      order: 1,
      includedAddonsByTier: {
        0: ["TextInput"],
        1: ["TextInput", "WYSIWYG"],
        2: ["TextInput", "WYSIWYG", "SocialPostAddOn"],
        3: ["TextInput", "WYSIWYG", "SocialPostAddOn", "CategorySystem"],
      },
      oneTimePurchaseAddons: ["KanbanBoard"],
      accessOverrides: {
        underConstructionFeatures: ["CanvasEditor"],
      },
      menuVisible: true,
      coreSection: true,
    },
    users: {
      sectionId: "users",
      title: "Usuários",
      icon: "fas fa-users",
      contentTypeId: "users",
      planTierMin: 0,
      order: 2,
      includedAddonsByTier: {
        0: ["TextInput"],
        1: ["TextInput", "ImageUpload"],
        2: ["TextInput", "ImageUpload", "CategorySystem"],
        3: ["TextInput", "ImageUpload", "CategorySystem", "TagSystem"],
      },
      oneTimePurchaseAddons: [],
      accessOverrides: {
        underConstructionFeatures: [],
      },
      menuVisible: true,
      coreSection: false,
    },
    billing: {
      sectionId: "billing",
      title: "Faturamento",
      icon: "fas fa-credit-card",
      contentTypeId: "dashboard",
      planTierMin: 0,
      order: 3,
      includedAddonsByTier: {
        0: ["TextInput"],
        1: ["TextInput", "WYSIWYG"],
        2: ["TextInput", "WYSIWYG", "SEOFields"],
        3: ["TextInput", "WYSIWYG", "SEOFields", "CategorySystem"],
      },
      oneTimePurchaseAddons: [],
      accessOverrides: {
        underConstructionFeatures: [],
      },
      menuVisible: true,
      coreSection: false,
    },
  },
};

export class DataProvider {
  constructor() {
    this.customSections = new Map();
    this.customContentTypes = new Map();
    this.sectionData = new Map();

    // Carregar dados customizados do localStorage se existirem
    this.loadCustomData();

    console.log("💾 DataProvider initialized");
  }

  // ===== INTERNAL DATA ACCESS =====

  getAddons() {
    return INTERNAL_DATA.addons;
  }

  getPlans() {
    return INTERNAL_DATA.plans;
  }

  getContentTypes() {
    // Combinar internos + customizados
    const internal = INTERNAL_DATA.contentTypes;
    const custom = Object.fromEntries(this.customContentTypes);
    return { ...internal, ...custom };
  }

  getSections() {
    // Combinar internos + customizados
    const internal = INTERNAL_DATA.sections;
    const custom = Object.fromEntries(this.customSections);
    return { ...internal, ...custom };
  }

  // ===== CUSTOM DATA MANAGEMENT =====

  addCustomSection(section) {
    this.customSections.set(section.sectionId, section);
    this.saveCustomData();
    console.log(`💾 Custom section saved: ${section.sectionId}`);
  }

  addCustomContentType(contentType) {
    this.customContentTypes.set(contentType.id, contentType);
    this.saveCustomData();
    console.log(`💾 Custom content type saved: ${contentType.id}`);
  }

  // ===== SECTION DATA STORAGE =====

  setSectionData(sectionId, data) {
    this.sectionData.set(sectionId, data);
    this.saveSectionData();
    console.log(`💾 Section data saved: ${sectionId}`, data);
  }

  getSectionData(sectionId) {
    return this.sectionData.get(sectionId) || [];
  }

  // ===== PERSISTENT STORAGE =====

  saveCustomData() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "sectionmaster_custom_sections",
          JSON.stringify(Array.from(this.customSections.entries()))
        );
        localStorage.setItem(
          "sectionmaster_custom_content_types",
          JSON.stringify(Array.from(this.customContentTypes.entries()))
        );
      } catch (error) {
        console.warn("Failed to save custom data to localStorage:", error);
      }
    }
  }

  loadCustomData() {
    if (typeof window !== "undefined") {
      try {
        const sectionsData = localStorage.getItem(
          "sectionmaster_custom_sections"
        );
        if (sectionsData) {
          this.customSections = new Map(JSON.parse(sectionsData));
        }

        const contentTypesData = localStorage.getItem(
          "sectionmaster_custom_content_types"
        );
        if (contentTypesData) {
          this.customContentTypes = new Map(JSON.parse(contentTypesData));
        }

        const sectionData = localStorage.getItem("sectionmaster_section_data");
        if (sectionData) {
          this.sectionData = new Map(JSON.parse(sectionData));
        }
      } catch (error) {
        console.warn("Failed to load custom data from localStorage:", error);
      }
    }
  }

  saveSectionData() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "sectionmaster_section_data",
          JSON.stringify(Array.from(this.sectionData.entries()))
        );
      } catch (error) {
        console.warn("Failed to save section data to localStorage:", error);
      }
    }
  }

  // ===== DUMMY DATA =====

  getDummyData(sectionId) {
    const dummyData = {
      users: [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        {
          id: 2,
          name: "Editor User",
          email: "editor@example.com",
          role: "editor",
        },
        {
          id: 3,
          name: "User Regular",
          email: "user@example.com",
          role: "user",
        },
      ],
      blog: [
        {
          id: 1,
          title: "Post Exemplo 1",
          content: "Conteúdo...",
          status: "published",
        },
        {
          id: 2,
          title: "Post Exemplo 2",
          content: "Outro conteúdo...",
          status: "draft",
        },
      ],
      pages: [
        {
          id: 1,
          title: "Home",
          content: "Página inicial...",
          status: "published",
        },
        { id: 2, title: "About", content: "Sobre nós...", status: "published" },
      ],
      overview: [
        {
          id: 1,
          title: "Dashboard Principal",
          type: "metrics",
          data: { pipelines: 12, users: 45, revenue: 2340 },
        },
      ],
      pipelines: [
        { id: 1, name: "Welcome Pipeline", status: "active", executions: 234 },
        { id: 2, name: "Data Processing", status: "draft", executions: 0 },
      ],
      billing: [
        {
          id: 1,
          plan: "Pro",
          amount: 29.99,
          status: "paid",
          date: "2024-01-15",
        },
        {
          id: 2,
          plan: "Basic",
          amount: 0,
          status: "active",
          date: "2024-01-01",
        },
      ],
    };

    return dummyData[sectionId] || [];
  }

  // ===== RESET =====

  reset() {
    this.customSections.clear();
    this.customContentTypes.clear();
    this.sectionData.clear();

    if (typeof window !== "undefined") {
      localStorage.removeItem("sectionmaster_custom_sections");
      localStorage.removeItem("sectionmaster_custom_content_types");
      localStorage.removeItem("sectionmaster_section_data");
    }

    console.log("💾 DataProvider reset completed");
  }
}

// Singleton
let dataProviderInstance = null;

export function getDataProvider() {
  if (!dataProviderInstance) {
    dataProviderInstance = new DataProvider();
  }
  return dataProviderInstance;
}
