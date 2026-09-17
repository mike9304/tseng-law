import Link from 'next/link';
import {
  guidanceContent,
  type GuidanceLocale,
} from '@/data/international-guidance-content';
import {
  EXISTING_SITE_LOCALES_4,
  PUBLIC_LANGUAGE_AUTONYMS,
} from '@/lib/public-guidance';
import styles from './InternationalGuidance.module.css';

/**
 * Only the "read the original language columns" block survives here.
 *
 * The full guidance shell this file used to export (its own brand bar, nav,
 * `<main>`, footer and a second `LocaleFlagSwitcher`) was removed: since O14
 * `[locale]/layout.tsx` renders the real site chrome for vi/id/th/fil too, so
 * the shell duplicated the header — two language switchers and two `#main`
 * landmarks on one page. Page bodies now come from `GuidancePageBody`.
 */

type OriginalLanguageColumnsSectionProps = {
  locale: GuidanceLocale;
  remainingPosts?: ReadonlyArray<{ slug: string; title: string }>;
};

export function OriginalLanguageColumnsSection({
  locale,
  remainingPosts = [],
}: OriginalLanguageColumnsSectionProps) {
  const pack = guidanceContent[locale];
  return (
    <section className={styles.section} aria-label={pack.readSourceLabel} data-columns-original-language="true">
      <h2 className={styles.sectionHeading}>{pack.readSourceLabel}</h2>
      {remainingPosts.length > 0 ? (
        <ul className={styles.items}>
          {remainingPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/ko/columns/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className={styles.sourceList}>
        {EXISTING_SITE_LOCALES_4.map((sourceLocale) => {
          const languageName = PUBLIC_LANGUAGE_AUTONYMS[sourceLocale];
          return (
            <li key={sourceLocale} className={styles.sourceItem}>
              <Link className={styles.sourceLink} href={`/${sourceLocale}/columns`}>
                {languageName}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
