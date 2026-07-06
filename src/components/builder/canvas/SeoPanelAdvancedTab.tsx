'use client';

import type {
  BuilderSeoAdditionalMetaTag,
  BuilderStructuredDataBlock,
  BuilderStructuredDataBlockType,
} from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import styles from './SeoPanelAdvancedTab.module.css';
import { getSeoPanelAdvancedCopy } from './seo-panel-advanced-copy';

interface StructuredDataSettings {
  legalService: boolean;
  organization: boolean;
  localBusiness: boolean;
  faqPage: 'auto' | 'off';
  breadcrumbList: boolean;
}

interface SeoPanelAdvancedTabProps {
  active: boolean;
  locale: Locale;
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
  locale,
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
  const copy = getSeoPanelAdvancedCopy(locale);
  return (
    <>
      <section className={styles.section} data-active={active ? 'true' : 'false'}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleBlock}>
            <h3 className={styles.sectionTitle}>{copy.title}</h3>
            <span className={styles.helpText}>{copy.help}</span>
          </div>
          <button type="button" className={styles.ghostButton} onClick={onAddAdditionalMetaTag}>
            {copy.addMeta}
          </button>
        </div>
        {additionalMetaTags.length === 0 ? (
          <div className={`${styles.previewCard} ${styles.emptyCard}`}>
            {copy.noTags}
          </div>
        ) : (
          <div className={styles.metaList}>
            {additionalMetaTags.map((tag) => (
              <div
                key={tag.id}
                className={styles.metaRow}
              >
                <input
                  type="text"
                  value={tag.name}
                  placeholder={copy.metaName}
                  className={styles.input}
                  onChange={(event) => onUpdateAdditionalMetaTag(tag.id, 'name', event.target.value)}
                />
                <input
                  type="text"
                  value={tag.content}
                  placeholder={copy.metaContent}
                  className={styles.input}
                  onChange={(event) => onUpdateAdditionalMetaTag(tag.id, 'content', event.target.value)}
                />
                <button type="button" className={styles.ghostButton} onClick={() => onRemoveAdditionalMetaTag(tag.id)}>
                  {copy.delete}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section} data-active={active ? 'true' : 'false'}>
        <h3 className={styles.sectionTitle}>{copy.structuredTitle}</h3>
        <div className={styles.checkboxGrid}>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={structuredData.legalService}
              onChange={(event) => onUpdateStructuredField('legalService', event.target.checked)}
            />
            <span>LegalService</span>
          </label>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={structuredData.organization}
              onChange={(event) => onUpdateStructuredField('organization', event.target.checked)}
            />
            <span>Organization</span>
          </label>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={structuredData.localBusiness}
              onChange={(event) => onUpdateStructuredField('localBusiness', event.target.checked)}
            />
            <span>LocalBusiness</span>
          </label>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={structuredData.breadcrumbList}
              onChange={(event) => onUpdateStructuredField('breadcrumbList', event.target.checked)}
            />
            <span>BreadcrumbList</span>
          </label>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-faq-schema">{copy.faqLabel}</label>
          <select
            id="builder-seo-faq-schema"
            value={structuredData.faqPage}
            className={styles.input}
            onChange={(event) => onUpdateStructuredField('faqPage', event.target.value as 'auto' | 'off')}
          >
            <option value="auto">{copy.faqAuto}</option>
            <option value="off">{copy.faqOff}</option>
          </select>
        </div>
        <div className={styles.sectionHeader}>
          <div className={styles.titleBlock}>
            <h4 className={styles.subTitle}>{copy.jsonLdTitle}</h4>
            <span className={styles.helpText}>{copy.jsonLdHelp}</span>
          </div>
          <button type="button" className={styles.ghostButton} onClick={() => onAddStructuredDataBlock('Article')}>
            {copy.addArticle}
          </button>
        </div>
        {structuredDataBlocks.length === 0 ? (
          <div className={`${styles.previewCard} ${styles.emptyCard}`}>
            {copy.noBlocks}
          </div>
        ) : (
          <div className={styles.blockList}>
            {structuredDataBlocks.map((block) => (
              <div key={block.id} className={styles.previewCard}>
                <div className={styles.twoColumn}>
                  <label className={styles.field}>
                    <span className={styles.label}>{copy.type}</span>
                    <select
                      value={block.type}
                      className={styles.input}
                      onChange={(event) => onChangeStructuredDataBlockType(
                        block.id,
                        event.target.value as BuilderStructuredDataBlockType,
                      )}
                    >
                      {copy.structuredDataBlockTypes.map((option) => (
                        <option key={option.type} value={option.type}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>{copy.label}</span>
                    <input
                      type="text"
                      value={block.label ?? ''}
                      className={styles.input}
                      onChange={(event) => onUpdateStructuredDataBlock(block.id, { label: event.target.value })}
                    />
                  </label>
                </div>
                <textarea
                  value={block.json ?? ''}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={5}
                  onChange={(event) => onUpdateStructuredDataBlock(block.id, { json: event.target.value })}
                />
                <div className={styles.formActions}>
                  <label className={`${styles.checkboxRow} ${styles.useRow}`}>
                    <input
                      type="checkbox"
                      checked={block.enabled}
                      onChange={(event) => onUpdateStructuredDataBlock(block.id, { enabled: event.target.checked })}
                    />
                    <span>{copy.use}</span>
                  </label>
                  <span className={styles.blockType}>{block.type}</span>
                  <button type="button" className={styles.ghostButton} onClick={() => onRemoveStructuredDataBlock(block.id)}>
                    {copy.delete}
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
