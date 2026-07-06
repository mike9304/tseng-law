import type { Locale } from '@/lib/locales';
import type { FunctionsCopy } from './functions-copy';

interface FunctionQuickDocsProps {
  copy: FunctionsCopy;
  curlExample: string;
  invokePath: string;
  locale: Locale;
}

const CODE_FONT = 'ui-monospace, Menlo, monospace';

function logHelperJoin(locale: Locale): string {
  if (locale === 'zh-hant') return ' 與記錄輔助工具：';
  if (locale === 'en') return ' and log helpers: ';
  return ' 및 로그 헬퍼: ';
}

export function FunctionQuickDocs({ copy, curlExample, invokePath, locale }: FunctionQuickDocsProps) {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
        margin: '0 16px 16px',
        padding: 14,
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        background: '#f8fafc',
      }}
      data-builder-dev-function-docs="true"
    >
      <div>
        <h2 style={{ margin: '0 0 6px', fontSize: 14 }}>{copy.apiHeading}</h2>
        <p style={{ margin: 0, color: '#475569', fontSize: 13, lineHeight: 1.5 }}>
          {copy.apiDescription}{' '}
          <code style={{ margin: '0 4px', fontFamily: CODE_FONT }}>ctx.now()</code>
          {logHelperJoin(locale)}
          <code style={{ fontFamily: CODE_FONT }}>ctx.log/info/warn/error</code>.
        </p>
        <a
          href="./sdk#functions"
          style={{ display: 'inline-block', marginTop: 8, color: '#0f172a', fontSize: 13, fontWeight: 800 }}
          data-builder-dev-function-sdk-link="true"
        >
          {copy.openSdkDocs}
        </a>
      </div>
      <div>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{copy.invokeEndpoint}</div>
        <code
          style={{
            display: 'block',
            padding: 10,
            borderRadius: 8,
            background: '#0f172a',
            color: '#e2e8f0',
            fontFamily: CODE_FONT,
            fontSize: 12,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
          data-builder-dev-function-invoke-path="true"
        >
          {invokePath}
        </code>
        <code
          style={{
            display: 'block',
            marginTop: 6,
            padding: 10,
            borderRadius: 8,
            background: '#ffffff',
            color: '#334155',
            border: '1px solid #e2e8f0',
            fontFamily: CODE_FONT,
            fontSize: 12,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
          data-builder-dev-function-curl="true"
        >
          {curlExample}
        </code>
      </div>
    </section>
  );
}
