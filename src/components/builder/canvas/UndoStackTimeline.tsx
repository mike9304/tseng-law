'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { currentBuilderLocale } from './canvasNodeUtils';
import EditorChromeIcon from './EditorChromeIcon';
import styles from './SandboxPage.module.css';
import {
  getUndoStackTimelineCopy,
  type UndoStackTimelineCopy,
} from './undo-stack-timeline-copy';

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function summarizeTransition(
  previous: BuilderCanvasDocument | null,
  current: BuilderCanvasDocument,
  index: number,
  copy: UndoStackTimelineCopy,
): string {
  if (!previous) return copy.initialSnapshot;

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
  if (added) parts.push(copy.addedLabel(added));
  if (removed) parts.push(copy.removedLabel(removed));
  if (moved) parts.push(copy.movedLabel(moved));
  if (resized) parts.push(copy.resizedLabel(resized));
  if (restyled) parts.push(copy.styledLabel(restyled));
  if (content) parts.push(copy.editedLabel(content));
  return parts.length > 0 ? parts.join(' · ') : copy.snapshotLabel(index + 1);
}

function nodeCountLabel(snapshot: BuilderCanvasDocument, copy: UndoStackTimelineCopy): string {
  const roots = snapshot.nodes.filter((node: BuilderCanvasNode) => !node.parentId).length;
  return copy.nodeCountLabel(snapshot.nodes.length, roots);
}

export default function UndoStackTimeline() {
  const history = useBuilderCanvasStore((state) => state.history);
  const documentLocale = useBuilderCanvasStore((state) => state.document?.locale);
  const canUndo = useBuilderCanvasStore((state) => state.canUndo);
  const canRedo = useBuilderCanvasStore((state) => state.canRedo);
  const undo = useBuilderCanvasStore((state) => state.undo);
  const redo = useBuilderCanvasStore((state) => state.redo);
  const jumpToHistorySnapshot = useBuilderCanvasStore((state) => state.jumpToHistorySnapshot);
  const renameHistorySnapshot = useBuilderCanvasStore((state) => state.renameHistorySnapshot);
  const copy = getUndoStackTimelineCopy(documentLocale ?? currentBuilderLocale());
  const currentEntry = history ? history.entries[history.cursor] : null;
  const currentEntryName = currentEntry?.name ?? '';
  const [draftName, setDraftName] = useState(currentEntryName);

  const entries = useMemo(() => {
    const rawEntries = history?.entries ?? [];
    return rawEntries.map((entry, index) => {
      const previous = rawEntries[index - 1]?.snapshot ?? null;
      const summary = summarizeTransition(previous, entry.snapshot, index, copy);
      const explicitName = entry.name?.trim();
      return {
        ...entry,
        title: explicitName || summary,
        hasExplicitName: Boolean(explicitName),
        nodeCount: nodeCountLabel(entry.snapshot, copy),
        timeLabel: new Date(entry.timestamp).toLocaleTimeString(copy.dateLocale, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    });
  }, [copy, history]);

  useEffect(() => {
    setDraftName(currentEntryName);
  }, [currentEntryName, history?.cursor]);

  if (!history) return null;

  const normalizedDraftName = draftName.trim().replace(/\s+/g, ' ');
  const canSaveName = normalizedDraftName !== currentEntryName;
  const canClearName = currentEntryName.length > 0 || draftName.trim().length > 0;

  const saveCurrentName = () => {
    renameHistorySnapshot(history.cursor, draftName);
  };

  const clearCurrentName = () => {
    setDraftName('');
    renameHistorySnapshot(history.cursor, '');
  };

  return (
    <section className={`${styles.panelSection} ${styles.undoTimeline}`} data-builder-undo-timeline="true">
      <header className={styles.undoTimelineHeader}>
        <div className={styles.undoTimelineHeading}>
          <span>{copy.sectionLabel}</span>
          <strong>{copy.snapshotCountLabel(entries.length)}</strong>
        </div>
        <div className={styles.undoTimelineActions}>
          <button
            type="button"
            className={styles.undoTimelineActionButton}
            data-builder-undo-action="undo"
            title={copy.undoTitle}
            aria-label={copy.undoTitle}
            disabled={!canUndo}
            onClick={undo}
          >
            <EditorChromeIcon name="undo" />
            <span>{copy.undo}</span>
          </button>
          <button
            type="button"
            className={styles.undoTimelineActionButton}
            data-builder-undo-action="redo"
            title={copy.redoTitle}
            aria-label={copy.redoTitle}
            disabled={!canRedo}
            onClick={redo}
          >
            <EditorChromeIcon name="redo" />
            <span>{copy.redo}</span>
          </button>
        </div>
      </header>
      <div className={styles.undoTimelineNameForm} data-builder-undo-name-form="true">
        <label className={styles.undoTimelineNameLabel} htmlFor="builder-undo-snapshot-name">
          {copy.nameInputLabel}
        </label>
        <div className={styles.undoTimelineNameControls}>
          <input
            id="builder-undo-snapshot-name"
            className={styles.undoTimelineNameInput}
            data-builder-undo-name-input="true"
            maxLength={80}
            value={draftName}
            placeholder={copy.nameInputPlaceholder}
            onChange={(event) => setDraftName(event.currentTarget.value)}
          />
          <button
            type="button"
            className={styles.undoTimelineNameButton}
            data-builder-undo-name-save="true"
            title={copy.saveNameTitle}
            disabled={!canSaveName}
            onClick={saveCurrentName}
          >
            {copy.saveName}
          </button>
          <button
            type="button"
            className={styles.undoTimelineNameButton}
            data-builder-undo-name-clear="true"
            title={copy.clearNameTitle}
            disabled={!canClearName}
            onClick={clearCurrentName}
          >
            {copy.clearName}
          </button>
        </div>
      </div>
      <ol className={styles.undoTimelineList}>
        <span className={styles.undoTimelineRail} aria-hidden="true" />
        {entries.map((entry, index) => {
          const active = index === history.cursor;
          return (
            <li key={`${entry.timestamp}-${index}`}>
              <button
                type="button"
                disabled={active}
                onClick={() => jumpToHistorySnapshot(index)}
                aria-current={active ? 'step' : undefined}
                aria-label={`${entry.title} · ${entry.nodeCount}`}
                className={styles.undoTimelineSnapshot}
                data-builder-undo-snapshot={active ? 'current' : 'saved'}
                data-builder-undo-snapshot-name={entry.hasExplicitName ? 'explicit' : 'auto'}
                data-active={active ? 'true' : 'false'}
              >
                <span className={styles.undoTimelineDot} aria-hidden="true" />
                <strong className={styles.undoTimelineSnapshotTitle}>
                  {entry.title}
                </strong>
                <small className={styles.undoTimelineSnapshotMeta}>
                  <span>{entry.timeLabel}</span>
                  <span>{entry.nodeCount}</span>
                  <span className={styles.undoTimelineSnapshotBadge}>
                    {active ? copy.currentBadge : copy.savedBadge}
                  </span>
                </small>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
