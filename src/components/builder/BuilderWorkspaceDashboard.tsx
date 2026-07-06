import Link from 'next/link';
import BuilderInspectorAssetLibraryPanel from '@/components/builder/BuilderInspectorAssetLibraryPanel';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import {
  buildBuilderCollectionHref,
  buildBuilderDynamicRouteHref,
  buildBuilderDynamicTemplateHref,
  buildBuilderStarterTemplateHref,
} from '@/lib/builder/hrefs';
import { buildBuilderPageHref, type BuilderSiteOverview } from '@/lib/builder/site';
import type { Locale } from '@/lib/locales';

type BuilderWorkspaceDashboardCopy = {
  title: string;
  description: string;
  navigationLabel: string;
  footerLabel: string;
  footerDescription: string;
  routeLabel: string;
  leftRailPagesLabel: string;
  leftRailPagesDescription: string;
  leftRailAssetsLabel: string;
  leftRailAssetsDescription: string;
  workspacePillLabel: string;
  sitePillLabel: string;
  schemaPillLabel: string;
  siteVersionPillLabel: string;
  siteLocaleLabel: string;
  pagesSectionTitle: string;
  pagesSectionDescription: string;
  staticTopologyTitle: string;
  staticTopologyStatus: string;
  staticTopologyDescription: string;
  cmsInventoryTitle: string;
  cmsInventoryStatus: string;
  cmsInventoryDescription: string;
  dynamicRoutesTitle: string;
  dynamicRoutesStatus: string;
  dynamicRoutesDescription: string;
  dynamicTemplatesTitle: string;
  dynamicTemplatesStatus: string;
  dynamicTemplatesDescription: string;
  starterTemplateTitle: string;
  starterTemplateStatus: string;
  starterTemplateDescription: string;
  appMarketLabel: string;
  appMarketDescription: string;
  aiGeneratorLabel: string;
  aiGeneratorDescription: string;
  openAppMarketLabel: string;
  openAppMarketDescription: string;
  openAiGeneratorLabel: string;
  openAiGeneratorDescription: string;
  workspaceSectionTitle: string;
  workspaceIdLabel: string;
  ownerLabel: string;
  siteIdLabel: string;
  schemaPagesLabel: string;
  collectionsLabel: string;
  dynamicRoutesCountLabel: string;
  dynamicTemplatesCountLabel: string;
  starterTemplatesCountLabel: string;
  staticRoutePolicyTitle: string;
  staticRoutePolicyValidLabel: string;
  staticRoutePolicyValidValue: string;
  staticRoutePolicyInvalidValue: string;
  staticRoutePolicyNoteOne: string;
  staticRoutePolicyNoteTwo: string;
  scopeLockTitle: string;
  scopeLockNoteOne: string;
  scopeLockNoteTwo: string;
  scopeLockNoteThree: string;
  siteOverviewTitle: string;
  builderPagesLabel: string;
  sharedDraftsLabel: string;
  publishedSnapshotsLabel: string;
  recentAssetsLabel: string;
  readOnlyCollectionsLabel: string;
  dynamicRouteRegistryLabel: string;
  dynamicTemplateOwnershipLabel: string;
  starterTemplatesLabel: string;
  appMarketKpiLabel: string;
  aiSiteGeneratorKpiLabel: string;
  starterTemplateGalleryTitle: string;
  starterTemplateGalleryDescription: string;
  starterSupportEditable: string;
  starterSupportPreview: string;
  starterSupportOwnership: string;
  openStarterDetailLabel: string;
  staticPageTopologyTitle: string;
  staticPageTopologyDescription: string;
  editModeLabel: string;
  previewModeLabel: string;
  homepageLabel: string;
  pageIdLabel: string;
  routeLabelPrefix: string;
  routeSegmentLabel: string;
  roleLabel: string;
  publicRouteLabel: string;
  datasetsLabel: string;
  draftVersionLabel: string;
  publishedVersionLabel: string;
  openEditorLabel: string;
  openPreviewLabel: string;
  cmsInventoryKickoffTitle: string;
  cmsInventoryKickoffDescription: string;
  openContentManagerLabel: string;
  localizedLabel: string;
  sharedLabel: string;
  sourceLabel: string;
  routeBindingsLabel: string;
  fieldSampleLabel: string;
  builderPathLabel: string;
  openReadOnlyDetailLabel: string;
  relationsPresentLabel: string;
  noRelationsLabel: string;
  dynamicRoutesInventoryTitle: string;
  dynamicRoutesInventoryDescription: string;
  dynamicRoutesListRouteLabel: string;
  dynamicRoutesItemRouteLabel: string;
  routeIdLabel: string;
  dynamicRouteSlugLabel: string;
  dynamicRoutePageLabel: string;
  dynamicRouteCollectionsLabel: string;
  dynamicRouteTemplateLabel: string;
  dynamicRoutePublicPathLabel: string;
  dynamicRoutePreviewLabel: string;
  dynamicTemplatesInventoryTitle: string;
  dynamicTemplatesInventoryDescription: string;
  dynamicTemplatesListTemplateLabel: string;
  dynamicTemplatesItemTemplateLabel: string;
  dynamicTemplateIdLabel: string;
  dynamicTemplateOwnerLabel: string;
  dynamicTemplateRouteLabel: string;
  dynamicTemplateOpenLabel: string;
  dynamicTemplatePublishLabel: string;
  routeValidationTitle: string;
  routeValidationDescription: string;
  routeValidationOkLabel: string;
  routeValidationIssueSiteLevel: string;
};

