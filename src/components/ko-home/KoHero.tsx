import Image from 'next/image';
import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { KO_LEDGER, KO_SEARCH_CHIPS } from './ko-home-content';
import styles from './KoHome.module.css';

const searchHref = (q: string) => `/ko/search?q=${encodeURIComponent(q)}`;

/**
 * ko home first screen (2026-10-06): no footage — the firm's work itself. The headline and the email action on the
 * left; on the right the glossary of Taiwan legal terms the firm writes about, each 漢字 term set beside the Korean
 * the ko columns use for it. That is what the Korean site is for: Taiwan law, read in Korean.
 * Copy: site-content ko hero (title, subtitle, search prompt and button, 이메일 상담 신청, 호정칼럼 보기); the trust
 * facts are HeroTrustStrip ko; the attorney byline is team-members ko.
 */
export default function KoHero() {
  const { hero } = siteContent.ko;
  const lead = teamContent.ko.members[0];
  const mailto = getConsultationPublicMailto('ko');
  return (
    <section className={styles.hero} id="hero" aria-labelledby="ko-hero-title">
      <div className={`${styles.wrap} ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.firm}>
            <Image src="/images/brand/hovering-seal-official.png" alt="" width={32} height={32} />
            법무법인 호정
          </p>
          <h1 id="ko-hero-title" className={styles.heroTitle}>
            대만 법률을
            <br />
            한국어로 명확하게.
          </h1>
          <p className={styles.heroLede}>{hero.subtitle}</p>
          <div className={styles.heroActions}>
            <a href={mailto} className={styles.primary} aria-label={`이메일 상담 신청 — ${getConsultationCtaLabel('ko')}`}>
              이메일 상담 신청
            </a>
            <Link href="/ko/columns" className={styles.textLink}>호정칼럼 보기</Link>
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
            <HeroTrustStrip locale="ko" tone="light" />
          </div>
        </div>
        <aside className={styles.ledger} aria-labelledby="ko-ledger-title">
          <p id="ko-ledger-title" className={styles.ledgerTitle}>대만 법률 용어, 한국어로</p>
          <ul className={styles.ledgerList}>
            {KO_LEDGER.map((row, index) => (
              <li key={row.han} style={{ ['--i' as string]: index }}>
                <Link href={searchHref(row.ko)} className={styles.ledgerRow}>
                  <span className={styles.han} lang="zh-Hant">{row.han}</span>
                  <span className={styles.koTerm}>{row.ko}</span>
                  <span className={styles.area}>{row.area}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className={styles.wrap}>
        <form className={styles.search} action="/ko/search" method="get" role="search">
          <label htmlFor="ko-home-search" className={styles.searchLabel}>{hero.searchPlaceholder}</label>
          <div className={styles.searchField}>
            <input id="ko-home-search" name="q" type="search" placeholder="예: 회사 설립" autoComplete="off" />
            <button type="submit">{hero.searchButton}</button>
          </div>
          <ul className={styles.chips} aria-label="자주 찾는 주제">
            {KO_SEARCH_CHIPS.map((q) => (
              <li key={q}><Link href={searchHref(q)}>{q}</Link></li>
            ))}
          </ul>
        </form>
      </div>
    </section>
  );
}
