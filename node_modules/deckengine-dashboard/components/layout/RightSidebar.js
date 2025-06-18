"use client";

import { useDashboard } from "../../contexts/DashboardContext";
import SectionInfo from "../forms/SectionInfo";
import PipelineForm from "../forms/PipelineForm";
import PipelineDetails from "../forms/PipelineDetails";
import MatchDebugger from "../forms/MatchDebugger";
import UserForm from "../forms/UserForm";
import BillingForm from "../forms/BillingForm";
import AddonPurchase from "../forms/AddonPurchase";
import ProviderConfig from "../forms/ProviderConfig";

export default function RightSidebar() {
  const { state, actions } = useDashboard();

  const renderContent = () => {
    // If no specific content is set, show section info
    if (!state.rightSidebarContent) {
      return <SectionInfo section={state.selectedSection} />;
    }

    const { type, data } = state.rightSidebarContent;

    switch (type) {
      case "create-form":
        return renderCreateForm(data.section);

      case "pipeline-details":
        return <PipelineDetails pipeline={data} />;

      case "match-debugger":
        return <MatchDebugger match={data} />;

      case "addon-purchase":
        return <AddonPurchase addon={data.addonId} section={data.section} />;

      case "provider-config":
        return <ProviderConfig provider={data.provider} />;

      default:
        return <SectionInfo section={state.selectedSection} />;
    }
  };

  const renderCreateForm = (section) => {
    switch (section) {
      case "pipelines":
        return <PipelineForm />;

      case "users":
        return <UserForm />;

      case "billing":
        return <BillingForm />;

      default:
        return <SectionInfo section={section} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-deck-card">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-deck-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {state.rightSidebarContent
              ? getSidebarTitle(state.rightSidebarContent.type)
              : "Section Info"}
          </h3>

          {/* Close button for forms */}
          {state.rightSidebarContent && (
            <button
              onClick={() => actions.setRightSidebar(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {renderContent()}
      </div>

      {/* Quick Actions Footer */}
      {!state.rightSidebarContent && (
        <div className="p-4 border-t border-gray-200 dark:border-deck-border">
          <div className="space-y-2">
            <button
              onClick={() => actions.setIsCreating(true)}
              className="w-full btn-primary text-sm"
            >
              <i className="fas fa-plus mr-2"></i>
              Create New
            </button>

            {state.selectedSection === "pipelines" && (
              <button
                onClick={() =>
                  actions.setRightSidebar({
                    type: "pipeline-templates",
                    data: {},
                  })
                }
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                <i className="fas fa-file-code mr-2"></i>
                Browse Templates
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getSidebarTitle(type) {
  const titles = {
    "create-form": "Create New",
    "pipeline-details": "Pipeline Details",
    "match-debugger": "Match Debugger",
    "addon-purchase": "Addon Purchase",
    "provider-config": "Provider Config",
    "pipeline-templates": "Templates",
  };

  return titles[type] || "Details";
}
