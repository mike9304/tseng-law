'use client';

import { useShortcutLabels } from '@/components/builder/canvas/hooks/useShortcutLabels';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { nodeLinkPreviewHref } from './canvasNodeUtils';
import styles from './CanvasNodeBadge.module.css';

type CanvasNodeBadgeProps = {
  node: BuilderCanvasNode;
  width: number;
  height: number;
  animationSummary: string | null;
  onSelect: (nodeId: string, additive: boolean) => void;
};

export function CanvasNodeBadge({
  node,
  width,
  height,
  animationSummary,
  onSelect,
}: CanvasNodeBadgeProps) {
  const linkHref = nodeLinkPreviewHref(node);
  const linkPreview = linkHref && linkHref.length > 16 ? `${linkHref.slice(0, 14)}…` : linkHref;
  const shortcutLabels = useShortcutLabels(['editLink']);
  const editLinkShortcutTitle = shortcutLabels.get('editLink')?.title;

  return (
    <div className={styles.nodeBadge}>
      <span>{node.kind}</span>
      <strong>· {Math.round(width)}×{Math.round(height)}</strong>
      {node.locked ? <em>locked</em> : null}
      {node.sticky ? (
        <em
          title={`Pinned ${node.sticky.from === 'bottom' ? 'bottom' : 'top'} +${node.sticky.offset}px`}
          style={{ color: '#60a5fa' }}
        >
          📌
        </em>
      ) : null}
      {node.anchorName ? (
        <em title={`Anchor: #${node.anchorName}`} style={{ color: '#34d399' }}>
          ⚓ {node.anchorName}
        </em>
      ) : null}
      {animationSummary ? <em title={animationSummary} style={{ color: '#a78bfa' }}>anim</em> : null}
      {linkHref ? (
        <em
          title={`Link: ${linkHref}\n클릭하거나 ${editLinkShortcutTitle ?? '단축키'}로 편집`}
          style={{
            color: '#fbbf24',
            cursor: 'pointer',
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onSelect(node.id, false);
            if (typeof document !== 'undefined') {
              document.dispatchEvent(
                new CustomEvent('builder:open-link-popover', {
                  detail: { nodeId: node.id },
                }),
              );
            }
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
        >
          🔗 {linkPreview}
        </em>
      ) : null}
    </div>
  );
}
