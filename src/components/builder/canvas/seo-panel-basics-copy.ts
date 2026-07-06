import type { Locale } from '@/lib/locales';

export interface SeoPanelBasicsCopy {
  basicsTitle: string;
  canonical: string;
  canonicalHelp: string;
  canonicalPlaceholder: string;
  createRedirect: string;
  createRedirectBody1: (locale: string, slug: string) => string;
  createRedirectBody2: string;
  description: string;
  descriptionPlaceholder: string;
  noFollow: string;
  noFollowBody: string;
  noIndex: string;
  noIndexBody: string;
  preview: string;
  recommendedCounter: (min: number, max: number) => string;
  slug: string;
  slugHelp: (locale: string, slug: string) => string;
  slugPlaceholder: string;
  title: string;
  titlePlaceholder: string;
}

export function getSeoPanelBasicsCopy(locale: Locale): SeoPanelBasicsCopy {
  if (locale === 'zh-hant') {
    return {
      basicsTitle: '基本搜尋設定',
      slug: 'Slug',
      slugPlaceholder: '英文小寫·連字號 · 例：page-slug 或 parent/child',
      slugHelp: (currentLocale, slug) => `最終 public URL 為 /${currentLocale}/${slug || ''}。子頁面使用 parent/child 格式。`,
      canonical: '標準 URL',
      canonicalPlaceholder: '完整 https 網址 · 例：https://example.com/page',
      canonicalHelp: '留白時會使用預設 public URL 作為 canonical。',
      createRedirect: '建立 301 重新導向',
      createRedirectBody1: (currentLocale, pageSlug) => `儲存時會為原 URL /${currentLocale}/${pageSlug} 加入導向到新 URL 的規則。`,
      createRedirectBody2: '若既有 redirect 規則已使用相同 URL，SEO 會儲存但略過 redirect。',
      title: 'SEO 標題',
      titlePlaceholder: '建議 30-60 字 · 例：國際訴訟專業律師事務所 | Tseng Law',
      description: '中繼描述',
      descriptionPlaceholder: '建議 120-160 字 · 例：台灣第一家韓語法律事務所，企業設立·投資·移民一站式服務。',
      noIndex: 'noindex',
      noIndexBody: '從搜尋結果中排除。',
      noFollow: 'nofollow',
      noFollowBody: '阻止頁面連結權重傳遞。',
      preview: 'Google 預覽',
      recommendedCounter: (min, max) => `建議 ${min}-${max} 字元`,
    };
  }

  if (locale === 'en') {
    return {
      basicsTitle: 'Basic SEO settings',
      slug: 'Slug',
      slugPlaceholder: 'lowercase + hyphens · e.g. page-slug or parent/child',
      slugHelp: (currentLocale, slug) => `The final public URL is /${currentLocale}/${slug || ''}. Use parent/child for child pages.`,
      canonical: 'Canonical URL',
      canonicalPlaceholder: 'Full https URL · e.g. https://example.com/page',
      canonicalHelp: 'Leave empty to use the default public URL as canonical.',
      createRedirect: 'Create 301 redirect',
      createRedirectBody1: (currentLocale, pageSlug) => `Saving adds a redirect from the current URL /${currentLocale}/${pageSlug} to the new URL.`,
      createRedirectBody2: 'If an existing redirect rule uses the same URL, SEO still saves and skips the redirect.',
      title: 'SEO title',
      titlePlaceholder: 'Recommended 30-60 chars · e.g. International litigation law firm | Tseng Law',
      description: 'Meta description',
      descriptionPlaceholder: 'Recommended 120-160 chars · e.g. Korean-speaking law firm in Taiwan — formation, investment, immigration, one-stop service.',
      noIndex: 'noindex',
      noIndexBody: 'Exclude this page from search results.',
      noFollow: 'nofollow',
      noFollowBody: 'Prevent link signal from passing from this page.',
      preview: 'Google preview',
      recommendedCounter: (min, max) => `Recommended ${min}-${max} chars`,
    };
  }

  return {
    basicsTitle: '기본 검색 설정',
    slug: '슬러그',
    slugPlaceholder: '영문 소문자·하이픈 · 예: page-slug 또는 parent/child',
    slugHelp: (currentLocale, slug) => `최종 public URL은 /${currentLocale}/${slug || ''} 입니다. 하위 페이지는 parent/child 형식을 사용합니다.`,
    canonical: '표준 URL',
    canonicalPlaceholder: '전체 https 주소 · 예: https://example.com/page',
    canonicalHelp: '비우면 기본 public URL을 canonical로 사용합니다.',
    createRedirect: '301 redirect 생성',
    createRedirectBody1: (currentLocale, pageSlug) => `저장 시 기존 URL /${currentLocale}/${pageSlug}에서 새 URL로 이동 규칙을 추가합니다.`,
    createRedirectBody2: '기존 redirect 규칙이 같은 URL을 쓰면 SEO는 저장되고 redirect만 건너뜁니다.',
    title: 'SEO 제목',
    titlePlaceholder: '권장 30~60자 · 예: 국제 소송 전문 로펌 | 호정국제',
    description: '메타 설명',
    descriptionPlaceholder: '권장 120~160자 · 예: 대만 최초 한국어 법률사무소, 기업 설립·투자·이민 원스톱 서비스.',
    noIndex: 'noindex',
    noIndexBody: '검색 결과에서 제외합니다.',
    noFollow: 'nofollow',
    noFollowBody: '페이지 링크 신호 전달을 막습니다.',
    preview: 'Google 미리보기',
    recommendedCounter: (min, max) => `권장 ${min}-${max}자`,
  };
}
