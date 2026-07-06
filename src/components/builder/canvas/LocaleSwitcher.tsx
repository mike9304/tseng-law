'use client';

import { useCallback, useEffect, useState } from 'react';
import { locales, type Locale } from '@/lib/locales';
import EditorChromeIcon from './EditorChromeIcon';
import styles from './SandboxPage.module.css';

interface LinkedPageInfo {
  pageId: string;
  locale: Locale;
  slug: string;
  title: string;
}

interface TranslationProgressInfo {
  locale: Locale;
  percent: number;
  missing: number;
  outdated: number;
}

const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
};

type LocaleSwitcherCopy = {
  create: string;
  createBody: (label: string) => string;
  createTitle: string;
  linked: string;
  missing: string;
  current: string;
  pageTitle: (label: string) => string;
  title: string;
  cancel: string;
};

const COPY: Record<Locale, LocaleSwitcherCopy> = {
  ko: {
    create: '만들기',
    createBody: (label) => `${label} 번역 페이지가 없습니다. 현재 페이지를 기준으로 새 번역 페이지를 만들까요?`,
    createTitle: '번역 페이지 없음',
    linked: '연결됨',
    missing: '번역 없음',
    current: '현재',
    pageTitle: (label) => `${label} 번역`,
    title: '다국어 전환',
    cancel: '취소',
  },
  'zh-hant': {
    create: '建立',
    createBody: (label) => `尚未建立 ${label} 翻譯頁面。要依目前頁面建立新的翻譯頁面嗎？`,
    createTitle: '沒有翻譯頁面',
    linked: '已連結',
    missing: '無翻譯',
    current: '目前',
    pageTitle: (label) => `${label} 翻譯`,
    title: '切換語言',
    cancel: '取消',
  },
  en: {
    create: 'Create',
    createBody: (label) => `There is no ${label} translation page yet. Create one from the current page?`,
    createTitle: 'No translation page',
    linked: 'Linked',
    missing: 'No translation',
    current: 'Current',
    pageTitle: (label) => `${label} translation`,
    title: 'Switch language',
    cancel: 'Cancel',
  },
};

function getLocaleSwitcherCopy(locale: Locale): LocaleSwitcherCopy {
  return COPY[locale] ?? COPY.ko;
}

