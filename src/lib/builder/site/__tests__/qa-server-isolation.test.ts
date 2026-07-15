import { execFileSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const repositoryRoot = process.cwd();
const scriptPath = path.join(repositoryRoot, 'scripts', 'start-qa-server.sh');
const contractPath = path.join(repositoryRoot, 'scripts', 'qa-runtime-isolation-contract.mjs');
const source = readFileSync(scriptPath, 'utf8');

const forbiddenOverrides = [
  'QA_CANONICAL_RUNTIME_ROOT',
  'QA_CANONICAL_AUDIT_ROOT',
  'QA_ISOLATION_MANIFEST_PATH',
] as const;

const requiredBlankFlags = [
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
] as const;

type QaManifest = {
  schemaVersion: number;
  state: 'starting' | 'ready';
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
  canonicalChecksum: string;
  canonicalAuditChecksum: string;
  attestedAt: string | null;
  env: Record<string, string>;
  runtimeEnv: Record<string, string>;
};

type Fixture = {
  root: string;
  repo: string;
  tmp: string;
  fakeContract: string;
  fakeScript: string;
  baseUrl: string;
  manifestPath: string;
  manifest: QaManifest;
};

const cleanupRoots: string[] = [];

function runContract(
  contract: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): string {
  return execFileSync(process.execPath, [contract, ...args], {
    encoding: 'utf8',
    env,
  }).trim();
}

function contractFailure(
  contract: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): string {
  try {
    runContract(contract, args, env);
    return '';
  } catch (error) {
    return String((error as { stderr?: string }).stderr ?? error);
  }
}

function checksum(contract: string, root: string): string {
  return runContract(contract, ['checksum', root]);
}

function isContained(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function createFixture(port: number): Fixture {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'qa-attested-contract-')));
  cleanupRoots.push(root);
  const repo = path.join(root, 'repo');
  const tmp = path.join(root, 'tmp');
  const scripts = path.join(repo, 'scripts');
  const canonicalRuntime = path.join(repo, 'runtime-data');
  const canonicalAudit = path.join(repo, 'data', 'audit');
  mkdirSync(scripts, { recursive: true });
  mkdirSync(tmp, { recursive: true });
  mkdirSync(path.join(repo, '.next-build'), { recursive: true });
  mkdirSync(
    path.join(canonicalRuntime, 'builder-site', 'tseng-law-main-site'),
    { recursive: true },
  );
  mkdirSync(path.join(canonicalRuntime, 'builder-bookings', 'services'), { recursive: true });
  mkdirSync(path.join(canonicalRuntime, 'builder-bookings', 'bookings'), { recursive: true });
  mkdirSync(canonicalAudit, { recursive: true });
  writeFileSync(path.join(repo, '.next-build', 'BUILD_ID'), 'fixture-build\n');
  writeFileSync(
    path.join(canonicalRuntime, 'builder-site', 'tseng-law-main-site', 'site.json'),
    '{"siteId":"tseng-law-main-site"}\n',
  );
  writeFileSync(
    path.join(canonicalRuntime, 'builder-bookings', 'services', 'default.json'),
    '{"services":[]}\n',
  );
  writeFileSync(
    path.join(canonicalRuntime, 'builder-bookings', 'bookings', 'private.json'),
    '{"customer":"must-not-copy"}\n',
  );
  writeFileSync(path.join(canonicalAudit, 'audit.jsonl'), '{"before":true}\n');

  const fakeContract = path.join(scripts, 'qa-runtime-isolation-contract.mjs');
  const fakeScript = path.join(scripts, 'start-qa-server.sh');
  copyFileSync(contractPath, fakeContract);
  copyFileSync(scriptPath, fakeScript);

  const runtimeBefore = checksum(fakeContract, canonicalRuntime);
  const auditBefore = checksum(fakeContract, canonicalAudit);
  const baseUrl = `http://127.0.0.1:${port}`;
  const ignoredManifest = path.join(root, 'caller-chosen.json');
  const output = execFileSync('zsh', [fakeScript], {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      TMPDIR: tmp,
      PORT: String(port),
      NEXT_DIST_DIR: '.next-build',
      QA_ISOLATION_PREFLIGHT_ONLY: '1',
      QA_KEEP_PREFLIGHT_MANIFEST: '1',
      [forbiddenOverrides[0]]: path.join(root, 'wrong-runtime'),
      [forbiddenOverrides[1]]: path.join(root, 'wrong-audit'),
      [forbiddenOverrides[2]]: ignoredManifest,
      STRIPE_SECRET_KEY: 'must-be-cleared',
      BOOKING_PAYMENT_ALLOW_STUB: '1',
    },
  });
  expect(output).toContain('QA isolation preflight PASS');
  expect(checksum(fakeContract, canonicalRuntime)).toBe(runtimeBefore);
  expect(checksum(fakeContract, canonicalAudit)).toBe(auditBefore);
  expect(existsSync(ignoredManifest)).toBe(false);

  const manifestPath = runContract(fakeContract, [
    'manifest-path',
    '--tmp-base', tmp,
    '--repository-root', repo,
    '--base-url', baseUrl,
  ]);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as QaManifest;
  return { root, repo, tmp, fakeContract, fakeScript, baseUrl, manifestPath, manifest };
}

