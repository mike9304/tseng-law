'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

interface AssetListResponse {
  ok: boolean;
  assets?: BuilderAssetListItem[];
  error?: string;
}

interface AssetUploadResponse {
  ok: boolean;
  asset?: BuilderAssetListItem;
  error?: string;
}

function formatBytes(value: number) {
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function formatUploadedAt(value: string) {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export default function AssetLibraryModal({
  open,
  locale,
  selectedUrl = null,
  onClose,
  onSelect,
}: {
  open: boolean;
  locale: Locale;
  selectedUrl?: string | null;
  onClose: () => void;
  onSelect: (asset: BuilderAssetListItem) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [assets, setAssets] = useState<BuilderAssetListItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteFilename, setDeleteFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/builder/assets?locale=${locale}&limit=24`, {
        credentials: 'same-origin',
      });
      const payload = await response.json() as AssetListResponse;
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? 'Failed to load assets.');
        return;
      }
      setAssets(payload.assets ?? []);
    } catch {
      setError('Failed to load assets.');
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    void loadAssets();
  }, [loadAssets, open]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assets;
    return assets.filter((asset) => asset.filename.toLowerCase().includes(query));
  }, [assets, search]);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`/api/builder/assets?locale=${locale}`, {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });
      const payload = await response.json() as AssetUploadResponse;
      if (!response.ok || !payload.ok || !payload.asset) {
        setError(payload.error ?? 'Failed to upload asset.');
        return;
      }
      setAssets((currentAssets) => [
        payload.asset!,
        ...currentAssets.filter((asset) => asset.filename !== payload.asset!.filename),
      ]);
    } catch {
      setError('Failed to upload asset.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteAsset(asset: BuilderAssetListItem) {
    setDeleteFilename(asset.filename);
    setError(null);
    try {
      const response = await fetch(`/api/builder/assets?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locale,
          filename: asset.filename,
        }),
      });
      const payload = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? 'Failed to delete asset.');
        return;
      }
      setAssets((currentAssets) => currentAssets.filter((entry) => entry.filename !== asset.filename));
    } catch {
      setError('Failed to delete asset.');
    } finally {
      setDeleteFilename(null);
    }
  }

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-label="Asset library"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <div>
            <span className={styles.modalEyebrow}>Asset library</span>
            <strong>Select, upload, or remove builder images</strong>
          </div>
          <button type="button" className={styles.modalCloseButton} onClick={onClose}>
            Close
          </button>
        </header>

        <div className={styles.modalToolbar}>
          <label className={styles.modalSearchField}>
            <span>Search</span>
            <input
              className={styles.inspectorInput}
              type="search"
              value={search}
              placeholder="filename"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className={styles.modalToolbarActions}>
            <button
              type="button"
              className={styles.actionButton}
              disabled={isLoading}
              onClick={() => void loadAssets()}
            >
              Refresh
            </button>
            <button
              type="button"
              className={styles.actionButton}
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? 'Uploading…' : 'Upload image'}
            </button>
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = '';
                if (file) {
                  void uploadFile(file);
                }
              }}
            />
          </div>
        </div>

        <button
          type="button"
          className={styles.uploadDropZone}
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files?.[0];
            if (file) {
              void uploadFile(file);
            }
          }}
        >
          <strong>{isUploading ? 'Uploading image…' : 'Drop image here or click to upload'}</strong>
          <span>JPG, PNG, WEBP, GIF, AVIF · max 8 MB</span>
        </button>

        {error ? <p className={styles.modalError}>{error}</p> : null}
        {isLoading ? <p className={styles.modalHint}>Loading assets…</p> : null}
        {!isLoading && filteredAssets.length === 0 ? (
          <p className={styles.modalHint}>
            {assets.length === 0
              ? 'No builder images uploaded yet.'
              : 'No assets match the current search.'}
          </p>
        ) : null}

        <div className={styles.assetGrid}>
          {filteredAssets.map((asset) => {
            const active = selectedUrl === asset.url;
            return (
              <article
                key={asset.filename}
                className={`${styles.assetCard} ${active ? styles.assetCardActive : ''}`}
              >
                <div className={styles.assetPreview}>
                  <Image
                    src={asset.url}
                    alt={asset.filename}
                    fill
                    unoptimized
                    sizes="160px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.assetMeta}>
                  <strong>{asset.filename}</strong>
                  <span>{formatBytes(asset.size)} · {formatUploadedAt(asset.uploadedAt)}</span>
                </div>
                <div className={styles.assetActions}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                      onSelect(asset);
                      onClose();
                    }}
                  >
                    Use image
                  </button>
                  <button
                    type="button"
                    className={styles.assetDeleteButton}
                    disabled={deleteFilename === asset.filename}
                    onClick={() => void handleDeleteAsset(asset)}
                  >
                    {deleteFilename === asset.filename ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
