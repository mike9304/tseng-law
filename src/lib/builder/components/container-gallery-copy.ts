import type { Locale } from '@/lib/locales';
import type { BuilderGalleryCanvasNode } from '@/lib/builder/canvas/types';
import type { CardVariantKey } from '@/lib/builder/site/component-variants';

type GalleryImage = BuilderGalleryCanvasNode['content']['images'][number];

export interface ContainerGalleryCopy {
  container: {
    label: string;
    padding: string;
    cardVariant: string;
    clickLink: string;
    layoutMode: string;
    layoutItems: string;
    layoutItemsHint: string;
    activeIndex: string;
    anchorSticky: string;
    anchorTarget: string;
    anchorTargetPlaceholder: string;
    stickyLabel: string;
    hoverContentFallback: string;
    flexSettings: string;
    direction: string;
    wrap: string;
    justifyContent: string;
    alignItems: string;
    gap: string;
    gridSettings: string;
    columns: string;
    rows: string;
    columnGap: string;
    rowGap: string;
    layoutModes: Record<
      'absolute' | 'flex' | 'grid' | 'strip' | 'box' | 'columns' | 'repeater' | 'tabs' | 'accordion' | 'slideshow' | 'hoverBox',
      string
    >;
    flexDirection: Record<'row' | 'column', string>;
    flexWrap: Record<'wrap' | 'nowrap', string>;
    flexJustify: Record<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly', string>;
    flexAlign: Record<'flex-start' | 'center' | 'flex-end' | 'stretch', string>;
    cardVariants: Record<CardVariantKey, string>;
  };
  gallery: {
    layout: string;
    columns: string;
    gap: string;
    captionMode: string;
    below: string;
    overlay: string;
    showCaptions: string;
    filter: string;
    proStyle: string;
    autoplay: string;
    interval: string;
    thumbnailPosition: string;
    images: string;
    addImage: string;
    removeImage: string;
    imageUrl: string;
    altText: string;
    caption: string;
    tags: string;
    fallbackImages: GalleryImage[];
    all: string;
    previous: string;
    next: string;
    goTo: (index: number) => string;
    selectThumbnail: (index: number) => string;
    lightboxLabel: string;
    lightboxClose: string;
    lightboxPrevious: string;
    lightboxNext: string;
    layoutOptions: Record<'grid' | 'masonry' | 'slider' | 'slideshow' | 'thumbnail' | 'pro', string>;
    proStyleOptions: Record<'clean' | 'mosaic' | 'editorial', string>;
    thumbnailOptions: Record<'bottom' | 'right', string>;
  };
}

function cardVariants(locale: Locale): Record<CardVariantKey, string> {
  if (locale === 'ko') {
    return {
      flat: '평면',
      elevated: '입체',
      floating: '플로팅',
      glass: '글래스',
      split: '분할',
      editorial: '에디토리얼',
      compact: '컴팩트',
      spotlight: '스포트라이트',
      outline: '윤곽선',
      timeline: '타임라인',
      soft: '부드러운',
      contrast: '고대비',
    };
  }
  if (locale === 'zh-hant') {
    return {
      flat: '平面',
      elevated: '浮起',
      floating: '懸浮',
      glass: '玻璃',
      split: '分割',
      editorial: '編輯式',
      compact: '緊湊',
      spotlight: '焦點',
      outline: '外框',
      timeline: '時間軸',
      soft: '柔和',
      contrast: '高對比',
    };
  }
  return {
    flat: 'Flat',
    elevated: 'Elevated',
    floating: 'Floating',
    glass: 'Glass',
    split: 'Split',
    editorial: 'Editorial',
    compact: 'Compact',
    spotlight: 'Spotlight',
    outline: 'Outline',
    timeline: 'Timeline',
    soft: 'Soft',
    contrast: 'Contrast',
  };
}

