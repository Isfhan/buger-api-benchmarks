/**
 * Framework versions shown in the battle report header. Read from each
 * installed package's `package.json` at runtime so the header always matches
 * what actually ran. Bump versions in `package.json` (then `bun install`).
 */
export interface FrameworkVersions {
  elysia: string;
  elysia2: string;
  hono: string;
  express: string;
  zodValidator: string;
}

async function readVersion(pkg: string): Promise<string> {
  try {
    const file = Bun.file(`node_modules/${pkg}/package.json`);
    if (!(await file.exists())) return 'unknown';
    const parsed = JSON.parse(await file.text()) as { version?: string };
    return parsed.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function collectFrameworkVersions(): Promise<FrameworkVersions> {
  const [elysia, elysia2, hono, express, zodValidator] = await Promise.all([
    readVersion('elysia'),
    readVersion('elysia2'),
    readVersion('hono'),
    readVersion('express'),
    readVersion('@hono/zod-validator'),
  ]);
  return { elysia, elysia2, hono, express, zodValidator };
}
