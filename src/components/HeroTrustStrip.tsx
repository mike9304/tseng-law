import type { SiteLocale } from '@/lib/locales';
import { TAIPEI_MAPS_URL } from '@/data/office-locations';

/**
 * WO-X3a (EN-09): one line of existing trust facts inside the home hero, so a
 * first-time visitor sees them without scrolling to the office section.
 *
 * The first item links to the Taipei office's Google reviews — the same Maps
 * place the office card (`OfficeMapTabs.tsx`) links to, with the same wording.
 * No rating or review count is restated here (user decision 2026-09-28: the
 * figure changes on Google and a stale number could mislead). No ranking or
 * review-incentive wording (attorney advertising rules); Google is always named.
 */

type TrustCopy = {
  ariaLabel: string;
  /** Link text to the Google reviews, without a rating or count. */
  reviewsLink: string;
  /** Taiwan-licensed attorney · four Taiwan offices · consultation languages (page language first). */
  facts: readonly [string, string, string];
};

export const heroTrustCopy: Record<SiteLocale, TrustCopy> = {
  ko: {
    ariaLabel: '사무소 기본 정보',
    reviewsLink: 'Google 리뷰 보기',
    facts: ['대만 변호사', '대만 4개 사무소', '한국어·중국어·일본어·영어 상담'],
  },
  'zh-hant': {
    ariaLabel: '事務所基本資訊',
    reviewsLink: '查看 Google 評論',
    facts: ['台灣律師', '4個台灣辦公據點', '中文／韓文／日文／英文諮詢'],
  },
  en: {
    ariaLabel: 'About the firm',
    reviewsLink: 'See our Google reviews',
    facts: [
      'Taiwan-licensed attorney',
      'Four Taiwan offices',
      'Consultations in English, Chinese, Korean, and Japanese',
    ],
  },
  ja: {
    ariaLabel: '事務所の基本情報',
    reviewsLink: 'Googleのクチコミを見る',
    facts: ['台湾弁護士', '台湾4拠点', '日本語・中国語・英語・韓国語でご相談'],
  },
};

export default function HeroTrustStrip({
  locale,
  tone,
}: {
  locale: SiteLocale;
  tone: 'dark' | 'light';
}) {
  const copy = heroTrustCopy[locale];
  return (
    <ul className={`hero-trust-strip hero-trust-strip--${tone}`} aria-label={copy.ariaLabel}>
      <li className="hero-trust-item">
        <a
          className="hero-trust-rating"
          href={TAIPEI_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.reviewsLink}
        </a>
      </li>
      {copy.facts.map((fact) => (
        <li key={fact} className="hero-trust-item">
          {fact}
        </li>
      ))}
    </ul>
  );
}
