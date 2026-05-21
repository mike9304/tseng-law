'use client';

import { useRef, useState } from 'react';
import type { SharedAssetListItem } from '@/lib/builder/workspace/shared-assets';

interface SharedAssetsPanelProps {
  initialAssets: SharedAssetListItem[];
}

const buttonStyle: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  background: '#0f172a',
  color: '#fff',
  border: 'none',
  fontSize: 13,
  cursor: 'pointer',
};

export default function SharedAssetsPanel({ initialAssets }: SharedAssetsPanelProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/builder/workspace/assets', {
        method: 'POST',
        body: formData,
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? 'Upload failed.');
      setAssets((prev) => [
        { ...payload.asset, pathname: `workspace/assets/${payload.asset.filename}` },
        ...prev,
      ]);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(filename: string) {
    setError(null);
    try {
      const res = await fetch(`/api/builder/workspace/assets/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? 'Delete failed.');
      setAssets((prev) => prev.filter((asset) => asset.filename !== filename));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div data-shared-assets-panel style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 16,
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={busy}
          data-shared-assets-upload
          aria-label="Upload shared asset"
        />
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {busy ? 'Uploading…' : 'JPG / PNG / WEBP / GIF / AVIF / SVG, up to 10MB.'}
        </span>
      </div>
      {error ? (
        <p role="alert" style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>
      ) : null}

      <ul
        data-shared-assets-list
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {assets.length === 0 ? (
          <li style={{ color: '#64748b', fontSize: 13 }}>No shared assets yet.</li>
        ) : null}
        {assets.map((asset) => (
          <li
            key={asset.filename}
            data-shared-asset={asset.filename}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: 10,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={asset.filename}
              style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }}
            />
            <div style={{ fontSize: 12, color: '#475569', wordBreak: 'break-all' }}>
              {asset.filename}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(asset.filename)}
              style={{
                ...buttonStyle,
                background: '#fff',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                padding: '6px 10px',
                fontSize: 12,
              }}
              data-shared-asset-delete={asset.filename}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}