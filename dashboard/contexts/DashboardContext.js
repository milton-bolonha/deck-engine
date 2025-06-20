"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import { getSectionManager } from "../utils/SectionManager";

// Initial state
const initialState = {
  // Core DeckEngine state
  pipelines: [],
  activeMatches: [],
  pipelineMetrics: {},
  systemHealth: {
    status: "unknown",
    uptime: 0,
    memory: { used: 0, total: 0 },
    cpu: 0,
  },

  // UI state
  selectedSection: "overview",
  selectedPipeline: null,
  selectedMatch: null,
  rightSidebarContent: null,
  isCreating: false,

  // Real-time connections
  socket: null,
  isConnected: false,

  // Provider configurations
  providers: {
    stripe: { configured: false, enabled: false },
    discord: { configured: false, enabled: false },
    twitch: { configured: false, enabled: false },
  },

  // User & permissions
  user: null,
  userRoles: [],
  userAddons: [],
  userPlan: "tier3",
  currentPlan: "tier3",

  // SectionMaster Enhanced
  sectionManager: null,
  currentSectionData: [],
  sectionData: {},
  selectedItem: null,
  selectedElement: null,
  currentSection: null,

  // Dev mode vs underConstruction
  devMode: process.env.NODE_ENV === "development",
  underConstruction: false,
  debugData: {},
};

// Action types
const actionTypes = {
  // Core actions
  SET_PIPELINES: "SET_PIPELINES",
  ADD_PIPELINE: "ADD_PIPELINE",
  UPDATE_PIPELINE: "UPDATE_PIPELINE",
  DELETE_PIPELINE: "DELETE_PIPELINE",

  // Match actions
  SET_ACTIVE_MATCHES: "SET_ACTIVE_MATCHES",
  ADD_MATCH: "ADD_MATCH",
  UPDATE_MATCH: "UPDATE_MATCH",
  REMOVE_MATCH: "REMOVE_MATCH",

  // UI actions
  SET_SELECTED_SECTION: "SET_SELECTED_SECTION",
  SET_SELECTED_PIPELINE: "SET_SELECTED_PIPELINE",
  SET_SELECTED_MATCH: "SET_SELECTED_MATCH",
  SET_RIGHT_SIDEBAR: "SET_RIGHT_SIDEBAR",
  SET_IS_CREATING: "SET_IS_CREATING",

  // Socket actions
  SET_SOCKET: "SET_SOCKET",
  SET_CONNECTION_STATUS: "SET_CONNECTION_STATUS",

  // Provider actions
  UPDATE_PROVIDER: "UPDATE_PROVIDER",
  SET_PROVIDER_STATUS: "SET_PROVIDER_STATUS",

  // User actions
  SET_USER: "SET_USER",
  SET_USER_ROLES: "SET_USER_ROLES",
  SET_USER_ADDONS: "SET_USER_ADDONS",

  // System actions
  SET_SYSTEM_HEALTH: "SET_SYSTEM_HEALTH",
  SET_PIPELINE_METRICS: "SET_PIPELINE_METRICS",
  SET_DEBUG_DATA: "SET_DEBUG_DATA",

  // SectionMaster actions
  SET_SECTION_MANAGER: "SET_SECTION_MANAGER",
  SET_CURRENT_SECTION_DATA: "SET_CURRENT_SECTION_DATA",
  SET_DEV_MODE: "SET_DEV_MODE",
  SET_UNDER_CONSTRUCTION: "SET_UNDER_CONSTRUCTION",

  // Enhanced SectionMaster actions
  SET_RIGHT_SIDEBAR_CONTENT: "SET_RIGHT_SIDEBAR_CONTENT",
  SET_SELECTED_ITEM: "SET_SELECTED_ITEM",
  SET_SELECTED_ELEMENT: "SET_SELECTED_ELEMENT",
  SET_CURRENT_SECTION: "SET_CURRENT_SECTION",
  SET_SECTION_DATA: "SET_SECTION_DATA",
  UPDATE_ITEM: "UPDATE_ITEM",
  UPDATE_SECTION_ADDONS: "UPDATE_SECTION_ADDONS",
  UPDATE_SECTION_ELEMENTS: "UPDATE_SECTION_ELEMENTS",
  SELECT_ELEMENT: "SELECT_ELEMENT",
};

