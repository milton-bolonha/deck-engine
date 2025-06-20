"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function SectionMasterTest() {
  const { state } = useDashboard();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.sectionManager?.initialized) {
      runTests();
    }
  }, [state.sectionManager]);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check if managers are initialized
      results.managersInitialized = {
        addonManager: !!state.sectionManager.addonManager?.initialized,
        planManager: !!state.sectionManager.planManager?.initialized,
        contentTypeManager:
          !!state.sectionManager.contentTypeManager?.initialized,
        sectionManager: !!state.sectionManager.initialized,
      };

      // Test 2: Check data loading
      results.dataLoaded = {
        addons: Object.keys(
          state.sectionManager.addonManager?.getAllAddons() || {}
        ).length,
        plans: Object.keys(
          state.sectionManager.planManager?.getAllPlans() || {}
        ).length,
        contentTypes: Object.keys(
          state.sectionManager.contentTypeManager?.getAllContentTypes() || {}
        ).length,
        sections: Object.keys(state.sectionManager.sections || {}).length,
      };

      // Test 3: Check sections access
      const accessibleSections = state.sectionManager.getAccessibleSections();
      results.sectionsAccess = {
        total: accessibleSections.length,
        sections: accessibleSections.map((s) => ({
          id: s.sectionId,
          title: s.title,
          tier: s.planTierMin,
        })),
      };

      // Test 4: Test data retrieval
      results.dataRetrieval = {};
      accessibleSections.forEach((section) => {
        try {
          const data = state.sectionManager.getSectionData(section.sectionId);
          results.dataRetrieval[section.sectionId] = {
            success: true,
            count: Array.isArray(data) ? data.length : 0,
            data: data,
          };
        } catch (error) {
          results.dataRetrieval[section.sectionId] = {
            success: false,
            error: error.message,
          };
        }
      });

      // Test 5: System info
      results.systemInfo = state.sectionManager.getSystemInfo();

      setTestResults(results);
    } catch (error) {
      results.error = error.message;
      setTestResults(results);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mb-4"></i>
          <p className="text-slate-600 dark:text-slate-400">
            Executando testes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-vial mr-2"></i>
          Testes do SectionMaster
        </h2>
        <button onClick={runTests} className="btn-secondary text-sm">
          <i className="fas fa-redo mr-2"></i>
          Executar Novamente
        </button>
      </div>

      {testResults.error && (
        <div className="gaming-card p-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Erro nos Testes
          </h3>
          <p className="text-red-600 dark:text-red-300">{testResults.error}</p>
        </div>
      )}

      {/* Test 1: Managers */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-cogs mr-2"></i>
          Inicialização dos Managers
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(testResults.managersInitialized || {}).map(
            ([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded"
              >
                <span className="text-sm font-medium">{name}</span>
                <span
                  className={`text-sm ${
                    status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <i
                    className={`fas ${status ? "fa-check" : "fa-times"} mr-1`}
                  ></i>
                  {status ? "OK" : "ERRO"}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Test 2: Data Loading */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-database mr-2"></i>
          Carregamento de Dados
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(testResults.dataLoaded || {}).map(([name, count]) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded"
            >
              <span className="text-sm font-medium">{name}</span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-bold">
                {count} itens
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Test 3: Sections Access */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-lock-open mr-2"></i>
          Acesso às Seções
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Total de seções acessíveis:{" "}
          <strong>{testResults.sectionsAccess?.total || 0}</strong>
        </p>
        <div className="space-y-2">
          {(testResults.sectionsAccess?.sections || []).map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded"
            >
              <span className="text-sm">{section.title}</span>
              <span className="text-xs text-slate-500">
                Tier {section.tier}+
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Test 4: Data Retrieval */}
      <div className="gaming-card p-4">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
          <i className="fas fa-download mr-2"></i>
          Recuperação de Dados
        </h3>
        <div className="space-y-3">
          {Object.entries(testResults.dataRetrieval || {}).map(
            ([sectionId, result]) => (
              <div
                key={sectionId}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{sectionId}</span>
                  <span
                    className={`text-sm ${
                      result.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <i
                      className={`fas ${
                        result.success ? "fa-check" : "fa-times"
                      } mr-1`}
                    ></i>
                    {result.success ? `${result.count} registros` : "ERRO"}
                  </span>
                </div>
                {!result.success && (
                  <p className="text-xs text-red-500">{result.error}</p>
                )}
                {result.success && result.data && (
                  <details className="text-xs text-slate-500">
                    <summary className="cursor-pointer hover:text-slate-700">
                      Ver dados
                    </summary>
                    <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-700 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Test 5: System Info */}
      {testResults.systemInfo && (
        <div className="gaming-card p-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>DevMode:</span>
                <span
                  className={
                    testResults.systemInfo.devMode
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {testResults.systemInfo.devMode ? "ATIVO" : "INATIVO"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Under Construction:</span>
                <span
                  className={
                    testResults.systemInfo.underConstruction
                      ? "text-orange-600"
                      : "text-slate-500"
                  }
                >
                  {testResults.systemInfo.underConstruction
                    ? "ATIVO"
                    : "INATIVO"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Plano:</span>
                <span className="font-bold">
                  {testResults.systemInfo.userPlan}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tier:</span>
                <span className="font-bold">
                  {testResults.systemInfo.userTier}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Seções:</span>
                <span>{testResults.systemInfo.totalSections}</span>
              </div>
              <div className="flex justify-between">
                <span>Content Types:</span>
                <span>{testResults.systemInfo.totalContentTypes}</span>
              </div>
              <div className="flex justify-between">
                <span>Addons:</span>
                <span>{testResults.systemInfo.totalAddons}</span>
              </div>
              <div className="flex justify-between">
                <span>Planos:</span>
                <span>{testResults.systemInfo.totalPlans}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
