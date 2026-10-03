import type { JaFact } from './ja-facts';
import { JaKeepUnits } from './JaPhrases';
import l from './JaLight.module.css';

/**
 * A numeral standing on the sunlit wall (CONCEPT-V2 §7.3). Static text: no count-up, ever. Its cast shadow is a
 * decorative copy behind it that swings with the light (`--sun`, written by JaSequence). `data-source` names the file
 * the value is quoted from (ja-facts.test.tsx).
 */
export default function JaNumeral({ fact, className }: { fact: JaFact; className?: string }) {
  const sizeClass = fact.size === 'xl' ? l.numXl : fact.size === 'l' ? l.numL : l.numWord;
  const glyphs = (
    <>
      {fact.value}
      {fact.unit ? <span className={l.unit}>{fact.unit}</span> : null}
    </>
  );
  return (
    <div className={`${l.numeral} ${className ?? ''}`} data-source={`${fact.source.file} › ${fact.source.snippet}`}>
      <p className={`${l.num} ${sizeClass}`}>
        <span className={l.shadow} data-sun-shadow="" aria-hidden="true">
          {glyphs}
        </span>
        <data className={l.value} value={fact.value}>
          {glyphs}
        </data>
      </p>
      <span className={`${l.rule} ${l.ruleDraw}`} aria-hidden="true" />
      {fact.label ? <p className={l.label}>{fact.label}</p> : null}
      {fact.caption ? (
        <p className={l.caption}>
          <JaKeepUnits text={fact.caption} />
        </p>
      ) : null}
    </div>
  );
}
