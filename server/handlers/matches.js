/**
 * ⚔️ Match Handlers
 * Handlers para execução de matches
 */

const DeckEngine = require("../../index.js");
const {
  successResponse,
  errorResponse,
  validationErrorResponse,
  executionResponse,
  batchResponse,
} = require("../utils/response");
const { asyncHandler } = require("../middlewares/error-handler");

// Instância única do DeckEngine
const engine = new DeckEngine();

/**
 * POST /api/matches
 * Executa um match
 */
const executeMatch = asyncHandler(async (req, res) => {
  const {
    deckName,
    payload = {},
    options = {},
    waitForResult = true,
  } = req.body;

  // Validação
  if (!deckName) {
    return validationErrorResponse(res, [
      {
        field: "deckName",
        message: "Nome do deck é obrigatório",
      },
    ]);
  }

  // Verificar se deck existe
  try {
    const deckStatus = engine.getDeckStatus(deckName);
    if (!deckStatus) {
      return errorResponse(res, `Deck '${deckName}' não encontrado`, 404);
    }
  } catch (error) {
    return errorResponse(res, `Deck '${deckName}' não encontrado`, 404);
  }

  try {
    const startTime = Date.now();

    if (waitForResult) {
      // Executar e aguardar resultado
      const result = await engine.playAndWait(deckName, payload, options);
      const duration = Date.now() - startTime;

      executionResponse(res, {
        id: `${deckName}-${Date.now()}`,
        status: "completed",
        result,
        duration: `${duration}ms`,
        deck: deckName,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
      });
    } else {
      // Apenas iniciar execução
      const match = await engine.playMatch(deckName, payload, options);

      executionResponse(
        res,
        {
          id: match.matchId,
          status: "queued",
          deck: deckName,
          startedAt: new Date().toISOString(),
        },
        202
      );
    }
  } catch (error) {
    executionResponse(
      res,
      {
        id: `${deckName}-error-${Date.now()}`,
        status: "failed",
        deck: deckName,
        error: error.message,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      422
    );
  }
});

/**
 * POST /api/matches/batch
 * Executa múltiplos matches em lote
 */
const executeBatch = asyncHandler(async (req, res) => {
  const { deckName, payloads = [], options = {} } = req.body;

  // Validação
  if (!deckName) {
    return validationErrorResponse(res, [
      {
        field: "deckName",
        message: "Nome do deck é obrigatório",
      },
    ]);
  }

  if (!Array.isArray(payloads) || payloads.length === 0) {
    return validationErrorResponse(res, [
      {
        field: "payloads",
        message: "payloads deve ser um array não vazio",
      },
    ]);
  }

  if (payloads.length > 100) {
    return validationErrorResponse(res, [
      {
        field: "payloads",
        message: "Máximo de 100 payloads por lote",
      },
    ]);
  }

  // Verificar se deck existe
  try {
    const deckStatus = engine.getDeckStatus(deckName);
    if (!deckStatus) {
      return errorResponse(res, `Deck '${deckName}' não encontrado`, 404);
    }
  } catch (error) {
    return errorResponse(res, `Deck '${deckName}' não encontrado`, 404);
  }

  try {
    const startTime = Date.now();

    const results = await engine.playMatches(deckName, payloads, {
      waitAll: true,
      ...options,
    });

    const duration = Date.now() - startTime;

    // Formatar resultados
    const formattedResults = results.map((result, index) => ({
      index,
      payload: payloads[index],
      success: !result.error,
      result: result.error ? null : result,
      error: result.error || null,
    }));

    batchResponse(res, formattedResults, {
      duration: `${duration}ms`,
      deck: deckName,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    errorResponse(res, `Erro na execução em lote: ${error.message}`, 422);
  }
});

/**
 * GET /api/matches/:matchId
 * Obtém status de um match específico
 */
const getMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { timeout = 30000 } = req.query;

  try {
    const result = await engine.waitForMatch(matchId, parseInt(timeout));

    executionResponse(res, {
      id: matchId,
      status: "completed",
      result,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    executionResponse(
      res,
      {
        id: matchId,
        status: "failed",
        error: "Match não encontrado ou timeout",
        message: error.message,
      },
      404
    );
  }
});

/**
 * DELETE /api/matches/:matchId
 * Cancela um match
 */
const cancelMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  // TODO: Implementar cancelamento de match na Fase 2

  successResponse(res, {
    message: `Match ${matchId} marcado para cancelamento`,
    note: "Cancelamento será implementado na Fase 2",
    matchId,
    status: "cancel_requested",
  });
});

/**
 * POST /api/matches/:matchId/retry
 * Reexecuta um match falhado
 */
const retryMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { newPayload } = req.body;

  // TODO: Implementar retry de match na Fase 2

  successResponse(res, {
    message: `Match ${matchId} será reexecutado`,
    note: "Retry será implementado na Fase 2",
    originalMatchId: matchId,
    newMatchId: `retry-${matchId}-${Date.now()}`,
    payload: newPayload || "original payload",
  });
});

module.exports = {
  executeMatch,
  executeBatch,
  getMatch,
  cancelMatch,
  retryMatch,
};