const builderWorkspaceDashboardCopy: Record<Locale, BuilderWorkspaceDashboardCopy> = {
  ko: {
    title: '빌더 작업 공간',
    description: '단일 내부 작업 공간, 단일 기준 사이트, 명시적인 페이지 진입점.',
    navigationLabel: '빌더 탐색',
    footerLabel: '빌더',
    footerDescription: '실제 시스템만 사용합니다. 가짜 탭은 없습니다.',
    routeLabel: '빌더 기준 경로',
    leftRailPagesLabel: '페이지',
    leftRailPagesDescription: '실제 경로',
    leftRailAssetsLabel: '에셋',
    leftRailAssetsDescription: '최근 빌더 미디어',
    workspacePillLabel: '작업 공간',
    sitePillLabel: '사이트',
    schemaPillLabel: '스키마',
    siteVersionPillLabel: '사이트 버전',
    siteLocaleLabel: '언어',
    pagesSectionTitle: '페이지',
    pagesSectionDescription: 'WAVE-01은 페이지 진입점을 명시적으로 유지합니다. 실제 페이지 모델이 있는 경로만 여기에 표시됩니다.',
    staticTopologyTitle: '정적 페이지 토폴로지',
    staticTopologyStatus: '읽기 전용',
    staticTopologyDescription: '레지스트리와 경로 인벤토리',
    cmsInventoryTitle: 'CMS 인벤토리',
    cmsInventoryStatus: '읽기 전용',
    cmsInventoryDescription: '아직 빌더 편집 경로 없음',
    dynamicRoutesTitle: '동적 경로',
    dynamicRoutesStatus: '레지스트리만',
    dynamicRoutesDescription: '미리보기 컨텍스트 경계',
    dynamicTemplatesTitle: '동적 템플릿',
    dynamicTemplatesStatus: '소유권만',
    dynamicTemplatesDescription: '코드 경로 템플릿 레지스트리',
    starterTemplateTitle: '스타터 템플릿',
    starterTemplateStatus: '템플릿 우선',
    starterTemplateDescription: '실제 시작점만 제공',
    appMarketLabel: '앱 마켓',
    appMarketDescription: '설치 및 관리',
    aiGeneratorLabel: 'AI 사이트 생성기',
    aiGeneratorDescription: '프롬프트에서 사이트맵으로',
    openAppMarketLabel: '앱 마켓 열기',
    openAppMarketDescription: '앱을 둘러보고 설치, 활성화, 비활성화, 제거합니다.',
    openAiGeneratorLabel: 'AI 사이트 생성기 열기',
    openAiGeneratorDescription: '사이트맵, 콘텐츠 계획, 편집 가능한 첫 초안을 생성합니다.',
    workspaceSectionTitle: '작업 공간',
    workspaceIdLabel: '작업 공간 ID',
    ownerLabel: '소유자',
    siteIdLabel: '사이트 ID',
    schemaPagesLabel: '스키마 페이지',
    collectionsLabel: '컬렉션',
    dynamicRoutesCountLabel: '동적 경로',
    dynamicTemplatesCountLabel: '동적 템플릿',
    starterTemplatesCountLabel: '스타터 템플릿',
    staticRoutePolicyTitle: '정적 경로 정책',
    staticRoutePolicyValidLabel: '현재 검증 상태',
    staticRoutePolicyValidValue: '유효한 정적 페이지 레지스트리',
    staticRoutePolicyInvalidValue: '경로 문제 감지됨',
    staticRoutePolicyNoteOne: '슬러그 편집과 페이지 복제는 런타임 경로 소유권이 실제가 될 때까지 보류됩니다.',
    staticRoutePolicyNoteTwo: 'WAVE-03-B01은 실제 인벤토리만 노출합니다. 가짜 데이터셋 바인딩이나 동적 페이지 편집 UI는 없습니다.',
    scopeLockTitle: 'WAVE 01 범위 잠금',
    scopeLockNoteOne: '에디터 코어만: 작업 공간/사이트 모델, 셸, 초안 상태, 미리보기 경계.',
    scopeLockNoteTwo: '실제 시스템이 생기기 전에는 Components나 CMS 탭을 추가하지 않습니다.',
    scopeLockNoteThree: 'About과 Contact는 실제 인터랙티브 편집이 들어올 때까지 미리보기 전용입니다.',
    siteOverviewTitle: '사이트 개요',
    builderPagesLabel: '빌더 페이지',
    sharedDraftsLabel: '공유 초안',
    publishedSnapshotsLabel: '게시된 스냅샷',
    recentAssetsLabel: '최근 에셋',
    readOnlyCollectionsLabel: '읽기 전용 컬렉션',
    dynamicRouteRegistryLabel: '동적 경로 레지스트리',
    dynamicTemplateOwnershipLabel: '동적 템플릿 소유권',
    starterTemplatesLabel: '스타터 템플릿',
    appMarketKpiLabel: '앱 마켓',
    aiSiteGeneratorKpiLabel: 'AI 사이트 생성기',
    starterTemplateGalleryTitle: '스타터 템플릿 갤러리',
    starterTemplateGalleryDescription: '실제 시작점만 제공합니다. 각 카드에는 현재 항목이 지금 편집 가능한지, 지금 미리볼 수 있는지, 또는 소유권 상세만 통해 관리되는지 표시됩니다.',
    starterSupportEditable: '지금 편집 가능',
    starterSupportPreview: '지금 미리보기 가능',
    starterSupportOwnership: '소유권만',
    openStarterDetailLabel: '스타터 상세 열기',
    staticPageTopologyTitle: '정적 페이지 토폴로지',
    staticPageTopologyDescription: '현재 빌더 사이트 레지스트리에 있는 정적 페이지만 표시됩니다. 슬러그 변경과 복제는 보류됩니다.',
    editModeLabel: '편집 가능',
    previewModeLabel: '미리보기 전용',
    homepageLabel: '홈페이지',
    pageIdLabel: '페이지 ID',
    routeLabelPrefix: '경로',
    routeSegmentLabel: '세그먼트',
    roleLabel: '역할',
    publicRouteLabel: '공개 경로',
    datasetsLabel: '데이터셋',
    draftVersionLabel: '초안 v',
    publishedVersionLabel: '게시 v',
    openEditorLabel: '편집기 열기',
    openPreviewLabel: '미리보기 열기',
    cmsInventoryKickoffTitle: 'CMS 인벤토리 시작',
    cmsInventoryKickoffDescription: '정적 소스 컬렉션은 읽기 전용으로 유지되고, 편집 가능한 CMS 컬렉션은 Content Manager에서 관리됩니다.',
    openContentManagerLabel: 'Content Manager 열기',
    localizedLabel: '현지화됨',
    sharedLabel: '공유',
    sourceLabel: '소스',
    routeBindingsLabel: '경로 바인딩',
    fieldSampleLabel: '필드 샘플',
    builderPathLabel: '빌더 경로',
    openReadOnlyDetailLabel: '읽기 전용 상세 열기',
    relationsPresentLabel: '관계 있음',
    noRelationsLabel: '관계 없음',
    dynamicRoutesInventoryTitle: '동적 경로 인벤토리',
    dynamicRoutesInventoryDescription: '레지스트리만 제공합니다. 이 항목은 경로 소유권과 미리보기 컨텍스트 경계를 증명하지만 아직 동적 페이지 템플릿을 의미하지는 않습니다.',
    dynamicRoutesListRouteLabel: '목록 경로',
    dynamicRoutesItemRouteLabel: '항목 경로',
    routeIdLabel: '경로 ID',
    dynamicRouteSlugLabel: '슬러그',
    dynamicRoutePageLabel: '페이지',
    dynamicRouteCollectionsLabel: '컬렉션',
    dynamicRouteTemplateLabel: '템플릿',
    dynamicRoutePublicPathLabel: '공개 경로',
    dynamicRoutePreviewLabel: '미리보기',
    dynamicTemplatesInventoryTitle: '동적 템플릿 인벤토리',
    dynamicTemplatesInventoryDescription: '템플릿 소유권은 코드 경로와 직접 연결됩니다. 실제 동적 페이지 편집 흐름이 들어오기 전에는 미리보기와 소유권 정보만 제공합니다.',
    dynamicTemplatesListTemplateLabel: '목록 템플릿',
    dynamicTemplatesItemTemplateLabel: '항목 템플릿',
    dynamicTemplateIdLabel: '템플릿 ID',
    dynamicTemplateOwnerLabel: '소유자',
    dynamicTemplateRouteLabel: '연결 경로',
    dynamicTemplateOpenLabel: '템플릿 열기',
    dynamicTemplatePublishLabel: '게시',
    routeValidationTitle: '경로 검증',
    routeValidationDescription: '현재 정적 페이지 레지스트리는 중복 공개 경로와 홈페이지 역할 규칙을 기준으로 검증됩니다.',
    routeValidationOkLabel: '모든 정적 페이지 경로가 유효합니다',
    routeValidationIssueSiteLevel: '사이트 수준',
  },
  'zh-hant': {
    title: '建構器工作區',
    description: '單一內部工作區、單一權威網站、明確的頁面入口。',
    navigationLabel: '建構器導覽',
    footerLabel: '建構器',
    footerDescription: '只保留真實系統，不放假分頁。',
    routeLabel: '建構器基準路由',
    leftRailPagesLabel: '頁面',
    leftRailPagesDescription: '實際路由',
    leftRailAssetsLabel: '素材',
    leftRailAssetsDescription: '最近的建構器媒體',
    workspacePillLabel: '工作區',
    sitePillLabel: '網站',
    schemaPillLabel: '結構',
    siteVersionPillLabel: '網站版本',
    siteLocaleLabel: '語言',
    pagesSectionTitle: '頁面',
    pagesSectionDescription: 'WAVE-01 會明確保留頁面入口。只有由真實頁面模型支撐的路由才會顯示。',
    staticTopologyTitle: '靜態頁面拓樸',
    staticTopologyStatus: '唯讀',
    staticTopologyDescription: '索引與路由清單',
    cmsInventoryTitle: 'CMS 清單',
    cmsInventoryStatus: '唯讀',
    cmsInventoryDescription: '尚無建構器編輯路徑',
    dynamicRoutesTitle: '動態路由',
    dynamicRoutesStatus: '僅索引',
    dynamicRoutesDescription: '預覽情境分界',
    dynamicTemplatesTitle: '動態範本',
    dynamicTemplatesStatus: '僅擁有權',
    dynamicTemplatesDescription: '程式路徑範本索引',
    starterTemplateTitle: '起始範本',
    starterTemplateStatus: '範本優先',
    starterTemplateDescription: '只保留真實起點',
    appMarketLabel: '應用市集',
    appMarketDescription: '安裝與管理',
    aiGeneratorLabel: 'AI 網站產生器',
    aiGeneratorDescription: '從提示到網站地圖',
    openAppMarketLabel: '開啟應用市集',
    openAppMarketDescription: '瀏覽、安裝、啟用、停用與解除安裝應用。',
    openAiGeneratorLabel: '開啟 AI 網站產生器',
    openAiGeneratorDescription: '建立網站地圖、內容規劃與可編輯的首份草稿。',
    workspaceSectionTitle: '工作區',
    workspaceIdLabel: '工作區 ID',
    ownerLabel: '擁有者',
    siteIdLabel: '網站 ID',
    schemaPagesLabel: '結構頁數',
    collectionsLabel: '集合',
    dynamicRoutesCountLabel: '動態路由',
    dynamicTemplatesCountLabel: '動態範本',
    starterTemplatesCountLabel: '起始範本',
    staticRoutePolicyTitle: '靜態路由政策',
    staticRoutePolicyValidLabel: '目前驗證狀態',
    staticRoutePolicyValidValue: '有效的靜態頁面索引',
    staticRoutePolicyInvalidValue: '偵測到路由問題',
    staticRoutePolicyNoteOne: 'slug 編輯與頁面複製會保留到真正擁有執行期路由之後。',
    staticRoutePolicyNoteTwo: 'WAVE-03-B01 只公開真實清單。不會出現假的資料集綁定或動態頁面編輯介面。',
    scopeLockTitle: 'WAVE 01 範圍鎖定',
    scopeLockNoteOne: '只保留編輯器核心：工作區／網站模型、外殼、草稿狀態、預覽邊界。',
    scopeLockNoteTwo: '在真實系統存在前，不新增 Components 或 CMS 分頁。',
    scopeLockNoteThree: 'About 與 Contact 會維持預覽模式，直到真正的互動編輯上線。',
    siteOverviewTitle: '網站總覽',
    builderPagesLabel: '建構器頁面',
    sharedDraftsLabel: '共享草稿',
    publishedSnapshotsLabel: '已發佈快照',
    recentAssetsLabel: '最近素材',
    readOnlyCollectionsLabel: '唯讀集合',
    dynamicRouteRegistryLabel: '動態路由索引',
    dynamicTemplateOwnershipLabel: '動態範本擁有權',
    starterTemplatesLabel: '起始範本',
    appMarketKpiLabel: '應用市集',
    aiSiteGeneratorKpiLabel: 'AI 網站產生器',
    starterTemplateGalleryTitle: '起始範本圖庫',
    starterTemplateGalleryDescription: '只保留真實起點。每張卡片都會說明目前項目是可立即編輯、可立即預覽，還是只透過擁有權詳情管理。',
    starterSupportEditable: '立即可編輯',
    starterSupportPreview: '立即可預覽',
    starterSupportOwnership: '僅擁有權',
    openStarterDetailLabel: '開啟起始詳情',
    staticPageTopologyTitle: '靜態頁面拓樸',
    staticPageTopologyDescription: '只列出目前建構器網站索引中的靜態頁面。slug 變更與複製仍保留。',
    editModeLabel: '可編輯',
    previewModeLabel: '僅預覽',
    homepageLabel: '首頁',
    pageIdLabel: '頁面 ID',
    routeLabelPrefix: '路由',
    routeSegmentLabel: '區段',
    roleLabel: '角色',
    publicRouteLabel: '公開路由',
    datasetsLabel: '資料集',
    draftVersionLabel: '草稿 v',
    publishedVersionLabel: '已發佈 v',
    openEditorLabel: '開啟編輯器',
    openPreviewLabel: '開啟預覽',
    cmsInventoryKickoffTitle: 'CMS 清單啟動',
    cmsInventoryKickoffDescription: '靜態來源集合維持唯讀；可編輯的 CMS 集合由 Content Manager 管理。',
    openContentManagerLabel: '開啟 Content Manager',
    localizedLabel: '在地化',
    sharedLabel: '共享',
    sourceLabel: '來源',
    routeBindingsLabel: '路由綁定',
    fieldSampleLabel: '欄位範例',
    builderPathLabel: '建構器路徑',
    openReadOnlyDetailLabel: '開啟唯讀詳情',
    relationsPresentLabel: '有關聯',
    noRelationsLabel: '無關聯',
    dynamicRoutesInventoryTitle: '動態路由清單',
    dynamicRoutesInventoryDescription: '只提供索引。這些項目可證明路由擁有權與預覽情境分界，但尚不代表已有動態頁面範本。',
    dynamicRoutesListRouteLabel: '列表路由',
    dynamicRoutesItemRouteLabel: '項目路由',
    routeIdLabel: '路由 ID',
    dynamicRouteSlugLabel: 'Slug',
    dynamicRoutePageLabel: '頁面',
    dynamicRouteCollectionsLabel: '集合',
    dynamicRouteTemplateLabel: '範本',
    dynamicRoutePublicPathLabel: '公開路徑',
    dynamicRoutePreviewLabel: '預覽',
    dynamicTemplatesInventoryTitle: '動態範本清單',
    dynamicTemplatesInventoryDescription: '範本擁有權直接連到程式路徑。在真正的動態頁面編輯流程進來前，只提供預覽與擁有權資訊。',
    dynamicTemplatesListTemplateLabel: '列表範本',
    dynamicTemplatesItemTemplateLabel: '項目範本',
    dynamicTemplateIdLabel: '範本 ID',
    dynamicTemplateOwnerLabel: '擁有者',
    dynamicTemplateRouteLabel: '連結路徑',
    dynamicTemplateOpenLabel: '開啟範本',
    dynamicTemplatePublishLabel: '發佈',
    routeValidationTitle: '路由驗證',
    routeValidationDescription: '目前靜態頁面索引會依據重複公開路徑與首頁角色規則進行驗證。',
    routeValidationOkLabel: '所有靜態頁面路由皆有效',
    routeValidationIssueSiteLevel: '網站層級',
  },
  en: {
    title: 'Builder Workspace',
    description: 'Single internal workspace, single canonical site, explicit page entry points.',
    navigationLabel: 'Builder navigation',
    footerLabel: 'Builder',
    footerDescription: 'Real systems only. No fake tabs.',
    routeLabel: 'canonical builder route',
    leftRailPagesLabel: 'Pages',
    leftRailPagesDescription: 'Live routes',
    leftRailAssetsLabel: 'Assets',
    leftRailAssetsDescription: 'Recent builder media',
    workspacePillLabel: 'Workspace',
    sitePillLabel: 'Site',
    schemaPillLabel: 'Schema',
    siteVersionPillLabel: 'Site version',
    siteLocaleLabel: 'Locale',
    pagesSectionTitle: 'Pages',
    pagesSectionDescription: 'WAVE-01 keeps page entry explicit. Only routes backed by real page models appear here.',
    staticTopologyTitle: 'Static page topology',
    staticTopologyStatus: 'Read-only',
    staticTopologyDescription: 'Registry and route inventory',
    cmsInventoryTitle: 'CMS inventory',
    cmsInventoryStatus: 'Read-only',
    cmsInventoryDescription: 'No builder editing path yet',
    dynamicRoutesTitle: 'Dynamic routes',
    dynamicRoutesStatus: 'Registry only',
    dynamicRoutesDescription: 'Preview context seam',
    dynamicTemplatesTitle: 'Dynamic templates',
    dynamicTemplatesStatus: 'Ownership only',
    dynamicTemplatesDescription: 'Code-route template registry',
    starterTemplateTitle: 'Starter templates',
    starterTemplateStatus: 'Template-first',
    starterTemplateDescription: 'Real starting points only',
    appMarketLabel: 'App Market',
    appMarketDescription: 'Install and manage',
    aiGeneratorLabel: 'AI Site Generator',
    aiGeneratorDescription: 'Prompt to sitemap',
    openAppMarketLabel: 'Open App Market',
    openAppMarketDescription: 'Browse apps, install, enable, disable, and uninstall.',
    openAiGeneratorLabel: 'Open AI Site Generator',
    openAiGeneratorDescription: 'Create a sitemap, content plan, and editable first draft.',
    workspaceSectionTitle: 'Workspace',
    workspaceIdLabel: 'Workspace ID',
    ownerLabel: 'Owner',
    siteIdLabel: 'Site ID',
    schemaPagesLabel: 'Schema pages',
    collectionsLabel: 'Collections',
    dynamicRoutesCountLabel: 'Dynamic routes',
    dynamicTemplatesCountLabel: 'Dynamic templates',
    starterTemplatesCountLabel: 'Starter templates',
    staticRoutePolicyTitle: 'Static route policy',
    staticRoutePolicyValidLabel: 'Current validation status',
    staticRoutePolicyValidValue: 'valid static page registry',
    staticRoutePolicyInvalidValue: 'route issues detected',
    staticRoutePolicyNoteOne: 'Slug editing and page duplication stay deferred until runtime route ownership is real.',
    staticRoutePolicyNoteTwo: 'WAVE-03-B01 exposes real inventory only. No fake dataset binding or dynamic-page editor UI.',
    scopeLockTitle: 'Wave 01 scope lock',
    scopeLockNoteOne: 'Editor core only: workspace/site model, shell, draft state, preview boundaries.',
    scopeLockNoteTwo: 'No fake Components or CMS tabs before those systems exist.',
    scopeLockNoteThree: 'About and Contact stay preview-only until real interactive editing lands.',
    siteOverviewTitle: 'Site overview',
    builderPagesLabel: 'Builder pages',
    sharedDraftsLabel: 'Shared drafts',
    publishedSnapshotsLabel: 'Published snapshots',
    recentAssetsLabel: 'Recent assets',
    readOnlyCollectionsLabel: 'Read-only collections',
    dynamicRouteRegistryLabel: 'Dynamic route registry',
    dynamicTemplateOwnershipLabel: 'Dynamic template ownership',
    starterTemplatesLabel: 'Starter templates',
    appMarketKpiLabel: 'App Market',
    aiSiteGeneratorKpiLabel: 'AI Site Generator',
    starterTemplateGalleryTitle: 'Starter template gallery',
    starterTemplateGalleryDescription: 'Real starting points only. Each card tells you whether the current entry is editable now, previewable now, or only cataloged through ownership detail.',
    starterSupportEditable: 'Editable now',
    starterSupportPreview: 'Preview now',
    starterSupportOwnership: 'Ownership only',
    openStarterDetailLabel: 'Open starter detail',
    staticPageTopologyTitle: 'Static page topology',
    staticPageTopologyDescription: 'Only static pages backed by the current builder site registry appear here. Slug mutation and duplication remain deferred.',
    editModeLabel: 'Editable',
    previewModeLabel: 'Preview only',
    homepageLabel: 'Homepage',
    pageIdLabel: 'Page ID',
    routeLabelPrefix: 'Route',
    routeSegmentLabel: 'Segment',
    roleLabel: 'Role',
    publicRouteLabel: 'Public route',
    datasetsLabel: 'Datasets',
    draftVersionLabel: 'Draft v',
    publishedVersionLabel: 'Published v',
    openEditorLabel: 'Open editor',
    openPreviewLabel: 'Open preview',
    cmsInventoryKickoffTitle: 'CMS inventory kickoff',
    cmsInventoryKickoffDescription: 'Static source collections remain read-only; editable CMS collections are managed in Content Manager.',
    openContentManagerLabel: 'Open Content Manager',
    localizedLabel: 'Localized',
    sharedLabel: 'Shared',
    sourceLabel: 'Source',
    routeBindingsLabel: 'Route bindings',
    fieldSampleLabel: 'Field sample',
    builderPathLabel: 'Builder path',
    openReadOnlyDetailLabel: 'Open read-only detail',
    relationsPresentLabel: 'Relations present',
    noRelationsLabel: 'No relations',
    dynamicRoutesInventoryTitle: 'Dynamic route registry',
    dynamicRoutesInventoryDescription: 'Registry only. These entries prove route ownership and preview context seams, but they do not imply dynamic page templates yet.',
    dynamicRoutesListRouteLabel: 'List route',
    dynamicRoutesItemRouteLabel: 'Item route',
    routeIdLabel: 'Route ID',
    dynamicRouteSlugLabel: 'Slug',
    dynamicRoutePageLabel: 'Page',
    dynamicRouteCollectionsLabel: 'Collections',
    dynamicRouteTemplateLabel: 'Template',
    dynamicRoutePublicPathLabel: 'Public route',
    dynamicRoutePreviewLabel: 'Preview',
    dynamicTemplatesInventoryTitle: 'Dynamic template registry',
    dynamicTemplatesInventoryDescription: 'Template ownership is directly tied to code routes. Before a real dynamic page editing flow lands, this surface only provides preview and ownership info.',
    dynamicTemplatesListTemplateLabel: 'List template',
    dynamicTemplatesItemTemplateLabel: 'Item template',
    dynamicTemplateIdLabel: 'Template ID',
    dynamicTemplateOwnerLabel: 'Owner',
    dynamicTemplateRouteLabel: 'Linked route',
    dynamicTemplateOpenLabel: 'Open template',
    dynamicTemplatePublishLabel: 'Publish',
    routeValidationTitle: 'Route validation',
    routeValidationDescription: 'Current static page registry is validated against duplicate public paths and homepage-role rules.',
    routeValidationOkLabel: 'All static page routes are valid',
    routeValidationIssueSiteLevel: 'site-level',
  },
};

