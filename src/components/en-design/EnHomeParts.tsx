import Image from 'next/image';
import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import { getPricingContent } from '@/components/PricingCards';
import { getConsultationGuideCopy } from '@/components/ConsultationGuideSection';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { pageCopy } from '@/data/page-copy';
import { resolveEnSituations } from './en-design-data';
import styles from './EnHome.module.css';

/**
 * Hero spec rail for the en home (replaces the building photo): who the reader will speak with,
 * how, and what the first consultation costs, as one row along the bottom of the first screen.
 * Every value restates existing data: attorney profile (name, role, image, languages), pricing
 * (consultation price, unit and details). Rendered through HeroSearch's `trustContent` slot,
 * after the read link, so the shared hero markup is unchanged.
 */
export function EnHeroTrust() {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const consultation = getPricingContent('en').items.find((item) => item.icon === 'consultation');
  if (!profile) return null;
  const displayName = profile.heading ?? profile.name;
  return (
    <>
      <Link href="/en/columns" className={styles.heroReadLink}>
        Read the columns <span aria-hidden>→</span>
      </Link>
      <div className={styles.rail} data-en-hero-brief>
        <Link href={`/en/lawyers/${profile.slug}`} className={styles.railPerson} aria-label={`${displayName}, ${profile.role}`}>
          <Image src={profile.image} alt="" width={96} height={96} className={styles.railPhoto} sizes="56px" />
          <span>
            <span className={styles.railName}>{displayName}</span>
            <span className={styles.railRole}>{profile.role}</span>
          </span>
        </Link>
        <dl className={styles.railFacts}>
          <div>
            <dt>Languages</dt>
            <dd>{profile.languages.join(', ')}</dd>
          </div>
          {consultation ? (
            <>
              <div>
                <dt>Meet</dt>
                <dd>{consultation.details[0]}</dd>
              </div>
              <div>
                <dt>{consultation.title}</dt>
                <dd>
                  <Link href="/en/pricing" className={styles.railFee} aria-label={`${consultation.price} ${consultation.unit}, ${pageCopy.en.pricing.title}`}>
                    <span className={styles.railPrice}>{consultation.price}</span>
                    <span className={styles.railUnit}> {consultation.unit} <span aria-hidden>→</span></span>
                  </Link>
                </dd>
              </div>
            </>
          ) : null}
        </dl>
      </div>
      <div className={styles.heroTrustLine}>
        <HeroTrustStrip locale="en" tone="light" />
      </div>
    </>
  );
}

/**
 * "Living or working in Taiwan": the individual situations English-speaking readers most often
 * bring, each linked to the existing practice-area or topic page and to existing English guides.
 */
export function EnSituationIndex({ posts }: { posts: readonly { slug: string; title: string }[] }) {
  const situations = resolveEnSituations(posts);
  return (
    <section className={styles.situations} aria-labelledby="en-situations-title" data-en-situations>
      <div className={styles.situationsHead}>
        <p className={styles.eyebrow}>Start here</p>
        <h2 id="en-situations-title" className={styles.sectionTitle}>Living or working in Taiwan</h2>
      </div>
      <ol className={styles.situationGrid}>
        {situations.map((situation, index) => {
          const [lead, ...rest] = situation.guideLinks.slice(0, 2);
          return (
            <li key={situation.id} className={styles.situation} data-en-situation={situation.id}>
              <span className={styles.situationNo} aria-hidden>{String(index + 1).padStart(2, '0')}</span>
              <h3 className={styles.situationTitle}>{situation.label}</h3>
              {lead ? (
                <p className={styles.situationLead}>
                  <Link href={lead.href}>{lead.title}</Link>
                </p>
              ) : null}
              <div className={styles.situationFoot}>
                <Link href={situation.href} className={styles.situationMore}>
                  {situation.hrefLabel} <span aria-hidden>→</span>
                </Link>
                {rest.length > 0 ? (
                  <details className={styles.situationExtra}>
                    <summary>{rest.length === 1 ? 'One more guide' : `${rest.length} more guides`}</summary>
                    <ul>
                      {rest.map((guide) => (
                        <li key={guide.slug}><Link href={guide.href}>{guide.title}</Link></li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Shown on the home only as links to the fees page, because their amounts carry conditions. */
const FEES_WITH_CONDITIONS = new Set(['company', 'retainer']);

/**
 * Process and fees in one block: the consultation flow and preparation list from the contact
 * guide copy; from the pricing data, the consultation fee with its appointment note, the
 * litigation quote line, links for the two fees that carry conditions, and the baseline-fee
 * disclaimer (all wording unchanged).
 */
export function EnProcessAndFees() {
  const guide = getConsultationGuideCopy('en');
  const flow = guide.cards.find((card) => card.title === 'Consultation flow');
  const prepare = guide.cards.find((card) => card.title === 'Useful materials to prepare');
  const pricing = getPricingContent('en');
  return (
    <section className={styles.process} id="process" aria-labelledby="en-process-title" data-en-process>
      <div className={`container ${styles.processLayout}`}>
        <div className={styles.processHead}>
          <p className={styles.eyebrow}>{guide.label}</p>
          <h2 id="en-process-title" className={styles.sectionTitle}>{guide.title}</h2>
          <p className={styles.sectionLede}>{guide.description}</p>
        </div>
        <div className={styles.processBody}>
          {flow ? (
            <div className={`${styles.processCol} ${styles.flowCol}`}>
              <h3 className={styles.colTitle}>{flow.title}</h3>
              <ol className={styles.steps}>
                {flow.items.map((item, index) => (
                  <li key={item}><span className={styles.stepNo} aria-hidden>{String(index + 1).padStart(2, '0')}</span><span>{item}</span></li>
                ))}
              </ol>
            </div>
          ) : null}
          <div className={styles.processPair}>
            {prepare ? (
              <div className={`${styles.processCol} ${styles.prepareCol}`}>
                <h3 className={styles.colTitle}>{prepare.title}</h3>
                <ul className={styles.checklist}>
                  {prepare.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ) : null}
            <div className={`${styles.processCol} ${styles.feeCol}`}>
              <h3 className={styles.colTitle}>{pageCopy.en.pricing.title}</h3>
              <p className={styles.feeCurrency}>{pricing.currency}</p>
              <ul className={styles.feeList}>
                {pricing.items.map((item) => (
                  // Fees with conditions (capital/shareholder limits, extra charges) are not
                  // abbreviated here: their titles link to the full entry on the fees page.
                  FEES_WITH_CONDITIONS.has(item.icon) ? (
                    <li key={item.icon}>
                      <Link href={`/en/pricing#fee-${item.icon}`} className={styles.feeLink}>
                        {item.title} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ) : (
                    <li key={item.icon}>
                      <span className={styles.feeName}>{item.title}</span>
                      <span className={styles.feeAmount}>{item.price}{item.unit ? <small> {item.unit}</small> : null}</span>
                      {item.icon === 'consultation' && item.details[3] ? <span className={styles.feeNote}>{item.details[3]}</span> : null}
                    </li>
                  )
                ))}
              </ul>
              <p className={styles.feeDisclaimer}>{pricing.disclaimer}</p>
              <Link href="/en/pricing" className={styles.feeMore}>{pageCopy.en.pricing.title} <span aria-hidden>→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
