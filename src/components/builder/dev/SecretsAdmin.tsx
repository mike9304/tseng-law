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
import type { Locale } from '@/lib/locales';
import { getSecretsAdminCopy, type SecretsAdminCopy } from './secrets-copy';

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

interface SecretsAdminProps {
  locale: Locale;
}

export default function SecretsAdmin({ locale }: SecretsAdminProps) {
  const copy = getSecretsAdminCopy(locale);
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
      if (!response.ok) throw new Error(`${copy.loadFailureLabel} (HTTP ${response.status})`);
      const json = await response.json() as { ok: boolean; secrets?: SecretMetadata[]; error?: string };
      if (!json.ok) throw new Error(json.error ?? copy.unknownErrorLabel);
      setSecrets(json.secrets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.unknownErrorLabel);
    } finally {
      setLoading(false);
    }
  }, [copy.loadFailureLabel, copy.unknownErrorLabel]);

  useEffect(() => {
    void fetchSecrets();
  }, [fetchSecrets]);

  const handleCreated = useCallback((next: OneTimeReveal) => {
    setReveal(next);
    void fetchSecrets();
  }, [fetchSecrets]);

  const handleRotate = useCallback(async (secret: SecretMetadata) => {
    const next = window.prompt(copy.rotatePrompt(secret.key));
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
        throw new Error(json.error ?? `${copy.rowSaveFailure} (HTTP ${response.status})`);
      }
      setReveal({ secret: json.secret, plaintext: json.plaintext, kind: 'rotated' });
      void fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.unknownErrorLabel);
    } finally {
      setBusyId(null);
    }
  }, [copy, fetchSecrets]);

  const handleRevoke = useCallback(async (secret: SecretMetadata) => {
    if (!window.confirm(copy.revokeConfirm(secret.key))) return;
    setBusyId(secret.id);
    try {
      const response = await fetch(`${SECRETS_URL}/${secret.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const json = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? `${copy.rowSaveFailure} (HTTP ${response.status})`);
      }
      void fetchSecrets();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.unknownErrorLabel);
    } finally {
      setBusyId(null);
    }
  }, [copy, fetchSecrets]);

  return (
    <div data-builder-secrets-admin="true" style={PANEL_STYLE}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>{copy.adminTitle}</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>{copy.adminDescription}</p>
        </div>
        <button type="button" style={GHOST_BUTTON_STYLE} onClick={() => void fetchSecrets()}>
          {copy.refreshLabel}
        </button>
      </header>

      {error ? (
        <div role="alert" style={{ ...CARD_STYLE, borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
          {error}
        </div>
      ) : null}

      <SecretCreateForm copy={copy} onCreated={handleCreated} onError={setError} />

      <section style={CARD_STYLE} aria-labelledby="secrets-list-heading">
        <h2 id="secrets-list-heading" style={{ margin: 0, fontSize: 16 }}>{copy.listTitle(secrets.length)}</h2>
        {loading ? (
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{copy.loadingLabel}</p>
        ) : secrets.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{copy.emptyLabel}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '6px 8px' }}>{copy.keyHeader}</th>
                <th style={{ padding: '6px 8px' }}>{copy.scopeHeader}</th>
                <th style={{ padding: '6px 8px' }}>{copy.allowedFunctionsHeader}</th>
                <th style={{ padding: '6px 8px' }}>{copy.rotatedHeader}</th>
                <th style={{ padding: '6px 8px' }}>{copy.actionsHeader}</th>
              </tr>
            </thead>
            <tbody>
              {secrets.map((secret) => (
                <tr key={secret.id} style={{ borderTop: '1px solid #e2e8f0' }} data-secret-id={secret.id}>
                  <td style={{ padding: '8px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{secret.key}</td>
                  <td style={{ padding: '8px' }}>{secret.scope === 'site' ? copy.scopeSiteLabel : copy.scopeFunctionLabel}</td>
                  <td style={{ padding: '8px', color: '#475569' }}>
                    {secret.scope === 'function' ? (secret.allowedFunctions?.join(', ') ?? copy.rowAllowedFunctionsUnknown) : copy.rowAllowedFunctionsEmpty}
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
                      {copy.rotateButtonLabel}
                    </button>
                    <button
                      type="button"
                      style={DANGER_BUTTON_STYLE}
                      disabled={busyId === secret.id}
                      onClick={() => void handleRevoke(secret)}
                    >
                      {copy.revokeButtonLabel}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {reveal ? (
        <OneTimeRevealModal copy={copy} reveal={reveal} onDismiss={() => setReveal(null)} />
      ) : null}
    </div>
  );
}

interface CreateFormProps {
  copy: SecretsAdminCopy;
  onCreated: (reveal: OneTimeReveal) => void;
  onError: (message: string) => void;
}

function SecretCreateForm({ copy, onCreated, onError }: CreateFormProps) {
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
      onError(copy.createValidationLabel);
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
      onError(err instanceof Error ? err.message : copy.rowSaveFailure);
    } finally {
      setSubmitting(false);
    }
  }, [
    allowedList,
    copy.createValidationLabel,
    copy.rowSaveFailure,
    key,
    onCreated,
    onError,
    scope,
    value,
  ]);

  return (
    <form onSubmit={handleSubmit} style={CARD_STYLE} data-builder-secrets-create-form="true">
      <h2 style={{ margin: 0, fontSize: 16 }}>{copy.createTitle}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{copy.keyLabel}</span>
          <input
            value={key}
            onChange={(event) => setKey(event.target.value.toUpperCase())}
            placeholder={copy.keyPlaceholder}
            required
            style={INPUT_STYLE}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{copy.scopeLabel}</span>
          <select
            value={scope}
            onChange={(event) => setScope(event.target.value as SecretScope)}
            style={INPUT_STYLE}
          >
            <option value="site">{copy.scopeSiteLabel}</option>
            <option value="function">{copy.scopeFunctionLabel}</option>
          </select>
        </label>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{copy.valueLabel}</span>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
          placeholder={copy.valuePlaceholder}
          style={{ ...INPUT_STYLE, minHeight: 80, fontFamily: 'ui-monospace, Menlo, monospace' }}
        />
      </label>
      {scope === 'function' ? (
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{copy.allowedFunctionsLabel}</span>
          <input
            value={allowedFunctions}
            onChange={(event) => setAllowedFunctions(event.target.value)}
            placeholder={copy.allowedFunctionsPlaceholder}
            style={INPUT_STYLE}
          />
        </label>
      ) : null}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" style={BUTTON_STYLE} disabled={submitting}>
          {submitting ? copy.creatingButtonLabel : copy.createButtonLabel}
        </button>
      </div>
    </form>
  );
}

function OneTimeRevealModal({ copy, reveal, onDismiss }: { copy: SecretsAdminCopy; reveal: OneTimeReveal; onDismiss: () => void }) {
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
          {reveal.kind === 'created' ? copy.revealTitleCreated : copy.revealTitleRotated}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
          {copy.revealDescription}
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
            {copy.copyLabel}
          </button>
          <button type="button" style={BUTTON_STYLE} onClick={onDismiss}>
            {copy.closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
