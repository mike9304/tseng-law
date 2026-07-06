import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import {
  buildBuilderDynamicTemplateHref,
  buildBuilderStarterTemplateHref,
} from '@/lib/builder/hrefs';
import { buildBuilderPageHref, type BuilderSiteOverview } from '@/lib/builder/site';
import { getBuilderWorkspaceCopy } from '@/lib/builder/workspace-copy';
import type { BuilderStarterTemplateDetail } from '@/lib/builder/starter-templates';
import type { Locale } from '@/lib/locales';

export default function BuilderStarterTemplateWorkspaceShell({
  locale,
  overview,
  detail,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
  detail: BuilderStarterTemplateDetail;
}) {
  const copy = getBuilderWorkspaceCopy(locale);
  const starterCopy = getStarterWorkspaceCopy(locale);
  return (
    <BuilderWorkspaceFrame
      locale={locale}
      title={`${detail.title} starter`}
      description="Template-first confirmation surface. This does not pretend to instantiate a new page yet; it only shows the safest current entry path."
      activeRail="pages"
      stageUrl={buildBuilderStarterTemplateHref(locale, detail.templateId)}
      railItems={[
        { key: 'pages', label: copy.pagesLabel, description: copy.pagesDescription, href: `/${locale}/builder`, active: true },
        { key: 'assets', label: copy.assetsLabel, description: copy.assetsDescription, href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">{starterCopy.stageLabel}</span>
          <span className="builder-stage-pill">{detail.category}</span>
          <span className="builder-stage-pill">
            {starterCopy.supportLabel[detail.support]}
          </span>
        </>
      }
      rightMeta={
        <>
          <strong>{overview.site.name}</strong>
          <span>
            {overview.site.id} · locale {locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>{copy.starterSidebarTitle}</h2>
          <p>{copy.starterSidebarDescription}</p>
          <div className="builder-dashboard-nav-list">
            {overview.starterTemplates.map((template) => (
              <Link
                key={template.templateId}
                href={buildBuilderStarterTemplateHref(locale, template.templateId)}
                className={`builder-dashboard-nav-card${template.templateId === detail.templateId ? ' is-active' : ''}`}
              >
                <strong>{template.title}</strong>
                <span>{template.focus}</span>
                <small>{template.livePath}</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{copy.starterCurrentPathTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              {detail.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{copy.starterExcludedTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              {detail.exclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      }
      >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>{starterCopy.summaryTitle}</h2>
          <p>{detail.description}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.templateId}</strong>
              <span>{starterCopy.templateIdLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.entryKind}</strong>
              <span>{starterCopy.entryKindLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.support}</strong>
              <span>{starterCopy.currentSupportLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.category}</strong>
              <span>{starterCopy.categoryLabel}</span>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>{starterCopy.useStarterTitle}</h2>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.title}</strong>
                  <span>{detail.focus}</span>
                </div>
                <span className="builder-stage-pill">{detail.support}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.livePath}</span>
                <span>{detail.pageKey ? starterCopy.builderPagePrefix(detail.pageKey) : starterCopy.dynamicRouteBackedLabel}</span>
                <span>{detail.dynamicTemplateId ?? starterCopy.noDynamicTemplateLabel}</span>
              </div>
              <div className="builder-dashboard-page-actions">
                {detail.pageKey ? (
                  <Link
                    href={buildBuilderPageHref(
                      locale,
                      detail.pageKey,
                      detail.support === 'editable-now' ? 'edit' : 'preview'
                    )}
                    className="builder-action-btn builder-action-btn--primary"
                    >
                    {detail.support === 'editable-now' ? starterCopy.openInBuilderLabel : starterCopy.openPreviewLabel}
                  </Link>
                ) : null}
                {detail.dynamicTemplateId ? (
                  <Link
                    href={buildBuilderDynamicTemplateHref(locale, detail.dynamicTemplateId)}
                    className="builder-action-btn"
                  >
                    {starterCopy.openOwnershipDetailLabel}
                  </Link>
                ) : null}
                <Link href={detail.livePath} className="builder-action-btn">
                  {starterCopy.openLiveRouteLabel}
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}

function getStarterWorkspaceCopy(locale: Locale) {
  return {
    stageLabel: locale === 'ko' ? '스타터 템플릿' : locale === 'zh-hant' ? '起始範本' : 'Starter template',
    supportLabel:
      locale === 'ko'
        ? { 'editable-now': '지금 편집 가능', 'preview-now': '지금 미리보기', 'ownership-only': '소유권만' }
        : locale === 'zh-hant'
          ? { 'editable-now': '目前可編輯', 'preview-now': '目前可預覽', 'ownership-only': '僅擁有權' }
          : { 'editable-now': 'Editable now', 'preview-now': 'Preview now', 'ownership-only': 'Ownership only' },
    summaryTitle: locale === 'ko' ? '스타터 요약' : locale === 'zh-hant' ? '起始範本摘要' : 'Starter summary',
    templateIdLabel: locale === 'ko' ? '템플릿 ID' : locale === 'zh-hant' ? '範本 ID' : 'Template ID',
    entryKindLabel: locale === 'ko' ? '진입 종류' : locale === 'zh-hant' ? '進入種類' : 'Entry kind',
    currentSupportLabel: locale === 'ko' ? '현재 지원' : locale === 'zh-hant' ? '目前支援' : 'Current support',
    categoryLabel: locale === 'ko' ? '카테고리' : locale === 'zh-hant' ? '類別' : 'Category',
    useStarterTitle: locale === 'ko' ? '이 스타터 사용' : locale === 'zh-hant' ? '使用此起始範本' : 'Use this starter',
    builderPagePrefix: (pageKey: string) =>
      locale === 'ko'
        ? `빌더 페이지 ${pageKey}`
        : locale === 'zh-hant'
          ? `建構器頁面 ${pageKey}`
          : `builder page ${pageKey}`,
    dynamicRouteBackedLabel:
      locale === 'ko' ? '동적 경로 기반 스타터' : locale === 'zh-hant' ? '由動態路由支援的起始範本' : 'dynamic route-backed starter',
    noDynamicTemplateLabel:
      locale === 'ko'
        ? '동적 템플릿 소유권 항목 없음'
        : locale === 'zh-hant'
          ? '沒有動態範本擁有權條目'
          : 'no dynamic template ownership entry',
    openInBuilderLabel: locale === 'ko' ? '빌더에서 열기' : locale === 'zh-hant' ? '在建構器中開啟' : 'Open in builder',
    openPreviewLabel:
      locale === 'ko' ? '빌더 미리보기 열기' : locale === 'zh-hant' ? '開啟建構器預覽' : 'Open builder preview',
    openOwnershipDetailLabel:
      locale === 'ko' ? '소유권 상세 열기' : locale === 'zh-hant' ? '開啟擁有權詳情' : 'Open ownership detail',
    openLiveRouteLabel: locale === 'ko' ? '라이브 경로 열기' : locale === 'zh-hant' ? '開啟即時路由' : 'Open live route',
  } as const;
}
