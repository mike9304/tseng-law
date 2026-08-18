import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '@/components/DecorativeAutoplayVideo';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import SmartLink from '@/components/SmartLink';
import Reveal from '@/components/Reveal';

export default function VideoChannel({ locale }: { locale: SiteLocale }) {
  const { videos } = siteContent[locale];
  // Self-reveal: the `.reveal-stagger` grid needs a `.reveal.is-visible`
  // ancestor and callers don't provide one.
  return (
    <Reveal>
    <section className="section alt" id="videos" data-tone="light">
      <div className="container">
        <SectionLabel>{videos.label}</SectionLabel>
        <h2 className="section-title">{videos.title}</h2>
        <p className="section-lede">{videos.description}</p>
        <OrnamentDivider />
        <div className="video-grid reveal-stagger">
          <article className="card">
            <span className="card-mark" aria-hidden />
            <div className="video-feature-media">
              {videos.featured.video ? (
                <DecorativeAutoplayVideo
                  className="video-feature-player"
                  imageClassName="video-feature-image"
                  videoClassName="video-feature-video"
                  poster={videos.featured.image}
                  webmSrc={videos.featured.video.webm}
                  mp4Src={videos.featured.video.mp4}
                  alt={videos.featured.video.alt}
                  width={720}
                  height={420}
                  sizes="(max-width: 800px) 100vw, 50vw"
                  controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
                />
              ) : (
                <Image
                  src={videos.featured.image}
                  alt={videos.featured.title}
                  width={720}
                  height={420}
                  className="video-feature-image"
                />
              )}
            </div>
            <div className="video-feature-meta">
              <span>{videos.featured.duration}</span>
            </div>
            <h3 className="video-feature-title">{videos.featured.title}</h3>
            <SmartLink className="link-underline" href={videos.featured.href}>
              {videos.cta.label}
            </SmartLink>
          </article>
          <div className="video-list">
            {videos.items.map((item) => item.video ? (
              <article key={item.title} className="video-item video-item--cinematic">
                <div className="video-item-media">
                  <DecorativeAutoplayVideo
                    className="video-item-player"
                    imageClassName="video-thumb"
                    videoClassName="video-item-video"
                    poster={item.image}
                    webmSrc={item.video.webm}
                    mp4Src={item.video.mp4}
                    alt={item.video.alt}
                    width={120}
                    height={80}
                    sizes="120px"
                    controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
                  />
                </div>
                <div>
                  <SmartLink className="video-item-content-link" href={item.href}>
                    <span className="video-item-title">{item.title}</span>
                    {item.duration ? <span className="video-item-meta">{item.duration}</span> : null}
                  </SmartLink>
                </div>
              </article>
            ) : (
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
    </Reveal>
  );
}
