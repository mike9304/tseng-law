import type { Locale } from '@/lib/locales';

export interface RedirectManagerCopy {
  title: string;
  sectionLabel: string;
  heading: string;
  description: string;
  createButton: string;
  sourcePlaceholder: string;
  destinationPlaceholder: string;
  notePlaceholder: string;
  helper: string;
  searchPlaceholder: string;
  clearSearch: string;
  emptyState: string;
  emptyFilteredState: string;
  fromColumn: string;
  toColumn: string;
  kindColumn: string;
  statusColumn: string;
  activeColumn: string;
  noteColumn: string;
  actionsColumn: string;
  wildcardLabel: string;
  wildcardDescription: string;
  exactLabel: string;
  enabledLabel: string;
  saveButton: string;
  deleteButton: string;
  activeCount: string;
  visibleOf: string;
  rulesLabel: string;
  noteLabel: string;
  sourceLabel: string;
  destinationLabel: string;
  statusLabel: string;
  ruleLabel: string;
  addSuccess: string;
  saveSuccess: string;
  deleteSuccess: string;
  addError: string;
  saveError: string;
  wildcardOverlapError: string;
  deleteError: string;
  deleteConfirmPrefix: string;
  searchTokens: string[];
  wildcardSearchTokens: string[];
  activeSearchTokens: string[];
}

