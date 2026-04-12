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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreatePage = async (templateDocument?: BuilderCanvasDocument | null) => {
    if (creating) return;
    setCreating(true);
    setShowGallery(false);
    try {
      const response = await fetch('/api/builder/site/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          slug: `page-${Date.now().toString(36)}`,
          title: 'New Page',
        }),
      });
      if (response.ok) {
        await fetchPages();
      }
    } catch {
      // silent fail
    } finally {
      setCreating(false);
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
          onSelect={(doc) => handleCreatePage(doc)}
          onClose={() => setShowGallery(false)}
        />
      ) : null}
    </div>
  );
}
