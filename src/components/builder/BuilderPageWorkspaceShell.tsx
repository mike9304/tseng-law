import type { ReactNode } from 'react';
import Link from 'next/link';
import BuilderAdvancedDisclosure from '@/components/builder/BuilderAdvancedDisclosure';
import BuilderPagePublishReadiness from '@/components/builder/BuilderPagePublishReadiness';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import BuilderDatasetSeedAction from '@/components/builder/datasets/BuilderDatasetSeedAction';
import BuilderPageDatasetSeedAllAction from '@/components/builder/datasets/BuilderPageDatasetSeedAllAction';
import { buildBuilderCollectionHref, buildBuilderPageDatasetHref, buildBuilderPageSceneHref } from '@/lib/builder/hrefs';
import {
  buildBuilderPageHref,
  type BuilderEditorMode,
  type BuilderSitePageSummary,
  type BuilderSiteSummary,
  type BuilderWorkspaceSummary,
} from '@/lib/builder/site';
import type { BuilderPageDatasetOverview } from '@/lib/builder/datasets';
import type { BuilderPageKey } from '@/lib/builder/types';
import type { BuilderPublishValidationIssue } from '@/lib/builder/validation';
import type { Locale } from '@/lib/locales';
import { getBuilderWorkspaceCopy } from '@/lib/builder/workspace-copy';

