import type { Locale } from '@/lib/locales';

type SeoValidationLengthField = 'title' | 'description';

export interface SeoValidationIssueText {
  message: string;
  fixHint: string;
}

export interface SeoValidationCopy {
  lengthMissing: (field: SeoValidationLengthField, min: number, max: number) => SeoValidationIssueText;
  lengthOutOfRange: (
    field: SeoValidationLengthField,
    min: number,
    max: number,
    currentLength: number,
  ) => SeoValidationIssueText;
  homeSlugNotEmpty: SeoValidationIssueText;
  slugMissing: SeoValidationIssueText;
  slugFormat: SeoValidationIssueText;
  slugDuplicate: SeoValidationIssueText;
  canonicalInvalid: SeoValidationIssueText;
  canonicalQuery: SeoValidationIssueText;
  canonicalCustom: SeoValidationIssueText;
  ogImageInvalid: SeoValidationIssueText;
  twitterImageInvalid: SeoValidationIssueText;
  focusKeywordLength: SeoValidationIssueText;
  additionalMetaTooMany: SeoValidationIssueText;
  additionalMetaEmpty: SeoValidationIssueText;
  additionalMetaNameInvalid: (name: string) => SeoValidationIssueText;
  additionalMetaDuplicate: (name: string) => SeoValidationIssueText;
  noIndexEnabled: SeoValidationIssueText;
  noFollowEnabled: SeoValidationIssueText;
  structuredDataOff: SeoValidationIssueText;
  customJsonLdObject: (label: string) => SeoValidationIssueText;
  customJsonLdInvalid: (label: string) => SeoValidationIssueText;
}

function koLengthLabel(field: SeoValidationLengthField): string {
  return field === 'title' ? 'SEO 제목' : 'SEO 설명';
}

function zhLengthLabel(field: SeoValidationLengthField): string {
  return field === 'title' ? 'SEO 標題' : 'SEO 描述';
}

function enLengthLabel(field: SeoValidationLengthField): string {
  return field === 'title' ? 'SEO title' : 'SEO description';
}

