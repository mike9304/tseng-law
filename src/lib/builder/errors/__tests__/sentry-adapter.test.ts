import { afterEach, describe, expect, it, vi } from 'vitest';
import { forwardToSentry } from '../sentry-adapter';
import type { CapturedError } from '../types';

const baseEntry: CapturedError = {
  errorId: 'err_20260511_deadbeef',
  origin: 'builder',
  severity: 'error',
  message: 'builder crashed',
  stack: 'Error: builder crashed',
  tags: { route: 'admin-builder' },
  extra: { locale: 'ko' },
  capturedAt: '2026-05-11T00:00:00.000Z',
  forwardedToSentry: false,
};

describe('forwardToSentry', () => {
  const originalDsn = process.env.SENTRY_DSN;

  afterEach(() => {
    if (originalDsn === undefined) {
      delete process.env.SENTRY_DSN;
    } else {
      process.env.SENTRY_DSN = originalDsn;
    }
    vi.unstubAllGlobals();
  });

  it('is a no-op when SENTRY_DSN is missing or malformed', async () => {
    delete process.env.SENTRY_DSN;
    await expect(forwardToSentry(baseEntry)).resolves.toBe(false);

    process.env.SENTRY_DSN = 'not-a-dsn';
    await expect(forwardToSentry(baseEntry)).resolves.toBe(false);
  });

  it('posts normalized events to the Sentry store endpoint', async () => {
    process.env.SENTRY_DSN = 'https://public_key@sentry.example/12345';
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(forwardToSentry(baseEntry)).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://sentry.example/api/12345/store/');
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Sentry-Auth': expect.stringContaining('sentry_key=public_key'),
    });
    expect(JSON.parse(String(init.body))).toMatchObject({
      level: 'error',
      platform: 'javascript',
      tags: { origin: 'builder', route: 'admin-builder' },
      extra: { locale: 'ko' },
    });
  });
});
