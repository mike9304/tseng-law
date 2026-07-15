import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import {
  lstat,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  LocalJsonWriteConflictError,
  LocalJsonWriteUnavailableError,
  acquireLocalJsonWriteLease,
  atomicRemoveLocalJson,
  atomicWriteLocalJson,
  readLocalJsonFile,
  withLocalJsonWriteLease,
  withLocalJsonWriteLeases,
} from '../local-json-write-lease.mjs';

process.env.NODE_ENV = 'test';

const workerPath = fileURLToPath(new URL('./support/local-json-write-lease-worker.mjs', import.meta.url));

async function fixture(t, prefix = 'local-json-lease-') {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), prefix)));
  t.after(() => rm(root, { recursive: true, force: true }));
  return { root, target: path.join(root, 'site.json') };
}

async function artifacts(target) {
  const prefix = `.${path.basename(target)}.`;
  return (await readdir(path.dirname(target))).filter((name) => name.startsWith(prefix));
}

function startWorker(root, target, mode) {
  return fork(workerPath, [], {
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
    env: {
      ...process.env,
      NODE_ENV: 'test',
      LOCAL_JSON_WORKER_MODE: mode,
      LOCAL_JSON_ROOT: root,
      LOCAL_JSON_TARGET: target,
      LOCAL_JSON_STALE_MS: '0',
      LOCAL_JSON_BYTES: '{"worker":"new"}',
    },
  });
}

function startRaceWorker(root, target, index) {
  return fork(workerPath, [], {
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
    env: {
      ...process.env,
      NODE_ENV: 'test',
      LOCAL_JSON_WORKER_MODE: 'race-write',
      LOCAL_JSON_ROOT: root,
      LOCAL_JSON_TARGET: target,
      LOCAL_JSON_BYTES: `{"winner":${index}}`,
    },
  });
}

function startMultiTargetWorker(root, targets) {
  return fork(workerPath, [], {
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
    env: {
      ...process.env,
      NODE_ENV: 'test',
      LOCAL_JSON_WORKER_MODE: 'multi-target',
      LOCAL_JSON_ROOT: root,
      LOCAL_JSON_TARGET: targets[0],
      LOCAL_JSON_TARGETS: JSON.stringify(targets),
    },
  });
}

function waitForMessage(child, predicate, timeoutMs = 5_000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('worker message timed out')), timeoutMs);
    const onMessage = (message) => {
      if (!predicate(message)) return;
      clearTimeout(timer);
      child.off('message', onMessage);
      resolve(message);
    };
    child.on('message', onMessage);
    child.once('exit', (code, signal) => {
      clearTimeout(timer);
      reject(new Error(`worker exited before checkpoint: ${code}/${signal}`));
    });
  });
}

function waitForEitherMessage(children, predicate, timeoutMs = 5_000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const listeners = [];
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      for (const { child, onMessage } of listeners) child.off('message', onMessage);
      reject(new Error('worker message timed out'));
    }, timeoutMs);
    for (const child of children) {
      const onMessage = (message) => {
        if (settled || !predicate(message)) return;
        settled = true;
        clearTimeout(timer);
        for (const entry of listeners) entry.child.off('message', entry.onMessage);
        resolve({ child, message });
      };
      child.on('message', onMessage);
      listeners.push({ child, onMessage });
    }
    for (const child of children) {
      child.once('exit', (code, signal) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new Error(`worker exited before checkpoint: ${code}/${signal}`));
      });
    }
  });
}

function waitForExit(child) {
  return new Promise((resolve) => child.once('exit', (code, signal) => resolve({ code, signal })));
}

test('atomic write/read/remove preserves complete bytes and leaves no control artifacts', async (t) => {
  const { root, target } = await fixture(t);
  const created = await atomicWriteLocalJson(target, '{"version":1}', {
    allowedRoot: root,
    expectedGeneration: null,
  });
  assert.equal(created.before.kind, 'missing');
  assert.equal(created.after.bytes.toString(), '{"version":1}');

  const chained = await atomicWriteLocalJson(target, '{"version":2}', {
    allowedRoot: root,
    expectedGeneration: created.after.generation,
  });
  assert.equal(chained.after.bytes.toString(), '{"version":2}');

  const read = await readLocalJsonFile(target, { allowedRoot: root });
  assert.equal(read.kind, 'present');
  assert.equal(read.bytes.toString(), '{"version":2}');

  const removed = await atomicRemoveLocalJson(target, {
    allowedRoot: root,
    expectedGeneration: read.generation,
  });
  assert.equal(removed.removed, true);
  assert.equal((await readLocalJsonFile(target, { allowedRoot: root })).kind, 'missing');
  assert.deepEqual(await artifacts(target), []);
});

