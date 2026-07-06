'use client';

import type { ChangeEvent, DragEvent, ReactNode, RefObject } from 'react';
import type { Locale } from '@/lib/locales';
import styles from '@/components/builder/canvas/SandboxPage.module.css';
import { getAssetLibraryChromeCopy } from './asset-library-chrome-copy';

export type AssetSortMode = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

export interface AssetFolderTreeItem {
  id: string;
  name: string;
  count: number;
}

interface AssetLibraryChromeProps {
  children: ReactNode;
  locale: Locale;
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
  locale,
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
  const text = getAssetLibraryChromeCopy(locale);

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
        <span className={styles.modalEyebrow}>{text.folders}</span>
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
            placeholder={text.newFolder}
            onChange={(event) => onChangeNewFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onCreateFolder();
            }}
          />
          <button type="button" className={styles.actionButton} onClick={onCreateFolder}>{text.add}</button>
        </div>
      </aside>

      <section className={styles.assetLibraryMain}>
        <div className={styles.modalToolbar}>
          <label className={styles.modalSearchField}>
            <span>{text.search}</span>
            <input
              className={styles.inspectorInput}
              type="search"
              value={search}
              placeholder={text.filename}
              onChange={(event) => onChangeSearch(event.target.value)}
            />
          </label>
          <label className={styles.modalSearchField}>
            <span>{text.sort}</span>
            <select
              className={styles.inspectorInput}
              value={sortMode}
              onChange={(event) => onChangeSortMode(event.target.value as AssetSortMode)}
            >
              <option value="date-desc">{text.newest}</option>
              <option value="date-asc">{text.oldest}</option>
              <option value="name-asc">{text.nameAsc}</option>
              <option value="name-desc">{text.nameDesc}</option>
            </select>
          </label>
          <div className={styles.modalToolbarActions}>
            <button
              type="button"
              className={styles.actionButton}
              disabled={isLoading}
              onClick={onRefresh}
            >
              {text.refresh}
            </button>
            <button
              type="button"
              className={styles.actionButton}
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? text.uploading : text.upload}
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
            {text.allTags}
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
            placeholder={text.newTag}
            onChange={(event) => onChangeNewTagName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onCreateTag();
            }}
          />
          <button type="button" className={styles.assetTagChip} onClick={onCreateTag}>{text.create}</button>
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
          <strong>{isUploading ? text.uploading : text.dropTitle}</strong>
          <span>{text.dropHint}</span>
        </button>

        {children}
      </section>
    </>
  );
}
