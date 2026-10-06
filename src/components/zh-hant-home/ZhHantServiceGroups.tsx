import Link from 'next/link';
import ZhHantMonoIcon, { ZH_PRACTICE_ICON, ZhHantTrail } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import { ZH_HANT_SERVICE_SCENARIOS } from './zh-hant-service-scenarios';
import { KO_SERVICE_SCENARIOS } from '@/components/ko-home/ko-service-scenarios';
import type { AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from '../ZhHantServices.module.css';

/**
 * zh-hant services list for Taiwanese readers: the six existing practice cards grouped
 * individuals & family → work & IP → foreign clients (company setup last, 2026-10-01 direction).
 * Card text, links and anchors (#investment, #civil, aliases #real-estate and #finance) are
 * unchanged; only the arrangement is new. ko shares it since 2026-10-06 with its own grouping (below).
 */
type ServiceGroup = { id: string; title: string; text: string; slugs: readonly string[] };

const GROUPS: Record<AppleDesignLocale, readonly ServiceGroup[]> = {
  'zh-hant': [
    { id: 'individual', title: '個人與家庭', text: '車禍與損害賠償、契約糾紛、離婚與繼承、刑事案件。', slugs: ['civil', 'family', 'criminal'] },
    { id: 'work', title: '勞資與智慧財產', text: '解僱與資遣費、商標與著作權、金融投資爭議。', slugs: ['labor', 'ip'] },
    { id: 'foreign', title: '在台外國人與外國企業', text: '在台設立公司、投資審查與特殊行業許可。', slugs: ['investment'] },
  ],
  // ko (2026-10-06): the same three situations as the ko home bento (KoAudienceDoors), company setup first for
  // Korean companies; each line restates the ko services' own descriptions.
  ko: [
    { id: 'company', title: '대만 진출 기업', text: '법인 형태 선택부터 투자심의위원회 승인, 업종별 인허가, 상표 선등록 확인까지.', slugs: ['investment', 'labor', 'ip'] },
    { id: 'disputes', title: '분쟁과 소송', text: '계약 분쟁과 손해배상, 소비자 피해, 형사 절차의 수사 대응.', slugs: ['civil', 'criminal'] },
    { id: 'family', title: '대만의 가족과 생활', text: '이혼과 재산분할, 친권, 상속.', slugs: ['family'] },
  ],
};

/** ko service order (2026-10-06): the group order above. */
export const KO_SERVICE_ORDER = ['investment', 'labor', 'ip', 'civil', 'criminal', 'family'] as const;

const CARD_LABELS: Record<AppleDesignLocale, { tags: string; detail: string; sep: string }> = {
  'zh-hant': { tags: '常見情境', detail: '查看詳情', sep: '：' },
  ko: { tags: '주요 업무', detail: '자세히 보기', sep: ': ' },
};

const ALIASES: Record<string, string[]> = { civil: ['real-estate'], ip: ['finance'] };

export default function ZhHantServiceGroups({ showTitle, locale = 'zh-hant' }: { showTitle: boolean; locale?: AppleDesignLocale }) {
  const { services } = siteContent[locale];
  const scenarios = locale === 'ko' ? KO_SERVICE_SCENARIOS : ZH_HANT_SERVICE_SCENARIOS;
  const labels = CARD_LABELS[locale];
  const slugs = getServiceSlugs();
  return (
    <section className={`section ${styles.groups}`} aria-label={showTitle ? undefined : services.title} data-presentation="editorial">
      <div className="container">
        {showTitle ? <h2 className="section-title">{services.title}</h2> : null}
        {GROUPS[locale].map((group) => (
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
                      <span className={styles.cardIcon} aria-hidden><ZhHantMonoIcon name={ZH_PRACTICE_ICON[index] ?? 'company'} size={48} /></span>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardText}>{item.description}</p>
                      <ul className={styles.cardTags} aria-label={`${item.title}${labels.sep}${labels.tags}`}>
                        {(scenarios[slug] ?? []).map((tag) => <li key={tag}>{tag}</li>)}
                      </ul>
                      <Link href={`/${locale}/services/${slug}`} className={styles.cardLink} aria-label={`${item.title}${labels.sep}${labels.detail}`}>
                        {labels.detail}<ZhHantTrail />
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
