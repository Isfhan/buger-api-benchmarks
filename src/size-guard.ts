/**
 * Bundle-size guard for BurgerAPI.
 *
 * Bundles two minimal production-style apps (minified, target bun) against
 * the linked local `burger-api` package and asserts size thresholds:
 *
 * - `app-core`: Burger + toFetchHandler, no schemas. Guards the framework
 *   core (entry) and detects heavy eager dependencies leaking into the
 *   import graph (e.g. zod, which is ~333 KB minified, must stay lazy).
 * - `app-schema`: same app with a Zod query/body schema. Guards the full
 *   schema path (adapters, coercer, OpenAPI generator).
 *
 * The guard asserts on both the entry chunk (startup cost) and the total
 * output (everything that gets shipped). Thresholds carry headroom for
 * dependency drift; a breach means bundle size regressed — fail loud.
 *
 * Usage:
 *   bun run size            # table output, exit 1 on breach
 *   bun run size --json    # machine-readable output for CI
 */

const CACHE_DIR = import.meta.dir + '/../node_modules/.cache/size-guard';
const OUT_DIR = CACHE_DIR + '/out';

const APP_CORE = `
import { Burger, toFetchHandler } from 'burger-api';

const apiRoutes = [
  {
    path: '/api/hello/:name',
    handlers: {
      GET: async (ctx: any) => Response.json({ hello: ctx.params.name }),
      OPTIONS: () => new Response(null, { status: 204 }),
    },
    isWildcard: false,
  },
];

const app = new Burger({ apiRoutes, debug: false });
export default { fetch: toFetchHandler(app) };
`;

const APP_SCHEMA = `
import { Burger, toFetchHandler } from 'burger-api';
import { z } from 'zod';

const schema = {
  get: { query: z.object({ q: z.string().optional() }) },
  post: { body: z.object({ name: z.string() }) },
};

const apiRoutes = [
  {
    path: '/api/hello/:name',
    handlers: {
      GET: async (ctx: any) => Response.json({ hello: ctx.params.name }),
      POST: async (ctx: any) => Response.json({ ok: true }),
      OPTIONS: () => new Response(null, { status: 204 }),
    },
    schema,
    isWildcard: false,
  },
];

const app = new Burger({ apiRoutes, debug: false });
export default { fetch: toFetchHandler(app) };
`;

/** Entry chunk budget (minified bytes) — framework core must stay tiny. */
const LIMITS = {
  'app-core': { entry: 55_000, total: 560_000 },
  'app-schema': { entry: 410_000, total: 980_000 },
} as const;

interface BundleResult {
  entryBytes: number;
  totalBytes: number;
}

async function buildApp(name: string, source: string): Promise<BundleResult> {
  const entryPath = `${CACHE_DIR}/${name}.ts`;
  await Bun.write(entryPath, source);

  const result = await Bun.build({
    entrypoints: [entryPath],
    outdir: OUT_DIR,
    minify: true,
    target: 'bun',
    splitting: true,
    root: CACHE_DIR,
  });
  if (!result.success) {
    throw new Error(
      `[size-guard] bundle of ${name} failed: ` +
        JSON.stringify(result.logs, null, 2)
    );
  }

  let entryBytes = 0;
  let totalBytes = 0;
  for (const output of result.outputs) {
    totalBytes += output.size;
    if (output.kind === 'entry-point') {
      entryBytes += output.size;
    }
  }
  return { entryBytes, totalBytes };
}

function fmt(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export async function runSizeGuard(): Promise<boolean> {
  const json = process.argv.includes('--json');
  const rows: {
    app: string;
    entryBytes: number;
    entryLimit: number;
    totalBytes: number;
    totalLimit: number;
  }[] = [];

  await Bun.write(CACHE_DIR + '/.keep', '');

  for (const [name, source] of [
    ['app-core', APP_CORE],
    ['app-schema', APP_SCHEMA],
  ] as const) {
    const limits = LIMITS[name];
    const { entryBytes, totalBytes } = await buildApp(name, source);
    rows.push({
      app: name,
      entryBytes,
      entryLimit: limits.entry,
      totalBytes,
      totalLimit: limits.total,
    });
  }

  const breached = rows.filter(
    (r) => r.entryBytes > r.entryLimit || r.totalBytes > r.totalLimit
  );

  if (json) {
    console.log(
      JSON.stringify(
        {
          ok: breached.length === 0,
          rows: rows.map((r) => ({
            app: r.app,
            entry: r.entryBytes,
            entryLimit: r.entryLimit,
            total: r.totalBytes,
            totalLimit: r.totalLimit,
          })),
        },
        null,
        2
      )
    );
  } else {
    console.log('Bundle size guard (minified, target bun)');
    console.log('─'.repeat(64));
    for (const r of rows) {
      const entryOk = r.entryBytes <= r.entryLimit;
      const totalOk = r.totalBytes <= r.totalLimit;
      console.log(
        `  ${r.app.padEnd(10)} entry ${fmt(r.entryBytes).padStart(9)} / ${fmt(r.entryLimit).padStart(9)}  ${entryOk ? 'ok' : 'BREACH'}`
      );
      console.log(
        `  ${''.padEnd(10)} total ${fmt(r.totalBytes).padStart(9)} / ${fmt(r.totalLimit).padStart(9)}  ${totalOk ? 'ok' : 'BREACH'}`
      );
    }
    console.log('─'.repeat(64));
    console.log(
      breached.length === 0
        ? 'Size guard: PASS'
        : `Size guard: FAIL (${breached.length} app(s) over budget)`
    );
  }

  return breached.length === 0;
}

if (import.meta.main) {
  const ok = await runSizeGuard();
  process.exit(ok ? 0 : 1);
}
