import type { Locale } from '@/lib/locales';
import type { ThemeTextPresetKey } from '@/lib/builder/site/theme';

type FontCategory = 'all' | 'sans-serif' | 'serif' | 'display' | 'monospace';
type BrandAssetLabelKey = 'logoLightAssetId' | 'logoDarkAssetId' | 'faviconAssetId' | 'ogImageAssetId';
type BrandKitColorLabelKey = 'primary' | 'secondary' | 'accent' | 'background' | 'text';

export interface TextControlsCopy {
  fontPicker: {
    dialogTitle: string;
    dialogDescription: string;
    searchPlaceholder: string;
    previewLabel: string;
    previewAriaLabel: string;
    fontLoadFailed: string;
    noMatches: string;
    categories: Record<FontCategory, string>;
    notes: Record<'system' | 'generic' | 'heading' | 'body' | 'cjk', string>;
  };
  themePresetPicker: {
    label: string;
    noPreset: string;
    previewText: string;
    presets: Record<ThemeTextPresetKey, string>;
  };
  siteSettingsTypography: {
    siteFontsHeading: string;
    headingFontLabel: string;
    bodyFontLabel: string;
    typographyScaleHeading: string;
    themeTextPresetsHeading: string;
    scalePreviewRows: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      h6: string;
      body: string;
    };
    baseSizeLabel: string;
    ratioLabel: string;
    presetLabelLabel: string;
    presetFontLabel: string;
    presetSizeLabel: string;
    presetWeightLabel: string;
    ratioOptions: Array<{ value: number; label: string }>;
    description: string;
    previewSample: string;
  };
  brandKit: {
    warning: string;
    logoHeading: string;
    logoPreview: string;
    selectFromAssets: string;
    assetSelected: string;
    rawUrlFallback: string;
    clearAsset: string;
    titleFontLabel: string;
    bodyFontLabel: string;
    exportJson: string;
    importJson: string;
    applyBrandKit: string;
    assetLibraryHeading: string;
    selectedAssetCount: (selected: number, total: number) => string;
    openAssetLibrary: string;
    linked: string;
    pick: string;
    radiusScaleLabel: string;
    customPaletteLabel: string;
    customPaletteEmpty: string;
    customPaletteCount: (count: number) => string;
    customPaletteColorAriaLabel: (index: number) => string;
    addColor: string;
    removeColor: string;
    customColorNameLabel: string;
    customColorNamePlaceholder: string;
    customColorHexLabel: string;
    assetLabels: Record<BrandAssetLabelKey, string>;
    colorLabels: Record<BrandKitColorLabelKey, string>;
    colorAriaLabel: (label: string) => string;
  };
  headingInspector: {
    themePresetLabel: string;
    headingLabel: string;
    warning: string;
    fontLabel: string;
    levelLabel: string;
    colorLabel: string;
    fontSizeLabel: string;
    weightLabel: string;
    numericWeightLabel: string;
    clearLabel: string;
    numericWeightHelp: string;
    styleLabel: string;
    decorationLabel: string;
    lineHeightLabel: string;
  };
  textInspector: {
    themePresetLabel: string;
    textLabel: string;
    warning: string;
    shortcutHeading: string;
    quoteLabel: string;
    bulletListLabel: string;
    bulletListFallbackItems: string[];
    plainBlockLabel: string;
    fontLabel: string;
    fontSizeLabel: string;
    colorLabel: string;
    weightLabel: string;
    numericWeightLabel: string;
    clearLabel: string;
    numericWeightHelp: string;
    styleLabel: string;
    alignLabel: string;
    decorationLabel: string;
    lineHeightLabel: string;
    letterSpacingLabel: string;
    verticalAlignLabel: string;
    textTransformLabel: string;
    alignOptionLeft: string;
    alignOptionCenter: string;
    alignOptionRight: string;
    verticalAlignTop: string;
    verticalAlignCenter: string;
    verticalAlignBottom: string;
    textTransformNone: string;
    textTransformUppercase: string;
    textTransformLowercase: string;
    textTransformCapitalize: string;
    fontWeightRegular: string;
    fontWeightMedium: string;
    fontWeightBold: string;
    styleNormal: string;
    styleItalic: string;
    decorationNone: string;
    decorationUnderline: string;
    decorationLineThrough: string;
    decorationBoth: string;
    textEffectsHeading: string;
    linkLabel: string;
    backgroundColorLabel: string;
    columnsLabel: string;
    columnGapLabel: string;
    quoteStyleLabel: string;
    quoteStyleNone: string;
    quoteStyleClassic: string;
    quoteStylePull: string;
    marqueeLabel: string;
    marqueeSpeedLabel: string;
    directionLabel: string;
    marqueeDirectionLeft: string;
    marqueeDirectionRight: string;
    textOnPathLabel: string;
    pathCurveLabel: string;
    pathCurveArc: string;
    pathCurveWave: string;
    pathBaselineLabel: string;
    textShadowHeading: string;
    xLabel: string;
    yLabel: string;
    blurLabel: string;
    clearShadowLabel: string;
  };
}

