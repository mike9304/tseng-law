import type { BuilderSectionNode } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import ContactBlocks from '@/components/ContactBlocks';
import ContactEmailActions from '@/components/ContactEmailActions';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import BuilderSectionFrame from '@/components/builder/BuilderSectionFrame';

export default function BuilderContactSectionSurface({
  locale,
  section,
  header,
}: {
  locale: Locale;
  section: BuilderSectionNode;
  header: {
    label: string;
    title: string;
    description?: string;
  };
}) {
  const rendered = renderContactSectionSurface({
    locale,
    section,
    header,
  });

  if (!rendered) return null;

  return <BuilderSectionFrame section={section}>{rendered}</BuilderSectionFrame>;
}

function renderContactSectionSurface({
  locale,
  section,
  header,
}: {
  locale: Locale;
  section: BuilderSectionNode;
  header: {
    label: string;
    title: string;
    description?: string;
  };
}) {
  switch (section.sectionKey) {
    case 'contact.hero':
      return (
        <>
          <PageHeader
            key={section.id}
            locale={locale}
            label={header.label}
            title={header.title}
            description={header.description}
          >
            <ContactEmailActions locale={locale} />
          </PageHeader>
          <section className="section">
            <div className="container">
              <InternationalInquiryForm locale={locale} />
            </div>
          </section>
        </>
      );
    case 'contact.consultation-guide':
      return <ConsultationGuideSection key={section.id} locale={locale} />;
    case 'contact.contact-blocks':
      return (
        <ContactBlocks
          key={section.id}
          locale={locale}
          showMainHeader={false}
          showEmailActions={false}
        />
      );
    case 'contact.offices':
      return (
        <OfficeMapTabs
          key={section.id}
          locale={locale}
          id="offices"
          sectionClassName="section section--light"
          labelSurfaceId="section-label"
          titleSurfaceId="headline"
        />
      );
    default:
      return null;
  }
}
