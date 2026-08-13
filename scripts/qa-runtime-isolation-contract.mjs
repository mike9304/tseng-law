#!/usr/bin/env node

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import {
  chmodSync,
  closeSync,
  constants,
  existsSync,
  fstatSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const MANIFEST_SCHEMA_VERSION = 3;
const MANIFEST_NAMESPACE = 'tseng-law-qa';
const ATTESTATION_DOMAIN = 'tseng-law-qa-attestation:v3';

export const QA_ROOT_LAYOUT = Object.freeze({
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

export const QA_LOCAL_RUNTIME_ENV = Object.freeze({
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
});

export const QA_BLANK_RUNTIME_ENV_NAMES = Object.freeze([
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

const FILE_ROOTS = new Set([
  'BUILDER_ZOOM_MOCK_PATH',
  'BUILDER_APP_HOOK_REGISTRY_PATH',
  'BUILDER_APP_HOOK_DELIVERIES_PATH',
  'BUILDER_SUBSCRIPTIONS_PATH',
  'BUILDER_AUDIT_LOG_PATH',
]);

function die(message) {
  throw new Error(message);
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function parseArgs(argv, allowed, required = allowed) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) die(`unexpected argument: ${argument}`);
    const key = argument.slice(2);
    if (!allowed.has(key)) die(`unsupported argument: --${key}`);
    if (values.has(key)) die(`duplicate argument: --${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) die(`missing value for --${key}`);
    values.set(key, value);
    index += 1;
  }
  for (const key of required) {
    if (!values.has(key)) die(`missing value for --${key}`);
  }
  return values;
}

function assertAbsolute(label, value) {
  if (!value || !path.isAbsolute(value)) die(`${label} must be an absolute path`);
  return path.resolve(value);
}

function resolvePhysicalDirectory(label, value) {
  const resolved = assertAbsolute(label, value);
  let stats;
  try {
    stats = lstatSync(resolved);
  } catch (error) {
    die(`${label} must be an existing directory: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    die(`${label} must be a real directory, not a symlink`);
  }
  return realpathSync(resolved);
}

function parseBaseUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    die('base-url must be a valid URL');
  }
  if (
    parsed.protocol !== 'http:'
    || parsed.hostname !== '127.0.0.1'
    || !/^\d{1,5}$/u.test(parsed.port)
    || parsed.username
    || parsed.password
    || (parsed.pathname !== '' && parsed.pathname !== '/')
    || parsed.search
    || parsed.hash
  ) {
    die('base-url must be exactly http://127.0.0.1:<port>');
  }
  const port = Number(parsed.port);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    die('base-url port must be between 1 and 65535');
  }
  return { baseUrl: `http://127.0.0.1:${port}`, port };
}

function validateBaseContext(args) {
  const tmpPhysical = resolvePhysicalDirectory('tmp-base', args.get('tmp-base'));
  const repositoryPhysical = resolvePhysicalDirectory(
    'repository-root',
    args.get('repository-root'),
  );
  const canonicalRuntimeRoot = path.join(repositoryPhysical, 'runtime-data');
  const canonicalAuditRoot = path.join(repositoryPhysical, 'data', 'audit');
  const canonicalPhysical = resolvePhysicalDirectory(
    'fixed canonical runtime-data',
    canonicalRuntimeRoot,
  );
  const auditPhysical = resolvePhysicalDirectory(
    'fixed canonical audit data',
    canonicalAuditRoot,
  );
  if (canonicalPhysical !== canonicalRuntimeRoot) {
    die('fixed canonical runtime-data physically aliases another path');
  }
  if (auditPhysical !== canonicalAuditRoot) {
    die('fixed canonical audit data physically aliases another path');
  }
  for (const [label, fixedRoot] of [
    ['repository root', repositoryPhysical],
    ['canonical runtime-data', canonicalPhysical],
    ['canonical audit data', auditPhysical],
  ]) {
    if (isContained(fixedRoot, tmpPhysical) || isContained(tmpPhysical, fixedRoot)) {
      die(`tmp-base physically aliases ${label}`);
    }
  }
  return {
    tmpPhysical,
    repositoryPhysical,
    canonicalRuntimeRoot,
    canonicalAuditRoot,
  };
}

function fixedManifestPath(context, port) {
  const repositoryKey = createHash('sha256')
    .update(context.repositoryPhysical)
    .digest('hex')
    .slice(0, 16);
  return path.join(
    context.tmpPhysical,
    MANIFEST_NAMESPACE,
    repositoryKey,
    `port-${port}.json`,
  );
}

function ensurePrivateDirectory(directory, tmpPhysical) {
  const relative = path.relative(tmpPhysical, directory);
  if (!relative || relative === '.' || relative.startsWith('..') || path.isAbsolute(relative)) {
    die('manifest directory escapes physical tmp-base');
  }
  let cursor = tmpPhysical;
  for (const segment of relative.split(path.sep)) {
    cursor = path.join(cursor, segment);
    if (!existsSync(cursor)) mkdirSync(cursor, { mode: 0o700 });
    const stats = lstatSync(cursor);
    if (!stats.isDirectory() || stats.isSymbolicLink()) {
      die(`manifest directory must not contain symlinks: ${cursor}`);
    }
    chmodSync(cursor, 0o700);
    const physical = realpathSync(cursor);
    if (!isContained(tmpPhysical, physical)) die('manifest directory escapes physical tmp-base');
  }
}

function writeManifest(manifestPath, manifest, tmpPhysical) {
  const parent = path.dirname(manifestPath);
  ensurePrivateDirectory(parent, tmpPhysical);
  if (existsSync(manifestPath)) {
    const stats = lstatSync(manifestPath);
    if (!stats.isFile() || stats.isSymbolicLink()) {
      die('manifest path must be a regular file, not a symlink');
    }
  }
  const temporary = `${manifestPath}.${process.pid}.${randomBytes(8).toString('hex')}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
    flag: 'wx',
  });
  const descriptor = openSync(temporary, 'r');
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  renameSync(temporary, manifestPath);
  chmodSync(manifestPath, 0o600);
  const parentDescriptor = openSync(parent, 'r');
  try {
    fsyncSync(parentDescriptor);
  } finally {
    closeSync(parentDescriptor);
  }
}

function isProcessAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return Boolean(error && typeof error === 'object' && error.code === 'EPERM');
  }
}

function readPrivateJsonFile(filePath, label) {
  let descriptor;
  try {
    descriptor = openSync(filePath, constants.O_RDONLY | constants.O_NOFOLLOW);
    const stats = fstatSync(descriptor);
    if (!stats.isFile() || (stats.mode & 0o077) !== 0) {
      die(`${label} must be a private regular file`);
    }
    const value = JSON.parse(readFileSync(descriptor, 'utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      die(`${label} must contain a JSON object`);
    }
    return value;
  } catch (error) {
    if (error instanceof SyntaxError) die(`${label} is invalid JSON`);
    if (error instanceof Error && error.message.startsWith(`${label} `)) throw error;
    die(`${label} is unavailable: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function withManifestLock(manifestPath, tmpPhysical, callback) {
  ensurePrivateDirectory(path.dirname(manifestPath), tmpPhysical);
  const lockPath = `${manifestPath}.lock`;
  const ownerPath = path.join(lockPath, 'owner.json');
  const token = randomBytes(16).toString('hex');
  const acquire = () => {
    try {
      mkdirSync(lockPath, { mode: 0o700 });
      writeFileSync(ownerPath, `${JSON.stringify({ pid: process.pid, token })}\n`, {
        encoding: 'utf8',
        mode: 0o600,
        flag: 'wx',
      });
      return;
    } catch (error) {
      if (!error || typeof error !== 'object' || error.code !== 'EEXIST') throw error;
    }
    const lockStats = lstatSync(lockPath);
    if (!lockStats.isDirectory() || lockStats.isSymbolicLink()) {
      die('manifest lock must be a private real directory');
    }
    const owner = readPrivateJsonFile(ownerPath, 'manifest lock owner');
    if (isProcessAlive(owner.pid)) die(`manifest is busy (contract pid ${owner.pid})`);
    // Automatic stale-lock deletion cannot be made compare-and-delete atomic
    // with portable Node fs APIs. Fail closed instead of risking removal of a
    // successor's live lock during a reclaim race.
    die('stale manifest lock requires explicit forensic cleanup');
  };
  acquire();
  try {
    return callback();
  } finally {
    try {
      const owner = readPrivateJsonFile(ownerPath, 'manifest lock owner');
      if (owner.pid === process.pid && owner.token === token) {
        rmSync(lockPath, { recursive: true, force: true });
      }
    } catch {
      // A corrupted lock must remain for explicit forensic cleanup.
    }
  }
}

function assertTreeContainsNoSymlinks(root) {
  const visit = (candidate) => {
    const stats = lstatSync(candidate);
    if (stats.isSymbolicLink()) {
      die(`isolated QA namespace contains a symlink: ${candidate}`);
    }
    if (!stats.isDirectory()) return;
    for (const name of readdirSync(candidate)) visit(path.join(candidate, name));
  };
  visit(root);
}

function hashEntry(hash, root, absolutePath) {
  const relative = path.relative(root, absolutePath) || '.';
  const stats = lstatSync(absolutePath);
  if (stats.isSymbolicLink()) {
    hash.update(`L\0${relative}\0${readlinkSync(absolutePath)}\0`);
    return;
  }
  if (stats.isDirectory()) {
    hash.update(`D\0${relative}\0${stats.mode}\0`);
    const names = readdirSync(absolutePath).sort((left, right) => left.localeCompare(right));
    for (const name of names) hashEntry(hash, root, path.join(absolutePath, name));
    return;
  }
  if (stats.isFile()) {
    hash.update(`F\0${relative}\0${stats.mode}\0${stats.size}\0`);
    hash.update(readFileSync(absolutePath));
    hash.update('\0');
    return;
  }
  hash.update(`O\0${relative}\0${stats.mode}\0${stats.size}\0`);
}

export function checksumTree(rootInput) {
  const root = path.resolve(rootInput);
  const hash = createHash('sha256');
  try {
    hashEntry(hash, root, root);
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      hash.update('MISSING');
    } else {
      throw error;
    }
  }
  return hash.digest('hex');
}

function physicalParent(candidate, isFile) {
  const existing = isFile ? path.dirname(candidate) : candidate;
  try {
    return realpathSync(existing);
  } catch (error) {
    die(`unable to resolve ${existing}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function expectedRuntimeEnv({ baseUrl, manifestPath, repositoryRoot, isolationRoot, runId, nonce }) {
  const expected = { ...QA_LOCAL_RUNTIME_ENV };
  for (const name of QA_BLANK_RUNTIME_ENV_NAMES) expected[name] = '';
  for (const name of QA_LOCAL_URL_ENV_NAMES) expected[name] = baseUrl;
  return {
    ...expected,
    BUILDER_QA_ISOLATION_ROOT: isolationRoot,
    QA_INTERNAL_REPOSITORY_ROOT: repositoryRoot,
    QA_INTERNAL_RUN_ID: runId,
    QA_INTERNAL_ATTESTATION_NONCE: nonce,
    QA_INTERNAL_BASE_URL: baseUrl,
    QA_INTERNAL_MANIFEST_PATH: manifestPath,
  };
}

function validateIsolation({
  context,
  isolatedRootInput,
  serverCwdInput,
  baseUrl,
  manifestPath,
  runId,
  nonce,
  canonicalChecksum,
  canonicalAuditChecksum,
}) {
  const isolatedRoot = assertAbsolute('isolated-root', isolatedRootInput);
  const serverCwd = assertAbsolute('server-cwd', serverCwdInput);
  const isolatedPhysical = resolvePhysicalDirectory('isolated-root', isolatedRoot);
  const serverPhysical = resolvePhysicalDirectory('server-cwd', serverCwd);
  if (isolatedRoot !== isolatedPhysical || serverCwd !== serverPhysical) {
    die('isolated root and server cwd must use their physical paths');
  }
  if (serverPhysical !== isolatedPhysical) {
    die('server cwd must be the isolated root so hardcoded runtime-data stores are contained');
  }
  if (!isContained(context.tmpPhysical, isolatedPhysical)) {
    die('isolated root must be physically contained by tmp-base');
  }
  for (const [label, fixedRoot] of [
    ['repository root', context.repositoryPhysical],
    ['canonical runtime-data', context.canonicalRuntimeRoot],
    ['canonical audit data', context.canonicalAuditRoot],
  ]) {
    if (isContained(fixedRoot, isolatedPhysical) || isContained(isolatedPhysical, fixedRoot)) {
      die(`isolated root physically aliases ${label}`);
    }
  }

  const env = {};
  const roots = {};
  for (const [name, relativePath] of Object.entries(QA_ROOT_LAYOUT)) {
    const actual = assertAbsolute(name, process.env[name]?.trim());
    const expected = path.join(isolatedPhysical, relativePath);
    if (actual !== expected) die(`${name} must resolve to ${expected}`);
    if (!isContained(isolatedPhysical, actual)) die(`${name} escapes the isolated root`);
    const physical = physicalParent(actual, FILE_ROOTS.has(name));
    if (!isContained(isolatedPhysical, physical)) {
      die(`${name} resolves through a symlink outside the isolated root`);
    }
    env[name] = actual;
    roots[name] = { path: actual, kind: FILE_ROOTS.has(name) ? 'file' : 'directory' };
  }
  assertTreeContainsNoSymlinks(isolatedPhysical);

  const runtimeEnv = expectedRuntimeEnv({
    baseUrl,
    manifestPath,
    repositoryRoot: context.repositoryPhysical,
    isolationRoot: isolatedPhysical,
    runId,
    nonce,
  });
  for (const [name, expected] of Object.entries(runtimeEnv)) {
    const actual = process.env[name] ?? '';
    if (actual !== expected) die(`${name} must be ${JSON.stringify(expected)} in QA`);
  }

  if (!/^[a-f0-9]{64}$/u.test(canonicalChecksum)) {
    die('canonical-checksum must be a SHA-256 hex digest');
  }
  if (!/^[a-f0-9]{64}$/u.test(canonicalAuditChecksum)) {
    die('canonical-audit-checksum must be a SHA-256 hex digest');
  }
  if (checksumTree(context.canonicalRuntimeRoot) !== canonicalChecksum) {
    die('canonical runtime-data checksum changed during QA lifecycle');
  }
  if (checksumTree(context.canonicalAuditRoot) !== canonicalAuditChecksum) {
    die('canonical audit checksum changed during QA lifecycle');
  }
  const hardcodedFallbackRoot = path.join(serverCwd, 'runtime-data');
  if (!isContained(isolatedPhysical, hardcodedFallbackRoot)) {
    die('hardcoded process.cwd()/runtime-data fallback escapes isolation');
  }
  return {
    isolatedRoot: isolatedPhysical,
    serverCwd: serverPhysical,
    env,
    roots,
    runtimeEnv,
    hardcodedFallbackRoot,
  };
}

function commandContext(argv, allowedExtra = new Set(), requiredExtra = new Set()) {
  const baseKeys = new Set(['tmp-base', 'repository-root', 'base-url', ...allowedExtra]);
  const required = new Set(['tmp-base', 'repository-root', 'base-url', ...requiredExtra]);
  const args = parseArgs(argv, baseKeys, required);
  const context = validateBaseContext(args);
  const parsedBase = parseBaseUrl(args.get('base-url'));
  const manifestPath = fixedManifestPath(context, parsedBase.port);
  return { args, context, ...parsedBase, manifestPath };
}

function manifestPathCommand(argv) {
  const { manifestPath } = commandContext(argv);
  process.stdout.write(`${manifestPath}\n`);
}

function validateBase(argv) {
  const args = parseArgs(
    argv,
    new Set(['tmp-base', 'repository-root']),
    new Set(['tmp-base', 'repository-root']),
  );
  const context = validateBaseContext(args);
  process.stdout.write(`${JSON.stringify(context)}\n`);
}

function validateDist(argv) {
  const args = parseArgs(
    argv,
    new Set(['repository-root', 'dist-dir']),
    new Set(['repository-root', 'dist-dir']),
  );
  const repositoryPhysical = resolvePhysicalDirectory(
    'repository-root',
    args.get('repository-root'),
  );
  const distDir = args.get('dist-dir');
  if (path.isAbsolute(distDir) || distDir.includes('\\')) {
    die('dist-dir must be a safe relative directory');
  }
  const segments = distDir.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    die('dist-dir must not contain empty, dot, or parent segments');
  }
  const candidate = path.join(repositoryPhysical, ...segments);
  const physical = resolvePhysicalDirectory('dist-dir', candidate);
  if (physical !== candidate || !isContained(repositoryPhysical, physical)) {
    die('dist-dir must be a physical directory inside repository-root');
  }
  process.stdout.write(`${distDir}\n`);
}

function prepare(argv) {
  const extra = new Set([
    'isolated-root',
    'server-cwd',
    'owner-pid',
    'run-id',
    'nonce',
    'canonical-checksum',
    'canonical-audit-checksum',
  ]);
  const { args, context, baseUrl, manifestPath } = commandContext(argv, extra, extra);
  const runId = args.get('run-id');
  const nonce = args.get('nonce');
  if (!/^[a-f0-9]{32}$/u.test(runId)) die('run-id must be 32 lowercase hex characters');
  if (!/^[a-f0-9]{64}$/u.test(nonce)) die('nonce must be 64 lowercase hex characters');
  const ownerPid = Number(args.get('owner-pid'));
  if (!Number.isSafeInteger(ownerPid) || ownerPid <= 0) die('owner-pid must be positive');
  withManifestLock(manifestPath, context.tmpPhysical, () => {
    if (existsSync(manifestPath)) {
      const existing = readPrivateJsonFile(manifestPath, 'existing manifest');
      if (
        existing.schemaVersion !== MANIFEST_SCHEMA_VERSION
        || !/^[a-f0-9]{32}$/u.test(existing.runId)
        || !Number.isSafeInteger(existing.ownerPid)
        || existing.ownerPid <= 0
        || !(
          existing.serverPid === null
          || (Number.isSafeInteger(existing.serverPid) && existing.serverPid > 0)
        )
      ) {
        die('refusing to replace an invalid existing manifest');
      }
      const ownerLive = isProcessAlive(existing.ownerPid);
      const serverLive = existing.serverPid !== null && isProcessAlive(existing.serverPid);
      if (ownerLive || serverLive) {
        die('refusing to replace a manifest owned by a live launcher or server');
      }
    }
    const validated = validateIsolation({
      context,
      isolatedRootInput: args.get('isolated-root'),
      serverCwdInput: args.get('server-cwd'),
      baseUrl,
      manifestPath,
      runId,
      nonce,
      canonicalChecksum: args.get('canonical-checksum'),
      canonicalAuditChecksum: args.get('canonical-audit-checksum'),
    });
    const manifest = {
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      state: 'starting',
      createdAt: new Date().toISOString(),
      attestedAt: null,
      ownerPid,
      serverPid: null,
      runId,
      nonce,
      baseUrl,
      manifestPath,
      repositoryRoot: context.repositoryPhysical,
      isolationRoot: validated.isolatedRoot,
      runtimeDataRoot: validated.env.BUILDER_RUNTIME_DATA_ROOT,
      canonicalRuntimeRoot: context.canonicalRuntimeRoot,
      canonicalAuditRoot: context.canonicalAuditRoot,
      serverCwd: validated.serverCwd,
      hardcodedFallbackRoot: validated.hardcodedFallbackRoot,
      canonicalChecksum: args.get('canonical-checksum'),
      canonicalAuditChecksum: args.get('canonical-audit-checksum'),
      env: validated.env,
      runtimeEnv: validated.runtimeEnv,
      roots: validated.roots,
    };
    writeManifest(manifestPath, manifest, context.tmpPhysical);
    process.stdout.write(`${JSON.stringify(manifest)}\n`);
  });
}

function readStartingManifest(manifestPath, context) {
  const parent = path.dirname(manifestPath);
  const parentStats = lstatSync(parent);
  if (!parentStats.isDirectory() || parentStats.isSymbolicLink() || (parentStats.mode & 0o077) !== 0) {
    die('manifest directory must be a private real directory');
  }
  if (!isContained(context.tmpPhysical, realpathSync(parent))) {
    die('manifest directory escapes physical tmp-base');
  }
  const manifest = readPrivateJsonFile(manifestPath, 'starting manifest');
  if (manifest.schemaVersion !== MANIFEST_SCHEMA_VERSION || manifest.state !== 'starting') {
    die('manifest must be schemaVersion 3 in starting state');
  }
  if (manifest.manifestPath !== manifestPath) die('manifest path binding mismatch');
  if (manifest.repositoryRoot !== context.repositoryPhysical) {
    die('manifest repository binding mismatch');
  }
  return manifest;
}

function validateStartingManifestBindings(manifest, { context, baseUrl, manifestPath }) {
  if (!/^[a-f0-9]{32}$/u.test(manifest.runId)) die('manifest runId is invalid');
  if (!/^[a-f0-9]{64}$/u.test(manifest.nonce)) die('manifest nonce is invalid');
  if (!isProcessAlive(manifest.ownerPid)) die('manifest ownerPid is invalid or no longer alive');
  if (manifest.serverPid !== null || manifest.attestedAt !== null) {
    die('starting manifest must not have server attestation fields');
  }
  if (manifest.baseUrl !== baseUrl) die('manifest baseUrl binding mismatch');
  if (manifest.repositoryRoot !== context.repositoryPhysical) {
    die('manifest repository binding mismatch');
  }
  if (manifest.canonicalRuntimeRoot !== context.canonicalRuntimeRoot) {
    die('manifest canonical runtime binding mismatch');
  }
  if (manifest.canonicalAuditRoot !== context.canonicalAuditRoot) {
    die('manifest canonical audit binding mismatch');
  }
  if (manifest.manifestPath !== manifestPath) die('manifest path binding mismatch');
  const isolationPhysical = resolvePhysicalDirectory('manifest isolationRoot', manifest.isolationRoot);
  if (manifest.isolationRoot !== isolationPhysical) die('manifest isolationRoot is not physical');
  if (manifest.runtimeDataRoot !== path.join(isolationPhysical, 'runtime-data')) {
    die('manifest runtimeDataRoot binding mismatch');
  }
  if (manifest.serverCwd !== isolationPhysical) die('manifest serverCwd binding mismatch');
  if (manifest.hardcodedFallbackRoot !== path.join(isolationPhysical, 'runtime-data')) {
    die('manifest hardcoded runtime-data binding mismatch');
  }
  if (!/^[a-f0-9]{64}$/u.test(manifest.canonicalChecksum)) {
    die('manifest canonical checksum is invalid');
  }
  if (!/^[a-f0-9]{64}$/u.test(manifest.canonicalAuditChecksum)) {
    die('manifest canonical audit checksum is invalid');
  }
  if (!manifest.env || typeof manifest.env !== 'object' || Array.isArray(manifest.env)) {
    die('manifest root environment policy is invalid');
  }
  if (
    !manifest.runtimeEnv
    || typeof manifest.runtimeEnv !== 'object'
    || Array.isArray(manifest.runtimeEnv)
  ) {
    die('manifest runtime environment policy is invalid');
  }
  if (!manifest.roots || typeof manifest.roots !== 'object' || Array.isArray(manifest.roots)) {
    die('manifest root metadata policy is invalid');
  }
  const assertExactKeys = (label, actual, expected) => {
    const actualKeys = Object.keys(actual).sort();
    const expectedKeys = Object.keys(expected).sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
      die(`${label} key set is incomplete or unexpected`);
    }
  };
  assertExactKeys('manifest root environment', manifest.env, QA_ROOT_LAYOUT);
  const expectedRuntime = expectedRuntimeEnv({
    baseUrl,
    manifestPath,
    repositoryRoot: context.repositoryPhysical,
    isolationRoot: isolationPhysical,
    runId: manifest.runId,
    nonce: manifest.nonce,
  });
  assertExactKeys('manifest runtime environment', manifest.runtimeEnv, expectedRuntime);
  assertExactKeys('manifest root metadata', manifest.roots, QA_ROOT_LAYOUT);
  for (const [name, relativePath] of Object.entries(QA_ROOT_LAYOUT)) {
    const expectedPath = path.join(isolationPhysical, relativePath);
    const expectedKind = FILE_ROOTS.has(name) ? 'file' : 'directory';
    if (manifest.env[name] !== expectedPath) die(`manifest root binding mismatch: ${name}`);
    if (
      !manifest.roots[name]
      || manifest.roots[name].path !== expectedPath
      || manifest.roots[name].kind !== expectedKind
    ) {
      die(`manifest root metadata mismatch: ${name}`);
    }
  }
  for (const [name, expected] of Object.entries(expectedRuntime)) {
    if (manifest.runtimeEnv[name] !== expected) {
      die(`manifest runtime binding mismatch: ${name}`);
    }
  }
}

function readAttestationResponse(args, manifest) {
  const responseFile = args.get('response-file');
  if (responseFile) {
    const absolute = assertAbsolute('response-file', responseFile);
    if (!isContained(manifest.isolationRoot, absolute)) {
      die('attestation response file must be inside the isolated root');
    }
    return readPrivateJsonFile(absolute, 'attestation response');
  }
  return {
    runId: args.get('response-run-id'),
    serverPid: Number(args.get('server-pid')),
    challenge: args.get('challenge'),
    signature: args.get('signature'),
  };
}

function promoteReady(argv) {
  const extra = new Set([
    'run-id',
    'challenge',
    'server-pid',
    'response-run-id',
    'signature',
    'response-file',
  ]);
  const required = new Set(['run-id', 'challenge', 'server-pid']);
  const { args, context, baseUrl, manifestPath } = commandContext(argv, extra, required);
  withManifestLock(manifestPath, context.tmpPhysical, () => {
    const manifest = readStartingManifest(manifestPath, context);
    validateStartingManifestBindings(manifest, { context, baseUrl, manifestPath });
    const runId = args.get('run-id');
    const challenge = args.get('challenge');
    if (runId !== manifest.runId || !/^[a-f0-9]{32}$/u.test(runId)) {
      die('attestation runId does not match starting manifest');
    }
    if (!/^[a-f0-9]{64}$/u.test(challenge)) {
      die('attestation challenge must be 64 lowercase hex characters');
    }
    const response = readAttestationResponse(args, manifest);
    if (!response || typeof response !== 'object') die('attestation response must be an object');
    if (response.runId !== runId) die('attestation response runId mismatch');
    if (response.challenge !== challenge) die('attestation response challenge mismatch');
    if (!Number.isSafeInteger(response.serverPid) || response.serverPid <= 0) {
      die('attestation response serverPid must be positive');
    }
    if (!isProcessAlive(response.serverPid)) die('attested serverPid is not alive');
    const expectedServerPid = Number(args.get('server-pid'));
    if (!Number.isSafeInteger(expectedServerPid) || expectedServerPid <= 0) {
      die('server-pid must be positive');
    }
    if (response.serverPid !== expectedServerPid) {
      die('attestation response serverPid mismatch');
    }
    if (typeof response.signature !== 'string' || !/^[a-f0-9]{64}$/u.test(response.signature)) {
      die('attestation signature must be 64 lowercase hex characters');
    }
    const message = `${ATTESTATION_DOMAIN}:${runId}:${response.serverPid}:${challenge}`;
    const expectedSignature = createHmac('sha256', Buffer.from(manifest.nonce, 'hex'))
      .update(message)
      .digest();
    const actualSignature = Buffer.from(response.signature, 'hex');
    if (
      actualSignature.length !== expectedSignature.length
      || !timingSafeEqual(actualSignature, expectedSignature)
    ) {
      die('attestation signature mismatch');
    }

    const validated = validateIsolation({
      context,
      isolatedRootInput: manifest.isolationRoot,
      serverCwdInput: manifest.serverCwd,
      baseUrl,
      manifestPath,
      runId,
      nonce: manifest.nonce,
      canonicalChecksum: manifest.canonicalChecksum,
      canonicalAuditChecksum: manifest.canonicalAuditChecksum,
    });
    for (const [name, value] of Object.entries(manifest.env)) {
      if (validated.env[name] !== value) die(`manifest root policy changed: ${name}`);
    }
    for (const [name, value] of Object.entries(manifest.runtimeEnv)) {
      if (validated.runtimeEnv[name] !== value) die(`manifest runtime policy changed: ${name}`);
    }
    const current = readStartingManifest(manifestPath, context);
    if (current.runId !== runId || current.nonce !== manifest.nonce) {
      die('starting manifest ownership changed before ready promotion');
    }
    const ready = {
      ...manifest,
      state: 'ready',
      serverPid: response.serverPid,
      attestedAt: new Date().toISOString(),
    };
    writeManifest(manifestPath, ready, context.tmpPhysical);
    process.stdout.write(`${JSON.stringify(ready)}\n`);
  });
}

function removeManifest(argv) {
  const extra = new Set(['run-id']);
  const { args, context, manifestPath } = commandContext(argv, extra, extra);
  const runId = args.get('run-id');
  if (!/^[a-f0-9]{32}$/u.test(runId)) die('run-id must be 32 lowercase hex characters');
  withManifestLock(manifestPath, context.tmpPhysical, () => {
    if (!existsSync(manifestPath)) return;
    const manifest = readPrivateJsonFile(manifestPath, 'manifest cleanup target');
    if (manifest.schemaVersion !== MANIFEST_SCHEMA_VERSION || manifest.runId !== runId) {
      die('refusing to remove a manifest owned by a different run');
    }
    const current = readPrivateJsonFile(manifestPath, 'manifest cleanup target');
    if (current.runId !== runId) die('manifest ownership changed before cleanup');
    rmSync(manifestPath);
  });
}

try {
  const [command, ...rest] = process.argv.slice(2);
  if (command === 'checksum') {
    if (rest.length !== 1) die('usage: checksum <root>');
    process.stdout.write(`${checksumTree(rest[0])}\n`);
  } else if (command === 'generate-identity') {
    if (rest.length !== 0) die('usage: generate-identity');
    process.stdout.write(`${randomBytes(16).toString('hex')} ${randomBytes(32).toString('hex')}\n`);
  } else if (command === 'generate-challenge') {
    if (rest.length !== 0) die('usage: generate-challenge');
    process.stdout.write(`${randomBytes(32).toString('hex')}\n`);
  } else if (command === 'manifest-path') {
    manifestPathCommand(rest);
  } else if (command === 'validate-base') {
    validateBase(rest);
  } else if (command === 'validate-dist') {
    validateDist(rest);
  } else if (command === 'prepare') {
    prepare(rest);
  } else if (command === 'promote-ready') {
    promoteReady(rest);
  } else if (command === 'remove-manifest') {
    removeManifest(rest);
  } else {
    die('usage: <checksum|generate-identity|generate-challenge|manifest-path|validate-base|validate-dist|prepare|promote-ready|remove-manifest> ...');
  }
} catch (error) {
  process.stderr.write(
    `qa_runtime_isolation_error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 2;
}
