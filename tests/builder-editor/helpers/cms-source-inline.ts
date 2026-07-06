import { expect, type Page } from '@playwright/test';
import { z } from 'zod';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

const uploadedAssetSchema = z.object({
  filename: z.string(),
  url: z.string(),
});

const assetUploadPayloadSchema = z.object({
  ok: z.boolean().optional(),
  asset: uploadedAssetSchema.optional(),
  error: z.string().optional(),
});

export const attorneyImagePayloadSchema = z.object({
  ok: z.boolean().optional(),
  record: z.object({
    image: z.string().optional(),
    imageAltText: z.string().optional(),
    imageFocalPoint: z.object({
      x: z.number().optional(),
      y: z.number().optional(),
    }).optional(),
  }).optional(),
  error: z.string().optional(),
});

type UploadedAsset = z.infer<typeof uploadedAssetSchema>;

export function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'cms-source-inline-edit';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

export async function uploadSourceAsset(page: Page, filename: string): Promise<UploadedAsset> {
  const response = await page.request.post('/api/builder/assets?locale=ko', {
    timeout: 120_000,
    multipart: {
      file: {
        name: filename,
        mimeType: 'image/png',
        buffer: tinyPng,
      },
    },
  });
  expect(response.status()).toBe(200);
  const payload = assetUploadPayloadSchema.parse(await response.json());
  expect(payload.ok, payload.error).toBe(true);
  if (!payload.asset) throw new Error('Asset upload returned no asset.');
  return payload.asset;
}

export async function deleteSourceAsset(page: Page, filename: string): Promise<void> {
  await page.request.delete('/api/builder/assets?locale=ko', {
    timeout: 60_000,
    data: { locale: 'ko', filename },
  });
}
