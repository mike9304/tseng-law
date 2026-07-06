import type { Locale } from '@/lib/locales';

export interface LinkPickerCopy {
  link: {
    dialogLabel: string;
    label: string;
    placeholder: string;
    blockedLink: string;
    detectedScheme: string;
    emptyLink: string;
    lightboxLabel: string;
    lightboxPlaceholder: string;
    popupLabel: string;
    popupPlaceholder: string;
    targetLabel: string;
    targetSelf: string;
    targetBlank: string;
    advancedShow: string;
    advancedHide: string;
    relLabel: string;
    titleLabel: string;
    ariaLabelLabel: string;
    clearLink: string;
  };
}

export function getLinkPickerCopy(locale: Locale | undefined): LinkPickerCopy {
  if (locale === 'ko') {
    return {
      link: {
        dialogLabel: '링크 편집',
        label: '링크',
        placeholder: '/ko/contact, #contact, lightbox:demo, popup:demo, https://...',
        blockedLink: '차단된 링크입니다. `/`, `#`, `lightbox:`, `popup:`, `cookie-consent:`, `https:`, `http:`, `mailto:`, `tel:` 만 허용됩니다.',
        detectedScheme: '감지된 링크 유형',
        emptyLink: '비워두면 링크가 제거됩니다.',
        lightboxLabel: '라이트박스',
        lightboxPlaceholder: '라이트박스 선택',
        popupLabel: '팝업',
        popupPlaceholder: '팝업 선택',
        targetLabel: '대상',
        targetSelf: '같은 창',
        targetBlank: '새 창 (_blank)',
        advancedShow: '고급 보기',
        advancedHide: '고급 숨기기',
        relLabel: 'Rel',
        titleLabel: '제목',
        ariaLabelLabel: 'Aria label',
        clearLink: '링크 지우기',
      },
    };
  }
  if (locale === 'zh-hant') {
    return {
      link: {
        dialogLabel: '編輯連結',
        label: '連結',
        placeholder: '/zh-hant/contact, #contact, lightbox:demo, popup:demo, https://...',
        blockedLink: '這個連結已被封鎖。僅允許 `/`、`#`、`lightbox:`、`popup:`、`cookie-consent:`、`https:`、`http:`、`mailto:`、`tel:`。',
        detectedScheme: '偵測到的連結類型',
        emptyLink: '留白會移除連結。',
        lightboxLabel: 'Lightbox',
        lightboxPlaceholder: '選擇 Lightbox',
        popupLabel: 'Popup',
        popupPlaceholder: '選擇 Popup',
        targetLabel: '目標',
        targetSelf: '同一視窗',
        targetBlank: '新視窗 (_blank)',
        advancedShow: '顯示進階',
        advancedHide: '隱藏進階',
        relLabel: 'Rel',
        titleLabel: '標題',
        ariaLabelLabel: 'Aria 標籤',
        clearLink: '清除連結',
      },
    };
  }
  return {
    link: {
      dialogLabel: 'Edit link',
      label: 'Link',
      placeholder: '/contact, #contact, lightbox:demo, popup:demo, https://...',
      blockedLink: 'Blocked link. Allowed schemes: `/`, `#`, `lightbox:`, `popup:`, `cookie-consent:`, `https:`, `http:`, `mailto:`, `tel:`.',
      detectedScheme: 'Detected link type',
      emptyLink: 'Leave blank to remove the link.',
      lightboxLabel: 'Lightbox',
      lightboxPlaceholder: 'Select lightbox',
      popupLabel: 'Popup',
      popupPlaceholder: 'Select popup',
      targetLabel: 'Target',
      targetSelf: 'Same tab',
      targetBlank: 'New tab (_blank)',
      advancedShow: 'Advanced',
      advancedHide: 'Hide advanced',
      relLabel: 'Rel',
      titleLabel: 'Title',
      ariaLabelLabel: 'Aria label',
      clearLink: 'Clear link',
    },
  };
}
