export type RichTextReviewSignal =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'orderedList'
  | 'bulletList'
  | 'heading'
  | 'blockquote'
  | 'hardBreak';

export interface RichTextReviewSummary {
  readonly blockCount: number;
  readonly hardBreakCount: number;
  readonly linkCount: number;
  readonly listCount: number;
  readonly markedRunCount: number;
  readonly maxListDepth: number;
  readonly signals: readonly RichTextReviewSignal[];
  readonly textRunCount: number;
}
