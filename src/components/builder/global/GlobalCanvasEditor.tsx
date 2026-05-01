'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import SandboxCatalogPanel from '@/components/builder/canvas/SandboxCatalogPanel';
import SandboxInspectorPanel from '@/components/builder/canvas/SandboxInspectorPanel';
import SandboxLayersPanel from '@/components/builder/canvas/SandboxLayersPanel';
import { BuilderThemeProvider } from '@/components/builder/editor/BuilderThemeContext';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const AUTOSAVE_DEBOUNCE_MS = 1000;

type Drawer = 'add' | 'layers';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface GlobalCanvasEditorProps {
  locale: Locale;
  slot: 'header' | 'footer';
  initialDocument: BuilderCanvasDocument;
}

const SLOT_META: Record<'header' | 'footer', { title: string; saveUrl: string }> = {
  header: {
    title: 'Global Header',
    saveUrl: '/api/builder/site/header/draft',
  },
  footer: {
    title: 'Global Footer',
    saveUrl: '/api/builder/site/footer/draft',
  },
};

export default function GlobalCanvasEditor({
  locale,
  slot,
  initialDocument,
}: GlobalCanvasEditorProps) {
  const {
    document,
    selectedNodeIds,
    mutationBaseDocument,
    replaceDocument,
    setViewport,
  } = useBuilderCanvasStore();
  const [drawer, setDrawer] = useState<Drawer | null>('add');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const initialUpdatedAtRef = useRef(initialDocument.updatedAt);
  const meta = SLOT_META[slot];

  // Hydrate the canvas store on mount (and reset selection cleanly).
  useEffect(() => {
    replaceDocument(initialDocument);
  }, [initialDocument, replaceDocument]);

  useEffect(() => {
    setViewport('desktop');
  }, [setViewport]);

  // Autosave the canvas to the global header/footer draft endpoint.
  useEffect(() => {
    if (!document) return undefined;
    if (mutationBaseDocument) return undefined;
    if (document.updatedAt === initialUpdatedAtRef.current) return undefined;
    setSaveState('saving');
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`${meta.saveUrl}?locale=${locale}`, {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document }),
        });
        if (!res.ok) {
          setSaveState('error');
          return;
        }
        setSaveState('saved');
        window.setTimeout(() => setSaveState('idle'), 1500);
      } catch {
        setSaveState('error');
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [document, locale, meta.saveUrl, mutationBaseDocument]);

  const hasSelection = selectedNodeIds.length > 0;
  const stageWidth = document?.stageWidth ?? initialDocument.stageWidth ?? 1280;
  const stageHeight = document?.stageHeight ?? initialDocument.stageHeight ?? 120;

  const saveLabel = useMemo(() => {
    switch (saveState) {
      case 'saving': return 'Saving…';
      case 'saved': return 'Saved';
      case 'error': return 'Save failed';
      default: return '';
    }
  }, [saveState]);

  return (
    <BuilderThemeProvider value={DEFAULT_THEME}>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          background: '#0f172a',
        }}
      >
        {/* Top bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            background: '#1e293b',
            color: '#fff',
            borderBottom: '1px solid #334155',
            flex: '0 0 auto',
          }}
        >
          <Link
            href={`/${locale}/admin-builder`}
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 13 }}
          >
            ← Admin
          </Link>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{meta.title}</strong>
            <code style={{ color: '#94a3b8', fontSize: 12 }}>
              {slot === 'header' ? 'site.header' : 'site.footer'}
            </code>
          </div>
          {saveLabel && (
            <span
              style={{
                color: saveState === 'error' ? '#fca5a5' : '#86efac',
                fontSize: 12,
              }}
            >
              {saveLabel}
            </span>
          )}
        </header>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Left rail */}
          <nav
            style={{
              width: 60,
              background: '#1e293b',
              borderRight: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              padding: 8,
              gap: 4,
              flex: '0 0 auto',
            }}
          >
            <button
              type="button"
              onClick={() => setDrawer((d) => (d === 'add' ? null : 'add'))}
              style={{
                padding: '12px 0',
                background: drawer === 'add' ? '#0b3b2e' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 11,
              }}
            >
              ＋<br />Add
            </button>
            <button
              type="button"
              onClick={() => setDrawer((d) => (d === 'layers' ? null : 'layers'))}
              style={{
                padding: '12px 0',
                background: drawer === 'layers' ? '#0b3b2e' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 11,
              }}
            >
              ▥<br />Layers
            </button>
          </nav>

          {/* Drawer */}
          {drawer && (
            <aside
              style={{
                width: 280,
                background: '#fff',
                borderRight: '1px solid #e2e8f0',
                overflow: 'auto',
                flex: '0 0 auto',
              }}
            >
              {drawer === 'add' && <SandboxCatalogPanel />}
              {drawer === 'layers' && <SandboxLayersPanel />}
            </aside>
          )}

          {/* Canvas */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              background: '#475569',
              overflow: 'auto',
              padding: 24,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                width: stageWidth,
                height: stageHeight,
                position: 'relative',
                background: '#fff',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
              }}
            >
              <CanvasContainer />
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 12, marginTop: 12 }}>
              {stageWidth} × {stageHeight} — autosaved as{' '}
              {slot === 'header' ? 'global header' : 'global footer'}
            </p>
            {document && document.nodes.length === 0 && (
              <p style={{ color: '#cbd5e1', fontSize: 12, marginTop: 4, maxWidth: 480, textAlign: 'center' }}>
                Empty canvas — published pages will fall back to the legacy {slot} component
                until you add at least one node here.
              </p>
            )}
          </div>

          {/* Inspector */}
          {hasSelection && (
            <aside
              style={{
                width: 320,
                background: '#fff',
                borderLeft: '1px solid #e2e8f0',
                overflow: 'auto',
                flex: '0 0 auto',
              }}
            >
              <SandboxInspectorPanel onRequestAssetLibrary={() => undefined} />
            </aside>
          )}
        </div>
      </main>
    </BuilderThemeProvider>
  );
}
