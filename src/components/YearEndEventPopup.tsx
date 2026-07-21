'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';

const HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';
const SESSION_DISMISSED_KEY = 'hojeong-year-end-event-dismissed-session';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type PopupCopy = {
  readonly badge: string;
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
  readonly cta: string;
  readonly close: string;
  readonly closeForDay: string;
  readonly minimize: string;
  readonly reopen: string;
};

type YearEndEventPopupProps = {
  readonly locale: Locale;
  readonly previewOpen?: boolean;
  readonly onPreviewClose?: () => void;
};

const copyByLocale: Record<Locale, PopupCopy> = {
  ko: {
    badge: '2026 행사',
    title: '2026년 기념 리뷰 이벤트',
    body:
      '법무법인 호정을 이용하신 모든 고객님을 대상으로 무료 30분 상담 리뷰 이벤트를 진행합니다. 변호사와 직원이 함께 Google Meet 30분 상담을 진행하며, 상담 후 리뷰를 남겨주시면 참여가 완료됩니다.',
    points: ['대상: 신규/기존 모든 고객', '진행: Google Meet 30분 무료 상담', '참여: 상담 후 구글지도 리뷰 1건 작성'],
    cta: '이벤트 문의하기',
    close: '닫기',
    closeForDay: '오늘 하루 보지 않기',
    minimize: '축소',
    reopen: '이벤트 다시 열기'
  },
  'zh-hant': {
    badge: '2026 活動',
    title: '2026年紀念評論活動',
    body:
      '昊鼎國際法律事務所針對所有客戶提供免費 30 分鐘諮詢評論活動。由律師與團隊共同進行 30 分鐘 Google Meet 諮詢，諮詢後留下評論即可完成參與。',
    points: ['對象：新客戶與既有客戶', '方式：Google Meet 30 分鐘免費諮詢', '參與：諮詢後在 Google Maps 留下 1 則評論'],
    cta: '活動洽詢',
    close: '關閉',
    closeForDay: '今天不再顯示',
    minimize: '縮小',
    reopen: '重新開啟活動'
  },
  en: {
    badge: '2026 EVENT',
    title: '2026 Commemorative Review Event',
    body:
      'Hovering International Law Firm is hosting a free 30-minute consultation review event for all clients. Our lawyer and staff will join a Google Meet session, and participation is completed after you leave a review.',
    points: ['Eligible: all new and existing clients', 'Format: 30-minute free Google Meet consultation', 'How to join: leave one Google Maps review after consultation'],
    cta: 'Contact about this event',
    close: 'Close',
    closeForDay: "Don't show today",
    minimize: 'Minimize',
    reopen: 'Reopen event'
  }
};

export default function YearEndEventPopup({
  locale,
  previewOpen = false,
  onPreviewClose,
}: YearEndEventPopupProps) {
  const pathname = usePathname();
  const isUtilityPage = pathname?.includes('/bookings/manage/') ?? false;
  const normalizedPath = pathname?.replace(/\/+$/, '') || `/${locale}`;
  const isEligiblePage = normalizedPath === `/${locale}`;
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const minimizedButtonRef = useRef<HTMLButtonElement>(null);
  const copy = useMemo(() => copyByLocale[locale], [locale]);
  const popupVisible = previewOpen || (!isUtilityPage && isEligiblePage && open);
  const dismissForSession = useCallback(() => {
    if (previewOpen) {
      onPreviewClose?.();
      return;
    }
    try {
      sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
    } catch (error) {
      if (!(error instanceof Error)) throw error;
    }
    setMinimized(false);
    setOpen(false);
  }, [onPreviewClose, previewOpen]);

  useEffect(() => {
    if (previewOpen) {
      setOpen(false);
      return;
    }
    if (isUtilityPage || !isEligiblePage) {
      setOpen(false);
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true') return;
      const hideUntil = Number(localStorage.getItem(HIDE_UNTIL_KEY) ?? '0');
      if (hideUntil > Date.now()) return;
      sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
    } catch (error) {
      if (!(error instanceof Error)) throw error;
    }
    setOpen(true);
  }, [isEligiblePage, isUtilityPage, previewOpen]);

  useEffect(() => {
    if (!popupVisible || minimized) return;

    const popup = popupRef.current;
    if (!popup) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusableElements = () => Array.from(
      popup.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);

    const frame = window.requestAnimationFrame(() => {
      focusableElements()[0]?.focus({ preventScroll: true });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        dismissForSession();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = focusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [dismissForSession, minimized, popupVisible]);

  useEffect(() => {
    if (!popupVisible || !minimized) return;
    const frame = window.requestAnimationFrame(() => {
      minimizedButtonRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [minimized, popupVisible]);

  const hideForDay = () => {
    if (previewOpen) {
      onPreviewClose?.();
      return;
    }
    try {
      localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + ONE_DAY_MS));
    } catch (error) {
      if (!(error instanceof Error)) throw error;
    }
    dismissForSession();
  };

  if (!popupVisible) return null;

  if (minimized) {
    return (
      <div className="year-end-popup-minimized">
        <button
          ref={minimizedButtonRef}
          type="button"
          className="year-end-popup-pill"
          onClick={() => setMinimized(false)}
          aria-label={copy.reopen}
        >
          <span>{copy.badge}</span>
          <strong>{copy.title}</strong>
        </button>
        <button type="button" className="year-end-popup-pill-close" onClick={dismissForSession} aria-label={copy.close}>
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      className="year-end-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="year-end-popup-title"
    >
      <div ref={popupRef} className="year-end-popup">
        <div className="year-end-popup-top">
          <span className="year-end-popup-badge">{copy.badge}</span>
          <div className="year-end-popup-top-actions">
            <button type="button" className="year-end-popup-minimize" onClick={() => setMinimized(true)}>
              {copy.minimize}
            </button>
            <button
              type="button"
              className="year-end-popup-close"
              onClick={dismissForSession}
              aria-label={copy.close}
            >
              ×
            </button>
          </div>
        </div>
        <h2 id="year-end-popup-title" className="year-end-popup-title">{copy.title}</h2>
        <p className="year-end-popup-body">{copy.body}</p>
        <ul className="year-end-popup-points">
          {copy.points.map((point) => (
            <li key={point}>
              <span className="year-end-popup-check" aria-hidden>
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Link href={`/${locale}/contact`} className="button year-end-popup-cta" onClick={dismissForSession}>
          {copy.cta}
        </Link>
        <div className="year-end-popup-actions">
          <button type="button" className="year-end-popup-link" onClick={hideForDay}>
            {copy.closeForDay}
          </button>
        </div>
      </div>
    </div>
  );
}
