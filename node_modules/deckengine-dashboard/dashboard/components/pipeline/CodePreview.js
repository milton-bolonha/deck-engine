"use client";

import { useState } from "react";

export default function CodePreview({
  pipeline,
  format = "javascript",
  showLineNumbers = true,
  onCopy,
  onExport,
}) {
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    if (!pipeline || !pipeline.cards || pipeline.cards.length === 0) {
      return "// No cards in pipeline\n// Add cards from the palette to generate code";
    }

    let code = "";

    // Header
    code += "// Generated Pipeline Code\n";
    code += `// Pipeline: ${pipeline.name || "Untitled Pipeline"}\n`;
    code += `// Generated at: ${new Date().toISOString()}\n\n`;

    // DeckEngine import
    code += "const DeckEngine = require('pipesnow');\n\n";

    // Pipeline definition
    code += "const pipeline = new DeckEngine.Pipeline({\n";
    code += `  name: "${pipeline.name || "Generated Pipeline"}",\n`;
    code += `  description: "${
      pipeline.description || "Auto-generated pipeline"
    }",\n`;
    code += "  cards: [\n";

    // Generate cards
    pipeline.cards.forEach((card, index) => {
      code += "    {\n";
      code += `      id: "${card.id}",\n`;
      code += `      name: "${card.name}",\n`;
      code += `      type: "${card.type}",\n`;

      if (card.config) {
        code += "      config: {\n";
        Object.entries(card.config).forEach(([key, value]) => {
          if (typeof value === "string") {
            code += `        ${key}: "${value}",\n`;
          } else {
            code += `        ${key}: ${JSON.stringify(value)},\n`;
          }
        });
        code += "      },\n";
      }

      if (card.position) {
        code += "      position: {\n";
        code += `        x: ${card.position.x},\n`;
        code += `        y: ${card.position.y}\n`;
        code += "      }\n";
      }

      code += "    }" + (index < pipeline.cards.length - 1 ? "," : "") + "\n";
    });

    code += "  ],\n";

    // Generate connections
    if (pipeline.connections && pipeline.connections.length > 0) {
      code += "  connections: [\n";
      pipeline.connections.forEach((conn, index) => {
        code += "    {\n";
        code += `      from: "${conn.from}",\n`;
        code += `      to: "${conn.to}"\n`;
        code +=
          "    }" + (index < pipeline.connections.length - 1 ? "," : "") + "\n";
      });
      code += "  ]\n";
    }

    code += "});\n\n";

    // Execution code
    code += "// Execute pipeline\n";
    code += "async function run() {\n";
    code += "  try {\n";
    code += "    const result = await pipeline.execute();\n";
    code += '    console.log("Pipeline executed successfully:", result);\n';
    code += "  } catch (error) {\n";
    code += '    console.error("Pipeline execution failed:", error);\n';
    code += "  }\n";
    code += "}\n\n";
    code += "run();";

    return code;
  };

  const handleCopy = async () => {
    const code = generateCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy && onCopy(code);
  };

  const code = generateCode();
  const lines = code.split("\n");

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <i className="fas fa-code text-green-400"></i>
          <h3 className="text-sm font-medium text-slate-100">Code Preview</h3>
          <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
            {format}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              copied
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <i className={`fas ${copied ? "fa-check" : "fa-copy"} mr-1`}></i>
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={() => onExport && onExport(code)}
            className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 transition-colors"
          >
            <i className="fas fa-download mr-1"></i>
            Export
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto">
        <pre className="h-full text-sm">
          <code className="block p-4 text-slate-300 font-mono leading-6">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="select-none w-8 text-slate-500 text-right mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span>
              <i className="fas fa-lines-leaning mr-1"></i>
              {lines.length} lines
            </span>
            <span>
              <i className="fas fa-file-code mr-1"></i>
              {Math.round((code.length / 1024) * 100) / 100} KB
            </span>
            <span>
              <i className="fas fa-puzzle-piece mr-1"></i>
              {pipeline?.cards?.length || 0} cards
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Ready to export</span>
          </div>
        </div>
      </div>
    </div>
  );
}