export default function BuilderWorkspaceDashboard({
  locale,
  overview,
}: {
  locale: Locale;
  overview: BuilderSiteOverview;
}) {
  const copy = builderWorkspaceDashboardCopy[locale];

  const pageNav = overview.pages.map((page) => ({
    key: 'pages' as const,
    label: page.title,
    href: buildBuilderPageHref(locale, page.pageKey, page.availableModes[0] ?? 'preview'),
    status:
      page.specialRole === 'homepage'
        ? copy.homepageLabel
        : page.editable
          ? copy.editModeLabel
          : copy.previewModeLabel,
    meta: page.publicPath,
  }));

  return (
    <BuilderWorkspaceFrame
      locale={locale}
      title={copy.title}
      description={copy.description}
      activeRail="pages"
      stageUrl={`/${locale}/builder`}
      navigationLabel={copy.navigationLabel}
      footerLabel={copy.footerLabel}
      footerDescription={copy.footerDescription}
      routeLabel={copy.routeLabel}
      railItems={[
        { key: 'pages', label: copy.leftRailPagesLabel, description: copy.leftRailPagesDescription, active: true },
        { key: 'assets', label: copy.leftRailAssetsLabel, description: copy.leftRailAssetsDescription },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">
            {copy.workspacePillLabel} {overview.workspace.name}
          </span>
          <span className="builder-stage-pill">
            {copy.sitePillLabel} {overview.site.name}
          </span>
          <span className="builder-stage-pill">
            {copy.schemaPillLabel} v{overview.schema.schemaVersion}
          </span>
          <span className="builder-stage-pill">
            {copy.siteVersionPillLabel} v{overview.schema.siteVersion}
          </span>
        </>
      }
      rightMeta={
        <>
          <strong>{overview.site.name}</strong>
          <span>
            {overview.site.id} · {copy.siteLocaleLabel} {overview.site.locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>{copy.pagesSectionTitle}</h2>
          <p>{copy.pagesSectionDescription}</p>
          <div className="builder-dashboard-nav-list">
            {pageNav.map((item) => (
              <Link key={item.href} href={item.href} className="builder-dashboard-nav-card">
                <strong>{item.label}</strong>
                <span>{item.status}</span>
                <small>{item.meta}</small>
              </Link>
            ))}
          </div>
          <div className="builder-dashboard-nav-list">
            <a href="#static-page-topology" className="builder-dashboard-nav-card">
              <strong>{copy.staticTopologyTitle}</strong>
              <span>{copy.staticTopologyStatus}</span>
              <small>{copy.staticTopologyDescription}</small>
            </a>
            <a href="#cms-inventory-kickoff" className="builder-dashboard-nav-card">
              <strong>{copy.cmsInventoryTitle}</strong>
              <span>{copy.cmsInventoryStatus}</span>
              <small>{copy.cmsInventoryDescription}</small>
            </a>
            <a href="#dynamic-route-registry" className="builder-dashboard-nav-card">
              <strong>{copy.dynamicRoutesTitle}</strong>
              <span>{copy.dynamicRoutesStatus}</span>
              <small>{copy.dynamicRoutesDescription}</small>
            </a>
            <a href="#dynamic-template-registry" className="builder-dashboard-nav-card">
              <strong>{copy.dynamicTemplatesTitle}</strong>
              <span>{copy.dynamicTemplatesStatus}</span>
              <small>{copy.dynamicTemplatesDescription}</small>
            </a>
            <a href="#starter-template-gallery" className="builder-dashboard-nav-card">
              <strong>{copy.starterTemplateTitle}</strong>
              <span>{copy.starterTemplateStatus}</span>
              <small>{copy.starterTemplateDescription}</small>
            </a>
            <Link href={`/${locale}/admin-builder/apps`} className="builder-dashboard-nav-card">
              <strong>{copy.appMarketLabel}</strong>
              <span>{copy.appMarketDescription}</span>
              <small>{copy.appMarketDescription}</small>
            </Link>
            <Link href={`/${locale}/admin-builder/ai-generator`} className="builder-dashboard-nav-card">
              <strong>{copy.aiGeneratorLabel}</strong>
              <span>{copy.aiGeneratorDescription}</span>
              <small>{copy.aiGeneratorDescription}</small>
            </Link>
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{copy.workspaceSectionTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{copy.workspaceIdLabel}</dt>
                <dd>{overview.workspace.id}</dd>
              </div>
              <div>
                <dt>{copy.ownerLabel}</dt>
                <dd>{overview.workspace.ownerLabel}</dd>
              </div>
              <div>
                <dt>{copy.siteIdLabel}</dt>
                <dd>{overview.site.id}</dd>
              </div>
              <div>
                <dt>{copy.schemaPagesLabel}</dt>
                <dd>{overview.schema.pageOrder.length}</dd>
              </div>
              <div>
                <dt>{copy.collectionsLabel}</dt>
                <dd>{overview.collections.length}</dd>
              </div>
              <div>
                <dt>{copy.dynamicRoutesCountLabel}</dt>
                <dd>{overview.dynamicRoutes.length}</dd>
              </div>
              <div>
                <dt>{copy.dynamicTemplatesCountLabel}</dt>
                <dd>{overview.dynamicTemplates.length}</dd>
              </div>
              <div>
                <dt>{copy.starterTemplatesCountLabel}</dt>
                <dd>{overview.starterTemplates.length}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{copy.staticRoutePolicyTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              <li>
                {copy.staticRoutePolicyValidLabel}:{' '}
                <strong>{overview.routing.valid ? copy.staticRoutePolicyValidValue : copy.staticRoutePolicyInvalidValue}</strong>
              </li>
              <li>{copy.staticRoutePolicyNoteOne}</li>
              <li>{copy.staticRoutePolicyNoteTwo}</li>
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{copy.scopeLockTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              <li>{copy.scopeLockNoteOne}</li>
              <li>{copy.scopeLockNoteTwo}</li>
              <li>{copy.scopeLockNoteThree}</li>
            </ul>
          </section>
          <section className="builder-preview-inspector-card">
            <BuilderInspectorAssetLibraryPanel
              locale={locale}
              title={copy.recentAssetsLabel}
              description={
                locale === 'ko'
                  ? '현재 빌더 저장소 백엔드에서 가져온 실제 에셋 인벤토리입니다.'
                  : locale === 'zh-hant'
                    ? '這是來自目前建構器儲存後端的真實素材清單。'
                    : 'This is real asset inventory from the current builder storage backend.'
              }
              items={overview.assets}
              emptyMessage={
                locale === 'ko'
                  ? '아직 최근 빌더 에셋이 없습니다.'
                  : locale === 'zh-hant'
                    ? '目前尚無最近的建構器素材。'
                    : 'No recent builder assets yet.'
              }
            />
          </section>
        </>
      }
    >
      <div className="builder-dashboard-grid" data-builder-workspace-dashboard="true">
        <section className="builder-preview-inspector-card">
          <h2>{copy.siteOverviewTitle}</h2>
          <p>{overview.site.description}</p>
          <div className="builder-dashboard-kpi-grid">
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.pages.length}</strong>
              <span>{copy.builderPagesLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{countPersistedPages(overview.pages, 'draftPersisted')}</strong>
              <span>{copy.sharedDraftsLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{countPersistedPages(overview.pages, 'publishedPersisted')}</strong>
              <span>{copy.publishedSnapshotsLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.assets.length}</strong>
              <span>{copy.recentAssetsLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.collections.length}</strong>
              <span>{copy.readOnlyCollectionsLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.dynamicRoutes.length}</strong>
              <span>{copy.dynamicRouteRegistryLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.dynamicTemplates.length}</strong>
              <span>{copy.dynamicTemplateOwnershipLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>{overview.starterTemplates.length}</strong>
              <span>{copy.starterTemplatesLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>M161</strong>
              <span>{copy.appMarketKpiLabel}</span>
            </article>
            <article className="builder-dashboard-kpi-card">
              <strong>M166</strong>
              <span>{copy.aiSiteGeneratorKpiLabel}</span>
            </article>
          </div>
          <div className="builder-dashboard-page-actions" style={{ marginTop: 14 }}>
            <Link href={`/${locale}/admin-builder/apps`} className="builder-dashboard-nav-card">
              <strong>{copy.openAppMarketLabel}</strong>
              <span>{copy.openAppMarketDescription}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/ai-generator`} className="builder-dashboard-nav-card">
              <strong>{copy.openAiGeneratorLabel}</strong>
              <span>{copy.openAiGeneratorDescription}</span>
            </Link>
          </div>
        </section>

        <section id="starter-template-gallery" className="builder-preview-inspector-card">
          <h2>{copy.starterTemplateGalleryTitle}</h2>
          <p>{copy.starterTemplateGalleryDescription}</p>
          <div className="builder-dashboard-page-list">
            {overview.starterTemplates.map((template) => (
              <article key={template.templateId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{template.title}</strong>
                    <span>{template.description}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {template.support === 'editable-now'
                      ? copy.starterSupportEditable
                      : template.support === 'preview-now'
                        ? copy.starterSupportPreview
                        : copy.starterSupportOwnership}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{template.category}</span>
                  <span>{template.focus}</span>
                  <span>{template.livePath}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderStarterTemplateHref(locale, template.templateId)}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    {copy.openStarterDetailLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="static-page-topology" className="builder-preview-inspector-card">
          <h2>{copy.staticPageTopologyTitle}</h2>
          <p>{copy.staticPageTopologyDescription}</p>
          <div className="builder-dashboard-page-list">
            {overview.pages.map((page) => (
              <article key={page.pageKey} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{page.title}</strong>
                    <span>{page.description}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {page.editable ? copy.editModeLabel : copy.previewModeLabel}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{copy.pageIdLabel} {page.pageId}</span>
                  <span>{copy.routeLabelPrefix} {page.routeType}</span>
                  <span>{copy.routeSegmentLabel} {page.routeSegment || '(root)'}</span>
                  <span>{copy.roleLabel} {page.specialRole ?? 'standard'}</span>
                  <span>{copy.publicRouteLabel} {page.publicPath}</span>
                  <span>{copy.datasetsLabel} {page.datasetCount}</span>
                  <span>{copy.draftVersionLabel}{page.draftRevision}</span>
                  <span>{copy.publishedVersionLabel}{page.publishedRevision}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  {page.availableModes.map((mode) => (
                    <Link
                      key={`${page.pageKey}-${mode}`}
                      href={buildBuilderPageHref(locale, page.pageKey, mode)}
                      className="builder-action-btn builder-action-btn--primary"
                    >
                      {mode === 'edit' ? copy.openEditorLabel : copy.openPreviewLabel}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cms-inventory-kickoff" className="builder-preview-inspector-card">
          <h2>{copy.cmsInventoryKickoffTitle}</h2>
          <p>{copy.cmsInventoryKickoffDescription}</p>
          <div className="builder-dashboard-page-actions">
            <Link href={`/${locale}/admin-builder/cms`} className="builder-action-btn builder-action-btn--primary">
              {copy.openContentManagerLabel}
            </Link>
          </div>
          <div className="builder-dashboard-page-list">
            {overview.collections.map((collection) => (
              <article key={collection.id} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{collection.title}</strong>
                    <span>{collection.description}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {collection.localized ? copy.localizedLabel : copy.sharedLabel}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{copy.collectionsLabel} {collection.id}</span>
                  <span>{collection.recordCount} records</span>
                  <span>{collection.fieldCount} fields</span>
                  <span>
                    {collection.supportsRelations ? copy.relationsPresentLabel : copy.noRelationsLabel}
                  </span>
                </div>
                <div className="builder-preview-inspector-list">
                  <div>
                    <dt>{copy.sourceLabel}</dt>
                    <dd>{collection.sourceLabel}</dd>
                  </div>
                  <div>
                    <dt>{copy.routeBindingsLabel}</dt>
                    <dd>{collection.routeBindings.map((binding) => binding.pathPattern).join(' · ')}</dd>
                  </div>
                  <div>
                    <dt>{copy.fieldSampleLabel}</dt>
                    <dd>{collection.fields.slice(0, 4).map((field) => `${field.label} (${field.type})`).join(' · ')}</dd>
                  </div>
                  <div>
                    <dt>{copy.builderPathLabel}</dt>
                    <dd>
                      <Link href={buildBuilderCollectionHref(locale, collection.id)}>
                        {copy.openReadOnlyDetailLabel}
                      </Link>
                    </dd>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="dynamic-route-registry" className="builder-preview-inspector-card">
          <h2>{copy.dynamicRoutesInventoryTitle}</h2>
          <p>{copy.dynamicRoutesInventoryDescription}</p>
          <div className="builder-dashboard-page-list">
            {overview.dynamicRoutes.map((route) => (
              <article key={route.routeId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{route.collectionTitle}</strong>
                    <span>{route.notes}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {route.kind === 'list' ? copy.dynamicRoutesListRouteLabel : copy.dynamicRoutesItemRouteLabel}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{copy.routeIdLabel} {route.routeId}</span>
                  <span>{route.pathPattern}</span>
                  <span>{route.previewContextMode}</span>
                  <span>{route.recordCount} records</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderDynamicRouteHref(locale, route.routeId)}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    {copy.dynamicRoutePreviewLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="dynamic-template-registry" className="builder-preview-inspector-card">
          <h2>{copy.dynamicTemplatesInventoryTitle}</h2>
          <p>{copy.dynamicTemplatesInventoryDescription}</p>
          <div className="builder-dashboard-page-list">
            {overview.dynamicTemplates.map((template) => (
              <article key={template.templateId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{template.collectionTitle}</strong>
                    <span>{template.notes}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {template.kind === 'list' ? copy.dynamicTemplatesListTemplateLabel : copy.dynamicTemplatesItemTemplateLabel}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{copy.dynamicTemplateIdLabel} {template.templateId}</span>
                  <span>{template.publicPathPattern}</span>
                  <span>{template.ownerType}</span>
                  <span>{template.runtimeModulePath}</span>
                </div>
                <div className="builder-dashboard-page-actions">
                  <Link
                    href={buildBuilderDynamicTemplateHref(locale, template.templateId)}
                    className="builder-action-btn builder-action-btn--primary"
                  >
                    {copy.dynamicTemplateOpenLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="builder-preview-inspector-card">
          <h2>{copy.routeValidationTitle}</h2>
          <p>{copy.routeValidationDescription}</p>
          {overview.routing.valid ? (
            <div className="builder-dashboard-page-meta">
              <span>{copy.routeValidationOkLabel}</span>
            </div>
          ) : (
            <div className="builder-dashboard-page-list">
              {overview.routing.issues.map((issue) => (
                <article key={`${issue.code}-${issue.message}`} className="builder-dashboard-page-card">
                  <div className="builder-dashboard-page-head">
                    <div>
                      <strong>{issue.code}</strong>
                      <span>{issue.message}</span>
                    </div>
                  </div>
                  <div className="builder-dashboard-page-meta">
                    <span>{issue.pageKeys.length ? issue.pageKeys.join(', ') : copy.routeValidationIssueSiteLevel}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </BuilderWorkspaceFrame>
  );
}

function countPersistedPages(
  pages: BuilderSiteOverview['pages'],
  key: 'draftPersisted' | 'publishedPersisted'
) {
  return pages.reduce((count, page) => count + (page[key] ? 1 : 0), 0);
}
