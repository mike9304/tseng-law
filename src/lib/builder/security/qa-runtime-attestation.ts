import {
  createHash,
  createHmac,
  timingSafeEqual,
} from 'node:crypto';
import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const QA_MANIFEST_SCHEMA_VERSION = 3 as const;

const QA_MANIFEST_NAMESPACE = 'tseng-law-qa';
const QA_ATTESTATION_DOMAIN = 'tseng-law-qa-attestation:v3';
const RUN_ID_PATTERN = /^[a-f0-9]{32}$/u;
const HEX_256_PATTERN = /^[a-f0-9]{64}$/u;

const QA_ROOT_LAYOUT = Object.freeze({
  BUILDER_RUNTIME_DATA_ROOT: 'runtime-data',
  BUILDER_SITE_ROOT: 'runtime-data/builder-site',
  BUILDER_BOOKINGS_ROOT: 'runtime-data/builder-bookings',
  BUILDER_ZOOM_MOCK_PATH: 'runtime-data/builder-bookings/zoom-mock.json',
  BUILDER_COMMERCE_ROOT: 'runtime-data/builder-commerce',
  BILLING_TEMPLATES_ROOT: 'runtime-data/billing',
  BUILDER_ASSETS_ROOT: 'runtime-data/builder-assets',
  BUILDER_REVISIONS_ROOT: 'runtime-data/builder-revisions',
  BUILDER_SCHEDULED_PUBLISH_ROOT: 'runtime-data/builder-scheduled-publish',
  BUILDER_CMS_DYNAMIC_ITEM_POLICY_SCHEDULE_ROOT:
    'runtime-data/builder-cms-dynamic-item-policy-schedules',
  BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT:
    'runtime-data/translation-release-approvals',
  BUILDER_TRANSLATION_RELEASE_POLICY_ROOT:
    'runtime-data/builder-translation-release-policy',
  BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH:
    'runtime-data/translations/providers',
  PUBLISH_TX_ROOT: 'runtime-data/publish/transactions',
  BUILDER_AI_INTAKE_ROOT: 'runtime-data/ai-intake',
  BUILDER_APP_HOOK_REGISTRY_PATH: 'runtime-data/apps/hook-registrations.json',
  BUILDER_APP_HOOK_DELIVERIES_PATH: 'runtime-data/apps/hook-deliveries.json',
  BUILDER_EVENTS_ROOT: 'runtime-data/builder-events',
  BUILDER_FAQ_ROOT: 'runtime-data/builder-faq',
  BUILDER_MEMBERS_ROOT: 'runtime-data/builder-members',
  BUILDER_PORTFOLIO_ROOT: 'runtime-data/builder-portfolio',
  BUILDER_SUBSCRIPTIONS_PATH: 'runtime-data/commerce/subscriptions.json',
  BUILDER_ERROR_LOG_PATH: 'runtime-data/errors',
  BUILDER_OPS_DATA_PATH: 'runtime-data/ops',
  BUILDER_OPS_CACHE_PATH: 'runtime-data/cache',
  BUILDER_OPS_DEV_LOGS_PATH: 'runtime-data/dev/logs',
  CONSULTATION_COLUMNS_DIR: 'runtime-data/consultation-columns',
  CONSULTATION_LOG_DIR: 'runtime-data/consultation-logs',
  REVIEWS_DATA_ROOT: 'runtime-data/reviews',
  BUILDER_AUDIT_LOG_PATH: 'data/audit/builder-audit.jsonl',
});

const QA_FILE_ROOT_NAMES = new Set([
  'BUILDER_ZOOM_MOCK_PATH',
  'BUILDER_APP_HOOK_REGISTRY_PATH',
  'BUILDER_APP_HOOK_DELIVERIES_PATH',
  'BUILDER_SUBSCRIPTIONS_PATH',
  'BUILDER_AUDIT_LOG_PATH',
]);

