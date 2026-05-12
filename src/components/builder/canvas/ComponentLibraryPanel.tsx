'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { getCanvasNodeDescendantIds } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

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
  const canvasDocument = useBuilderCanvasStore((state) => state.document);
  const selectedNodeIds = useBuilderCanvasStore((state) => state.selectedNodeIds);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const setDraftSaveState = useBuilderCanvasStore((state) => state.setDraftSaveState);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    setEntries(loadEditorPreferences().componentLibrary);
    function handlePrefsChange(event: Event) {
      const prefs = (event as CustomEvent<EditorPreferences>).detail ?? loadEditorPreferences();
      setEntries(prefs.componentLibrary);
    }
    window.document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => window.document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  const effectiveSelectedNodeJson = useMemo(() => {
    if (selectedNodeJson) return selectedNodeJson;
    if (!canvasDocument || selectedNodeIds.length === 0) return '';
    const ids = new Set<string>();
    for (const nodeId of selectedNodeIds) {
      ids.add(nodeId);
      for (const descendantId of getCanvasNodeDescendantIds(nodeId, childrenMap)) {
        ids.add(descendantId);
      }
    }
    const nodes = canvasDocument.nodes.filter((node) => ids.has(node.id));
    if (nodes.length === 0) return '';
    return JSON.stringify({
      rootNodeId: selectedNodeIds[0] ?? nodes[0]?.id,
      rootNodeIds: selectedNodeIds,
      nodes,
    });
  }, [canvasDocument, childrenMap, selectedNodeIds, selectedNodeJson]);

  function persist(next: Entry[]) {
    const prefs = loadEditorPreferences() ?? DEFAULT_EDITOR_PREFS;
    saveAndBroadcastEditorPreferences({ ...prefs, componentLibrary: next });
    setEntries(next);
  }

  function save() {
    if (!effectiveSelectedNodeJson || !name.trim()) return;
    const entry: Entry = {
      id: `lib-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim().slice(0, 80),
      nodeJson: effectiveSelectedNodeJson,
      createdAt: new Date().toISOString(),
    };
    persist([...entries, entry]);
    setName('');
  }

  function remove(id: string) {
    persist(entries.filter((e) => e.id !== id));
  }

  function makeNodeId(kind: string, index: number): string {
    return `${kind}-lib-${Date.now().toString(36)}-${index}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function parseEntryNodes(entry: Entry): { nodes: BuilderCanvasNode[]; rootNodeId: string | null } | null {
    try {
      const parsed = JSON.parse(entry.nodeJson) as Partial<{
        nodes: BuilderCanvasNode[];
        rootNodeId: string;
        rootNodeIds: string[];
      }> | BuilderCanvasNode;
      const sourceNodes = Array.isArray((parsed as { nodes?: unknown }).nodes)
        ? (parsed as { nodes: BuilderCanvasNode[] }).nodes
        : (parsed as BuilderCanvasNode).id
          ? [parsed as BuilderCanvasNode]
          : [];
      if (sourceNodes.length === 0) return null;
      const idMap = new Map<string, string>();
      sourceNodes.forEach((node, index) => idMap.set(node.id, makeNodeId(node.kind, index)));
      const sourceIds = new Set(sourceNodes.map((node) => node.id));
      const cloned = sourceNodes.map((node, index) => ({
        ...node,
        id: idMap.get(node.id)!,
        parentId: node.parentId && sourceIds.has(node.parentId) ? idMap.get(node.parentId) : undefined,
        rect: {
          ...node.rect,
          x: node.rect.x + 32,
          y: node.rect.y + 32,
        },
        zIndex: (canvasDocument?.nodes.length ?? 0) + index,
      }));
      const preferredRoot = (parsed as { rootNodeIds?: string[] }).rootNodeIds?.at(-1)
        ?? (parsed as { rootNodeId?: string }).rootNodeId
        ?? sourceNodes.find((node) => !node.parentId || !sourceIds.has(node.parentId))?.id
        ?? sourceNodes[0]!.id;
      return { nodes: cloned, rootNodeId: idMap.get(preferredRoot) ?? cloned[0]?.id ?? null };
    } catch {
      return null;
    }
  }

  function insert(entry: Entry) {
    if (onInsert) {
      onInsert(entry);
      return;
    }
    const parsed = parseEntryNodes(entry);
    if (!parsed || parsed.nodes.length === 0) return;
    addNodes(parsed.nodes, parsed.rootNodeId);
    setDraftSaveState('saving');
  }

  return (
    <div data-builder-component-library="true" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
      <strong style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase' }}>
        Component library · {entries.length}
      </strong>

      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          data-builder-component-library-name="true"
          style={{ flex: 1, padding: 4, fontSize: 12, border: '1px solid #cbd5e1', borderRadius: 6 }}
        />
        <button
          type="button"
          data-builder-component-library-save="true"
          disabled={!name.trim() || !effectiveSelectedNodeJson}
          onClick={save}
          style={{
            padding: '4px 10px',
            border: 0,
            background: name.trim() && effectiveSelectedNodeJson ? '#0f172a' : '#cbd5e1',
            color: '#ffffff',
            borderRadius: 6,
            cursor: name.trim() && effectiveSelectedNodeJson ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          저장
        </button>
      </div>

      {!effectiveSelectedNodeJson ? (
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
                data-builder-component-library-insert={e.id}
                onClick={() => insert(e)}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  borderRadius: 6,
                  cursor: 'pointer',
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
