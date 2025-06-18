"use client";

import { useDashboard } from "../../contexts/DashboardContext";

// Import section containers
import OverviewContainer from "../../containers/OverviewContainer";
import PipelineBuilderContainer from "../../containers/PipelineBuilderContainer";
import LiveExecutionContainer from "../../containers/LiveExecutionContainer";
import PipelineLibraryContainer from "../../containers/PipelineLibraryContainer";
import UserManagementContainer from "../../containers/UserManagementContainer";
import BillingContainer from "../../containers/BillingContainer";
import AnalyticsContainer from "../../containers/AnalyticsContainer";
import AnalyticsProContainer from "../../containers/AnalyticsProContainer";
import AutomationContainer from "../../containers/AutomationContainer";
import AddonsContainer from "../../containers/AddonsContainer";
import ProvidersContainer from "../../containers/ProvidersContainer";
import MetaAdminContainer from "../../containers/MetaAdminContainer";
import DevToolsContainer from "../../containers/DevToolsContainer";

export default function MainContent() {
  const { state } = useDashboard();

  const renderSection = () => {
    switch (state.selectedSection) {
      case "overview":
        return <OverviewContainer />;

      case "pipelines":
        return <PipelineBuilderContainer />;

      case "execution":
        return <LiveExecutionContainer />;

      case "library":
        return <PipelineLibraryContainer />;

      case "users":
        return <UserManagementContainer />;

      case "billing":
        return <BillingContainer />;

      case "analytics":
        return <AnalyticsContainer />;

      case "analytics_pro":
        return <AnalyticsProContainer />;

      case "automation":
        return <AutomationContainer />;

      case "addons":
        return <AddonsContainer />;

      case "providers":
        return <ProvidersContainer />;

      case "meta_admin":
        return <MetaAdminContainer />;

      case "devtools":
        return <DevToolsContainer />;

      default:
        return <OverviewContainer />;
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900">{renderSection()}</div>
  );
}
