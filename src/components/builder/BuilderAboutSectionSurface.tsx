import type { BuilderSectionNode } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import FirmIntroductionSection from '@/components/FirmIntroductionSection';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import ContactBlocks from '@/components/ContactBlocks';
import BuilderSectionFrame from '@/components/builder/BuilderSectionFrame';

export default function BuilderAboutSectionSurface({
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
  const rendered = renderAboutSectionSurface({
    locale,
    section,
    header,
  });

  if (!rendered) return null;

  return <BuilderSectionFrame section={section}>{rendered}</BuilderSectionFrame>;
}

function renderAboutSectionSurface({
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
    case 'about.header':
      return (
        <PageHeader
          key={section.id}
          locale={locale}
          label={header.label}
          title={header.title}
          description={header.description}
        />
      );
    case 'about.introduction':
      return <FirmIntroductionSection key={section.id} locale={locale} />;
    case 'about.attorney':
      return <AttorneyProfileSection key={section.id} locale={locale} />;
    case 'about.contact':
      return <ContactBlocks key={section.id} locale={locale} showMainHeader />;
    default:
      return null;
  }
}
