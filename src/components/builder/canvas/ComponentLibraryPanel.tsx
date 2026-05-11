'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveEditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';

interface Entry {
  id: string;
  name: string;
  nodeJson: string;
  createdAt: string;
}

interface Props {
  /** Currently selected node as JSON for "Save current selection". */
  selectedNodeJson?: string;
  /** Callback to insert a saved entry's nodeJson back into canvas. */
  onInsert?: (entry: Entry) => void;
}

/**
 * Phase 28 W223 — Component library panel.
 *
 * Lets the user save the currently-selected node tree as a named reusable
 * component, then insert it back into other pages later. Storage is
 * localStorage via editor preferences (single-user); multi-user library
 * sharing is a follow-up.
 */
export default function ComponentLibraryPanel({ selectedNodeJson, onInsert }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    setEntries(loadEditorPreferences().componentLibrary);
  }, []);

  function persist(next: Entry[]) {
    const prefs = loadEditorPreferences() ?? DEFAULT_EDITOR_PREFS;
    saveEditorPreferences({ ...prefs, componentLibrary: next });
    setEntries(next);
  }

  function save() {
    if (!selectedNodeJson || !name.trim()) return;
    const entry: Entry = {
      id: `lib-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim().slice(0, 80),
      nodeJson: selectedNodeJson,
      createdAt: new Date().toISOString(),
    };
    persist([...entries, entry]);
    setName('');
  }

  function remove(id: string) {
    persist(entries.filter((e) => e.id !== id));
  }

  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
      <strong style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase' }}>
        Component library · {entries.length}
      </strong>

      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          style={{ flex: 1, padding: 4, fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <button
          type="button"
          disabled={!name.trim() || !selectedNodeJson}
          onClick={save}
          style={{
            padding: '4px 10px',
            border: 0,
            background: name.trim() && selectedNodeJson ? '#0f172a' : '#cbd5e1',
            color: '#ffffff',
            borderRadius: 6,
            cursor: name.trim() && selectedNodeJson ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          저장
        </button>
      </div>

      {!selectedNodeJson ? (
        <p style={{ color: '#94a3b8', margin: 0 }}>선택한 노드를 라이브러리에 저장하려면 노드를 먼저 선택하세요.</p>
      ) : null}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.length === 0 ? (
          <li style={{ color: '#94a3b8' }}>저장된 컴포넌트가 없습니다.</li>
        ) : (
          entries.map((e) => (
            <li
              key={e.id}
              style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                padding: 6,
                border: '1px solid #e2e8f0',
                borderRadius: 6,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: 12 }}>{e.name}</strong>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  {new Date(e.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onInsert?.(e)}
                disabled={!onInsert}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  borderRadius: 6,
                  cursor: onInsert ? 'pointer' : 'not-allowed',
                }}
              >
                삽입
              </button>
              <button
                type="button"
                onClick={() => remove(e.id)}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  background: '#ffffff',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
