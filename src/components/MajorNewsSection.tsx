import type { Locale } from '@/lib/locales';
import { getFeaturedInsights, insightsArchive } from '@/data/insights-archive';
import EditorialSection from '@/components/EditorialSection';
import SmartLink from '@/components/SmartLink';

export default function MajorNewsSection({ locale }: { locale: Locale }) {
  const archive = insightsArchive[locale];
  const featured = getFeaturedInsights(locale);
  const [lead, ...rest] = featured;

  if (!lead) return null;

  return (
    <EditorialSection
      id="practice"
      label={archive.label}
      title={locale === 'ko' ? '주요 칼럼' : locale === 'zh-hant' ? '重點專欄' : 'Featured Columns'}
    >
      <div className="major-news reveal-stagger">
        <article className="card major-lead">
          <span className="card-mark" aria-hidden />
          {lead.date ? <div className="major-meta">{lead.date}</div> : null}
          <h3 className="major-title">
            <SmartLink className="link-underline" href={lead.href}>
              {lead.title}
            </SmartLink>
          </h3>
          <p className="major-summary">{lead.summary}</p>
        </article>
        <div className="major-list">
          {rest.map((item) => (
            <div key={item.title} className="major-item">
              <div className="major-item-head">
                {item.date ? <span className="major-meta">{item.date}</span> : null}
                <span className="tag">{archive.categories[item.category]}</span>
              </div>
              <SmartLink className="link-underline" href={item.href}>
                {item.title}
              </SmartLink>
              <p className="major-summary">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </EditorialSection>
  );
}