const QA_LOCAL_RUNTIME_ENV = Object.freeze({
  BUILDER_SITE_BACKEND: 'local',
  BUILDER_BOOKINGS_BACKEND: 'local',
  BUILDER_COMMERCE_BACKEND: 'local',
  BILLING_TEMPLATES_BACKEND: 'local',
  BUILDER_AI_INTAKE_BACKEND: 'local',
  BUILDER_COLUMNS_BACKEND: 'local',
  BUILDER_DEV_LOGS_BACKEND: 'local',
  BUILDER_EVENTS_BACKEND: 'local',
  BUILDER_FAQ_BACKEND: 'local',
  BUILDER_MEMBERS_BACKEND: 'local',
  BUILDER_PORTFOLIO_BACKEND: 'local',
  BUILDER_SHARED_ASSETS_BACKEND: 'local',
  BUILDER_SNAPSHOT_BACKEND: 'local',
  BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND: 'local',
  REVIEWS_BACKEND: 'local',
  CRM_BACKEND: 'local',
  FORM_WEBHOOK_RETRY_BACKEND: 'local',
  CONSULTATION_LOG_BACKEND: 'local',
  BUILDER_RATE_LIMIT_BACKEND: 'isolated-qa',
  BUILDER_USE_BLOB_IN_DEV: '0',
  BUILDER_USE_BLOB_IN_PREVIEW: '0',
  CMS_ADMIN_USERNAME: 'admin',
  CMS_ADMIN_PASSWORD: 'local-review-2026!',
  BUILDER_SMOKE_USERNAME: 'admin',
  BUILDER_SMOKE_PASSWORD: 'local-review-2026!',
  BUILDER_USERNAME: 'admin',
  CMS_SESSION_SECRET: 'local-qa-cms-session-secret',
  BUILDER_ADMIN_SESSION_SECRET: 'local-qa-builder-session-secret',
  NEXTAUTH_SECRET: 'local-qa-nextauth-secret',
  BUILDER_SECRET_KEK:
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  BUILDER_REVIEW_SECRET: 'local-qa-review-secret',
  BUILDER_INTERNAL_NOTIFY_SECRET: 'local-qa-notify-secret',
  BUILDER_WEBHOOK_SECRET: 'local-qa-builder-webhook-secret',
  CRM_TRACKING_SECRET: 'local-qa-crm-tracking-secret',
  CRM_WEBHOOK_SECRET: 'local-qa-crm-webhook-secret',
  OAUTH_STATE_SECRET: 'local-qa-oauth-state-secret',
  BOOKINGS_MANAGE_SECRET: 'local-qa-bookings-manage-secret',
  COMMERCE_PAYMENT_WEBHOOK_SECRET: 'local-commerce-webhook-secret',
  BILLING_DOCUMENT_SHARE_SECRET: 'local-billing-share-secret',
  CRON_SECRET: 'local-cron-secret',
  BUILDER_DRAFT_RATE_LIMIT: '2000',
  BUILDER_MUTATION_RATE_LIMIT: '2000',
  BUILDER_PUBLISH_RATE_LIMIT: '500',
  BUILDER_ASSET_RATE_LIMIT: '500',
});

