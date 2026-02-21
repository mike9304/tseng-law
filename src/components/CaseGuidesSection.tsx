import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import EditorialSection from '@/components/EditorialSection';
import SmartLink from '@/components/SmartLink';

export default function CaseGuidesSection({ locale }: { locale: Locale }) {
  const { caseGuides } = siteContent[locale];

  return (
    <EditorialSection label={caseGuides.label} title={caseGuides.title} description={caseGuides.description} variant="alt">
      <div className="guide-grid reveal-stagger">
        {caseGuides.items.map((item) => (
          <article key={item.title} className="card">
            <span className="card-mark" aria-hidden />
            <div className="guide-meta">{item.tag ? <span className="tag">{item.tag}</span> : null}</div>
            <h3 className="guide-title">
              <SmartLink className="link-underline" href={item.href}>
                {item.title}
              </SmartLink>
            </h3>
            <p className="guide-summary">{item.summary}</p>
          </article>
        ))}
      </div>
    </EditorialSection>
  );
}
