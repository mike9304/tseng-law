import type { BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import {
  BUILDER_RICH_TEXT_FORMAT,
  type BuilderRichText,
  type TipTapDocJson,
} from '@/lib/builder/rich-text/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';

export type TextWidgetKind = Extract<BuilderCanvasNodeKind, 'text' | 'heading'>;
export type MediaWidgetKind = Extract<BuilderCanvasNodeKind, 'image' | 'video' | 'video-embed' | 'audio' | 'lottie' | 'icon'>;
export type GalleryWidgetKind = Extract<BuilderCanvasNodeKind, 'gallery'>;
export type LayoutWidgetKind = Extract<BuilderCanvasNodeKind, 'container'>;
export type InteractiveWidgetKind = Extract<
  BuilderCanvasNodeKind,
  'countdown' | 'progress' | 'rating' | 'notification-bar' | 'back-to-top' | 'button'
>;
export type NavigationWidgetKind = Extract<BuilderCanvasNodeKind, 'menu-bar' | 'anchor-menu' | 'breadcrumbs'>;
export type SocialWidgetKind = Extract<BuilderCanvasNodeKind, 'social-bar' | 'share-buttons' | 'social-embed' | 'floating-chat'>;
export type LocationWidgetKind = Extract<BuilderCanvasNodeKind, 'address-block' | 'business-hours' | 'multi-location-map' | 'map'>;
export type DecorativeWidgetKind = Extract<BuilderCanvasNodeKind, 'shape' | 'pattern' | 'parallax-bg' | 'frame' | 'sticker' | 'divider' | 'spacer'>;
export type DesignerWidgetKind = Extract<
  BuilderCanvasNodeKind,
  | 'counter'
  | 'testimonial-carousel'
  | 'pricing-table'
  | 'comparison-table'
  | 'timeline'
  | 'team-member-card'
  | 'service-feature-card'
>;

export interface TextWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: TextWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface MediaWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: MediaWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface GalleryWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: GalleryWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface LayoutWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: LayoutWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface InteractiveWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: InteractiveWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface NavigationWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: NavigationWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface SocialWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: SocialWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface LocationWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: LocationWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface DecorativeWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: DecorativeWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface DesignerWidgetPreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  kind: DesignerWidgetKind;
  width: number;
  height: number;
  content: Record<string, unknown>;
  style?: Record<string, unknown>;
}

function richTextFromDoc(plainText: string, doc: TipTapDocJson): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    doc,
    plainText,
  };
}

function inlineMarksRichText(): BuilderRichText {
  const plainText = '굵게, 기울임, 밑줄, 링크가 섞인 텍스트';
  return richTextFromDoc(plainText, {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '굵게', marks: [{ type: 'bold' }] },
          { type: 'text', text: ', ' },
          { type: 'text', text: '기울임', marks: [{ type: 'italic' }] },
          { type: 'text', text: ', ' },
          { type: 'text', text: '밑줄', marks: [{ type: 'underline' }] },
          { type: 'text', text: ', ' },
          {
            type: 'text',
            text: '링크',
            marks: [{ type: 'link', attrs: { href: '/ko/contact', target: '_self' } }],
          },
          { type: 'text', text: '가 섞인 텍스트' },
        ],
      },
    ],
  });
}

function quoteRichText(): BuilderRichText {
  const plainText = '복잡한 사건일수록 전략은 더 단순하고 선명해야 합니다.';
  return richTextFromDoc(plainText, {
    type: 'doc',
    content: [
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: plainText }],
          },
        ],
      },
    ],
  });
}

function listRichText(): BuilderRichText {
  const items = ['상담 예약', '사건 검토', '전략 수립', '진행 상황 공유'];
  return richTextFromDoc(items.join('\n'), {
    type: 'doc',
    content: [
      {
        type: 'bulletList',
        content: items.map((item) => ({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: item }],
            },
          ],
        })),
      },
    ],
  });
}