const QA_BLANK_RUNTIME_ENV_NAMES = Object.freeze([
  'BLOB_READ_WRITE_TOKEN',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'DEEPL_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET',
  'COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET',
  'ZOOM_ACCOUNT_ID',
  'ZOOM_CLIENT_ID',
  'ZOOM_CLIENT_SECRET',
  'BUILDER_ZOOM_MOCK_MEETING_LINK',
  'GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET',
  'GOOGLE_OAUTH_REDIRECT_URI',
  'MS_OAUTH_CLIENT_ID',
  'MS_OAUTH_CLIENT_SECRET',
  'MS_OAUTH_REDIRECT_URI',
  'MS_OAUTH_TENANT',
  'RESEND_API_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
  'MAILCHIMP_TRANSACTIONAL_API_KEY',
  'MANDRILL_API_KEY',
  'MAILCHIMP_TRANSACTIONAL_API_URL',
  'MAILCHIMP_MARKETING_API_KEY',
  'MAILCHIMP_API_KEY',
  'MAILCHIMP_AUDIENCE_ID',
  'MAILCHIMP_SERVER_PREFIX',
  'MAILCHIMP_MARKETING_API_URL',
  'SLACK_WEBHOOK_URL',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'LINE_CHANNEL_SECRET',
  'LINE_CHANNEL_ACCESS_TOKEN',
  'VERCEL_TOKEN',
  'VERCEL_URL',
  'VERCEL_PROJECT_ID',
  'VERCEL_TEAM_ID',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'HCAPTCHA_SECRET',
  'NEXT_PUBLIC_HCAPTCHA_SITE_KEY',
  'TURNSTILE_SECRET',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'AI_PROVIDER',
  'TRANSLATION_PROVIDER',
  'MARKETING_EMAIL_PROVIDER',
  'BOOKINGS_ADMIN_EMAIL',
  'BOOKINGS_EMAIL_FROM',
  'FORMS_EMAIL_FROM',
  'CONSULTATION_NOTIFY_EMAIL',
  'NOTIFY_EMAIL',
  'NEXT_PUBLIC_CONSULTATION_PUBLIC_EMAIL',
  'BUILDER_BASIC_AUTH_USERS',
  'BUILDER_GATE_USER',
  'BUILDER_GATE_PASS',
  'CONSULTATION_EVAL_SECRET',
  'CONSULTATION_PURGE_SECRET',
  'BOOKING_PAYMENT_ALLOW_STUB',
  'BUILDER_ZOOM_MOCK_ALLOW',
  'BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED',
  'BILLING_DOCUMENT_STRIPE_WEBHOOK_ALLOW_UNSIGNED',
  'ALLOW_AI_GENERATOR_STUB',
  'ALLOW_CRM_EMAIL_STUB',
  'ALLOW_STUB_EMAILS',
  'ALLOW_STUB_PROVIDERS',
  'ALLOW_STUB',
  'ALLOW_MOCK',
  'ALLOW_UNSIGNED',
  'AUTH_BYPASS',
  'BUILDER_AUTH_BYPASS',
]);

const QA_LOCAL_URL_ENV_NAMES = Object.freeze([
  'BUILDER_ALLOWED_ORIGINS',
  'SITE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'PUBLIC_SITE_ORIGIN',
  'NEXT_PUBLIC_SITE_ORIGIN',
]);

const QA_MANIFEST_KEYS = Object.freeze([
  'schemaVersion',
  'state',
  'createdAt',
  'attestedAt',
  'ownerPid',
  'serverPid',
  'runId',
  'nonce',
  'baseUrl',
  'manifestPath',
  'repositoryRoot',
  'isolationRoot',
  'runtimeDataRoot',
  'canonicalRuntimeRoot',
  'canonicalAuditRoot',
  'serverCwd',
  'hardcodedFallbackRoot',
  'canonicalChecksum',
  'canonicalAuditChecksum',
  'env',
  'runtimeEnv',
  'roots',
]);

type QaRootName = keyof typeof QA_ROOT_LAYOUT;
type QaManifestState = 'starting' | 'ready';
type QaRootDescriptor = { path: string; kind: 'file' | 'directory' };

export type QaIsolationManifestV3 = {
  schemaVersion: typeof QA_MANIFEST_SCHEMA_VERSION;
  state: QaManifestState;
  createdAt: string;
  attestedAt: string | null;
  ownerPid: number;
  serverPid: number | null;
  runId: string;
  nonce: string;
  baseUrl: string;
  manifestPath: string;
  repositoryRoot: string;
  isolationRoot: string;
  runtimeDataRoot: string;
  canonicalRuntimeRoot: string;
  canonicalAuditRoot: string;
  serverCwd: string;
  hardcodedFallbackRoot: string;
  canonicalChecksum: string;
  canonicalAuditChecksum: string;
  env: Record<QaRootName, string>;
  runtimeEnv: Record<string, string>;
  roots: Record<QaRootName, QaRootDescriptor>;
};

export type QaAttestationResponse = {
  schemaVersion: typeof QA_MANIFEST_SCHEMA_VERSION;
  runId: string;
  serverPid: number;
  challenge: string;
  signature: string;
};

type ManifestPathOptions = {
  repositoryRoot: string;
  baseUrl?: string;
  port?: number | string;
  tmpDir?: string;
};

type LoadManifestOptions = {
  repositoryRoot: string;
  baseUrl: string;
  tmpDir?: string;
};

