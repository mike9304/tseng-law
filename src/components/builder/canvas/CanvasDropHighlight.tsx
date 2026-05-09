'use client';

import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

type CanvasDropHighlightProps = {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  geometryViewport: Viewport;
  hoveredContainerId: string | null;
  visibleNodes: BuilderCanvasNode[];
};

export default function CanvasDropHighlight({
  absoluteRectById,
  geometryViewport,
  hoveredContainerId,
  visibleNodes,
}: CanvasDropHighlightProps) {
  if (!hoveredContainerId) return null;
  const containerNode = visibleNodes.find((node) => node.id === hoveredContainerId);
  const rect = containerNode
    ? absoluteRectById.get(containerNode.id) ?? resolveViewportRect(containerNode, geometryViewport)
    : null;
  if (!containerNode || !rect) return null;

  return (
    <div
      key="container-drop-highlight"
      style={{
        position: 'absolute',
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: '2px dashed #116dff',
        borderRadius: 8,
        background: 'rgba(17, 109, 255, 0.08)',
        pointerEvents: 'none',
        zIndex: 9990,
        transition: 'all 120ms ease',
      }}
    />
  );
}
