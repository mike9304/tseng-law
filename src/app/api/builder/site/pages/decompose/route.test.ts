import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { USER_DRAFT_UPDATED_BY } from '@/lib/builder/canvas/home-draft-reseed';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writePageCanvas } from '@/lib/builder/site/persistence';
import * as route from '@/app/api/builder/site/pages/decompose/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

// seed-pages imports the whole persistence module; provide every binding it
// references so the module loads, then drive the two the route actually calls.
vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writePageCanvas: vi.fn(),
  createPage: vi.fn(),
  ensureSiteDocument: vi.fn(),
  publishPage: vi.fn(),
  readPageCanvas: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedRead = vi.mocked(readSiteDocument);
const mockedWrite = vi.mocked(writePageCanvas);

function postRequest(body: string | undefined, query = '', headers: HeadersInit = {}): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/site/pages/decompose${query}`,
    { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body },
  );
}

describe('/api/builder/site/pages/decompose', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedRead.mockResolvedValue({
      pages: [{ pageId: 'p-about', slug: 'about', locale: 'ko', isHomePage: false }],
    } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
    mockedWrite.mockResolvedValue(
      undefined as unknown as Awaited<ReturnType<typeof writePageCanvas>>,
    );
  });

  it('rejects an unknown / non-standard slug with a stable error code', async () => {
    const response = await route.POST(
      postRequest(JSON.stringify({ slug: 'not-a-standard-page', locale: 'ko' })),
    );
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.errorCode).toBe('seed_body_invalid');
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('writes the decomposed editable document to the page draft for a standard slug', async () => {
    const response = await route.POST(
      postRequest(JSON.stringify({ slug: 'about', locale: 'ko', siteId: 'default' })),
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toMatchObject({ ok: true, slug: 'about', pageId: 'p-about', locale: 'ko' });
    expect(mockedWrite).toHaveBeenCalledTimes(1);
    const [, pageIdArg, stageArg, docArg, optionsArg] = mockedWrite.mock.calls[0];
    expect(pageIdArg).toBe('p-about');
    expect(stageArg).toBe('draft');
    expect((docArg as { nodes: unknown[] }).nodes.length).toBeGreaterThan(0);
    expect(optionsArg).toMatchObject({ updatedBy: USER_DRAFT_UPDATED_BY });
  });

  it('uses the selected editor site from the referer when legacy clients send default siteId', async () => {
    const response = await route.POST(
      postRequest(
        JSON.stringify({ slug: 'about', locale: 'ko', siteId: 'default' }),
        '',
        { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-b' },
      ),
    );
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toMatchObject({ ok: true, siteId: 'workspace-site-b', pageId: 'p-about' });
    expect(mockedRead).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedWrite.mock.calls[0][0]).toBe('workspace-site-b');
  });

  it('returns an error when the slug has no page on the site', async () => {
    mockedRead.mockResolvedValueOnce(
      { pages: [] } as unknown as Awaited<ReturnType<typeof readSiteDocument>>,
    );
    const response = await route.POST(
      postRequest(JSON.stringify({ slug: 'about', locale: 'ko' })),
    );
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(mockedWrite).not.toHaveBeenCalled();
  });

  it('decomposes the home page (empty slug) for editing', async () => {
    mockedRead.mockResolvedValueOnce(
      { pages: [{ pageId: 'p-home', slug: '', locale: 'ko', isHomePage: true }] } as unknown as Awaited<ReturnType<typeof readSiteDocument>>,
    );
    const response = await route.POST(postRequest(JSON.stringify({ slug: '', locale: 'ko' })));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toMatchObject({ ok: true, slug: '', pageId: 'p-home' });
    expect(mockedWrite).toHaveBeenCalledTimes(1);
    // The decomposed home must be stamped as user work — an unmarked record is
    // what allowed the builder entry point to factory-reseed it (2026-07-02
    // data-loss event).
    expect(mockedWrite.mock.calls[0][4]).toMatchObject({ updatedBy: USER_DRAFT_UPDATED_BY });
  });
});