export default function LocaleSwitcher({
  currentLocale,
  siteId,
  activePageId,
  onLocaleChange,
}: {
  currentLocale: Locale;
  siteId: string;
  activePageId: string | null;
  onLocaleChange: (locale: Locale, linkedPageId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [linkedPages, setLinkedPages] = useState<Record<string, LinkedPageInfo | null>>({});
  const [translationProgress, setTranslationProgress] = useState<Record<string, TranslationProgressInfo>>({});
  const [showCreatePrompt, setShowCreatePrompt] = useState<Locale | null>(null);
  const copy = getLocaleSwitcherCopy(currentLocale);

  // Fetch linked pages for current page
  useEffect(() => {
    if (!activePageId) return;
    let cancelled = false;

    async function fetchLinked() {
      try {
        const response = await fetch(
          `/api/builder/site/pages/${activePageId}/linked?${new URLSearchParams({ locale: currentLocale, siteId }).toString()}`,
          { credentials: 'same-origin' },
        );
        if (response.ok && !cancelled) {
          const data = (await response.json()) as { linkedPages: Record<string, LinkedPageInfo | null> };
          setLinkedPages(data.linkedPages ?? {});
        }
      } catch {
        // silent — linked pages API may not exist yet
      }
    }

    fetchLinked();
    return () => { cancelled = true; };
  }, [activePageId, currentLocale, siteId]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProgress() {
      try {
        const response = await fetch('/api/builder/translations?sourceLocale=ko', {
          credentials: 'same-origin',
        });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as { progress?: TranslationProgressInfo[] };
        const next: Record<string, TranslationProgressInfo> = {};
        for (const item of data.progress ?? []) {
          next[item.locale] = item;
        }
        setTranslationProgress(next);
      } catch {
        // Translation Manager may not be available in older deployments.
      }
    }
    void fetchProgress();
    return () => { cancelled = true; };
  }, []);

  const handleLocaleClick = useCallback(
    (locale: Locale) => {
      if (locale === currentLocale) {
        setOpen(false);
        return;
      }

      const linked = linkedPages[locale];
      if (linked) {
        onLocaleChange(locale, linked.pageId);
        setOpen(false);
      } else {
        setShowCreatePrompt(locale);
        setOpen(false);
      }
    },
    [currentLocale, linkedPages, onLocaleChange],
  );

  const handleCreateLinkedPage = useCallback(
    async (locale: Locale) => {
      if (!activePageId) return;
      try {
        const response = await fetch(`/api/builder/site/pages?${new URLSearchParams({ locale, siteId }).toString()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId,
            locale,
            slug: `page-${Date.now().toString(36)}`,
            title: copy.pageTitle(LOCALE_LABELS[locale]),
            linkedFromPageId: activePageId,
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as { pageId?: string };
          if (data.pageId) {
            onLocaleChange(locale, data.pageId);
          }
        }
      } catch {
        // silent fail
      } finally {
        setShowCreatePrompt(null);
      }
    },
    [activePageId, copy, onLocaleChange, siteId],
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-locale-switcher]')) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handler, true);
    return () => window.removeEventListener('click', handler, true);
  }, [open]);

  return (
    <>
      <div className={styles.localeSwitcher} data-locale-switcher>
        <button
          type="button"
          className={styles.localeSwitcherTrigger}
          title={copy.title}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{LOCALE_LABELS[currentLocale] ?? currentLocale}</span>
          <EditorChromeIcon
            name="chevronDown"
            className={styles.localeSwitcherChevron}
            data-open={open ? 'true' : 'false'}
          />
        </button>

        {open && (
          <div className={styles.localeSwitcherMenu} role="menu" aria-label={copy.title}>
            {locales.map((loc) => {
              const isActive = loc === currentLocale;
              const linked = linkedPages[loc];
              const hasLinked = isActive || !!linked;
              return (
                <button
                  key={loc}
                  type="button"
                  className={styles.localeSwitcherItem}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => handleLocaleClick(loc)}
                  role="menuitem"
                >
                  <span>{LOCALE_LABELS[loc]}</span>
                  {isActive && (
                    <span className={styles.localeSwitcherBadge} data-tone="active">
                      {copy.current}
                    </span>
                  )}
                  {!isActive && !hasLinked && (
                    <span className={styles.localeSwitcherBadge} data-tone="muted">
                      {copy.missing}
                    </span>
                  )}
                  {!isActive && hasLinked && (
                    <span className={styles.localeSwitcherBadge} data-tone="success">
                      {copy.linked}
                    </span>
                  )}
                  {!isActive && translationProgress[loc] && (
                    <span className={styles.localeSwitcherBadge} data-tone="progress">
                      {translationProgress[loc].percent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showCreatePrompt && (
        <div
          className={styles.localeSwitcherPromptBackdrop}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreatePrompt(null); }}
        >
          <div className={styles.localeSwitcherPrompt} role="dialog" aria-modal="true" aria-label={copy.createTitle}>
            <div className={styles.localeSwitcherPromptTitle}>
              {copy.createTitle}
            </div>
            <div className={styles.localeSwitcherPromptBody}>
              {copy.createBody(LOCALE_LABELS[showCreatePrompt])}
            </div>
            <div className={styles.localeSwitcherPromptActions}>
              <button
                type="button"
                onClick={() => setShowCreatePrompt(null)}
                className={styles.localeSwitcherPromptSecondary}
              >
                {copy.cancel}
              </button>
              <button
                type="button"
                onClick={() => handleCreateLinkedPage(showCreatePrompt)}
                className={styles.localeSwitcherPromptPrimary}
              >
                {copy.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
