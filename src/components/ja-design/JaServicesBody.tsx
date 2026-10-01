import PageHeader from '@/components/PageHeader';
import ServicesBento from '@/components/ServicesBento';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import JaPageShell from './JaPageShell';
import { JA_SERVICE_ORDER } from './ja-arrangement';
import styles from './JaServices.module.css';

/** Small structural label for the in-page index (no new claim). */
export const JA_SERVICES_INDEX_LABEL = '取扱分野の一覧';

/**
 * ja services list (Opus 5.5 ja lane, 2026-10-01): paper header with a numbered index of the
 * six practice areas (in-page anchors only), then the practice areas as ruled rows in the
 * Japanese demand order (JA_SERVICE_ORDER), then the existing 日系企業 entry links.
 * Titles, descriptions and detail links are the existing ja service copy.
 */
export default function JaServicesBody({ showHero, showRepeater }: { showHero: boolean; showRepeater: boolean }) {
  const copy = pageCopy.ja.services;
  const { services } = siteContent.ja;
  const slugs = getServiceSlugs();
  const indexed = JA_SERVICE_ORDER.map((slug) => {
    const item = services.items[slugs.indexOf(slug)];
    return item ? { slug, title: item.title, anchor: item.href.split('#')[1] ?? slug } : null;
  }).filter((entry): entry is { slug: (typeof JA_SERVICE_ORDER)[number]; title: string; anchor: string } => entry !== null);
  return (
    <JaPageShell page="services" className={styles.root}>
      {showHero ? (
        <PageHeader locale="ja" label={copy.label} title={copy.title} description={copy.description}>
          <nav className={styles.index} aria-label={JA_SERVICES_INDEX_LABEL}>
            <p className={styles.indexLabel} aria-hidden>{JA_SERVICES_INDEX_LABEL}</p>
            <ol className={styles.indexList}>
              {indexed.map((entry, index) => (
                <li key={entry.slug}>
                  <a href={`#${entry.anchor}`} className={styles.indexLink}>
                    <span className={styles.indexNo} aria-hidden>{String(index + 1).padStart(2, '0')}</span>
                    <span>{entry.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </PageHeader>
      ) : null}
      {showRepeater ? (
        <ServicesBento locale="ja" showHeader={!showHero} presentation="editorial" order={JA_SERVICE_ORDER} />
      ) : null}
      <EnAcquisitionGuideLinks locale="ja" variant="compact" />
    </JaPageShell>
  );
}
