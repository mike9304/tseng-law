import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { assignVariant } from '@/lib/builder/experiments/assign';
import {
  createExperimentAssignmentToken,
  verifyExperimentAssignmentToken,
} from '@/lib/builder/experiments/assignment-token';
import { claimExperimentMetricOnce } from '@/lib/builder/experiments/metric-idempotency';
import {
  getExperiment,
  incrementExperimentMetric,
} from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true })),
}));

vi.mock('@/lib/builder/experiments/storage', () => ({
  getExperiment: vi.fn(),
  incrementExperimentMetric: vi.fn(),
}));

vi.mock('@/lib/builder/experiments/assign', () => ({
  assignVariant: vi.fn(),
}));

vi.mock('@/lib/builder/experiments/assignment-token', () => ({
  createExperimentAssignmentToken: vi.fn(() => 'signed-assignment-token'),
  verifyExperimentAssignmentToken: vi.fn(),
}));

vi.mock('@/lib/builder/experiments/metric-idempotency', () => ({
  claimExperimentMetricOnce: vi.fn(),
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
const createTokenMock = vi.mocked(createExperimentAssignmentToken);
const verifyTokenMock = vi.mocked(verifyExperimentAssignmentToken);
const claimMetricMock = vi.mocked(claimExperimentMetricOnce);
const getExperimentMock = vi.mocked(getExperiment);
const incrementExperimentMetricMock = vi.mocked(incrementExperimentMetric);

function getRequest(query = '', cookie?: string): NextRequest {
  return new NextRequest(`https://tseng-law.com/api/experiments/assign${query ? `?${query}` : ''}`, {
    headers: {
      ...(cookie ? { cookie } : {}),
      'x-forwarded-for': '203.0.113.1',
      'user-agent': 'vitest-experiments',
    },
  });
}

function postRequest(
  body: unknown = { assignmentToken: 'signed-assignment-token', locale: 'ko' },
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest('https://tseng-law.com/api/experiments/assign?locale=ko', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://tseng-law.com',
      'x-forwarded-for': '203.0.113.1',
      'user-agent': 'vitest-experiments',
      cookie: 'tw_exp_sid=sticky-session',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('/api/experiments/assign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true } as never);
    getExperimentMock.mockImplementation(async () => structuredClone(experiment) as never);
    assignVariantMock.mockReturnValue(experiment.variants[1] as never);
    createTokenMock.mockReturnValue('signed-assignment-token');
    verifyTokenMock.mockReturnValue({
      experimentId: 'exp-1',
      variantId: 'test',
    });
    claimMetricMock.mockResolvedValue({
      claimed: true,
      release: vi.fn(async () => undefined),
    });
    incrementExperimentMetricMock.mockResolvedValue(structuredClone(experiment) as never);
  });

  it('keeps GET side-effect-free while returning a signed assignment', async () => {
    const response = await GET(getRequest('experimentId=exp-1&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      variantId: 'test',
      label: 'test',
      overrides: { cta: 'Try now' },
      pageId: 'home-test',
      firstExposure: true,
      assignmentToken: 'signed-assignment-token',
    });
    expect(createTokenMock).toHaveBeenCalledWith(
      'exp-1',
      'test',
      expect.any(String),
    );
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
    expect(response.headers.get('set-cookie')).toContain('tw_exp_sid=');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
  });

  it('records exposure only through the CSRF-protected POST', async () => {
    const response = await POST(postRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(verifyTokenMock).toHaveBeenCalledWith(
      'signed-assignment-token',
      'sticky-session',
    );
    expect(incrementExperimentMetricMock).toHaveBeenCalledWith({
      experimentId: 'exp-1',
      variantId: 'test',
      kind: 'exposure',
    });
    expect(response.headers.get('set-cookie')).toContain('tw_exp_exp_1=test');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('rejects cross-origin exposure recording before storage access', async () => {
    const response = await POST(postRequest(undefined, {
      origin: 'https://evil.example',
    }));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'csrf_origin_mismatch',
      code: 'csrf_origin_mismatch',
    });
    expect(verifyTokenMock).not.toHaveBeenCalled();
    expect(getExperimentMock).not.toHaveBeenCalled();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });

  it('rejects invalid or session-mismatched assignment tokens', async () => {
    verifyTokenMock.mockReturnValueOnce(null);

    const response = await POST(postRequest());

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      ok: false,
      error: '실험 배정 정보를 확인할 수 없습니다.',
      errorCode: 'invalid_assignment_token',
    });
    expect(getExperimentMock).not.toHaveBeenCalled();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });

  it('does not double count when the exposure marker is present', async () => {
    const response = await POST(postRequest(undefined, {
      cookie: 'tw_exp_exp_1=test; tw_exp_sid=sticky-session',
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, ignored: 'already-counted' });
    expect(getExperimentMock).not.toHaveBeenCalled();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });

  it('atomically counts only one of two concurrent exposure POSTs', async () => {
    let claimed = false;
    claimMetricMock.mockImplementation(async () => {
      if (claimed) {
        return { claimed: false, release: vi.fn(async () => undefined) };
      }
      claimed = true;
      return { claimed: true, release: vi.fn(async () => undefined) };
    });

    const [first, second] = await Promise.all([
      POST(postRequest()),
      POST(postRequest()),
    ]);
    const payloads = await Promise.all([first.json(), second.json()]);

    expect(payloads).toContainEqual({ ok: true });
    expect(payloads).toContainEqual({ ok: true, ignored: 'already-claimed' });
    expect(incrementExperimentMetricMock).toHaveBeenCalledTimes(1);
  });

  it('returns localized rate-limit errors', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false } as never);

    const response = await GET(getRequest('experimentId=exp-1&locale=zh-hant'));

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      ok: false,
      error: '實驗請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
  });

  it('returns localized missing experiment id errors', async () => {
    const response = await GET(getRequest('locale=en'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'experimentId is required.',
      errorCode: 'experiment_id_required',
    });
  });

  it('returns localized not-found errors', async () => {
    getExperimentMock.mockResolvedValueOnce(null);

    const response = await GET(getRequest('experimentId=missing&locale=zh-hant'));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      ok: false,
      error: '找不到實驗。',
      errorCode: 'experiment_not_found',
    });
  });

  it('returns localized assignment failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getExperimentMock.mockRejectedValueOnce(new Error('experiment assign secret leaked'));

    const response = await GET(getRequest('experimentId=exp-1&locale=ko'));
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

  it('releases its claim and does not set an exposure marker after a CAS failure', async () => {
    const release = vi.fn(async () => undefined);
    claimMetricMock.mockResolvedValueOnce({ claimed: true, release });
    incrementExperimentMetricMock.mockRejectedValueOnce(new Error('metric storage unavailable'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const response = await POST(postRequest());

    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ ok: false, errorCode: 'experiment_assign_failed' });
    expect(release).toHaveBeenCalledTimes(1);
    expect(response.headers.get('set-cookie')).toBeNull();
    consoleError.mockRestore();
  });

  it('does not set an exposure marker for an existing persistent claim', async () => {
    claimMetricMock.mockResolvedValueOnce({ claimed: false, release: vi.fn(async () => undefined) });

    const response = await POST(postRequest());

    expect(await response.json()).toEqual({ ok: true, ignored: 'already-claimed' });
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });
});
