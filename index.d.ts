/**
 * DeckEngine - Sistema de Pipelines Assíncronos
 * TypeScript Definitions
 */

export interface CardOptions {
  retries?: number;
  timeout?: number;
  condition?: () => boolean | Promise<boolean>;
  rollback?: (context: any) => void | Promise<void>;
  idempotent?: boolean;
  metadata?: any;
}

export interface Card {
  name: string;
  action: (context: any) => any | Promise<any>;
  options?: CardOptions;
}

export interface DeckOptions {
  concurrency?: number;
  retryDelay?: number;
  maxRetries?: number;
  timeout?: number;
  onCardStart?: (card: Card, context: any) => void;
  onCardComplete?: (card: Card, result: any, context: any) => void;
  onCardError?: (card: Card, error: Error, context: any) => void;
  metadata?: any;
}

export interface MatchOptions {
  priority?: number;
  timeout?: number;
  retries?: number;
  context?: any;
  metadata?: any;
}

export interface ArenaOptions {
  maxConcurrency?: number;
  processingInterval?: number;
  priorities?: boolean;
}

export interface EngineOptions {
  arena?: ArenaOptions;
  defaultDeckOptions?: DeckOptions;
  enableMetrics?: boolean;
  enableEvents?: boolean;
}

export class Deck {
  constructor(name: string, options?: DeckOptions);

  addCard(
    name: string,
    action: (context: any) => any | Promise<any>,
    options?: CardOptions
  ): this;
  removeCard(name: string): boolean;
  getCard(name: string): Card | undefined;
  getAllCards(): Card[];
  clone(newName?: string): Deck;
  toJSON(): any;

  static fromJSON(data: any): Deck;
}

export class Match {
  constructor(deck: Deck, options?: MatchOptions);

  execute(): Promise<any>;
  cancel(): void;
  getStatus(): string;
  getContext(): any;
  getResult(): any;
  getError(): Error | null;
}

export class Arena {
  constructor(options?: ArenaOptions);

  enqueue(match: Match): string;
  dequeue(): Match | null;
  cancel(matchId: string): boolean;
  getQueueSize(): number;
  getProcessingCount(): number;
  getStats(): any;
}

export class Events {
  on(event: string, handler: Function): void;
  off(event: string, handler?: Function): void;
  emit(event: string, ...args: any[]): void;
}

export class Metrics {
  getDeckStats(deckName: string): any;
  getCardStats(deckName: string, cardName: string): any;
  getPerformanceStats(): any;
  reset(): void;
}

export class Utils {
  static generateUUID(): string;
  static calculateRetryDelay(attempt: number, baseDelay: number): number;
  static delay(ms: number): Promise<void>;
}

export default class DeckEngine {
  constructor(options?: EngineOptions);

  createDeck(name: string, options?: DeckOptions): Deck;
  getDeck(name: string): Deck | undefined;
  removeDeck(name: string): boolean;
  getAllDecks(): Deck[];

  playMatch(deckName: string, options?: MatchOptions): Promise<any>;

  healthCheck(): any;
  cleanup(): boolean;

  getArena(): Arena;
  getEvents(): Events;
  getMetrics(): Metrics;
}

// Exportações nomeadas
export { DeckEngine, Deck, Match, Arena, Events, Metrics, Utils };

// Funções de conveniência
export function createEngine(options?: EngineOptions): DeckEngine;
export function createDeck(name: string, options?: DeckOptions): Deck;

// Versão
export const version: string;
