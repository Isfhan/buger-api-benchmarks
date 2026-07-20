import { Burger, setDir } from 'burger-api';
import type { Scenario } from '../../src/types';

/**
 * Phase 1 benchmark: dynamic (`:param`) route served through the file-based
 * Route Module pipeline (apiDir). Mirrors `routing/dynamic` but via the dev
 * discovery path, proving the compiler emits the same trie-dispatched handler.
 */
export const phase1DevDynamic: Scenario = {
  id: 'phase1/dev-dynamic',
  group: 'phase1',
  description:
    'Dynamic GET route served through the Phase 1 file-based Route Module pipeline (apiDir)',
  createApp: () =>
    new Burger({
      apiDir: setDir(__dirname, 'fixtures/dynamic'),
    }),
  targets: [{ method: 'GET', path: '/bench/phase1/users/42' }],
};
