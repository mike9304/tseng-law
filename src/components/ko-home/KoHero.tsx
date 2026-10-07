import Image from 'next/image';
import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { KO_SEARCH_CHIPS } from './ko-home-content';
import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import { ZH_VIDEO_CONTROL_ICONS } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from './KoHome.module.css';

/**
 * The first screen's moving still (2026-10-07; operator chose the stone colonnade over Taipei 101 — 「촌스러워」 — and
 * asked for the light coming in to move): a colonnade in plum dusk light generated with Grok, then a Grok image-to-video
 * take where only the light drifts across the columns and floor, cut into a seamless 8 s loop (no people, text or
 * landmarks; decorative — the h1 over it carries the meaning). The first frame is the poster, which stays for reduced
 * motion and save-data visitors; phones get a portrait crop of the same loop. Same component as the zh-hant hero.
 */
export const KO_HERO_MEDIA = {
  poster: '/images/ko/hero-colonnade.webp',
  mobilePoster: '/images/ko/hero-colonnade-portrait.webp',
  mp4: '/videos/ko-hero-colonnade-light.mp4',
  webm: '/videos/ko-hero-colonnade-light.webm',
  mobileMp4: '/videos/ko-hero-colonnade-light-portrait.mp4',
  mobileWebm: '/videos/ko-hero-colonnade-light-portrait.webm',
  mobileMediaQuery: '(max-width: 767px)',
};

const searchHref = (q: string) => `/ko/search?q=${encodeURIComponent(q)}`;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden focusable="false">
      <circle cx="10.5" cy="10.5" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.6 15.6 21 21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

/**
 * ko home first screen (2026-10-07, Korean big-firm grammar): a full-bleed photograph with the headline set light in
 * white at its lower left, and the site search as a plum bar laid across the photograph's lower edge — the question
 * every visitor brings, asked first. Topic shortcuts sit under the bar.
 * Copy: site-content ko hero (title, subtitle, search prompt and button, 이메일 상담 신청, 호정칼럼 보기); the trust
 * facts are HeroTrustStrip ko; the attorney byline is team-members ko.
 */
export default function KoHero() {
  const { hero } = siteContent.ko;
  const lead = teamContent.ko.members[0];
  const mailto = getConsultationPublicMailto('ko');
  return (
    <section className={styles.hero} id="hero" aria-labelledby="ko-hero-title">
      <div className={styles.heroStage}>
        <div className={styles.heroMedia}>
          <DecorativeAutoplayVideo
            className={styles.heroMediaPlayer}
            imageClassName={styles.heroMediaImage}
            videoClassName={styles.heroMediaImage}
            poster={KO_HERO_MEDIA.poster}
            mobilePoster={KO_HERO_MEDIA.mobilePoster}
            mp4Src={KO_HERO_MEDIA.mp4}
            webmSrc={KO_HERO_MEDIA.webm}
            mobileMp4Src={KO_HERO_MEDIA.mobileMp4}
            mobileWebmSrc={KO_HERO_MEDIA.mobileWebm}
            mobileMediaQuery={KO_HERO_MEDIA.mobileMediaQuery}
            alt=""
            sizes="100vw"
            priority
            deferVideoUntilPosterPaint
            deferVideoUntilPosterPaintOnAllViewports
            rootMargin="0px"
            controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.ko}
            controlIcons={ZH_VIDEO_CONTROL_ICONS}
          />
        </div>
        <div className={`${styles.wrap} ${styles.heroInner}`}>
          <p className={styles.firm}>
            <Image src="/images/brand/hovering-seal-complete.png" alt="" width={28} height={28} />
            법무법인 호정
          </p>
          <h1 id="ko-hero-title" className={styles.heroTitle}>
            대만 법률을
            <br />
            한국어로 명확하게.
          </h1>
          <p className={styles.heroLede}>{hero.subtitle}</p>
          <div className={styles.heroActions}>
            <a href={mailto} className={styles.heroPrimary} aria-label={`이메일 상담 신청 — ${getConsultationCtaLabel('ko')}`}>
              이메일 상담 신청
            </a>
            <Link href="/ko/columns" className={styles.heroLink}>호정칼럼 보기</Link>
          </div>
          {lead ? (
            <p className={styles.byline}>
              <Link href={getAttorneyProfilePath('ko')}>
                <strong>{lead.name}</strong>
                <span>{lead.role}</span>
              </Link>
            </p>
          ) : null}
          <div className={styles.trust}>
            <HeroTrustStrip locale="ko" tone="dark" />
          </div>
        </div>
      </div>
      <div className={`${styles.wrap} ${styles.searchWrap}`}>
        <form className={styles.search} action="/ko/search" method="get" role="search">
          <label htmlFor="ko-home-search" className={styles.visuallyHidden}>{hero.searchPlaceholder}</label>
          <div className={styles.searchField}>
            <input id="ko-home-search" name="q" type="search" placeholder={hero.searchPlaceholder} autoComplete="off" />
            <button type="submit" aria-label={hero.searchButton}>
              <SearchIcon />
            </button>
          </div>
        </form>
        <ul className={styles.chips} aria-label="자주 찾는 주제">
          {KO_SEARCH_CHIPS.map((q) => (
            <li key={q}><Link href={searchHref(q)}>{q}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
