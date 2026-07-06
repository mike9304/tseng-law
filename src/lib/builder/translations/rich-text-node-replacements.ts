import type { SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import {
  isBoundarySeparatorText,
  splitTextBySourceSegments,
  toReplacementSegment,
  type SourceTextSegment,
  type TextReplacementSegment,
} from './rich-text-boundary-segments';

type TextLineProfile = {
  readonly textNodes: readonly SourceTextSegment[];
};

function toSourceTextSegment(node: SafeTipTapNode): SourceTextSegment {
  const text = node.text ?? '';
  return {
    text,
    isBoundarySeparator: (node.marks?.length ?? 0) === 0 && isBoundarySeparatorText(text),
  };
}

function collectTextNodeCount(node: SafeTipTapNode): number {
  const ownCount = node.type === 'text' ? 1 : 0;
  return ownCount + (node.content ?? []).reduce((sum, child) => sum + collectTextNodeCount(child), 0);
}

function collectTextNodeProfiles(node: SafeTipTapNode): SourceTextSegment[] {
  const childProfiles = (node.content ?? []).flatMap((child) => collectTextNodeProfiles(child));
  if (node.type !== 'text') return childProfiles;
  return [toSourceTextSegment(node), ...childProfiles];
}

function collectHardBreakCount(node: SafeTipTapNode): number {
  const ownCount = node.type === 'hardBreak' ? 1 : 0;
  return ownCount + (node.content ?? []).reduce((sum, child) => sum + collectHardBreakCount(child), 0);
}

function collectInlineTextLineProfiles(nodes: readonly SafeTipTapNode[] | undefined): TextLineProfile[] {
  const textNodes: SourceTextSegment[][] = [[]];

  for (const node of nodes ?? []) {
    if (node.type === 'hardBreak') {
      textNodes.push([]);
      continue;
    }

    if (node.type === 'text') {
      const currentLine = textNodes.at(-1);
      if (currentLine) currentLine.push(toSourceTextSegment(node));
    }
  }

  return textNodes.map((lineTextNodes) => ({ textNodes: lineTextNodes }));
}

function collectTextLineProfiles(node: SafeTipTapNode): TextLineProfile[] {
  if (node.type === 'paragraph' || node.type === 'heading') {
    return collectInlineTextLineProfiles(node.content);
  }

  return (node.content ?? []).flatMap((child) => collectTextLineProfiles(child));
}

function replaceTextNodeWithSegment(
  node: SafeTipTapNode,
  segment: TextReplacementSegment,
): SafeTipTapNode[] {
  if ('drop' in segment) return [];

  const textNode = { ...node, text: segment.text };
  const nodes: SafeTipTapNode[] = [];
  if (segment.separatorBefore) nodes.push({ type: 'text', text: segment.separatorBefore });
  nodes.push(textNode);
  if (segment.separatorAfter) nodes.push({ type: 'text', text: segment.separatorAfter });
  return nodes;
}

function replaceTextNodeTree(
  node: SafeTipTapNode,
  segments: readonly TextReplacementSegment[],
  cursor: { index: number },
): SafeTipTapNode[] {
  if (node.type === 'text') {
    const segment = segments[cursor.index] ?? toReplacementSegment('');
    cursor.index += 1;
    return replaceTextNodeWithSegment(node, segment);
  }

  const content = node.content?.flatMap((child) => replaceTextNodeTree(child, segments, cursor));
  return [content ? { ...node, content } : node];
}

function replaceTextNodes(
  node: SafeTipTapNode,
  segments: readonly TextReplacementSegment[],
  cursor: { index: number },
): SafeTipTapNode {
  const nodes = replaceTextNodeTree(node, segments, cursor);
  return nodes[0] ?? node;
}

function splitTextByLineProfiles(
  textSegments: readonly string[],
  lineProfiles: readonly TextLineProfile[],
): TextReplacementSegment[] | null {
  if (lineProfiles.length < 2 || lineProfiles.length !== textSegments.length) return null;

  const segments: TextReplacementSegment[] = [];
  for (let index = 0; index < lineProfiles.length; index += 1) {
    const textSegment = textSegments[index];
    const profile = lineProfiles[index];
    if (textSegment === undefined || profile === undefined) return null;

    if (profile.textNodes.length === 0) {
      if (textSegment.length !== 0) return null;
      continue;
    }

    const textNodeSegments =
      profile.textNodes.length === 1
        ? [toReplacementSegment(textSegment)]
        : splitTextBySourceSegments(textSegment, profile.textNodes);
    if (!textNodeSegments) return null;
    segments.push(...textNodeSegments);
  }

  return segments;
}

export function replaceRichTextNodePlainText(
  sanitizedDoc: SafeTipTapNode,
  text: string,
): SafeTipTapNode | null {
  const segments = text.split(/\r\n?|\n/g);
  const nonEmptySegments = segments.filter((segment) => segment.length > 0);
  const textNodeCount = collectTextNodeCount(sanitizedDoc);
  const hardBreakCount = collectHardBreakCount(sanitizedDoc);
  const lineProfiles = collectTextLineProfiles(sanitizedDoc);
  const hardBreaks = Math.max(segments.length - 1, 0);

  if (textNodeCount === nonEmptySegments.length && hardBreakCount === hardBreaks) {
    return replaceTextNodes(sanitizedDoc, nonEmptySegments.map(toReplacementSegment), { index: 0 });
  }

  const lineSegments =
    hardBreaks === lineProfiles.length - 1
      ? splitTextByLineProfiles(segments, lineProfiles)
      : null;
  if (lineSegments && lineSegments.length === textNodeCount) {
    return replaceTextNodes(sanitizedDoc, lineSegments, { index: 0 });
  }

  if (hardBreakCount !== 0 || hardBreaks !== 0 || nonEmptySegments.length !== 1) {
    return null;
  }

  const inlineSegments = splitTextBySourceSegments(text, collectTextNodeProfiles(sanitizedDoc));
  if (!inlineSegments || inlineSegments.length !== textNodeCount) return null;

  return replaceTextNodes(sanitizedDoc, inlineSegments, { index: 0 });
}
