/**
 * A small, dependency-free contract for customer-readiness evidence.
 *
 * The parser is intentionally strict: manifests are handoff input, not an
 * internal object that can silently acquire misspelled fields.
 */

export const READINESS_STATES = ['VERIFIED', 'LOCAL-VERIFIED', 'STUB', 'WAIVED', 'OPEN'] as const;
export type ReadinessState = (typeof READINESS_STATES)[number];
export type ReadinessPriority = 'P0' | 'P1' | 'P2';

/** P0 rows are code-owned so a manifest cannot pass by simply omitting them. */
export const REQUIRED_P0_READINESS_REQUIREMENTS = Object.freeze([
  Object.freeze({ id: 'WB-R01-P0-ADMIN-AUTH', priority: 'P0' as const }),
  Object.freeze({ id: 'WB-R01-P0-STRIPE', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['stripe'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-ZOOM', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['zoom'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-GOOGLE-CALENDAR', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['google-calendar'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-OUTLOOK-CALENDAR', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['outlook-calendar'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-RESEND', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['resend'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-SMTP', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['smtp'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-TRANSLATION', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['openai', 'deepl'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-UPSTASH', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['upstash'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-VERCEL-BLOB', priority: 'P0' as const, requiresRealProvider: true, allowedProviders: Object.freeze(['vercel-blob'] as const) }),
  Object.freeze({ id: 'WB-R01-P0-CLEAN-HANDOFF', priority: 'P0' as const }),
] as const);

export const READINESS_PROVIDERS = [
  'none', 'stub', 'mock', 'demo',
  'stripe', 'zoom', 'google-calendar', 'outlook-calendar', 'resend', 'smtp',
  'openai', 'deepl', 'upstash', 'vercel-blob',
] as const;
export type ReadinessProvider = (typeof READINESS_PROVIDERS)[number];

export const READINESS_REASON_CODES = [
  'EVIDENCE_MISSING',
  'EVIDENCE_NOT_FOUND',
  'COMMIT_MISSING',
  'COMMIT_MISMATCH',
  'ENVIRONMENT_MISSING',
  'ENVIRONMENT_MISMATCH',
  'EVIDENCE_EXPIRED',
  'EVIDENCE_EXPIRES_AT_INVALID',
  'EVIDENCE_PROVIDER_MISSING',
  'EVIDENCE_PROVIDER_MISMATCH',
  'WAIVER_REASON_MISSING',
  'WAIVER_EXPIRES_AT_MISSING',
  'WAIVER_EXPIRED',
  'WAIVER_EXPIRES_AT_INVALID',
  'REQUIRED_ROW_MISSING',
  'REQUIRED_PRIORITY_MISMATCH',
  'PROVIDER_MISSING',
  'REAL_PROVIDER_REQUIRED',
  'PROVIDER_MISMATCH',
] as const;
export type ReadinessReasonCode = (typeof READINESS_REASON_CODES)[number];

export interface ReadinessEvidence {
  path: string;
  commit?: string;
  environment?: string;
  expiresAt?: string;
}

export interface ReadinessWaiver {
  reason: string;
  expiresAt: string;
}

export interface ReadinessRow {
  id: string;
  title: string;
  priority: ReadinessPriority;
  state: ReadinessState;
  evidence?: ReadinessEvidence[];
  waiver?: Partial<ReadinessWaiver>;
  provider?: ReadinessProvider;
  requiresRealProvider?: boolean;
  notes?: string;
}

export interface ReadinessManifest {
  version: 1;
  generatedAt?: string;
  rows: ReadinessRow[];
}

export interface ReadinessVerificationContext {
  evidenceExists: (path: string) => boolean;
  readEvidenceProvider?: (path: string) => ReadinessProvider | undefined;
  currentCommit?: string;
  environment?: string;
  now: Date;
}

export interface ReadinessReason {
  code: ReadinessReasonCode;
  message: string;
  path?: string;
  expected?: string;
  actual?: string;
}

export interface VerifiedReadinessRow extends ReadinessRow {
  claimedState: ReadinessState;
  effectiveState: ReadinessState;
  downgraded: boolean;
  reasons: ReadinessReason[];
}

export interface ReadinessVerification {
  manifest: ReadinessManifest;
  context: ReadinessVerificationContext;
  rows: VerifiedReadinessRow[];
}

export class ReadinessManifestParseError extends Error {
  readonly path?: string;

  constructor(message: string, path?: string) {
    super(path ? `${path}: ${message}` : message);
    this.name = 'ReadinessManifestParseError';
    this.path = path;
  }
}

const STATE_SET = new Set<string>(READINESS_STATES);
const PRIORITY_SET = new Set<string>(['P0', 'P1', 'P2']);
const PROVIDER_SET = new Set<string>(READINESS_PROVIDERS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertExactKeys(value: Record<string, unknown>, allowed: readonly string[], path: string): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) throw new ReadinessManifestParseError(`unknown field ${JSON.stringify(key)}`, path);
  }
}

function assertString(value: unknown, path: string, nonEmpty = true): asserts value is string {
  if (typeof value !== 'string' || (nonEmpty && value.trim().length === 0)) {
    throw new ReadinessManifestParseError(nonEmpty ? 'expected a non-empty string' : 'expected a string', path);
  }
}

export function isCanonicalUtcIsoTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u.test(value)) return false;
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp) && new Date(timestamp).toISOString() === value;
}

