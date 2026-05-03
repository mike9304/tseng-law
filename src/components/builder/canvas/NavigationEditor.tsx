'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeLocale, type Locale } from '@/lib/locales';
import type { BuilderNavItem } from '@/lib/builder/site/types';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '8px 0',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
  marginBottom: 4,
};

const headerLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

const addBtnStyle: React.CSSProperties = {
  padding: '2px 10px',
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 8px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  background: '#fff',
  fontSize: '0.8rem',
  color: '#334155',
  transition: 'background 120ms ease',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '3px 6px',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  fontSize: '0.78rem',
  color: '#0f172a',
  outline: 'none',
};

const smallBtnStyle: React.CSSProperties = {
  padding: '2px 6px',
  fontSize: '0.68rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 4,
  background: '#fff',
  color: '#64748b',
  cursor: 'pointer',
  flexShrink: 0,
};

const dangerBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  color: '#dc2626',
  borderColor: '#fca5a5',
};

const editFormStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '6px 8px',
  borderRadius: 8,
  border: '1px solid #116dff',
  background: '#f8fafc',
};

const editRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const editLabelStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  fontWeight: 600,
  color: '#64748b',
  minWidth: 36,
};

function labelForLocale(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return item.label[locale] || item.label.ko || item.label.en || item.label['zh-hant'] || '';
}

function localizedLabel(
  currentLabel: BuilderNavItem['label'],
  locale: Locale,
  nextLabel: string,
): BuilderNavItem['label'] {
  if (typeof currentLabel === 'string') return nextLabel;
  return {
    ...currentLabel,
    [locale]: nextLabel,
  };
}

export default function NavigationEditor({
  locale,
  focusItemId,
  onFocusHandled,
  onNavigationChange,
}: {
  locale: string;
  focusItemId?: string | null;
  onFocusHandled?: () => void;
  onNavigationChange?: (items: BuilderNavItem[]) => void;
}) {
  const editorLocale = normalizeLocale(locale);
  const labelInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<BuilderNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref] = useState('');

  const fetchNav = useCallback(async () => {
    try {
      const res = await fetch(`/api/builder/site/navigation?locale=${locale}`, {
        credentials: 'same-origin',
      });
      if (res.ok) {
        const data = (await res.json()) as { navigation: BuilderNavItem[] };
        setItems(data.navigation);
        onNavigationChange?.(data.navigation);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [locale, onNavigationChange]);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  const saveNav = useCallback(
    async (nextItems: BuilderNavItem[]) => {
      setSaving(true);
      setSaveError(null);
      onNavigationChange?.(nextItems);
      try {
        const response = await fetch('/api/builder/site/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            locale,
            navigation: nextItems,
          }),
        });
        if (!response.ok) throw new Error('Navigation save failed');
      } catch {
        setSaveError('메뉴 저장에 실패했습니다.');
      } finally {
        setSaving(false);
      }
    },
    [locale, onNavigationChange],
  );

  const handleAdd = () => {
    const id = `nav-${Date.now().toString(36)}`;
    const next = [
      ...items,
      {
        id,
        label: { ko: '새 항목', 'zh-hant': '新項目', en: 'New item' },
        href: '/',
        pageId: `external-${id}`,
      },
    ];
    setItems(next);
    saveNav(next);
  };

  const handleDelete = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    saveNav(next);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setItems(next);
    saveNav(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setItems(next);
    saveNav(next);
  };

  const startEdit = useCallback((item: BuilderNavItem) => {
    setEditingId(item.id);
    setEditLabel(labelForLocale(item, editorLocale));
    setEditHref(item.href);
    window.setTimeout(() => labelInputRef.current?.focus(), 0);
  }, [editorLocale]);

  useEffect(() => {
    if (!focusItemId || loading) return;
    const item = items.find((candidate) => candidate.id === focusItemId);
    if (!item) {
      onFocusHandled?.();
      return;
    }
    startEdit(item);
    onFocusHandled?.();
  }, [focusItemId, items, loading, onFocusHandled, startEdit]);

  const commitEdit = () => {
    if (!editingId) return;
    const nextLabel = editLabel.trim() || 'Untitled';
    const nextHref = editHref.trim() || '/';
    const next = items.map((item) =>
      item.id === editingId
        ? {
            ...item,
            label: localizedLabel(item.label, editorLocale, nextLabel),
            href: nextHref,
          }
        : item,
    );
    setItems(next);
    saveNav(next);
    setEditingId(null);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={headerLabelStyle}>Navigation</span>
        <button
          type="button"
          style={addBtnStyle}
          onClick={handleAdd}
          disabled={saving}
        >
          + 추가
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
          항목 없음
        </div>
      ) : (
        items.map((item, index) =>
          editingId === item.id ? (
            <div key={item.id} style={editFormStyle}>
              <div style={editRowStyle}>
                <span style={editLabelStyle}>라벨</span>
                <input
                  type="text"
                  value={editLabel}
                  style={inputStyle}
                  ref={labelInputRef}
                  onChange={(e) => setEditLabel(e.target.value)}
                />
              </div>
              <div style={editRowStyle}>
                <span style={editLabelStyle}>경로</span>
                <input
                  type="text"
                  value={editHref}
                  style={inputStyle}
                  onChange={(e) => setEditHref(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={smallBtnStyle}
                  onClick={() => setEditingId(null)}
                >
                  취소
                </button>
                <button
                  type="button"
                  style={{ ...smallBtnStyle, color: '#116dff', borderColor: '#116dff' }}
                  onClick={commitEdit}
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div key={item.id} style={itemStyle}>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {labelForLocale(item, editorLocale)}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', flexShrink: 0 }}>
                {item.href}
              </span>
              <button type="button" style={smallBtnStyle} onClick={() => handleMoveUp(index)} title="위로">
                ↑
              </button>
              <button type="button" style={smallBtnStyle} onClick={() => handleMoveDown(index)} title="아래로">
                ↓
              </button>
              <button type="button" style={smallBtnStyle} onClick={() => startEdit(item)} title="편집">
                ✎
              </button>
              <button type="button" style={dangerBtnStyle} onClick={() => handleDelete(item.id)} title="삭제">
                ✕
              </button>
            </div>
          ),
        )
      )}

      {saving && (
        <div style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#116dff', fontWeight: 600 }}>
          저장 중...
        </div>
      )}
      {saveError ? (
        <div role="alert" style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
          {saveError}
        </div>
      ) : null}
    </div>
  );
}
