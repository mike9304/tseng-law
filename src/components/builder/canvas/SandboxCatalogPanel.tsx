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
import type { BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import { BuiltInSectionsPanel } from '@/components/builder/sections/BuiltInSectionsPanel';
import SavedSectionsPanel from '@/components/builder/sections/SavedSectionsPanel';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 880;

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

export default function SandboxCatalogPanel({ locale }: { locale?: Locale }) {
  const { document, addNode, addNodes, setDraftSaveState } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const addSequenceRef = useRef(0);
  const [categoryOpen, setCategoryOpen] = useState<Record<string, boolean>>({
    'built-in-sections': true,
    'saved-sections': true,
  });
  const nodes = document?.nodes ?? [];
  const components = listComponents();
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
  const totalCatalogCount = components.length + TEXT_WIDGET_PRESETS.length + MEDIA_WIDGET_PRESETS.length;
  const visibleCatalogCount = visibleComponentCount + visibleTextWidgetPresets.length + visibleMediaWidgetPresets.length;

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

  function handleInsertBuiltInSection(template: BuiltInSectionTemplate) {
    if (!document) return;
    const result = insertSectionSnapshot(template.nodes, template.rootNodeId);
    if (result.nodes.length === 0) return;
    addNodes(result.nodes, result.rootNodeId);
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

        {/* Built-in section templates — normalized section snapshots. */}
        {!normalizedQuery ? (
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
                    바로 삽입 가능한 기본 섹션
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['built-in-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['built-in-sections'] ?? true) ? (
              <BuiltInSectionsPanel onInsert={handleInsertBuiltInSection} />
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
