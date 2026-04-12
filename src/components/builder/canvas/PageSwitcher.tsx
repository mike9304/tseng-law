'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import TemplateGalleryModal from './TemplateGalleryModal';

interface PageMeta {
  pageId: string;
  slug: string;
  title: Record<string, string>;
  isHomePage?: boolean;
  publishedAt?: string;
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

const addButtonStyle: React.CSSProperties = {
  padding: '2px 10px',
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

function pageItemStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    borderRadius: 8,
    border: active ? '1px solid #123b63' : '1px solid transparent',
    background: active ? '#eff6ff' : 'transparent',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: active ? 600 : 400,
    color: active ? '#123b63' : '#334155',
    transition: 'background 150ms ease, border-color 150ms ease',
  };
}

const slugStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#94a3b8',
  marginLeft: 'auto',
};

const statusDotStyle = (published: boolean): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: published ? '#22c55e' : '#e2e8f0',
  flexShrink: 0,
});

export default function PageSwitcher({
  locale,
  activePageId,
  onSelectPage,
}: {
  locale: Locale;
  activePageId: string | null;
  onSelectPage: (pageId: string) => void;
}) {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<BuilderCanvasDocument | null | undefined>(undefined);
  const [slugInput, setSlugInput] = useState('');
  const [showSlugPrompt, setShowSlugPrompt] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      const response = await fetch(`/api/builder/site/pages?locale=${locale}`, {
        credentials: 'same-origin',
      });
      if (response.ok) {
        const data = (await response.json()) as { pages: PageMeta[] };
        setPages(data.pages);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleTemplateSelect = (templateDocument: BuilderCanvasDocument | null) => {
    setPendingTemplate(templateDocument);
    setSlugInput('');
    setShowGallery(false);
    setShowSlugPrompt(true);
  };

  const handleCreatePage = async () => {
    if (creating) return;
    const slug = slugInput.trim() || `page-${Date.now().toString(36)}`;
    setCreating(true);
    setShowSlugPrompt(false);
    try {
      const response = await fetch('/api/builder/site/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          slug,
          title: slug,
          ...(pendingTemplate ? { document: pendingTemplate } : {}),
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { pageId?: string };
        await fetchPages();
        if (data.pageId) {
          onSelectPage(data.pageId);
        }
      }
    } catch {
      // silent fail
    } finally {
      setCreating(false);
      setPendingTemplate(undefined);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={headerLabelStyle}>Pages</span>
        <button
          type="button"
          style={addButtonStyle}
          disabled={creating}
          onClick={() => setShowGallery(true)}
        >
          {creating ? '...' : '+ New'}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
          Loading...
        </div>
      ) : pages.length === 0 ? (
        <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
          No pages found
        </div>
      ) : (
        pages.map((page) => {
          const isActive = page.pageId === activePageId;
          return (
            <button
              key={page.pageId}
              type="button"
              style={pageItemStyle(isActive)}
              onClick={() => onSelectPage(page.pageId)}
            >
              <span style={statusDotStyle(!!page.publishedAt)} title={page.publishedAt ? 'Published' : 'Draft'} />
              <span>{page.title[locale] || page.title.ko || page.slug || 'Untitled'}</span>
              {page.isHomePage && (
                <span style={{ fontSize: '0.65rem', color: '#123b63', fontWeight: 700 }}>HOME</span>
              )}
              <span style={slugStyle}>/{page.slug}</span>
            </button>
          );
        })
      )}

      {showGallery ? (
        <TemplateGalleryModal
          onSelect={(doc) => handleTemplateSelect(doc)}
          onClose={() => setShowGallery(false)}
        />
      ) : null}

      {showSlugPrompt ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 10000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowSlugPrompt(false); setPendingTemplate(undefined); } }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,.18)',
              padding: 32,
              maxWidth: 400,
              width: '90vw',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              페이지 Slug 입력
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16 }}>
              {pendingTemplate ? '선택한 템플릿으로 새 페이지를 생성합니다.' : '빈 페이지를 생성합니다.'}
            </div>
            <input
              type="text"
              placeholder="예: about, services, contact"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreatePage(); }}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                marginBottom: 16,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setShowSlugPrompt(false); setPendingTemplate(undefined); }}
                style={{ padding: '6px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCreatePage}
                disabled={creating}
                style={{ padding: '6px 16px', background: '#123b63', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {creating ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
