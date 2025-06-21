let getSectionManager;

describe("SectionManager", () => {
  let sectionManager;

  beforeAll(async () => {
    // Importa módulo ESM dinamicamente para evitar erro de parsing
    ({ getSectionManager } = await import("../utils/SectionManager.js"));

    sectionManager = getSectionManager();
    sectionManager.setDevMode(true);
    sectionManager.setUserPlan("tier3");
    await sectionManager.initialize();
  });

  it("carrega seções acessíveis após inicialização", () => {
    const sections = sectionManager.getAccessibleSections();
    expect(sections.length).toBeGreaterThan(0);
    expect(sections.some((s) => s.sectionId === "overview")).toBe(true);
  });

  it("cria uma nova seção customizada e a torna acessível", () => {
    const baseCount = sectionManager.getAccessibleSections().length;
    const newSection = {
      sectionId: "test_section",
      title: "Seção de Teste",
      icon: "fas fa-star",
      contentTypeId: "post",
      planTierMin: 0,
      menuVisible: true,
    };

    const created = sectionManager.createSection(newSection);
    expect(created.sectionId).toBe("test_section");
    expect(created.custom).toBe(true);

    const current = sectionManager.getAccessibleSections();
    expect(current.length).toBe(baseCount + 1);
    expect(current.some((s) => s.sectionId === "test_section")).toBe(true);
  });
});
