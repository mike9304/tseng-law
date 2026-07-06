'use client';

import type { ServiceAreaSourceRecord } from '@/lib/builder/services/source';
import type { Locale } from '@/lib/locales';
import { helperStyle, listStyle } from './serviceSourceStyles';

type ServiceSourceRecordListProps = {
  readonly locale: Locale;
  readonly records: readonly ServiceAreaSourceRecord[];
  readonly selectedSourceSlug: string;
  readonly onSelectRecord: (record: ServiceAreaSourceRecord) => void;
};

export function ServiceSourceRecordList({
  locale,
  onSelectRecord,
  records,
  selectedSourceSlug,
}: ServiceSourceRecordListProps) {
  return (
    <section className="builder-preview-inspector-card">
      <h2>Service records</h2>
      <p style={helperStyle}>
        Source records from `src/data/service-details.ts` can now receive builder overrides without editing code.
      </p>
      <div style={listStyle}>
        {records.map((record) => (
          <button
            key={record.sourceSlug}
            type="button"
            className={`builder-dashboard-nav-card ${record.sourceSlug === selectedSourceSlug ? 'is-active' : ''}`}
            data-service-source-row={record.sourceSlug}
            onClick={() => onSelectRecord(record)}
            style={{ textAlign: 'left' }}
          >
            <strong>{record.title[locale]}</strong>
            <span>{record.sourceSlug} to {record.slug}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
