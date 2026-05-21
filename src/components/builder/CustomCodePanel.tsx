'use client';

/**
 * F105 — Custom code admin panel.
 *
 * Two-column layout: site-level slots on the left, page-level slots on the
 * right. Each textarea shows a live character count and any validator
 * warnings as chips. Save button PATCHes /api/builder/site/custom-code for
 * the site slots and /api/builder/site/pages/<pageId> for the page slots.
 *
 * The validator runs client-side for live feedback; the server re-runs it
 * during PATCH for the source of truth.
 */

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  CUSTOM_CODE_MAX_LENGTH,
  validateCustomCode,
  type CustomCodeWarning,
  type PageCustomCode,
  type SiteCustomCode,
} from '@/lib/builder/site/custom-code';

type SlotKey = 'siteHead' | 'siteBodyStart' | 'siteBodyEnd' | 'pageHead' | 'pageBodyStart' | 'pageBodyEnd';

interface CustomCodePanelProps {
  locale: string;
  /** Optional page-level context. If omitted, only site slots are editable. */
  pageId?: string;
  initialSiteCode?: SiteCustomCode;
  initialPageCode?: PageCustomCode;
}

const SLOT_LABELS: Record<SlotKey, string> = {
  siteHead: 'Site · head',
  siteBodyStart: 'Site · body (start)',
  siteBodyEnd: 'Site · body (end)',
  pageHead: 'Page · head',
  pageBodyStart: 'Page · body (start)',
  pageBodyEnd: 'Page · body (end)',
};

const TEXTAREA_STYLE: React.CSSProperties = {
  width: '100%',
  minHeight: 120,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#0f172a',
  color: '#e2e8f0',
  resize: 'vertical',
};

const SECTION_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  background: '#f8fafc',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
};

function warningChipColor(code: CustomCodeWarning['code']): string {
  switch (code) {
    case 'too_long': return '#dc2626';
    case 'insecure_script_src': return '#dc2626';
    case 'iframe_blocked': return '#ea580c';
    case 'eval_warning': return '#a16207';
    default: return '#475569';
  }
}

function WarningsList({ warnings }: { warnings: CustomCodeWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
      {warnings.map((warning, index) => (
        <span
          key={`${warning.code}-${index}`}
          title={warning.message}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 999,
            fontSize: 11,
            color: '#fff',
            background: warningChipColor(warning.code),
          }}
        >
          {warning.code}
        </span>
      ))}
    </div>
  );
}

function SlotEditor({
  slot,
  value,
  onChange,
}: {
  slot: SlotKey;
  value: string;
  onChange: (next: string) => void;
}) {
  const validation = useMemo(() => validateCustomCode(value), [value]);
  const remaining = CUSTOM_CODE_MAX_LENGTH - value.length;
  const overCap = remaining < 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          htmlFor={`custom-code-${slot}`}
          style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}
        >
          {SLOT_LABELS[slot]}
        </label>
        <span
          style={{
            fontSize: 11,
            color: overCap ? '#dc2626' : '#475569',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value.length} / {CUSTOM_CODE_MAX_LENGTH}
        </span>
      </div>
      <textarea
        id={`custom-code-${slot}`}
        value={value}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        style={TEXTAREA_STYLE}
        placeholder="<script>...</script>"
      />
      <WarningsList warnings={validation.warnings} />
    </div>
  );
}

function readError(payload: unknown): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === 'string') return error;
  }
  return 'Unknown error';
}