function assertIsoDate(value: unknown, path: string): asserts value is string {
  assertString(value, path);
  if (!isCanonicalUtcIsoTimestamp(value)) {
    throw new ReadinessManifestParseError('expected a real canonical UTC ISO timestamp (YYYY-MM-DDTHH:mm:ss.sssZ)', path);
  }
}

function parseEvidence(value: unknown, path: string): ReadinessEvidence[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new ReadinessManifestParseError('expected an array', path);
  return value.map((candidate, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(candidate)) throw new ReadinessManifestParseError('expected an object', itemPath);
    assertExactKeys(candidate, ['path', 'commit', 'environment', 'expiresAt'], itemPath);
    assertString(candidate.path, `${itemPath}.path`);
    if (candidate.commit !== undefined) assertString(candidate.commit, `${itemPath}.commit`);
    if (candidate.environment !== undefined) assertString(candidate.environment, `${itemPath}.environment`);
    if (candidate.expiresAt !== undefined) assertIsoDate(candidate.expiresAt, `${itemPath}.expiresAt`);
    return {
      path: candidate.path,
      ...(candidate.commit === undefined ? {} : { commit: candidate.commit }),
      ...(candidate.environment === undefined ? {} : { environment: candidate.environment }),
      ...(candidate.expiresAt === undefined ? {} : { expiresAt: candidate.expiresAt }),
    };
  });
}

function parseWaiver(value: unknown, path: string): Partial<ReadinessWaiver> | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value)) throw new ReadinessManifestParseError('expected an object', path);
  assertExactKeys(value, ['reason', 'expiresAt'], path);
  // Empty reasons are parsed (rather than rejected) so the verifier can report
  // the machine-readable WAIVER_REASON_MISSING downgrade.
  if (value.reason !== undefined) assertString(value.reason, `${path}.reason`, false);
  if (value.expiresAt !== undefined) assertIsoDate(value.expiresAt, `${path}.expiresAt`);
  return {
    ...(value.reason === undefined ? {} : { reason: value.reason }),
    ...(value.expiresAt === undefined ? {} : { expiresAt: value.expiresAt }),
  };
}

/** Parse either JSON text or an already decoded manifest, rejecting malformed input. */
export function parseReadinessManifest(input: string | unknown): ReadinessManifest {
  let value: unknown = input;
  if (typeof input === 'string') {
    try {
      value = JSON.parse(input) as unknown;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'invalid JSON';
      throw new ReadinessManifestParseError(`invalid JSON (${message})`);
    }
  }
  if (!isRecord(value)) throw new ReadinessManifestParseError('manifest must be an object');
  assertExactKeys(value, ['version', 'generatedAt', 'rows'], 'manifest');
  if (value.version !== 1) throw new ReadinessManifestParseError('version must be 1', 'manifest.version');
  if (value.generatedAt !== undefined) assertIsoDate(value.generatedAt, 'manifest.generatedAt');
  if (!Array.isArray(value.rows)) throw new ReadinessManifestParseError('expected an array', 'manifest.rows');

  const ids = new Set<string>();
  const rows = value.rows.map((candidate, index): ReadinessRow => {
    const rowPath = `manifest.rows[${index}]`;
    if (!isRecord(candidate)) throw new ReadinessManifestParseError('expected an object', rowPath);
    assertExactKeys(candidate, ['id', 'title', 'priority', 'state', 'evidence', 'waiver', 'provider', 'requiresRealProvider', 'notes'], rowPath);
    assertString(candidate.id, `${rowPath}.id`);
    if (ids.has(candidate.id)) throw new ReadinessManifestParseError(`duplicate id ${JSON.stringify(candidate.id)}`, `${rowPath}.id`);
    ids.add(candidate.id);
    assertString(candidate.title, `${rowPath}.title`);
    if (typeof candidate.priority !== 'string' || !PRIORITY_SET.has(candidate.priority)) {
      throw new ReadinessManifestParseError('priority must be P0, P1, or P2', `${rowPath}.priority`);
    }
    if (typeof candidate.state !== 'string' || !STATE_SET.has(candidate.state)) {
      throw new ReadinessManifestParseError(`state must be one of ${READINESS_STATES.join(', ')}`, `${rowPath}.state`);
    }
    if (candidate.notes !== undefined) assertString(candidate.notes, `${rowPath}.notes`);
    if (candidate.provider !== undefined) {
      assertString(candidate.provider, `${rowPath}.provider`);
      if (!PROVIDER_SET.has(candidate.provider)) {
        throw new ReadinessManifestParseError(`provider must be one of ${READINESS_PROVIDERS.join(', ')}`, `${rowPath}.provider`);
      }
    }
    if (candidate.requiresRealProvider !== undefined && typeof candidate.requiresRealProvider !== 'boolean') {
      throw new ReadinessManifestParseError('expected a boolean', `${rowPath}.requiresRealProvider`);
    }
    return {
      id: candidate.id,
      title: candidate.title,
      priority: candidate.priority as ReadinessPriority,
      state: candidate.state as ReadinessState,
      ...(candidate.evidence === undefined ? {} : { evidence: parseEvidence(candidate.evidence, `${rowPath}.evidence`) }),
      ...(candidate.waiver === undefined ? {} : { waiver: parseWaiver(candidate.waiver, `${rowPath}.waiver`) }),
      ...(candidate.provider === undefined ? {} : { provider: candidate.provider as ReadinessProvider }),
      ...(candidate.requiresRealProvider === undefined ? {} : { requiresRealProvider: candidate.requiresRealProvider }),
      ...(candidate.notes === undefined ? {} : { notes: candidate.notes }),
    };
  });

  return {
    version: 1,
    ...(value.generatedAt === undefined ? {} : { generatedAt: value.generatedAt }),
    rows,
  };
}