type ReadyQaIsolationManifestV3 = QaIsolationManifestV3 & {
  state: 'ready';
  serverPid: number;
  attestedAt: string;
};

let cachedReadyRuntimeAttestation: ReadyQaIsolationManifestV3 | null = null;

function fail(message: string): never {
  throw new Error(`QA runtime attestation: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function isContained(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function resolvePhysicalDirectory(label: string, input: string): string {
  if (!input || !path.isAbsolute(input)) fail(`${label} must be an absolute path.`);
  const resolved = path.resolve(input);
  let stats;
  try {
    stats = lstatSync(resolved);
  } catch {
    fail(`${label} must be an existing real directory.`);
  }
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    fail(`${label} must be a real directory, not a symlink.`);
  }
  const physical = realpathSync(resolved);
  if (physical !== resolved) fail(`${label} must use its physical path.`);
  return physical;
}

function resolvePhysicalTmpDirectory(label: string, input: string): string {
  if (!input || !path.isAbsolute(input)) fail(`${label} must be an absolute path.`);
  const resolved = path.resolve(input);
  let stats;
  try {
    stats = lstatSync(resolved);
  } catch {
    fail(`${label} must be an existing real directory.`);
  }
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    fail(`${label} must be a real directory, not a symlink.`);
  }
  return realpathSync(resolved);
}

function resolveRepositoryContext(repositoryRoot: string): {
  repositoryRoot: string;
  canonicalRuntimeRoot: string;
  canonicalAuditRoot: string;
} {
  const repositoryPhysical = resolvePhysicalDirectory('repositoryRoot', repositoryRoot);
  const canonicalRuntimeRoot = resolvePhysicalDirectory(
    'canonical runtime-data root',
    path.join(repositoryPhysical, 'runtime-data'),
  );
  const canonicalAuditRoot = resolvePhysicalDirectory(
    'canonical audit root',
    path.join(repositoryPhysical, 'data', 'audit'),
  );
  return { repositoryRoot: repositoryPhysical, canonicalRuntimeRoot, canonicalAuditRoot };
}

function parseBaseUrl(input: string): { baseUrl: string; port: number } {
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    fail('baseUrl must be exactly http://127.0.0.1:<port>.');
  }
  if (
    parsed.protocol !== 'http:'
    || parsed.hostname !== '127.0.0.1'
    || !/^\d{1,5}$/u.test(parsed.port)
    || parsed.username !== ''
    || parsed.password !== ''
    || (parsed.pathname !== '' && parsed.pathname !== '/')
    || parsed.search !== ''
    || parsed.hash !== ''
  ) {
    fail('baseUrl must be exactly http://127.0.0.1:<port>.');
  }
  const port = Number(parsed.port);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    fail('baseUrl port must be between 1 and 65535.');
  }
  return { baseUrl: `http://127.0.0.1:${port}`, port };
}

function parsePort(input: number | string): number {
  const normalized = typeof input === 'number' ? String(input) : input;
  if (!/^\d{1,5}$/u.test(normalized)) fail('port must be an integer between 1 and 65535.');
  const port = Number(normalized);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    fail('port must be an integer between 1 and 65535.');
  }
  return port;
}

function resolveTmpBase(tmpDir?: string): string {
  const defaultTmpInput = process.env.TMPDIR?.trim() || os.tmpdir();
  const defaultTmp = resolvePhysicalTmpDirectory('TMPDIR', defaultTmpInput);
  if (tmpDir === undefined) return defaultTmp;
  const override = resolvePhysicalTmpDirectory('tmpDir override', tmpDir);
  if (override !== defaultTmp) {
    fail('tmpDir override must equal the physical process TMPDIR.');
  }
  return override;
}

