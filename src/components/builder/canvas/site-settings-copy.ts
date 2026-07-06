import type { Locale } from '@/lib/locales';
import type { PageTransition } from '@/lib/builder/animations/presets';
import type { ThemeColorToken } from '@/lib/builder/site/theme';

export interface SiteSettingsCopy {
  modal: {
    title: string;
    subtitle: string;
    tabAria: string;
    tabs: {
      general: string;
      brand: string;
      typography: string;
      presets: string;
      dark: string;
      mobile: string;
      advanced: string;
    };
    loading: string;
    save: string;
    saving: string;
    cancel: string;
    saveError: string;
    loadError: string;
    brandKitApplied: (label: string) => string;
    presetApplied: (label: string) => string;
    componentPresetNoTargets: (label: string) => string;
    componentPresetApplied: (label: string, count: number, buttons: number, cards: number, fields: number, submits: number) => string;
    radiusApplied: (label: string) => string;
    shadowApplied: (label: string) => string;
    themeSaved: (label: string) => string;
    myThemeName: (firmName: string) => string;
    themeDeleted: string;
    tokenExported: string;
    tokenImported: string;
    tokenReadError: string;
    brandKitExported: string;
    brandKitImported: string;
    brandKitReadError: string;
    invalidThemeColor: (label: string) => string;
    invalidDarkColor: (label: string) => string;
  };
  general: {
    heading: string;
    fields: Array<{ key: string; label: string; placeholder: string; type?: string }>;
  };
  mobile: {
    headerHeading: string;
    stickyHeader: string;
    hamburgerMode: string;
    hamburgerAuto: string;
    hamburgerForce: string;
    hamburgerDesktop: string;
    bottomHeading: string;
    showBottomBar: string;
    type: string;
    phone: string;
    booking: string;
    custom: string;
    label: string;
    link: string;
  };
  dark: {
    runtimeHeading: string;
    lightDarkPreviewHeading: string;
    defaultModeLabel: string;
    light: string;
    dark: string;
    auto: string;
    allowToggle: string;
    previewHeader: (mode: 'light' | 'dark') => string;
    previewPrimary: string;
    previewSecondary: string;
    previewMuted: string;
    colorLabel: (label: string) => string;
    lightModeDescription: string;
  };
  advanced: {
    motionHeading: string;
    pageTransitionLabel: string;
    pageTransitionDurationLabel: string;
    pageTransitionDescription: string;
    themeColorsHeading: string;
    themeColorLabels: Record<ThemeColorToken, string>;
    pageTransitionOptions: Record<PageTransition, string>;
  };
}