function reason(code: ReadinessReasonCode, message: string, extra: Partial<ReadinessReason> = {}): ReadinessReason {
  return { code, message, ...extra };
}

function evidenceReasons(evidence: ReadinessEvidence[] | undefined, context: ReadinessVerificationContext): ReadinessReason[] {
  if (!evidence || evidence.length === 0) return [reason('EVIDENCE_MISSING', 'no evidence was supplied')];
  const reasons: ReadinessReason[] = [];
  for (const item of evidence) {
    if (!item.path.trim()) reasons.push(reason('EVIDENCE_MISSING', 'evidence path is empty', { path: item.path }));
    else if (!context.evidenceExists(item.path)) reasons.push(reason('EVIDENCE_NOT_FOUND', 'evidence path does not exist', { path: item.path }));

    if (!item.commit) reasons.push(reason('COMMIT_MISSING', 'evidence commit is missing', { path: item.path }));
    else if (!context.currentCommit) reasons.push(reason('COMMIT_MISSING', 'current commit is missing', { path: item.path, expected: item.commit }));
    else if (item.commit !== context.currentCommit) {
      reasons.push(reason('COMMIT_MISMATCH', 'evidence commit does not match the current commit', {
        path: item.path,
        expected: context.currentCommit,
        actual: item.commit,
      }));
    }

    if (!item.environment) reasons.push(reason('ENVIRONMENT_MISSING', 'evidence environment is missing', { path: item.path }));
    else if (!context.environment) reasons.push(reason('ENVIRONMENT_MISSING', 'current environment is missing', { path: item.path, expected: item.environment }));
    else if (item.environment !== context.environment) {
      reasons.push(reason('ENVIRONMENT_MISMATCH', 'evidence environment does not match the current environment', {
        path: item.path,
        expected: context.environment,
        actual: item.environment,
      }));
    }

    if (item.expiresAt !== undefined) {
      if (!isCanonicalUtcIsoTimestamp(item.expiresAt)) {
        reasons.push(reason('EVIDENCE_EXPIRES_AT_INVALID', 'evidence expiresAt is not a real canonical UTC ISO timestamp', { path: item.path, actual: item.expiresAt }));
      } else if (Date.parse(item.expiresAt) <= context.now.getTime()) {
        reasons.push(reason('EVIDENCE_EXPIRED', 'evidence has expired', { path: item.path, expected: item.expiresAt }));
      }
    }
  }
  return reasons;
}

