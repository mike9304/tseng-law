'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BuilderAssetFolder, BuilderAssetLibraryState, BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import { AssetLibraryChrome, type AssetSortMode } from './AssetLibraryChrome';
import { AssetLibraryGrid } from './AssetLibraryGrid';

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

const DEFAULT_FOLDERS: BuilderAssetFolder[] = [
  { id: 'uploads', name: 'Uploads' },
  { id: 'brand', name: 'Brand' },
];

const DEFAULT_TAGS = ['hero', 'office', 'people'];
const ASSET_LIBRARY_STORAGE_VERSION = 1;
const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((node) => (
      !node.hasAttribute('disabled')
      && node.tabIndex !== -1
      && !node.hasAttribute('hidden')
      && !node.closest('[hidden]')
      && node.getClientRects().length > 0
    ));
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
  initialFolder,
  autoFolderOnSelect,
  autoTagOnSelect,
  onClose,
  onSelect,
  onToast,
}: {
  open: boolean;
  locale: Locale;
  selectedUrl?: string | null;
  initialFolder?: string;
  autoFolderOnSelect?: string;
  autoTagOnSelect?: string;
  onClose: () => void;
  onSelect: (asset: BuilderAssetListItem) => void;
  onToast?: (message: string, tone: 'success' | 'error') => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
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
        const message = payload.error ?? '이미지를 불러오지 못했습니다.';
        setError(message);
        onToast?.('네트워크 오류, 다시 시도해주세요', 'error');
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
      setError('이미지를 불러오지 못했습니다.');
      onToast?.('네트워크 오류, 다시 시도해주세요', 'error');
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
  }, [locale, onToast]);

  useEffect(() => {
    if (!open) return;
    if (initialFolder) setActiveFolder(initialFolder);
    void loadAssets();
  }, [initialFolder, loadAssets, open]);

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
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = getFocusableElements(dialog);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === dialog) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }
      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    closingRef.current = false;
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = getFocusableElements(dialog);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    return () => {
      closingRef.current = true;
      const previous = restoreFocusRef.current;
      if (!previous || typeof previous.focus !== 'function') return;
      try {
        previous.focus({ preventScroll: true });
      } catch {
        // Ignore detached focus targets.
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleFocusIn(event: FocusEvent) {
      if (closingRef.current) return;
      const dialog = dialogRef.current;
      if (!dialog || !event.target || dialog.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      const focusables = getFocusableElements(dialog);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [open]);

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

  function changeAssetFolder(filename: string, folderId: string) {
    const currentLibrary = libraryStateRef.current ?? libraryState;
    const nextFolderMap = {
      ...currentLibrary.assetFolderByFilename,
      [filename]: folderId,
    };
    setAssetFolderByFilename(nextFolderMap);
    scheduleLibraryStateSave({ ...currentLibrary, assetFolderByFilename: nextFolderMap });
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

  function handleSelectAsset(asset: BuilderAssetListItem) {
    if (autoFolderOnSelect || autoTagOnSelect) {
      const currentLibrary = libraryStateRef.current ?? libraryState;
      const nextFolderMap = autoFolderOnSelect
        ? { ...currentLibrary.assetFolderByFilename, [asset.filename]: autoFolderOnSelect }
        : currentLibrary.assetFolderByFilename;
      const existingTags = currentLibrary.assetTagsByFilename[asset.filename] ?? [];
      const nextAssetTags = autoTagOnSelect && !existingTags.includes(autoTagOnSelect)
        ? [...existingTags, autoTagOnSelect]
        : existingTags;
      const nextTagMap = autoTagOnSelect
        ? { ...currentLibrary.assetTagsByFilename, [asset.filename]: nextAssetTags }
        : currentLibrary.assetTagsByFilename;
      const nextTags = autoTagOnSelect && !currentLibrary.tags.includes(autoTagOnSelect)
        ? [...currentLibrary.tags, autoTagOnSelect]
        : currentLibrary.tags;
      setAssetFolderByFilename(nextFolderMap);
      setAssetTagsByFilename(nextTagMap);
      setTags(nextTags);
      scheduleLibraryStateSave({
        ...currentLibrary,
        tags: nextTags,
        assetFolderByFilename: nextFolderMap,
        assetTagsByFilename: nextTagMap,
      });
    }
    onSelect(asset);
    onClose();
  }

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-label="Asset library"
        tabIndex={-1}
        data-builder-asset-library-dialog="true"
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
          <AssetLibraryChrome
            folderTree={folderTree}
            activeFolder={activeFolder}
            newFolderName={newFolderName}
            search={search}
            sortMode={sortMode}
            isLoading={isLoading}
            isUploading={isUploading}
            inputRef={inputRef}
            activeTag={activeTag}
            tags={tags}
            newTagName={newTagName}
            onChangeActiveFolder={setActiveFolder}
            onChangeNewFolderName={setNewFolderName}
            onCreateFolder={createFolder}
            onChangeSearch={setSearch}
            onChangeSortMode={setSortMode}
            onRefresh={() => void loadAssets()}
            onUploadFile={(file) => void uploadFile(file)}
            onChangeActiveTag={setActiveTag}
            onChangeNewTagName={setNewTagName}
            onCreateTag={createTag}
          >
            {error ? <p className={styles.modalError}>{error}</p> : null}
            {isLoading ? <p className={styles.modalHint}>Loading assets…</p> : null}
            {!isLoading && filteredAssets.length === 0 ? (
              <div className={styles.assetEmptyState}>
                <strong>
                  {assets.length === 0
                    ? '아직 업로드된 이미지가 없습니다.'
                    : '현재 필터와 맞는 이미지가 없습니다.'}
                </strong>
                <span>
                  {assets.length === 0
                    ? '이미지를 드래그하거나 업로드 버튼을 눌러 바로 추가하세요.'
                    : '검색어, 폴더, 태그 필터를 지우거나 다시 불러오세요.'}
                </span>
                <div className={styles.assetEmptyActions}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    disabled={isUploading}
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload image
                  </button>
                  <button
                    type="button"
                    className={styles.actionButton}
                    disabled={isLoading}
                    onClick={() => void loadAssets()}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : null}

            <AssetLibraryGrid
              assets={filteredAssets}
              selectedUrl={selectedUrl}
              folders={folders}
              tags={tags}
              assetFolderByFilename={assetFolderByFilename}
              assetTagsByFilename={assetTagsByFilename}
              deleteFilename={deleteFilename}
              onSelectAsset={handleSelectAsset}
              onDeleteAsset={(asset) => void handleDeleteAsset(asset)}
              onChangeAssetFolder={changeAssetFolder}
              onToggleAssetTag={toggleAssetTag}
            />
          </AssetLibraryChrome>
        </div>
      </div>
    </div>
  );
}
