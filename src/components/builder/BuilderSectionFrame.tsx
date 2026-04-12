import type { ReactNode } from 'react';
import { resolveBuilderSectionHiddenStates, resolveBuilderSectionLayouts } from '@/lib/builder/content';
import type { BuilderSectionNode } from '@/lib/builder/types';

export default function BuilderSectionFrame({
  section,
  children,
}: {
  section: BuilderSectionNode;
  children: ReactNode;
}) {
  const layouts = resolveBuilderSectionLayouts(section);
  const visibility = resolveBuilderSectionHiddenStates(section);

  return (
    <div
      className={[
        'builder-section-frame',
        `builder-section-frame--width-${layouts.desktop.width}`,
        `builder-section-frame--align-${layouts.desktop.alignment}`,
        `builder-section-frame--top-${layouts.desktop.spacingTop}`,
        `builder-section-frame--bottom-${layouts.desktop.spacingBottom}`,
      ].join(' ')}
      data-layout-width-tablet={layouts.tablet.width}
      data-layout-width-mobile={layouts.mobile.width}
      data-layout-alignment-tablet={layouts.tablet.alignment}
      data-layout-alignment-mobile={layouts.mobile.alignment}
      data-spacing-top-tablet={layouts.tablet.spacingTop}
      data-spacing-top-mobile={layouts.mobile.spacingTop}
      data-spacing-bottom-tablet={layouts.tablet.spacingBottom}
      data-spacing-bottom-mobile={layouts.mobile.spacingBottom}
      data-hidden={visibility.desktop}
      data-hidden-tablet={visibility.tablet}
      data-hidden-mobile={visibility.mobile}
    >
      {children}
    </div>
  );
}