function replaceWithLiveStarting(fixture: Fixture): QaManifest {
  const [runId, nonce] = runContract(fixture.fakeContract, ['generate-identity']).split(' ');
  const old = fixture.manifest;
  const runtimeEnv = {
    ...old.runtimeEnv,
    QA_INTERNAL_RUN_ID: runId,
    QA_INTERNAL_ATTESTATION_NONCE: nonce,
  };
  const env = { ...process.env, ...old.env, ...runtimeEnv };
  runContract(fixture.fakeContract, [
    'prepare',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--isolated-root', old.isolationRoot,
    '--server-cwd', old.isolationRoot,
    '--owner-pid', String(process.pid),
    '--run-id', runId!,
    '--nonce', nonce!,
    '--canonical-checksum', old.canonicalChecksum,
    '--canonical-audit-checksum', old.canonicalAuditChecksum,
  ], env);
  const live = JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest;
  fixture.manifest = live;
  return live;
}

function manifestEnv(manifest: QaManifest): NodeJS.ProcessEnv {
  return { ...process.env, ...manifest.env, ...manifest.runtimeEnv };
}

function promoteArgs(fixture: Fixture, challenge: string, signature: string, runId?: string) {
  return [
    'promote-ready',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--run-id', runId ?? fixture.manifest.runId,
    '--challenge', challenge,
    '--server-pid', String(process.pid),
    '--response-run-id', fixture.manifest.runId,
    '--signature', signature,
  ];
}

function signature(manifest: QaManifest, challenge: string): string {
  return createHmac('sha256', Buffer.from(manifest.nonce, 'hex'))
    .update(
      `tseng-law-qa-attestation:v3:${manifest.runId}:${process.pid}:${challenge}`,
    )
    .digest('hex');
}

afterEach(() => {
  while (cleanupRoots.length > 0) {
    rmSync(cleanupRoots.pop()!, { recursive: true, force: true });
  }
});

