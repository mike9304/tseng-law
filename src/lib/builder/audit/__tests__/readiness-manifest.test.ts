import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  parseReadinessManifest,
  REQUIRED_P0_READINESS_REQUIREMENTS,
  ReadinessManifestParseError,
  verifyReadinessManifest,
  type ReadinessManifest,
} from '../readiness-manifest';
import { createReadinessReport, renderReadinessReport } from '../readiness-report';
// Explicit extension avoids resolving the sibling executable .mjs wrapper in Vitest.
// @ts-expect-error TypeScript disallows .ts suffixes here, while Vite requires it to disambiguate the wrapper.
import { isEvidenceRegularFileWithinRoot, readEvidenceProviderFromRoot, runReadinessManifestCli } from '../../../../../scripts/run-readiness-manifest.ts';

const now = new Date('2026-07-13T00:00:00.000Z');
const evidenceProviders = {
  'stripe.json': 'stripe',
  'zoom.json': 'zoom',
  'google-calendar.json': 'google-calendar',
  'outlook-calendar.json': 'outlook-calendar',
  'resend.json': 'resend',
  'smtp.json': 'smtp',
  'openai.json': 'openai',
  'deepl.json': 'deepl',
  'upstash.json': 'upstash',
  'vercel-blob.json': 'vercel-blob',
} as const;
const context = {
  evidenceExists: (path: string) => path === 'present.json' || path in evidenceProviders,
  readEvidenceProvider: (path: string) => evidenceProviders[path as keyof typeof evidenceProviders],
  currentCommit: 'abc123',
  environment: 'local',
  now,
};

function manifest(rows: ReadinessManifest['rows']): ReadinessManifest {
  return { version: 1, rows };
}

function passingRequiredRows(): ReadinessManifest['rows'] {
  return REQUIRED_P0_READINESS_REQUIREMENTS.map((requirement): ReadinessManifest['rows'][number] => {
    const provider = 'allowedProviders' in requirement ? requirement.allowedProviders[0] : undefined;
    return {
      id: requirement.id,
      title: requirement.id,
      priority: 'P0',
      state: 'VERIFIED',
      evidence: [{ path: provider ? `${provider}.json` : 'present.json', commit: 'abc123', environment: 'local' }],
      ...(provider ? { provider } : {}),
    };
  });
}

