import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

/**
 * Dynamic route dispatched through the fetch FALLBACK path.
 * The trailing slash on the target makes Bun's native routes map miss
 * (it registered `/bench/opt/user/:id`), forcing Router.fetch dispatch —
 * the path WinterCG runtimes take for every dynamic request. This variant
 * pins the RADIX TRIE engine.
 */
export const optimizeFallbackTrie: Scenario = {
  id: 'optimize/fallback-trie',
  group: 'optimize',
  description:
    'Fallback dispatch, trie engine (dynamic :id via trailing-slash miss)',
  createApp: () =>
    new Burger({
      engine: 'trie',
      apiRoutes: [
        {
          path: '/bench/opt/user/:id',
          handlers: {
            GET: (req) => Response.json({ id: req.params!.id }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/opt/user/42/' }],
};

/**
 * Same shape as fallback-trie but with the REGEXP matcher engine —
 * the WinterCG fast-path candidate replacing trie traversal.
 */
export const optimizeFallbackRegex: Scenario = {
  id: 'optimize/fallback-regex',
  group: 'optimize',
  description:
    'Fallback dispatch, regex engine (dynamic :id via trailing-slash miss)',
  createApp: () =>
    new Burger({
      engine: 'regex',
      apiRoutes: [
        {
          path: '/bench/opt/user/:id',
          handlers: {
            GET: (req) => Response.json({ id: req.params!.id }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/opt/user/42/' }],
};

const HOOKS_APP = {
  hooks: {
    beforeRoute: [
      () => undefined,
      () => undefined,
    ],
    afterRoute: [
      (ctx: unknown) => {
        void ctx;
      },
    ],
  },
} as const;

/**
 * Route carrying 2 beforeRoute + 1 afterRoute hook through the standard
 * interpreter pipeline (jit OFF — the pre-optimization behavior).
 */
export const optimizeHooksInterpreter: Scenario = {
  id: 'optimize/hooks-interpreter',
  group: 'optimize',
  description: '2 forward hooks + 1 response hook, interpreter executor',
  createApp: () =>
    new Burger({
      jit: false,
      apiRoutes: [
        {
          path: '/bench/opt/hooks',
          ...HOOKS_APP,
          handlers: {
            GET: () => Response.json({ ok: true }),
          },
        },
      ] as never,
    }),
  targets: [{ method: 'GET', path: '/bench/opt/hooks' }],
};

/** Identical route/hook set with JIT HookPlan compilation enabled. */
export const optimizeHooksJit: Scenario = {
  id: 'optimize/hooks-jit',
  group: 'optimize',
  description: 'Same hooks, JIT-compiled HookPlan',
  createApp: () =>
    new Burger({
      jit: true,
      apiRoutes: [
        {
          path: '/bench/opt/hooks',
          ...HOOKS_APP,
          handlers: {
            GET: () => Response.json({ ok: true }),
          },
        },
      ] as never,
    }),
  targets: [{ method: 'GET', path: '/bench/opt/hooks' }],
};

/**
 * Handler that does NOT touch req.set — isolates the lazy-set exit probe
 * (pre-optimization: eager allocation + hasSetMutations scan per request).
 */
export const optimizeSetClean: Scenario = {
  id: 'optimize/set-clean',
  group: 'optimize',
  description: 'Handler never mutates the response (lazy-set fast path)',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/opt/clean',
          handlers: {
            GET: () => Response.json({ ok: true }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/opt/clean' }],
};

/**
 * 240 dynamic routes sharing literal prefixes — the shape where dispatch
 * strategy (trie descent vs compiled alternation) should diverge most.
 * Target hits a mid-tree param route via trailing-slash fallback.
 */
const MANY_ROUTES = Array.from({ length: 240 }, (_, i) => ({
  path: `/bench/opt/g${i % 12}/s${Math.floor(i / 12)}/item/:id`,
  handlers: {
    GET: (req: any) =>
      Response.json({ id: req.params.id }),
  },
}));

function manyRoutesApp(engine: 'trie' | 'regex'): Burger {
  return new Burger({
    engine,
    apiRoutes: [
      ...MANY_ROUTES,
      {
        path: '/bench/opt/target/:id',
        handlers: { GET: (req: any) => Response.json({ id: req.params!.id }) },
      },
    ] as never,
  });
}

export const optimizeManyTrie: Scenario = {
  id: 'optimize/many-trie',
  group: 'optimize',
  description: '241 dynamic routes, trie engine, mid-set target',
  createApp: () => manyRoutesApp('trie'),
  targets: [{ method: 'GET', path: '/bench/opt/target/77/' }],
};

export const optimizeManyRegex: Scenario = {
  id: 'optimize/many-regex',
  group: 'optimize',
  description: '241 dynamic routes, regex engine, mid-set target',
  createApp: () => manyRoutesApp('regex'),
  targets: [{ method: 'GET', path: '/bench/opt/target/77/' }],
};
