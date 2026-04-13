import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
import {
  flexToCSS,
  gridToCSS,
  DEFAULT_FLEX,
  DEFAULT_GRID,
} from '@/lib/builder/canvas/layout-modes';

export default function ContainerElement({
  node,
}: {
  node: BuilderContainerCanvasNode;
}) {
  const content = node.content;
  const layoutMode = content.layoutMode ?? 'absolute';

  let layoutCSS: Record<string, string> = {};
  if (layoutMode === 'flex') {
    layoutCSS = flexToCSS(content.flexConfig ?? DEFAULT_FLEX);
  } else if (layoutMode === 'grid') {
    layoutCSS = gridToCSS(content.gridConfig ?? DEFAULT_GRID);
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: `${content.padding}px`,
        borderRadius: `${content.borderRadius}px`,
        border: `${content.borderWidth}px ${content.borderStyle} ${content.borderColor}`,
        background: content.background,
        boxSizing: 'border-box',
        // Default styles for absolute mode
        ...(layoutMode === 'absolute'
          ? {
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }
          : {}),
        // Flex or Grid layout overrides
        ...layoutCSS,
        color: '#475569',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {content.label}
    </div>
  );
}
