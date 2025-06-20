"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function DashboardView({
  contentType,
  section,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  isDevMode = false,
  sectionId,
}) {
  const { actions } = useDashboard();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // For dashboard view, process data into metrics format
    if (data.length > 0) {
      const item = data[0];
      setDashboardData(item);
    } else {
      // Create default dashboard
      const defaultDashboard = {
        id: "dashboard",
        title: section?.title || "Dashboard",
        metrics: {
          pipelines: 12,
          users: 45,
          revenue: 2340,
          executions: 156,
        },
        charts: [],
        widgets: [],
      };
      setDashboardData(defaultDashboard);
    }
  }, [data, section?.title]);

  const handleEdit = () => {
    if (onEdit && dashboardData) {
      onEdit(dashboardData);
    }

    // Definir item selecionado e seção atual no contexto global
    actions.setSelectedItem(dashboardData);
    actions.setCurrentSection(section);
    actions.setRightSidebarContent("item-form");
  };

  const handleRefresh = () => {
    // Reload dashboard data
    if (onAdd) {
      const refreshedData = {
        ...dashboardData,
        updatedAt: new Date().toISOString(),
      };
      setDashboardData(refreshedData);
    }
  };

  const renderMetricCard = (key, value, index) => {
    if (typeof value !== "number" && typeof value !== "string") return null;

    const getMetricIcon = (key) => {
      const icons = {
        users: "fas fa-users",
        pipelines: "fas fa-project-diagram",
        executions: "fas fa-play-circle",
        revenue: "fas fa-dollar-sign",
        success_rate: "fas fa-check-circle",
        active: "fas fa-bolt",
        total: "fas fa-chart-bar",
        count: "fas fa-hashtag",
      };

      const matchingKey = Object.keys(icons).find((iconKey) =>
        key.toLowerCase().includes(iconKey)
      );

      return icons[matchingKey] || "fas fa-chart-line";
    };

    const formatValue = (value) => {
      if (typeof value === "number") {
        if (value > 1000000) {
          return (value / 1000000).toFixed(1) + "M";
        } else if (value > 1000) {
          return (value / 1000).toFixed(1) + "K";
        }
        return value.toLocaleString();
      }
      return String(value);
    };

    const colors = [
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-orange-500",
      "text-pink-500",
      "text-indigo-500",
    ];

    return (
      <div
        key={key}
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
          </div>
          <i
            className={`${getMetricIcon(key)} text-2xl ${
              colors[index % colors.length]
            }`}
            aria-hidden="true"
          ></i>
        </div>
      </div>
    );
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Extract metrics from dashboard data
  const metrics = dashboardData.metrics || {};
  const dataEntries = Object.entries(dashboardData).filter(
    ([key, value]) =>
      key !== "id" &&
      key !== "title" &&
      key !== "metrics" &&
      key !== "charts" &&
      key !== "widgets" &&
      key !== "createdAt" &&
      key !== "updatedAt" &&
      (typeof value === "number" || typeof value === "string")
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i
            className={`${
              section?.icon || "fas fa-tachometer-alt"
            } text-2xl text-blue-500`}
            aria-hidden="true"
          ></i>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {section?.title || "Dashboard"}
            </h1>
            <p className="text-sm text-gray-600">
              {contentType?.description || "Painel de controle principal"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Atualizar dashboard"
          >
            <i className="fas fa-refresh" aria-hidden="true"></i>
          </button>

          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Configurar dashboard"
          >
            <i className="fas fa-cog mr-2" aria-hidden="true"></i>
            Configurar
          </button>
        </div>
      </div>

      {/* DevMode Info */}
      {isDevMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-code text-yellow-600"></i>
            <span className="font-medium text-yellow-800">
              DevMode Dashboard
            </span>
          </div>
          <div className="text-sm text-yellow-700">
            SectionId: {sectionId} • Métricas: {Object.keys(metrics).length} •
            Layout: dashboard
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {(Object.keys(metrics).length > 0 || dataEntries.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render metrics object */}
          {Object.entries(metrics).map(([key, value], index) =>
            renderMetricCard(key, value, index)
          )}

          {/* Render other numeric/string data */}
          {dataEntries.map(([key, value], index) =>
            renderMetricCard(key, value, Object.keys(metrics).length + index)
          )}
        </div>
      )}

      {/* Empty State */}
      {Object.keys(metrics).length === 0 && dataEntries.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-chart-bar text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Dashboard vazio
          </h3>
          <p className="text-gray-600 mb-4">
            Configure seu dashboard adicionando métricas e dados
          </p>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-cog mr-2" aria-hidden="true"></i>
            Configurar Dashboard
          </button>
        </div>
      )}

      {/* Meta Information */}
      {dashboardData.updatedAt && (
        <div className="text-center text-sm text-gray-500">
          Última atualização:{" "}
          {new Date(dashboardData.updatedAt).toLocaleString("pt-BR")}
        </div>
      )}
    </div>
  );
}
