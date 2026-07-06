import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getExperiment } from '@/lib/builder/experiments/storage';
import { computeExperimentStats } from '@/lib/builder/experiments/stats';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/experiments/storage', () => ({
  getExperiment: vi.fn(),
}));

vi.mock('@/lib/builder/experiments/stats', () => ({
  computeExperimentStats: vi.fn(),
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
  metrics: {
    ...emptyMetrics(),
    exposures: { control: 10, test: 12 },
    conversions: { control: 1, test: 3 },
  },
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const getExperimentMock = vi.mocked(getExperiment);
const computeExperimentStatsMock = vi.mocked(computeExperimentStats);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/experiments/exp-1/results${query ? `?${query}` : ''}`);
}

const params = { params: { experimentId: 'exp-1' } };

describe('/api/builder/experiments/[experimentId]/results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    getExperimentMock.mockResolvedValue(experiment as never);
    computeExperimentStatsMock.mockReturnValue([{ variantId: 'test', label: 'test', weight: 50, exposures: 12, conversions: 3, conversionRate: 0.25, upliftVsControl: 1.5, zScore: 1.23, significant: false }] as never);
  });

  it('returns results while preserving success response shape', async () => {
    const response = await GET(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      experimentId: 'exp-1',
      status: 'running',
      goalEvent: 'cta-click',
      stats: [{ variantId: 'test', label: 'test', weight: 50, exposures: 12, conversions: 3, conversionRate: 0.25, upliftVsControl: 1.5, zScore: 1.23, significant: false }],
      totals: {
        exposures: 22,
        conversions: 4,
      },
    });
  });

  it('returns localized not-found errors', async () => {
    getExperimentMock.mockResolvedValueOnce(null);

    const response = await GET(request('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到實驗。',
      errorCode: 'experiment_not_found',
    });
  });

  it('returns localized results failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    computeExperimentStatsMock.mockImplementationOnce(() => {
      throw new Error('experiment stats secret leaked');
    });

    const response = await GET(request('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load experiment results.',
      errorCode: 'experiment_results_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment stats secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/experiments/:id/results] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