export const TEXT_WIDGET_PRESETS: TextWidgetPreset[] = [
  {
    id: 'heading-h1-h6',
    label: 'Heading H1-H6',
    description: '레벨 전환 가능한 대제목',
    icon: 'H1',
    kind: 'heading',
    width: 520,
    height: 96,
    content: {
      text: '승소 전략을 설계하는 법률 파트너',
      richText: richTextFromPlainText('승소 전략을 설계하는 법률 파트너'),
      level: 1,
      themePreset: 'title1',
    },
  },
  {
    id: 'rich-text',
    label: 'Rich text',
    description: '인라인 서식과 링크 포함',
    icon: 'RT',
    kind: 'text',
    width: 420,
    height: 96,
    content: {
      ...(() => {
        const richText = inlineMarksRichText();
        return { text: richText.plainText, richText };
      })(),
      fontSize: 18,
      lineHeight: 1.55,
    },
  },
  {
    id: 'inspector-rte',
    label: 'Inspector RTE',
    description: '사이드 패널에서 서식 전환',
    icon: '¶',
    kind: 'text',
    width: 360,
    height: 120,
    content: {
      text: '본문을 선택하고 Inspector에서 컬럼, 인용, 링크, 마키를 조정하세요.',
      richText: richTextFromPlainText('본문을 선택하고 Inspector에서 컬럼, 인용, 링크, 마키를 조정하세요.'),
      themePreset: 'body',
      lineHeight: 1.6,
    },
  },
  {
    id: 'text-on-path',
    label: 'Text on path',
    description: '아치/웨이브 곡선 텍스트',
    icon: '⌒',
    kind: 'text',
    width: 520,
    height: 120,
    content: {
      text: 'Hojung Law Group',
      richText: richTextFromPlainText('Hojung Law Group'),
      fontSize: 28,
      fontWeight: 'bold',
      align: 'center',
      textPath: { enabled: true, curve: 'arc', baseline: 62 },
    },
  },
  {
    id: 'multi-column',
    label: 'Multi-column',
    description: '2~4단 긴 본문',
    icon: '2C',
    kind: 'text',
    width: 520,
    height: 180,
    content: {
      text: '칼럼 아카이브와 주요 서비스 설명처럼 긴 본문을 여러 단으로 나누어 읽기 쉽게 배치합니다. 사용자는 컬럼 수와 간격을 Inspector에서 바로 바꿀 수 있습니다.',
      richText: richTextFromPlainText('칼럼 아카이브와 주요 서비스 설명처럼 긴 본문을 여러 단으로 나누어 읽기 쉽게 배치합니다. 사용자는 컬럼 수와 간격을 Inspector에서 바로 바꿀 수 있습니다.'),
      columns: 2,
      columnGap: 28,
      fontSize: 16,
      lineHeight: 1.65,
    },
  },
  {
    id: 'quote',
    label: 'Quote',
    description: '인용문 블록',
    icon: '“”',
    kind: 'text',
    width: 460,
    height: 132,
    content: {
      ...(() => {
        const richText = quoteRichText();
        return { text: richText.plainText, richText };
      })(),
      themePreset: 'quote',
      quoteStyle: 'classic',
    },
  },
  {
    id: 'list',
    label: 'List',
    description: '불릿/단계형 목록',
    icon: '•',
    kind: 'text',
    width: 360,
    height: 150,
    content: {
      ...(() => {
        const richText = listRichText();
        return { text: richText.plainText, richText };
      })(),
      fontSize: 17,
      lineHeight: 1.6,
    },
  },
  {
    id: 'marquee',
    label: 'Marquee',
    description: '움직이는 공지 텍스트',
    icon: '↔',
    kind: 'text',
    width: 520,
    height: 48,
    content: {
      text: '무료 상담 예약 가능 · 한국어/영어 상담 · 긴급 사건 대응',
      richText: richTextFromPlainText('무료 상담 예약 가능 · 한국어/영어 상담 · 긴급 사건 대응'),
      fontSize: 18,
      fontWeight: 'medium',
      marquee: { enabled: true, speed: 18, direction: 'left' },
    },
  },
  {
    id: 'typography-preset',
    label: 'Typography preset',
    description: '테마 프리셋 연결',
    icon: 'Aa',
    kind: 'text',
    width: 420,
    height: 86,
    content: {
      text: 'Theme preset text',
      richText: richTextFromPlainText('Theme preset text'),
      themePreset: 'title2',
    },
  },
  {
    id: 'link-text',
    label: 'Link text',
    description: '페이지/앵커/외부 링크',
    icon: '🔗',
    kind: 'text',
    width: 280,
    height: 52,
    content: {
      text: '상담 예약으로 이동',
      richText: richTextFromPlainText('상담 예약으로 이동'),
      fontSize: 18,
      fontWeight: 'bold',
      color: { kind: 'token', token: 'primary' },
      link: { href: '/ko/contact', target: '_self' },
    },
  },
  {
    id: 'designer-eyebrow-label',
    label: 'Designer eyebrow',
    description: '섹션 상단용 작은 라벨',
    icon: 'EY',
    kind: 'text',
    width: 320,
    height: 36,
    content: {
      text: 'LEGAL STRATEGY',
      richText: richTextFromPlainText('LEGAL STRATEGY'),
      fontSize: 13,
      fontWeight: 'bold',
      color: '#9f6b2c',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      textTransform: 'uppercase',
    },
  },
  {
    id: 'designer-editorial-title',
    label: 'Editorial title',
    description: '잡지형 큰 제목',
    icon: 'ET',
    kind: 'heading',
    width: 640,
    height: 150,
    content: {
      text: '국제 사건을 읽는 더 정교한 관점',
      richText: richTextFromPlainText('국제 사건을 읽는 더 정교한 관점'),
      level: 2,
      themePreset: 'title1',
      fontSize: 54,
      lineHeight: 1.05,
      color: '#111827',
    },
  },
  {
    id: 'designer-pull-quote-panel',
    label: 'Pull quote panel',
    description: '강조 인용 패널',
    icon: 'PQ',
    kind: 'text',
    width: 560,
    height: 160,
    content: {
      text: '중요한 의사결정은 정보의 양보다 구조의 선명도에서 시작됩니다.',
      richText: richTextFromPlainText('중요한 의사결정은 정보의 양보다 구조의 선명도에서 시작됩니다.'),
      themePreset: 'quote',
      quoteStyle: 'pull',
      fontSize: 26,
      lineHeight: 1.38,
      color: '#0f172a',
      backgroundColor: 'rgba(250, 245, 235, 0.92)',
    },
    style: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(160, 116, 58, 0.24)',
      shadowY: 18,
      shadowBlur: 44,
      shadowColor: 'rgba(86, 61, 34, 0.14)',
    },
  },
];

const MEDIA_IMAGE_A = '/images/header-skyline-buildings.webp';
const MEDIA_IMAGE_B = '/images/header-skyline-buildings.png';
const MEDIA_BLOG_IMAGE = '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg';
const PLACEHOLDER_IMAGE_SRC = '/images/placeholder-image.svg';

