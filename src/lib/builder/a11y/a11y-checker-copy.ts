import type { Locale } from '@/lib/locales';

export type A11yCheckerCopy = {
  imageAltMessage: string;
  imageAltSuggestion: string;
  emptyTextMessage: string;
  emptyTextSuggestion: string;
  buttonNoLinkMessage: string;
  buttonNoLinkSuggestion: string;
  linkBlankRelMessage: string;
  linkBlankRelSuggestion: string;
  imageLinkLabelMessage: string;
  imageLinkLabelSuggestion: string;
  colorContrastMessage: (ratio: string) => string;
  colorContrastSuggestion: string;
  headingLevelMessage: (level: number) => string;
  videoCaptionsMessage: string;
  videoCaptionsSuggestion: string;
  pageHeadingMessage: string;
  pageHeadingSuggestion: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', A11yCheckerCopy> = {
  ko: {
    imageAltMessage: '이미지에 대체 텍스트(alt)가 없습니다.',
    imageAltSuggestion: '이미지를 설명하는 짧은 텍스트를 alt 필드에 입력하세요.',
    emptyTextMessage: '빈 텍스트 요소가 있습니다.',
    emptyTextSuggestion: '텍스트를 입력하거나 요소를 삭제하세요.',
    buttonNoLinkMessage: '버튼에 링크가 설정되지 않았습니다.',
    buttonNoLinkSuggestion: '클릭 시 이동할 URL을 설정하세요.',
    linkBlankRelMessage: '새 창 링크에 rel="noopener noreferrer"가 없습니다.',
    linkBlankRelSuggestion: 'Link 설정에서 rel 값을 noopener noreferrer로 지정하세요.',
    imageLinkLabelMessage: '이미지 링크에 접근 가능한 이름이 없습니다.',
    imageLinkLabelSuggestion: 'Link의 aria-label 또는 이미지 alt 텍스트를 입력하세요.',
    colorContrastMessage: (ratio) => `색상 대비가 부족합니다 (${ratio}:1, 최소 4.5:1 필요).`,
    colorContrastSuggestion: '텍스트 색상을 더 어둡게 하거나 배경을 더 밝게 하세요.',
    headingLevelMessage: (level) => `H${level} 헤딩이 사용되었습니다. H1~H3을 권장합니다.`,
    videoCaptionsMessage: '동영상에 자막이 있는지 확인하세요.',
    videoCaptionsSuggestion: 'YouTube/Vimeo에서 자막을 활성화하세요.',
    pageHeadingMessage: '페이지에 제목(Heading)이 없습니다.',
    pageHeadingSuggestion: 'H1 또는 큰 텍스트를 페이지 상단에 추가하세요.',
  },
  'zh-hant': {
    imageAltMessage: '圖片缺少替代文字（alt）。',
    imageAltSuggestion: '請在 alt 欄位輸入簡短文字描述圖片。',
    emptyTextMessage: '有空白文字元素。',
    emptyTextSuggestion: '請輸入文字或刪除此元素。',
    buttonNoLinkMessage: '按鈕尚未設定連結。',
    buttonNoLinkSuggestion: '請設定點擊後要前往的 URL。',
    linkBlankRelMessage: '新視窗連結缺少 rel="noopener noreferrer"。',
    linkBlankRelSuggestion: '請在 Link 設定中將 rel 設為 noopener noreferrer。',
    imageLinkLabelMessage: '圖片連結缺少可存取名稱。',
    imageLinkLabelSuggestion: '請輸入 Link 的 aria-label 或圖片 alt 文字。',
    colorContrastMessage: (ratio) => `色彩對比不足（${ratio}:1，至少需要 4.5:1）。`,
    colorContrastSuggestion: '請讓文字顏色更深，或讓背景更亮。',
    headingLevelMessage: (level) => `已使用 H${level} 標題。建議使用 H1~H3。`,
    videoCaptionsMessage: '請確認影片是否提供字幕。',
    videoCaptionsSuggestion: '請在 YouTube/Vimeo 啟用字幕。',
    pageHeadingMessage: '頁面缺少標題（Heading）。',
    pageHeadingSuggestion: '請在頁面上方新增 H1 或較大的文字。',
  },
  en: {
    imageAltMessage: 'Image is missing alt text.',
    imageAltSuggestion: 'Enter a short description of the image in the alt field.',
    emptyTextMessage: 'There is an empty text element.',
    emptyTextSuggestion: 'Enter text or delete the element.',
    buttonNoLinkMessage: 'Button link is not set.',
    buttonNoLinkSuggestion: 'Set the URL users should open on click.',
    linkBlankRelMessage: 'New-window link is missing rel="noopener noreferrer".',
    linkBlankRelSuggestion: 'Set rel to noopener noreferrer in Link settings.',
    imageLinkLabelMessage: 'Image link has no accessible name.',
    imageLinkLabelSuggestion: 'Enter a Link aria-label or image alt text.',
    colorContrastMessage: (ratio) => `Color contrast is too low (${ratio}:1, minimum 4.5:1 required).`,
    colorContrastSuggestion: 'Use a darker text color or a lighter background.',
    headingLevelMessage: (level) => `H${level} heading is used. H1-H3 is recommended.`,
    videoCaptionsMessage: 'Check whether this video has captions.',
    videoCaptionsSuggestion: 'Enable captions in YouTube/Vimeo.',
    pageHeadingMessage: 'Page has no heading.',
    pageHeadingSuggestion: 'Add an H1 or large text near the top of the page.',
  },
};

export function getA11yCheckerCopy(locale: Locale): A11yCheckerCopy {
  return COPY[locale] ?? COPY.en;
}