export function getSiteSettingsCopy(locale: Locale): SiteSettingsCopy {
  if (locale === 'zh-hant') {
    return {
      modal: {
        title: '網站設定',
        subtitle: '在同一個視窗中統一控制 Brand kit、Typography、Dark 與 Presets。',
        tabAria: '設定分頁',
        tabs: {
          general: '一般',
          brand: '品牌包',
          typography: '字體排版',
          presets: '預設',
          dark: '深色模式',
          mobile: '行動版',
          advanced: '進階',
        },
        loading: '載入中...',
        save: '儲存',
        saving: '儲存中...',
        cancel: '取消',
        saveError: '無法儲存網站設定。',
        loadError: '無法載入網站設定。',
        brandKitApplied: (label) => `${label} 品牌包已套用到目前網站主題。請按儲存將變更反映到網站。`,
        presetApplied: (label) => `${label} 預設已套用。請按儲存將變更反映到網站。`,
        componentPresetNoTargets: (label) => `${label} 預設沒有可變更的 button/card/form 元素。`,
        componentPresetApplied: (label, count, buttons, cards, fields, submits) =>
          `${label} 預設已套用至 ${count} 個元件（${buttons} 個按鈕、${cards} 個卡片、${fields} 個欄位、${submits} 個提交）。`,
        radiusApplied: (label) => `${label} 圓角預設已套用。請按儲存將變更反映到網站。`,
        shadowApplied: (label) => `${label} 陰影預設已套用。請按儲存將變更反映到網站。`,
        themeSaved: (label) => `${label} 已儲存。可在其他網站設定中從 My Themes 載入。`,
        myThemeName: (firmName) => (firmName ? `${firmName} 我的主題` : '我的主題'),
        themeDeleted: '我的主題預設已刪除。',
        tokenExported: '已匯出設計 token JSON。',
        tokenImported: '已載入並套用設計 token JSON。請按儲存將變更反映到網站。',
        tokenReadError: '無法讀取設計 token JSON。',
        brandKitExported: '已匯出品牌包 JSON。',
        brandKitImported: '已載入並套用品牌包 JSON。請按儲存將變更反映到網站。',
        brandKitReadError: '無法讀取品牌包 JSON。',
        invalidThemeColor: (label) => `${label} 色彩必須使用 #RRGGBB 格式。`,
        invalidDarkColor: (label) => `深色 ${label} 色彩必須使用 #RRGGBB 格式。`,
      },
      general: {
        heading: '基本資訊',
        fields: [
          { key: 'firmName', label: '事務所名稱', placeholder: '最多 200 字 · 例如：HoJeong 國際法律事務所' },
          { key: 'phone', label: '電話號碼', placeholder: '最多 80 字 · 例如：+886-2-1234-5678', type: 'tel' },
          { key: 'email', label: '電子郵件', placeholder: '最多 200 字 · 例如：contact@example.com', type: 'email' },
          { key: 'address', label: '地址', placeholder: '最多 400 字 · 例如：台北市信義區市府路 1 號' },
          { key: 'businessHours', label: '營業時間', placeholder: '最多 200 字 · 例如：週一至週五 09:00-18:00' },
          { key: 'businessRegNumber', label: '公司統編', placeholder: '最多 120 字 · 例如：12345678' },
          { key: 'logo', label: 'Logo URL', placeholder: '圖片網址 · 例如：https://example.com/logo.png', type: 'url' },
          { key: 'logoDark', label: '深色版 Logo URL', placeholder: '圖片網址 · 例如：https://example.com/logo-dark.png', type: 'url' },
          { key: 'favicon', label: 'Favicon URL', placeholder: '.ico/.png 網址 · 例如：https://example.com/favicon.ico', type: 'url' },
          { key: 'ogImage', label: 'OG 圖片 URL', placeholder: '社群分享圖 · 例如：https://example.com/social-card.png', type: 'url' },
        ],
      },
      mobile: {
        headerHeading: '行動版頁首',
        stickyHeader: '固定行動版頁首',
        hamburgerMode: '漢堡選單模式',
        hamburgerAuto: '自動',
        hamburgerForce: '強制漢堡選單',
        hamburgerDesktop: '在行動版顯示桌面選單',
        bottomHeading: '行動版底部 CTA',
        showBottomBar: '顯示固定底部操作列',
        type: '類型',
        phone: '電話',
        booking: '預約',
        custom: '自訂',
        label: '標籤',
        link: '連結',
      },
      dark: {
        runtimeHeading: '深色模式執行階段',
        lightDarkPreviewHeading: '明暗同時預覽',
        defaultModeLabel: '預設模式',
        light: '淺色',
        dark: '深色',
        auto: '自動',
        allowToggle: '允許訪客切換',
        previewHeader: (mode) => `${mode === 'light' ? '淺色' : '深色'} 預覽`,
        previewPrimary: '主要',
        previewSecondary: '次要',
        previewMuted: '淡化',
        colorLabel: (label) => `深色 ${label}`,
        lightModeDescription: 'Published 頁面的 DarkModeToggle 會在這些色彩組之間切換。',
      },
      advanced: {
        motionHeading: '動作',
        pageTransitionLabel: '頁面轉場',
        pageTransitionDurationLabel: '持續時間',
        pageTransitionDescription: '將淡入/滑入/縮放轉場套用到 Published 頁面 wrapper。訪客啟用 reduced motion 時會自動關閉。',
        themeColorsHeading: '主題色彩',
        themeColorLabels: {
          primary: '主要',
          secondary: '次要',
          accent: '重點',
          background: '背景',
          text: '文字',
          muted: '淡化',
        },
        pageTransitionOptions: {
          none: '無',
          fade: '淡入',
          'slide-up': '向上滑入',
          'slide-left': '向左滑入',
          scale: '縮放',
        },
      },
    };
  }

  if (locale === 'en') {
    return {
      modal: {
        title: 'Site settings',
        subtitle: 'Control Brand kit, Typography, Dark, and Presets from one place.',
        tabAria: 'Settings tabs',
        tabs: {
          general: 'General',
          brand: 'Brand kit',
          typography: 'Typography',
          presets: 'Presets',
          dark: 'Dark mode',
          mobile: 'Mobile',
          advanced: 'Advanced',
        },
        loading: 'Loading...',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        saveError: 'Unable to save site settings.',
        loadError: 'Unable to load site settings.',
        brandKitApplied: (label) => `${label} brand kit applied to the current site theme. Save to apply it to the site.`,
        presetApplied: (label) => `${label} preset applied. Save to apply it to the site.`,
        componentPresetNoTargets: (label) => `${label} preset has no button, card, or form elements to update on this page.`,
        componentPresetApplied: (label, count, buttons, cards, fields, submits) =>
          `${label} preset applied to ${count} components (${buttons} buttons, ${cards} cards, ${fields} fields, ${submits} submits).`,
        radiusApplied: (label) => `${label} radius preset applied. Save to apply it to the site.`,
        shadowApplied: (label) => `${label} shadow preset applied. Save to apply it to the site.`,
        themeSaved: (label) => `${label} saved. You can load it from My Themes in other site settings.`,
        myThemeName: (firmName) => (firmName ? `${firmName} My Theme` : 'My Theme'),
        themeDeleted: 'My Theme preset deleted.',
        tokenExported: 'Exported design token JSON.',
        tokenImported: 'Loaded and applied design token JSON. Save to apply it to the site.',
        tokenReadError: 'Unable to read design token JSON.',
        brandKitExported: 'Exported brand kit JSON.',
        brandKitImported: 'Loaded and applied brand kit JSON. Save to apply it to the site.',
        brandKitReadError: 'Unable to read brand kit JSON.',
        invalidThemeColor: (label) => `${label} color must use #RRGGBB format.`,
        invalidDarkColor: (label) => `Dark ${label} color must use #RRGGBB format.`,
      },
      general: {
        heading: 'General info',
        fields: [
          { key: 'firmName', label: 'Firm name', placeholder: 'Up to 200 chars · e.g. HoJeong International Law Office' },
          { key: 'phone', label: 'Phone', placeholder: 'Up to 80 chars · e.g. +886-2-1234-5678', type: 'tel' },
          { key: 'email', label: 'Email', placeholder: 'Up to 200 chars · e.g. contact@example.com', type: 'email' },
          { key: 'address', label: 'Address', placeholder: 'Up to 400 chars · e.g. 1 City Hall Rd, Taipei' },
          { key: 'businessHours', label: 'Business hours', placeholder: 'Up to 200 chars · e.g. Mon-Fri 09:00-18:00' },
          { key: 'businessRegNumber', label: 'Business registration no.', placeholder: 'Up to 120 chars · e.g. 12345678' },
          { key: 'logo', label: 'Logo URL', placeholder: 'Image URL · e.g. https://example.com/logo.png', type: 'url' },
          { key: 'logoDark', label: 'Dark logo URL', placeholder: 'Image URL · e.g. https://example.com/logo-dark.png', type: 'url' },
          { key: 'favicon', label: 'Favicon URL', placeholder: '.ico/.png URL · e.g. https://example.com/favicon.ico', type: 'url' },
          { key: 'ogImage', label: 'OG image URL', placeholder: 'Social share image · e.g. https://example.com/social-card.png', type: 'url' },
        ],
      },
      mobile: {
        headerHeading: 'Mobile header',
        stickyHeader: 'Sticky mobile header',
        hamburgerMode: 'Hamburger mode',
        hamburgerAuto: 'Auto',
        hamburgerForce: 'Force hamburger',
        hamburgerDesktop: 'Desktop menu on mobile',
        bottomHeading: 'Mobile bottom CTA',
        showBottomBar: 'Show fixed bottom action bar',
        type: 'Type',
        phone: 'Phone',
        booking: 'Booking',
        custom: 'Custom',
        label: 'Label',
        link: 'Link',
      },
      dark: {
        runtimeHeading: 'Dark mode runtime',
        lightDarkPreviewHeading: 'Light / Dark simultaneous preview',
        defaultModeLabel: 'Default mode',
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
        allowToggle: 'Allow visitor toggle',
        previewHeader: (mode) => `${mode === 'light' ? 'Light' : 'Dark'} preview`,
        previewPrimary: 'Primary',
        previewSecondary: 'Secondary',
        previewMuted: 'Muted',
        colorLabel: (label) => `Dark ${label}`,
        lightModeDescription: 'The public DarkModeToggle switches between these color sets.',
      },
      advanced: {
        motionHeading: 'Motion',
        pageTransitionLabel: 'Page transition',
        pageTransitionDurationLabel: 'Duration',
        pageTransitionDescription: 'Apply fade/slide/scale transitions to the published page wrapper. Reduced motion automatically disables them.',
        themeColorsHeading: 'Theme colors',
        themeColorLabels: {
          primary: 'Primary',
          secondary: 'Secondary',
          accent: 'Accent',
          background: 'Background',
          text: 'Text',
          muted: 'Muted',
        },
        pageTransitionOptions: {
          none: 'None',
          fade: 'Fade',
          'slide-up': 'Slide up',
          'slide-left': 'Slide left',
          scale: 'Scale',
        },
      },
    };
  }

  return {
    modal: {
      title: '사이트 설정',
      subtitle: 'Brand kit, Typography, Dark, Presets로 사이트 전체 디자인을 한 화면에서 통제합니다.',
      tabAria: '설정 탭',
      tabs: {
        general: '일반',
        brand: '브랜드 키트',
        typography: '타이포그래피',
        presets: '프리셋',
        dark: '다크 모드',
        mobile: '모바일',
        advanced: '고급',
      },
      loading: '로딩 중...',
      save: '저장',
      saving: '저장 중...',
      cancel: '취소',
      saveError: '사이트 설정을 저장하지 못했습니다.',
      loadError: '사이트 설정을 불러오지 못했습니다.',
      brandKitApplied: (label) => `${label} 브랜드 키트를 현재 사이트 테마에 적용했습니다. 저장을 눌러 사이트에 반영하세요.`,
      presetApplied: (label) => `${label} 프리셋을 적용했습니다. 저장을 눌러 사이트에 반영하세요.`,
      componentPresetNoTargets: (label) => `${label} 프리셋에 변경할 button/card/form 요소가 현재 페이지에 없습니다.`,
      componentPresetApplied: (label, count, buttons, cards, fields, submits) =>
        `${label} 프리셋을 ${count}개 컴포넌트에 적용했습니다. 버튼 ${buttons}개, 카드 ${cards}개, 필드 ${fields}개, 제출 버튼 ${submits}개가 변경됐습니다.`,
      radiusApplied: (label) => `${label} 둥근 모서리 프리셋을 적용했습니다. 저장을 눌러 사이트에 반영하세요.`,
      shadowApplied: (label) => `${label} 그림자 프리셋을 적용했습니다. 저장을 눌러 사이트에 반영하세요.`,
      themeSaved: (label) => `${label} 저장됨. 다른 사이트 설정에서도 My Themes에서 불러올 수 있습니다.`,
      myThemeName: (firmName) => (firmName ? `${firmName} My Theme` : 'My Theme'),
      themeDeleted: '내 테마 프리셋을 삭제했습니다.',
      tokenExported: 'Design token JSON을 내보냈습니다.',
      tokenImported: 'Design token JSON을 불러와 적용했습니다. 저장을 눌러 사이트에 반영하세요.',
      tokenReadError: 'Design token JSON을 읽지 못했습니다.',
      brandKitExported: 'Brand kit JSON을 내보냈습니다.',
      brandKitImported: 'Brand kit JSON을 불러와 적용했습니다. 저장을 눌러 사이트에 반영하세요.',
      brandKitReadError: 'Brand kit JSON을 읽지 못했습니다.',
      invalidThemeColor: (label) => `${label} 색상은 #RRGGBB 형식이어야 합니다.`,
      invalidDarkColor: (label) => `다크 ${label} 색상은 #RRGGBB 형식이어야 합니다.`,
    },
    general: {
      heading: '기본 정보',
      fields: [
        { key: 'firmName', label: '사무소 이름', placeholder: '최대 200자 · 예: 호정국제법률사무소' },
        { key: 'phone', label: '전화번호', placeholder: '최대 80자 · 예: +886-2-1234-5678', type: 'tel' },
        { key: 'email', label: '이메일', placeholder: '최대 200자 · 예: contact@example.com', type: 'email' },
        { key: 'address', label: '주소', placeholder: '최대 400자 · 예: 서울시 강남구 테헤란로 123' },
        { key: 'businessHours', label: '영업 시간', placeholder: '최대 200자 · 예: 월~금 09:00-18:00' },
        { key: 'businessRegNumber', label: '사업자 등록번호', placeholder: '최대 120자 · 예: 123-45-67890' },
        { key: 'logo', label: '로고 URL', placeholder: '이미지 URL · 예: https://example.com/logo.png', type: 'url' },
        { key: 'logoDark', label: '다크 로고 URL', placeholder: '이미지 URL · 예: https://example.com/logo-dark.png', type: 'url' },
        { key: 'favicon', label: '파비콘 URL', placeholder: '.ico/.png URL · 예: https://example.com/favicon.ico', type: 'url' },
        { key: 'ogImage', label: 'OG 이미지 URL', placeholder: '소셜 공유 이미지 · 예: https://example.com/social-card.png', type: 'url' },
      ],
    },
    mobile: {
      headerHeading: '모바일 헤더',
      stickyHeader: '고정 모바일 헤더',
      hamburgerMode: '햄버거 모드',
      hamburgerAuto: '자동',
      hamburgerForce: '강제 햄버거',
      hamburgerDesktop: '모바일에서 데스크톱 메뉴',
      bottomHeading: '모바일 하단 CTA',
      showBottomBar: '고정 하단 작업 바 표시',
      type: '유형',
      phone: '전화',
      booking: '예약',
      custom: '사용자 지정',
      label: '레이블',
      link: '링크',
    },
    dark: {
      runtimeHeading: '다크 모드 실행',
      lightDarkPreviewHeading: '라이트 / 다크 동시 미리보기',
      defaultModeLabel: '기본 모드',
      light: '라이트',
      dark: '다크',
      auto: '자동',
      allowToggle: '방문자 전환 허용',
      previewHeader: (mode) => `${mode === 'light' ? '라이트' : '다크'} 미리보기`,
      previewPrimary: '기본',
      previewSecondary: '보조',
      previewMuted: '톤 다운',
      colorLabel: (label) => `다크 ${label}`,
      lightModeDescription: 'Published 페이지의 DarkModeToggle이 이 색상 세트 사이를 전환합니다.',
    },
    advanced: {
      motionHeading: '동작',
      pageTransitionLabel: '페이지 전환',
      pageTransitionDurationLabel: '지속 시간',
      pageTransitionDescription: 'Published 페이지 wrapper에 fade/slide/scale 전환을 적용합니다. reduced motion을 켜면 자동으로 꺼집니다.',
      themeColorsHeading: '테마 색상',
      themeColorLabels: {
        primary: '기본',
        secondary: '보조',
        accent: '강조',
        background: '배경',
        text: '텍스트',
        muted: '톤 다운',
      },
      pageTransitionOptions: {
        none: '없음',
        fade: '페이드',
        'slide-up': '위로 슬라이드',
        'slide-left': '왼쪽 슬라이드',
        scale: '확대',
      },
    },
  };
}
