'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import type { BuilderCompositeCanvasNode } from '@/lib/builder/canvas/types';

export default function CompositeEditSurface({ node, overrides, wrapperStyle, children }: {
  node: BuilderCompositeCanvasNode;
  overrides: Record<string, string>;
  wrapperStyle: CSSProperties;
  children: ReactNode;
}) {
  const mode = 'edit';
  const interactive = false;
  const selectedNodeId = useBuilderCanvasStore((s) => s.selectedNodeId);
  const selectedSurfaceKey = useBuilderCanvasStore((s) => s.selectedSurfaceKey);
  const setSelectedSurfaceKey = useBuilderCanvasStore((s) => s.setSelectedSurfaceKey);
  const isCompositeSelected = selectedNodeId === node.id;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== 'edit') return;
    const root = containerRef.current;
    if (!root) return;
    const previouslyOutlined = root.querySelectorAll<HTMLElement>(
      '[data-builder-surface-outline="true"]',
    );
    previouslyOutlined.forEach((el) => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.removeAttribute('data-builder-surface-outline');
    });
    if (!isCompositeSelected || !selectedSurfaceKey) return;
    const target = root.querySelector<HTMLElement>(
      `[data-builder-surface-key="${CSS.escape(selectedSurfaceKey)}"]`,
    );
    if (target) {
      target.style.outline = '2px solid #2563eb';
      target.style.outlineOffset = '2px';
      target.setAttribute('data-builder-surface-outline', 'true');
    }
  }, [mode, isCompositeSelected, selectedSurfaceKey, children]);

  useEffect(() => {
    if (mode !== 'edit' || !isCompositeSelected || !selectedSurfaceKey) return;
    const root = containerRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(
      `[data-builder-surface-key="${CSS.escape(selectedSurfaceKey)}"]`,
    );
    if (!target) return;

    const originalText = target.textContent ?? '';
    let committed = false;
    target.setAttribute('contenteditable', 'plaintext-only');
    target.setAttribute('data-builder-surface-editing', 'true');
    target.style.cursor = 'text';
    target.focus();
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const commit = () => {
      if (committed) return;
      committed = true;
      const newText = (target.textContent ?? '').trim();
      cleanup();
      if (newText === originalText.trim()) return;
      const store = useBuilderCanvasStore.getState();
      const currentNode = store.document?.nodes.find((n) => n.id === node.id);
      if (!currentNode || currentNode.kind !== 'composite') return;
      const content = currentNode.content as { componentKey: string; config?: Record<string, unknown> };
      const nextConfig = { ...(content.config ?? {}) };
      const nextOverrides = { ...((nextConfig.overrides as Record<string, string> | undefined) ?? {}) };
      if (newText === '') {
        delete nextOverrides[selectedSurfaceKey];
      } else {
        nextOverrides[selectedSurfaceKey] = newText;
      }
      nextConfig.overrides = nextOverrides;
      store.updateNodeContent(node.id, {
        componentKey: content.componentKey,
        config: nextConfig,
      });
    };

    const revert = () => {
      if (committed) return;
      committed = true;
      target.textContent = originalText;
      cleanup();
    };

    const cleanup = () => {
      target.removeAttribute('contenteditable');
      target.removeAttribute('data-builder-surface-editing');
      target.style.cursor = '';
      target.removeEventListener('blur', commit);
      target.removeEventListener('keydown', keyHandler);
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commit();
        target.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        revert();
        target.blur();
      }
    };

    target.addEventListener('blur', commit);
    target.addEventListener('keydown', keyHandler);

    return () => {
      if (!committed) commit();
    };
  }, [mode, isCompositeSelected, selectedSurfaceKey, node.id]);

  const handleWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'edit' || !isCompositeSelected) return;
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const surfaceEl = elements.find((el) =>
      el instanceof HTMLElement && el.hasAttribute('data-builder-surface-key'),
    ) as HTMLElement | undefined;
    if (!surfaceEl) {
      if (selectedSurfaceKey) setSelectedSurfaceKey(null);
      return;
    }
    const key = surfaceEl.getAttribute('data-builder-surface-key');
    if (!key) return;
    if (key === selectedSurfaceKey) return; // already editing this surface
    event.stopPropagation();
    event.preventDefault();
    setSelectedSurfaceKey(key);
  };

  return (
    <BuilderSurfaceProvider
      nodeId={node.id}
      mode={mode}
      overrides={overrides}
      selectedSurfaceKey={isCompositeSelected ? selectedSurfaceKey : null}
    >
      <div ref={containerRef} style={wrapperStyle} onClickCapture={handleWrapperClick}>
        {children}
        {!interactive && (
          <div
            data-composite-edit-overlay="true"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              cursor: isCompositeSelected ? 'default' : 'move',
              background: 'transparent',
              pointerEvents: isCompositeSelected ? 'none' : 'auto',
            }}
          />
        )}
      </div>
    </BuilderSurfaceProvider>
  );
}
