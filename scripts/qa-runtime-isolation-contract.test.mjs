// Direct QA runtime-isolation contract proof.
//
// Scope: prove that ONE attested manifest propagates the SAME isolated
// namespace to (a) the QA server process and (b) the Playwright coordinator
// process, that every mutable root (explicit override or cwd-relative fallback
// used by collab/comments/dynamic-template stores) is contained, and that the
// contract fails closed when a required override is absent, roots mismatch, a
// symlink escapes, or cleanup is attempted for the wrong run.
//
// Every write stays under mkdtemp. Canonical roots are checksummed before and
// after and asserted byte-identical. No persistent server is started; the
// preflight dry-run is the only shell invocation.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
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
import test from 'node:test';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const CONTRACT_SRC = path.join(REPO_ROOT, 'scripts', 'qa-runtime-isolation-contract.mjs');
const SHELL_SRC = path.join(REPO_ROOT, 'scripts', 'start-qa-server.sh');
const QA_GLOBAL_SETUP_SRC = path.join(REPO_ROOT, 'tests', 'builder-editor', 'qa-global-setup.ts');

const ATTESTATION_DOMAIN = 'tseng-law-qa-attestation:v3';

const cleanupRoots = [];
test.after(() => {
  while (cleanupRoots.length) rmSync(cleanupRoots.pop(), { recursive: true, force: true });
});

function track(root) {
  cleanupRoots.push(root);
  return root;
}

function runNode(file, args, env = process.env) {
  return execFileSync(process.execPath, [file, ...args], { encoding: 'utf8', env }).trim();
}

function runNodeOrError(file, args, env = process.env) {
  try {
    runNode(file, args, env);
    return { ok: true, code: 0, stderr: '' };
  } catch (error) {
    return {
      ok: false,
      code: typeof error.status === 'number' ? error.status : 1,
      stderr: String(error.stderr ?? error.message),
    };
  }
}

function checksum(file, root) {
  return runNode(file, ['checksum', root]);
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function buildFixture(port) {
  const root = realpathSync(track(mkdtempSync(path.join(os.tmpdir(), 'qa-iso-contract-'))));
  const repo = path.join(root, 'repo');
  const tmp = path.join(root, 'tmp');
  const canonicalRuntime = path.join(repo, 'runtime-data');
  const canonicalAudit = path.join(repo, 'data', 'audit');
  mkdirSync(path.join(repo, 'scripts'), { recursive: true });
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

  const contract = path.join(repo, 'scripts', 'qa-runtime-isolation-contract.mjs');
  const shell = path.join(repo, 'scripts', 'start-qa-server.sh');
  copyFileSync(CONTRACT_SRC, contract);
  copyFileSync(SHELL_SRC, shell);
  return {
    root,
    repo,
    tmp,
    contract,
    shell,
    port,
    baseUrl: `http://127.0.0.1:${port}`,
    canonicalRuntime,
    canonicalAudit,
  };
}

function preflight(fixture, envOverrides = {}) {
  const runtimeBefore = checksum(fixture.contract, fixture.canonicalRuntime);
  const auditBefore = checksum(fixture.contract, fixture.canonicalAudit);
  const output = execFileSync('zsh', [fixture.shell], {
    cwd: fixture.repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      TMPDIR: fixture.tmp,
      PORT: String(fixture.port),
      NEXT_DIST_DIR: '.next-build',
      QA_ISOLATION_PREFLIGHT_ONLY: '1',
      QA_KEEP_PREFLIGHT_MANIFEST: '1',
      ...envOverrides,
    },
  });
  const runtimeAfter = checksum(fixture.contract, fixture.canonicalRuntime);
  const auditAfter = checksum(fixture.contract, fixture.canonicalAudit);
  const manifestPath = runNode(fixture.contract, [
    'manifest-path',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
  ]);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  return {
    output, runtimeBefore, runtimeAfter, auditBefore, auditAfter, manifestPath, manifest,
  };
}

