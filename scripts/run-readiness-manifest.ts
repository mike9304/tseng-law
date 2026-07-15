import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createReadinessReport, renderReadinessReport } from '../src/lib/builder/audit/readiness-report';
import {
  parseReadinessManifest,
  READINESS_PROVIDERS,
  verifyReadinessManifest,
  type ReadinessProvider,
} from '../src/lib/builder/audit/readiness-manifest';

interface CliOptions {
  manifest: string;
  commit?: string;
  environment?: string;
  evidenceRoot: string;
  outputDir: string;
  dryRun: boolean;
  help: boolean;
}

function usage(): string {
  return [
    'Usage: vite-node scripts/run-readiness-manifest.ts [options]',
    '  --manifest <path>       Manifest JSON (default: docs/readiness-manifest/readiness-manifest.json)',
    '  --commit <sha>          Current commit (default: git HEAD)',
    '  --environment <name>    Current environment (default: NODE_ENV or local)',
    '  --evidence-root <path>  Root used to resolve evidence paths (default: repository root)',
    '  --output-dir <path>     Output directory (default: .omo/evidence/readiness-manifest)',
    '  --dry-run               Print report, never write output files',
  ].join('\n');
}

function takeValue(argv: string[], index: number, flag: string): [string, number] {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value\n\n${usage()}`);
  return [value, index + 1];
}

function parseArgs(argv: string[]): CliOptions {
  const root = process.cwd();
  const result: CliOptions = {
    manifest: path.join(root, 'docs/readiness-manifest/readiness-manifest.json'),
    evidenceRoot: root,
    outputDir: path.join(root, '.omo/evidence/readiness-manifest'),
    dryRun: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === '--dry-run') {
      result.dryRun = true;
      continue;
    }
    if (flag === '--help' || flag === '-h') {
      result.help = true;
      continue;
    }
    if (flag === '--manifest') {
      const [value, next] = takeValue(argv, index, flag);
      result.manifest = path.resolve(root, value);
      index = next;
      continue;
    }
    if (flag === '--commit') {
      const [value, next] = takeValue(argv, index, flag);
      result.commit = value;
      index = next;
      continue;
    }
    if (flag === '--environment') {
      const [value, next] = takeValue(argv, index, flag);
      result.environment = value;
      index = next;
      continue;
    }
    if (flag === '--evidence-root') {
      const [value, next] = takeValue(argv, index, flag);
      result.evidenceRoot = path.resolve(root, value);
      index = next;
      continue;
    }
    if (flag === '--output-dir') {
      const [value, next] = takeValue(argv, index, flag);
      result.outputDir = path.resolve(root, value);
      index = next;
      continue;
    }
    throw new Error(`unknown option ${flag}\n\n${usage()}`);
  }
  return result;
}

function isWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

/** Rejects traversal, directories, missing paths, and symlink/absolute escapes. */
export function resolveEvidenceRegularFileWithinRoot(evidenceRoot: string, evidencePath: string): string | undefined {
  if (!evidencePath.trim()) return undefined;
  if (evidencePath.split(/[\\/]+/u).includes('..')) return undefined;
  try {
    const lexicalRoot = path.resolve(evidenceRoot);
    const lexicalCandidate = path.isAbsolute(evidencePath) ? path.resolve(evidencePath) : path.resolve(lexicalRoot, evidencePath);
    if (!isWithin(lexicalRoot, lexicalCandidate)) return undefined;
    const canonicalRoot = realpathSync(lexicalRoot);
    if (!statSync(canonicalRoot).isDirectory()) return undefined;
    const canonicalCandidate = realpathSync(lexicalCandidate);
    return isWithin(canonicalRoot, canonicalCandidate) && statSync(canonicalCandidate).isFile() ? canonicalCandidate : undefined;
  } catch {
    return undefined;
  }
}

export function isEvidenceRegularFileWithinRoot(evidenceRoot: string, evidencePath: string): boolean {
  return resolveEvidenceRegularFileWithinRoot(evidenceRoot, evidencePath) !== undefined;
}

const PROVIDER_SET = new Set<string>(READINESS_PROVIDERS);

/** Reads only a strict, allowlisted top-level provider identity from a safe JSON evidence file. */
export function readEvidenceProviderFromRoot(evidenceRoot: string, evidencePath: string): ReadinessProvider | undefined {
  const canonicalPath = resolveEvidenceRegularFileWithinRoot(evidenceRoot, evidencePath);
  if (!canonicalPath) return undefined;
  try {
    const value = JSON.parse(readFileSync(canonicalPath, 'utf8')) as unknown;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
    const provider = (value as Record<string, unknown>).provider;
    return typeof provider === 'string' && PROVIDER_SET.has(provider) ? provider as ReadinessProvider : undefined;
  } catch {
    return undefined;
  }
}

function resolveCommit(explicit: string | undefined): string | undefined {
  if (explicit) return explicit;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}

export async function runReadinessManifestCli(argv = process.argv.slice(2)): Promise<number> {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(usage());
    return 0;
  }
  const manifest = parseReadinessManifest(readFileSync(options.manifest, 'utf8'));
  const evidenceRoot = options.evidenceRoot;
  const verification = verifyReadinessManifest(manifest, {
    evidenceExists: (evidencePath) => isEvidenceRegularFileWithinRoot(evidenceRoot, evidencePath),
    readEvidenceProvider: (evidencePath) => readEvidenceProviderFromRoot(evidenceRoot, evidencePath),
    currentCommit: resolveCommit(options.commit),
    environment: options.environment ?? process.env.NODE_ENV ?? 'local',
    now: new Date(),
  });
  const report = createReadinessReport(verification);
  const markdown = renderReadinessReport(report);

  if (options.dryRun) {
    console.log(JSON.stringify(report, null, 2));
    console.log(markdown);
  } else {
    mkdirSync(options.outputDir, { recursive: true });
    writeFileSync(path.join(options.outputDir, 'readiness-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    writeFileSync(path.join(options.outputDir, 'readiness-report.md'), markdown, 'utf8');
    console.log(`Readiness report written to ${options.outputDir}`);
    console.log(`P0 operational gate: ${report.operationalGate.passed ? 'PASS' : 'FAIL'}`);
  }
  // 2 distinguishes a valid report with an unmet operational gate from tool/input errors.
  return report.operationalGate.passed ? 0 : 2;
}

async function main(): Promise<void> {
  try {
    process.exitCode = await runReadinessManifestCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (process.env.READINESS_MANIFEST_CLI === '1' || (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))) void main();
