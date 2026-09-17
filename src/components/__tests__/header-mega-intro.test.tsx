import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ja',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import Header from '@/components/Header';
import { guidanceContent } from '@/data/international-guidance-content';
import { siteContent } from '@/data/site-content';

function renderHeader(locale: 'ko' | 'zh-hant' | 'en' | 'ja'): string {
  navigationState.pathname = `/${locale}`;
  return renderToStaticMarkup(<Header locale={locale} />);
}

function megaIntroHtml(html: string): string[] {
  return [...html.matchAll(/class="[^"]*mega-intro[^"]*"/g)].map((match) => match[0]);
}

describe('header mega menu left-column intro', () => {
  it('fills the JA services left column with a short description and does not duplicate すべて見る', () => {
    const html = renderHeader('ja');
    const services = html.match(/data-panel="services"[\s\S]*?(?=data-panel="|$)/)?.[0] ?? html;

    expect(html).toContain('mega-description');
    expect(services).toContain(siteContent.ja.nav.mega.services.description);
    expect(services).toContain('すべて見る');
    expect(services.match(/すべて見る/g)?.length).toBe(1);
  });

  it('adds a one-sentence description to every rendered mega panel', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const html = renderHeader(locale);
      const panelKeys = [...html.matchAll(/data-panel="([^"]+)"/g)].map((match) => match[1]);
      expect(megaIntroHtml(html).length).toBeGreaterThan(0);
      expect(panelKeys.length).toBeGreaterThan(0);
      expect(html).toContain('mega-description');
      for (const key of panelKeys) {
        const intro = siteContent[locale].nav.mega[key as keyof typeof siteContent.en.nav.mega];
        expect(intro.description.trim().length).toBeGreaterThan(8);
        expect(html).toContain(intro.description);
      }
    }
  });

  it('does not change mega open/close wiring', () => {
    const html = renderHeader('ja');
    expect(html).toContain('aria-haspopup="true"');
    expect(html).toContain('id="megaMenu"');
    expect(html).toContain('id="megaOverlay"');
  });
});

describe('header mega intro copy coverage', () => {
  it('fills mega intro copy for all eight public locales', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const mega = siteContent[locale].nav.mega;
      expect(Object.keys(mega).sort()).toEqual(['about', 'insights', 'services', 'videos']);
      for (const panel of Object.values(mega)) {
        expect(panel.description.trim().length).toBeGreaterThan(8);
        expect(panel.viewAllLabel.trim().length).toBeGreaterThan(0);
      }
    }

    for (const locale of ['vi', 'id', 'th', 'fil'] as const) {
      const mega = guidanceContent[locale].mega;
      expect(Object.keys(mega).sort()).toEqual(['columns', 'faq', 'lawyers', 'pricing', 'services']);
      for (const panel of Object.values(mega)) {
        expect(panel.description.trim().length).toBeGreaterThan(8);
        expect(panel.viewAllLabel.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
