import {
  BUILDER_RICH_TEXT_FORMAT,
  type BuilderRichText,
  type TipTapDocJson,
  type TipTapMarkJson,
  type TipTapNodeJson,
} from './types';
import { isLinkSafe } from '@/lib/builder/links';

export type SafeTipTapNodeType =
  | 'doc'
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'listItem'
  | 'blockquote'
  | 'text'
  | 'hardBreak';

export interface SafeTipTapMark {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link';
  attrs?: {
    href?: string;
    target?: '_blank' | '_self';
    title?: string;
  };
}

export interface SafeTipTapNode {
  type: SafeTipTapNodeType;
  attrs?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    start?: number;
  };
  content?: SafeTipTapNode[];
  text?: string;
  marks?: SafeTipTapMark[];
}

interface SanitizeState {
  textRemaining: number;
}

const DEFAULT_MAX_TEXT_LENGTH = 20_000;
const MAX_DEPTH = 24;
const MAX_CHILDREN_PER_NODE = 500;

const INLINE_NODE_TYPES = new Set(['text', 'hardBreak']);
const BLOCK_NODE_TYPES = new Set([
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'listItem',
  'blockquote',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asNode(value: unknown): TipTapNodeJson | null {
  if (!isRecord(value) || typeof value.type !== 'string') return null;
  return value as unknown as TipTapNodeJson;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value.slice(0, MAX_CHILDREN_PER_NODE) : [];
}

function takeText(value: string, state: SanitizeState): string {
  if (state.textRemaining <= 0) return '';
  const next = value.slice(0, state.textRemaining);
  state.textRemaining -= next.length;
  return next;
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function sanitizeRichTextHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const href = value.trim();
  return isLinkSafe(href) ? href : undefined;
}

function sanitizeMarks(value: unknown): SafeTipTapMark[] | undefined {
  const marks = asArray(value);
  const safeMarks: SafeTipTapMark[] = [];

  for (const rawMark of marks) {
    if (!isRecord(rawMark) || typeof rawMark.type !== 'string') continue;

    if (
      rawMark.type === 'bold' ||
      rawMark.type === 'italic' ||
      rawMark.type === 'underline' ||
      rawMark.type === 'strike' ||
      rawMark.type === 'code'
    ) {
      safeMarks.push({ type: rawMark.type });
      continue;
    }

    if (rawMark.type !== 'link' || !isRecord(rawMark.attrs)) continue;

    const href = sanitizeRichTextHref(rawMark.attrs.href);
    if (!href) continue;

    const target = rawMark.attrs.target === '_blank' || rawMark.attrs.target === '_self'
      ? rawMark.attrs.target
      : undefined;
    const title = typeof rawMark.attrs.title === 'string'
      ? rawMark.attrs.title.slice(0, 300)
      : undefined;

    safeMarks.push({
      type: 'link',
      attrs: { href, target, title },
    });
  }

  return safeMarks.length > 0 ? safeMarks : undefined;
}

function sanitizeTextNode(node: TipTapNodeJson, state: SanitizeState): SafeTipTapNode | null {
  const text = takeText(normalizeText(node.text), state);
  if (!text) return null;
  return {
    type: 'text',
    text,
    marks: sanitizeMarks(node.marks),
  };
}

function sanitizeInlineNode(node: TipTapNodeJson, state: SanitizeState): SafeTipTapNode | null {
  if (node.type === 'text') return sanitizeTextNode(node, state);
  if (node.type === 'hardBreak') return { type: 'hardBreak' };
  return null;
}

function sanitizeInlineContent(value: unknown, state: SanitizeState): SafeTipTapNode[] | undefined {
  const children = asArray(value)
    .map((child) => {
      const node = asNode(child);
      return node && INLINE_NODE_TYPES.has(node.type) ? sanitizeInlineNode(node, state) : null;
    })
    .filter((node): node is SafeTipTapNode => Boolean(node));

  return children.length > 0 ? children : undefined;
}

function sanitizeHeadingLevel(value: unknown): 1 | 2 | 3 | 4 | 5 | 6 {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6
    ? value
    : 2;
}

function sanitizeOrderedListStart(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 1 && value <= 9999
    ? value
    : undefined;
}

function sanitizeBlockContent(value: unknown, state: SanitizeState, depth: number): SafeTipTapNode[] | undefined {
  if (depth > MAX_DEPTH) return undefined;

  const children = asArray(value)
    .map((child) => {
      const node = asNode(child);
      return node && BLOCK_NODE_TYPES.has(node.type)
        ? sanitizeBlockNode(node, state, depth + 1)
        : null;
    })
    .filter((node): node is SafeTipTapNode => Boolean(node));

  return children.length > 0 ? children : undefined;
}

function sanitizeListItemContent(value: unknown, state: SanitizeState, depth: number): SafeTipTapNode[] | undefined {
  const blockContent = sanitizeBlockContent(value, state, depth);
  if (blockContent) return blockContent;

  const inlineContent = sanitizeInlineContent(value, state);
  return inlineContent ? [{ type: 'paragraph', content: inlineContent }] : undefined;
}

function sanitizeListContent(value: unknown, state: SanitizeState, depth: number): SafeTipTapNode[] | undefined {
  if (depth > MAX_DEPTH) return undefined;

  const children = asArray(value)
    .map((child) => {
      const node = asNode(child);
      return node?.type === 'listItem' ? sanitizeBlockNode(node, state, depth + 1) : null;
    })
    .filter((node): node is SafeTipTapNode => Boolean(node));

  return children.length > 0 ? children : undefined;
}

function sanitizeBlockNode(node: TipTapNodeJson, state: SanitizeState, depth: number): SafeTipTapNode | null {
  if (depth > MAX_DEPTH) return null;

  if (node.type === 'paragraph') {
    return {
      type: 'paragraph',
      content: sanitizeInlineContent(node.content, state),
    };
  }

  if (node.type === 'heading') {
    return {
      type: 'heading',
      attrs: {
        level: sanitizeHeadingLevel(isRecord(node.attrs) ? node.attrs.level : undefined),
      },
      content: sanitizeInlineContent(node.content, state),
    };
  }

  if (node.type === 'bulletList') {
    const content = sanitizeListContent(node.content, state, depth);
    return content ? { type: 'bulletList', content } : null;
  }

  if (node.type === 'orderedList') {
    const content = sanitizeListContent(node.content, state, depth);
    if (!content) return null;
    const start = sanitizeOrderedListStart(isRecord(node.attrs) ? node.attrs.start : undefined);
    return {
      type: 'orderedList',
      attrs: start ? { start } : undefined,
      content,
    };
  }

  if (node.type === 'listItem') {
    const content = sanitizeListItemContent(node.content, state, depth + 1);
    return content ? { type: 'listItem', content } : null;
  }

  if (node.type === 'blockquote') {
    const content = sanitizeBlockContent(node.content, state, depth);
    return content ? { type: 'blockquote', content } : null;
  }

  return null;
}

export function sanitizeTipTapDoc(
  value: unknown,
  { maxTextLength = DEFAULT_MAX_TEXT_LENGTH }: { maxTextLength?: number } = {},
): SafeTipTapNode | null {
  const doc = asNode(value);
  if (!doc || doc.type !== 'doc') return null;

  const state: SanitizeState = { textRemaining: maxTextLength };
  return {
    type: 'doc',
    content: sanitizeBlockContent(doc.content, state, 0) ?? [{ type: 'paragraph' }],
  };
}

function firstInlineContent(value: unknown, state: SanitizeState, depth: number): SafeTipTapNode[] | undefined {
  if (depth > MAX_DEPTH) return undefined;

  const inlineContent = sanitizeInlineContent(value, state);
  if (inlineContent) return inlineContent;

  for (const child of asArray(value)) {
    const node = asNode(child);
    if (!node) continue;

    if (INLINE_NODE_TYPES.has(node.type)) {
      const inlineNode = sanitizeInlineNode(node, state);
      if (inlineNode) return [inlineNode];
    }

    const nested = firstInlineContent(node.content, state, depth + 1);
    if (nested) return nested;
  }

  return undefined;
}

export function sanitizeTipTapInlineContent(
  value: unknown,
  { maxTextLength = DEFAULT_MAX_TEXT_LENGTH }: { maxTextLength?: number } = {},
): SafeTipTapNode[] {
  const node = asNode(value);
  if (!node) return [];

  const state: SanitizeState = { textRemaining: maxTextLength };
  if (INLINE_NODE_TYPES.has(node.type)) {
    const inlineNode = sanitizeInlineNode(node, state);
    return inlineNode ? [inlineNode] : [];
  }

  return firstInlineContent(node.content, state, 0) ?? [];
}

export function tipTapDocFromPlainText(text: string): TipTapDocJson {
  const inlineContent: TipTapNodeJson[] = [];
  const lines = text.split(/\r\n?|\n/g);

  lines.forEach((line, index) => {
    if (index > 0) inlineContent.push({ type: 'hardBreak' });
    if (line) inlineContent.push({ type: 'text', text: line });
  });

  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: inlineContent.length > 0 ? inlineContent : undefined,
      },
    ],
  };
}

