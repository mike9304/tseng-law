import type { SiteLocale } from '@/lib/locales';
import type { LegalPageContent } from '@/data/legal-pages';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function LegalPageSections({
  locale,
  content,
}: {
  locale: SiteLocale;
  content: LegalPageContent;
}) {
  return (
    <>
      <PageHeader locale={locale} label={content.label} title={content.title} description={content.description}>
        <p className="legal-effective-date">
          {content.effectiveDateLabel}: {content.effectiveDate}
        </p>
      </PageHeader>
      {/* Self-reveal: the `.reveal-stagger` card grid needs a
          `.reveal.is-visible` ancestor and callers don't provide one. */}
      <Reveal>
      <section className="section section--light legal-page-section">
        <div className="container">
          <div className="grid-bento contact-grid reveal-stagger">
            {content.sections.map((section) => (
              <article key={section.title} className="card legal-card">
                <h2 className="card-title">{section.title}</h2>
                <div className="legal-card-copy">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.items && section.items.length > 0 ? (
                  <ul className="contact-list legal-card-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      </Reveal>
    </>
  );
}
