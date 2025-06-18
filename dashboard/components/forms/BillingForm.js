"use client";

import { useState } from "react";

export default function BillingForm() {
  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    interval: "monthly",
    features: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating billing plan:", formData);
    // Implementation will be added later
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Plan Name
          </label>
          <input
            type="text"
            value={formData.planName}
            onChange={(e) =>
              setFormData({ ...formData, planName: e.target.value })
            }
            className="form-input"
            placeholder="e.g., Professional"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Price (R$)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="form-input"
            placeholder="79.00"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Billing Interval
          </label>
          <select
            value={formData.interval}
            onChange={(e) =>
              setFormData({ ...formData, interval: e.target.value })
            }
            className="form-select"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Features (one per line)
          </label>
          <textarea
            value={formData.features}
            onChange={(e) =>
              setFormData({ ...formData, features: e.target.value })
            }
            className="form-input"
            rows={4}
            placeholder="Unlimited pipelines&#10;Priority support&#10;Advanced analytics"
          />
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            <i className="fas fa-save mr-2"></i>
            Create Plan
          </button>
          <button
            type="button"
            className="px-4 py-2 text-slate-600 dark:text-slate-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
