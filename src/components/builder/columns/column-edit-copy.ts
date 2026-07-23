import type { Locale } from '@/lib/locales';

export interface ColumnEditCopy {
  pageTitle: string;
  notFoundTitle: string;
  notFoundDescription: string;
  untitledColumn: string;
  backToList: string;
  backToHomeAria: string;
  backToHome: string;
  quickNavAria: string;
  breadcrumbAria: string;
  breadcrumbHome: string;
  breadcrumbList: string;
  openPublicPage: string;
  advancedSummaryTitle: string;
  advancedSummaryDescription: string;
  previewLabel: string;
  previewReadingTimeSuffix: string;
  previewFallback: string;
  draftLabel: string;
  slugPreviewPublished: string;
  slugPreviewDraft: string;
  editor: {
    saveStateSaving: string;
    saveStateSaved: string;
    saveStateError: string;
    publicPage: string;
    save: string;
    publish: string;
    titlePlaceholder: string;
    bodyPlaceholder: string;
    imageButton: string;
    imageButtonAria: string;
    linkPrompt: string;
    toolbarButtons: {
      blockquote: string;
      codeBlock: string;
      horizontalRule: string;
      link: string;
    };
    summary: {
      label: string;
      direct: string;
      auto: string;
      placeholder: string;
      help: string;
    };
    saveAlerts: {
      rateLimitUnavailable: string;
      tooManyRequests: string;
      failure: (error: string | number) => string;
      networkError: string;
    };
    publishAlerts: {
      success: string;
      redirect: (count: number) => string;
      redirectSkipped: (reason: string) => string;
      rateLimitUnavailable: string;
      tooManyRequests: string;
      failure: (error: string | number) => string;
      networkError: string;
    };
  };
  frontmatter: {
    panelHeading: string;
    settings: string;
    publish: string;
    featuredTitle: string;
    featuredDescription: string;
    publishDate: string;
    lastModified: string;
    slugLabel: string;
    slugHint: string;
    slugInputAria: string;
    saveSlug: string;
    saving: string;
    slugSaved: string;
    slugSame: string;
    slugSaveError: string;
    slugSavedRedirect: (from: string, to: string) => string;
    category: string;
    tags: string;
    tagPlaceholder: string;
    tagRemove: (tag: string) => string;
    author: string;
    authorPreset: string;
    authorName: string;
    authorTitle: string;
    authorPhoto: string;
    featuredImage: string;
    featuredImagePlaceholder: string;
    seo: string;
    seoTitle: string;
    seoDescription: string;
    seoOgImage: string;
    noIndexTitle: string;
    noIndexDescription: string;
    review: string;
    reviewStatus: string;
    reviewPending: string;
    reviewReviewed: string;
    reviewNeedsRevision: string;
    freshness: string;
    freshnessFresh: string;
    freshnessReviewNeeded: string;
    freshnessUnknown: string;
  };
  localeLinker: {
    heading: string;
    placeholder: string;
    open: string;
    localeNames: Record<'ko' | 'zh-hant' | 'en', string>;
  };
}

