import type { Locale } from '@/lib/locales';
import CodeAssistantPanel from '@/components/builder/dev/CodeAssistantPanel';
import type { FunctionsCopy } from './functions-copy';
import { CODE_STYLE, FIELD_STYLE } from './functions-admin-styles';

interface FunctionCodeEditorProps {
  assistantOpen: boolean;
  code: string;
  copy: FunctionsCopy;
  locale: Locale;
  slug: string;
  onApplyAiFix: (nextCode: string) => void;
  onChangeCode: (nextCode: string) => void;
  onCloseAssistant: () => void;
}

function contextHint(locale: Locale, slug: string): string {
  const visibleSlug = slug || 'new-function';
  if (locale === 'zh-hant') return `建構器伺服器函式代稱：${visibleSlug}`;
  if (locale === 'en') return `Builder serverless function slug: ${visibleSlug}`;
  return `빌더 서버리스 함수 슬러그: ${visibleSlug}`;
}

export function FunctionCodeEditor({
  assistantOpen,
  code,
  copy,
  locale,
  slug,
  onApplyAiFix,
  onChangeCode,
  onCloseAssistant,
}: FunctionCodeEditorProps) {
  return (
    <div style={{ position: 'relative', padding: '0 16px 16px' }}>
      {assistantOpen ? (
        <div style={{ position: 'absolute', top: 8, right: 24, width: 420, zIndex: 5 }}>
          <CodeAssistantPanel
            locale={locale}
            code={code}
            language="ts"
            contextHint={contextHint(locale, slug)}
            onApplyFix={onApplyAiFix}
            onClose={onCloseAssistant}
          />
        </div>
      ) : null}
      <label style={FIELD_STYLE}>
        <span>{copy.codeBody}</span>
        <textarea
          value={code}
          onChange={(event) => onChangeCode(event.target.value)}
          style={CODE_STYLE}
          spellCheck={false}
          data-builder-dev-function-code="true"
        />
      </label>
    </div>
  );
}
