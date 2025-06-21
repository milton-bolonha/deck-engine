"use client";

import { useDashboard } from "../../contexts/DashboardContext";

export default function LeftSidebar() {
  const { state, actions } = useDashboard();

  // Obter seções dinâmicas do SectionManager
  const getMenuItems = () => {
    if (state.sectionManager?.initialized) {
      const accessibleSections = state.sectionManager.getAccessibleSections();
      const sections = accessibleSections.map((section) => ({
        id: section.sectionId,
        label: section.title,
        icon: section.icon,
        custom: !section.coreSection,
      }));

      // Adicionar seções core obrigatórias
      const coreItems = [
        {
          id: "overview",
          label: "Overview",
          icon: "fas fa-tachometer-alt",
          custom: false,
        },
        { id: "users", label: "Usuários", icon: "fas fa-users", custom: false },
        { id: "blog", label: "Blog", icon: "fas fa-newspaper", custom: false },
      ];

      // Verificar se já existem nas seções dinâmicas para evitar duplicação
      const existingIds = sections.map((s) => s.id);
      const filteredCoreItems = coreItems.filter(
        (item) => !existingIds.includes(item.id)
      );

      return [...filteredCoreItems, ...sections];
    }

    // Fallback para seções estáticas simplificadas
    return [
      {
        id: "overview",
        label: "Overview",
        icon: "fas fa-tachometer-alt",
        custom: false,
      },
      { id: "users", label: "Usuários", icon: "fas fa-users", custom: false },
      { id: "blog", label: "Blog", icon: "fas fa-newspaper", custom: false },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-deck-border">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Navigation
        </h2>
      </div>

      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => actions.setSelectedSection(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  state.selectedSection === item.id
                    ? "bg-primary-100 text-primary-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <i className={`${item.icon} w-5 h-5 mr-3`}></i>
                <span>{item.label}</span>
                {item.custom && (
                  <span className="ml-auto">
                    <i
                      className="fas fa-star text-xs text-yellow-500"
                      title="Seção customizada"
                    ></i>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* SectionMaster - Seção de administração unificada */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-deck-border">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-3">
            {state.devMode ? "DevTools" : "Admin"}
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => actions.setSelectedSection("sectionmaster")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  state.selectedSection === "sectionmaster"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <i
                  className={`${
                    state.devMode ? "fas fa-code" : "fas fa-layer-group"
                  } w-5 h-5 mr-3`}
                ></i>
                <span>{state.devMode ? "Debug Tools" : "SectionMaster"}</span>
                <span className="ml-auto">
                  <i
                    className={`fas ${
                      state.devMode ? "fa-wrench" : "fa-crown"
                    } text-xs ${
                      state.devMode ? "text-orange-500" : "text-blue-500"
                    }`}
                  ></i>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
