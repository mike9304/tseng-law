import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { assignVariant } from '@/lib/builder/experiments/assign';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { GET } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true })),
}));

vi.mock('@/lib/builder/experiments/storage', () => ({
  getExperiment: vi.fn(),
  saveExperiment: vi.fn(),
}));

vi.mock('@/lib/builder/experiments/assign', () => ({
  assignVariant: vi.fn(),
}));

const experiment: Experiment = {
  experimentId: 'exp-1',
  name: 'Hero CTA test',
  targetPath: '/ko',
  variants: [
    { variantId: 'control', label: 'control', weight: 50 },
    { variantId: 'test', label: 'test', weight: 50, pageId: 'home-test', overrides: { cta: 'Try now' } },
  ],
  goalEvent: 'cta-click',
  status: 'running',
  metrics: emptyMetrics(),
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const assignVariantMock = vi.mocked(assignVariant);
const getExperimentMock = vi.mocked(getExperiment);
const saveExperimentMock = vi.mocked(saveExperiment);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/experiments/assign${query ? `?${query}` : ''}`, {
    headers: {
      'x-forwarded-for': '203.0.113.1',
      'user-agent': 'vitest-experiments',
    },
  });
}

describe('/api/experiments/assign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true } as never);
    getExperimentMock.mockResolvedValue(experiment as never);
    assignVariantMock.mockReturnValue(experiment.variants[1] as never);
    saveExperimentMock.mockResolvedValue(undefined as never);
  });

  it('returns assigned variants while preserving success response shape', async () => {
    const response = await GET(request('experimentId=exp-1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      variantId: 'test',
      label: 'test',
      overrides: { cta: 'Try now' },
      pageId: 'home-test',
      firstExposure: true,
    });
    expect(saveExperimentMock).toHaveBeenCalledWith(expect.objectContaining({
      metrics: {
        exposures: { test: 1 },
        conversions: {},
      },
    }));
  });

  it('returns localized rate-limit errors', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false } as never);

    const response = await GET(request('experimentId=exp-1&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toEqual({
      ok: false,
      error: '實驗請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
  });

  it('returns localized missing experiment id errors', async () => {
    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'experimentId is required.',
      errorCode: 'experiment_id_required',
    });
  });

  it('returns localized not-found errors', async () => {
    getExperimentMock.mockResolvedValueOnce(null);

    const response = await GET(request('experimentId=missing&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到實驗。',
      errorCode: 'experiment_not_found',
    });
  });

  it('returns localized assignment failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getExperimentMock.mockRejectedValueOnce(new Error('experiment assign secret leaked'));

    const response = await GET(request('experimentId=exp-1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '실험 변형을 배정하지 못했습니다.',
      errorCode: 'experiment_assign_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment assign secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[experiments/assign] experiment load failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
