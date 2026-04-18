import type { ReactNode } from 'react';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
import {
  flexToCSS,
  gridToCSS,
  DEFAULT_FLEX,
  DEFAULT_GRID,
} from '@/lib/builder/canvas/layout-modes';

export default function ContainerElement({
  node,
  mode = 'edit',
  children,
}: {
  node: BuilderContainerCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  children?: ReactNode;
}) {
  const content = node.content;
  const layoutMode = content.layoutMode ?? 'absolute';
  const { className, as, htmlId, dataTone } = content;
  const Tag = (as ?? 'div') as keyof JSX.IntrinsicElements;

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
        borderRadius: `${content.borderRadius}px`,
        border: `${content.borderWidth}px ${content.borderStyle} ${content.borderColor}`,
        background: content.background,
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
