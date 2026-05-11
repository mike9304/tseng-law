import { z } from 'zod';

/**
 * PR #9 — Email template model.
 *
 * Templates are sequences of blocks rendered to email-safe HTML by the
 * renderer. The model is intentionally small (heading/text/button/image/
 * divider/spacer) so the output is reliable across email clients. Variable
 * placeholders use the same `{{var}}` convention as campaign-renderer.
 */

export type EmailBlockKind = 'heading' | 'text' | 'button' | 'image' | 'divider' | 'spacer';

interface BaseBlock {
  blockId: string;
  kind: EmailBlockKind;
}

export interface HeadingBlock extends BaseBlock {
  kind: 'heading';
  text: string;
  level?: 1 | 2 | 3;
  align?: 'left' | 'center';
}

export interface TextBlock extends BaseBlock {
  kind: 'text';
  text: string;
}

export interface ButtonBlock extends BaseBlock {
  kind: 'button';
  label: string;
  href: string;
  background?: string;
  textColor?: string;
}

export interface ImageBlock extends BaseBlock {
  kind: 'image';
  src: string;
  alt?: string;
  width?: number;
}

export interface DividerBlock extends BaseBlock {
  kind: 'divider';
  color?: string;
}

export interface SpacerBlock extends BaseBlock {
  kind: 'spacer';
  height: number;
}

export type EmailBlock = HeadingBlock | TextBlock | ButtonBlock | ImageBlock | DividerBlock | SpacerBlock;

export interface EmailTemplate {
  templateId: string;
  name: string;
  description?: string;
  /** Optional category for grouping (booking/marketing/transactional/etc.). */
  category?: string;
  blocks: EmailBlock[];
  /** Wrapper background color shown around the 600px column. */
  pageBackground: string;
  /** Color of the 600px content column. */
  contentBackground: string;
  createdAt: string;
  updatedAt: string;
}

const blockBase = {
  blockId: z.string().trim().min(1).max(80),
};

const headingSchema = z.object({
  ...blockBase,
  kind: z.literal('heading'),
  text: z.string().trim().min(1).max(500),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  align: z.enum(['left', 'center']).optional(),
});
const textSchema = z.object({
  ...blockBase,
  kind: z.literal('text'),
  text: z.string().trim().min(1).max(4000),
});
const buttonSchema = z.object({
  ...blockBase,
  kind: z.literal('button'),
  label: z.string().trim().min(1).max(120),
  href: z.string().trim().url().max(2000),
  background: z.string().max(40).optional(),
  textColor: z.string().max(40).optional(),
});
const imageSchema = z.object({
  ...blockBase,
  kind: z.literal('image'),
  src: z.string().trim().url().max(2000),
  alt: z.string().max(200).optional(),
  width: z.number().int().min(40).max(800).optional(),
});
const dividerSchema = z.object({ ...blockBase, kind: z.literal('divider'), color: z.string().max(40).optional() });
const spacerSchema = z.object({ ...blockBase, kind: z.literal('spacer'), height: z.number().int().min(4).max(120) });

export const blockSchema = z.discriminatedUnion('kind', [
  headingSchema,
  textSchema,
  buttonSchema,
  imageSchema,
  dividerSchema,
  spacerSchema,
]);

export const templateCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional(),
  category: z.string().trim().max(80).optional(),
  blocks: z.array(blockSchema).max(60).default([]),
  pageBackground: z.string().max(40).default('#f1f5f9'),
  contentBackground: z.string().max(40).default('#ffffff'),
});

export const templateUpdateSchema = templateCreateSchema.partial();
