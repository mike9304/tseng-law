import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import SmartLink from '@/components/SmartLink';

export default function VideoChannel({ locale }: { locale: Locale }) {
  const { videos } = siteContent[locale];
  return (
    <section className="section alt" id="videos" data-tone="light">
      <div className="container">
        <SectionLabel>{videos.label}</SectionLabel>
        <h2 className="section-title">{videos.title}</h2>
        <p className="section-lede">{videos.description}</p>
        <OrnamentDivider />
        <div className="video-grid reveal-stagger">
          <article className="card">
            <span className="card-mark" aria-hidden />
            <Image
              src={videos.featured.image}
              alt={videos.featured.title}
              width={720}
              height={420}
              className="video-feature-image"
            />
            <div className="video-feature-meta">
              <span>{videos.featured.duration}</span>
            </div>
            <h3 className="video-feature-title">{videos.featured.title}</h3>
            <SmartLink className="link-underline" href={videos.featured.href}>
              {videos.cta.label}
            </SmartLink>
          </article>
          <div className="video-list">
            {videos.items.map((item) => (
              <SmartLink key={item.title} className="video-item" href={item.href}>
                <Image src={item.image} alt={item.title} width={120} height={80} className="video-thumb" />
                <div>
                  <div className="video-item-title">{item.title}</div>
                  {item.duration ? <div className="video-item-meta">{item.duration}</div> : null}
                </div>
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