describe('attested QA server isolation contract', () => {
  it('derives a fixed private manifest and leaves preflight in starting state', () => {
    const fixture = createFixture(49381);
    const { manifest } = fixture;

    for (const forbidden of forbiddenOverrides) expect(source).not.toContain(forbidden);
    expect(fixture.manifestPath).toMatch(
      /\/tseng-law-qa\/[a-f0-9]{16}\/port-49381\.json$/u,
    );
    expect(manifest).toMatchObject({
      schemaVersion: 3,
      state: 'starting',
      serverPid: null,
      attestedAt: null,
      baseUrl: fixture.baseUrl,
      manifestPath: fixture.manifestPath,
      repositoryRoot: fixture.repo,
      canonicalRuntimeRoot: path.join(fixture.repo, 'runtime-data'),
      canonicalAuditRoot: path.join(fixture.repo, 'data', 'audit'),
    });
    expect(manifest.runId).toMatch(/^[a-f0-9]{32}$/u);
    expect(manifest.nonce).toMatch(/^[a-f0-9]{64}$/u);
    expect(statSync(fixture.manifestPath).mode & 0o077).toBe(0);
    expect(statSync(path.dirname(fixture.manifestPath)).mode & 0o077).toBe(0);
    expect(manifest.runtimeEnv.STRIPE_SECRET_KEY).toBe('');
    for (const name of requiredBlankFlags) expect(manifest.runtimeEnv[name]).toBe('');
    expect(manifest.runtimeEnv.BUILDER_RATE_LIMIT_BACKEND).toBe('isolated-qa');
    expect(manifest.runtimeEnv.BUILDER_DRAFT_RATE_LIMIT).toBe('2000');
    expect(manifest.runtimeEnv.BUILDER_MUTATION_RATE_LIMIT).toBe('2000');
    expect(manifest.runtimeEnv.BUILDER_PUBLISH_RATE_LIMIT).toBe('500');
    expect(manifest.runtimeEnv.BUILDER_ASSET_RATE_LIMIT).toBe('500');
    for (const value of Object.values(manifest.env)) {
      expect(path.isAbsolute(value)).toBe(true);
      expect(isContained(manifest.isolationRoot, value)).toBe(true);
      expect(isContained(manifest.canonicalRuntimeRoot, value)).toBe(false);
    }
    expect(existsSync(path.join(
      manifest.runtimeDataRoot,
      'builder-site',
      'tseng-law-main-site',
      'site.json',
    ))).toBe(true);
    expect(existsSync(path.join(
      manifest.runtimeDataRoot,
      'builder-bookings',
      'bookings',
      'private.json',
    ))).toBe(false);

    const unsupported = contractFailure(fixture.fakeContract, [
      'manifest-path',
      '--tmp-base', fixture.tmp,
      '--repository-root', fixture.repo,
      '--base-url', fixture.baseUrl,
      '--manifest', path.join(fixture.root, 'chosen.json'),
    ]);
    expect(unsupported).toContain('unsupported argument: --manifest');
  });

  it('promotes only a live, matching run with a valid HMAC attestation', () => {
    const fixture = createFixture(49382);
    const starting = replaceWithLiveStarting(fixture);
    const challenge = 'a'.repeat(64);
    runContract(
      fixture.fakeContract,
      promoteArgs(fixture, challenge, signature(starting, challenge)),
      manifestEnv(starting),
    );

    const ready = JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest;
    expect(ready.state).toBe('ready');
    expect(ready.serverPid).toBe(process.pid);
    expect(ready.attestedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/u);

    const wrongCleanup = contractFailure(fixture.fakeContract, [
      'remove-manifest',
      '--tmp-base', fixture.tmp,
      '--repository-root', fixture.repo,
      '--base-url', fixture.baseUrl,
      '--run-id', 'f'.repeat(32),
    ]);
    expect(wrongCleanup).toContain('different run');
    expect(existsSync(fixture.manifestPath)).toBe(true);
    runContract(fixture.fakeContract, [
      'remove-manifest',
      '--tmp-base', fixture.tmp,
      '--repository-root', fixture.repo,
      '--base-url', fixture.baseUrl,
      '--run-id', ready.runId,
    ]);
    expect(existsSync(fixture.manifestPath)).toBe(false);
  });

  it('keeps starting state after wrong HMAC, runId, or nonce policy', () => {
    const fixture = createFixture(49383);
    const starting = replaceWithLiveStarting(fixture);
    const challenge = 'b'.repeat(64);
    const validSignature = signature(starting, challenge);
    const responseFile = path.join(starting.isolationRoot, 'attestation-response.json');
    writeFileSync(responseFile, `${JSON.stringify({
      runId: starting.runId,
      serverPid: process.pid,
      challenge,
      signature: validSignature,
    })}\n`, { mode: 0o600 });
    chmodSync(responseFile, 0o600);

    const missingPid = contractFailure(fixture.fakeContract, [
      'promote-ready',
      '--tmp-base', fixture.tmp,
      '--repository-root', fixture.repo,
      '--base-url', fixture.baseUrl,
      '--run-id', starting.runId,
      '--challenge', challenge,
      '--response-file', responseFile,
    ], manifestEnv(starting));
    expect(missingPid).toContain('missing value for --server-pid');
    const mismatchedPid = contractFailure(fixture.fakeContract, [
      'promote-ready',
      '--tmp-base', fixture.tmp,
      '--repository-root', fixture.repo,
      '--base-url', fixture.baseUrl,
      '--run-id', starting.runId,
      '--challenge', challenge,
      '--server-pid', String(process.pid + 1),
      '--response-file', responseFile,
    ], manifestEnv(starting));
    expect(mismatchedPid).toContain('response serverPid mismatch');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).state)
      .toBe('starting');

    const wrongHmac = contractFailure(
      fixture.fakeContract,
      promoteArgs(fixture, challenge, '0'.repeat(64)),
      manifestEnv(starting),
    );
    expect(wrongHmac).toContain('signature mismatch');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).state)
      .toBe('starting');

    const wrongRun = contractFailure(
      fixture.fakeContract,
      promoteArgs(fixture, challenge, validSignature, 'c'.repeat(32)),
      manifestEnv(starting),
    );
    expect(wrongRun).toContain('runId does not match');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).state)
      .toBe('starting');

    const wrongNonceEnv = {
      ...manifestEnv(starting),
      QA_INTERNAL_ATTESTATION_NONCE: 'd'.repeat(64),
    };
    const wrongNonce = contractFailure(
      fixture.fakeContract,
      promoteArgs(fixture, challenge, validSignature),
      wrongNonceEnv,
    );
    expect(wrongNonce).toContain('QA_INTERNAL_ATTESTATION_NONCE must be');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).state)
      .toBe('starting');

    const incompletePolicy = JSON.parse(
      readFileSync(fixture.manifestPath, 'utf8'),
    ) as QaManifest;
    delete incompletePolicy.runtimeEnv.OPENAI_API_KEY;
    writeFileSync(fixture.manifestPath, `${JSON.stringify(incompletePolicy)}\n`, { mode: 0o600 });
    chmodSync(fixture.manifestPath, 0o600);
    const incomplete = contractFailure(
      fixture.fakeContract,
      promoteArgs(fixture, challenge, validSignature),
      manifestEnv(starting),
    );
    expect(incomplete).toContain('runtime environment key set is incomplete');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).state)
      .toBe('starting');
  });

  it('refuses live-owner replacement and permits only validated stale replacement', () => {
    const fixture = createFixture(49384);
    const starting = replaceWithLiveStarting(fixture);
    const [newRun, newNonce] = runContract(fixture.fakeContract, ['generate-identity']).split(' ');
    const newRuntimeEnv = {
      ...starting.runtimeEnv,
      QA_INTERNAL_RUN_ID: newRun,
      QA_INTERNAL_ATTESTATION_NONCE: newNonce,
    };
    const args = [
      'prepare',
      '--tmp-base', fixture.tmp,
      '--repository-root', fixture.repo,
      '--base-url', fixture.baseUrl,
      '--isolated-root', starting.isolationRoot,
      '--server-cwd', starting.isolationRoot,
      '--owner-pid', String(process.pid),
      '--run-id', newRun!,
      '--nonce', newNonce!,
      '--canonical-checksum', starting.canonicalChecksum,
      '--canonical-audit-checksum', starting.canonicalAuditChecksum,
    ];
    const collision = contractFailure(
      fixture.fakeContract,
      args,
      { ...process.env, ...starting.env, ...newRuntimeEnv },
    );
    expect(collision).toContain('live launcher or server');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).runId)
      .toBe(starting.runId);

    const stale = { ...starting, ownerPid: 2_147_483_647 };
    writeFileSync(fixture.manifestPath, `${JSON.stringify(stale)}\n`, { mode: 0o600 });
    chmodSync(fixture.manifestPath, 0o600);
    runContract(
      fixture.fakeContract,
      args,
      { ...process.env, ...starting.env, ...newRuntimeEnv },
    );
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).runId)
      .toBe(newRun);
  });

  it('rejects symlinked tmp/repository roots and an isolated-root symlink escape', () => {
    const fixture = createFixture(49385);
    const tmpAlias = path.join(fixture.root, 'tmp-alias');
    const repoAlias = path.join(fixture.root, 'repo-alias');
    const distAlias = path.join(fixture.repo, 'dist-alias');
    symlinkSync(fixture.tmp, tmpAlias, 'dir');
    symlinkSync(fixture.repo, repoAlias, 'dir');
    symlinkSync(path.join(fixture.repo, '.next-build'), distAlias, 'dir');
    expect(contractFailure(fixture.fakeContract, [
      'validate-base',
      '--tmp-base', tmpAlias,
      '--repository-root', fixture.repo,
    ])).toContain('tmp-base must be a real directory, not a symlink');
    expect(contractFailure(fixture.fakeContract, [
      'validate-base',
      '--tmp-base', fixture.tmp,
      '--repository-root', repoAlias,
    ])).toContain('repository-root must be a real directory, not a symlink');
    expect(contractFailure(fixture.fakeContract, [
      'validate-dist',
      '--repository-root', fixture.repo,
      '--dist-dir', 'dist-alias',
    ])).toContain('dist-dir must be a real directory, not a symlink');

    const starting = replaceWithLiveStarting(fixture);
    symlinkSync(
      path.join(fixture.repo, 'runtime-data'),
      path.join(starting.isolationRoot, 'escape-to-canonical'),
      'dir',
    );
    const challenge = 'e'.repeat(64);
    const escaped = contractFailure(
      fixture.fakeContract,
      promoteArgs(fixture, challenge, signature(starting, challenge)),
      manifestEnv(starting),
    );
    expect(escaped).toContain('isolated QA namespace contains a symlink');
    expect((JSON.parse(readFileSync(fixture.manifestPath, 'utf8')) as QaManifest).state)
      .toBe('starting');
  });

  it('launch source uses env-i, loopback binding, bounded attestation, and safe dist', () => {
    expect(source).toContain('umask 077');
    expect(source).toContain('env -i "${SERVER_ENV[@]}"');
    expect(source).toContain('--hostname 127.0.0.1 --port "$PORT"');
    expect(source).toContain('x-builder-qa-challenge: $QA_CHALLENGE');
    expect(source).toContain('--server-pid "$NEXT_SERVER_PID"');
    expect(source).toContain('ATTESTATION_DEADLINE=$((SECONDS + 60))');
    expect(source).toContain('remove-manifest');
    expect(source).toContain('${NEXT_DIST_DIR:-.next-build}');
    expect(source).toContain('validate-dist');
    expect(source).toContain('BUILDER_RATE_LIMIT_BACKEND=isolated-qa');
    expect(source).toContain('BUILDER_DRAFT_RATE_LIMIT=2000');
    expect(source).toContain('BUILDER_MUTATION_RATE_LIMIT=2000');
    expect(source).toContain('BUILDER_PUBLISH_RATE_LIMIT=500');
    expect(source).toContain('BUILDER_ASSET_RATE_LIMIT=500');
    for (const name of requiredBlankFlags) {
      expect(source).toContain(`export ${name}=`);
      expect(source).toContain(`"${name}="`);
    }
  });
});
