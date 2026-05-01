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
import { DEFAULT_THEME, type BuilderLightbox } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const AUTOSAVE_DEBOUNCE_MS = 1000;

type Drawer = 'add' | 'layers' | 'settings';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function LightboxEditor({
  locale,
  lightbox,
  initialDocument,
}: {
  locale: Locale;
  lightbox: BuilderLightbox;
  initialDocument: BuilderCanvasDocument;
}) {
  const {
    document,
    selectedNodeIds,
    mutationBaseDocument,
    replaceDocument,
    setViewport,
  } = useBuilderCanvasStore();
  const [drawer, setDrawer] = useState<Drawer | null>('add');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [meta, setMeta] = useState(lightbox);
  const initialUpdatedAtRef = useRef(initialDocument.updatedAt);

  // Hydrate the canvas store on mount (and reset selection cleanly).
  useEffect(() => {
    replaceDocument(initialDocument);
  }, [initialDocument, replaceDocument]);

  useEffect(() => {
    setViewport('desktop');
  }, [setViewport]);

  // Autosave the canvas to the lightbox draft endpoint.
  useEffect(() => {
    if (!document) return undefined;
    if (mutationBaseDocument) return undefined;
    if (document.updatedAt === initialUpdatedAtRef.current) return undefined;
    setSaveState('saving');
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/builder/site/lightboxes/${lightbox.id}/draft?locale=${locale}`,
          {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document }),
          },
        );
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
  }, [document, lightbox.id, locale, mutationBaseDocument]);

  const hasSelection = selectedNodeIds.length > 0;
  const stageWidth = document?.stageWidth ?? meta.width ?? 600;
  const stageHeight = document?.stageHeight ?? meta.height ?? 400;

  const saveLabel = useMemo(() => {
    switch (saveState) {
      case 'saving': return 'Saving…';
      case 'saved': return 'Saved';
      case 'error': return 'Save failed';
      default: return '';
    }
  }, [saveState]);

  async function patchMeta(patch: Partial<BuilderLightbox>) {
    try {
      const res = await fetch(
        `/api/builder/site/lightboxes/${lightbox.id}?locale=${locale}`,
        {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        },
      );
      const data = (await res.json()) as { ok?: boolean; lightbox?: BuilderLightbox };
      if (data.ok && data.lightbox) {
        setMeta(data.lightbox);
      }
    } catch {
      // ignore
    }
  }

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
            href={`/${locale}/admin-builder/lightboxes`}
            style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: 13 }}
          >
            ← Lightboxes
          </Link>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 14 }}>{meta.name}</strong>
            <code style={{ color: '#94a3b8', fontSize: 12 }}>lightbox:{meta.slug}</code>
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
          <button
            type="button"
            onClick={() => setDrawer((d) => (d === 'settings' ? null : 'settings'))}
            style={{
              padding: '6px 12px',
              background: drawer === 'settings' ? '#0b3b2e' : '#334155',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Settings
          </button>
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
              ➕<br />Add
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
              🧩<br />Layers
            </button>
          </nav>

          {/* Drawer */}
          {drawer && (
            <aside
              style={{
                width: drawer === 'settings' ? 320 : 280,
                background: '#fff',
                borderRight: '1px solid #e2e8f0',
                overflow: 'auto',
                flex: '0 0 auto',
              }}
            >
              {drawer === 'add' && <SandboxCatalogPanel />}
              {drawer === 'layers' && <SandboxLayersPanel />}
              {drawer === 'settings' && (
                <LightboxSettingsPanel meta={meta} onPatch={patchMeta} />
              )}
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
              {meta.sizeMode === 'fixed'
                ? `Fixed ${stageWidth} × ${stageHeight}`
                : `Auto sizing (${stageWidth} × ${stageHeight})`}
            </p>
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

function LightboxSettingsPanel({
  meta,
  onPatch,
}: {
  meta: BuilderLightbox;
  onPatch: (patch: Partial<BuilderLightbox>) => Promise<void>;
}) {
  return (
    <div style={{ padding: 16, fontSize: 13 }}>
      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Lightbox settings</h2>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Size mode</span>
        <select
          value={meta.sizeMode}
          onChange={(e) => onPatch({ sizeMode: e.target.value as 'auto' | 'fixed' })}
          style={{ width: '100%', padding: 6, border: '1px solid #cbd5e1', borderRadius: 4 }}
        >
          <option value="auto">Auto</option>
          <option value="fixed">Fixed</option>
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Width (px)</span>
        <input
          type="number"
          value={meta.width ?? 600}
          onChange={(e) => onPatch({ width: Number(e.target.value) })}
          style={{ width: '100%', padding: 6, border: '1px solid #cbd5e1', borderRadius: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Height (px)</span>
        <input
          type="number"
          value={meta.height ?? 400}
          onChange={(e) => onPatch({ height: Number(e.target.value) })}
          style={{ width: '100%', padding: 6, border: '1px solid #cbd5e1', borderRadius: 4 }}
        />
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={meta.dismissable}
          onChange={(e) => onPatch({ dismissable: e.target.checked })}
        />
        Show close (X) button
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={meta.closeOnOutsideClick}
          onChange={(e) => onPatch({ closeOnOutsideClick: e.target.checked })}
        />
        Close on outside click
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={meta.closeOnEsc}
          onChange={(e) => onPatch({ closeOnEsc: e.target.checked })}
        />
        Close on Esc key
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Backdrop opacity ({meta.backdropOpacity}%)
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={meta.backdropOpacity}
          onChange={(e) => onPatch({ backdropOpacity: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  );
}