export default function BuilderPageWorkspaceShell({
  locale,
  pageKey,
  title,
  description,
  requestedMode,
  availableModes,
  editable,
  site,
  pages,
  datasetOverviews,
  publishSnapshot,
  publishValidation,
  snapshot,
  policyNotes,
  children,
}: {
  locale: Locale;
  pageKey: BuilderPageKey;
  title: string;
  description: string;
  requestedMode: BuilderEditorMode;
  availableModes: BuilderEditorMode[];
  editable: boolean;
  workspace: BuilderWorkspaceSummary;
  site: BuilderSiteSummary;
  pages: BuilderSitePageSummary[];
  datasetOverviews: BuilderPageDatasetOverview[];
  publishSnapshot: {
    draft: { persisted: boolean; revision: number; savedAt: string | null };
    published: { persisted: boolean; revision: number; savedAt: string | null };
  };
  publishValidation?: {
    passed: boolean;
    issues: BuilderPublishValidationIssue[];
  };
  snapshot: {
    persisted: boolean;
    kind: 'draft' | 'published';
    revision: number;
    savedAt: string | null;
  };
  policyNotes: string[];
  children: ReactNode;
}) {
  const copy = getBuilderWorkspaceCopy(locale);
  const pageCopy = getPageWorkspaceCopy(locale);
  const currentPage =
    pages.find((candidate) => candidate.pageKey === pageKey) ??
    createFallbackPageSummary({
      locale,
      pageKey,
      title,
      description,
      editable,
      availableModes,
    });
  const modeSwitchLinks = availableModes.filter((mode) => mode !== requestedMode);

  return (
    <BuilderWorkspaceFrame
      locale={locale}
      title={title}
      description={description}
      activeRail="pages"
      surfaceTone="canvas-priority"
      stageUrl={buildBuilderPageHref(locale, pageKey, requestedMode)}
      railItems={[
        { key: 'pages', label: copy.pagesLabel, description: copy.pagesDescription, href: `/${locale}/builder`, active: true },
        { key: 'assets', label: copy.assetsLabel, description: copy.assetsDescription, href: `/${locale}/builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">{pageCopy.modeLabel[requestedMode]}</span>
          <span className="builder-stage-pill">
            {snapshot.persisted
              ? `${pageCopy.snapshotKindLabel[snapshot.kind]} v${snapshot.revision}`
              : pageCopy.defaultSchemaLabel}
          </span>
          {modeSwitchLinks.map((mode) => (
            <Link
              key={mode}
              href={buildBuilderPageHref(locale, pageKey, mode)}
              className="builder-stage-pill"
            >
              {pageCopy.modeLabel[mode]}
            </Link>
          ))}
        </>
      }
      rightMeta={
        <span>
          {site.name} · {currentPage.publicPath}
        </span>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>{copy.pageSidebarTitle}</h2>
          <div className="builder-dashboard-nav-list">
            {pages.map((page) => (
              <Link
                key={page.pageKey}
                href={buildBuilderPageHref(locale, page.pageKey, getPageNavMode(page.availableModes, requestedMode))}
                className={`builder-dashboard-nav-card${page.pageKey === pageKey ? ' is-active' : ''}`}
              >
                <strong>{page.title}</strong>
                <span>{page.editable ? pageCopy.editableLabel : pageCopy.previewOnlyLabel}</span>
                <small>
                  {page.sectionCount} {pageCopy.sectionsLabel}
                </small>
              </Link>
            ))}
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{pageCopy.canvasFocusTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              {pageCopy.canvasFocusItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{pageCopy.modePolicyTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{pageCopy.modePolicySourceLabel}</dt>
                <dd>{snapshot.persisted ? pageCopy.snapshotKindLabel[snapshot.kind] : pageCopy.defaultDocumentLabel}</dd>
              </div>
              <div>
                <dt>{pageCopy.modePolicyRevisionLabel}</dt>
                <dd>v{snapshot.revision}</dd>
              </div>
              <div>
                <dt>{pageCopy.modePolicySavedLabel}</dt>
                <dd>{snapshot.persisted ? snapshot.savedAt : pageCopy.notPersistedLabel}</dd>
              </div>
              <div>
                <dt>{pageCopy.modePolicyPublicPathLabel}</dt>
                <dd>{currentPage.publicPath}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{pageCopy.publishReadinessTitle}</h2>
            {publishValidation ? (
              <BuilderPagePublishReadiness
                locale={locale}
                siteId={site.id}
                pageKey={pageKey}
                initialResult={publishValidation}
                publishSnapshot={publishSnapshot}
              />
            ) : (
              <ul className="builder-preview-inspector-notes">
                <li>{pageCopy.publishReadinessUnavailable}</li>
              </ul>
            )}
          </section>
          <section className="builder-preview-inspector-card">
            <BuilderAdvancedDisclosure
              title={pageCopy.pageDiagnosticsTitle}
              summary={pageCopy.pageDiagnosticsSummary}
            >
              <div className="builder-page-shell-diagnostics">
                <section className="builder-page-shell-diagnostics-section">
                  <h3>{pageCopy.modePolicyTitle}</h3>
                  <ul className="builder-preview-inspector-notes">
                    {policyNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </section>
                <section className="builder-page-shell-diagnostics-section">
                  <h3>{pageCopy.datasetSeamsTitle}</h3>
                  {datasetOverviews.length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      <BuilderPageDatasetSeedAllAction
                        locale={locale}
                        siteId={site.id}
                        pageKey={pageKey}
                        targets={datasetOverviews}
                      />
                    </div>
                  ) : null}
                  {datasetOverviews.length > 0 ? (
                    <div className="builder-preview-inspector-list">
                      {datasetOverviews.map((item) => (
                        <div key={item.targetId} data-builder-dataset-seam={item.targetId}>
                          <dt>{item.title}</dt>
                          <dd>
                            {item.currentBinding.collectionId} · {item.currentBinding.mode}
                            {typeof item.currentBinding.limit === 'number'
                              ? ` · limit ${item.currentBinding.limit}`
                              : ''}
                          </dd>
                          <dd>
                            Filters:{' '}
                            {item.currentBinding.filters?.length
                              ? item.currentBinding.filters
                                  .map((filter) => `${filter.fieldId} ${filter.operator} ${filter.value}`)
                                  .join(' + ')
                              : 'none'}
                            {' · '}
                            Sort:{' '}
                            {item.currentBinding.sort?.length
                              ? item.currentBinding.sort
                                  .map((sort) => `${sort.fieldId} ${sort.direction}`)
                                  .join(', ')
                              : 'original'}
                          </dd>
                          <dd>{item.description}</dd>
                          <dd>
                            {pageCopy.repeaterPreviewLabel}:{' '}
                            {item.repeaterItems.length > 0
                              ? item.repeaterItems
                                  .slice(0, 3)
                                  .map((record) => record.title)
                                  .join(' / ')
                              : pageCopy.noSampleRecordsLabel}
                          </dd>
                          {item.repeaterItems.length === 0 ? (
                            <dd style={{ color: '#b45309' }}>
                              {pageCopy.publishWarningLabel}
                            </dd>
                          ) : null}
                          <dd>
                            <Link
                              href={buildBuilderCollectionHref(locale, item.currentBinding.collectionId)}
                              className="builder-link-inline"
                            >
                              {pageCopy.openCollectionDetailLabel}
                            </Link>
                          </dd>
                          <dd>
                            <Link
                              href={buildBuilderPageDatasetHref(locale, pageKey, { targetId: item.targetId })}
                              className="builder-action-btn builder-action-btn--primary"
                              data-builder-dataset-seam-primary-link={item.targetId}
                              style={{ justifySelf: 'start', textDecoration: 'none' }}
                            >
                              {pageCopy.openTargetPrefix} {item.title}
                            </Link>
                          </dd>
                          <dd>
                            <BuilderDatasetSeedAction
                              locale={locale}
                              siteId={site.id}
                              pageKey={pageKey}
                              targetId={item.targetId}
                            />
                          </dd>
                          {datasetOverviews.filter((candidate) => candidate.targetId !== item.targetId).length > 0 ? (
                            <dd>
                              <div className="builder-dashboard-page-actions">
                                <span className="builder-stage-pill">{pageCopy.copyDraftFromLabel}</span>
                                {datasetOverviews
                                  .filter((candidate) => candidate.targetId !== item.targetId)
                                  .map((candidate) => (
                                    <Link
                                      key={candidate.targetId}
                                      href={buildBuilderPageDatasetHref(locale, pageKey, {
                                        targetId: item.targetId,
                                        copyFromTargetId: candidate.targetId,
                                      })}
                                      className="builder-action-btn"
                                    >
                                      {candidate.title}
                                    </Link>
                                  ))}
                              </div>
                            </dd>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="builder-preview-inspector-notes">
                      <li>{pageCopy.noDatasetSeamsLabel}</li>
                    </ul>
                  )}
                </section>
                <section className="builder-page-shell-diagnostics-section">
                  <h3>{pageCopy.sceneDiagnosticsTitle}</h3>
                  <ul className="builder-preview-inspector-notes">
                    {pageCopy.sceneDiagnosticsItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                    <li>
                      <Link href={buildBuilderPageSceneHref(locale, pageKey)} className="builder-link-inline">
                        {pageCopy.openAdvancedSceneViewLabel}
                      </Link>
                    </li>
                  </ul>
                </section>
              </div>
            </BuilderAdvancedDisclosure>
          </section>
        </>
      }
    >
      <div className="builder-dashboard-canvas-copy">{children}</div>
    </BuilderWorkspaceFrame>
  );
}

function getPageNavMode(availableModes: BuilderEditorMode[], requestedMode: BuilderEditorMode): BuilderEditorMode {
  return availableModes.includes(requestedMode) ? requestedMode : availableModes[0] ?? 'preview';
}

function createFallbackPageSummary({
  locale,
  pageKey,
  title,
  description,
  editable,
  availableModes,
}: {
  locale: Locale;
  pageKey: BuilderPageKey;
  title: string;
  description: string;
  editable: boolean;
  availableModes: BuilderEditorMode[];
}) {
  const publicPath = pageKey === 'home' ? `/${locale}` : `/${locale}/${pageKey}`;

  return {
    pageId: `fallback:${pageKey}`,
    pageKey,
    pageType: 'static',
    routeType: 'static',
    routeSegment: pageKey === 'home' ? '' : pageKey,
    parentPageKey: null,
    specialRole: pageKey === 'home' ? 'homepage' : null,
    title,
    description,
    editable,
    availableModes,
    publicPath,
    builderPath: buildBuilderPageHref(locale, pageKey, availableModes[0] ?? 'preview'),
    draftPersisted: false,
    publishedPersisted: false,
    draftRevision: 0,
    publishedRevision: 0,
    draftSavedAt: null,
    publishedSavedAt: null,
    sectionCount: 0,
    datasetCount: 0,
  } satisfies BuilderSitePageSummary;
}

function getPageWorkspaceCopy(locale: Locale) {
  return {
    modeLabel:
      locale === 'ko'
        ? { edit: '편집 모드', preview: '미리보기 모드', 'publish-review': '게시 검토 모드' }
        : locale === 'zh-hant'
          ? { edit: '編輯模式', preview: '預覽模式', 'publish-review': '發佈審查模式' }
          : { edit: 'Edit mode', preview: 'Preview mode', 'publish-review': 'Publish review mode' },
    snapshotKindLabel:
      locale === 'ko'
        ? { draft: '초안', published: '게시본' }
        : locale === 'zh-hant'
          ? { draft: '草稿', published: '已發佈' }
          : { draft: 'draft', published: 'published' },
    defaultSchemaLabel: locale === 'ko' ? '기본 스키마' : locale === 'zh-hant' ? '預設結構' : 'default schema',
    editableLabel: locale === 'ko' ? '편집 가능' : locale === 'zh-hant' ? '可編輯' : 'Editable',
    previewOnlyLabel: locale === 'ko' ? '미리보기 전용' : locale === 'zh-hant' ? '僅供預覽' : 'Preview only',
    sectionsLabel: locale === 'ko' ? '섹션' : locale === 'zh-hant' ? '區段' : 'sections',
    canvasFocusTitle: locale === 'ko' ? '캔버스 포커스' : locale === 'zh-hant' ? '畫布焦點' : 'Canvas focus',
    canvasFocusItems:
      locale === 'ko'
        ? ['단계를 기본 편집 표면으로 사용하세요.', '페이지 진단은 캔버스와 경쟁하지 않으면서 아래에서 계속 접근할 수 있습니다.']
        : locale === 'zh-hant'
          ? ['請將舞台作為主要編輯區域。', '頁面診斷仍可在下方存取，不會和畫布競爭。']
          : ['Use the stage as the primary editing surface.', 'Page diagnostics stay reachable below without competing with the canvas.'],
    modePolicyTitle: locale === 'ko' ? '모드 정책' : locale === 'zh-hant' ? '模式政策' : 'Mode policy',
    modePolicySourceLabel: locale === 'ko' ? '출처' : locale === 'zh-hant' ? '來源' : 'Source',
    modePolicyRevisionLabel: locale === 'ko' ? '리비전' : locale === 'zh-hant' ? '修訂版' : 'Revision',
    modePolicySavedLabel: locale === 'ko' ? '저장' : locale === 'zh-hant' ? '儲存時間' : 'Saved',
    modePolicyPublicPathLabel: locale === 'ko' ? '공개 경로' : locale === 'zh-hant' ? '公開路徑' : 'Public path',
    defaultDocumentLabel: locale === 'ko' ? '기본 문서' : locale === 'zh-hant' ? '預設文件' : 'default document',
    notPersistedLabel: locale === 'ko' ? '아직 지속 저장되지 않음' : locale === 'zh-hant' ? '尚未持久化' : 'Not persisted yet',
    publishReadinessTitle: locale === 'ko' ? '게시 준비도' : locale === 'zh-hant' ? '發佈就緒度' : 'Publish readiness',
    publishReadinessUnavailable:
      locale === 'ko'
        ? '이 스냅샷에서는 게시 검사를 사용할 수 없습니다.'
        : locale === 'zh-hant'
          ? '此快照無法使用發佈檢查。'
          : 'Publish checks are unavailable for this snapshot.',
    pageDiagnosticsTitle: locale === 'ko' ? '페이지 진단' : locale === 'zh-hant' ? '頁面診斷' : 'Page diagnostics',
    pageDiagnosticsSummary:
      locale === 'ko'
        ? '모드, 데이터셋 seam, scene 진단은 기본 편집 경로를 방해하지 않으면서 여기서 계속 접근할 수 있습니다.'
        : locale === 'zh-hant'
          ? '模式、資料集接縫與 scene 診斷都可在此保留，不會搶走主要編輯路徑。'
          : 'Modes, dataset seams, and scene diagnostics stay reachable here without taking over the main editing route.',
    datasetSeamsTitle: locale === 'ko' ? '데이터셋 seam' : locale === 'zh-hant' ? '資料集接縫' : 'Dataset seams',
    noDatasetSeamsLabel:
      locale === 'ko'
        ? '이 페이지에서는 접근 가능한 데이터셋 seam이 없습니다.'
        : locale === 'zh-hant'
          ? '此頁面目前沒有可連到的資料集接縫。'
          : 'No dataset seams are reachable on this page yet.',
    repeaterPreviewLabel: locale === 'ko' ? '반복기 미리보기' : locale === 'zh-hant' ? '重複器預覽' : 'Repeater preview',
    noSampleRecordsLabel: locale === 'ko' ? '레코드 없음' : locale === 'zh-hant' ? '沒有記錄' : 'No records',
    publishWarningLabel:
      locale === 'ko'
        ? '게시 경고: 이 seam에는 아직 샘플 레코드가 없습니다.'
        : locale === 'zh-hant'
          ? '發佈警告：此接縫目前還沒有範例記錄。'
          : 'Publish warning: this seam has no sample records yet.',
    openCollectionDetailLabel: locale === 'ko' ? '컬렉션 상세 열기' : locale === 'zh-hant' ? '開啟集合詳情' : 'Open collection detail',
    openTargetPrefix: locale === 'ko' ? '열기' : locale === 'zh-hant' ? '開啟' : 'Open',
    copyDraftFromLabel: locale === 'ko' ? '초안 복사 대상' : locale === 'zh-hant' ? '複製草稿自' : 'Copy draft from',
    sceneDiagnosticsTitle: locale === 'ko' ? 'Scene 진단' : locale === 'zh-hant' ? 'Scene 診斷' : 'Scene diagnostics',
    sceneDiagnosticsItems:
      locale === 'ko'
        ? ['캔버스 우선 코어는 현재의 semantic-section 런타임을 실제 scene graph로 대체할 예정입니다.']
        : locale === 'zh-hant'
          ? ['以畫布為先的核心將以真實的 scene graph 取代目前的 semantic-section runtime。']
          : ['The canvas-first core will replace the current semantic-section runtime with a real scene graph.'],
    openAdvancedSceneViewLabel:
      locale === 'ko' ? '고급 scene 보기 열기' : locale === 'zh-hant' ? '開啟進階 scene 檢視' : 'Open advanced scene view',
  } as const;
}
