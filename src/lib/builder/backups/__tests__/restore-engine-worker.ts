import {
  _setRestoreLeaseOptionsForTests,
  restoreBackup,
} from '../restore-engine';
import type { LocalJsonLeaseHook } from '@/lib/builder/storage/local-json-write-lease.mjs';

type WorkerMessage =
  | {
      type: 'start';
      backupId: string;
      crashStage?: 'after-target-detach' | 'after-candidate-link';
      lockStaleMs?: number;
    }
  | { type: 'shutdown' };

function send(message: Record<string, unknown>): void {
  if (typeof process.send === 'function') process.send(message);
}

process.on('message', async (message: WorkerMessage) => {
  if (message.type === 'shutdown') {
    process.exit(0);
  }
  if (message.type !== 'start') return;

  try {
    _setRestoreLeaseOptionsForTests({
      acquireTimeoutMs: 10_000,
      lockStaleMs: message.lockStaleMs ?? 30_000,
      retryDelayMs: 5,
      testHook: message.crashStage
        ? async (event: Parameters<LocalJsonLeaseHook>[0]) => {
            if (event.stage !== message.crashStage) return;
            send({ type: 'paused', backupId: message.backupId, stage: event.stage });
            await new Promise<never>(() => undefined);
          }
        : undefined,
    });
    const result = await restoreBackup(message.backupId);
    send({ type: 'result', backupId: message.backupId, result });
  } catch (error) {
    send({
      type: 'error',
      backupId: message.backupId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

send({ type: 'booted', pid: process.pid });
