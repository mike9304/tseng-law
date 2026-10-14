import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({ pathname: '/fr' as string | null }));
vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import CinematicRouteShell from '@/components/CinematicRouteShell';
import GuidanceHomeBody from '@/components/GuidanceHomeBody';
import IntlHeroPlate from '@/components/intl-design/IntlHeroPlate';
import { intlHeroFilmAllowed, INTL_HERO_FILM_QUERY } from '@/components/intl-design/IntlHeroFilm';
import { getLocaleFontStylesheets, INTL_TYPE_STYLESHEET, type DocumentLanguage } from '@/app/fonts';
import { INTL_HERO_MEDIA, intlHeroAiCaption } from '@/data/intl-design-site';
import { guidanceContent } from '@/data/international-guidance-content';
import { INTL_DESIGN_LOCALES, isIntlDesignLocale } from '@/lib/intl-design-locales';
import { GUIDANCE_LOCALES_4, PUBLIC_LOCALES_8, publicDocumentLanguage } from '@/lib/public-guidance';

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');
const css = read('src/components/intl-design/IntlDesign.module.css');

/** DIRECTION.md header: the 29 Folio languages, exactly. */
const DIRECTION_LOCALES = 'id th de es fr it pt nl pl ru uk el sv da nb fi cs hu ro sk bg hr sr sl lt lv et ca is'.split(' ');

function renderShell(locale: (typeof PUBLIC_LOCALES_8)[number]) {
  navigationState.pathname = `/${locale}`;
  return renderToStaticMarkup(
    <CinematicRouteShell
      locale={locale}
      header={<div>HEADER</div>}
      footer={<div>FOOTER</div>}
      scrollTop={<div>SCROLL_TOP</div>}
    >
      <div>PAGE</div>
    </CinematicRouteShell>,
  );
}

function renderHome(locale: (typeof GUIDANCE_LOCALES_4)[number]) {
  navigationState.pathname = `/${locale}`;
  return renderToStaticMarkup(
    <GuidanceHomeBody locale={locale} columns={{ sourceLocale: locale, isOriginalLanguage: false, posts: [] }} />,
  );
}

/** Comma-separated selector list → selectors, keeping commas inside :is()/:global() together. */
function splitSelectorList(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of list) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function styleSelectors(source: string): string[] {
  const body = source.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...body.matchAll(/([^{};]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((prelude) => prelude && !prelude.startsWith('@') && !/^(from|to|\d+%)$/.test(prelude))
    .flatMap(splitSelectorList);
}

describe('Folio locale list', () => {
  it('is exactly the 29 DIRECTION languages, all on the guidance surface', () => {
    expect([...INTL_DESIGN_LOCALES].sort()).toEqual([...DIRECTION_LOCALES].sort());
    for (const locale of INTL_DESIGN_LOCALES) {
      expect(GUIDANCE_LOCALES_4 as readonly string[]).toContain(locale);
      expect(isIntlDesignLocale(locale)).toBe(true);
    }
  });

  it('leaves every other public locale out (ko, zh-hant, en, ja, vi and the other guidance languages)', () => {
    const others = PUBLIC_LOCALES_8.filter((locale) => !DIRECTION_LOCALES.includes(locale));
    expect(others).toEqual(expect.arrayContaining(['ko', 'zh-hant', 'en', 'ja', 'vi', 'ms', 'fil', 'ar', 'zh-hans', 'tr']));
    for (const locale of others) expect(isIntlDesignLocale(locale), locale).toBe(false);
    expect(isIntlDesignLocale(null)).toBe(false);
    expect(isIntlDesignLocale('')).toBe(false);
  });
});

describe('Folio root class', () => {
  it('is added to .site for Folio locales only', () => {
    for (const locale of INTL_DESIGN_LOCALES) {
      expect(renderShell(locale), locale).toMatch(/<div class="site [^"]*folio[^"]*"/);
    }
    for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'vi', 'ms', 'fil', 'ar'] as const) {
      expect(renderShell(locale), locale).toContain('<div class="site" data-locale=');
    }
  });

  it('scopes every rule under .folio (or the plate it renders); no rule starts with a global selector', () => {
    const selectors = styleSelectors(css);
    expect(selectors.length).toBeGreaterThan(300);
    for (const selector of selectors) {
      expect(/^\.(folio|plate[A-Za-z]*)\b/.test(selector), selector).toBe(true);
    }
  });

  it('never transforms case, paints the signature blue as a field, or rounds a button', () => {
    expect(css).not.toMatch(/text-transform:\s*(uppercase|capitalize|lowercase)/);
    expect(css).not.toMatch(/background(-color)?:\s*var\(--f-sign\)/);
    expect(css).not.toMatch(/border-radius:\s*(999|50%|[1-9]\d*px)/);
  });

  it('keeps Thai titles at ≥1.5 and Thai text at ≥1.8 line height, and never clamps Thai titles', () => {
    const thai = css.slice(css.indexOf('.folio:lang(th) {'), css.indexOf('}', css.indexOf('.folio:lang(th) {')));
    for (const token of ['--f-hero-lh', '--f-h1-lh', '--f-article-h1-lh', '--f-h2-lh', '--f-h2-hang-lh', '--f-h3-lh', '--f-faq-lh']) {
      const value = Number(new RegExp(`${token}:\\s*([\\d.]+)`).exec(thai)?.[1]);
      expect(value, token).toBeGreaterThanOrEqual(1.5);
    }
    for (const token of ['--f-body-lh', '--f-lead-lh']) {
      expect(Number(new RegExp(`${token}:\\s*([\\d.]+)`).exec(thai)?.[1]), token).toBeGreaterThanOrEqual(1.8);
    }
    expect(Number(/--f-prose-lh:\s*([\d.]+)/.exec(thai)?.[1])).toBeGreaterThanOrEqual(1.85);
    expect(thai).toContain("'Folio Prose'");
  });
});