test('a parent created after the missing-parent probe is read instead of reported missing', async (t) => {
  const { root } = await fixture(t);
  const parent = path.join(root, 'late');
  const target = path.join(parent, 'site.json');
  let injected = false;
  const read = await readLocalJsonFile(target, {
    allowedRoot: root,
    testHook: async ({ stage }) => {
      if (stage !== 'after-missing-parent-probe' || injected) return;
      injected = true;
      await mkdir(parent);
      await writeFile(target, '{"committed":true}');
    },
  });
  assert.equal(injected, true);
  assert.equal(read.kind, 'present');
  assert.equal(read.bytes.toString(), '{"committed":true}');
});

test('a live owner is never reclaimed by age alone', async (t) => {
  const { root, target } = await fixture(t);
  const first = await acquireLocalJsonWriteLease(target, { allowedRoot: root, lockStaleMs: 0 });
  t.after(() => first.release());
  await assert.rejects(
    () => acquireLocalJsonWriteLease(target, {
      allowedRoot: root,
      lockStaleMs: 0,
      acquireTimeoutMs: 40,
      retryDelayMs: 2,
    }),
    LocalJsonWriteUnavailableError,
  );
});

test('a SIGKILLed same-host owner is reclaimed using pid liveness', async (t) => {
  const { root, target } = await fixture(t);
  const child = startWorker(root, target, 'hold');
  t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); });
  await waitForMessage(child, (message) => message?.type === 'acquired');
  child.kill('SIGKILL');
  await waitForExit(child);

  const lease = await acquireLocalJsonWriteLease(target, {
    allowedRoot: root,
    lockStaleMs: 0,
    acquireTimeoutMs: 2_000,
  });
  await lease.release();
  assert.deepEqual(await artifacts(target), []);
});

test('a writer killed after detach recovers known old bytes before exposing missing', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"old"}');
  const child = startWorker(root, target, 'crash-after-detach');
  t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); });
  await waitForMessage(child, (message) => message?.type === 'checkpoint');
  child.kill('SIGKILL');
  await waitForExit(child);

  const recovered = await readLocalJsonFile(target, {
    allowedRoot: root,
    lockStaleMs: 0,
    acquireTimeoutMs: 2_000,
  });
  assert.equal(recovered.kind, 'present');
  assert.equal(recovered.bytes.toString(), '{"owner":"old"}');
  assert.deepEqual(await artifacts(target), []);
});

test('a writer killed after candidate link recovers a verified committed value', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"old"}');
  const child = startWorker(root, target, 'crash-after-candidate-link');
  t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); });
  await waitForMessage(child, (message) => message?.type === 'checkpoint');
  child.kill('SIGKILL');
  await waitForExit(child);

  const recovered = await readLocalJsonFile(target, {
    allowedRoot: root,
    lockStaleMs: 0,
    acquireTimeoutMs: 2_000,
  });
  assert.equal(recovered.kind, 'present');
  assert.equal(recovered.bytes.toString(), '{"worker":"new"}');
  assert.deepEqual(await artifacts(target), []);
});

