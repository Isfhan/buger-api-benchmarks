import Elysia from 'elysia-experimental';
import type { BattleRouteSpec, FrameworkApp } from '../types';

/**
 * Builds an Elysia 2 (elysia@experimental) app for a battle route spec.
 * Used for testing only, per the performance investigation. Elysia 2 ships the
 * Raikiri router and is the current upsteam baseline we compare against.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = new Elysia();

  switch (spec.kind) {
    case 'static':
    case 'json':
      app.get(spec.path, () => spec.response as object);
      break;
    case 'param':
      app.get(spec.path, (ctx: any) => ({ id: ctx.params.id, ...(spec.response as object) }));
      break;
    case 'validation':
      app.post(spec.path, (ctx: any) => ctx.body as object);
      break;
  }

  let server: ReturnType<typeof app.listen> | undefined;
  return {
    start(port: number) {
      server = app.listen(port);
    },
    stop() {
      server?.stop();
    },
  };
}
