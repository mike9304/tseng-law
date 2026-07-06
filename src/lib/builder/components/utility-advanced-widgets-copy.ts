import type { Locale } from '@/lib/locales';

export type CodeBlockLanguageKey = 'ts' | 'js' | 'tsx' | 'jsx' | 'json' | 'html' | 'css' | 'bash' | 'text';

export interface UtilityAdvancedWidgetsCopy {
  codeBlock: {
    titleFallback: string;
    emptyCode: string;
    languageLabels: Record<CodeBlockLanguageKey, string>;
    inspector: {
      title: string;
      titlePlaceholder: string;
      language: string;
      code: string;
      showLineNumbers: string;
      caption: string;
      runMode: string;
      runModeInline: string;
      runModeFunction: string;
      functionBinding: string;
      functionBindingPlaceholder: string;
      functionDisabledSuffix: string;
      runCodeSlot: string;
      runningCodeSlot: string;
      runCodeSlotUnsupported: string;
      runCodeSlotEmpty: string;
      runCodeSlotFunctionEmpty: string;
      runCodeSlotFunctionLoading: string;
      runCodeSlotFunctionLoadFailed: string;
      runCodeSlotResult: string;
      runCodeSlotLogs: string;
      runCodeSlotHistory: string;
      runCodeSlotHistoryLoadFailed: string;
      runCodeSlotNoLogs: string;
      runCodeSlotError: string;
      runCodeSlotFailed: string;
      runCodeSlotInvalidResponse: string;
    };
  };
  videoEmbed: {
    runtime: {
      emptyUrl: string;
      invalidUrl: (providerLabel: string) => string;
      iframeTitle: string;
    };
    inspector: {
      provider: string;
      providers: Record<'youtube' | 'vimeo' | 'url', string>;
      sourceUrl: string;
      sourceUrlPlaceholder: string;
      posterImageUrl: string;
      posterImagePlaceholder: string;
      autoplay: string;
      loop: string;
      muted: string;
      showControls: string;
    };
  };
  anchorMenu: {
    navLabel: string;
    empty: string;
    defaultLabels: Record<string, string>;
    legacyLabels: Record<string, string>;
    inspector: {
      items: string;
      siteAnchors: string;
      syncAnchors: string;
      noSiteAnchors: string;
      addAnchor: (label: string) => string;
      addedAnchor: (label: string) => string;
      sticky: string;
      offsetTop: string;
      activeColor: string;
    };
  };
  parallaxBg: {
    defaultTitle: string;
    defaultSubtitle: string;
    inspector: {
      imageUrl: string;
      overlayColor: string;
      speed: string;
      title: string;
      subtitle: string;
    };
  };
}

export const CODE_BLOCK_LEGACY_DEFAULTS = {
  title: 'Code Block',
  emptyCode: '코드 스니펫을 입력하세요',
} as const;

export const ANCHOR_MENU_LEGACY_LABELS: Record<string, string> = {
  about: '소개',
  services: '서비스',
  contact: '문의',
};

export const PARALLAX_BG_LEGACY_DEFAULTS = {
  title: '신뢰의 법무 파트너',
  subtitle: '한국과 대만, 두 사법체계를 잇는 자문',
} as const;

export function localizedUtilityText(value: string | undefined, localized: string, legacyDefault: string): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

