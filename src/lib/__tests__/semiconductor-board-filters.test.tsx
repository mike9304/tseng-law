import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SemiconductorGuidePublic from '@/components/semiconductor-drafts/SemiconductorGuidePublic';
import boardColumns from '@/data/semiconductor-board-columns.json';
import { buildSemiconductorBoardHref } from '@/lib/semiconductor-board';

describe('semiconductor board subtopic filters', () => {
  it('renders chip links without JavaScript and filters columns server-side', () => {
    const html = renderToStaticMarkup(
      <SemiconductorGuidePublic locale="ko" subtopic="export-control" />,
    );
    expect(html).toContain('href="/ko/contact?topic=semiconductor"');
    expect(html).toContain(buildSemiconductorBoardHref('ko', null));
    expect(html).toContain(buildSemiconductorBoardHref('ko', 'export-control'));
    expect(html).toContain('data-semiconductor-subtopic="export-control"');
    const allowed = new Set(
      boardColumns.ko.filter((slug) => html.includes(`data-semiconductor-public-column="${slug}"`)),
    );
    expect(allowed.size).toBeGreaterThan(0);
    expect(allowed.size).toBeLessThan(boardColumns.ko.length);
  });
});
