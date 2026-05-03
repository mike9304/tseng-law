import { describe, expect, it } from 'vitest';
import {
  validateUploadFile,
  validateUploadUrl,
  sniffImageMagicBytes,
  validateImageBytes,
  ALLOWED_IMAGE_TYPES,
} from '@/lib/builder/canvas/upload-validation';

function makeFile(bytes: number[], name: string, type: string): File {
  const u8 = new Uint8Array(bytes);
  return new File([u8], name, { type });
}

describe('validateUploadFile', () => {
  it('rejects unknown MIME', () => {
    const file = new File(['x'], 'evil.exe', { type: 'application/x-msdownload' });
    expect(validateUploadFile(file).valid).toBe(false);
  });

  it('accepts allowed image MIME + extension', () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    expect(validateUploadFile(file).valid).toBe(true);
  });

  it('rejects oversized file (>10MB)', () => {
    const big = new File([new Uint8Array(11 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    expect(validateUploadFile(big).valid).toBe(false);
  });

  it('rejects unreasonably long filename', () => {
    const file = new File(['x'], 'a'.repeat(201) + '.png', { type: 'image/png' });
    expect(validateUploadFile(file).valid).toBe(false);
  });
});

describe('validateUploadUrl', () => {
  it('accepts http/https', () => {
    expect(validateUploadUrl('https://example.com/image.png').valid).toBe(true);
    expect(validateUploadUrl('http://example.com/x.jpg').valid).toBe(true);
  });

  it('rejects javascript: protocol', () => {
    expect(validateUploadUrl('javascript:alert(1)').valid).toBe(false);
  });

  it('rejects empty / invalid url', () => {
    expect(validateUploadUrl('').valid).toBe(false);
    expect(validateUploadUrl('not a url').valid).toBe(false);
  });
});

describe('sniffImageMagicBytes', () => {
  it.each([
    ['JPEG', [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10], 'jpeg'],
    ['PNG',  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'png'],
    ['GIF87a', [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], 'gif'],
    ['GIF89a', [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], 'gif'],
    ['WebP',
      [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50],
      'webp',
    ],
    ['AVIF (avif)',
      [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66],
      'avif',
    ],
    ['AVIF (mif1)',
      [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x69, 0x66, 0x31],
      'avif',
    ],
  ])('detects %s', (_label, bytes, expected) => {
    expect(sniffImageMagicBytes(new Uint8Array(bytes as number[]))).toBe(expected);
  });

  it('detects SVG (text-based)', () => {
    const bytes = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(sniffImageMagicBytes(bytes)).toBe('svg');
  });

  it('detects xml-prefixed SVG', () => {
    const bytes = new TextEncoder().encode('<?xml version="1.0"?><svg></svg>');
    expect(sniffImageMagicBytes(bytes)).toBe('svg');
  });

  it('returns "unknown" for random bytes', () => {
    expect(sniffImageMagicBytes(new Uint8Array([0x00, 0x01, 0x02, 0x03]))).toBe('unknown');
  });

  it('returns "unknown" for empty / too-short buffer', () => {
    expect(sniffImageMagicBytes(new Uint8Array([0xff]))).toBe('unknown');
    expect(sniffImageMagicBytes(new Uint8Array([]))).toBe('unknown');
  });
});

describe('validateImageBytes', () => {
  it('passes when MIME and signature match (PNG)', async () => {
    const file = makeFile(
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      'a.png',
      'image/png',
    );
    const result = await validateImageBytes(file);
    expect(result.valid).toBe(true);
    expect(result.sniffed).toBe('png');
  });

  it('rejects MIME-vs-signature mismatch (jpeg claimed, png actual)', async () => {
    const file = makeFile(
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      'fake.jpg',
      'image/jpeg',
    );
    const result = await validateImageBytes(file);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/일치하지 않/);
  });

  it('rejects unknown signature', async () => {
    const file = makeFile([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07], 'bad.png', 'image/png');
    const result = await validateImageBytes(file);
    expect(result.valid).toBe(false);
    expect(result.sniffed).toBe('unknown');
  });

  it('rejects unsupported MIME', async () => {
    const file = makeFile(
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0],
      'a.bmp',
      'image/bmp',
    );
    const result = await validateImageBytes(file);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/허용되지 않/);
  });
});

describe('ALLOWED_IMAGE_TYPES coverage', () => {
  it('contains all expected MIME types', () => {
    for (const m of [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/avif',
    ]) {
      expect(ALLOWED_IMAGE_TYPES.has(m)).toBe(true);
    }
  });
});
