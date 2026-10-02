import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { getAllColumnPosts, getAllIssuePosts, getColumnPost } from '@/lib/columns';
import { parseTrafficBoardQuery } from '@/lib/traffic-collection';
import { loadTrafficCollection, type TrafficCollectionSources } from '@/lib/traffic-collection-server';
import TrafficBoard from '../TrafficBoard';

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
  return renderToStaticMarkup(<TrafficBoard locale={locale} items={items} query={parseTrafficBoardQuery(params)} />);
}

describe('TrafficBoard SSR', () => {
  it('renders a GET search form, populated subject filters and every original article link', async () => {
    const html = await render('zh-hant');
    expect(html).toMatch(/<form[^>]*role="search"[^>]*method="get"[^>]*action="\/zh-hant\/traffic-accidents#articles"/);
    expect(html).toMatch(/<label[^>]*for="traffic-board-q"/);
    expect(html).toMatch(/<input[^>]*id="traffic-board-q"[^>]*name="q"/);
    expect(html).toContain('href="/zh-hant/traffic-accidents?subject=liability#articles"');
    expect(html).toContain('href="/zh-hant/traffic-accidents?subject=evidence#articles"');
    expect(html).toContain('href="/zh-hant/traffic-accidents?subject=procedure#articles"');
    // The first compensation article enables its existing subject filter.
    expect(html).toContain('subject=compensation');
    expect(html).toContain('href="/zh-hant/traffic-accidents?video=1#articles"');
    for (const slug of [
      'taiwan-truck-blocking-multiple-dashcam-evidence',
      'taiwan-racing-no-contact-joint-tort-liability',
      'taiwan-retaliatory-driving-rear-ended-intentional-injury',
      'taiwan-car-repair-rental-cost-repair-period-evidence',
      'taiwan-accident-family-care-necessity-period',
      'taiwan-car-accident-work-loss-rest-note',
      'taiwan-accident-assessment-secondary-cause-compensation-ratio',
      'taiwan-mediation-delayed-injury-rescission',
      'taiwan-car-repair-cost-estimate-parts-depreciation',
      'taiwan-borrowed-car-owner-driver-key-custody-liability',
      'taiwan-accident-stop-dialogue-hit-and-run-evidence',
      'taiwan-bus-sudden-braking-passenger-carrier-liability',
      'taiwan-chain-rear-end-first-impact-evidence',
      'taiwan-roadside-starting-parking-exit-liability',
      'taiwan-car-door-opening-motorcycle-liability',
      'taiwan-flashing-red-yellow-intersection-liability',
      'taiwan-right-turn-car-straight-motorcycle-evidence',
      'taiwan-lane-change-side-rear-collision-liability',
      'taiwan-left-turn-vs-straight-motorcycle',
      'taiwan-accident-police-records',
      'taiwan-overtaking-accident-liability',
      'taiwan-traffic-accident-procedure',
    ]) {
      expect(html).toContain(`href="/zh-hant/columns/${slug}"`);
    }
    expect(html.match(/data-traffic-board-row/g)).toHaveLength(22);
    expect(html).toMatch(/<time datetime="2026-10-02">/i);
    expect(html).toContain('約7分鐘閱讀');
    expect(html).toContain('法律AI助理');
    // No clear-all link without an active filter.
    expect(html).not.toContain('data-traffic-board-clear');
  });

  it('ships summaries but never article bodies', async () => {
    const html = await render('zh-hant');
    const body = getColumnPost('taiwan-car-door-opening-motorcycle-liability', 'zh-hant')!.content;
    const bodySentence = body.split('\n').find((line) => line.includes('臺灣士林地方法院'))!;
    expect(bodySentence).toBeTruthy();
    expect(html).not.toContain('臺灣士林地方法院');
  });

  it('applies URL filters and offers clear-all and an empty state', async () => {
    const filtered = await render('zh-hant', { subject: 'evidence' });
    expect(filtered.match(/data-traffic-board-row/g)).toHaveLength(6);
    expect(filtered).toContain('aria-current="true"');
    expect(filtered).toMatch(/<input type="hidden" name="subject" value="evidence"/);
    expect(filtered).toContain('href="/zh-hant/traffic-accidents#articles" data-traffic-board-clear');

    const empty = await render('zh-hant', { q: '不存在的關鍵字' });
    expect(empty).not.toContain('data-traffic-board-row');
    expect(empty).toContain('data-traffic-board-empty');
    expect(empty).toContain('value="不存在的關鍵字"');

    const unknown = await render('zh-hant', { subject: 'nonsense', page: '3' });
    expect(unknown.match(/data-traffic-board-row/g)).toHaveLength(22);
  });

  it('escapes the search value', async () => {
    const html = await render('en', { q: '"><script>alert(1)</script>' });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('marks playable diagrams and reviewed generated scenes as videos', async () => {
    const html = await render('ja');
    expect(html.match(/data-traffic-board-row/g)).toHaveLength(3);
    // ja: overtaking has a video diagram; accident procedure has a reviewed scene.
    expect(html.match(/data-traffic-board-video/g)).toHaveLength(2);
    const filtered = await render('ja', { video: '1' });
    expect(filtered.match(/data-traffic-board-row/g)).toHaveLength(2);
    expect(filtered).toContain('href="/ja/columns/taiwan-overtaking-accident-liability"');
    expect(filtered).toContain('href="/ja/columns/taiwan-traffic-accident-procedure"');
    expect(filtered).not.toContain('href="/ja/columns/taiwan-accident-police-records"');
  });
});

describe('traffic hub route', () => {
  const page = fs.readFileSync(path.join(process.cwd(), 'src/app/[locale]/traffic-accidents/page.tsx'), 'utf8');
  const view = fs.readFileSync(path.join(process.cwd(), 'src/app/[locale]/traffic-accidents/TrafficPageView.tsx'), 'utf8');

  it('no longer reads the deprecated static slug list and renders the board above the video', () => {
    expect(page).not.toMatch(/trafficColumnSlugsFor\(/);
    expect(page).toContain('loadTrafficCollection');
    expect(view.indexOf('id="articles"')).toBeGreaterThan(-1);
    expect(view.indexOf('id="articles"')).toBeLessThan(view.indexOf('<TrafficDiagramFigure'));
    expect(page).toMatch(/export const dynamic = 'force-dynamic'/);
    expect(page).toContain('buildCollectionPageJsonLd');
  });

  it('drops the obsolete zh-hant #articles card-grid rules', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/[locale]/traffic-accidents/ZhHantTraffic.module.css'), 'utf8');
    expect(css).not.toMatch(/#articles\)\s*>\s*div:last-child/);
  });
});
