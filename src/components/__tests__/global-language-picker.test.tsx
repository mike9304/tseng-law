import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  PUBLIC_LOCALES_8,
  resolvePublicLanguageSwitchTarget,
  type PublicLocale8,
} from '@/lib/public-guidance';

function renderView(
  locale: PublicLocale8,
  options: {
    open?: boolean;
    pathname?: string;
    onOpen?: () => void;
    onClose?: () => void;
  } = {},
): string {
  return renderToStaticMarkup(
    <GlobalLanguagePickerView
      locale={locale}
      pathname={options.pathname ?? navigationState.pathname}
      open={options.open ?? false}
      onOpen={options.onOpen ?? (() => undefined)}
      onClose={options.onClose ?? (() => undefined)}
    />,
  );
}

function renderedLinks(html: string): string[] {
  return html.match(/<a\b[\s\S]*?<\/a>/g) ?? [];
}

describe('GlobalLanguagePicker', () => {
  beforeEach(() => {
    navigationState.pathname = '/ko';
  });

  it('renders a globe trigger whose accessible name is copy.open', () => {
    const html = renderToStaticMarkup(<GlobalLanguagePicker locale="ko" />);
    const copy = LANGUAGE_PICKER_COPY.ko;

    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain(`aria-label="${copy.open}"`);
    expect(html).toContain('type="button"');
    expect(html).not.toContain('role="dialog"');
  });

  it('opens a modal dialog with the localized title after the trigger is clicked', () => {
    const onOpen = vi.fn();
    const closed = renderView('ko', { open: false, onOpen });
    expect(closed).toContain(`aria-label="${LANGUAGE_PICKER_COPY.ko.open}"`);
    expect(closed).not.toContain('role="dialog"');

    const html = renderView('ko', { open: true, onOpen });
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain(LANGUAGE_PICKER_COPY.ko.title);
    expect(html).toContain(`aria-label="${LANGUAGE_PICKER_COPY.ko.close}"`);
  });

  it('lists eleven language links and marks only the current locale', () => {
    const html = renderView('ko', { open: true, pathname: '/ko' });
    const links = renderedLinks(html);

    expect(links).toHaveLength(PUBLIC_LOCALES_8.length);
    for (const entry of PUBLIC_LANGUAGE_REGISTRY) {
      expect(links.some((link) => link.includes(entry.autonym))).toBe(true);
    }

    const current = links.find((link) => link.includes(`lang="ko"`));
    expect(current).toContain('aria-current="true"');
    expect(current).toContain(LANGUAGE_PICKER_COPY.ko.current);
    expect(links.filter((link) => link.includes('aria-current="true"'))).toHaveLength(1);
  });

  it('uses resolvePublicLanguageSwitchTarget hrefs for representative paths', () => {
    const samples = [
      { locale: 'ko' as const, pathname: '/ko', target: 'en' as const },
      { locale: 'vi' as const, pathname: '/vi/services', target: 'ko' as const },
      { locale: 'ko' as const, pathname: '/ko/services', target: 'vi' as const },
    ];

    for (const sample of samples) {
      const html = renderView(sample.locale, { open: true, pathname: sample.pathname });
      const expected = resolvePublicLanguageSwitchTarget(sample.pathname, sample.target).href;
      expect(html).toContain(`href="${expected}"`);
    }

    expect(resolvePublicLanguageSwitchTarget('/ko', 'en').href).toBe('/en');
    expect(resolvePublicLanguageSwitchTarget('/vi/services', 'ko').href).toBe('/ko/services');
    expect(resolvePublicLanguageSwitchTarget('/ko/services', 'vi').href).toBe('/vi/services');
  });

  it('closes on Escape and restores focus to the trigger via the overlay focus hook', () => {
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

    const source = readFileSync(
      path.join(process.cwd(), 'src/components/GlobalLanguagePicker.tsx'),
      'utf8',
    );
    expect(source).toContain('usePublishedOverlayFocus');
    expect(source).toContain('initialFocusRef: closeButtonRef');
    expect(source).toContain('openerRef');
    expect(source).toContain('resolvePublishedOverlayOpener(triggerRef.current)');
    expect(source).toContain("document.addEventListener('keydown', handler, true)");
  });

  it('sets dir=rtl on the Arabic panel', () => {
    const html = renderView('ar', { open: true, pathname: '/ar' });
    expect(html).toContain('dir="rtl"');
    expect(html).toContain(LANGUAGE_PICKER_COPY.ar.title);
  });

  it('renders region headings in the current locale', () => {
    const ko = renderView('ko', { open: true, pathname: '/ko' });
    for (const group of groupedPublicLanguages('ko')) {
      expect(ko).toContain(`>${group.heading}</h2>`);
    }

    const en = renderView('en', { open: true, pathname: '/en' });
    for (const group of groupedPublicLanguages('en')) {
      expect(en).toContain(`>${group.heading}</h2>`);
    }
  });
});
