import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fallbackLanguageNotice, localeFlagHref } from '@/components/LocaleFlagSwitcher';
import type { PublicColumnSlugsByLocale } from '@/components/PublicColumnSlugsContext';

const navigationState = vi.hoisted(() => ({
  pathname: '/ko',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import GlobalLanguagePicker, {
  closeLanguagePickerOnEscape,
  GlobalLanguagePickerView,
} from '@/components/GlobalLanguagePicker';
import {
  groupedPublicLanguages,
  LANGUAGE_PICKER_COPY,
  PUBLIC_LANGUAGE_REGISTRY,
} from '@/lib/public-language-registry';
import {
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  type PublicLocale8,
} from '@/lib/public-guidance';

function renderView(
  locale: PublicLocale8,
  options: {
    open?: boolean;
    pathname?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onClosed?: () => void;
    columnSlugsByLocale?: PublicColumnSlugsByLocale | null;
  } = {},
): string {
  return renderToStaticMarkup(
    <GlobalLanguagePickerView
      locale={locale}
      pathname={options.pathname ?? navigationState.pathname}
      columnSlugsByLocale={options.columnSlugsByLocale}
      open={options.open ?? false}
      onOpen={options.onOpen ?? (() => undefined)}
      onClose={options.onClose ?? (() => undefined)}
      onClosed={options.onClosed}
    />,
  );
}

function renderedLinks(html: string): string[] {
  return html.match(/<a\b[\s\S]*?<\/a>/g) ?? [];
}

function linkForLocale(html: string, locale: PublicLocale8): string | undefined {
  const lang = locale === 'zh-hant' ? 'zh-Hant' : locale;
  return renderedLinks(html).find((link) => link.includes(`lang="${lang}"`));
}

describe('GlobalLanguagePicker', () => {
  beforeEach(() => {
    navigationState.pathname = '/ko';
  });

  it('renders a globe trigger whose accessible name includes copy.open and the current autonym', () => {
    const html = renderToStaticMarkup(<GlobalLanguagePicker locale="ko" />);
    const copy = LANGUAGE_PICKER_COPY.ko;

    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain(`aria-label="${copy.open}: ${PUBLIC_LANGUAGE_AUTONYMS.ko}"`);
    expect(html).toContain('type="button"');
    expect(html).not.toContain('role="dialog"');
  });

  it('opens a modal dialog with the localized title after the trigger is clicked', () => {
    const onOpen = vi.fn();
    const closed = renderView('ko', { open: false, onOpen });
    expect(closed).toContain(
      `aria-label="${LANGUAGE_PICKER_COPY.ko.open}: ${PUBLIC_LANGUAGE_AUTONYMS.ko}"`,
    );
    expect(closed).not.toContain('role="dialog"');

    const html = renderView('ko', { open: true, onOpen });
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain(LANGUAGE_PICKER_COPY.ko.title);
    expect(html).toContain(`aria-label="${LANGUAGE_PICKER_COPY.ko.close}"`);
  });

  it('lists every language link and marks only the current locale', () => {
    const html = renderView('ko', { open: true, pathname: '/ko' });
    const links = renderedLinks(html);

    expect(links).toHaveLength(PUBLIC_LOCALES_8.length);
    for (const entry of PUBLIC_LANGUAGE_REGISTRY) {
      expect(links.some((link) => link.includes(entry.autonym))).toBe(true);
      expect(links.some((link) => link.includes(entry.englishName))).toBe(true);
    }

    const current = linkForLocale(html, 'ko');
    expect(current).toContain('aria-current="page"');
    expect(current).toContain(LANGUAGE_PICKER_COPY.ko.current);
    expect(links.filter((link) => link.includes('aria-current="page"'))).toHaveLength(1);
  });

  it('uses localeFlagHref for restricted family paths targeting Japanese', () => {
    const samples = [
      { pathname: '/en/portfolio/x', href: '/ja/portfolio' },
      { pathname: '/en/events/x', href: '/ja/events' },
      { pathname: '/en/store/products/x', href: '/ja/store' },
    ] as const;

    for (const sample of samples) {
      const html = renderView('en', { open: true, pathname: sample.pathname });
      const jaLink = linkForLocale(html, 'ja');
      expect(localeFlagHref(sample.pathname, 'ja')).toBe(sample.href);
      expect(jaLink, `${sample.pathname} ja link`).toContain(`href="${sample.href}"`);
    }
  });

  it('links a JA column detail to the same vi article when columnSlugsByLocale is provided', () => {
    const slug = 'taiwan-company-establishment-basics';
    const pathname = `/ja/columns/${slug}`;
    const html = renderView('ja', {
      open: true,
      pathname,
      columnSlugsByLocale: { vi: [slug], ja: [slug] },
    });
    const viLink = linkForLocale(html, 'vi');
    expect(viLink).toContain(`href="/vi/columns/${slug}"`);
  });

  it('falls back to the Thai home from /ko/videos and shows the notice', () => {
    const html = renderView('ko', { open: true, pathname: '/ko/videos' });
    const notice = fallbackLanguageNotice('ko', 'th');
    const thLink = linkForLocale(html, 'th');
    expect(localeFlagHref('/ko/videos', 'th')).toBe('/th');
    expect(thLink).toContain('href="/th"');
    expect(thLink).toContain(notice);
    expect(html).toContain(notice);
  });

  it('closes on Escape via the shared document-level handler', () => {
    const onClose = vi.fn();
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    closeLanguagePickerOnEscape(
      { key: 'Tab', preventDefault, stopPropagation },
      onClose,
    );
    expect(onClose).not.toHaveBeenCalled();

    closeLanguagePickerOnEscape(
      { key: 'Escape', preventDefault, stopPropagation },
      onClose,
    );
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sets dir=rtl on the Arabic panel and on Arabic items in an LTR panel', () => {
    const ar = renderView('ar', { open: true, pathname: '/ar' });
    expect(ar).toContain('dir="rtl"');
    expect(ar).toContain(LANGUAGE_PICKER_COPY.ar.title);

    const en = renderView('en', { open: true, pathname: '/en' });
    const arLink = linkForLocale(en, 'ar');
    expect(arLink).toContain('dir="rtl"');
  });

  it('renders region headings in the current locale', () => {
    const ko = renderView('ko', { open: true, pathname: '/ko' });
    for (const group of groupedPublicLanguages('ko')) {
      expect(ko).toContain(`>${group.heading}</h3>`);
    }

    const en = renderView('en', { open: true, pathname: '/en' });
    for (const group of groupedPublicLanguages('en')) {
      expect(en).toContain(`>${group.heading}</h3>`);
    }
  });

  it('uses h2 for the dialog title and h3 for regions, and does not render h1', () => {
    const html = renderView('en', { open: true, pathname: '/en' });
    const copy = LANGUAGE_PICKER_COPY.en;
    const groups = groupedPublicLanguages('en');

    expect(html).toMatch(new RegExp(`<h2[^>]*>${copy.title}</h2>`));
    expect(html).not.toMatch(/<h1\b/);
    expect(html.match(/<h3\b/g)).toHaveLength(groups.length);
    for (const group of groups) {
      expect(html).toMatch(new RegExp(`<h3[^>]*>${group.heading}</h3>`));
    }
  });
});
