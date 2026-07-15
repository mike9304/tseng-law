import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  assertMirrorRootIsIsolated,
  resolveMirrorTargetPath,
  runPullProdBuilderData,
} from './pull-prod-builder-data.mjs';

const TOKEN = 'test-token-never-log';

async function fixtureRoot(prefix) {
  return realpath(await mkdtemp(path.join(os.tmpdir(), prefix)));
}

function sink() {
  let value = '';
  return {
    write(chunk) {
      value += String(chunk);
    },
    text() {
      return value;
    },
  };
}

function response(body) {
  return {
    statusCode: 200,
    stream: new Blob([body]).stream(),
  };
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function providerFor(entries) {
  return {
    async list({ prefix }) {
      const pathnames = Object.keys(entries).filter((pathname) => pathname.startsWith(prefix));
      return { blobs: pathnames.map((pathname) => ({ pathname })), hasMore: false };
    },
    async get(pathname) {
      assert.ok(Object.hasOwn(entries, pathname), `unexpected get(${pathname})`);
      return response(entries[pathname]);
    },
  };
}

async function runMirror({
  args,
  cwd,
  entries,
  environment = {},
  provider = providerFor(entries ?? {}),
  repoRuntimeDataRoot,
  testHook,
}) {
  const stdout = sink();
  const stderr = sink();
  const result = await runPullProdBuilderData({
    args,
    cwd,
    environment,
    provider,
    stdout,
    stderr,
    token: TOKEN,
    repoRuntimeDataRoot,
    testHook,
  });
  return { result, stdout: stdout.text(), stderr: stderr.text() };
}

test('default and single-store modes keep every blob under the intended mirror target', async (t) => {
  const root = await fixtureRoot('pull-prod-layout-');
  t.after(() => rm(root, { recursive: true, force: true }));

  const defaultOut = path.join(root, 'default');
  const entries = {
    'builder-site/site-a/site.json': '{"store":"site"}',
    'consultation-columns/ko/column.json': '{"store":"columns"}',
    'search/site-index.json': '{"store":"search"}',
    'builder-faq/items/faq.json': '{"store":"faq"}',
    'consultation-embeddings/column-embeddings.json': '{"store":"embeddings"}',
  };
  const defaultRun = await runMirror({ args: [`--out=${defaultOut}`], cwd: root, entries });
  assert.equal(defaultRun.result.totalWritten, 5);
  assert.equal(await readFile(path.join(defaultOut, 'builder-site/site-a/site.json'), 'utf8'), entries['builder-site/site-a/site.json']);
  assert.equal(await readFile(path.join(defaultOut, 'search/site-index.json'), 'utf8'), entries['search/site-index.json']);

  const singleOut = path.join(root, 'single');
  const singleRun = await runMirror({
    args: ['--prefix=builder-site', `--out=${singleOut}`],
    cwd: root,
    entries: { 'builder-site/site-b/site.json': '{"store":"single"}' },
  });
  assert.equal(singleRun.result.totalWritten, 1);
  assert.equal(await readFile(path.join(singleOut, 'site-b/site.json'), 'utf8'), '{"store":"single"}');

  assert.throws(
    () => resolveMirrorTargetPath(singleOut, 'builder-site/../outside.json', 'builder-site'),
    /unsafe blob pathname/i,
  );
  assert.throws(
    () => resolveMirrorTargetPath(
      singleOut,
      'builder-site/.local-json-write-leases/competitor.json',
      'builder-site',
    ),
    /unsafe blob pathname/i,
  );
  for (const controlName of [
    '.PULL-PROD-BUILDER-DATA-MIRROR.JSON',
    'PULL-PROD-BUILDER-DATA-MIRROR.OWNER.JSON',
    '.site.json.writer.lock',
    '.site.json.writer.reclaim',
    '.site.json.txn-nonce123.candidate',
  ]) {
    assert.throws(
      () => resolveMirrorTargetPath(singleOut, `builder-site/${controlName}`, 'builder-site'),
      /unsafe blob pathname/i,
    );
  }
});

test('nested new output parents are created from the nearest existing physical ancestor', async (t) => {
  const root = await fixtureRoot('pull-prod-nested-parent-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'new', 'nested', 'mirror');
  await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: { 'builder-site/site-a/site.json': '{"nested":true}' },
  });
  assert.equal(await readFile(path.join(out, 'site-a/site.json'), 'utf8'), '{"nested":true}');
});

