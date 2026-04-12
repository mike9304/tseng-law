'use client';

import { useCallback, useEffect, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

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

export default function NavigationEditor({
  locale,
}: {
  locale: string;
}) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editHref, setEditHref] = useState('');

  const fetchNav = useCallback(async () => {
    try {
      const res = await fetch(`/api/builder/site/navigation?locale=${locale}`, {
        credentials: 'same-origin',
      });
      if (res.ok) {
        const data = (await res.json()) as { navigation: NavItem[] };
        setItems(
          data.navigation.map((n) => ({
            id: n.id,
            label: typeof n.label === 'string' ? n.label : (n.label as Record<string, string>)[locale] || '',
            href: n.href,
          })),
        );
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  const saveNav = useCallback(
    async (nextItems: NavItem[]) => {
      setSaving(true);
      try {
        await fetch('/api/builder/site/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            locale,
            navigation: nextItems.map((item) => ({
              id: item.id,
              label: item.label,
              href: item.href,
              pageId: '',
            })),
          }),
        });
      } catch {
        // silent
      } finally {
        setSaving(false);
      }
    },
    [locale],
  );

  const handleAdd = () => {
    const id = `nav-${Date.now().toString(36)}`;
    const next = [...items, { id, label: '새 항목', href: '/' }];
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

  const startEdit = (item: NavItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditHref(item.href);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const next = items.map((item) =>
      item.id === editingId ? { ...item, label: editLabel, href: editHref } : item,
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
                {item.label}
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
    </div>
  );
}
