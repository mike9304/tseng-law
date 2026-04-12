import type { Locale } from '@/lib/locales';
import type { BuilderPageDocument, BuilderStaticDocumentState, BuilderSectionNode } from '@/lib/builder/types';
import BuilderSurfaceOverrideScope from '@/components/builder/BuilderSurfaceOverrideScope';
import BuilderSectionLayoutFrame from '@/components/builder/BuilderSectionLayoutFrame';
import BuilderContactSectionSurface from '@/components/builder/BuilderContactSectionSurface';
import Reveal from '@/components/Reveal';

export default function BuilderPublishedContactRenderer({
  locale,
  document,
  header,
  state,
  revealSections = false,
}: {
  locale: Locale;
  document: BuilderPageDocument;
  header: {
    label: string;
    title: string;
    description?: string;
  };
  state?: BuilderStaticDocumentState | null;
  revealSections?: boolean;
}) {
  const overrides = state?.overrides ?? {};

  return (
    <>
      {document.root.children.map((section) =>
        renderPublishedSection({
          locale,
          section,
          header,
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
  header,
  overrides,
  revealSections,
}: {
  locale: Locale;
  section: BuilderSectionNode;
  header: {
    label: string;
    title: string;
    description?: string;
  };
  overrides: BuilderStaticDocumentState['overrides'];
  revealSections: boolean;
}) {
  const content = (
    <BuilderSurfaceOverrideScope key={section.id} sectionId={section.id} overrides={overrides}>
      <BuilderSectionLayoutFrame section={section} runtime>
        <BuilderContactSectionSurface locale={locale} section={section} header={header} />
      </BuilderSectionLayoutFrame>
    </BuilderSurfaceOverrideScope>
  );

  if (!revealSections || section.sectionKey === 'contact.hero') {
    return content;
  }

  return <Reveal key={section.id}>{content}</Reveal>;
}
