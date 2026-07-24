import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteDraftColumn,
  deletePublishedColumn,
  readColumnBundle,
  writeDraftColumn,
} from '@/lib/builder/columns/storage';
import type { ColumnDocument, ColumnDocumentBundle } from '@/lib/builder/columns/types';
import * as route from '@/app/api/builder/columns/[slug]/route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordColumnEvent: vi.fn(),
}));

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  invalidateBlobColumnsCache: vi.fn(),
}));

vi.mock('@/lib/builder/columns/storage', () => ({
  deleteDraftColumn: vi.fn(),
  deletePublishedColumn: vi.fn(),
  readColumnBundle: vi.fn(),
  writeDraftColumn: vi.fn(),
}));

const readColumnBundleMock = vi.mocked(readColumnBundle);
const writeDraftColumnMock = vi.mocked(writeDraftColumn);

function request(path: string, init?: ConstructorParameters<typeof NextRequest>[1]): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, init);
}

function column(overrides: Partial<ColumnDocument> = {}): ColumnDocument {
  const now = '2026-06-03T00:00:00.000Z';
  return {
    version: 1,
    slug: 'sample-column',
    locale: 'ko',
    title: '샘플 칼럼',
    summary: '',
    bodyMarkdown: '',
    bodyHtml: '',
    linkedSlugs: {},
    frontmatter: {
      lastmod: now,
      attorneyReviewStatus: 'pending',
      freshness: 'unknown',
    },
    draft: true,
    revision: 1,
    updatedAt: now,
    updatedBy: 'admin',
    ...overrides,
  };
}

function bundle(overrides: Partial<ColumnDocumentBundle> = {}): ColumnDocumentBundle {
  return {
    slug: 'sample-column',
    locale: 'ko',
    draft: null,
    published: null,
    preferred: null,
    backend: 'file',
    ...overrides,
  };
}

