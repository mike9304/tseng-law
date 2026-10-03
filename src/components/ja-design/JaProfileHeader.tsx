import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './JaPagesV2.module.css';

/** The display fragment and its label come from the profile lede (「日本語能力試験（JLPT）N1を取得し…」). */
const N1_FRAGMENT = /日本語能力試験（JLPT）(N1)/;

/**
 * 昊 V2 inner pages (2026-10-02; CONCEPT-V2 §9 and C6): the lawyer profile header as a night tile. The portrait
 * (its own dark background, so the tile colour is sampled from it) sits on the right and fades into the tile;
 * the white Mincho H1, the 「N1」 display with its label and the profile lede (the sentence it comes from) sit on
 * the left. Same title, lede, breadcrumb and builder keys as PageHeader; the H1 is the page's only H1.
 */
export default function JaProfileHeader({
  title,
  lede,
  image,
  imageAlt,
  focalPoint,
}: {
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  focalPoint: { x: number; y: number };
}) {
  const n1 = lede.match(N1_FRAGMENT);
  const split = title.indexOf('）');
  const titleParts = split > 0 ? [title.slice(0, split + 1), title.slice(split + 1)] : [title];
  return (
    <section className={styles.nightHead} aria-labelledby="ja-profile-title">
      <div className={styles.nightTile}>
        <div className={styles.nightPortrait}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 46vw"
            style={{ objectFit: 'cover', objectPosition: `${focalPoint.x * 100}% ${Math.min(focalPoint.y, 0.3) * 100}%` }}
          />
        </div>
        <div className={styles.nightCopy}>
          <Breadcrumbs locale="ja" current={title} />
          <h1 id="ja-profile-title" className={`hero-title page-header-title ${styles.nightTitle}`} data-builder-surface-key="headline">
            {titleParts.map((part, index) => (
              <span key={part} className={styles.nightTitlePart}>
                {index ? <wbr /> : null}
                {part}
              </span>
            ))}
          </h1>
          {n1 ? (
            <div className={styles.nightN1}>
              <p className={styles.nightN1Value}><data value={n1[1]}>{n1[1]}</data></p>
              <span className={styles.nightRule} aria-hidden="true" />
              <p className={styles.nightN1Label}>{n1[0]}</p>
            </div>
          ) : null}
          <p className={styles.nightLede} data-builder-surface-key="description">{lede}</p>
        </div>
      </div>
    </section>
  );
}
