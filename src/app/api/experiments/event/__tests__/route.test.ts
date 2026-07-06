import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true })),
}));

vi.mock('@/lib/builder/experiments/storage', () => ({
  getExperiment: vi.fn(),
  saveExperiment: vi.fn(),
}));

const experiment: Experiment = {
  experimentId: 'exp-1',
  name: 'Hero CTA test',
  targetPath: '/ko',
  variants: [
    { variantId: 'control', label: 'control', weight: 50 },
    { variantId: 'test', label: 'test', weight: 50 },
  ],
  goalEvent: 'cta-click',
  status: 'running',
  metrics: emptyMetrics(),
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const getExperimentMock = vi.mocked(getExperiment);
const saveExperimentMock = vi.mocked(saveExperiment);

function request(query = '', body: string | unknown = {
  experimentId: 'exp-1',
  variantId: 'test',
  goal: 'cta-click',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/experiments/event${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.1',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/experiments/event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true } as never);
    getExperimentMock.mockResolvedValue(experiment as never);
    saveExperimentMock.mockResolvedValue(undefined as never);
  });

  it('stores conversion events while preserving success response shape', async () => {
    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(saveExperimentMock).toHaveBeenCalledWith(expect.objectContaining({
      metrics: {
        exposures: {},
        conversions: { test: 1 },
      },
    }));
  });

  it('returns localized rate-limit errors', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false } as never);

    const response = await POST(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toEqual({
      ok: false,
      error: '實驗請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the experiment request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors using body locale', async () => {
    const response = await POST(request('', { locale: 'zh-hant', experimentId: '', variantId: '', goal: '' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認實驗請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.details).toBeDefined();
  });

  it('returns localized not-found errors', async () => {
    getExperimentMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到實驗。',
      errorCode: 'experiment_not_found',
    });
  });

  it('returns localized unknown variant errors', async () => {
    const response = await POST(request('locale=en', {
      experimentId: 'exp-1',
      variantId: 'missing',
      goal: 'cta-click',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Unknown experiment variant.',
      errorCode: 'unknown_variant',
    });
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveExperimentMock.mockRejectedValueOnce(new Error('experiment event secret leaked'));

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '실험 전환 이벤트를 저장하지 못했습니다.',
      errorCode: 'experiment_event_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment event secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[experiments/event] conversion save failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