export const MEDIA_WIDGET_PRESETS: MediaWidgetPreset[] = [
  {
    id: 'lightbox-trigger',
    label: 'Lightbox image',
    description: '클릭하면 전체 화면 이미지',
    icon: 'LB',
    kind: 'image',
    width: 360,
    height: 240,
    content: {
      src: MEDIA_IMAGE_A,
      alt: 'Lightbox skyline image',
      clickAction: 'lightbox',
    },
  },
  {
    id: 'image-hotspots',
    label: 'Image hotspots',
    description: '이미지 위 포인트와 툴팁',
    icon: 'HS',
    kind: 'image',
    width: 420,
    height: 260,
    content: {
      src: MEDIA_BLOG_IMAGE,
      alt: 'Hotspot article image',
      hotspots: [
        { x: 30, y: 42, label: '상담 포인트', href: '/ko/contact' },
        { x: 68, y: 58, label: '증거 자료' },
      ],
    },
  },
  {
    id: 'before-after',
    label: 'Before / After',
    description: '비교 슬라이더',
    icon: 'BA',
    kind: 'image',
    width: 420,
    height: 260,
    content: {
      src: MEDIA_IMAGE_A,
      alt: 'Before after compare',
      compare: {
        enabled: true,
        beforeSrc: MEDIA_IMAGE_A,
        afterSrc: MEDIA_IMAGE_B,
        position: 52,
      },
    },
  },
  {
    id: 'hover-swap',
    label: 'Hover swap',
    description: '마우스 오버 이미지 전환',
    icon: 'HS',
    kind: 'image',
    width: 360,
    height: 230,
    content: {
      src: MEDIA_IMAGE_A,
      alt: 'Hover swap image',
      hoverSrc: MEDIA_IMAGE_B,
    },
  },
  {
    id: 'image-click-action',
    label: 'Image click action',
    description: '링크/팝업/라이트박스 전환',
    icon: 'CA',
    kind: 'image',
    width: 320,
    height: 220,
    content: {
      src: MEDIA_BLOG_IMAGE,
      alt: 'Clickable legal article image',
      clickAction: 'link',
      link: { href: '/ko/column', target: '_self' },
    },
  },
  {
    id: 'inline-svg-color',
    label: 'Inline SVG',
    description: '색상 편집 가능한 SVG',
    icon: 'SVG',
    kind: 'image',
    width: 180,
    height: 180,
    content: {
      src: PLACEHOLDER_IMAGE_SRC,
      alt: 'Editable SVG scales',
      svg: {
        enabled: true,
        name: 'scales',
        color: { kind: 'token', token: 'primary' },
      },
    },
  },
  {
    id: 'image-editorial-portrait',
    label: 'Editorial portrait',
    description: '인물/프로필용 고급 크롭',
    icon: 'EP',
    kind: 'image',
    width: 340,
    height: 430,
    content: {
      src: '/images/team/son-jungmin.jpg',
      alt: 'Editorial attorney portrait',
      fit: 'cover',
      cropAspect: '4:5',
      focalPoint: { x: 50, y: 28 },
      filters: { brightness: 104, contrast: 108, saturation: 92, blur: 0, grayscale: 0, sepia: 8 },
    },
    style: {
      borderRadius: 8,
      shadowY: 20,
      shadowBlur: 42,
      shadowColor: 'rgba(15, 23, 42, 0.18)',
    },
  },
  {
    id: 'image-hero-cinematic',
    label: 'Cinematic hero image',
    description: '히어로 배경용 와이드 이미지',
    icon: '16',
    kind: 'image',
    width: 720,
    height: 360,
    content: {
      src: MEDIA_IMAGE_A,
      alt: 'Cinematic office skyline image',
      fit: 'cover',
      cropAspect: '16:9',
      focalPoint: { x: 50, y: 46 },
      filters: { brightness: 94, contrast: 118, saturation: 86, blur: 0, grayscale: 0, sepia: 12 },
    },
    style: {
      borderRadius: 8,
      shadowY: 22,
      shadowBlur: 54,
      shadowColor: 'rgba(15, 23, 42, 0.2)',
    },
  },
  {
    id: 'lottie-animation',
    label: 'Lottie animation',
    description: 'Lottie URL/속도/루프',
    icon: 'LO',
    kind: 'lottie',
    width: 260,
    height: 220,
    content: {
      label: 'Consultation motion',
      autoplay: true,
      loop: true,
      speed: 1,
    },
  },
  {
    id: 'mp4-video-box',
    label: 'MP4 video box',
    description: '업로드 MP4용 비디오 박스',
    icon: 'MP4',
    kind: 'video',
    width: 420,
    height: 236,
    content: {
      url: '',
      thumbnail: MEDIA_IMAGE_A,
      controls: true,
      mode: 'box',
    },
  },
  {
    id: 'youtube-embed',
    label: 'YouTube embed',
    description: '커스텀 YouTube 래퍼',
    icon: 'YT',
    kind: 'video-embed',
    width: 480,
    height: 270,
    content: {
      provider: 'youtube',
      src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      controls: true,
    },
  },
  {
    id: 'vimeo-embed',
    label: 'Vimeo embed',
    description: 'Vimeo URL/ID 지원',
    icon: 'VM',
    kind: 'video-embed',
    width: 480,
    height: 270,
    content: {
      provider: 'vimeo',
      src: 'https://vimeo.com/76979871',
      controls: true,
    },
  },
  {
    id: 'video-background',
    label: 'Video background',
    description: '섹션 배경용 영상',
    icon: 'BG',
    kind: 'video',
    width: 560,
    height: 315,
    content: {
      url: '/videos/builder-background.mp4',
      thumbnail: MEDIA_IMAGE_A,
      autoplay: true,
      loop: true,
      muted: true,
      controls: false,
      mode: 'background',
    },
  },
  {
    id: 'audio-player',
    label: 'Audio player',
    description: '파일 오디오 플레이어',
    icon: 'AU',
    kind: 'audio',
    width: 360,
    height: 150,
    content: {
      provider: 'file',
      src: '',
      title: '상담 안내 오디오',
      artist: 'Hojung Law',
      controls: true,
    },
  },
  {
    id: 'spotify-soundcloud',
    label: 'Spotify / SoundCloud',
    description: '음원 임베드 전환',
    icon: 'SP',
    kind: 'audio',
    width: 420,
    height: 170,
    content: {
      provider: 'spotify',
      src: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
      title: 'Podcast embed',
      artist: 'Spotify',
    },
  },
  {
    id: 'gif-giphy',
    label: 'GIF / Giphy',
    description: 'GIF URL과 검색 메모',
    icon: 'GIF',
    kind: 'image',
    width: 300,
    height: 220,
    content: {
      src: MEDIA_IMAGE_A,
      alt: 'GIF placeholder',
      gif: { provider: 'giphy', query: 'law office' },
    },
  },
  {
    id: 'icon-library',
    label: 'Icon library',
    description: 'Lucide/FontAwesome 세트',
    icon: 'IC',
    kind: 'icon',
    width: 96,
    height: 96,
    content: {
      name: 'scale',
      set: 'lucide',
      size: 58,
      color: { kind: 'token', token: 'primary' },
    },
  },
];

const GALLERY_SAMPLE_IMAGES = [
  {
    src: MEDIA_IMAGE_A,
    alt: 'Office skyline',
    caption: '호정국제 상담 공간',
    tags: ['office', 'featured'],
  },
  {
    src: MEDIA_BLOG_IMAGE,
    alt: 'Company law article',
    caption: '기업 법무 자료',
    tags: ['service'],
  },
  {
    src: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
    alt: 'Litigation article',
    caption: '분쟁 해결 케이스',
    tags: ['case', 'featured'],
  },
  {
    src: '/images/team/son-jungmin.jpg',
    alt: 'Korean attorney',
    caption: '한국어 상담',
    tags: ['team'],
  },
  {
    src: '/images/blog/016-taiwan-inheritance-custody-analysis/featured-01.jpg',
    alt: 'Family law article',
    caption: '가사/상속 분석',
    tags: ['service'],
  },
  {
    src: '/images/blog/017-taiwan-logistics-business-setup/featured-01.jpg',
    alt: 'Business setup article',
    caption: '대만 사업 설립',
    tags: ['business'],
  },
];

