import { describe, expect, it } from 'vitest';
import { matchRedirect, validateRedirectInput } from '@/lib/builder/site/redirects';
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

describe('redirect matching', () => {
  it('prefers exact matches over wildcard matches', () => {
    const rules = [
      redirect('/ko/old-columns/*', '/ko/new-columns/*'),
      redirect('/ko/old-columns/special', '/ko/special-target'),
    ];

    expect(matchRedirect('/ko/old-columns/special', rules)?.to).toBe('/ko/special-target');
    expect(findMatchingRedirect('/ko/old-columns/special', rules)?.to).toBe('/ko/special-target');
  });

  it('preserves suffixes for the longest matching prefix rule', () => {
    const rules = [
      redirect('/ko/old/*', '/ko/new/*'),
      redirect('/ko/old/columns/*', '/ko/new-columns/*'),
    ];

    expect(matchRedirect('/ko/old/columns/post-one', rules)).toMatchObject({
      from: '/ko/old/columns/*',
      to: '/ko/new-columns/post-one',
      type: 301,
    });
    expect(findMatchingRedirect('/ko/old/columns/post-one', rules)).toMatchObject({
      from: '/ko/old/columns/*',
      to: '/ko/new-columns/post-one',
      type: 301,
    });
  });

  it('ignores inactive rules and non-path inputs', () => {
    const rules = [
      { ...redirect('/ko/old/*', '/ko/new/*'), isActive: false },
      redirect('/ko/active', '/ko/target'),
    ];

    expect(matchRedirect('ko/active', rules)).toBeNull();
    expect(findMatchingRedirect('ko/active', rules)).toBeNull();
    expect(matchRedirect('/ko/old/post-one', rules)).toBeNull();
    expect(findMatchingRedirect('/ko/old/post-one', rules)).toBeNull();
  });

  it('diagnoses active wildcard redirect overlaps before authors create ambiguous coverage', () => {
    const error = validateRedirectInput(
      {
        from: '/ko/old/columns/*',
        to: '/ko/new-columns/*',
        type: 301,
        isActive: true,
      },
      [redirect('/ko/old/*', '/ko/new/*')],
    );

    expect(error).toMatchObject({
      field: 'from',
      code: 'wildcard-overlap',
      diagnostic: {
        code: 'wildcard-overlap',
        conflictingFrom: '/ko/old/*',
        conflictingRedirectId: 'redir-/ko/old/*',
      },
    });
  });

  it('allows inactive wildcard drafts to overlap without becoming active coverage', () => {
    expect(validateRedirectInput(
      {
        from: '/ko/old/columns/*',
        to: '/ko/new-columns/*',
        type: 301,
        isActive: false,
      },
      [redirect('/ko/old/*', '/ko/new/*')],
    )).toBeNull();
  });
});
