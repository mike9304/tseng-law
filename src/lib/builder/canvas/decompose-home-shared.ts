import type { BuilderCanvasNode } from './types';
import { createDefaultCanvasNodeStyle } from './types';

export const HOME_STAGE_WIDTH = 1280;

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ContainerTag = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'form';
type TextTag = 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'input';
type ButtonTag = 'a' | 'button';

const baseTextContent = {
  fontSize: 16,
  color: '#0f172a',
  fontWeight: 'regular' as const,
  align: 'left' as const,
  lineHeight: 1.5,
  letterSpacing: 0,
  fontFamily: 'system-ui',
  verticalAlign: 'top' as const,
  textTransform: 'none' as const,
};

export function createHomeContainerNode({
  id,
  rect,
  zIndex,
  label,
  parentId,
  className,
  as = 'div',
  htmlId,
  dataTone,
  action,
  method,
  background = 'transparent',
  borderColor = '#cbd5e1',
  borderStyle = 'solid',
  borderWidth = 0,
  borderRadius = 0,
  padding = 0,
  layoutMode = 'absolute',
  flexConfig,
  gridConfig,
}: {
  id: string;
  rect: Rect;
  zIndex: number;
  label: string;
  parentId?: string;
  className?: string;
  as?: ContainerTag;
  htmlId?: string;
  dataTone?: string;
  action?: string;
  method?: 'get' | 'post';
  background?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed';
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  layoutMode?: 'absolute' | 'flex' | 'grid';
  flexConfig?: {
    direction?: 'row' | 'column';
    wrap?: boolean;
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gap?: number;
  };
  gridConfig?: {
    columns?: number;
    rows?: number;
    columnGap?: number;
    rowGap?: number;
    templateColumns?: string;
    templateRows?: string;
  };
}): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    ...(parentId ? { parentId } : {}),
    rect,
    style: createDefaultCanvasNodeStyle({ borderRadius }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label,
      background,
      borderColor,
      borderStyle,
      borderWidth,
      borderRadius,
      padding,
      layoutMode,
      ...(flexConfig
        ? {
            flexConfig: {
              direction: flexConfig.direction ?? 'row',
              wrap: flexConfig.wrap ?? true,
              justifyContent: flexConfig.justifyContent ?? 'flex-start',
              alignItems: flexConfig.alignItems ?? 'flex-start',
              gap: flexConfig.gap ?? 16,
            },
          }
        : {}),
      ...(gridConfig
        ? {
            gridConfig: {
              columns: gridConfig.columns ?? 1,
              rows: gridConfig.rows ?? 1,
              columnGap: gridConfig.columnGap ?? 16,
              rowGap: gridConfig.rowGap ?? 16,
              ...(gridConfig.templateColumns ? { templateColumns: gridConfig.templateColumns } : {}),
              ...(gridConfig.templateRows ? { templateRows: gridConfig.templateRows } : {}),
            },
          }
        : {}),
      ...(className ? { className } : {}),
      ...(as ? { as } : {}),
      ...(htmlId ? { htmlId } : {}),
      ...(dataTone ? { dataTone } : {}),
      ...(action ? { action } : {}),
      ...(method ? { method } : {}),
    },
  };
}

export function createHomeTextNode({
  id,
  rect,
  zIndex,
  text,
  parentId,
  className,
  as = 'div',
  fontSize = 16,
  color = '#0f172a',
  fontWeight = 'regular',
  inputType,
  name,
  placeholder,
  ariaLabel,
}: {
  id: string;
  rect: Rect;
  zIndex: number;
  text: string;
  parentId?: string;
  className?: string;
  as?: TextTag;
  fontSize?: number;
  color?: string;
  fontWeight?: 'regular' | 'medium' | 'bold';
  inputType?: 'text' | 'search' | 'email' | 'url' | 'tel';
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
}): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    ...(parentId ? { parentId } : {}),
    rect,
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      ...baseTextContent,
      text,
      fontSize,
      color,
      fontWeight,
      ...(className ? { className } : {}),
      ...(as ? { as } : {}),
      ...(inputType ? { inputType } : {}),
      ...(name ? { name } : {}),
      ...(placeholder ? { placeholder } : {}),
      ...(ariaLabel ? { ariaLabel } : {}),
    },
  };
}

export function createHomeButtonNode({
  id,
  rect,
  zIndex,
  label,
  href,
  style = 'primary',
  parentId,
  className,
  as = 'a',
  target,
  rel,
  buttonType,
  ariaLabel,
}: {
  id: string;
  rect: Rect;
  zIndex: number;
  label: string;
  href: string;
  style?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  parentId?: string;
  className?: string;
  as?: ButtonTag;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  buttonType?: 'button' | 'submit';
  ariaLabel?: string;
}): BuilderCanvasNode {
  return {
    id,
    kind: 'button',
    ...(parentId ? { parentId } : {}),
    rect,
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label,
      href,
      style,
      ...(className ? { className } : {}),
      ...(as ? { as } : {}),
      ...(target ? { target } : {}),
      ...(rel ? { rel } : {}),
      ...(buttonType ? { buttonType } : {}),
      ...(ariaLabel ? { ariaLabel } : {}),
    },
  };
}

export function createHomeImageNode({
  id,
  rect,
  zIndex,
  src,
  alt,
  parentId,
  fit = 'cover',
}: {
  id: string;
  rect: Rect;
  zIndex: number;
  src: string;
  alt: string;
  parentId?: string;
  fit?: 'cover' | 'contain';
}): BuilderCanvasNode {
  return {
    id,
    kind: 'image',
    ...(parentId ? { parentId } : {}),
    rect,
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      src,
      alt,
      fit,
    },
  };
}
