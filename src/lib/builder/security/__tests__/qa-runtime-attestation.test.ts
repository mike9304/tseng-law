import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  createQaAttestationResponse,
  getQaRuntimeAttestation,
  loadReadyQaIsolationManifestForCoordinator,
  QA_MANIFEST_SCHEMA_VERSION,
  resolveQaIsolationManifestPath,
  signQaAttestationChallenge,
  type QaIsolationManifestV3,
  verifyQaAttestationResponse,
} from '../qa-runtime-attestation';

const ROOT_LAYOUT = {
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
  BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT: 'runtime-data/translation-release-approvals',
  BUILDER_TRANSLATION_RELEASE_POLICY_ROOT: 'runtime-data/builder-translation-release-policy',
  BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH: 'runtime-data/translations/providers',
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
} as const;

const FILE_ROOTS = new Set([
  'BUILDER_ZOOM_MOCK_PATH',
  'BUILDER_APP_HOOK_REGISTRY_PATH',
  'BUILDER_APP_HOOK_DELIVERIES_PATH',
  'BUILDER_SUBSCRIPTIONS_PATH',
  'BUILDER_AUDIT_LOG_PATH',
]);

const LOCAL_ENV = {
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
  BOOKING_MANAGE_TOKEN_SECRET: 'local-qa-booking-manage-token-secret-2026',
  COMMERCE_PAYMENT_WEBHOOK_SECRET: 'local-commerce-webhook-secret',
  BILLING_DOCUMENT_SHARE_SECRET: 'local-billing-share-secret',
  CRON_SECRET: 'local-cron-secret',
  BUILDER_DRAFT_RATE_LIMIT: '2000',
  BUILDER_MUTATION_RATE_LIMIT: '2000',
  BUILDER_PUBLISH_RATE_LIMIT: '500',
  BUILDER_ASSET_RATE_LIMIT: '500',
} as const;

const BLANK_ENV_NAMES = [
  'BLOB_READ_WRITE_TOKEN', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'DEEPL_API_KEY',
  'STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET', 'BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET',
  'COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET', 'ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID',
  'ZOOM_CLIENT_SECRET', 'BUILDER_ZOOM_MOCK_MEETING_LINK', 'GOOGLE_OAUTH_CLIENT_ID',
  'GOOGLE_OAUTH_CLIENT_SECRET', 'GOOGLE_OAUTH_REDIRECT_URI', 'MS_OAUTH_CLIENT_ID',
  'MS_OAUTH_CLIENT_SECRET', 'MS_OAUTH_REDIRECT_URI', 'MS_OAUTH_TENANT', 'RESEND_API_KEY',
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER', 'MAILCHIMP_TRANSACTIONAL_API_KEY',
  'MANDRILL_API_KEY', 'MAILCHIMP_TRANSACTIONAL_API_URL', 'MAILCHIMP_MARKETING_API_KEY',
  'MAILCHIMP_API_KEY', 'MAILCHIMP_AUDIENCE_ID', 'MAILCHIMP_SERVER_PREFIX',
  'MAILCHIMP_MARKETING_API_URL', 'SLACK_WEBHOOK_URL', 'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN', 'LINE_CHANNEL_SECRET', 'LINE_CHANNEL_ACCESS_TOKEN',
  'VERCEL_TOKEN', 'VERCEL_URL', 'VERCEL_PROJECT_ID', 'VERCEL_TEAM_ID',
  'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'HCAPTCHA_SECRET',
  'NEXT_PUBLIC_HCAPTCHA_SITE_KEY', 'TURNSTILE_SECRET', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'AI_PROVIDER', 'TRANSLATION_PROVIDER', 'MARKETING_EMAIL_PROVIDER', 'BOOKINGS_ADMIN_EMAIL',
  'BOOKINGS_EMAIL_FROM', 'FORMS_EMAIL_FROM', 'CONSULTATION_NOTIFY_EMAIL', 'NOTIFY_EMAIL',
  'NEXT_PUBLIC_CONSULTATION_PUBLIC_EMAIL', 'BUILDER_BASIC_AUTH_USERS', 'BUILDER_GATE_USER',
  'BUILDER_GATE_PASS', 'CONSULTATION_EVAL_SECRET', 'CONSULTATION_PURGE_SECRET',
  'BOOKING_PAYMENT_ALLOW_STUB', 'BUILDER_ZOOM_MOCK_ALLOW',
  'BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED', 'BILLING_DOCUMENT_STRIPE_WEBHOOK_ALLOW_UNSIGNED',
  'ALLOW_AI_GENERATOR_STUB', 'ALLOW_CRM_EMAIL_STUB', 'ALLOW_STUB_EMAILS',
  'ALLOW_STUB_PROVIDERS', 'ALLOW_STUB', 'ALLOW_MOCK', 'ALLOW_UNSIGNED', 'AUTH_BYPASS',
  'BUILDER_AUTH_BYPASS',
] as const;

