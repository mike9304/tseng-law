import {
  PageCanvasCasConflictError,
  updatePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import { PersistenceConflictError } from '@/lib/builder/storage/persistence-errors';

interface StartRoundMessage {
  type: 'start-round';
  round: number;
  siteId: string;
  pageId: string;
  writerMarker: string;
}

interface ReleaseRoundMessage {
  type: 'release-round';
  round: number;
}

interface ShutdownMessage {
  type: 'shutdown';
}

type ParentMessage = StartRoundMessage | ReleaseRoundMessage | ShutdownMessage;

let activeRound: number | null = null;
let releaseRound: (() => void) | null = null;

function send(message: Record<string, unknown>): void {
  if (!process.send) throw new Error('page canvas CAS race worker requires IPC');
  process.send({ ...message, pid: process.pid });
}

function savedAtFor(round: number, writerMarker: string): string {
  const writerOffset = writerMarker.endsWith('-a') ? 1 : 2;
  return new Date(Date.UTC(2026, 6, 13, 4, round, writerOffset)).toISOString();
}

async function runRound(message: StartRoundMessage): Promise<void> {
  if (activeRound !== null) {
    send({
      type: 'unexpected',
      round: message.round,
      errorName: 'WorkerBusyError',
      errorMessage: 'worker received overlapping rounds',
    });
    return;
  }

  activeRound = message.round;
  let updaterCalls = 0;
  let observedRevision: number | null = null;
  let releaseTimeout: ReturnType<typeof setTimeout> | null = null;
  const releasePromise = new Promise<void>((resolve, reject) => {
    releaseRound = resolve;
    releaseTimeout = setTimeout(
      () => reject(new Error('release barrier timed out')),
      15_000,
    );
  });

  try {
    const committed = await updatePageCanvasRecord(
      message.siteId,
      message.pageId,
      'draft',
      async (state) => {
        updaterCalls += 1;
        observedRevision = state?.record.revision ?? null;
        if (!state?.isEnvelope || observedRevision !== 7) {
          throw new Error(`expected envelope revision 7, received ${String(observedRevision)}`);
        }
        send({
          type: 'ready',
          round: message.round,
          writerMarker: message.writerMarker,
          observedRevision,
          updaterCalls,
        });
        await releasePromise;
        return {
          revision: 8,
          savedAt: savedAtFor(message.round, message.writerMarker),
          updatedBy: message.writerMarker,
          document: {
            ...state.record.document,
            updatedAt: savedAtFor(message.round, message.writerMarker),
            updatedBy: message.writerMarker,
          },
        };
      },
    );

    send({
      type: 'result',
      round: message.round,
      status: 'success',
      writerMarker: message.writerMarker,
      observedRevision,
      updaterCalls,
      revision: committed.revision,
      savedAt: committed.savedAt,
    });
  } catch (error) {
    const serialized = JSON.stringify(error);
    if (error instanceof PageCanvasCasConflictError) {
      send({
        type: 'result',
        round: message.round,
        status: 'conflict',
        writerMarker: message.writerMarker,
        observedRevision,
        updaterCalls,
        isPageCanvasConflict: true,
        isPersistenceConflict: error instanceof PersistenceConflictError,
        code: error.code,
        current: error.current,
        opaqueVersionExposed: serialized.includes('file-v1:'),
      });
    } else {
      send({
        type: 'unexpected',
        round: message.round,
        writerMarker: message.writerMarker,
        observedRevision,
        updaterCalls,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: error instanceof Error ? error.message : 'non-error rejection',
      });
    }
  } finally {
    if (releaseTimeout) clearTimeout(releaseTimeout);
    releaseRound = null;
    activeRound = null;
  }
}

process.on('message', (message: ParentMessage) => {
  if (!message || typeof message !== 'object') return;
  if (message.type === 'release-round') {
    if (message.round === activeRound) releaseRound?.();
    return;
  }
  if (message.type === 'shutdown') {
    if (activeRound === null) process.exit(0);
    return;
  }
  if (message.type === 'start-round') {
    void runRound(message);
  }
});

send({ type: 'booted' });

