export function getListUiCopy(locale: string) {
  const lang = String(locale || "").toLowerCase();
  const isKo = lang === "ko" || lang.startsWith("ko-");
  const isZhHant = lang === "zh-hant" || lang.startsWith("zh-hant");

  if (isKo) {
    return {
      search: "검색",
      searchRecords: "항목 검색",
      searchFormLabel: "이 목록 검색",
      clearSearch: "검색 지우기",
      sortLabel: "정렬 옵션",
      sortBy: "정렬 기준",
      defaultOrder: "기본 순서",
      ascending: "오름차순",
      descending: "내림차순",
      filtersLabel: "적용된 필터",
      activeFilters: "적용된 필터",
      clearFilters: "필터 지우기",
      paginationLabel: "페이지 탐색",
      previous: "이전",
      next: "다음",
      searchSummary: "검색",
      sortSummary: "정렬",
      contains: "포함",
      showing: (shown: number, total: number) => `항목 ${total}개 중 ${shown}개 표시`,
    };
  }

  if (isZhHant) {
    return {
      search: "搜尋",
      searchRecords: "搜尋項目",
      searchFormLabel: "清單搜尋",
      clearSearch: "清除搜尋",
      sortLabel: "排序選項",
      sortBy: "排序依據",
      defaultOrder: "預設順序",
      ascending: "遞增",
      descending: "遞減",
      filtersLabel: "使用中的篩選",
      activeFilters: "使用中的篩選",
      clearFilters: "清除篩選",
      paginationLabel: "分頁",
      previous: "上一頁",
      next: "下一頁",
      searchSummary: "搜尋",
      sortSummary: "排序",
      contains: "包含",
      showing: (shown: number, total: number) => `顯示 ${total} 個項目中的 ${shown} 個`,
    };
  }

  return {
    search: "Search",
    searchRecords: "Search records",
    searchFormLabel: "Search this list",
    clearSearch: "Clear search",
    sortLabel: "Sort options",
    sortBy: "Sort by",
    defaultOrder: "Default order",
    ascending: "ascending",
    descending: "descending",
    filtersLabel: "Active filters",
    activeFilters: "Active filters",
    clearFilters: "Clear filters",
    paginationLabel: "Pagination",
    previous: "Previous",
    next: "Next",
    searchSummary: "search",
    sortSummary: "sort",
    contains: "contains",
    showing: (shown: number, total: number) => `Showing ${shown} of ${total} items`,
  };
}
