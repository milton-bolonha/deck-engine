"use client";

import { useState } from "react";

export default function VisualPipelineCanvas({
  cards = [],
  connections = [],
  selectedCard = null,
  onCardDrop,
  onCardSelect,
  onCardUpdate,
  onCardDelete,
  onConnectionCreate,
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const cardType = e.dataTransfer.getData("cardType");
    if (cardType && onCardDrop) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      onCardDrop(cardType, position);
    }
  };

  return (
    <div
      className={`flex-1 relative bg-slate-50 dark:bg-slate-900 ${
        dragOver
          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400"
          : "border-2 border-dashed border-slate-300 dark:border-slate-600"
      } transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {cards.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-puzzle-piece text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">
              Visual Pipeline Canvas
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Arraste cards da paleta para começar a construir seu pipeline
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 p-4">
          {/* Render cards */}
          {cards.map((card) => (
            <div
              key={card.id}
              className={`absolute w-48 p-4 bg-white dark:bg-slate-800 border rounded-lg shadow-sm cursor-pointer transition-all ${
                selectedCard === card.id
                  ? "border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              style={{
                left: card.position?.x || 100,
                top: card.position?.y || 100,
              }}
              onClick={() => onCardSelect && onCardSelect(card.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <i
                    className={`${
                      card.config?.icon || "fas fa-cog"
                    } text-primary-500`}
                  ></i>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                    {card.name}
                  </h4>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardUpdate && onCardUpdate(card.id, { editing: true });
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardDelete && onCardDelete(card.id);
                    }}
                    className="text-slate-400 hover:text-red-500 text-xs"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {card.config?.description || "Pipeline step"}
              </p>

              {/* Connection points */}
              <div className="absolute -right-2 top-1/2 w-4 h-4 bg-primary-500 rounded-full transform -translate-y-1/2 cursor-crosshair"></div>
              <div className="absolute -left-2 top-1/2 w-4 h-4 bg-slate-400 rounded-full transform -translate-y-1/2"></div>
            </div>
          ))}

          {/* Render connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((connection) => {
              const fromCard = cards.find((c) => c.id === connection.from);
              const toCard = cards.find((c) => c.id === connection.to);

              if (!fromCard || !toCard) return null;

              const fromX = (fromCard.position?.x || 100) + 192; // card width
              const fromY = (fromCard.position?.y || 100) + 32; // card height / 2
              const toX = toCard.position?.x || 100;
              const toY = (toCard.position?.y || 100) + 32;

              return (
                <line
                  key={connection.id}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}
