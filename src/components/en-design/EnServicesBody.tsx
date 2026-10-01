import PageHeader from '@/components/PageHeader';
import ServicesBento from '@/components/ServicesBento';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import EnPageShell, { EnClosingBand } from './EnPageShell';
import EnSituationTable from './EnSituationTable';
import { EN_SERVICE_ORDER, orderByList } from './en-design-data';
import styles from './EnServices.module.css';

/**
 * en services list (Opus 5.5 en lane, 2026-10-01): header with a numbered index of the six
 * practice areas (in the English reading order), the practice-area cards, a situation → page
 * table, the overseas-company links and the contact band. Card copy, anchors and detail links
 * are the shared ones.
 */
export default function EnServicesBody({ showHero, showRepeater }: { showHero: boolean; showRepeater: boolean }) {
  const copy = pageCopy.en.services;
  const { services } = siteContent.en;
  const slugs = getServiceSlugs();
  const index = orderByList(
    services.items.map((item, position) => ({ item, slug: slugs[position] ?? '', anchor: item.href.split('#')[1] ?? '' })),
    (entry) => entry.slug,
    EN_SERVICE_ORDER,
  );
  return (
    <EnPageShell page="services">
      {showHero ? (
        <PageHeader locale="en" label={copy.label} title={copy.title} description={copy.description}>
          <nav className={styles.index} aria-label={services.title}>
            <p className={styles.indexTitle}>{services.title}</p>
            <ol className={styles.indexList}>
              {index.map((entry, position) => (
                <li key={entry.slug}>
                  <a href={`/en/services/${entry.slug}`}>
                    <span className={styles.indexNo} aria-hidden>{String(position + 1).padStart(2, '0')}</span>
                    <span>{entry.item.title}</span>
                    <span aria-hidden className={styles.indexArrow}>→</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </PageHeader>
      ) : null}
      {showRepeater ? (
        <div className={styles.cards}>
          <ServicesBento locale="en" showHeader={!showHero} presentation="editorial" order={EN_SERVICE_ORDER} />
        </div>
      ) : null}
      <EnSituationTable />
      <EnAcquisitionGuideLinks locale="en" variant="compact" />
      <EnClosingBand />
    </EnPageShell>
  );
}