function replaceWithLiveStarting(fixture, startingManifest) {
  const [runId, nonce] = runNode(fixture.contract, ['generate-identity']).split(' ');
  const runtimeEnv = {
    ...startingManifest.runtimeEnv,
    QA_INTERNAL_RUN_ID: runId,
    QA_INTERNAL_ATTESTATION_NONCE: nonce,
  };
  const env = { ...process.env, ...startingManifest.env, ...runtimeEnv };
  runNode(fixture.contract, [
    'prepare',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--isolated-root', startingManifest.isolationRoot,
    '--server-cwd', startingManifest.isolationRoot,
    '--owner-pid', String(process.pid),
    '--run-id', runId,
    '--nonce', nonce,
    '--canonical-checksum', startingManifest.canonicalChecksum,
    '--canonical-audit-checksum', startingManifest.canonicalAuditChecksum,
  ], env);
  return JSON.parse(readFileSync(startingManifest.manifestPath, 'utf8'));
}

function sign(manifest, challenge) {
  return createHmac('sha256', Buffer.from(manifest.nonce, 'hex'))
    .update(`${ATTESTATION_DOMAIN}:${manifest.runId}:${process.pid}:${challenge}`)
    .digest('hex');
}

function extractServerEnvKeys(shellSource) {
  const startIdx = shellSource.indexOf('SERVER_ENV=(');
  if (startIdx === -1) {
    throw new Error('SERVER_ENV array literal not found in start-qa-server.sh');
  }
  const blockStart = shellSource.indexOf('\n', startIdx) + 1;
  const closingIdx = shellSource.indexOf('\n)', blockStart);
  if (closingIdx === -1) {
    throw new Error('SERVER_ENV array closing paren not found in start-qa-server.sh');
  }
  const block = shellSource.slice(blockStart, closingIdx);
  const keys = new Set();
  for (const line of block.split('\n')) {
    const entry = /^\s*"([A-Z_][A-Z0-9_]*)=/.exec(line);
    if (entry) keys.add(entry[1]);
  }
  if (keys.size === 0) {
    throw new Error('no quoted entries parsed from SERVER_ENV block');
  }
  return keys;
}

test('one attested manifest propagates the same isolated namespace to the server and coordinator', () => {
  const fixture = buildFixture(50401);
  const { manifest, runtimeBefore, runtimeAfter, auditBefore, auditAfter, output } = preflight(fixture);

  assert.match(output, /QA isolation preflight PASS/);

  // Canonical roots untouched by the preflight lifecycle.
  assert.equal(runtimeAfter, runtimeBefore, 'canonical runtime-data checksum must not change');
  assert.equal(auditAfter, auditBefore, 'canonical audit checksum must not change');

  // The manifest is the single source of truth. The server side is bound by
  // validateIsolation (which asserts process.env matches manifest values at
  // prepare/promote time) and the coordinator side loads manifest.env +
  // manifest.runtimeEnv verbatim (see playwright.config.ts). Proving the
  // manifest is complete and self-consistent therefore proves both sides
  // receive one identical namespace.
  assert.equal(manifest.state, 'starting');
  assert.equal(manifest.serverCwd, manifest.isolationRoot,
    'server cwd must bind to the isolated root so cwd-relative stores are contained');
  assert.equal(
    manifest.hardcodedFallbackRoot,
    path.join(manifest.isolationRoot, 'runtime-data'),
    'cwd/runtime-data fallback (collab/comments/cursors/review-markers/dynamic-templates) must stay isolated',
  );

  for (const [name, resolved] of Object.entries(manifest.env)) {
    assert.ok(path.isAbsolute(resolved), `${name} must be absolute`);
    assert.ok(isContained(manifest.isolationRoot, resolved),
      `${name} must remain inside the isolated root`);
    assert.ok(!isContained(manifest.canonicalRuntimeRoot, resolved),
      `${name} must never resolve into canonical runtime-data`);
    const descriptor = manifest.roots[name];
    assert.equal(descriptor.path, resolved, `roots.${name}.path must equal env binding`);
    assert.ok(descriptor.kind === 'file' || descriptor.kind === 'directory',
      `roots.${name}.kind must be explicit`);
  }

  // Deterministic runtime policy that both processes must inherit unchanged.
  assert.equal(manifest.runtimeEnv.BUILDER_RATE_LIMIT_BACKEND, 'isolated-qa');
  assert.equal(manifest.runtimeEnv.BUILDER_SITE_BACKEND, 'local');
  assert.equal(manifest.runtimeEnv.BLOB_READ_WRITE_TOKEN, '');
  assert.equal(manifest.runtimeEnv.STRIPE_SECRET_KEY, '');
  assert.equal(manifest.runtimeEnv.AUTH_BYPASS, '');
  assert.equal(manifest.runtimeEnv.BUILDER_DRAFT_RATE_LIMIT, '2000');
  for (const urlName of [
    'BUILDER_ALLOWED_ORIGINS', 'SITE_URL', 'NEXT_PUBLIC_SITE_URL',
    'PUBLIC_SITE_ORIGIN', 'NEXT_PUBLIC_SITE_ORIGIN',
  ]) {
    assert.equal(manifest.runtimeEnv[urlName], fixture.baseUrl,
      `${urlName} must bind to the loopback base url`);
  }

  // Private bookings must never cross into the QA copy.
  assert.ok(
    existsSync(path.join(manifest.runtimeDataRoot, 'builder-site', 'tseng-law-main-site', 'site.json')),
    'deterministic site fixture must be copied',
  );
  assert.equal(
    existsSync(path.join(manifest.runtimeDataRoot, 'builder-bookings', 'bookings', 'private.json')),
    false,
    'private bookings must not cross the canonical/QA boundary',
  );
});

