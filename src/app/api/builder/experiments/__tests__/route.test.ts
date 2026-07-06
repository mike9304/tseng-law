import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listExperiments,
  makeExperimentId,
  saveExperiment,
} from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/experiments/storage', () => ({
  listExperiments: vi.fn(),
  makeExperimentId: vi.fn(() => 'exp-new'),
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
const listExperimentsMock = vi.mocked(listExperiments);
const makeExperimentIdMock = vi.mocked(makeExperimentId);
const saveExperimentMock = vi.mocked(saveExperiment);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/experiments${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: string | unknown = {
  name: 'Hero CTA test',
  targetPath: '/ko',
  variants: [
    { variantId: 'control', label: 'control', weight: 50 },
    { variantId: 'test', label: 'test', weight: 50 },
  ],
  goalEvent: 'cta-click',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/experiments${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/experiments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    listExperimentsMock.mockResolvedValue([experiment] as never);
    makeExperimentIdMock.mockReturnValue('exp-new');
    saveExperimentMock.mockResolvedValue(undefined as never);
  });

  it('returns experiments while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      allowReadOnly: true,
      permission: 'settings',
    });
    expect(payload).toEqual({
      ok: true,
      experiments: [experiment],
      total: 1,
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listExperimentsMock.mockRejectedValueOnce(new Error('experiment list secret leaked'));

    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load experiments.',
      errorCode: 'experiments_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/experiments] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the experiment request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors using body locale', async () => {
    const response = await POST(postRequest('', {
      locale: 'zh-hant',
      name: '',
      variants: [],
      goalEvent: '',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認實驗請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.details).toBeDefined();
    expect(saveExperimentMock).not.toHaveBeenCalled();
  });

  it('returns localized duplicate variant id errors', async () => {
    const response = await POST(postRequest('locale=ko', {
      name: 'Hero CTA test',
      variants: [
        { variantId: 'same', label: 'control', weight: 50 },
        { variantId: 'same', label: 'test', weight: 50 },
      ],
      goalEvent: 'cta-click',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '변형 ID는 중복될 수 없습니다.',
      errorCode: 'duplicate_variant_ids',
    });
  });

  it('creates experiments while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveExperimentMock).toHaveBeenCalledWith(expect.objectContaining({
      experimentId: 'exp-new',
      name: 'Hero CTA test',
      status: 'draft',
      metrics: { exposures: {}, conversions: {} },
    }));
    expect(payload).toMatchObject({
      ok: true,
      experiment: {
        experimentId: 'exp-new',
        name: 'Hero CTA test',
        status: 'draft',
      },
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveExperimentMock.mockRejectedValueOnce(new Error('experiment create secret leaked'));

    const response = await POST(postRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法建立實驗。',
      errorCode: 'experiment_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/experiments] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
