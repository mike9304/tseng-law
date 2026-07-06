import type { Locale } from '@/lib/locales';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface CanvasShellCopy {
  workspaceHeader: {
    headerLabel: string;
    menuEditable: string;
    editMenu: string;
    siteSettings: string;
    ariaLabel: string;
    title: string;
  };
  globalCanvas: {
    backLabel: string;
    addLabel: string;
    layersLabel: string;
    saveStates: Record<SaveState, string>;
    autosaveLabel: string;
    emptyCanvasLabel: string;
    fallbackLabel: string;
    headerTitle: string;
    footerTitle: string;
    headerFallback: string;
    footerFallback: string;
    headerSlotLabel: string;
    footerSlotLabel: string;
  };
  lightbox: {
    backLabel: string;
    settingsLabel: string;
    addLabel: string;
    layersLabel: string;
    saveStates: Record<SaveState, string>;
    settingsHeading: string;
    sizeModeLabel: string;
    auto: string;
    fixed: string;
    widthLabel: string;
    heightLabel: string;
    showCloseButton: string;
    closeOnOutsideClick: string;
    closeOnEsc: string;
    defaultLightbox: string;
  };
}

export function getCanvasShellCopy(locale: Locale): CanvasShellCopy {
  if (locale === 'ko') {
    return {
      workspaceHeader: {
        headerLabel: '헤더',
        menuEditable: '메뉴 편집 가능',
        editMenu: '메뉴 편집',
        siteSettings: '사이트 설정',
        ariaLabel: '편집 가능한 사이트 헤더',
        title: '헤더 내비게이션 편집',
      },
      globalCanvas: {
        backLabel: '편집기로 돌아가기',
        addLabel: '추가',
        layersLabel: '레이어',
        saveStates: {
          idle: '',
          saving: '저장 중…',
          saved: '저장됨',
          error: '저장 실패',
        },
        autosaveLabel: '자동 저장',
        emptyCanvasLabel: '빈 캔버스',
        fallbackLabel: '기존',
        headerTitle: '글로벌 헤더 편집기',
        footerTitle: '글로벌 푸터 편집기',
        headerFallback: '헤더 컴포넌트',
        footerFallback: '푸터 컴포넌트',
        headerSlotLabel: '헤더 슬롯',
        footerSlotLabel: '푸터 슬롯',
      },
      lightbox: {
        backLabel: '라이트박스',
        settingsLabel: '설정',
        addLabel: '추가',
        layersLabel: '레이어',
        saveStates: {
          idle: '',
          saving: '저장 중…',
          saved: '저장됨',
          error: '저장 실패',
        },
        settingsHeading: '라이트박스 설정',
        sizeModeLabel: '크기 모드',
        auto: '자동',
        fixed: '고정',
        widthLabel: '너비 (px)',
        heightLabel: '높이 (px)',
        showCloseButton: '닫기(X) 버튼 표시',
        closeOnOutsideClick: '바깥 클릭 시 닫기',
        closeOnEsc: 'Esc로 닫기',
        defaultLightbox: '기본 라이트박스',
      },
    };
  }
  if (locale === 'zh-hant') {
    return {
      workspaceHeader: {
        headerLabel: '頁首',
        menuEditable: '選單可編輯',
        editMenu: '編輯選單',
        siteSettings: '網站設定',
        ariaLabel: '可編輯的網站頁首',
        title: '編輯頁首導覽',
      },
      globalCanvas: {
        backLabel: '返回編輯器',
        addLabel: '新增',
        layersLabel: '圖層',
        saveStates: {
          idle: '',
          saving: '儲存中…',
          saved: '已儲存',
          error: '儲存失敗',
        },
        autosaveLabel: '自動儲存',
        emptyCanvasLabel: '空白畫布',
        fallbackLabel: '舊版',
        headerTitle: '全域頁首編輯器',
        footerTitle: '全域頁尾編輯器',
        headerFallback: '頁首元件',
        footerFallback: '頁尾元件',
        headerSlotLabel: '頁首區塊',
        footerSlotLabel: '頁尾區塊',
      },
      lightbox: {
        backLabel: 'Lightbox',
        settingsLabel: '設定',
        addLabel: '新增',
        layersLabel: '圖層',
        saveStates: {
          idle: '',
          saving: '儲存中…',
          saved: '已儲存',
          error: '儲存失敗',
        },
        settingsHeading: 'Lightbox 設定',
        sizeModeLabel: '尺寸模式',
        auto: '自動',
        fixed: '固定',
        widthLabel: '寬度 (px)',
        heightLabel: '高度 (px)',
        showCloseButton: '顯示關閉 (X) 按鈕',
        closeOnOutsideClick: '點外部即關閉',
        closeOnEsc: '按 Esc 關閉',
        defaultLightbox: '預設 Lightbox',
      },
    };
  }
  return {
    workspaceHeader: {
      headerLabel: 'Header',
      menuEditable: 'Menu editable',
      editMenu: 'Edit menu',
      siteSettings: 'Site settings',
      ariaLabel: 'Editable site header',
      title: 'Edit header navigation',
    },
    globalCanvas: {
      backLabel: 'Back to editor',
      addLabel: 'Add',
      layersLabel: 'Layers',
      saveStates: {
        idle: '',
        saving: 'Saving…',
        saved: 'Saved',
        error: 'Save failed',
      },
      autosaveLabel: 'autosaved as',
      emptyCanvasLabel: 'Empty canvas',
      fallbackLabel: 'legacy',
      headerTitle: 'Global Header Editor',
      footerTitle: 'Global Footer Editor',
      headerFallback: 'header component',
      footerFallback: 'footer component',
      headerSlotLabel: 'header slot',
      footerSlotLabel: 'footer slot',
    },
    lightbox: {
      backLabel: 'Lightboxes',
      settingsLabel: 'Settings',
      addLabel: 'Add',
      layersLabel: 'Layers',
      saveStates: {
        idle: '',
        saving: 'Saving…',
        saved: 'Saved',
        error: 'Save failed',
      },
      settingsHeading: 'Lightbox settings',
      sizeModeLabel: 'Size mode',
      auto: 'Auto',
      fixed: 'Fixed',
      widthLabel: 'Width (px)',
      heightLabel: 'Height (px)',
      showCloseButton: 'Show close (X) button',
      closeOnOutsideClick: 'Close on outside click',
      closeOnEsc: 'Close on Esc',
      defaultLightbox: 'Default lightbox',
    },
  };
}