export function resolveQaIsolationManifestPath(options: ManifestPathOptions): string {
  const repository = resolveRepositoryContext(options.repositoryRoot);
  const tmpBase = resolveTmpBase(options.tmpDir);
  if (
    isContained(repository.repositoryRoot, tmpBase)
    || isContained(tmpBase, repository.repositoryRoot)
    || isContained(repository.canonicalRuntimeRoot, tmpBase)
    || isContained(tmpBase, repository.canonicalRuntimeRoot)
    || isContained(repository.canonicalAuditRoot, tmpBase)
    || isContained(tmpBase, repository.canonicalAuditRoot)
  ) {
    fail('physical TMPDIR must not alias repository or canonical runtime roots.');
  }

  let port: number;
  if (options.baseUrl !== undefined) {
    const parsed = parseBaseUrl(options.baseUrl);
    port = parsed.port;
    if (options.port !== undefined && parsePort(options.port) !== port) {
      fail('baseUrl and port must identify the same fixed manifest path.');
    }
  } else if (options.port !== undefined) {
    port = parsePort(options.port);
  } else {
    fail('baseUrl or port is required to resolve the fixed manifest path.');
  }

  const repositoryKey = createHash('sha256')
    .update(repository.repositoryRoot)
    .digest('hex')
    .slice(0, 16);
  return path.join(tmpBase, QA_MANIFEST_NAMESPACE, repositoryKey, `port-${port}.json`);
}

function assertPrivateManifestParents(manifestPath: string, tmpBase: string): void {
  const namespace = path.join(tmpBase, QA_MANIFEST_NAMESPACE);
  const manifestParent = path.dirname(manifestPath);
  for (const [label, directory] of [
    ['manifest namespace', namespace],
    ['manifest repository directory', manifestParent],
  ] as const) {
    let stats;
    try {
      stats = lstatSync(directory);
    } catch {
      fail(`${label} is unavailable.`);
    }
    if (!stats.isDirectory() || stats.isSymbolicLink() || (stats.mode & 0o777) !== 0o700) {
      fail(`${label} must be a private real 0700 directory.`);
    }
    const physical = realpathSync(directory);
    if (physical !== directory || !isContained(tmpBase, physical)) {
      fail(`${label} must remain physically contained by TMPDIR.`);
    }
  }
}

function readPrivateManifest(manifestPath: string, tmpBase: string): Record<string, unknown> {
  assertPrivateManifestParents(manifestPath, tmpBase);
  let descriptor: number | undefined;
  try {
    descriptor = openSync(manifestPath, constants.O_RDONLY | constants.O_NOFOLLOW);
    const stats = fstatSync(descriptor);
    if (!stats.isFile() || (stats.mode & 0o777) !== 0o600) {
      fail('manifest must be a private regular 0600 file.');
    }
    const parsed: unknown = JSON.parse(readFileSync(descriptor, 'utf8'));
    if (!isRecord(parsed)) fail('manifest must contain a JSON object.');
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) fail('manifest contains invalid JSON.');
    if (error instanceof Error && error.message.startsWith('QA runtime attestation:')) throw error;
    fail(`manifest is unavailable: ${error instanceof Error ? error.message : String(error)}.`);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  fail('manifest could not be read.');
}

function isProcessAlive(pid: number): boolean {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'EPERM');
  }
}

function expectedRuntimeEnv(manifest: Pick<
  QaIsolationManifestV3,
  'baseUrl' | 'manifestPath' | 'repositoryRoot' | 'isolationRoot' | 'runId' | 'nonce'
>): Record<string, string> {
  const expected: Record<string, string> = { ...QA_LOCAL_RUNTIME_ENV };
  for (const name of QA_BLANK_RUNTIME_ENV_NAMES) expected[name] = '';
  for (const name of QA_LOCAL_URL_ENV_NAMES) expected[name] = manifest.baseUrl;
  return {
    ...expected,
    BUILDER_QA_ISOLATION_ROOT: manifest.isolationRoot,
    QA_INTERNAL_REPOSITORY_ROOT: manifest.repositoryRoot,
    QA_INTERNAL_RUN_ID: manifest.runId,
    QA_INTERNAL_ATTESTATION_NONCE: manifest.nonce,
    QA_INTERNAL_BASE_URL: manifest.baseUrl,
    QA_INTERNAL_MANIFEST_PATH: manifest.manifestPath,
  };
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string') fail(`${label} must be a string.`);
}

function assertPositivePid(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    fail(`${label} must be a positive process id.`);
  }
}

function assertTimestamp(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  if (!Number.isFinite(Date.parse(value))) fail(`${label} must be an ISO timestamp.`);
}

