import express from 'express';
import type { BattleRouteSpec, FrameworkApp } from '../types';

/**
 * Builds an Express app for a battle route spec.
 *
 * NOTE: Express is Node-based. Per the battle module's "all on Bun" decision,
 * it runs here under Bun's Node compatibility layer (not native Node). Its
 * numbers therefore reflect "Express on Bun's Node compatibility" and will be
 * footnoted as such in the report. This is intentionally not hidden.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = express();
  app.use(express.json());

  switch (spec.kind) {
    case 'static':
    case 'json':
      app.get(spec.path, (_req, res) => res.json(spec.response));
      break;
    case 'param':
      app.get(spec.path, (req, res) =>
        res.json({ id: req.params.id, ...(spec.response as object) }),
      );
      break;
    case 'middleware':
      for (let i = 0; i < spec.count; i++) {
        app.use((_req, _res, next) => next());
      }
      app.get(spec.path, (_req, res) => res.json(spec.response));
      break;
    case 'validation':
      app.post(spec.path, (req, res) => res.json(req.body as object));
      break;
  }

  let server: ReturnType<typeof app.listen> | undefined;
  return {
    start(port: number) {
      server = app.listen(port);
    },
    stop() {
      server?.close();
    },
  };
}
