import type { ColumnPost } from '@/lib/columns';
import type { FAQItem } from '@/data/faq-content';
import { siteContent, type SiteContent } from '@/data/site-content';
import { resolveInsightsDatasetPosts } from '@/lib/builder/datasets';
import type { Locale } from '@/lib/locales';
import type {
  BuilderHomeDocumentState,
  BuilderPageDocument,
  BuilderSectionNode,
} from '@/lib/builder/types';
import BuilderHomeSectionSurface from '@/components/builder/BuilderHomeSectionSurface';
import BuilderSectionLayoutFrame from '@/components/builder/BuilderSectionLayoutFrame';
import BuilderSurfaceOverrideScope from '@/components/builder/BuilderSurfaceOverrideScope';
import Reveal from '@/components/Reveal';

type BuilderPublishedServicesContent = Pick<
  SiteContent['services'],
  'label' | 'title' | 'description' | 'items'
>;

type BuilderPublishedHomeRendererProps = {
  locale: Locale;
  document: BuilderPageDocument;
  posts: ColumnPost[];
  fallbackFaqItems: FAQItem[];
  state?: BuilderHomeDocumentState | null;
  revealSections?: boolean;
};

export default function BuilderPublishedHomeRenderer({
  locale,
  document,
  posts,
  fallbackFaqItems,
  state,
  revealSections = false,
}: BuilderPublishedHomeRendererProps) {
  const services = siteContent[locale].services;
  const resolvedPosts = resolveInsightsDatasetPosts(document, posts);
  const resolvedFaqItems = state?.faqItems ?? fallbackFaqItems;
  const resolvedServices = {
    label: services.label,
    title: services.title,
    description: services.description,
    items: state?.serviceItems ?? services.items,
  };
  const overrides = state?.overrides ?? {};

  return (
    <>
      {document.root.children.map((section) =>
        renderPublishedSection({
          locale,
          section,
          posts: resolvedPosts,
          faqItems: resolvedFaqItems,
          services: resolvedServices,
          overrides,
          revealSections,
        })
      )}
    </>
  );
}

function renderPublishedSection({
  locale,
  section,
  posts,
  faqItems,
  services,
  overrides,
  revealSections,
}: {
  locale: Locale;
  section: BuilderSectionNode;
  posts: ColumnPost[];
  faqItems: FAQItem[];
  services: BuilderPublishedServicesContent;
  overrides: BuilderHomeDocumentState['overrides'];
  revealSections: boolean;
}) {
  const content = (
    <BuilderSurfaceOverrideScope key={section.id} sectionId={section.id} overrides={overrides}>
      <BuilderSectionLayoutFrame section={section} runtime>
        <BuilderHomeSectionSurface
          locale={locale}
          section={section}
          posts={posts}
          faqItems={faqItems}
          services={services}
        />
      </BuilderSectionLayoutFrame>
    </BuilderSurfaceOverrideScope>
  );

  if (!revealSections || section.sectionKey === 'home.hero') {
    return content;
  }

  return <Reveal key={section.id}>{content}</Reveal>;
}
