import type { ReactNode } from 'react';
import { resolveBuilderSectionHiddenStates, resolveBuilderSectionLayouts } from '@/lib/builder/content';
import type { BuilderSectionNode } from '@/lib/builder/types';

export default function BuilderSectionLayoutFrame({
  section,
  children,
  runtime = false,
}: {
  section: BuilderSectionNode;
  children: ReactNode;
  runtime?: boolean;
}) {
  const layouts = resolveBuilderSectionLayouts(section);
  const visibility = resolveBuilderSectionHiddenStates(section);

  return (
    <div
      className={`builder-section-layout-frame${runtime ? ' builder-section-layout-frame--runtime' : ''}`}
      data-layout-width={layouts.desktop.width}
      data-layout-width-tablet={layouts.tablet.width}
      data-layout-width-mobile={layouts.mobile.width}
      data-layout-alignment={layouts.desktop.alignment}
      data-layout-alignment-tablet={layouts.tablet.alignment}
      data-layout-alignment-mobile={layouts.mobile.alignment}
      data-spacing-top={layouts.desktop.spacingTop}
      data-spacing-top-tablet={layouts.tablet.spacingTop}
      data-spacing-top-mobile={layouts.mobile.spacingTop}
      data-spacing-bottom={layouts.desktop.spacingBottom}
      data-spacing-bottom-tablet={layouts.tablet.spacingBottom}
      data-spacing-bottom-mobile={layouts.mobile.spacingBottom}
      data-padding-inline={layouts.desktop.paddingInline}
      data-padding-inline-tablet={layouts.tablet.paddingInline}
      data-padding-inline-mobile={layouts.mobile.paddingInline}
      data-padding-block={layouts.desktop.paddingBlock}
      data-padding-block-tablet={layouts.tablet.paddingBlock}
      data-padding-block-mobile={layouts.mobile.paddingBlock}
      data-hidden={visibility.desktop}
      data-hidden-tablet={visibility.tablet}
      data-hidden-mobile={visibility.mobile}
    >
      <div className="builder-section-layout-frame__inner">{children}</div>
    </div>
  );
}
