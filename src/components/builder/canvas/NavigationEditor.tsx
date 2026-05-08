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

const childItemStyle: React.CSSProperties = {
  ...itemStyle,
  marginLeft: 18,
  borderStyle: 'dashed',
  background: '#fbfdff',
};

const childBadgeStyle: React.CSSProperties = {
  flexShrink: 0,
  borderRadius: 999,
  background: '#eff6ff',
  color: '#116dff',
  padding: '1px 6px',
  fontSize: '0.62rem',
  fontWeight: 800,
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

function updateNavigationItem(
  items: BuilderNavItem[],
  itemId: string,
  updater: (item: BuilderNavItem) => BuilderNavItem,
): BuilderNavItem[] {
  return items.map((item) => {
    if (item.id === itemId) return updater(item);
    if (!item.children?.length) return item;
    return {
      ...item,
      children: updateNavigationItem(item.children, itemId, updater),
    };
  });
}

function findNavigationItem(items: BuilderNavItem[], itemId: string): BuilderNavItem | undefined {
  for (const item of items) {
    if (item.id === itemId) return item;
    const child = item.children?.length ? findNavigationItem(item.children, itemId) : undefined;
    if (child) return child;
  }
  return undefined;
}

function removeNavigationItem(items: BuilderNavItem[], itemId: string): BuilderNavItem[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) => (
      item.children?.length
        ? { ...item, children: removeNavigationItem(item.children, itemId) }
        : item
    ));
}

function moveNavigationItem(
  items: BuilderNavItem[],
  itemId: string,
  direction: 'up' | 'down',
): BuilderNavItem[] {
  const index = items.findIndex((item) => item.id === itemId);
  if (index >= 0) {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return items;
    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    return next;
  }

  return items.map((item) => (
    item.children?.length
      ? { ...item, children: moveNavigationItem(item.children, itemId, direction) }
      : item
  ));
}

export default function NavigationEditor({
  locale,
  focusItemId,
  addChildParentId,
  onFocusHandled,
  onAddChildHandled,
  onNavigationChange,
}: {
  locale: string;
  focusItemId?: string | null;
  addChildParentId?: string | null;
  onFocusHandled?: () => void;
  onAddChildHandled?: () => void;
  onNavigationChange?: (items: BuilderNavItem[]) => void;
}) {
  const editorLocale = normalizeLocale(locale);
  const labelInputRef = useRef<HTMLInputElement | null>(null);
  const addChildRequestRef = useRef<string | null>(null);
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
        const payload = (await response.json().catch(() => null)) as { navigation?: BuilderNavItem[] } | null;
        if (Array.isArray(payload?.navigation)) {
          setItems(payload.navigation);
          onNavigationChange?.(payload.navigation);
        }
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

  const handleAddChild = useCallback((parentId: string) => {
    const id = `${parentId}-child-${Date.now().toString(36)}`;
    const child: BuilderNavItem = {
      id,
      label: { ko: '새 하위 메뉴', 'zh-hant': '新子選單', en: 'New submenu item' },
      href: '/',
      pageId: `external-${id}`,
    };
    const next = updateNavigationItem(items, parentId, (item) => ({
      ...item,
      children: [...(item.children ?? []), child],
    }));
    setItems(next);
    setEditingId(id);
    setEditLabel(labelForLocale(child, editorLocale));
    setEditHref(child.href);
    saveNav(next);
    window.setTimeout(() => labelInputRef.current?.focus(), 0);
  }, [editorLocale, items, saveNav]);

  const handleDelete = (id: string) => {
    const next = removeNavigationItem(items, id);
    setItems(next);
    saveNav(next);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const next = moveNavigationItem(items, id, direction);
    if (next === items) return;
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
    const item = findNavigationItem(items, focusItemId);
    if (!item) {
      onFocusHandled?.();
      return;
    }
    startEdit(item);
    onFocusHandled?.();
  }, [focusItemId, items, loading, onFocusHandled, startEdit]);

  useEffect(() => {
    if (!addChildParentId) {
      addChildRequestRef.current = null;
      return;
    }
    if (loading || addChildRequestRef.current === addChildParentId) return;
    addChildRequestRef.current = addChildParentId;
    const parent = findNavigationItem(items, addChildParentId);
    if (parent) {
      handleAddChild(addChildParentId);
    }
    onAddChildHandled?.();
  }, [addChildParentId, handleAddChild, items, loading, onAddChildHandled]);

  const commitEdit = () => {
    if (!editingId) return;
    const nextLabel = editLabel.trim() || 'Untitled';
    const nextHref = editHref.trim() || '/';
    const next = updateNavigationItem(
      items,
      editingId,
      (item) => ({
        ...item,
        label: localizedLabel(item.label, editorLocale, nextLabel),
        href: nextHref,
      }),
    );
    setItems(next);
    saveNav(next);
    setEditingId(null);
  };

  const renderEditForm = (itemId: string) => (
    <div key={itemId} style={editFormStyle} data-builder-nav-edit-id={itemId}>
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
  );

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
        items.map((item) =>
          editingId === item.id ? (
            renderEditForm(item.id)
          ) : (
            <div key={item.id}>
              <div style={itemStyle} data-builder-nav-item-row={item.id}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {labelForLocale(item, editorLocale)}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', flexShrink: 0 }}>
                  {item.href}
                </span>
                <button type="button" style={smallBtnStyle} onClick={() => handleMove(item.id, 'up')} title="위로">
                  ↑
                </button>
                <button type="button" style={smallBtnStyle} onClick={() => handleMove(item.id, 'down')} title="아래로">
                  ↓
                </button>
                <button type="button" style={smallBtnStyle} onClick={() => handleAddChild(item.id)} title="하위 메뉴 추가">
                  + Mega
                </button>
                <button type="button" style={smallBtnStyle} onClick={() => startEdit(item)} title="편집">
                  ✎
                </button>
                <button type="button" style={dangerBtnStyle} onClick={() => handleDelete(item.id)} title="삭제">
                  ✕
                </button>
              </div>
              {item.children?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4, marginBottom: 4 }}>
                  {item.children.map((child) => (
                    editingId === child.id ? (
                      renderEditForm(child.id)
                    ) : (
                      <div key={child.id} style={childItemStyle} data-builder-nav-item-row={child.id}>
                        <span style={childBadgeStyle}>Mega</span>
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {labelForLocale(child, editorLocale)}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', flexShrink: 0 }}>
                          {child.href}
                        </span>
                        <button type="button" style={smallBtnStyle} onClick={() => handleMove(child.id, 'up')} title="Mega 위로">
                          ↑
                        </button>
                        <button type="button" style={smallBtnStyle} onClick={() => handleMove(child.id, 'down')} title="Mega 아래로">
                          ↓
                        </button>
                        <button type="button" style={smallBtnStyle} onClick={() => startEdit(child)} title="Mega item">
                          ✎
                        </button>
                        <button type="button" style={dangerBtnStyle} onClick={() => handleDelete(child.id)} title="Mega 삭제">
                          ✕
                        </button>
                      </div>
                    )
                  ))}
                </div>
              ) : null}
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