export function richTextFromPlainText(text: string, html?: string): BuilderRichText {
  const richText: BuilderRichText = {
    format: BUILDER_RICH_TEXT_FORMAT,
    doc: tipTapDocFromPlainText(text),
    plainText: text,
  };

  if (html !== undefined) richText.html = html;
  return richText;
}

export function migrateLegacyTextToRichText(text: unknown): BuilderRichText {
  return richTextFromPlainText(normalizeText(text));
}

export function isBuilderRichText(value: unknown): value is BuilderRichText {
  return (
    isRecord(value) &&
    value.format === BUILDER_RICH_TEXT_FORMAT &&
    typeof value.plainText === 'string' &&
    'doc' in value
  );
}

export function getRichTextOrMigrateLegacy(content: {
  richText?: BuilderRichText | null;
  text?: string | null;
}): BuilderRichText {
  if (isBuilderRichText(content.richText)) return content.richText;
  return migrateLegacyTextToRichText(content.text);
}

export function extractPlainTextFromTipTapDoc(value: unknown): string {
  const doc = sanitizeTipTapDoc(value);
  if (!doc) return '';

  const parts: string[] = [];

  function visit(node: SafeTipTapNode, blockDepth: number): void {
    if (node.type === 'text') {
      parts.push(node.text ?? '');
      return;
    }

    if (node.type === 'hardBreak') {
      parts.push('\n');
      return;
    }

    const isBlock = node.type !== 'doc' && !INLINE_NODE_TYPES.has(node.type);
    if (isBlock && parts.length > 0 && parts[parts.length - 1] !== '\n') {
      parts.push('\n');
    }

    node.content?.forEach((child) => visit(child, blockDepth + 1));

    if (isBlock && blockDepth <= 2 && parts.length > 0 && parts[parts.length - 1] !== '\n') {
      parts.push('\n');
    }
  }

  visit(doc, 0);
  return parts.join('').replace(/\n{3,}/g, '\n\n').trimEnd();
}

export type { TipTapMarkJson, TipTapNodeJson };
