import { describe, expect, it } from 'vitest';
import { scanFormUpload } from '@/lib/builder/forms/uploads';

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
      error: 'SVG 파일에 허용되지 않는 스크립트가 포함되어 있습니다.',
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
});
