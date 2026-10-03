import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { getOverseasEntryContent } from '@/components/EnAcquisitionGuideLinks';
import { getJaPersonalPaths, JA_PERSONAL_PATHS_HEADING } from '@/components/ja-design/JaPersonalPaths';
import { JA_KOU_REUSED, JA_KOU_SEARCH_TOPICS } from './ja-copy';
import JaChevron from './JaChevron';
import JaSearch from './JaSearch';
import { JaKeepUnits, JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import n from './JaNeeds.module.css';

const TILE_CLASS = ['t1', 't2', 't3', 't4', 't5', 't6'] as const;
/** Fusuma: tiles that start in columns 1–6 slide from the left, 7–12 from the right (CONCEPT-V2 §8.4). */
const FROM_RIGHT = new Set([1, 2, 5]);

/**
 * C2 「光の升目」: 日系企業・在台日本人の方へ (CONCEPT-V2 §5 C2). Washi tiles over the moving light field; each whole tile
 * is the link. Content, hrefs and order are the existing entry block (`OVERSEAS_ENTRY_CONTENT.ja`) and the six personal
 * paths; the H2 keeps its id `overseas-entry-full-heading`.
 */
export default function JaNeeds() {
  const content = getOverseasEntryContent('ja');
  if (!content) return null;
  const hero = siteContent.ja.hero;
  const [ledeA, ledeB] = (() => {
    const at = content.lede.indexOf('。');
    return at > 0 && at < content.lede.length - 1 ? [content.lede.slice(0, at + 1), content.lede.slice(at + 1)] : [content.lede, ''];
  })();
  const topics = JA_KOU_SEARCH_TOPICS.map((q) => ({ label: q, href: `/ja/search?q=${encodeURIComponent(q)}` }));
  const personal = getJaPersonalPaths();

  return (
    <section id="ja-needs" className={`${k.wrap} ${n.section}`} aria-labelledby="overseas-entry-full-heading">
      <div className={n.head}>
        <h2 id="overseas-entry-full-heading" className={`${k.h2} ${k.ph} ${n.title}`}>
          <JaPhrases text={content.heading} />
        </h2>
        <p className={`${k.lede} ${n.lede}`}>
          {ledeA}
          {ledeB ? <span className={k.key}>{ledeB}</span> : null}
        </p>
      </div>
      <JaSearch label={hero.searchPlaceholder} placeholder={JA_KOU_REUSED.searchExample.text} buttonLabel={hero.searchButton} topics={topics} />
      <ul className={n.grid}>
        {content.items.map((item, index) => (
          <li key={item.href} className={`${n.cell} ${n[TILE_CLASS[index]]} ${FROM_RIGHT.has(index) ? k.fromRight : k.fromLeft}`}>
            <Link href={item.href} className={`${k.tile} ${n.tile} ${index === 0 ? n.lead : ''}`}>
              <h3 className={`${n.tileTitle} ${k.ph}`}>
                <JaPhrases text={item.label} />
                <JaChevron className={n.chev} />
              </h3>
              <p className={n.tileDesc}>
                <JaKeepUnits text={item.description} />
              </p>
            </Link>
          </li>
        ))}
        <li className={`${n.cell} ${n.t7} ${k.fromLeft}`}>
          <div className={`${k.tile} ${n.tile} ${n.personal}`}>
            <h3 id="ja-personal-paths-heading" className={n.personalTitle}>
              {JA_PERSONAL_PATHS_HEADING}
            </h3>
            <ul className={n.personalList} aria-labelledby="ja-personal-paths-heading">
              {personal.map((path) => (
                <li key={path.href}>
                  <Link className={n.personalLink} href={path.href}>
                    <span>{path.label}</span>
                    <JaChevron />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </section>
  );
}
