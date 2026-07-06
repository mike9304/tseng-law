import type { PaginationState } from './usePagination';

interface PaginationProps<T> {
  pagination: PaginationState<T>;
  copy: {
    pageLabel: (page: number, totalPages: number, totalItems: number) => string;
    pageSizeLabel: string;
    nextLabel: string;
    prevLabel: string;
  };
}

/**
 * Generic pagination control for admin list pages. Pairs with `usePagination`.
 * Renders nothing once everything fits in a single page, so callers can drop
 * it in unconditionally.
 */
export default function Pagination<T>({ pagination, copy }: PaginationProps<T>) {
  const { page, setPage, totalPages, totalItems, pageSize, setPageSize, hasNext, hasPrev } = pagination;
  if (totalPages <= 1 && pageSize === 25) return null;
  return (
    <div
      data-pagination
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        padding: '10px 0',
        fontSize: 12,
        color: '#475569',
      }}
    >
      <button
        type="button"
        data-pagination-prev
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={!hasPrev}
        style={{
          padding: '4px 10px',
          border: '1px solid #cbd5e1',
          borderRadius: 6,
          background: '#ffffff',
          color: hasPrev ? '#0f172a' : '#94a3b8',
          cursor: hasPrev ? 'pointer' : 'not-allowed',
          fontSize: 12,
        }}
      >
        {copy.prevLabel}
      </button>
      <span style={{ color: '#64748b' }}>{copy.pageLabel(page + 1, totalPages, totalItems)}</span>
      <button
        type="button"
        data-pagination-next
        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
        disabled={!hasNext}
        style={{
          padding: '4px 10px',
          border: '1px solid #cbd5e1',
          borderRadius: 6,
          background: '#ffffff',
          color: hasNext ? '#0f172a' : '#94a3b8',
          cursor: hasNext ? 'pointer' : 'not-allowed',
          fontSize: 12,
        }}
      >
        {copy.nextLabel}
      </button>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span>{copy.pageSizeLabel}</span>
        <select
          data-pagination-page-size
          value={pageSize}
          onChange={(e) => { setPageSize(Number.parseInt(e.target.value, 10)); setPage(0); }}
          style={{ padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4, background: '#fff', fontSize: 12 }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
    </div>
  );
}
