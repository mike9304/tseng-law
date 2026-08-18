import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createProductionStubReport,
  mapProductionStubOccurrences,
  parseProductionStubManifest,
  verifyProductionStubRegistry,
  type ProductionStubCandidateInventoryEntry,
  type ProductionStubEntry,
  type ProductionStubManifest,
  type ProductionStubReport,
  type ProductionStubVerification,
} from '../production-stub-registry';

const tempRoots: string[] = [];

afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

function fixtureRoot(): string {
  const root = mkdtempSync(path.join(os.tmpdir(), 'production-stub-registry-'));
  tempRoots.push(root);
  mkdirSync(path.join(root, 'src/lib/builder'), { recursive: true });
  writeFileSync(path.join(root, 'src/lib/builder/provider.ts'), "return { ok: true, provider: 'stub' };\n", 'utf8');
  return root;
}

function resolveFixtureSource(root: string, sourcePath: string) {
  if (path.isAbsolute(sourcePath) || sourcePath.split(/[\\/]+/u).includes('..')) {
    return { regularFile: false, reason: 'source_path_escape' } as const;
  }
  try {
    const canonicalRoot = realpathSync(root);
    const candidate = realpathSync(path.resolve(canonicalRoot, sourcePath));
    const relative = path.relative(canonicalRoot, candidate);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      return { regularFile: false, reason: 'source_path_escape' } as const;
    }
    if (!statSync(candidate).isFile()) return { regularFile: false, reason: 'source_not_regular_file' } as const;
    return { regularFile: true, content: readFileSync(candidate, 'utf8') } as const;
  } catch {
    return { regularFile: false, reason: 'source_not_regular_file' } as const;
  }
}

function entry(overrides: Partial<ProductionStubEntry> = {}): ProductionStubEntry {
  return {
    id: 'stub-provider',
    category: 'email',
    sourcePath: 'src/lib/builder/provider.ts',
    sourcePattern: "provider: 'stub'",
    sourceExpectedOccurrences: 1,
    occurrencePatterns: ["provider: 'stub'"],
    expectedOccurrences: 1,
    productionGuardAnchors: [{
      sourcePath: 'src/lib/builder/provider.ts',
      sourcePattern: "provider: 'stub'",
      expectedOccurrences: 1,
    }],
    productionPolicy: 'blocked',
    operationalSuccessAllowedInProduction: false,
    surfaceKind: 'non-rendered',
    visibleDisclosureAnchors: [],
    owner: 'platform',
    notes: 'fixture stub',
    ...overrides,
  };
}

function manifest(entries: readonly ProductionStubEntry[]) {
  return parseProductionStubManifest({ version: 1, entries });
}

function childCliEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  // Contradictory color flags make Node 24 print a process warning on stderr.
  // CLI stdout/stderr assertions must measure the tool, not the harness.
  delete env.NO_COLOR;
  delete env.FORCE_COLOR;
  return env;
}

function runScannerCli(
  root: string,
  registry: ReturnType<typeof manifest>,
  outputDir = path.join(root, 'evidence-output'),
): { readonly status: number | null; readonly report: ProductionStubReport } {
  const manifestPath = path.join(root, 'production-stubs.json');
  writeFileSync(manifestPath, `${JSON.stringify(registry)}\n`, 'utf8');
  const cliPath = path.resolve(process.cwd(), 'scripts/run-production-stub-registry.mjs');
  const result = spawnSync(process.execPath, [
    cliPath,
    '--repository-root', root,
    '--manifest', manifestPath,
    '--output-dir', outputDir,
    '--dry-run',
  ], { cwd: process.cwd(), encoding: 'utf8', env: childCliEnv() });
  if (result.error) throw result.error;
  const markdownStart = result.stdout.indexOf('\n# Production stub registry\n');
  if (markdownStart < 0) throw new Error(`registry CLI returned an unreadable report: ${result.stderr}`);
  return {
    status: result.status,
    report: JSON.parse(result.stdout.slice(0, markdownStart)) as ProductionStubReport,
  };
}

function runScannerCheckCli(
  root: string,
  registry: ReturnType<typeof manifest>,
): { readonly status: number | null; readonly stdout: string; readonly stderr: string } {
  const manifestPath = path.join(root, 'production-stubs-check.json');
  writeFileSync(manifestPath, `${JSON.stringify(registry)}\n`, 'utf8');
  const cliPath = path.resolve(process.cwd(), 'scripts/run-production-stub-registry.mjs');
  const result = spawnSync(process.execPath, [
    cliPath,
    '--repository-root', root,
    '--manifest', manifestPath,
    '--check',
  ], { cwd: process.cwd(), encoding: 'utf8', env: childCliEnv() });
  if (result.error) throw result.error;
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function writeSharedDisclosureFixture(root: string): {
  readonly copyPath: string;
  readonly disclosurePath: string;
  readonly productAPath: string;
  readonly productBPath: string;
} {
  const disclosurePath = 'src/lib/builder/_shared/WidgetDataDisclosure.tsx';
  const copyPath = 'src/lib/builder/widgets/event-copy.ts';
  const productAPath = 'src/lib/builder/widgets/calendar/Element.tsx';
  const productBPath = 'src/lib/builder/widgets/list/Element.tsx';
  for (const filePath of [disclosurePath, copyPath, productAPath, productBPath]) {
    mkdirSync(path.join(root, path.dirname(filePath)), { recursive: true });
  }
  writeFileSync(path.join(root, disclosurePath), [
    'export function WidgetDataDisclosure() {',
    '  return <span data-builder-demo-disclosure aria-label="Demo data disclosure">DEMO DATA</span>;',
    '}',
    '',
  ].join('\n'), 'utf8');
  writeFileSync(path.join(root, copyPath), [
    'export const mockEvents = [];',
    "export const eventIds = 'stub-event-1';",
    '',
  ].join('\n'), 'utf8');
  writeFileSync(path.join(root, productAPath), [
    "import { WidgetDataDisclosure } from '../../_shared/WidgetDataDisclosure';",
    "import { mockEvents, eventIds } from '../event-copy';",
    'export function CalendarElement({ isBuilder }: { isBuilder: boolean }) {',
    '  return <div data-event-id={eventIds}><span>{mockEvents.length} events</span>{isBuilder ? <WidgetDataDisclosure /> : null}</div>;',
    '}',
    '',
  ].join('\n'), 'utf8');
  writeFileSync(path.join(root, productBPath), [
    "import { WidgetDataDisclosure } from '../../_shared/WidgetDataDisclosure';",
    "import { mockEvents, eventIds } from '../event-copy';",
    'export function ListElement({ isBuilder }: { isBuilder: boolean }) {',
    '  return <div data-event-id={eventIds}><span>{mockEvents.length} events</span>{isBuilder ? <WidgetDataDisclosure /> : null}</div>;',
    '}',
    '',
  ].join('\n'), 'utf8');
  return { copyPath, disclosurePath, productAPath, productBPath };
}

type SharedDisclosurePaths = ReturnType<typeof writeSharedDisclosureFixture>;

function sharedConsumerComponentName(productKey: 'productAPath' | 'productBPath'): string {
  return productKey === 'productAPath' ? 'CalendarElement' : 'ListElement';
}

const EVENT_COPY_IMPORT_PATTERN = "import \\{ mockEvents, eventIds \\} from '\\.\\./event-copy'";
const EVENT_COPY_USAGE_PATTERN = 'mockEvents\\.length';
const DISCLOSURE_RENDER_PATTERN = 'isBuilder \\? <WidgetDataDisclosure /> : null';

function sharedEventCopyCandidate(paths: SharedDisclosurePaths): ProductionStubCandidateInventoryEntry {
  return {
    id: 'broad-event-copy-shared',
    category: 'widget-demo',
    sourcePath: paths.copyPath,
    expectedOccurrences: 2,
    productionGuardAnchors: [
      { sourcePath: paths.productAPath, sourcePattern: DISCLOSURE_RENDER_PATTERN, expectedOccurrences: 1 },
      { sourcePath: paths.productAPath, sourcePattern: EVENT_COPY_IMPORT_PATTERN, expectedOccurrences: 1 },
      { sourcePath: paths.productAPath, sourcePattern: EVENT_COPY_USAGE_PATTERN, expectedOccurrences: 1 },
      { sourcePath: paths.productBPath, sourcePattern: DISCLOSURE_RENDER_PATTERN, expectedOccurrences: 1 },
      { sourcePath: paths.productBPath, sourcePattern: EVENT_COPY_IMPORT_PATTERN, expectedOccurrences: 1 },
      { sourcePath: paths.productBPath, sourcePattern: EVENT_COPY_USAGE_PATTERN, expectedOccurrences: 1 },
    ],
    productionPolicy: 'placeholder-only',
    surfaceKind: 'rendered-demo',
    visibleDisclosureAnchors: [
      widgetDisclosureAnchor(paths.disclosurePath, paths.productAPath),
      widgetDisclosureAnchor(paths.disclosurePath, paths.productBPath),
    ],
    owner: 'builder-components',
    notes: 'shared disclosure consumed by two distinct products',
  };
}

function verifySharedCandidate(root: string, candidate: ProductionStubCandidateInventoryEntry): ProductionStubVerification {
  return verifyProductionStubRegistry(
    parseProductionStubManifest({ version: 1, entries: [entry()], candidateInventory: [candidate] }),
    { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) },
  );
}

function findSharedCandidateRow(verification: ProductionStubVerification): ProductionStubVerification['entries'][number] {
  const row = verification.entries.find((candidate) => candidate.entry.id === 'broad-event-copy-shared');
  expect(row, 'broad-event-copy-shared row present').toBeDefined();
  return row as ProductionStubVerification['entries'][number];
}

function sharedConsumerProductSource(
  productKey: 'productAPath' | 'productBPath',
  mutation: 'baseline'
  | 'disclosure-import-removed'
  | 'disclosure-render-removed'
  | 'event-copy-import-removed'
  | 'event-copy-reference-removed',
): string {
  const componentName = sharedConsumerComponentName(productKey);
  const imports: string[] = [];
  if (mutation !== 'disclosure-import-removed') {
    imports.push("import { WidgetDataDisclosure } from '../../_shared/WidgetDataDisclosure';");
  }
  if (mutation !== 'event-copy-import-removed') {
    imports.push("import { mockEvents, eventIds } from '../event-copy';");
  }
  const countSpan = mutation === 'event-copy-reference-removed'
    ? '<span>0 events</span>'
    : '<span>{mockEvents.length} events</span>';
  const renderSegment = mutation === 'disclosure-render-removed'
    ? ''
    : '{isBuilder ? <WidgetDataDisclosure /> : null}';
  return [
    ...imports,
    `export function ${componentName}({ isBuilder }: { isBuilder: boolean }) {`,
    `  return <div data-event-id={eventIds}>${countSpan}${renderSegment}</div>;`,
    '}',
    '',
  ].join('\n');
}

const sharedDisclosureConsumers = [
  {
    label: 'calendar consumer A',
    productKey: 'productAPath' as const,
    anchorIndex: 0,
    disclosureRenderGuardIndex: 0,
    eventCopyImportGuardIndex: 1,
    eventCopyUsageGuardIndex: 2,
  },
  {
    label: 'list consumer B',
    productKey: 'productBPath' as const,
    anchorIndex: 1,
    disclosureRenderGuardIndex: 3,
    eventCopyImportGuardIndex: 4,
    eventCopyUsageGuardIndex: 5,
  },
];

