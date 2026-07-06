import type { Locale } from '@/lib/locales';

export interface SeoPanelCopy {
  dialogLabel: string;
  title: string;
  applyRecommendation: string;
  close: string;
  cancel: string;
  save: string;
  saving: string;
  loading: string;
  tabs: {
    basics: string;
    social: string;
    advanced: string;
    hreflang: string;
    assistant: string;
  };
  summary: (blockers: number, warnings: number) => string;
  noPageSelected: string;
  loadError: string;
  saveError: string;
  assistantSaving: string;
  assistantSaved: string;
  assistantSaveFailed: string;
  redirectWarning: (from: string, message: string) => string;
  recommendationSiteNameFallback: string;
  recommendationDescription: (heading: string, siteName: string) => string;
  pageTitleFallback: string;
  searchDescriptionFallback: string;
  socialDescriptionFallback: string;
}

export function getSeoPanelCopy(locale: Locale): SeoPanelCopy {
  if (locale === 'zh-hant') {
    return {
      dialogLabel: '頁面 SEO',
      title: '頁面 SEO',
      applyRecommendation: '套用建議',
      close: '關閉',
      cancel: '取消',
      save: '儲存',
      saving: '儲存中...',
      loading: '載入中...',
      tabs: {
        basics: '基本',
        social: '社群分享',
        advanced: '進階',
        hreflang: 'Hreflang 與 Sitemap',
        assistant: '助理',
      },
      summary: (blockers, warnings) => `阻擋 ${blockers} · 警告 ${warnings}`,
      noPageSelected: '目前沒有選取頁面。',
      loadError: '無法載入 SEO 中繼資料。',
      saveError: '無法儲存 SEO 中繼資料。',
      assistantSaving: '儲存中...',
      assistantSaved: '已儲存',
      assistantSaveFailed: '助理儲存失敗',
      redirectWarning: (from, message) => `SEO 中繼資料已儲存，但未建立 ${from} 重新導向。請檢查現有重新導向規則。(${message})`,
      recommendationSiteNameFallback: '皓正國際',
      recommendationDescription: (heading, siteName) => `${heading} 頁面。可查看 ${siteName} 的主要服務與諮詢資訊。`,
      pageTitleFallback: '頁面標題',
      searchDescriptionFallback: '輸入要顯示在搜尋結果中的頁面描述。',
      socialDescriptionFallback: '輸入社群分享描述。',
    };
  }

  if (locale === 'en') {
    return {
      dialogLabel: 'Page SEO',
      title: 'Page SEO',
      applyRecommendation: 'Apply recommendation',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      loading: 'Loading...',
      tabs: {
        basics: 'Basics',
        social: 'Social share',
        advanced: 'Advanced',
        hreflang: 'Hreflang & Sitemap',
        assistant: 'Assistant',
      },
      summary: (blockers, warnings) => `blocker ${blockers} · warning ${warnings}`,
      noPageSelected: 'No page is currently selected.',
      loadError: 'Could not load SEO metadata.',
      saveError: 'Could not save SEO metadata.',
      assistantSaving: 'Saving...',
      assistantSaved: 'Saved',
      assistantSaveFailed: 'Assistant save failed',
      redirectWarning: (from, message) => `SEO metadata was saved, but the ${from} redirect was not created. Check existing redirect rules. (${message})`,
      recommendationSiteNameFallback: 'HoJeong International',
      recommendationDescription: (heading, siteName) => `${heading} page. Visitors can review ${siteName}'s key services and consultation information.`,
      pageTitleFallback: 'Page title',
      searchDescriptionFallback: 'Enter the page description shown in search results.',
      socialDescriptionFallback: 'Enter a social sharing description.',
    };
  }

  return {
    dialogLabel: '페이지 SEO',
    title: '페이지 SEO',
    applyRecommendation: '추천 적용',
    close: '닫기',
    cancel: '취소',
    save: '저장',
    saving: '저장 중...',
    loading: '로딩 중...',
    tabs: {
      basics: '기본',
      social: '소셜 공유',
      advanced: '고급',
      hreflang: 'Hreflang / 사이트맵',
      assistant: '도우미',
    },
    summary: (blockers, warnings) => `차단 ${blockers}개 · 경고 ${warnings}개`,
    noPageSelected: '현재 선택된 페이지가 없습니다.',
    loadError: 'SEO 메타데이터를 불러오지 못했습니다.',
    saveError: 'SEO 메타데이터를 저장하지 못했습니다.',
    assistantSaving: '저장 중...',
    assistantSaved: '저장됨',
    assistantSaveFailed: '도우미 저장 실패',
    redirectWarning: (from, message) => `SEO 메타데이터는 저장됐지만 ${from} 리디렉트는 생성되지 않았습니다. 기존 리디렉트 규칙을 확인하세요. (${message})`,
    recommendationSiteNameFallback: '호정국제',
    recommendationDescription: (heading, siteName) => `${heading} 페이지입니다. ${siteName}의 주요 서비스와 상담 정보를 확인할 수 있습니다.`,
    pageTitleFallback: '페이지 제목',
    searchDescriptionFallback: '검색 결과에 표시될 페이지 설명을 입력하세요.',
    socialDescriptionFallback: '소셜 공유 설명을 입력하세요.',
  };
}
