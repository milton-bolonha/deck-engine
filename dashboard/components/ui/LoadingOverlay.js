"use client";

import { motion } from "framer-motion";

export default function LoadingOverlay({
  message = "Loading...",
  transparent = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        transparent ? "bg-black/30" : "bg-slate-900/80"
      } backdrop-blur-sm`}
    >
      <div className="gaming-card p-8 text-center max-w-sm mx-4">
        {/* Animated DeckEngine Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-gaming rounded-xl flex items-center justify-center animate-pulse">
            <i className="fas fa-cubes text-white text-2xl"></i>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mb-4">
          <div className="inline-flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {message}
            </span>
          </div>
        </div>

        {/* Gaming-style progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-gaming h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}