test('the ready namespace the coordinator loads equals the namespace the server attested', () => {
  const fixture = buildFixture(50402);
  const starting = preflight(fixture).manifest;
  const live = replaceWithLiveStarting(fixture, starting);
  const challenge = 'a'.repeat(64);
  const env = { ...process.env, ...live.env, ...live.runtimeEnv };
  runNode(fixture.contract, [
    'promote-ready',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--run-id', live.runId,
    '--challenge', challenge,
    '--server-pid', String(process.pid),
    '--response-run-id', live.runId,
    '--signature', sign(live, challenge),
  ], env);

  const ready = JSON.parse(readFileSync(live.manifestPath, 'utf8'));
  assert.equal(ready.state, 'ready');
  assert.equal(ready.serverPid, process.pid);
  // The ready manifest carries the identical env/runtimeEnv map it had in the
  // starting state: promoting attestation never rewrites the namespace, so the
  // server process and the Playwright coordinator read byte-identical bindings.
  assert.deepEqual(ready.env, live.env);
  assert.deepEqual(ready.runtimeEnv, live.runtimeEnv);
  assert.equal(ready.isolationRoot, live.isolationRoot);
  assert.equal(checksum(fixture.contract, fixture.canonicalRuntime), starting.canonicalChecksum);
  assert.equal(checksum(fixture.contract, fixture.canonicalAudit), starting.canonicalAuditChecksum);
});

test('fails closed when a required mutable-root override is absent', () => {
  const fixture = buildFixture(50403);
  const starting = preflight(fixture).manifest;

  const baseEnv = { ...process.env, ...starting.env, ...starting.runtimeEnv };
  delete baseEnv.BUILDER_REVISIONS_ROOT;
  const [runId, nonce] = runNode(fixture.contract, ['generate-identity']).split(' ');
  const result = runNodeOrError(fixture.contract, [
    'prepare',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--isolated-root', starting.isolationRoot,
    '--server-cwd', starting.isolationRoot,
    '--owner-pid', String(process.pid),
    '--run-id', runId,
    '--nonce', nonce,
    '--canonical-checksum', starting.canonicalChecksum,
    '--canonical-audit-checksum', starting.canonicalAuditChecksum,
  ], { ...baseEnv, QA_INTERNAL_RUN_ID: runId, QA_INTERNAL_ATTESTATION_NONCE: nonce });

  assert.equal(result.ok, false, 'prepare must fail when a root override is missing');
  assert.ok(result.code !== 0, 'missing override must exit nonzero');
  assert.match(result.stderr, /BUILDER_REVISIONS_ROOT/);
  assert.equal(checksum(fixture.contract, fixture.canonicalRuntime), starting.canonicalChecksum);
});

