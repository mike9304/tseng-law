'use client';

import { useMemo, useRef, useState } from 'react';
import { listComponents } from '@/lib/builder/components/registry';
import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import {
  BUILDER_RICH_TEXT_FORMAT,
  type BuilderRichText,
  type TipTapDocJson,
} from '@/lib/builder/rich-text/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { insertSectionSnapshot } from '@/lib/builder/sections/insertSection';
import {
  getBuiltInSectionSearchResults,
  type BuiltInSectionTemplate,
} from '@/lib/builder/sections/templates';
import { getTemplateCatalog } from '@/lib/builder/templates/registry';
import type { TemplateCatalogItem } from '@/lib/builder/templates/types';
import { BuiltInSectionsPanel } from '@/components/builder/sections/BuiltInSectionsPanel';
import SavedSectionsPanel from '@/components/builder/sections/SavedSectionsPanel';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 880;
const PAGE_TEMPLATE_PREVIEW_LIMIT = 4;

const CATEGORY_ORDER: BuilderComponentCategory[] = ['basic', 'media', 'layout', 'domain'];
const CATEGORY_LABELS: Record<BuilderComponentCategory, string> = {
  basic: 'Basic',
  media: 'Media',
  layout: 'Layout',
  domain: 'Domain',
  advanced: 'Advanced',
};
const CATEGORY_SUBLABELS: Record<BuilderComponentCategory, string> = {
  basic: 'text, button, heading',
  media: 'image, gallery, video, audio',
  layout: 'container, section',
  domain: 'composite, domain blocks',
  advanced: 'embed, spacer, divider',
};
const CATEGORY_ICONS: Record<BuilderComponentCategory, string> = {
  basic: 'Aa',
  media: '◩',
  layout: '▦',
  domain: '◈',
  advanced: '⋯',
};

const KIND_PRIORITY: Partial<Record<BuilderComponentCategory, string[]>> = {
  basic: ['text', 'button', 'heading'],
  media: ['image', 'gallery', 'video', 'video-embed', 'audio', 'lottie', 'icon'],
  layout: ['container', 'section'],
  domain: [
    'composite',
    'form',
    'form-input',
    'form-textarea',
    'form-select',
    'form-radio',
    'form-checkbox',
    'form-date',
    'form-file',
    'form-submit',
  ],
};

const FEATURED_KINDS: BuilderCanvasNodeKind[] = ['text', 'button', 'image', 'container', 'form'];

type TextWidgetKind = Extract<BuilderCanvasNodeKind, 'text' | 'heading'>;
type MediaWidgetKind = Extract<BuilderCanvasNodeKind, 'image' | 'video' | 'video-embed' | 'audio' | 'lottie' | 'icon'>;
type GalleryWidgetKind = Extract<BuilderCanvasNodeKind, 'gallery'>;
type LayoutWidgetKind = Extract<BuilderCanvasNodeKind, 'container'>;
type InteractiveWidgetKind = Extract<
  BuilderCanvasNodeKind,
  'countdown' | 'progress' | 'rating' | 'notification-bar' | 'back-to-top' | 'button'
>;
type NavigationWidgetKind = Extract<BuilderCanvasNodeKind, 'menu-bar' | 'anchor-menu' | 'breadcrumbs'>;
type SocialWidgetKind = Extract<BuilderCanvasNodeKind, 'social-bar' | 'share-buttons' | 'social-embed' | 'floating-chat'>;
type LocationWidgetKind = Extract<BuilderCanvasNodeKind, 'address-block' | 'business-hours' | 'multi-location-map' | 'map'>;
type DecorativeWidgetKind = Extract<BuilderCanvasNodeKind, 'shape' | 'pattern' | 'parallax-bg' | 'frame' | 'sticker' | 'divider' | 'spacer'>;

