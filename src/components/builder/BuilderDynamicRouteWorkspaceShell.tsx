import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import type { BuilderSiteOverview } from '@/lib/builder/site';
import type { BuilderDynamicRouteDetail } from '@/lib/builder/dynamic-routes';
import {
  buildBuilderCollectionHref,
  buildBuilderDynamicRouteHref,
  buildBuilderDynamicTemplateHref,
} from '@/lib/builder/hrefs';
import { getBuilderWorkspaceCopy } from '@/lib/builder/workspace-copy';
import type { Locale } from '@/lib/locales';

export default function BuilderDynamicRouteWorkspaceShell({
  locale,
  overview,
  detail,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
  detail: BuilderDynamicRouteDetail;
}) {
  const templateDetailHref = buildBuilderDynamicTemplateHref(locale, detail.templateId, {
    previewRecordId: detail.previewContext.selectedRecordId,
  });
  const copy = getBuilderWorkspaceCopy(locale);
  const routeCopy = getDynamicRouteWorkspaceCopy(locale);

  return (
    <BuilderWorkspaceFrame
      locale={locale}
      title={`${detail.title} ${routeCopy.routeTitleSuffix}`}
      description={routeCopy.routeDescription}
      activeRail="pages"
      stageUrl={buildBuilderDynamicRouteHref(locale, detail.routeId, {
        previewRecordId: detail.previewContext.selectedRecordId,
      })}
      railItems={[
        { key: 'pages', label: copy.pagesLabel, description: copy.pagesDescription, href: `/${locale}/builder`, active: true },
        { key: 'assets', label: copy.assetsLabel, description: copy.assetsDescription, href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">{routeCopy.registryPill}</span>
          <span className="builder-stage-pill">{routeCopy.kindLabel[detail.kind]}</span>
          <span className="builder-stage-pill">{detail.collectionId}</span>
          <span className="builder-stage-pill">{routeCopy.recordsLabel(detail.recordCount)}</span>
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
          <h2>{copy.dynamicRouteSidebarTitle}</h2>
          <p>{copy.dynamicRouteSidebarDescription}</p>
          <div className="builder-dashboard-nav-list">
            {overview.dynamicRoutes.map((route) => (
              <Link
                key={route.routeId}
                href={buildBuilderDynamicRouteHref(locale, route.routeId)}
                className={`builder-dashboard-nav-card${route.routeId === detail.routeId ? ' is-active' : ''}`}
              >
                <strong>{route.title}</strong>
                <span>{route.collectionTitle}</span>
                <small>{route.pathPattern}</small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{copy.dynamicRoutePolicyTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              {copy.dynamicRoutePolicyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{routeCopy.templateOwnershipTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{routeCopy.templateIdLabel}</dt>
                <dd>{detail.templateId}</dd>
              </div>
              <div>
                <dt>{routeCopy.ownerTypeLabel}</dt>
                <dd>{detail.templateOwnerType}</dd>
              </div>
              <div>
                <dt>{routeCopy.statusLabel}</dt>
                <dd>{detail.templateStatus}</dd>
              </div>
              <div>
                <dt>{routeCopy.detailLabel}</dt>
                <dd>
                  <Link
                    href={templateDetailHref}
                    className="builder-link-inline"
                  >
                    {routeCopy.openTemplateOwnershipLabel}
                  </Link>
                </dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{routeCopy.previewContextTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{routeCopy.statusLabel}</dt>
                <dd>{detail.previewContext.status}</dd>
              </div>
              <div>
                <dt>{routeCopy.selectedRecordLabel}</dt>
                <dd>{detail.previewContext.selectedRecordId ?? 'Not selected'}</dd>
              </div>
              <div>
                <dt>{routeCopy.resolvedPathLabel}</dt>
                <dd>{detail.previewContext.resolvedPath ?? 'No path resolved yet'}</dd>
              </div>
              <div>
                <dt>{routeCopy.collectionLabel}</dt>
                <dd>
                  <Link href={buildBuilderCollectionHref(locale, detail.collectionId)} className="builder-link-inline">
                    {routeCopy.openCollectionDetailLabel}
                  </Link>
                </dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{routeCopy.dynamicSeoTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{routeCopy.statusLabel}</dt>
                <dd>{detail.previewContext.seoPreview.status}</dd>
              </div>
              <div>
                <dt>{routeCopy.seoTitleLabel}</dt>
                <dd>{detail.previewContext.seoPreview.title ?? routeCopy.selectRecordFirstLabel}</dd>
              </div>
              <div>
                <dt>{routeCopy.seoDescriptionLabel}</dt>
                <dd>{detail.previewContext.seoPreview.description ?? routeCopy.noRecordSeoLabel}</dd>
              </div>
              <div>
                <dt>{routeCopy.canonicalPathLabel}</dt>
                <dd>{detail.previewContext.seoPreview.canonicalPath ?? routeCopy.noCanonicalPathLabel}</dd>
              </div>
              <div>
                <dt>{routeCopy.indexingLabel}</dt>
                <dd>{detail.previewContext.seoPreview.noIndex ? routeCopy.noIndexLabel : routeCopy.indexableLabel}</dd>
              </div>
            </dl>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>{routeCopy.routeSummaryTitle}</h2>
          <p>{detail.notes}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.pathPattern}</strong>
              <span>{routeCopy.pathPatternLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.recordCount}</strong>
              <span>{routeCopy.recordsLabel(detail.recordCount)}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.previewContextMode}</strong>
              <span>{routeCopy.previewContextModeLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{detail.templateStatus}</strong>
              <span>{routeCopy.templateStatusLabel}</span>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>{routeCopy.templateOwnershipSeamTitle}</h2>
          <p>{routeCopy.templateOwnershipSeamBody}</p>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.templateId}</strong>
                  <span>{detail.templateOwnerType}</span>
                </div>
                <span className="builder-stage-pill">{detail.templateStatus}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.pathPattern}</span>
                <span>{routeCopy.kindTemplateLabel[detail.kind]}</span>
              </div>
              <div className="builder-dashboard-page-actions">
                <Link
                  href={templateDetailHref}
                  className="builder-action-btn builder-action-btn--primary"
                >
                  {routeCopy.openTemplateOwnershipLabel}
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>{routeCopy.previewContextSeamTitle}</h2>
          <p>{detail.previewContext.note}</p>
          <div className="builder-dashboard-page-list">
            <article className="builder-dashboard-page-card">
              <div className="builder-dashboard-page-head">
                <div>
                  <strong>{detail.previewContext.summary}</strong>
                  <span>{detail.previewContext.status}</span>
                </div>
                <span className="builder-stage-pill">{detail.sourceStatus}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>{detail.pathPattern}</span>
                <span>{detail.previewContext.resolvedPath ?? routeCopy.noResolvedLiveRouteLabel}</span>
              </div>
              <div className="builder-dashboard-page-meta">
                <span>
                  {routeCopy.seoTitlePrefix} {detail.previewContext.seoPreview.title ?? routeCopy.notResolvedLabel}
                </span>
                <span>
                  {routeCopy.canonicalPrefix} {detail.previewContext.seoPreview.canonicalPath ?? routeCopy.notResolvedLabel}
                </span>
              </div>
              {detail.previewContext.resolvedPath ? (
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={detail.previewContext.resolvedPath}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    {routeCopy.openLiveRouteLabel}
                  </Link>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>{routeCopy.previewRecordOptionsTitle}</h2>
          {detail.kind === 'item' ? (
            <>
              <p>{routeCopy.previewRecordOptionsDescription}</p>
              <div className="builder-dashboard-page-list">
                {detail.sampleRecords.map((record) => {
                  const isActive = record.recordId === detail.previewContext.selectedRecordId;

                  return (
                    <article key={record.recordId} className="builder-dashboard-page-card">
                      <div className="builder-dashboard-page-head">
                        <div>
                          <strong>{record.primaryLabel}</strong>
                          <span>{record.secondaryLabel}</span>
                        </div>
                        <span className="builder-stage-pill">{isActive ? 'Selected' : 'Sample record'}</span>
                      </div>
                      <div className="builder-dashboard-page-meta">
                        <span>{record.recordId}</span>
                        <span>{record.routePath}</span>
                      </div>
                      <div className="builder-dashboard-page-meta">
                        <span>
                          {routeCopy.seoTitlePrefix} {record.seo.title}
                        </span>
                        <span>{record.seo.noIndex ? routeCopy.noIndexLabel : routeCopy.indexableLabel}</span>
                      </div>
                      <div className="builder-dashboard-page-actions">
                        <Link
                          href={buildBuilderDynamicRouteHref(locale, detail.routeId, {
                            previewRecordId: record.recordId,
                          })}
                          className="builder-action-btn builder-action-btn--primary"
                        >
                          {routeCopy.usePreviewRecordLabel}
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <p>{routeCopy.noPerRecordPreviewLabel}</p>
          )}
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}

function getDynamicRouteWorkspaceCopy(locale: Locale) {
  const list = locale === 'ko' ? '목록 경로' : locale === 'zh-hant' ? '清單路由' : 'List route';
  const item = locale === 'ko' ? '항목 경로' : locale === 'zh-hant' ? '項目路由' : 'Item route';

  return {
    routeTitleSuffix: locale === 'ko' ? '동적 경로' : locale === 'zh-hant' ? '動態路由' : 'dynamic route',
    routeDescription:
      locale === 'ko'
        ? '레지스트리 + 미리보기 컨텍스트 seam은 연결된 동적 템플릿 편집기 v0와 함께 동작합니다.'
        : locale === 'zh-hant'
          ? '索引 + 預覽情境接縫會連到對應的動態範本編輯器 v0。'
          : 'Registry + preview context seam with a linked dynamic template editor v0.',
    registryPill:
      locale === 'ko' ? '동적 경로 레지스트리' : locale === 'zh-hant' ? '動態路由索引' : 'Dynamic route registry',
    kindLabel: { list, item } as const,
    recordsLabel: (count: number) =>
      locale === 'ko' ? `${count}개 레코드` : locale === 'zh-hant' ? `${count} 筆記錄` : `${count} records`,
    templateOwnershipTitle:
      locale === 'ko' ? '템플릿 소유권' : locale === 'zh-hant' ? '範本擁有權' : 'Template ownership',
    templateIdLabel: locale === 'ko' ? '템플릿 ID' : locale === 'zh-hant' ? '範本 ID' : 'Template ID',
    ownerTypeLabel: locale === 'ko' ? '소유자 유형' : locale === 'zh-hant' ? '擁有者類型' : 'Owner type',
    statusLabel: locale === 'ko' ? '상태' : locale === 'zh-hant' ? '狀態' : 'Status',
    detailLabel: locale === 'ko' ? '상세' : locale === 'zh-hant' ? '詳情' : 'Detail',
    openTemplateOwnershipLabel:
      locale === 'ko' ? '템플릿 소유권 상세 열기' : locale === 'zh-hant' ? '開啟範本擁有權詳情' : 'Open template ownership detail',
    previewContextTitle: locale === 'ko' ? '미리보기 컨텍스트' : locale === 'zh-hant' ? '預覽情境' : 'Preview context',
    selectedRecordLabel: locale === 'ko' ? '선택한 레코드' : locale === 'zh-hant' ? '選取的記錄' : 'Selected record',
    resolvedPathLabel: locale === 'ko' ? '해결된 경로' : locale === 'zh-hant' ? '已解析路徑' : 'Resolved path',
    collectionLabel: locale === 'ko' ? '컬렉션' : locale === 'zh-hant' ? '集合' : 'Collection',
    openCollectionDetailLabel:
      locale === 'ko' ? '컬렉션 상세 열기' : locale === 'zh-hant' ? '開啟集合詳情' : 'Open collection detail',
    dynamicSeoTitle: locale === 'ko' ? '동적 SEO 미리보기' : locale === 'zh-hant' ? '動態 SEO 預覽' : 'Dynamic SEO preview',
    seoTitleLabel: locale === 'ko' ? '제목' : locale === 'zh-hant' ? '標題' : 'Title',
    seoDescriptionLabel: locale === 'ko' ? '설명' : locale === 'zh-hant' ? '說明' : 'Description',
    canonicalPathLabel: locale === 'ko' ? '정식 경로' : locale === 'zh-hant' ? 'Canonical 路徑' : 'Canonical path',
    indexingLabel: locale === 'ko' ? '색인' : locale === 'zh-hant' ? '索引' : 'Indexing',
    noIndexLabel: locale === 'ko' ? '색인 제외' : locale === 'zh-hant' ? '不索引' : 'Noindex',
    indexableLabel: locale === 'ko' ? '색인 가능' : locale === 'zh-hant' ? '可索引' : 'Indexable',
    selectRecordFirstLabel: locale === 'ko' ? '먼저 레코드를 선택하세요' : locale === 'zh-hant' ? '請先選擇一筆記錄' : 'Select a record first',
    noRecordSeoLabel:
      locale === 'ko' ? '아직 레코드 SEO가 해결되지 않았습니다' : locale === 'zh-hant' ? '尚未解析記錄 SEO' : 'No record SEO resolved yet',
    noCanonicalPathLabel:
      locale === 'ko' ? '아직 정식 경로가 해결되지 않았습니다' : locale === 'zh-hant' ? '尚未解析 canonical 路徑' : 'No canonical path resolved yet',
    routeSummaryTitle: locale === 'ko' ? '경로 요약' : locale === 'zh-hant' ? '路由摘要' : 'Route summary',
    pathPatternLabel: locale === 'ko' ? '경로 패턴' : locale === 'zh-hant' ? '路徑模式' : 'Path pattern',
    previewContextModeLabel: locale === 'ko' ? '미리보기 컨텍스트 모드' : locale === 'zh-hant' ? '預覽情境模式' : 'Preview context mode',
    templateStatusLabel: locale === 'ko' ? '템플릿 상태' : locale === 'zh-hant' ? '範本狀態' : 'Template status',
    templateOwnershipSeamTitle:
      locale === 'ko' ? '템플릿 소유권 seam' : locale === 'zh-hant' ? '範本擁有權接縫' : 'Template ownership seam',
    templateOwnershipSeamBody:
      locale === 'ko'
        ? '이 경로는 명시적인 템플릿 소유권 항목으로 연결됩니다. 이 항목은 목록/항목 템플릿을 어떤 코드 경로가 소유하는지 문서화하고, 해당 템플릿의 v0 블록 편집기를 엽니다.'
        : locale === 'zh-hant'
          ? '這個路由現在會對應到明確的範本擁有權條目。該條目會記錄列表／項目範本由哪個程式路由負責，並開啟該範本的 v0 區塊編輯器。'
          : 'This route now maps into an explicit template ownership entry. The entry documents which code route owns the list/item template and opens the v0 block editor for that template.',
    kindTemplateLabel: { list: list === '목록 경로' ? '목록 템플릿' : list === '清單路由' ? '清單範本' : 'List template', item: item === '항목 경로' ? '항목 템플릿' : item === '項目路由' ? '項目範本' : 'Item template' } as const,
    openRouteDetailLabel:
      locale === 'ko' ? '경로 상세 열기' : locale === 'zh-hant' ? '開啟路由詳情' : 'Open route detail',
    openLiveRouteLabel:
      locale === 'ko' ? '라이브 경로 열기' : locale === 'zh-hant' ? '開啟即時路由' : 'Open live route',
    previewContextSeamTitle:
      locale === 'ko' ? '미리보기 컨텍스트 접합' : locale === 'zh-hant' ? '預覽情境接縫' : 'Preview context seam',
    noResolvedLiveRouteLabel:
      locale === 'ko' ? '해결된 라이브 경로 없음' : locale === 'zh-hant' ? '尚未解析即時路由' : 'No resolved live route',
    seoTitlePrefix: locale === 'ko' ? 'SEO 제목:' : locale === 'zh-hant' ? 'SEO 標題：' : 'SEO title:',
    canonicalPrefix: locale === 'ko' ? '정식 경로:' : locale === 'zh-hant' ? 'Canonical 路徑：' : 'Canonical:',
    notResolvedLabel: locale === 'ko' ? '미해결' : locale === 'zh-hant' ? '未解析' : 'Not resolved',
    previewRecordOptionsTitle:
      locale === 'ko' ? '미리보기 레코드 선택' : locale === 'zh-hant' ? '預覽記錄選項' : 'Preview record options',
    previewRecordOptionsDescription:
      locale === 'ko'
        ? '레코드를 선택하면 미리보기 컨텍스트가 해결되고 연결된 동적 템플릿 편집기에서 사용할 수 있습니다.'
        : locale === 'zh-hant'
          ? '選取記錄會解析預覽情境，並可用於連結的動態範本編輯器。'
          : 'Selecting a record resolves preview context and can be used in the linked dynamic template editor.',
    usePreviewRecordLabel:
      locale === 'ko' ? '미리보기 레코드 사용' : locale === 'zh-hant' ? '使用預覽記錄' : 'Use preview record',
    noPerRecordPreviewLabel:
      locale === 'ko'
        ? '목록 경로는 컬렉션 범위로 유지되므로 이번 배치에서는 미리보기 레코드 선택기가 필요하지 않습니다.'
        : locale === 'zh-hant'
          ? '清單路由維持集合範圍，因此此批次不需要逐筆預覽選擇器。'
          : 'List routes stay collection-scoped in this batch, so no preview record chooser is needed.',
  } as const;
}
