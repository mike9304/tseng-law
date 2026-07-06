'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import type { SiteRedirect, SiteRedirectStatus } from '@/lib/builder/site/types';
import { getRedirectManagerCopy, type RedirectManagerCopy } from './redirect-manager-copy';

const STATUS_OPTIONS: SiteRedirectStatus[] = [301, 302, 307, 308];

type RedirectDraft = {
  from: string;
  to: string;
  type: SiteRedirectStatus;
  isActive: boolean;
  note: string;
};

type RedirectApiDiagnostic = {
  code?: string;
  conflictingFrom?: string;
  conflictingRedirectId?: string;
};

type RedirectApiResponse = {
  ok?: boolean;
  redirect?: SiteRedirect;
  error?: string;
  field?: string;
  diagnostic?: RedirectApiDiagnostic;
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

function redirectFailureMessage(
  payload: RedirectApiResponse,
  fallback: string,
  copy: RedirectManagerCopy,
): string {
  if (payload.diagnostic?.code === 'wildcard-overlap' && payload.diagnostic.conflictingFrom) {
    return copy.wildcardOverlapError.replace('{from}', payload.diagnostic.conflictingFrom);
  }
  return payload.error || fallback;
}

export default function RedirectsListView({
  locale,
  initialRedirects,
}: {
  locale: Locale;
  initialRedirects: SiteRedirect[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = getRedirectManagerCopy(locale);
  const [redirects, setRedirects] = useState<SiteRedirect[]>(initialRedirects);
  const [drafts, setDrafts] = useState<Record<string, RedirectDraft>>(() =>
    Object.fromEntries(initialRedirects.map((redirect) => [redirect.redirectId, draftFromRedirect(redirect)])),
  );
  const [newDraft, setNewDraft] = useState<RedirectDraft>(emptyDraft);
  const [query, setQuery] = useState(() => searchParams.get('q')?.trim() ?? '');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeCount = useMemo(() => redirects.filter((redirect) => redirect.isActive).length, [redirects]);
  const filteredRedirects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return redirects;
    return redirects.filter((redirect) => {
      const kind = redirect.from.endsWith('/*') ? 'wildcard suffix-preserving' : 'exact';
      return [
        redirect.from,
        redirect.to,
        redirect.note ?? '',
        kind,
        redirect.isActive ? copy.activeSearchTokens[0] : `inactive ${copy.activeSearchTokens[0]}`,
        redirect.from.endsWith('/*') ? copy.wildcardSearchTokens[0] : copy.exactLabel.toLowerCase(),
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [copy.activeSearchTokens, copy.exactLabel, copy.wildcardSearchTokens, query, redirects]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) {
      params.set('q', trimmed);
    } else {
      params.delete('q');
    }
    const nextHref = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    if (params.toString() !== searchParams.toString()) {
      router.replace(nextHref, { scroll: false });
    }
  }, [pathname, query, router, searchParams]);

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
        throw new Error(redirectFailureMessage(payload, copy.addError, copy));
      }
      setRedirects((current) => [payload.redirect!, ...current]);
      setDrafts((current) => ({
        ...current,
        [payload.redirect!.redirectId]: draftFromRedirect(payload.redirect!),
      }));
      setNewDraft(emptyDraft());
      setMessage(copy.addSuccess);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : copy.addError);
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
        throw new Error(redirectFailureMessage(payload, copy.saveError, copy));
      }
      setRedirects((current) =>
        current.map((redirect) => (redirect.redirectId === id ? payload.redirect! : redirect)),
      );
      setDrafts((current) => ({
        ...current,
        [id]: draftFromRedirect(payload.redirect!),
      }));
      setMessage(copy.saveSuccess);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : copy.saveError);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(`${copy.deleteConfirmPrefix} ${copy.ruleLabel}?`)) return;
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
        throw new Error(payload.error || copy.deleteError);
      }
      setRedirects((current) => current.filter((redirect) => redirect.redirectId !== id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setMessage(copy.deleteSuccess);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : copy.deleteError);
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
              {copy.sectionLabel}
            </p>
            <h1 style={{ fontSize: 30, lineHeight: 1.15, margin: 0 }}>{copy.heading}</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '8px 0 0' }}>
              {copy.description
                .replace('{visible}', String(filteredRedirects.length))
                .replace('{total}', String(redirects.length))
                .replace('{active}', String(activeCount))
                .replace('{locale}', locale)}
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
            aria-label={copy.sourceLabel}
            placeholder={copy.sourcePlaceholder}
            value={newDraft.from}
            onChange={(event) => setNewDraft((current) => ({ ...current, from: event.target.value }))}
            style={inputStyle}
          />
          <input
            aria-label={copy.destinationLabel}
            placeholder={copy.destinationPlaceholder}
            value={newDraft.to}
            onChange={(event) => setNewDraft((current) => ({ ...current, to: event.target.value }))}
            style={inputStyle}
          />
          <select
            aria-label={copy.statusLabel}
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
            {copy.createButton}
          </button>
          <input
            aria-label={copy.noteLabel}
            placeholder={copy.notePlaceholder}
            value={newDraft.note}
            onChange={(event) => setNewDraft((current) => ({ ...current, note: event.target.value }))}
            style={{ ...inputStyle, gridColumn: '1 / -1' }}
          />
          <p style={{ color: '#64748b', fontSize: 12, gridColumn: '1 / -1', margin: 0 }}>
            <span dangerouslySetInnerHTML={{ __html: copy.helper }} />
          </p>
        </form>

        <form
          onSubmit={(event) => event.preventDefault()}
          style={{
            background: '#fff',
            border: '1px solid #dbe3ef',
            borderRadius: 8,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'minmax(240px, 1fr) auto',
            marginBottom: 16,
            padding: 16,
          }}
        >
          <input
            aria-label={copy.searchPlaceholder}
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={inputStyle}
          />
          {query.trim() ? (
              <button
              type="button"
              onClick={() => setQuery('')}
              style={secondaryButtonStyle}
            >
              {copy.clearSearch}
            </button>
          ) : (
            <div />
          )}
        </form>

        {error ? <div style={errorStyle}>{error}</div> : null}
        {message ? <div style={messageStyle}>{message}</div> : null}

        <div style={{ background: '#fff', border: '1px solid #dbe3ef', borderRadius: 8, overflow: 'hidden' }}>
          {redirects.length === 0 ? (
            <div style={{ color: '#64748b', padding: 28, textAlign: 'center' }}>{copy.emptyState}</div>
          ) : filteredRedirects.length === 0 ? (
            <div style={{ color: '#64748b', padding: 28, textAlign: 'center' }}>{copy.emptyFilteredState}</div>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#eef3f9', color: '#475569', fontSize: 12, textAlign: 'left' }}>
                  <th style={thStyle}>{copy.fromColumn}</th>
                  <th style={thStyle}>{copy.toColumn}</th>
                  <th style={thStyle}>{copy.kindColumn}</th>
                  <th style={thStyle}>{copy.statusColumn}</th>
                  <th style={thStyle}>{copy.activeColumn}</th>
                  <th style={thStyle}>{copy.noteColumn}</th>
                  <th style={thStyle}>{copy.actionsColumn}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRedirects.map((redirect) => {
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
                      <td style={{ ...tdStyle, fontSize: 13 }}>
                        {redirect.from.endsWith('/*') ? (
                          <div style={{ display: 'grid', gap: 4 }}>
                            <span style={wildcardPillStyle}>{copy.wildcardLabel}</span>
                            <span style={{ color: '#64748b' }}>{copy.wildcardDescription}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>{copy.exactLabel}</span>
                        )}
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
                          {copy.enabledLabel}
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
                          {copy.saveButton}
                        </button>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleDelete(redirect.redirectId)}
                          style={dangerButtonStyle}
                        >
                          {copy.deleteButton}
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

const wildcardPillStyle = {
  alignSelf: 'start',
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: 999,
  color: '#334155',
  display: 'inline-flex',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.04em',
  padding: '3px 8px',
  textTransform: 'uppercase',
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