// Reducer function
function dashboardReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_PIPELINES:
      return { ...state, pipelines: action.payload };

    case actionTypes.ADD_PIPELINE:
      return {
        ...state,
        pipelines: [...state.pipelines, action.payload],
      };

    case actionTypes.UPDATE_PIPELINE:
      return {
        ...state,
        pipelines: state.pipelines.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case actionTypes.DELETE_PIPELINE:
      return {
        ...state,
        pipelines: state.pipelines.filter((p) => p.id !== action.payload),
      };

    case actionTypes.SET_ACTIVE_MATCHES:
      return { ...state, activeMatches: action.payload };

    case actionTypes.ADD_MATCH:
      return {
        ...state,
        activeMatches: [...state.activeMatches, action.payload],
      };

    case actionTypes.UPDATE_MATCH:
      return {
        ...state,
        activeMatches: state.activeMatches.map((m) =>
          m.id === action.payload.id ? action.payload : m
        ),
      };

    case actionTypes.REMOVE_MATCH:
      return {
        ...state,
        activeMatches: state.activeMatches.filter(
          (m) => m.id !== action.payload
        ),
      };

    case actionTypes.SET_SELECTED_SECTION:
      console.log(`🎯 REDUCER: Mudando seção para ${action.payload}`);
      return {
        ...state,
        selectedSection: action.payload,
        rightSidebarContent: null,
        isCreating: false,
      };

    case actionTypes.SET_SELECTED_PIPELINE:
      return { ...state, selectedPipeline: action.payload };

    case actionTypes.SET_SELECTED_MATCH:
      return { ...state, selectedMatch: action.payload };

    case actionTypes.SET_RIGHT_SIDEBAR:
      return { ...state, rightSidebarContent: action.payload };

    case actionTypes.SET_IS_CREATING:
      return { ...state, isCreating: action.payload };

    case actionTypes.SET_SOCKET:
      return { ...state, socket: action.payload };

    case actionTypes.SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };

    case actionTypes.UPDATE_PROVIDER:
      return {
        ...state,
        providers: {
          ...state.providers,
          [action.payload.type]: {
            ...state.providers[action.payload.type],
            ...action.payload.data,
          },
        },
      };

    case actionTypes.SET_USER:
      return { ...state, user: action.payload };

    case actionTypes.SET_USER_ROLES:
      return { ...state, userRoles: action.payload };

    case actionTypes.SET_USER_ADDONS:
      return { ...state, userAddons: action.payload };

    case actionTypes.SET_SYSTEM_HEALTH:
      return { ...state, systemHealth: action.payload };

    case actionTypes.SET_PIPELINE_METRICS:
      return { ...state, pipelineMetrics: action.payload };

    case actionTypes.SET_DEBUG_DATA:
      return {
        ...state,
        debugData: { ...state.debugData, ...action.payload },
      };

    // SectionMaster cases
    case actionTypes.SET_SECTION_MANAGER:
      return { ...state, sectionManager: action.payload };

    case actionTypes.SET_CURRENT_SECTION_DATA:
      return { ...state, currentSectionData: action.payload };

    case actionTypes.SET_DEV_MODE:
      return { ...state, devMode: action.payload };

    case actionTypes.SET_UNDER_CONSTRUCTION:
      return { ...state, underConstruction: action.payload };

    // Enhanced SectionMaster cases
    case actionTypes.SET_RIGHT_SIDEBAR_CONTENT:
      return { ...state, rightSidebarContent: action.payload };

    case actionTypes.SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.payload };

    case actionTypes.SET_SELECTED_ELEMENT:
      return { ...state, selectedElement: action.payload };

    case actionTypes.SET_CURRENT_SECTION:
      return { ...state, currentSection: action.payload };

    case actionTypes.SET_SECTION_DATA:
      return {
        ...state,
        sectionData: {
          ...state.sectionData,
          [action.payload.sectionId]: action.payload.data,
        },
      };

    case actionTypes.UPDATE_ITEM:
      return { ...state, selectedItem: action.payload.item };

    case actionTypes.UPDATE_SECTION_ADDONS:
      const { sectionId: addonSectionId, addons } = action.payload;
      return {
        ...state,
        sectionData: {
          ...state.sectionData,
          [`${addonSectionId}_addons`]: addons,
        },
      };

    case actionTypes.UPDATE_SECTION_ELEMENTS:
      const { sectionId: elementSectionId, elements } = action.payload;
      return {
        ...state,
        sectionData: {
          ...state.sectionData,
          [`${elementSectionId}_elements`]: elements,
        },
      };

    case actionTypes.SELECT_ELEMENT:
      return {
        ...state,
        selectedElement: action.payload.element,
        rightSidebarContent: action.payload.element
          ? "element-config"
          : "default",
      };

    default:
      return state;
  }
}

