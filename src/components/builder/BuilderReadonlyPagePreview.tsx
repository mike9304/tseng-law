import type { ReactNode } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderPageDocument, BuilderPageKey } from '@/lib/builder/types';
import { getBuilderSectionDefinition } from '@/lib/builder/registry';

export default function BuilderReadonlyPagePreview({
  locale,
  pageKey,
  title,
  description,
  document,
  children,
}: {
  locale: Locale;
  pageKey: BuilderPageKey;
  title: string;
  description: string;
  document: BuilderPageDocument;
  children: ReactNode;
}) {
  const copy = getReadonlyPagePreviewCopy(locale);

  return (
    <>
      <div data-builder-page-preview-runtime="true">
        {children}
      </div>

      <section
        className="section section--light"
        data-builder-page-preview-diagnostics="true"
        data-tone="light"
      >
        <div className="container">
          <div className="section-label">{copy.sectionLabel}</div>
          <h2 className="section-title">{title}</h2>
          <p className="section-lede">{description}</p>
          <div className="builder-preview-section-grid" style={{ marginTop: '2rem' }}>
            {document.root.children.map((section) => {
              const definition = getBuilderSectionDefinition(section.sectionKey);
              return (
                <div
                  key={section.id}
                  className={`builder-preview-section-card${section.hidden ? ' is-hidden' : ''}`}
                >
                  <div className="builder-preview-section-card-main">
                    <div className="builder-preview-section-card-key">{section.sectionKey}</div>
                    <div className="builder-preview-section-card-title">{definition.title}</div>
                  </div>
                  <div className="builder-preview-section-card-component">
                    {definition.componentName}
                  </div>
                  <div className="builder-preview-section-card-targets">
                    {copy.pageLabel} {pageKey} · {copy.localeLabel} {locale}
                  </div>
                  <div className="builder-preview-section-card-targets">
                    {copy.supportsLabel}: {definition.supportedTargets.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function getReadonlyPagePreviewCopy(locale: Locale) {
  return {
    sectionLabel: locale === 'ko' ? '빌더 미리보기' : locale === 'zh-hant' ? '建構器預覽' : 'BUILDER PREVIEW',
    pageLabel: locale === 'ko' ? '페이지:' : locale === 'zh-hant' ? '頁面：' : 'page:',
    localeLabel: locale === 'ko' ? '로케일:' : locale === 'zh-hant' ? '語言：' : 'locale:',
    supportsLabel: locale === 'ko' ? '지원 대상' : locale === 'zh-hant' ? '支援對象' : 'supports',
  } as const;
}
