'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderAssetFolder, BuilderAssetLibraryState, BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

interface AssetListResponse {
  ok: boolean;
  assets?: BuilderAssetListItem[];
  library?: BuilderAssetLibraryState;
  error?: string;
}

interface AssetUploadResponse {
  ok: boolean;
  asset?: BuilderAssetListItem;
  error?: string;
}

type AssetSortMode = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

const DEFAULT_FOLDERS: BuilderAssetFolder[] = [
  { id: 'uploads', name: 'Uploads' },
  { id: 'brand', name: 'Brand' },
];

const DEFAULT_TAGS = ['hero', 'office', 'people'];
const ASSET_LIBRARY_STORAGE_VERSION = 1;

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

function assetLibraryStorageKey(locale: Locale) {
  return `builder:asset-library:${locale}:v${ASSET_LIBRARY_STORAGE_VERSION}`;
}

function readPersistedAssetLibraryState(locale: Locale): BuilderAssetLibraryState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(assetLibraryStorageKey(locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BuilderAssetLibraryState;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writePersistedAssetLibraryState(locale: Locale, state: BuilderAssetLibraryState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(assetLibraryStorageKey(locale), JSON.stringify(state));
  } catch {
    // localStorage can be unavailable in private browsing; the library still works in-memory.
  }
}

function mergeAssetLibraryState(
  serverState: BuilderAssetLibraryState | null | undefined,
  localState: BuilderAssetLibraryState | null,
): BuilderAssetLibraryState {
  const folders = new Map<string, BuilderAssetFolder>();
  for (const folder of DEFAULT_FOLDERS) folders.set(folder.id, folder);
  for (const folder of serverState?.folders ?? []) folders.set(folder.id, folder);
  for (const folder of localState?.folders ?? []) folders.set(folder.id, folder);
  const tags = new Set([...DEFAULT_TAGS, ...(serverState?.tags ?? []), ...(localState?.tags ?? [])]);
  return {
    folders: Array.from(folders.values()),
    tags: Array.from(tags),
    assetFolderByFilename: {
      ...(serverState?.assetFolderByFilename ?? {}),
      ...(localState?.assetFolderByFilename ?? {}),
    },
    assetTagsByFilename: {
      ...(serverState?.assetTagsByFilename ?? {}),
      ...(localState?.assetTagsByFilename ?? {}),
    },
  };
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
  const lastSyncedLibraryJsonRef = useRef<string>('');
  const libraryStateRef = useRef<BuilderAssetLibraryState | null>(null);
  const pendingLibraryStateRef = useRef<BuilderAssetLibraryState | null>(null);
  const librarySaveTimerRef = useRef<number | null>(null);
  const [assets, setAssets] = useState<BuilderAssetListItem[]>([]);
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<AssetSortMode>('date-desc');
  const [folders, setFolders] = useState<BuilderAssetFolder[]>(DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('all');
  const [newFolderName, setNewFolderName] = useState('');
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [activeTag, setActiveTag] = useState('all');
  const [newTagName, setNewTagName] = useState('');
  const [assetFolderByFilename, setAssetFolderByFilename] = useState<Record<string, string>>({});
  const [assetTagsByFilename, setAssetTagsByFilename] = useState<Record<string, string[]>>({});
  const [storageReady, setStorageReady] = useState(false);
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
      const library = mergeAssetLibraryState(payload.library, readPersistedAssetLibraryState(locale));
      setFolders(library.folders);
      setTags(library.tags);
      setAssetFolderByFilename(library.assetFolderByFilename);
      setAssetTagsByFilename(library.assetTagsByFilename);
      libraryStateRef.current = library;
      lastSyncedLibraryJsonRef.current = JSON.stringify(library);
      setStorageReady(true);
    } catch {
      setError('Failed to load assets.');
      const library = mergeAssetLibraryState(null, readPersistedAssetLibraryState(locale));
      setFolders(library.folders);
      setTags(library.tags);
      setAssetFolderByFilename(library.assetFolderByFilename);
      setAssetTagsByFilename(library.assetTagsByFilename);
      libraryStateRef.current = library;
      lastSyncedLibraryJsonRef.current = JSON.stringify(library);
      setStorageReady(true);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    void loadAssets();
  }, [loadAssets, open]);

  useEffect(() => {
    if (!open) {
      if (librarySaveTimerRef.current) {
        window.clearTimeout(librarySaveTimerRef.current);
        librarySaveTimerRef.current = null;
      }
      setStorageReady(false);
      return;
    }
    if (librarySaveTimerRef.current) {
      window.clearTimeout(librarySaveTimerRef.current);
      librarySaveTimerRef.current = null;
    }
  }, [locale, open]);

  const libraryState = useMemo<BuilderAssetLibraryState>(() => ({
    folders,
    tags,
    assetFolderByFilename,
    assetTagsByFilename,
  }), [assetFolderByFilename, assetTagsByFilename, folders, tags]);

  const scheduleLibraryStateSave = useCallback((nextState: BuilderAssetLibraryState) => {
    const nextJson = JSON.stringify(nextState);
    libraryStateRef.current = nextState;
    pendingLibraryStateRef.current = nextState;
    writePersistedAssetLibraryState(locale, nextState);
    if (nextJson === lastSyncedLibraryJsonRef.current) return;
    if (librarySaveTimerRef.current) window.clearTimeout(librarySaveTimerRef.current);
    librarySaveTimerRef.current = window.setTimeout(() => {
      const stateToSave = pendingLibraryStateRef.current ?? nextState;
      void fetch(`/api/builder/assets?locale=${locale}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, library: stateToSave }),
      })
        .then(async (response) => {
          const payload = await response.json() as { ok?: boolean; library?: BuilderAssetLibraryState };
          if (response.ok && payload.ok && payload.library) {
            lastSyncedLibraryJsonRef.current = JSON.stringify(payload.library);
            libraryStateRef.current = payload.library;
            pendingLibraryStateRef.current = null;
          }
        })
        .catch(() => undefined);
    }, 200);
  }, [locale]);

  useEffect(() => {
    libraryStateRef.current = libraryState;
  }, [libraryState]);

  useEffect(() => {
    if (!open || !storageReady) return;
    scheduleLibraryStateSave(libraryState);
  }, [libraryState, open, scheduleLibraryStateSave, storageReady]);

  useEffect(() => {
    return () => {
      if (librarySaveTimerRef.current) {
        window.clearTimeout(librarySaveTimerRef.current);
        librarySaveTimerRef.current = null;
      }
    };
  }, []);

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
    const filtered = assets.filter((asset) => {
      const filename = asset.filename.toLowerCase();
      const uploadedAt = Date.parse(asset.uploadedAt);
      const folderId = assetFolderByFilename[asset.filename] ?? 'uploads';
      const tagList = assetTagsByFilename[asset.filename] ?? [];
      const matchesQuery = !query || filename.includes(query);
      const matchesFolder =
        activeFolder === 'all'
        || folderId === activeFolder
        || (activeFolder === 'recent' && !Number.isNaN(uploadedAt) && Date.now() - uploadedAt < 1000 * 60 * 60 * 24 * 7)
        || (activeFolder === 'selected' && asset.url === selectedUrl);
      const matchesTag = activeTag === 'all' || tagList.includes(activeTag);
      return matchesQuery && matchesFolder && matchesTag;
    });
    return filtered.sort((left, right) => {
      if (sortMode === 'name-asc') return left.filename.localeCompare(right.filename);
      if (sortMode === 'name-desc') return right.filename.localeCompare(left.filename);
      const leftTime = Date.parse(left.uploadedAt) || 0;
      const rightTime = Date.parse(right.uploadedAt) || 0;
      return sortMode === 'date-asc' ? leftTime - rightTime : rightTime - leftTime;
    });
  }, [activeFolder, activeTag, assetFolderByFilename, assetTagsByFilename, assets, search, selectedUrl, sortMode]);

  const folderTree = useMemo(
    () => [
      { id: 'all', name: 'All assets', count: assets.length },
      { id: 'recent', name: 'Recent', count: assets.filter((asset) => {
        const uploadedAt = Date.parse(asset.uploadedAt);
        return !Number.isNaN(uploadedAt) && Date.now() - uploadedAt < 1000 * 60 * 60 * 24 * 7;
      }).length },
      { id: 'selected', name: 'Selected', count: selectedUrl ? assets.filter((asset) => asset.url === selectedUrl).length : 0 },
      ...folders.map((folder) => ({
        ...folder,
        count: assets.filter((asset) => (assetFolderByFilename[asset.filename] ?? 'uploads') === folder.id).length,
      })),
    ],
    [assetFolderByFilename, assets, folders, selectedUrl],
  );

  function createFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `folder-${Date.now()}`;
    const currentLibrary = libraryStateRef.current ?? libraryState;
    const nextFolders = currentLibrary.folders.some((folder) => folder.id === id)
      ? currentLibrary.folders
      : [...currentLibrary.folders, { id, name }];
    setFolders(nextFolders);
    scheduleLibraryStateSave({ ...currentLibrary, folders: nextFolders });
    setActiveFolder(id);
    setNewFolderName('');
  }

  function createTag() {
    const name = newTagName.trim().toLowerCase();
    if (!name) return;
    const currentLibrary = libraryStateRef.current ?? libraryState;
    const nextTags = currentLibrary.tags.includes(name) ? currentLibrary.tags : [...currentLibrary.tags, name];
    setTags(nextTags);
    scheduleLibraryStateSave({ ...currentLibrary, tags: nextTags });
    setActiveTag(name);
    setNewTagName('');
  }

  function toggleAssetTag(filename: string, tag: string) {
    const currentLibrary = libraryStateRef.current ?? libraryState;
    const existing = currentLibrary.assetTagsByFilename[filename] ?? [];
    const nextTags = existing.includes(tag)
      ? existing.filter((candidate) => candidate !== tag)
      : [...existing, tag];
    const nextMap = { ...currentLibrary.assetTagsByFilename, [filename]: nextTags };
    setAssetTagsByFilename(nextMap);
    scheduleLibraryStateSave({ ...currentLibrary, assetTagsByFilename: nextMap });
  }

  async function uploadFile(file: File) {
    // Upload validation (P3-18 security)
    const { validateUploadFile } = await import('@/lib/builder/canvas/upload-validation');
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setError(validation.error || '파일 업로드 실패');
      return;
    }

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
      const currentLibrary = libraryStateRef.current ?? libraryState;
      const nextFolderMap = { ...currentLibrary.assetFolderByFilename };
      const nextTagMap = { ...currentLibrary.assetTagsByFilename };
      delete nextFolderMap[asset.filename];
      delete nextTagMap[asset.filename];
      setAssetFolderByFilename(nextFolderMap);
      setAssetTagsByFilename(nextTagMap);
      scheduleLibraryStateSave({
        ...currentLibrary,
        assetFolderByFilename: nextFolderMap,
        assetTagsByFilename: nextTagMap,
      });
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

        <div className={styles.assetLibraryShell}>
          <aside className={styles.assetFolderTree}>
            <span className={styles.modalEyebrow}>Folders</span>
            {folderTree.map((folder) => (
              <button
                key={folder.id}
                type="button"
                className={`${styles.assetFolderButton} ${activeFolder === folder.id ? styles.assetFolderButtonActive : ''}`}
                onClick={() => setActiveFolder(folder.id)}
              >
                <span>{folder.name}</span>
                <strong>{folder.count}</strong>
              </button>
            ))}
            <div className={styles.assetCreateRow}>
              <input
                className={styles.inspectorInput}
                value={newFolderName}
                placeholder="New folder"
                onChange={(event) => setNewFolderName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') createFolder();
                }}
              />
              <button type="button" className={styles.actionButton} onClick={createFolder}>Add</button>
            </div>
          </aside>

          <section className={styles.assetLibraryMain}>
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
              <label className={styles.modalSearchField}>
                <span>Sort</span>
                <select
                  className={styles.inspectorInput}
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as AssetSortMode)}
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
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

            <div className={styles.assetTagBar}>
              <button
                type="button"
                className={`${styles.assetTagChip} ${activeTag === 'all' ? styles.assetTagChipActive : ''}`}
                onClick={() => setActiveTag('all')}
              >
                All tags
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`${styles.assetTagChip} ${activeTag === tag ? styles.assetTagChipActive : ''}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
              <input
                className={styles.assetTagInput}
                value={newTagName}
                placeholder="New tag"
                onChange={(event) => setNewTagName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') createTag();
                }}
              />
              <button type="button" className={styles.assetTagChip} onClick={createTag}>Create</button>
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
                  : 'No assets match the current filters.'}
              </p>
            ) : null}

            <div className={styles.assetGrid}>
              {filteredAssets.map((asset) => {
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
                    onChange={(event) => {
                      const currentLibrary = libraryStateRef.current ?? libraryState;
                      const nextFolderMap = {
                        ...currentLibrary.assetFolderByFilename,
                        [asset.filename]: event.target.value,
                      };
                      setAssetFolderByFilename(nextFolderMap);
                      scheduleLibraryStateSave({ ...currentLibrary, assetFolderByFilename: nextFolderMap });
                    }}
                  >
                    {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
                  </select>
                  <div className={styles.assetMiniTags}>
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`${styles.assetMiniTag} ${assetTags.includes(tag) ? styles.assetMiniTagActive : ''}`}
                        onClick={() => toggleAssetTag(asset.filename, tag)}
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
          </section>
        </div>
      </div>
    </div>
  );
}
