'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { Locale } from '@/lib/locales';

const HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

type SuppressionStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function readPopupSuppressionUntil(
  storage: SuppressionStorage,
  now = Date.now(),
): number {
  try {
    const rawValue = storage.getItem(HIDE_UNTIL_KEY);
    if (rawValue === null) return 0;

    const hideUntil = Number(rawValue);
    if (Number.isFinite(hideUntil) && hideUntil > now) return hideUntil;

    storage.removeItem(HIDE_UNTIL_KEY);
    return 0;
  } catch {
    return 0;
  }
}

export function storePopupSuppression(
  storage: SuppressionStorage,
  durationMs: number,
  now = Date.now(),
): number {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;

  const hideUntil = now + durationMs;
  if (!Number.isFinite(hideUntil)) return 0;

  try {
    storage.setItem(HIDE_UNTIL_KEY, String(hideUntil));
    return hideUntil;
  } catch {
    return 0;
  }
}

type PopupCopy = {
  readonly badge: string;
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
  readonly cta: string;
  readonly close: string;
  readonly closeForSevenDays: string;
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
    closeForSevenDays: '7일간 보지 않기',
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
    closeForSevenDays: '7 天內不再顯示',
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
    closeForSevenDays: "Don't show for 7 days",
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
  const [heroPortalTarget, setHeroPortalTarget] = useState<HTMLElement | null>(null);
  const minimizedButtonRef = useRef<HTMLButtonElement>(null);
  const copy = useMemo(() => copyByLocale[locale], [locale]);
  const popupVisible = previewOpen || (!isUtilityPage && isEligiblePage && open);
  const dismissForDuration = useCallback((durationMs: number) => {
    if (previewOpen) {
      onPreviewClose?.();
      return;
    }
    storePopupSuppression(window.localStorage, durationMs);
    setMinimized(false);
    setOpen(false);
  }, [onPreviewClose, previewOpen]);
  const dismissForOneDay = useCallback(
    () => dismissForDuration(ONE_DAY_MS),
    [dismissForDuration],
  );

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
    if (readPopupSuppressionUntil(window.localStorage) > 0) return;
    setOpen(true);
  }, [isEligiblePage, isUtilityPage, previewOpen]);

  useEffect(() => {
    if (previewOpen || isUtilityPage || !isEligiblePage) {
      setHeroPortalTarget(null);
      return;
    }

    setHeroPortalTarget(document.getElementById('hero'));
  }, [isEligiblePage, isUtilityPage, previewOpen]);

  useEffect(() => {
    if (!popupVisible || minimized) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        dismissForOneDay();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [dismissForOneDay, minimized, popupVisible]);

  useEffect(() => {
    if (!popupVisible || !minimized) return;
    const frame = window.requestAnimationFrame(() => {
      minimizedButtonRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [minimized, popupVisible]);

  const hideForSevenDays = () => dismissForDuration(SEVEN_DAYS_MS);

  if (!popupVisible) return null;

  if (minimized) {
    const minimizedPopup = (
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
        <button type="button" className="year-end-popup-pill-close" onClick={dismissForOneDay} aria-label={copy.close}>
          ×
        </button>
      </div>
    );

    if (previewOpen) return minimizedPopup;
    return heroPortalTarget ? createPortal(minimizedPopup, heroPortalTarget) : null;
  }

  const fullPopup = (
    <div
      className="year-end-popup-backdrop"
      role="dialog"
      aria-modal="false"
      aria-labelledby="year-end-popup-title"
    >
      <div className="year-end-popup">
        <div className="year-end-popup-top">
          <span className="year-end-popup-badge">{copy.badge}</span>
          <div className="year-end-popup-top-actions">
            <button type="button" className="year-end-popup-minimize" onClick={() => setMinimized(true)}>
              {copy.minimize}
            </button>
            <button
              type="button"
              className="year-end-popup-close"
              onClick={dismissForOneDay}
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
        <a
          href={getConsultationPublicMailto(locale)}
          className="button year-end-popup-cta"
          onClick={dismissForOneDay}
          aria-label={`${copy.cta} — ${getConsultationCtaLabel(locale)}`}
        >
          {copy.cta}
        </a>
        <div className="year-end-popup-actions">
          <button type="button" className="year-end-popup-link" onClick={hideForSevenDays}>
            {copy.closeForSevenDays}
          </button>
        </div>
      </div>
    </div>
  );

  if (previewOpen) return fullPopup;
  return heroPortalTarget ? createPortal(fullPopup, heroPortalTarget) : null;
}
