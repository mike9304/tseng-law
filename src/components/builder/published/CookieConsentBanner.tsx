'use client';

import { useEffect, useState } from 'react';
import type { BuilderCookieConsent } from '@/lib/builder/site/types';

interface ConsentDecision {
  version: string;
  acceptedAt: string;
  categories: Record<string, boolean>;
}

const STORAGE_PREFIX = 'tw_cookie_consent_v1';

function storageKey(version: string): string {
  return `${STORAGE_PREFIX}:${version}`;
}

function loadDecision(version: string): ConsentDecision | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey(version));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentDecision;
    if (!parsed || parsed.version !== version) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDecision(decision: ConsentDecision): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(decision.version), JSON.stringify(decision));
    window.dispatchEvent(
      new CustomEvent('builder-cookie-consent:decision', { detail: decision }),
    );
  } catch {
    /* ignore */
  }
}

function layoutBoxStyle(layout: BuilderCookieConsent['layout']): React.CSSProperties {
  if (layout === 'bar-top') {
    return { position: 'fixed', left: 0, right: 0, top: 0, zIndex: 9997 };
  }
  if (layout === 'modal-center') {
    return {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9997,
      padding: 16,
      background: 'rgba(0,0,0,0.5)',
    };
  }
  if (layout === 'card-corner') {
    return { position: 'fixed', right: 16, bottom: 16, zIndex: 9997, maxWidth: 380 };
  }
  return { position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9997 };
}

export default function CookieConsentBanner({ config }: { config: BuilderCookieConsent }) {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [categories, setCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of config.categories) {
      initial[cat.key] = cat.required || cat.defaultEnabled;
    }
    return initial;
  });

  useEffect(() => {
    if (!config.enabled) {
      setVisible(false);
      return;
    }
    const existing = loadDecision(config.version);
    if (!existing) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [config.enabled, config.version]);

  useEffect(() => {
    function handleOpen() {
      setVisible(true);
      setManaging(true);
    }
    window.addEventListener('builder-cookie-consent:open', handleOpen);
    return () => window.removeEventListener('builder-cookie-consent:open', handleOpen);
  }, []);

  if (!config.enabled || !visible) return null;

  function commit(decisionCats: Record<string, boolean>) {
    saveDecision({
      version: config.version,
      acceptedAt: new Date().toISOString(),
      categories: decisionCats,
    });
    setVisible(false);
    setManaging(false);
  }

  function handleAcceptAll() {
    const all: Record<string, boolean> = {};
    for (const cat of config.categories) all[cat.key] = true;
    commit(all);
  }

  function handleDeclineOptional() {
    const only: Record<string, boolean> = {};
    for (const cat of config.categories) only[cat.key] = cat.required;
    commit(only);
  }

  function handleSaveCustom() {
    const next: Record<string, boolean> = {};
    for (const cat of config.categories) {
      next[cat.key] = cat.required ? true : Boolean(categories[cat.key]);
    }
    commit(next);
  }

  const isModalLayout = config.layout === 'modal-center';

  return (
    <div
      data-builder-cookie-consent={config.layout}
      data-builder-cookie-managing={managing ? 'true' : 'false'}
      role="region"
      aria-label="cookie consent"
      style={layoutBoxStyle(config.layout)}
    >
      <div
        style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '18px 22px',
          borderTop: config.layout === 'bar-bottom' ? '1px solid #e2e8f0' : undefined,
          borderBottom: config.layout === 'bar-top' ? '1px solid #e2e8f0' : undefined,
          borderRadius: isModalLayout || config.layout === 'card-corner' ? 14 : 0,
          boxShadow: isModalLayout || config.layout === 'card-corner' ? '0 20px 60px rgba(0,0,0,0.18)' : undefined,
          maxWidth: isModalLayout ? 520 : undefined,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div>
          <strong style={{ display: 'block', fontSize: 14 }}>{config.title}</strong>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
            {config.description}
            {config.policyUrl ? (
              <>
                {' '}
                <a href={config.policyUrl} style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                  Policy
                </a>
              </>
            ) : null}
          </p>
        </div>

        {managing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {config.categories.map((cat) => (
              <label
                key={cat.key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '8px 10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  background: '#f8fafc',
                }}
              >
                <input
                  type="checkbox"
                  checked={cat.required ? true : Boolean(categories[cat.key])}
                  disabled={cat.required}
                  onChange={(event) =>
                    setCategories((prev) => ({ ...prev, [cat.key]: event.target.checked }))
                  }
                  style={{ marginTop: 3 }}
                />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <strong style={{ fontSize: 12 }}>
                    {cat.label}
                    {cat.required ? ' · 필수' : ''}
                  </strong>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{cat.description}</span>
                </span>
              </label>
            ))}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {!managing ? (
            <button
              type="button"
              onClick={() => setManaging(true)}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {config.manageLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleDeclineOptional}
            style={{
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            {config.declineLabel}
          </button>
          {managing ? (
            <button
              type="button"
              onClick={handleSaveCustom}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                border: '1px solid #0f172a',
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              저장
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAcceptAll}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                border: '1px solid #0f172a',
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {config.acceptLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
