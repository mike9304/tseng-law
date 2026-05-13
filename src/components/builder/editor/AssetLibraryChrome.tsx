'use client';

import type { ChangeEvent, DragEvent, ReactNode, RefObject } from 'react';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

export type AssetSortMode = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

export interface AssetFolderTreeItem {
  id: string;
  name: string;
  count: number;
}

interface AssetLibraryChromeProps {
  children: ReactNode;
  folderTree: AssetFolderTreeItem[];
  activeFolder: string;
  newFolderName: string;
  search: string;
  sortMode: AssetSortMode;
  isLoading: boolean;
  isUploading: boolean;
  inputRef: RefObject<HTMLInputElement>;
  activeTag: string;
  tags: string[];
  newTagName: string;
  onChangeActiveFolder: (folderId: string) => void;
  onChangeNewFolderName: (value: string) => void;
  onCreateFolder: () => void;
  onChangeSearch: (value: string) => void;
  onChangeSortMode: (mode: AssetSortMode) => void;
  onRefresh: () => void;
  onUploadFile: (file: File) => void;
  onChangeActiveTag: (tag: string) => void;
  onChangeNewTagName: (value: string) => void;
  onCreateTag: () => void;
}

export function AssetLibraryChrome({
  children,
  folderTree,
  activeFolder,
  newFolderName,
  search,
  sortMode,
  isLoading,
  isUploading,
  inputRef,
  activeTag,
  tags,
  newTagName,
  onChangeActiveFolder,
  onChangeNewFolderName,
  onCreateFolder,
  onChangeSearch,
  onChangeSortMode,
  onRefresh,
  onUploadFile,
  onChangeActiveTag,
  onChangeNewTagName,
  onCreateTag,
}: AssetLibraryChromeProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.currentTarget.value = '';
    if (file) onUploadFile(file);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onUploadFile(file);
  }

  return (
    <>
      <aside className={styles.assetFolderTree}>
        <span className={styles.modalEyebrow}>Folders</span>
        {folderTree.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className={`${styles.assetFolderButton} ${activeFolder === folder.id ? styles.assetFolderButtonActive : ''}`}
            onClick={() => onChangeActiveFolder(folder.id)}
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
            onChange={(event) => onChangeNewFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onCreateFolder();
            }}
          />
          <button type="button" className={styles.actionButton} onClick={onCreateFolder}>Add</button>
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
              onChange={(event) => onChangeSearch(event.target.value)}
            />
          </label>
          <label className={styles.modalSearchField}>
            <span>Sort</span>
            <select
              className={styles.inspectorInput}
              value={sortMode}
              onChange={(event) => onChangeSortMode(event.target.value as AssetSortMode)}
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
              onClick={onRefresh}
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
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className={styles.assetTagBar}>
          <button
            type="button"
            className={`${styles.assetTagChip} ${activeTag === 'all' ? styles.assetTagChipActive : ''}`}
            onClick={() => onChangeActiveTag('all')}
          >
            All tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${styles.assetTagChip} ${activeTag === tag ? styles.assetTagChipActive : ''}`}
              onClick={() => onChangeActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
          <input
            className={styles.assetTagInput}
            value={newTagName}
            placeholder="New tag"
            onChange={(event) => onChangeNewTagName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onCreateTag();
            }}
          />
          <button type="button" className={styles.assetTagChip} onClick={onCreateTag}>Create</button>
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
          onDrop={handleDrop}
        >
          <strong>{isUploading ? 'Uploading image…' : 'Drop image here or click to upload'}</strong>
          <span>JPG, PNG, WEBP, GIF, AVIF · max 8 MB</span>
        </button>

        {children}
      </section>
    </>
  );
}