function waiverReasons(waiver: Partial<ReadinessWaiver> | undefined, context: ReadinessVerificationContext): ReadinessReason[] {
  const reasons: ReadinessReason[] = [];
  if (!waiver?.reason || waiver.reason.trim().length === 0) reasons.push(reason('WAIVER_REASON_MISSING', 'waiver reason is missing'));
  if (!waiver?.expiresAt) reasons.push(reason('WAIVER_EXPIRES_AT_MISSING', 'waiver expiresAt is missing'));
  else if (!isCanonicalUtcIsoTimestamp(waiver.expiresAt)) {
    reasons.push(reason('WAIVER_EXPIRES_AT_INVALID', 'waiver expiresAt is not a real canonical UTC ISO timestamp', { actual: waiver.expiresAt }));
  } else if (Date.parse(waiver.expiresAt) <= context.now.getTime()) reasons.push(reason('WAIVER_EXPIRED', 'waiver has expired', { expected: waiver.expiresAt }));
  return reasons;
}

const NON_REAL_PROVIDERS = new Set(['none', 'stub', 'mock', 'demo']);

function providerReasons(row: ReadinessRow): ReadinessReason[] {
  const required = REQUIRED_P0_READINESS_REQUIREMENTS.find((item) => item.id === row.id);
  if (!row.requiresRealProvider && !('requiresRealProvider' in (required ?? {}))) return [];
  const provider = row.provider?.trim();
  if (!provider) return [reason('PROVIDER_MISSING', 'a real provider is required but provider provenance is missing')];
  if (NON_REAL_PROVIDERS.has(provider.toLowerCase())) {
    return [reason('REAL_PROVIDER_REQUIRED', 'the configured provider is not a real provider', { actual: provider })];
  }
  if (required && 'allowedProviders' in required && !(required.allowedProviders as readonly string[]).includes(provider)) {
    return [reason('PROVIDER_MISMATCH', 'the provider does not satisfy this required readiness row', {
      expected: required.allowedProviders.join('|'),
      actual: provider,
    })];
  }
  return [];
}

function evidenceProviderReasons(row: ReadinessRow, context: ReadinessVerificationContext): ReadinessReason[] {
  const required = REQUIRED_P0_READINESS_REQUIREMENTS.find((item) => item.id === row.id);
  if (!required || !('allowedProviders' in required)) return [];
  const identities: ReadinessProvider[] = [];
  for (const item of row.evidence ?? []) {
    if (!item.path || !context.evidenceExists(item.path)) continue;
    try {
      const provider = context.readEvidenceProvider?.(item.path);
      if (provider !== undefined) identities.push(provider);
    } catch {
      // Treat callback/read failures as missing evidence identity.
    }
  }
  if (row.provider !== undefined && identities.includes(row.provider)) return [];
  if (identities.length === 0) {
    return [reason('EVIDENCE_PROVIDER_MISSING', 'no existing evidence artifact reports a provider identity matching this row')];
  }
  return [reason('EVIDENCE_PROVIDER_MISMATCH', 'evidence provider identity does not match the readiness row provider', {
    expected: row.provider,
    actual: identities.join('|'),
  })];
}

function requirementReasons(row: ReadinessRow): ReadinessReason[] {
  const required = REQUIRED_P0_READINESS_REQUIREMENTS.find((item) => item.id === row.id);
  if (!required || row.priority === required.priority) return [];
  return [reason('REQUIRED_PRIORITY_MISMATCH', 'required readiness row has the wrong priority', {
    expected: required.priority,
    actual: row.priority,
  })];
}

/** Pure state verifier. STUB and OPEN are terminal states and are never promoted. */
export function verifyReadinessManifest(manifest: ReadinessManifest, context: ReadinessVerificationContext): ReadinessVerification {
  if (!(context.now instanceof Date) || Number.isNaN(context.now.getTime())) throw new Error('verification context now must be a valid Date');
  const rows = manifest.rows.map((row): VerifiedReadinessRow => {
    const required = REQUIRED_P0_READINESS_REQUIREMENTS.find((item) => item.id === row.id);
    let reasons: ReadinessReason[] = requirementReasons(row);
    let effectiveState = row.state;
    if (row.state === 'VERIFIED' || row.state === 'LOCAL-VERIFIED') {
      reasons = [...reasons, ...evidenceReasons(row.evidence, context), ...providerReasons(row), ...evidenceProviderReasons(row, context)];
      if (reasons.length > 0) effectiveState = 'OPEN';
    } else if (row.state === 'WAIVED') {
      reasons = [...reasons, ...waiverReasons(row.waiver, context)];
      if (reasons.length > 0) effectiveState = 'OPEN';
    } else {
      reasons = [...reasons, ...providerReasons(row)];
    }
    return {
      ...row,
      ...(required && 'requiresRealProvider' in required ? { requiresRealProvider: true } : {}),
      claimedState: row.state,
      effectiveState,
      downgraded: effectiveState !== row.state,
      reasons,
    };
  });
  return { manifest, context, rows };
}

// Explicit aliases make the small API easy to discover from scripts and tests.
export const parseManifest = parseReadinessManifest;
export const verifyManifest = verifyReadinessManifest;
