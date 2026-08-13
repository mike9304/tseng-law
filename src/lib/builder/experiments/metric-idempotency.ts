import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  BlobPreconditionFailedError,
  del,
  put,
} from '@vercel/blob';

const BLOB_PREFIX = 'experiments/idempotency/';
let localRootOverride: string | null = null;

export interface ExperimentMetricClaimInput {
  experimentId: string;
  kind: 'exposure' | 'conversion';
  sessionId: string;
  scope?: string;
}

export interface ExperimentMetricClaim {
  claimed: boolean;
  release(): Promise<void>;
}

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function localRoot(): string {
  return localRootOverride
    ?? path.join(process.cwd(), 'runtime-data', 'experiments', 'idempotency');
}

function markerName(input: ExperimentMetricClaimInput): string {
  const digest = createHash('sha256')
    .update([
      input.kind,
      input.experimentId,
      input.sessionId,
      input.scope ?? '',
    ].join('\0'))
    .digest('hex');
  return `${digest}.marker`;
}

function isAlreadyClaimedBlobError(error: unknown): boolean {
  return (
    error instanceof BlobPreconditionFailedError
    || (
      Boolean(error)
      && typeof error === 'object'
      && (error as { name?: unknown }).name === 'BlobPreconditionFailedError'
    )
  );
}

export function __setExperimentMetricClaimRootForTests(root: string | null): void {
  localRootOverride = root;
}

export async function claimExperimentMetricOnce(
  input: ExperimentMetricClaimInput,
): Promise<ExperimentMetricClaim> {
  const name = markerName(input);

  if (backend() === 'blob') {
    const pathname = `${BLOB_PREFIX}${name}`;
    try {
      await put(pathname, '1', {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: 'text/plain',
      });
    } catch (error) {
      if (isAlreadyClaimedBlobError(error)) {
        return { claimed: false, release: async () => undefined };
      }
      throw error;
    }
    return {
      claimed: true,
      release: async () => {
        await del(pathname);
      },
    };
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is required for durable experiment metric claims in production.',
    );
  }

  const root = localRoot();
  const pathname = path.join(root, name);
  await fs.mkdir(root, { recursive: true, mode: 0o700 });
  try {
    await fs.writeFile(pathname, '1', { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  } catch (error) {
    if (
      Boolean(error)
      && typeof error === 'object'
      && (error as { code?: unknown }).code === 'EEXIST'
    ) {
      return { claimed: false, release: async () => undefined };
    }
    throw error;
  }
  return {
    claimed: true,
    release: async () => {
      await fs.unlink(pathname).catch((error: unknown) => {
        if (
          !error
          || typeof error !== 'object'
          || (error as { code?: unknown }).code !== 'ENOENT'
        ) {
          throw error;
        }
      });
    },
  };
}
