import type { Locale } from '@/lib/locales';

export interface SeoOverviewCopy {
  businessNameLabel: string;
  businessNameMissing: string;
  keywordsLabel: string;
  keywordsConfigured: (count: number) => string;
  keywordsMissing: string;
  seoFieldsLabel: string;
  seoFieldsMissing: (count: number) => string;
  indexableLabel: string;
  indexablePages: (count: number) => string;
  h1Label: string;
  h1Cleanup: (count: number) => string;
  imageAltLabel: string;
  imageAltMissing: (count: number) => string;
  blockersLabel: string;
  blockers: (count: number) => string;
}

export function getSeoOverviewCopy(locale: Locale): SeoOverviewCopy {
  if (locale === 'zh-hant') {
    return {
      businessNameLabel: '商家名稱',
      businessNameMissing: '請在 SEO checklist 中輸入商家名稱。',
      keywordsLabel: '關鍵字',
      keywordsConfigured: (count) => `${count}/5 個關鍵字已設定`,
      keywordsMissing: '請設定最多 5 個焦點關鍵字。',
      seoFieldsLabel: '頁面 SEO 欄位',
      seoFieldsMissing: (count) => `${count} 個頁面缺少標題或描述。`,
      indexableLabel: '可索引的公開頁面',
      indexablePages: (count) => `${count} 個已發佈頁面可被索引。`,
      h1Label: '每頁一個 H1',
      h1Cleanup: (count) => `${count} 個頁面需要整理 H1。`,
      imageAltLabel: '圖片 alt text',
      imageAltMissing: (count) => `${count} 張圖片缺少 alt text。`,
      blockersLabel: '發佈阻擋項目',
      blockers: (count) => `${count} 個阻擋問題分布在 builder pages。`,
    };
  }

  if (locale === 'en') {
    return {
      businessNameLabel: 'Business name',
      businessNameMissing: 'Enter a business name in the SEO checklist.',
      keywordsLabel: 'Keywords',
      keywordsConfigured: (count) => `${count}/5 keywords configured`,
      keywordsMissing: 'Set up to 5 focus keywords.',
      seoFieldsLabel: 'Page SEO fields',
      seoFieldsMissing: (count) => `${count} page(s) missing title or description`,
      indexableLabel: 'Indexable public pages',
      indexablePages: (count) => `${count} published indexable page(s)`,
      h1Label: 'One H1 per page',
      h1Cleanup: (count) => `${count} page(s) need H1 cleanup`,
      imageAltLabel: 'Image alt text',
      imageAltMissing: (count) => `${count} image(s) missing alt text`,
      blockersLabel: 'Publish blockers',
      blockers: (count) => `${count} blocker issue(s) across builder pages`,
    };
  }

  return {
    businessNameLabel: '비즈니스 이름',
    businessNameMissing: 'SEO 체크리스트에 비즈니스 이름을 입력하세요.',
    keywordsLabel: '키워드',
    keywordsConfigured: (count) => `${count}/5개 키워드 설정됨`,
    keywordsMissing: '최대 5개의 포커스 키워드를 설정하세요.',
    seoFieldsLabel: '페이지 SEO 필드',
    seoFieldsMissing: (count) => `${count}개 페이지에 제목 또는 설명이 없습니다.`,
    indexableLabel: '색인 가능한 공개 페이지',
    indexablePages: (count) => `${count}개 발행 페이지가 색인 가능합니다.`,
    h1Label: '페이지당 H1 하나',
    h1Cleanup: (count) => `${count}개 페이지의 H1 정리가 필요합니다.`,
    imageAltLabel: '이미지 대체 텍스트',
    imageAltMissing: (count) => `${count}개 이미지에 대체 텍스트가 없습니다.`,
    blockersLabel: '발행 차단 항목',
    blockers: (count) => `${count}개 차단 이슈가 빌더 페이지에 있습니다.`,
  };
}
