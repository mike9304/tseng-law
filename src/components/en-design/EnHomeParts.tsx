import Image from 'next/image';
import Link from 'next/link';
import HeroTrustStrip from '@/components/HeroTrustStrip';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { resolveEnSituations } from './en-design-data';
import { EnChevron } from './EnChevron';
import EnFilm, { EN_ROOFTOPS_FILM } from './EnFilm';
import styles from './EnStory.module.css';

/**
 * Rendered through HeroSearch's `trustContent` slot (CONCEPT-V2 6.1, S0b): the read link beside the email
 * pill in the first screen, then the credits that open the second screen: who you write to (portrait, name,
 * role, profile link) and the existing trust strip. Every value is existing data.
 */
export function EnHeroTrust() {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const displayName = profile ? profile.heading ?? profile.name : null;
  return (
    <>
      <Link href="/en/columns" className={styles.heroReadLink}>
        Read the columns
        <EnChevron />
      </Link>
      {profile && displayName ? (
        <Link href={`/en/lawyers/${profile.slug}`} className={styles.heroByline} aria-label={`${displayName}, ${profile.role}`}>
          <Image src={profile.image} alt="" width={96} height={96} className={styles.heroBylinePhoto} sizes="48px" />
          <span className={styles.heroBylineText}>
            <span className={styles.heroBylineName}>{displayName}</span>
            <span className={styles.heroBylineRole}>{profile.role}</span>
          </span>
        </Link>
      ) : null}
      <div className={styles.heroTrustLine}>
        <HeroTrustStrip locale="en" tone="light" />
      </div>
    </>
  );
}

/**
 * S1 "Living or working in Taiwan" (CONCEPT-V2 7, S1): the eight situations English-speaking readers most
 * often bring, as captions over the pinned rooftops film. Each caption links to the column with that guide's
 * own title and to the existing practice-area or topic page; extra guides stay in their disclosure.
 */
export function EnSituationIndex({ posts }: { posts: readonly { slug: string; title: string }[] }) {
  const situations = resolveEnSituations(posts);
  return (
    <section className={styles.reel} data-reel="city" id="start" aria-labelledby="en-situations-title" data-en-situations>
      <EnFilm reel="city" media={EN_ROOFTOPS_FILM} />
      <div className={styles.reelFlow}>
        <div className={`container ${styles.cityHead}`}>
          <p className={styles.eyebrow}>Start here</p>
          <h2 id="en-situations-title" className={styles.cityTitle}>Living or working in Taiwan</h2>
        </div>
        <ol className={`container ${styles.captions}`}>
          {situations.map((situation) => {
            const [lead, ...rest] = situation.guideLinks.slice(0, 2);
            return (
              <li key={situation.id} className={styles.caption} data-en-situation={situation.id}>
                <h3 className={styles.captionTitle}>{situation.label}</h3>
                {lead ? (
                  <p className={styles.captionLead}>
                    <Link href={lead.href}>{lead.title}</Link>
                  </p>
                ) : null}
                <div className={styles.captionFoot}>
                  <Link href={situation.href} className={styles.captionMore}>
                    {situation.hrefLabel}
                    <EnChevron />
                  </Link>
                  {rest.length > 0 ? (
                    <details className={styles.captionExtra}>
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
        <div className={styles.outro} aria-hidden="true" />
      </div>
    </section>
  );
}
