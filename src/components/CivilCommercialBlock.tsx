import { CIVIL_COMMERCIAL_COPY } from '@/data/multilingual-international-v2';
import type { SiteLocale } from '@/lib/locales';

export default function CivilCommercialBlock({ locale }: { locale: SiteLocale }) {
  const copy = CIVIL_COMMERCIAL_COPY[locale];
  return (
    <div className="svc-keypoints" data-ml-civil-commercial="true">
      <h2 className="svc-keypoints-title">{copy.heading}</h2>
      <p className="svc-intro">{copy.body}</p>
      {/* WO-X2 (EN-02): the debt-recovery page still shows its attorney-review
          draft note in every locale, so no visible link points to it until
          it is reviewed and published. */}
      <h2 className="svc-keypoints-title">{copy.injuryHeading}</h2>
      <p className="svc-intro">{copy.injuryBody}</p>
    </div>
  );
}
