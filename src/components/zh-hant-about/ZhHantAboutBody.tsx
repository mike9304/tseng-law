import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import { firmIntroductionContent } from '@/data/firm-introduction';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import ZhHantFirmIntro from './ZhHantFirmIntro';
import ZhHantAboutContact from './ZhHantAboutContact';
import ZhHantTeam from '@/components/zh-hant-team/ZhHantTeam';
import styles from './ZhHantAbout.module.css';

const founded = firmIntroductionContent['zh-hant'].paragraphs[0]?.match(/(\d{4})年/)?.[1];

/**
 * zh-hant about page, second pass (son7-87 / Opus 5.5, 2026-10-01). Facts in the header panel
 * restate this page's own content: the founding year (firm introduction), the office names
 * (contact locations) and the four consultation languages (services copy: 中文、韓文、日文或英文).
 * Header actions reuse existing labels and links: the contact CTA (mailto) and 聯絡方式 (/zh-hant/contact).
 */
export default function ZhHantAboutBody() {
  const copy = pageCopy['zh-hant'].about;
  const { contact } = siteContent['zh-hant'];
  const facts = [
    founded ? { term: '創立', value: `${founded}年` } : null,
    { term: '據點', value: contact.locations.map((office) => office.title.replace(/所$/, '')).join('・') },
    { term: '溝通語言', value: '中文・韓文・日文・英文' },
  ].filter((fact): fact is { term: string; value: string } => fact !== null);
  const jumps = [
    { href: '#firm', label: firmIntroductionContent['zh-hant'].title },
    { href: '#team', label: teamContent['zh-hant'].title },
    { href: '#about-contact', label: contact.title },
  ];
  return (
    <div className={styles.root} id="zh-hant-about" data-zh-hant-design="about">
      <PageHeader locale="zh-hant" label={copy.label} title={copy.title} description={copy.description}>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.term} className={`${styles.fact} ${fact.term === '創立' ? styles.factYear : ''}`}>
              <dt>{fact.term}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.headerActions}>
          <a
            href={getConsultationPublicMailto('zh-hant')}
            className={styles.headerPrimary}
            aria-label={`${contact.cta.label} — ${getConsultationCtaLabel('zh-hant')}`}
          >
            {contact.cta.label}
          </a>
          <Link href="/zh-hant/contact" className={styles.headerSecondary}>聯絡方式 <span aria-hidden>›</span></Link>
        </div>
        <nav className={styles.jumps} aria-label="本頁內容">
          {jumps.map((jump) => <a key={jump.href} href={jump.href}>{jump.label}</a>)}
        </nav>
      </PageHeader>
      <ZhHantFirmIntro />
      <ZhHantTeam />
      <ZhHantAboutContact />
    </div>
  );
}
