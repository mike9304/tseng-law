'use client';

import { useMemo, useState, type FormEvent } from 'react';
import type { Locale } from '@/lib/locales';
import type { SiteRedirect, SiteRedirectStatus } from '@/lib/builder/site/types';

const STATUS_OPTIONS: SiteRedirectStatus[] = [301, 302, 307, 308];

type RedirectDraft = {
  from: string;
  to: string;
  type: SiteRedirectStatus;
  isActive: boolean;
  note: string;
};

type RedirectApiResponse = {
  ok?: boolean;
  redirect?: SiteRedirect;
  error?: string;
  field?: string;
};

function draftFromRedirect(redirect: SiteRedirect): RedirectDraft {
  return {
    from: redirect.from,
    to: redirect.to,
    type: redirect.type,
    isActive: redirect.isActive,
    note: redirect.note ?? '',
  };
}

function emptyDraft(): RedirectDraft {
  return {
    from: '',
    to: '',
    type: 301,
    isActive: true,
    note: '',
  };
}

export default function RedirectsListView({
  locale,
  initialRedirects,
}: {
  locale: Locale;
  initialRedirects: SiteRedirect[];
}) {
  const [redirects, setRedirects] = useState<SiteRedirect[]>(initialRedirects);
  const [drafts, setDrafts] = useState<Record<string, RedirectDraft>>(() =>
    Object.fromEntries(initialRedirects.map((redirect) => [redirect.redirectId, draftFromRedirect(redirect)])),
  );
  const [newDraft, setNewDraft] = useState<RedirectDraft>(emptyDraft);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeCount = useMemo(() => redirects.filter((redirect) => redirect.isActive).length, [redirects]);

  function apiUrl(id?: string): string {
    const base = id
      ? `/api/builder/site/redirects/${encodeURIComponent(id)}`
      : '/api/builder/site/redirects';
    return `${base}?locale=${encodeURIComponent(locale)}`;
  }

  function setDraftValue(id: string, patch: Partial<RedirectDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setBusyId('new');
    try {
      const response = await fetch(apiUrl(), {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDraft,
          note: newDraft.note.trim() || undefined,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as RedirectApiResponse;
      if (!response.ok || !payload.ok || !payload.redirect) {
        throw new Error(payload.error || 'Failed to create redirect');
      }
      setRedirects((current) => [payload.redirect!, ...current]);
      setDrafts((current) => ({
        ...current,
        [payload.redirect!.redirectId]: draftFromRedirect(payload.redirect!),
      }));
      setNewDraft(emptyDraft());
      setMessage('Redirect rule created.');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create redirect');
    } finally {
      setBusyId(null);
    }
  }

  async function handleSave(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    setError(null);
    setMessage(null);
    setBusyId(id);
    try {
      const response = await fetch(apiUrl(id), {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          note: draft.note.trim() || undefined,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as RedirectApiResponse;
      if (!response.ok || !payload.ok || !payload.redirect) {
        throw new Error(payload.error || 'Failed to update redirect');
      }
      setRedirects((current) =>
        current.map((redirect) => (redirect.redirectId === id ? payload.redirect! : redirect)),
      );
      setDrafts((current) => ({
        ...current,
        [id]: draftFromRedirect(payload.redirect!),
      }));
      setMessage('Redirect rule saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update redirect');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this redirect rule?')) return;
    setError(null);
    setMessage(null);
    setBusyId(id);
    try {
      const response = await fetch(apiUrl(id), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const payload = (await response.json().catch(() => ({}))) as RedirectApiResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Failed to delete redirect');
      }
      setRedirects((current) => current.filter((redirect) => redirect.redirectId !== id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setMessage('Redirect rule deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete redirect');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f6f8fb', color: '#172033', padding: 28 }}>
      <section style={{ margin: '0 auto', maxWidth: 1180 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 22 }}>
          <div>
            <p style={{ color: '#64748b', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', margin: '0 0 7px', textTransform: 'uppercase' }}>
              SEO redirects
            </p>
            <h1 style={{ fontSize: 30, lineHeight: 1.15, margin: 0 }}>Redirect Rules</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '8px 0 0' }}>
              {redirects.length} rules, {activeCount} active for {locale}
            </p>
          </div>
        </header>

        <form
          onSubmit={handleCreate}
          style={{
            background: '#fff',
            border: '1px solid #dbe3ef',
            borderRadius: 8,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'minmax(180px, 1fr) minmax(180px, 1fr) 110px 120px',
            marginBottom: 16,
            padding: 16,
          }}
        >
          <input
            aria-label="Source path"
            placeholder="/old-path"
            value={newDraft.from}
            onChange={(event) => setNewDraft((current) => ({ ...current, from: event.target.value }))}
            style={inputStyle}
          />
          <input
            aria-label="Destination path"
            placeholder="/new-path"
            value={newDraft.to}
            onChange={(event) => setNewDraft((current) => ({ ...current, to: event.target.value }))}
            style={inputStyle}
          />
          <select
            aria-label="Redirect status"
            value={newDraft.type}
            onChange={(event) =>
              setNewDraft((current) => ({ ...current, type: Number(event.target.value) as SiteRedirectStatus }))
            }
            style={inputStyle}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button type="submit" disabled={busyId === 'new'} style={primaryButtonStyle}>
            Add rule
          </button>
          <input
            aria-label="Note"
            placeholder="Optional note"
            value={newDraft.note}
            onChange={(event) => setNewDraft((current) => ({ ...current, note: event.target.value }))}
            style={{ ...inputStyle, gridColumn: '1 / -1' }}
          />
        </form>

        {error ? <div style={errorStyle}>{error}</div> : null}
        {message ? <div style={messageStyle}>{message}</div> : null}

        <div style={{ background: '#fff', border: '1px solid #dbe3ef', borderRadius: 8, overflow: 'hidden' }}>
          {redirects.length === 0 ? (
            <div style={{ color: '#64748b', padding: 28, textAlign: 'center' }}>No redirect rules yet.</div>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#eef3f9', color: '#475569', fontSize: 12, textAlign: 'left' }}>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>To</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Active</th>
                  <th style={thStyle}>Note</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((redirect) => {
                  const draft = drafts[redirect.redirectId] ?? draftFromRedirect(redirect);
                  const disabled = busyId === redirect.redirectId;
                  return (
                    <tr key={redirect.redirectId} style={{ borderTop: '1px solid #e5ebf3' }}>
                      <td style={tdStyle}>
                        <input
                          aria-label={`Source path for ${redirect.redirectId}`}
                          value={draft.from}
                          disabled={disabled}
                          onChange={(event) => setDraftValue(redirect.redirectId, { from: event.target.value })}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          aria-label={`Destination path for ${redirect.redirectId}`}
                          value={draft.to}
                          disabled={disabled}
                          onChange={(event) => setDraftValue(redirect.redirectId, { to: event.target.value })}
                          style={inputStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <select
                          aria-label={`Status for ${redirect.redirectId}`}
                          value={draft.type}
                          disabled={disabled}
                          onChange={(event) =>
                            setDraftValue(redirect.redirectId, {
                              type: Number(event.target.value) as SiteRedirectStatus,
                            })
                          }
                          style={inputStyle}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <label style={{ alignItems: 'center', display: 'flex', gap: 8, fontSize: 13 }}>
                          <input
                            type="checkbox"
                            checked={draft.isActive}
                            disabled={disabled}
                            onChange={(event) => setDraftValue(redirect.redirectId, { isActive: event.target.checked })}
                          />
                          Enabled
                        </label>
                      </td>
                      <td style={tdStyle}>
                        <input
                          aria-label={`Note for ${redirect.redirectId}`}
                          value={draft.note}
                          disabled={disabled}
                          onChange={(event) => setDraftValue(redirect.redirectId, { note: event.target.value })}
                          style={inputStyle}
                        />
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleSave(redirect.redirectId)}
                          style={secondaryButtonStyle}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleDelete(redirect.redirectId)}
                          style={dangerButtonStyle}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  border: '1px solid #cdd6e4',
  borderRadius: 8,
  color: '#172033',
  font: 'inherit',
  minHeight: 38,
  padding: '8px 10px',
  width: '100%',
};

const primaryButtonStyle = {
  background: '#176bff',
  border: 0,
  borderRadius: 8,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 800,
  minHeight: 38,
  padding: '0 15px',
};

const secondaryButtonStyle = {
  background: '#172033',
  border: 0,
  borderRadius: 8,
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 800,
  marginRight: 8,
  minHeight: 34,
  padding: '0 12px',
};

const dangerButtonStyle = {
  background: '#fff',
  border: '1px solid #fecaca',
  borderRadius: 8,
  color: '#b91c1c',
  cursor: 'pointer',
  fontWeight: 800,
  minHeight: 34,
  padding: '0 12px',
};

const thStyle = {
  padding: '11px 12px',
};

const tdStyle = {
  padding: 12,
  verticalAlign: 'top',
};

const errorStyle = {
  background: '#fee2e2',
  border: '1px solid #fecaca',
  borderRadius: 8,
  color: '#991b1b',
  fontSize: 14,
  marginBottom: 12,
  padding: 12,
};

const messageStyle = {
  background: '#dcfce7',
  border: '1px solid #bbf7d0',
  borderRadius: 8,
  color: '#166534',
  fontSize: 14,
  marginBottom: 12,
  padding: 12,
};