const UTILITY_ADVANCED_WIDGETS_COPY: Record<Locale, UtilityAdvancedWidgetsCopy> = {
  ko: {
    codeBlock: {
      titleFallback: '코드 블록',
      emptyCode: '코드 스니펫을 입력하세요',
      languageLabels: {
        ts: 'TypeScript',
        js: 'JavaScript',
        tsx: 'TSX',
        jsx: 'JSX',
        json: 'JSON',
        html: 'HTML',
        css: 'CSS',
        bash: 'Bash',
        text: '일반 텍스트',
      },
      inspector: {
        title: '제목',
        titlePlaceholder: '코드 블록',
        language: '언어',
        code: '코드',
        showLineNumbers: '줄 번호 표시',
        caption: 'JavaScript/TypeScript 함수 본문은 빌더 샌드박스에서 테스트 실행할 수 있습니다. 실행 가능한 HTML/embed 슬롯은 customEmbed를 사용하세요.',
        runMode: '실행 모드',
        runModeInline: '이 블록 코드',
        runModeFunction: '저장 함수',
        functionBinding: '저장 함수',
        functionBindingPlaceholder: '함수를 선택하세요',
        functionDisabledSuffix: '비활성',
        runCodeSlot: '코드 슬롯 실행',
        runningCodeSlot: '실행 중...',
        runCodeSlotUnsupported: 'JS/TS 코드 블록만 샌드박스 실행을 지원합니다.',
        runCodeSlotEmpty: '실행할 코드를 먼저 입력하세요.',
        runCodeSlotFunctionEmpty: '실행할 저장 함수를 선택하세요.',
        runCodeSlotFunctionLoading: '저장 함수를 불러오는 중입니다.',
        runCodeSlotFunctionLoadFailed: '저장 함수 목록을 불러오지 못했습니다.',
        runCodeSlotResult: '실행 결과',
        runCodeSlotLogs: '로그',
        runCodeSlotHistory: '최근 저장 로그',
        runCodeSlotHistoryLoadFailed: '저장된 코드 슬롯 로그를 불러오지 못했습니다.',
        runCodeSlotNoLogs: '기록된 로그가 없습니다.',
        runCodeSlotError: '실행 오류',
        runCodeSlotFailed: '코드 슬롯 실행에 실패했습니다.',
        runCodeSlotInvalidResponse: '코드 슬롯 실행 응답을 읽을 수 없습니다.',
      },
    },
    videoEmbed: {
      runtime: {
        emptyUrl: '영상 URL을 입력하세요',
        invalidUrl: (providerLabel) => `잘못된 ${providerLabel} URL`,
        iframeTitle: '영상 임베드',
      },
      inspector: {
        provider: '공급자',
        providers: {
          youtube: 'YouTube',
          vimeo: 'Vimeo',
          url: '직접 URL',
        },
        sourceUrl: '소스 URL',
        sourceUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
        posterImageUrl: '포스터 이미지 URL',
        posterImagePlaceholder: '(선택) 포스터 이미지 URL',
        autoplay: '자동 재생',
        loop: '반복 재생',
        muted: '음소거',
        showControls: '컨트롤 표시',
      },
    },
    anchorMenu: {
      navLabel: '섹션 탐색',
      empty: '섹션 anchor를 인스펙터에서 추가하세요',
      defaultLabels: ANCHOR_MENU_LEGACY_LABELS,
      legacyLabels: ANCHOR_MENU_LEGACY_LABELS,
      inspector: {
        items: '항목 (label | anchorId)',
        siteAnchors: '현재 페이지 앵커',
        syncAnchors: '페이지 앵커 동기화',
        noSiteAnchors: '레이아웃 탭에서 섹션 앵커 이름을 먼저 지정하면 여기서 바로 연결할 수 있습니다.',
        addAnchor: (label) => `${label} 추가`,
        addedAnchor: (label) => `${label} 연결됨`,
        sticky: '고정',
        offsetTop: '상단 오프셋 (px)',
        activeColor: '활성 색상',
      },
    },
    parallaxBg: {
      defaultTitle: '신뢰의 법무 파트너',
      defaultSubtitle: '한국과 대만, 두 사법체계를 잇는 자문',
      inspector: {
        imageUrl: '이미지 URL',
        overlayColor: '오버레이 색',
        speed: '패럴랙스 속도 (0~2)',
        title: '제목',
        subtitle: '부제',
      },
    },
  },
  'zh-hant': {
    codeBlock: {
      titleFallback: '程式碼區塊',
      emptyCode: '請輸入程式碼片段',
      languageLabels: {
        ts: 'TypeScript',
        js: 'JavaScript',
        tsx: 'TSX',
        jsx: 'JSX',
        json: 'JSON',
        html: 'HTML',
        css: 'CSS',
        bash: 'Bash',
        text: '純文字',
      },
      inspector: {
        title: '標題',
        titlePlaceholder: '程式碼區塊',
        language: '語言',
        code: '程式碼',
        showLineNumbers: '顯示行號',
        caption: 'JavaScript/TypeScript 函式本文可在建構器沙盒中測試執行。需要可執行 HTML/embed 時，請使用 customEmbed。',
        runMode: '執行模式',
        runModeInline: '此區塊程式碼',
        runModeFunction: '已儲存函式',
        functionBinding: '已儲存函式',
        functionBindingPlaceholder: '選擇函式',
        functionDisabledSuffix: '已停用',
        runCodeSlot: '執行程式碼槽',
        runningCodeSlot: '執行中...',
        runCodeSlotUnsupported: '只有 JS/TS 程式碼區塊支援沙盒執行。',
        runCodeSlotEmpty: '請先輸入要執行的程式碼。',
        runCodeSlotFunctionEmpty: '請選擇要執行的已儲存函式。',
        runCodeSlotFunctionLoading: '正在載入已儲存函式。',
        runCodeSlotFunctionLoadFailed: '無法載入已儲存函式清單。',
        runCodeSlotResult: '執行結果',
        runCodeSlotLogs: '記錄',
        runCodeSlotHistory: '最近儲存記錄',
        runCodeSlotHistoryLoadFailed: '無法載入已儲存的程式碼槽記錄。',
        runCodeSlotNoLogs: '尚無記錄。',
        runCodeSlotError: '執行錯誤',
        runCodeSlotFailed: '程式碼槽執行失敗。',
        runCodeSlotInvalidResponse: '無法讀取程式碼槽執行回應。',
      },
    },
    videoEmbed: {
      runtime: {
        emptyUrl: '請輸入影片 URL',
        invalidUrl: (providerLabel) => `無效的 ${providerLabel} URL`,
        iframeTitle: '影片嵌入',
      },
      inspector: {
        provider: '供應商',
        providers: {
          youtube: 'YouTube',
          vimeo: 'Vimeo',
          url: '直接 URL',
        },
        sourceUrl: '來源 URL',
        sourceUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
        posterImageUrl: '封面圖片 URL',
        posterImagePlaceholder: '（選填）封面圖片 URL',
        autoplay: '自動播放',
        loop: '循環播放',
        muted: '靜音',
        showControls: '顯示控制列',
      },
    },
    anchorMenu: {
      navLabel: '區段導覽',
      empty: '請在檢查器新增區段 anchor',
      defaultLabels: {
        about: '介紹',
        services: '服務',
        contact: '聯絡',
      },
      legacyLabels: ANCHOR_MENU_LEGACY_LABELS,
      inspector: {
        items: '項目（label | anchorId）',
        siteAnchors: '目前頁面錨點',
        syncAnchors: '同步頁面錨點',
        noSiteAnchors: '請先在版面配置分頁設定區段錨點名稱，之後即可在此快速連結。',
        addAnchor: (label) => `新增 ${label}`,
        addedAnchor: (label) => `已連結 ${label}`,
        sticky: '固定',
        offsetTop: '頂部偏移 (px)',
        activeColor: '啟用色彩',
      },
    },
    parallaxBg: {
      defaultTitle: '值得信賴的法律夥伴',
      defaultSubtitle: '連結韓國與台灣兩套法制的專業顧問',
      inspector: {
        imageUrl: '圖片 URL',
        overlayColor: '覆蓋色彩',
        speed: '視差速度 (0~2)',
        title: '標題',
        subtitle: '副標題',
      },
    },
  },
  en: {
    codeBlock: {
      titleFallback: 'Code Block',
      emptyCode: 'Enter a code snippet',
      languageLabels: {
        ts: 'TypeScript',
        js: 'JavaScript',
        tsx: 'TSX',
        jsx: 'JSX',
        json: 'JSON',
        html: 'HTML',
        css: 'CSS',
        bash: 'Bash',
        text: 'Plain text',
      },
      inspector: {
        title: 'Title',
        titlePlaceholder: 'Code Block',
        language: 'Language',
        code: 'Code',
        showLineNumbers: 'Show line numbers',
        caption: 'JavaScript/TypeScript function bodies can be test-run in the builder sandbox. Use customEmbed for executable HTML/embed slots.',
        runMode: 'Run mode',
        runModeInline: 'This block code',
        runModeFunction: 'Saved function',
        functionBinding: 'Saved function',
        functionBindingPlaceholder: 'Select a function',
        functionDisabledSuffix: 'disabled',
        runCodeSlot: 'Run code slot',
        runningCodeSlot: 'Running...',
        runCodeSlotUnsupported: 'Only JS/TS code blocks support sandbox runs.',
        runCodeSlotEmpty: 'Enter code before running this slot.',
        runCodeSlotFunctionEmpty: 'Select a saved function before running this slot.',
        runCodeSlotFunctionLoading: 'Loading saved functions.',
        runCodeSlotFunctionLoadFailed: 'Could not load saved functions.',
        runCodeSlotResult: 'Run result',
        runCodeSlotLogs: 'Logs',
        runCodeSlotHistory: 'Recent stored logs',
        runCodeSlotHistoryLoadFailed: 'Could not load stored code slot logs.',
        runCodeSlotNoLogs: 'No logs recorded.',
        runCodeSlotError: 'Run error',
        runCodeSlotFailed: 'Code slot run failed.',
        runCodeSlotInvalidResponse: 'Could not read the code slot run response.',
      },
    },
    videoEmbed: {
      runtime: {
        emptyUrl: 'Enter a video URL',
        invalidUrl: (providerLabel) => `Invalid ${providerLabel} URL`,
        iframeTitle: 'Video embed',
      },
      inspector: {
        provider: 'Provider',
        providers: {
          youtube: 'YouTube',
          vimeo: 'Vimeo',
          url: 'Direct URL',
        },
        sourceUrl: 'Source URL',
        sourceUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
        posterImageUrl: 'Poster Image URL',
        posterImagePlaceholder: '(optional) Poster Image URL',
        autoplay: 'Autoplay',
        loop: 'Loop',
        muted: 'Muted',
        showControls: 'Show controls',
      },
    },
    anchorMenu: {
      navLabel: 'Section navigation',
      empty: 'Add section anchors in the inspector',
      defaultLabels: {
        about: 'About',
        services: 'Services',
        contact: 'Contact',
      },
      legacyLabels: ANCHOR_MENU_LEGACY_LABELS,
      inspector: {
        items: 'Items (label | anchorId)',
        siteAnchors: 'Current page anchors',
        syncAnchors: 'Sync page anchors',
        noSiteAnchors: 'Name section anchors in the Layout tab first, then connect them here.',
        addAnchor: (label) => `Add ${label}`,
        addedAnchor: (label) => `${label} connected`,
        sticky: 'Sticky',
        offsetTop: 'Offset top (px)',
        activeColor: 'Active color',
      },
    },
    parallaxBg: {
      defaultTitle: 'A trusted legal partner',
      defaultSubtitle: 'Guidance across Korean and Taiwanese legal systems',
      inspector: {
        imageUrl: 'Image URL',
        overlayColor: 'Overlay color',
        speed: 'Parallax speed (0~2)',
        title: 'Title',
        subtitle: 'Subtitle',
      },
    },
  },
};

export function getUtilityAdvancedWidgetsCopy(locale: Locale): UtilityAdvancedWidgetsCopy {
  return UTILITY_ADVANCED_WIDGETS_COPY[locale] ?? UTILITY_ADVANCED_WIDGETS_COPY.ko;
}
