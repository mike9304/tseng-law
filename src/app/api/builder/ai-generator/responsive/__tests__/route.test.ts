import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/responsive', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator/responsive', () => {
  it('returns viewport overflow suggestions for media nodes', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      pageId: 'home',
      locale: 'ko',
      targetViewport: 'mobile',
      canvas: createDefaultCanvasDocument('ko'),
      safeWidth: 360,
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.suggestions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        nodeId: 'hero-image-1',
        reason: 'node-overflows-viewport',
        mobileOverride: expect.objectContaining({
          rect: expect.objectContaining({
            x: expect.any(Number),
            width: expect.any(Number),
          }),
        }),
      }),
    ]));
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'edit-pages',
    });
  });

  it('rejects invalid responsive payloads', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      pageId: '',
      locale: 'ko',
      targetViewport: 'desktop',
      canvas: createDefaultCanvasDocument('ko'),
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_responsive_request');
  });
});