export const GALLERY_WIDGET_PRESETS: GalleryWidgetPreset[] = [
  {
    id: 'gallery-grid',
    label: 'Grid gallery',
    description: '균일 이미지 격자',
    icon: 'GR',
    kind: 'gallery',
    width: 620,
    height: 360,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'grid',
      columns: 3,
      gap: 10,
      showCaptions: false,
    },
  },
  {
    id: 'gallery-masonry',
    label: 'Masonry gallery',
    description: '높이가 다른 자연 배치',
    icon: 'MS',
    kind: 'gallery',
    width: 620,
    height: 420,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'masonry',
      columns: 3,
      gap: 12,
      showCaptions: true,
      captionMode: 'overlay',
    },
  },
  {
    id: 'gallery-slider',
    label: 'Slider gallery',
    description: '화살표와 페이지네이션',
    icon: 'SL',
    kind: 'gallery',
    width: 560,
    height: 315,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'slider',
      columns: 1,
      gap: 8,
      autoplay: false,
    },
  },
  {
    id: 'gallery-slideshow',
    label: 'Slideshow',
    description: '풀블리드 자동 슬라이드',
    icon: 'SS',
    kind: 'gallery',
    width: 720,
    height: 380,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'slideshow',
      columns: 1,
      gap: 0,
      autoplay: true,
      interval: 3500,
      showCaptions: true,
      captionMode: 'overlay',
    },
  },
  {
    id: 'gallery-thumbnail',
    label: 'Thumbnail gallery',
    description: '썸네일 네비 + 큰 이미지',
    icon: 'TN',
    kind: 'gallery',
    width: 620,
    height: 390,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'thumbnail',
      columns: 1,
      gap: 10,
      thumbnailPosition: 'bottom',
      showCaptions: true,
      captionMode: 'overlay',
    },
  },
  {
    id: 'gallery-pro',
    label: 'Pro gallery',
    description: 'Wix pro-like 모자이크',
    icon: 'PG',
    kind: 'gallery',
    width: 700,
    height: 420,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'pro',
      columns: 4,
      gap: 10,
      proStyle: 'mosaic',
      showCaptions: true,
      captionMode: 'overlay',
    },
  },
  {
    id: 'gallery-caption-overlay',
    label: 'Caption overlay',
    description: '이미지별 캡션 오버레이',
    icon: 'CO',
    kind: 'gallery',
    width: 560,
    height: 340,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'grid',
      columns: 2,
      gap: 12,
      showCaptions: true,
      captionMode: 'overlay',
    },
  },
  {
    id: 'gallery-filter',
    label: 'Filtered gallery',
    description: '태그 필터 pill 표시',
    icon: 'FT',
    kind: 'gallery',
    width: 620,
    height: 380,
    content: {
      images: GALLERY_SAMPLE_IMAGES,
      layout: 'grid',
      columns: 3,
      gap: 10,
      activeFilter: 'featured',
      showCaptions: true,
      captionMode: 'below',
    },
  },
];

