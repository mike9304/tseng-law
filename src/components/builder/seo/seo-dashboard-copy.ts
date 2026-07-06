import { normalizeLocale, type Locale } from '@/lib/locales';

export interface SeoDashboardCopy {
  title: string;
  lede: string;
  redirectsLabel: string;
  builderLabel: string;
  averageScoreLabel: string;
  pagesLabel: string;
  publishedLabel: string;
  indexableLabel: string;
  blockersLabel: string;
  warningsLabel: string;
  checklistTabLabel: string;
  defaultsTabLabel: string;
  pagesTabLabel: string;
  toolsTabLabel: string;
  checklistTitle: string;
  checklistDescription: string;
  businessNameLabel: string;
  keywordsLabel: string;
  keywordsPlaceholder: string;
  serviceModeLabel: string;
  serviceModeBothLabel: string;
  serviceModePhysicalLabel: string;
  serviceModeOnlineLabel: string;
  checklistStatusLabel: (status: 'done' | 'todo' | 'warning') => string;
  saveChecklistLabel: string;
  defaultsTitle: string;
  defaultsDescription: string;
  saveDefaultsLabel: string;
  patternPreviewTitle: string;
  editByPageTitle: string;
  resetTitleLabel: string;
  resetDescriptionLabel: string;
  allowIndexingLabel: string;
  blockIndexingLabel: string;
  resetSelectedLabel: string;
  selectedCountLabel: (count: number) => string;
  pageColumnLabel: string;
  scoreColumnLabel: string;
  indexableColumnLabel: string;
  issuesColumnLabel: string;
  assistantColumnLabel: string;
  keywordsColumnLabel: string;
  yesLabel: string;
  noLabel: string;
  issueCountsLabel: (blockers: number, warnings: number) => string;
  todoCountLabel: (count: number) => string;
  savingChecklistLabel: string;
  checklistSaveFailedLabel: string;
  savedLabel: string;
  savingDefaultsLabel: string;
  defaultsSaveFailedLabel: string;
  defaultsSavedLabel: string;
  savingRobotsLabel: string;
  robotsSaveFailedLabel: string;
  robotsSavedLabel: string;
  selectPagesFirstLabel: string;
  savingBulkLabel: string;
  bulkSaveFailedLabel: string;
  bulkSavedLabel: string;
  titlePatternLabel: string;
  descriptionPatternLabel: string;
  ogTitlePatternLabel: string;
  ogDescriptionPatternLabel: string;
  twitterCardLabel: string;
  twitterSummaryLargeLabel: string;
  twitterSummaryLabel: string;
  robotsPlaceholder: string;
  toolsTitle: string;
  redirectManagerLabel: string;
  redirectManagerDescription: string;
  sitemapLabel: string;
  sitemapDescription: string;
  robotsLabel: string;
  robotsDescription: string;
  customRobotsTitle: string;
  customRobotsDescription: string;
  customRobotsAriaLabel: string;
  saveRobotsLabel: string;
}

const ROBOTS_PLACEHOLDER = 'User-agent: *\nAllow: /\nDisallow: /private\nSitemap: https://tseng-law.com/sitemap.xml';

function statusLabels(locale: Locale): Record<'done' | 'todo' | 'warning', string> {
  if (locale === 'zh-hant') return { done: '完成', todo: '待辦', warning: '警告' };
  if (locale === 'en') return { done: 'Done', todo: 'To do', warning: 'Warning' };
  return { done: '완료', todo: '할 일', warning: '경고' };
}