test('corrupt and foreign-host lock files fail closed without being removed', async (t) => {
  const corrupt = await fixture(t, 'local-json-corrupt-lock-');
  const corruptLock = path.join(corrupt.root, '.site.json.writer.lock');
  await writeFile(corruptLock, '{not-json');
  await assert.rejects(
    () => acquireLocalJsonWriteLease(corrupt.target, {
      allowedRoot: corrupt.root,
      lockStaleMs: 0,
      acquireTimeoutMs: 20,
    }),
    LocalJsonWriteUnavailableError,
  );
  assert.equal(await readFile(corruptLock, 'utf8'), '{not-json');

  const foreign = await fixture(t, 'local-json-foreign-lock-');
  const foreignLock = path.join(foreign.root, '.site.json.writer.lock');
  const envelope = `${JSON.stringify({
    format: 'local-json-writer-lock-v1',
    targetPath: foreign.target,
    nonce: 'a'.repeat(32),
    hostname: 'foreign-host.invalid',
    pid: 999_999,
    createdAtMs: 0,
  })}\n`;
  await writeFile(foreignLock, envelope);
  await assert.rejects(
    () => acquireLocalJsonWriteLease(foreign.target, {
      allowedRoot: foreign.root,
      lockStaleMs: 0,
      acquireTimeoutMs: 30,
      retryDelayMs: 2,
    }),
    LocalJsonWriteUnavailableError,
  );
  assert.equal(await readFile(foreignLock, 'utf8'), envelope);
});

test('a corrupt crash manifest preserves the target and requires operator review', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"keep"}');
  const manifest = path.join(root, `.site.json.txn-${'b'.repeat(32)}.manifest`);
  await writeFile(manifest, '{broken');
  await assert.rejects(
    () => acquireLocalJsonWriteLease(target, { allowedRoot: root }),
    LocalJsonWriteUnavailableError,
  );
  assert.equal(await readFile(target, 'utf8'), '{"owner":"keep"}');
  assert.equal(await readFile(manifest, 'utf8'), '{broken');
  assert.equal((await readdir(root)).includes('.site.json.writer.lock'), false);
});

test('orphan transaction artifacts without a manifest fail closed', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"keep"}');
  const orphan = path.join(root, `.site.json.txn-${'c'.repeat(32)}.candidate`);
  await writeFile(orphan, '{"owner":"orphan"}');
  await assert.rejects(
    () => acquireLocalJsonWriteLease(target, { allowedRoot: root }),
    LocalJsonWriteUnavailableError,
  );
  assert.equal(await readFile(target, 'utf8'), '{"owner":"keep"}');
  assert.equal(await readFile(orphan, 'utf8'), '{"owner":"orphan"}');
});

test('same-inode final mutation is rejected and competitor bytes are preserved', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"old"}');
  await assert.rejects(
    () => withLocalJsonWriteLease(
      target,
      {
        allowedRoot: root,
        testHook: async ({ stage, nonce }) => {
          if (stage !== 'after-target-detach') return;
          await writeFile(path.join(root, `.site.json.txn-${nonce}.detached`), '{"owner":"competitor"}');
        },
      },
      (lease) => lease.atomicWrite('{"owner":"candidate"}'),
    ),
    LocalJsonWriteConflictError,
  );
  assert.equal(await readFile(target, 'utf8'), '{"owner":"competitor"}');
});

test('EEXIST at the conditional install preserves a competitor target', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"old"}');
  await assert.rejects(
    () => withLocalJsonWriteLease(
      target,
      {
        allowedRoot: root,
        testHook: async ({ stage }) => {
          if (stage === 'after-target-detach') await writeFile(target, '{"owner":"competitor"}');
        },
      },
      (lease) => lease.atomicWrite('{"owner":"candidate"}'),
    ),
    LocalJsonWriteConflictError,
  );
  assert.equal(await readFile(target, 'utf8'), '{"owner":"competitor"}');
});

test('multi-target acquisition is UTF-8 bytewise sorted and releases in full', async (t) => {
  const { root } = await fixture(t);
  const targets = ['\u{10000}.json', '\uE000.json', 'a.json'].map((name) => path.join(root, name));
  const expected = [...targets].sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
  const released = [];
  await withLocalJsonWriteLeases([...targets].reverse(), { allowedRoot: root }, async (leases) => {
    assert.deepEqual(leases.map((lease) => lease.targetPath), expected);
    for (const lease of leases) {
      const originalRelease = lease.release.bind(lease);
      lease.release = async () => {
        released.push(lease.targetPath);
        await originalRelease();
      };
    }
  });
  assert.deepEqual(released, [...expected].reverse());
  assert.deepEqual((await readdir(root)).filter((name) => name.includes('.writer.')), []);
});

