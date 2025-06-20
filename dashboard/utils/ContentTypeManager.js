/**
 * 📝 ContentTypeManager - Gerenciamento de ContentTypes
 * Sistema modular para criar e gerenciar tipos de conteúdo
 */

import { getDataProvider } from "./DataProvider";

export class ContentTypeManager {
  constructor() {
    this.dataProvider = getDataProvider();
    this.contentTypes = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Usar dados internos do DataProvider
      this.contentTypes = this.dataProvider.getContentTypes();
      this.initialized = true;
      console.log(
        "📝 ContentTypeManager initialized with",
        Object.keys(this.contentTypes).length,
        "content types"
      );
    } catch (error) {
      console.error("❌ Failed to load content types:", error);
      // Fallback para dados vazios
      this.contentTypes = {};
      this.initialized = true;
    }
  }

  // ===== CONTENT TYPE ACCESS =====

  getContentType(contentTypeId) {
    return this.contentTypes?.[contentTypeId] || null;
  }

  getAllContentTypes() {
    return this.contentTypes || {};
  }

  getContentTypesByCategory() {
    const categories = {};

    Object.values(this.contentTypes || {}).forEach((contentType) => {
      const category = this.getCategoryFromLayout(contentType.layoutType);
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(contentType);
    });

    return categories;
  }

  getCategoryFromLayout(layoutType) {
    const layoutCategories = {
      list: "Lists & Tables",
      grid: "Galleries & Grids",
      dashboard: "Dashboards",
      single: "Single Pages",
      detail: "Detail Views",
      faq: "Q&A Systems",
      feed: "Social Feeds",
      kanban: "Project Management",
    };

    return layoutCategories[layoutType] || "Other";
  }

  // ===== CONTENT TYPE CREATION =====

  createContentType(contentTypeData) {
    const id = contentTypeData.id;

    // Validar dados obrigatórios
    const required = ["id", "name", "layoutType", "elementCount"];
    for (const field of required) {
      if (!contentTypeData[field]) {
        throw new Error(`Campo obrigatório '${field}' não fornecido`);
      }
    }

    // Validar se já existe
    if (this.contentTypes[id]) {
      throw new Error(`ContentType '${id}' já existe`);
    }

    const contentType = {
      ...contentTypeData,
      createdAt: new Date().toISOString(),
      custom: true,
      fields: contentTypeData.fields || {},
      availableAddons: contentTypeData.availableAddons || [],
    };

    this.contentTypes[id] = contentType;

    // Salvar no DataProvider
    this.dataProvider.addCustomContentType(contentType);

    console.log(`📝 ContentType criado: ${id}`);

    return contentType;
  }

  updateContentType(contentTypeId, updates) {
    if (!this.contentTypes[contentTypeId]) {
      throw new Error(`ContentType '${contentTypeId}' não encontrado`);
    }

    this.contentTypes[contentTypeId] = {
      ...this.contentTypes[contentTypeId],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.contentTypes[contentTypeId];
  }

  deleteContentType(contentTypeId) {
    const contentType = this.contentTypes[contentTypeId];
    if (!contentType) {
      throw new Error(`ContentType '${contentTypeId}' não encontrado`);
    }

    // Não permitir deletar content types padrão
    if (!contentType.custom) {
      throw new Error("Não é possível deletar ContentTypes padrão do sistema");
    }

    delete this.contentTypes[contentTypeId];
    console.log(`📝 ContentType deletado: ${contentTypeId}`);

    return true;
  }

  // ===== FIELD MANAGEMENT =====

  addField(contentTypeId, fieldName, fieldConfig) {
    const contentType = this.contentTypes[contentTypeId];
    if (!contentType) {
      throw new Error(`ContentType '${contentTypeId}' não encontrado`);
    }

    contentType.fields[fieldName] = {
      ...fieldConfig,
      addedAt: new Date().toISOString(),
    };

    return contentType;
  }

  removeField(contentTypeId, fieldName) {
    const contentType = this.contentTypes[contentTypeId];
    if (!contentType) {
      throw new Error(`ContentType '${contentTypeId}' não encontrado`);
    }

    delete contentType.fields[fieldName];
    return contentType;
  }

  getFieldTypes() {
    return [
      "text",
      "textarea",
      "wysiwyg",
      "email",
      "number",
      "select",
      "image",
      "gallery",
      "user",
      "taxonomy",
      "json",
      "slug",
      "repeater",
      "media",
    ];
  }

  // ===== VALIDATION =====

  validateContentTypeData(data) {
    const errors = [];

    // Validar campos obrigatórios
    if (!data.id) errors.push("ID é obrigatório");
    if (!data.name) errors.push("Nome é obrigatório");
    if (!data.layoutType) errors.push("Layout Type é obrigatório");
    if (!data.elementCount) errors.push("Element Count é obrigatório");

    // Validar ID format
    if (data.id && !/^[a-z_]+$/.test(data.id)) {
      errors.push("ID deve conter apenas letras minúsculas e underscore");
    }

    // Validar layoutType
    const validLayouts = [
      "list",
      "grid",
      "dashboard",
      "single",
      "detail",
      "faq",
      "feed",
      "kanban",
    ];
    if (data.layoutType && !validLayouts.includes(data.layoutType)) {
      errors.push("Layout Type inválido");
    }

    // Validar elementCount
    const validCounts = ["single", "few", "many"];
    if (data.elementCount && !validCounts.includes(data.elementCount)) {
      errors.push("Element Count inválido");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ===== TEMPLATES =====

  getContentTypeTemplates() {
    return {
      blog_post: {
        id: "blog_post",
        name: "Post do Blog",
        icon: "fas fa-newspaper",
        description: "Posts para blog com categorias e tags",
        layoutType: "list",
        elementCount: "many",
        hierarchyAllowed: false,
        fields: {
          title: { type: "text", required: true },
          slug: { type: "slug", required: true },
          content: { type: "wysiwyg", required: true },
          excerpt: { type: "textarea", required: false },
          featured_image: { type: "image", required: false },
          status: {
            type: "select",
            options: ["draft", "published"],
            default: "draft",
          },
        },
        availableAddons: [
          "TextInput",
          "Slug",
          "WYSIWYG",
          "ImageUpload",
          "CategorySystem",
          "TagSystem",
        ],
      },
      product_catalog: {
        id: "product_catalog",
        name: "Catálogo de Produtos",
        icon: "fas fa-box",
        description: "Produtos com preços e estoque",
        layoutType: "grid",
        elementCount: "many",
        hierarchyAllowed: true,
        fields: {
          name: { type: "text", required: true },
          price: { type: "number", required: true },
          description: { type: "wysiwyg", required: false },
          images: { type: "gallery", required: false },
          stock: { type: "number", default: 0 },
        },
        availableAddons: [
          "TextInput",
          "WYSIWYG",
          "ImageUpload",
          "CategorySystem",
        ],
      },
      team_member: {
        id: "team_member",
        name: "Membro da Equipe",
        icon: "fas fa-user-tie",
        description: "Perfis de membros da equipe",
        layoutType: "grid",
        elementCount: "few",
        hierarchyAllowed: false,
        fields: {
          name: { type: "text", required: true },
          position: { type: "text", required: true },
          bio: { type: "textarea", required: false },
          photo: { type: "image", required: false },
          email: { type: "email", required: false },
        },
        availableAddons: ["TextInput", "ImageUpload"],
      },
    };
  }

  createFromTemplate(templateId, customizations = {}) {
    const templates = this.getContentTypeTemplates();
    const template = templates[templateId];

    if (!template) {
      throw new Error(`Template '${templateId}' não encontrado`);
    }

    const contentTypeData = {
      ...template,
      ...customizations,
      id: customizations.id || template.id,
      name: customizations.name || template.name,
    };

    return this.createContentType(contentTypeData);
  }
}

// Singleton
let contentTypeManagerInstance = null;

export function getContentTypeManager() {
  if (!contentTypeManagerInstance) {
    contentTypeManagerInstance = new ContentTypeManager();
  }
  return contentTypeManagerInstance;
}
