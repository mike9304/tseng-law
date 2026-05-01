'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BuilderLightbox } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function LightboxListView({
  locale,
  initialLightboxes,
}: {
  locale: Locale;
  initialLightboxes: BuilderLightbox[];
}) {
  const [lightboxes, setLightboxes] = useState<BuilderLightbox[]>(initialLightboxes);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedSlug = slug.trim();
    const trimmedName = name.trim() || 'Untitled lightbox';
    if (!trimmedSlug || !SLUG_RE.test(trimmedSlug)) {
      setError('Slug must be lowercase alphanumeric with hyphens');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/site/lightboxes?locale=${locale}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: trimmedSlug, name: trimmedName, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; lightbox?: BuilderLightbox; error?: string };
      if (!res.ok || !data.ok || !data.lightbox) {
        setError(data.error ?? 'Failed to create lightbox');
        return;
      }
      setLightboxes((prev) => [...prev, data.lightbox!]);
      setName('');
      setSlug('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this lightbox?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/site/lightboxes/${id}?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        setLightboxes((prev) => prev.filter((lb) => lb.id !== id));
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? 'Failed to delete');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleRename(id: string, currentName: string) {
    const next = window.prompt('New name', currentName);
    if (!next || next.trim() === currentName) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/site/lightboxes/${id}?locale=${locale}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: next.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; lightbox?: BuilderLightbox; error?: string };
      if (data.ok && data.lightbox) {
        setLightboxes((prev) => prev.map((lb) => (lb.id === id ? data.lightbox! : lb)));
      } else {
        setError(data.error ?? 'Failed to rename');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 880, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Lightboxes ({locale})</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        Trigger from a button via <code>href: lightbox:&lt;slug&gt;</code>.
      </p>

      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          padding: 16,
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
          }}
        />
        <input
          type="text"
          placeholder="Slug (e.g. contact-form)"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          disabled={busy}
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
          }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '8px 16px',
            background: '#0b3b2e',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: busy ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          + New lightbox
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: 12,
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {lightboxes.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          No lightboxes yet. Create one above.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {lightboxes.map((lb) => (
            <li
              key={lb.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{lb.name}</div>
                <div style={{ color: '#64748b', fontSize: 13, fontFamily: 'monospace' }}>
                  lightbox:{lb.slug}
                </div>
              </div>
              <Link
                href={`/${locale}/admin-builder/lightboxes/${lb.id}/edit`}
                style={{
                  padding: '6px 12px',
                  background: '#0b3b2e',
                  color: '#fff',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleRename(lb.id, lb.name)}
                disabled={busy}
                style={{
                  padding: '6px 12px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => handleDelete(lb.id)}
                disabled={busy}
                style={{
                  padding: '6px 12px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
