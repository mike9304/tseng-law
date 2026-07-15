import { describe, expect, it, vi } from 'vitest';
import {
  resolveCampaignSendAlert,
  runSendCampaign,
  type CampaignsAdminCopy,
} from '../CampaignsAdmin';

/**
 * The send route keeps HTTP 200 even when delivery failed; the UI must branch on
 * the JSON body (ok + counts), not on res.ok alone. These tests exercise the
 * real selection logic with mocked fetch/alert/prompt/confirm — not source
 * string matching — so a regression that shows the success message for a
 * failed/partial body is caught.
 */

function jsonResponse(body: unknown, ok = true): Response {
  return new Response(JSON.stringify(body), {
    status: ok ? 200 : 500,
    headers: { 'content-type': 'application/json' },
  });
}

function makeDeps(overrides: Partial<Parameters<typeof runSendCampaign>[0]> = {}) {
  const alerts: string[] = [];
  return {
    alerts,
    deps: {
      mode: 'batch' as const,
      campaignId: 'cmp-1',
      locale: 'en' as const,
      text: undefined as unknown as CampaignsAdminCopy,
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true })),
      promptImpl: vi.fn(() => 'x@y.z'),
      confirmImpl: vi.fn(() => true),
      alertImpl: vi.fn((message: string) => {
        alerts.push(message);
      }),
      ...overrides,
    },
  };
}

describe('resolveCampaignSendAlert — body-semantic branching', () => {
  const text: CampaignsAdminCopy = {
    sendFailure: 'SEND-FAIL',
    testSuccess: 'TEST-OK',
    testFailure: 'TEST-BAD',
    batchSuccess: (s: number, r: number) => `SUCCESS:${s}/${r}`,
    batchPartial: (s: number, f: number, r: number) => `PARTIAL:${s}/${f}/${r}`,
    batchAllFailed: (f: number, r: number) => `ALLFAILED:${f}/${r}`,
  } as unknown as CampaignsAdminCopy;

  it('batch ok=true => success message', () => {
    expect(
      resolveCampaignSendAlert('batch', true, { ok: true, succeeded: 5, failed: 0, remaining: 0 }, text),
    ).toBe('SUCCESS:5/0');
  });

  it('batch ok=false with successes => partial message + error detail', () => {
    expect(
      resolveCampaignSendAlert(
        'batch',
        true,
        { ok: false, succeeded: 3, failed: 1, remaining: 0, error: 'detail' },
        text,
      ),
    ).toBe('PARTIAL:3/1/0\ndetail');
  });

  it('batch ok=false with zero successes => all-failed message', () => {
    expect(
      resolveCampaignSendAlert('batch', true, { ok: false, succeeded: 0, failed: 4, remaining: 0 }, text),
    ).toBe('ALLFAILED:4/0');
  });

  it('never shows the success message when payload.ok === false even with HTTP 200', () => {
    const msg = resolveCampaignSendAlert(
      'batch',
      true,
      { ok: false, succeeded: 0, failed: 2, remaining: 0 },
      text,
    );
    expect(msg).toBe('ALLFAILED:2/0');
    expect(msg).not.toContain('SUCCESS');
  });

  it('HTTP !ok surfaces the error payload (not a success message)', () => {
    expect(
      resolveCampaignSendAlert('batch', false, { ok: false, error: 'boom' }, text),
    ).toBe('boom');
    expect(resolveCampaignSendAlert('batch', false, {}, text)).toBe('SEND-FAIL');
  });

  it('test mode respects payload.ok for success vs failure', () => {
    expect(resolveCampaignSendAlert('test', true, { ok: true }, text)).toBe('TEST-OK');
    expect(resolveCampaignSendAlert('test', true, { ok: false }, text)).toBe('TEST-BAD');
  });
});

describe('runSendCampaign — mocked fetch/alert flow', () => {
  const text: CampaignsAdminCopy = {
    testPrompt: 'prompt?',
    batchConfirm: 'confirm?',
    sendFailure: 'SEND-FAIL',
    testSuccess: 'TEST-OK',
    testFailure: 'TEST-BAD',
    batchSuccess: (s: number, r: number) => `SUCCESS:${s}/${r}`,
    batchPartial: (s: number, f: number, r: number) => `PARTIAL:${s}/${f}/${r}`,
    batchAllFailed: (f: number, r: number) => `ALLFAILED:${f}/${r}`,
  } as unknown as CampaignsAdminCopy;

  it('batch, body ok=true => surfaces success alert', async () => {
    const { deps, alerts } = makeDeps({
      text,
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true, succeeded: 5, failed: 0, remaining: 0 })),
    });
    await runSendCampaign(deps);

    expect(alerts).toEqual(['SUCCESS:5/0']);
    expect(deps.fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('batch, body ok=false all-failed => surfaces all-failed alert, never success', async () => {
    const { deps, alerts } = makeDeps({
      text,
      fetchImpl: vi.fn(async () =>
        jsonResponse({ ok: false, succeeded: 0, failed: 4, remaining: 0, error: 'provider down' }),
      ),
    });
    await runSendCampaign(deps);

    expect(alerts).toEqual(['ALLFAILED:4/0\nprovider down']);
    expect(alerts[0]).not.toContain('SUCCESS');
  });

  it('batch, body ok=false partial => surfaces partial alert with counts', async () => {
    const { deps, alerts } = makeDeps({
      text,
      fetchImpl: vi.fn(async () =>
        jsonResponse({ ok: false, succeeded: 3, failed: 1, remaining: 0, error: 'partial reason' }),
      ),
    });
    await runSendCampaign(deps);

    expect(alerts).toEqual(['PARTIAL:3/1/0\npartial reason']);
  });

  it('batch confirm denied => no fetch, no alert', async () => {
    const { deps, alerts } = makeDeps({
      text,
      confirmImpl: vi.fn(() => false),
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true })),
    });
    await runSendCampaign(deps);

    expect(deps.fetchImpl).not.toHaveBeenCalled();
    expect(alerts).toEqual([]);
  });

  it('test prompt cancelled => no fetch, no alert', async () => {
    const { deps, alerts } = makeDeps({
      mode: 'test',
      text,
      promptImpl: vi.fn(() => null),
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true })),
    });
    await runSendCampaign(deps);

    expect(deps.fetchImpl).not.toHaveBeenCalled();
    expect(alerts).toEqual([]);
  });

  it('test send ok=true => test success alert', async () => {
    const { deps, alerts } = makeDeps({
      mode: 'test',
      text,
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true })),
    });
    await runSendCampaign(deps);

    expect(alerts).toEqual(['TEST-OK']);
  });

  it('localizes the request path for non-ko locale', async () => {
    const { deps } = makeDeps({
      locale: 'zh-hant',
      text,
      fetchImpl: vi.fn(async () => jsonResponse({ ok: true, succeeded: 1, failed: 0, remaining: 0 })),
    });
    await runSendCampaign(deps);

    expect(deps.fetchImpl).toHaveBeenCalledWith(
      expect.stringContaining('locale=zh-hant'),
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