test('symlink parents cannot redirect a write outside the allowed root', async (t) => {
  const { root } = await fixture(t);
  const outside = await realpath(await mkdtemp(path.join(os.tmpdir(), 'local-json-outside-')));
  t.after(() => rm(outside, { recursive: true, force: true }));
  await symlink(outside, path.join(root, 'linked'), 'dir');
  await assert.rejects(
    () => atomicWriteLocalJson(path.join(root, 'linked', 'site.json'), '{}', { allowedRoot: root }),
  );
  await assert.rejects(() => lstat(path.join(outside, 'site.json')), { code: 'ENOENT' });
});

test('a SIGKILLed remove after detach converges to the intended removed outcome', async (t) => {
  const { root, target } = await fixture(t);
  await writeFile(target, '{"owner":"old"}');
  const child = startWorker(root, target, 'crash-after-remove-detach');
  t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); });
  await waitForMessage(child, (message) => message?.type === 'checkpoint');
  child.kill('SIGKILL');
  await waitForExit(child);

  const lease = await acquireLocalJsonWriteLease(target, {
    allowedRoot: root,
    lockStaleMs: 0,
    acquireTimeoutMs: 2_000,
  });
  await lease.release();

  assert.equal((await readLocalJsonFile(target, { allowedRoot: root })).kind, 'missing');
  assert.deepEqual(await artifacts(target), []);
});

test('an N>=3 independent-owner race on one target produces exactly one CAS winner', async (t) => {
  const { root, target } = await fixture(t);
  const ownerCount = 4;
  const children = [];
  for (let index = 0; index < ownerCount; index += 1) {
    children.push(startRaceWorker(root, target, index));
  }
  t.after(() => {
    for (const child of children) {
      if (child.exitCode === null) child.kill('SIGKILL');
    }
  });

  const results = await Promise.all(
    children.map((child) => waitForMessage(
      child,
      (message) => message?.type === 'race-result',
      10_000,
    )),
  );

  const winners = results.filter((result) => result.ok);
  const losers = results.filter((result) => !result.ok);

  assert.equal(winners.length, 1, 'exactly one CAS winner');
  assert.equal(losers.length, ownerCount - 1, 'all other owners lose');
  for (const loser of losers) {
    assert.equal(loser.name, 'LocalJsonWriteConflictError');
  }

  const final = await readLocalJsonFile(target, { allowedRoot: root });
  assert.equal(final.kind, 'present');
  assert.equal(final.bytes.toString(), winners[0].bytes);
  assert.deepEqual(await artifacts(target), []);
});

test('two independent processes requesting the same targets in reverse order do not deadlock', async (t) => {
  const { root } = await fixture(t);
  const alpha = path.join(root, 'alpha.json');
  const omega = path.join(root, 'omega.json');
  const expectedOrder = [alpha, omega]
    .sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));

  const forwardChild = startMultiTargetWorker(root, [alpha, omega]);
  const reverseChild = startMultiTargetWorker(root, [omega, alpha]);
  t.after(() => {
    if (forwardChild.exitCode === null) forwardChild.kill('SIGKILL');
    if (reverseChild.exitCode === null) reverseChild.kill('SIGKILL');
  });

  const eventTimeout = 8_000;

  const firstAcquired = await waitForEitherMessage(
    [forwardChild, reverseChild],
    (message) => message?.type === 'acquired',
    eventTimeout,
  );

  const firstChild = firstAcquired.child;
  const secondChild = firstChild === forwardChild ? reverseChild : forwardChild;

  const firstDone = waitForMessage(firstChild, (message) => message?.type === 'done', eventTimeout);
  firstChild.send({ type: 'release' });

  const secondAcquired = await waitForMessage(
    secondChild,
    (message) => message?.type === 'acquired',
    eventTimeout,
  );

  assert.deepEqual(firstAcquired.message.order, expectedOrder);
  assert.deepEqual(secondAcquired.order, expectedOrder);

  await firstDone;
  secondChild.send({ type: 'release' });
  await waitForMessage(secondChild, (message) => message?.type === 'done', eventTimeout);

  assert.deepEqual(
    (await readdir(root)).filter((name) => name.includes('.writer.')),
    [],
  );
});
