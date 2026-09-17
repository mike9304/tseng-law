import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS,
  JULY_ADMITTED_GEOMETRY_SKIP_SELECTOR,
  JULY_PUBLISHED_HOME_EDITORIAL_CSS,
  JULY_SHARED_RESULTS_PRIMITIVE_ID,
  applyJulySafeExpandedGeometry,
  shouldSkipJulyPublishedGeometry,
} from '@/lib/builder/site/published-home-editorial';

function fakeStyle(initial: Record<string, string> = {}) {
  const props = { ...initial };
  return {
    get minHeight() {
      return props['min-height'] ?? '';
    },
    setProperty(name: string, value: string) {
      props[name] = value;
    },
    removeProperty(name: string) {
      delete props[name];
    },
  };
}

describe('July admitted geometry skip', () => {
  it('does not add a display rule for the results primitive in July editorial CSS', () => {
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).not.toContain(JULY_SHARED_RESULTS_PRIMITIVE_ID);
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).not.toMatch(/home-case-results-root/);
  });

  it('groups July desktop body sections with inset and node-id tracks', () => {
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('max-width: 1200px');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('grid-template-columns: minmax(320px, 400px) minmax(0, 760px)');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-attorney-badge'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('position: absolute');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-insights-view-all'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-offices-tab-0'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('order: 1');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-offices-layout-0-map-fallback'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-contact-ai-guide-copy'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('minmax(0, 7fr) minmax(0, 5fr)');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('repeat(4, minmax(0, 1fr))');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('max-width: none');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('padding-inline: max(20px, calc((100% - 1200px) / 2 + 20px))');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.stats-grid');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.office-layout');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-stats-container'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-container'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-list'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-item-0'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-item-0-question'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-item-0-answer'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-item-12'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-stats-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('right calc(max(20px, (100vw - min(100vw, 1200px)) / 2 + 20px)) center');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-contact-root'] .home-contact-cta");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).not.toMatch(
      /\.builder-pub-main\[data-home-editorial='july'\] \.home-contact-cta:not\(/,
    );
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.split-section');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.split-content');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).not.toMatch(/home-case-results-root/);
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-attorney-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-stats-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-insights-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-faq-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-offices-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-contact-title'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('font-family: var(--font-heading-zh)');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain(".faq-question[aria-expanded='true'] .faq-arrow");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('transform: rotate(90deg)');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('display: inline-flex');
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain("data-node-id='home-stats-progress-0'");
    expect(JULY_PUBLISHED_HOME_EDITORIAL_CSS).toContain('background: var(--gold)');
  });

  it('scopes current9 legacy-inheritance CSS to the current9 marker', () => {
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain("[data-cta='home-ai-intake-entry']");
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.split-image--portrait::after');
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain('.insights-list-thumb');
    expect(CURRENT9_PUBLISHED_HOME_EDITORIAL_CSS).toContain('max-height: 180px');
    const render = readFileSync(
      join(process.cwd(), 'src/lib/builder/components/composite/Render.tsx'),
      'utf8',
    );
    expect(render).toMatch(/InsightsArchiveSection[\s\S]*presentation=\{publishEditorial \? 'editorial' : undefined\}/);
    expect(render).toMatch(/HomeAttorneySplit[\s\S]*presentation=\{publishEditorial \? 'editorial' : undefined\}/);
    expect(render).toMatch(/OfficeMapTabs[\s\S]*presentation=\{publishEditorial \? 'editorial' : undefined\}/);
  });

  it('leaves minHeight empty on the July skip path after an open toggle', () => {
    const july = { closest: (selector: string) => (selector === JULY_ADMITTED_GEOMETRY_SKIP_SELECTOR ? {} : null) };
    expect(shouldSkipJulyPublishedGeometry(july)).toBe(true);
    const style = fakeStyle({ 'min-height': '1582px', height: '1582px' });
    applyJulySafeExpandedGeometry(style, true);
    expect(style.minHeight).toBe('');
    applyJulySafeExpandedGeometry(style, false);
    expect(style.minHeight).toBe('');
    const interactions = readFileSync(
      join(process.cwd(), 'src/components/builder/published/PublishedInteractions.tsx'),
      'utf8',
    );
    expect(interactions).toContain("from '@/lib/builder/site/published-home-editorial'");
    expect(interactions).toContain('applyJulySafeExpandedGeometry');
    expect(interactions).toContain('shouldSkipJulyPublishedGeometry');
    expect(interactions).not.toMatch(/function shouldSkipJulyPublishedGeometry/);
    expect(interactions).not.toMatch(/function applyJulySafeExpandedGeometry/);
  });
});
