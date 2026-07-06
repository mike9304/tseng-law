import type { Locale } from '@/lib/locales';

export type DocumentDiffFieldKey =
  | 'text'
  | 'label'
  | 'placeholder'
  | 'alt'
  | 'title'
  | 'image'
  | 'link'
  | 'action'
  | 'address'
  | 'embed';

export interface DocumentDiffCopy {
  summaryLoading: string;
  summaryNoChanges: string;
  summaryCounts: (added: number, removed: number, modified: number) => string;
  nodeKindLabels: {
    text: string;
    heading: string;
    image: string;
    button: string;
  };
  nodeSummary: {
    text: (text: string) => string;
    heading: (level: unknown, text: string) => string;
    image: (src: unknown) => string;
    button: (label: string) => string;
  };
  noImageSource: string;
  emptyValue: string;
  nullValue: string;
  fields: Record<DocumentDiffFieldKey, string>;
  changes: {
    kind: string;
    parent: string;
    visibility: string;
    lock: string;
    layer: string;
    rotation: string;
    position: string;
    size: string;
    contentChanged: string;
    styleChanged: string;
    hoverStyleChanged: string;
    animationChanged: string;
    responsiveOverrideChanged: string;
    nodeDataChanged: string;
  };
  states: {
    shown: string;
    hidden: string;
    locked: string;
    unlocked: string;
  };
}

const COPY: Record<Locale, DocumentDiffCopy> = {
  ko: {
    summaryLoading: '차이 미리보기 준비 중',
    summaryNoChanges: '현재 초안과 동일',
    summaryCounts: (added, removed, modified) => `+${added} / -${removed} / ~${modified}`,
    nodeKindLabels: {
      text: '텍스트',
      heading: '제목',
      image: '이미지',
      button: '버튼',
    },
    nodeSummary: {
      text: (text) => `텍스트 - "${text}"`,
      heading: (level, text) => `제목 H${level} - "${text}"`,
      image: (src) => `이미지 - ${src ?? COPY.ko.noImageSource}`,
      button: (label) => `버튼 - "${label}"`,
    },
    noImageSource: '(소스 없음)',
    emptyValue: '비어 있음',
    nullValue: 'null',
    fields: {
      text: '텍스트',
      label: '라벨',
      placeholder: '플레이스홀더',
      alt: '대체 텍스트',
      title: '제목',
      image: '이미지',
      link: '링크',
      action: '동작',
      address: '주소',
      embed: '임베드',
    },
    changes: {
      kind: '종류',
      parent: '상위',
      visibility: '표시 상태',
      lock: '잠금',
      layer: '레이어',
      rotation: '회전',
      position: '위치',
      size: '크기',
      contentChanged: '콘텐츠 변경됨',
      styleChanged: '스타일 변경됨',
      hoverStyleChanged: '호버 스타일 변경됨',
      animationChanged: '애니메이션 변경됨',
      responsiveOverrideChanged: '반응형 오버라이드 변경됨',
      nodeDataChanged: '노드 데이터 변경됨',
    },
    states: {
      shown: '표시',
      hidden: '숨김',
      locked: '잠김',
      unlocked: '잠금 해제',
    },
  },
  'zh-hant': {
    summaryLoading: '差異預覽準備中',
    summaryNoChanges: '與目前草稿相同',
    summaryCounts: (added, removed, modified) => `+${added} / -${removed} / ~${modified}`,
    nodeKindLabels: {
      text: '文字',
      heading: '標題',
      image: '圖片',
      button: '按鈕',
    },
    nodeSummary: {
      text: (text) => `文字 - "${text}"`,
      heading: (level, text) => `標題 H${level} - "${text}"`,
      image: (src) => `圖片 - ${src ?? COPY['zh-hant'].noImageSource}`,
      button: (label) => `按鈕 - "${label}"`,
    },
    noImageSource: '(沒有來源)',
    emptyValue: '空白',
    nullValue: 'null',
    fields: {
      text: '文字',
      label: '標籤',
      placeholder: '預留文字',
      alt: '替代文字',
      title: '標題',
      image: '圖片',
      link: '連結',
      action: '動作',
      address: '地址',
      embed: '嵌入',
    },
    changes: {
      kind: '類型',
      parent: '上層',
      visibility: '顯示狀態',
      lock: '鎖定',
      layer: '圖層',
      rotation: '旋轉',
      position: '位置',
      size: '尺寸',
      contentChanged: '內容已變更',
      styleChanged: '樣式已變更',
      hoverStyleChanged: '滑過樣式已變更',
      animationChanged: '動畫已變更',
      responsiveOverrideChanged: '響應式覆寫已變更',
      nodeDataChanged: '節點資料已變更',
    },
    states: {
      shown: '顯示',
      hidden: '隱藏',
      locked: '已鎖定',
      unlocked: '未鎖定',
    },
  },
  en: {
    summaryLoading: 'Diff preview loading',
    summaryNoChanges: 'Same as current draft',
    summaryCounts: (added, removed, modified) => `+${added} / -${removed} / ~${modified}`,
    nodeKindLabels: {
      text: 'text',
      heading: 'heading',
      image: 'image',
      button: 'button',
    },
    nodeSummary: {
      text: (text) => `text - "${text}"`,
      heading: (level, text) => `heading H${level} - "${text}"`,
      image: (src) => `image - ${src ?? COPY.en.noImageSource}`,
      button: (label) => `button - "${label}"`,
    },
    noImageSource: '(no src)',
    emptyValue: 'empty',
    nullValue: 'null',
    fields: {
      text: 'text',
      label: 'label',
      placeholder: 'placeholder',
      alt: 'alt',
      title: 'title',
      image: 'image',
      link: 'link',
      action: 'action',
      address: 'address',
      embed: 'embed',
    },
    changes: {
      kind: 'kind',
      parent: 'parent',
      visibility: 'visibility',
      lock: 'lock',
      layer: 'layer',
      rotation: 'rotation',
      position: 'position',
      size: 'size',
      contentChanged: 'content changed',
      styleChanged: 'style changed',
      hoverStyleChanged: 'hover style changed',
      animationChanged: 'animation changed',
      responsiveOverrideChanged: 'responsive override changed',
      nodeDataChanged: 'node data changed',
    },
    states: {
      shown: 'shown',
      hidden: 'hidden',
      locked: 'locked',
      unlocked: 'unlocked',
    },
  },
};

export const DEFAULT_DOCUMENT_DIFF_COPY = COPY.en;

export function getDocumentDiffCopy(locale?: Locale | string | null): DocumentDiffCopy {
  if (locale === 'ko') return COPY.ko;
  if (locale === 'zh-hant') return COPY['zh-hant'];
  return COPY.en;
}
