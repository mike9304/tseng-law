import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getOverseasEntryContent } from '@/components/EnAcquisitionGuideLinks';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { getCorporateAdvisory, getCorporateAdvisoryHref } from '@/data/corporate-advisory';
import JaPageShell from './JaPageShell';
import JaPageRail from './JaPageRail';
import { JA_SERVICE_ORDER } from './ja-arrangement';
import v2 from './JaPagesV2.module.css';
import styles from './JaServices.module.css';

/** Existing label of the in-page index on the service pages (CONCEPT-V2 §13.2). */
export const JA_SERVICES_INDEX_LABEL = 'このページの内容';
const DETAIL_LABEL = '詳しく見る';

/**
 * ja services list, 昊 V2 (2026-10-02; CONCEPT-V2 §9 and C4). The six practice areas in the Japanese
 * demand order (JA_SERVICE_ORDER) as contiguous reading blocks beside a vertical 目次 (a sticky tab row
 * below 1200 px), each with its full description and the same detail link and aria-label that
 * ServicesBento renders; then the corporate advisory tile and the 日系企業 doors as tiles.
 * Anchors (#investment, #civil and the #real-estate / #finance aliases) are kept for existing links.
 *
 * Merge note: the home lane's `kou/JaPracticeIndex` covers the same block on the home; at merge it can
 * replace the practice section below (keep these ids and aria-labels).
 */
export default function JaServicesBody({ showHero, showRepeater }: { showHero: boolean; showRepeater: boolean }) {
  const copy = pageCopy.ja.services;
  const { services } = siteContent.ja;
  const slugs = getServiceSlugs();
  const areas = JA_SERVICE_ORDER.map((slug) => {
    const index = slugs.indexOf(slug);
    const item = services.items[index];
    if (!item) return null;
    const anchor = item.href.split('#')[1] ?? slug;
    const aliases = anchor === 'civil' ? ['real-estate'] : anchor === 'ip' ? ['finance'] : [];
    return { slug, anchor, aliases, title: item.title, description: item.description };
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  const doors = getOverseasEntryContent('ja');
  const advisory = getCorporateAdvisory('ja');
  const advisoryHref = getCorporateAdvisoryHref('ja');

  return (
    <JaPageShell page="services" className={styles.root}>
      {showHero ? <PageHeader locale="ja" label={copy.label} title={copy.title} description={copy.description} /> : null}
      {showRepeater ? (
        <section className={styles.practice} aria-label={services.title}>
          <div className={`container ${styles.practiceGrid}`}>
            <JaPageRail className={styles.rail} label={JA_SERVICES_INDEX_LABEL} items={areas.map((area) => ({ id: area.anchor, label: area.title }))} />
            <div className={styles.blocks}>
              {areas.map((area) => (
                <div key={area.slug} className={`${styles.blockWrap} ${v2.fusR}`}>
                  {area.aliases.map((alias) => <span key={alias} id={alias} className={styles.alias} aria-hidden />)}
                  {/* same card and title classes as ServicesBento, so the list keeps its structure contract */}
                  <article id={area.anchor} className="services-detail-card services-card">
                    <h2 className="services-detail-title">{area.title}</h2>
                    <p className={styles.blockText}>{area.description}</p>
                    <Link href={`/ja/services/${area.slug}`} className={v2.chev} aria-label={`${area.title}: ${DETAIL_LABEL}`}>
                      {DETAIL_LABEL}
                    </Link>
                  </article>
                </div>
              ))}
              {advisory && advisoryHref ? (
                <div className={`${v2.tile} ${styles.advisory} ${v2.fusR}`}>
                  <p className={styles.advisoryTitle}>
                    <Link href={advisoryHref} className={v2.chev}>{advisory.headline}</Link>
                  </p>
                  <p className={v2.tileText}>{advisory.summary}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
      {doors ? (
        <section className={styles.doors} aria-labelledby="overseas-entry-compact-heading" data-overseas-entry="compact">
          <div className="container">
            <h2 id="overseas-entry-compact-heading" className={styles.doorsTitle}>{doors.heading}</h2>
            <p className={styles.doorsLede}>{doors.lede}</p>
            <ul className={styles.doorGrid}>
              {doors.items.map((item, index) => (
                <li key={item.href} className={index % 3 === 0 ? v2.fusL : v2.fusR}>
                  <Link href={item.href} className={`${v2.tile} ${styles.door}`}>
                    <span className={`${v2.tileTitle} ${v2.chev} ${styles.doorTitle}`}>{item.label}</span>
                    <span className={styles.doorText}>{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </JaPageShell>
  );
}
