import type { Locale } from '@/lib/locales';
import type { BuiltInSectionCategory, BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import type { SavedSectionCategory } from '@/lib/builder/site/types';

interface BuiltInSectionsPanelCopy {
  marketEyebrow: string;
  marketName: string;
  categoryFilterAriaLabel: string;
  allPacks: string;
  emptyState: string;
  addTemplateTitle: (name: string) => string;
  categoryLabels: Record<BuiltInSectionCategory, string>;
}

interface BuiltInSectionTemplateDisplayCopy {
  name: string;
  description: string;
  thumbnailHint: string;
  searchKeywords: string[];
}

interface SavedSectionsPanelCopy {
  title: (count: number) => string;
  refresh: string;
  loadListFailed: string;
  loadListError: string;
  deleteConfirm: (name: string) => string;
  deleteFailed: string;
  deleteError: string;
  renameFailed: string;
  renameError: string;
  insertFailed: string;
  usageUpdateFailed: string;
  loading: string;
  emptyTitle: string;
  emptyHint: string;
  cardTitle: (name: string) => string;
  usage: (count: number) => string;
  insertTitle: string;
  insertLabel: string;
  renameTitle: string;
  renameLabel: string;
  deleteTitle: string;
  deleteLabel: string;
  categoryLabels: Record<SavedSectionCategory, string>;
}

interface SaveSectionModalCopy {
  title: string;
  ariaLabel: string;
  closeAriaLabel: string;
  intro: string;
  nameLabel: string;
  namePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  categoryLabel: string;
  cancel: string;
  save: string;
  saving: string;
  nameRequired: string;
  invalidSectionData: string;
  saveFailed: string;
  categoryLabels: Record<SavedSectionCategory, string>;
}

const BUILT_IN_SECTION_CATEGORY_LABELS: Record<Locale, Record<BuiltInSectionCategory, string>> = {
  ko: {
    hero: '히어로',
    features: '기능',
    testimonials: '후기',
    cta: 'CTA',
    footer: '푸터',
    legal: '법률',
    stats: '통계',
    pricing: '가격',
    team: '팀',
    gallery: '갤러리',
    faq: 'FAQ',
    services: '서비스',
    contact: '문의',
  },
  'zh-hant': {
    hero: '主視覺',
    features: '功能',
    testimonials: '見證',
    cta: 'CTA',
    footer: '頁尾',
    legal: '法律',
    stats: '數據',
    pricing: '價格',
    team: '團隊',
    gallery: '圖庫',
    faq: 'FAQ',
    services: '服務',
    contact: '聯絡',
  },
  en: {
    hero: 'Hero',
    features: 'Features',
    testimonials: 'Testimonials',
    cta: 'CTA',
    footer: 'Footer',
    legal: 'Legal',
    stats: 'Stats',
    pricing: 'Pricing',
    team: 'Team',
    gallery: 'Gallery',
    faq: 'FAQ',
    services: 'Services',
    contact: 'Contact',
  },
};

const BUILT_IN_SECTIONS_PANEL_COPY: Record<Locale, BuiltInSectionsPanelCopy> = {
  ko: {
    marketEyebrow: '디자인 팩',
    marketName: '섹션 템플릿 마켓',
    categoryFilterAriaLabel: '섹션 템플릿 카테고리',
    allPacks: '전체 팩',
    emptyState: '검색어와 맞는 섹션 템플릿이 없습니다.',
    addTemplateTitle: (name) => `${name} 섹션 추가`,
    categoryLabels: BUILT_IN_SECTION_CATEGORY_LABELS.ko,
  },
  'zh-hant': {
    marketEyebrow: '設計套件',
    marketName: '區段範本市集',
    categoryFilterAriaLabel: '區段範本分類',
    allPacks: '所有套件',
    emptyState: '沒有符合搜尋字詞的區段範本。',
    addTemplateTitle: (name) => `新增 ${name} 區段`,
    categoryLabels: BUILT_IN_SECTION_CATEGORY_LABELS['zh-hant'],
  },
  en: {
    marketEyebrow: 'Design packs',
    marketName: 'Section template market',
    categoryFilterAriaLabel: 'Section template categories',
    allPacks: 'All packs',
    emptyState: 'No section templates match your search.',
    addTemplateTitle: (name) => `Add ${name} section`,
    categoryLabels: BUILT_IN_SECTION_CATEGORY_LABELS.en,
  },
};

export function getBuiltInSectionsPanelCopy(locale: Locale = 'ko'): BuiltInSectionsPanelCopy {
  return BUILT_IN_SECTIONS_PANEL_COPY[locale];
}

const SECTION_TEMPLATE_TITLE_TOKENS: Record<Locale, Record<string, string>> = {
  ko: {
    'Cross-border': '국제',
    Video: '비디오',
    Background: '배경',
    Hero: '히어로',
    Minimal: '미니멀',
    Eyebrow: '아이브로우',
    Parallax: '패럴랙스',
    Layer: '레이어',
    Four: '4개',
    Three: '3개',
    Two: '2개',
    Single: '단일',
    Column: '열',
    Columns: '열',
    Features: '기능',
    Feature: '기능',
    Alternating: '교차형',
    Rows: '행',
    Row: '행',
    Large: '대형',
    Card: '카드',
    Cards: '카드',
    Spotlight: '스포트라이트',
    Testimonial: '후기',
    Testimonials: '후기',
    Story: '스토리',
    Logo: '로고',
    Trust: '신뢰',
    Grid: '그리드',
    Gradient: '그라디언트',
    CTA: 'CTA',
    Band: '밴드',
    Dark: '다크',
    Newsletter: '뉴스레터',
    Footer: '푸터',
    Contact: '문의',
    Bar: '바',
    Cookie: '쿠키',
    Notice: '알림',
    Banner: '배너',
    Counter: '카운터',
    Metric: '지표',
    Strip: '스트립',
    Stats: '통계',
    Award: '수상',
    Badges: '배지',
    Tier: '단계',
    Pricing: '가격',
    Comparison: '비교',
    Plan: '플랜',
    Summary: '요약',
    Table: '표',
    Team: '팀',
    Horizontal: '가로형',
    Featured: '추천',
    Leader: '리더',
    Mosaic: '모자이크',
    Gallery: '갤러리',
    Masonry: '메이슨리',
    Carousel: '캐러셀',
    Thumbnails: '썸네일',
    Lightbox: '라이트박스',
    FAQ: 'FAQ',
    Accordion: '아코디언',
    Category: '카테고리',
    Tabs: '탭',
    Service: '서비스',
    Services: '서비스',
    Icons: '아이콘',
    List: '목록',
    With: '포함',
    Image: '이미지',
    Images: '이미지',
    Process: '프로세스',
    Ladder: '래더',
    Risk: '리스크',
    Matrix: '매트릭스',
    Retainer: '월 자문',
    Packages: '패키지',
    Industry: '산업',
    Solution: '솔루션',
    Solutions: '솔루션',
    Desk: '데스크',
    Case: '사건',
    Intake: '접수',
    Flow: '흐름',
    Form: '폼',
    Info: '정보',
    Map: '지도',
    And: '및',
    Split: '분할',
    Centered: '중앙 정렬',
    Icon: '아이콘',
    Quote: '인용',
    Legal: '법률',
    Disclaimer: '고지',
    Privacy: '개인정보',
    Practice: '업무분야',
    Bento: '벤토',
    Board: '보드',
    Options: '옵션',
  },
  'zh-hant': {
    'Cross-border': '跨境',
    Video: '影片',
    Background: '背景',
    Hero: '主視覺',
    Minimal: '極簡',
    Eyebrow: '眉標',
    Parallax: '視差',
    Layer: '圖層',
    Four: '四欄',
    Three: '三欄',
    Two: '雙欄',
    Single: '單一',
    Column: '欄',
    Columns: '欄',
    Features: '功能',
    Feature: '功能',
    Alternating: '交錯',
    Rows: '列',
    Row: '列',
    Large: '大型',
    Card: '卡片',
    Cards: '卡片',
    Spotlight: '焦點',
    Testimonial: '見證',
    Testimonials: '見證',
    Story: '故事',
    Logo: '標誌',
    Trust: '信任',
    Grid: '格線',
    Gradient: '漸層',
    CTA: 'CTA',
    Band: '區帶',
    Dark: '深色',
    Newsletter: '電子報',
    Footer: '頁尾',
    Contact: '聯絡',
    Bar: '列',
    Cookie: 'Cookie',
    Notice: '通知',
    Banner: '橫幅',
    Counter: '計數器',
    Metric: '指標',
    Strip: '長條',
    Stats: '數據',
    Award: '獎項',
    Badges: '徽章',
    Tier: '層級',
    Pricing: '價格',
    Comparison: '比較',
    Plan: '方案',
    Summary: '摘要',
    Table: '表格',
    Team: '團隊',
    Horizontal: '水平',
    Featured: '精選',
    Leader: '領導者',
    Mosaic: '拼貼',
    Gallery: '圖庫',
    Masonry: '瀑布流',
    Carousel: '輪播',
    Thumbnails: '縮圖',
    Lightbox: '燈箱',
    FAQ: 'FAQ',
    Accordion: '手風琴',
    Category: '分類',
    Tabs: '分頁',
    Service: '服務',
    Services: '服務',
    Icons: '圖示',
    List: '列表',
    With: '搭配',
    Image: '圖片',
    Images: '圖片',
    Process: '流程',
    Ladder: '階梯',
    Risk: '風險',
    Matrix: '矩陣',
    Retainer: '顧問合約',
    Packages: '方案包',
    Industry: '產業',
    Solution: '解決方案',
    Solutions: '解決方案',
    Desk: '服務台',
    Case: '案件',
    Intake: '接案',
    Flow: '流程',
    Form: '表單',
    Info: '資訊',
    Map: '地圖',
    And: '與',
    Split: '分割',
    Centered: '置中',
    Icon: '圖示',
    Quote: '引言',
    Legal: '法律',
    Disclaimer: '免責聲明',
    Privacy: '隱私',
    Practice: '業務',
    Bento: '便當格',
    Board: '看板',
    Options: '選項',
  },
  en: {},
};

function localizeSectionTemplateName(template: BuiltInSectionTemplate, locale: Locale): string {
  if (locale === 'en') return template.name;
  const tokenCopy = SECTION_TEMPLATE_TITLE_TOKENS[locale];
  return template.name
    .split(/\s+/)
    .map((token) => tokenCopy[token] ?? token)
    .join(locale === 'zh-hant' ? '' : ' ');
}

export function getBuiltInSectionTemplateDisplayCopy(
  template: BuiltInSectionTemplate,
  locale: Locale = 'ko',
): BuiltInSectionTemplateDisplayCopy {
  const panelCopy = getBuiltInSectionsPanelCopy(locale);
  const name = localizeSectionTemplateName(template, locale);
  const categoryLabel = panelCopy.categoryLabels[template.category];
  const description = locale === 'ko'
    ? template.description ?? `${name} 섹션 템플릿`
    : locale === 'zh-hant'
      ? `${name}區段版面，適合${categoryLabel}內容。`
      : `${name} layout for ${categoryLabel.toLocaleLowerCase('en-US')} sections.`;
  return {
    name,
    description,
    thumbnailHint: locale === 'en'
      ? template.thumbnailHint ?? template.category
      : categoryLabel,
    searchKeywords: [
      template.name,
      template.description ?? '',
      template.thumbnailHint ?? '',
      template.category,
    ],
  };
}

export function builtInSectionTemplateDisplayMatchesQuery(
  template: BuiltInSectionTemplate,
  locale: Locale,
  query: string,
): boolean {
  if (!query) return true;
  const copy = getBuiltInSectionTemplateDisplayCopy(template, locale);
  return [
    copy.name,
    copy.description,
    copy.thumbnailHint,
    ...copy.searchKeywords,
  ].some((value) => value.toLocaleLowerCase('ko-KR').includes(query));
}

const SAVED_SECTION_CATEGORY_LABELS: Record<Locale, Record<SavedSectionCategory, string>> = {
  ko: {
    hero: '히어로',
    features: '기능',
    testimonials: '후기',
    cta: 'CTA',
    footer: '푸터',
    custom: '사용자 지정',
  },
  'zh-hant': {
    hero: '主視覺',
    features: '功能',
    testimonials: '見證',
    cta: 'CTA',
    footer: '頁尾',
    custom: '自訂',
  },
  en: {
    hero: 'Hero',
    features: 'Features',
    testimonials: 'Testimonials',
    cta: 'CTA',
    footer: 'Footer',
    custom: 'Custom',
  },
};

const SAVED_SECTIONS_PANEL_COPY: Record<Locale, SavedSectionsPanelCopy> = {
  ko: {
    title: (count) => `저장한 섹션 (${count})`,
    refresh: '새로고침',
    loadListFailed: '섹션 목록을 불러오지 못했습니다.',
    loadListError: '섹션 목록 오류',
    deleteConfirm: (name) => `"${name}" 섹션을 삭제하시겠습니까?`,
    deleteFailed: '삭제에 실패했습니다.',
    deleteError: '삭제 오류',
    renameFailed: '이름 변경에 실패했습니다.',
    renameError: '이름 변경 오류',
    insertFailed: '섹션을 현재 페이지에 추가하지 못했습니다.',
    usageUpdateFailed: '섹션 사용 횟수를 업데이트하지 못했습니다.',
    loading: '불러오는 중...',
    emptyTitle: '아직 저장한 섹션이 없습니다.',
    emptyHint: '캔버스에서 컨테이너를 우클릭 -> "섹션으로 저장"으로 추가하세요.',
    cardTitle: (name) => `${name} - 캔버스로 드래그하거나 두 번 클릭하여 추가`,
    usage: (count) => `사용 ${count}회`,
    insertTitle: '현재 페이지에 추가',
    insertLabel: '추가',
    renameTitle: '이름 변경',
    renameLabel: '이름',
    deleteTitle: '삭제',
    deleteLabel: '삭제',
    categoryLabels: SAVED_SECTION_CATEGORY_LABELS.ko,
  },
  'zh-hant': {
    title: (count) => `已儲存區段 (${count})`,
    refresh: '重新整理',
    loadListFailed: '無法載入區段清單。',
    loadListError: '區段清單錯誤',
    deleteConfirm: (name) => `確定要刪除「${name}」區段嗎？`,
    deleteFailed: '刪除失敗。',
    deleteError: '刪除錯誤',
    renameFailed: '重新命名失敗。',
    renameError: '重新命名錯誤',
    insertFailed: '無法將區段新增到目前頁面。',
    usageUpdateFailed: '無法更新區段使用次數。',
    loading: '載入中...',
    emptyTitle: '尚未儲存任何區段。',
    emptyHint: '在畫布中對容器按右鍵，選擇「儲存為區段」即可新增。',
    cardTitle: (name) => `${name} - 拖曳到畫布，或按兩下插入`,
    usage: (count) => `使用 ${count} 次`,
    insertTitle: '新增到目前頁面',
    insertLabel: '新增',
    renameTitle: '重新命名',
    renameLabel: '名稱',
    deleteTitle: '刪除',
    deleteLabel: '刪除',
    categoryLabels: SAVED_SECTION_CATEGORY_LABELS['zh-hant'],
  },
  en: {
    title: (count) => `Saved sections (${count})`,
    refresh: 'Refresh',
    loadListFailed: 'Could not load saved sections.',
    loadListError: 'Saved sections error',
    deleteConfirm: (name) => `Delete "${name}" section?`,
    deleteFailed: 'Delete failed.',
    deleteError: 'Delete error',
    renameFailed: 'Rename failed.',
    renameError: 'Rename error',
    insertFailed: 'Could not add the section to the current page.',
    usageUpdateFailed: 'Could not update the section usage count.',
    loading: 'Loading...',
    emptyTitle: 'You do not have saved sections yet.',
    emptyHint: 'Right-click a container on the canvas and choose "Save as section" to add one.',
    cardTitle: (name) => `${name} - drag to canvas, double-click to insert`,
    usage: (count) => `Used ${count} times`,
    insertTitle: 'Add to current page',
    insertLabel: 'Add',
    renameTitle: 'Rename',
    renameLabel: 'Name',
    deleteTitle: 'Delete',
    deleteLabel: 'Delete',
    categoryLabels: SAVED_SECTION_CATEGORY_LABELS.en,
  },
};

export function getSavedSectionsPanelCopy(locale: Locale = 'ko'): SavedSectionsPanelCopy {
  return SAVED_SECTIONS_PANEL_COPY[locale];
}

const SAVE_SECTION_MODAL_COPY: Record<Locale, SaveSectionModalCopy> = {
  ko: {
    title: '섹션으로 저장',
    ariaLabel: '섹션으로 저장',
    closeAriaLabel: '닫기',
    intro: '선택한 컨테이너와 자식 요소를 라이브러리에 저장합니다. 다른 페이지에서 재사용할 수 있습니다.',
    nameLabel: '이름 *',
    namePlaceholder: '예) 호정 히어로 섹션',
    descriptionLabel: '설명 (선택)',
    descriptionPlaceholder: '섹션 용도, 사용 위치 등',
    categoryLabel: '카테고리',
    cancel: '취소',
    save: '저장',
    saving: '저장 중...',
    nameRequired: '이름을 입력하세요.',
    invalidSectionData: '선택한 섹션 데이터가 올바르지 않습니다.',
    saveFailed: '저장에 실패했습니다.',
    categoryLabels: SAVED_SECTION_CATEGORY_LABELS.ko,
  },
  'zh-hant': {
    title: '儲存為區段',
    ariaLabel: '儲存為區段',
    closeAriaLabel: '關閉',
    intro: '將選取的容器與子元素儲存到資料庫。你可以在其他頁面重複使用。',
    nameLabel: '名稱 *',
    namePlaceholder: '例：首頁主視覺區段',
    descriptionLabel: '說明（選填）',
    descriptionPlaceholder: '區段用途、使用位置等',
    categoryLabel: '分類',
    cancel: '取消',
    save: '儲存',
    saving: '儲存中...',
    nameRequired: '請輸入名稱。',
    invalidSectionData: '選取的區段資料不正確。',
    saveFailed: '儲存失敗。',
    categoryLabels: SAVED_SECTION_CATEGORY_LABELS['zh-hant'],
  },
  en: {
    title: 'Save as section',
    ariaLabel: 'Save as section',
    closeAriaLabel: 'Close',
    intro: 'Save the selected container and its child elements to your library. You can reuse it on other pages.',
    nameLabel: 'Name *',
    namePlaceholder: 'Example: homepage hero section',
    descriptionLabel: 'Description (optional)',
    descriptionPlaceholder: 'Section purpose, where to use it, and notes',
    categoryLabel: 'Category',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    nameRequired: 'Enter a name.',
    invalidSectionData: 'The selected section data is not valid.',
    saveFailed: 'Save failed.',
    categoryLabels: SAVED_SECTION_CATEGORY_LABELS.en,
  },
};

export function getSaveSectionModalCopy(locale: Locale = 'ko'): SaveSectionModalCopy {
  return SAVE_SECTION_MODAL_COPY[locale];
}
