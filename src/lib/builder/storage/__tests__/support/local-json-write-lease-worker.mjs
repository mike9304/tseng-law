import process from 'node:process';
import {
  acquireLocalJsonWriteLease,
  atomicWriteLocalJson,
  withLocalJsonWriteLeases,
} from '../../local-json-write-lease.mjs';

const mode = process.env.LOCAL_JSON_WORKER_MODE;
const targetPath = process.env.LOCAL_JSON_TARGET;
const allowedRoot = process.env.LOCAL_JSON_ROOT;

if (!mode || !targetPath || !allowedRoot) {
  throw new Error('local JSON worker configuration is missing');
}

const send = (message) => {
  if (process.send) process.send(message);
};

const staleMs = Number(process.env.LOCAL_JSON_STALE_MS ?? 0);
const acquireTimeoutMs = Number(process.env.LOCAL_JSON_ACQUIRE_TIMEOUT_MS ?? 4_000);

const CRASH_STAGES = {
  'crash-after-detach': 'after-target-detach',
  'crash-after-candidate-link': 'after-candidate-link',
  'crash-after-remove-detach': 'after-remove-detach',
};

function buildCrashHook(currentMode) {
  const expectedStage = CRASH_STAGES[currentMode];
  if (!expectedStage) return undefined;
  return async ({ stage }) => {
    if (stage !== expectedStage) return;
    send({ type: 'checkpoint', stage });
    await new Promise(() => {});
  };
}

if (mode === 'race-write') {
  const bytes = process.env.LOCAL_JSON_BYTES ?? `{"owner":${process.pid}}`;
  try {
    const result = await atomicWriteLocalJson(targetPath, bytes, {
      allowedRoot,
      expectedGeneration: null,
      acquireTimeoutMs: 8_000,
    });
    send({ type: 'race-result', ok: true, bytes: result.after.bytes.toString() });
  } catch (error) {
    send({ type: 'race-result', ok: false, name: error?.name, code: error?.code });
  }
} else if (mode === 'multi-target') {
  const rawTargets = JSON.parse(process.env.LOCAL_JSON_TARGETS ?? '[]');
  if (!Array.isArray(rawTargets) || rawTargets.length === 0) {
    throw new Error('multi-target mode requires LOCAL_JSON_TARGETS');
  }
  await withLocalJsonWriteLeases(rawTargets, {
    allowedRoot,
    acquireTimeoutMs: 8_000,
    lockStaleMs: staleMs,
  }, async (leases) => {
    send({ type: 'acquired', order: leases.map((lease) => lease.targetPath) });
    await new Promise((resolve) => {
      const onMessage = (message) => {
        if (message?.type === 'release') {
          process.off('message', onMessage);
          resolve();
        }
      };
      process.on('message', onMessage);
    });
  });
  send({ type: 'done' });
} else {
  const lease = await acquireLocalJsonWriteLease(targetPath, {
    allowedRoot,
    lockStaleMs: staleMs,
    acquireTimeoutMs,
    testHook: buildCrashHook(mode),
  });

  send({ type: 'acquired' });

  if (mode === 'hold') {
    await new Promise(() => {});
  } else if (mode === 'crash-after-detach' || mode === 'crash-after-candidate-link') {
    await lease.atomicWrite(process.env.LOCAL_JSON_BYTES ?? '{"worker":true}');
  } else if (mode === 'crash-after-remove-detach') {
    await lease.atomicRemove();
  } else {
    throw new Error(`unknown local JSON worker mode: ${mode}`);
  }
}