const REDIRECT_MANAGER_COPY: Record<Locale, RedirectManagerCopy> = {
  ko: {
    title: 'SEO — 리디렉션 규칙',
    sectionLabel: 'SEO redirects',
    heading: '리디렉션 규칙',
    description: '{visible}개 표시 / {total}개 규칙, 현재 {active}개 활성화 · {locale}',
    createButton: '규칙 추가',
    sourcePlaceholder: '/old-path',
    destinationPlaceholder: '/new-path',
    notePlaceholder: '선택 메모',
    helper: '원본 경로 끝에 <code>/*</code>를 붙이면 와일드카드 리디렉션이 됩니다. 하위 URL 접미사를 유지하려면 대상에도 붙이세요.',
    searchPlaceholder: '원본, 대상, 메모, 활성, 와일드카드 검색',
    clearSearch: '검색 지우기',
    emptyState: '아직 리디렉션 규칙이 없습니다.',
    emptyFilteredState: '검색과 일치하는 리디렉션 규칙이 없습니다.',
    fromColumn: '원본',
    toColumn: '대상',
    kindColumn: '종류',
    statusColumn: '상태',
    activeColumn: '활성',
    noteColumn: '메모',
    actionsColumn: '동작',
    wildcardLabel: '와일드카드',
    wildcardDescription: '하위 접미사 유지',
    exactLabel: '정확 일치',
    enabledLabel: '사용',
    saveButton: '저장',
    deleteButton: '삭제',
    activeCount: '활성',
    visibleOf: '표시 /',
    rulesLabel: '개 규칙',
    noteLabel: '메모',
    sourceLabel: '원본 경로',
    destinationLabel: '대상 경로',
    statusLabel: '리디렉션 상태',
    ruleLabel: '리디렉션 규칙',
    addSuccess: '리디렉션 규칙이 생성되었습니다.',
    saveSuccess: '리디렉션 규칙이 저장되었습니다.',
    deleteSuccess: '리디렉션 규칙이 삭제되었습니다.',
    addError: '리디렉션 규칙 생성에 실패했습니다.',
    saveError: '리디렉션 규칙 저장에 실패했습니다.',
    wildcardOverlapError: '활성 와일드카드 규칙 {from}과 겹칩니다. 기존 규칙을 비활성화하거나 원본 경로를 조정하세요.',
    deleteError: '리디렉션 규칙 삭제에 실패했습니다.',
    deleteConfirmPrefix: '삭제할까요?',
    searchTokens: ['source', 'destination', 'note', 'active', 'wildcard'],
    wildcardSearchTokens: ['와일드카드', 'wildcard suffix-preserving'],
    activeSearchTokens: ['활성', 'active'],
  },
  'zh-hant': {
    title: 'SEO — 重新導向規則',
    sectionLabel: 'SEO redirects',
    heading: '重新導向規則',
    description: '{visible} 個顯示 / {total} 條規則，{active} 個已啟用 · {locale}',
    createButton: '新增規則',
    sourcePlaceholder: '/old-path',
    destinationPlaceholder: '/new-path',
    notePlaceholder: '選填備註',
    helper: '在來源路徑後加上 <code>/*</code> 即可建立萬用重新導向；若要保留巢狀 URL 後綴，目的地也請一併加上。',
    searchPlaceholder: '搜尋來源、目的地、備註、啟用、萬用',
    clearSearch: '清除搜尋',
    emptyState: '目前沒有重新導向規則。',
    emptyFilteredState: '沒有符合搜尋的重新導向規則。',
    fromColumn: '來源',
    toColumn: '目的地',
    kindColumn: '類型',
    statusColumn: '狀態',
    activeColumn: '啟用',
    noteColumn: '備註',
    actionsColumn: '操作',
    wildcardLabel: '萬用',
    wildcardDescription: '保留巢狀後綴',
    exactLabel: '完全符合',
    enabledLabel: '啟用',
    saveButton: '儲存',
    deleteButton: '刪除',
    activeCount: '啟用',
    visibleOf: '顯示 /',
    rulesLabel: '條規則',
    noteLabel: '備註',
    sourceLabel: '來源路徑',
    destinationLabel: '目的地路徑',
    statusLabel: '重新導向狀態',
    ruleLabel: '重新導向規則',
    addSuccess: '重新導向規則已建立。',
    saveSuccess: '重新導向規則已儲存。',
    deleteSuccess: '重新導向規則已刪除。',
    addError: '建立重新導向規則失敗。',
    saveError: '儲存重新導向規則失敗。',
    wildcardOverlapError: '與已啟用的萬用重新導向 {from} 重疊。請停用既有規則或調整來源路徑。',
    deleteError: '刪除重新導向規則失敗。',
    deleteConfirmPrefix: '要刪除嗎？',
    searchTokens: ['source', 'destination', 'note', 'active', 'wildcard'],
    wildcardSearchTokens: ['萬用', 'wildcard suffix-preserving'],
    activeSearchTokens: ['啟用', 'active'],
  },
  en: {
    title: 'SEO — Redirect Rules',
    sectionLabel: 'SEO redirects',
    heading: 'Redirect Rules',
    description: '{visible} visible of {total} rules, {active} active for {locale}',
    createButton: 'Add rule',
    sourcePlaceholder: '/old-path',
    destinationPlaceholder: '/new-path',
    notePlaceholder: 'Optional note',
    helper: 'Use a trailing <code>/*</code> on the source path for wildcard redirects. Add it to the destination too if you want nested URL suffixes preserved.',
    searchPlaceholder: 'Search source, destination, note, active, wildcard',
    clearSearch: 'Clear search',
    emptyState: 'No redirect rules yet.',
    emptyFilteredState: 'No redirect rules match your search.',
    fromColumn: 'From',
    toColumn: 'To',
    kindColumn: 'Kind',
    statusColumn: 'Status',
    activeColumn: 'Active',
    noteColumn: 'Note',
    actionsColumn: 'Actions',
    wildcardLabel: 'Wildcard',
    wildcardDescription: 'Preserves nested suffixes',
    exactLabel: 'Exact',
    enabledLabel: 'Enabled',
    saveButton: 'Save',
    deleteButton: 'Delete',
    activeCount: 'active',
    visibleOf: 'visible of',
    rulesLabel: 'rules',
    noteLabel: 'Note',
    sourceLabel: 'Source path',
    destinationLabel: 'Destination path',
    statusLabel: 'Redirect status',
    ruleLabel: 'redirect rule',
    addSuccess: 'Redirect rule created.',
    saveSuccess: 'Redirect rule saved.',
    deleteSuccess: 'Redirect rule deleted.',
    addError: 'Failed to create redirect rule.',
    saveError: 'Failed to update redirect rule.',
    wildcardOverlapError: 'This overlaps the active wildcard rule {from}. Disable that rule or adjust the source path.',
    deleteError: 'Failed to delete redirect rule.',
    deleteConfirmPrefix: 'Delete',
    searchTokens: ['source', 'destination', 'note', 'active', 'wildcard'],
    wildcardSearchTokens: ['wildcard', 'wildcard suffix-preserving'],
    activeSearchTokens: ['active'],
  },
};

export function getRedirectManagerCopy(locale: Locale): RedirectManagerCopy {
  return REDIRECT_MANAGER_COPY[locale] ?? REDIRECT_MANAGER_COPY.en;
}
