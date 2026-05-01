'use client';

import { useCallback, useState } from 'react';
import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import { DEFAULT_FILTERS, type ImageFilters } from '@/lib/builder/canvas/filters';
import type { LinkValue } from '@/lib/builder/links';
import CropModal from '@/components/builder/canvas/CropModal';
import FilterPanel from '@/components/builder/canvas/FilterPanel';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

export default function ImageInspector({
  node,
  onUpdate,
  disabled = false,
  onRequestAssetLibrary,
  linkPickerContext,
}: BuilderComponentInspectorProps) {
  const imageNode = node as BuilderImageCanvasNode;
  const [cropOpen, setCropOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const currentFilters: ImageFilters =
    (imageNode.content as { filters?: ImageFilters }).filters ?? { ...DEFAULT_FILTERS };

  const handleFilterChange = useCallback(
    (filters: ImageFilters) => {
      onUpdate({ filters });
    },
    [onUpdate],
  );

  return (
    <>
      <div className={styles.inspectorActionRow}>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !onRequestAssetLibrary}
          onClick={() => onRequestAssetLibrary?.()}
        >
          Open asset library
        </button>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !imageNode.content.src}
          onClick={() => setCropOpen(true)}
          style={{ marginLeft: 6 }}
        >
          Crop
        </button>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled}
          onClick={() => setFilterOpen((prev) => !prev)}
          style={{ marginLeft: 6 }}
        >
          {filterOpen ? '필터 닫기' : '필터'}
        </button>
      </div>
      {filterOpen && (
        <FilterPanel
          filters={currentFilters}
          onChangeFilters={handleFilterChange}
          onClose={() => setFilterOpen(false)}
        />
      )}
      <label>
        <span>Source URL</span>
        <input
          type="text"
          value={imageNode.content.src}
          disabled={disabled}
          placeholder="https://example.com/image.jpg"
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Alt text</span>
        <input
          type="text"
          value={imageNode.content.alt}
          disabled={disabled}
          onChange={(event) => onUpdate({ alt: event.target.value })}
        />
      </label>
      <label>
        <span>Fit</span>
        <select
          value={imageNode.content.fit}
          disabled={disabled}
          onChange={(event) => onUpdate({ fit: event.target.value })}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
          Link
        </span>
        <LinkPicker
          value={(imageNode.content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
        />
      </div>
      {imageNode.content.cropAspect && imageNode.content.cropAspect !== 'Free' && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
          Crop: {imageNode.content.cropAspect}
        </div>
      )}
      <CropModal
        open={cropOpen}
        imageSrc={imageNode.content.src}
        currentAspect={imageNode.content.cropAspect || 'Free'}
        onConfirm={(aspect) => {
          onUpdate({ cropAspect: aspect });
          setCropOpen(false);
        }}
        onClose={() => setCropOpen(false)}
      />
    </>
  );
}