describe('readiness manifest parser and verifier', () => {
  it('accepts every state and preserves valid state semantics', () => {
    const result = verifyReadinessManifest(manifest([
      { id: 'verified', title: 'Verified', priority: 'P1', state: 'VERIFIED', evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local' }] },
      { id: 'local', title: 'Local', priority: 'P1', state: 'LOCAL-VERIFIED', evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local' }] },
      { id: 'stub', title: 'Stub', priority: 'P1', state: 'STUB' },
      { id: 'waived', title: 'Waived', priority: 'P1', state: 'WAIVED', waiver: { reason: 'customer-approved exception', expiresAt: '2026-08-01T00:00:00.000Z' } },
      { id: 'open', title: 'Open', priority: 'P1', state: 'OPEN' },
    ]), context);
    expect(result.rows.map((row) => row.effectiveState)).toEqual(['VERIFIED', 'LOCAL-VERIFIED', 'STUB', 'WAIVED', 'OPEN']);
    expect(result.rows.every((row) => row.reasons.length === 0)).toBe(true);
  });

  it('rejects invalid JSON and unknown fields strictly', () => {
    expect(() => parseReadinessManifest('{')).toThrow(ReadinessManifestParseError);
    expect(() => parseReadinessManifest({ version: 1, rows: [], unexpected: true })).toThrow(/unknown field/);
    expect(() => parseReadinessManifest({ version: 2, rows: [] })).toThrow(/version must be 1/);
    expect(() => parseReadinessManifest({ version: 1, rows: [{ id: 'x', title: 'x', priority: 'P0', state: 'OPEN', extra: 1 }] })).toThrow(/unknown field/);
    expect(() => parseReadinessManifest({ version: 1, rows: [{ id: 'x', title: 'x', priority: 'P0', state: 'OPEN', requiresRealProvider: 'yes' }] })).toThrow(/expected a boolean/);
    for (const provider of ['fake', 'stub-v2', 'strpie']) {
      expect(() => parseReadinessManifest({ version: 1, rows: [{ id: 'x', title: 'x', priority: 'P0', state: 'OPEN', provider }] })).toThrow(/provider must be one of/);
    }
  });

  it.each([
    '07/13/2026',
    '2026-02-30T00:00:00.000Z',
    '2026-07-13T00:00:00Z',
    '2026-07-13T00:00:00.000+00:00',
  ])('rejects noncanonical or impossible timestamp %s', (expiresAt) => {
    expect(() => parseReadinessManifest({
      version: 1,
      generatedAt: expiresAt,
      rows: [],
    })).toThrow(/canonical UTC ISO timestamp/);
    expect(() => parseReadinessManifest({
      version: 1,
      rows: [{ id: 'waiver', title: 'Waiver', priority: 'P1', state: 'WAIVED', waiver: { reason: 'reason', expiresAt } }],
    })).toThrow(/canonical UTC ISO timestamp/);
  });

  it.each(['not-a-date', '2026-02-30T00:00:00.000Z'])('verifier downgrades direct typed evidence with invalid expiry %s', (expiresAt) => {
    const [row] = verifyReadinessManifest(manifest([{
      id: 'direct-evidence-date', title: 'Direct evidence date', priority: 'P1', state: 'VERIFIED',
      evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local', expiresAt }],
    }]), context).rows;
    expect(row.effectiveState).toBe('OPEN');
    expect(row.reasons.map((item) => item.code)).toContain('EVIDENCE_EXPIRES_AT_INVALID');
  });

  it.each(['not-a-date', '2026-02-30T00:00:00.000Z'])('verifier downgrades direct typed waiver with invalid expiry %s', (expiresAt) => {
    const [row] = verifyReadinessManifest(manifest([{
      id: 'direct-waiver-date', title: 'Direct waiver date', priority: 'P1', state: 'WAIVED',
      waiver: { reason: 'reason', expiresAt },
    }]), context).rows;
    expect(row.effectiveState).toBe('OPEN');
    expect(row.reasons.map((item) => item.code)).toContain('WAIVER_EXPIRES_AT_INVALID');
  });

  it.each([
    ['EVIDENCE_MISSING', { path: '', commit: 'abc123', environment: 'local' }],
    ['EVIDENCE_NOT_FOUND', { path: 'missing.json', commit: 'abc123', environment: 'local' }],
    ['COMMIT_MISSING', { path: 'present.json', environment: 'local' }],
    ['COMMIT_MISMATCH', { path: 'present.json', commit: 'wrong', environment: 'local' }],
    ['ENVIRONMENT_MISSING', { path: 'present.json', commit: 'abc123' }],
    ['ENVIRONMENT_MISMATCH', { path: 'present.json', commit: 'abc123', environment: 'production' }],
    ['EVIDENCE_EXPIRED', { path: 'present.json', commit: 'abc123', environment: 'local', expiresAt: '2026-07-12T23:59:59.000Z' }],
  ] as const)('downgrades VERIFIED for %s', (code, evidence) => {
    const [row] = verifyReadinessManifest(manifest([{ id: 'row', title: 'Row', priority: 'P1', state: 'VERIFIED', evidence: [evidence] }]), context).rows;
    expect(row.effectiveState).toBe('OPEN');
    expect(row.reasons.map((item) => item.code)).toContain(code);
  });

  it('retains all reasons when one evidence item has several defects', () => {
    const [row] = verifyReadinessManifest(manifest([
      { id: 'row', title: 'Row', priority: 'P1', state: 'VERIFIED', evidence: [{ path: 'missing.json', commit: 'wrong', environment: 'production', expiresAt: '2026-07-12T00:00:00.000Z' }] },
    ]), context).rows;
    expect(row.reasons.map((item) => item.code)).toEqual(expect.arrayContaining([
      'EVIDENCE_NOT_FOUND', 'COMMIT_MISMATCH', 'ENVIRONMENT_MISMATCH', 'EVIDENCE_EXPIRED',
    ]));
  });

  it('never promotes STUB or OPEN', () => {
    const result = verifyReadinessManifest(manifest([
      { id: 'stub', title: 'Stub', priority: 'P1', state: 'STUB', evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local' }] },
      { id: 'open', title: 'Open', priority: 'P1', state: 'OPEN', evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local' }] },
    ]), context);
    expect(result.rows.map((row) => row.effectiveState)).toEqual(['STUB', 'OPEN']);
  });

  it.each([undefined, 'none', 'stub', 'mock', 'demo'] as const)('downgrades a VERIFIED real-provider row for provider %s', (provider) => {
    const [row] = verifyReadinessManifest(manifest([{
      id: 'provider', title: 'Provider', priority: 'P1', state: 'VERIFIED',
      evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local' }],
      requiresRealProvider: true,
      ...(provider === undefined ? {} : { provider }),
    }]), context).rows;
    expect(row.effectiveState).toBe('OPEN');
    expect(row.reasons.map((item) => item.code)).toContain(provider === undefined ? 'PROVIDER_MISSING' : 'REAL_PROVIDER_REQUIRED');
  });

  it('keeps VERIFIED when real-provider provenance and evidence are both valid', () => {
    const [row] = verifyReadinessManifest(manifest([{
      id: 'provider', title: 'Provider', priority: 'P1', state: 'VERIFIED', provider: 'stripe', requiresRealProvider: true,
      evidence: [{ path: 'present.json', commit: 'abc123', environment: 'local' }],
    }]), context).rows;
    expect(row.effectiveState).toBe('VERIFIED');
  });

  it('reports placeholder provider provenance on an already OPEN row', () => {
    const [row] = verifyReadinessManifest(manifest([{
      id: 'provider', title: 'Provider', priority: 'P0', state: 'OPEN', provider: 'none', requiresRealProvider: true,
    }]), context).rows;
    expect(row.effectiveState).toBe('OPEN');
    expect(row.reasons.map((item) => item.code)).toEqual(['REAL_PROVIDER_REQUIRED']);
  });

  it('requires a non-empty, future waiver', () => {
    const result = verifyReadinessManifest(manifest([
      { id: 'empty', title: 'Empty', priority: 'P1', state: 'WAIVED', waiver: { reason: ' ', expiresAt: '2026-08-01T00:00:00.000Z' } },
      { id: 'expired', title: 'Expired', priority: 'P1', state: 'WAIVED', waiver: { reason: 'reason', expiresAt: '2026-07-12T00:00:00.000Z' } },
      { id: 'missing', title: 'Missing', priority: 'P1', state: 'WAIVED' },
    ]), context);
    expect(result.rows.map((row) => row.effectiveState)).toEqual(['OPEN', 'OPEN', 'OPEN']);
    expect(result.rows[0].reasons[0].code).toBe('WAIVER_REASON_MISSING');
    expect(result.rows[1].reasons[0].code).toBe('WAIVER_EXPIRED');
    expect(result.rows[2].reasons.map((item) => item.code)).toEqual(['WAIVER_REASON_MISSING', 'WAIVER_EXPIRES_AT_MISSING']);
  });

  it('reports claimed/effective counts, downgrades, reasons, and the P0 gate', () => {
    const requiredRows = passingRequiredRows().map((row) => {
      if (row.id === 'WB-R01-P0-ADMIN-AUTH') return { ...row, state: 'OPEN' as const, evidence: undefined };
      if (row.id === 'WB-R01-P0-CLEAN-HANDOFF') return {
        ...row,
        state: 'WAIVED' as const,
        evidence: undefined,
        waiver: { reason: 'temporary approved exception', expiresAt: '2026-08-01T00:00:00.000Z' },
      };
      return row;
    });
    const verification = verifyReadinessManifest(manifest([
      ...requiredRows,
      { id: 'p1-bad', title: 'P1 bad', priority: 'P1', state: 'VERIFIED', evidence: [{ path: 'missing.json', commit: 'abc123', environment: 'local' }] },
    ]), context);
    const report = createReadinessReport(verification);
    expect(report.claimedCounts.VERIFIED).toBe(10);
    expect(report.effectiveCounts.OPEN).toBe(2);
    expect(report.downgrades.map((row) => row.id)).toEqual(['p1-bad']);
    expect(report.operationalGate).toMatchObject({ passed: false, totalP0: 11, passedP0: 10, failedP0: 1 });
    expect(renderReadinessReport(report)).toContain('P0 gate: **FAIL**');
    expect(renderReadinessReport(report)).toContain('EVIDENCE_NOT_FOUND');
    expect(report.rows.find((row) => row.id === 'WB-R01-P0-CLEAN-HANDOFF')?.waiver).toEqual({ reason: 'temporary approved exception', expiresAt: '2026-08-01T00:00:00.000Z' });
    expect(renderReadinessReport(report)).toContain('temporary approved exception (expires 2026-08-01T00:00:00.000Z)');
  });

  it('fails the P0 gate when required rows are omitted, including an empty manifest', () => {
    const report = createReadinessReport(verifyReadinessManifest(manifest([]), context));
    expect(report.operationalGate).toMatchObject({ passed: false, totalP0: 11, passedP0: 0, failedP0: 11 });
    expect(report.operationalGate.failures.every((failure) => failure.reasons.some((item) => item.code === 'REQUIRED_ROW_MISSING'))).toBe(true);
    expect(report.claimedCounts).toEqual({ VERIFIED: 0, 'LOCAL-VERIFIED': 0, STUB: 0, WAIVED: 0, OPEN: 0 });
    expect(report.effectiveCounts.OPEN).toBe(11);
    expect(report.missingRequiredRows).toEqual(REQUIRED_P0_READINESS_REQUIREMENTS.map((requirement) => requirement.id));
  });

  it('fails a required row whose manifest priority is not P0', () => {
    const rows = passingRequiredRows().map((row) => row.id === 'WB-R01-P0-ADMIN-AUTH' ? { ...row, priority: 'P1' as const } : row);
    const report = createReadinessReport(verifyReadinessManifest(manifest(rows), context));
    expect(report.operationalGate).toMatchObject({ passed: false, totalP0: 11, failedP0: 1 });
    expect(report.operationalGate.failures[0]).toMatchObject({ id: 'WB-R01-P0-ADMIN-AUTH', effectiveState: 'OPEN' });
    expect(report.operationalGate.failures[0].reasons.map((item) => item.code)).toContain('REQUIRED_PRIORITY_MISMATCH');
  });

  it.each([undefined, false] as const)('enforces the code-owned real-provider requirement when the manifest flag is %s', (requiresRealProvider) => {
    const rows = passingRequiredRows().map((row) => row.id === 'WB-R01-P0-STRIPE' ? {
      ...row,
      provider: undefined,
      ...(requiresRealProvider === undefined ? {} : { requiresRealProvider }),
    } : row);
    const report = createReadinessReport(verifyReadinessManifest(manifest(rows), context));
    const providerFailure = report.operationalGate.failures.find((row) => row.id === 'WB-R01-P0-STRIPE');
    expect(report.operationalGate.passed).toBe(false);
    expect(providerFailure?.reasons.map((item) => item.code)).toContain('PROVIDER_MISSING');
    expect(report.rows.find((row) => row.id === 'WB-R01-P0-STRIPE')?.requiresRealProvider).toBe(true);
  });

  it('does not let the Stripe row satisfy the other provider P0 requirements', () => {
    const rows = passingRequiredRows().filter((row) =>
      !('provider' in row) || row.id === 'WB-R01-P0-STRIPE');
    const report = createReadinessReport(verifyReadinessManifest(manifest(rows), context));
    expect(report.operationalGate.passed).toBe(false);
    expect(report.operationalGate.failures.filter((row) => row.reasons.some((item) => item.code === 'REQUIRED_ROW_MISSING'))).toHaveLength(8);
  });

  it('rejects a known real provider assigned to the wrong required row', () => {
    const rows = passingRequiredRows().map((row) => row.id === 'WB-R01-P0-ZOOM' ? { ...row, provider: 'stripe' as const } : row);
    const report = createReadinessReport(verifyReadinessManifest(manifest(rows), context));
    const failure = report.operationalGate.failures.find((row) => row.id === 'WB-R01-P0-ZOOM');
    expect(failure?.reasons.map((item) => item.code)).toContain('PROVIDER_MISMATCH');
    expect(failure?.effectiveState).toBe('OPEN');
  });

  it('does not let one Stripe evidence artifact verify Zoom or Resend', () => {
    const rows = passingRequiredRows().map((row) =>
      row.id === 'WB-R01-P0-ZOOM' || row.id === 'WB-R01-P0-RESEND'
        ? { ...row, evidence: [{ path: 'stripe.json', commit: 'abc123', environment: 'local' }] }
        : row);
    const report = createReadinessReport(verifyReadinessManifest(manifest(rows), context));
    for (const id of ['WB-R01-P0-ZOOM', 'WB-R01-P0-RESEND']) {
      const failure = report.operationalGate.failures.find((row) => row.id === id);
      expect(failure?.reasons.map((item) => item.code)).toContain('EVIDENCE_PROVIDER_MISMATCH');
    }
  });

  it.each(['openai', 'deepl'] as const)('accepts %s for the translation one-of requirement', (provider) => {
    const rows = passingRequiredRows().map((row) => row.id === 'WB-R01-P0-TRANSLATION' ? {
      ...row,
      provider,
      evidence: [{ path: `${provider}.json`, commit: 'abc123', environment: 'local' }],
    } : row);
    const report = createReadinessReport(verifyReadinessManifest(manifest(rows), context));
    expect(report.operationalGate.passed).toBe(true);
  });

  it('accepts evidence only for canonical regular files inside the evidence root', () => {
    const parent = mkdtempSync(path.join(os.tmpdir(), 'readiness-evidence-'));
    const root = path.join(parent, 'root');
    const outside = path.join(parent, 'outside.json');
    mkdirSync(path.join(root, 'nested'), { recursive: true });
    writeFileSync(path.join(root, 'nested', 'evidence.json'), '{}');
    writeFileSync(path.join(root, 'stripe.json'), '{"provider":"stripe"}');
    writeFileSync(path.join(root, 'unknown.json'), '{"provider":"stripe-v2"}');
    writeFileSync(path.join(root, 'malformed.json'), '{');
    writeFileSync(outside, '{}');
    symlinkSync(outside, path.join(root, 'escape.json'));
    try {
      expect(isEvidenceRegularFileWithinRoot(root, 'nested/evidence.json')).toBe(true);
      expect(isEvidenceRegularFileWithinRoot(root, path.join(root, 'nested/evidence.json'))).toBe(true);
      expect(isEvidenceRegularFileWithinRoot(root, 'nested')).toBe(false);
      expect(isEvidenceRegularFileWithinRoot(root, '../outside.json')).toBe(false);
      expect(isEvidenceRegularFileWithinRoot(root, outside)).toBe(false);
      expect(isEvidenceRegularFileWithinRoot(root, 'escape.json')).toBe(false);
      expect(isEvidenceRegularFileWithinRoot(root, 'missing.json')).toBe(false);
      expect(readEvidenceProviderFromRoot(root, 'stripe.json')).toBe('stripe');
      expect(readEvidenceProviderFromRoot(root, 'unknown.json')).toBeUndefined();
      expect(readEvidenceProviderFromRoot(root, 'malformed.json')).toBeUndefined();
      expect(readEvidenceProviderFromRoot(root, '../outside.json')).toBeUndefined();
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it('CLI binds a provider row to the provider identity in its safe JSON evidence file', async () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'readiness-cli-provider-'));
    const manifestPath = path.join(root, 'manifest.json');
    const evidencePath = path.join(root, 'stripe.json');
    writeFileSync(manifestPath, JSON.stringify(manifest([{
      id: 'WB-R01-P0-STRIPE', title: 'Stripe', priority: 'P0', state: 'VERIFIED', provider: 'stripe',
      evidence: [{ path: 'stripe.json', commit: 'abc123', environment: 'local' }],
    }])));
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const run = async () => {
      log.mockClear();
      const code = await runReadinessManifestCli([
        '--manifest', manifestPath, '--evidence-root', root, '--commit', 'abc123', '--environment', 'local', '--dry-run',
      ]);
      const report = JSON.parse(String(log.mock.calls[0]?.[0])) as ReturnType<typeof createReadinessReport>;
      return { code, row: report.rows.find((item) => item.id === 'WB-R01-P0-STRIPE') };
    };
    try {
      writeFileSync(evidencePath, '{"provider":"stripe"}');
      const matching = await run();
      expect(matching.code).toBe(2);
      expect(matching.row?.effectiveState).toBe('VERIFIED');

      writeFileSync(evidencePath, '{"provider":"zoom"}');
      const mismatch = await run();
      expect(mismatch.row?.reasons.map((item) => item.code)).toContain('EVIDENCE_PROVIDER_MISMATCH');

      writeFileSync(evidencePath, '{');
      const malformed = await run();
      expect(malformed.row?.reasons.map((item) => item.code)).toContain('EVIDENCE_PROVIDER_MISSING');
    } finally {
      log.mockRestore();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('--help exits zero without reading the default manifest', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    await expect(runReadinessManifestCli(['--help', '--manifest', '/definitely/not/present.json'])).resolves.toBe(0);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    log.mockRestore();
  });
});