describe('colour tokens', () => {
  const token = (name: string) => {
    const hex = new RegExp(`--f-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css)?.[1];
    expect(hex, name).toBeTruthy();
    return hex as string;
  };
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(token(a)), luminance(token(b))].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it('meets WCAG AA for every text pair and 3:1 for field edges (DIRECTION §2)', () => {
    for (const [text, surface] of [
      ['ink', 'paper'], ['ink-2', 'paper'], ['sign', 'paper'], ['alert', 'paper'],
      ['ink', 'sign-tint'], ['ink-2', 'sign-tint'], ['sign', 'sign-tint'],
      ['paper', 'ink'], ['paper', 'ink-hover'],
      ['night-text', 'night'], ['night-muted', 'night'], ['night-sign', 'night'],
    ] as const) {
      expect(contrast(text, surface), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast('field', 'paper')).toBeGreaterThanOrEqual(3);
    expect(contrast('field', 'night')).toBeGreaterThanOrEqual(3);
    expect(contrast('ink', 'paper')).toBeCloseTo(17.38, 1);
  });
});

describe('notice box positions (pinned by data position in the CSS)', () => {
  it('has the same section counts in all 29 languages', () => {
    for (const locale of INTL_DESIGN_LOCALES) {
      const pages = guidanceContent[locale].pages;
      expect(pages.home.sections, `${locale} home`).toHaveLength(4);
      expect(pages.contact.sections, `${locale} contact`).toHaveLength(4);
      expect(pages.services.sections, `${locale} services`).toHaveLength(7);
      expect(pages.pricing.sections, `${locale} pricing`).toHaveLength(4);
    }
  });

  it('puts the box on the section that states the four consultation languages', () => {
    const text = (section: { heading: string; paragraphs: readonly string[]; items?: readonly string[] }) =>
      [section.heading, ...section.paragraphs, ...(section.items ?? [])].join(' ');
    for (const locale of INTL_DESIGN_LOCALES) {
      const pages = guidanceContent[locale].pages;
      // home sections[1] names the four languages (Chinese always as 中文); contact sections[1] follows the list in [0].
      expect(text(pages.home.sections[1]), `${locale} home[1]`).toContain('中文');
      expect(text(pages.contact.sections[0]), `${locale} contact[0]`).toContain('中文');
    }
    expect(css).toContain("[data-guidance-page='home'] :global(.grid-bento.contact-grid) > :global(.card.legal-card):nth-child(2)");
    expect(css).toContain("[data-guidance-page='contact'] [data-page-block='page-sections'] :global(.grid-bento.contact-grid) > :global(.card.legal-card):nth-child(2)");
    expect(css).toContain("[data-guidance-page='services'] [data-page-block='page-sections'] :global(.grid-bento.contact-grid) > :global(.card.legal-card):nth-child(7)");
  });
});

describe('home hero', () => {
  it('renders the framed plate instead of the courthouse film on Folio homes', () => {
    for (const locale of INTL_DESIGN_LOCALES) {
      const markup = renderHome(locale);
      expect(markup, locale).toContain('data-intl-hero-plate');
      expect(markup, locale).not.toContain('class="hero-media"');
      expect(markup, locale).not.toContain('<video');
      expect(markup, locale).toContain(intlHeroAiCaption[locale]);
      expect(markup, locale).toContain('hero-links-minimal hero-cta-actions');
    }
  });

  it('keeps the courthouse film on the other guidance homes', () => {
    for (const locale of ['ms', 'fil', 'ar', 'vi', 'zh-hans', 'tr'] as const) {
      const markup = renderHome(locale);
      expect(markup, locale).toContain('class="hero-media"');
      expect(markup, locale).not.toContain('data-intl-hero-plate');
    }
  });

  it('serves a decorative, eager, high-priority still with both widths and a visible AI caption', () => {
    const markup = renderToStaticMarkup(<IntlHeroPlate locale="de" />);
    expect(markup).toContain('alt=""');
    expect(markup).toContain('fetchPriority="high"');
    expect(markup).not.toContain('loading="lazy"');
    expect(markup).toContain(`${INTL_HERO_MEDIA.still640} 640w`);
    expect(markup).toContain(`${INTL_HERO_MEDIA.still1280} 1280w`);
    expect(markup).toContain('<figcaption');
    expect(markup).toContain('Mit KI erzeugtes Bild');
    expect(markup.length).toBeLessThan(1200);
  });

  it('has hero media files within the DIRECTION budget', () => {
    const size = (file: string) => statSync(path.join(root, 'public', file)).size;
    expect(size(INTL_HERO_MEDIA.still1280)).toBeLessThanOrEqual(120 * 1024);
    expect(size(INTL_HERO_MEDIA.still640)).toBeLessThanOrEqual(45 * 1024);
    expect(size(INTL_HERO_MEDIA.filmMp4)).toBeLessThanOrEqual(1024 * 1024);
    expect(size(INTL_HERO_MEDIA.filmWebm)).toBeLessThanOrEqual(700 * 1024);
  });

  it('keeps every hero file under public/images, which the static build serves from the media origin (byte ranges)', () => {
    for (const file of [INTL_HERO_MEDIA.still1280, INTL_HERO_MEDIA.still640, INTL_HERO_MEDIA.filmMp4, INTL_HERO_MEDIA.filmWebm]) {
      expect(file).toMatch(/^\/images\/intl-design\//);
    }
  });

  it('plays the film only on wide screens with motion allowed and without Save-Data', () => {
    const win = (matches: boolean, saveData?: boolean) => ({
      matchMedia: (query: string) => ({ matches: query === INTL_HERO_FILM_QUERY && matches }) as MediaQueryList,
      navigator: { connection: saveData === undefined ? undefined : { saveData } } as unknown as Navigator,
    });
    expect(intlHeroFilmAllowed(win(true))).toBe(true);
    expect(intlHeroFilmAllowed(win(true, false))).toBe(true);
    expect(intlHeroFilmAllowed(win(true, true))).toBe(false);
    expect(intlHeroFilmAllowed(win(false))).toBe(false);
    expect(INTL_HERO_FILM_QUERY).toContain('prefers-reduced-motion: no-preference');
    expect(INTL_HERO_FILM_QUERY).toContain('min-width: 48rem');
  });
});

describe('AI caption map', () => {
  it('has a short native caption for every Folio locale', () => {
    expect(Object.keys(intlHeroAiCaption).sort()).toEqual([...DIRECTION_LOCALES].sort());
    const captions = Object.values(intlHeroAiCaption);
    expect(new Set(captions).size).toBe(captions.length);
    for (const [locale, caption] of Object.entries(intlHeroAiCaption)) {
      expect(caption.length, locale).toBeGreaterThan(8);
      expect(caption.length, locale).toBeLessThanOrEqual(48);
      expect(caption, locale).not.toMatch(/generated image|AI-generated/i);
    }
  });
});

describe('Folio type sheet', () => {
  const sheet = read(`public${INTL_TYPE_STYLESHEET}`);
  const faces = [...sheet.matchAll(/@font-face\{([^}]*)\}/g)].map((match) => match[1]);
  const files = faces
    .map((face) => /url\(([^)]+)\)/.exec(face)?.[1])
    .filter((url): url is string => Boolean(url));

  it('replaces the Noto sheets on Folio pages and is absent elsewhere', () => {
    for (const locale of INTL_DESIGN_LOCALES) {
      const language = publicDocumentLanguage(locale) as DocumentLanguage;
      expect(language, locale).toBe(locale);
      expect(getLocaleFontStylesheets(language), locale).toEqual([INTL_TYPE_STYLESHEET]);
    }
    for (const language of ['ko', 'zh-Hant', 'en', 'ja', 'vi', 'ms', 'fil', 'ar', 'zh-Hans', 'tr', 'hi'] as const) {
      expect(getLocaleFontStylesheets(language), language).not.toContain(INTL_TYPE_STYLESHEET);
    }
  });

  it('is content-hashed and every file exists, is hashed and swaps', () => {
    const hash = /intl-type-([0-9a-f]{12})\.css$/.exec(INTL_TYPE_STYLESHEET)?.[1];
    expect(hash).toBe(createHash('sha256').update(sheet).digest('hex').slice(0, 12));
    expect(files.length).toBe(16);
    for (const file of files) {
      expect(file).toMatch(/^\/fonts\/intl-2026-10\/folio-[a-z0-9-]+-[0-9a-f]{8}\.woff2$/);
      expect(existsSync(path.join(root, 'public', file)), file).toBe(true);
    }
    for (const face of faces.filter((entry) => entry.includes('url('))) expect(face).toContain('font-display:swap');
    expect(sheet).not.toMatch(/https?:/);
    expect(sheet).toContain("font-family:'Folio Serif Fallback';src:local('Georgia')");
    expect(sheet).toContain("font-family:'Folio Text Fallback';src:local('Arial')");
  });

  it('ships the OFL texts and renames Plex (Reserved Font Name)', () => {
    for (const name of ['literata', 'noto-serif-thai', 'plex-sans', 'plex-sans-thai', 'plex-sans-thai-looped']) {
      expect(existsSync(path.join(root, `public/fonts/intl-2026-10/OFL-${name}.txt`)), name).toBe(true);
    }
    expect(sheet).not.toMatch(/font-family:'[^']*(Plex|Literata|Noto)/);
  });

  it('keeps each language group under the 200 KB per-page budget (only the ranges a page uses are fetched)', () => {
    const bytes = (pattern: RegExp) =>
      files.filter((file) => pattern.test(file)).reduce((sum, file) => sum + statSync(path.join(root, 'public', file)).size, 0);
    const latin = bytes(/-latin-/);
    const groups = {
      western: latin,
      central: latin + bytes(/-latext-/),
      cyrillic: latin + bytes(/-cyr-/),
      greek: latin + bytes(/-greek-/),
      thai: latin + bytes(/-thai-/),
      everything: bytes(/./),
    };
    for (const [group, total] of Object.entries(groups)) expect(total, group).toBeLessThanOrEqual(200 * 1024);
  });
});
