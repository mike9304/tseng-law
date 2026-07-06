import type { Locale } from '@/lib/locales';
import { sanitizeTipTapDoc, type SafeTipTapMark, type SafeTipTapNode } from '@/lib/builder/rich-text/sanitize';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import { getRichTextReviewCopy } from './TranslationEditorRichTextReview.copy';
import type { RichTextReviewSignal } from './TranslationEditorRichTextReview.types';

export interface RichTextLineSignalProfile {
  readonly lineIndex: number;
  readonly listDepth: number;
  readonly signals: readonly RichTextReviewSignal[];
}

interface SignalScope {
  readonly listDepth: number;
  readonly signals: ReadonlySet<RichTextReviewSignal>;
}

interface LineDraft {
  readonly listDepth: number;
  readonly signals: Set<RichTextReviewSignal>;
}

interface TranslationEditorSegmentSignalsProps {
  readonly locale: Locale;
  readonly nodeId: string;
  readonly profile: RichTextLineSignalProfile | undefined;
}

const LINE_SIGNAL_ORDER: readonly RichTextReviewSignal[] = [
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
  throw new Error(`Unhandled rich-text segment signal: ${value}`);
}

function scopeWithSignal(scope: SignalScope, signal: RichTextReviewSignal, listDepth = scope.listDepth): SignalScope {
  const signals = new Set(scope.signals);
  signals.add(signal);
  return { listDepth, signals };
}

function createLineDraft(scope: SignalScope): LineDraft {
  return { listDepth: scope.listDepth, signals: new Set(scope.signals) };
}

function addMarkSignal(mark: SafeTipTapMark, signals: Set<RichTextReviewSignal>): void {
  switch (mark.type) {
    case 'bold':
    case 'italic':
    case 'underline':
    case 'strike':
    case 'code':
      signals.add(mark.type);
      return;
    case 'link':
      signals.add('link');
      return;
    default:
      assertNever(mark.type);
  }
}

function collectInlineLineDrafts(
  nodes: readonly SafeTipTapNode[] | undefined,
  scope: SignalScope,
): readonly LineDraft[] {
  let current = createLineDraft(scope);
  const lines: LineDraft[] = [current];

  for (const node of nodes ?? []) {
    switch (node.type) {
      case 'text':
        node.marks?.forEach((mark) => addMarkSignal(mark, current.signals));
        break;
      case 'hardBreak':
        current.signals.add('hardBreak');
        current = createLineDraft(scope);
        lines.push(current);
        break;
      case 'doc':
      case 'paragraph':
      case 'heading':
      case 'bulletList':
      case 'orderedList':
      case 'listItem':
      case 'blockquote':
        break;
      default:
        assertNever(node.type);
    }
  }

  return lines;
}

function collectLineDrafts(node: SafeTipTapNode, profiles: LineDraft[], scope: SignalScope): void {
  switch (node.type) {
    case 'doc':
    case 'listItem':
      node.content?.forEach((child) => collectLineDrafts(child, profiles, scope));
      return;
    case 'paragraph':
      profiles.push(...collectInlineLineDrafts(node.content, scope));
      return;
    case 'heading':
      profiles.push(...collectInlineLineDrafts(node.content, scopeWithSignal(scope, 'heading')));
      return;
    case 'blockquote':
      node.content?.forEach((child) => collectLineDrafts(child, profiles, scopeWithSignal(scope, 'blockquote')));
      return;
    case 'bulletList':
    case 'orderedList': {
      const nextDepth = scope.listDepth + 1;
      const nextScope = scopeWithSignal(scope, node.type, nextDepth);
      node.content?.forEach((child) => collectLineDrafts(child, profiles, nextScope));
      return;
    }
    case 'text':
    case 'hardBreak':
      profiles.push(...collectInlineLineDrafts([node], scope));
      return;
    default:
      assertNever(node.type);
  }
}

export function buildRichTextLineSignalProfiles(
  richText: BuilderRichText | null | undefined,
): readonly RichTextLineSignalProfile[] {
  const doc = sanitizeTipTapDoc(richText?.doc);
  if (!doc) return [];

  const drafts: LineDraft[] = [];
  collectLineDrafts(doc, drafts, { listDepth: 0, signals: new Set<RichTextReviewSignal>() });
  return drafts.map((draft, index) => ({
    lineIndex: index + 1,
    listDepth: draft.listDepth,
    signals: LINE_SIGNAL_ORDER.filter((signal) => draft.signals.has(signal)),
  }));
}

export function TranslationEditorSegmentSignals({
  locale,
  nodeId,
  profile,
}: TranslationEditorSegmentSignalsProps) {
  if (!profile || profile.signals.length === 0) return null;

  const copy = getRichTextReviewCopy(locale);
  return (
    <span
      data-translation-segment-source-signals={`${nodeId}-${profile.lineIndex}`}
      data-translation-segment-source-list-depth={profile.listDepth}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}
    >
      {profile.signals.map((signal) => (
        <span
          key={signal}
          data-translation-segment-source-signal={`${nodeId}-${profile.lineIndex}-${signal}`}
          data-translation-segment-source-signal-kind={signal}
          style={{
            border: '1px solid #bfdbfe',
            borderRadius: 999,
            background: '#eff6ff',
            color: '#1e40af',
            fontSize: 11,
            lineHeight: 1.35,
            padding: '1px 6px',
          }}
        >
          {copy.signal[signal]}
        </span>
      ))}
    </span>
  );
}