const URL_ENV_NAMES = [
  'BUILDER_ALLOWED_ORIGINS',
  'SITE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'PUBLIC_SITE_ORIGIN',
  'NEXT_PUBLIC_SITE_ORIGIN',
] as const;

type Fixture = {
  root: string;
  tmpDir: string;
  repositoryRoot: string;
  isolationRoot: string;
  baseUrl: string;
  manifestPath: string;
  manifest: QaIsolationManifestV3;
};

const originalCwd = process.cwd();
const originalEnvironment = { ...process.env };
const fixtureRoots = new Set<string>();

function restoreProcess(): void {
  process.chdir(originalCwd);
  for (const name of Object.keys(process.env)) delete process.env[name];
  Object.assign(process.env, originalEnvironment);
}

afterEach(() => {
  restoreProcess();
  for (const root of fixtureRoots) rmSync(root, { recursive: true, force: true });
  fixtureRoots.clear();
});

function makeFixture(state: 'starting' | 'ready' = 'ready'): Fixture {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'qa-runtime-attestation-')));
  fixtureRoots.add(root);
  const tmpDir = path.join(root, 'tmp');
  const repositoryRoot = path.join(root, 'repository');
  const isolationRoot = path.join(tmpDir, 'isolated-runtime');
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(path.join(repositoryRoot, 'runtime-data'), { recursive: true });
  mkdirSync(path.join(repositoryRoot, 'data', 'audit'), { recursive: true });
  mkdirSync(isolationRoot, { recursive: true });
  process.env.TMPDIR = tmpDir;

  const env = Object.fromEntries(
    Object.entries(ROOT_LAYOUT).map(([name, relative]) => {
      const target = path.join(isolationRoot, relative);
      mkdirSync(FILE_ROOTS.has(name) ? path.dirname(target) : target, { recursive: true });
      return [name, target];
    }),
  ) as QaIsolationManifestV3['env'];
  const roots = Object.fromEntries(
    Object.keys(ROOT_LAYOUT).map((name) => [name, {
      path: env[name as keyof typeof ROOT_LAYOUT],
      kind: FILE_ROOTS.has(name) ? 'file' : 'directory',
    }]),
  ) as QaIsolationManifestV3['roots'];

  const baseUrl = 'http://127.0.0.1:4173';
  const manifestPath = resolveQaIsolationManifestPath({ repositoryRoot, baseUrl, tmpDir });
  mkdirSync(path.dirname(path.dirname(manifestPath)), { recursive: true, mode: 0o700 });
  chmodSync(path.dirname(path.dirname(manifestPath)), 0o700);
  mkdirSync(path.dirname(manifestPath), { recursive: true, mode: 0o700 });
  chmodSync(path.dirname(manifestPath), 0o700);

  const runId = '1'.repeat(32);
  const nonce = '2'.repeat(64);
  const runtimeEnv: Record<string, string> = { ...LOCAL_ENV };
  for (const name of BLANK_ENV_NAMES) runtimeEnv[name] = '';
  for (const name of URL_ENV_NAMES) runtimeEnv[name] = baseUrl;
  Object.assign(runtimeEnv, {
    BUILDER_QA_ISOLATION_ROOT: isolationRoot,
    QA_INTERNAL_REPOSITORY_ROOT: repositoryRoot,
    QA_INTERNAL_RUN_ID: runId,
    QA_INTERNAL_ATTESTATION_NONCE: nonce,
    QA_INTERNAL_BASE_URL: baseUrl,
    QA_INTERNAL_MANIFEST_PATH: manifestPath,
  });

  const manifest: QaIsolationManifestV3 = {
    schemaVersion: QA_MANIFEST_SCHEMA_VERSION,
    state,
    createdAt: new Date().toISOString(),
    attestedAt: state === 'ready' ? new Date().toISOString() : null,
    ownerPid: process.pid,
    serverPid: state === 'ready' ? process.pid : null,
    runId,
    nonce,
    baseUrl,
    manifestPath,
    repositoryRoot,
    isolationRoot,
    runtimeDataRoot: env.BUILDER_RUNTIME_DATA_ROOT,
    canonicalRuntimeRoot: path.join(repositoryRoot, 'runtime-data'),
    canonicalAuditRoot: path.join(repositoryRoot, 'data', 'audit'),
    serverCwd: isolationRoot,
    hardcodedFallbackRoot: path.join(isolationRoot, 'runtime-data'),
    canonicalChecksum: '3'.repeat(64),
    canonicalAuditChecksum: '4'.repeat(64),
    env,
    runtimeEnv,
    roots,
  };
  writeManifest(manifest);
  return { root, tmpDir, repositoryRoot, isolationRoot, baseUrl, manifestPath, manifest };
}

