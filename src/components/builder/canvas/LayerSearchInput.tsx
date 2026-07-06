'use client';

import type { SandboxLayerSearchCopy } from '@/components/builder/canvas/sandbox-layers-panel-copy';
import styles from './SandboxPage.module.css';

export default function LayerSearchInput({
  value,
  resultCount,
  copy,
  onChange,
}: {
  value: string;
  resultCount: number;
  copy: SandboxLayerSearchCopy;
  onChange: (value: string) => void;
}) {
  const hasQuery = value.trim().length > 0;

  return (
    <div className={styles.layerSearchWrap}>
      <input
        className={styles.layerSearchInput}
        type="search"
        value={value}
        placeholder={copy.placeholder}
        aria-label={copy.ariaLabel}
        data-builder-layer-search="true"
        onChange={(event) => onChange(event.target.value)}
      />
      <span className={styles.layerSearchMeta}>
        {hasQuery ? copy.resultCountLabel(resultCount) : copy.hintLabel}
      </span>
      {hasQuery ? (
        <button
          type="button"
          className={styles.layerSearchClear}
          aria-label={copy.clearAriaLabel}
          onClick={() => onChange('')}
        >
          x
        </button>
      ) : null}
    </div>
  );
}