export function getSeoDashboardCopy(localeInput: string | Locale): SeoDashboardCopy {
  const locale = normalizeLocale(localeInput);

  if (locale === 'zh-hant') {
    const statusCopy = statusLabels(locale);
    return {
      title: 'SEO 儀表板',
      lede: '在同一處管理檢查清單、預設樣式、按頁面編輯與重新導向。',
      redirectsLabel: '重新導向',
      builderLabel: '建構器',
      averageScoreLabel: '平均分數',
      pagesLabel: '頁面',
      publishedLabel: '已發佈',
      indexableLabel: '可索引',
      blockersLabel: '阻擋項目',
      warningsLabel: '警告',
      checklistTabLabel: 'SEO 檢查清單',
      defaultsTabLabel: 'SEO 設定',
      pagesTabLabel: '按頁面編輯',
      toolsTabLabel: '工具',
      checklistTitle: 'SEO 檢查清單',
      checklistDescription: '根據商家名稱與最多 5 個關鍵字來產生站點工作項目。',
      businessNameLabel: '商家名稱',
      keywordsLabel: '關鍵字',
      keywordsPlaceholder: '關鍵字 1，關鍵字 2',
      serviceModeLabel: '服務模式',
      serviceModeBothLabel: '實體 + 線上',
      serviceModePhysicalLabel: '實體地址',
      serviceModeOnlineLabel: '僅線上',
      checklistStatusLabel: (status) => statusCopy[status],
      saveChecklistLabel: '儲存',
      defaultsTitle: '主要頁面 SEO 設定',
      defaultsDescription: '當個別頁面值為空時套用的 Wix 式變數樣式。',
      saveDefaultsLabel: '儲存預設',
      patternPreviewTitle: '樣式預覽',
      editByPageTitle: '按頁面編輯',
      resetTitleLabel: '重設標題',
      resetDescriptionLabel: '重設說明',
      allowIndexingLabel: '允許索引',
      blockIndexingLabel: '阻止索引',
      resetSelectedLabel: '重設所選',
      selectedCountLabel: (count) => `${count} 個已選取`,
      pageColumnLabel: '頁面',
      scoreColumnLabel: '分數',
      indexableColumnLabel: '可索引',
      issuesColumnLabel: '問題',
      assistantColumnLabel: '助理',
      keywordsColumnLabel: '關鍵字',
      yesLabel: '是',
      noLabel: '否',
      issueCountsLabel: (blockers, warnings) => `${blockers} 阻擋 · ${warnings} 警告`,
      todoCountLabel: (count) => `${count} 待辦`,
      savingChecklistLabel: '檢查清單儲存中...',
      checklistSaveFailedLabel: '檢查清單儲存失敗',
      savedLabel: '已儲存',
      savingDefaultsLabel: 'SEO 設定儲存中...',
      defaultsSaveFailedLabel: 'SEO 設定儲存失敗',
      defaultsSavedLabel: 'SEO 設定已儲存',
      savingRobotsLabel: 'Robots.txt 儲存中...',
      robotsSaveFailedLabel: 'Robots.txt 儲存失敗',
      robotsSavedLabel: 'Robots.txt 已儲存',
      selectPagesFirstLabel: '請先選取頁面。',
      savingBulkLabel: '批次編輯儲存中...',
      bulkSaveFailedLabel: '批次編輯失敗',
      bulkSavedLabel: '批次編輯已儲存',
      titlePatternLabel: '標題標籤樣式',
      descriptionPatternLabel: '中繼說明樣式',
      ogTitlePatternLabel: 'OG 標題樣式',
      ogDescriptionPatternLabel: 'OG 說明樣式',
      twitterCardLabel: 'X / Twitter 卡片',
      twitterSummaryLargeLabel: 'summary_large_image',
      twitterSummaryLabel: 'summary',
      robotsPlaceholder: ROBOTS_PLACEHOLDER,
      toolsTitle: '技術 SEO 工具',
      redirectManagerLabel: 'URL 重新導向管理器',
      redirectManagerDescription: '301/302/307/308 重新導向',
      sitemapLabel: '網站地圖',
      sitemapDescription: '僅顯示已發佈且可索引的頁面',
      robotsLabel: 'robots.txt',
      robotsDescription: '不允許 noindex 頁面',
      customRobotsTitle: '自訂 robots.txt',
      customRobotsDescription: '留空時會依站點的 noindex 頁面自動生成。',
      customRobotsAriaLabel: '自訂 robots.txt',
      saveRobotsLabel: '儲存 Robots',
    };
  }

  if (locale === 'en') {
    const statusCopy = statusLabels(locale);
    return {
      title: 'SEO Dashboard',
      lede: 'Manage setup checklists, default patterns, page-level edits, and redirects in one place.',
      redirectsLabel: 'Redirects',
      builderLabel: 'Builder',
      averageScoreLabel: 'Average score',
      pagesLabel: 'Pages',
      publishedLabel: 'Published',
      indexableLabel: 'Indexable',
      blockersLabel: 'Blockers',
      warningsLabel: 'Warnings',
      checklistTabLabel: 'SEO Setup Checklist',
      defaultsTabLabel: 'SEO Settings',
      pagesTabLabel: 'Edit by Page',
      toolsTabLabel: 'Tools',
      checklistTitle: 'SEO Setup Checklist',
      checklistDescription: 'Generate site tasks from your business name and up to 5 keywords.',
      businessNameLabel: 'Business name',
      keywordsLabel: 'Keywords',
      keywordsPlaceholder: 'keyword 1, keyword 2',
      serviceModeLabel: 'Service mode',
      serviceModeBothLabel: 'Physical + online',
      serviceModePhysicalLabel: 'Physical address',
      serviceModeOnlineLabel: 'Online only',
      checklistStatusLabel: (status) => statusCopy[status],
      saveChecklistLabel: 'Save',
      defaultsTitle: 'SEO Settings for Main Pages',
      defaultsDescription: 'Wix-style variable patterns applied when individual page values are empty.',
      saveDefaultsLabel: 'Save defaults',
      patternPreviewTitle: 'Pattern preview',
      editByPageTitle: 'Edit by Page',
      resetTitleLabel: 'Reset title',
      resetDescriptionLabel: 'Reset description',
      allowIndexingLabel: 'Allow indexing',
      blockIndexingLabel: 'Block indexing',
      resetSelectedLabel: 'Reset selected',
      selectedCountLabel: (count) => `${count} selected`,
      pageColumnLabel: 'Page',
      scoreColumnLabel: 'Score',
      indexableColumnLabel: 'Indexable',
      issuesColumnLabel: 'Issues',
      assistantColumnLabel: 'Assistant',
      keywordsColumnLabel: 'Keywords',
      yesLabel: 'Yes',
      noLabel: 'No',
      issueCountsLabel: (blockers, warnings) => `${blockers} blocker · ${warnings} warning`,
      todoCountLabel: (count) => `${count} todo`,
      savingChecklistLabel: 'Saving checklist...',
      checklistSaveFailedLabel: 'Checklist save failed',
      savedLabel: 'Saved',
      savingDefaultsLabel: 'Saving SEO settings...',
      defaultsSaveFailedLabel: 'SEO settings save failed',
      defaultsSavedLabel: 'SEO settings saved',
      savingRobotsLabel: 'Saving robots.txt...',
      robotsSaveFailedLabel: 'Robots.txt save failed',
      robotsSavedLabel: 'Robots.txt saved',
      selectPagesFirstLabel: 'Select pages first.',
      savingBulkLabel: 'Saving bulk edit...',
      bulkSaveFailedLabel: 'Bulk edit failed',
      bulkSavedLabel: 'Bulk edit saved',
      titlePatternLabel: 'Title tag pattern',
      descriptionPatternLabel: 'Meta description pattern',
      ogTitlePatternLabel: 'OG title pattern',
      ogDescriptionPatternLabel: 'OG description pattern',
      twitterCardLabel: 'Twitter card',
      twitterSummaryLargeLabel: 'summary_large_image',
      twitterSummaryLabel: 'summary',
      robotsPlaceholder: ROBOTS_PLACEHOLDER,
      toolsTitle: 'Technical SEO Tools',
      redirectManagerLabel: 'URL Redirect Manager',
      redirectManagerDescription: '301/302/307/308 redirects',
      sitemapLabel: 'Sitemap',
      sitemapDescription: 'Published indexable pages only',
      robotsLabel: 'Robots.txt',
      robotsDescription: 'Noindex pages are disallowed',
      customRobotsTitle: 'Custom robots.txt',
      customRobotsDescription: 'Leave it empty to auto-generate rules from the site noindex pages.',
      customRobotsAriaLabel: 'Custom robots.txt',
      saveRobotsLabel: 'Save robots',
    };
  }

  const statusCopy = statusLabels(locale);
  return {
    title: 'SEO 대시보드',
    lede: '체크리스트, 기본 패턴, 페이지별 편집, 리디렉션을 한 곳에서 관리합니다.',
    redirectsLabel: '리디렉션',
    builderLabel: '빌더',
    averageScoreLabel: '평균 점수',
    pagesLabel: '페이지',
    publishedLabel: '게시됨',
    indexableLabel: '색인 가능',
    blockersLabel: '차단 항목',
    warningsLabel: '경고',
    checklistTabLabel: 'SEO 체크리스트',
    defaultsTabLabel: 'SEO 설정',
    pagesTabLabel: '페이지별 편집',
    toolsTabLabel: '도구',
    checklistTitle: 'SEO 체크리스트',
    checklistDescription: '비즈니스 이름과 최대 5개 키워드를 기준으로 사이트 작업을 생성합니다.',
    businessNameLabel: '비즈니스 이름',
    keywordsLabel: '키워드',
    keywordsPlaceholder: '키워드 1, 키워드 2',
    serviceModeLabel: '서비스 모드',
    serviceModeBothLabel: '오프라인 + 온라인',
    serviceModePhysicalLabel: '오프라인 주소',
    serviceModeOnlineLabel: '온라인만',
    checklistStatusLabel: (status) => statusCopy[status],
    saveChecklistLabel: '저장',
    defaultsTitle: '주요 페이지 SEO 설정',
    defaultsDescription: '개별 페이지 값이 비어 있을 때 적용되는 Wix식 변수 패턴입니다.',
    saveDefaultsLabel: '기본값 저장',
    patternPreviewTitle: '패턴 미리보기',
    editByPageTitle: '페이지별 편집',
    resetTitleLabel: '제목 초기화',
    resetDescriptionLabel: '설명 초기화',
    allowIndexingLabel: '색인 허용',
    blockIndexingLabel: '색인 차단',
    resetSelectedLabel: '선택 항목 초기화',
    selectedCountLabel: (count) => `${count}개 선택됨`,
    pageColumnLabel: '페이지',
    scoreColumnLabel: '점수',
    indexableColumnLabel: '색인 가능',
    issuesColumnLabel: '이슈',
    assistantColumnLabel: '어시스턴트',
    keywordsColumnLabel: '키워드',
    yesLabel: '예',
    noLabel: '아니요',
    issueCountsLabel: (blockers, warnings) => `${blockers} 차단 · ${warnings} 경고`,
    todoCountLabel: (count) => `${count} 할 일`,
    savingChecklistLabel: '체크리스트 저장 중...',
    checklistSaveFailedLabel: '체크리스트 저장 실패',
    savedLabel: '저장됨',
    savingDefaultsLabel: 'SEO 설정 저장 중...',
    defaultsSaveFailedLabel: 'SEO 설정 저장 실패',
    defaultsSavedLabel: 'SEO 설정 저장됨',
    savingRobotsLabel: 'Robots.txt 저장 중...',
    robotsSaveFailedLabel: 'Robots.txt 저장 실패',
    robotsSavedLabel: 'Robots.txt 저장됨',
    selectPagesFirstLabel: '페이지를 먼저 선택하세요.',
    savingBulkLabel: '일괄 편집 저장 중...',
    bulkSaveFailedLabel: '일괄 편집 실패',
    bulkSavedLabel: '일괄 편집 저장됨',
    titlePatternLabel: '제목 태그 패턴',
    descriptionPatternLabel: '메타 설명 패턴',
    ogTitlePatternLabel: 'OG 제목 패턴',
    ogDescriptionPatternLabel: 'OG 설명 패턴',
    twitterCardLabel: '트위터 카드',
    twitterSummaryLargeLabel: 'summary_large_image',
    twitterSummaryLabel: 'summary',
    robotsPlaceholder: ROBOTS_PLACEHOLDER,
    toolsTitle: '기술 SEO 도구',
    redirectManagerLabel: 'URL 리디렉션 관리자',
    redirectManagerDescription: '301/302/307/308 리디렉션',
    sitemapLabel: '사이트맵',
    sitemapDescription: '게시된 색인 가능 페이지만',
    robotsLabel: 'robots.txt',
    robotsDescription: 'noindex 페이지는 허용되지 않습니다',
    customRobotsTitle: '사용자 정의 robots.txt',
    customRobotsDescription: '비우면 사이트의 noindex 페이지를 기준으로 자동 생성합니다.',
    customRobotsAriaLabel: '사용자 정의 robots.txt',
    saveRobotsLabel: 'Robots 저장',
  };
}
