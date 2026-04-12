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
  return (
    <>
      <section className="section section--light" data-tone="light">
        <div className="container">
          <div className="section-label">BUILDER PREVIEW</div>
          <h1 className="section-title">{title}</h1>
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
                    page: {pageKey} · locale: {locale}
                  </div>
                  <div className="builder-preview-section-card-targets">
                    supports: {definition.supportedTargets.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {children}
    </>
  );
}
