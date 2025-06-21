"use client";

import { useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";
import TopBar from "./TopBar";
import LoadingOverlay from "../ui/LoadingOverlay";

export default function DashboardLayout() {
  const { state, actions } = useDashboard();

  // Load initial data
  useEffect(() => {
    actions.loadPipelines();
    actions.loadSystemHealth();
    actions.loadPipelineMetrics();

    // Setup periodic refresh
    const interval = setInterval(() => {
      actions.loadSystemHealth();
      actions.loadPipelineMetrics();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-deck-bg">
      {/* Top Bar */}
      <TopBar />

      {/* Main Layout - 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 bg-white dark:bg-deck-card border-r border-gray-200 dark:border-deck-border flex-shrink-0">
          <LeftSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Central Content */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <MainContent />
          </div>

          {/* Right Sidebar - Context Forms/Configs */}
          <div className="w-80 bg-white dark:bg-deck-card border-l border-gray-200 dark:border-deck-border flex-shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!state.isConnected && (
        <LoadingOverlay message="Conectando ao DeckEngine..." />
      )}
    </div>
  );
}
