import Image from 'next/image';
import Link from 'next/link';
import HomeStatsSection from '@/components/HomeStatsSection';
import { getHomeAttorneyCopy } from '@/components/HomeAttorneySplit';
import { getAttorneyProfile, getAttorneyProfilePath, primaryAttorneySlug } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import {
  homeAttorneyButtonSurfaceIds,
  homeAttorneyImageSurfaceIds,
  homeAttorneyTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';
import { EnChevron } from './EnChevron';
import styles from './EnStory.module.css';

/** "Attorney Wei Tseng, Taiwan Legal Partner …" → the name (white) and the rest (grey); same string, colour only. */
function TwoToneTitle({ title }: { title: string }) {
  const index = title.indexOf(', ');
  if (index === -1) return <>{title}</>;
  return (
    <>
      <span className={styles.aboutTitleKey}>{title.slice(0, index + 1)}</span>
      {title.slice(index + 1)}
    </>
  );
}

/**
 * S6 (CONCEPT-V2 7, S6): the person behind the email, then the facts from her profile. The same data and
 * builder surfaces as the shared HomeAttorneySplit (title, intro, summary, contact line, profile link,
 * portrait), set on a warm black that matches the portrait's backdrop; her four consultation languages as
 * display words; then the shared figures section as plain rows (the figures never count up).
 */
export default function EnAttorneyStage() {
  const copy = getHomeAttorneyCopy('en');
  const lead = teamContent.en.members[0];
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const profilePath = getAttorneyProfilePath('en');
  const contactLine = `${lead.name} · ${lead.role} · ${lead.email}`;
  const languages = profile?.languages ?? [];
  return (
    <div className={styles.about} data-en-about>
      <section className={styles.aboutSection} id="about" aria-labelledby="en-about-title">
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutMedia}>
            <Image
              src={lead.photo}
              alt={`${lead.name} ${lead.role}`}
              width={1760}
              height={2640}
              sizes="(max-width: 767px) 90vw, 480px"
              className={styles.portrait}
              data-builder-surface-key={homeAttorneyImageSurfaceIds[0]}
            />
          </div>
          <div className={styles.aboutCopy}>
            <h2 id="en-about-title" className={styles.aboutTitle} data-builder-surface-key={homeAttorneyTextSurfaceIds[1]}>
              <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[1]}>
                <TwoToneTitle title={copy.title} />
              </SurfaceText>
            </h2>
            <div className={styles.aboutText}>
              <p data-builder-surface-key={homeAttorneyTextSurfaceIds[2]}>
                <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[2]}>{lead.intro[0]}</SurfaceText>
              </p>
              <p data-builder-surface-key={homeAttorneyTextSurfaceIds[3]}>
                <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[3]}>{lead.intro[1]}</SurfaceText>
              </p>
              <p data-builder-surface-key={homeAttorneyTextSurfaceIds[4]}>
                <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[4]}>{copy.summary}</SurfaceText>
              </p>
              <p className={styles.aboutContact} data-builder-surface-key={homeAttorneyTextSurfaceIds[5]}>
                <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[5]}>{contactLine}</SurfaceText>
              </p>
            </div>
            <Link href={profilePath} className={styles.textLink} data-builder-surface-key={homeAttorneyButtonSurfaceIds[0]}>
              <SurfaceText surfaceKey={homeAttorneyButtonSurfaceIds[0]}>{copy.cta}</SurfaceText>
              <EnChevron />
            </Link>
            {languages.length ? (
              <div className={styles.words}>
                <p className={styles.wordsLabel}>Languages</p>
                <ul className={styles.wordList}>
                  {languages.map((language) => (
                    <li key={language} className={styles.word}>{language}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <div className={styles.figures}>
        <HomeStatsSection locale="en" countUp={false} plainLede />
      </div>
    </div>
  );
}
