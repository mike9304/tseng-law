import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { pageCopy } from '@/data/page-copy';
import { firmIntroductionContent } from '@/data/firm-introduction';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import ZhHantFirmIntro from './ZhHantFirmIntro';
import ZhHantAboutContact from './ZhHantAboutContact';
import ZhHantTeam from '@/components/zh-hant-team/ZhHantTeam';
import { appleDesignRootProps, type AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantAbout.module.css';

const ABOUT_LABELS: Record<AppleDesignLocale, {
  founded: string;
  offices: string;
  languages: string;
  languagesValue: string;
  contactLink: string;
  jumpsLabel: string;
  yearPattern: RegExp;
  yearSuffix: string;
  officeSuffix: RegExp;
  officeJoin: string;
}> = {
  'zh-hant': {
    founded: '創立',
    offices: '據點',
    languages: '溝通語言',
    languagesValue: '中文・韓文・日文・英文',
    contactLink: '聯絡方式',
    jumpsLabel: '本頁內容',
    yearPattern: /(\d{4})年/,
    yearSuffix: '年',
    officeSuffix: /所$/,
    officeJoin: '・',
  },
  // ko (2026-10-06): the year from the ko firm introduction (「2016년」), the ko office titles without 「 사무소」, and the
  // consultation languages as the hero trust line writes them (한국어·중국어·일본어·영어); 연락처 is the header utility label.
  ko: {
    founded: '설립',
    offices: '사무소',
    languages: '상담 언어',
    languagesValue: '한국어·중국어·일본어·영어',
    contactLink: '연락처',
    jumpsLabel: '이 페이지 내용',
    yearPattern: /(\d{4})년/,
    yearSuffix: '년',
    officeSuffix: /\s*사무소$/,
    officeJoin: '·',
  },
};

/**
 * zh-hant about page, second pass (son7-87 / Opus 5.5, 2026-10-01). Facts in the header panel
 * restate this page's own content: the founding year (firm introduction), the office names
 * (contact locations) and the four consultation languages (services copy: 中文、韓文、日文或英文).
 * Header actions reuse existing labels and links: the contact CTA (mailto) and 聯絡方式 (/zh-hant/contact).
 * ko shares the page since 2026-10-06 (`locale="ko"`), with the ko labels above.
 */
export default function ZhHantAboutBody({ locale = 'zh-hant' }: { locale?: AppleDesignLocale } = {}) {
  const copy = pageCopy[locale].about;
  const { contact } = siteContent[locale];
  const labels = ABOUT_LABELS[locale];
  const founded = firmIntroductionContent[locale].paragraphs[0]?.match(labels.yearPattern)?.[1];
  const facts = [
    founded ? { term: labels.founded, value: `${founded}${labels.yearSuffix}`, year: true } : null,
    { term: labels.offices, value: contact.locations.map((office) => office.title.replace(labels.officeSuffix, '')).join(labels.officeJoin), year: false },
    { term: labels.languages, value: labels.languagesValue, year: false },
  ].filter((fact): fact is { term: string; value: string; year: boolean } => fact !== null);
  const jumps = [
    { href: '#firm', label: firmIntroductionContent[locale].title },
    { href: '#team', label: teamContent[locale].title },
    { href: '#about-contact', label: contact.title },
  ];
  return (
    <div className={styles.root} {...appleDesignRootProps(locale, 'about')}>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.term} className={`${styles.fact} ${fact.year ? styles.factYear : ''}`}>
              <dt>{fact.term}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.headerActions}>
          <a
            href={getConsultationPublicMailto(locale)}
            className={styles.headerPrimary}
            aria-label={`${contact.cta.label} — ${getConsultationCtaLabel(locale)}`}
          >
            {contact.cta.label}
          </a>
          <Link href={`/${locale}/contact`} className={styles.headerSecondary}>{labels.contactLink}<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} /></Link>
        </div>
        <nav className={styles.jumps} aria-label={labels.jumpsLabel}>
          {jumps.map((jump) => <a key={jump.href} href={jump.href}>{jump.label}</a>)}
        </nav>
      </PageHeader>
      <ZhHantFirmIntro locale={locale} />
      <ZhHantTeam locale={locale} />
      <ZhHantAboutContact locale={locale} />
    </div>
  );
}
