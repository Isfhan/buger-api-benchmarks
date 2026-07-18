/** A framework-agnostic app the battle runner can start/stop on a port. */
export interface FrameworkApp {
  start(port: number): void | Promise<void>;
  stop(): void | Promise<void>;
}

/** A single HTTP target (endpoint) bombarded for every contestant. */
export interface BattleTarget {
  method: string;
  path: string;
  body?: string;
  headers?: Record<string, string>;
}

/**
 * Contestants in a battle scenario. Each is a factory returning a fresh
 * `FrameworkApp` so the runner can start/stop them independently, and every
 * factory must implement the same route shape for a fair comparison.
 */
export interface BattleContestants {
  burger: () => FrameworkApp;
  elysia: () => FrameworkApp;
  hono: () => FrameworkApp;
  express: () => FrameworkApp;
}

/**
 * A route specification shared across all contestants so each framework
 * implements the identical behavior. This keeps comparisons about framework
 * overhead, not application logic.
 */
export type BattleRouteSpec =
  | { kind: 'static'; path: string; response: unknown }
  | { kind: 'json'; path: string; response: unknown }
  | { kind: 'param'; path: string; response: unknown }
  | { kind: 'middleware'; count: number; path: string; response: unknown }
  | { kind: 'validation'; path: string; response: unknown };

export type ContestantName = keyof BattleContestants;

/** The ordered list of contestants, used for stable report columns. */
export const CONTESTANT_ORDER: ContestantName[] = [
  'burger',
  'elysia',
  'hono',
  'express',
];

export const CONTESTANT_LABEL: Record<ContestantName, string> = {
  burger: 'BurgerAPI',
  elysia: 'Elysia',
  hono: 'Hono',
  express: 'Express',
};

/**
 * A cross-framework comparison scenario. Unlike a core `Scenario` (which is
 * BurgerAPI-only), a `BattleScenario` declares a contestant per framework and a
 * single shared target hit on each.
 */
export interface BattleScenario {
  id: string;
  group: string;
  description: string;
  contestants: BattleContestants;
  target: BattleTarget;
}