export function getSeoValidationCopy(locale: Locale): SeoValidationCopy {
  if (locale === 'zh-hant') {
    return {
      lengthMissing: (field, min, max) => ({
        message: `${zhLengthLabel(field)}尚未填寫。`,
        fixHint: field === 'title'
          ? `請輸入 ${min}-${max} 字的標題。`
          : `請輸入 ${min}-${max} 字的描述。`,
      }),
      lengthOutOfRange: (field, min, max, currentLength) => ({
        message: `${zhLengthLabel(field)}超出建議長度（${min}-${max} 字）。目前 ${currentLength} 字。`,
        fixHint: `請調整為 ${min}-${max} 字。`,
      }),
      homeSlugNotEmpty: {
        message: '首頁 slug 必須留空。',
        fixHint: '首頁使用語系根網址。',
      },
      slugMissing: {
        message: '頁面 slug 尚未填寫。',
        fixHint: '請輸入由小寫英文字母、數字和連字號組成的 slug。子頁面可用 services/investment 這類 / 路徑。',
      },
      slugFormat: {
        message: 'Slug 格式不正確。',
        fixHint: '每個路徑片段只能使用小寫英文字母、數字和連字號。例：services/investment',
      },
      slugDuplicate: {
        message: '同一語系中已有頁面使用相同 slug。',
        fixHint: '請輸入不會與其他頁面重複的 slug。',
      },
      canonicalInvalid: {
        message: 'Canonical URL 必須是 http 或 https 絕對網址。',
        fixHint: '例：https://example.com/zh-hant/page-slug',
      },
      canonicalQuery: {
        message: 'Canonical URL 包含 query string 或 hash。',
        fixHint: '建議儲存不含 query/hash 的代表網址。',
      },
      canonicalCustom: {
        message: '目前使用的 canonical URL 與預設公開網址不同。',
        fixHint: '只有在需要刻意整合重複內容時才使用 custom canonical。',
      },
      ogImageInvalid: {
        message: 'OG 圖片 URL 格式不正確。',
        fixHint: '請使用 https URL 或 builder asset URL。',
      },
      twitterImageInvalid: {
        message: 'Twitter 圖片 URL 格式不正確。',
        fixHint: '請使用 https URL 或 builder asset URL。',
      },
      focusKeywordLength: {
        message: '焦點關鍵字太長。',
        fixHint: '請使用 80 字以內的一組核心搜尋詞。',
      },
      additionalMetaTooMany: {
        message: 'Additional meta tag 建議最多 10 個。',
        fixHint: '只保留重要的 verification 或 rich result 標籤。',
      },
      additionalMetaEmpty: {
        message: 'Additional meta tag 有空白的 name 或 content。',
        fixHint: '請刪除空白 additional meta tag，或填入完整值。',
      },
      additionalMetaNameInvalid: (name) => ({
        message: `Additional meta tag name 格式不正確：${name}`,
        fixHint: '只能使用英文字母、數字、冒號、底線和連字號。',
      }),
      additionalMetaDuplicate: (name) => ({
        message: `Additional meta tag name 重複：${name}`,
        fixHint: '如果不是刻意重複，請只保留一個標籤。',
      }),
      noIndexEnabled: {
        message: '此頁目前是 noindex 狀態。',
        fixHint: '如果要出現在搜尋結果中，請開啟 index。',
      },
      noFollowEnabled: {
        message: '此頁目前是 nofollow 狀態。',
        fixHint: '如果要傳遞頁面內連結信號，請開啟 follow。',
      },
      structuredDataOff: {
        message: '此頁所有結構化資料都已關閉。',
        fixHint: '如果想在搜尋結果中取得延伸曝光，請開啟需要的 schema。',
      },
      customJsonLdObject: (label) => ({
        message: `Custom JSON-LD「${label}」必須是 object 格式。`,
        fixHint: 'JSON-LD 請使用 {"@context":"https://schema.org","@type":"..."} 格式。',
      }),
      customJsonLdInvalid: (label) => ({
        message: `Custom JSON-LD「${label}」的 JSON 格式不正確。`,
        fixHint: '儲存前請確認 JSON 語法。',
      }),
    };
  }

  if (locale === 'en') {
    return {
      lengthMissing: (field, min, max) => ({
        message: `${enLengthLabel(field)} is empty.`,
        fixHint: field === 'title'
          ? `Enter a title between ${min} and ${max} characters.`
          : `Enter a description between ${min} and ${max} characters.`,
      }),
      lengthOutOfRange: (field, min, max, currentLength) => ({
        message: `${enLengthLabel(field)} is outside the recommended range (${min}-${max} characters). Current length: ${currentLength}.`,
        fixHint: `Adjust it to ${min}-${max} characters.`,
      }),
      homeSlugNotEmpty: {
        message: 'The home page slug must be empty.',
        fixHint: 'The home page uses the locale root URL.',
      },
      slugMissing: {
        message: 'Page slug is empty.',
        fixHint: 'Enter a slug with lowercase letters, numbers, and hyphens. Use / for subpages, such as services/investment.',
      },
      slugFormat: {
        message: 'Slug format is invalid.',
        fixHint: 'Each path segment can only use lowercase letters, numbers, and hyphens. Example: services/investment',
      },
      slugDuplicate: {
        message: 'Another page in the same locale already uses this slug.',
        fixHint: 'Enter a slug that does not overlap with another page.',
      },
      canonicalInvalid: {
        message: 'Canonical URL must be an absolute http or https URL.',
        fixHint: 'Example: https://example.com/en/page-slug',
      },
      canonicalQuery: {
        message: 'Canonical URL includes a query string or hash.',
        fixHint: 'Save the representative URL without query strings or hashes.',
      },
      canonicalCustom: {
        message: 'This page uses a canonical URL different from the default public URL.',
        fixHint: 'Use a custom canonical only when intentionally consolidating duplicate content.',
      },
      ogImageInvalid: {
        message: 'OG image URL format is invalid.',
        fixHint: 'Use an https URL or builder asset URL.',
      },
      twitterImageInvalid: {
        message: 'Twitter image URL format is invalid.',
        fixHint: 'Use an https URL or builder asset URL.',
      },
      focusKeywordLength: {
        message: 'Focus keyword is too long.',
        fixHint: 'Use one core search term with 80 characters or fewer.',
      },
      additionalMetaTooMany: {
        message: 'Additional meta tags are recommended to stay under 10.',
        fixHint: 'Keep only important verification or rich result tags.',
      },
      additionalMetaEmpty: {
        message: 'An additional meta tag has an empty name or content value.',
        fixHint: 'Delete the empty additional meta tag or fill in its values.',
      },
      additionalMetaNameInvalid: (name) => ({
        message: `Additional meta tag name format is invalid: ${name}`,
        fixHint: 'Use only letters, numbers, colons, underscores, and hyphens.',
      }),
      additionalMetaDuplicate: (name) => ({
        message: `Additional meta tag name is duplicated: ${name}`,
        fixHint: 'Keep only one tag unless the duplicate is intentional.',
      }),
      noIndexEnabled: {
        message: 'This page is set to noindex.',
        fixHint: 'Turn on index if this page should appear in search results.',
      },
      noFollowEnabled: {
        message: 'This page is set to nofollow.',
        fixHint: 'Turn on follow to pass link signals from this page.',
      },
      structuredDataOff: {
        message: 'All structured data is turned off for this page.',
        fixHint: 'Turn on the needed schema if you want richer search results.',
      },
      customJsonLdObject: (label) => ({
        message: `Custom JSON-LD "${label}" must be an object.`,
        fixHint: 'Enter JSON-LD in the {"@context":"https://schema.org","@type":"..."} shape.',
      }),
      customJsonLdInvalid: (label) => ({
        message: `Custom JSON-LD "${label}" has invalid JSON syntax.`,
        fixHint: 'Check the JSON syntax before saving.',
      }),
    };
  }

  return {
    lengthMissing: (field, min, max) => ({
      message: `${koLengthLabel(field)}이 비어 있습니다.`,
      fixHint: field === 'title'
        ? `${min}-${max}자 사이의 제목을 입력하세요.`
        : `${min}-${max}자 사이의 설명을 입력하세요.`,
    }),
    lengthOutOfRange: (field, min, max, currentLength) => ({
      message: `${koLengthLabel(field)} 길이가 권장 범위(${min}-${max}자)를 벗어났습니다. 현재 ${currentLength}자입니다.`,
      fixHint: `${min}-${max}자 사이로 조정하세요.`,
    }),
    homeSlugNotEmpty: {
      message: '홈 페이지 슬러그는 비워야 합니다.',
      fixHint: '홈 페이지는 로케일 루트 URL을 사용합니다.',
    },
    slugMissing: {
      message: '페이지 슬러그가 비어 있습니다.',
      fixHint: '소문자 영문/숫자와 하이픈으로 구성된 슬러그를 입력하세요. 하위 페이지는 services/investment처럼 /로 구분합니다.',
    },
    slugFormat: {
      message: '슬러그 형식이 잘못되었습니다.',
      fixHint: '각 경로 조각에는 소문자 영문/숫자와 하이픈만 사용할 수 있습니다. 예: services/investment',
    },
    slugDuplicate: {
      message: '같은 로케일 안에 동일한 슬러그를 쓰는 페이지가 있습니다.',
      fixHint: '다른 페이지와 겹치지 않는 슬러그를 입력하세요.',
    },
    canonicalInvalid: {
      message: 'Canonical URL은 http 또는 https 절대 URL이어야 합니다.',
      fixHint: '예: https://example.com/ko/page-slug',
    },
    canonicalQuery: {
      message: 'Canonical URL에 query string 또는 hash가 포함되어 있습니다.',
      fixHint: '대표 URL은 query/hash 없이 저장하는 것을 권장합니다.',
    },
    canonicalCustom: {
      message: '기본 공개 URL과 다른 canonical URL을 사용 중입니다.',
      fixHint: '중복 콘텐츠를 의도적으로 통합할 때만 custom canonical을 사용하세요.',
    },
    ogImageInvalid: {
      message: 'OG 이미지 URL 형식이 올바르지 않습니다.',
      fixHint: 'https URL 또는 builder asset URL을 사용하세요.',
    },
    twitterImageInvalid: {
      message: 'Twitter 이미지 URL 형식이 올바르지 않습니다.',
      fixHint: 'https URL 또는 builder asset URL을 사용하세요.',
    },
    focusKeywordLength: {
      message: '포커스 키워드가 너무 깁니다.',
      fixHint: '80자 이하의 핵심 검색어 하나를 사용하세요.',
    },
    additionalMetaTooMany: {
      message: '추가 메타 태그는 최대 10개를 권장합니다.',
      fixHint: '중요한 verification/rich result 태그만 남기세요.',
    },
    additionalMetaEmpty: {
      message: '추가 메타 태그에 빈 name 또는 content가 있습니다.',
      fixHint: '비어 있는 추가 메타 태그는 삭제하거나 값을 입력하세요.',
    },
    additionalMetaNameInvalid: (name) => ({
      message: `추가 메타 태그 name 형식이 올바르지 않습니다: ${name}`,
      fixHint: '영문, 숫자, 콜론, 밑줄, 하이픈만 사용하세요.',
    }),
    additionalMetaDuplicate: (name) => ({
      message: `동일한 추가 메타 태그 name이 중복되었습니다: ${name}`,
      fixHint: '중복된 태그가 의도된 것이 아니라면 하나만 남기세요.',
    }),
    noIndexEnabled: {
      message: '이 페이지는 noindex 상태입니다.',
      fixHint: '검색 결과에 노출하려면 index를 켜세요.',
    },
    noFollowEnabled: {
      message: '이 페이지는 nofollow 상태입니다.',
      fixHint: '페이지 내 링크 신호를 전달하려면 follow를 켜세요.',
    },
    structuredDataOff: {
      message: '이 페이지의 구조화 데이터가 모두 꺼져 있습니다.',
      fixHint: '검색 결과 확장 노출을 원하면 필요한 schema를 켜세요.',
    },
    customJsonLdObject: (label) => ({
      message: `Custom JSON-LD "${label}"는 object 형태여야 합니다.`,
      fixHint: 'JSON-LD는 {"@context":"https://schema.org","@type":"..."} 형태로 입력하세요.',
    }),
    customJsonLdInvalid: (label) => ({
      message: `Custom JSON-LD "${label}"의 JSON 형식이 올바르지 않습니다.`,
      fixHint: '저장 전에 JSON 문법을 확인하세요.',
    }),
  };
}
