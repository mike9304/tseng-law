import {
  isBuilderRichText,
  richTextFromPlainText,
  sanitizeTipTapDoc,
} from '@/lib/builder/rich-text/sanitize';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import { replaceRichTextNodePlainText } from '@/lib/builder/translations/rich-text-node-replacements';

function tryReplaceRichTextPlainText(
  richText: BuilderRichText | null | undefined,
  text: string,
): BuilderRichText | null {
  if (!isBuilderRichText(richText)) return null;

  const sanitizedDoc = sanitizeTipTapDoc(richText.doc);
  if (!sanitizedDoc) return null;
  const doc = replaceRichTextNodePlainText(sanitizedDoc, text);
  if (!doc) return null;

  return {
    format: richText.format,
    doc,
    plainText: text,
  };
}

export function replaceRichTextPlainText(
  richText: BuilderRichText | null | undefined,
  text: string,
): BuilderRichText {
  return tryReplaceRichTextPlainText(richText, text) ?? richTextFromPlainText(text);
}

export function richTextWithFallback(
  primary: BuilderRichText | null | undefined,
  fallback: BuilderRichText | null | undefined,
  text: string,
): BuilderRichText {
  return (
    tryReplaceRichTextPlainText(primary, text) ??
    tryReplaceRichTextPlainText(fallback, text) ??
    richTextFromPlainText(text)
  );
}
