'use client';

import { memo } from 'react';
import styles from './SandboxPage.module.css';

export interface CanvasCollabCursor {
  sessionId: string;
  userId: string;
  pageId: string;
  x: number;
  y: number;
  color: string;
  label: string;
  nodeId?: string;
  updatedAt: string;
}

type Props = {
  cursors: CanvasCollabCursor[];
  zoom: number;
};

function CanvasCollabCursorsLayer({ cursors, zoom }: Props) {
  if (cursors.length === 0) return null;

  return (
    <div className={styles.collabCursorsLayer} aria-hidden="true">
      {cursors.slice(0, 8).map((cursor) => {
        const scale = 1 / Math.max(zoom, 0.25);

        return (
          <div
            key={cursor.sessionId}
            className={styles.collabCursor}
            data-builder-collab-cursor="true"
            data-builder-collab-cursor-user={cursor.userId}
            title={cursor.label}
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              borderColor: cursor.color,
              boxShadow: `0 0 0 4px color-mix(in srgb, ${cursor.color} 15%, transparent)`,
              transform: `translate(-50%, -100%) scale(${scale})`,
            }}
          >
            <span
              className={styles.collabCursorPointer}
              style={{ background: cursor.color }}
            />
            <span className={styles.collabCursorLabel}>{cursor.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default memo(CanvasCollabCursorsLayer);
