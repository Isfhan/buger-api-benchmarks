import { Burger, setDir } from 'burger-api';
import type { Scenario } from '../../src/types';

/**
 * Phase 1 benchmark: exercises the Route Module pipeline (Directory Scanner →
 * Module Loader → RouteModule → Compiler) via the dev `apiDir` path, NOT the
 * prebuilt `apiRoutes` prod path. The per-request dispatch path is identical to
 * the prod routing scenarios, so this measures the same hot path while proving
 * the file-based discovery pipeline boots and serves correctly under load.
 */
export const phase1DevStatic: Scenario = {
  id: 'phase1/dev-static',
  group: 'phase1',
  description:
    'Static GET route served through the Phase 1 file-based Route Module pipeline (apiDir)',
  createApp: () =>
    new Burger({
      apiDir: setDir(__dirname, 'fixtures/static'),
    }),
  targets: [{ method: 'GET', path: '/bench/phase1/static' }],
};
