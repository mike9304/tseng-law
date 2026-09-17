import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import { teamContent } from '@/data/team-members';

describe('home official portrait', () => {
  it.each(['ko', 'en', 'ja', 'zh-hant'] as const)('uses the profile-linked original for the stock %s home portrait', (locale) => {
    const html = renderToStaticMarkup(<HomeAttorneySplit locale={locale} />);

    expect(html).toContain(encodeURIComponent('/images/team/tseng-junwei.png'));
    expect(html).toContain('width="773"');
    expect(html).toContain('height="865"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('data-builder-surface-key="lead-photo"');
    expect(html).toContain('data-home-stock-portrait="true"');
    expect(html).toContain(`alt="${teamContent[locale].members[0].name} ${teamContent[locale].members[0].role}"`);
  });

  it('retains a custom lead photo instead of substituting the stock original', () => {
    const lead = teamContent.ko.members[0];
    const previous = lead.photo;
    try {
      lead.photo = '/images/custom-author-portrait.webp';
      const html = renderToStaticMarkup(<HomeAttorneySplit locale="ko" />);
      expect(html).toContain(encodeURIComponent(lead.photo));
      expect(html).not.toContain(encodeURIComponent('/images/team/tseng-junwei.png'));
      expect(html).toContain('data-builder-surface-key="lead-photo"');
      expect(html).not.toContain('data-home-stock-portrait=');
    } finally {
      lead.photo = previous;
    }
  });

  it('does not replace another lead member using the same image path', () => {
    const lead = teamContent.ko.members[0];
    const previous = lead.id;
    try {
      lead.id = 'another-team-member';
      const html = renderToStaticMarkup(<HomeAttorneySplit locale="ko" />);
      expect(html).toContain(encodeURIComponent(lead.photo));
      expect(html).not.toContain(encodeURIComponent('/images/team/tseng-junwei.png'));
      expect(html).not.toContain('data-home-stock-portrait=');
    } finally {
      lead.id = previous;
    }
  });
});
