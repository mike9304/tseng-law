import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  appendErrorLog: vi.fn(),
  forwardToSentry: vi.fn(),
  makeErrorId: vi.fn(),
}));

vi.mock('../storage', () => ({
  appendErrorLog: mocks.appendErrorLog,
  makeErrorId: mocks.makeErrorId,
}));

vi.mock('../sentry-adapter', () => ({
  forwardToSentry: mocks.forwardToSentry,
}));

import { captureBuilderError } from '../capture';

describe('captureBuilderError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.makeErrorId.mockReturnValue('err_test');
    mocks.forwardToSentry.mockResolvedValue(false);
    mocks.appendErrorLog.mockResolvedValue(undefined);
  });

  it('persists captured errors with normalized severity and ids', async () => {
    const entry = await captureBuilderError({
      origin: 'builder',
      error: new Error('selection overlay crashed'),
      tags: { route: 'admin-builder' },
    });

    expect(entry.errorId).toBe('err_test');
    expect(entry.origin).toBe('builder');
    expect(entry.severity).toBe('error');
    expect(entry.message).toBe('selection overlay crashed');
    expect(entry.forwardedToSentry).toBe(false);
    expect(mocks.appendErrorLog).toHaveBeenCalledWith(expect.objectContaining({
      errorId: 'err_test',
      origin: 'builder',
      severity: 'error',
      message: 'selection overlay crashed',
      forwardedToSentry: false,
    }));
  });

  it('marks entries forwarded when Sentry accepts them', async () => {
    mocks.forwardToSentry.mockResolvedValue(true);

    const entry = await captureBuilderError({
      origin: 'site',
      severity: 'fatal',
      error: 'published runtime failed',
    });

    expect(entry.forwardedToSentry).toBe(true);
    expect(mocks.appendErrorLog).toHaveBeenCalledWith(expect.objectContaining({
      forwardedToSentry: true,
      severity: 'fatal',
    }));
  });

  it('does not throw if local persistence fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mocks.appendErrorLog.mockRejectedValue(new Error('disk full'));

    await expect(captureBuilderError({ origin: 'api', error: 'boom' })).resolves.toMatchObject({
      errorId: 'err_test',
      message: 'boom',
    });

    warn.mockRestore();
  });
});