describe('/api/builder/columns/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireBuilderAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' } as never);
    vi.mocked(deleteDraftColumn).mockResolvedValue(undefined);
    vi.mocked(deletePublishedColumn).mockResolvedValue(undefined);
    readColumnBundleMock.mockResolvedValue(bundle());
    writeDraftColumnMock.mockImplementation(async (doc) => doc);
  });

  it('returns localized stable-code JSON for missing columns', async () => {
    const response = await route.GET(
      request('/api/builder/columns/missing?locale=zh-hant'),
      { params: { slug: 'missing' } },
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '找不到專欄。',
      errorCode: 'column_not_found',
    });
  });

  it('returns localized stable-code JSON for malformed patch payloads', async () => {
    const response = await route.PATCH(
      request('/api/builder/columns/sample-column?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      { params: { slug: 'sample-column' } },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the column request format.',
      errorCode: 'invalid_json',
    });
    expect(JSON.stringify(data)).not.toContain('Unexpected');
  });

  it('requests the draft rate-limit bucket for PATCH autosaves', async () => {
    const current = column({ slug: 'sample-column', locale: 'ko' });
    readColumnBundleMock.mockResolvedValueOnce(bundle({
      slug: 'sample-column',
      draft: current,
      preferred: current,
    }));

    const response = await route.PATCH(
      request('/api/builder/columns/sample-column?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'updated' }),
      }),
      { params: { slug: 'sample-column' } },
    );

    expect(response.status).toBe(200);
    expect(guardMutation).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { bucket: 'draft' },
    );
  });

  it('keeps DELETE on the mutation rate-limit bucket', async () => {
    const current = column({ slug: 'sample-column', locale: 'ko', draft: true });
    readColumnBundleMock.mockResolvedValueOnce(bundle({
      slug: 'sample-column',
      draft: current,
      preferred: current,
    }));

    const response = await route.DELETE(
      request('/api/builder/columns/sample-column?locale=ko', {
        method: 'DELETE',
      }),
      { params: { slug: 'sample-column' } },
    );

    expect(response.status).toBe(200);
    expect(guardMutation).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { bucket: 'mutation' },
    );
  });

  it('returns localized stable-code JSON for slug conflicts', async () => {
    const current = column({ slug: 'sample-column', locale: 'ko' });
    const existing = column({ slug: 'existing-column', locale: 'ko' });
    readColumnBundleMock
      .mockResolvedValueOnce(bundle({
        slug: 'sample-column',
        draft: current,
        preferred: current,
      }))
      .mockResolvedValueOnce(bundle({
        slug: 'existing-column',
        draft: existing,
        preferred: existing,
      }));

    const response = await route.PATCH(
      request('/api/builder/columns/sample-column?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug: 'existing-column' }),
      }),
      { params: { slug: 'sample-column' } },
    );
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({
      ok: false,
      error: '이미 같은 주소의 칼럼이 있습니다.',
      errorCode: 'column_slug_conflict',
    });
    expect(writeDraftColumnMock).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when deleting imported legacy columns is blocked', async () => {
    const legacyPublished = column({
      slug: 'legacy-column',
      locale: 'zh-hant',
      draft: false,
      updatedBy: 'legacy-column-import',
    });
    readColumnBundleMock.mockResolvedValueOnce(bundle({
      slug: 'legacy-column',
      locale: 'zh-hant',
      published: legacyPublished,
      preferred: legacyPublished,
    }));

    const response = await route.DELETE(
      request('/api/builder/columns/legacy-column?locale=zh-hant&includePublished=1', {
        method: 'DELETE',
      }),
      { params: { slug: 'legacy-column' } },
    );
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({
      ok: false,
      error: '匯入的既有專欄無法透過建構器清理路徑刪除。',
      errorCode: 'legacy_delete_blocked',
      publishedStillExists: true,
    });
    expect(deletePublishedColumn).not.toHaveBeenCalled();
  });

  it('merges typography on frontmatter PATCH and preserves it on body-only PATCH', async () => {
    const current = column({
      slug: 'sample-column',
      locale: 'ko',
      bodyHtml: '<p>safe</p>',
      frontmatter: {
        lastmod: '2026-06-03T00:00:00.000Z',
        attorneyReviewStatus: 'pending',
        freshness: 'unknown',
        typography: { presetId: 'ko-body-sans' },
      },
    });
    readColumnBundleMock.mockResolvedValueOnce(bundle({
      slug: 'sample-column',
      draft: current,
      preferred: current,
    }));

    const typoRes = await route.PATCH(
      request('/api/builder/columns/sample-column?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          frontmatter: { typography: { presetId: 'ko-body-readable', bodySize: 'lg' } },
        }),
      }),
      { params: { slug: 'sample-column' } },
    );
    expect(typoRes.status).toBe(200);
    const savedAfterTypo = writeDraftColumnMock.mock.calls.at(-1)?.[0] as ColumnDocument;
    expect(savedAfterTypo.frontmatter.typography).toEqual({
      presetId: 'ko-body-readable',
      bodySize: 'lg',
    });
    expect(savedAfterTypo.bodyHtml).toBe('<p>safe</p>');

    readColumnBundleMock.mockResolvedValueOnce(bundle({
      slug: 'sample-column',
      draft: savedAfterTypo,
      preferred: savedAfterTypo,
    }));

    const bodyRes = await route.PATCH(
      request('/api/builder/columns/sample-column?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'updated title',
          bodyHtml: '<p>next</p><script>alert(1)</script><img src=x onerror=alert(1)>',
          bodyMarkdown: 'next',
        }),
      }),
      { params: { slug: 'sample-column' } },
    );
    expect(bodyRes.status).toBe(200);
    const savedAfterBody = writeDraftColumnMock.mock.calls.at(-1)?.[0] as ColumnDocument;
    expect(savedAfterBody.frontmatter.typography).toEqual({
      presetId: 'ko-body-readable',
      bodySize: 'lg',
    });
    expect(savedAfterBody.bodyHtml).not.toMatch(/script|onerror/i);
    expect(savedAfterBody.bodyHtml).toContain('<p>next</p>');
  });

  it('clears typography when frontmatter.typography is null', async () => {
    const current = column({
      frontmatter: {
        lastmod: '2026-06-03T00:00:00.000Z',
        attorneyReviewStatus: 'pending',
        freshness: 'unknown',
        typography: { presetId: 'ko-compact' },
      },
    });
    readColumnBundleMock.mockResolvedValueOnce(bundle({
      draft: current,
      preferred: current,
    }));

    const response = await route.PATCH(
      request('/api/builder/columns/sample-column?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ frontmatter: { typography: null } }),
      }),
      { params: { slug: 'sample-column' } },
    );
    expect(response.status).toBe(200);
    const saved = writeDraftColumnMock.mock.calls.at(-1)?.[0] as ColumnDocument;
    expect(saved.frontmatter.typography).toBeUndefined();
  });
});
