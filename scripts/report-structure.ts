import { promises as fs } from 'fs';
import path from 'path';

type CountRecord = Record<string, number>;

interface FileDescriptor {
  relativePath: string;
  extension: string;
  topLevelSegment: string;
}

interface StructureReport {
  generatedAt: string;
  projectRoot: string;
  totalFiles: number;
  countsByExtension: CountRecord;
  countsByTopLevelDirectory: CountRecord;
  categorizedCounts: CountRecord;
}

const PROJECT_ROOT = process.cwd();
const METRICS_DIR = path.join(PROJECT_ROOT, 'test-results', 'metrics');
const OUTPUT_FILE = path.join(METRICS_DIR, 'file-structure.json');

const EXCLUDED_DIRECTORIES = new Set([
  '.cache',
  '.cursor',
  '.git',
  '.github',
  '.idea',
  '.vscode',
  'dist',
  'node_modules',
  'test-results',
  'playwright-report'
]);

const EXCLUDED_FILES = new Set(['package-lock.json']); // lock file is intentionally ignored

const CATEGORY_MAP: Record<string, string> = {
  src: 'application',
  tests: 'automated-tests',
  'test-utils': 'automated-tests',
  docs: 'documentation',
  scripts: 'tooling',
  '.taskmaster': 'taskmaster'
};

async function main(): Promise<void> {
  const descriptors = await collectFileDescriptors(PROJECT_ROOT);
  const report = buildReport(descriptors);
  await fs.mkdir(METRICS_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(report, null, 2), 'utf8');
  logHumanSummary(report);
}

async function collectFileDescriptors(root: string): Promise<FileDescriptor[]> {
  const results: FileDescriptor[] = [];

  async function walk(currentDir: string): Promise<void> {
    const dirEntries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of dirEntries) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = path.relative(root, absolutePath);
      const segments = relativePath.split(path.sep).filter(Boolean);
      const topLevelActual = segments[0] ?? entry.name;

      if (EXCLUDED_DIRECTORIES.has(topLevelActual)) {
        if (entry.isDirectory()) {
          continue;
        }

        // Skip files rooted inside excluded directories
        if (segments.length > 1) {
          continue;
        }
      }

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (EXCLUDED_FILES.has(entry.name)) {
        continue;
      }

      const extension = normaliseExtension(entry.name);
      const topLevelSegment = segments.length > 1 ? topLevelActual : 'root';

      results.push({
        relativePath,
        extension,
        topLevelSegment
      });
    }
  }

  await walk(root);
  return results;
}

function buildReport(descriptors: FileDescriptor[]): StructureReport {
  const countsByExtension = new Map<string, number>();
  const countsByTopLevel = new Map<string, number>();
  const categorizedCounts = new Map<string, number>();

  for (const descriptor of descriptors) {
    increment(countsByExtension, descriptor.extension);
    increment(countsByTopLevel, descriptor.topLevelSegment);

    const category = CATEGORY_MAP[descriptor.topLevelSegment] ?? 'other';
    increment(categorizedCounts, category);
  }

  return {
    generatedAt: new Date().toISOString(),
    projectRoot: path.basename(PROJECT_ROOT),
    totalFiles: descriptors.length,
    countsByExtension: toSortedRecord(countsByExtension),
    countsByTopLevelDirectory: toSortedRecord(countsByTopLevel),
    categorizedCounts: toSortedRecord(categorizedCounts)
  };
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function normaliseExtension(filename: string): string {
  const extension = path.extname(filename);
  return extension ? extension.slice(1).toLowerCase() : '<no-ext>';
}

function toSortedRecord(map: Map<string, number>): CountRecord {
  return Object.fromEntries(
    Array.from(map.entries()).sort((a, b) => {
      if (b[1] === a[1]) {
        return a[0].localeCompare(b[0]);
      }

      return b[1] - a[1];
    })
  );
}

function logHumanSummary(report: StructureReport): void {
  const summaryLines = [
    `[report-structure] Total files analysed: ${report.totalFiles}`,
    `[report-structure] Top extensions: ${summariseTop(report.countsByExtension)}`,
    `[report-structure] Top directories: ${summariseTop(report.countsByTopLevelDirectory)}`
  ];

  for (const line of summaryLines) {
    console.log(line);
  }

  console.log(`[report-structure] Metrics written to ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`);
}

function summariseTop(record: CountRecord, limit = 3): string {
  return Object.entries(record)
    .slice(0, limit)
    .map(([name, value]) => `${name} (${value})`)
    .join(', ');
}

void main().catch((error) => {
  console.error('[report-structure] Failed to generate structure report');
  console.error(error);
  process.exitCode = 1;
});
