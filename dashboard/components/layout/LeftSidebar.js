"use client";

import { useDashboard } from "../../contexts/DashboardContext";

export default function LeftSidebar() {
  const { state, actions } = useDashboard();

  const menuItems = [
    { id: "overview", label: "Overview", icon: "fas fa-tachometer-alt" },
    {
      id: "pipelines",
      label: "Pipeline Builder",
      icon: "fas fa-project-diagram",
    },
    { id: "users", label: "User Management", icon: "fas fa-users" },
    { id: "billing", label: "Billing", icon: "fas fa-credit-card" },
  ];

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
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
