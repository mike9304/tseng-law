'use client';

import type {
  BuilderSeoAdditionalMetaTag,
  BuilderStructuredDataBlock,
  BuilderStructuredDataBlockType,
} from '@/lib/builder/site/types';
import {
  checkboxGridStyle,
  checkboxRowStyle,
  fieldStyle,
  formActionsStyle,
  ghostButtonStyle,
  helpTextStyle,
  inputStyle,
  labelStyle,
  previewCardStyle,
  sectionStyle,
  sectionTitleStyle,
  textareaStyle,
  twoColumnStyle,
} from './SeoPanel.styles';

const STRUCTURED_DATA_BLOCK_TYPES: Array<{ type: BuilderStructuredDataBlockType; label: string }> = [
  { type: 'Article', label: 'Article' },
  { type: 'FAQPage', label: 'FAQPage' },
  { type: 'LegalService', label: 'LegalService' },
  { type: 'Organization', label: 'Organization' },
  { type: 'LocalBusiness', label: 'LocalBusiness' },
  { type: 'BreadcrumbList', label: 'BreadcrumbList' },
  { type: 'Custom', label: 'Custom' },
];

interface StructuredDataSettings {
  legalService: boolean;
  organization: boolean;
  localBusiness: boolean;
  faqPage: 'auto' | 'off';
  breadcrumbList: boolean;
}

interface SeoPanelAdvancedTabProps {
  active: boolean;
  additionalMetaTags: BuilderSeoAdditionalMetaTag[];
  structuredData: StructuredDataSettings;
  structuredDataBlocks: BuilderStructuredDataBlock[];
  onAddAdditionalMetaTag: () => void;
  onUpdateAdditionalMetaTag: (
    id: string,
    key: keyof Pick<BuilderSeoAdditionalMetaTag, 'name' | 'content'>,
    value: string,
  ) => void;
  onRemoveAdditionalMetaTag: (id: string) => void;
  onUpdateStructuredField: <K extends keyof StructuredDataSettings>(
    key: K,
    value: StructuredDataSettings[K],
  ) => void;
  onAddStructuredDataBlock: (type: BuilderStructuredDataBlockType) => void;
  onChangeStructuredDataBlockType: (id: string, type: BuilderStructuredDataBlockType) => void;
  onUpdateStructuredDataBlock: (id: string, patch: Partial<BuilderStructuredDataBlock>) => void;
  onRemoveStructuredDataBlock: (id: string) => void;
}

export function SeoPanelAdvancedTab({
  active,
  additionalMetaTags,
  structuredData,
  structuredDataBlocks,
  onAddAdditionalMetaTag,
  onUpdateAdditionalMetaTag,
  onRemoveAdditionalMetaTag,
  onUpdateStructuredField,
  onAddStructuredDataBlock,
  onChangeStructuredDataBlockType,
  onUpdateStructuredDataBlock,
  onRemoveStructuredDataBlock,
}: SeoPanelAdvancedTabProps) {
  return (
    <>
      <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <h3 style={sectionTitleStyle}>Advanced SEO meta tags</h3>
            <span style={helpTextStyle}>Wix Advanced SEO의 additional meta tags에 해당합니다. name/content meta tag로 public head에 반영됩니다.</span>
          </div>
          <button type="button" style={ghostButtonStyle} onClick={onAddAdditionalMetaTag}>
            + Meta
          </button>
        </div>
        {additionalMetaTags.length === 0 ? (
          <div style={{ ...previewCardStyle, color: '#64748b', fontSize: '0.78rem' }}>
            Additional meta tag가 없습니다.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {additionalMetaTags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(120px, 0.8fr) minmax(180px, 1.2fr) auto',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={tag.name}
                  placeholder="meta name"
                  style={inputStyle}
                  onChange={(event) => onUpdateAdditionalMetaTag(tag.id, 'name', event.target.value)}
                />
                <input
                  type="text"
                  value={tag.content}
                  placeholder="meta content"
                  style={inputStyle}
                  onChange={(event) => onUpdateAdditionalMetaTag(tag.id, 'content', event.target.value)}
                />
                <button type="button" style={ghostButtonStyle} onClick={() => onRemoveAdditionalMetaTag(tag.id)}>
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
        <h3 style={sectionTitleStyle}>구조화 데이터</h3>
        <div style={checkboxGridStyle}>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={structuredData.legalService}
              onChange={(event) => onUpdateStructuredField('legalService', event.target.checked)}
            />
            <span>LegalService</span>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={structuredData.organization}
              onChange={(event) => onUpdateStructuredField('organization', event.target.checked)}
            />
            <span>Organization</span>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={structuredData.localBusiness}
              onChange={(event) => onUpdateStructuredField('localBusiness', event.target.checked)}
            />
            <span>LocalBusiness</span>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={structuredData.breadcrumbList}
              onChange={(event) => onUpdateStructuredField('breadcrumbList', event.target.checked)}
            />
            <span>BreadcrumbList</span>
          </label>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-faq-schema">FAQPage</label>
          <select
            id="builder-seo-faq-schema"
            value={structuredData.faqPage}
            style={inputStyle}
            onChange={(event) => onUpdateStructuredField('faqPage', event.target.value as 'auto' | 'off')}
          >
            <option value="auto">FAQ widgets에서 자동 생성</option>
            <option value="off">끄기</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <h4 style={{ ...sectionTitleStyle, fontSize: '0.78rem' }}>JSON-LD blocks</h4>
            <span style={helpTextStyle}>Article, FAQPage 같은 schema.org 블록을 페이지별로 저장합니다.</span>
          </div>
          <button type="button" style={ghostButtonStyle} onClick={() => onAddStructuredDataBlock('Article')}>
            + Article
          </button>
        </div>
        {structuredDataBlocks.length === 0 ? (
          <div style={{ ...previewCardStyle, color: '#64748b', fontSize: '0.78rem' }}>
            추가 JSON-LD 블록이 없습니다.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {structuredDataBlocks.map((block) => (
              <div key={block.id} style={previewCardStyle}>
                <div style={twoColumnStyle}>
                  <label style={fieldStyle}>
                    <span style={labelStyle}>Type</span>
                    <select
                      value={block.type}
                      style={inputStyle}
                      onChange={(event) => onChangeStructuredDataBlockType(
                        block.id,
                        event.target.value as BuilderStructuredDataBlockType,
                      )}
                    >
                      {STRUCTURED_DATA_BLOCK_TYPES.map((option) => (
                        <option key={option.type} value={option.type}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={fieldStyle}>
                    <span style={labelStyle}>Label</span>
                    <input
                      type="text"
                      value={block.label ?? ''}
                      style={inputStyle}
                      onChange={(event) => onUpdateStructuredDataBlock(block.id, { label: event.target.value })}
                    />
                  </label>
                </div>
                <textarea
                  value={block.json ?? ''}
                  style={textareaStyle}
                  rows={5}
                  onChange={(event) => onUpdateStructuredDataBlock(block.id, { json: event.target.value })}
                />
                <div style={formActionsStyle}>
                  <label style={{ ...checkboxRowStyle, marginRight: 'auto' }}>
                    <input
                      type="checkbox"
                      checked={block.enabled}
                      onChange={(event) => onUpdateStructuredDataBlock(block.id, { enabled: event.target.checked })}
                    />
                    <span>사용</span>
                  </label>
                  <span style={helpTextStyle}>{block.type}</span>
                  <button type="button" style={ghostButtonStyle} onClick={() => onRemoveStructuredDataBlock(block.id)}>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