test('traversal pathname is rejected before get or any outside write', async (t) => {
  const root = await fixtureRoot('pull-prod-traversal-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'mirror');
  let getCalls = 0;
  const provider = {
    async list() {
      return { blobs: [{ pathname: 'builder-site/../escaped.json' }], hasMore: false };
    },
    async get() {
      getCalls += 1;
      return response('{"escaped":true}');
    },
  };

  await assert.rejects(
    () => runMirror({ args: ['--prefix=builder-site', `--out=${out}`], cwd: root, provider }),
    /unsafe blob pathname/i,
  );
  assert.equal(getCalls, 0);
  await assert.rejects(() => readFile(path.join(root, 'escaped.json')), { code: 'ENOENT' });
});

test('symlinked target parent cannot redirect a mirror write outside the mirror root', async (t) => {
  const root = await fixtureRoot('pull-prod-symlink-');
  const outside = await fixtureRoot('pull-prod-outside-');
  t.after(() => Promise.all([
    rm(root, { recursive: true, force: true }),
    rm(outside, { recursive: true, force: true }),
  ]));
  const out = path.join(root, 'mirror');
  await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: {},
  });
  await symlink(outside, path.join(out, 'site-a'), 'dir');

  await assert.rejects(
    () => runMirror({
      args: ['--prefix=builder-site', `--out=${out}`],
      cwd: root,
      entries: { 'builder-site/site-a/site.json': '{"escaped":true}' },
    }),
    /symlink|unsafe|contain/i,
  );
  assert.deepEqual(await readdir(outside), []);
});

test('write and purge both refuse mirror roots that overlap the active or repository canonical roots', async (t) => {
  const root = await fixtureRoot('pull-prod-canonical-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const active = path.join(root, 'active-builder-site');
  const repoRuntime = path.join(root, 'repo-runtime-data');
  await mkdir(active, { recursive: true });
  await mkdir(repoRuntime, { recursive: true });

  for (const candidate of [active, path.join(active, 'mirror'), root]) {
    await assert.rejects(
      () => assertMirrorRootIsIsolated(candidate, {
        cwd: root,
        environment: { BUILDER_SITE_ROOT: active },
        repoRuntimeDataRoot: repoRuntime,
      }),
      /canonical|overlap/i,
    );
  }
  for (const candidate of [repoRuntime, path.join(repoRuntime, 'mirror')]) {
    await assert.rejects(
      () => assertMirrorRootIsIsolated(candidate, {
        cwd: root,
        environment: { BUILDER_SITE_ROOT: path.join(root, 'elsewhere', 'builder-site') },
        repoRuntimeDataRoot: repoRuntime,
      }),
      /canonical|overlap/i,
    );
  }
  const activeSearch = path.join(root, 'runtime-data', 'search');
  await mkdir(activeSearch, { recursive: true });
  await assert.rejects(
    () => assertMirrorRootIsIsolated(activeSearch, {
      cwd: root,
      environment: { BUILDER_SITE_ROOT: path.join(root, 'elsewhere', 'builder-site') },
      repoRuntimeDataRoot: repoRuntime,
    }),
    /active content|canonical|overlap/i,
  );
  for (const [key, contentRoot] of [
    ['CONSULTATION_COLUMNS_DIR', path.join(root, 'active-columns')],
    ['BUILDER_FAQ_ROOT', path.join(root, 'active-faq')],
  ]) {
    await mkdir(contentRoot, { recursive: true });
    await assert.rejects(
      () => assertMirrorRootIsIsolated(contentRoot, {
        cwd: root,
        environment: {
          BUILDER_SITE_ROOT: path.join(root, 'elsewhere', 'builder-site'),
          [key]: contentRoot,
        },
        repoRuntimeDataRoot: repoRuntime,
      }),
      /active content|canonical|overlap/i,
    );
  }

  const sentinel = path.join(active, 'must-survive.json');
  await writeFile(sentinel, '{"canonical":true}');
  let listCalls = 0;
  const provider = {
    async list() {
      listCalls += 1;
      return { blobs: [], hasMore: false };
    },
    async get() {
      throw new Error('get must not run');
    },
  };
  for (const purge of [false, true]) {
    await assert.rejects(
      () => runMirror({
        args: ['--prefix=builder-site', `--out=${active}`, ...(purge ? ['--purge'] : [])],
        cwd: root,
        environment: { BUILDER_SITE_ROOT: active },
        provider,
      }),
      /canonical|overlap/i,
    );
  }
  assert.equal(listCalls, 0);
  assert.equal(await readFile(sentinel, 'utf8'), '{"canonical":true}');
});

test('purge binds the checked mirror inode and preserves a replacement root on namespace swap', async (t) => {
  const root = await fixtureRoot('pull-prod-purge-swap-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'mirror');
  const displaced = path.join(root, 'displaced-mirror');
  const active = path.join(root, 'active-builder-site');
  const repoRuntime = path.join(root, 'repo-runtime-data');
  await mkdir(active, { recursive: true });
  await mkdir(repoRuntime, { recursive: true });
  await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    environment: { BUILDER_SITE_ROOT: active },
    entries: {},
    repoRuntimeDataRoot: repoRuntime,
  });
  await writeFile(path.join(out, 'mirror.json'), '{"mirror":true}');
  await writeFile(path.join(active, 'canonical.json'), '{"canonical":true}');

  await assert.rejects(
    () => runMirror({
      args: ['--prefix=builder-site', `--out=${out}`, '--purge'],
      cwd: root,
      environment: { BUILDER_SITE_ROOT: active },
      entries: {},
      repoRuntimeDataRoot: repoRuntime,
      testHook: async ({ phase }) => {
        if (phase !== 'before-purge-rename') return;
        await rename(out, displaced);
        await rename(active, out);
      },
    }),
    /changed during safety validation/i,
  );
  assert.equal(await readFile(path.join(active, 'canonical.json'), 'utf8'), '{"canonical":true}');
  await assert.rejects(() => readFile(path.join(out, 'canonical.json')), { code: 'ENOENT' });
  assert.equal(await readFile(path.join(displaced, 'mirror.json'), 'utf8'), '{"mirror":true}');
});

