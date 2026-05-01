import { z } from 'zod';

export const BUILDER_RICH_TEXT_FORMAT = 'tiptap-json' as const;

export interface TipTapMarkJson {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TipTapNodeJson {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNodeJson[];
  text?: string;
  marks?: TipTapMarkJson[];
}

export interface TipTapDocJson extends TipTapNodeJson {
  type: 'doc';
}

export function createBuilderRichTextSchema({
  maxPlainTextLength = 20_000,
  maxHtmlLength = 80_000,
}: {
  maxPlainTextLength?: number;
  maxHtmlLength?: number;
} = {}) {
  return z
    .object({
      format: z.literal(BUILDER_RICH_TEXT_FORMAT),
      doc: z.unknown(),
      plainText: z.string().max(maxPlainTextLength),
      html: z.string().max(maxHtmlLength).optional(),
    })
    .strict();
}

export const builderRichTextSchema = createBuilderRichTextSchema();

export type BuilderRichText = z.infer<typeof builderRichTextSchema>;

