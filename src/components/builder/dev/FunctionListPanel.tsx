import type { Locale } from '@/lib/locales';
import type { BuilderFunctionRecord } from './functions-admin-types';
import type { FunctionsCopy } from './functions-copy';
import { BUTTON_STYLE, LIST_STYLE, TOOLBAR_STYLE } from './functions-admin-styles';

interface FunctionListPanelProps {
  copy: FunctionsCopy;
  functions: BuilderFunctionRecord[];
  locale: Locale;
  selectedId: string;
  onCreate: () => void;
  onSelect: (entry: BuilderFunctionRecord) => void;
}

function emptyLabel(locale: Locale): string {
  if (locale === 'zh-hant') return '目前還沒有函數。';
  if (locale === 'en') return 'No functions yet.';
  return '아직 함수가 없습니다.';
}

export function FunctionListPanel({
  copy,
  functions,
  locale,
  selectedId,
  onCreate,
  onSelect,
}: FunctionListPanelProps) {
  return (
    <aside style={LIST_STYLE} aria-label={copy.functionsList}>
      <div style={TOOLBAR_STYLE}>
        <strong style={{ fontSize: 14 }}>{copy.functionsList}</strong>
        <button type="button" style={{ ...BUTTON_STYLE, marginLeft: 'auto' }} onClick={onCreate}>
          {copy.createFunction}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 8, gap: 6 }}>
        {functions.length === 0 ? (
          <p style={{ margin: 12, color: '#64748b', fontSize: 13 }}>{emptyLabel(locale)}</p>
        ) : functions.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry)}
            style={{
              ...BUTTON_STYLE,
              textAlign: 'left',
              borderColor: selectedId === entry.id ? '#0f172a' : '#e2e8f0',
              background: selectedId === entry.id ? '#f8fafc' : '#fff',
            }}
            data-builder-dev-function-row={entry.slug}
          >
            <span style={{ display: 'block', fontWeight: 800 }}>{entry.name}</span>
            <span style={{ display: 'block', color: '#64748b', fontSize: 12 }}>
              /api/builder/dev/functions/{entry.slug}/invoke
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
