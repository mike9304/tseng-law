import type { Locale } from '@/lib/locales';

interface SeoAssistantTaskCopy {
  indexable: {
    label: string;
    enabled: string;
    noIndex: string;
  };
  h1: {
    label: string;
    valid: string;
    invalid: (count: number) => string;
  };
  imageAlt: {
    label: string;
    valid: string;
    invalid: (count: number) => string;
  };
  keywordTitle: {
    label: string;
    valid: (keyword: string) => string;
    invalid: (keyword: string) => string;
    applyHint: (keyword: string, title: string) => string;
  };
  keywordDescription: {
    label: string;
    valid: (keyword: string) => string;
    invalid: (keyword: string) => string;
  };
  keywordSlug: {
    label: string;
    valid: string;
    invalid: string;
  };
  keywordBody: {
    label: string;
    valid: (keyword: string) => string;
    invalid: (keyword: string) => string;
  };
  focusKeyword: {
    label: string;
    detail: string;
  };
}

export function getSeoAssistantTaskCopy(locale: Locale): SeoAssistantTaskCopy {
  if (locale === 'zh-hant') {
    return {
      indexable: {
        label: '允許搜尋引擎索引此頁',
        enabled: '此頁面可被搜尋引擎索引。',
        noIndex: '若此頁需要搜尋曝光，請關閉 noindex。',
      },
      h1: {
        label: '頁面保留一個 H1',
        valid: 'H1 結構正確。',
        invalid: (count) => `目前有 ${count} 個 H1。請只保留一個核心標題作為 H1。`,
      },
      imageAlt: {
        label: '為圖片撰寫 alt text',
        valid: '圖片 alt text 已填寫。',
        invalid: (count) => `有 ${count} 張圖片缺少 alt text。`,
      },
      keywordTitle: {
        label: '在標題標籤加入焦點關鍵字',
        valid: (keyword) => `Title 已包含「${keyword}」。`,
        invalid: (keyword) => `請自然地在 SEO title 中加入「${keyword}」。`,
        applyHint: (keyword, title) => `${keyword} | ${title}`.slice(0, 60),
      },
      keywordDescription: {
        label: '在 meta description 加入焦點關鍵字',
        valid: (keyword) => `Description 已包含「${keyword}」。`,
        invalid: (keyword) => `請在 meta description 中加入「${keyword}」。`,
      },
      keywordSlug: {
        label: '在 URL slug 加入焦點關鍵字',
        valid: 'Slug 已與焦點關鍵字連結。',
        invalid: '可行時，也請在 URL slug 中簡短反映核心搜尋字詞。',
      },
      keywordBody: {
        label: '在頁面內文加入焦點關鍵字',
        valid: (keyword) => `內文已包含「${keyword}」。`,
        invalid: (keyword) => `請自然地在頁面內文中加入「${keyword}」。`,
      },
      focusKeyword: {
        label: '設定焦點關鍵字',
        detail: '輸入每頁的焦點關鍵字後，就能像 Wix SEO Assistant 一樣產生更具體的工作項目。',
      },
    };
  }

  if (locale === 'en') {
    return {
      indexable: {
        label: 'Let search engines index this page',
        enabled: 'This page is eligible for search-engine indexing.',
        noIndex: 'Turn off noindex if this page should appear in search.',
      },
      h1: {
        label: 'Use one H1 on the page',
        valid: 'The H1 structure is correct.',
        invalid: (count) => `There are ${count} H1 elements. Keep one core page title as the H1.`,
      },
      imageAlt: {
        label: 'Write alt text for images',
        valid: 'Image alt text is filled in.',
        invalid: (count) => `${count} image(s) are missing alt text.`,
      },
      keywordTitle: {
        label: 'Add focus keyword to title tag',
        valid: (keyword) => `The title includes "${keyword}".`,
        invalid: (keyword) => `Add "${keyword}" naturally to the SEO title.`,
        applyHint: (keyword, title) => `${keyword} | ${title}`.slice(0, 60),
      },
      keywordDescription: {
        label: 'Add focus keyword to meta description',
        valid: (keyword) => `The description includes "${keyword}".`,
        invalid: (keyword) => `Add "${keyword}" to the meta description.`,
      },
      keywordSlug: {
        label: 'Add focus keyword to URL slug',
        valid: 'The slug is connected to the focus keyword.',
        invalid: 'When possible, reflect the core search term briefly in the URL slug too.',
      },
      keywordBody: {
        label: 'Add focus keyword to page body',
        valid: (keyword) => `The page body includes "${keyword}".`,
        invalid: (keyword) => `Add "${keyword}" naturally to the page body.`,
      },
      focusKeyword: {
        label: 'Set a focus keyword',
        detail: 'Enter a page-specific focus keyword to generate more specific work items like Wix SEO Assistant.',
      },
    };
  }

  return {
    indexable: {
      label: '검색엔진 색인 허용',
      enabled: '페이지가 검색엔진 색인 대상입니다.',
      noIndex: '검색 노출이 필요한 페이지라면 noindex를 끄세요.',
    },
    h1: {
      label: '페이지에 H1 하나 사용',
      valid: 'H1 구조가 적절합니다.',
      invalid: (count) => `현재 H1이 ${count}개입니다. 핵심 제목 하나만 H1로 유지하세요.`,
    },
    imageAlt: {
      label: '이미지 대체 텍스트 작성',
      valid: '이미지 대체 텍스트가 채워져 있습니다.',
      invalid: (count) => `${count}개 이미지에 대체 텍스트가 없습니다.`,
    },
    keywordTitle: {
      label: '제목 태그에 포커스 키워드 추가',
      valid: (keyword) => `제목에 "${keyword}"가 포함되어 있습니다.`,
      invalid: (keyword) => `SEO 제목에 "${keyword}"를 자연스럽게 포함하세요.`,
      applyHint: (keyword, title) => `${keyword} | ${title}`.slice(0, 60),
    },
    keywordDescription: {
      label: '메타 설명에 포커스 키워드 추가',
      valid: (keyword) => `설명에 "${keyword}"가 포함되어 있습니다.`,
      invalid: (keyword) => `메타 설명에 "${keyword}"를 포함하세요.`,
    },
    keywordSlug: {
      label: 'URL 슬러그에 포커스 키워드 추가',
      valid: '슬러그가 포커스 키워드와 연결되어 있습니다.',
      invalid: '가능하면 URL 슬러그에도 핵심 검색어를 짧게 반영하세요.',
    },
    keywordBody: {
      label: '페이지 본문에 포커스 키워드 추가',
      valid: (keyword) => `본문에 "${keyword}"가 포함되어 있습니다.`,
      invalid: (keyword) => `페이지 본문에 "${keyword}"를 자연스럽게 포함하세요.`,
    },
    focusKeyword: {
      label: '포커스 키워드 설정',
      detail: '페이지별 포커스 키워드를 입력하면 Wix SEO 도우미처럼 더 구체적인 작업이 생성됩니다.',
    },
  };
}