const LAYOUT_ITEMS = [
  { title: '상담 예약', description: '방문 전 사건 요지를 정리합니다.', image: MEDIA_IMAGE_A },
  { title: '사건 검토', description: '자료와 쟁점을 구조화합니다.', image: MEDIA_BLOG_IMAGE },
  { title: '전략 수립', description: '절차와 비용, 가능성을 안내합니다.', image: MEDIA_IMAGE_B },
  { title: '진행 공유', description: '단계별 변화를 투명하게 공유합니다.', image: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg' },
];

export const LAYOUT_WIDGET_PRESETS: LayoutWidgetPreset[] = [
  {
    id: 'layout-strip',
    label: 'Strip',
    description: '전폭 섹션 밴드',
    icon: 'ST',
    kind: 'container',
    width: 960,
    height: 180,
    content: {
      label: 'Strip',
      layoutMode: 'strip',
      background: 'rgba(17, 109, 255, 0.08)',
      borderWidth: 0,
      borderRadius: 0,
      padding: 28,
    },
  },
  {
    id: 'layout-box',
    label: 'Box',
    description: '카드형 박스',
    icon: 'BX',
    kind: 'container',
    width: 360,
    height: 240,
    content: {
      label: 'Box',
      layoutMode: 'box',
      background: '#ffffff',
      borderColor: '#dbe2ea',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 18,
      padding: 24,
      variant: 'elevated',
    },
  },
  {
    id: 'layout-columns',
    label: 'Columns 2/3/4',
    description: '반응형 컬럼 프레임',
    icon: 'CL',
    kind: 'container',
    width: 760,
    height: 260,
    content: {
      label: 'Columns',
      layoutMode: 'columns',
      background: 'rgba(248, 250, 252, 0.96)',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#cbd5e1',
      borderRadius: 16,
      padding: 18,
      flexConfig: { direction: 'row', wrap: true, justifyContent: 'space-between', alignItems: 'stretch', gap: 16 },
      layoutItems: LAYOUT_ITEMS.slice(0, 3),
    },
  },
  {
    id: 'layout-repeater',
    label: 'Repeater',
    description: '반복 카드 데이터',
    icon: 'RP',
    kind: 'container',
    width: 720,
    height: 260,
    content: {
      label: 'Repeater',
      layoutMode: 'repeater',
      background: 'rgba(248, 250, 252, 0.96)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#e2e8f0',
      borderRadius: 16,
      padding: 16,
      layoutItems: LAYOUT_ITEMS.slice(0, 3),
    },
  },
  {
    id: 'layout-tabs',
    label: 'Tabs',
    description: '탭 전환 패널',
    icon: 'TB',
    kind: 'container',
    width: 560,
    height: 240,
    content: {
      label: 'Tabs',
      layoutMode: 'tabs',
      background: '#ffffff',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dbe2ea',
      borderRadius: 16,
      padding: 18,
      activeIndex: 0,
      layoutItems: LAYOUT_ITEMS.slice(0, 3),
    },
  },
  {
    id: 'layout-accordion',
    label: 'Accordion',
    description: '펼침형 정보 블록',
    icon: 'AC',
    kind: 'container',
    width: 520,
    height: 300,
    content: {
      label: 'Accordion',
      layoutMode: 'accordion',
      background: 'rgba(248, 250, 252, 0.96)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dbe2ea',
      borderRadius: 16,
      padding: 16,
      activeIndex: 1,
      layoutItems: LAYOUT_ITEMS.slice(0, 4),
    },
  },
  {
    id: 'layout-slideshow-container',
    label: 'Slideshow container',
    description: '콘텐츠 슬라이드 프레임',
    icon: 'SC',
    kind: 'container',
    width: 620,
    height: 320,
    content: {
      label: 'Slideshow container',
      layoutMode: 'slideshow',
      background: '#0f172a',
      borderWidth: 0,
      borderRadius: 18,
      padding: 0,
      activeIndex: 0,
      layoutItems: LAYOUT_ITEMS,
    },
  },
  {
    id: 'layout-hover-box',
    label: 'Hover box',
    description: 'hover 상태 카드',
    icon: 'HB',
    kind: 'container',
    width: 340,
    height: 220,
    content: {
      label: 'Hover box',
      layoutMode: 'hoverBox',
      background: '#ffffff',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dbe2ea',
      borderRadius: 18,
      padding: 0,
      layoutItems: [LAYOUT_ITEMS[0]],
    },
  },
  {
    id: 'layout-sticky-anchor',
    label: 'Sticky / Anchor',
    description: '고정/앵커 타깃',
    icon: 'AN',
    kind: 'container',
    width: 520,
    height: 86,
    content: {
      label: 'Sticky anchor',
      layoutMode: 'flex',
      background: '#ffffff',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#dbe2ea',
      borderRadius: 999,
      padding: 14,
      sticky: true,
      anchorTarget: 'services',
      flexConfig: { direction: 'row', wrap: false, justifyContent: 'space-around', alignItems: 'center', gap: 12 },
    },
  },
  {
    id: 'layout-grid',
    label: 'Grid layout',
    description: 'CSS grid frame',
    icon: 'GD',
    kind: 'container',
    width: 620,
    height: 340,
    content: {
      label: 'Grid layout',
      layoutMode: 'grid',
      background: 'rgba(248, 250, 252, 0.96)',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#cbd5e1',
      borderRadius: 16,
      padding: 18,
      gridConfig: { columns: 3, rows: 2, columnGap: 14, rowGap: 14 },
    },
  },
  {
    id: 'designer-trust-bento',
    label: 'Designer bento',
    description: '신뢰 포인트 3단 카드',
    icon: 'DB',
    kind: 'container',
    width: 780,
    height: 300,
    content: {
      label: 'Designer bento',
      layoutMode: 'repeater',
      background: '#f7f3ed',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(134, 96, 56, 0.18)',
      borderRadius: 8,
      padding: 18,
      variant: 'editorial',
      layoutItems: [
        { title: 'Cross-border', description: '한국어와 중국어 맥락을 함께 읽는 사건 검토', image: MEDIA_IMAGE_A },
        { title: 'Evidence first', description: '자료 구조화 후 절차와 리스크를 분리해 판단', image: MEDIA_BLOG_IMAGE },
        { title: 'Clear updates', description: '단계별 진행 상황과 다음 액션을 명확히 공유', image: MEDIA_IMAGE_B },
      ],
    },
  },
  {
    id: 'designer-process-accordion',
    label: 'Process accordion',
    description: '상담 프로세스 패널',
    icon: 'PA',
    kind: 'container',
    width: 560,
    height: 320,
    content: {
      label: 'Process accordion',
      layoutMode: 'accordion',
      background: '#ffffff',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#e5ded4',
      borderRadius: 8,
      padding: 16,
      activeIndex: 0,
      variant: 'elevated',
      layoutItems: [
        { title: '1. Intake', description: '상담 전 사실관계와 긴급도를 먼저 정리합니다.' },
        { title: '2. Strategy', description: '법적 쟁점, 비용, 일정, 선택지를 한 화면에 압축합니다.' },
        { title: '3. Execution', description: '진행 중 필요한 문서와 연락 흐름을 지속적으로 관리합니다.' },
      ],
    },
  },
  {
    id: 'designer-story-slideshow',
    label: 'Story slideshow',
    description: '이미지 오버레이 스토리',
    icon: 'SS',
    kind: 'container',
    width: 700,
    height: 360,
    content: {
      label: 'Story slideshow',
      layoutMode: 'slideshow',
      background: '#111827',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: 8,
      padding: 0,
      activeIndex: 0,
      layoutItems: [
        { title: '기업 법무', description: '설립부터 분쟁 예방까지 한 흐름으로 설계합니다.', image: MEDIA_IMAGE_A },
        { title: '가사·상속', description: '감정과 증거를 분리해 실행 가능한 전략을 만듭니다.', image: '/images/blog/016-taiwan-inheritance-custody-analysis/featured-01.jpg' },
        { title: '소송 대응', description: '쟁점표와 타임라인으로 사건의 방향을 선명하게 만듭니다.', image: '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg' },
      ],
    },
  },
];

export const INTERACTIVE_WIDGET_PRESETS: InteractiveWidgetPreset[] = [
  {
    id: 'interactive-countdown-card',
    label: 'Countdown card',
    description: '카드형 카운트다운',
    icon: 'CD',
    kind: 'countdown',
    width: 360,
    height: 140,
    content: {
      label: '오픈까지',
      targetAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      variant: 'card',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
    },
  },
  {
    id: 'interactive-countdown-compact',
    label: 'Countdown compact',
    description: '컴팩트 카운트다운',
    icon: 'CC',
    kind: 'countdown',
    width: 260,
    height: 60,
    content: {
      label: '마감',
      targetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      variant: 'compact',
      showDays: false,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
    },
  },
  {
    id: 'interactive-progress-bar',
    label: 'Progress bar',
    description: '진행 바',
    icon: 'PB',
    kind: 'progress',
    width: 320,
    height: 70,
    content: {
      label: '진행률',
      value: 60,
      showPercent: true,
      variant: 'bar',
      color: '#1d4ed8',
      trackColor: '#e2e8f0',
    },
  },
  {
    id: 'interactive-progress-ring',
    label: 'Progress ring',
    description: '원형 진행률',
    icon: 'PR',
    kind: 'progress',
    width: 180,
    height: 180,
    content: {
      label: '진행률',
      value: 72,
      showPercent: true,
      variant: 'ring',
      color: '#10b981',
      trackColor: '#e2e8f0',
    },
  },
  {
    id: 'interactive-progress-segments',
    label: 'Progress segments',
    description: '세그먼트 진행률',
    icon: 'PS',
    kind: 'progress',
    width: 320,
    height: 80,
    content: {
      label: '단계',
      value: 50,
      showPercent: false,
      variant: 'segments',
      color: '#0f172a',
      trackColor: '#e2e8f0',
    },
  },
  {
    id: 'interactive-rating-stars',
    label: 'Star rating',
    description: '별점 (5/5)',
    icon: '★',
    kind: 'rating',
    width: 260,
    height: 80,
    content: {
      label: '의뢰인 만족도',
      value: 4.8,
      max: 5,
      showValue: true,
      color: '#f59e0b',
      variant: 'stars',
    },
  },
  {
    id: 'interactive-rating-hearts',
    label: 'Heart rating',
    description: '하트 평점',
    icon: '♥',
    kind: 'rating',
    width: 260,
    height: 80,
    content: {
      label: '추천도',
      value: 4.2,
      max: 5,
      showValue: true,
      color: '#ef4444',
      variant: 'hearts',
    },
  },
  {
    id: 'interactive-notification-bar-info',
    label: 'Notification bar',
    description: '상단 공지 바',
    icon: 'NB',
    kind: 'notification-bar',
    width: 720,
    height: 56,
    content: {
      message: '한국·대만 자문 신규 시간대를 추가했습니다.',
      ctaLabel: '자세히',
      ctaHref: '/ko/contact',
      dismissable: true,
      tone: 'info',
      position: 'top',
    },
  },
  {
    id: 'interactive-notification-bar-warning',
    label: 'Notice bar (warning)',
    description: '경고 톤 바',
    icon: 'NW',
    kind: 'notification-bar',
    width: 720,
    height: 56,
    content: {
      message: '추석 연휴 동안 일부 상담 시간이 제한됩니다.',
      ctaLabel: '일정 확인',
      ctaHref: '',
      dismissable: true,
      tone: 'warning',
      position: 'top',
    },
  },
  {
    id: 'interactive-back-to-top',
    label: 'Back to top',
    description: '맨 위로 버튼',
    icon: '↑',
    kind: 'back-to-top',
    width: 72,
    height: 72,
    content: {
      label: '맨 위로',
      showAfterPx: 400,
      icon: 'arrow-up',
      placement: 'bottom-right',
      variant: 'circle',
    },
  },
  {
    id: 'interactive-popup-trigger',
    label: 'Popup trigger',
    description: 'popup:slug 트리거 버튼',
    icon: 'PU',
    kind: 'button',
    width: 180,
    height: 44,
    content: {
      label: '팝업 열기',
      href: 'popup:welcome',
      variant: 'primary',
    },
  },
  {
    id: 'interactive-lightbox-trigger',
    label: 'Lightbox trigger',
    description: 'lightbox:slug 트리거 버튼',
    icon: 'LB',
    kind: 'button',
    width: 200,
    height: 44,
    content: {
      label: '라이트박스 열기',
      href: 'lightbox:welcome',
      variant: 'secondary',
    },
  },
  {
    id: 'interactive-cookie-consent-open',
    label: 'Cookie settings',
    description: 'cookie-consent:open 트리거',
    icon: 'CK',
    kind: 'button',
    width: 200,
    height: 44,
    content: {
      label: '쿠키 설정',
      href: 'cookie-consent:open',
      variant: 'ghost',
    },
  },
];

export const NAVIGATION_WIDGET_PRESETS: NavigationWidgetPreset[] = [
  {
    id: 'nav-menu-horizontal',
    label: 'Horizontal menu',
    description: '가로 메뉴 바',
    icon: 'MH',
    kind: 'menu-bar',
    width: 560,
    height: 56,
    content: { orientation: 'horizontal', variant: 'plain' },
  },
  {
    id: 'nav-menu-vertical',
    label: 'Vertical menu',
    description: '세로 메뉴',
    icon: 'MV',
    kind: 'menu-bar',
    width: 220,
    height: 240,
    content: { orientation: 'vertical', variant: 'plain' },
  },
  {
    id: 'nav-menu-dropdown',
    label: 'Dropdown menu',
    description: '드롭다운 계층',
    icon: 'MD',
    kind: 'menu-bar',
    width: 560,
    height: 56,
    content: {
      orientation: 'horizontal',
      variant: 'dropdown',
      items: [
        { label: '서비스', href: '/ko/services', children: [
          { label: '기업 자문', href: '/ko/services/corporate', description: '회사 설립과 운영 자문' },
          { label: '이민', href: '/ko/services/immigration', description: '비자/체류 자격' },
        ] },
        { label: '변호사', href: '/ko/lawyers' },
        { label: '문의', href: '/ko/contact' },
      ],
    },
  },
  {
    id: 'nav-menu-mega',
    label: 'Mega menu',
    description: '대형 드롭다운',
    icon: 'MM',
    kind: 'menu-bar',
    width: 720,
    height: 56,
    content: {
      orientation: 'horizontal',
      variant: 'mega',
      items: [
        { label: '서비스', href: '/ko/services', children: [
          { label: '기업', href: '/ko/services/corporate', description: '한·대 법인 자문' },
          { label: '이민', href: '/ko/services/immigration', description: '비자/체류' },
          { label: '소송', href: '/ko/services/litigation', description: '민·형사' },
          { label: '가사', href: '/ko/services/family', description: '이혼/상속' },
        ] },
      ],
    },
  },
  {
    id: 'nav-anchor-menu',
    label: 'Anchor menu',
    description: '섹션 점프 메뉴',
    icon: '⚓',
    kind: 'anchor-menu',
    width: 360,
    height: 48,
    content: {},
  },
  {
    id: 'nav-breadcrumbs-chevron',
    label: 'Breadcrumbs',
    description: '경로 표시',
    icon: '›',
    kind: 'breadcrumbs',
    width: 520,
    height: 32,
    content: { separator: 'chevron' },
  },
  {
    id: 'nav-breadcrumbs-slash',
    label: 'Breadcrumbs (slash)',
    description: '/ 구분자',
    icon: '/',
    kind: 'breadcrumbs',
    width: 520,
    height: 32,
    content: { separator: 'slash' },
  },
];

export const SOCIAL_WIDGET_PRESETS: SocialWidgetPreset[] = [
  {
    id: 'social-bar-row',
    label: 'Social bar',
    description: '소셜 링크 모음',
    icon: 'SB',
    kind: 'social-bar',
    width: 220,
    height: 48,
    content: {},
  },
  {
    id: 'social-share',
    label: 'Share buttons',
    description: '페이지 공유 4종',
    icon: '⇪',
    kind: 'share-buttons',
    width: 320,
    height: 96,
    content: {},
  },
  {
    id: 'social-instagram-feed',
    label: 'Instagram feed',
    description: '인스타그램 그리드',
    icon: 'IG',
    kind: 'social-embed',
    width: 420,
    height: 360,
    content: { provider: 'instagram-feed' },
  },
  {
    id: 'social-youtube-subscribe',
    label: 'YouTube subscribe',
    description: '유튜브 구독 위젯',
    icon: 'YT',
    kind: 'social-embed',
    width: 280,
    height: 120,
    content: { provider: 'youtube-subscribe', layout: 'list', count: 1, showHeader: true },
  },
  {
    id: 'social-linkedin-follow',
    label: 'LinkedIn follow',
    description: '링크드인 팔로우',
    icon: 'in',
    kind: 'social-embed',
    width: 280,
    height: 120,
    content: { provider: 'linkedin-follow', layout: 'list', count: 1, showHeader: true },
  },
  {
    id: 'social-floating-whatsapp',
    label: 'WhatsApp floating',
    description: 'WhatsApp 플로팅',
    icon: 'WA',
    kind: 'floating-chat',
    width: 64,
    height: 64,
    content: { provider: 'whatsapp' },
  },
  {
    id: 'social-floating-line',
    label: 'LINE floating',
    description: 'LINE 플로팅',
    icon: 'LN',
    kind: 'floating-chat',
    width: 64,
    height: 64,
    content: { provider: 'line', color: '#06c755', href: 'https://line.me/' },
  },
  {
    id: 'social-floating-kakao',
    label: 'Kakao floating',
    description: '카카오 플로팅',
    icon: 'K',
    kind: 'floating-chat',
    width: 64,
    height: 64,
    content: { provider: 'kakao', color: '#fee500', href: 'https://pf.kakao.com/' },
  },
];

export const LOCATION_WIDGET_PRESETS: LocationWidgetPreset[] = [
  {
    id: 'location-address-block',
    label: 'Address block',
    description: '주소 + 길찾기',
    icon: '📍',
    kind: 'address-block',
    width: 320,
    height: 220,
    content: {},
  },
  {
    id: 'location-business-hours',
    label: 'Business hours',
    description: '영업 시간 테이블',
    icon: '🕒',
    kind: 'business-hours',
    width: 280,
    height: 280,
    content: {},
  },
  {
    id: 'location-multi-map',
    label: 'Multi-location map',
    description: '다중 지점',
    icon: '🗺',
    kind: 'multi-location-map',
    width: 480,
    height: 320,
    content: {},
  },
];

export const DESIGNER_WIDGET_PRESETS: DesignerWidgetPreset[] = [
  {
    id: 'designer-proof-counter',
    label: 'Proof counter',
    description: '성과 숫자 강조',
    icon: '#',
    kind: 'counter',
    width: 240,
    height: 130,
    content: {
      title: '국제 자문 경험',
      prefix: '',
      target: 18,
      suffix: '+ yrs',
      durationMs: 1400,
      decimals: 0,
    },
    style: {
      borderRadius: 8,
      shadowY: 16,
      shadowBlur: 36,
      shadowColor: 'rgba(15, 23, 42, 0.12)',
    },
  },
  {
    id: 'designer-case-metric-card',
    label: 'Case metric card',
    description: '신뢰 지표용 프리미엄 카드',
    icon: 'MC',
    kind: 'counter',
    width: 280,
    height: 160,
    content: {
      title: 'Cross-border matters',
      prefix: '',
      target: 240,
      suffix: '+',
      durationMs: 1200,
      decimals: 0,
    },
    style: {
      borderRadius: 8,
      shadowY: 18,
      shadowBlur: 44,
      shadowColor: 'rgba(11, 59, 46, 0.16)',
    },
  },
  {
    id: 'designer-testimonial-card',
    label: 'Testimonial card',
    description: '후기 슬라이더 카드',
    icon: 'QT',
    kind: 'testimonial-carousel',
    width: 520,
    height: 230,
    content: {
      items: [
        { name: '기업 의뢰인', role: 'Cross-border matter', quote: '사실관계와 절차를 한 번에 정리해 주어 의사결정이 훨씬 빨라졌습니다.' },
        { name: '개인 의뢰인', role: 'Family case', quote: '민감한 내용을 차분하게 구조화해 주었고 다음 단계가 분명했습니다.' },
      ],
      autoplayMs: 6000,
      showStars: true,
    },
    style: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
  },
  {
    id: 'designer-service-gradient-card',
    label: 'Service spotlight',
    description: '대표 서비스 카드',
    icon: 'SV',
    kind: 'service-feature-card',
    width: 330,
    height: 230,
    content: {
      icon: '§',
      title: '기업·투자 자문',
      description: '회사 설립, 계약 검토, 투자 구조를 한·대 양국 관점에서 검토합니다.',
      ctaLabel: '서비스 보기',
      ctaHref: '/ko/services',
      variant: 'gradient',
    },
  },
  {
    id: 'designer-team-profile',
    label: 'Profile card',
    description: '전문가 프로필',
    icon: 'TM',
    kind: 'team-member-card',
    width: 310,
    height: 360,
    content: {
      name: 'Son Jungmin',
      role: 'International Counsel',
      bio: '한국어 상담과 대만 현지 절차를 함께 연결해 사건의 실행 가능성을 정리합니다.',
      avatar: '/images/team/son-jungmin.jpg',
      socialLinks: [
        { label: 'Profile', href: '/ko/lawyers' },
        { label: 'Contact', href: '/ko/contact' },
      ],
      variant: 'glass',
    },
  },
  {
    id: 'designer-pricing-table',
    label: 'Pricing cards',
    description: '3단 가격 카드',
    icon: '$',
    kind: 'pricing-table',
    width: 760,
    height: 340,
    content: {
      plans: [
        {
          name: 'Initial',
          price: 'NT$3,000',
          period: '상담',
          featured: false,
          features: ['60분 상담', '쟁점 요약', '다음 단계 안내'],
          ctaLabel: '예약하기',
          ctaHref: '/ko/contact',
        },
        {
          name: 'Strategy',
          price: '견적',
          period: '사건별',
          featured: true,
          features: ['자료 검토', '전략 메모', '일정·비용 계획'],
          ctaLabel: '문의하기',
          ctaHref: '/ko/contact',
        },
        {
          name: 'Ongoing',
          price: '월 자문',
          period: '기업',
          featured: false,
          features: ['계약 검토', '컴플라이언스', '정기 미팅'],
          ctaLabel: '상담 요청',
          ctaHref: '/ko/contact',
        },
      ],
    },
  },
  {
    id: 'designer-timeline-roadmap',
    label: 'Case timeline',
    description: '사건 진행 타임라인',
    icon: 'TL',
    kind: 'timeline',
    width: 560,
    height: 280,
    content: {
      accentColor: '#9f6b2c',
      orientation: 'vertical',
      items: [
        { year: 'Step 01', title: '자료 접수', description: '계약서, 메시지, 일정표를 먼저 정리합니다.' },
        { year: 'Step 02', title: '쟁점 구조화', description: '법적 쟁점과 협상 포인트를 분리합니다.' },
        { year: 'Step 03', title: '실행 계획', description: '문서, 연락, 기한을 기준으로 다음 액션을 확정합니다.' },
      ],
    },
  },
  {
    id: 'designer-comparison-table',
    label: 'Compare table',
    description: '서비스 비교표',
    icon: 'CP',
    kind: 'comparison-table',
    width: 620,
    height: 260,
    content: {
      columns: ['상담', '전략', '수임'],
      rows: [
        { feature: '사실관계 정리', values: ['기본', '상세', '상세'] },
        { feature: '문서 검토', values: ['선택', '포함', '포함'] },
        { feature: '진행 관리', values: ['-', '일정표', '전담 관리'] },
      ],
    },
  },
];

export const DECORATIVE_WIDGET_PRESETS: DecorativeWidgetPreset[] = [
  { id: 'decorative-shape-circle', label: 'Circle shape', description: '원형 도형', icon: '●', kind: 'shape', width: 160, height: 160, content: { shape: 'circle' } },
  { id: 'decorative-shape-blob', label: 'Blob shape', description: '블롭', icon: '☁', kind: 'shape', width: 200, height: 200, content: { shape: 'blob', fill: '#fcd34d' } },
  { id: 'decorative-shape-arrow', label: 'Arrow shape', description: '화살표', icon: '➜', kind: 'shape', width: 200, height: 120, content: { shape: 'arrow', fill: '#0ea5e9' } },
  { id: 'decorative-pattern-dots', label: 'Dots pattern', description: '점 패턴', icon: '▦', kind: 'pattern', width: 360, height: 220, content: { pattern: 'dots' } },
  { id: 'decorative-pattern-grid', label: 'Grid pattern', description: '그리드 패턴', icon: '⊞', kind: 'pattern', width: 360, height: 220, content: { pattern: 'grid' } },
  { id: 'decorative-pattern-waves', label: 'Waves pattern', description: '물결', icon: '〰', kind: 'pattern', width: 360, height: 160, content: { pattern: 'waves' } },
  { id: 'decorative-parallax', label: 'Parallax bg', description: '패럴랙스 배경', icon: '⛰', kind: 'parallax-bg', width: 720, height: 360, content: {} },
  { id: 'decorative-frame-solid', label: 'Frame', description: '액자 프레임', icon: '▢', kind: 'frame', width: 220, height: 220, content: {} },
  { id: 'decorative-frame-photo', label: 'Photo frame', description: '사진 프레임', icon: '▣', kind: 'frame', width: 240, height: 280, content: { style: 'photo', width: 6, label: 'Featured' } },
  { id: 'decorative-sticker-star', label: 'Star sticker', description: '추천 스티커', icon: '⭐', kind: 'sticker', width: 140, height: 64, content: {} },
  { id: 'decorative-sticker-banner', label: 'Banner sticker', description: '리본 배너', icon: '🎀', kind: 'sticker', width: 200, height: 56, content: { variant: 'banner', emoji: '🎉', label: 'New' } },
  { id: 'decorative-designer-corner-frame', label: 'Corner frame', description: '고급 코너 프레임', icon: 'CF', kind: 'frame', width: 360, height: 220, content: { style: 'corner', color: '#9f6b2c', width: 2, radius: 8, label: 'Selected' } },
  { id: 'decorative-designer-fine-line', label: 'Fine rule', description: '섹션용 얇은 구분선', icon: '—', kind: 'divider', width: 560, height: 12, content: { orientation: 'horizontal', thickness: 1, color: '#b48a55', style: 'solid' } },
  { id: 'decorative-designer-soft-halo', label: 'Soft halo', description: '은은한 배경 포인트', icon: 'HL', kind: 'shape', width: 280, height: 190, content: { shape: 'blob', fill: 'rgba(17, 109, 255, 0.14)', stroke: '', strokeWidth: 0 } },
  { id: 'decorative-designer-diagonal-pattern', label: 'Diagonal texture', description: '편집형 배경 텍스처', icon: 'DX', kind: 'pattern', width: 420, height: 220, content: { pattern: 'diagonal', color: 'rgba(159, 107, 44, 0.18)', background: '#fbf7ef', scale: 34 } },
  { id: 'decorative-designer-premium-tag', label: 'Premium tag', description: '작은 강조 배지', icon: 'PT', kind: 'sticker', width: 190, height: 54, content: { variant: 'pill', emoji: '✦', label: 'Featured insight', background: '#111827', color: '#ffffff', rotation: 0 } },
];
