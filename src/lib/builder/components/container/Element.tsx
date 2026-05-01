import type { ReactNode } from 'react';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  legacyCardStyleToVariant,
  resolveCardVariantStyle,
} from '@/lib/builder/site/component-variants';
import {
  flexToCSS,
  gridToCSS,
  DEFAULT_FLEX,
  DEFAULT_GRID,
} from '@/lib/builder/canvas/layout-modes';

export default function ContainerElement({
  node,
  theme,
  mode = 'edit',
  children,
}: {
  node: BuilderContainerCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
  children?: ReactNode;
}) {
  const content = node.content;
  const layoutMode = content.layoutMode ?? 'absolute';
  const { className, as, htmlId, dataTone } = content;
  const Tag = (as ?? 'div') as keyof JSX.IntrinsicElements;
  const variantStyle = resolveCardVariantStyle(
    content.variant ?? legacyCardStyleToVariant(content.cardStyle),
    theme,
  );

  let layoutCSS: Record<string, string> = {};
  if (layoutMode === 'flex') {
    layoutCSS = flexToCSS(content.flexConfig ?? DEFAULT_FLEX);
  } else if (layoutMode === 'grid') {
    layoutCSS = gridToCSS(content.gridConfig ?? DEFAULT_GRID);
  }

  if (className) {
    const props: Record<string, unknown> = {
      className,
      ...(htmlId ? { id: htmlId } : {}),
      ...(dataTone ? { 'data-tone': dataTone } : {}),
      style: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
        ...(layoutMode !== 'absolute' ? layoutCSS : {}),
      },
    };
    return <Tag {...(props as Record<string, never>)}>{children}</Tag>;
  }

  const childArray = Array.isArray(children) ? children : children ? [children] : [];
  const isEmpty = childArray.length === 0;

  return (
    <Tag
      {...(htmlId ? { id: htmlId } : {})}
      {...(dataTone ? { 'data-tone': dataTone } : {})}
      style={{
        width: '100%',
        height: '100%',
        padding: `${content.padding}px`,
        borderRadius: `${variantStyle.borderRadius}px`,
        border: variantStyle.border,
        background: variantStyle.background,
        boxShadow: variantStyle.boxShadow,
        backdropFilter: variantStyle.backdropFilter,
        WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
        boxSizing: 'border-box',
        position: 'relative',
        ...layoutCSS,
      }}
    >
      {children}
      {isEmpty && mode === 'edit' ? (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            color: '#94a3b8',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          }}
        >
          {content.label}
        </div>
      ) : null}
    </Tag>
  );
}
