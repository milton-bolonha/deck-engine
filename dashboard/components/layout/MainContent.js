"use client";

import { useDashboard } from "../../contexts/DashboardContext";

// Import unified section system
import DynamicSectionContainer from "./DynamicSectionContainer";
import DevToolsContainer from "../../containers/DevToolsContainer";
import SectionMasterContainer from "../../containers/SectionMasterContainer";

export default function MainContent() {
  const { state } = useDashboard();

  const renderSection = () => {
    const selectedSection = state.selectedSection || "overview"; // Fallback para overview
    console.log(`🎯 MainContent renderizando seção: "${selectedSection}"`);
    console.log(`🎯 Tipo: ${typeof selectedSection}`);
    console.log(
      `🎯 selectedSection === "sectionmaster": ${
        selectedSection === "sectionmaster"
      }`
    );
    console.log(`🎯 State completo:`, {
      selectedSection: state.selectedSection,
      devMode: state.devMode,
      sectionManagerInitialized: state.sectionManager?.initialized,
    });

    // Casos especiais primeiro
    if (selectedSection === "sectionmaster") {
      console.log(`🔧 ✅ Renderizando SectionMasterContainer`);
      return <SectionMasterContainer isDevMode={state.devMode} />;
    }

    if (selectedSection === "devtools") {
      console.log(`🛠️ ✅ Renderizando DevToolsContainer`);
      return <DevToolsContainer />;
    }

    // Para todas as outras seções, usar DynamicSectionContainer
    console.log(
      `📦 ✅ Renderizando DynamicSectionContainer para: ${selectedSection}`
    );
    return (
      <DynamicSectionContainer
        sectionId={selectedSection}
        isDevMode={state.devMode}
      />
    );
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900">{renderSection()}</div>
  );
}
