import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import SmartLink from '@/components/SmartLink';

export default function ResourceLists({ locale }: { locale: Locale }) {
  const { services, videos } = siteContent[locale];
  const sectionLabel = 'RESOURCES';
  const sectionTitle = locale === 'ko' ? '주요 안내' : locale === 'zh-hant' ? '主要資訊' : 'Key Information';
  const servicesLabel = locale === 'ko' ? '대표 업무' : locale === 'zh-hant' ? '主要服務' : 'Core Services';
  const channelsLabel = locale === 'ko' ? '외부 채널' : locale === 'zh-hant' ? '外部頻道' : 'External Channels';

  const servicesItems = services.items.slice(0, 4);
  const channelItems = [
    { title: videos.featured.title, meta: videos.featured.duration ?? 'Channel', href: videos.featured.href },
    ...videos.items.slice(0, 3).map((item) => ({
      title: item.title,
      meta: item.duration ?? 'Channel',
      href: item.href
    }))
  ];

  return (
    <section className="section">
      <div className="container">
        <SectionLabel>{sectionLabel}</SectionLabel>
        <h2 className="section-title">{sectionTitle}</h2>
        <OrnamentDivider />
        <div className="stack-lists">
          <div className="list-panel">
            <h3 className="panel-title">{servicesLabel}</h3>
            <ul className="panel-list">
              {servicesItems.map((item) => (
                <li key={item.title} className="panel-row">
                  <SmartLink className="link-underline" href={item.href}>
                    {item.title}
                  </SmartLink>
                  <p className="panel-desc">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="list-panel">
            <h3 className="panel-title">{channelsLabel}</h3>
            <ul className="panel-list">
              {channelItems.map((item) => (
                <li key={item.title} className="panel-row">
                  <SmartLink className="link-underline" href={item.href}>
                    {item.title}
                  </SmartLink>
                  <span className="panel-meta">{item.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
