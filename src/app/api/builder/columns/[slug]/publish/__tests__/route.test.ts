import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readColumnVariant, writePublishedColumn } from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';
import * as route from '@/app/api/builder/columns/[slug]/publish/route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
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

vi.mock('@/lib/builder/dynamic-record-redirect-lifecycle', () => ({
  applyRecordSlugRedirect: vi.fn(),
}));

vi.mock('@/lib/builder/columns/storage', () => ({
  deletePublishedColumn: vi.fn(),
  readColumnVariant: vi.fn(),
  writePublishedColumn: vi.fn(),
}));

const readColumnVariantMock = vi.mocked(readColumnVariant);
const writePublishedColumnMock = vi.mocked(writePublishedColumn);

function request(path: string): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, { method: 'POST' });
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

describe('/api/builder/columns/[slug]/publish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' } as never);
    readColumnVariantMock.mockResolvedValue(null);
    writePublishedColumnMock.mockImplementation(async (doc) => ({ ...doc, draft: false }));
  });

  it('denies an editor publish before writing a published column', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'Missing permission: publish' }, { status: 403 }) as never,
    );

    const response = await route.POST(
      request('/api/builder/columns/sample-column/publish?locale=ko&skipEmbeddings=1'),
      { params: Promise.resolve({ slug: 'sample-column' }) },
    );

    expect(response.status).toBe(403);
    expect(guardMutation).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { bucket: 'publish', permission: 'publish' },
    );
    expect(writePublishedColumnMock).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when the draft is missing', async () => {
    const response = await route.POST(
      request('/api/builder/columns/missing/publish?locale=zh-hant&skipEmbeddings=1'),
      { params: Promise.resolve({ slug: 'missing' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      success: false,
      error: '找不到要發布的專欄草稿。',
      errorCode: 'draft_not_found',
    });
  });

  it('returns localized stable-code JSON when publish storage fails', async () => {
    readColumnVariantMock
      .mockResolvedValueOnce(column({ locale: 'en' }))
      .mockResolvedValueOnce(null);
    writePublishedColumnMock.mockRejectedValueOnce(new Error('raw blob write failure'));

    const response = await route.POST(
      request('/api/builder/columns/sample-column/publish?locale=en&skipEmbeddings=1'),
      { params: Promise.resolve({ slug: 'sample-column' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      success: false,
      error: 'Unable to publish the column.',
      errorCode: 'column_publish_failed',
    });
    expect(JSON.stringify(data)).not.toContain('raw blob write failure');
  });

  it('sets an original publication timestamp instead of reusing lastmod', async () => {
    readColumnVariantMock
      .mockResolvedValueOnce(column({
        frontmatter: {
          lastmod: '2026-07-30T00:00:00.000Z',
          attorneyReviewStatus: 'reviewed',
          freshness: 'fresh',
        },
      }))
      .mockResolvedValueOnce(null);

    const response = await route.POST(
      request('/api/builder/columns/sample-column/publish?locale=ko&skipEmbeddings=1'),
      { params: Promise.resolve({ slug: 'sample-column' }) },
    );

    expect(response.status).toBe(200);
    expect(writePublishedColumnMock).toHaveBeenCalledWith(
      expect.objectContaining({
        frontmatter: expect.objectContaining({
          lastmod: '2026-07-30T00:00:00.000Z',
          publishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        }),
      }),
    );
  });

  it('preserves the first publication timestamp when republishing', async () => {
    const originalPublishedAt = '2025-09-13T04:00:00.000Z';
    readColumnVariantMock
      .mockResolvedValueOnce(column({
        frontmatter: {
          lastmod: '2026-07-30T00:00:00.000Z',
          attorneyReviewStatus: 'reviewed',
          freshness: 'fresh',
        },
      }))
      .mockResolvedValueOnce(column({
        draft: false,
        updatedAt: '2026-07-01T00:00:00.000Z',
        frontmatter: {
          lastmod: '2026-07-01T00:00:00.000Z',
          publishedAt: originalPublishedAt,
          attorneyReviewStatus: 'reviewed',
          freshness: 'fresh',
        },
      }));

    await route.POST(
      request('/api/builder/columns/sample-column/publish?locale=ko&skipEmbeddings=1'),
      { params: Promise.resolve({ slug: 'sample-column' }) },
    );

    expect(writePublishedColumnMock).toHaveBeenCalledWith(
      expect.objectContaining({
        frontmatter: expect.objectContaining({
          publishedAt: originalPublishedAt,
        }),
      }),
    );
  });
});
