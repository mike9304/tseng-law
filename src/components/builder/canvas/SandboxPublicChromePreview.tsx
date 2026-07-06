'use client';

import {
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import QuickContactWidget from '@/components/QuickContactWidget';
import ScrollTopButton from '@/components/ScrollTopButton';
import YearEndEventPopup from '@/components/YearEndEventPopup';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

export type PublicChromeCopy = {
  readonly label: string;
};

type PublicChromeShortcutCopy = {
  readonly shortcut: string;
  readonly columns: string;
  readonly columnsHint: string;
  readonly event: string;
  readonly eventHint: string;
};

type SandboxPublicChromePreviewProps = {
  readonly locale: Locale;
  readonly activeDrawer: boolean;
  readonly copy: PublicChromeCopy;
  readonly currentSlug: string;
  readonly columnsShortcut: boolean;
  readonly onOpenColumnsPage: () => void;
  readonly onFooterLinkActivation: (event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => void;
};

const publicChromeShortcutCopy: Record<Locale, PublicChromeShortcutCopy> = {
  ko: {
    shortcut: '칼럼',
    columns: '칼럼 관리',
    columnsHint: '칼럼 페이지를 먼저 연 뒤 관리 도구로 이동합니다.',
    event: '이벤트',
    eventHint: '공개 사이트 첫 방문 이벤트 팝업을 미리 봅니다.',
  },
  'zh-hant': {
    shortcut: '專欄',
    columns: '管理專欄',
    columnsHint: '先開啟專欄頁面，再移至管理工具。',
    event: '活動',
    eventHint: '預覽公開網站首次造訪活動彈窗。',
  },
  en: {
    shortcut: 'Columns',
    columns: 'Manage columns',
    columnsHint: 'Open the columns page first, then move to management tools.',
    event: 'Event',
    eventHint: 'Preview the public first-visit event popup.',
  },
};

export default function SandboxPublicChromePreview({
  locale,
  activeDrawer,
  copy,
  columnsShortcut,
  onOpenColumnsPage,
  onFooterLinkActivation,
}: SandboxPublicChromePreviewProps) {
  const [columnsShortcutOpen, setColumnsShortcutOpen] = useState(false);
  const [eventPreviewOpen, setEventPreviewOpen] = useState(false);
  const shortcutCopy = publicChromeShortcutCopy[locale];

  const handlePublicChromeClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const footerLink = Array.from(globalThis.document.elementsFromPoint(event.clientX, event.clientY))
      .reduce<HTMLAnchorElement | null>((foundLink, node) => {
        if (foundLink || !(node instanceof HTMLElement)) return foundLink;
        if (node.closest('[data-builder-public-chrome="true"]')) return foundLink;
        return node.closest<HTMLAnchorElement>('footer a[href]');
      }, null);

    if (target.closest('[data-builder-public-chrome-control="true"], .scroll-top')) return;

    if (!footerLink) {
      if (target.closest('.quick-contact, .floating-ai-chat')) return;
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onFooterLinkActivation({
      target: footerLink,
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    });
  };

  return (
    <div
      className={styles.publicChromePreview}
      data-builder-mobile-drawer-open={activeDrawer ? 'true' : undefined}
      data-builder-public-chrome="true"
      aria-label={copy.label}
      onClickCapture={handlePublicChromeClickCapture}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className={styles.publicChromeEventButton}
        data-builder-public-chrome-control="true"
        aria-label={shortcutCopy.eventHint}
        aria-pressed={eventPreviewOpen}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setEventPreviewOpen((open) => !open);
        }}
      >
        {shortcutCopy.event}
      </button>
      {eventPreviewOpen ? (
        <YearEndEventPopup
          locale={locale}
          previewOpen
          onPreviewClose={() => setEventPreviewOpen(false)}
        />
      ) : null}
      {columnsShortcut ? (
        <div
          className={styles.publicChromeShortcut}
          data-builder-public-chrome-control="true"
        >
          <button
            type="button"
            className={styles.publicChromeShortcutButton}
            aria-expanded={columnsShortcutOpen}
            aria-pressed={columnsShortcutOpen}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setColumnsShortcutOpen((open) => !open);
            }}
          >
            {shortcutCopy.shortcut}
          </button>
          {columnsShortcutOpen ? (
            <div className={styles.publicChromeShortcutPanel}>
              <span>{shortcutCopy.columnsHint}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setColumnsShortcutOpen(false);
                  onOpenColumnsPage();
                }}
              >
                {shortcutCopy.columns}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <QuickContactWidget locale={locale} previewCollapsed />
          <ScrollTopButton locale={locale} />
        </>
      )}
    </div>
  );
}
