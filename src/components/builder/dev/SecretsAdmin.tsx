'use client';

/**
 * F112 — Secrets admin panel.
 *
 * - GET /api/builder/dev/secrets → metadata list.
 * - POST → create, ONE-TIME plaintext returned in `lastReveal` state.
 * - PATCH → rotate, ONE-TIME plaintext returned.
 * - DELETE → revoke.
 *
 * Plaintext is only ever shown in the `lastReveal` modal immediately
 * after create or rotate. Dismissing the modal clears the state so a
 * reload or remount cannot resurface it.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

type SecretScope = 'site' | 'function';

interface SecretMetadata {
  id: string;
  key: string;
  scope: SecretScope;
  allowedFunctions?: string[];
  lastRotatedAt: string;
  createdAt: string;
  addedBy: string;
}

interface OneTimeReveal {
  secret: SecretMetadata;
  plaintext: string;
  kind: 'created' | 'rotated';
}

const SECRETS_URL = '/api/builder/dev/secrets';

const PANEL_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  maxWidth: 1100,
  margin: '0 auto',
  color: '#0f172a',
};

const CARD_STYLE: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const BUTTON_STYLE: React.CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  background: '#2563eb',
  color: '#ffffff',
};

const GHOST_BUTTON_STYLE: React.CSSProperties = {
  ...BUTTON_STYLE,
  background: 'transparent',
  color: '#0f172a',
  border: '1px solid #cbd5e1',
};

const DANGER_BUTTON_STYLE: React.CSSProperties = {
  ...BUTTON_STYLE,
  background: '#dc2626',
};

const INPUT_STYLE: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  fontSize: 13,
  width: '100%',
  boxSizing: 'border-box',
};

export default function SecretsAdmin() {
  const [secrets, setSecrets] = useState<SecretMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reveal, setReveal] = useState<OneTimeReveal | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchSecrets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SECRETS_URL, { credentials: 'include' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json() as { ok: boolean; secrets?: SecretMetadata[]; error?: string };
      if (!json.ok) throw new Error(json.error ?? 'unknown_error');
      setSecrets(json.secrets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown_error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSecrets();
  }, [fetchSecrets]);

  const handleCreated = useCallback((next: OneTimeReveal) => {
    setReveal(next);
    void fetchSecrets();
  }, [fetchSecrets]);

  const handleRotate = useCallback(async (secret: SecretMetadata) => {
    const next = window.prompt(`Rotate ${secret.key} — enter new value:`);
    if (!next) return;
    setBusyId(secret.id);
    try {
      const response = await fetch(`${SECRETS_URL}/${secret.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: next }),
      });
      const json = await response.json() as { ok: boolean; secret?: SecretMetadata; plaintext?: string; error?: string };
      if (!response.ok || !json.ok || !json.secret || !json.plaintext) {
        throw new Error(json.error ?? `HTTP ${response.status}`);
      }
      setReveal({ secret: json.secret, plaintext: json.plaintext, kind: 'rotated' });
      void fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown_error');
    } finally {
      setBusyId(null);
    }
  }, [fetchSecrets]);

  const handleRevoke = useCallback(async (secret: SecretMetadata) => {
    if (!window.confirm(`Revoke ${secret.key}? This cannot be undone.`)) return;
    setBusyId(secret.id);
    try {
      const response = await fetch(`${SECRETS_URL}/${secret.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const json = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? `HTTP ${response.status}`);
      }
      void fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown_error');
    } finally {
      setBusyId(null);
    }
  }, [fetchSecrets]);

  return (
    <div data-builder-secrets-admin="true" style={PANEL_STYLE}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Secrets</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>
            서버리스 함수에 안전하게 노출할 수 있는 암호화된 환경 변수입니다.
            플레인텍스트는 생성·교체 시 단 1회만 표시됩니다.
          </p>
        </div>
        <button type="button" style={GHOST_BUTTON_STYLE} onClick={() => void fetchSecrets()}>
          새로고침
        </button>
      </header>

      {error ? (
        <div role="alert" style={{ ...CARD_STYLE, borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
          {error}
        </div>
      ) : null}

      <SecretCreateForm onCreated={handleCreated} onError={setError} />

      <section style={CARD_STYLE} aria-labelledby="secrets-list-heading">
        <h2 id="secrets-list-heading" style={{ margin: 0, fontSize: 16 }}>저장된 시크릿 ({secrets.length})</h2>
        {loading ? (
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>불러오는 중…</p>
        ) : secrets.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>아직 등록된 시크릿이 없습니다.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '6px 8px' }}>Key</th>
                <th style={{ padding: '6px 8px' }}>Scope</th>
                <th style={{ padding: '6px 8px' }}>Allowed functions</th>
                <th style={{ padding: '6px 8px' }}>Rotated</th>
                <th style={{ padding: '6px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {secrets.map((secret) => (
                <tr key={secret.id} style={{ borderTop: '1px solid #e2e8f0' }} data-secret-id={secret.id}>
                  <td style={{ padding: '8px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{secret.key}</td>
                  <td style={{ padding: '8px' }}>{secret.scope}</td>
                  <td style={{ padding: '8px', color: '#475569' }}>
                    {secret.scope === 'function' ? (secret.allowedFunctions?.join(', ') ?? '—') : '—'}
                  </td>
                  <td style={{ padding: '8px', color: '#475569' }}>
                    {new Date(secret.lastRotatedAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '8px', display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      style={GHOST_BUTTON_STYLE}
                      disabled={busyId === secret.id}
                      onClick={() => void handleRotate(secret)}
                    >
                      교체
                    </button>
                    <button
                      type="button"
                      style={DANGER_BUTTON_STYLE}
                      disabled={busyId === secret.id}
                      onClick={() => void handleRevoke(secret)}
                    >
                      취소
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {reveal ? (
        <OneTimeRevealModal reveal={reveal} onDismiss={() => setReveal(null)} />
      ) : null}
    </div>
  );
}

interface CreateFormProps {
  onCreated: (reveal: OneTimeReveal) => void;
  onError: (message: string) => void;
}

function SecretCreateForm({ onCreated, onError }: CreateFormProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [scope, setScope] = useState<SecretScope>('site');
  const [allowedFunctions, setAllowedFunctions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allowedList = useMemo(() => allowedFunctions
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean), [allowedFunctions]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!key.trim() || !value) {
      onError('Key와 value 모두 필요합니다.');
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { key: key.trim(), value, scope };
      if (scope === 'function') body.allowedFunctions = allowedList;
      const response = await fetch(SECRETS_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const json = await response.json() as { ok: boolean; secret?: SecretMetadata; plaintext?: string; error?: string };
      if (!response.ok || !json.ok || !json.secret || !json.plaintext) {
        throw new Error(json.error ?? `HTTP ${response.status}`);
      }
      onCreated({ secret: json.secret, plaintext: json.plaintext, kind: 'created' });
      setKey('');
      setValue('');
      setAllowedFunctions('');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'unknown_error');
    } finally {
      setSubmitting(false);
    }
  }, [allowedList, key, onCreated, onError, scope, value]);

  return (
    <form onSubmit={handleSubmit} style={CARD_STYLE} data-builder-secrets-create-form="true">
      <h2 style={{ margin: 0, fontSize: 16 }}>새 시크릿 추가</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Key</span>
          <input
            value={key}
            onChange={(event) => setKey(event.target.value.toUpperCase())}
            placeholder="STRIPE_API_KEY"
            required
            style={INPUT_STYLE}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Scope</span>
          <select
            value={scope}
            onChange={(event) => setScope(event.target.value as SecretScope)}
            style={INPUT_STYLE}
          >
            <option value="site">Site (모든 함수 읽기)</option>
            <option value="function">Function (지정된 함수만)</option>
          </select>
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>Value (저장 직후 1회만 표시됩니다)</span>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
          style={{ ...INPUT_STYLE, minHeight: 80, fontFamily: 'ui-monospace, Menlo, monospace' }}
        />
      </label>
      {scope === 'function' ? (
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>허용 함수 slug (쉼표 구분)</span>
          <input
            value={allowedFunctions}
            onChange={(event) => setAllowedFunctions(event.target.value)}
            placeholder="ai-helper, billing-webhook"
            style={INPUT_STYLE}
          />
        </label>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" style={BUTTON_STYLE} disabled={submitting}>
          {submitting ? '저장 중…' : '시크릿 추가'}
        </button>
      </div>
    </form>
  );
}

function OneTimeRevealModal({ reveal, onDismiss }: { reveal: OneTimeReveal; onDismiss: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
      data-builder-secrets-reveal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11000,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{ ...CARD_STYLE, maxWidth: 520, width: '100%', gap: 14 }}>
        <h2 id="reveal-title" style={{ margin: 0, fontSize: 18 }}>
          {reveal.kind === 'created' ? '시크릿이 생성되었습니다' : '시크릿이 교체되었습니다'}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
          아래 값을 안전한 곳에 즉시 복사하세요. 이 창을 닫으면 다시 볼 수 없습니다.
        </p>
        <code
          style={{
            display: 'block',
            padding: 12,
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: 8,
            wordBreak: 'break-all',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 13,
          }}
          data-builder-secrets-plaintext="true"
        >
          {reveal.plaintext}
        </code>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            style={GHOST_BUTTON_STYLE}
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                void navigator.clipboard.writeText(reveal.plaintext);
              }
            }}
          >
            클립보드로 복사
          </button>
          <button type="button" style={BUTTON_STYLE} onClick={onDismiss}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}