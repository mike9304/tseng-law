/**
 * Deploy-environment isolation for the Blob backend (code review R5).
 *
 * Vercel preview/branch deployments run with NODE_ENV === 'production' and
 * inherit BLOB_READ_WRITE_TOKEN, so every storage module's
 * "NODE_ENV === 'production' → blob" gate would let a preview deploy read and
 * overwrite production blob data. All 35+ storage modules key their backend
 * choice on BLOB_READ_WRITE_TOKEN being present, so stripping the token once
 * at server startup (src/instrumentation.ts) forces them all — including
 * future modules that copy the same gate pattern — onto the file backend.
 *
 * Escape hatch: set BUILDER_USE_BLOB_IN_PREVIEW=1 on a deployment that has a
 * dedicated non-production blob store/token.
 */

export interface BlobEnvDecision {
  strip: boolean;
  reason: string;
}

export function decideBlobTokenStrip(env: {
  VERCEL_ENV?: string;
  BUILDER_USE_BLOB_IN_PREVIEW?: string;
  BLOB_READ_WRITE_TOKEN?: string;
}): BlobEnvDecision {
  const vercelEnv = env.VERCEL_ENV?.trim().toLowerCase() ?? '';
  if (!env.BLOB_READ_WRITE_TOKEN) {
    return { strip: false, reason: 'no blob token configured' };
  }
  if (!vercelEnv || vercelEnv === 'production') {
    return { strip: false, reason: 'not a non-production Vercel deploy' };
  }
  if (env.BUILDER_USE_BLOB_IN_PREVIEW === '1') {
    return { strip: false, reason: `BUILDER_USE_BLOB_IN_PREVIEW=1 opt-in on ${vercelEnv}` };
  }
  return {
    strip: true,
    reason: `VERCEL_ENV=${vercelEnv} must not touch production blob data`,
  };
}

function currentBlobEnv() {
  return {
    VERCEL_ENV: process.env.VERCEL_ENV,
    BUILDER_USE_BLOB_IN_PREVIEW: process.env.BUILDER_USE_BLOB_IN_PREVIEW,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  };
}

/** True when this process is a non-production Vercel deploy without blob opt-in. */
export function isBlobBlockedForDeployEnv(): boolean {
  return decideBlobTokenStrip(currentBlobEnv()).strip;
}

/**
 * Strip the blob token so every storage module falls back to the file
 * backend. Idempotent; call once at server startup.
 */
export function enforceBlobEnvIsolation(): void {
  const decision = decideBlobTokenStrip(currentBlobEnv());
  if (!decision.strip) return;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  console.warn(`[blob-env-guard] BLOB_READ_WRITE_TOKEN stripped: ${decision.reason}`);
}
