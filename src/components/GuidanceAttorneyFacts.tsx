import type { GuidanceLocale } from '@/data/international-guidance-content';
import {
  GUIDANCE_FACT_SEPARATOR,
  buildGuidanceAttorneyFacts,
} from '@/lib/guidance-attorney-facts';

/**
 * Key-facts block for the guidance locales — the localized equivalent of the
 * `AttorneyFactSummary` section `/en/lawyers` renders under the roster
 * (WO-O33). Same section class, same three labelled rows, same order; every
 * value comes from `buildGuidanceAttorneyFacts`, which reads canonical data
 * only.
 */
export default function GuidanceAttorneyFacts({ locale }: { locale: GuidanceLocale }) {
  const facts = buildGuidanceAttorneyFacts(locale);
  if (!facts) return null;

  return (
    <section
      className="section section--light attorney-facts-section"
      id="attorney-facts"
      data-page-block="attorney-facts"
      data-guidance-attorney-facts="true"
      data-locale={locale}
    >
      <div className="container">
        <h2 className="section-title">{facts.heading}</h2>
        <div className="attorney-card-section">
          <div className="attorney-card-label">{facts.qualificationLabel}</div>
          <p>{facts.qualification}</p>
        </div>
        {/* One list item per practice area. `/en` joins the array into a
            single sentence-less paragraph; a list is what the value actually
            is, and it keeps each area an independent text block so the
            language gate can read them as the terms they are rather than as
            one long run-on line. */}
        <div className="attorney-card-section">
          <div className="attorney-card-label">{facts.practiceLabel}</div>
          <ul className="contact-list" data-guidance-practice-areas="true">
            {facts.practiceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
        <div className="attorney-card-section">
          <div className="attorney-card-label">{facts.languagesLabel}</div>
          <p>{facts.languages.join(GUIDANCE_FACT_SEPARATOR)}</p>
        </div>
      </div>
    </section>
  );
}
