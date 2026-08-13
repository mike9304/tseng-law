import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { runAllChecks } from '@/lib/builder/publish-gate/gate-runner';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { GET } from './route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'editor',
    permission: 'edit-pages',
  })),
}));

vi.mock('@/lib/builder/publish-gate/gate-runner', () => ({
  runAllChecks: vi.fn(async () => ({
    checks: [],
    blockers: [],
    warnings: [],
  })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(async () => ({ version: 1, locale: 'ko', nodes: [] })),
  readSiteDocument: vi.fn(async () => ({
    pages: [{ pageId: 'page-home', slug: '', locale: 'ko' }],
  })),
}));

function request(): NextRequest {
  return new NextRequest(
    'https://law.example.test/api/builder/publish/validate?pageId=page-home&locale=ko&siteId=default',
  );
}

describe('GET /api/builder/publish/validate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires edit-pages before running publish validation', async () => {
    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'edit-pages',
    );
    expect(readSiteDocument).toHaveBeenCalledOnce();
    expect(readPageCanvas).toHaveBeenCalledOnce();
    expect(runAllChecks).toHaveBeenCalledWith(
      expect.objectContaining({ nodes: [] }),
      expect.objectContaining({ pageId: 'page-home' }),
      expect.objectContaining({ pages: expect.any(Array) }),
      'default',
    );
  });

  it('returns a permission denial before reading or validating publish state', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }),
    );

    const response = await GET(request());

    expect(response.status).toBe(403);
    expect(readSiteDocument).not.toHaveBeenCalled();
    expect(readPageCanvas).not.toHaveBeenCalled();
    expect(runAllChecks).not.toHaveBeenCalled();
  });
});
