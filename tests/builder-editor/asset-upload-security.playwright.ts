import { expect, test, type Page } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

function pngWithSize(bytes: number): Buffer {
  if (bytes <= tinyPng.length) return tinyPng;
  return Buffer.concat([tinyPng, Buffer.alloc(bytes - tinyPng.length)]);
}

async function upload(page: Page, name: string, mimeType: string, buffer: Buffer) {
  return page.request.post('/api/builder/assets?locale=ko', {
    timeout: 60_000,
    multipart: {
      file: {
        name,
        mimeType,
        buffer,
      },
    },
  });
}

async function deleteAsset(page: Page, filename: string): Promise<void> {
  await page.request.delete('/api/builder/assets?locale=ko', {
    timeout: 30_000,
    data: { locale: 'ko', filename },
  }).catch(() => undefined);
}

test('builder asset upload accepts real PNG and rejects spoofed or oversized files', async ({ page }) => {
  const uploaded: string[] = [];
  try {
    const ok = await upload(page, 'm03-valid.png', 'image/png', pngWithSize(1024 * 1024));
    expect(ok.status()).toBe(200);
    const okPayload = await ok.json() as { ok?: boolean; asset?: { filename?: string }; error?: string };
    expect(okPayload.ok, okPayload.error).toBe(true);
    expect(okPayload.asset?.filename).toBeTruthy();
    uploaded.push(okPayload.asset!.filename!);

    const spoofed = await upload(page, 'm03-spoofed.png', 'image/png', Buffer.from('MZ'.padEnd(128 * 1024, '\0')));
    expect(spoofed.status()).toBe(415);
    await expect(spoofed.json()).resolves.toMatchObject({
      ok: false,
      code: 'unsupported_media',
    });

    const tooLarge = await upload(page, 'm03-too-large.png', 'image/png', pngWithSize(11 * 1024 * 1024));
    expect(tooLarge.status()).toBe(413);
    await expect(tooLarge.json()).resolves.toMatchObject({
      ok: false,
      code: 'payload_too_large',
    });
  } finally {
    await Promise.all(uploaded.map((filename) => deleteAsset(page, filename)));
  }
});
