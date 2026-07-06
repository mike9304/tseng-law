import type { Locale } from '@/lib/locales';
import type { AutoTranslateSourceNode } from '@/lib/builder/translations/auto-translate';
import type { TranslationCopy } from './translation-copy';
import {
  inputStyle,
  labelText,
  readOnlyBlock,
  sectionHeading,
  twoCol,
} from './TranslationEditor.styles';
import { TranslationEditorRichTextReview } from './TranslationEditorRichTextReview';
import { TranslationEditorSegmentReview } from './TranslationEditorSegmentReview';

interface TranslationEditorTextSectionProps {
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly sources: readonly AutoTranslateSourceNode[];
  readonly values: Record<string, string>;
  readonly copy: TranslationCopy;
  readonly onValueChange: (nodeId: string, value: string) => void;
}

export function TranslationEditorTextSection({
  sourceLocale,
  targetLocale,
  sources,
  values,
  copy,
  onValueChange,
}: TranslationEditorTextSectionProps) {
  return (
    <section>
      <h2 style={sectionHeading}>
        {copy.editorPageTextHeading(sources.length)}
      </h2>
      {sources.length === 0 ? (
        <p style={{ fontSize: 13, color: '#64748b' }}>
          {copy.editorNoTranslatableNodes}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sources.map((source) => (
            <div
              key={source.nodeId}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 12,
                background: '#fff',
              }}
              data-translation-node-row={source.nodeId}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#64748b',
                  marginBottom: 6,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <code>{source.nodeId}</code>
                <span>{source.elementHint}</span>
              </div>
              <div style={twoCol}>
                <div>
                  <span style={labelText}>{copy.editorSourceTranslation(sourceLocale)}</span>
                  <div style={readOnlyBlock}>{source.text}</div>
                  <TranslationEditorRichTextReview
                    locale={targetLocale}
                    nodeId={source.nodeId}
                    richText={source.richText}
                  />
                </div>
                <div>
                  <span style={labelText}>{copy.editorTargetTranslation(targetLocale)}</span>
                  <textarea
                    value={values[source.nodeId] ?? ''}
                    onChange={(event) => onValueChange(source.nodeId, event.target.value)}
                    rows={Math.min(6, Math.max(2, Math.ceil(source.text.length / 60)))}
                    style={inputStyle}
                    data-translation-node-target-input={source.nodeId}
                  />
                  <TranslationEditorSegmentReview
                    nodeId={source.nodeId}
                    sourceLocale={sourceLocale}
                    targetLocale={targetLocale}
                    sourceText={source.text}
                    sourceRichText={source.richText}
                    targetText={values[source.nodeId] ?? ''}
                    onTargetTextChange={(value) => onValueChange(source.nodeId, value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
