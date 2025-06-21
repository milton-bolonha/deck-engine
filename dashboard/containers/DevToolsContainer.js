"use client";

import { useDashboard } from "../contexts/DashboardContext";
import SectionMasterContainer from "./SectionMasterContainer";

export default function DevToolsContainer() {
  const { state } = useDashboard();

  // DevTools agora é apenas uma interface alternativa para SectionMaster
  // quando DevMode está ativo, com foco em debug e desenvolvimento
  return <SectionMasterContainer isDevMode={true} showDebugTools={true} />;
}
