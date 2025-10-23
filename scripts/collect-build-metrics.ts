import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

interface AssetMetric {
  relativePath: string;
  bytes: number;
}

interface BuildMetrics {
  generatedAt: string;
  buildDurationMs: number;
  buildDurationSeconds: number;
  totalAssetBytes: number;
  assetCount: number;
  largestAsset?: AssetMetric;
  monitoredAsset?: AssetMetric;
  bundleBudgetBytes: number;
  budgetBreached: boolean;
  assets: AssetMetric[];
}

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const METRICS_DIR = path.join(PROJECT_ROOT, 'test-results', 'metrics');
const OUTPUT_FILE = path.join(METRICS_DIR, 'build-metrics.json');
const BUNDLE_BUDGET_BYTES = 716800; // 700 KB budget for primary bundle

async function main(): Promise<void> {
  const buildDuration = await runBuild();
  const assets = await collectAssets();
  const metrics = assembleMetrics(buildDuration, assets);

  await fs.mkdir(METRICS_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(metrics, null, 2), 'utf8');

  logSummary(metrics);

  if (metrics.budgetBreached) {
    throw new Error(
      `Bundle budget exceeded: monitored asset ${metrics.monitoredAsset?.relativePath ?? '<unknown>'} is ${metrics.monitoredAsset?.bytes ?? 0} bytes`
    );
  }
}

async function runBuild(): Promise<number> {
  const start = process.hrtime.bigint();
  await execCommand('npm', ['run', 'build'], {
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  const end = process.hrtime.bigint();

  const durationMs = Number(end - start) / 1_000_000;
  return Math.round(durationMs * 1000) / 1000; // preserve sub-millisecond precision without huge decimals
}

async function collectAssets(): Promise<AssetMetric[]> {
  const assets: AssetMetric[] = [];

  async function walk(currentDir: string): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      const stats = await fs.stat(absolutePath);
      assets.push({
        relativePath: path.relative(DIST_DIR, absolutePath),
        bytes: stats.size
      });
    }
  }

  try {
    await walk(DIST_DIR);
  } catch (error) {
    throw new Error(`Failed to read build output in ${DIST_DIR}: ${(error as Error).message}`);
  }

  return assets;
}

function assembleMetrics(buildDurationMs: number, assets: AssetMetric[]): BuildMetrics {
  const sortedAssets = assets.slice().sort((a, b) => b.bytes - a.bytes);
  const largestAsset = sortedAssets[0];
  const monitoredAsset = selectMonitoredAsset(sortedAssets);
  const totalAssetBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);

  return {
    generatedAt: new Date().toISOString(),
    buildDurationMs,
    buildDurationSeconds: Math.round((buildDurationMs / 1000) * 1000) / 1000,
    totalAssetBytes,
    assetCount: assets.length,
    largestAsset,
     monitoredAsset,
    bundleBudgetBytes: BUNDLE_BUDGET_BYTES,
    budgetBreached: (monitoredAsset?.bytes ?? 0) > BUNDLE_BUDGET_BYTES,
    assets: sortedAssets
  };
}

function selectMonitoredAsset(assets: AssetMetric[]): AssetMetric | undefined {
  const primaryBundle = assets.find(
    (asset) => asset.relativePath.startsWith('assets/index') && asset.relativePath.endsWith('.js')
  );

  if (primaryBundle) {
    return primaryBundle;
  }

  return assets.find((asset) => asset.relativePath.endsWith('.js'));
}

async function execCommand(
  command: string,
  args: string[],
  options: { env?: Record<string, string | undefined> } = {}
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false,
      env: options.env
    });

    child.on('exit', (code: number | null) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });

    child.on('error', (error: Error) => {
      reject(error);
    });
  });
}

function logSummary(metrics: BuildMetrics): void {
  console.log(`[collect-build-metrics] Build duration: ${metrics.buildDurationSeconds}s`);
  console.log(`[collect-build-metrics] Total asset size: ${metrics.totalAssetBytes} bytes across ${metrics.assetCount} files`);

  if (metrics.largestAsset) {
    console.log(
      `[collect-build-metrics] Largest asset: ${metrics.largestAsset.relativePath} (${metrics.largestAsset.bytes} bytes)`
    );
  }
  if (metrics.monitoredAsset) {
    console.log(
      `[collect-build-metrics] Budget asset: ${metrics.monitoredAsset.relativePath} (${metrics.monitoredAsset.bytes} bytes, budget ${metrics.bundleBudgetBytes} bytes)`
    );
  }

  console.log(`[collect-build-metrics] Metrics written to ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`);
}

void main().catch((error) => {
  console.error('[collect-build-metrics] Failed to collect build metrics');
  console.error(error);
  process.exitCode = 1;
});
