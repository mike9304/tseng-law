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
  const copy = getReadonlyHomePreviewCopy(locale);

  return (
    <>
      <div data-builder-home-preview-runtime="true">
        <BuilderPublishedHomeRenderer
          locale={locale}
          document={document}
          posts={posts}
          fallbackFaqItems={faqItems}
          state={state}
        />
      </div>

      <section
        className="section section--light"
        data-builder-home-preview-diagnostics="true"
        data-tone="light"
      >
        <div className="container">
          <div className="section-label">{copy.sectionLabel}</div>
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-lede">{copy.lede}</p>
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
                    {copy.sectionKeyLabel} {section.sectionKey}
                  </div>
                  <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span>{definition.title}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.65 }}>
                      {hidden ? copy.hiddenLabel : copy.visibleLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', opacity: 0.72, marginTop: '0.2rem' }}>
                    {definition.componentName}
                  </div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.65, marginTop: '0.45rem' }}>
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

function getReadonlyHomePreviewCopy(locale: Locale) {
  return {
    sectionLabel: locale === 'ko' ? '빌더 미리보기' : locale === 'zh-hant' ? '建構器預覽' : 'BUILDER PREVIEW',
    title: locale === 'ko' ? '홈 빌더 기반' : locale === 'zh-hant' ? '首頁建構器基礎' : 'Home Builder Foundation',
    lede:
      locale === 'ko'
        ? '현재 공개 홈 컴포넌트를 재사용하는 읽기 전용 mapped surface입니다. 아직 편집 기능은 없고, sectionKey 기준 registry와 document 구조가 먼저 연결된 상태입니다.'
        : locale === 'zh-hant'
          ? '這是一個重用公開首頁元件的唯讀 mapped surface。現在還沒有編輯功能，但以 sectionKey 為基準的 registry 與文件結構已先連接完成。'
          : 'This is a read-only mapped surface that reuses the public home components. Editing is still unavailable, and the sectionKey-based registry and document structure are connected first.',
    sectionKeyLabel: locale === 'ko' ? '섹션 키' : locale === 'zh-hant' ? '區段鍵' : 'Section key',
    hiddenLabel: locale === 'ko' ? '숨김' : locale === 'zh-hant' ? '隱藏' : 'hidden',
    visibleLabel: locale === 'ko' ? '표시됨' : locale === 'zh-hant' ? '可見' : 'visible',
    supportsLabel: locale === 'ko' ? '지원 대상' : locale === 'zh-hant' ? '支援對象' : 'supports',
  } as const;
}
