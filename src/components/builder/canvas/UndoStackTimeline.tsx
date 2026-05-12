'use client';

import { useMemo } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function summarizeTransition(previous: BuilderCanvasDocument | null, current: BuilderCanvasDocument, index: number): string {
  if (!previous) return 'Initial canvas snapshot';

  const previousById = new Map(previous.nodes.map((node) => [node.id, node]));
  const currentById = new Map(current.nodes.map((node) => [node.id, node]));
  let added = 0;
  let removed = 0;
  let moved = 0;
  let resized = 0;
  let restyled = 0;
  let content = 0;

  for (const node of current.nodes) {
    const before = previousById.get(node.id);
    if (!before) {
      added += 1;
      continue;
    }
    if (before.rect.x !== node.rect.x || before.rect.y !== node.rect.y) moved += 1;
    if (before.rect.width !== node.rect.width || before.rect.height !== node.rect.height) resized += 1;
    if (!sameJson(before.style, node.style) || !sameJson(before.hoverStyle, node.hoverStyle)) restyled += 1;
    if (!sameJson(before.content, node.content)) content += 1;
  }

  for (const node of previous.nodes) {
    if (!currentById.has(node.id)) removed += 1;
  }

  const parts: string[] = [];
  if (added) parts.push(`added ${added}`);
  if (removed) parts.push(`removed ${removed}`);
  if (moved) parts.push(`moved ${moved}`);
  if (resized) parts.push(`resized ${resized}`);
  if (restyled) parts.push(`styled ${restyled}`);
  if (content) parts.push(`edited ${content}`);
  return parts.length > 0 ? parts.join(' · ') : `Snapshot ${index + 1}`;
}

function nodeCountLabel(snapshot: BuilderCanvasDocument): string {
  const roots = snapshot.nodes.filter((node: BuilderCanvasNode) => !node.parentId).length;
  return `${snapshot.nodes.length} nodes · ${roots} roots`;
}

export default function UndoStackTimeline() {
  const history = useBuilderCanvasStore((state) => state.history);
  const canUndo = useBuilderCanvasStore((state) => state.canUndo);
  const canRedo = useBuilderCanvasStore((state) => state.canRedo);
  const undo = useBuilderCanvasStore((state) => state.undo);
  const redo = useBuilderCanvasStore((state) => state.redo);

  const entries = useMemo(() => {
    const rawEntries = history?.entries ?? [];
    return rawEntries.map((entry, index) => {
      const previous = rawEntries[index - 1]?.snapshot ?? null;
      return {
        ...entry,
        name: summarizeTransition(previous, entry.snapshot, index),
        nodeCount: nodeCountLabel(entry.snapshot),
      };
    });
  }, [history]);

  if (!history) return null;

  return (
    <section className={styles.panelSection} data-builder-undo-timeline="true">
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Undo stack</span>
          <strong>{entries.length} snapshots</strong>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className={styles.panelHeaderButton}
            data-builder-undo-action="undo"
            disabled={!canUndo}
            onClick={undo}
          >
            Undo
          </button>
          <button
            type="button"
            className={styles.panelHeaderButton}
            data-builder-undo-action="redo"
            disabled={!canRedo}
            onClick={redo}
          >
            Redo
          </button>
        </div>
      </header>
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '2px 0 0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'relative',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 4,
            top: 8,
            bottom: 8,
            width: 2,
            borderRadius: 999,
            background: '#dbe3ee',
          }}
        />
        {entries.map((entry, index) => {
          const active = index === history.cursor;
          return (
            <li
              key={`${entry.timestamp}-${index}`}
              data-builder-undo-snapshot={active ? 'current' : 'saved'}
              style={{
                position: 'relative',
                padding: '8px 10px',
                border: active ? '1px solid #116dff' : '1px solid #e2e8f0',
                borderRadius: 8,
                background: active ? '#eff6ff' : '#fff',
                boxShadow: active ? '0 8px 20px rgba(17,109,255,0.12)' : 'none',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: -17,
                  top: 12,
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  border: active ? '2px solid #116dff' : '2px solid #94a3b8',
                  background: '#fff',
                }}
              />
              <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.78rem' }}>
                {entry.name}
              </strong>
              <small style={{ display: 'block', marginTop: 2, color: '#64748b', fontSize: '0.68rem' }}>
                {new Date(entry.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {' · '}
                {entry.nodeCount}
                {active ? ' · current' : ''}
              </small>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
