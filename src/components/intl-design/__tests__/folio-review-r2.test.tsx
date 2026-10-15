import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/fr/columns',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import ColumnsGrid, { type ColumnListItem } from '@/components/ColumnsGrid';
import { getColumnGeneratedVideos } from '@/data/column-generated-videos';
import { folioColumnsCopy } from '@/data/intl-design-columns-ui';
import { buildFolioAuthorityCard } from '@/lib/intl-design-article';
import { INTL_DESIGN_LOCALES } from '@/lib/intl-design-locales';

/** Review round 2: footer language menu, menu row, Thai recommendation titles, film labels, lighter Folio markup. */

const read = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8');
const css = read('src/components/intl-design/folio.css').replace(/\/\*[\s\S]*?\*\//g, '');
const globals = read('src/app/globals.css');
type Rule = { selector: string; body: string };
const rules: Rule[] = [...css.matchAll(/([^{};]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim().replace(/\s+/g, ' '), body: m[2] }));
const rule = (selector: string) => rules.filter((r) => r.selector.split(/,\s*/).includes(selector)).map((r) => r.body).join(';');

describe('footer language menu (paper sheet inside the night footer)', () => {
  it('uses ink text for every item, the current one included, and the paper focus colour', () => {
    const sheet = rule('.intl-folio .site-footer .locale-flag-switcher ul');
    expect(sheet).toMatch(/--f-focus:\s*var\(--f-sign\)/);
    expect(sheet).toMatch(/background:\s*var\(--f-paper\)\s*!important/);
    for (const selector of [
      '.intl-folio .site-footer .locale-flag-switcher ul a',
      ".intl-folio .site-footer .locale-flag-switcher ul a[aria-current='page']",
    ]) {
      expect(rule(selector), selector).toMatch(/color:\s*var\(--f-ink\)\s*!important/);
    }
    // The shared rules it has to beat: white sheet, inherited/white text.
    expect(read('src/components/LocaleFlagSwitcher.module.css')).toMatch(/background:\s*#fff/);
    expect(read('src/components/PublicChrome.module.css')).toMatch(/footer-locale-switch\)\s*:global\(a\[aria-current='page'\]\)\s*\{\s*color:\s*#fff/);
  });
});

describe('desktop menu row', () => {
  it('lowers the shared 50px minimum to the 44px row', () => {
    expect(globals).toMatch(/\.nav-link \{[^}]*min-height: 50px/);
    const link = rule('.intl-folio .header .main-nav .nav-link');
    expect(link).toMatch(/height:\s*44px/);
    expect(link).toMatch(/min-height:\s*44px/);
  });
});

describe('Thai recommendation titles', () => {
  it('undo every part of the shared two-line clamp (DIRECTION: no clamp on Thai titles)', () => {
    const shared = /\.recommended-for-you-card-title \{([^}]*)\}/.exec(globals)?.[1] ?? '';
    expect(shared).toMatch(/display: -webkit-box/);
    expect(shared).toMatch(/-webkit-line-clamp: 2/);
    expect(shared).toMatch(/overflow: hidden/);
    const thai = rule('.intl-folio:lang(th)[data-guidance-locale] main .recommended-for-you-card-title');
    expect(thai).toMatch(/display:\s*block\s*!important/);
    expect(thai).toMatch(/-webkit-line-clamp:\s*unset\s*!important/);
    expect(thai).toMatch(/line-clamp:\s*none/);
    expect(thai).toMatch(/overflow:\s*visible\s*!important/);
    expect(Number(/line-height:\s*([\d.]+)/.exec(thai)?.[1])).toBeGreaterThanOrEqual(1.5);
  });
});

describe('article film label over the burned-in English one', () => {
  const englishAssets = new Set<string>();
  for (const locale of INTL_DESIGN_LOCALES) {
    const source = read('src/data/column-generated-videos.ts');
    for (const slug of new Set([...source.matchAll(/`column\/\$\{locale\}\/([a-z0-9-]+)`/g)].map((m) => m[1]))) {
      for (const video of getColumnGeneratedVideos(locale, slug)) if (video.id.endsWith('-en')) englishAssets.add(video.id);
    }
  }

  it('has a label in the page language for every Folio locale', () => {
    for (const locale of INTL_DESIGN_LOCALES) {
      const body = rule(`.intl-folio:lang(${locale})[data-guidance-locale] main [data-column-generated-video$='-en']::before`);
      expect(body, locale).toMatch(/content:\s*'[^']+'/);
      expect(body, locale).not.toMatch(/AI-GENERATED SCENE|Fictional illustration|AI-generated scene|Not real accident/i);
    }
    expect(englishAssets.size).toBeGreaterThan(10);
  });

  it('covers the 460–780 px label box of every English asset Folio pages show', () => {
    const overrides = new Map<string, number>();
    for (const r of rules) {
      const width = Number(/--f-film-label:\s*(\d+)/.exec(r.body)?.[1]);
      for (const m of r.selector.matchAll(/\[data-column-generated-video='([a-z0-9-]+)'\]/g)) overrides.set(m[1], width);
    }
    // Measured on the posters: most labels are 460 px wide (the default); these four are wider.
    expect(Object.fromEntries(overrides)).toEqual({
      'cosmetics-check-v1-en': 480,
      'overtaking-cutback-v2-en': 524,
      'branch-models-v1-en': 560,
      'business-premises-v1-en': 780,
      'rear-end-simulation-v3-en': 780,
    });
    for (const id of overrides.keys()) expect(englishAssets.has(id), id).toBe(true);
    const box = rule(".intl-folio[data-guidance-locale] main [data-column-generated-video$='-en']::before");
    expect(box).toMatch(/background:\s*#101714/);
    expect(box).toMatch(/pointer-events:\s*none/);
    expect(box).toMatch(/min-height:\s*7\.5cqw/);
  });
});

describe('lighter Folio markup (HTML budget)', () => {
  const posts: ColumnListItem[] = ['a', 'b', 'c'].map((slug) => ({
    slug, title: `Titre ${slug}`, date: '2026-01-02', dateDisplay: '2 janvier 2026', readTime: '3 min',
    category: 'legal', categoryLabel: 'Informations juridiques sur Taïwan', featuredImage: `/images/${slug}.jpg`, summary: 'Résumé',
  }));

  it('column rows draw only the lead picture and no hidden overlay or hint on Folio pages', () => {
    const fr = renderToStaticMarkup(<ColumnsGrid locale="fr" posts={posts} folioLabels={folioColumnsCopy.fr} />);
    expect(fr.match(/<img/g)).toHaveLength(1);
    expect(fr).toMatch(/images(%2F|\/)a\.jpg/);
    expect(fr).not.toContain('columns-card-image-overlay');
    expect(fr).not.toContain('columns-card-linkhint');
    const ms = renderToStaticMarkup(<ColumnsGrid locale="ms" posts={posts} />);
    expect(ms.match(/<img/g)).toHaveLength(3);
    expect(ms.match(/columns-card-image-overlay/g)).toHaveLength(3);
    expect(ms.match(/columns-card-linkhint/g)).toHaveLength(3);
  });

  it('the article attorney card carries name, role, photo and the lawyers link only', () => {
    const card = buildFolioAuthorityCard('th');
    expect(Object.keys(card ?? {}).sort()).toEqual(['lawyersHref', 'lawyersLabel', 'name', 'photo', 'role']);
  });
});