function fontCategories(locale: Locale): Record<FontCategory, string> {
  if (locale === 'ko') {
    return {
      all: '전체',
      'sans-serif': '산세리프',
      serif: '세리프',
      display: '디스플레이',
      monospace: '고정폭',
    };
  }
  if (locale === 'zh-hant') {
    return {
      all: '全部',
      'sans-serif': '無襯線',
      serif: '襯線',
      display: '展示',
      monospace: '等寬',
    };
  }
  return {
    all: 'All',
    'sans-serif': 'Sans',
    serif: 'Serif',
    display: 'Display',
    monospace: 'Mono',
  };
}

function themePresetLabels(locale: Locale): Record<ThemeTextPresetKey, string> {
  if (locale === 'ko') {
    return {
      title1: '제목 1',
      title2: '제목 2',
      title3: '제목 3',
      body: '본문',
      quote: '인용',
    };
  }
  if (locale === 'zh-hant') {
    return {
      title1: '標題 1',
      title2: '標題 2',
      title3: '標題 3',
      body: '內文',
      quote: '引言',
    };
  }
  return {
    title1: 'Title 1',
    title2: 'Title 2',
    title3: 'Title 3',
    body: 'Body',
    quote: 'Quote',
  };
}

function ratioOptionLabels(locale: Locale): Array<{ value: number; label: string }> {
  if (locale === 'ko') {
    return [
      { value: 1.125, label: '1.125 — 메이저 세컨드' },
      { value: 1.2, label: '1.2 — 마이너 서드' },
      { value: 1.25, label: '1.25 — 메이저 서드' },
      { value: 1.333, label: '1.333 — 완전 4도' },
      { value: 1.414, label: '1.414 — 증 4도' },
      { value: 1.5, label: '1.5 — 완전 5도' },
    ];
  }
  if (locale === 'zh-hant') {
    return [
      { value: 1.125, label: '1.125 — 大二度' },
      { value: 1.2, label: '1.2 — 小三度' },
      { value: 1.25, label: '1.25 — 大三度' },
      { value: 1.333, label: '1.333 — 完全四度' },
      { value: 1.414, label: '1.414 — 增四度' },
      { value: 1.5, label: '1.5 — 完全五度' },
    ];
  }
  return [
    { value: 1.125, label: '1.125 — Major Second' },
    { value: 1.2, label: '1.2 — Minor Third' },
    { value: 1.25, label: '1.25 — Major Third' },
    { value: 1.333, label: '1.333 — Perfect Fourth' },
    { value: 1.414, label: '1.414 — Augmented Fourth' },
    { value: 1.5, label: '1.5 — Perfect Fifth' },
  ];
}

