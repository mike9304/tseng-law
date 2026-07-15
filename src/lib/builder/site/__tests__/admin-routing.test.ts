import { describe, expect, it } from 'vitest';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';

describe('builder admin site routing', () => {
  it('uses the explicit query site id when present', () => {
    const request = new Request('https://law.example.test/api/builder/site/pages?siteId=workspace-site-b');

    expect(resolveBuilderSiteIdFromRequest(request)).toBe('workspace-site-b');
  });

  it('falls back to the admin-builder referer site id before the default site', () => {
    const request = new Request('https://law.example.test/api/builder/site/pages?locale=ko', {
      headers: {
        referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=home',
      },
    });

    expect(resolveBuilderSiteIdFromRequest(request)).toBe('workspace-site-b');
  });

  it('lets the referer override a legacy default body site id', () => {
    const request = new Request('https://law.example.test/api/builder/site/publish-checks?locale=ko', {
      headers: {
        referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-c',
      },
    });

    expect(resolveBuilderSiteIdFromRequest(request, 'default')).toBe('workspace-site-c');
  });
});

describe('strict builder mutation site routing', () => {
  it('uses the default only when siteId is genuinely omitted', () => {
    const result = resolveBuilderSiteIdForMutationFromRequest(
      new Request('https://law.example.test/api/builder/site/pages'),
    );

    expect(result).toEqual({ ok: true, siteId: 'tseng-law-main-site' });
  });

  it.each([
    '?siteId=',
    '?siteId=undefined',
    '?siteId=null',
    '?siteId=..%2F..%2Fx',
    '?siteId=workspace-a&siteId=workspace-b',
  ])('returns a sanitized 400 for supplied invalid query %s', async (query) => {
    const result = resolveBuilderSiteIdForMutationFromRequest(
      new Request(`https://law.example.test/api/builder/site/pages${query}`),
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toEqual({
      ok: false,
      success: false,
      error: 'Invalid site identifier.',
      errorCode: 'invalid_site_id',
    });
  });

  it.each([null, '', 'undefined', '../../x', ['workspace-a']])(
    'rejects supplied invalid explicit value %# without exposing it',
    async (explicitSiteId) => {
      const result = resolveBuilderSiteIdForMutationFromRequest(
        new Request('https://law.example.test/api/builder/site/pages'),
        explicitSiteId,
      );

      expect(result.ok).toBe(false);
      if (result.ok) return;
      const payload = await result.response.json() as Record<string, unknown>;
      expect(result.response.status).toBe(400);
      expect(payload.errorCode).toBe('invalid_site_id');
      expect(JSON.stringify(payload)).not.toContain('../../x');
      expect(JSON.stringify(payload)).not.toContain('undefined');
    },
  );

  it('keeps safe explicit custom ids and the documented legacy alias behavior', () => {
    const request = new Request('https://law.example.test/api/builder/site/pages');
    expect(resolveBuilderSiteIdForMutationFromRequest(request, 'customer-site_2'))
      .toEqual({ ok: true, siteId: 'customer-site_2' });
    expect(resolveBuilderSiteIdForMutationFromRequest(request, 'default'))
      .toEqual({ ok: true, siteId: 'tseng-law-main-site' });
  });

  it.each([
    {
      label: 'query and body',
      request: new Request('https://law.example.test/api/builder/site/pages?siteId=workspace-query'),
      explicitSiteId: 'workspace-body',
    },
    {
      label: 'query and referer',
      request: new Request(
        'https://law.example.test/api/builder/site/pages?siteId=workspace-query',
        { headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-referer' } },
      ),
      explicitSiteId: undefined,
    },
    {
      label: 'body and referer',
      request: new Request('https://law.example.test/api/builder/site/pages', {
        headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-referer' },
      }),
      explicitSiteId: 'workspace-body',
    },
    {
      label: 'query, body, and referer',
      request: new Request(
        'https://law.example.test/api/builder/site/pages?siteId=workspace-query',
        { headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-referer' } },
      ),
      explicitSiteId: 'workspace-body',
    },
  ])('rejects conflicting $label mutation signals', async ({ request, explicitSiteId }) => {
    const result = resolveBuilderSiteIdForMutationFromRequest(request, explicitSiteId);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toMatchObject({
      ok: false,
      success: false,
      errorCode: 'invalid_site_id',
    });
  });

  it('allows identical query, body, referer, and duplicate query signals', () => {
    const request = new Request(
      'https://law.example.test/api/builder/site/pages?siteId=Workspace%2DNorth&siteId=Workspace-North',
      { headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=Workspace-North' } },
    );

    expect(resolveBuilderSiteIdForMutationFromRequest(request, 'Workspace-North'))
      .toEqual({ ok: true, siteId: 'Workspace-North' });
  });

  it('normalizes legacy aliases while preserving the selected-site fallback contract', () => {
    const selectedSiteRequest = new Request('https://law.example.test/api/builder/site/pages', {
      headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-selected' },
    });
    expect(resolveBuilderSiteIdForMutationFromRequest(selectedSiteRequest, 'default'))
      .toEqual({ ok: true, siteId: 'workspace-selected' });

    const canonicalRequest = new Request(
      'https://law.example.test/api/builder/site/pages?siteId=default',
      { headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=tseng-law-main-site' } },
    );
    expect(resolveBuilderSiteIdForMutationFromRequest(canonicalRequest, 'default'))
      .toEqual({ ok: true, siteId: 'tseng-law-main-site' });
  });

  it('treats differently-cased ids as different schema-valid site ids', async () => {
    const request = new Request(
      'https://law.example.test/api/builder/site/pages?siteId=Workspace-North',
      { headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-north' } },
    );
    const result = resolveBuilderSiteIdForMutationFromRequest(request);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    await expect(result.response.json()).resolves.toMatchObject({ errorCode: 'invalid_site_id' });
  });

  it.each([
    {
      label: 'malformed referer signal after a valid query',
      request: new Request(
        'https://law.example.test/api/builder/site/pages?siteId=workspace-safe',
        { headers: { referer: 'https://law.example.test/ko/admin-builder?siteId=..%2Funsafe' } },
      ),
      explicitSiteId: undefined,
    },
    {
      label: 'malformed body signal after a valid query',
      request: new Request(
        'https://law.example.test/api/builder/site/pages?siteId=workspace-safe',
      ),
      explicitSiteId: '../../unsafe',
    },
  ])('rejects a $label instead of priority-selecting', async ({ request, explicitSiteId }) => {
    const result = resolveBuilderSiteIdForMutationFromRequest(request, explicitSiteId);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toMatchObject({ errorCode: 'invalid_site_id' });
  });
});
