import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasNode,
  type BuilderCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

export type CanvasRect = BuilderCanvasNode['rect'];

function createNodeBase<K extends BuilderCanvasNode['kind']>(
  id: string,
  kind: K,
  rect: CanvasRect,
  style: Partial<BuilderCanvasNodeStyle> = {},
  parentId?: string,
) {
  return {
    id,
    kind,
    parentId,
    rect,
    style: createDefaultCanvasNodeStyle(style),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
  };
}

export function resolveHeadingFontFamily(locale: Locale): string {
  if (locale === 'zh-hant') return 'Noto Serif TC';
  if (locale === 'en') return 'Cormorant Garamond';
  return 'Noto Serif KR';
}

export function resolveBodyFontFamily(locale: Locale): string {
  if (locale === 'zh-hant') return 'Noto Sans TC';
  return 'IBM Plex Sans KR';
}

export function createContainerNode({
  id,
  rect,
  parentId,
  background = 'transparent',
  borderColor = 'transparent',
  borderStyle = 'solid',
  borderWidth = 0,
  borderRadius = 0,
  padding = 0,
  className,
  style = {},
}: {
  id: string;
  rect: CanvasRect;
  parentId?: string;
  background?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed';
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  className?: string;
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createNodeBase(id, 'container', rect, style, parentId),
    content: {
      label: '',
      background,
      borderColor,
      borderStyle,
      borderWidth,
      borderRadius,
      padding,
      layoutMode: 'absolute',
      className,
    },
  };
}

export function createTextNode({
  id,
  rect,
  text,
  fontSize,
  color,
  fontWeight = 'regular',
  align = 'left',
  lineHeight = 1.3,
  letterSpacing = 0,
  fontFamily,
  textShadow,
  verticalAlign,
  backgroundColor,
  textTransform,
  className,
  parentId,
  style = {},
}: {
  id: string;
  rect: CanvasRect;
  text: string;
  fontSize: number;
  color: string;
  fontWeight?: 'regular' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
  fontFamily?: string;
  textShadow?: { x: number; y: number; blur: number; color: string };
  verticalAlign?: 'top' | 'center' | 'bottom';
  backgroundColor?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  className?: string;
  parentId?: string;
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createNodeBase(id, 'text', rect, style, parentId),
    content: {
      text,
      fontSize,
      color,
      fontWeight,
      align,
      lineHeight,
      letterSpacing,
      fontFamily,
      textShadow,
      verticalAlign,
      backgroundColor,
      textTransform,
      className,
    },
  };
}

export function createButtonNode({
  id,
  rect,
  label,
  href,
  variant = 'primary',
  className,
  parentId,
  style = {},
}: {
  id: string;
  rect: CanvasRect;
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  className?: string;
  parentId?: string;
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createNodeBase(id, 'button', rect, style, parentId),
    content: {
      label,
      href,
      style: variant,
      className,
    },
  };
}

export function createImageNode({
  id,
  rect,
  src,
  alt,
  fit = 'cover',
  parentId,
  style = {},
}: {
  id: string;
  rect: CanvasRect;
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
  parentId?: string;
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createNodeBase(id, 'image', rect, style, parentId),
    content: {
      src,
      alt,
      fit,
      cropAspect: '',
      filters: undefined,
    },
  };
}

export function assignCanvasNodeZIndices(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  return nodes.map((node, index) => ({
    ...node,
    zIndex: index,
  }));
}
