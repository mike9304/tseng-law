'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import {
  insertSavedSection,
  type SavedSectionInsertResult,
} from '@/lib/builder/sections/insertSection';
import {
  buildSavedSectionThumbnailSvg,
  sanitizeSvgThumbnail,
} from '@/lib/builder/sections/thumbnail';
import {
  type SavedSection,
  type SavedSectionCategory,
} from '@/lib/builder/site/types';

const DRAG_MIME = 'application/x-builder-saved-section-id';

const CATEGORY_LABELS: Record<SavedSectionCategory, string> = {
  hero: 'Hero',
  features: 'Features',
  testimonials: 'Testimonials',
  cta: 'CTA',
  footer: 'Footer',
  custom: 'Custom',
};

const CATEGORY_COLORS: Record<SavedSectionCategory, string> = {
  hero: '#dbeafe',
  features: '#dcfce7',
  testimonials: '#fef3c7',
  cta: '#fce7f3',
  footer: '#e0e7ff',
  custom: '#f1f5f9',
};

export default function SavedSectionsPanel({ locale }: { locale: Locale }) {
  const [sections, setSections] = useState<SavedSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const addNodes = useBuilderCanvasStore((s) => s.addNodes);
  const document = useBuilderCanvasStore((s) => s.document);

  const reload = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/section-library?locale=${encodeURIComponent(locale)}`,
        { credentials: 'same-origin' },
      );
      if (response.ok) {
        const data = (await response.json()) as { sections?: SavedSection[] };
        setSections(data.sections ?? []);
      } else {
        setErrorMessage('섹션 목록을 불러오지 못했습니다.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '섹션 목록 오류');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Listen for "section saved" event so the panel auto-refreshes after save.
  useEffect(() => {
    function handleEvent() {
      void reload();
    }
    window.addEventListener('builder:saved-section-changed', handleEvent);
    return () => window.removeEventListener('builder:saved-section-changed', handleEvent);
  }, [reload]);

  const grouped = useMemo(() => {
    const buckets = new Map<SavedSectionCategory, SavedSection[]>();
    for (const section of sections) {
      const key: SavedSectionCategory = section.category ?? 'custom';
      const arr = buckets.get(key) ?? [];
      arr.push(section);
      buckets.set(key, arr);
    }
    return [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [sections]);

  async function handleInsert(section: SavedSection) {
    if (!document) return;
    const result: SavedSectionInsertResult = insertSavedSection(section);
    addNodes(result.nodes, result.rootNodeId);
    // Optimistic usage bump.
    setSections((current) =>
      current.map((s) =>
        s.sectionId === section.sectionId
          ? { ...s, usage: (s.usage ?? 0) + 1 }
          : s,
      ),
    );
    try {
      await fetch(
        `/api/builder/site/section-library/${section.sectionId}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ incrementUsage: true }),
        },
      );
    } catch {
      // best effort
    }
  }

  async function handleDelete(section: SavedSection) {
    if (!window.confirm(`"${section.name}" 섹션을 삭제하시겠습니까?`)) return;
    try {
      const response = await fetch(
        `/api/builder/site/section-library/${section.sectionId}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        },
      );
      if (response.ok) {
        setSections((current) => current.filter((s) => s.sectionId !== section.sectionId));
      } else {
        setErrorMessage('삭제에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '삭제 오류');
    }
  }

  async function commitRename(section: SavedSection) {
    const next = renameValue.trim();
    setRenamingId(null);
    if (!next || next === section.name) return;
    try {
      const response = await fetch(
        `/api/builder/site/section-library/${section.sectionId}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ name: next }),
        },
      );
      if (response.ok) {
        const data = (await response.json()) as { section?: SavedSection };
        if (data.section) {
          setSections((current) =>
            current.map((s) => (s.sectionId === section.sectionId ? data.section! : s)),
          );
        }
      } else {
        setErrorMessage('이름 변경에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '이름 변경 오류');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong style={{ fontSize: '0.83rem', color: '#0f172a' }}>
          저장한 섹션 ({sections.length})
        </strong>
        <button
          type="button"
          onClick={() => { void reload(); }}
          style={{
            padding: '4px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            background: '#fff',
            color: '#475569',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          새로고침
        </button>
      </div>

      {errorMessage ? (
        <div
          style={{
            padding: '6px 10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            color: '#b91c1c',
            fontSize: '0.72rem',
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', padding: '12px 0' }}>
          불러오는 중…
        </div>
      ) : sections.length === 0 ? (
        <div
          style={{
            padding: 14,
            border: '1px dashed #cbd5e1',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#64748b',
            fontSize: '0.78rem',
            textAlign: 'center',
          }}
        >
          아직 저장한 섹션이 없습니다.
          <br />
          캔버스에서 컨테이너를 우클릭 → &quot;섹션으로 저장&quot;으로 추가하세요.
        </div>
      ) : (
        grouped.map(([category, items]) => (
          <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#64748b',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                padding: '4px 0',
              }}
            >
              {CATEGORY_LABELS[category]} · {items.length}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 8,
              }}
            >
              {items.map((section) => (
                <div
                  key={section.sectionId}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(DRAG_MIME, section.sectionId);
                    event.dataTransfer.effectAllowed = 'copy';
                  }}
                  style={{
                    border: '1px solid #dbe4ee',
                    borderRadius: 10,
                    background: '#fff',
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    cursor: 'grab',
                    boxShadow: '0 4px 10px rgba(15, 23, 42, 0.04)',
                  }}
                  title={`${section.name} — drag to canvas, double-click to insert`}
                  onDoubleClick={() => { void handleInsert(section); }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 70,
                      background: '#f8fafc',
                      borderRadius: 6,
                      overflow: 'hidden',
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        sanitizeSvgThumbnail(section.thumbnail)
                        ?? buildSavedSectionThumbnailSvg(section.nodes, section.rootNodeId, 200, 70),
                    }}
                  />

                  {renamingId === section.sectionId ? (
                    <input
                      type="text"
                      autoFocus
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      onBlur={() => { void commitRename(section); }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          void commitRename(section);
                        } else if (event.key === 'Escape') {
                          setRenamingId(null);
                        }
                      }}
                      style={{
                        padding: '4px 6px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        fontSize: '0.78rem',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {section.name}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        padding: '1px 6px',
                        borderRadius: 999,
                        background: CATEGORY_COLORS[category],
                        color: '#0f172a',
                        fontWeight: 600,
                      }}
                    >
                      {CATEGORY_LABELS[category]}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                      사용 {section.usage ?? 0}회
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                    <button
                      type="button"
                      onClick={() => { void handleInsert(section); }}
                      style={iconButtonStyle('#eff6ff', '#123b63')}
                      title="현재 페이지에 추가"
                    >
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(section.sectionId);
                        setRenameValue(section.name);
                      }}
                      style={iconButtonStyle('#fff', '#475569')}
                      title="이름 변경"
                    >
                      이름
                    </button>
                    <button
                      type="button"
                      onClick={() => { void handleDelete(section); }}
                      style={iconButtonStyle('#fff', '#b91c1c')}
                      title="삭제"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function iconButtonStyle(background: string, color: string): React.CSSProperties {
  return {
    flex: 1,
    padding: '4px 6px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    background,
    color,
    fontSize: '0.7rem',
    fontWeight: 600,
    cursor: 'pointer',
  };
}
