import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireConsultationAdminAuth } from '@/lib/consultation/admin/auth';
import {
  archiveAttorneyKnowledgeEntry,
  readAttorneyKnowledgeEntries,
  saveAttorneyKnowledgeEntry,
} from '@/lib/consultation/attorney-knowledge';

vi.mock('@/lib/consultation/admin/auth', () => ({
  requireConsultationAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/consultation/attorney-knowledge', () => ({
  archiveAttorneyKnowledgeEntry: vi.fn(async () => undefined),
  readAttorneyKnowledgeEntries: vi.fn(async () => []),
  saveAttorneyKnowledgeEntry: vi.fn(async (entry: unknown) => ({
    id: 'knowledge-1',
    ...(entry as Record<string, unknown>),
  })),
}));

describe('/api/consultation/knowledge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireConsultationAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(readAttorneyKnowledgeEntries).mockResolvedValue([]);
    vi.mocked(saveAttorneyKnowledgeEntry).mockResolvedValue({
      id: 'knowledge-1',
      locale: 'ko',
      category: 'general',
      question: 'Question',
      answer: 'Answer',
      keywords: [],
      reviewedBy: 'admin',
      sourceNote: '',
      reviewedAt: '2026-05-13T00:00:00.000Z',
      updatedAt: '2026-05-13T00:00:00.000Z',
    });
    vi.mocked(archiveAttorneyKnowledgeEntry).mockResolvedValue(undefined);
  });

  it.each([
    ['missing Origin and Referer', { origin: '' }],
    ['a cross-origin Origin', { origin: 'https://attacker.example' }],
  ])('rejects %s before authentication or storage', async (_label, options) => {
    const route = await import('../route');
    const response = await route.POST(makeFormRequest({
      url: 'https://tseng-law.com/api/consultation/knowledge',
      ...options,
    }));

    expect(response.status).toBe(403);
    expect(requireConsultationAdminAuth).not.toHaveBeenCalled();
    expect(saveAttorneyKnowledgeEntry).not.toHaveBeenCalled();
    expect(archiveAttorneyKnowledgeEntry).not.toHaveBeenCalled();
  });

  it('falls back to the admin page when a form post has an external referer', async () => {
    const route = await import('../route');
    const response = await route.POST(makeFormRequest({
      referer: 'https://evil.example/phish',
    }));

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      'https://tseng-law.com/ko/admin-consultation?knowledge=saved',
    );
    expect(saveAttorneyKnowledgeEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        question: 'Question',
        answer: 'Answer',
        reviewedBy: 'admin',
      }),
    );
  });

  it('preserves same-origin admin filters when redirecting after a form post', async () => {
    const route = await import('../route');
    const response = await route.POST(makeFormRequest({
      referer: 'https://tseng-law.com/ko/admin-consultation?category=labor',
    }));

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      'https://tseng-law.com/ko/admin-consultation?category=labor&knowledge=saved',
    );
  });
});

function makeFormRequest(options: {
  url?: string;
  origin?: string;
  referer?: string;
} = {}): NextRequest {
  const form = new FormData();
  form.set('locale', 'ko');
  form.set('category', 'general');
  form.set('question', 'Question');
  form.set('answer', 'Answer');

  const headers = new Headers();
  headers.set('origin', options.origin ?? 'https://tseng-law.com');
  if (options.referer) {
    headers.set('referer', options.referer);
  }
  if (options.origin === '') {
    headers.delete('origin');
  }
  return new NextRequest(options.url ?? 'https://tseng-law.com/api/consultation/knowledge', {
    method: 'POST',
    headers,
    body: form,
  });
}
