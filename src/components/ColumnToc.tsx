import type { ColumnTocEntry } from '@/lib/column-toc';

/** Long lists (Q&A-style columns run to 13–15 sections) flow into two columns on desktop. */
const LONG_TOC_THRESHOLD = 8;

export default function ColumnToc({
  entries,
  label,
}: {
  entries: readonly ColumnTocEntry[];
  label: string;
}) {
  const long = entries.length >= LONG_TOC_THRESHOLD;
  return (
    <nav className="column-toc" aria-label={label}>
      <p className="column-toc-label">{label}</p>
      <ol className={long ? 'column-toc-list column-toc-list--long' : 'column-toc-list'}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} className="column-toc-link">
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
