"use client";

import { useState } from "react";
import { useDashboard } from "../../contexts/DashboardContext";

export default function PipelineForm({ pipeline = null }) {
  const { actions } = useDashboard();
  const [formData, setFormData] = useState({
    name: pipeline?.name || "",
    description: pipeline?.description || "",
    type: pipeline?.type || "custom",
    concurrency: pipeline?.config?.concurrency || 3,
    timeout: pipeline?.config?.timeout || 30000,
    retries: pipeline?.config?.retries || 2,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pipelineData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        config: {
          concurrency: formData.concurrency,
          timeout: formData.timeout,
          retries: formData.retries,
        },
        cards: [],
        metadata: {
          createdAt: new Date(),
          createdBy: "dashboard-form",
        },
      };

      if (pipeline) {
        // Update existing pipeline
        await actions.updatePipeline(pipeline.id, pipelineData);
      } else {
        // Create new pipeline
        await actions.createPipeline(pipelineData);
      }

      // Close form
      actions.setRightSidebar(null);
      actions.setIsCreating(false);
    } catch (error) {
      console.error("Failed to save pipeline:", error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Pipeline Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            placeholder="Enter pipeline name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-input"
            rows={3}
            placeholder="Describe what this pipeline does"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="form-select"
          >
            <option value="custom">Custom</option>
            <option value="user-management">User Management</option>
            <option value="billing">Billing</option>
            <option value="data-processing">Data Processing</option>
            <option value="integration">Integration</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Concurrency
            </label>
            <input
              type="number"
              value={formData.concurrency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  concurrency: parseInt(e.target.value),
                })
              }
              className="form-input"
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Retries
            </label>
            <input
              type="number"
              value={formData.retries}
              onChange={(e) =>
                setFormData({ ...formData, retries: parseInt(e.target.value) })
              }
              className="form-input"
              min="0"
              max="5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Timeout (ms)
          </label>
          <input
            type="number"
            value={formData.timeout}
            onChange={(e) =>
              setFormData({ ...formData, timeout: parseInt(e.target.value) })
            }
            className="form-input"
            min="1000"
            max="300000"
            step="1000"
          />
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            <i className="fas fa-save mr-2"></i>
            {pipeline ? "Update Pipeline" : "Create Pipeline"}
          </button>

          <button
            type="button"
            onClick={() => {
              actions.setRightSidebar(null);
              actions.setIsCreating(false);
            }}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
