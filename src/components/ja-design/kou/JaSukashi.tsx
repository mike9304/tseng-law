import type { CSSProperties } from 'react';
import Link from 'next/link';
import { JA_KOU_NEW, JA_KOU_REUSED } from './ja-copy';
import { KOU } from './ja-kou-media';
import { SUKASHI_PAIRS, sukashiHref, sukashiLinkLabel } from './sukashi-pairs';
import JaChevron from './JaChevron';
import JaStageMarkers from './JaStageMarkers';
import { JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import s from './JaSukashi.module.css';

const STAGE_PAIRS = SUKASHI_PAIRS.filter((pair) => pair.eyebrow);
const termStyle = (term: string) => ({ '--len': [...term].length } as CSSProperties);

function Light({ desktop, desktop960, mobile, className }: { desktop: string; desktop960: string; mobile: string; className: string }) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile} type="image/webp" />
      <source srcSet={`${desktop960} 960w, ${desktop} 1920w`} sizes="100vw" type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp stills, served as is */}
      <img className={`${s.light} ${className}`} src={desktop} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
    </picture>
  );
}

/**
 * C1 「透かし」: light rises behind washi and four Taiwanese terms surface one at a time (CONCEPT-V2 §5 C1, §8.2;
 * amendment: the paper itself drifts and settles as the light comes up). The pinned stage is visual only: its term
 * layer is aria-hidden and holds nothing focusable. The six pairs, with their links, are the <dl> after it.
 */
export default function JaSukashi() {
  const title = JA_KOU_NEW.sukashiTitle;
  const [line1, rest] = [title.slice(0, title.indexOf('、') + 1), title.slice(title.indexOf('、') + 1)];
  return (
    <section id="ja-sukashi" className={s.section} aria-labelledby="ja-sukashi-title" data-ja-stage="sukashi">
      <div className={s.runway}>
        <div className={s.sticky} data-stage-sticky="">
          <div className={s.lights} aria-hidden="true">
            <Light desktop={KOU.sukashi.a} desktop960={KOU.sukashi.a960} mobile={KOU.sukashi.aMobile} className={s.lightA} />
            <Light desktop={KOU.sukashi.b} desktop960={KOU.sukashi.b960} mobile={KOU.sukashi.bMobile} className={s.lightB} />
            <Light desktop={KOU.sukashi.c} desktop960={KOU.sukashi.c960} mobile={KOU.sukashi.cMobile} className={s.lightC} />
          </div>
          <div className={`${k.wrap} ${s.inner}`}>
            <div className={s.measure}>
              <h2 id="ja-sukashi-title" className={`${s.title} ${k.ph}`}>
                <JaPhrases text={line1} />
                <br />
                <JaPhrases text={rest} />
              </h2>
              <div className={s.terms} aria-hidden="true">
                {STAGE_PAIRS.map((pair, index) => (
                  <div key={pair.term} className={`${s.term} ${s[`t${index + 1}`]}`}>
                    <p className={s.eyebrow}>{pair.eyebrow}</p>
                    <p className={s.word} lang={pair.lang} style={termStyle(pair.term)}>
                      {pair.term}
                    </p>
                    <span className={s.rule} />
                    <p className={`${s.rendering} ${k.ph}`}>
                      <JaPhrases text={pair.rendering} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <JaStageMarkers bounds={[0.2, 0.4, 0.6, 0.8]} />
      </div>
      <div className={`${k.wrap} ${s.summary}`}>
        <dl className={s.grid}>
          {SUKASHI_PAIRS.map((pair, index) => (
            <div key={pair.term} className={`${s.pair} ${index % 3 === 2 ? k.fromRight : k.fromLeft}`}>
              <dt className={s.pairTerm} lang={pair.lang} style={termStyle(pair.term)}>
                {pair.term}
              </dt>
              <dd className={`${s.pairRendering} ${k.ph}`}>
                <JaPhrases text={pair.rendering} />
              </dd>
              <dd className={s.pairLink}>
                <Link className={`${k.textLink} ${s.link}`} href={sukashiHref(pair)}>
                  <span>{sukashiLinkLabel(pair)}</span>
                  <JaChevron />
                </Link>
              </dd>
            </div>
          ))}
        </dl>
        <p className={s.more}>
          <Link className={k.textLink} href="/ja/columns">
            {JA_KOU_REUSED.readLink.text}
            <JaChevron />
          </Link>
        </p>
      </div>
    </section>
  );
}
