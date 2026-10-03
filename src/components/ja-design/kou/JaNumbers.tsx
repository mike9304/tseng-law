import { siteContent } from '@/data/site-content';
import { homeStatsTextSurfaceIds } from '@/lib/builder/registry';
import { JA_KOU_FACTS, JA_KOU_REVIEWS, JA_KOU_TEXT_FACTS } from './ja-facts';
import JaChevron from './JaChevron';
import JaNumeral from './JaNumeral';
import k from './JaKou.module.css';
import l from './JaLight.module.css';

/** The lede with the existing highlight words as sumi key spans (longest first, so 台湾4拠点 wins over 4). */
function HighlightedLede({ text, words }: { text: string; words: readonly string[] }) {
  const sorted = [...words].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return (
    <>
      {text.split(pattern).map((part, index) =>
        sorted.includes(part) ? (
          <span key={index} className={k.key}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * C3 「光の壁」: 数字で見る昊鼎 (CONCEPT-V2 §5 C3). Free-standing Mincho numerals on the sunlit wall, no tiles; each casts
 * a shadow that moves with the light. 7 (主要取扱分野) stays at text size until the content owner settles 7 versus 6.
 */
export default function JaNumbers() {
  const stats = siteContent.ja.stats;
  const [offices, time, languages, licence] = JA_KOU_FACTS;
  return (
    <section id="stats" className={`${k.wrap} ${l.numbers}`} aria-labelledby="ja-stats-title">
      <div className={l.numbersHead}>
        <h2 id="ja-stats-title" className={k.h2} data-builder-surface-key={homeStatsTextSurfaceIds[1]}>
          {stats.title}
        </h2>
        <p className={`${k.lede} ${l.numbersLede}`} data-builder-surface-key={homeStatsTextSurfaceIds[2]}>
          <HighlightedLede text={stats.description} words={stats.highlightWords ?? []} />
        </p>
      </div>
      <div className={l.row}>
        <JaNumeral fact={offices} />
        <JaNumeral fact={time} />
      </div>
      <div className={l.row}>
        <JaNumeral fact={languages} />
        <div className={l.wordCell}>
          <JaNumeral fact={licence} />
          <a className={`${k.textLink} ${l.reviews}`} href={JA_KOU_REVIEWS.href} target="_blank" rel="noopener noreferrer">
            {JA_KOU_REVIEWS.label}
            <JaChevron />
          </a>
        </div>
      </div>
      <p className={l.textRow}>
        {JA_KOU_TEXT_FACTS.map((fact, index) => (
          <span key={fact.label} className={l.textFact}>
            {index ? <span aria-hidden="true" className={l.dot}>·</span> : null}
            {fact.value} {fact.label}
          </span>
        ))}
      </p>
    </section>
  );
}
