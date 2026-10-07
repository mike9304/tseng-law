import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { KO_SERVICE_SCENARIOS } from './ko-service-scenarios';
import { KO_PROCESS, KO_SITUATIONS } from './ko-home-content';
import styles from './KoHome.module.css';

/** Entry points by reader situation: three columns under one heavy rule, each a short index of links. */
export function KoSituations() {
  return (
    <nav className={styles.situations} aria-labelledby="ko-situations-title">
      <div className={styles.wrap}>
        <h2 id="ko-situations-title" className={styles.sectionTitle}>상황별로 찾기</h2>
        <ul className={styles.situationGrid}>
          {KO_SITUATIONS.map((situation) => (
            <li key={situation.title} className={styles.situation}>
              <h3 className={styles.situationTitle}>{situation.title}</h3>
              <p className={styles.situationText}>{situation.text}</p>
              <ul className={styles.situationLinks}>
                {situation.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/**
 * The six practice areas as rows of one register: the name, what the area covers (site-content ko descriptions),
 * the scenarios drawn from that description, and the link to its page.
 */
export function KoPractice() {
  const { services } = siteContent.ko;
  const slugs = getServiceSlugs();
  return (
    <section className={styles.practice} id="practice" aria-labelledby="ko-practice-title">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <h2 id="ko-practice-title" className={styles.sectionTitle}>{services.title}</h2>
          <p className={styles.sectionLede}>{services.description}</p>
        </div>
        <ul className={styles.practiceList}>
          {services.items.map((item, index) => {
            const slug = slugs[index] ?? '';
            return (
              <li key={item.href} className={styles.practiceRow}>
                <h3 className={styles.practiceName}>
                  <Link href={`/ko/services/${slug}`}>{item.title}</Link>
                </h3>
                <p className={styles.practiceText}>{item.description}</p>
                <ul className={styles.practiceTags} aria-label={`${item.title}: 주요 업무`}>
                  {(KO_SERVICE_SCENARIOS[slug] ?? []).map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** From the first email to a retained matter: a real sequence, so the steps carry numbers. */
export function KoProcess() {
  return (
    <section className={styles.process} id="process" aria-labelledby="ko-process-title">
      <div className={styles.wrap}>
        <h2 id="ko-process-title" className={styles.sectionTitle}>상담 진행 흐름</h2>
        <ol className={styles.processList}>
          {KO_PROCESS.map((step, index) => (
            <li key={step.title}>
              <span className={styles.processNo} aria-hidden>{index + 1}</span>
              <h3 className={styles.processTitle}>{step.title}</h3>
              <p className={styles.processText}>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.processActions}>
          <a href={getConsultationPublicMailto('ko')} className={styles.primary} aria-label={`이메일 상담 신청 — ${getConsultationCtaLabel('ko')}`}>
            이메일 상담 신청
          </a>
          <Link href="/ko/pricing" className={styles.textLink}>비용안내</Link>
        </div>
      </div>
    </section>
  );
}
