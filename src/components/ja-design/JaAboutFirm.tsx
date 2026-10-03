import { firmIntroductionContent } from '@/data/firm-introduction';
import v2 from './JaPagesV2.module.css';
import styles from './JaAbout.module.css';

/** 「昊」は「…」を、「鼎」は「…」を意味します — read from the firm paragraph, never retyped. */
const NAME_MEANING = /「(.)」は「([^」]+)」を、「(.)」は「([^」]+)」/;
const YEAR = /(\d{4})年/;

/**
 * ja about, 昊 V2 (2026-10-02; CONCEPT-V2 §9): the firm section that replaces FirmIntroductionSection on ja.
 * The name as two giant kanji tiles, 昊 lit by the noon wall and 鼎 on the plain tile, each captioned with the
 * meaning quoted from the founding paragraph (the full sentence stays below). Then the history: every paragraph
 * in order, and where a paragraph names a year, that year stands beside it at display size (never a year
 * without its sentence). Same data as FirmIntroductionSection (firmIntroductionContent.ja), same source link.
 */
export default function JaAboutFirm({ locale }: { locale: 'ja' }) {
  const firm = firmIntroductionContent[locale];
  const meaning = firm.paragraphs.map((paragraph) => paragraph.match(NAME_MEANING)).find(Boolean) ?? null;
  const entries = firm.paragraphs.map((text) => ({ text, year: text.match(YEAR)?.[1] ?? null }));

  return (
    <section className={styles.firm} aria-labelledby="ja-firm-title" data-tone="light">
      <div className="container">
        <h2 id="ja-firm-title" className={styles.firmTitle} data-builder-surface-key="headline">{firm.title}</h2>
        <p className={styles.firmLede} data-builder-surface-key="subtitle">{firm.subtitle}</p>
        {meaning ? (
          <div className={styles.names}>
            <figure className={`${styles.name} ${styles.nameSky} ${v2.fusL}`}>
              <span className={styles.nameLight} aria-hidden="true" />
              <span className={styles.glyph}>{meaning[1]}</span>
              <figcaption className={styles.caption}>{meaning[2]}</figcaption>
            </figure>
            <figure className={`${styles.name} ${v2.fusR}`}>
              <span className={styles.glyph}>{meaning[3]}</span>
              <figcaption className={styles.caption}>{meaning[4]}</figcaption>
            </figure>
          </div>
        ) : null}
        <div className={styles.history}>
          {entries.map((entry) => (
            <div key={entry.text} className={styles.entry}>
              {entry.year ? (
                <div className={styles.yearCol} aria-hidden="true">
                  <p className={styles.year}>{entry.year}</p>
                  <span className={styles.rule} />
                </div>
              ) : null}
              <p className={`${styles.text} ${v2.fusR}`}>{entry.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.source}>
          <a href={firm.sourceUrl} target="_blank" rel="noopener noreferrer" className={v2.chev} data-builder-surface-key="source-link">
            {firm.sourceLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
