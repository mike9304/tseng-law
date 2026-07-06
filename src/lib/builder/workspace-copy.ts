import type { Locale } from '@/lib/locales';

export type BuilderWorkspaceCopy = {
  pagesLabel: string;
  pagesDescription: string;
  assetsLabel: string;
  assetsDescription: string;
  builderNavigationLabel: string;
  builderFooterLabel: string;
  builderFooterDescription: string;
  builderRouteLabel: string;
  canvasRouteLabel: string;
  collectionSidebarTitle: string;
  collectionSidebarDescription: string;
  collectionPolicyTitle: string;
  collectionPolicyItems: string[];
  dynamicRouteSidebarTitle: string;
  dynamicRouteSidebarDescription: string;
  dynamicRoutePolicyTitle: string;
  dynamicRoutePolicyItems: string[];
  dynamicTemplateSidebarTitle: string;
  dynamicTemplateSidebarDescription: string;
  dynamicTemplateOwnershipTitle: string;
  dynamicTemplateOwnershipItems: string[];
  starterSidebarTitle: string;
  starterSidebarDescription: string;
  starterCurrentPathTitle: string;
  starterExcludedTitle: string;
  pageSidebarTitle: string;
  pageSidebarDescription: string;
  sceneSidebarTitle: string;
  sceneSidebarDescription: string;
  sceneLayersLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', BuilderWorkspaceCopy> = {
  ko: {
    pagesLabel: '페이지',
    pagesDescription: '작업 공간 및 컬렉션 인벤토리',
    assetsLabel: '에셋',
    assetsDescription: '최근 빌더 미디어',
    builderNavigationLabel: '빌더 탐색',
    builderFooterLabel: '빌더',
    builderFooterDescription: '실제 시스템만 사용합니다. 가짜 탭은 없습니다.',
    builderRouteLabel: '빌더 기준 경로',
    canvasRouteLabel: '캔버스 경로',
    collectionSidebarTitle: '컬렉션',
    collectionSidebarDescription: '실제 소스 데이터가 있는 컬렉션만 표시됩니다. 이 라우트는 WAVE-03-B02에서 읽기 전용입니다.',
    collectionPolicyTitle: '컬렉션 정책',
    collectionPolicyItems: [
      '이 라우트는 읽기 전용입니다. 컬렉션 CRUD나 레코드 편집을 암시하지 않습니다.',
      '데이터셋 바인딩은 명시적으로 등록된 대상에만 제한됩니다.',
      '동적 리스트/아이템/manage 페이지는 아직 이 배치 밖입니다.',
    ],
    dynamicRouteSidebarTitle: '동적 경로',
    dynamicRouteSidebarDescription: '실제 라이브 경로에 연결된 경로 레지스트리 항목만 표시됩니다. 템플릿 소유권은 v0 블록 편집기로 연결됩니다.',
    dynamicRoutePolicyTitle: '경로 정책',
    dynamicRoutePolicyItems: [
      '이 라우트는 명시적인 템플릿 소유권 및 블록 편집기 항목에 연결됩니다.',
      '미리보기 컨텍스트는 경로 소유권, 레코드 SEO, 편집 가능한 템플릿 계약을 해석합니다.',
      '컬렉션 CRUD와 레코드 CRUD는 이 배치 밖입니다.',
    ],
    dynamicTemplateSidebarTitle: '동적 템플릿',
    dynamicTemplateSidebarDescription: '명시적 소유권 항목은 v0 블록 편집기와 레코드 미리보기 계약을 노출합니다.',
    dynamicTemplateOwnershipTitle: '소유권 정책',
    dynamicTemplateOwnershipItems: [
      '오너십 항목은 실제 템플릿/경로 연결만 표시합니다.',
      '미리보기 컨텍스트는 레코드 선택과 SEO 계약을 유지합니다.',
      '편집 가능 여부는 템플릿 메타데이터에 따릅니다.',
    ],
    starterSidebarTitle: '스타터 템플릿',
    starterSidebarDescription: '실제 현재 경로나 빌더 페이지에 연결된 템플릿만 표시됩니다.',
    starterCurrentPathTitle: '현재 진입 경로',
    starterExcludedTitle: '제외 항목',
    pageSidebarTitle: '페이지',
    pageSidebarDescription: '실제 페이지 진입점만 표시됩니다.',
    sceneSidebarTitle: '페이지 경로',
    sceneSidebarDescription: 'Scene graph 뷰는 실제 빌더 소유 정적 페이지만 지원합니다.',
    sceneLayersLabel: '레이어',
  },
  'zh-hant': {
    pagesLabel: '頁面',
    pagesDescription: '工作區與集合清單',
    assetsLabel: '素材',
    assetsDescription: '最近的建構器媒體',
    builderNavigationLabel: '建構器導覽',
    builderFooterLabel: '建構器',
    builderFooterDescription: '只保留真實系統，不放假分頁。',
    builderRouteLabel: '建構器基準路由',
    canvasRouteLabel: '畫布路由',
    collectionSidebarTitle: '集合',
    collectionSidebarDescription: '只顯示有真實來源資料的集合。此路由在 WAVE-03-B02 中維持唯讀。',
    collectionPolicyTitle: '集合政策',
    collectionPolicyItems: [
      '此路由為唯讀，不暗示集合 CRUD 或記錄編輯。',
      '資料集綁定僅限明確註冊的目標。',
      '動態列表／項目／管理頁仍不在此批次範圍。',
    ],
    dynamicRouteSidebarTitle: '動態路由',
    dynamicRouteSidebarDescription: '僅顯示有真實 live route 支撐的路由索引項。範本擁有權會連到 v0 區塊編輯器。',
    dynamicRoutePolicyTitle: '路由政策',
    dynamicRoutePolicyItems: [
      '此路由會連到明確的範本擁有權與區塊編輯器項目。',
      '預覽情境會解析路由擁有權、記錄 SEO 與可編輯的範本契約。',
      '集合 CRUD 與記錄 CRUD 不在此批次內。',
    ],
    dynamicTemplateSidebarTitle: '動態範本',
    dynamicTemplateSidebarDescription: '明確擁有權條目會顯示 v0 區塊編輯器與記錄預覽契約。',
    dynamicTemplateOwnershipTitle: '擁有權政策',
    dynamicTemplateOwnershipItems: [
      '擁有權條目只顯示真實範本／路由關聯。',
      '預覽情境保留記錄選取與 SEO 契約。',
      '可編輯性取決於範本中繼資料。',
    ],
    starterSidebarTitle: '起始範本',
    starterSidebarDescription: '只顯示連到真實目前路由或建構器頁面的範本。',
    starterCurrentPathTitle: '目前進入路徑',
    starterExcludedTitle: '排除項目',
    pageSidebarTitle: '頁面',
    pageSidebarDescription: '只顯示真實頁面入口。',
    sceneSidebarTitle: '頁面路徑',
    sceneSidebarDescription: 'Scene graph 檢視只支援真正由建構器擁有的靜態頁面。',
    sceneLayersLabel: '圖層',
  },
  en: {
    pagesLabel: 'Pages',
    pagesDescription: 'Workspace and collection inventory',
    assetsLabel: 'Assets',
    assetsDescription: 'Recent builder media',
    builderNavigationLabel: 'Builder navigation',
    builderFooterLabel: 'Builder',
    builderFooterDescription: 'Real systems only. No fake tabs.',
    builderRouteLabel: 'canonical builder route',
    canvasRouteLabel: 'canvas route',
    collectionSidebarTitle: 'Collections',
    collectionSidebarDescription: 'Only collections with real source data appear here. This route stays read-only in WAVE-03-B02.',
    collectionPolicyTitle: 'Collection policy',
    collectionPolicyItems: [
      'This route is read-only. No collection CRUD or record editing is implied here.',
      'Dataset binding is limited to explicitly registered targets only.',
      'Dynamic list/item/manage pages remain outside this batch.',
    ],
    dynamicRouteSidebarTitle: 'Dynamic routes',
    dynamicRouteSidebarDescription: 'Only route registry entries backed by real live routes appear here. Template ownership now links into a v0 block editor.',
    dynamicRoutePolicyTitle: 'Route policy',
    dynamicRoutePolicyItems: [
      'This route now links to an explicit template ownership and block-editor entry.',
      'Preview context resolves path ownership, record SEO, and the editable template contract.',
      'Collection CRUD and record CRUD remain outside this batch.',
    ],
    dynamicTemplateSidebarTitle: 'Dynamic templates',
    dynamicTemplateSidebarDescription: 'Explicit ownership entries now expose a v0 block editor and record preview contract.',
    dynamicTemplateOwnershipTitle: 'Ownership policy',
    dynamicTemplateOwnershipItems: [
      'Ownership entries only show real template/route links.',
      'Preview context retains record selection and SEO contracts.',
      'Editability follows the template metadata.',
    ],
    starterSidebarTitle: 'Starter templates',
    starterSidebarDescription: 'Only templates backed by real current routes or builder pages appear here.',
    starterCurrentPathTitle: 'Current entry path',
    starterExcludedTitle: 'Still excluded',
    pageSidebarTitle: 'Pages',
    pageSidebarDescription: 'Real page entry points only.',
    sceneSidebarTitle: 'Page routes',
    sceneSidebarDescription: 'Scene graph views exist only for real builder-owned static pages.',
    sceneLayersLabel: 'Layers',
  },
};

export function getBuilderWorkspaceCopy(locale: Locale): BuilderWorkspaceCopy {
  return COPY[locale === 'zh-hant' || locale === 'en' ? locale : 'ko'];
}