interface TextWidgetPreset {
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

interface MediaWidgetPreset {
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

interface GalleryWidgetPreset {
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

interface LayoutWidgetPreset {
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

interface InteractiveWidgetPreset {
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

interface NavigationWidgetPreset {
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

interface SocialWidgetPreset {
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

interface LocationWidgetPreset {
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

interface DecorativeWidgetPreset {
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

const TEXT_WIDGET_PRESETS: TextWidgetPreset[] = [
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
];

const MEDIA_IMAGE_A = '/images/header-skyline-buildings.webp';
const MEDIA_IMAGE_B = '/images/header-skyline-buildings.png';
const MEDIA_BLOG_IMAGE = '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg';
const PLACEHOLDER_IMAGE_SRC = '/images/placeholder-image.svg';

const MEDIA_WIDGET_PRESETS: MediaWidgetPreset[] = [
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

const GALLERY_WIDGET_PRESETS: GalleryWidgetPreset[] = [
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

const LAYOUT_WIDGET_PRESETS: LayoutWidgetPreset[] = [
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
];

const INTERACTIVE_WIDGET_PRESETS: InteractiveWidgetPreset[] = [
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

const NAVIGATION_WIDGET_PRESETS: NavigationWidgetPreset[] = [
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

const SOCIAL_WIDGET_PRESETS: SocialWidgetPreset[] = [
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

const LOCATION_WIDGET_PRESETS: LocationWidgetPreset[] = [
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

const DECORATIVE_WIDGET_PRESETS: DecorativeWidgetPreset[] = [
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
];

function resolveCenteredNode(
  kind: BuilderCanvasNodeKind,
  existingCount: number,
  cascadeSeed = existingCount,
) {
  const seed = createCanvasNodeTemplate(kind, 0, 0, existingCount);
  const cascadeOffset = (cascadeSeed % 12) * 22;
  return {
    ...seed,
    rect: {
      ...seed.rect,
      x: Math.round((STAGE_WIDTH - seed.rect.width) / 2 + cascadeOffset),
      y: Math.round((STAGE_HEIGHT - seed.rect.height) / 2 + cascadeOffset),
    },
  };
}

function resolveSectionInsertOffset(nodes: BuilderCanvasNode[], template: BuiltInSectionTemplate): { x: number; y: number } {
  const root = template.nodes.find((node) => node.id === template.rootNodeId);
  const width = root?.rect.width ?? STAGE_WIDTH;
  const existingBottom = nodes
    .filter((node) => !node.parentId && node.visible)
    .reduce((bottom, node) => Math.max(bottom, node.rect.y + node.rect.height), 0);

  return {
    x: Math.max(0, Math.round((STAGE_WIDTH - width) / 2)),
    y: Math.max(48, existingBottom + 48),
  };
}

function getDisplayCategory(component: BuilderComponentDefinition): BuilderComponentCategory {
  if (component.kind === 'image') return 'media';
  return component.category;
}

function compareByCategoryPriority(
  category: BuilderComponentCategory,
  left: BuilderComponentDefinition,
  right: BuilderComponentDefinition,
): number {
  const priority = KIND_PRIORITY[category] ?? [];
  const leftIndex = priority.indexOf(left.kind);
  const rightIndex = priority.indexOf(right.kind);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }

  return left.displayName.localeCompare(right.displayName, 'ko');
}

function normalizeSearchTerm(value: string): string {
  return value.trim().toLocaleLowerCase('ko-KR');
}

function componentMatchesSearch(component: BuilderComponentDefinition, query: string): boolean {
  if (!query) return true;
  return [
    component.displayName,
    component.kind,
    component.category,
    getDisplayCategory(component),
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function textWidgetMatchesSearch(preset: TextWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'text widget',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function mediaWidgetMatchesSearch(preset: MediaWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'media widget',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function galleryWidgetMatchesSearch(preset: GalleryWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'gallery widget',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function layoutWidgetMatchesSearch(preset: LayoutWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'layout widget',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function interactiveWidgetMatchesSearch(preset: InteractiveWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'interactive widget',
    'countdown',
    'progress',
    'rating',
    'notification',
    'back to top',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function navigationWidgetMatchesSearch(preset: NavigationWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'navigation widget',
    'menu',
    'breadcrumb',
    'anchor',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function decorativeWidgetMatchesSearch(preset: DecorativeWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'decorative widget',
    'shape',
    'pattern',
    'frame',
    'sticker',
    'parallax',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function locationWidgetMatchesSearch(preset: LocationWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'location widget',
    'maps',
    'address',
    'hours',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function socialWidgetMatchesSearch(preset: SocialWidgetPreset, query: string): boolean {
  if (!query) return true;
  return [
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'social widget',
    'instagram',
    'youtube',
    'linkedin',
    'whatsapp',
    'line',
    'kakao',
    'share',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function pageTemplateMatchesSearch(template: TemplateCatalogItem, query: string): boolean {
  if (!query) return true;
  return [
    template.name,
    template.description,
    template.id,
    template.category,
    template.subcategory,
    template.visualStyle,
    template.density,
    template.layoutFamily,
    template.pageType,
    template.qualityTier,
    template.ctaGoal,
    ...(template.tags ?? []),
    ...(template.sections ?? []),
    'page template',
    'page templates',
    '페이지 템플릿',
    '템플릿 쇼룸',
    'template market',
    'ai design',
  ].some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

function pageTemplateSearchScore(template: TemplateCatalogItem, query: string): number {
  if (!query) return 0;
  const includes = (value: unknown) => String(value ?? '').toLocaleLowerCase('ko-KR').includes(query);
  let score = 0;
  if (includes(template.name)) score += 100;
  if (includes(template.id)) score += 80;
  if (includes(template.subcategory)) score += 70;
  if (includes(template.description)) score += 60;
  if (template.tags?.some(includes)) score += 45;
  if (template.sections?.some(includes)) score += 35;
  if (includes(template.category)) score += 30;
  if (includes(template.pageType)) score += 20;
  if (template.featured) score += 6;
  if (template.qualityTier === 'premium') score += 4;
  return score;
}

export default function SandboxCatalogPanel({
  locale,
  onOpenPageTemplates,
}: {
  locale?: Locale;
  onOpenPageTemplates?: (query?: string) => void;
}) {
  const { document, addNode, addNodes, setSelectedNodeId, setDraftSaveState } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const addSequenceRef = useRef(0);
  const [categoryOpen, setCategoryOpen] = useState<Record<string, boolean>>({
    'built-in-sections': true,
    'saved-sections': true,
  });
  const nodes = document?.nodes ?? [];
  const components = listComponents();
  const pageTemplateCatalog = useMemo(() => getTemplateCatalog(), []);
  const effectiveLocale: Locale = locale ?? (document?.locale as Locale) ?? 'ko';
  const normalizedQuery = normalizeSearchTerm(query);

  const featuredComponents = useMemo(() => (
    FEATURED_KINDS
      .map((kind) => components.find((component) => component.kind === kind))
      .filter((component): component is BuilderComponentDefinition => Boolean(component))
  ), [components]);

  const visibleTextWidgetPresets = useMemo(
    () => TEXT_WIDGET_PRESETS.filter((preset) => textWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleMediaWidgetPresets = useMemo(
    () => MEDIA_WIDGET_PRESETS.filter((preset) => mediaWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleGalleryWidgetPresets = useMemo(
    () => GALLERY_WIDGET_PRESETS.filter((preset) => galleryWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleLayoutWidgetPresets = useMemo(
    () => LAYOUT_WIDGET_PRESETS.filter((preset) => layoutWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleInteractiveWidgetPresets = useMemo(
    () => INTERACTIVE_WIDGET_PRESETS.filter((preset) => interactiveWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleNavigationWidgetPresets = useMemo(
    () => NAVIGATION_WIDGET_PRESETS.filter((preset) => navigationWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleSocialWidgetPresets = useMemo(
    () => SOCIAL_WIDGET_PRESETS.filter((preset) => socialWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleLocationWidgetPresets = useMemo(
    () => LOCATION_WIDGET_PRESETS.filter((preset) => locationWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleDecorativeWidgetPresets = useMemo(
    () => DECORATIVE_WIDGET_PRESETS.filter((preset) => decorativeWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleBuiltInSectionTemplates = useMemo(
    () => getBuiltInSectionSearchResults(normalizedQuery),
    [normalizedQuery],
  );
  const totalBuiltInSectionTemplateCount = useMemo(
    () => getBuiltInSectionSearchResults('').length,
    [],
  );
  const matchingPageTemplates = useMemo(
    () => (normalizedQuery
      ? pageTemplateCatalog
        .filter((template) => pageTemplateMatchesSearch(template, normalizedQuery))
        .sort((left, right) => (
          pageTemplateSearchScore(right, normalizedQuery)
          - pageTemplateSearchScore(left, normalizedQuery)
        ))
      : []),
    [normalizedQuery, pageTemplateCatalog],
  );
  const visiblePageTemplatePreviews = matchingPageTemplates.slice(0, PAGE_TEMPLATE_PREVIEW_LIMIT);

  const groupedCategories = useMemo(() => {
    const buckets = new Map<BuilderComponentCategory, BuilderComponentDefinition[]>();

    for (const component of components) {
      const category = getDisplayCategory(component);
      const current = buckets.get(category) ?? [];
      current.push(component);
      buckets.set(category, current);
    }

    const remainingCategories = [...buckets.keys()].filter(
      (category) => !CATEGORY_ORDER.includes(category),
    );

    return [...CATEGORY_ORDER, ...remainingCategories]
      .filter((category) => (buckets.get(category) ?? []).length > 0)
      .map((category) => {
        const filteredComponents = [...(buckets.get(category) ?? [])]
          .filter((component) => componentMatchesSearch(component, normalizedQuery))
          .sort((left, right) => compareByCategoryPriority(category, left, right));

        return {
          category,
          components: filteredComponents,
        };
      })
      .filter(({ components: categoryComponents }) => categoryComponents.length > 0);
  }, [components, normalizedQuery]);

  const visibleComponentCount = groupedCategories.reduce(
    (count, group) => count + group.components.length,
    0,
  );
  const totalCatalogCount = components.length + TEXT_WIDGET_PRESETS.length + MEDIA_WIDGET_PRESETS.length + GALLERY_WIDGET_PRESETS.length + LAYOUT_WIDGET_PRESETS.length + INTERACTIVE_WIDGET_PRESETS.length + NAVIGATION_WIDGET_PRESETS.length + SOCIAL_WIDGET_PRESETS.length + LOCATION_WIDGET_PRESETS.length + DECORATIVE_WIDGET_PRESETS.length + totalBuiltInSectionTemplateCount + pageTemplateCatalog.length;
  const visibleCatalogCount = visibleComponentCount + visibleTextWidgetPresets.length + visibleMediaWidgetPresets.length + visibleGalleryWidgetPresets.length + visibleLayoutWidgetPresets.length + visibleInteractiveWidgetPresets.length + visibleNavigationWidgetPresets.length + visibleSocialWidgetPresets.length + visibleLocationWidgetPresets.length + visibleDecorativeWidgetPresets.length + visibleBuiltInSectionTemplates.length + matchingPageTemplates.length;

  function handleQuickAdd(kind: BuilderCanvasNodeKind) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    addNode(resolveCenteredNode(kind, nodes.length + sequence, sequence));
    setDraftSaveState('saving');
  }

  function handleAddTextWidgetPreset(preset: TextWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddMediaWidgetPreset(preset: MediaWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddGalleryWidgetPreset(preset: GalleryWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddLayoutWidgetPreset(preset: LayoutWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
      anchorName: preset.id === 'layout-sticky-anchor' ? 'services' : seed.anchorName,
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddDecorativeWidgetPreset(preset: DecorativeWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddLocationWidgetPreset(preset: LocationWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddSocialWidgetPreset(preset: SocialWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddNavigationWidgetPreset(preset: NavigationWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddInteractiveWidgetPreset(preset: InteractiveWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleInsertBuiltInSection(template: BuiltInSectionTemplate) {
    if (!document) return;
    const result = insertSectionSnapshot(
      template.nodes,
      template.rootNodeId,
      resolveSectionInsertOffset(nodes, template),
    );
    if (result.nodes.length === 0) return;
    addNodes(result.nodes, result.rootNodeId);
    setSelectedNodeId(result.rootNodeId);
    setDraftSaveState('saving');
  }

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Catalog</span>
          <strong>
            {normalizedQuery ? `${visibleCatalogCount}/${totalCatalogCount}` : totalCatalogCount} items
          </strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? '카탈로그 접기' : '카탈로그 열기'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        <p className={styles.panelCopy}>
          registry 컴포넌트를 카테고리별로 묶었습니다. drag 로 캔버스에 추가하거나 quick-add 로 중앙에 바로 생성합니다.
        </p>
        {onOpenPageTemplates ? (
          <button
            type="button"
            className={styles.actionButton}
            data-builder-open-page-template-market="true"
            onClick={() => onOpenPageTemplates(query)}
          >
            전체 페이지 템플릿 261개 보기
          </button>
        ) : null}

        <label className={styles.catalogSearchLabel}>
          <span>Search elements</span>
          <input
            type="search"
            aria-label="Search add elements"
            className={styles.catalogSearchInput}
            placeholder="Text, button, image..."
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>

        <div className={styles.catalogQuickStrip} aria-label="Popular add elements">
          {featuredComponents.map((component) => (
            <button
              key={component.kind}
              type="button"
              className={styles.catalogQuickButton}
              data-builder-add-quick-kind={component.kind}
              onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
            >
              <span>{component.icon}</span>
              <strong>{component.displayName}</strong>
            </button>
          ))}
        </div>

        {normalizedQuery ? (
          <div className={styles.catalogResultMeta} aria-live="polite">
            Showing {visibleCatalogCount} result{visibleCatalogCount === 1 ? '' : 's'} for “{query.trim()}”
          </div>
        ) : null}

        {normalizedQuery && onOpenPageTemplates && matchingPageTemplates.length > 0 ? (
          <div
            className={styles.catalogCategorySection}
            data-builder-page-template-search-results="true"
          >
            <div className={styles.catalogCategoryButton}>
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>PG</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Page template showroom</span>
                  <span
                    className={styles.catalogCategoryHint}
                    data-builder-page-template-result-count="true"
                  >
                    {matchingPageTemplates.length}/{pageTemplateCatalog.length} page templates
                  </span>
                </span>
              </span>
              <button
                type="button"
                className={styles.catalogQuickAddButton}
                onClick={() => onOpenPageTemplates(query)}
              >
                전체 결과 보기
              </button>
            </div>

            <div className={styles.mediaWidgetGrid}>
              {visiblePageTemplatePreviews.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={styles.mediaWidgetPresetButton}
                  data-builder-page-template-result-id={template.id}
                  onClick={() => onOpenPageTemplates(template.name)}
                >
                  <span className={styles.mediaWidgetPresetIcon}>
                    {String(template.pageType ?? template.category).slice(0, 2).toUpperCase()}
                  </span>
                  <span className={styles.mediaWidgetPresetCopy}>
                    <strong>{template.name}</strong>
                    <small>
                      {template.category} · {template.pageType ?? 'page'} · {template.sectionCount} sections
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {visibleTextWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['text-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'text-widgets': !(current['text-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>T</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Text widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    H1-H6, rich text, path, columns, quote, list, marquee · {visibleTextWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['text-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['text-widgets'] ?? true) ? (
              <div className={styles.textWidgetGrid}>
                {visibleTextWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.textWidgetPresetButton}
                    data-builder-text-widget-preset={preset.id}
                    onClick={() => handleAddTextWidgetPreset(preset)}
                  >
                    <span className={styles.textWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.textWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleMediaWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['media-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'media-widgets': !(current['media-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>◩</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Media widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    lightbox, hotspots, compare, video, audio, icons · {visibleMediaWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['media-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['media-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleMediaWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-media-widget-preset={preset.id}
                    onClick={() => handleAddMediaWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleGalleryWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['gallery-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'gallery-widgets': !(current['gallery-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>▧</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Gallery widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    grid, masonry, slider, slideshow, thumbnail, pro, caption, filter · {visibleGalleryWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['gallery-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['gallery-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleGalleryWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-gallery-widget-preset={preset.id}
                    onClick={() => handleAddGalleryWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleLayoutWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['layout-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'layout-widgets': !(current['layout-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>▦</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Layout widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    strip, box, columns, repeater, tabs, accordion, slideshow, hover · {visibleLayoutWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['layout-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['layout-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleLayoutWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-layout-widget-preset={preset.id}
                    onClick={() => handleAddLayoutWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleInteractiveWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['interactive-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'interactive-widgets': !(current['interactive-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>◉</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Interactive widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    countdown, progress, rating, notification, back-to-top · {visibleInteractiveWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['interactive-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['interactive-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleInteractiveWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-interactive-widget-preset={preset.id}
                    onClick={() => handleAddInteractiveWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleNavigationWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['navigation-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'navigation-widgets': !(current['navigation-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>≡</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Navigation widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    menu, dropdown, mega, anchor, breadcrumbs · {visibleNavigationWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['navigation-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['navigation-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleNavigationWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-navigation-widget-preset={preset.id}
                    onClick={() => handleAddNavigationWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleSocialWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['social-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'social-widgets': !(current['social-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>@</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Social widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    social-bar, share, embed, floating chat · {visibleSocialWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['social-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['social-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleSocialWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-social-widget-preset={preset.id}
                    onClick={() => handleAddSocialWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleLocationWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['location-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'location-widgets': !(current['location-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>📍</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Maps &amp; Location pack</span>
                  <span className={styles.catalogCategoryHint}>
                    address, hours, multi-map · {visibleLocationWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['location-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['location-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleLocationWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-location-widget-preset={preset.id}
                    onClick={() => handleAddLocationWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {visibleDecorativeWidgetPresets.length > 0 ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['decorative-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'decorative-widgets': !(current['decorative-widgets'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>◆</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Decorative widget pack</span>
                  <span className={styles.catalogCategoryHint}>
                    shape, pattern, parallax, frame, sticker · {visibleDecorativeWidgetPresets.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['decorative-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['decorative-widgets'] ?? true) ? (
              <div className={styles.mediaWidgetGrid}>
                {visibleDecorativeWidgetPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={styles.mediaWidgetPresetButton}
                    data-builder-decorative-widget-preset={preset.id}
                    onClick={() => handleAddDecorativeWidgetPreset(preset)}
                  >
                    <span className={styles.mediaWidgetPresetIcon}>{preset.icon}</span>
                    <span className={styles.mediaWidgetPresetCopy}>
                      <strong>{preset.label}</strong>
                      <small>{preset.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Built-in section templates — normalized section snapshots. */}
        {(!normalizedQuery || visibleBuiltInSectionTemplates.length > 0) ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['built-in-sections'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'built-in-sections': !(current['built-in-sections'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>▤</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Section templates</span>
                  <span className={styles.catalogCategoryHint}>
                    전문 디자인팩 · {visibleBuiltInSectionTemplates.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['built-in-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['built-in-sections'] ?? true) ? (
              <BuiltInSectionsPanel
                query={normalizedQuery}
                onInsert={handleInsertBuiltInSection}
              />
            ) : null}
          </div>
        ) : null}

        {/* Saved sections — Wix Studio "Saved Sections" parity. */}
        {!normalizedQuery ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['saved-sections'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'saved-sections': !(current['saved-sections'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>★</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Saved sections</span>
                  <span className={styles.catalogCategoryHint}>
                    내가 저장한 섹션 라이브러리
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['saved-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['saved-sections'] ?? true) ? (
              <SavedSectionsPanel locale={effectiveLocale} />
            ) : null}
          </div>
        ) : null}

        {groupedCategories.map(({ category, components: categoryComponents }) => {
          const isOpen = categoryOpen[category] ?? true;
          return (
            <div key={category} className={styles.catalogCategorySection}>
              <button
                type="button"
                className={`${styles.catalogCategoryButton} ${isOpen ? styles.catalogCategoryButtonOpen : ''}`}
                onClick={() => {
                  setCategoryOpen((current) => ({
                    ...current,
                    [category]: !isOpen,
                  }));
                }}
              >
                <span className={styles.catalogCategoryMeta}>
                  <span className={styles.catalogCategoryIcon}>{CATEGORY_ICONS[category]}</span>
                  <span className={styles.catalogCategoryTitle}>
                    <span className={styles.catalogCategoryName}>{CATEGORY_LABELS[category]}</span>
                    <span className={styles.catalogCategoryHint}>
                      {CATEGORY_SUBLABELS[category]} · {categoryComponents.length}
                    </span>
                  </span>
                </span>
                <span className={styles.catalogCategoryToggle}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div className={styles.catalogSectionGrid}>
                  {categoryComponents.map((component) => (
                    <div key={component.kind} className={styles.catalogCard} data-builder-add-card={component.kind}>
                      <button
                        type="button"
                        className={styles.catalogDragButton}
                        data-builder-add-card-kind={component.kind}
                        title={`${component.displayName} — 캔버스로 드래그하여 추가`}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData('application/x-builder-node-kind', component.kind);
                          event.dataTransfer.effectAllowed = 'copy';
                        }}
                      >
                        <span className={styles.catalogCardIcon}>{component.icon}</span>
                        <span className={styles.catalogCardName}>{component.displayName}</span>
                        <span className={styles.catalogCardMeta}>{component.kind} · drag to canvas</span>
                      </button>

                      <button
                        type="button"
                        className={styles.catalogQuickAddButton}
                        title={`${component.displayName} 캔버스 중앙에 추가`}
                        onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
                      >
                        Quick add
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {normalizedQuery && visibleCatalogCount === 0 ? (
          <div className={styles.catalogEmptyState}>
            <strong>No matching elements</strong>
            <span>Try text, image, button, form, section.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
