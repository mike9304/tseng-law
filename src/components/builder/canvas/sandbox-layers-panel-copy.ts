import type { Locale } from '@/lib/locales';

export type SandboxLayerSearchCopy = {
  placeholder: string;
  ariaLabel: string;
  resultCountLabel: (count: number) => string;
  hintLabel: string;
  clearAriaLabel: string;
};

export type SandboxLayerRowCopy = {
  collapseLabel: string;
  expandLabel: string;
  noChildrenLabel: string;
  dragHandleLabel: string;
  primaryLabel: string;
  zIndexLabel: (zIndex: number) => string;
  childCountLabel: (count: number) => string;
  hideNodeLabel: string;
  showNodeLabel: string;
  lockNodeLabel: string;
  unlockNodeLabel: string;
  moreActionsLabel: string;
  semanticLabels: {
    sections: Record<string, string>;
    roles: Record<string, string>;
  };
};

export type SandboxLayersPanelCopy = {
  title: string;
  nodeCountLabel: (count: number) => string;
  collapseTitle: string;
  expandTitle: string;
  hideLabel: string;
  showLabel: string;
  emptyLabel: string;
  dropHintLabel: string;
  kindLabels: Record<string, string>;
  search: SandboxLayerSearchCopy;
  row: SandboxLayerRowCopy;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxLayersPanelCopy> = {
  ko: {
    title: '레이어',
    nodeCountLabel: (count) => `${count}개 노드`,
    collapseTitle: '레이어 패널 접기',
    expandTitle: '레이어 패널 열기',
    hideLabel: '숨기기',
    showLabel: '보이기',
    emptyLabel: '아직 노드가 없습니다. 카탈로그에서 추가하세요.',
    dropHintLabel: '컨테이너 가운데에 놓으면 중첩됩니다. 행 위나 아래에 놓으면 그 행 옆으로 재정렬하거나 이동합니다.',
    kindLabels: {
      container: '컨테이너',
      section: '섹션',
      text: '텍스트',
      heading: '제목',
      image: '이미지',
      button: '버튼',
      divider: '구분선',
      spacer: '여백',
      icon: '아이콘',
      codeBlock: '코드',
      'video-embed': '동영상',
      form: '폼',
      map: '지도',
      composite: '복합 요소',
      group: '그룹',
    },
    search: {
      placeholder: '노드 검색...',
      ariaLabel: '레이어 검색',
      resultCountLabel: (count) => `${count}개 결과`,
      hintLabel: 'id / 종류 / 텍스트',
      clearAriaLabel: '레이어 검색 지우기',
    },
    row: {
      collapseLabel: '하위 레이어 접기',
      expandLabel: '하위 레이어 펼치기',
      noChildrenLabel: '하위 레이어 없음',
      dragHandleLabel: '드래그해서 레이어 순서 또는 컨테이너 위치 변경',
      primaryLabel: '주 선택',
      zIndexLabel: (zIndex) => `z ${zIndex}`,
      childCountLabel: (count) => `${count}개 하위`,
      hideNodeLabel: '캔버스에서 숨기기',
      showNodeLabel: '캔버스에 보이기',
      lockNodeLabel: '레이어 잠금',
      unlockNodeLabel: '잠금 해제',
      moreActionsLabel: '레이어 더보기',
      semanticLabels: {
        sections: {
          hero: '히어로',
          insights: '인사이트',
          services: '서비스',
          faq: 'FAQ',
          offices: '지점',
          stats: '성과 지표',
          contact: '연락',
          attorney: '변호사',
          'case-results': '사례 결과',
        },
        roles: {
          root: '섹션',
          container: '그룹',
          content: '콘텐츠',
          copy: '문구',
          actions: '액션',
          tabs: '탭',
          layout: '레이아웃',
          card: '카드',
          label: '라벨',
          title: '제목',
          desc: '설명',
          summary: '요약',
          cta: 'CTA',
        },
      },
    },
  },
  'zh-hant': {
    title: '圖層',
    nodeCountLabel: (count) => `${count} 個節點`,
    collapseTitle: '收合圖層面板',
    expandTitle: '展開圖層面板',
    hideLabel: '隱藏',
    showLabel: '顯示',
    emptyLabel: '尚無節點。請從目錄新增。',
    dropHintLabel: '拖放到容器中央可巢狀放入。拖放到列的上方或下方可重新排序，或移到該列旁邊。',
    kindLabels: {
      container: '容器',
      section: '區段',
      text: '文字',
      heading: '標題',
      image: '圖片',
      button: '按鈕',
      divider: '分隔線',
      spacer: '間距',
      icon: '圖示',
      codeBlock: '程式碼',
      'video-embed': '影片',
      form: '表單',
      map: '地圖',
      composite: '複合元素',
      group: '群組',
    },
    search: {
      placeholder: '搜尋節點...',
      ariaLabel: '搜尋圖層',
      resultCountLabel: (count) => `${count} 個結果`,
      hintLabel: 'id / 類型 / 文字',
      clearAriaLabel: '清除圖層搜尋',
    },
    row: {
      collapseLabel: '收合子圖層',
      expandLabel: '展開子圖層',
      noChildrenLabel: '沒有子圖層',
      dragHandleLabel: '拖曳以調整圖層順序或移入容器',
      primaryLabel: '主要選取',
      zIndexLabel: (zIndex) => `z ${zIndex}`,
      childCountLabel: (count) => `${count} 個子圖層`,
      hideNodeLabel: '在畫布中隱藏',
      showNodeLabel: '在畫布中顯示',
      lockNodeLabel: '鎖定圖層',
      unlockNodeLabel: '解除鎖定',
      moreActionsLabel: '更多圖層動作',
      semanticLabels: {
        sections: {
          hero: '主視覺',
          insights: '洞察',
          services: '服務',
          faq: 'FAQ',
          offices: '據點',
          stats: '成效數據',
          contact: '聯絡',
          attorney: '律師',
          'case-results': '案例成果',
        },
        roles: {
          root: '區段',
          container: '群組',
          content: '內容',
          copy: '文案',
          actions: '動作',
          tabs: '分頁',
          layout: '版面',
          card: '卡片',
          label: '標籤',
          title: '標題',
          desc: '說明',
          summary: '摘要',
          cta: 'CTA',
        },
      },
    },
  },
  en: {
    title: 'Layers',
    nodeCountLabel: (count) => `${count} nodes`,
    collapseTitle: 'Collapse layers panel',
    expandTitle: 'Expand layers panel',
    hideLabel: 'Hide',
    showLabel: 'Show',
    emptyLabel: 'No nodes yet. Add one from the catalog.',
    dropHintLabel: 'Drop on the middle of a container to nest. Drop above or below a row to reorder or move beside that row.',
    kindLabels: {
      container: 'Container',
      section: 'Section',
      text: 'Text',
      heading: 'Heading',
      image: 'Image',
      button: 'Button',
      divider: 'Divider',
      spacer: 'Spacer',
      icon: 'Icon',
      codeBlock: 'Code',
      'video-embed': 'Video',
      form: 'Form',
      map: 'Map',
      composite: 'Composite element',
      group: 'Group',
    },
    search: {
      placeholder: 'Search nodes...',
      ariaLabel: 'Search layers',
      resultCountLabel: (count) => `${count} results`,
      hintLabel: 'id / type / text',
      clearAriaLabel: 'Clear layer search',
    },
    row: {
      collapseLabel: 'Collapse child layers',
      expandLabel: 'Expand child layers',
      noChildrenLabel: 'No child layers',
      dragHandleLabel: 'Drag to reorder layers or move into containers',
      primaryLabel: 'Primary selection',
      zIndexLabel: (zIndex) => `z ${zIndex}`,
      childCountLabel: (count) => `${count} ${count === 1 ? 'child' : 'children'}`,
      hideNodeLabel: 'Hide on canvas',
      showNodeLabel: 'Show on canvas',
      lockNodeLabel: 'Lock layer',
      unlockNodeLabel: 'Unlock layer',
      moreActionsLabel: 'More layer actions',
      semanticLabels: {
        sections: {
          hero: 'Hero',
          insights: 'Insights',
          services: 'Services',
          faq: 'FAQ',
          offices: 'Offices',
          stats: 'Stats',
          contact: 'Contact',
          attorney: 'Attorney',
          'case-results': 'Case results',
        },
        roles: {
          root: 'section',
          container: 'group',
          content: 'content',
          copy: 'copy',
          actions: 'actions',
          tabs: 'tabs',
          layout: 'layout',
          card: 'card',
          label: 'label',
          title: 'title',
          desc: 'description',
          summary: 'summary',
          cta: 'CTA',
        },
      },
    },
  },
};

export function getSandboxLayersPanelCopy(locale: Locale): SandboxLayersPanelCopy {
  return COPY[locale] ?? COPY.en;
}
