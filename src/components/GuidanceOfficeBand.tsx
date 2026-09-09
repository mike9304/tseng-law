import Image from 'next/image';

import { taipeiPhotos, taiwanOfficeData } from '@/data/office-locations';
import type { GuidanceLocale } from '@/data/international-guidance-content';
import {
  guidanceOfficeCopy,
  type GuidanceOfficeId,
} from '@/data/international-guidance-offices';

/**
 * Office band for the guidance-locale `contact` page (vi/id/th/fil).
 *
 * The English contact page renders `OfficeMapTabs`, which shows three Taipei
 * office photographs and the four Taiwan office addresses. `OfficeMapTabs`
 * itself is keyed to the four site locales throughout (tab labels, Korea
 * office, Google rating summary, Naver map), so rather than widening that
 * component this band reuses the canonical data both components now share
 * (`src/data/office-locations.ts`) — `taipeiPhotos` for the
 * photographs and `taiwanOfficeData.en` for the addresses, phone and fax
 * numbers and map links — and supplies only the city names, field labels and
 * alt text in the page language.
 *
 * Phone and fax numbers are rendered as `tel:` links and the Taipei office
 * carries the same map `<iframe>` the English page shows for its opening tab,
 * so the guidance contact page reaches the same interactive-element counts.
 * Only Taipei is embedded, matching the one iframe the English page renders at
 * a time; the other three offices link out through the canonical `mapsUrl`.
 */
export default function GuidanceOfficeBand({ locale }: { locale: GuidanceLocale }) {
  const copy = guidanceOfficeCopy[locale];
  const offices = taiwanOfficeData.en;

  return (
    <section
      className="section section--light"
      id="offices"
      data-guidance-offices="true"
      data-locale={locale}
    >
      <div className="container">
        <div className="section-label">{copy.label}</div>
        <h2 className="section-title">{copy.title}</h2>
        <p className="section-lede">{copy.description}</p>

        <div className="grid-bento contact-grid reveal-stagger">
          {taipeiPhotos.map((photo, index) => (
            <div key={photo.src} className="card legal-card" data-guidance-office-photo={photo.src}>
              <div className="attorney-card-photo attorney-card-photo--sub">
                <Image
                  src={photo.src}
                  alt={copy.photoAlts[index] ?? copy.photoAlts[0]}
                  fill
                  className="person-photo"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid-bento contact-grid reveal-stagger">
          {offices.map((office) => (
            <div
              key={office.id}
              className="card legal-card"
              data-guidance-office={office.id}
            >
              <h3 className="card-title">{copy.officeTitles[office.id as GuidanceOfficeId]}</h3>
              <ul className="contact-list legal-card-list">
                <li>{office.address}</li>
                {office.phone ? (
                  <li>
                    {copy.phoneLabel}: <a href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}>{office.phone}</a>
                  </li>
                ) : null}
                {office.fax ? (
                  <li>
                    {copy.faxLabel}: {office.fax}
                  </li>
                ) : null}
                <li>
                  <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {copy.mapLinkLabel}
                  </a>
                </li>
              </ul>
              {office.embedUrl && office.id === 'taipei' ? (
                <div className="office-map-embed">
                  <iframe
                    src={office.embedUrl}
                    title={`${copy.officeTitles[office.id as GuidanceOfficeId]} — ${copy.mapLinkLabel}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
