import { createApp as burgerApp } from './challengers/burger';
import { createApp as elysiaApp } from './challengers/elysia';
import { createApp as elysia2App } from './challengers/elysia2';
import { createApp as honoApp } from './challengers/hono';
import { createApp as expressApp } from './challengers/express';
import type { BattleContestants, BattleRouteSpec } from './types';

/**
 * Builds the contestant factories for a shared route spec. Every scenario uses
 * this so all contestants implement the identical route shape.
 */
export function contestantsFor(spec: BattleRouteSpec): BattleContestants {
  return {
    burger: () => burgerApp(spec),
    elysia: () => elysiaApp(spec),
    elysia2: () => elysia2App(spec),
    hono: () => honoApp(spec),
    express: () => expressApp(spec),
  };
}
