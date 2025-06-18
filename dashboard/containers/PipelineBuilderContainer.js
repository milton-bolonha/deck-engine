"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../contexts/DashboardContext";
import VisualPipelineCanvas from "../components/pipeline/VisualPipelineCanvas";
import CardPalette from "../components/pipeline/CardPalette";
import CodePreview from "../components/pipeline/CodePreview";
import PipelineToolbar from "../components/pipeline/PipelineToolbar";
import { toast } from "react-hot-toast";

export default function PipelineBuilderContainer() {
  const { state, actions } = useDashboard();

  // Pipeline builder state
  const [currentPipeline, setCurrentPipeline] = useState(null);
  const [pipelineCards, setPipelineCards] = useState([]);
  const [cardConnections, setCardConnections] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [buildMode, setBuildMode] = useState("visual"); // 'visual' | 'code'
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);

  // Initialize new pipeline
  useEffect(() => {
    if (!currentPipeline) {
      setCurrentPipeline({
        id: `pipeline_${Date.now()}`,
        name: "New Pipeline",
        description: "Created with visual builder",
        type: "custom",
        config: {
          concurrency: 3,
          timeout: 30000,
          retries: 2,
        },
        metadata: {
          createdAt: new Date(),
          createdBy: "visual-builder",
        },
      });
    }
  }, [currentPipeline]);

  // Card library with categories
  const cardLibrary = {
    core: {
      name: "Core Operations",
      icon: "fas fa-cog",
      cards: [
        {
          id: "validate-input",
          name: "Validate Input",
          description: "Validate incoming data",
          icon: "fas fa-check-circle",
          template: `async (context) => {
  const { data } = context;
  
  if (!data) {
    throw new Error('Data is required');
  }
  
  return { ...context, validated: true };
}`,
        },
        {
          id: "transform-data",
          name: "Transform Data",
          description: "Transform data structure",
          icon: "fas fa-exchange-alt",
          template: `async (context) => {
  const { data } = context;
  
  const transformed = {
    ...data,
    processedAt: new Date(),
    source: 'pipeline'
  };
  
  return { ...context, data: transformed };
}`,
        },
        {
          id: "conditional-branch",
          name: "Conditional Branch",
          description: "Branch execution based on condition",
          icon: "fas fa-code-branch",
          template: `async (context) => {
  const { data, condition } = context;
  
  if (condition) {
    return { ...context, branch: 'success' };
  } else {
    return { ...context, branch: 'alternative' };
  }
}`,
        },
      ],
    },
    "user-management": {
      name: "User Management",
      icon: "fas fa-users",
      cards: [
        {
          id: "create-user",
          name: "Create User",
          description: "Create new user account",
          icon: "fas fa-user-plus",
          template: `async (context) => {
  const { email, name, role } = context;
  
  // Simulated user creation
  const user = {
    id: 'user_' + Date.now(),
    email,
    name,
    role: role || 'user',
    createdAt: new Date()
  };
  
  return { ...context, user };
}`,
        },
        {
          id: "validate-user",
          name: "Validate User",
          description: "Validate user data",
          icon: "fas fa-user-check",
          template: `async (context) => {
  const { email, password } = context;
  
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
  }
  
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  return { ...context, userValidated: true };
}`,
        },
        {
          id: "send-welcome-email",
          name: "Send Welcome Email",
          description: "Send welcome email to user",
          icon: "fas fa-envelope",
          template: `async (context) => {
  const { user } = context;
  
  // Simulated email sending
  const emailResult = {
    to: user.email,
    template: 'welcome',
    sent: true,
    sentAt: new Date()
  };
  
  return { ...context, emailSent: emailResult };
}`,
        },
      ],
    },
    billing: {
      name: "Billing & Payments",
      icon: "fas fa-credit-card",
      cards: [
        {
          id: "create-stripe-customer",
          name: "Create Stripe Customer",
          description: "Create customer in Stripe",
          icon: "fab fa-stripe",
          template: `async (context) => {
  const { user, paymentMethod } = context;
  
  // Simulated Stripe customer creation
  const customer = {
    id: 'cus_' + Date.now(),
    email: user.email,
    name: user.name,
    paymentMethod,
    created: new Date()
  };
  
  return { ...context, stripeCustomer: customer };
}`,
        },
        {
          id: "process-payment",
          name: "Process Payment",
          description: "Process payment transaction",
          icon: "fas fa-credit-card",
          template: `async (context) => {
  const { stripeCustomer, amount } = context;
  
  // Simulated payment processing
  const payment = {
    id: 'pi_' + Date.now(),
    customer: stripeCustomer.id,
    amount: amount * 100, // cents
    currency: 'brl',
    status: 'succeeded',
    processedAt: new Date()
  };
  
  return { ...context, payment };
}`,
        },
      ],
    },
    integrations: {
      name: "External Integrations",
      icon: "fas fa-plug",
      cards: [
        {
          id: "webhook-call",
          name: "Webhook Call",
          description: "Make HTTP webhook call",
          icon: "fas fa-satellite-dish",
          template: `async (context) => {
  const { webhookUrl, data } = context;
  
  // Simulated webhook call
  const response = {
    url: webhookUrl,
    method: 'POST',
    status: 200,
    sentAt: new Date(),
    data
  };
  
  return { ...context, webhookResponse: response };
}`,
        },
        {
          id: "database-save",
          name: "Save to Database",
          description: "Save data to database",
          icon: "fas fa-database",
          template: `async (context) => {
  const { data, table } = context;
  
  // Simulated database save
  const record = {
    id: 'record_' + Date.now(),
    table: table || 'default',
    data,
    savedAt: new Date()
  };
  
  return { ...context, savedRecord: record };
}`,
        },
      ],
    },
  };

  // Handle card drop on canvas
  const handleCardDrop = (cardType, position) => {
    const cardConfig = findCardInLibrary(cardType);
    if (!cardConfig) return;

    const newCard = {
      id: `card_${Date.now()}`,
      type: cardType,
      name: cardConfig.name,
      position,
      config: {
        ...cardConfig,
        customCode: cardConfig.template,
      },
    };

    setPipelineCards([...pipelineCards, newCard]);
    toast.success(`Card "${cardConfig.name}" added to pipeline`);
  };

  // Find card configuration in library
  const findCardInLibrary = (cardType) => {
    for (const category of Object.values(cardLibrary)) {
      const card = category.cards.find((c) => c.id === cardType);
      if (card) return card;
    }
    return null;
  };

  // Generate pipeline code
  const generatePipelineCode = () => {
    if (pipelineCards.length === 0) {
      return "// Add cards to generate pipeline code";
    }

    let code = `/**
 * 🎮 Pipeline: ${currentPipeline.name}
 * Generated by DeckEngine Visual Builder
 */

const DeckEngine = require('deckengine');
const engine = new DeckEngine();

// Create deck
const deck = engine.createDeck('${currentPipeline.name
      .toLowerCase()
      .replace(/\s+/g, "-")}', ${JSON.stringify(
      currentPipeline.config,
      null,
      2
    )});

// Add cards
`;

    pipelineCards.forEach((card, index) => {
      code += `
deck.addCard('${card.type}', ${card.config.customCode || card.config.template});
`;
    });

    code += `
// Export for use
module.exports = { engine, deck };

// Execute if run directly
if (require.main === module) {
  async function execute() {
    try {
      const result = await engine.playAndWait('${currentPipeline.name
        .toLowerCase()
        .replace(/\s+/g, "-")}', {
        // Add your payload here
      });
      console.log('✅ Pipeline executed successfully:', result);
    } catch (error) {
      console.error('❌ Pipeline execution failed:', error);
    }
  }
  
  execute();
}
`;

    return code;
  };

  // Execute pipeline in real-time
  const executePipeline = async () => {
    if (pipelineCards.length === 0) {
      toast.error("Add cards to the pipeline before executing");
      return;
    }

    setIsExecuting(true);
    setExecutionLog([]);

    try {
      // Build pipeline dynamically
      const pipelineData = {
        name: currentPipeline.name,
        cards: pipelineCards.map((card) => ({
          name: card.type,
          action: card.config.customCode || card.config.template,
        })),
        config: currentPipeline.config,
      };

      // Execute via API
      const result = await actions.api.post("/decks/execute-dynamic", {
        pipeline: pipelineData,
        payload: {
          test: true,
          createdBy: "visual-builder",
          timestamp: new Date(),
        },
      });

      setExecutionLog((prev) => [
        ...prev,
        {
          type: "success",
          message: "Pipeline executed successfully",
          timestamp: new Date(),
          result,
        },
      ]);

      toast.success("🏆 Pipeline executed successfully!");
    } catch (error) {
      setExecutionLog((prev) => [
        ...prev,
        {
          type: "error",
          message: error.message,
          timestamp: new Date(),
          error,
        },
      ]);

      toast.error("💥 Pipeline execution failed");
    } finally {
      setIsExecuting(false);
    }
  };

  // Save pipeline
  const savePipeline = async () => {
    try {
      const pipelineToSave = {
        ...currentPipeline,
        cards: pipelineCards,
        connections: cardConnections,
        generatedCode: generatePipelineCode(),
      };

      const result = await actions.createPipeline(pipelineToSave);

      setCurrentPipeline(result);
      toast.success("🎮 Pipeline saved successfully!");
    } catch (error) {
      toast.error("Failed to save pipeline");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <PipelineToolbar
        pipeline={{
          ...currentPipeline,
          cards: pipelineCards,
          connections: cardConnections,
        }}
        onNew={() => {
          setCurrentPipeline(null);
          setPipelineCards([]);
          setCardConnections([]);
          setSelectedCard(null);
        }}
        onSave={savePipeline}
        onRun={executePipeline}
        onTest={() => toast.info("Test mode not implemented yet")}
        onClear={() => {
          setPipelineCards([]);
          setCardConnections([]);
          toast.success("Canvas cleared");
        }}
        onSettings={() => toast.info("Settings not implemented yet")}
      />

      {/* Main Builder Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Card Palette */}
        <div className="w-64 bg-white dark:bg-deck-card border-r border-gray-200 dark:border-deck-border">
          <CardPalette
            library={cardLibrary}
            onCardSelect={(cardType) => {
              // Handle card selection
              setSelectedCard(cardType);
            }}
          />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {buildMode === "visual" ? (
            <VisualPipelineCanvas
              cards={pipelineCards}
              connections={cardConnections}
              selectedCard={selectedCard}
              onCardDrop={handleCardDrop}
              onCardSelect={setSelectedCard}
              onCardUpdate={(cardId, updates) => {
                setPipelineCards((prev) =>
                  prev.map((card) =>
                    card.id === cardId ? { ...card, ...updates } : card
                  )
                );
              }}
              onCardDelete={(cardId) => {
                setPipelineCards((prev) =>
                  prev.filter((card) => card.id !== cardId)
                );
                toast.success("Card removed from pipeline");
              }}
              onConnectionCreate={(fromCard, toCard) => {
                const newConnection = {
                  id: `conn_${Date.now()}`,
                  from: fromCard,
                  to: toCard,
                };
                setCardConnections([...cardConnections, newConnection]);
              }}
            />
          ) : (
            <CodePreview
              pipeline={{
                ...currentPipeline,
                cards: pipelineCards,
                connections: cardConnections,
              }}
              onCopy={(code) => {
                navigator.clipboard.writeText(code);
                toast.success("Code copied to clipboard!");
              }}
              onExport={(code) => {
                const blob = new Blob([code], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${currentPipeline?.name || "pipeline"}.js`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Pipeline exported!");
              }}
            />
          )}

          {/* Execution Log */}
          {executionLog.length > 0 && (
            <div className="h-48 bg-slate-900 text-green-400 font-mono text-sm p-4 overflow-auto">
              {executionLog.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    log.type === "error" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  <span className="text-slate-400">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
