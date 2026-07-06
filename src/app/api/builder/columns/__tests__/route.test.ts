import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { listColumns, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';
import * as route from '@/app/api/builder/columns/route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordColumnEvent: vi.fn(),
}));

vi.mock('@/lib/builder/columns/storage', () => ({
  listColumns: vi.fn(),
  readColumnBundle: vi.fn(),
  writeDraftColumn: vi.fn(),
}));

const listColumnsMock = vi.mocked(listColumns);
const readColumnBundleMock = vi.mocked(readColumnBundle);
const writeDraftColumnMock = vi.mocked(writeDraftColumn);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/columns${query}`);
}

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/columns${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
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

describe('/api/builder/columns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireBuilderAdminAuth).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' } as never);
    listColumnsMock.mockResolvedValue([]);
    readColumnBundleMock.mockResolvedValue({
      slug: 'sample-column',
      locale: 'ko',
      draft: null,
      published: null,
      preferred: null,
      backend: 'file',
    });
    writeDraftColumnMock.mockImplementation(async (doc) => doc);
  });

  it('returns localized stable-code JSON when the list load fails', async () => {
    listColumnsMock.mockRejectedValueOnce(new Error('raw column list failure'));
    const response = await route.GET(getRequest('?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入專欄清單。',
      errorCode: 'columns_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('raw column list failure');
  });

  it('returns localized stable-code JSON for malformed create payloads', async () => {
    const response = await route.POST(postRequest('{', '?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the column request format.',
      errorCode: 'invalid_json',
    });
    expect(readColumnBundleMock).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for duplicate column slugs', async () => {
    const existing = column({ slug: 'existing', locale: 'zh-hant' });
    readColumnBundleMock.mockResolvedValueOnce({
      slug: 'existing',
      locale: 'zh-hant',
      draft: existing,
      published: null,
      preferred: existing,
      backend: 'file',
    });

    const response = await route.POST(postRequest({
      locale: 'zh-hant',
      slug: 'existing',
      title: '既有專欄',
    }));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toMatchObject({
      ok: false,
      error: '已存在相同網址的專欄。',
      errorCode: 'column_already_exists',
      slug: 'existing',
      locale: 'zh-hant',
    });
    expect(writeDraftColumnMock).not.toHaveBeenCalled();
  });

  it('preserves the create success shape', async () => {
    const response = await route.POST(postRequest({
      locale: 'ko',
      slug: 'new-column',
      title: '새 칼럼',
      summary: '요약',
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toMatchObject({
      ok: true,
      column: {
        slug: 'new-column',
        locale: 'ko',
        title: '새 칼럼',
      },
    });
  });
});
