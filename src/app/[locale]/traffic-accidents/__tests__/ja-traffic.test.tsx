import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { getAllColumnPosts, getAllIssuePosts } from '@/lib/columns';
import { trafficHubCopy } from '@/data/traffic-hub';
import { parseTrafficBoardQuery } from '@/lib/traffic-collection';
import { loadTrafficCollection, type TrafficCollectionSources } from '@/lib/traffic-collection-server';
import TrafficPageView from '../TrafficPageView';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const fileSources: TrafficCollectionSources = {
  filePosts: (locale) => getAllColumnPosts(locale),
  mergedPosts: async (locale) => getAllColumnPosts(locale),
  issuePosts: (locale) => getAllIssuePosts(locale),
};

async function render(locale: 'ko' | 'zh-hant' | 'en' | 'ja', params: Record<string, string> = {}) {
  const items = await loadTrafficCollection(locale, fileSources);
  return renderToStaticMarkup(
    <TrafficPageView
      locale={locale}
      items={items}
      query={parseTrafficBoardQuery(params)}
      copy={trafficHubCopy[locale]}
      collectionJsonLd={{ '@type': 'CollectionPage', name: trafficHubCopy[locale].columns }}
    />,
  );
}

describe('ja traffic hub (昊 V2 inner page on the board)', () => {
  it('renders the hub inside the ja shell with one H1, the band, glyph-tile hooks and the dusk closing tile', async () => {
    const html = await render('ja');
    expect(html).toMatch(/<div[^>]*id="ja-traffic"[^>]*data-ja-design="traffic"[^>]*data-ja-v2=""/);
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html.match(/data-traffic-board-row/g)).toHaveLength(6);
    expect(html.match(/data-ja-subject="(procedure|evidence|liability|compensation|general)"/g)).toHaveLength(6);
    // Arrow glyphs become CSS chevrons on ja; the external ↗ stays.
    expect(html).not.toMatch(/ [→↓]/);
    expect(html).toContain('↗');
    const closing = html.match(/<section[^>]*aria-labelledby="contact-title"[\s\S]*?<h2 id="contact-title"[^>]*>([\s\S]*?)<\/h2>/);
    expect(closing?.[1].replace(/<[^>]+>/g, '')).toBe(trafficHubCopy.ja.contactTitle);
    expect(html).toContain('href="/ja/contact"');
    expect(html).toContain('href="#articles"');
    expect(html).toContain('application/ld+json');
    expect(html).not.toMatch(/<(strong|b)[\s>]/);
    expect(html).not.toMatch(/AIアシスタント|法律AI/);
  });

  it('keeps the H1 text and its authored line break', async () => {
    const html = await render('ja');
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)![1].replace(/<[^>]+>/g, '');
    expect(h1).toBe(trafficHubCopy.ja.title);
  });

  it('keeps the filtered board state on ja', async () => {
    const html = await render('ja', { subject: 'liability' });
    expect(html.match(/data-traffic-board-row/g)).toHaveLength(3);
    expect(html).toContain('data-traffic-board-clear');
  });

  it('renders no ja wrapper or ja hooks in the other locales', async () => {
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const html = await render(locale);
      expect(html, locale).not.toContain('ja-traffic');
      expect(html, locale).not.toContain('data-ja-');
      expect(html.match(/<h1[\s>]/g), locale).toHaveLength(1);
    }
  });
});