test('purge still clears an isolated mirror root before the read-only pull', async (t) => {
  const root = await fixtureRoot('pull-prod-purge-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'isolated-mirror');
  const stale = path.join(out, 'stale.json');
  await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: {},
  });
  await writeFile(stale, '{"stale":true}');

  const run = await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`, '--purge'],
    cwd: root,
    entries: {},
  });
  assert.equal(run.result.totalWritten, 0);
  await assert.rejects(() => readFile(stale), { code: 'ENOENT' });
});

test('purge refuses an unowned directory and preserves every existing byte', async (t) => {
  const root = await fixtureRoot('pull-prod-unowned-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'not-a-mirror');
  const sentinel = path.join(out, 'keep.json');
  await mkdir(out, { recursive: true });
  await writeFile(sentinel, '{"keep":true}');

  for (const purge of [false, true]) {
    await assert.rejects(
      () => runMirror({
        args: ['--prefix=builder-site', `--out=${out}`, ...(purge ? ['--purge'] : [])],
        cwd: root,
        entries: {},
      }),
      /not an owned production mirror|refusing to claim/i,
    );
  }
  assert.equal(await readFile(sentinel, 'utf8'), '{"keep":true}');
});

test('concurrent mirror writers publish whole files and preserve unlisted competitor files', async (t) => {
  const root = await fixtureRoot('pull-prod-concurrent-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'mirror');
  await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: {},
  });
  await mkdir(path.join(out, 'competitor'), { recursive: true });
  const competitor = path.join(out, 'competitor/preserve.json');
  await writeFile(competitor, '{"owner":"competitor"}');
  const pathname = 'builder-site/site-a/site.json';
  const firstLeaseHeld = deferred();
  const releaseFirstLease = deferred();
  const secondLeaseAttempted = deferred();
  let secondListed = false;

  const first = runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: { [pathname]: JSON.stringify({ writer: 'a', body: 'A'.repeat(32_000) }) },
    testHook: async ({ phase }) => {
      if (phase !== 'after-root-lease') return;
      firstLeaseHeld.resolve();
      await releaseFirstLease.promise;
    },
  });
  await firstLeaseHeld.promise;

  const secondProvider = providerFor({
    [pathname]: JSON.stringify({ writer: 'b', body: 'B'.repeat(32_000) }),
  });
  const second = runMirror({
      args: ['--prefix=builder-site', `--out=${out}`],
      cwd: root,
      provider: {
        async list(options) {
          secondListed = true;
          return secondProvider.list(options);
        },
        get: secondProvider.get,
      },
      testHook: async ({ phase }) => {
        if (phase === 'before-root-lease') secondLeaseAttempted.resolve();
      },
  });
  await secondLeaseAttempted.promise;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(secondListed, false, 'the second writer must not list or write while the root lease is held');
  releaseFirstLease.resolve();
  await Promise.all([first, second]);

  const published = JSON.parse(await readFile(path.join(out, 'site-a/site.json'), 'utf8'));
  assert.ok(published.writer === 'a' || published.writer === 'b');
  assert.equal(published.body, (published.writer === 'a' ? 'A' : 'B').repeat(32_000));
  assert.equal(await readFile(competitor, 'utf8'), '{"owner":"competitor"}');
  const artifacts = await readdir(path.join(out, 'site-a'));
  assert.deepEqual(artifacts, ['site.json']);
});

test('purge waits for a live mirror root lease before replacing the mirror generation', async (t) => {
  const root = await fixtureRoot('pull-prod-purge-lease-');
  t.after(() => rm(root, { recursive: true, force: true }));
  const out = path.join(root, 'mirror');
  const pathname = 'builder-site/site-a/site.json';
  await runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: {},
  });

  const firstLeaseHeld = deferred();
  const releaseFirstLease = deferred();
  const purgeLeaseAttempted = deferred();
  let purgeListed = false;
  const first = runMirror({
    args: ['--prefix=builder-site', `--out=${out}`],
    cwd: root,
    entries: { [pathname]: '{"generation":"before-purge"}' },
    testHook: async ({ phase }) => {
      if (phase !== 'after-root-lease') return;
      firstLeaseHeld.resolve();
      await releaseFirstLease.promise;
    },
  });
  await firstLeaseHeld.promise;

  const purgeProvider = providerFor({ [pathname]: '{"generation":"after-purge"}' });
  const purge = runMirror({
    args: ['--prefix=builder-site', `--out=${out}`, '--purge'],
    cwd: root,
    provider: {
      async list(options) {
        purgeListed = true;
        return purgeProvider.list(options);
      },
      get: purgeProvider.get,
    },
    testHook: async ({ phase }) => {
      if (phase === 'before-root-lease') purgeLeaseAttempted.resolve();
    },
  });
  await purgeLeaseAttempted.promise;
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(purgeListed, false);
  releaseFirstLease.resolve();
  await Promise.all([first, purge]);

  assert.equal(
    await readFile(path.join(out, 'site-a/site.json'), 'utf8'),
    '{"generation":"after-purge"}',
  );
});

test('provider failures scrub the token and never invoke Blob mutation APIs', async (t) => {
  const root = await fixtureRoot('pull-prod-provider-');
  t.after(() => rm(root, { recursive: true, force: true }));
  let mutationCalls = 0;
  const provider = {
    async list() {
      return {
        blobs: [
          { pathname: `builder-site/safe-${TOKEN}/site.json` },
          { pathname: `builder-site/error-${TOKEN}/site.json` },
        ],
        hasMore: false,
      };
    },
    async get(pathname) {
      if (pathname.includes('/error-')) throw new Error(`provider rejected ${TOKEN}`);
      return response('{"safe":true}');
    },
    async put() {
      mutationCalls += 1;
    },
    async del() {
      mutationCalls += 1;
    },
    async copy() {
      mutationCalls += 1;
    },
  };

  const run = await runMirror({
    args: ['--prefix=builder-site', `--out=${path.join(root, 'mirror')}`],
    cwd: root,
    provider,
  });
  assert.equal(run.result.totalWritten, 1);
  assert.equal(run.result.totalSkipped, 1);
  assert.equal(mutationCalls, 0);
  assert.equal(run.stdout.includes(TOKEN), false);
  assert.equal(run.stderr.includes(TOKEN), false);
  assert.match(run.stderr, /<redacted>/);
});
