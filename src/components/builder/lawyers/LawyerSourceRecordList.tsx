'use client';

import type { AttorneyProfileSourceRecord } from '@/lib/builder/lawyers/source';
import { helperStyle, listStyle } from './lawyerSourceStyles';

type LawyerSourceRecordListProps = {
  readonly records: readonly AttorneyProfileSourceRecord[];
  readonly selectedSourceSlug: string;
  readonly onSelectRecord: (record: AttorneyProfileSourceRecord) => void;
};

export function LawyerSourceRecordList({
  onSelectRecord,
  records,
  selectedSourceSlug,
}: LawyerSourceRecordListProps) {
  return (
    <section className="builder-preview-inspector-card">
      <h2>Lawyer records</h2>
      <p style={helperStyle}>
        Source records from `src/data/attorney-profiles.ts` can now receive builder overrides without editing code.
      </p>
      <div style={listStyle}>
        {records.map((record) => (
          <button
            key={record.sourceSlug}
            type="button"
            className={`builder-dashboard-nav-card ${record.sourceSlug === selectedSourceSlug ? 'is-active' : ''}`}
            data-lawyer-source-row={record.sourceSlug}
            onClick={() => onSelectRecord(record)}
            style={{ textAlign: 'left' }}
          >
            <strong>{record.name}</strong>
            <span>{record.sourceSlug} to {record.slug}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
