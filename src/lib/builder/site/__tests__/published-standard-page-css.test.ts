import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('published standard page CSS guards', () => {
  it('keeps legacy pricing block margins from shifting builder nodes', () => {
    const globals = read('src/app/globals.css');
    const publishedPage = read('src/lib/builder/site/public-page.tsx');

    expect(globals).toContain('.pricing-disclaimer {');
    expect(globals).toContain('max-width: 680px;');
    expect(globals).toContain('.pricing-cta {');
    expect(globals).toContain('margin-top: var(--space-6);');

    expect(publishedPage).toContain('.builder-pub-node .pricing-disclaimer {');
    expect(publishedPage).toContain('max-width: none;');
    expect(publishedPage).toContain('margin: 0;');
    expect(publishedPage).toContain('.builder-pub-node .pricing-cta {');
  });

  it('mirrors legacy hero-adjacent section padding through builder wrappers', () => {
    const globals = read('src/app/globals.css');
    const publishedPage = read('src/lib/builder/site/public-page.tsx');

    expect(globals).toContain('.hero + .reveal > .section {');
    expect(globals).toContain('padding-top: clamp(3.2rem, 7.2vw, 5rem);');
    expect(globals).toContain('padding-top: clamp(2.8rem, 8vw, 4rem);');

    expect(publishedPage).toContain("marginTop: flowAsSection ? (flowSectionMetric?.marginTop ?? 0) : undefined,");
    expect(publishedPage).toContain(
      ".builder-pub-node[data-node-id='home-hero-root'] + .builder-pub-node[data-builder-flow-section='true'] .section,",
    );
    expect(publishedPage).toContain(
      ".builder-pub-node[data-node-id='home-hero'] + .builder-pub-node[data-builder-flow-section='true'] .section {",
    );
    expect(publishedPage).toContain('padding-top: clamp(3.2rem, 7.2vw, 5rem);');
    expect(publishedPage).toContain('padding-top: clamp(2.8rem, 8vw, 4rem);');
  });

  it('keeps the published columns archive in two columns on tablet widths', () => {
    const blogFeedCss = read('src/lib/builder/components/blogFeed/BlogFeed.module.css');

    expect(blogFeedCss).toContain('@container (max-width: 760px)');
    expect(blogFeedCss).toContain('@container (min-width: 641px) and (max-width: 900px)');
    expect(blogFeedCss).toContain('.archiveRoot.layoutGrid .feedSurface');
    expect(blogFeedCss).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
  });

  it('prevents the global site main offset from reaching published builder canvases on mobile and tablet', () => {
    const globals = read('src/app/globals.css');
    const publishedPage = read('src/lib/builder/site/public-page.tsx');

    expect(globals).toContain('.site main {');
    expect(globals).toContain('padding-top: var(--header-offset-desktop);');
    expect(globals).toContain('@media (max-width: 1024px)');
    expect(globals).toContain('padding-top: 72px;');

    expect(publishedPage).toContain('@media (max-width: 1023px)');
    expect(publishedPage).toContain('.site .builder-pub-main.builder-pub-main {');
    expect(publishedPage).toContain('margin-top: 0 !important;');
    expect(publishedPage).toContain('padding-top: 0 !important;');
    expect(publishedPage).toContain('padding-block-start: 0 !important;');
  });
});
