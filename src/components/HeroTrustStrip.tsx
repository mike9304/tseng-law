import type { SiteLocale } from '@/lib/locales';
import { TAIPEI_MAPS_URL } from '@/data/office-locations';

/**
 * WO-X3a (EN-09): one line of existing trust facts inside the home hero, so a
 * first-time visitor sees them without scrolling to the office section.
 *
 * The rating is the same Google Places figure the Taipei office card shows
 * (`OfficeMapTabs.tsx`, "Google 플레이스 2026-07-21 기준, 수동 갱신") and links to
 * the same Google Maps place. `hero-trust-strip.test.ts` fails when the two
 * copies drift apart, so update both together. No ranking or review-incentive
 * wording (attorney advertising rules); the source (Google) is always named.
 */
export const HERO_TRUST_RATING_VALUE = '5.0';
export const HERO_TRUST_REVIEW_COUNT = 17;

type TrustCopy = {
  ariaLabel: string;
  rating: string;
  /** Taiwan-licensed attorney · four Taiwan offices · consultation languages (page language first). */
  facts: readonly [string, string, string];
};

export const heroTrustCopy: Record<SiteLocale, TrustCopy> = {
  ko: {
    ariaLabel: '사무소 기본 정보',
    rating: `Google ${HERO_TRUST_RATING_VALUE} · 리뷰 ${HERO_TRUST_REVIEW_COUNT}개`,
    facts: ['대만 변호사', '대만 4개 사무소', '한국어·중국어·일본어·영어 상담'],
  },
  'zh-hant': {
    ariaLabel: '事務所基本資訊',
    rating: `Google ${HERO_TRUST_RATING_VALUE} · ${HERO_TRUST_REVIEW_COUNT} 則評論`,
    facts: ['台灣律師', '4個台灣辦公據點', '中文／韓文／日文／英文諮詢'],
  },
  en: {
    ariaLabel: 'About the firm',
    rating: `Google ${HERO_TRUST_RATING_VALUE} · ${HERO_TRUST_REVIEW_COUNT} reviews`,
    facts: [
      'Taiwan-licensed attorney',
      'Four Taiwan offices',
      'Consultations in English, Chinese, Korean, and Japanese',
    ],
  },
  ja: {
    ariaLabel: '事務所の基本情報',
    rating: `Google ${HERO_TRUST_RATING_VALUE}・クチコミ${HERO_TRUST_REVIEW_COUNT}件`,
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
          <span className="hero-trust-star" aria-hidden="true">★</span>
          {copy.rating}
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
