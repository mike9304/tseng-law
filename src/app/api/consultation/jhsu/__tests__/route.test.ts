import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { sendJhsuIntakeEmail } from '@/lib/email/send-jhsu-intake-email';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 4, retryAfterMs: 0 })),
}));
vi.mock('@/lib/email/send-jhsu-intake-email', () => ({
  sendJhsuIntakeEmail: vi.fn(async () => ({ intakeId: 'JH-TEST0001' })),
}));

const ORIGIN = 'https://son-7.com';

function validBody() {
  return {
    name: '王小明', phone: '0912-345-678', email: 'client@example.test',
    role: '本人（被告／犯罪嫌疑人）', stage: '收到警察到案說明通知書',
    message: '收到通知書，想確認到場前要準備什麼。', consent: true, pageUrl: 'https://son-7.com/contact',
  };
}

function makeRequest(body: unknown, origin?: string, method = 'POST'): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9' });
  if (origin) headers.set('origin', origin);
  return new NextRequest('https://tseng-law.com/api/consultation/jhsu', {
    method, headers, body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
}

describe('/api/consultation/jhsu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 4, retryAfterMs: 0 });
  });

  it('answers the CORS preflight for son-7.com', async () => {
    const route = await import('../route');
    const res = await route.OPTIONS(makeRequest(undefined, ORIGIN, 'OPTIONS'));
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe(ORIGIN);
    expect(res.headers.get('access-control-allow-methods')).toContain('POST');
  });

  it('rejects an unknown origin without sending mail', async () => {
    const route = await import('../route');
    const res = await route.POST(makeRequest(validBody(), 'https://attacker.example'));
    expect(res.status).toBe(403);
    expect(res.headers.get('access-control-allow-origin')).toBeNull();
    expect(sendJhsuIntakeEmail).not.toHaveBeenCalled();
  });

  it('rejects a request with no origin', async () => {
    const route = await import('../route');
    const res = await route.POST(makeRequest(validBody()));
    expect(res.status).toBe(403);
    expect(sendJhsuIntakeEmail).not.toHaveBeenCalled();
  });

  it('sends the intake mail and returns the intake id with CORS headers', async () => {
    const route = await import('../route');
    const res = await route.POST(makeRequest(validBody(), ORIGIN));
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe(ORIGIN);
    await expect(res.json()).resolves.toEqual({ success: true, intakeId: 'JH-TEST0001' });
    expect(sendJhsuIntakeEmail).toHaveBeenCalledTimes(1);
    expect(sendJhsuIntakeEmail).toHaveBeenCalledWith(expect.objectContaining({
      name: '王小明', phone: '0912-345-678', role: '本人（被告／犯罪嫌疑人）', stage: '收到警察到案說明通知書', source: 'son-7.com',
    }));
  });

  it('requires consent', async () => {
    const route = await import('../route');
    const res = await route.POST(makeRequest({ ...validBody(), consent: false }, ORIGIN));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({ error: 'consent_required' });
    expect(sendJhsuIntakeEmail).not.toHaveBeenCalled();
  });

  it('rejects missing required fields and unknown keys', async () => {
    const route = await import('../route');
    const missing = await route.POST(makeRequest({ ...validBody(), message: '' }, ORIGIN));
    expect(missing.status).toBe(400);
    const extra = await route.POST(makeRequest({ ...validBody(), admin: true }, ORIGIN));
    expect(extra.status).toBe(400);
    expect(sendJhsuIntakeEmail).not.toHaveBeenCalled();
  });

  it('silently drops honeypot submissions', async () => {
    const route = await import('../route');
    const res = await route.POST(makeRequest({ ...validBody(), website: 'http://spam.example' }, ORIGIN));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, intakeId: 'JH-IGNORED' });
    expect(sendJhsuIntakeEmail).not.toHaveBeenCalled();
  });

  it('returns 429 when the IP limit is hit', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 30_000 });
    const route = await import('../route');
    const res = await route.POST(makeRequest(validBody(), ORIGIN));
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('30');
    expect(sendJhsuIntakeEmail).not.toHaveBeenCalled();
  });

  it('returns 502 when the mail cannot be sent', async () => {
    vi.mocked(sendJhsuIntakeEmail).mockRejectedValueOnce(new Error('SMTP down'));
    const route = await import('../route');
    const res = await route.POST(makeRequest(validBody(), ORIGIN));
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toMatchObject({ success: false, error: 'send_failed' });
  });
});
