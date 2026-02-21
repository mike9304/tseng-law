import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import SmartLink from '@/components/SmartLink';

export default function UpdatesMultiList({ locale }: { locale: Locale }) {
  const { updates } = siteContent[locale];

  return (
    <section className="section">
      <div className="container">
        <SectionLabel>{updates.label}</SectionLabel>
        <h2 className="section-title">{updates.title}</h2>
        <OrnamentDivider />
        <div className="stack-lists three-column" aria-label={updates.title}>
          {updates.tabs.map((tab) => (
            <div key={tab.id} className="list-panel">
              <h3 className="panel-title">{tab.label}</h3>
              <ul className="panel-list compact">
                {tab.items.map((item) => (
                  <li key={`${tab.id}-${item.title}`} className="panel-row">
                    {item.meta ? <div className="panel-meta">{item.meta}</div> : null}
                    <SmartLink className="link-underline" href={item.href}>
                      {item.title}
                    </SmartLink>
                    {item.tag ? <div className="tag">{item.tag}</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
