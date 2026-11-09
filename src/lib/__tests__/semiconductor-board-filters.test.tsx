import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import SemiconductorGuidePublic from '@/components/semiconductor-drafts/SemiconductorGuidePublic';
import { semiconductorCardVisible } from '@/components/semiconductor-drafts/SemiconductorBoardClient';
import boardColumns from '@/data/semiconductor-board-columns.json';
import { buildSemiconductorBoardHref } from '@/lib/semiconductor-board';
import { getSemiconductorBoardConsultHref } from '@/lib/semiconductor-consult-link';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('subtopic=export-control'),
}));

describe('semiconductor board subtopic filters', () => {
  it('renders every board column in the server HTML with data-subtopics', () => {
    const html = renderToStaticMarkup(<SemiconductorGuidePublic locale="ko" />);
    for (const slug of boardColumns.ko) {
      expect(html).toContain(`data-semiconductor-public-column="${slug}"`);
      expect(html).toContain('data-subtopics=');
    }
    expect(html).toContain(buildSemiconductorBoardHref('ko', null));
    expect(html).toContain(buildSemiconductorBoardHref('ko', 'export-control'));
    expect(html).toContain('aria-live="polite"');
  });

  it('hides non-matching cards client-side when subtopic is in the URL', () => {
    expect(semiconductorCardVisible('export-control contract-payment', 'export-control')).toBe(true);
    expect(semiconductorCardVisible('trade-secrets', 'export-control')).toBe(false);
    expect(semiconductorCardVisible('trade-secrets', null)).toBe(true);
  });

  it('uses contact form href for semiconductor consult when not on static site', () => {
    expect(getSemiconductorBoardConsultHref('ko')).toBe('/ko/contact?topic=semiconductor');
  });
});
