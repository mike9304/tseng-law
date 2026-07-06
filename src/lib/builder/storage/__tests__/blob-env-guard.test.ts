import { describe, expect, it } from 'vitest';
import { decideBlobTokenStrip } from '../blob-env-guard';

const TOKEN = 'vercel_blob_rw_dummy';

describe('blob env guard (R5 deploy isolation)', () => {
  it('keeps the token on production Vercel deploys', () => {
    expect(
      decideBlobTokenStrip({ VERCEL_ENV: 'production', BLOB_READ_WRITE_TOKEN: TOKEN }).strip,
    ).toBe(false);
  });

  it('keeps the token outside Vercel (local dev, self-hosted)', () => {
    expect(decideBlobTokenStrip({ BLOB_READ_WRITE_TOKEN: TOKEN }).strip).toBe(false);
    expect(decideBlobTokenStrip({ VERCEL_ENV: '', BLOB_READ_WRITE_TOKEN: TOKEN }).strip).toBe(false);
  });

  it('does nothing when no token is configured', () => {
    expect(decideBlobTokenStrip({ VERCEL_ENV: 'preview' }).strip).toBe(false);
  });

  it('strips the token on preview and development Vercel deploys', () => {
    expect(
      decideBlobTokenStrip({ VERCEL_ENV: 'preview', BLOB_READ_WRITE_TOKEN: TOKEN }).strip,
    ).toBe(true);
    expect(
      decideBlobTokenStrip({ VERCEL_ENV: 'development', BLOB_READ_WRITE_TOKEN: TOKEN }).strip,
    ).toBe(true);
  });

  it('honors the BUILDER_USE_BLOB_IN_PREVIEW=1 opt-in', () => {
    expect(
      decideBlobTokenStrip({
        VERCEL_ENV: 'preview',
        BLOB_READ_WRITE_TOKEN: TOKEN,
        BUILDER_USE_BLOB_IN_PREVIEW: '1',
      }).strip,
    ).toBe(false);
    expect(
      decideBlobTokenStrip({
        VERCEL_ENV: 'preview',
        BLOB_READ_WRITE_TOKEN: TOKEN,
        BUILDER_USE_BLOB_IN_PREVIEW: '0',
      }).strip,
    ).toBe(true);
  });
});