const COLUMN_EDIT_COPY: Record<Locale, ColumnEditCopy> = {
  ko: {
    pageTitle: '칼럼 편집기',
    notFoundTitle: '칼럼을 찾을 수 없습니다',
    notFoundDescription: '에 해당하는 draft 가 없습니다.',
    untitledColumn: '제목 없는 칼럼',
    backToList: '← 목록으로',
    backToHomeAria: '편집 홈 메뉴로 돌아가기',
    backToHome: '편집기 홈으로 돌아가기',
    quickNavAria: '칼럼 편집 빠른 이동',
    breadcrumbAria: '칼럼 편집 이동 경로',
    breadcrumbHome: '← 편집기 홈으로 돌아가기',
    breadcrumbList: '칼럼 목록',
    openPublicPage: '공개 페이지 열기',
    advancedSummaryTitle: '고급 설정',
    advancedSummaryDescription: '카테고리, 대표 이미지, 번역, 미리보기',
    previewLabel: '미리보기',
    previewReadingTimeSuffix: '분 읽기',
    previewFallback: '본문 미리보기',
    draftLabel: '초안',
    slugPreviewPublished: ' · 발행된 redirect 보호됨',
    slugPreviewDraft: ' · 초안 전용',
    editor: {
      saveStateSaving: '저장 중',
      saveStateSaved: '저장됨',
      saveStateError: '저장 실패',
      publicPage: '공개 페이지',
      save: '저장',
      publish: '발행',
      titlePlaceholder: '칼럼 제목',
      bodyPlaceholder: '칼럼 본문을 여기에 작성하세요...',
      imageButton: '사진',
      imageButtonAria: '사진 삽입',
      linkPrompt: '링크 URL:',
      toolbarButtons: {
        blockquote: '인용',
        codeBlock: '코드',
        horizontalRule: '구분선',
        link: '링크',
      },
      summary: {
        label: '목록 설명',
        direct: '직접 입력 사용 중',
        auto: '본문 앞부분으로 자동 생성',
        placeholder: '비워두면 본문 앞부분으로 자동 생성됩니다.',
        help: '티스토리처럼 제목과 본문만 쓰면 자동으로 목록 설명이 저장됩니다. 필요한 경우에만 직접 입력하세요.',
      },
      saveAlerts: {
        rateLimitUnavailable: '저장 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        tooManyRequests: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
        failure: (error) => `저장 실패: ${error}`,
        networkError: '저장 중 네트워크 오류가 발생했습니다.',
      },
      publishAlerts: {
        success: '발행 완료! AI 상담사 인덱싱이 백그라운드에서 진행됩니다.',
        redirect: (count) => `\n기존 slug URL 301 redirect ${count}개가 생성되었습니다.`,
        redirectSkipped: (reason) => `\nSlug redirect는 건너뛰었습니다 (${reason}).`,
        rateLimitUnavailable: '발행 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        tooManyRequests: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
        failure: (error) => `발행 실패: ${error}`,
        networkError: '발행 중 네트워크 오류가 발생했습니다.',
      },
    },
    frontmatter: {
      panelHeading: '글 설정',
      settings: '설정',
      publish: '발행',
      featuredTitle: '추천',
      featuredDescription: '목록과 위젯에서 우선 노출',
      publishDate: '발행일',
      lastModified: '최종 수정일',
      slugLabel: 'URL slug',
      slugHint: '공개된 칼럼의 slug를 바꾸면 다음 발행 때 기존 URL에서 새 URL로 301 redirect를 자동 생성합니다.',
      slugInputAria: 'Column URL slug',
      saveSlug: 'URL 저장',
      saving: '저장 중',
      slugSaved: 'URL slug가 저장되었습니다.',
      slugSame: '현재 URL slug와 같습니다.',
      slugSaveError: 'URL slug 저장에 실패했습니다.',
      slugSavedRedirect: (from, to) => `발행하면 ${from} -> ${to} 301 redirect가 생성됩니다.`,
      category: '카테고리',
      tags: '태그',
      tagPlaceholder: '태그 입력 후 Enter',
      tagRemove: (tag) => `${tag} 태그 제거`,
      author: '저자',
      authorPreset: '프리셋',
      authorName: '저자명',
      authorTitle: '직책',
      authorPhoto: '사진 URL',
      featuredImage: '대표 이미지',
      featuredImagePlaceholder: 'https://...',
      seo: 'SEO',
      seoTitle: 'SEO 제목',
      seoDescription: 'SEO 설명',
      seoOgImage: 'OG 이미지 URL',
      noIndexTitle: '색인 제외',
      noIndexDescription: '검색엔진 색인 제외',
      review: '검토',
      reviewStatus: '변호사 검토',
      reviewPending: '검토 대기',
      reviewReviewed: '검토 완료',
      reviewNeedsRevision: '수정 필요',
      freshness: '신선도',
      freshnessFresh: '최신',
      freshnessReviewNeeded: '재검토 필요',
      freshnessUnknown: '불명',
    },
    localeLinker: {
      heading: '다국어 연결',
      placeholder: '연결할 slug',
      open: '열기',
      localeNames: {
        ko: '한국어',
        'zh-hant': '繁體中文',
        en: 'English',
      },
    },
  },
  'zh-hant': {
    pageTitle: '欄目編輯器',
    notFoundTitle: '找不到欄目',
    notFoundDescription: '沒有對應的 draft。',
    untitledColumn: '未命名欄目',
    backToList: '← 返回列表',
    backToHomeAria: '返回編輯首頁選單',
    backToHome: '返回編輯首頁',
    quickNavAria: '欄目編輯快速導覽',
    breadcrumbAria: '欄目編輯導覽',
    breadcrumbHome: '← 返回編輯首頁',
    breadcrumbList: '欄目列表',
    openPublicPage: '開啟公開頁面',
    advancedSummaryTitle: '進階設定',
    advancedSummaryDescription: '分類、代表圖片、翻譯、預覽',
    previewLabel: '預覽',
    previewReadingTimeSuffix: '分鐘閱讀',
    previewFallback: '本文預覽',
    draftLabel: '草稿',
    slugPreviewPublished: ' · 已發佈 redirect 保護中',
    slugPreviewDraft: ' · 僅限草稿',
    editor: {
      saveStateSaving: '儲存中',
      saveStateSaved: '已儲存',
      saveStateError: '儲存失敗',
      publicPage: '公開頁面',
      save: '儲存',
      publish: '發佈',
      titlePlaceholder: '欄目標題',
      bodyPlaceholder: '請在這裡撰寫欄目內容...',
      imageButton: '圖片',
      imageButtonAria: '插入圖片',
      linkPrompt: '連結 URL：',
      toolbarButtons: {
        blockquote: '引用',
        codeBlock: '程式碼',
        horizontalRule: '分隔線',
        link: '連結',
      },
      summary: {
        label: '列表說明',
        direct: '正在使用手動輸入',
        auto: '自動從本文開頭產生',
        placeholder: '留白時會自動用本文開頭產生。',
        help: '像 Tistory 一樣，只要填標題與本文就會自動儲存列表說明；只有需要時才手動輸入。',
      },
      saveAlerts: {
        rateLimitUnavailable: '儲存服務暫時無法使用。請稍後再試。',
        tooManyRequests: '請求過多。請稍後再試。',
        failure: (error) => `儲存失敗：${error}`,
        networkError: '儲存時發生網路錯誤。',
      },
      publishAlerts: {
        success: '發佈完成！AI 顧問索引會在背景執行。',
        redirect: (count) => `\n已建立 ${count} 個舊 slug URL 的 301 redirect。`,
        redirectSkipped: (reason) => `\n已跳過 slug redirect（${reason}）。`,
        rateLimitUnavailable: '發佈服務暫時無法使用。請稍後再試。',
        tooManyRequests: '請求過多。請稍後再試。',
        failure: (error) => `發佈失敗：${error}`,
        networkError: '發佈時發生網路錯誤。',
      },
    },
    frontmatter: {
      panelHeading: '文章設定',
      settings: '設定',
      publish: '發佈',
      featuredTitle: '精選',
      featuredDescription: '在列表與 widget 中優先顯示',
      publishDate: '發佈日期',
      lastModified: '最後修改日',
      slugLabel: 'URL slug',
      slugHint: '若變更公開欄目的 slug，下次發佈時會自動從舊 URL 301 redirect 到新 URL。',
      slugInputAria: 'Column URL slug',
      saveSlug: '儲存 URL',
      saving: '儲存中',
      slugSaved: 'URL slug 已儲存。',
      slugSame: '目前與 URL slug 相同。',
      slugSaveError: 'URL slug 儲存失敗。',
      slugSavedRedirect: (from, to) => `發佈後會建立 ${from} -> ${to} 的 301 redirect。`,
      category: '分類',
      tags: '標籤',
      tagPlaceholder: '輸入標籤後按 Enter',
      tagRemove: (tag) => `移除 ${tag} 標籤`,
      author: '作者',
      authorPreset: '預設',
      authorName: '作者姓名',
      authorTitle: '職稱',
      authorPhoto: '照片 URL',
      featuredImage: '代表圖片',
      featuredImagePlaceholder: 'https://...',
      seo: 'SEO',
      seoTitle: 'SEO 標題',
      seoDescription: 'SEO 描述',
      seoOgImage: 'OG 圖片 URL',
      noIndexTitle: '不索引',
      noIndexDescription: '排除搜尋引擎索引',
      review: '審閱',
      reviewStatus: '律師審閱',
      reviewPending: '待審閱',
      reviewReviewed: '已審閱',
      reviewNeedsRevision: '需要修訂',
      freshness: '新鮮度',
      freshnessFresh: '最新',
      freshnessReviewNeeded: '需要重新檢查',
      freshnessUnknown: '未知',
    },
    localeLinker: {
      heading: '多語言連結',
      placeholder: '輸入要連結的 slug',
      open: '開啟',
      localeNames: {
        ko: '韓文',
        'zh-hant': '繁體中文',
        en: '英文',
      },
    },
  },
  en: {
    pageTitle: 'Column Editor',
    notFoundTitle: 'Column not found',
    notFoundDescription: 'No draft exists for',
    untitledColumn: 'Untitled column',
    backToList: '← Back to list',
    backToHomeAria: 'Back to editor home',
    backToHome: 'Back to editor home',
    quickNavAria: 'Column editor quick navigation',
    breadcrumbAria: 'Column editor navigation',
    breadcrumbHome: '← Back to editor home',
    breadcrumbList: 'Column list',
    openPublicPage: 'Open public page',
    advancedSummaryTitle: 'Advanced settings',
    advancedSummaryDescription: 'Categories, featured image, translations, preview',
    previewLabel: 'Preview',
    previewReadingTimeSuffix: 'min read',
    previewFallback: 'Article preview',
    draftLabel: 'Draft',
    slugPreviewPublished: ' · published redirect protected',
    slugPreviewDraft: ' · draft only',
    editor: {
      saveStateSaving: 'Saving',
      saveStateSaved: 'Saved',
      saveStateError: 'Save failed',
      publicPage: 'Public page',
      save: 'Save',
      publish: 'Publish',
      titlePlaceholder: 'Column title',
      bodyPlaceholder: 'Write the column body here...',
      imageButton: 'Image',
      imageButtonAria: 'Insert image',
      linkPrompt: 'Link URL:',
      toolbarButtons: {
        blockquote: 'Quote',
        codeBlock: 'Code',
        horizontalRule: 'Divider',
        link: 'Link',
      },
      summary: {
        label: 'List description',
        direct: 'Using manual entry',
        auto: 'Auto-generated from the article intro',
        placeholder: 'Leave blank to auto-generate from the article intro.',
        help: 'Like Tistory, the list description is saved automatically when you only write a title and article. Enter it manually only when needed.',
      },
      saveAlerts: {
        rateLimitUnavailable: 'The save service is temporarily unavailable. Please try again shortly.',
        tooManyRequests: 'Too many requests. Please try again shortly.',
        failure: (error) => `Save failed: ${error}`,
        networkError: 'A network error occurred while saving.',
      },
      publishAlerts: {
        success: 'Published! AI assistant indexing is running in the background.',
        redirect: (count) => `\n${count} old slug URL 301 redirects were created.`,
        redirectSkipped: (reason) => `\nSlug redirect was skipped (${reason}).`,
        rateLimitUnavailable: 'The publish service is temporarily unavailable. Please try again shortly.',
        tooManyRequests: 'Too many requests. Please try again shortly.',
        failure: (error) => `Publish failed: ${error}`,
        networkError: 'A network error occurred while publishing.',
      },
    },
    frontmatter: {
      panelHeading: 'Post settings',
      settings: 'Settings',
      publish: 'Publish',
      featuredTitle: 'Featured',
      featuredDescription: 'Prioritize in lists and widgets',
      publishDate: 'Publish date',
      lastModified: 'Last modified',
      slugLabel: 'URL slug',
      slugHint: 'Changing the public column slug will automatically create a 301 redirect from the old URL to the new one on the next publish.',
      slugInputAria: 'Column URL slug',
      saveSlug: 'Save URL',
      saving: 'Saving',
      slugSaved: 'URL slug saved.',
      slugSame: 'This matches the current URL slug.',
      slugSaveError: 'Failed to save the URL slug.',
      slugSavedRedirect: (from, to) => `Publishing will create a 301 redirect from ${from} to ${to}.`,
      category: 'Category',
      tags: 'Tags',
      tagPlaceholder: 'Enter a tag and press Enter',
      tagRemove: (tag) => `Remove ${tag} tag`,
      author: 'Author',
      authorPreset: 'Preset',
      authorName: 'Author name',
      authorTitle: 'Title',
      authorPhoto: 'Photo URL',
      featuredImage: 'Featured image',
      featuredImagePlaceholder: 'https://...',
      seo: 'SEO',
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      seoOgImage: 'OG image URL',
      noIndexTitle: 'No index',
      noIndexDescription: 'Exclude from search engine indexing',
      review: 'Review',
      reviewStatus: 'Attorney review',
      reviewPending: 'Pending review',
      reviewReviewed: 'Reviewed',
      reviewNeedsRevision: 'Needs revision',
      freshness: 'Freshness',
      freshnessFresh: 'Fresh',
      freshnessReviewNeeded: 'Needs review',
      freshnessUnknown: 'Unknown',
    },
    localeLinker: {
      heading: 'Locale links',
      placeholder: 'Enter the linked slug',
      open: 'Open',
      localeNames: {
        ko: 'Korean',
        'zh-hant': 'Traditional Chinese',
        en: 'English',
      },
    },
  },
};

export function getColumnEditCopy(locale: Locale): ColumnEditCopy {
  return COLUMN_EDIT_COPY[locale] ?? COLUMN_EDIT_COPY.en;
}
