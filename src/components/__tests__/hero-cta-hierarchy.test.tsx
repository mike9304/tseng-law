import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HeroSearch from '@/components/HeroSearch';
import {
  HERO_TRUST_RATING_VALUE,
  HERO_TRUST_REVIEW_COUNT,
  heroTrustCopy,
} from '@/components/HeroTrustStrip';
import { TAIPEI_MAPS_URL } from '@/data/office-locations';
import { siteContent } from '@/data/site-content';
import type { SiteLocale } from '@/lib/locales';

const locales = ['ko', 'zh-hant', 'en', 'ja'] as const satisfies readonly SiteLocale[];
const presentations = [undefined, 'editorial'] as const;

function heroCopy(html: string): string {
  const start = html.indexOf('data-builder-node-key="copy"');
  const end = html.indexOf('hero-trust-strip', start);
  return html.slice(start, end);
}

function count(html: string, pattern: RegExp): number {
  return [...html.matchAll(pattern)].length;
}

describe('WO-X3b hero CTA hierarchy', () => {
  for (const presentation of presentations) {
    it.each(locales)(`renders one primary, two path buttons and one guide link (%s, ${presentation ?? 'dark'})`, (locale) => {
      const html = renderToStaticMarkup(createElement(HeroSearch, { locale, presentation }));
      const copy = heroCopy(html);

      expect(count(copy, /class="button hero-cta-primary"/g)).toBe(1);
      expect(count(copy, /class="en-home-path-button"/g)).toBe(2);
      expect(count(copy, /class="en-home-path-guide"/g)).toBe(1);
      expect(copy).not.toContain('hero-cta-secondary');
      // CTA anchors inside the copy block: primary + 2 paths + guide (+ editorial byline).
      const anchors = count(copy, /<a /g);
      expect(anchors).toBe(presentation === 'editorial' ? 5 : 4);
      // Primary first in DOM order.
      expect(copy.indexOf('hero-cta-primary')).toBeLessThan(copy.indexOf('en-home-path-button'));
      expect(copy.indexOf('en-home-path-button')).toBeLessThan(copy.indexOf('en-home-path-guide'));
      expect(copy).toContain('class="hero-cta-group"');
    });
  }
});

describe('WO-X3a hero trust strip', () => {
  it('uses the same Google figures as the Taipei office card', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/OfficeMapTabs.tsx'), 'utf8');
    expect(source).toContain(`const TAIPEI_RATING_VALUE = '${HERO_TRUST_RATING_VALUE}';`);
    expect(source).toContain(`const TAIPEI_REVIEW_COUNT = ${HERO_TRUST_REVIEW_COUNT};`);
  });

  for (const presentation of presentations) {
    it.each(locales)(`renders existing facts with a named Google source link (%s, ${presentation ?? 'dark'})`, (locale) => {
      const html = renderToStaticMarkup(createElement(HeroSearch, { locale, presentation }));
      const copy = heroTrustCopy[locale];
      const strip = html.slice(html.indexOf('<ul class="hero-trust-strip'), html.indexOf('</ul>', html.indexOf('hero-trust-strip')));

      expect(strip).toContain(`href="${TAIPEI_MAPS_URL.replace(/&/g, '&amp;')}"`);
      expect(strip).toContain('rel="noopener noreferrer"');
      expect(copy.rating.startsWith('Google ')).toBe(true);
      expect(strip).toContain(copy.rating);
      for (const fact of copy.facts) expect(strip).toContain(fact);
      expect(strip).not.toMatch(/#1|No\.\s?1|best|最高|1위|第一|ナンバーワン|incentive|gift/i);
    });
  }

  it('lists the page language first in the consultation-language fact', () => {
    expect(heroTrustCopy.en.facts[2]).toMatch(/^Consultations in English,/);
    expect(heroTrustCopy.ja.facts[2]).toMatch(/^日本語・/);
    expect(heroTrustCopy.ko.facts[2]).toMatch(/^한국어·/);
    expect(heroTrustCopy['zh-hant'].facts[2]).toMatch(/^中文／/);
  });
});

describe('WO-X3 hero offer copy', () => {
  it('states the EN and JA offers and keeps ko/zh-hant unchanged', () => {
    expect(siteContent.en.hero.subtitle).toMatch(
      /^English consultations with Attorney Wei Tseng — in person in Taipei or by video\./,
    );
    expect(siteContent.ja.hero.title).toBe('台湾の会社設立・労務・紛争を、日本語で。');
    expect(siteContent.ja.hero.subtitle).toBe(
      '台北の台湾弁護士・曾雋崴（JLPT N1）が、日本企業の台湾進出から現地の契約・労務トラブル、在台日本人の方の家事・交通事故まで、日本語で直接ご相談を承ります。',
    );
    expect(siteContent.ko.hero.title).toBe('대만 법률을 한국어로 명확하게.');
    expect(siteContent['zh-hant'].hero.title).toBe('台灣法律，清楚說明。');
  });

  it.each(locales)('keeps a single h1 in the %s hero', (locale) => {
    const html = renderToStaticMarkup(createElement(HeroSearch, { locale }));
    expect(count(html, /<h1[\s>]/g)).toBe(1);
  });
});