test('rejects mismatched server cwd, an isolated-root symlink escape, and wrong-run cleanup', () => {
  const fixture = buildFixture(50404);
  const starting = preflight(fixture).manifest;
  const runtimeBefore = checksum(fixture.contract, fixture.canonicalRuntime);

  // Mismatched server cwd: the server must run from inside the isolated root.
  const mismatchedCwd = path.join(fixture.tmp, 'not-the-isolated-root');
  mkdirSync(mismatchedCwd, { recursive: true });
  const [runIdA, nonceA] = runNode(fixture.contract, ['generate-identity']).split(' ');
  const mismatched = runNodeOrError(fixture.contract, [
    'prepare',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--isolated-root', starting.isolationRoot,
    '--server-cwd', mismatchedCwd,
    '--owner-pid', String(process.pid),
    '--run-id', runIdA,
    '--nonce', nonceA,
    '--canonical-checksum', starting.canonicalChecksum,
    '--canonical-audit-checksum', starting.canonicalAuditChecksum,
  ], {
    ...process.env,
    ...starting.env,
    ...starting.runtimeEnv,
    QA_INTERNAL_RUN_ID: runIdA,
    QA_INTERNAL_ATTESTATION_NONCE: nonceA,
  });
  assert.equal(mismatched.ok, false);
  assert.match(mismatched.stderr, /server cwd must be the isolated root/);

  // Symlink escape inside the isolated namespace is detected at promote time.
  const live = replaceWithLiveStarting(fixture, starting);
  symlinkSync(
    fixture.canonicalRuntime,
    path.join(live.isolationRoot, 'escape-to-canonical'),
    'dir',
  );
  const challenge = 'b'.repeat(64);
  const escaped = runNodeOrError(fixture.contract, [
    'promote-ready',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--run-id', live.runId,
    '--challenge', challenge,
    '--server-pid', String(process.pid),
    '--response-run-id', live.runId,
    '--signature', sign(live, challenge),
  ], { ...process.env, ...live.env, ...live.runtimeEnv });
  assert.equal(escaped.ok, false);
  assert.match(escaped.stderr, /isolated QA namespace contains a symlink/);
  assert.equal(
    JSON.parse(readFileSync(live.manifestPath, 'utf8')).state,
    'starting',
    'failed promotion must leave the manifest in starting state',
  );

  // Wrong-run cleanup is refused; the owned manifest survives for forensics.
  const wrongRun = runNodeOrError(fixture.contract, [
    'remove-manifest',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--run-id', 'f'.repeat(32),
  ]);
  assert.equal(wrongRun.ok, false);
  assert.match(wrongRun.stderr, /different run/);
  assert.ok(existsSync(live.manifestPath), 'owned manifest must not be deleted by another run');

  // Owned cleanup succeeds and only removes the manifest (never the canonical tree).
  runNode(fixture.contract, [
    'remove-manifest',
    '--tmp-base', fixture.tmp,
    '--repository-root', fixture.repo,
    '--base-url', fixture.baseUrl,
    '--run-id', live.runId,
  ]);
  assert.equal(existsSync(live.manifestPath), false);
  assert.equal(checksum(fixture.contract, fixture.canonicalRuntime), runtimeBefore,
    'canonical runtime-data must be unchanged after the full lifecycle');
});

test('SERVER_ENV in start-qa-server.sh matches the manifest server environment key contract', () => {
  // SERVER_ENV is a hand-maintained duplicate of the manifest environment
  // contract. A future key added to the manifest but forgotten in the shell
  // (or a stray key left in the shell after the manifest drops it) must be
  // caught directly, before it silently narrows or widens the isolation
  // boundary the server actually receives.
  const fixture = buildFixture(50405);
  const { manifest } = preflight(fixture);

  // The manifest is the single source of truth for the environment the QA
  // server is intended to receive. Its env (root layout bindings) and
  // runtimeEnv (local runtime, blanked provider/bypass, local URL, and
  // internal isolation bindings) key sets together define every variable
  // the server must be given.
  const manifestIntendedKeys = new Set([
    ...Object.keys(manifest.env),
    ...Object.keys(manifest.runtimeEnv),
  ]);

  const serverEnvKeys = extractServerEnvKeys(readFileSync(SHELL_SRC, 'utf8'));

  // Shell-only process controls that exist in SERVER_ENV but are intentionally
  // NOT part of the manifest isolation/runtime contract. Each is a process
  // launch concern rather than a runtime policy or isolation binding.
  const DOCUMENTED_SHELL_ONLY_CONTROLS = new Set([
    'PATH',
    'HOME',
    'LANG',
    'TZ',
    'TMPDIR',
    'PORT',
    'NODE_ENV',
    'NEXT_DIST_DIR',
  ]);

  const missing = [...manifestIntendedKeys]
    .filter((key) => !serverEnvKeys.has(key))
    .sort();
  const extra = [...serverEnvKeys]
    .filter(
      (key) => !manifestIntendedKeys.has(key)
        && !DOCUMENTED_SHELL_ONLY_CONTROLS.has(key),
    )
    .sort();

  assert.deepEqual(missing, [],
    'SERVER_ENV must include every manifest-intended env key');
  assert.deepEqual(extra, [],
    'SERVER_ENV must not carry env keys outside the manifest contract');
});