// Create context
const DashboardContext = createContext();

// Custom hook to use the dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  // Debug: verificar se dispatch está presente (apenas log de erro)
  if (!context.dispatch) {
    console.error(
      "❌ useDashboard: dispatch não está presente no contexto",
      context
    );
  }

  return context;
}

// Provider component
export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Initialize SectionManager
  useEffect(() => {
    const initSectionManager = async () => {
      const sectionManager = getSectionManager();

      try {
        console.log("🎯 Iniciando SectionManager...");

        // Set configuration first
        sectionManager.setDevMode(true);
        sectionManager.setUnderConstruction(false);
        sectionManager.setUserPlan("tier3");

        // Then initialize
        await sectionManager.initialize();

        dispatch({
          type: actionTypes.SET_SECTION_MANAGER,
          payload: sectionManager,
        });

        console.log("🎯 SectionManager integrado ao DashboardContext");
        console.log(
          "📊 Seções disponíveis:",
          sectionManager.getAccessibleSections().length
        );
      } catch (error) {
        console.error("❌ Erro ao inicializar SectionManager:", error);
      }
    };

    initSectionManager();
  }, []);

  // Socket.IO connection for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      dispatch({ type: actionTypes.SET_CONNECTION_STATUS, payload: true });
      dispatch({ type: actionTypes.SET_SOCKET, payload: socket });
      console.log("🔌 Connected to DeckEngine server");
    });

    socket.on("disconnect", () => {
      dispatch({ type: actionTypes.SET_CONNECTION_STATUS, payload: false });
      console.log("🔌 Disconnected from DeckEngine server");
    });

    // Real-time match updates
    socket.on("match:started", (match) => {
      dispatch({ type: actionTypes.ADD_MATCH, payload: match });
      toast.success(`⚔️ Match iniciado: ${match.deckName}`);
    });

    socket.on("match:updated", (match) => {
      dispatch({ type: actionTypes.UPDATE_MATCH, payload: match });
    });

    socket.on("match:completed", (match) => {
      dispatch({ type: actionTypes.UPDATE_MATCH, payload: match });
      if (match.success) {
        toast.success(`🏆 Victory: ${match.deckName}`);
      } else {
        toast.error(`💥 Defeat: ${match.deckName}`);
      }
    });

    socket.on("match:error", (match) => {
      dispatch({ type: actionTypes.UPDATE_MATCH, payload: match });
      toast.error(`❌ Error: ${match.error}`);
    });

    // System health updates
    socket.on("system:health", (health) => {
      dispatch({ type: actionTypes.SET_SYSTEM_HEALTH, payload: health });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // API helper functions
  const api = {
    async get(endpoint) {
      try {
        const response = await fetch(`/api/deckengine${endpoint}`);
        return await response.json();
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Erro na comunicação com o servidor");
        throw error;
      }
    },

    async post(endpoint, data) {
      try {
        const response = await fetch(`/api/deckengine${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return await response.json();
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Erro na comunicação com o servidor");
        throw error;
      }
    },

    async put(endpoint, data) {
      try {
        const response = await fetch(`/api/deckengine${endpoint}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return await response.json();
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Erro na comunicação com o servidor");
        throw error;
      }
    },

    async delete(endpoint) {
      try {
        const response = await fetch(`/api/deckengine${endpoint}`, {
          method: "DELETE",
        });
        return await response.json();
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Erro na comunicação com o servidor");
        throw error;
      }
    },
  };

  // Action creators
  const actions = {
    // Pipeline actions
    async loadPipelines() {
      try {
        const response = await api.get("/decks");
        dispatch({
          type: actionTypes.SET_PIPELINES,
          payload: response.data || [],
        });
      } catch (error) {
        console.error("Failed to load pipelines:", error);
      }
    },

    async createPipeline(pipelineData) {
      try {
        const response = await api.post("/decks", pipelineData);
        dispatch({ type: actionTypes.ADD_PIPELINE, payload: response.data });
        toast.success("🎮 Pipeline criado com sucesso!");
        return response.data;
      } catch (error) {
        toast.error("Erro ao criar pipeline");
        throw error;
      }
    },

    async executePipeline(pipelineName, payload = {}) {
      try {
        const response = await api.post("/matches", {
          deckName: pipelineName,
          payload,
          waitForResult: false,
        });
        toast.success(`⚔️ Executando pipeline: ${pipelineName}`);
        return response.data;
      } catch (error) {
        toast.error("Erro ao executar pipeline");
        throw error;
      }
    },

    // UI actions
    setSelectedSection(section) {
      console.log(`🎯 ACTION: Navegando para seção: ${section}`);
      dispatch({ type: actionTypes.SET_SELECTED_SECTION, payload: section });

      // Carregar dados da seção automaticamente
      if (state.sectionManager?.initialized) {
        try {
          console.log(
            `📊 SectionManager disponível, carregando dados para: ${section}`
          );
          const data = state.sectionManager.getSectionData(section);
          dispatch({
            type: actionTypes.SET_CURRENT_SECTION_DATA,
            payload: data,
          });
          console.log(
            `📊 Dados carregados para ${section}:`,
            data?.length || 0,
            "itens"
          );
        } catch (error) {
          console.error(
            `❌ Erro ao carregar dados da seção ${section}:`,
            error
          );
        }
      } else {
        console.log(`⚠️ SectionManager não inicializado ainda`);
      }
    },

    setSelectedPipeline(pipeline) {
      dispatch({ type: actionTypes.SET_SELECTED_PIPELINE, payload: pipeline });
      dispatch({
        type: actionTypes.SET_RIGHT_SIDEBAR,
        payload: { type: "pipeline-details", data: pipeline },
      });
    },

    setSelectedMatch(match) {
      dispatch({ type: actionTypes.SET_SELECTED_MATCH, payload: match });
      dispatch({
        type: actionTypes.SET_RIGHT_SIDEBAR,
        payload: { type: "match-debugger", data: match },
      });
    },

    setRightSidebar(content) {
      dispatch({ type: actionTypes.SET_RIGHT_SIDEBAR, payload: content });
    },

    // Enhanced actions for RightSidebar
    setRightSidebarContent(content) {
      dispatch({
        type: actionTypes.SET_RIGHT_SIDEBAR_CONTENT,
        payload: content,
      });
    },

    setSelectedItem(item) {
      dispatch({ type: actionTypes.SET_SELECTED_ITEM, payload: item });
    },

    setSelectedElement(element) {
      dispatch({ type: actionTypes.SET_SELECTED_ELEMENT, payload: element });
    },

    setCurrentSection(section) {
      dispatch({ type: actionTypes.SET_CURRENT_SECTION, payload: section });
    },

    setIsCreating(isCreating) {
      dispatch({ type: actionTypes.SET_IS_CREATING, payload: isCreating });
      if (isCreating) {
        dispatch({
          type: actionTypes.SET_RIGHT_SIDEBAR,
          payload: {
            type: "create-form",
            data: { section: state.selectedSection },
          },
        });
      }
    },

    // System actions
    async loadSystemHealth() {
      try {
        const response = await api.get("/system/health/detailed");
        dispatch({ type: actionTypes.SET_SYSTEM_HEALTH, payload: response });
      } catch (error) {
        console.error("Failed to load system health:", error);
      }
    },

    async loadPipelineMetrics() {
      try {
        const response = await api.get("/system/metrics");
        dispatch({
          type: actionTypes.SET_PIPELINE_METRICS,
          payload: response.data || {},
        });
      } catch (error) {
        console.error("Failed to load pipeline metrics:", error);
      }
    },

    // Provider actions
    updateProvider(type, data) {
      dispatch({ type: actionTypes.UPDATE_PROVIDER, payload: { type, data } });
    },

    // SectionMaster actions
    loadSectionData(sectionId) {
      if (state.sectionManager) {
        const data = state.sectionManager.getSectionData(sectionId);
        dispatch({ type: actionTypes.SET_CURRENT_SECTION_DATA, payload: data });
        console.log(`📊 Loaded data for section: ${sectionId}`, data);
      }
    },

    toggleDevMode() {
      const newDevMode = !state.devMode;
      dispatch({ type: actionTypes.SET_DEV_MODE, payload: newDevMode });
      if (state.sectionManager) {
        state.sectionManager.setDevMode(newDevMode);
      }
      toast.success(`DevMode ${newDevMode ? "ativado" : "desativado"}`);
    },

    toggleUnderConstruction() {
      const newUnderConstruction = !state.underConstruction;
      dispatch({
        type: actionTypes.SET_UNDER_CONSTRUCTION,
        payload: newUnderConstruction,
      });
      if (state.sectionManager) {
        state.sectionManager.setUnderConstruction(newUnderConstruction);
      }
      toast.success(
        `UnderConstruction ${newUnderConstruction ? "ativado" : "desativado"}`
      );
    },
  };

  // Context value
  const value = {
    state,
    dispatch,
    actions,
    api,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
