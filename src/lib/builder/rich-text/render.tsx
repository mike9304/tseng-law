import type { ReactNode } from 'react';
import type { BuilderRichText } from './types';
import {
  richTextFromPlainText,
  sanitizeTipTapDoc,
  sanitizeTipTapInlineContent,
  type SafeTipTapMark,
  type SafeTipTapNode,
} from './sanitize';

export interface RenderRichTextOptions {
  fallbackText?: string;
  mode?: 'block' | 'heading';
  maxTextLength?: number;
}

export interface RichTextRendererProps extends RenderRichTextOptions {
  richText?: BuilderRichText | null;
}

function renderMarks(child: ReactNode, marks: SafeTipTapMark[] | undefined, key: string): ReactNode {
  if (!marks || marks.length === 0) return child;

  return marks.reduce<ReactNode>((current, mark, index) => {
    const markKey = `${key}-mark-${index}`;

    if (mark.type === 'bold') return <strong key={markKey}>{current}</strong>;
    if (mark.type === 'italic') return <em key={markKey}>{current}</em>;
    if (mark.type === 'underline') return <u key={markKey}>{current}</u>;
    if (mark.type === 'strike') return <s key={markKey}>{current}</s>;
    if (mark.type === 'code') return <code key={markKey}>{current}</code>;

    if (mark.type === 'link' && mark.attrs?.href) {
      const target = mark.attrs.target;
      return (
        <a
          key={markKey}
          href={mark.attrs.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          title={mark.attrs.title}
        >
          {current}
        </a>
      );
    }

    return current;
  }, child);
}

function renderInlineNode(node: SafeTipTapNode, key: string): ReactNode {
  if (node.type === 'text') return renderMarks(node.text ?? '', node.marks, key);
  if (node.type === 'hardBreak') return <br key={key} />;
  return null;
}

function renderInlineContent(nodes: SafeTipTapNode[] | undefined, keyPrefix: string): ReactNode[] {
  return (nodes ?? [])
    .map((node, index) => renderInlineNode(node, `${keyPrefix}-${index}`))
    .filter((node): node is ReactNode => node !== null && node !== undefined);
}

function renderBlockNode(node: SafeTipTapNode, key: string): ReactNode {
  if (node.type === 'paragraph') {
    return <p key={key}>{renderInlineContent(node.content, key)}</p>;
  }

  if (node.type === 'heading') {
    const level = node.attrs?.level ?? 2;
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag key={key}>{renderInlineContent(node.content, key)}</Tag>;
  }

  if (node.type === 'bulletList') {
    return <ul key={key}>{renderBlockContent(node.content, key)}</ul>;
  }

  if (node.type === 'orderedList') {
    return (
      <ol key={key} start={node.attrs?.start}>
        {renderBlockContent(node.content, key)}
      </ol>
    );
  }

  if (node.type === 'listItem') {
    return <li key={key}>{renderBlockContent(node.content, key)}</li>;
  }

  if (node.type === 'blockquote') {
    return <blockquote key={key}>{renderBlockContent(node.content, key)}</blockquote>;
  }

  return renderInlineNode(node, key);
}

function renderBlockContent(nodes: SafeTipTapNode[] | undefined, keyPrefix: string): ReactNode[] {
  return (nodes ?? [])
    .map((node, index) => renderBlockNode(node, `${keyPrefix}-${index}`))
    .filter((node): node is ReactNode => node !== null && node !== undefined);
}

export function renderRichText(
  richText: BuilderRichText | null | undefined,
  {
    fallbackText = '',
    mode = 'block',
    maxTextLength,
  }: RenderRichTextOptions = {},
): ReactNode {
  const source = richText ?? richTextFromPlainText(fallbackText);
  const fallback = fallbackText || source.plainText;

  if (mode === 'heading') {
    const inlineContent = sanitizeTipTapInlineContent(source.doc, { maxTextLength });
    return inlineContent.length > 0
      ? <>{renderInlineContent(inlineContent, 'rich-heading')}</>
      : fallback;
  }

  const doc = sanitizeTipTapDoc(source.doc, { maxTextLength });
  if (!doc?.content) {
    return fallback ? <p>{fallback}</p> : null;
  }

  return <>{renderBlockContent(doc.content, 'rich-block')}</>;
}

export function RichTextRenderer({
  richText,
  fallbackText,
  mode,
  maxTextLength,
}: RichTextRendererProps): ReactNode {
  return renderRichText(richText, { fallbackText, mode, maxTextLength });
}
