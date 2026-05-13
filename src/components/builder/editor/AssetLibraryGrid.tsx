'use client';

import Image from 'next/image';
import type { BuilderAssetFolder, BuilderAssetListItem } from '@/lib/builder/assets';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

interface AssetLibraryGridProps {
  assets: BuilderAssetListItem[];
  selectedUrl?: string | null;
  folders: BuilderAssetFolder[];
  tags: string[];
  assetFolderByFilename: Record<string, string>;
  assetTagsByFilename: Record<string, string[]>;
  deleteFilename: string | null;
  onSelectAsset: (asset: BuilderAssetListItem) => void;
  onDeleteAsset: (asset: BuilderAssetListItem) => void;
  onChangeAssetFolder: (filename: string, folderId: string) => void;
  onToggleAssetTag: (filename: string, tag: string) => void;
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

export function AssetLibraryGrid({
  assets,
  selectedUrl,
  folders,
  tags,
  assetFolderByFilename,
  assetTagsByFilename,
  deleteFilename,
  onSelectAsset,
  onDeleteAsset,
  onChangeAssetFolder,
  onToggleAssetTag,
}: AssetLibraryGridProps) {
  return (
    <div className={styles.assetGrid}>
      {assets.map((asset) => {
        const active = selectedUrl === asset.url;
        const assetFolder = assetFolderByFilename[asset.filename] ?? 'uploads';
        const assetTags = assetTagsByFilename[asset.filename] ?? [];
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
            <div className={styles.assetOrganizeRow}>
              <select
                value={assetFolder}
                onChange={(event) => onChangeAssetFolder(asset.filename, event.target.value)}
              >
                {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
              </select>
              <div className={styles.assetMiniTags}>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.assetMiniTag} ${assetTags.includes(tag) ? styles.assetMiniTagActive : ''}`}
                    onClick={() => onToggleAssetTag(asset.filename, tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.assetActions}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => onSelectAsset(asset)}
              >
                Use image
              </button>
              <button
                type="button"
                className={styles.assetDeleteButton}
                disabled={deleteFilename === asset.filename}
                onClick={() => onDeleteAsset(asset)}
              >
                {deleteFilename === asset.filename ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
