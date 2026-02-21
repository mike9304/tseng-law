import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

export default function FeaturedCarousel({ locale }: { locale: Locale }) {
  const { featured } = siteContent[locale];
  const readMore = locale === 'ko' ? '자세히 보기' : locale === 'zh-hant' ? '了解更多' : 'Read more';
  return (
    <section className="section dark-section">
      <div className="container">
        <SectionLabel>{featured.label}</SectionLabel>
        <h2 className="section-title">{featured.title}</h2>
        <OrnamentDivider />
        <div className="carousel" aria-label="Featured news">
          {featured.items.map((item, index) => (
            <article key={item.title} className={`card carousel-item ${index === 0 ? 'featured-lead' : ''}`}>
              <span className="card-mark" aria-hidden />
              <Image src={item.image} alt={item.title} width={520} height={320} className="feature-image" />
              {(item.meta || item.tag) && (
                <div className="feature-meta">
                  <span>{item.meta}</span>
                  <span>{item.tag}</span>
                </div>
              )}
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-summary">{item.summary}</p>
              <div className="feature-link">
                <Link className="link-underline" href={item.href}>
                  {readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
