import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getExperiment, saveExperiment } from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
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
  status: 'draft',
  metrics: emptyMetrics(),
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const getExperimentMock = vi.mocked(getExperiment);
const saveExperimentMock = vi.mocked(saveExperiment);

function request(query = '', body?: string | unknown): NextRequest {
  const init = body === undefined
    ? undefined
    : {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      };
  return new NextRequest(`https://law.example.test/api/builder/experiments/exp-1${query ? `?${query}` : ''}`, init);
}

const params = { params: Promise.resolve({ experimentId: 'exp-1' }) };

describe('/api/builder/experiments/[experimentId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    getExperimentMock.mockResolvedValue(experiment as never);
    saveExperimentMock.mockResolvedValue(undefined as never);
  });

  it('returns experiments while preserving detail success shape', async () => {
    const response = await GET(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, experiment });
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

  it('returns localized invalid JSON errors for patch', async () => {
    const response = await PATCH(request('locale=en', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the experiment request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized patch validation errors', async () => {
    const response = await PATCH(request('', { locale: 'zh-hant', status: 'bad' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認實驗請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.details).toBeDefined();
  });

  it('returns localized duplicate variant id errors for patch', async () => {
    const response = await PATCH(request('locale=en', {
      variants: [
        { variantId: 'same', label: 'control', weight: 50 },
        { variantId: 'same', label: 'test', weight: 50 },
      ],
    }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Variant ids must be unique.',
      errorCode: 'duplicate_variant_ids',
    });
  });

  it('patches experiments while preserving success response shape', async () => {
    const response = await PATCH(request('locale=ko', { status: 'running' }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveExperimentMock).toHaveBeenCalledWith(expect.objectContaining({
      experimentId: 'exp-1',
      status: 'running',
      startedAt: expect.any(String),
      updatedAt: expect.any(String),
    }));
    expect(payload).toMatchObject({
      ok: true,
      experiment: {
        experimentId: 'exp-1',
        status: 'running',
      },
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveExperimentMock.mockRejectedValueOnce(new Error('experiment save secret leaked'));

    const response = await PATCH(request('locale=ko', { status: 'paused' }), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '실험을 저장하지 못했습니다.',
      errorCode: 'experiment_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment save secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/experiments/:id] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