function assertExactStringRecord(
  value: unknown,
  expected: Record<string, string>,
  label: string,
): asserts value is Record<string, string> {
  if (!isRecord(value) || !hasExactKeys(value, Object.keys(expected))) {
    fail(`${label} key set does not match the v3 contract.`);
  }
  for (const [name, expectedValue] of Object.entries(expected)) {
    if (value[name] !== expectedValue) fail(`${label}.${name} binding mismatch.`);
  }
}

function validateManifest(
  raw: Record<string, unknown>,
  context: ReturnType<typeof resolveRepositoryContext>,
  baseUrl: string,
  manifestPath: string,
  options: { allowStarting: boolean; requireCurrentRuntime: boolean },
): QaIsolationManifestV3 {
  if (!hasExactKeys(raw, QA_MANIFEST_KEYS)) fail('manifest key set does not match schema v3.');
  if (raw.schemaVersion !== QA_MANIFEST_SCHEMA_VERSION) fail('manifest schemaVersion must be 3.');
  if (raw.state !== 'starting' && raw.state !== 'ready') fail('manifest state is invalid.');
  if (raw.state === 'starting' && !options.allowStarting) fail('manifest is not ready.');

  assertTimestamp(raw.createdAt, 'manifest.createdAt');
  assertPositivePid(raw.ownerPid, 'manifest.ownerPid');
  if (!isProcessAlive(raw.ownerPid)) fail('manifest owner process is no longer alive.');
  assertString(raw.runId, 'manifest.runId');
  assertString(raw.nonce, 'manifest.nonce');
  if (!RUN_ID_PATTERN.test(raw.runId)) fail('manifest.runId must be 32 lowercase hex characters.');
  if (!HEX_256_PATTERN.test(raw.nonce)) fail('manifest.nonce must be 64 lowercase hex characters.');
  if (raw.baseUrl !== baseUrl) fail('manifest baseUrl binding mismatch.');
  if (raw.manifestPath !== manifestPath) fail('manifest fixed-path binding mismatch.');
  if (raw.repositoryRoot !== context.repositoryRoot) fail('manifest repository binding mismatch.');
  if (raw.canonicalRuntimeRoot !== context.canonicalRuntimeRoot) {
    fail('manifest canonical runtime binding mismatch.');
  }
  if (raw.canonicalAuditRoot !== context.canonicalAuditRoot) {
    fail('manifest canonical audit binding mismatch.');
  }

  assertString(raw.isolationRoot, 'manifest.isolationRoot');
  assertString(raw.serverCwd, 'manifest.serverCwd');
  const isolationRoot = resolvePhysicalDirectory('manifest.isolationRoot', raw.isolationRoot);
  const serverCwd = resolvePhysicalDirectory('manifest.serverCwd', raw.serverCwd);
  if (isolationRoot !== serverCwd) fail('manifest serverCwd must equal the physical isolationRoot.');
  if (!isContained(resolveTmpBase(), isolationRoot)) {
    fail('manifest isolationRoot must be physically contained by TMPDIR.');
  }
  for (const fixedRoot of [context.repositoryRoot, context.canonicalRuntimeRoot, context.canonicalAuditRoot]) {
    if (isContained(fixedRoot, isolationRoot) || isContained(isolationRoot, fixedRoot)) {
      fail('manifest isolationRoot aliases a canonical repository root.');
    }
  }
  const expectedRootEnv = Object.fromEntries(
    Object.entries(QA_ROOT_LAYOUT).map(([name, relative]) => [name, path.join(isolationRoot, relative)]),
  ) as Record<QaRootName, string>;
  assertExactStringRecord(raw.env, expectedRootEnv, 'manifest.env');
  if (raw.runtimeDataRoot !== expectedRootEnv.BUILDER_RUNTIME_DATA_ROOT) {
    fail('manifest runtimeDataRoot binding mismatch.');
  }
  if (raw.hardcodedFallbackRoot !== path.join(isolationRoot, 'runtime-data')) {
    fail('manifest hardcodedFallbackRoot binding mismatch.');
  }
  if (typeof raw.canonicalChecksum !== 'string' || !HEX_256_PATTERN.test(raw.canonicalChecksum)) {
    fail('manifest canonicalChecksum is invalid.');
  }
  if (
    typeof raw.canonicalAuditChecksum !== 'string'
    || !HEX_256_PATTERN.test(raw.canonicalAuditChecksum)
  ) {
    fail('manifest canonicalAuditChecksum is invalid.');
  }

  if (!isRecord(raw.roots) || !hasExactKeys(raw.roots, Object.keys(QA_ROOT_LAYOUT))) {
    fail('manifest.roots key set does not match the v3 contract.');
  }
  for (const name of Object.keys(QA_ROOT_LAYOUT) as QaRootName[]) {
    const descriptor = raw.roots[name];
    if (!isRecord(descriptor) || !hasExactKeys(descriptor, ['path', 'kind'])) {
      fail(`manifest.roots.${name} is invalid.`);
    }
    const expectedKind = QA_FILE_ROOT_NAMES.has(name) ? 'file' : 'directory';
    if (descriptor.path !== expectedRootEnv[name] || descriptor.kind !== expectedKind) {
      fail(`manifest.roots.${name} binding mismatch.`);
    }
    const physicalCandidate = expectedKind === 'file'
      ? path.dirname(expectedRootEnv[name])
      : expectedRootEnv[name];
    const candidateStats = lstatSync(physicalCandidate);
    if (!candidateStats.isDirectory() || candidateStats.isSymbolicLink()) {
      fail(`manifest.roots.${name} must have a real directory boundary.`);
    }
    if (realpathSync(physicalCandidate) !== physicalCandidate) {
      fail(`manifest.roots.${name} resolves through a symlink.`);
    }
  }

  const partiallyTyped = raw as unknown as QaIsolationManifestV3;
  const expectedEnvironment = expectedRuntimeEnv(partiallyTyped);
  assertExactStringRecord(raw.runtimeEnv, expectedEnvironment, 'manifest.runtimeEnv');

  if (raw.state === 'starting') {
    if (raw.serverPid !== null || raw.attestedAt !== null) {
      fail('starting manifest must not contain server attestation fields.');
    }
  } else {
    assertPositivePid(raw.serverPid, 'manifest.serverPid');
    assertTimestamp(raw.attestedAt, 'manifest.attestedAt');
    if (!isProcessAlive(raw.serverPid)) fail('manifest server process is no longer alive.');
    if (options.requireCurrentRuntime && raw.serverPid !== process.pid) {
      fail('ready manifest serverPid does not match the current server process.');
    }
  }

  if (options.requireCurrentRuntime) {
    if (process.cwd() !== isolationRoot || realpathSync(process.cwd()) !== isolationRoot) {
      fail('current server cwd does not match the physical isolationRoot.');
    }
    if (process.env.NODE_ENV !== 'production') fail('NODE_ENV must be production in QA.');
    for (const [name, expected] of Object.entries(expectedRootEnv)) {
      if (process.env[name] !== expected) fail(`current ${name} binding mismatch.`);
    }
    for (const [name, expected] of Object.entries(expectedEnvironment)) {
      if ((process.env[name] ?? '') !== expected) fail(`current ${name} binding mismatch.`);
    }
  }

  return partiallyTyped;
}