export function getContainerGalleryCopy(locale: Locale): ContainerGalleryCopy {
  if (locale === 'ko') {
    return {
      container: {
        label: '라벨',
        padding: '패딩',
        cardVariant: '카드 변형',
        clickLink: '클릭 링크',
        layoutMode: '레이아웃 모드',
        layoutItems: '레이아웃 항목',
        layoutItemsHint: '제목 | 설명 | 이미지',
        activeIndex: '활성 인덱스',
        anchorSticky: '앵커 / 고정',
        anchorTarget: '앵커 대상',
        anchorTargetPlaceholder: 'services',
        stickyLabel: '공개 페이지에서 고정',
        hoverContentFallback: '호버 콘텐츠',
        flexSettings: '플렉스 설정',
        direction: '방향',
        wrap: '줄바꿈',
        justifyContent: '가로 정렬',
        alignItems: '세로 정렬',
        gap: '간격',
        gridSettings: '그리드 설정',
        columns: '열',
        rows: '행',
        columnGap: '열 간격',
        rowGap: '행 간격',
        layoutModes: {
          absolute: '절대 배치',
          flex: '플렉스',
          grid: '그리드',
          strip: '스트립',
          box: '박스',
          columns: '칼럼',
          repeater: '반복 목록',
          tabs: '탭',
          accordion: '아코디언',
          slideshow: '슬라이드쇼 컨테이너',
          hoverBox: '호버 박스',
        },
        flexDirection: { row: '행', column: '열' },
        flexWrap: { wrap: '줄바꿈', nowrap: '줄바꿈 없음' },
        flexJustify: {
          'flex-start': '시작',
          center: '가운데',
          'flex-end': '끝',
          'space-between': '사이 맞춤',
          'space-around': '주변 간격',
          'space-evenly': '균등 간격',
        },
        flexAlign: { 'flex-start': '시작', center: '가운데', 'flex-end': '끝', stretch: '늘리기' },
        cardVariants: cardVariants(locale),
      },
      gallery: {
        layout: '레이아웃',
        columns: '열',
        gap: '간격',
        captionMode: '캡션 모드',
        below: '아래',
        overlay: '오버레이',
        showCaptions: '캡션 표시',
        filter: '필터',
        proStyle: '프로 스타일',
        autoplay: '자동 재생',
        interval: '간격',
        thumbnailPosition: '썸네일 위치',
        images: '이미지',
        addImage: '이미지 추가',
        removeImage: '제거',
        imageUrl: '이미지 URL',
        altText: '대체 텍스트 (alt)',
        caption: '캡션',
        tags: '태그',
        fallbackImages: [
          {
            src: '/images/header-skyline-buildings.webp',
            alt: '갤러리 스카이라인',
            caption: '상담 공간',
            tags: ['오피스'],
          },
          {
            src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
            alt: '갤러리 법률 칼럼',
            caption: '기업 법무',
            tags: ['서비스'],
          },
          {
            src: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
            alt: '갤러리 분쟁 칼럼',
            caption: '분쟁 해결',
            tags: ['사례'],
          },
          {
            src: '/images/team/son-jungmin.jpg',
            alt: '갤러리 변호사',
            caption: '한국어 상담',
            tags: ['팀'],
          },
        ],
        all: '전체',
        previous: '이전 갤러리 이미지',
        next: '다음 갤러리 이미지',
        goTo: (index) => `갤러리 이미지 ${index + 1}로 이동`,
        selectThumbnail: (index) => `썸네일 ${index + 1} 선택`,
        lightboxLabel: '갤러리 이미지',
        lightboxClose: '닫기',
        lightboxPrevious: '이전 이미지',
        lightboxNext: '다음 이미지',
        layoutOptions: {
          grid: '그리드',
          masonry: '메이슨리',
          slider: '슬라이더',
          slideshow: '슬라이드쇼',
          thumbnail: '썸네일',
          pro: '프로 갤러리',
        },
        proStyleOptions: { clean: '깔끔', mosaic: '모자이크', editorial: '에디토리얼' },
        thumbnailOptions: { bottom: '아래', right: '오른쪽' },
      },
    };
  }
  if (locale === 'zh-hant') {
    return {
      container: {
        label: '標籤',
        padding: '內距',
        cardVariant: '卡片變體',
        clickLink: '點擊連結',
        layoutMode: '版面模式',
        layoutItems: '版面項目',
        layoutItemsHint: '標題 | 說明 | 圖片',
        activeIndex: '目前索引',
        anchorSticky: '錨點 / 固定',
        anchorTarget: '錨點目標',
        anchorTargetPlaceholder: 'services',
        stickyLabel: '發佈頁固定',
        hoverContentFallback: '懸停內容',
        flexSettings: '彈性設定',
        direction: '方向',
        wrap: '換行',
        justifyContent: '主軸對齊',
        alignItems: '交叉軸對齊',
        gap: '間距',
        gridSettings: '格狀設定',
        columns: '欄數',
        rows: '列數',
        columnGap: '欄間距',
        rowGap: '列間距',
        layoutModes: {
          absolute: '絕對定位',
          flex: '彈性',
          grid: '格狀',
          strip: '橫條',
          box: '方塊',
          columns: '欄位',
          repeater: '重複清單',
          tabs: '分頁',
          accordion: '手風琴',
          slideshow: '投影片容器',
          hoverBox: '懸停方塊',
        },
        flexDirection: { row: '橫向', column: '直向' },
        flexWrap: { wrap: '換行', nowrap: '不換行' },
        flexJustify: {
          'flex-start': '起點',
          center: '置中',
          'flex-end': '終點',
          'space-between': '兩端對齊',
          'space-around': '周圍平均',
          'space-evenly': '平均分佈',
        },
        flexAlign: { 'flex-start': '起點', center: '置中', 'flex-end': '終點', stretch: '拉伸' },
        cardVariants: cardVariants(locale),
      },
      gallery: {
        layout: '版面',
        columns: '欄數',
        gap: '間距',
        captionMode: '標題模式',
        below: '下方',
        overlay: '疊加',
        showCaptions: '顯示標題',
        filter: '篩選',
        proStyle: '專業樣式',
        autoplay: '自動播放',
        interval: '間隔',
        thumbnailPosition: '縮圖位置',
        images: '圖片',
        addImage: '新增圖片',
        removeImage: '移除',
        imageUrl: '圖片 URL',
        altText: '替代文字（alt）',
        caption: '標題',
        tags: '標籤',
        fallbackImages: [
          {
            src: '/images/header-skyline-buildings.webp',
            alt: '圖庫天際線',
            caption: '諮詢空間',
            tags: ['辦公室'],
          },
          {
            src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
            alt: '圖庫法律文章',
            caption: '企業法務',
            tags: ['服務'],
          },
          {
            src: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
            alt: '圖庫訴訟文章',
            caption: '爭議解決',
            tags: ['案例'],
          },
          {
            src: '/images/team/son-jungmin.jpg',
            alt: '圖庫律師',
            caption: '韓語諮詢',
            tags: ['團隊'],
          },
        ],
        all: '全部',
        previous: '上一張圖庫圖片',
        next: '下一張圖庫圖片',
        goTo: (index) => `前往圖庫圖片 ${index + 1}`,
        selectThumbnail: (index) => `選取縮圖 ${index + 1}`,
        lightboxLabel: '圖庫圖片',
        lightboxClose: '關閉',
        lightboxPrevious: '上一張圖片',
        lightboxNext: '下一張圖片',
        layoutOptions: {
          grid: '格狀',
          masonry: '拼貼',
          slider: '滑桿',
          slideshow: '投影片',
          thumbnail: '縮圖',
          pro: '專業圖庫',
        },
        proStyleOptions: { clean: '簡潔', mosaic: '馬賽克', editorial: '編輯式' },
        thumbnailOptions: { bottom: '下方', right: '右側' },
      },
    };
  }
  return {
    container: {
      label: 'Label',
      padding: 'Padding',
      cardVariant: 'Card variant',
      clickLink: 'Click Link',
      layoutMode: 'Layout Mode',
      layoutItems: 'Layout Items',
      layoutItemsHint: 'title | description | image',
      activeIndex: 'Active index',
      anchorSticky: 'Anchor / Sticky',
      anchorTarget: 'Anchor target',
      anchorTargetPlaceholder: 'services',
      stickyLabel: 'Sticky on published page',
      hoverContentFallback: 'Hover content',
      flexSettings: 'Flex Settings',
      direction: 'Direction',
      wrap: 'Wrap',
      justifyContent: 'Justify Content',
      alignItems: 'Align Items',
      gap: 'Gap',
      gridSettings: 'Grid Settings',
      columns: 'Columns',
      rows: 'Rows',
      columnGap: 'Column Gap',
      rowGap: 'Row Gap',
      layoutModes: {
        absolute: 'Absolute (default)',
        flex: 'Flex',
        grid: 'Grid',
        strip: 'Strip',
        box: 'Box',
        columns: 'Columns',
        repeater: 'Repeater',
        tabs: 'Tabs',
        accordion: 'Accordion',
        slideshow: 'Slideshow container',
        hoverBox: 'Hover box',
      },
      flexDirection: { row: 'Row', column: 'Column' },
      flexWrap: { wrap: 'Wrap', nowrap: 'No Wrap' },
      flexJustify: {
        'flex-start': 'Start',
        center: 'Center',
        'flex-end': 'End',
        'space-between': 'Space Between',
        'space-around': 'Space Around',
        'space-evenly': 'Space Evenly',
      },
      flexAlign: { 'flex-start': 'Start', center: 'Center', 'flex-end': 'End', stretch: 'Stretch' },
      cardVariants: cardVariants(locale),
    },
    gallery: {
      layout: 'Layout',
      columns: 'Columns',
      gap: 'Gap',
      captionMode: 'Caption mode',
      below: 'Below',
      overlay: 'Overlay',
      showCaptions: 'Show captions',
      filter: 'Filter',
      proStyle: 'Pro style',
      autoplay: 'Autoplay',
      interval: 'Interval',
      thumbnailPosition: 'Thumbnail position',
      images: 'Images',
      addImage: 'Add image',
      removeImage: 'Remove',
      imageUrl: 'Image URL',
      altText: 'Alt text',
      caption: 'Caption',
      tags: 'Tags',
      fallbackImages: [
        {
          src: '/images/header-skyline-buildings.webp',
          alt: 'Gallery skyline',
          caption: 'Consultation space',
          tags: ['office'],
        },
        {
          src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
          alt: 'Gallery legal article',
          caption: 'Corporate legal services',
          tags: ['service'],
        },
        {
          src: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
          alt: 'Gallery litigation article',
          caption: 'Dispute resolution',
          tags: ['case'],
        },
        {
          src: '/images/team/son-jungmin.jpg',
          alt: 'Gallery attorney',
          caption: 'Korean-language consultation',
          tags: ['team'],
        },
      ],
      all: 'All',
      previous: 'Previous gallery image',
      next: 'Next gallery image',
      goTo: (index) => `Go to gallery image ${index + 1}`,
      selectThumbnail: (index) => `Select thumbnail ${index + 1}`,
      lightboxLabel: 'Gallery image',
      lightboxClose: 'Close',
      lightboxPrevious: 'Previous image',
      lightboxNext: 'Next image',
      layoutOptions: {
        grid: 'Grid',
        masonry: 'Masonry',
        slider: 'Slider',
        slideshow: 'Slideshow',
        thumbnail: 'Thumbnail',
        pro: 'Pro gallery',
      },
      proStyleOptions: { clean: 'Clean', mosaic: 'Mosaic', editorial: 'Editorial' },
      thumbnailOptions: { bottom: 'Bottom', right: 'Right' },
    },
  };
}
