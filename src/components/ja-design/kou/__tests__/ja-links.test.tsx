import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ServicesBento from '@/components/ServicesBento';
import { getOverseasEntryContent } from '@/components/EnAcquisitionGuideLinks';
import { getAllColumnPosts } from '@/lib/columns';
import { getServiceSlugs } from '@/data/service-details';
import { JA_SERVICE_ORDER } from '@/components/ja-design/ja-arrangement';
import JaPracticeIndex, { getJaPracticeAreas } from '../JaPracticeIndex';
import JaNeeds from '../JaNeeds';
import { SUKASHI_PAIRS, sukashiHref, sukashiLinkLabel } from '../sukashi-pairs';

describe('ja home links (CONCEPT-V2 §15.4)', () => {
  it('practice index links equal what ServicesBento renders for ja (href and aria-label)', () => {
    const bento = renderToStaticMarkup(<ServicesBento locale="ja" order={JA_SERVICE_ORDER} />);
    const links = (markup: string) =>
      [...markup.matchAll(/<a\b[^>]*>/g)]
        .map((m) => [m[0].match(/href="([^"]+)"/)?.[1], m[0].match(/aria-label="([^"]+)"/)?.[1]])
        .filter(([href, label]) => href?.startsWith('/ja/services/') && label);
    const bentoLinks = links(bento);
    const ours = getJaPracticeAreas().map((area) => [area.href, area.ariaLabel]);
    expect(ours).toEqual(bentoLinks);
    const html = renderToStaticMarkup(<JaPracticeIndex />);
    expect(links(html)).toEqual(ours);
  });

  it('needs tiles link to the entry-block data in order', () => {
    const html = renderToStaticMarkup(<JaNeeds />);
    const hrefs = [...html.matchAll(/<a[^>]*class="[^"]*tile[^"]*"[^>]*href="([^"]+)"|<a[^>]*href="([^"]+)"[^>]*class="[^"]*tile[^"]*"/g)].map((m) => m[1] ?? m[2]);
    expect(hrefs).toEqual(getOverseasEntryContent('ja')!.items.map((item) => item.href));
    expect(html).toContain('id="overseas-entry-full-heading"');
  });

  it('every 透かし summary link targets an existing ja column or service, labelled with its existing title', () => {
    const columns = new Set(getAllColumnPosts('ja').map((post) => post.slug));
    const services = new Set(getServiceSlugs());
    for (const pair of SUKASHI_PAIRS) {
      if (pair.link.kind === 'column') expect(columns.has(pair.link.slug), pair.link.slug).toBe(true);
      else expect(services.has(pair.link.slug), pair.link.slug).toBe(true);
      expect(sukashiHref(pair)).toMatch(/^\/ja\/(columns|services)\//);
      expect(sukashiLinkLabel(pair).length).toBeGreaterThan(0);
    }
  });
});
