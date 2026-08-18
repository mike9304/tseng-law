import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { verifyExperimentAssignmentToken } from '@/lib/builder/experiments/assignment-token';
import { claimExperimentMetricOnce } from '@/lib/builder/experiments/metric-idempotency';
import {
  getExperiment,
  incrementExperimentMetric,
} from '@/lib/builder/experiments/storage';
import { emptyMetrics, type Experiment } from '@/lib/builder/experiments/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true })),
}));

vi.mock('@/lib/builder/experiments/storage', () => ({
  getExperiment: vi.fn(),
  incrementExperimentMetric: vi.fn(),
}));

vi.mock('@/lib/builder/experiments/assignment-token', () => ({
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
    { variantId: 'test', label: 'test', weight: 50 },
  ],
  goalEvent: 'cta-click',
  status: 'running',
  metrics: emptyMetrics(),
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const verifyTokenMock = vi.mocked(verifyExperimentAssignmentToken);
const claimMetricMock = vi.mocked(claimExperimentMetricOnce);
const getExperimentMock = vi.mocked(getExperiment);
const incrementExperimentMetricMock = vi.mocked(incrementExperimentMetric);

function request(query = '', body: string | unknown = {
  experimentId: 'exp-1',
  variantId: 'test',
  goal: 'cta-click',
  assignmentToken: 'signed-assignment-token',
}): NextRequest {
  return new NextRequest(`https://tseng-law.com/api/experiments/event${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://tseng-law.com',
      'x-forwarded-for': '203.0.113.1',
      'user-agent': 'vitest-experiments',
      cookie: 'tw_exp_sid=sticky-session',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/experiments/event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true } as never);
    verifyTokenMock.mockReturnValue({
      experimentId: 'exp-1',
      variantId: 'test',
    });
    claimMetricMock.mockResolvedValue({
      claimed: true,
      release: vi.fn(async () => undefined),
    });
    getExperimentMock.mockImplementation(async () => structuredClone(experiment) as never);
    incrementExperimentMetricMock.mockResolvedValue(structuredClone(experiment) as never);
  });

  it('stores conversion events while preserving success response shape', async () => {
    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(incrementExperimentMetricMock).toHaveBeenCalledWith({
      experimentId: 'exp-1',
      variantId: 'test',
      kind: 'conversion',
    });
    expect(verifyTokenMock).toHaveBeenCalledWith(
      'signed-assignment-token',
      'sticky-session',
    );
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('rejects cross-origin conversion events before loading storage', async () => {
    const crossOrigin = request('locale=ko');
    crossOrigin.headers.set('origin', 'https://evil.example');

    const response = await POST(crossOrigin);

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

  it('rejects a missing, tampered, or session-mismatched assignment token', async () => {
    verifyTokenMock.mockReturnValueOnce(null);

    const response = await POST(request('locale=en'));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      ok: false,
      error: 'Unable to verify the experiment assignment.',
      errorCode: 'invalid_assignment_token',
    });
    expect(getExperimentMock).not.toHaveBeenCalled();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });

  it('rejects tokens bound to another experiment or variant', async () => {
    verifyTokenMock.mockReturnValueOnce({
      experimentId: 'exp-1',
      variantId: 'control',
    });

    const response = await POST(request('locale=ko'));

    expect(response.status).toBe(403);
    expect((await response.json()).errorCode).toBe('invalid_assignment_token');
    expect(getExperimentMock).not.toHaveBeenCalled();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });

  it('atomically counts only one of two concurrent conversions', async () => {
    let claimed = false;
    claimMetricMock.mockImplementation(async () => {
      if (claimed) {
        return { claimed: false, release: vi.fn(async () => undefined) };
      }
      claimed = true;
      return { claimed: true, release: vi.fn(async () => undefined) };
    });

    const [first, second] = await Promise.all([
      POST(request('locale=ko')),
      POST(request('locale=ko')),
    ]);
    const payloads = await Promise.all([first.json(), second.json()]);

    expect(payloads).toContainEqual({ ok: true });
    expect(payloads).toContainEqual({ ok: true, ignored: 'already-claimed' });
    expect(incrementExperimentMetricMock).toHaveBeenCalledTimes(1);
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
    const response = await POST(request('', {
      locale: 'zh-hant',
      experimentId: '',
      variantId: '',
      goal: '',
      assignmentToken: '',
    }));
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
    verifyTokenMock.mockReturnValueOnce({
      experimentId: 'exp-1',
      variantId: 'missing',
    });
    const response = await POST(request('locale=en', {
      experimentId: 'exp-1',
      variantId: 'missing',
      goal: 'cta-click',
      assignmentToken: 'signed-assignment-token',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Unknown experiment variant.',
      errorCode: 'unknown_variant',
    });
  });

  it('returns localized metric mutation failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const release = vi.fn(async () => undefined);
    claimMetricMock.mockResolvedValueOnce({ claimed: true, release });
    incrementExperimentMetricMock.mockRejectedValueOnce(new Error('experiment event secret leaked'));

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '실험 전환 이벤트를 저장하지 못했습니다.',
      errorCode: 'experiment_event_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('experiment event secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[experiments/event] conversion metric mutation failed:', expect.any(Error));
    expect(release).toHaveBeenCalledTimes(1);
    expect(response.headers.get('set-cookie')).toBeNull();
    consoleError.mockRestore();
  });

  it('does not set a conversion marker for an existing persistent claim', async () => {
    claimMetricMock.mockResolvedValueOnce({ claimed: false, release: vi.fn(async () => undefined) });

    const response = await POST(request('locale=ko'));

    expect(await response.json()).toEqual({ ok: true, ignored: 'already-claimed' });
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(incrementExperimentMetricMock).not.toHaveBeenCalled();
  });
});
