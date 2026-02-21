import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';
import { firmIntroductionContent } from '@/data/firm-introduction';

export default function FirmIntroductionSection({ locale }: { locale: Locale }) {
  const content = firmIntroductionContent[locale];

  return (
    <section className="section section--light firm-intro-section" data-tone="light">
      <div className="container">
        <SectionLabel>{content.sectionLabel}</SectionLabel>
        <article className="firm-intro-card">
          <div className="firm-intro-logo-wrap">
            <Image className="firm-intro-logo" src={content.logo} alt={content.logoAlt} width={508} height={80} />
          </div>
          <h2 className="firm-intro-title">{content.title}</h2>
          <p className="firm-intro-subtitle">{content.subtitle}</p>
          <div className="firm-intro-body">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="firm-intro-source">
            <a href={content.sourceUrl} target="_blank" rel="noopener noreferrer">
              {content.sourceLabel}
            </a>
          </p>
        </article>
      </div>
    </section>
  );
}
