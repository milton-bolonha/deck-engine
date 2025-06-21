import React, { useState, useRef, useCallback } from "react";

const CanvasView = ({
  contentType,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onUpdateCanvas,
  isDevMode = false,
}) => {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState(data[0]?.nodes || []);
  const [connections, setConnections] = useState(data[0]?.connections || []);
  const [mode, setMode] = useState("select"); // select, add-node, connect

  // Node types disponíveis
  const nodeTypes = [
    {
      type: "start",
      label: "Início",
      icon: "fas fa-play",
      color: "bg-green-500",
    },
    {
      type: "process",
      label: "Processo",
      icon: "fas fa-cogs",
      color: "bg-blue-500",
    },
    {
      type: "decision",
      label: "Decisão",
      icon: "fas fa-question",
      color: "bg-yellow-500",
    },
    { type: "end", label: "Fim", icon: "fas fa-stop", color: "bg-red-500" },
    {
      type: "data",
      label: "Dados",
      icon: "fas fa-database",
      color: "bg-purple-500",
    },
    { type: "api", label: "API", icon: "fas fa-plug", color: "bg-orange-500" },
  ];

  // Adicionar novo nó
  const handleAddNode = useCallback(
    (e) => {
      if (mode !== "add-node") return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newNode = {
        id: `node_${Date.now()}`,
        type: "process",
        label: "Novo Processo",
        x: x - 50, // Center the node
        y: y - 25,
        width: 100,
        height: 50,
      };

      const updatedNodes = [...nodes, newNode];
      setNodes(updatedNodes);
      onUpdateCanvas && onUpdateCanvas({ nodes: updatedNodes, connections });
      setMode("select");
    },
    [mode, nodes, connections, onUpdateCanvas]
  );

  // Iniciar drag de nó
  const handleMouseDown = (e, node) => {
    if (mode !== "select") return;

    e.preventDefault();
    setIsDragging(true);
    setSelectedNode(node);

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  // Drag do nó
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !selectedNode) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      const updatedNodes = nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, x: Math.max(0, newX), y: Math.max(0, newY) }
          : node
      );

      setNodes(updatedNodes);
    },
    [isDragging, selectedNode, dragOffset, nodes]
  );

  // Finalizar drag
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onUpdateCanvas && onUpdateCanvas({ nodes, connections });
    }
  }, [isDragging, nodes, connections, onUpdateCanvas]);

  // Selecionar nó
  const handleNodeClick = (node) => {
    if (mode === "select") {
      setSelectedNode(node);
    }
  };

  // Deletar nó selecionado
  const handleDeleteNode = () => {
    if (!selectedNode) return;

    const updatedNodes = nodes.filter((node) => node.id !== selectedNode.id);
    const updatedConnections = connections.filter(
      (conn) => conn.from !== selectedNode.id && conn.to !== selectedNode.id
    );

    setNodes(updatedNodes);
    setConnections(updatedConnections);
    setSelectedNode(null);
    onUpdateCanvas &&
      onUpdateCanvas({ nodes: updatedNodes, connections: updatedConnections });
  };

  // Renderizar conexões
  const renderConnections = () => {
    return connections.map((connection) => {
      const fromNode = nodes.find((n) => n.id === connection.from);
      const toNode = nodes.find((n) => n.id === connection.to);

      if (!fromNode || !toNode) return null;

      const x1 = fromNode.x + fromNode.width / 2;
      const y1 = fromNode.y + fromNode.height / 2;
      const x2 = toNode.x + toNode.width / 2;
      const y2 = toNode.y + toNode.height / 2;

      return (
        <line
          key={connection.id}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#64748b"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pipeline Designer
          </h2>
          <p className="text-gray-600 mt-1">Designer visual para pipelines</p>
        </div>

        {isDevMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              🚧 <strong>DevMode:</strong> Canvas View • Pipeline Designer
            </p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("select")}
            className={`px-3 py-2 rounded-md transition-colors ${
              mode === "select"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <i className="fas fa-mouse-pointer mr-2"></i>
            Selecionar
          </button>
          <button
            onClick={() => setMode("add-node")}
            className={`px-3 py-2 rounded-md transition-colors ${
              mode === "add-node"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <i className="fas fa-plus mr-2"></i>
            Adicionar Nó
          </button>
        </div>

        <div className="border-l border-gray-300 h-8"></div>

        <div className="flex items-center gap-2">
          {selectedNode && (
            <>
              <span className="text-sm text-gray-600">
                Selecionado: {selectedNode.label}
              </span>
              <button
                onClick={handleDeleteNode}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Nós: {nodes.length}</span>
          <span className="text-sm text-gray-600">
            Conexões: {connections.length}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg overflow-hidden relative">
        <svg
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleAddNode}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: mode === "add-node" ? "crosshair" : "default" }}
        >
          {/* Definições para setas */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          {/* Grid de fundo */}
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Conexões */}
          {renderConnections()}
        </svg>

        {/* Nós */}
        {nodes.map((node) => {
          const nodeType =
            nodeTypes.find((t) => t.type === node.type) || nodeTypes[1];
          return (
            <div
              key={node.id}
              className={`absolute cursor-move border-2 rounded-lg p-3 text-white text-center select-none ${
                nodeType.color
              } ${
                selectedNode?.id === node.id
                  ? "border-blue-400 ring-2 ring-blue-200"
                  : "border-transparent"
              }`}
              style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                minWidth: "100px",
                minHeight: "50px",
              }}
              onMouseDown={(e) => handleMouseDown(e, node)}
              onClick={() => handleNodeClick(node)}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <i className={`${nodeType.icon} text-lg mb-1`}></i>
                <span className="text-xs font-medium truncate w-full">
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Instruções */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <i className="fas fa-project-diagram text-4xl mb-4"></i>
              <p className="text-lg font-medium mb-2">Canvas Vazio</p>
              <p className="text-sm">
                Clique em "Adicionar Nó" e depois clique no canvas para começar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Node Types Palette */}
      {mode === "add-node" && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Tipos de Nó:
          </h4>
          <div className="flex gap-2 flex-wrap">
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-white text-sm ${nodeType.color} hover:opacity-90 transition-opacity`}
              >
                <i className={nodeType.icon}></i>
                {nodeType.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasView;
