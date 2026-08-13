import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  listFaqCategories: vi.fn(() => []),
  listFaqItems: vi.fn(async () => []),
}));

describe('/api/faq GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listFaqCategories).mockReturnValue([]);
    vi.mocked(listFaqItems).mockResolvedValue([]);
  });

  it('keeps malformed query validation responses public and stable', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://tseng-law.com/api/faq?limit=999'),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: 'validation_error',
    });
    expect(listFaqItems).not.toHaveBeenCalled();
  });

  it('redacts unexpected FAQ query failures from the client response and logs', async () => {
    const sensitiveMarker = 'SENSITIVE_FAQ_email=client@example.com';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(listFaqItems).mockRejectedValueOnce(new Error(sensitiveMarker));
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://tseng-law.com/api/faq?locale=ko'),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'faq_list_failed',
      code: 'faq_list_failed',
      message: 'Unable to load frequently asked questions right now. Please try again later.',
    });
    expect(JSON.stringify(payload)).not.toContain(sensitiveMarker);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[faq] operation failed',
      'faq_list_failed',
      'Error',
    );
    expect(consoleSpy.mock.calls.flat().join(' ')).not.toContain(sensitiveMarker);
  });
});