export default function CustomCodePanel({
  locale,
  pageId,
  initialSiteCode = {},
  initialPageCode = {},
}: CustomCodePanelProps) {
  const [siteHead, setSiteHead] = useState(initialSiteCode.siteHead ?? '');
  const [siteBodyStart, setSiteBodyStart] = useState(initialSiteCode.siteBodyStart ?? '');
  const [siteBodyEnd, setSiteBodyEnd] = useState(initialSiteCode.siteBodyEnd ?? '');
  const [pageHead, setPageHead] = useState(initialPageCode.head ?? '');
  const [pageBodyStart, setPageBodyStart] = useState(initialPageCode.bodyStart ?? '');
  const [pageBodyEnd, setPageBodyEnd] = useState(initialPageCode.bodyEnd ?? '');
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Hydrate from server on first render so the panel works even when
  // the parent doesn't pre-fetch the current values.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(`/api/builder/site/custom-code?locale=${encodeURIComponent(locale)}`);
        if (!response.ok || cancelled) return;
        const json = await response.json() as { customCode?: SiteCustomCode };
        const code = json.customCode ?? {};
        if (!cancelled) {
          if (code.siteHead !== undefined) setSiteHead(code.siteHead);
          if (code.siteBodyStart !== undefined) setSiteBodyStart(code.siteBodyStart);
          if (code.siteBodyEnd !== undefined) setSiteBodyEnd(code.siteBodyEnd);
        }
      } catch { /* silent */ }
    })();
    return () => { cancelled = true; };
  }, [locale]);

  const save = () => {
    setStatus(null);
    setIsError(false);
    startTransition(async () => {
      try {
        const siteResponse = await fetch(
          `/api/builder/site/custom-code?locale=${encodeURIComponent(locale)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteHead, siteBodyStart, siteBodyEnd }),
          },
        );
        if (!siteResponse.ok) {
          const payload = (await siteResponse.json().catch(() => ({}))) as unknown;
          setIsError(true);
          setStatus(`Site save failed: ${readError(payload)}`);
          return;
        }
        if (pageId) {
          const pageResponse = await fetch(
            `/api/builder/site/pages/${encodeURIComponent(pageId)}/custom-code?locale=${encodeURIComponent(locale)}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ head: pageHead, bodyStart: pageBodyStart, bodyEnd: pageBodyEnd }),
            },
          );
          if (!pageResponse.ok) {
            const payload = (await pageResponse.json().catch(() => ({}))) as unknown;
            setIsError(true);
            setStatus(`Page save failed: ${readError(payload)}`);
            return;
          }
        }
        setStatus('Saved. Republish the affected pages to take effect.');
      } catch (error) {
        setIsError(true);
        setStatus(error instanceof Error ? error.message : 'unknown_error');
      }
    });
  };

  return (
    <div
      data-builder-custom-code-panel="true"
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Custom Code</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
          Inject snippets into the site head / body. Site-level slots run on every page;
          page-level slots run only on the active page.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: pageId ? '1fr 1fr' : '1fr',
          gap: 16,
        }}
      >
        <section style={SECTION_STYLE} aria-labelledby="custom-code-site-heading">
          <h3 id="custom-code-site-heading" style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Site-level</h3>
          <SlotEditor slot="siteHead" value={siteHead} onChange={setSiteHead} />
          <SlotEditor slot="siteBodyStart" value={siteBodyStart} onChange={setSiteBodyStart} />
          <SlotEditor slot="siteBodyEnd" value={siteBodyEnd} onChange={setSiteBodyEnd} />
        </section>

        {pageId ? (
          <section style={SECTION_STYLE} aria-labelledby="custom-code-page-heading">
            <h3 id="custom-code-page-heading" style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Page-level</h3>
            <SlotEditor slot="pageHead" value={pageHead} onChange={setPageHead} />
            <SlotEditor slot="pageBodyStart" value={pageBodyStart} onChange={setPageBodyStart} />
            <SlotEditor slot="pageBodyEnd" value={pageBodyEnd} onChange={setPageBodyEnd} />
          </section>
        ) : null}
      </div>

      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 12, color: isError ? '#dc2626' : '#475569', minHeight: 16 }}>
          {status ?? ''}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: isPending ? '#94a3b8' : '#1d4ed8',
            color: '#fff',
            fontWeight: 600,
            cursor: isPending ? 'wait' : 'pointer',
          }}
        >
          {isPending ? 'Saving…' : 'Save custom code'}
        </button>
      </footer>
    </div>
  );
}