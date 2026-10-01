import Link from 'next/link';
import ServicePracticeIcon from '@/components/ServicePracticeIcon';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { ZH_HANT_SERVICE_SCENARIOS } from './zh-hant-service-scenarios';
import styles from '../ZhHantServices.module.css';

/**
 * zh-hant services list, second pass: the six existing practice cards in two groups
 * (business / individuals). Card text, links and anchors (#investment, #civil,
 * aliases #real-estate and #finance) are unchanged; only the arrangement is new.
 */
const GROUPS = [
  { id: 'business', title: '企業與商務', text: '公司設立與投資、勞資關係、智慧財產與金融爭議。', slugs: ['investment', 'labor', 'ip'] },
  { id: 'individual', title: '個人與家庭', text: '契約與損害賠償、離婚與繼承、刑事案件。', slugs: ['civil', 'family', 'criminal'] },
] as const;

const ALIASES: Record<string, string[]> = { civil: ['real-estate'], ip: ['finance'] };

export default function ZhHantServiceGroups({ showTitle }: { showTitle: boolean }) {
  const { services } = siteContent['zh-hant'];
  const slugs = getServiceSlugs();
  return (
    <section className={`section ${styles.groups}`} aria-label={showTitle ? undefined : services.title} data-presentation="editorial">
      <div className="container">
        {showTitle ? <h2 className="section-title">{services.title}</h2> : null}
        {GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <div className={styles.groupHead}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <p className={styles.groupText}>{group.text}</p>
            </div>
            <ul className={styles.groupGrid}>
              {group.slugs.map((slug) => {
                const index = slugs.indexOf(slug);
                const item = services.items[index];
                if (!item) return null;
                const anchor = item.href.split('#')[1];
                return (
                  <li key={slug} className={styles.card}>
                    {(ALIASES[slug] ?? []).map((alias) => <span key={alias} id={alias} className="services-anchor-alias" aria-hidden />)}
                    <article {...(anchor ? { id: anchor } : {})}>
                      <span className={styles.cardIcon} aria-hidden><ServicePracticeIcon index={index} /></span>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardText}>{item.description}</p>
                      <ul className={styles.cardTags} aria-label={`${item.title}：常見情境`}>
                        {(ZH_HANT_SERVICE_SCENARIOS[slug] ?? []).map((tag) => <li key={tag}>{tag}</li>)}
                      </ul>
                      <Link href={`/zh-hant/services/${slug}`} className={styles.cardLink} aria-label={`${item.title}：查看詳情`}>
                        查看詳情 →
                      </Link>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
