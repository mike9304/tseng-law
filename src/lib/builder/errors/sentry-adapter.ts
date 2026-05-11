import type { CapturedError } from './types';

/**
 * PR #16 — Optional Sentry forwarder.
 *
 * Calls Sentry's HTTP store API directly via `SENTRY_DSN` so we don't pull
 * the `@sentry/nextjs` package into the bundle. Returns `true` when the DSN
 * is set and the network call succeeds. When the DSN is missing or the
 * call fails, returns `false` and the local error log is the sole record.
 *
 * Sentry's DSN format: `https://<key>@<host>/<project_id>`. We post to
 * `https://<host>/api/<project_id>/store/` with `X-Sentry-Auth` header.
 */

interface ParsedDsn {
  host: string;
  publicKey: string;
  projectId: string;
}

function parseDsn(dsn: string): ParsedDsn | null {
  try {
    const url = new URL(dsn);
    const publicKey = url.username;
    const projectId = url.pathname.replace(/^\//, '');
    if (!publicKey || !projectId) return null;
    return { host: url.host, publicKey, projectId };
  } catch {
    return null;
  }
}

const SEVERITY_TO_LEVEL: Record<CapturedError['severity'], string> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
  fatal: 'fatal',
};

export async function forwardToSentry(entry: CapturedError): Promise<boolean> {
  const dsn = process.env.SENTRY_DSN ?? '';
  if (!dsn) return false;
  const parsed = parseDsn(dsn);
  if (!parsed) return false;

  const payload = {
    event_id: entry.errorId.replace(/[^a-z0-9]/gi, '').slice(0, 32),
    timestamp: entry.capturedAt,
    level: SEVERITY_TO_LEVEL[entry.severity],
    platform: 'javascript',
    environment: process.env.NODE_ENV ?? 'development',
    server_name: process.env.VERCEL_URL ?? 'localhost',
    tags: { origin: entry.origin, ...entry.tags },
    extra: entry.extra,
    exception: {
      values: [
        {
          type: 'Error',
          value: entry.message,
          stacktrace: entry.stack ? { frames: [] } : undefined,
        },
      ],
    },
    message: { formatted: entry.message },
  };

  try {
    const res = await fetch(`https://${parsed.host}/api/${parsed.projectId}/store/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': [
          'Sentry sentry_version=7',
          `sentry_client=tseng-law/1.0`,
          `sentry_key=${parsed.publicKey}`,
        ].join(', '),
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