test('QA attestation route is discoverable: literal _qa is a Next private segment, so the handler lives under the percent-encoded %5Fqa on-disk segment while the public URL stays _qa', () => {
  // A folder segment beginning with `_` is a Next.js App Router *private
  // folder* and is excluded from route discovery: a literal `src/app/api/
  // builder/_qa` tree silently 404s `/api/builder/_qa/attestation` (the build
  // emits no manifest key for it). The on-disk percent-encoding `%5Fqa` is
  // percent-decoded back to `_qa` for the public URL while remaining a
  // routable segment, mirroring the in-repo `%5Fdev` precedent. This test pins
  // the discoverable on-disk layout and the decoded harness URL together so a
  // future rename back to the literal private folder re-breaks the build here,
  // not at attestation timeout. Filesystem-only: no build, server, or
  // canonical-data writes (uses existsSync/readFileSync against exact paths).
  const BUILDER_API_ROOT = path.join(REPO_ROOT, 'src', 'app', 'api', 'builder');

  // (a) the route handler and its unit test live under the percent-encoded
  // segment that Next.js actually discovers.
  assert.ok(
    existsSync(path.join(BUILDER_API_ROOT, '%5Fqa', 'attestation', 'route.ts')),
    'attestation route handler must live under the %5Fqa percent-encoded segment so Next.js discovers it',
  );
  assert.ok(
    existsSync(path.join(BUILDER_API_ROOT, '%5Fqa', 'attestation', '__tests__', 'route.test.ts')),
    'attestation route unit test must live under the %5Fqa percent-encoded segment alongside the handler',
  );

  // (b) the literal private folder is gone entirely (no empty shell left to
  // re-shadow the discoverable route).
  assert.equal(
    existsSync(path.join(BUILDER_API_ROOT, '_qa')),
    false,
    'a literal _qa folder is a Next private folder and silently 404s the attestation route; it must not exist',
  );

  // (c) both runtime harness entry points still poll the exact decoded public
  // URL as LIVE operational expressions (the curl/fetch node), not merely
  // anywhere in the source text. The on-disk encoding is an implementation
  // detail; the public URL the QA server and the Playwright coordinator fetch
  // stays `_qa`. Pinning the call node rejects a comment-only occurrence.
  const shellSource = readFileSync(SHELL_SRC, 'utf8');
  assert.match(
    shellSource,
    /"\$QA_BASE_URL\/api\/builder\/_qa\/attestation"/,
    'start-qa-server.sh must pass the live curl argument "$QA_BASE_URL/api/builder/_qa/attestation" (decoded public URL), not a comment or the %5Fqa on-disk encoding',
  );
  const setupSource = readFileSync(QA_GLOBAL_SETUP_SRC, 'utf8');
  assert.match(
    setupSource,
    /fetch\(\s*new\s+URL\(\s*(['"`])\/api\/builder\/_qa\/attestation\1\s*,\s*baseUrl\s*\)/,
    "tests/builder-editor/qa-global-setup.ts must call fetch(new URL('/api/builder/_qa/attestation', baseUrl)) as a live expression, not a comment or the %5Fqa on-disk encoding",
  );

  // (d) neither harness may reference the %5Fqa on-disk encoding anywhere; the
  // encoded segment is an implementation detail confined to disk layout, and the
  // public route spelling must stay decoded `_qa`.
  assert.doesNotMatch(
    shellSource,
    /%5Fqa/,
    'start-qa-server.sh must never reference the %5Fqa on-disk encoding; the public URL stays decoded _qa',
  );
  assert.doesNotMatch(
    setupSource,
    /%5Fqa/,
    'tests/builder-editor/qa-global-setup.ts must never reference the %5Fqa on-disk encoding; the public URL stays decoded _qa',
  );
});
