import Elysia from 'elysia';
import type { BattleRouteSpec, FrameworkApp } from '../types';

/**
 * Builds an Elysia app for a battle route spec. Elysia runs natively on Bun,
 * so this is a faithful, same-runtime comparison.
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
    case 'middleware':
      for (let i = 0; i < spec.count; i++) {
        app.onRequest(() => {});
      }
      app.get(spec.path, () => spec.response as object);
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
