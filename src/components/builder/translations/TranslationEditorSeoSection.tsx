import type { Locale } from '@/lib/locales';
import type { ProjectedSeoValue } from '@/lib/builder/translations/seo-projection';
import type { TranslationCopy } from './translation-copy';
import {
  inputReadOnly,
  inputStyle,
  labelStyle,
  labelText,
  sectionHeading,
  sectionPanelStyle,
  twoCol,
} from './TranslationEditor.styles';

export type TranslationEditorSeoField = 'title' | 'description' | 'ogImage';

interface TranslationEditorSeoSectionProps {
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly initialSourceSeo: ProjectedSeoValue;
  readonly seo: ProjectedSeoValue;
  readonly copy: TranslationCopy;
  readonly onSeoChange: (field: TranslationEditorSeoField, value: string) => void;
}

export function TranslationEditorSeoSection({
  sourceLocale,
  targetLocale,
  initialSourceSeo,
  seo,
  copy,
  onSeoChange,
}: TranslationEditorSeoSectionProps) {
  return (
    <section style={sectionPanelStyle}>
      <h2 style={sectionHeading}>{copy.editorSeoHeading(targetLocale)}</h2>
      <div style={twoCol}>
        <div>
          <label style={labelStyle}>
            <span style={labelText}>Title (source — {sourceLocale})</span>
            <input
              type="text"
              value={initialSourceSeo.title ?? ''}
              readOnly
              style={inputReadOnly}
            />
          </label>
          <label style={labelStyle}>
            <span style={labelText}>Description (source)</span>
            <textarea
              value={initialSourceSeo.description ?? ''}
              readOnly
              rows={3}
              style={inputReadOnly}
            />
          </label>
          <label style={labelStyle}>
            <span style={labelText}>OG image (source)</span>
            <input
              type="text"
              value={initialSourceSeo.ogImage ?? ''}
              readOnly
              style={inputReadOnly}
            />
          </label>
        </div>
        <div>
          <label style={labelStyle}>
            <span style={labelText}>Title (override — {targetLocale})</span>
            <input
              type="text"
              value={seo.title ?? ''}
              placeholder={initialSourceSeo.title ?? ''}
              onChange={(event) => onSeoChange('title', event.target.value)}
              style={inputStyle}
              data-translation-seo-title-input="true"
            />
          </label>
          <label style={labelStyle}>
            <span style={labelText}>Description (override)</span>
            <textarea
              value={seo.description ?? ''}
              placeholder={initialSourceSeo.description ?? ''}
              rows={3}
              onChange={(event) => onSeoChange('description', event.target.value)}
              style={inputStyle}
              data-translation-seo-description-input="true"
            />
          </label>
          <label style={labelStyle}>
            <span style={labelText}>OG image (override)</span>
            <input
              type="text"
              value={seo.ogImage ?? ''}
              placeholder={initialSourceSeo.ogImage ?? ''}
              onChange={(event) => onSeoChange('ogImage', event.target.value)}
              style={inputStyle}
              data-translation-seo-og-image-input="true"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
