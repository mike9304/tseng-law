import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildFormUploadUrl,
  saveFormUpload,
  scanFormUpload,
  verifyFormUploadSignature,
} from '@/lib/builder/forms/uploads';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('form upload scanning', () => {
  it('rejects image files whose bytes do not match the extension', () => {
    const result = scanFormUpload({
      content: Buffer.from('not a png'),
      contentType: 'image/png',
      extension: '.png',
      filename: 'fake.png',
    });

    expect(result).toMatchObject({
      ok: false,
      error: '파일 내용이 확장자와 일치하지 않습니다.',
    });
  });

  it('rejects SVG uploads with script content', () => {
    const result = scanFormUpload({
      content: Buffer.from('<svg><script>alert(1)</script></svg>'),
      contentType: 'image/svg+xml',
      extension: '.svg',
      filename: 'unsafe.svg',
    });

    expect(result).toMatchObject({
      ok: false,
      error: 'SVG 파일에 허용되지 않는 활성 또는 외부 콘텐츠가 포함되어 있습니다.',
    });
  });

  it('rejects valid PNG bytes when the claimed MIME type is text/html', () => {
    const result = scanFormUpload({
      content: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]),
      contentType: 'text/html',
      extension: '.png',
      filename: 'payload.png',
    });

    expect(result).toMatchObject({
      ok: false,
      error: '파일의 MIME 형식이 확장자와 일치하지 않습니다.',
    });
  });

  it('rejects a MIME-confused File before any upload storage path is used', async () => {
    const file = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'payload.png',
      { type: 'text/html' },
    );

    await expect(saveFormUpload({ fieldId: 'attachment', file, locale: 'ko' }))
      .rejects.toThrow('파일의 MIME 형식이 확장자와 일치하지 않습니다.');
  });

  it.each([
    '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.example/pixel.png"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><iframe src="https://evil.example"/></foreignObject></svg>',
  ])('rejects SVG active or external content: %s', (source) => {
    const result = scanFormUpload({
      content: Buffer.from(source),
      contentType: 'image/svg+xml',
      extension: '.svg',
      filename: 'unsafe.svg',
    });

    expect(result).toMatchObject({
      ok: false,
      error: 'SVG 파일에 허용되지 않는 활성 또는 외부 콘텐츠가 포함되어 있습니다.',
    });
  });

  it('keeps a benign self-contained SVG with fragment references', () => {
    const result = scanFormUpload({
      content: Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g"/></defs><rect fill="url(#g)"/><use href="#g"/></svg>',
      ),
      contentType: 'image/svg+xml',
      extension: '.svg',
      filename: 'safe.svg',
    });

    expect(result.ok).toBe(true);
  });

  it('checks legacy DOC and DOCX container signatures', () => {
    const validDoc = scanFormUpload({
      content: Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
      contentType: 'application/msword',
      extension: '.doc',
      filename: 'legacy.doc',
    });
    const invalidDocx = scanFormUpload({
      content: Buffer.from('not a zip'),
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: '.docx',
      filename: 'fake.docx',
    });

    expect(validDoc.ok).toBe(true);
    expect(invalidDocx).toMatchObject({
      ok: false,
      error: '파일 내용이 확장자와 일치하지 않습니다.',
    });
  });

  it('returns scan metadata for valid uploads', () => {
    const result = scanFormUpload({
      content: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]),
      contentType: 'image/png',
      extension: '.png',
      filename: 'safe.png',
    });

    expect(result).toMatchObject({
      ok: true,
      result: {
        status: 'passed',
        provider: 'local-upload-scan',
        issues: [],
      },
    });
  });

  it('builds a short-lived signature bound to the normalized upload address', () => {
    vi.stubEnv('FORM_UPLOAD_SIGNING_SECRET', 'form-upload-test-secret');
    const nowMs = Date.parse('2026-07-30T00:00:00.000Z');
    const url = buildFormUploadUrl('KO', 'case-file-1234.pdf', { nowMs });
    const parsed = new URL(url, 'https://tseng-law.com');

    expect(parsed.pathname).toBe('/api/forms/uploads/ko/case-file-1234.pdf');
    expect(verifyFormUploadSignature({
      locale: 'ko',
      filename: 'case-file-1234.pdf',
      expires: parsed.searchParams.get('expires'),
      signature: parsed.searchParams.get('signature'),
    }, { nowMs })).toBe(true);
    expect(verifyFormUploadSignature({
      locale: 'en',
      filename: 'case-file-1234.pdf',
      expires: parsed.searchParams.get('expires'),
      signature: parsed.searchParams.get('signature'),
    }, { nowMs })).toBe(false);
  });

  it('fails closed in production when no signing secret or safe fallback exists', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('FORM_UPLOAD_SIGNING_SECRET', '');
    vi.stubEnv('BUILDER_ADMIN_SESSION_SECRET', '');
    vi.stubEnv('NEXTAUTH_SECRET', '');
    vi.stubEnv('CMS_SESSION_SECRET', '');

    expect(() => buildFormUploadUrl('ko', 'case-file-1234.pdf')).toThrow(
      'FORM_UPLOAD_SIGNING_SECRET is required in production.',
    );
  });
});
