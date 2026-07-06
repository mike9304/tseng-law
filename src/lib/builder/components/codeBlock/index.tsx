import { defineComponent } from '../define';
import CodeBlockInspector from './Inspector';
import type { Locale } from '@/lib/locales';
import {
  CODE_BLOCK_LEGACY_DEFAULTS,
  getUtilityAdvancedWidgetsCopy,
  localizedUtilityText,
} from '../utility-advanced-widgets-copy';

interface CodeBlockContent {
  title: string;
  language: 'ts' | 'js' | 'tsx' | 'jsx' | 'json' | 'html' | 'css' | 'bash' | 'text';
  code: string;
  runMode?: 'inline' | 'function';
  functionSlug?: string;
  showLineNumbers: boolean;
}

function CodeBlockRender({
  node,
  mode,
  locale = 'ko',
}: {
  node: { content: CodeBlockContent };
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const copy = getUtilityAdvancedWidgetsCopy(locale).codeBlock;
  const { title = '', language = 'ts', code = '', showLineNumbers = true } = node.content;
  const lines = code ? code.split('\n') : [copy.emptyCode];
  const empty = !code.trim();
  const displayTitle = title
    ? localizedUtilityText(title, copy.titleFallback, CODE_BLOCK_LEGACY_DEFAULTS.title)
    : copy.titleFallback;
  const lineNumberColumn = showLineNumbers
    ? lines.map((_, index) => String(index + 1).padStart(2, '0')).join('\n')
    : '';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(148, 163, 184, 0.35)',
        background: mode === 'published' ? '#0f172a' : '#111827',
        color: '#e2e8f0',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
      }}
      data-builder-code-block="true"
      data-builder-code-language={language}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 12px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
          background: 'rgba(15, 23, 42, 0.35)',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <span>{displayTitle}</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11, color: '#94a3b8' }}>
          {copy.languageLabels[language] ?? language}
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showLineNumbers ? 'auto 1fr' : '1fr',
          gap: 0,
          alignItems: 'stretch',
          minHeight: 'calc(100% - 42px)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 12,
          lineHeight: 1.55,
        }}
      >
        {showLineNumbers ? (
          <pre
            aria-hidden="true"
            style={{
              margin: 0,
              padding: '12px 8px 12px 12px',
              color: '#64748b',
              textAlign: 'right',
              background: 'rgba(15, 23, 42, 0.28)',
              userSelect: 'none',
            }}
          >
            {lineNumberColumn}
          </pre>
        ) : null}
        <pre
          style={{
            margin: 0,
            padding: '12px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: empty ? 'rgba(15, 23, 42, 0.12)' : 'transparent',
            color: empty ? '#94a3b8' : '#e2e8f0',
          }}
        >
          {code || copy.emptyCode}
        </pre>
      </div>
    </div>
  );
}

export default defineComponent({
  kind: 'codeBlock',
  displayName: '코드 블록',
  category: 'advanced',
  icon: '</>',
  defaultContent: {
    title: 'Code Block',
    language: 'js' as const,
    code: [
      'ctx.log("Canvas code slot", ctx.now());',
      'return { message: "Hello from the canvas" };',
    ].join('\n'),
    runMode: 'inline' as const,
    functionSlug: '',
    showLineNumbers: true,
  },
  defaultStyle: {},
  defaultRect: { width: 520, height: 280 },
  Render: CodeBlockRender,
  Inspector: CodeBlockInspector,
});
