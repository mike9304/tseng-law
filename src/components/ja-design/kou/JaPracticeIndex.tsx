import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import { homeServicesTextSurfaceIds } from '@/lib/builder/registry';
import { JA_SERVICE_ORDER } from '@/components/ja-design/ja-arrangement';
import { JA_KOU_REUSED } from './ja-copy';
import JaChevron from './JaChevron';
import JaIndexSync from './JaIndexSync';
import { JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import p from './JaPractice.module.css';

export type JaPracticeArea = { slug: string; title: string; description: string; href: string; ariaLabel: string };

/** The six areas in Japanese demand order, with the same detail hrefs and aria-labels ServicesBento renders for ja. */
export function getJaPracticeAreas(): JaPracticeArea[] {
  const slugs = getServiceSlugs();
  const items = siteContent.ja.services.items;
  return JA_SERVICE_ORDER.flatMap((slug) => {
    const item = items[slugs.indexOf(slug)];
    if (!item) return [];
    return [{
      slug,
      title: item.title,
      description: item.description,
      href: `/ja/services/${slug}`,
      ariaLabel: `${item.title}: ${JA_KOU_REUSED.detailLink.text}`,
    }];
  });
}

/**
 * C4 「縦の目次」: 主要サービス with a vertical index set like a Japanese book (CONCEPT-V2 §5 C4). Reusable on /ja/services
 * (`id` and `headingLevel` let the lead mount it there; the lead mounts it, this lane does not touch inner routes).
 */
export default function JaPracticeIndex({ id = 'practice', showHeader = true }: { id?: string; showHeader?: boolean }) {
  const services = siteContent.ja.services;
  const areas = getJaPracticeAreas();
  const titleId = `${id}-title`;
  return (
    <section id={id} className={`${k.wrap} ${p.section}`} aria-labelledby={showHeader ? titleId : undefined} aria-label={showHeader ? undefined : services.title}>
      {showHeader ? (
        <div className={p.head}>
          <h2 id={titleId} className={k.h2} data-builder-surface-key={homeServicesTextSurfaceIds[1]}>
            {services.title}
          </h2>
          <p className={`${k.lede} ${p.lede}`} data-builder-surface-key={homeServicesTextSurfaceIds[2]}>
            {services.description}
          </p>
        </div>
      ) : null}
      <div className={p.layout}>
        <nav className={p.index} aria-labelledby={showHeader ? titleId : undefined} aria-label={showHeader ? undefined : services.title}>
          <ul className={p.indexList} data-index-row="">
            {areas.map((area) => (
              <li key={area.slug}>
                <a className={p.indexLink} href={`#ja-${id}-${area.slug}`} data-index-link="">
                  {area.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={p.blocks}>
          {areas.map((area) => (
            <article key={area.slug} id={`ja-${id}-${area.slug}`} className={p.block} data-index-block="">
              <h3 className={`${p.blockTitle} ${k.ph} ${k.rise}`}>
                <JaPhrases text={area.title} />
              </h3>
              <p className={p.blockText}>{area.description}</p>
              <Link className={k.textLink} href={area.href} aria-label={area.ariaLabel}>
                {JA_KOU_REUSED.detailLink.text}
                <JaChevron />
              </Link>
            </article>
          ))}
          <div className={p.advisory}>
            <CorporateAdvisoryLink locale="ja" />
          </div>
        </div>
      </div>
      <JaIndexSync rootId={id} />
    </section>
  );
}
