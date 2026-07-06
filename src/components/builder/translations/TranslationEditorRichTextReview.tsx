import type { Locale } from '@/lib/locales';
import { sanitizeTipTapDoc, type SafeTipTapMark, type SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import { getRichTextReviewCopy } from './TranslationEditorRichTextReview.copy';
import type {
  RichTextReviewSignal,
  RichTextReviewSummary,
} from './TranslationEditorRichTextReview.types';

interface RichTextVisitState {
  blockCount: number;
  hardBreakCount: number;
  linkCount: number;
  listCount: number;
  markedRunCount: number;
  maxListDepth: number;
  textRunCount: number;
  signals: Set<RichTextReviewSignal>;
}

interface TranslationEditorRichTextReviewProps {
  readonly locale: Locale;
  readonly nodeId: string;
  readonly richText?: BuilderRichText | null;
}

const SIGNAL_ORDER: readonly RichTextReviewSignal[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'link',
  'orderedList',
  'bulletList',
  'heading',
  'blockquote',
  'hardBreak',
];

function assertNever(value: never): never {
  throw new Error(`Unhandled rich-text review node: ${value}`);
}

function countMark(mark: SafeTipTapMark, state: RichTextVisitState): void {
  switch (mark.type) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strike':
    case 'code':
      state.signals.add(mark.type);
      return;
    case 'link':
      state.linkCount += 1;
      state.signals.add('link');
      return;
    default:
      assertNever(mark.type);
  }
}

function visitNode(node: SafeTipTapNode, state: RichTextVisitState, listDepth: number): void {
  switch (node.type) {
    case 'doc':
      node.content?.forEach((child) => visitNode(child, state, listDepth));
      return;
    case 'paragraph':
    case 'listItem':
      state.blockCount += 1;
      node.content?.forEach((child) => visitNode(child, state, listDepth));
      return;
    case 'heading':
      state.blockCount += 1;
      state.signals.add('heading');
      node.content?.forEach((child) => visitNode(child, state, listDepth));
      return;
    case 'blockquote':
      state.blockCount += 1;
      state.signals.add('blockquote');
      node.content?.forEach((child) => visitNode(child, state, listDepth));
      return;
    case 'bulletList':
    case 'orderedList': {
      const nextDepth = listDepth + 1;
      state.blockCount += 1;
      state.listCount += 1;
      state.maxListDepth = Math.max(state.maxListDepth, nextDepth);
      state.signals.add(node.type);
      node.content?.forEach((child) => visitNode(child, state, nextDepth));
      return;
    }
    case 'hardBreak':
      state.hardBreakCount += 1;
      state.signals.add('hardBreak');
      return;
    case 'text':
      state.textRunCount += 1;
      if (node.marks && node.marks.length > 0) {
        state.markedRunCount += 1;
        node.marks.forEach((mark) => countMark(mark, state));
      }
      return;
    default:
      assertNever(node.type);
  }
}

export function summarizeRichTextReview(richText: BuilderRichText | null | undefined): RichTextReviewSummary | null {
  const doc = sanitizeTipTapDoc(richText?.doc);
  if (!doc) return null;

  const state: RichTextVisitState = {
    blockCount: 0,
    hardBreakCount: 0,
    linkCount: 0,
    listCount: 0,
    markedRunCount: 0,
    maxListDepth: 0,
    textRunCount: 0,
    signals: new Set<RichTextReviewSignal>(),
  };
  visitNode(doc, state, 0);

  if (state.signals.size === 0) return null;
  return {
    blockCount: state.blockCount,
    hardBreakCount: state.hardBreakCount,
    linkCount: state.linkCount,
    listCount: state.listCount,
    markedRunCount: state.markedRunCount,
    maxListDepth: state.maxListDepth,
    signals: SIGNAL_ORDER.filter((signal) => state.signals.has(signal)),
    textRunCount: state.textRunCount,
  };
}

export function TranslationEditorRichTextReview({
  locale,
  nodeId,
  richText,
}: TranslationEditorRichTextReviewProps) {
  const summary = summarizeRichTextReview(richText);
  if (!summary) return null;

  const copy = getRichTextReviewCopy(locale);
  return (
    <div
      data-translation-rich-text-review={nodeId}
      data-translation-rich-text-list-depth={summary.maxListDepth}
      style={{ marginTop: 8, border: '1px solid #dbeafe', borderRadius: 6, background: '#eff6ff', padding: 8 }}
    >
      <strong style={{ display: 'block', fontSize: 12, color: '#1e3a8a' }}>{copy.title}</strong>
      <span style={{ display: 'block', marginTop: 2, fontSize: 11, color: '#1d4ed8' }}>{copy.summary(summary)}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
        {summary.signals.map((signal) => (
          <span
            key={signal}
            data-translation-rich-text-signal={signal}
            style={{
              border: '1px solid #bfdbfe',
              borderRadius: 999,
              background: '#fff',
              color: '#1e40af',
              fontSize: 11,
              lineHeight: 1.4,
              padding: '2px 6px',
            }}
          >
            {copy.signal[signal]}
          </span>
        ))}
      </div>
    </div>
  );
}
