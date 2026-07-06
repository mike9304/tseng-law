import { describe, expect, it } from 'vitest';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

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
