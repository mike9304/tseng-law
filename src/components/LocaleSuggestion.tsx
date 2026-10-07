'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  usePublicColumnLanguageLinks,
  usePublicColumnLocales,
} from '@/components/PublicColumnLanguageLinksContext';
import type { PublicLocale8 } from '@/lib/public-guidance';
import {
  captureLanding,
  dismissLocaleSuggestion,
  isLocaleSuggestionDismissed,
  localeFromLanguageTag,
  localeHintFromReferrer,
} from '@/lib/reading-signals';

/** Copy is shown in the suggested language, since that is what the visitor reads. */
const COPY: Record<string, { text: string; link: string; close: string }> = {
  ko: { text: '한국어 칼럼도 있습니다.', link: '한국어로 보기', close: '닫기' },
  en: { text: 'Browse our English-language articles.', link: 'English articles', close: 'Close' },
  ja: { text: '日本語のコラムもあります。', link: '日本語で読む', close: '閉じる' },
  'zh-hant': { text: '本站也有繁體中文專欄。', link: '閱讀中文版', close: '關閉' },
  'zh-hans': { text: '本站也有简体中文专栏。', link: '阅读中文版', close: '关闭' },
  vi: { text: 'Có bài viết bằng tiếng Việt.', link: 'Đọc bằng tiếng Việt', close: 'Đóng' },
  id: { text: 'Artikel juga tersedia dalam bahasa Indonesia.', link: 'Baca dalam bahasa Indonesia', close: 'Tutup' },
  th: { text: 'มีบทความภาษาไทยด้วย', link: 'อ่านภาษาไทย', close: 'ปิด' },
  fil: { text: 'May mga artikulo rin sa Filipino.', link: 'Basahin sa Filipino', close: 'Isara' },
};

/**
 * Small, dismissible hint when the browser's languages do not include the page
 * locale but the site has columns in the visitor's language. Never redirects.
 * Fixed position, rendered only after hydration → no layout shift, nothing in
 * the server HTML.
 */
export default function LocaleSuggestion({ locale }: { locale: string }) {
  const pathname = usePathname() ?? '';
  const columnLocales = usePublicColumnLocales();
  const columnLinks = usePublicColumnLanguageLinks(pathname);
  const [target, setTarget] = useState<{ locale: string; href: string } | null>(null);
  // Path on which the hint is clear of the first screen; tied to the path so a client-side
  // navigation never shows it over the next page's hero for a frame.
  const [clearPath, setClearPath] = useState<string | null>(null);

  useEffect(() => {
    if (columnLocales.length === 0 || isLocaleSuggestionDismissed()) return;
    const known = columnLocales.filter((code) => Boolean(COPY[code]));
    const languages = (navigator.languages?.length ? navigator.languages : [navigator.language]).filter(Boolean);
    const preferred = languages
      .map((tag) => localeFromLanguageTag(tag, known))
      .filter((code): code is string => Boolean(code));
    if (preferred.includes(locale)) return;
    const signals = captureLanding();
    const next = preferred[0] ?? localeHintFromReferrer(signals.refHost);
    if (!next || next === locale || !known.includes(next as PublicLocale8)) return;
    const href = columnLinks?.[next as PublicLocale8] ?? `/${next}/columns`;
    setTarget({ locale: next, href });
  }, [locale, pathname, columnLinks, columnLocales]);

  // Pages that open on a first screen keep it clear: the hint shows only while #hero is out of the
  // viewport and no cinematic opening is up (Fable/Astra 2026-10-01: it covered the zh-hant search
  // bar and the ko opening), hides again when the visitor scrolls back up, and starts over after a
  // client-side navigation.
  useEffect(() => {
    if (!target) return;
    // Pages without #hero can mark the end of their first screen with data-locale-hint-after.
    const hero = document.getElementById('hero') ?? document.querySelector<HTMLElement>('[data-locale-hint-after]');
    const site = document.querySelector<HTMLElement>('.site[data-cinematic-intro-visible]');
    let heroInView = Boolean(hero);
    const update = () => {
      const introVisible = site?.dataset.cinematicIntroVisible === 'true';
      setClearPath(!heroInView && !introVisible ? pathname : null);
    };
    const intersection = hero && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
        heroInView = Boolean(entry?.isIntersecting);
        update();
      })
      : null;
    if (hero && intersection) intersection.observe(hero);
    else heroInView = false;
    const mutation = site && typeof MutationObserver !== 'undefined' ? new MutationObserver(update) : null;
    if (site && mutation) mutation.observe(site, { attributes: true, attributeFilter: ['data-cinematic-intro-visible'] });
    update();
    return () => {
      intersection?.disconnect();
      mutation?.disconnect();
    };
  }, [target, pathname]);

  if (!target || clearPath !== pathname) return null;
  const copy = COPY[target.locale];
  return (
    <aside className="locale-suggestion" lang={target.locale} data-locale-suggestion={target.locale}>
      <span>{copy.text}</span>
      <Link href={target.href} hrefLang={target.locale}>
        {copy.link} →
      </Link>
      <button
        type="button"
        aria-label={copy.close}
        onClick={() => {
          dismissLocaleSuggestion();
          setTarget(null);
        }}
      >
        ×
      </button>
    </aside>
  );
}
