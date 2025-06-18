"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../contexts/DashboardContext";
import MetricsCard from "../components/ui/MetricsCard";
import ChampionPipelinesCard from "../components/cards/ChampionPipelinesCard";
import LiveMatchesCard from "../components/cards/LiveMatchesCard";
import SystemHealthCard from "../components/cards/SystemHealthCard";
import PipelinePerformanceChart from "../components/charts/PipelinePerformanceChart";
import RecentActivityCard from "../components/cards/RecentActivityCard";

export default function OverviewContainer() {
  const { state } = useDashboard();
  const [lastUpdated, setLastUpdated] = useState("");

  // Fix hydration error - only update time on client
  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(new Date().toLocaleTimeString());
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const quickStats = {
    totalPipelines: Array.isArray(state.pipelines) ? state.pipelines.length : 0,
    activeMatches: Array.isArray(state.activeMatches)
      ? state.activeMatches.length
      : 0,
    systemHealth: state.systemHealth.status || "unknown",
    uptime: state.systemHealth.uptime || 0,
    totalExecutions: state.pipelineMetrics.totalExecutions || 0,
    successRate: state.pipelineMetrics.successRate || 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor your DeckEngine pipelines and system performance
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Real-time indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-victory rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Live Data
            </span>
          </div>

          {/* Last updated */}
          <span className="text-xs text-slate-500 dark:text-slate-500">
            Last updated: {lastUpdated}
          </span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Pipelines"
          value={quickStats.totalPipelines}
          icon="fas fa-project-diagram"
          iconColor="text-primary-500"
          trend={null}
        />

        <MetricsCard
          title="Active Matches"
          value={quickStats.activeMatches}
          icon="fas fa-bolt"
          iconColor="text-victory"
          trend={null}
          animated={quickStats.activeMatches > 0}
        />

        <MetricsCard
          title="Total Executions"
          value={quickStats.totalExecutions.toLocaleString()}
          icon="fas fa-play-circle"
          iconColor="text-blue-500"
          trend={"+12% this week"}
        />

        <MetricsCard
          title="Success Rate"
          value={`${(quickStats.successRate * 100).toFixed(1)}%`}
          icon="fas fa-trophy"
          iconColor="text-gaming-gold"
          trend={quickStats.successRate > 0.9 ? "+2.1%" : "-1.2%"}
          trendColor={
            quickStats.successRate > 0.9 ? "text-victory" : "text-defeat"
          }
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Champion Pipelines */}
          <ChampionPipelinesCard
            pipelines={Array.isArray(state.pipelines) ? state.pipelines : []}
          />

          {/* Performance Chart */}
          <PipelinePerformanceChart
            data={state.pipelineMetrics.performanceData || []}
          />

          {/* Recent Activity */}
          <RecentActivityCard activities={generateRecentActivities(state)} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* System Health */}
          <SystemHealthCard
            health={state.systemHealth}
            connected={state.isConnected}
          />

          {/* Live Matches */}
          <LiveMatchesCard
            matches={
              Array.isArray(state.activeMatches) ? state.activeMatches : []
            }
          />

          {/* Quick Actions */}
          <QuickActionsCard />
        </div>
      </div>

      {/* Bottom Row - Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PipelineTypesChart
          pipelines={Array.isArray(state.pipelines) ? state.pipelines : []}
        />
        <ExecutionTrendsChart metrics={state.pipelineMetrics} />
      </div>
    </div>
  );
}

// Quick Actions Card Component
function QuickActionsCard() {
  const { actions } = useDashboard();

  const quickActions = [
    {
      title: "Create Pipeline",
      description: "Build a new pipeline",
      icon: "fas fa-plus-circle",
      color: "text-primary-500",
      action: () => {
        actions.setSelectedSection("pipelines");
        actions.setIsCreating(true);
      },
    },
    {
      title: "Run Test",
      description: "Execute test pipeline",
      icon: "fas fa-play",
      color: "text-victory",
      action: () => {
        actions.executePipeline("health-check", {});
      },
    },
    {
      title: "View Analytics",
      description: "Check detailed metrics",
      icon: "fas fa-chart-bar",
      color: "text-blue-500",
      action: () => actions.setSelectedSection("analytics"),
    },
    {
      title: "System Logs",
      description: "Debug and monitor",
      icon: "fas fa-terminal",
      color: "text-slate-500",
      action: () => actions.setSelectedSection("devtools"),
    },
  ];

  return (
    <div className="gaming-card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Quick Actions
      </h3>

      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 text-left"
          >
            <i className={`${action.icon} ${action.color} text-lg`}></i>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {action.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Helper Components
function PipelineTypesChart({ pipelines }) {
  // Mock data for pipeline types
  const pipelinesArray = Array.isArray(pipelines) ? pipelines : [];
  const types = pipelinesArray.reduce((acc, pipeline) => {
    const type = pipeline.type || "custom";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="gaming-card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Pipeline Types
      </h3>

      <div className="space-y-3">
        {Object.entries(types).map(([type, count]) => (
          <div key={type} className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
              {type}
            </span>
            <div className="flex items-center space-x-2">
              <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs">
                {count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutionTrendsChart({ metrics }) {
  const [randomValues, setRandomValues] = useState({
    executions: 0,
    responseTime: 0,
  });

  useEffect(() => {
    setRandomValues({
      executions: Math.floor(Math.random() * 50),
      responseTime: Math.floor(Math.random() * 200 + 50),
    });
  }, []);

  return (
    <div className="gaming-card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Execution Trends
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            This Hour
          </span>
          <span className="text-victory font-medium">
            +{randomValues.executions} executions
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Success Rate
          </span>
          <span className="text-victory font-medium">
            {((metrics.successRate || 0.95) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Avg Response Time
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            {randomValues.responseTime}ms
          </span>
        </div>
      </div>
    </div>
  );
}

// Generate mock recent activities
function generateRecentActivities(state) {
  const activities = [];

  // Add pipeline activities with fixed timestamps to avoid hydration issues
  const pipelines = Array.isArray(state.pipelines) ? state.pipelines : [];
  const activeMatches = Array.isArray(state.activeMatches)
    ? state.activeMatches
    : [];

  pipelines.slice(0, 3).forEach((pipeline, index) => {
    activities.push({
      id: `pipeline-${pipeline.id}`,
      type: "pipeline_created",
      title: `Pipeline "${pipeline.name}" created`,
      timestamp: new Date(Date.now() - (index + 1) * 1800000), // 30 min intervals
      icon: "fas fa-plus-circle",
      color: "text-primary-500",
    });
  });

  // Add match activities
  activeMatches.forEach((match) => {
    activities.push({
      id: `match-${match.id}`,
      type: "match_started",
      title: `Match started for "${match.deckName}"`,
      timestamp: new Date(match.startedAt),
      icon: "fas fa-bolt",
      color: "text-victory",
    });
  });

  return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
}
