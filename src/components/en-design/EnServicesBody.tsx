import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { EN_HOME_SERVICES_ASSISTANCE } from '@/data/en-service-scope';
import EnPageShell, { EnBand, EnClosingBand } from './EnPageShell';
import EnLocalNav, { type EnLocalNavItem } from './EnLocalNav';
import EnSituationTable from './EnSituationTable';
import { EN_SERVICE_ORDER, orderByList } from './en-design-data';
import styles from './EnServices.module.css';

/** Short local-nav labels for the six practice titles (CONCEPT-V2 21: new short labels of existing titles). */
const EN_SERVICE_NAV_LABELS: Record<(typeof EN_SERVICE_ORDER)[number], string> = {
  labor: 'Labor',
  family: 'Family',
  criminal: 'Criminal',
  civil: 'Civil',
  investment: 'Investment',
  ip: 'IP',
};

/** Extra anchors kept from the shared services list (old #real-estate and #finance links). */
const ANCHOR_ALIASES: Record<string, readonly string[]> = { civil: ['real-estate'], ip: ['finance'] };

/**
 * en services list (CONCEPT-V2 12.3, Clear Night): title card, the rooftops band (B2), a local nav, then each
 * practice as a large row on night (title, description, its existing detail lines in two columns, "View
 * details"), the situation rows, the overseas links and the closing card. Every title, description, detail,
 * anchor and link is the shared English services data.
 */
export default function EnServicesBody({ showHero, showRepeater }: { showHero: boolean; showRepeater: boolean }) {
  const copy = pageCopy.en.services;
  const { services } = siteContent.en;
  const slugs = getServiceSlugs();
  const rows = orderByList(
    services.items.map((item, position) => ({ item, slug: slugs[position] ?? '', anchor: item.href.split('#')[1] ?? '' })),
    (entry) => entry.slug,
    EN_SERVICE_ORDER,
  );
  const navItems: EnLocalNavItem[] = rows
    .filter((row) => row.anchor && row.slug in EN_SERVICE_NAV_LABELS)
    .map((row) => ({ href: `#${row.anchor}`, label: EN_SERVICE_NAV_LABELS[row.slug as keyof typeof EN_SERVICE_NAV_LABELS] }));
  return (
    <EnPageShell page="services">
      {showHero ? (
        <>
          <PageHeader locale="en" label={copy.label} title={copy.title} description={copy.description} />
          <EnBand name="rooftops" />
        </>
      ) : null}
      {showRepeater ? (
        <>
          <EnLocalNav title={copy.title} items={navItems} />
          <section className={styles.practice} aria-label={services.title} data-presentation="editorial">
            <div className="container">
              {showHero ? null : <h2 className={styles.listTitle}>{services.title}</h2>}
              <ol className={`services-detail-list services-card-grid ${styles.rows}`}>
                {rows.map(({ item, slug, anchor }) => (
                  <li key={item.title} className={styles.rowItem}>
                    {(ANCHOR_ALIASES[anchor] ?? []).map((alias) => (
                      <span key={alias} id={alias} className={styles.alias} aria-hidden />
                    ))}
                    <article className={styles.row} id={anchor || undefined}>
                      <h2 className={styles.rowTitle} data-en-rise>{item.title}</h2>
                      <div className={styles.rowBody}>
                        <p className={styles.rowDesc}>{item.description}</p>
                        {item.details?.length ? (
                          <ul className={styles.rowDetails}>
                            {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                          </ul>
                        ) : null}
                        {slug ? (
                          <Link href={`/en/services/${slug}`} className={styles.rowMore} aria-label={`${item.title}: View details`}>
                            {/* Typed arrow kept from the shared label; EN Glyphs draws it as the en chevron (CONCEPT-V2 8.3). */}
                            View details →
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
              <div className={styles.after}>
                <p className={styles.assist}>
                  {EN_HOME_SERVICES_ASSISTANCE.beforeContact}
                  <Link href="/en/contact">{EN_HOME_SERVICES_ASSISTANCE.contactLabel}</Link>
                  {EN_HOME_SERVICES_ASSISTANCE.afterContact}
                </p>
                <div className={styles.advisory}><CorporateAdvisoryLink locale="en" /></div>
              </div>
            </div>
          </section>
        </>
      ) : null}
      <EnSituationTable />
      <div className={styles.overseas}>
        <EnAcquisitionGuideLinks locale="en" variant="compact" />
      </div>
      <EnClosingBand />
    </EnPageShell>
  );
}
