import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/style-score', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator/style-score', () => {
  it('returns ranked designer style scores and export payload', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      industry: 'law',
      tone: 'professional',
      colorPreference: 'cool',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      constraints: '모바일 CTA를 우선 노출',
      audience: '대만 내 한국 기업과 교민',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      top: {
        id: 'editorial-trust',
        rank: 1,
        score: 94,
        layoutFit: 96,
        paletteFit: 92,
        designPoolProfile: 'law-editorial-credential',
        designPoolFit: 96,
      },
      payload: expect.stringMatching(/^editorial-trust:1:94:96:92/),
    });
    expect(payload.scores).toHaveLength(3);
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'edit-pages',
    });
  });

  it('rejects invalid style score payloads', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      industry: 'unknown',
      goals: ['valid goal'],
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_style_score_request');
  });
});
