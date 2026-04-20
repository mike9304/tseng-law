'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';

interface PublishCheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

function runPublishChecksClient(doc: BuilderCanvasDocument): PublishCheckResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const node of doc.nodes) {
    if (node.kind === 'text' && (!node.content.text || node.content.text.trim().length === 0)) {
      warnings.push(`Empty text node: ${node.id}`);
    }
    if (node.kind === 'image' && !node.content.src) {
      errors.push(`Image source missing: ${node.id}`);
    }
    if (node.kind === 'image' && !node.content.alt) {
      warnings.push(`Image alt text missing: ${node.id} (accessibility)`);
    }
    if (node.kind === 'button' && !node.content.href) {
      warnings.push(`Button link missing: ${node.id}`);
    }
  }

  if (doc.nodes.length === 0) {
    errors.push('Page has no elements.');
  }

  return { passed: errors.length === 0, warnings, errors };
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  animation: 'publishBackdropIn 200ms ease',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
  width: '100%',
  maxWidth: 480,
  maxHeight: '85vh',
  overflow: 'auto',
  padding: '28px 28px 24px',
  animation: 'publishModalIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#0f172a',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  margin: '16px 0 6px',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const errorItemStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  background: '#fef2f2',
  color: '#991b1b',
  fontSize: '0.82rem',
  border: '1px solid #fca5a5',
};

const warningItemStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  background: '#fffbeb',
  color: '#92400e',
  fontSize: '0.82rem',
  border: '1px solid #fde68a',
};

const successBoxStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: 10,
  background: '#f0fdf4',
  border: '1px solid #86efac',
  color: '#166534',
  fontSize: '0.88rem',
  fontWeight: 500,
  textAlign: 'center',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 20,
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 18px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

function publishButtonStyle(enabled: boolean): React.CSSProperties {
  return {
    padding: '8px 20px',
    borderRadius: 8,
    border: 'none',
    background: enabled ? '#123b63' : '#94a3b8',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.6,
  };
}

const keyframesCSS = `
@keyframes publishBackdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes publishModalIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
`;

type PublishState = 'checking' | 'ready' | 'publishing' | 'success' | 'error';

export default function PublishModal({
  open,
  document,
  locale,
  activePageId,
  onClose,
}: {
  open: boolean;
  document: BuilderCanvasDocument | null;
  locale: string;
  activePageId?: string | null;
  onClose: () => void;
}) {
  const [publishState, setPublishState] = useState<PublishState>('checking');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  const checks = useMemo<PublishCheckResult | null>(() => {
    if (!document) return null;
    return runPublishChecksClient(document);
  }, [document]);

  useEffect(() => {
    if (!open) {
      setPublishState('checking');
      setPublishError(null);
      setPublishedSlug(null);
      return;
    }
    // After checking, set ready
    const timer = window.setTimeout(() => {
      setPublishState('ready');
    }, 400);
    return () => window.clearTimeout(timer);
  }, [open]);

  // ESC key handler
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handlePublish = useCallback(async () => {
    if (!checks?.passed || !document) return;
    setPublishState('publishing');
    setPublishError(null);

    try {
      if (activePageId) {
        // ── Site page publish: save draft then call publish API ──
        const saveResponse = await fetch(
          `/api/builder/site/pages/${activePageId}/draft?locale=${locale}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ document }),
          },
        );
        if (!saveResponse.ok) {
          setPublishState('error');
          setPublishError('Failed to save draft before publish.');
          return;
        }

        const publishResponse = await fetch(
          `/api/builder/site/pages/${activePageId}/publish?locale=${locale}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
          },
        );

        if (!publishResponse.ok) {
          const errData = (await publishResponse.json().catch(() => ({}))) as {
            errors?: string[];
            error?: string;
          };
          setPublishState('error');
          setPublishError(
            errData.errors?.join(', ') || errData.error || 'Publish failed.',
          );
          return;
        }

        const result = (await publishResponse.json()) as { ok: boolean; slug?: string };
        setPublishState('success');
        const slug = result.slug ?? '';
        setPublishedSlug(buildSitePagePath(locale, slug));
      } else {
        // ── Legacy sandbox publish fallback ──
        const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ document }),
        });

        if (!response.ok) {
          setPublishState('error');
          setPublishError('Failed to save draft before publish.');
          return;
        }

        setPublishState('success');
        setPublishedSlug(`/p/sandbox`);
      }
    } catch {
      setPublishState('error');
      setPublishError('Network error during publish.');
    }
  }, [checks, document, locale, activePageId]);

  if (!open) return null;

  return (
    <>
      <style>{keyframesCSS}</style>
      <div style={backdropStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={modalStyle} role="dialog" aria-modal="true">
          <h2 style={titleStyle}>Publish Page</h2>

          {publishState === 'checking' && (
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 12 }}>
              Checking publish readiness...
            </p>
          )}

          {publishState !== 'checking' && checks && (
            <>
              {checks.errors.length > 0 && (
                <>
                  <p style={sectionTitleStyle}>Errors ({checks.errors.length})</p>
                  <ul style={listStyle}>
                    {checks.errors.map((error, i) => (
                      <li key={i} style={errorItemStyle}>{error}</li>
                    ))}
                  </ul>
                </>
              )}

              {checks.warnings.length > 0 && (
                <>
                  <p style={sectionTitleStyle}>Warnings ({checks.warnings.length})</p>
                  <ul style={listStyle}>
                    {checks.warnings.map((warning, i) => (
                      <li key={i} style={warningItemStyle}>{warning}</li>
                    ))}
                  </ul>
                </>
              )}

              {checks.errors.length === 0 && checks.warnings.length === 0 && publishState === 'ready' && (
                <p style={{ ...sectionTitleStyle, color: '#166534' }}>
                  All checks passed
                </p>
              )}
            </>
          )}

          {publishState === 'success' && publishedSlug && (
            <div style={successBoxStyle}>
              Published successfully!{' '}
              <a
                href={publishedSlug}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#123b63', fontWeight: 700, textDecoration: 'underline' }}
              >
                View at {publishedSlug}
              </a>
            </div>
          )}

          {publishState === 'error' && publishError && (
            <div style={{ ...errorItemStyle, marginTop: 12 }}>
              {publishError}
            </div>
          )}

          <div style={buttonRowStyle}>
            <button type="button" style={cancelButtonStyle} onClick={onClose}>
              {publishState === 'success' ? 'Close' : 'Cancel'}
            </button>
            {publishState !== 'success' && (
              <button
                type="button"
                style={publishButtonStyle(!!checks?.passed && publishState === 'ready')}
                disabled={!checks?.passed || publishState !== 'ready'}
                onClick={handlePublish}
              >
                {publishState === 'publishing' ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
