import { describe, expect, it } from 'vitest';
import { findMatchingRedirect } from '@/lib/builder/seo/redirects-edge';
import type { SiteRedirect } from '@/lib/builder/site/types';

function redirect(from: string, to: string): SiteRedirect {
  return {
    redirectId: `redir-${from}`,
    from,
    to,
    type: 301,
    isActive: true,
    createdAt: '2026-05-19T00:00:00.000Z',
  };
}

describe('redirect edge matching', () => {
  it('preserves dynamic URL suffixes for trailing wildcard redirects', () => {
    const match = findMatchingRedirect('/ko/old-columns/post-one', [
      redirect('/ko/old-columns/*', '/ko/new-columns/*'),
    ]);

    expect(match).toMatchObject({
      from: '/ko/old-columns/*',
      to: '/ko/new-columns/post-one',
      type: 301,
    });
  });

  it('prefers exact redirects over wildcard redirects', () => {
    const match = findMatchingRedirect('/ko/old-columns/special', [
      redirect('/ko/old-columns/*', '/ko/new-columns/*'),
      redirect('/ko/old-columns/special', '/ko/special-target'),
    ]);

    expect(match?.to).toBe('/ko/special-target');
  });
});