function writeManifest(manifest: QaIsolationManifestV3 | Record<string, unknown>): void {
  const manifestPath = String(manifest.manifestPath);
  writeFileSync(manifestPath, `${JSON.stringify(manifest)}\n`, { mode: 0o600 });
  chmodSync(manifestPath, 0o600);
}

function applyRuntime(fixture: Fixture): void {
  process.chdir(fixture.isolationRoot);
  Object.assign(process.env, fixture.manifest.env, fixture.manifest.runtimeEnv, {
    NODE_ENV: 'production',
  });
}

describe.sequential('qa runtime attestation v3', () => {
  it('normalizes macOS-style ancestor aliases but rejects a symlink TMPDIR leaf', () => {
    restoreProcess();
    const logicalTmp = path.resolve(originalEnvironment.TMPDIR?.trim() || os.tmpdir());
    const physicalTmp = realpathSync(logicalTmp);
    process.env.TMPDIR = logicalTmp;
    const fromLogicalTmp = resolveQaIsolationManifestPath({
      repositoryRoot: originalCwd,
      baseUrl: 'http://127.0.0.1:4173',
    });
    const fromPhysicalOverride = resolveQaIsolationManifestPath({
      repositoryRoot: originalCwd,
      baseUrl: 'http://127.0.0.1:4173',
      tmpDir: physicalTmp,
    });
    expect(fromLogicalTmp).toBe(fromPhysicalOverride);
    expect(fromLogicalTmp.startsWith(path.join(physicalTmp, 'tseng-law-qa'))).toBe(true);

    const symlinkContainer = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'qa-tmp-leaf-')));
    fixtureRoots.add(symlinkContainer);
    const target = path.join(symlinkContainer, 'target');
    const symlink = path.join(symlinkContainer, 'tmp-link');
    mkdirSync(target);
    symlinkSync(target, symlink);
    process.env.TMPDIR = symlink;
    expect(() => resolveQaIsolationManifestPath({
      repositoryRoot: originalCwd,
      baseUrl: 'http://127.0.0.1:4173',
    })).toThrow(/TMPDIR must be a real directory, not a symlink/u);
  });

  it('derives only the fixed physical TMPDIR/repository/port manifest path', () => {
    const fixture = makeFixture();
    const fromUrl = resolveQaIsolationManifestPath({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
    });
    const fromMatchingOverrides = resolveQaIsolationManifestPath({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
      port: 4173,
      tmpDir: fixture.tmpDir,
    });
    expect(fromUrl).toBe(fixture.manifestPath);
    expect(fromMatchingOverrides).toBe(fixture.manifestPath);
    expect(fixture.manifestPath).toMatch(/\/tseng-law-qa\/[a-f0-9]{16}\/port-4173\.json$/u);
    expect(() => resolveQaIsolationManifestPath({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: 'http://localhost:4173',
    })).toThrow(/exactly http:\/\/127\.0\.0\.1/u);
    expect(() => resolveQaIsolationManifestPath({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
      port: 4174,
    })).toThrow(/same fixed manifest path/u);
    const unrelatedTmp = path.join(fixture.root, 'unrelated-tmp');
    mkdirSync(unrelatedTmp);
    expect(() => resolveQaIsolationManifestPath({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
      tmpDir: unrelatedTmp,
    })).toThrow(/must equal the physical process TMPDIR/u);
  });

  it('loads a valid ready manifest for a coordinator without using current cwd or runtime env', () => {
    const fixture = makeFixture();
    process.env.BUILDER_RATE_LIMIT_BACKEND = 'forged';
    const loaded = loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
    });
    expect(loaded.state).toBe('ready');
    expect(loaded.serverPid).toBe(process.pid);
    expect(loaded.runId).toBe(fixture.manifest.runId);
  });

  it('rejects loose permissions, symlink boundaries, and injected policy keys', () => {
    const permissionFixture = makeFixture();
    chmodSync(permissionFixture.manifestPath, 0o644);
    expect(() => loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: permissionFixture.repositoryRoot,
      baseUrl: permissionFixture.baseUrl,
    })).toThrow(/regular 0600 file/u);

    const injectionFixture = makeFixture();
    writeManifest({
      ...injectionFixture.manifest,
      runtimeEnv: { ...injectionFixture.manifest.runtimeEnv, INJECTED_SECRET: 'yes' },
    });
    expect(() => loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: injectionFixture.repositoryRoot,
      baseUrl: injectionFixture.baseUrl,
    })).toThrow(/key set does not match/u);

    const symlinkFixture = makeFixture();
    const assets = symlinkFixture.manifest.env.BUILDER_ASSETS_ROOT;
    const outside = path.join(symlinkFixture.tmpDir, 'outside-assets');
    mkdirSync(outside);
    rmSync(assets, { recursive: true });
    symlinkSync(outside, assets);
    expect(() => loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: symlinkFixture.repositoryRoot,
      baseUrl: symlinkFixture.baseUrl,
    })).toThrow(/real directory boundary|symlink/u);

    const manifestSymlinkFixture = makeFixture();
    const manifestTarget = path.join(manifestSymlinkFixture.tmpDir, 'forged-manifest-target.json');
    writeFileSync(manifestTarget, `${JSON.stringify(manifestSymlinkFixture.manifest)}\n`, {
      mode: 0o600,
    });
    chmodSync(manifestTarget, 0o600);
    rmSync(manifestSymlinkFixture.manifestPath);
    symlinkSync(manifestTarget, manifestSymlinkFixture.manifestPath);
    expect(() => loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: manifestSymlinkFixture.repositoryRoot,
      baseUrl: manifestSymlinkFixture.baseUrl,
    })).toThrow(/manifest is unavailable/u);
  });

  it.each([
    ['root', (manifest: QaIsolationManifestV3) => {
      manifest.env.BUILDER_SITE_ROOT = path.join(manifest.isolationRoot, 'forged-site');
    }],
    ['cwd', (manifest: QaIsolationManifestV3) => {
      manifest.serverCwd = path.dirname(manifest.isolationRoot);
    }],
    ['runId', (manifest: QaIsolationManifestV3) => { manifest.runId = 'not-a-run-id'; }],
    ['nonce', (manifest: QaIsolationManifestV3) => { manifest.nonce = 'not-a-nonce'; }],
    ['state', (manifest: QaIsolationManifestV3) => {
      manifest.state = 'starting';
      manifest.serverPid = null;
      manifest.attestedAt = null;
    }],
  ] as const)('rejects a forged %s binding', (_label, mutate) => {
    const fixture = makeFixture();
    mutate(fixture.manifest);
    writeManifest(fixture.manifest);
    expect(() => loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
    })).toThrow();
  });

  it('accepts valid starting and ready server states only with exact current bindings', () => {
    const starting = makeFixture('starting');
    applyRuntime(starting);
    expect(getQaRuntimeAttestation()).toBeNull();
    const startingAttestation = getQaRuntimeAttestation({ allowStarting: true });
    expect(startingAttestation?.state).toBe('starting');
    const challenge = '5'.repeat(64);
    const response = createQaAttestationResponse(startingAttestation!, challenge);
    expect(response).toMatchObject({
      schemaVersion: 3,
      runId: starting.manifest.runId,
      serverPid: process.pid,
      challenge,
    });
    expect(verifyQaAttestationResponse(starting.manifest, challenge, response)).toBe(true);
    rmSync(starting.manifestPath);
    expect(getQaRuntimeAttestation({ allowStarting: true })).toBeNull();

    restoreProcess();
    const ready = makeFixture('ready');
    applyRuntime(ready);
    expect(getQaRuntimeAttestation()).toMatchObject({ state: 'ready', serverPid: process.pid });

    for (const [name, forged] of [
      ['QA_INTERNAL_RUN_ID', '8'.repeat(32)],
      ['QA_INTERNAL_ATTESTATION_NONCE', '9'.repeat(64)],
      ['QA_INTERNAL_MANIFEST_PATH', path.join(ready.tmpDir, 'forged-manifest.json')],
    ] as const) {
      const original = process.env[name];
      process.env[name] = forged;
      expect(getQaRuntimeAttestation(), `${name} must be bound`).toBeNull();
      process.env[name] = original;
    }

    process.chdir(ready.tmpDir);
    expect(getQaRuntimeAttestation()).toBeNull();
    process.chdir(ready.isolationRoot);
    process.env.BUILDER_RATE_LIMIT_BACKEND = 'memory';
    expect(getQaRuntimeAttestation()).toBeNull();
  });

  it('caches ready validation only while every cheap in-memory binding remains exact', () => {
    const mutations = [
      (fixture: Fixture) => {
        process.env.QA_INTERNAL_ATTESTATION_NONCE = 'a'.repeat(64);
        expect(process.env.QA_INTERNAL_ATTESTATION_NONCE).not.toBe(fixture.manifest.nonce);
      },
      () => { process.env.BUILDER_RATE_LIMIT_BACKEND = 'memory'; },
      (fixture: Fixture) => {
        process.env.BUILDER_SITE_ROOT = path.join(fixture.isolationRoot, 'forged-site');
      },
      (fixture: Fixture) => { process.chdir(fixture.tmpDir); },
    ];

    for (const mutate of mutations) {
      restoreProcess();
      const fixture = makeFixture('ready');
      applyRuntime(fixture);
      const first = getQaRuntimeAttestation();
      expect(first).toMatchObject({ state: 'ready', runId: fixture.manifest.runId });
      rmSync(fixture.manifestPath);
      expect(getQaRuntimeAttestation()).toBe(first);
      mutate(fixture);
      expect(getQaRuntimeAttestation()).toBeNull();
    }

    restoreProcess();
    const finalFixture = makeFixture('ready');
    applyRuntime(finalFixture);
    expect(getQaRuntimeAttestation()).toMatchObject({
      state: 'ready',
      runId: finalFixture.manifest.runId,
    });
  });

  it('uses the exact v3 HMAC domain and rejects any response tampering', () => {
    const fixture = makeFixture();
    const challenge = '6'.repeat(64);
    const signature = signQaAttestationChallenge(fixture.manifest, challenge);
    const response = createQaAttestationResponse(fixture.manifest, challenge);
    expect(signature).toBe(response.signature);
    expect(verifyQaAttestationResponse(fixture.manifest, challenge, response)).toBe(true);
    expect(verifyQaAttestationResponse(fixture.manifest, challenge, {
      ...response,
      signature: `${response.signature[0] === '0' ? '1' : '0'}${response.signature.slice(1)}`,
    })).toBe(false);
    expect(verifyQaAttestationResponse(fixture.manifest, challenge, {
      ...response,
      runId: '7'.repeat(32),
    })).toBe(false);
    const injected = JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as Record<string, unknown>;
    injected.unexpected = true;
    writeManifest(injected);
    expect(() => loadReadyQaIsolationManifestForCoordinator({
      repositoryRoot: fixture.repositoryRoot,
      baseUrl: fixture.baseUrl,
    })).toThrow(/manifest key set/u);
  });
});