function loadManifest(
  options: LoadManifestOptions,
  validation: { allowStarting: boolean; requireCurrentRuntime: boolean },
): QaIsolationManifestV3 {
  const context = resolveRepositoryContext(options.repositoryRoot);
  const parsed = parseBaseUrl(options.baseUrl);
  const tmpBase = resolveTmpBase(options.tmpDir);
  const manifestPath = resolveQaIsolationManifestPath({
    repositoryRoot: context.repositoryRoot,
    baseUrl: parsed.baseUrl,
    tmpDir: tmpBase,
  });
  const raw = readPrivateManifest(manifestPath, tmpBase);
  return validateManifest(raw, context, parsed.baseUrl, manifestPath, validation);
}

export function loadReadyQaIsolationManifestForCoordinator(
  options: LoadManifestOptions,
): ReadyQaIsolationManifestV3 {
  return loadManifest(options, { allowStarting: false, requireCurrentRuntime: false }) as
    ReadyQaIsolationManifestV3;
}

function matchesCachedReadyRuntime(manifest: ReadyQaIsolationManifestV3): boolean {
  if (
    manifest.serverPid !== process.pid
    || process.cwd() !== manifest.isolationRoot
    || process.env.NODE_ENV !== 'production'
  ) {
    return false;
  }
  for (const [name, expected] of Object.entries(manifest.env)) {
    if (process.env[name] !== expected) return false;
  }
  for (const [name, expected] of Object.entries(manifest.runtimeEnv)) {
    if ((process.env[name] ?? '') !== expected) return false;
  }
  return true;
}

