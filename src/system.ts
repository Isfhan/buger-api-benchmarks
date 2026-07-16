import type { ReportMeta } from './types';

async function readFileText(path: string): Promise<string | null> {
  try {
    const file = Bun.file(path);
    if (!(await file.exists())) return null;
    return await file.text();
  } catch {
    return null;
  }
}

async function spawnText(args: string[]): Promise<string | null> {
  try {
    const proc = Bun.spawn(args, { stdout: 'pipe', stderr: 'pipe' });
    const text = await new Response(proc.stdout).text();
    await proc.exited;
    return text.trim();
  } catch {
    return null;
  }
}

async function detectCpu(): Promise<string> {
  if (process.platform === 'linux') {
    const txt = await readFileText('/proc/cpuinfo');
    if (txt) {
      const m = txt.match(/model name\s*:\s*(.+)/);
      if (m) return m[1].trim();
    }
  }
  if (process.platform === 'darwin') {
    const out = await spawnText(['sysctl', '-n', 'machdep.cpu.brand_string']);
    if (out) return out;
  }
  return String(process.arch);
}

async function detectMemory(): Promise<string> {
  if (process.platform === 'linux') {
    const txt = await readFileText('/proc/meminfo');
    if (txt) {
      const m = txt.match(/MemTotal:\s*(\d+)\s*kB/);
      if (m) return `${(Number(m[1]) / 1024 / 1024).toFixed(1)} GB`;
    }
  }
  if (process.platform === 'darwin') {
    const out = await spawnText(['sysctl', '-n', 'hw.memsize']);
    if (out) return `${(Number(out) / 1024 / 1024 / 1024).toFixed(1)} GB`;
  }
  return 'unknown';
}

/** Collects reproducible environment metadata for a benchmark run. */
export async function collectMetadata(profile: string): Promise<ReportMeta> {
  const pkgText = await readFileText('node_modules/burger-api/package.json');
  let burgerApiVersion = 'unknown';
  if (pkgText) {
    try {
      burgerApiVersion = JSON.parse(pkgText).version ?? 'unknown';
    } catch {
      /* keep unknown */
    }
  }

  const gitCommit = (await spawnText(['git', 'rev-parse', 'HEAD'])) ?? 'unknown';
  const date = new Date().toISOString().slice(0, 10);

  return {
    burgerApiVersion,
    bunVersion: Bun.version,
    os: String(process.platform),
    arch: String(process.arch),
    cpu: await detectCpu(),
    memory: await detectMemory(),
    date,
    gitCommit,
    profile,
  };
}
