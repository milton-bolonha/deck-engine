"use client";

import { useState } from "react";

export default function PipelineToolbar({
  pipeline,
  canUndo = false,
  canRedo = false,
  onSave,
  onLoad,
  onNew,
  onUndo,
  onRedo,
  onRun,
  onTest,
  onClear,
  onSettings,
}) {
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      (await onSave) && onSave();
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    try {
      (await onRun) && onRun();
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      {/* Left Section - File Operations */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onNew}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          <i className="fas fa-file"></i>
          <span>New</span>
        </button>

        <button
          onClick={onLoad}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
        >
          <i className="fas fa-folder-open"></i>
          <span>Load</span>
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 rounded-md transition-colors"
        >
          <i className={`fas ${saving ? "fa-spinner fa-spin" : "fa-save"}`}></i>
          <span>{saving ? "Saving..." : "Save"}</span>
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

        {/* Undo/Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          title="Undo"
        >
          <i className="fas fa-undo"></i>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          title="Redo"
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>

      {/* Center Section - Pipeline Info */}
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {pipeline?.name || "Untitled Pipeline"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {pipeline?.cards?.length || 0} cards,{" "}
            {pipeline?.connections?.length || 0} connections
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onTest}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors"
        >
          <i className="fas fa-vial"></i>
          <span>Test</span>
        </button>

        <button
          onClick={handleRun}
          disabled={running || !pipeline?.cards?.length}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          <i
            className={`fas ${running ? "fa-spinner fa-spin" : "fa-play"}`}
          ></i>
          <span>{running ? "Running..." : "Run"}</span>
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

        <button
          onClick={onClear}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          title="Clear Canvas"
        >
          <i className="fas fa-trash"></i>
        </button>

        <button
          onClick={onSettings}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          title="Settings"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </div>
  );
}
