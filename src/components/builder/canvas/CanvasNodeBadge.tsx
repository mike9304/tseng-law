'use client';

import { useShortcutLabels } from '@/components/builder/canvas/hooks/useShortcutLabels';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { currentBuilderLocale } from './canvasNodeUtils';
import { getCanvasNodeBadgeCopy } from './canvas-shortcuts-copy';
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
  const locale = currentBuilderLocale();
  const copy = getCanvasNodeBadgeCopy(locale as Parameters<typeof getCanvasNodeBadgeCopy>[0]);

  return (
    <div className={styles.nodeBadge}>
      <span>{node.kind}</span>
      <strong>· {Math.round(width)}×{Math.round(height)}</strong>
      {node.locked ? <em className={styles.badgeItem} data-tone="locked">{copy.locked}</em> : null}
      {node.sticky ? (
        <em
          className={styles.badgeItem}
          data-tone="sticky"
          title={copy.sticky(node.sticky.from === 'bottom' ? 'bottom' : 'top', node.sticky.offset)}
        >
          📌
        </em>
      ) : null}
      {node.anchorName ? (
        <em className={styles.badgeItem} data-tone="anchor" title={copy.anchor(node.anchorName)}>
          ⚓ {node.anchorName}
        </em>
      ) : null}
      {animationSummary ? (
        <em className={styles.badgeItem} data-tone="animation" title={animationSummary}>{copy.animation}</em>
      ) : null}
      {linkHref ? (
        <button
          type="button"
          className={`${styles.badgeItem} ${styles.linkBadgeButton}`}
          data-tone="link"
          title={copy.link(linkHref, editLinkShortcutTitle ?? copy.shortcutFallback)}
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
          <span className={styles.linkBadgeIcon} aria-hidden="true">🔗</span>
          <span className={styles.linkBadgeText}>{linkPreview}</span>
        </button>
      ) : null}
    </div>
  );
}
