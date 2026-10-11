import Image from 'next/image';
import Link from 'next/link';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import {
  buildGuidanceQualificationSentence,
  guidanceLanguageNames,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import { getOrganizationName } from '@/lib/seo';
import styles from './ViArticle.module.css';

/** A team reference, never an attribution or a claim that this article was reviewed. */
export default function ViArticleAuthority() {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  if (!profile) return null;
  const copy = guidanceTeamCopy.vi;
  const name = profile.heading ?? profile.alternateNames[0];
  const languages = profile.languages.map((language) => guidanceLanguageNames.vi[language]).filter(Boolean);

  return (
    <section className={styles.authority} aria-label={copy.keyFactsHeading} data-vi-article-authority>
      <Image
        src={profile.image}
        alt={`${name}, ${copy.roles['tseng-junwei']}`}
        width={160}
        height={192}
        sizes="(max-width: 900px) 112px, 144px"
        className={styles.portrait}
      />
      <div className={styles.authorityCopy}>
        <p className={styles.role}>{copy.roles['tseng-junwei']}</p>
        <h3 className={styles.name}><Link href="/vi/lawyers">{name}</Link></h3>
        <p>{buildGuidanceQualificationSentence('vi', name, getOrganizationName('en'))}</p>
        <p className={styles.languages}>{copy.consultationLanguagesLabel}: {languages.join(', ')}.</p>
        <Link className={styles.profileLink} href="/vi/lawyers">Xem luật sư và đội ngũ <span aria-hidden>→</span></Link>
      </div>
    </section>
  );
}