export function getQaRuntimeAttestation(
  options: { allowStarting?: boolean } = {},
): QaIsolationManifestV3 | null {
  const allowStarting = options.allowStarting === true;
  if (!allowStarting && cachedReadyRuntimeAttestation) {
    if (matchesCachedReadyRuntime(cachedReadyRuntimeAttestation)) {
      return cachedReadyRuntimeAttestation;
    }
    cachedReadyRuntimeAttestation = null;
  }
  try {
    const repositoryRoot = process.env.QA_INTERNAL_REPOSITORY_ROOT?.trim();
    const baseUrl = process.env.QA_INTERNAL_BASE_URL?.trim();
    if (!repositoryRoot || !baseUrl) return null;
    const manifest = loadManifest(
      { repositoryRoot, baseUrl },
      { allowStarting, requireCurrentRuntime: true },
    );
    if (process.env.QA_INTERNAL_MANIFEST_PATH !== manifest.manifestPath) return null;
    if (!allowStarting && manifest.state === 'ready') {
      cachedReadyRuntimeAttestation = manifest as ReadyQaIsolationManifestV3;
    }
    return manifest;
  } catch {
    return null;
  }
}

function assertChallenge(challenge: string): void {
  if (!HEX_256_PATTERN.test(challenge)) {
    fail('attestation challenge must be 64 lowercase hex characters.');
  }
}

export function signQaAttestationChallenge(
  manifest: Pick<QaIsolationManifestV3, 'nonce' | 'runId' | 'serverPid'>,
  challenge: string,
  serverPid = manifest.serverPid ?? process.pid,
): string {
  assertChallenge(challenge);
  if (!HEX_256_PATTERN.test(manifest.nonce) || !RUN_ID_PATTERN.test(manifest.runId)) {
    fail('cannot sign an invalid manifest identity.');
  }
  if (!Number.isSafeInteger(serverPid) || serverPid <= 0) {
    fail('attestation serverPid must be positive.');
  }
  return createHmac('sha256', Buffer.from(manifest.nonce, 'hex'))
    .update(`${QA_ATTESTATION_DOMAIN}:${manifest.runId}:${serverPid}:${challenge}`)
    .digest('hex');
}

export function createQaAttestationResponse(
  manifest: Pick<QaIsolationManifestV3, 'nonce' | 'runId' | 'serverPid'>,
  challenge: string,
): QaAttestationResponse {
  const serverPid = manifest.serverPid ?? process.pid;
  return {
    schemaVersion: QA_MANIFEST_SCHEMA_VERSION,
    runId: manifest.runId,
    serverPid,
    challenge,
    signature: signQaAttestationChallenge(manifest, challenge, serverPid),
  };
}

export function verifyQaAttestationResponse(
  manifest: Pick<QaIsolationManifestV3, 'nonce' | 'runId' | 'serverPid'>,
  challenge: string,
  response: QaAttestationResponse,
): boolean {
  try {
    assertChallenge(challenge);
    if (
      !isRecord(response)
      || !hasExactKeys(response, ['schemaVersion', 'runId', 'serverPid', 'challenge', 'signature'])
      || response.schemaVersion !== QA_MANIFEST_SCHEMA_VERSION
      || response.runId !== manifest.runId
      || response.challenge !== challenge
      || !Number.isSafeInteger(response.serverPid)
      || response.serverPid <= 0
      || (manifest.serverPid !== null && response.serverPid !== manifest.serverPid)
      || typeof response.signature !== 'string'
      || !HEX_256_PATTERN.test(response.signature)
    ) {
      return false;
    }
    const expected = Buffer.from(
      signQaAttestationChallenge(manifest, challenge, response.serverPid),
      'hex',
    );
    const actual = Buffer.from(response.signature, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
