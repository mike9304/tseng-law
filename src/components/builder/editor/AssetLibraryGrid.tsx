'use client';

import Image from 'next/image';
import type { BuilderAssetFolder, BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import { getAssetLibraryGridCopy } from './asset-library-grid-copy';

interface AssetLibraryGridProps {
  assets: BuilderAssetListItem[];
  selectedUrl?: string | null;
  activeUrl?: string | null;
  folders: BuilderAssetFolder[];
  tags: string[];
  assetFolderByFilename: Record<string, string>;
  assetTagsByFilename: Record<string, string[]>;
  deleteFilename: string | null;
  onSelectAsset: (asset: BuilderAssetListItem) => void;
  onDeleteAsset: (asset: BuilderAssetListItem) => void;
  onChangeAssetFolder: (filename: string, folderId: string) => void;
  onToggleAssetTag: (filename: string, tag: string) => void;
  locale: Locale;
}

function formatBytes(value: number) {
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}

function formatUploadedAt(value: string, locale: Locale) {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;
  return new Intl.DateTimeFormat(locale === 'zh-hant' ? 'zh-TW' : locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function AssetLibraryGrid({
  assets,
  selectedUrl,
  activeUrl,
  folders,
  tags,
  assetFolderByFilename,
  assetTagsByFilename,
  deleteFilename,
  onSelectAsset,
  onDeleteAsset,
  onChangeAssetFolder,
  onToggleAssetTag,
  locale,
}: AssetLibraryGridProps) {
  const text = getAssetLibraryGridCopy(locale);

  return (
    <div className={styles.assetGrid}>
      {assets.map((asset) => {
        const active = selectedUrl === asset.url;
        const keyboardActive = activeUrl === asset.url;
        const assetFolder = assetFolderByFilename[asset.filename] ?? 'uploads';
        const assetTags = assetTagsByFilename[asset.filename] ?? [];
        return (
          <article
            key={asset.filename}
            data-builder-asset-library-asset={asset.filename}
            data-builder-asset-library-asset-url={asset.url}
            data-builder-asset-library-asset-active={keyboardActive ? 'true' : undefined}
            className={`${styles.assetCard} ${(active || keyboardActive) ? styles.assetCardActive : ''}`}
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
              <span>{formatBytes(asset.size)} · {formatUploadedAt(asset.uploadedAt, locale)}</span>
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
                {text.useImage}
              </button>
              <button
                type="button"
                className={styles.assetDeleteButton}
                disabled={deleteFilename === asset.filename}
                onClick={() => onDeleteAsset(asset)}
              >
                {deleteFilename === asset.filename ? text.deleting : text.delete}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
