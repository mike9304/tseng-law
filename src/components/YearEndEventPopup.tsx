'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';

const HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type PopupCopy = {
  badge: string;
  title: string;
  body: string;
  points: string[];
  cta: string;
  close: string;
  closeForDay: string;
};

const copyByLocale: Record<Locale, PopupCopy> = {
  ko: {
    badge: '2026 EVENT',
    title: '2026년 기념 리뷰 이벤트',
    body:
      '호정법률사무소를 이용하신 모든 고객님을 대상으로 무료 30분 상담 리뷰 이벤트를 진행합니다. 변호사와 직원이 함께 Google Meet 30분 상담을 진행하며, 상담 후 리뷰를 남겨주시면 참여가 완료됩니다.',
    points: ['대상: 신규/기존 모든 고객', '진행: Google Meet 30분 무료 상담', '참여: 상담 후 리뷰 1건 작성'],
    cta: '이벤트 문의하기',
    close: '닫기',
    closeForDay: '오늘 하루 보지 않기'
  },
  'zh-hant': {
    badge: '2026 EVENT',
    title: '2026年紀念評論活動',
    body:
      '昊鼎國際法律事務所針對所有客戶提供免費 30 分鐘諮詢評論活動。由律師與團隊共同進行 30 分鐘 Google Meet 諮詢，諮詢後留下評論即可完成參與。',
    points: ['對象：新客戶與既有客戶', '方式：Google Meet 30 分鐘免費諮詢', '參與：諮詢後留下 1 則評論'],
    cta: '活動洽詢',
    close: '關閉',
    closeForDay: '今天不再顯示'
  },
  en: {
    badge: '2026 EVENT',
    title: '2026 Commemorative Review Event',
    body:
      'Hovering International Law Firm is hosting a free 30-minute consultation review event for all clients. Our lawyer and staff will join a Google Meet session, and participation is completed after you leave a review.',
    points: ['Eligible: all new and existing clients', 'Format: 30-minute free Google Meet consultation', 'How to join: leave one review after consultation'],
    cta: 'Contact about this event',
    close: 'Close',
    closeForDay: "Don't show today"
  }
};

export default function YearEndEventPopup({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const copy = useMemo(() => copyByLocale[locale], [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hideUntil = Number(localStorage.getItem(HIDE_UNTIL_KEY) ?? '0');
      if (hideUntil > Date.now()) return;
    } catch {
      // noop
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const hideForDay = () => {
    try {
      localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + ONE_DAY_MS));
    } catch {
      // noop
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="year-end-popup-backdrop" role="dialog" aria-modal="true" aria-label={copy.title} onClick={() => setOpen(false)}>
      <div className="year-end-popup" onClick={(event) => event.stopPropagation()}>
        <div className="year-end-popup-top">
          <span className="year-end-popup-badge">{copy.badge}</span>
          <button type="button" className="year-end-popup-close" onClick={() => setOpen(false)} aria-label={copy.close}>
            ×
          </button>
        </div>
        <div className="year-end-popup-visual" aria-hidden>
          <span className="year-end-popup-visual-glow" />
          <span className="year-end-popup-sparkle year-end-popup-sparkle--1">&#10022;</span>
          <span className="year-end-popup-sparkle year-end-popup-sparkle--2">&#10022;</span>
          <span className="year-end-popup-sparkle year-end-popup-sparkle--3">&#10022;</span>
          <span className="year-end-popup-visual-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </span>
        </div>
        <h2 className="year-end-popup-title">{copy.title}</h2>
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
        <Link href={`/${locale}/contact`} className="button year-end-popup-cta" onClick={() => setOpen(false)}>
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
