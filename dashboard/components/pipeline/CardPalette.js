"use client";

import { useState } from "react";

export default function CardPalette({ library, onCardSelect }) {
  const [activeCategory, setActiveCategory] = useState("core");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDragStart = (e, cardType) => {
    e.dataTransfer.setData("cardType", cardType);
  };

  const filteredCards =
    library[activeCategory]?.cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Card Palette
        </h3>

        {/* Search */}
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-1">
          {Object.entries(library).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeCategory === key
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <i className={`${category.icon} mr-1`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)}
            onClick={() => onCardSelect && onCardSelect(card.id)}
            className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg cursor-grab hover:border-primary-300 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i
                  className={`${card.icon} text-primary-600 dark:text-primary-400 text-sm`}
                ></i>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300">
                  {card.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Drag indicator */}
            <div className="mt-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}

        {filteredCards.length === 0 && (
          <div className="text-center py-8">
            <i className="fas fa-search text-2xl text-slate-300 dark:text-slate-600 mb-2"></i>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchTerm ? "No cards found" : "No cards in this category"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          <i className="fas fa-info-circle mr-1"></i>
          Drag cards to canvas to build your pipeline
        </div>
      </div>
    </div>
  );
}