export function getTextControlsCopy(locale: Locale): TextControlsCopy {
  const fontPicker = locale === 'ko'
    ? {
        dialogTitle: '글꼴',
        dialogDescription: '글꼴을 검색하고 미리볼 수 있습니다.',
        searchPlaceholder: '글꼴 검색',
        previewLabel: '미리보기 문구',
        previewAriaLabel: '글꼴 미리보기 문구',
        fontLoadFailed: 'Google Fonts를 불러오지 못했습니다. 로컬 대체 글꼴을 표시합니다.',
        noMatches: '일치하는 글꼴이 없습니다.',
        categories: fontCategories(locale),
        notes: {
          system: '시스템',
          generic: '일반',
          heading: '제목',
          body: '본문',
          cjk: 'CJK',
        },
      }
    : locale === 'zh-hant'
      ? {
          dialogTitle: '字型',
          dialogDescription: '搜尋字型並即時預覽。',
          searchPlaceholder: '搜尋字型',
          previewLabel: '預覽文字',
          previewAriaLabel: '字型預覽文字',
          fontLoadFailed: 'Google Fonts 載入失敗，顯示本機替代字型。',
          noMatches: '沒有符合的字型。',
          categories: fontCategories(locale),
          notes: {
            system: '系統',
            generic: '通用',
            heading: '標題',
            body: '內文',
            cjk: 'CJK',
          },
        }
      : {
          dialogTitle: 'Fonts',
          dialogDescription: 'Search and preview fonts.',
          searchPlaceholder: 'Search fonts',
          previewLabel: 'Font preview text',
          previewAriaLabel: 'Font preview text',
          fontLoadFailed: 'Google Fonts failed. Showing local fallbacks.',
          noMatches: 'No matching fonts.',
          categories: fontCategories(locale),
          notes: {
            system: 'System',
            generic: 'Generic',
            heading: 'Heading',
            body: 'Body',
            cjk: 'CJK',
          },
        };

  const themePresetPicker = locale === 'ko'
    ? {
        label: '텍스트 프리셋',
        noPreset: '프리셋 없음',
        previewText: '제목 텍스트',
        presets: themePresetLabels(locale),
      }
    : locale === 'zh-hant'
      ? {
          label: '文字預設',
          noPreset: '無預設',
          previewText: '標題文字',
          presets: themePresetLabels(locale),
        }
      : {
          label: 'Theme preset',
          noPreset: 'No preset',
          previewText: 'Heading text',
          presets: themePresetLabels(locale),
        };

  const siteSettingsTypography = locale === 'ko'
    ? {
        siteFontsHeading: '사이트 글꼴',
        headingFontLabel: '제목 글꼴',
        bodyFontLabel: '본문 글꼴',
        typographyScaleHeading: '타이포그래피 스케일 (W184)',
        themeTextPresetsHeading: '텍스트 프리셋',
        scalePreviewRows: {
          h1: '제목 1',
          h2: '제목 2',
          h3: '제목 3',
          h4: '제목 4',
          h5: '제목 5',
          h6: '제목 6',
          body: '본문',
        },
        baseSizeLabel: '기본 크기 (px)',
        ratioLabel: '비율',
        presetLabelLabel: '프리셋 이름',
        presetFontLabel: '글꼴',
        presetSizeLabel: '크기',
        presetWeightLabel: '굵기',
        ratioOptions: ratioOptionLabels(locale),
        description: '기본 heading 크기(h1~h6)는 base × ratio^level로 자동 계산됩니다. 노드 인스펙터에서 fontSize를 직접 입력하면 그 값이 우선합니다.',
        previewSample: '호정국제 법률사무소',
      }
    : locale === 'zh-hant'
      ? {
          siteFontsHeading: '網站字型',
          headingFontLabel: '標題字型',
          bodyFontLabel: '內文字型',
          typographyScaleHeading: '排版比例（W184）',
          themeTextPresetsHeading: '文字預設',
          scalePreviewRows: {
            h1: '標題 1',
            h2: '標題 2',
            h3: '標題 3',
            h4: '標題 4',
            h5: '標題 5',
            h6: '標題 6',
            body: '內文',
          },
          baseSizeLabel: '基準大小（px）',
          ratioLabel: '比例',
          presetLabelLabel: '預設名稱',
          presetFontLabel: '字型',
          presetSizeLabel: '大小',
          presetWeightLabel: '字重',
          ratioOptions: ratioOptionLabels(locale),
          description: '預設 heading 尺寸（h1~h6）會自動依 base × ratio^level 計算。若在節點檢視器直接輸入 fontSize，則以該值為優先。',
          previewSample: '和正國際法律事務所',
        }
      : {
          siteFontsHeading: 'Site fonts',
          headingFontLabel: 'Heading font',
          bodyFontLabel: 'Body font',
          typographyScaleHeading: 'Typography scale (W184)',
          themeTextPresetsHeading: 'Theme text presets',
          scalePreviewRows: {
            h1: 'H1',
            h2: 'H2',
            h3: 'H3',
            h4: 'H4',
            h5: 'H5',
            h6: 'H6',
            body: 'Body',
          },
          baseSizeLabel: 'Base size (px)',
          ratioLabel: 'Ratio',
          presetLabelLabel: 'Preset name',
          presetFontLabel: 'Font',
          presetSizeLabel: 'Size',
          presetWeightLabel: 'Weight',
          ratioOptions: ratioOptionLabels(locale),
          description: 'Default heading sizes (h1~h6) are calculated as base × ratio^level. If you enter fontSize in the node inspector, that value wins.',
          previewSample: 'HoJeong International Law Office',
        };

  const brandKit = locale === 'ko'
    ? {
        warning: '브랜드 키트 변경은 사이트 전체에 반영됩니다. 여기서 업데이트한 뒤 저장해야 새 비주얼 시스템이 게시됩니다.',
        logoHeading: '로고',
        logoPreview: '로고 미리보기',
        selectFromAssets: '에셋에서 선택',
        assetSelected: '에셋 선택됨',
        rawUrlFallback: '원본 URL 대체',
        clearAsset: '에셋 제거',
        titleFontLabel: '제목 글꼴',
        bodyFontLabel: '본문 글꼴',
        exportJson: 'JSON 내보내기',
        importJson: 'JSON 가져오기',
        applyBrandKit: '브랜드 키트 적용',
        assetLibraryHeading: '브랜드 에셋 라이브러리',
        selectedAssetCount: (selected: number, total: number) => `${selected}/${total}개 브랜드 에셋 선택됨`,
        openAssetLibrary: '브랜드 에셋 열기',
        linked: '연결됨',
        pick: '선택',
        radiusScaleLabel: '반경 스케일',
        customPaletteLabel: '커스텀 팔레트',
        customPaletteEmpty: '추가 색상이 없습니다',
        customPaletteCount: (count: number) => `${count}개 색상`,
        customPaletteColorAriaLabel: (index: number) => `커스텀 팔레트 색상 ${index}`,
        addColor: '색상 추가',
        removeColor: '색상 제거',
        customColorNameLabel: '이름',
        customColorNamePlaceholder: '예: 강조 레드',
        customColorHexLabel: '색상 코드',
        assetLabels: {
          logoLightAssetId: '밝은 로고',
          logoDarkAssetId: '어두운 로고',
          faviconAssetId: '파비콘',
          ogImageAssetId: 'OG 이미지',
        },
        colorLabels: {
          primary: '기본',
          secondary: '보조',
          accent: '강조',
          background: '배경',
          text: '텍스트',
        },
        colorAriaLabel: (label: string) => `${label} 색상`,
      }
    : locale === 'zh-hant'
      ? {
          warning: '品牌套件變更會套用到整個網站。先在這裡更新，再儲存網站設定才會發佈新的視覺系統。',
          logoHeading: '標誌',
          logoPreview: '標誌預覽',
          selectFromAssets: '從素材選擇',
          assetSelected: '已選取素材',
          rawUrlFallback: '原始 URL 備援',
          clearAsset: '清除素材',
          titleFontLabel: '標題字型',
          bodyFontLabel: '內文字型',
          exportJson: '匯出 JSON',
          importJson: '匯入 JSON',
          applyBrandKit: '套用品牌套件',
          assetLibraryHeading: '品牌素材庫',
          selectedAssetCount: (selected: number, total: number) => `已選取 ${selected}/${total} 個品牌素材`,
          openAssetLibrary: '開啟品牌素材',
          linked: '已連結',
          pick: '選擇',
          radiusScaleLabel: '圓角比例',
          customPaletteLabel: '自訂調色盤',
          customPaletteEmpty: '尚未新增顏色',
          customPaletteCount: (count: number) => `${count} 個顏色`,
        customPaletteColorAriaLabel: (index: number) => `自訂調色盤顏色 ${index}`,
        addColor: '新增顏色',
        removeColor: '移除顏色',
        customColorNameLabel: '名稱',
        customColorNamePlaceholder: '例如：強調紅',
        customColorHexLabel: '色碼',
          assetLabels: {
            logoLightAssetId: '淺色標誌',
            logoDarkAssetId: '深色標誌',
            faviconAssetId: '網站圖示',
            ogImageAssetId: 'OG 圖片',
          },
          colorLabels: {
            primary: '主要',
            secondary: '次要',
            accent: '強調',
            background: '背景',
            text: '文字',
          },
          colorAriaLabel: (label: string) => `${label}顏色`,
        }
      : {
          warning: 'Brand kit changes are site-wide. Apply updates here, then save Site Settings to publish the new visual system.',
          logoHeading: 'Logo',
          logoPreview: 'Logo preview',
          selectFromAssets: 'Select from assets',
          assetSelected: 'Asset selected',
          rawUrlFallback: 'Raw URL fallback',
          clearAsset: 'Clear asset',
          titleFontLabel: 'Title font',
          bodyFontLabel: 'Body font',
          exportJson: 'Export JSON',
          importJson: 'Import JSON',
          applyBrandKit: 'Apply brand kit',
          assetLibraryHeading: 'Brand asset library',
          selectedAssetCount: (selected: number, total: number) => `${selected}/${total} brand assets selected`,
          openAssetLibrary: 'Open brand assets',
          linked: 'Linked',
          pick: 'Pick',
          radiusScaleLabel: 'Radius scale',
          customPaletteLabel: 'Custom palette',
          customPaletteEmpty: 'No extra colors',
          customPaletteCount: (count: number) => `${count} colors`,
        customPaletteColorAriaLabel: (index: number) => `Custom palette color ${index}`,
        addColor: 'Add color',
        removeColor: 'Remove color',
        customColorNameLabel: 'Name',
        customColorNamePlaceholder: 'e.g. Accent red',
        customColorHexLabel: 'Hex',
          assetLabels: {
            logoLightAssetId: 'Light logo',
            logoDarkAssetId: 'Dark logo',
            faviconAssetId: 'Favicon',
            ogImageAssetId: 'OG image',
          },
          colorLabels: {
            primary: 'Primary',
            secondary: 'Secondary',
            accent: 'Accent',
            background: 'Background',
            text: 'Text',
          },
          colorAriaLabel: (label: string) => `${label} color`,
        };

  const headingInspector = locale === 'ko'
    ? {
        themePresetLabel: '텍스트 프리셋',
        headingLabel: '제목',
        warning: '⚠ 텍스트만 편집하면 서식이 사라집니다. 캔버스에서 직접 편집하세요.',
        fontLabel: '글꼴',
        levelLabel: '레벨',
        colorLabel: '색상',
        fontSizeLabel: '글꼴 크기',
        weightLabel: '굵기',
        numericWeightLabel: '숫자 굵기',
        clearLabel: '지우기',
        numericWeightHelp: '비어있으면 위 선택값을 사용합니다. 100~900을 입력하면 우선합니다.',
        styleLabel: '스타일',
        decorationLabel: '장식',
        lineHeightLabel: '줄 간격',
      }
    : locale === 'zh-hant'
      ? {
          themePresetLabel: '文字預設',
          headingLabel: '標題',
          warning: '⚠ 只編輯文字會失去格式，請直接在畫布上編輯。',
          fontLabel: '字型',
          levelLabel: '層級',
          colorLabel: '顏色',
          fontSizeLabel: '字型大小',
          weightLabel: '字重',
          numericWeightLabel: '數值字重',
          clearLabel: '清除',
          numericWeightHelp: '若留空會使用上方選項。輸入 100~900 時會優先採用。',
          styleLabel: '樣式',
          decorationLabel: '裝飾',
          lineHeightLabel: '行距',
        }
      : {
          themePresetLabel: 'Theme preset',
          headingLabel: 'Heading',
          warning: '⚠ Editing text only can remove formatting. Edit directly on the canvas.',
          fontLabel: 'Font',
          levelLabel: 'Level',
          colorLabel: 'Color',
          fontSizeLabel: 'Font size',
          weightLabel: 'Weight',
          numericWeightLabel: 'Weight (numeric)',
          clearLabel: 'Clear',
          numericWeightHelp: 'Leave empty to use the enum above. Enter 100~900 to override.',
          styleLabel: 'Style',
          decorationLabel: 'Decoration',
          lineHeightLabel: 'Line height',
        };

  const textInspector = locale === 'ko'
    ? {
        themePresetLabel: '텍스트 프리셋',
        textLabel: '텍스트',
        warning: '⚠ 텍스트만 편집하면 서식이 사라집니다. 캔버스에서 직접 편집하세요.',
        shortcutHeading: '리치 텍스트 바로가기',
        quoteLabel: '인용',
        bulletListLabel: '글머리 목록',
        bulletListFallbackItems: ['첫 번째 항목', '두 번째 항목', '세 번째 항목'],
        plainBlockLabel: '일반 블록',
        fontLabel: '글꼴',
        fontSizeLabel: '글꼴 크기',
        colorLabel: '색상',
        weightLabel: '굵기',
        numericWeightLabel: '숫자 굵기',
        clearLabel: '지우기',
        numericWeightHelp: '비어있으면 위 선택값(Regular/Medium/Bold)을 사용합니다. 100~900을 입력하면 우선합니다.',
        styleLabel: '스타일',
        alignLabel: '정렬',
        decorationLabel: '장식',
        lineHeightLabel: '줄 간격',
        letterSpacingLabel: '자간',
        verticalAlignLabel: '세로 정렬',
        textTransformLabel: '텍스트 변환',
        alignOptionLeft: '왼쪽',
        alignOptionCenter: '가운데',
        alignOptionRight: '오른쪽',
        verticalAlignTop: '위',
        verticalAlignCenter: '가운데',
        verticalAlignBottom: '아래',
        textTransformNone: '없음',
        textTransformUppercase: '대문자',
        textTransformLowercase: '소문자',
        textTransformCapitalize: '첫 글자 대문자',
        fontWeightRegular: '보통',
        fontWeightMedium: '중간',
        fontWeightBold: '굵게',
        styleNormal: '일반',
        styleItalic: '이탤릭',
        decorationNone: '없음',
        decorationUnderline: '밑줄',
        decorationLineThrough: '취소선',
        decorationBoth: '둘 다',
        textEffectsHeading: '텍스트 효과',
        linkLabel: '링크',
        backgroundColorLabel: '배경색',
        columnsLabel: '열 수',
        columnGapLabel: '열 간격',
        quoteStyleLabel: '인용 스타일',
        quoteStyleNone: '없음',
        quoteStyleClassic: '고전형 라인',
        quoteStylePull: '풀 인용',
        marqueeLabel: '흘러가는 텍스트',
        marqueeSpeedLabel: '흘러가는 속도',
        directionLabel: '방향',
        marqueeDirectionLeft: '왼쪽',
        marqueeDirectionRight: '오른쪽',
        textOnPathLabel: '경로상의 텍스트',
        pathCurveLabel: '경로 곡선',
        pathCurveArc: '호',
        pathCurveWave: '파형',
        pathBaselineLabel: '경로 기준선',
        textShadowHeading: '텍스트 그림자',
        xLabel: 'X',
        yLabel: 'Y',
        blurLabel: '블러',
        clearShadowLabel: '그림자 지우기',
      }
    : locale === 'zh-hant'
      ? {
          themePresetLabel: '文字預設',
          textLabel: '文字',
          warning: '⚠ 只編輯文字會失去格式，請直接在畫布上編輯。',
          shortcutHeading: '富文字捷徑',
          quoteLabel: '引用',
          bulletListLabel: '項目清單',
          bulletListFallbackItems: ['第一個項目', '第二個項目', '第三個項目'],
          plainBlockLabel: '純文字區塊',
          fontLabel: '字型',
          fontSizeLabel: '字型大小',
          colorLabel: '顏色',
          weightLabel: '字重',
          numericWeightLabel: '數值字重',
          clearLabel: '清除',
          numericWeightHelp: '若留空會使用上方選項（Regular / Medium / Bold）。輸入 100~900 時會優先採用。',
          styleLabel: '樣式',
          alignLabel: '對齊',
          decorationLabel: '裝飾',
          lineHeightLabel: '行距',
          letterSpacingLabel: '字距',
          verticalAlignLabel: '垂直對齊',
          textTransformLabel: '文字轉換',
          alignOptionLeft: '左',
          alignOptionCenter: '中',
          alignOptionRight: '右',
          verticalAlignTop: '上',
          verticalAlignCenter: '中',
          verticalAlignBottom: '下',
          textTransformNone: '無',
          textTransformUppercase: '大寫',
          textTransformLowercase: '小寫',
          textTransformCapitalize: '首字大寫',
          fontWeightRegular: '一般',
          fontWeightMedium: '中等',
          fontWeightBold: '粗體',
          styleNormal: '一般',
          styleItalic: '斜體',
          decorationNone: '無',
          decorationUnderline: '底線',
          decorationLineThrough: '刪除線',
          decorationBoth: '兩者',
          textEffectsHeading: '文字效果',
          linkLabel: '連結',
          backgroundColorLabel: '背景顏色',
          columnsLabel: '欄數',
          columnGapLabel: '欄距',
          quoteStyleLabel: '引言樣式',
          quoteStyleNone: '無',
          quoteStyleClassic: '經典線條',
          quoteStylePull: '拉引言',
          marqueeLabel: '跑馬燈文字',
          marqueeSpeedLabel: '跑馬燈速度',
          directionLabel: '方向',
          marqueeDirectionLeft: '向左',
          marqueeDirectionRight: '向右',
          textOnPathLabel: '沿路徑文字',
          pathCurveLabel: '路徑曲線',
          pathCurveArc: '弧線',
          pathCurveWave: '波浪',
          pathBaselineLabel: '路徑基線',
          textShadowHeading: '文字陰影',
          xLabel: 'X',
          yLabel: 'Y',
          blurLabel: '模糊',
          clearShadowLabel: '清除陰影',
        }
      : {
          themePresetLabel: 'Theme preset',
          textLabel: 'Text',
          warning: '⚠ Editing text only can remove formatting. Edit directly on the canvas.',
          shortcutHeading: 'Rich text shortcuts',
          quoteLabel: 'Quote',
          bulletListLabel: 'Bullet list',
          bulletListFallbackItems: ['First item', 'Second item', 'Third item'],
          plainBlockLabel: 'Plain block',
          fontLabel: 'Font',
          fontSizeLabel: 'Font size',
          colorLabel: 'Color',
          weightLabel: 'Weight',
          numericWeightLabel: 'Weight (numeric)',
          clearLabel: 'Clear',
          numericWeightHelp: 'Leave empty to use the enum above (Regular / Medium / Bold). Enter 100~900 to override.',
          styleLabel: 'Style',
          alignLabel: 'Align',
          decorationLabel: 'Decoration',
          lineHeightLabel: 'Line height',
          letterSpacingLabel: 'Letter spacing',
          verticalAlignLabel: 'Vertical align',
          textTransformLabel: 'Text transform',
          alignOptionLeft: 'Left',
          alignOptionCenter: 'Center',
          alignOptionRight: 'Right',
          verticalAlignTop: 'Top',
          verticalAlignCenter: 'Center',
          verticalAlignBottom: 'Bottom',
          textTransformNone: 'None',
          textTransformUppercase: 'Uppercase',
          textTransformLowercase: 'Lowercase',
          textTransformCapitalize: 'Capitalize',
          fontWeightRegular: 'Regular',
          fontWeightMedium: 'Medium',
          fontWeightBold: 'Bold',
          styleNormal: 'Normal',
          styleItalic: 'Italic',
          decorationNone: 'None',
          decorationUnderline: 'Underline',
          decorationLineThrough: 'Line-through',
          decorationBoth: 'Both',
          textEffectsHeading: 'Text effects',
          linkLabel: 'Link',
          backgroundColorLabel: 'Background color',
          columnsLabel: 'Columns',
          columnGapLabel: 'Column gap',
          quoteStyleLabel: 'Quote style',
          quoteStyleNone: 'None',
          quoteStyleClassic: 'Classic rule',
          quoteStylePull: 'Pull quote',
          marqueeLabel: 'Marquee',
          marqueeSpeedLabel: 'Marquee speed',
          directionLabel: 'Direction',
          marqueeDirectionLeft: 'Left',
          marqueeDirectionRight: 'Right',
          textOnPathLabel: 'Text on path',
          pathCurveLabel: 'Path curve',
          pathCurveArc: 'Arc',
          pathCurveWave: 'Wave',
          pathBaselineLabel: 'Path baseline',
          textShadowHeading: 'Text shadow',
          xLabel: 'X',
          yLabel: 'Y',
          blurLabel: 'Blur',
          clearShadowLabel: 'Clear shadow',
        };

  return {
    fontPicker,
    themePresetPicker,
    siteSettingsTypography,
    brandKit,
    headingInspector,
    textInspector,
  };
}