function widgetDisclosureAnchor(
  disclosurePath: string,
  productPath: string,
): ProductionStubEntry['visibleDisclosureAnchors'][number] {
  return {
    sourcePath: disclosurePath,
    sourcePattern: 'Demo data disclosure',
    expectedOccurrences: 1,
    renderedSelector: '[data-builder-demo-disclosure]',
    productSourcePath: productPath,
    productSourcePattern: '(?:import \\{ WidgetDataDisclosure \\}|<WidgetDataDisclosure)',
    productExpectedOccurrences: 2,
    sourceReferencePattern: 'data-builder-demo-disclosure',
    sourceReferenceExpectedOccurrences: 1,
  };
}

describe('production stub registry', () => {
  it('strictly parses manifests and rejects unknown fields', () => {
    expect(() => parseProductionStubManifest({
      version: 1,
      entries: [{ ...entry(), inventedStatus: 'VERIFIED' }],
    })).toThrow();
  });

  it('wires a deterministic package-level R02 check command', () => {
    const packageJson = JSON.parse(readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')) as {
      scripts?: Record<string, string>;
    };
    expect(packageJson.scripts?.['check:r02-stubs']).toBe(
      'node scripts/run-production-stub-registry.mjs --check',
    );
  });

  it('expands broad candidate inventory as source-anchored open rows', () => {
    const root = fixtureRoot();
    const registry = parseProductionStubManifest({
      version: 1,
      entries: [entry()],
      candidateInventory: [{
        id: 'broad-provider-inventory',
        category: 'email',
        sourcePath: 'src/lib/builder/provider.ts',
        expectedOccurrences: 1,
        owner: 'platform',
        notes: 'unresolved broad scan fixture',
      }],
    });
    const verification = verifyProductionStubRegistry(registry, {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(verification.gatePassed).toBe(false);
    expect(verification.entries[1]).toMatchObject({
      sourceMatched: true,
      effectivePolicy: 'open',
      reasons: ['policy_open'],
    });
    expect(mapProductionStubOccurrences([
      { sourcePath: 'src/lib/builder/provider.ts', line: 1, text: "provider: 'stub'" },
    ], registry)[0]?.mappedEntryIds).toEqual(['stub-provider', 'broad-provider-inventory']);
  });

  it('allows only an explicitly guarded rendered candidate to close via a shared disclosure reverse import', () => {
    const root = fixtureRoot();
    const disclosurePath = 'src/lib/builder/_shared/WidgetDataDisclosure.tsx';
    mkdirSync(path.join(root, path.dirname(disclosurePath)), { recursive: true });
    writeFileSync(path.join(root, disclosurePath), [
      'export function WidgetDataDisclosure() {',
      '  return <span data-builder-demo-disclosure aria-label="Demo data disclosure">DEMO DATA</span>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    writeFileSync(path.join(root, 'src/lib/builder/provider.ts'), [
      "import { WidgetDataDisclosure } from './_shared/WidgetDataDisclosure';",
      "export const configured = { provider: 'stub' };",
      'const mockRows = [];',
      'export function Provider() {',
      '  return <div>{mockRows.length === 0 ? <WidgetDataDisclosure /> : null}</div>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const registry = parseProductionStubManifest({
      version: 1,
      entries: [entry()],
      candidateInventory: [{
        id: 'broad-rendered-provider',
        category: 'widget-demo',
        sourcePath: 'src/lib/builder/provider.ts',
        expectedOccurrences: 3,
        productionPolicy: 'placeholder-only',
        productionGuardAnchors: [{
          sourcePath: 'src/lib/builder/provider.ts',
          sourcePattern: 'mockRows\\.length === 0 \\? <WidgetDataDisclosure /> : null',
          expectedOccurrences: 1,
        }],
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'Demo data disclosure',
          expectedOccurrences: 1,
          renderedSelector: '[data-builder-demo-disclosure]',
          productSourcePath: 'src/lib/builder/provider.ts',
          productSourcePattern: '(?:import \\{ WidgetDataDisclosure \\}|<WidgetDataDisclosure)',
          productExpectedOccurrences: 2,
          sourceReferencePattern: 'data-builder-demo-disclosure',
          sourceReferenceExpectedOccurrences: 1,
        }],
        owner: 'builder-platform',
        notes: 'guarded rendered candidate fixture',
      }],
    });
    const verification = verifyProductionStubRegistry(registry, {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(verification.gatePassed).toBe(true);
    expect(verification.entries[1]).toMatchObject({
      sourceMatched: true,
      effectivePolicy: 'placeholder-only',
      reasons: [],
    });
  });

  it('rejects a detached shared disclosure when the product surface does not reverse-import it', () => {
    const root = fixtureRoot();
    const disclosurePath = 'src/lib/builder/_shared/WidgetDataDisclosure.tsx';
    mkdirSync(path.join(root, path.dirname(disclosurePath)), { recursive: true });
    writeFileSync(path.join(root, disclosurePath), [
      'export function WidgetDataDisclosure() {',
      '  return <span data-builder-demo-disclosure aria-label="Demo data disclosure">DEMO DATA</span>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const result = verifyProductionStubRegistry(manifest([
      entry({
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'Demo data disclosure',
          expectedOccurrences: 1,
          renderedSelector: '[data-builder-demo-disclosure]',
          productSourcePath: 'src/lib/builder/provider.ts',
          productSourcePattern: "provider: 'stub'",
          productExpectedOccurrences: 1,
          sourceReferencePattern: 'data-builder-demo-disclosure',
          sourceReferenceExpectedOccurrences: 1,
        }],
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.gatePassed).toBe(false);
    expect(result.entries[0]?.reasons).toContain('visible_disclosure_product_not_referenced:0');
  });

  it('matches a safe regular source file in a temporary repository', () => {
    const root = fixtureRoot();
    const result = verifyProductionStubRegistry(manifest([entry()]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(result.gatePassed).toBe(true);
    expect(result.entries[0]).toMatchObject({ sourceMatched: true, effectivePolicy: 'blocked' });
  });

  it('downgrades missing patterns to open instead of crashing', () => {
    const root = fixtureRoot();
    const result = verifyProductionStubRegistry(manifest([entry({ sourcePattern: 'not-present' })]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(result.gatePassed).toBe(false);
    expect(result.entries[0]?.reasons).toContain('source_pattern_count_mismatch:1:0');
    expect(result.entries[0]?.effectivePolicy).toBe('open');
  });

  it('does not accept a manifest occurrence anchor that survives only in a comment', () => {
    const root = fixtureRoot();
    writeFileSync(
      path.join(root, 'src/lib/builder/provider.ts'),
      "// provider: 'stub'\nexport const configured = true;\n",
      'utf8',
    );
    const result = verifyProductionStubRegistry(manifest([entry({
      sourcePattern: 'configured = true',
      productionGuardAnchors: [{
        sourcePath: 'src/lib/builder/provider.ts',
        sourcePattern: 'configured = true',
        expectedOccurrences: 1,
      }],
    })]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(result.gatePassed).toBe(false);
    expect(result.entries[0]?.sourceMatched).toBe(false);
    expect(result.entries[0]?.reasons).toContain('occurrence_pattern_missing:0');
  });

  it('rejects traversal and symlink escapes outside the repository', () => {
    const root = fixtureRoot();
    const outside = mkdtempSync(path.join(os.tmpdir(), 'production-stub-outside-'));
    tempRoots.push(outside);
    writeFileSync(path.join(outside, 'secret.ts'), "provider: 'stub'", 'utf8');
    symlinkSync(path.join(outside, 'secret.ts'), path.join(root, 'src/lib/builder/escaped.ts'));

    expect(resolveFixtureSource(root, '../outside.ts')).toMatchObject({ regularFile: false });
    expect(resolveFixtureSource(root, 'src/lib/builder/escaped.ts')).toMatchObject({
      regularFile: false,
      reason: 'source_path_escape',
    });
  });

  it('fails false production-success claims for blocked or placeholder entries', () => {
    const root = fixtureRoot();
    const result = verifyProductionStubRegistry(manifest([
      entry({ operationalSuccessAllowedInProduction: true }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('false_production_success_claim:stub-provider');
    expect(result.gatePassed).toBe(false);
  });

  it.each([
    'payment',
    'payments-webhook',
    'translation',
    'video-meetings',
    'email',
  ])('rejects production-success claims for protected %s categories regardless of policy label', (category) => {
    const root = fixtureRoot();
    const result = verifyProductionStubRegistry(manifest([
      entry({
        category,
        productionPolicy: 'explicit-opt-in',
        operationalSuccessAllowedInProduction: true,
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('protected_capability_production_success_claim:stub-provider');
    expect(result.gatePassed).toBe(false);
  });

  it('classifies billing provider capability from source path even after category relabeling', () => {
    const root = fixtureRoot();
    const billingPath = 'src/lib/builder/billing-provider.ts';
    writeFileSync(path.join(root, billingPath), "return { ok: true, provider: 'stub' };\n", 'utf8');
    const result = verifyProductionStubRegistry(manifest([
      entry({
        category: 'provider-adapter',
        sourcePath: billingPath,
        productionGuardAnchors: [{
          sourcePath: billingPath,
          sourcePattern: "provider: 'stub'",
          expectedOccurrences: 1,
        }],
        productionPolicy: 'explicit-opt-in',
        operationalSuccessAllowedInProduction: true,
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('protected_capability_production_success_claim:stub-provider');
  });

  it('keeps rendered demo surfaces open until a visible DEMO or STUB disclosure is anchored', () => {
    const root = fixtureRoot();
    const undisclosed = verifyProductionStubRegistry(manifest([
      entry({ surfaceKind: 'rendered-demo' }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(undisclosed.gatePassed).toBe(false);
    expect(undisclosed.entries[0]?.effectivePolicy).toBe('open');
    expect(undisclosed.entries[0]?.reasons).toContain('missing_visible_disclosure');

    const disclosurePath = 'src/lib/builder/ProviderDemo.tsx';
    writeFileSync(path.join(root, disclosurePath), [
      "import './provider';",
      'export function ProviderDemo() {',
      '  return <div data-demo-surface="provider" aria-label="STUB demo data">Sample provider</div>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const disclosed = verifyProductionStubRegistry(manifest([
      entry({
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'STUB demo data',
          expectedOccurrences: 1,
          renderedSelector: '[data-demo-surface="provider"]',
          productSourcePath: 'src/lib/builder/provider.ts',
          productSourcePattern: "provider: 'stub'",
          productExpectedOccurrences: 1,
          sourceReferencePattern: "import './provider'",
          sourceReferenceExpectedOccurrences: 1,
        }],
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(disclosed.gatePassed).toBe(true);
    expect(disclosed.entries[0]?.sourceMatched).toBe(true);
  });

  it('does not accept a hidden diagnostic constant as visible rendered disclosure', () => {
    const root = fixtureRoot();
    const disclosurePath = 'src/lib/builder/ProviderDemo.tsx';
    writeFileSync(path.join(root, disclosurePath), [
      "import './provider';",
      "const diagnostic = 'STUB demo data';",
      'export function ProviderDemo() {',
      '  return <div data-demo-surface="provider">{diagnostic}</div>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const result = verifyProductionStubRegistry(manifest([
      entry({
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'STUB demo data',
          expectedOccurrences: 1,
          renderedSelector: '[data-demo-surface="provider"]',
          productSourcePath: 'src/lib/builder/provider.ts',
          productSourcePattern: "provider: 'stub'",
          productExpectedOccurrences: 1,
          sourceReferencePattern: "import './provider'",
          sourceReferenceExpectedOccurrences: 1,
        }],
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.gatePassed).toBe(false);
    expect(result.entries[0]?.reasons).toContain('visible_disclosure_not_rendered:0');
  });

  it('accepts statically visible conditional DEMO or STUB literals inside a JSX expression', () => {
    const root = fixtureRoot();
    const disclosurePath = 'src/lib/builder/ProviderDemo.tsx';
    writeFileSync(path.join(root, disclosurePath), [
      "import './provider';",
      'export function ProviderDemo({ locale }: { locale: string }) {',
      '  return <div data-demo-surface="provider">{locale === \'ko\' ? \'STUB 데모\' : \'STUB demo\'}</div>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const result = verifyProductionStubRegistry(manifest([
      entry({
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'STUB (?:데모|demo)',
          expectedOccurrences: 2,
          renderedSelector: '[data-demo-surface="provider"]',
          productSourcePath: 'src/lib/builder/provider.ts',
          productSourcePattern: "provider: 'stub'",
          productExpectedOccurrences: 1,
          sourceReferencePattern: "import './provider'",
          sourceReferenceExpectedOccurrences: 1,
        }],
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.gatePassed).toBe(true);
    expect(result.entries[0]?.sourceMatched).toBe(true);
  });

  it('accepts a visible imported copy expression only when its product mapping proves DEMO or STUB labels', () => {
    const root = fixtureRoot();
    const copyPath = 'src/lib/builder/provider-copy.ts';
    const disclosurePath = 'src/lib/builder/ProviderDemo.tsx';
    writeFileSync(path.join(root, copyPath), [
      "export const ko = { fallbackNotice: 'DEMO DATA: provider unavailable' };",
      "export const en = { fallbackNotice: 'STUB DATA: provider unavailable' };",
      "export const zh = { fallbackNotice: 'DEMO DATA: provider unavailable' };",
      '',
    ].join('\n'), 'utf8');
    writeFileSync(path.join(root, disclosurePath), [
      "import { en as copy } from '@/lib/builder/provider-copy';",
      'export function ProviderDemo() {',
      '  return <div data-demo-surface="provider"><p>{copy.fallbackNotice}</p></div>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const result = verifyProductionStubRegistry(manifest([
      entry({
        sourcePath: copyPath,
        sourcePattern: 'fallbackNotice',
        sourceExpectedOccurrences: 3,
        occurrencePatterns: ['(?:DEMO|STUB) DATA'],
        expectedOccurrences: 3,
        productionGuardAnchors: [{
          sourcePath: copyPath,
          sourcePattern: "fallbackNotice: '(?:DEMO|STUB) DATA",
          expectedOccurrences: 3,
        }],
        productionPolicy: 'placeholder-only',
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'copy\\.fallbackNotice',
          expectedOccurrences: 1,
          renderedSelector: '[data-demo-surface="provider"]',
          productSourcePath: copyPath,
          productSourcePattern: "fallbackNotice: '(?:DEMO|STUB) DATA",
          productExpectedOccurrences: 3,
          sourceReferencePattern: 'copy\\.fallbackNotice',
          sourceReferenceExpectedOccurrences: 1,
        }],
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.gatePassed).toBe(true);
    expect(result.entries[0]?.sourceMatched).toBe(true);
  });

  it('does not accept visible disclosure that lacks a direct product source reference', () => {
    const root = fixtureRoot();
    const disclosurePath = 'src/lib/builder/DetachedDemo.tsx';
    writeFileSync(path.join(root, disclosurePath), [
      'export function DetachedDemo() {',
      '  return <div data-demo-surface="provider" aria-label="STUB demo data">Sample</div>;',
      '}',
      '',
    ].join('\n'), 'utf8');
    const result = verifyProductionStubRegistry(manifest([
      entry({
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [{
          sourcePath: disclosurePath,
          sourcePattern: 'STUB demo data',
          expectedOccurrences: 1,
          renderedSelector: '[data-demo-surface="provider"]',
          productSourcePath: 'src/lib/builder/provider.ts',
          productSourcePattern: "provider: 'stub'",
          productExpectedOccurrences: 1,
          sourceReferencePattern: 'data-demo-surface',
          sourceReferenceExpectedOccurrences: 1,
        }],
      }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(result.gatePassed).toBe(false);
    expect(result.entries[0]?.reasons).toContain('visible_disclosure_product_not_referenced:0');
  });

  it('makes unmapped high-risk occurrences fail the report gate', () => {
    const root = fixtureRoot();
    const registry = manifest([entry()]);
    const verification = verifyProductionStubRegistry(registry, {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    const occurrences = mapProductionStubOccurrences([
      { sourcePath: 'src/lib/builder/provider.ts', line: 1, text: "provider: 'stub'" },
      { sourcePath: 'src/lib/builder/provider.ts', line: 2, text: 'return { stub: true };' },
      { sourcePath: 'src/lib/builder/unregistered.ts', line: 7, text: 'ALLOW_STUB=true' },
    ], registry);
    const report = createProductionStubReport(verification, occurrences, new Date('2026-07-13T00:00:00.000Z'));
    expect(report.summary.mappedOccurrences).toBe(1);
    expect(report.summary.unmappedOccurrences).toBe(2);
    expect(report.unmappedOccurrences.map((row) => row.sourcePath)).toEqual([
      'src/lib/builder/provider.ts',
      'src/lib/builder/unregistered.ts',
    ]);
    expect(report.gatePassed).toBe(false);
  });

  it('does not let an identical second same-file occurrence inherit an existing registration', () => {
    const root = fixtureRoot();
    const registry = manifest([entry()]);
    writeFileSync(path.join(root, 'src/lib/builder/provider.ts'), [
      "return { provider: 'stub' };",
      "return { provider: 'stub' };",
      '',
    ].join('\n'), 'utf8');
    const { status, report } = runScannerCli(root, registry);
    expect(status).toBe(2);
    expect(report.summary.open).toBe(1);
    expect(report.summary.mappedOccurrences).toBe(2);
    expect(report.summary.unmappedOccurrences).toBe(0);
    expect(report.entries[0]?.reasons).toEqual(expect.arrayContaining([
      'source_pattern_count_mismatch:1:2',
    ]));
  });

  it('counts duplicate occurrences on the same source line', () => {
    const root = fixtureRoot();
    writeFileSync(
      path.join(root, 'src/lib/builder/provider.ts'),
      "export const results = [{ provider: 'stub' }, { provider: 'stub' }];\n",
      'utf8',
    );
    const registryEntry = entry({
      sourcePattern: 'export const results',
      productionGuardAnchors: [{
        sourcePath: 'src/lib/builder/provider.ts',
        sourcePattern: 'export const results',
        expectedOccurrences: 1,
      }],
    });
    const result = verifyProductionStubRegistry(manifest([registryEntry]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(result.gatePassed).toBe(false);
    expect(result.entries[0]?.reasons).toContain('occurrence_count_mismatch:1:2');
  });

  it('fails invalid or stale line-level occurrence anchors', () => {
    const root = fixtureRoot();
    const stale = verifyProductionStubRegistry(manifest([
      entry({ occurrencePatterns: ['stub\\s*:\\s*true'] }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(stale.gatePassed).toBe(false);
    expect(stale.entries[0]?.reasons).toContain('occurrence_pattern_missing:0');

    const invalid = verifyProductionStubRegistry(manifest([
      entry({ occurrencePatterns: ['['] }),
    ]), { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain('invalid_occurrence_pattern:stub-provider:0');
  });

  it('finds unregistered production hits outside the former API and builder roots', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    mkdirSync(path.join(root, 'scripts'), { recursive: true });
    mkdirSync(path.join(root, 'server'), { recursive: true });
    writeFileSync(
      path.join(root, 'src/features/new-provider.ts'),
      "export const result = { ok: true, provider: 'stub' };\n",
      'utf8',
    );
    writeFileSync(path.join(root, 'scripts/provision-provider.sh'), 'export ALLOW_STUB=1\n', 'utf8');
    writeFileSync(path.join(root, 'server/live.ts'), "export const live = { provider: 'stub' };\n", 'utf8');
    const { status, report } = runScannerCli(root, manifest([entry()]));
    const occurrences = [...report.mappedOccurrences, ...report.unmappedOccurrences];
    expect(status).toBe(2);
    expect(report.gatePassed).toBe(false);
    expect(occurrences).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourcePath: 'src/features/new-provider.ts',
        line: 1,
        mappedEntryIds: [],
      }),
      expect.objectContaining({
        sourcePath: 'scripts/provision-provider.sh',
        line: 1,
        mappedEntryIds: [],
      }),
      expect.objectContaining({
        sourcePath: 'server/live.ts',
        line: 1,
        mappedEntryIds: [],
      }),
    ]));
  });

  it('orders scan hits deterministically by source path, line, and text', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    writeFileSync(path.join(root, 'src/features/z-provider.ts'), [
      "export const second = 'stub-z';",
      "export const first = 'mock-z';",
      '',
    ].join('\n'), 'utf8');
    writeFileSync(path.join(root, 'src/features/a-provider.ts'), "export const value = 'stub-a';\n", 'utf8');

    const first = runScannerCli(root, manifest([entry()])).report.unmappedOccurrences;
    const second = runScannerCli(root, manifest([entry()])).report.unmappedOccurrences;
    const keys = first.map((row) => `${row.sourcePath}:${row.line}:${row.text}`);
    expect(keys).toEqual([...keys].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)));
    expect(second).toEqual(first);
  });

  it('classifies meaningful mock and stub variants in runtime identifiers, properties, and strings', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    writeFileSync(path.join(root, 'src/features/variant-shapes.ts'), [
      'export const mockEvents = [];',
      'export const copy = { mockProjects: [] };',
      "export const emailed = 'emailed_stub';",
      "export const authorized = 'authorized_stub';",
      'export const refund = `rf_stub_${Date.now()}`;',
      "export const paymentIntentId = 'pi_stub_dev';",
      "export const runtime = 'node-stub';",
      "export const renderer = 'html-scaled-mock';",
      '',
    ].join('\n'), 'utf8');

    const { status, report } = runScannerCli(root, manifest([entry()]));
    expect(status).toBe(2);
    expect(report.unmappedOccurrences).toEqual(expect.arrayContaining(
      Array.from({ length: 8 }, (_, index) => expect.objectContaining({
        sourcePath: 'src/features/variant-shapes.ts',
        line: index + 1,
      })),
    ));
  });

  it('discovers split, renamed, degraded-success, and contingency bypasses without lexical prefiltering', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    writeFileSync(path.join(root, 'src/features/nonlexical-bypasses.ts'), [
      "export const syntheticMode = 'st' + 'ub';",
      'export const fakeProvider = () => ({ success: true });',
      'export const degradedResult = { success: true, degraded: true };',
      'export const contingencyResult = contingencyFoo();',
      '',
    ].join('\n'), 'utf8');

    const { status, report } = runScannerCli(root, manifest([entry()]));
    expect(status).toBe(2);
    expect(report.unmappedOccurrences).toEqual(expect.arrayContaining(
      Array.from({ length: 4 }, (_, index) => expect.objectContaining({
        sourcePath: 'src/features/nonlexical-bypasses.ts',
        line: index + 1,
      })),
    ));
  });

  it('exempts mock and stub spellings that exist only in TypeScript type space', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    writeFileSync(path.join(root, 'src/features/type-compatibility.ts'), [
      "export type LegacyStatus = 'emailed_stub' | 'authorized_stub';",
      'export interface MockEventsCompatibility {',
      "  runtime: 'node-stub';",
      '  mockProjects: readonly string[];',
      '}',
      'export const configured = true;',
      '',
    ].join('\n'), 'utf8');

    const { report } = runScannerCli(root, manifest([entry()]));
    const occurrences = [...report.mappedOccurrences, ...report.unmappedOccurrences];
    expect(occurrences.map((row) => row.sourcePath)).toEqual(['src/lib/builder/provider.ts']);
  });

  it('exempts reviewed negative fake-language without hiding executable fake providers', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    writeFileSync(path.join(root, 'src/features/honest-copy.ts'), [
      "export const first = 'Real systems only. No fake tabs.';",
      "export const second = 'The canvas does not fake precise geometry.';",
      '',
    ].join('\n'), 'utf8');
    writeFileSync(
      path.join(root, 'src/features/provider-adapter.ts'),
      'export const fakeProvider = () => ({ success: true });\n',
      'utf8',
    );
    writeFileSync(path.join(root, 'src/features/real-provider.ts'), [
      'export const result = { stub: false };',
      'export const isReal = result.stub !== false;',
      '',
    ].join('\n'), 'utf8');
    mkdirSync(path.join(root, 'src/components/builder/canvas'), { recursive: true });
    writeFileSync(
      path.join(root, 'src/components/builder/canvas/ImageEditDialog.tsx'),
      'const stub = value.stub;\n',
      'utf8',
    );
    mkdirSync(path.join(root, 'src/lib/builder/security'), { recursive: true });
    writeFileSync(
      path.join(root, 'src/lib/builder/security/qa-runtime-attestation.ts'),
      "export const forbidden = ['ALLOW_STUB', 'ALLOW_MOCK'];\n",
      'utf8',
    );

    const { report } = runScannerCli(root, manifest([entry()]));
    expect(report.unmappedOccurrences).toEqual([
      expect.objectContaining({ sourcePath: 'src/features/provider-adapter.ts', line: 1 }),
    ]);
  });

  it('uses parser-grade token ranges so a regex literal cannot hide a later stub', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'server'), { recursive: true });
    writeFileSync(path.join(root, 'server/regex-poison.ts'), [
      'const slash = /[/*]/;',
      "export const live = { provider: 'stub' };",
      '',
    ].join('\n'), 'utf8');
    const { status, report } = runScannerCli(root, manifest([entry()]));
    expect(status).toBe(2);
    expect(report.unmappedOccurrences).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourcePath: 'server/regex-poison.ts', line: 2 }),
    ]));
  });

  it('detects arbitrary fallbackFoo and usedFallback ok:true success shapes semantically', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'server'), { recursive: true });
    writeFileSync(path.join(root, 'server/arbitrary-fallback.ts'), [
      'function fallbackFoo() { return { value: 1 }; }',
      'export function indirectSuccess() {',
      '  let usedFallback = false;',
      '  const value = fallbackFoo();',
      '  usedFallback = true;',
      '  return { ok: true, usedFallback, value };',
      '}',
      'export function directSuccess() {',
      '  return { ok: true, value: fallbackFoo() };',
      '}',
      '',
    ].join('\n'), 'utf8');
    const { status, report } = runScannerCli(root, manifest([entry()]));
    expect(status).toBe(2);
    expect(report.unmappedOccurrences).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourcePath: 'server/arbitrary-fallback.ts', line: 4 }),
      expect.objectContaining({ sourcePath: 'server/arbitrary-fallback.ts', line: 5 }),
      expect.objectContaining({ sourcePath: 'server/arbitrary-fallback.ts', line: 6 }),
      expect.objectContaining({ sourcePath: 'server/arbitrary-fallback.ts', line: 9 }),
    ]));
  });

  it('excludes test, generated, comment-only, and smoke-harness false positives deterministically', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/features/__tests__'), { recursive: true });
    mkdirSync(path.join(root, 'src/generated'), { recursive: true });
    mkdirSync(path.join(root, 'scripts'), { recursive: true });
    writeFileSync(path.join(root, 'src/features/comments.ts'), [
      "// return { provider: 'stub' };",
      '/*',
      "return { provider: 'stub' };",
      '*/',
      'export const real = true;',
      '',
    ].join('\n'), 'utf8');
    writeFileSync(
      path.join(root, 'src/features/__tests__/provider.test.ts'),
      "return { provider: 'stub' };\n",
      'utf8',
    );
    writeFileSync(path.join(root, 'src/generated/provider.ts'), "return { provider: 'stub' };\n", 'utf8');
    writeFileSync(path.join(root, 'scripts/run-builder-smoke.sh'), 'export BOOKING_PAYMENT_ALLOW_STUB=1\n', 'utf8');

    const { status, report } = runScannerCli(root, manifest([entry()]));
    const occurrences = [...report.mappedOccurrences, ...report.unmappedOccurrences];
    expect(status).toBe(0);
    expect(occurrences.map((row) => row.sourcePath)).toEqual(['src/lib/builder/provider.ts']);
  });

  it('excludes only the exact non-operational legacy provenance label', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/app/api/builder/translations'), { recursive: true });
    mkdirSync(path.join(root, 'src/features'), { recursive: true });
    const provenanceParser = "if (value === 'ai-openai' || value === 'ai-deepl' || value === 'mock') return value;\n";
    writeFileSync(path.join(root, 'src/app/api/builder/translations/route.ts'), provenanceParser, 'utf8');
    writeFileSync(path.join(root, 'src/features/provider-router.ts'), provenanceParser, 'utf8');

    const { report } = runScannerCli(root, manifest([entry()]));
    const occurrences = [...report.mappedOccurrences, ...report.unmappedOccurrences];
    expect(occurrences.map((row) => row.sourcePath).sort()).toEqual([
      'src/features/provider-router.ts',
      'src/lib/builder/provider.ts',
    ]);
    expect(occurrences.find((row) => row.sourcePath === 'src/features/provider-router.ts')?.mappedEntryIds).toEqual([]);
  });

  it('scans a package start-reachable script even when its filename says smoke', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'scripts'), { recursive: true });
    writeFileSync(path.join(root, 'package.json'), JSON.stringify({
      scripts: { start: 'bash scripts/run-builder-smoke.sh' },
    }), 'utf8');
    writeFileSync(path.join(root, 'scripts/run-builder-smoke.sh'), 'export BOOKING_PAYMENT_ALLOW_STUB=1\n', 'utf8');
    const { status, report } = runScannerCli(root, manifest([entry()]));
    expect(status).toBe(2);
    expect(report.unmappedOccurrences).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourcePath: 'scripts/run-builder-smoke.sh', line: 1 }),
    ]));
  });

  it('fails when the production guard is removed while the stub marker remains', () => {
    const root = fixtureRoot();
    mkdirSync(path.join(root, 'src/lib/builder'), { recursive: true });
    writeFileSync(
      path.join(root, 'src/lib/builder/guard.ts'),
      "if (process.env.NODE_ENV === 'production') throw new Error('blocked');\n",
      'utf8',
    );
    const guardedEntry = entry({
      productionGuardAnchors: [{
        sourcePath: 'src/lib/builder/guard.ts',
        sourcePattern: "NODE_ENV === 'production'",
        expectedOccurrences: 1,
      }],
    });
    const before = verifyProductionStubRegistry(manifest([guardedEntry]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(before.gatePassed).toBe(true);

    writeFileSync(path.join(root, 'src/lib/builder/guard.ts'), 'export const stillConfigured = true;\n', 'utf8');
    const after = verifyProductionStubRegistry(manifest([guardedEntry]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(after.gatePassed).toBe(false);
    expect(after.entries[0]?.reasons).toContain('guard_pattern_count_mismatch:0:1:0');
  });

  it('opens the accepted hook partial-success row if its code note or hasHandler:false truth is lost', () => {
    const root = fixtureRoot();
    const hookPath = 'src/app/api/builder/apps/hooks/route.ts';
    mkdirSync(path.join(root, path.dirname(hookPath)), { recursive: true });
    const hookSource = [
      "let codeStubNote = 'code-body-stored-as-stub';",
      'const record = { codeStubNote };',
      'return NextResponse.json({ ok: true, hook: { ...record, hasHandler: false } }, { status: 201 });',
      '',
    ].join('\n');
    writeFileSync(path.join(root, hookPath), hookSource, 'utf8');
    const hookEntry = entry({
      id: 'app-hook-code-partial-success',
      sourcePath: hookPath,
      sourcePattern: 'code-body-stored-as-stub',
      occurrencePatterns: ['code-body-stored-as-stub'],
      productionGuardAnchors: [
        { sourcePath: hookPath, sourcePattern: 'codeStubNote', expectedOccurrences: 2 },
        { sourcePath: hookPath, sourcePattern: 'ok: true[\\s\\S]{0,100}?hasHandler: false[\\s\\S]{0,100}?status: 201', expectedOccurrences: 1 },
      ],
      productionPolicy: 'intentional-fallback',
      operationalSuccessAllowedInProduction: false,
    });
    const verify = () => verifyProductionStubRegistry(manifest([hookEntry]), {
      resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath),
    });
    expect(verify().gatePassed).toBe(true);

    writeFileSync(path.join(root, hookPath), hookSource.replace('hasHandler: false', 'hasHandler: true'), 'utf8');
    expect(verify().entries[0]?.reasons).toContain('guard_pattern_count_mismatch:1:1:0');

    writeFileSync(path.join(root, hookPath), hookSource.replace('code-body-stored-as-stub', 'secret-store-unavailable'), 'utf8');
    expect(verify().entries[0]?.reasons).toContain('source_pattern_count_mismatch:1:0');
  });

  it('keeps --dry-run filesystem-free even when an output directory is supplied', () => {
    const root = fixtureRoot();
    const outputDir = path.join(root, 'evidence-output');
    const { status } = runScannerCli(root, manifest([entry()]), outputDir);
    expect(status).toBe(0);
    expect(existsSync(outputDir)).toBe(false);
  });

  it('prints byte-identical deterministic output in --check mode', () => {
    const root = fixtureRoot();
    const registry = manifest([entry()]);
    const first = runScannerCheckCli(root, registry);
    const second = runScannerCheckCli(root, registry);
    expect(first.status).toBe(0);
    expect(first.stderr).toBe('');
    expect(second).toEqual(first);
    expect(first.stdout).toContain('R02 production stub gate: PASS');
  });

  it('closes widget-demo copy/feed rows against current source via the shared demo disclosure', () => {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const registry = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const resolveSource = (sourcePath: string) => resolveFixtureSource(process.cwd(), sourcePath);
    const verification = verifyProductionStubRegistry(registry, { resolveSource });
    const closedIds = [
      'broad-blog-author-mock-copy',
      'broad-blog-feed-mock-copy',
      'broad-blog-feed-mock-items',
      'broad-blog-post-card-mock',
      'broad-blog-post-card-mock-copy',
      'broad-blog-recent-mock-copy',
      'broad-event-widget-mock-copy',
      'broad-featured-posts-mock-feed',
      'broad-featured-posts-mock-copy',
      'broad-portfolio-mock-copy',
      'broad-product-gallery-mock-copy',
    ];
    for (const id of closedIds) {
      const row = verification.entries.find((candidate) => candidate.entry.id === id);
      expect(row, id).toBeDefined();
      expect(row?.effectivePolicy).toBe('placeholder-only');
      expect(row?.sourceMatched).toBe(true);
      expect(row?.reasons).toEqual([]);
    }
  });

  it('closes broad-event-widget-mock-copy because all three consumers anchor the shared disclosure', () => {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const registry = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const resolveSource = (sourcePath: string) => resolveFixtureSource(process.cwd(), sourcePath);
    const verification = verifyProductionStubRegistry(registry, { resolveSource });
    const row = verification.entries.find((candidate) => candidate.entry.id === 'broad-event-widget-mock-copy');
    expect(row, 'broad-event-widget-mock-copy row present').toBeDefined();
    expect(row?.effectivePolicy).toBe('placeholder-only');
    expect(row?.sourceMatched).toBe(true);
    expect(row?.reasons).toEqual([]);
    expect(row?.entry.visibleDisclosureAnchors.map((anchor) => anchor.productSourcePath)).toEqual([
      'src/lib/builder/components/eventCalendar/Element.tsx',
      'src/lib/builder/components/eventList/Element.tsx',
      'src/lib/builder/components/eventRsvp/Element.tsx',
    ]);
  });

  const EVENT_WIDGET_COPY_PATH = 'src/lib/builder/components/event-widgets-copy.ts';
  const EVENT_WIDGET_DISCLOSURE_PATH = 'src/lib/builder/components/_shared/WidgetDataDisclosure.tsx';
  const eventWidgetConsumers = [
    {
      label: 'event calendar consumer',
      productPath: 'src/lib/builder/components/eventCalendar/Element.tsx',
      anchorIndex: 0,
      renderGuardIndex: 0,
      mockValueGuardIndex: 3,
      mockValueUsage: 'isBuilder ? copy.mockEvents.calendar : []',
      mockValueMutation: 'isBuilder ? [] : []',
    },
    {
      label: 'event list consumer',
      productPath: 'src/lib/builder/components/eventList/Element.tsx',
      anchorIndex: 1,
      renderGuardIndex: 1,
      mockValueGuardIndex: 4,
      mockValueUsage: 'isBuilder ? copy.mockEvents.list : []',
      mockValueMutation: 'isBuilder ? [] : []',
    },
    {
      label: 'event rsvp consumer',
      productPath: 'src/lib/builder/components/eventRsvp/Element.tsx',
      anchorIndex: 2,
      renderGuardIndex: 2,
      mockValueGuardIndex: 5,
      mockValueUsage: 'isBuilder ? [copy.mockEvents.rsvp] : []',
      mockValueMutation: 'isBuilder ? [] : []',
    },
  ];

  function stageRealEventWidgetSources(root: string): void {
    const files = [
      EVENT_WIDGET_COPY_PATH,
      EVENT_WIDGET_DISCLOSURE_PATH,
      ...eventWidgetConsumers.map((consumer) => consumer.productPath),
    ];
    for (const relativePath of files) {
      mkdirSync(path.join(root, path.dirname(relativePath)), { recursive: true });
      writeFileSync(
        path.join(root, relativePath),
        readFileSync(path.resolve(process.cwd(), relativePath), 'utf8'),
        'utf8',
      );
    }
  }

  function verifyEventWidgetCandidate(
    root: string,
    candidate: ProductionStubCandidateInventoryEntry,
  ): ProductionStubVerification['entries'][number] | undefined {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const real = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const verification = verifyProductionStubRegistry(
      parseProductionStubManifest({ version: 1, entries: real.entries.slice(0, 1), candidateInventory: [candidate] }),
      { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) },
    );
    return verification.entries.find((row) => row.entry.id === 'broad-event-widget-mock-copy');
  }

  function readRealEventWidgetCandidate(): ProductionStubCandidateInventoryEntry {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const real = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const candidate = real.candidateInventory.find((entry) => entry.id === 'broad-event-widget-mock-copy');
    expect(candidate, 'broad-event-widget-mock-copy candidate present').toBeDefined();
    return candidate as ProductionStubCandidateInventoryEntry;
  }

  it.each(eventWidgetConsumers)(
    'reopens broad-event-widget-mock-copy when $label loses its event-copy import, mock value use, disclosure import, or disclosure render',
    (consumer) => {
      const root = fixtureRoot();
      const base = readRealEventWidgetCandidate();

      // Each edge re-stages the real sources into a fresh fixture state and
      // applies exactly one mutation, so no two edges combine.
      const verifyAfterMutation = (mutate: (source: string) => string) => {
        stageRealEventWidgetSources(root);
        const productFile = path.join(root, consumer.productPath);
        writeFileSync(productFile, mutate(readFileSync(productFile, 'utf8')), 'utf8');
        return verifyEventWidgetCandidate(root, base);
      };

      // Baseline: real sources, no mutation.
      expect(verifyAfterMutation((source) => source)?.effectivePolicy).toBe('placeholder-only');

      // Edge 1: event-copy import removed only. The mock value text and the
      // disclosure render both remain, so only the disclosure product reference
      // count drops.
      const lostCopyImportRow = verifyAfterMutation((source) => source.replace(
        /from '\.\.\/event-widgets-copy'/u,
        "from '../unrelated-event-copy'",
      ));
      expect(lostCopyImportRow?.effectivePolicy).toBe('open');
      expect(lostCopyImportRow?.sourceMatched).toBe(false);
      expect(lostCopyImportRow?.reasons).toContain(`visible_disclosure_product_count_mismatch:${consumer.anchorIndex}:2:1`);

      // Edge 2: actual builder-only mock value use changed only, while the
      // event-copy import and the disclosure both remain. Only the mock-value
      // guard fails, so an unused import cannot keep this row closed.
      const lostMockValueRow = verifyAfterMutation((source) => source.replace(
        consumer.mockValueUsage,
        consumer.mockValueMutation,
      ));
      expect(lostMockValueRow?.effectivePolicy).toBe('open');
      expect(lostMockValueRow?.sourceMatched).toBe(false);
      expect(lostMockValueRow?.reasons).toContain(`guard_pattern_count_mismatch:${consumer.mockValueGuardIndex}:1:0`);

      // Edge 3: disclosure import removed only, while the render and copy import remain.
      const lostDisclosureImportRow = verifyAfterMutation((source) => source.replace(
        /from '\.\.\/_shared\/WidgetDataDisclosure'/u,
        "from '../_shared/UnrelatedDisclosure'",
      ));
      expect(lostDisclosureImportRow?.effectivePolicy).toBe('open');
      expect(lostDisclosureImportRow?.sourceMatched).toBe(false);
      expect(lostDisclosureImportRow?.reasons).toContain(`visible_disclosure_product_not_referenced:${consumer.anchorIndex}`);

      // Edge 4: disclosure render removed only, while its import and the copy import remain.
      const lostDisclosureRenderRow = verifyAfterMutation((source) => source.replace(
        '<WidgetDataDisclosure locale={effectiveLocale} />',
        '<span />',
      ));
      expect(lostDisclosureRenderRow?.effectivePolicy).toBe('open');
      expect(lostDisclosureRenderRow?.sourceMatched).toBe(false);
      expect(lostDisclosureRenderRow?.reasons).toContain(`guard_pattern_count_mismatch:${consumer.renderGuardIndex}:1:0`);
      expect(lostDisclosureRenderRow?.reasons).toContain(`visible_disclosure_product_count_mismatch:${consumer.anchorIndex}:2:1`);
    },
  );

  it('scopes broad-event-widget-mock-copy consumers to the three rendered Elements and excludes the EventRsvp registration import', () => {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const registry = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const candidate = registry.candidateInventory.find((entry) => entry.id === 'broad-event-widget-mock-copy');
    expect(candidate, 'broad-event-widget-mock-copy candidate present').toBeDefined();
    if (!candidate) return;

    // The disclosure consumer set is exactly the three Element products that
    // render copy.mockEvents.* under isBuilder.
    expect(candidate.visibleDisclosureAnchors.map((anchor) => anchor.productSourcePath)).toEqual([
      'src/lib/builder/components/eventCalendar/Element.tsx',
      'src/lib/builder/components/eventList/Element.tsx',
      'src/lib/builder/components/eventRsvp/Element.tsx',
    ]);

    // Each rendered consumer independently anchors its own builder-only mock
    // value use (isBuilder gating AND the copy.mockEvents reference together),
    // so an unused event-copy import cannot satisfy the row.
    const mockValueGuards = candidate.productionGuardAnchors.slice(3);
    expect(mockValueGuards).toHaveLength(3);
    expect(mockValueGuards.map((guard) => guard.sourcePath)).toEqual([
      'src/lib/builder/components/eventCalendar/Element.tsx',
      'src/lib/builder/components/eventList/Element.tsx',
      'src/lib/builder/components/eventRsvp/Element.tsx',
    ]);
    expect(mockValueGuards.every((guard) => guard.sourcePattern.includes('isBuilder')
      && guard.sourcePattern.includes('mockEvents')
      && guard.expectedOccurrences === 1)).toBe(true);

    // EventRsvp's index.ts imports only the non-rendered registration default
    // (EVENT_RSVP_LEGACY_DEFAULTS) and never references copy.mockEvents, so it
    // is intentionally outside the rendered disclosure consumer set.
    const registrationModule = readFileSync(
      path.resolve(process.cwd(), 'src/lib/builder/components/eventRsvp/index.ts'),
      'utf8',
    );
    expect(registrationModule).toContain("from '../event-widgets-copy'");
    expect(registrationModule).not.toContain('mockEvents');
    expect(candidate.visibleDisclosureAnchors.some((anchor) => anchor.productSourcePath.endsWith('eventRsvp/index.ts'))).toBe(false);
  });

  it('reopens a widget-demo copy row when its visible disclosure or product reference is removed', () => {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const real = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const resolveSource = (sourcePath: string) => resolveFixtureSource(process.cwd(), sourcePath);
    const base = real.candidateInventory.find((candidate) => candidate.id === 'broad-blog-author-mock-copy');
    expect(base).toBeDefined();
    if (!base) return;

    const verifyCandidate = (candidate: ProductionStubCandidateInventoryEntry) => verifyProductionStubRegistry(
      parseProductionStubManifest({ version: 1, entries: real.entries.slice(0, 1), candidateInventory: [candidate] }),
      { resolveSource },
    ).entries.find((row) => row.entry.id === 'broad-blog-author-mock-copy');

    expect(verifyCandidate(base)?.effectivePolicy).toBe('placeholder-only');

    const withoutDisclosure: ProductionStubCandidateInventoryEntry = { ...base, visibleDisclosureAnchors: [] };
    expect(verifyCandidate(withoutDisclosure)?.reasons).toContain('missing_visible_disclosure');

    const detachedProduct: ProductionStubCandidateInventoryEntry = {
      ...base,
      visibleDisclosureAnchors: base.visibleDisclosureAnchors.map((anchor) => ({
        ...anchor,
        productSourcePath: 'src/lib/builder/components/blogAuthor/blog-author-copy.ts',
      })),
    };
    const detached = verifyCandidate(detachedProduct);
    expect(detached?.effectivePolicy).toBe('open');
    expect(detached?.sourceMatched).toBe(false);
  });

  it('closes a shared disclosure mapped once per distinct product consumer without regex-spelling games', () => {
    const root = fixtureRoot();
    const paths = writeSharedDisclosureFixture(root);
    const verification = verifySharedCandidate(root, sharedEventCopyCandidate(paths));
    expect(verification.gatePassed).toBe(true);
    const candidateRow = findSharedCandidateRow(verification);
    expect(candidateRow.effectivePolicy).toBe('placeholder-only');
    expect(candidateRow.sourceMatched).toBe(true);
    expect(candidateRow.reasons).toEqual([]);
  });

  it.each(sharedDisclosureConsumers)(
    'reopens when $label drops only the shared disclosure import while keeping its render',
    (consumer) => {
      const root = fixtureRoot();
      const paths = writeSharedDisclosureFixture(root);
      writeFileSync(
        path.join(root, paths[consumer.productKey]),
        sharedConsumerProductSource(consumer.productKey, 'disclosure-import-removed'),
        'utf8',
      );
      const verification = verifySharedCandidate(root, sharedEventCopyCandidate(paths));
      expect(verification.gatePassed).toBe(false);
      const row = findSharedCandidateRow(verification);
      expect(row.sourceMatched).toBe(false);
      expect(row.reasons).toContain(`visible_disclosure_product_not_referenced:${consumer.anchorIndex}`);
      expect(row.reasons).toContain(`visible_disclosure_product_count_mismatch:${consumer.anchorIndex}:2:1`);
    },
  );

  it.each(sharedDisclosureConsumers)(
    'reopens when $label drops only the shared disclosure render while keeping its import',
    (consumer) => {
      const root = fixtureRoot();
      const paths = writeSharedDisclosureFixture(root);
      writeFileSync(
        path.join(root, paths[consumer.productKey]),
        sharedConsumerProductSource(consumer.productKey, 'disclosure-render-removed'),
        'utf8',
      );
      const verification = verifySharedCandidate(root, sharedEventCopyCandidate(paths));
      expect(verification.gatePassed).toBe(false);
      const row = findSharedCandidateRow(verification);
      expect(row.sourceMatched).toBe(false);
      expect(row.reasons).toContain(`guard_pattern_count_mismatch:${consumer.disclosureRenderGuardIndex}:1:0`);
      expect(row.reasons).toContain(`visible_disclosure_product_count_mismatch:${consumer.anchorIndex}:2:1`);
    },
  );

  it.each(sharedDisclosureConsumers)(
    'reopens when $label drops only the event-copy import while keeping its reference',
    (consumer) => {
      const root = fixtureRoot();
      const paths = writeSharedDisclosureFixture(root);
      writeFileSync(
        path.join(root, paths[consumer.productKey]),
        sharedConsumerProductSource(consumer.productKey, 'event-copy-import-removed'),
        'utf8',
      );
      const verification = verifySharedCandidate(root, sharedEventCopyCandidate(paths));
      expect(verification.gatePassed).toBe(false);
      const row = findSharedCandidateRow(verification);
      expect(row.sourceMatched).toBe(false);
      expect(row.reasons).toContain(`guard_pattern_count_mismatch:${consumer.eventCopyImportGuardIndex}:1:0`);
    },
  );

  it.each(sharedDisclosureConsumers)(
    'reopens when $label drops only the event-copy reference while keeping its import',
    (consumer) => {
      const root = fixtureRoot();
      const paths = writeSharedDisclosureFixture(root);
      writeFileSync(
        path.join(root, paths[consumer.productKey]),
        sharedConsumerProductSource(consumer.productKey, 'event-copy-reference-removed'),
        'utf8',
      );
      const verification = verifySharedCandidate(root, sharedEventCopyCandidate(paths));
      expect(verification.gatePassed).toBe(false);
      const row = findSharedCandidateRow(verification);
      expect(row.sourceMatched).toBe(false);
      expect(row.reasons).toContain(`guard_pattern_count_mismatch:${consumer.eventCopyUsageGuardIndex}:1:0`);
    },
  );

  it.each(sharedDisclosureConsumers)(
    'reopens when the productSourcePattern for $label does not match the product source',
    (consumer) => {
      const root = fixtureRoot();
      const paths = writeSharedDisclosureFixture(root);
      const baseline = sharedEventCopyCandidate(paths);
      const candidate: ProductionStubCandidateInventoryEntry = {
        ...baseline,
        visibleDisclosureAnchors: baseline.visibleDisclosureAnchors.map((anchor, index) => (
          index === consumer.anchorIndex
            ? { ...anchor, productSourcePattern: 'NoSuchWidgetDisclosureReference' }
            : anchor
        )),
      };
      const verification = verifySharedCandidate(root, candidate);
      expect(verification.gatePassed).toBe(false);
      const row = findSharedCandidateRow(verification);
      expect(row.sourceMatched).toBe(false);
      expect(row.reasons).toContain(`visible_disclosure_product_count_mismatch:${consumer.anchorIndex}:2:0`);
    },
  );

  it('still rejects an exact duplicate disclosure anchor mapped to the same product', () => {
    const root = fixtureRoot();
    const paths = writeSharedDisclosureFixture(root);
    const resolveSource = (sourcePath: string) => resolveFixtureSource(root, sourcePath);
    const registry = parseProductionStubManifest({
      version: 1,
      entries: [entry()],
      candidateInventory: [{
        id: 'broad-event-copy-shared',
        category: 'widget-demo',
        sourcePath: paths.copyPath,
        expectedOccurrences: 2,
        productionGuardAnchors: [
          { sourcePath: paths.productAPath, sourcePattern: DISCLOSURE_RENDER_PATTERN, expectedOccurrences: 1 },
        ],
        productionPolicy: 'placeholder-only',
        surfaceKind: 'rendered-demo',
        visibleDisclosureAnchors: [
          widgetDisclosureAnchor(paths.disclosurePath, paths.productAPath),
          widgetDisclosureAnchor(paths.disclosurePath, paths.productAPath),
        ],
        owner: 'builder-components',
        notes: 'duplicate anchor mapped to the same product',
      }],
    });
    const verification = verifyProductionStubRegistry(registry, { resolveSource });
    expect(verification.gatePassed).toBe(false);
    expect(verification.errors).toContain('duplicate_visible_disclosure_anchor:broad-event-copy-shared:1');
  });

  const SOCIAL_COPY_PATH = 'src/lib/builder/components/social-widgets-copy.ts';
  const SOCIAL_EMBED_PATH = 'src/lib/builder/components/socialEmbed/index.tsx';

  function readRealSocialEntry(): ProductionStubEntry {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const real = parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const social = real.entries.find((candidate) => candidate.id === 'social-instagram-placeholder');
    expect(social, 'social-instagram-placeholder entry present').toBeDefined();
    return social as ProductionStubEntry;
  }

  function verifySocialEntry(
    root: string,
    socialEntry: ProductionStubEntry,
  ): ProductionStubVerification['entries'][number] {
    const verification = verifyProductionStubRegistry(
      parseProductionStubManifest({ version: 1, entries: [socialEntry] }),
      { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) },
    );
    const row = verification.entries.find((candidate) => candidate.entry.id === 'social-instagram-placeholder');
    expect(row, 'social-instagram-placeholder row present').toBeDefined();
    return row as ProductionStubVerification['entries'][number];
  }

  function stageRealSocialSources(root: string): void {
    for (const relativePath of [SOCIAL_COPY_PATH, SOCIAL_EMBED_PATH]) {
      mkdirSync(path.join(root, path.dirname(relativePath)), { recursive: true });
      writeFileSync(
        path.join(root, relativePath),
        readFileSync(path.resolve(process.cwd(), relativePath), 'utf8'),
        'utf8',
      );
    }
  }

  it('closes social-instagram-placeholder against current source via the consumer disclosure', () => {
    const socialEntry = readRealSocialEntry();
    const row = verifySocialEntry(process.cwd(), socialEntry);
    expect(row.effectivePolicy).toBe('placeholder-only');
    expect(row.sourceMatched).toBe(true);
    expect(row.reasons).toEqual([]);
    // The disclosure anchor points at the real consumer path, not the copy
    // inventory, and the guard set includes the consumer unavailable branch.
    expect(row.entry.visibleDisclosureAnchors.map((anchor) => anchor.productSourcePath)).toEqual([SOCIAL_EMBED_PATH]);
    expect(row.entry.productionGuardAnchors.map((guard) => guard.sourcePath)).toEqual([SOCIAL_COPY_PATH, SOCIAL_EMBED_PATH]);
  });

  it('reopens social-instagram-placeholder when the consumer disclosure attribute is removed', () => {
    const root = fixtureRoot();
    stageRealSocialSources(root);
    const embedFile = path.join(root, SOCIAL_EMBED_PATH);
    writeFileSync(
      embedFile,
      readFileSync(embedFile, 'utf8').replace(
        /data-builder-demo-disclosure="social-embed-placeholder"/g,
        'data-builder-social-status="ready"',
      ),
      'utf8',
    );
    const row = verifySocialEntry(root, readRealSocialEntry());
    expect(row.effectivePolicy).toBe('open');
    expect(row.sourceMatched).toBe(false);
    expect(row.reasons).toContain('visible_disclosure_product_count_mismatch:0:2:0');
  });

  it('reopens social-instagram-placeholder when both public unavailability expressions are removed', () => {
    const root = fixtureRoot();
    stageRealSocialSources(root);
    const embedFile = path.join(root, SOCIAL_EMBED_PATH);
    writeFileSync(
      embedFile,
      readFileSync(embedFile, 'utf8')
        .replace('copy.socialEmbed.unavailableTitle', "'Feed offline'")
        .replace('copy.socialEmbed.unavailableMessage', "'Check back later.'"),
      'utf8',
    );
    const row = verifySocialEntry(root, readRealSocialEntry());
    expect(row.effectivePolicy).toBe('open');
    expect(row.sourceMatched).toBe(false);
    expect(row.reasons).toContain('visible_disclosure_not_rendered:0');
  });

  const MARKETING_EMAIL_PROVIDER_PATH = 'src/lib/builder/marketing/email-provider.ts';
  const MARKETING_DELIVERABILITY_PATH = 'src/lib/builder/marketing/deliverability.ts';
  const MARKETING_BROAD_MOCK_STUB_PATTERN = '(?:[Mm][Oo][Cc][Kk]|[Ss][Tt][Uu][Bb])';

  function readRealProductionStubManifest(): ProductionStubManifest {
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    return parseProductionStubManifest(JSON.parse(readFileSync(manifestPath, 'utf8')));
  }

  function verifyRealProductionStubRegistry(): ProductionStubVerification {
    return verifyProductionStubRegistry(readRealProductionStubManifest(), {
      resolveSource: (sourcePath) => resolveFixtureSource(process.cwd(), sourcePath),
    });
  }

  function runRealRepoScanner(): ProductionStubReport {
    const cliPath = path.resolve(process.cwd(), 'scripts/run-production-stub-registry.mjs');
    const manifestPath = path.resolve(process.cwd(), 'docs/stub-registry/production-stubs.json');
    const result = spawnSync(process.execPath, [
      cliPath,
      '--repository-root', process.cwd(),
      '--manifest', manifestPath,
      '--dry-run',
    ], { cwd: process.cwd(), encoding: 'utf8', env: childCliEnv() });
    if (result.error) throw result.error;
    const markdownStart = result.stdout.indexOf('\n# Production stub registry\n');
    if (markdownStart < 0) throw new Error(`registry CLI returned an unreadable report: ${result.stderr}`);
    return JSON.parse(result.stdout.slice(0, markdownStart)) as ProductionStubReport;
  }

  function readMarketingMockStubOccurrences(sourcePath: string) {
    const source = readFileSync(path.resolve(process.cwd(), sourcePath), 'utf8');
    const compiled = new RegExp(MARKETING_BROAD_MOCK_STUB_PATTERN, 'gmu');
    const occurrences: { sourcePath: string; line: number; text: string }[] = [];
    for (let match = compiled.exec(source); match; match = compiled.exec(source)) {
      const line = source.slice(0, match.index).split('\n').length;
      occurrences.push({ sourcePath, line, text: match[0] });
    }
    return occurrences;
  }

  it('absorbs the marketing email stub inventory into blocked registered rows with exact counts', () => {
    const verification = verifyRealProductionStubRegistry();
    const providerRow = verification.entries.find((row) => row.entry.id === 'marketing-email-stub');
    const readinessRow = verification.entries.find((row) => row.entry.id === 'marketing-email-stub-readiness');
    expect(providerRow, 'marketing-email-stub registered row present').toBeDefined();
    expect(readinessRow, 'marketing-email-stub-readiness registered row present').toBeDefined();
    if (!providerRow || !readinessRow) return;

    expect(providerRow.entry.sourcePath).toBe(MARKETING_EMAIL_PROVIDER_PATH);
    expect(providerRow.entry.sourcePattern).toBe("provider === 'stub'");
    expect(providerRow.entry.sourceExpectedOccurrences).toBe(1);
    expect(providerRow.entry.occurrencePatterns).toEqual([MARKETING_BROAD_MOCK_STUB_PATTERN]);
    expect(providerRow.entry.expectedOccurrences).toBe(8);
    expect(providerRow.entry.productionPolicy).toBe('blocked');
    expect(providerRow.entry.operationalSuccessAllowedInProduction).toBe(false);
    expect(providerRow.effectivePolicy).toBe('blocked');
    expect(providerRow.sourceMatched).toBe(true);
    expect(providerRow.reasons).toEqual([]);

    expect(readinessRow.entry.sourcePath).toBe(MARKETING_DELIVERABILITY_PATH);
    expect(readinessRow.entry.sourcePattern).toBe("provider === 'stub'");
    expect(readinessRow.entry.sourceExpectedOccurrences).toBe(1);
    expect(readinessRow.entry.occurrencePatterns).toEqual([MARKETING_BROAD_MOCK_STUB_PATTERN]);
    expect(readinessRow.entry.expectedOccurrences).toBe(3);
    expect(readinessRow.entry.productionPolicy).toBe('blocked');
    expect(readinessRow.entry.operationalSuccessAllowedInProduction).toBe(false);
    expect(readinessRow.effectivePolicy).toBe('blocked');
    expect(readinessRow.sourceMatched).toBe(true);
    expect(readinessRow.reasons).toEqual([]);
  });

  it('removes the absorbed broad marketing email candidates from the inventory', () => {
    const manifest = readRealProductionStubManifest();
    const candidateIds = manifest.candidateInventory.map((candidate) => candidate.id);
    expect(candidateIds).not.toContain('broad-marketing-email-stub-runtime');
    expect(candidateIds).not.toContain('broad-marketing-stub-disclosure');
  });

  it('leaves zero unmapped mock/stub occurrences in either marketing source file', () => {
    const report = runRealRepoScanner();
    const marketingUnmapped = report.unmappedOccurrences.filter((row) => (
      row.sourcePath === MARKETING_EMAIL_PROVIDER_PATH
      || row.sourcePath === MARKETING_DELIVERABILITY_PATH
    ));
    expect(marketingUnmapped).toEqual([]);
    const providerMapped = report.mappedOccurrences.filter((row) => row.sourcePath === MARKETING_EMAIL_PROVIDER_PATH);
    const deliverabilityMapped = report.mappedOccurrences.filter((row) => row.sourcePath === MARKETING_DELIVERABILITY_PATH);
    expect(providerMapped.length).toBeGreaterThan(0);
    expect(providerMapped.every((row) => row.mappedEntryIds.includes('marketing-email-stub'))).toBe(true);
    expect(deliverabilityMapped.length).toBe(3);
    expect(deliverabilityMapped.every((row) => row.mappedEntryIds.includes('marketing-email-stub-readiness'))).toBe(true);
  }, 30000);

  it('reopens every email-provider mock/stub token as unmapped when the marketing-email-stub row is deleted', () => {
    const manifest = readRealProductionStubManifest();
    const occurrences = readMarketingMockStubOccurrences(MARKETING_EMAIL_PROVIDER_PATH);
    expect(occurrences.length).toBe(8);
    const baseline = mapProductionStubOccurrences(occurrences, manifest);
    expect(baseline.every((row) => row.mappedEntryIds.includes('marketing-email-stub'))).toBe(true);

    const deleted = parseProductionStubManifest({
      version: manifest.version,
      entries: manifest.entries.filter((entry) => entry.id !== 'marketing-email-stub'),
      candidateInventory: manifest.candidateInventory,
    });
    const after = mapProductionStubOccurrences(occurrences, deleted);
    expect(after.length).toBe(8);
    expect(after.every((row) => row.mappedEntryIds.length === 0)).toBe(true);
  });

  it('reopens every deliverability mock/stub token as unmapped when the marketing-email-stub-readiness row is deleted', () => {
    const manifest = readRealProductionStubManifest();
    const occurrences = readMarketingMockStubOccurrences(MARKETING_DELIVERABILITY_PATH);
    expect(occurrences.length).toBe(3);
    const baseline = mapProductionStubOccurrences(occurrences, manifest);
    expect(baseline.every((row) => row.mappedEntryIds.includes('marketing-email-stub-readiness'))).toBe(true);

    const deleted = parseProductionStubManifest({
      version: manifest.version,
      entries: manifest.entries.filter((entry) => entry.id !== 'marketing-email-stub-readiness'),
      candidateInventory: manifest.candidateInventory,
    });
    const after = mapProductionStubOccurrences(occurrences, deleted);
    expect(after.length).toBe(3);
    expect(after.every((row) => row.mappedEntryIds.length === 0)).toBe(true);
  });

  const TRANSLATION_BATCH_STREAM_PATH = 'src/components/builder/translations/translation-batch-stream.ts';
  const TRANSLATION_BATCH_ROUTER_PATH = 'src/lib/builder/translations/providers/batch-router.ts';
  const TRANSLATION_SINGLE_ROUTER_PATH = 'src/lib/builder/translations/providers/single-router.ts';
  const TRANSLATION_READINESS_SCHEMA_PATH = 'src/components/builder/translations/translation-provider-readiness-schemas.ts';
  const TRANSLATION_DIAGNOSTICS_PATH = 'src/lib/builder/translations/providers/diagnostics.ts';

  const ABSORBED_TRANSLATION_IDS = [
    'broad-translation-stream-mock-events',
    'broad-translation-single-mock-runtime',
    'broad-translation-readiness-mock',
  ];
  const REQUIRED_OPEN_TRANSLATION_IDS = [
    'broad-translation-batch-mock-runtime',
    'broad-translation-diagnostics-mock',
  ];

  function readRealTranslationEntry(id: string): ProductionStubEntry {
    const entry = readRealProductionStubManifest().entries.find((candidate) => candidate.id === id);
    expect(entry, `${id} registered entry present`).toBeDefined();
    return entry as ProductionStubEntry;
  }

  function stageRealTranslationSources(root: string, sourcePaths: readonly string[]): void {
    for (const relativePath of sourcePaths) {
      mkdirSync(path.join(root, path.dirname(relativePath)), { recursive: true });
      writeFileSync(
        path.join(root, relativePath),
        readFileSync(path.resolve(process.cwd(), relativePath), 'utf8'),
        'utf8',
      );
    }
  }

  function verifyStagedTranslationEntry(
    root: string,
    entry: ProductionStubEntry,
  ): ProductionStubVerification['entries'][number] {
    const verification = verifyProductionStubRegistry(
      parseProductionStubManifest({ version: 1, entries: [entry] }),
      { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) },
    );
    return verification.entries[0];
  }

  it('absorbs the guarded translation mock inventory into matched blocked registered rows', () => {
    const verification = verifyRealProductionStubRegistry();
    for (const id of [
      'translation-mock-stream-client-schema',
      'translation-mock-single-result',
      'translation-mock-readiness-schema',
    ]) {
      const row = verification.entries.find((candidate) => candidate.entry.id === id);
      expect(row, id).toBeDefined();
      expect(row?.effectivePolicy).toBe('blocked');
      expect(row?.sourceMatched).toBe(true);
      expect(row?.reasons).toEqual([]);
    }
  });

  it('removes the three absorbed broad translation candidates and keeps the two required-open rows', () => {
    const candidateIds = readRealProductionStubManifest().candidateInventory.map((candidate) => candidate.id);
    for (const id of ABSORBED_TRANSLATION_IDS) {
      expect(candidateIds, `${id} must be absent`).not.toContain(id);
    }
    for (const id of REQUIRED_OPEN_TRANSLATION_IDS) {
      expect(candidateIds, `${id} must remain present`).toContain(id);
    }
    const openIds = verifyRealProductionStubRegistry().entries
      .filter((row) => row.effectivePolicy === 'open')
      .map((row) => row.entry.id);
    expect(openIds).toEqual(expect.arrayContaining(REQUIRED_OPEN_TRANSLATION_IDS));
    for (const id of ABSORBED_TRANSLATION_IDS) {
      expect(openIds, `${id} must no longer be open`).not.toContain(id);
    }
  });

  it('leaves zero unmapped mock/stub occurrences across the three absorbed translation source files', () => {
    const report = runRealRepoScanner();
    const translationUnmapped = report.unmappedOccurrences.filter((row) => [
      TRANSLATION_BATCH_STREAM_PATH,
      TRANSLATION_SINGLE_ROUTER_PATH,
      TRANSLATION_READINESS_SCHEMA_PATH,
    ].includes(row.sourcePath));
    expect(translationUnmapped).toEqual([]);
  }, 30000);

  interface TranslationAbsorptionEdge {
    readonly label: string;
    readonly entryId: string;
    readonly sourcePaths: readonly string[];
    readonly mutateFile: string;
    readonly mutate: (source: string) => string;
    readonly expectedReason: string;
  }

  const translationAbsorptionEdges: readonly TranslationAbsorptionEdge[] = [
    {
      label: 'mock-complete stream event occurrence',
      entryId: 'translation-mock-stream-client-schema',
      sourcePaths: [TRANSLATION_BATCH_STREAM_PATH, TRANSLATION_BATCH_ROUTER_PATH],
      mutateFile: TRANSLATION_BATCH_STREAM_PATH,
      mutate: (source) => source.replace("'mock-complete'", "'complete'"),
      expectedReason: 'occurrence_pattern_missing:1',
    },
    {
      label: 'stream client provider type occurrence',
      entryId: 'translation-mock-stream-client-schema',
      sourcePaths: [TRANSLATION_BATCH_STREAM_PATH, TRANSLATION_BATCH_ROUTER_PATH],
      mutateFile: TRANSLATION_BATCH_STREAM_PATH,
      mutate: (source) => source.replace(
        "provider: 'openai' | 'deepl' | 'mock'",
        "provider: 'openai' | 'deepl' | 'demo'",
      ),
      expectedReason: 'occurrence_pattern_missing:2',
    },
    {
      label: 'single-router mockResult occurrence',
      entryId: 'translation-mock-single-result',
      sourcePaths: [TRANSLATION_SINGLE_ROUTER_PATH],
      mutateFile: TRANSLATION_SINGLE_ROUTER_PATH,
      mutate: (source) => source.replace(/mockResult/gu, 'demoResult'),
      expectedReason: 'occurrence_pattern_missing:1',
    },
    {
      label: "single-router 'mock' in selected occurrence",
      entryId: 'translation-mock-single-result',
      sourcePaths: [TRANSLATION_SINGLE_ROUTER_PATH],
      mutateFile: TRANSLATION_SINGLE_ROUTER_PATH,
      mutate: (source) => source.replace("'mock' in selected", "'mock' in chosen"),
      expectedReason: 'occurrence_pattern_missing:2',
    },
    {
      label: 'readiness schema z.literal(mock) occurrence',
      entryId: 'translation-mock-readiness-schema',
      sourcePaths: [TRANSLATION_READINESS_SCHEMA_PATH, TRANSLATION_DIAGNOSTICS_PATH],
      mutateFile: TRANSLATION_READINESS_SCHEMA_PATH,
      mutate: (source) => source.replace("z.literal('mock')", "z.literal('demo')"),
      expectedReason: 'source_pattern_count_mismatch:1:0',
    },
    {
      label: 'readiness diagnostics production guard',
      entryId: 'translation-mock-readiness-schema',
      sourcePaths: [TRANSLATION_READINESS_SCHEMA_PATH, TRANSLATION_DIAGNOSTICS_PATH],
      mutateFile: TRANSLATION_DIAGNOSTICS_PATH,
      mutate: (source) => source.replace(
        "status: production ? 'fail' : 'warn'",
        "status: production ? 'error' : 'warn'",
      ),
      expectedReason: 'guard_pattern_count_mismatch:0:1:0',
    },
  ];

  it.each(translationAbsorptionEdges)(
    'reopens $entryId when the $label edge is removed from real source',
    (edge) => {
      const entry = readRealTranslationEntry(edge.entryId);
      const root = fixtureRoot();
      stageRealTranslationSources(root, edge.sourcePaths);
      const targetFile = path.join(root, edge.mutateFile);
      const original = readFileSync(targetFile, 'utf8');

      const baseline = verifyStagedTranslationEntry(root, entry);
      expect(baseline.effectivePolicy).toBe('blocked');
      expect(baseline.sourceMatched).toBe(true);

      writeFileSync(targetFile, edge.mutate(original), 'utf8');
      const mutated = verifyStagedTranslationEntry(root, entry);
      expect(mutated.effectivePolicy).toBe('open');
      expect(mutated.sourceMatched).toBe(false);
      expect(mutated.reasons).toContain(edge.expectedReason);
    },
  );

  const FUNCTIONS_ADMIN_PATH = 'src/components/builder/dev/FunctionsAdmin.tsx';
  const FUNCTIONS_ADMIN_UTILS_PATH = 'src/components/builder/dev/functions-admin-utils.ts';
  const FUNCTIONS_INVOKE_ROUTE_PATH = 'src/app/api/builder/dev/functions/[id]/invoke/route.ts';
  const FUNCTIONS_INVOKER_PATH = 'src/lib/builder/dev/function-invoker.ts';
  const FUNCTIONS_MODEL_PATH = 'src/lib/builder/dev/functions-model.ts';
  const FUNCTION_SANDBOX_SOURCES = [
    FUNCTIONS_ADMIN_PATH,
    FUNCTIONS_ADMIN_UTILS_PATH,
    FUNCTIONS_INVOKE_ROUTE_PATH,
    FUNCTIONS_INVOKER_PATH,
    FUNCTIONS_MODEL_PATH,
  ] as const;

  function readRealFunctionsCandidate(id: string): ProductionStubCandidateInventoryEntry {
    const candidate = readRealProductionStubManifest().candidateInventory.find((entry) => entry.id === id);
    expect(candidate, `${id} candidate present`).toBeDefined();
    return candidate as ProductionStubCandidateInventoryEntry;
  }

  function stageRealFunctionSources(root: string): void {
    for (const relativePath of FUNCTION_SANDBOX_SOURCES) {
      mkdirSync(path.join(root, path.dirname(relativePath)), { recursive: true });
      writeFileSync(
        path.join(root, relativePath),
        readFileSync(path.resolve(process.cwd(), relativePath), 'utf8'),
        'utf8',
      );
    }
  }

  function verifyFunctionsCandidate(
    root: string,
    candidate: ProductionStubCandidateInventoryEntry,
  ): ProductionStubVerification['entries'][number] | undefined {
    const real = readRealProductionStubManifest();
    const verification = verifyProductionStubRegistry(
      parseProductionStubManifest({ version: 1, entries: real.entries.slice(0, 1), candidateInventory: [candidate] }),
      { resolveSource: (sourcePath) => resolveFixtureSource(root, sourcePath) },
    );
    return verification.entries.find((row) => row.entry.id === candidate.id);
  }

  it('closes broad-functions-admin-node-stub against current source via the visible DEMO sandbox disclosure', () => {
    const candidate = readRealFunctionsCandidate('broad-functions-admin-node-stub');
    const row = verifyFunctionsCandidate(process.cwd(), candidate);
    expect(row, 'broad-functions-admin-node-stub row present').toBeDefined();
    expect(row?.effectivePolicy).toBe('placeholder-only');
    expect(row?.sourceMatched).toBe(true);
    expect(row?.reasons).toEqual([]);
    // The disclosure anchors the rendered admin UI to the stored node-stub
    // product, and the guards prove the invoke operation stays
    // settings-authenticated on the bounded worker-vm runtime.
    expect(row?.entry.visibleDisclosureAnchors.map((anchor) => anchor.productSourcePath)).toEqual([FUNCTIONS_ADMIN_UTILS_PATH]);
    expect(row?.entry.productionGuardAnchors.map((guard) => guard.sourcePath)).toEqual([
      FUNCTIONS_INVOKE_ROUTE_PATH,
      FUNCTIONS_INVOKER_PATH,
    ]);
  });

  interface FunctionSandboxEdge {
    readonly label: string;
    readonly mutateFile: string;
    readonly mutate: (source: string) => string;
    readonly expectedReason: string;
  }

  const functionSandboxEdges: readonly FunctionSandboxEdge[] = [
    {
      label: 'visible DEMO disclosure marker',
      mutateFile: FUNCTIONS_ADMIN_PATH,
      mutate: (source) => source.replace('data-builder-dev-disclosure="function-sandbox"', 'data-builder-dev-disclosure="removed"'),
      expectedReason: 'visible_disclosure_not_rendered:0',
    },
    {
      label: 'visible DEMO label text',
      mutateFile: FUNCTIONS_ADMIN_PATH,
      mutate: (source) => source.replace('<strong>DEMO</strong>', '<strong>SANDBOX</strong>'),
      expectedReason: 'visible_disclosure_not_rendered:0',
    },
    {
      label: 'product source reference import',
      mutateFile: FUNCTIONS_ADMIN_PATH,
      mutate: (source) => source.replace("from './functions-admin-utils'", "from './unrelated-admin-utils'"),
      expectedReason: 'visible_disclosure_product_not_referenced:0',
    },
    {
      label: 'settings-authenticated invoke guard',
      mutateFile: FUNCTIONS_INVOKE_ROUTE_PATH,
      mutate: (source) => source.replace("guardMutation(request, { permission: 'settings' })", "guardMutation(request, { permission: 'content' })"),
      expectedReason: 'guard_pattern_count_mismatch:0:1:0',
    },
    {
      label: 'bounded worker-vm runtime truth',
      mutateFile: FUNCTIONS_INVOKER_PATH,
      mutate: (source) => source.replace("BUILDER_FUNCTION_INVOCATION_RUNTIME = 'worker-vm'", "BUILDER_FUNCTION_INVOCATION_RUNTIME = 'nodejs'"),
      expectedReason: 'guard_pattern_count_mismatch:1:1:0',
    },
  ];

  it.each(functionSandboxEdges)(
    'reopens broad-functions-admin-node-stub when the $label edge is removed from real source',
    (edge) => {
      const candidate = readRealFunctionsCandidate('broad-functions-admin-node-stub');
      const root = fixtureRoot();
      stageRealFunctionSources(root);
      const baseline = verifyFunctionsCandidate(root, candidate);
      expect(baseline?.effectivePolicy).toBe('placeholder-only');
      expect(baseline?.sourceMatched).toBe(true);

      const targetFile = path.join(root, edge.mutateFile);
      writeFileSync(targetFile, edge.mutate(readFileSync(targetFile, 'utf8')), 'utf8');
      const mutated = verifyFunctionsCandidate(root, candidate);
      expect(mutated?.effectivePolicy).toBe('open');
      expect(mutated?.sourceMatched).toBe(false);
      expect(mutated?.reasons).toContain(edge.expectedReason);
    },
  );

  it('keeps broad-functions-node-stub-runtime open and mapped as non-rendered inventory', () => {
    const verification = verifyRealProductionStubRegistry();
    const row = verification.entries.find((candidate) => candidate.entry.id === 'broad-functions-node-stub-runtime');
    expect(row, 'broad-functions-node-stub-runtime row present').toBeDefined();
    // Non-rendered stored metadata intentionally remains open: it must not
    // fabricate a closed placeholder policy or a rendered disclosure anchor.
    expect(row?.entry.surfaceKind).toBe('non-rendered');
    expect(row?.entry.productionPolicy).toBe('open');
    expect(row?.entry.visibleDisclosureAnchors).toEqual([]);
    expect(row?.effectivePolicy).toBe('open');
    expect(row?.sourceMatched).toBe(true);
    expect(row?.reasons).toContain('policy_open');
    expect(row?.entry.notes).toMatch(/worker-vm/u);
    expect(row?.entry.notes).toMatch(/remains open/iu);

    // The stored node-stub occurrence in the functions model still maps to
    // this open inventory row rather than escaping as an unmapped hit.
    const manifest = readRealProductionStubManifest();
    const mapped = mapProductionStubOccurrences(
      [{ sourcePath: FUNCTIONS_MODEL_PATH, line: 1, text: "runtime: 'node-stub'" }],
      manifest,
    );
    expect(mapped[0]?.mappedEntryIds).toContain('broad-functions-node-stub-runtime');
  });
});
