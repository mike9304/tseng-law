import type { ColumnPost } from '@/lib/columns';
import type { FAQItem } from '@/data/faq-content';
import type { Locale } from '@/lib/locales';
import type { BuilderHomeDocumentState, BuilderPageDocument } from '@/lib/builder/types';
import { homeSectionRegistry } from '@/lib/builder/registry';
import BuilderPublishedHomeRenderer from '@/components/builder/BuilderPublishedHomeRenderer';

export default function BuilderReadonlyHomePreview({
  locale,
  document,
  posts,
  faqItems,
  state,
}: {
  locale: Locale;
  document: BuilderPageDocument;
  posts: ColumnPost[];
  faqItems: FAQItem[];
  state?: BuilderHomeDocumentState | null;
}) {
  return (
    <>
      <section className="section section--light" data-tone="light">
        <div className="container">
          <div className="section-label">BUILDER PREVIEW</div>
          <h1 className="section-title">Home Builder Foundation</h1>
          <p className="section-lede">
            현재 공개 홈 컴포넌트를 재사용하는 읽기 전용 mapped surface입니다. 아직 편집 기능은 없고,
            `sectionKey` 기준 registry와 document 구조가 먼저 연결된 상태입니다.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              marginTop: '2rem',
            }}
          >
            {document.root.children.map((section) => {
              const definition = homeSectionRegistry[section.sectionKey];
              const hidden = Boolean(section.hidden);
              return (
                <div
                  key={section.id}
                  style={{
                    border: '1px solid rgba(15, 23, 42, 0.12)',
                    borderRadius: '18px',
                    padding: '0.9rem 1rem',
                    background: 'rgba(255, 255, 255, 0.82)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', opacity: 0.6, marginBottom: '0.35rem' }}>
                    {section.sectionKey}
                  </div>
                  <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span>{definition.title}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.65 }}>{hidden ? 'hidden' : 'visible'}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', opacity: 0.72, marginTop: '0.2rem' }}>
                    {definition.componentName}
                  </div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.65, marginTop: '0.45rem' }}>
                    supports: {definition.supportedTargets.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BuilderPublishedHomeRenderer
        locale={locale}
        document={document}
        posts={posts}
        fallbackFaqItems={faqItems}
        state={state}
      />
    </>
  );
}
