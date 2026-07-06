import type { Locale } from '@/lib/locales';

export type SandboxInspectorInteractionsCopy = {
  actionLabel: string;
  anchorAction: string;
  clickTrigger: string;
  cookieAction: string;
  customAction: string;
  destinationLabel: string;
  imageActionLabel: string;
  imageLightboxAction: string;
  imageLinkAction: string;
  imagePopupAction: string;
  linkHelp: string;
  lightboxAction: string;
  noneAction: string;
  pageAction: string;
  popupAction: string;
  triggerLabel: string;
  unsupported: string;
};

const COPY: Record<Locale, SandboxInspectorInteractionsCopy> = {
  ko: {
    actionLabel: '동작',
    anchorAction: '앵커로 스크롤',
    clickTrigger: '클릭',
    cookieAction: '쿠키 설정 열기',
    customAction: '직접 입력',
    destinationLabel: '대상',
    imageActionLabel: '이미지 클릭',
    imageLightboxAction: '이미지 라이트박스',
    imageLinkAction: '링크 열기',
    imagePopupAction: '이미지 팝업',
    linkHelp: '퍼블리시 화면에서는 같은 값이 페이지 이동, 앵커 스크롤, 라이트박스, 팝업 트리거로 동작합니다.',
    lightboxAction: '라이트박스 열기',
    noneAction: '없음',
    pageAction: '페이지로 이동',
    popupAction: '팝업 열기',
    triggerLabel: '트리거',
    unsupported: '이 요소는 아직 클릭 인터랙션 저장 포맷이 없습니다. 버튼, 텍스트, 이미지, 컨테이너에서 링크 동작을 설정할 수 있습니다.',
  },
  'zh-hant': {
    actionLabel: '動作',
    anchorAction: '捲動到錨點',
    clickTrigger: '點擊',
    cookieAction: '開啟 Cookie 設定',
    customAction: '自訂',
    destinationLabel: '目標',
    imageActionLabel: '圖片點擊',
    imageLightboxAction: '圖片 Lightbox',
    imageLinkAction: '開啟連結',
    imagePopupAction: '圖片 Popup',
    linkHelp: '發佈頁會用同一個值執行頁面跳轉、錨點捲動、Lightbox 或 Popup 觸發。',
    lightboxAction: '開啟 Lightbox',
    noneAction: '無',
    pageAction: '前往頁面',
    popupAction: '開啟 Popup',
    triggerLabel: '觸發',
    unsupported: '此元素尚無可儲存的點擊互動格式。按鈕、文字、圖片與容器可設定連結動作。',
  },
  en: {
    actionLabel: 'Action',
    anchorAction: 'Scroll to anchor',
    clickTrigger: 'Click',
    cookieAction: 'Open cookie settings',
    customAction: 'Custom',
    destinationLabel: 'Destination',
    imageActionLabel: 'Image click',
    imageLightboxAction: 'Image lightbox',
    imageLinkAction: 'Open link',
    imagePopupAction: 'Image popup',
    linkHelp: 'The published page uses this same value for page links, anchor scroll, lightbox, and popup triggers.',
    lightboxAction: 'Open lightbox',
    noneAction: 'None',
    pageAction: 'Go to page',
    popupAction: 'Open popup',
    triggerLabel: 'Trigger',
    unsupported: 'This element does not have a stored click interaction format yet. Buttons, text, images, and containers can use link actions.',
  },
};

export function getSandboxInspectorInteractionsCopy(locale: Locale): SandboxInspectorInteractionsCopy {
  return COPY[locale] ?? COPY.en;
}
