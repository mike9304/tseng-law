'use client';

import styles from './SandboxPage.module.css';

export default function LayerSearchInput({
  value,
  resultCount,
  onChange,
}: {
  value: string;
  resultCount: number;
  onChange: (value: string) => void;
}) {
  const hasQuery = value.trim().length > 0;

  return (
    <div className={styles.layerSearchWrap}>
      <input
        className={styles.layerSearchInput}
        type="search"
        value={value}
        placeholder="노드 검색..."
        aria-label="Search layers"
        onChange={(event) => onChange(event.target.value)}
      />
      <span className={styles.layerSearchMeta}>
        {hasQuery ? `${resultCount} match` : 'id / kind / text'}
      </span>
      {hasQuery ? (
        <button
          type="button"
          className={styles.layerSearchClear}
          aria-label="Clear layer search"
          onClick={() => onChange('')}
        >
          x
        </button>
      ) : null}
    </div>
  );
}
