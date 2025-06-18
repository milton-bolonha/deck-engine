/**
 * 🎮 Deck Handlers
 * Handlers para operações de decks
 */

const DeckEngine = require("../../index.js");
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
} = require("../utils/response");
const { asyncHandler } = require("../middlewares/error-handler");

// Instância única do DeckEngine
const engine = new DeckEngine();

/**
 * GET /api/decks
 * Lista todos os decks
 */
const listDecks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const globalStatus = engine.getGlobalStatus();
  let decks = globalStatus.decks.names.map((name) => {
    const deckStatus = engine.getDeckStatus(name);
    return {
      name,
      ...deckStatus,
      health: deckStatus.matches.defeats === 0 ? "healthy" : "warning",
    };
  });

  // Filtrar por status se especificado
  if (status) {
    decks = decks.filter((deck) => deck.health === status);
  }

  // Implementar paginação simples
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedDecks = decks.slice(startIndex, endIndex);

  successResponse(res, {
    decks: paginatedDecks,
    total: decks.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(decks.length / limit),
  });
});

/**
 * POST /api/decks
 * Cria um novo deck
 */
const createDeck = asyncHandler(async (req, res) => {
  const { name, config = {} } = req.body;

  // Validação
  if (!name) {
    return validationErrorResponse(res, [
      {
        field: "name",
        message: "Nome do deck é obrigatório",
      },
    ]);
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    return validationErrorResponse(res, [
      {
        field: "name",
        message:
          "Nome deve conter apenas letras, números, hífens e underscores",
      },
    ]);
  }

  // Verificar se deck já existe
  try {
    const existingDeck = engine.getDeckStatus(name);
    if (existingDeck) {
      return errorResponse(res, `Deck '${name}' já existe`, 409);
    }
  } catch (error) {
    // Deck não existe, prosseguir
  }

  try {
    // Criar deck
    const deck = engine.createDeck(name, config);
    const deckStatus = engine.getDeckStatus(name);

    successResponse(
      res,
      {
        deck: {
          name,
          config,
          ...deckStatus,
          created: new Date().toISOString(),
        },
      },
      201
    );
  } catch (error) {
    errorResponse(res, `Erro ao criar deck: ${error.message}`, 500);
  }
});

/**
 * GET /api/decks/:name
 * Obtém detalhes de um deck específico
 */
const getDeck = asyncHandler(async (req, res) => {
  const { name } = req.params;

  try {
    const deckStatus = engine.getDeckStatus(name);

    if (!deckStatus) {
      return errorResponse(res, `Deck '${name}' não encontrado`, 404);
    }

    successResponse(res, {
      deck: {
        name,
        ...deckStatus,
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    errorResponse(res, `Deck '${name}' não encontrado`, 404);
  }
});

/**
 * DELETE /api/decks/:name
 * Remove um deck
 */
const deleteDeck = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { force = false } = req.query;

  try {
    const deckStatus = engine.getDeckStatus(name);

    if (!deckStatus) {
      return errorResponse(res, `Deck '${name}' não encontrado`, 404);
    }

    // Verificar se há matches ativos
    if (deckStatus.matches.active > 0 && !force) {
      return errorResponse(
        res,
        `Deck '${name}' tem matches ativos. Use ?force=true para forçar remoção`,
        409
      );
    }

    // TODO: Implementar remoção de deck na Fase 2

    successResponse(res, {
      message: `Deck '${name}' marcado para remoção`,
      note: "Remoção física será implementada na Fase 2",
      deck: { name, ...deckStatus },
    });
  } catch (error) {
    errorResponse(res, `Deck '${name}' não encontrado`, 404);
  }
});

/**
 * POST /api/decks/:name/validate
 * Valida um deck
 */
const validateDeck = asyncHandler(async (req, res) => {
  const { name } = req.params;

  try {
    const deckStatus = engine.getDeckStatus(name);

    if (!deckStatus) {
      return errorResponse(res, `Deck '${name}' não encontrado`, 404);
    }

    // Validações básicas
    const validations = [];

    if (deckStatus.cardCount === 0) {
      validations.push({
        level: "warning",
        message: "Deck não tem cards configurados",
      });
    }

    if (deckStatus.matches.defeats > deckStatus.matches.victories) {
      validations.push({
        level: "error",
        message: "Deck tem mais derrotas que vitórias",
      });
    }

    const isValid = validations.filter((v) => v.level === "error").length === 0;

    successResponse(res, {
      deck: name,
      valid: isValid,
      score: isValid ? "healthy" : "unhealthy",
      validations,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    errorResponse(res, `Deck '${name}' não encontrado`, 404);
  }
});

module.exports = {
  listDecks,
  createDeck,
  getDeck,
  deleteDeck,
  validateDeck,
};
