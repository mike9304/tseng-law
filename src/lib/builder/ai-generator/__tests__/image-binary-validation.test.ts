import { deflateSync, inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  inspectImageBinary,
  type ImageBinaryMime,
  type ImageBinaryValidationOptions,
  validatePngAlphaMask,
} from '../image-binary-validation';
import {
  createJpegFixture,
  createPngFixture,
  createWebpFixture,
  imageBytesToBase64,
} from './image-fixtures';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface PngChunkView {
  type: string;
  data: Buffer;
  offset: number;
  raw: Buffer;
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) === 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Buffer {
  const typeBytes = Buffer.from(type, 'ascii');
  const payload = Buffer.from(data);
  const chunk = Buffer.alloc(12 + payload.byteLength);
  chunk.writeUInt32BE(payload.byteLength, 0);
  typeBytes.copy(chunk, 4);
  payload.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBytes, payload])), 8 + payload.byteLength);
  return chunk;
}

function readPngChunks(bytes: Uint8Array): PngChunkView[] {
  const source = Buffer.from(bytes);
  const chunks: PngChunkView[] = [];
  let offset = PNG_SIGNATURE.byteLength;
  while (offset < source.byteLength) {
    const length = source.readUInt32BE(offset);
    const end = offset + 12 + length;
    chunks.push({
      type: source.toString('ascii', offset + 4, offset + 8),
      data: source.subarray(offset + 8, offset + 8 + length),
      offset,
      raw: source.subarray(offset, end),
    });
    offset = end;
  }
  return chunks;
}

function assemblePng(chunks: readonly Buffer[]): Uint8Array {
  return new Uint8Array(Buffer.concat([PNG_SIGNATURE, ...chunks]));
}

function replacePngChunk(bytes: Uint8Array, type: string, data: Uint8Array): Uint8Array {
  const chunks = readPngChunks(bytes).map((chunk) => (
    chunk.type === type ? pngChunk(type, data) : chunk.raw
  ));
  return assemblePng(chunks);
}

function findJpegMarker(bytes: Uint8Array, marker: number): number {
  return Buffer.from(bytes).indexOf(Buffer.from([0xff, marker]));
}

function removeJpegSegment(bytes: Uint8Array, marker: number): Uint8Array {
  const source = Buffer.from(bytes);
  const offset = findJpegMarker(source, marker);
  if (offset < 0) throw new Error(`JPEG marker ff${marker.toString(16)} not found`);
  const segmentLength = source.readUInt16BE(offset + 2) + 2;
  return new Uint8Array(Buffer.concat([
    source.subarray(0, offset),
    source.subarray(offset + segmentLength),
  ]));
}

interface WebpChunkView {
  type: string;
  size: number;
  offset: number;
  raw: Buffer;
}

function readWebpChunks(bytes: Uint8Array): WebpChunkView[] {
  const source = Buffer.from(bytes);
  const chunks: WebpChunkView[] = [];
  let offset = 12;
  while (offset < source.byteLength) {
    const size = source.readUInt32LE(offset + 4);
    const end = offset + 8 + size + (size & 1);
    chunks.push({
      type: source.toString('ascii', offset, offset + 4),
      size,
      offset,
      raw: source.subarray(offset, end),
    });
    offset = end;
  }
  return chunks;
}

function assembleWebp(chunks: readonly Buffer[]): Uint8Array {
  const payload = Buffer.concat([Buffer.from('WEBP', 'ascii'), ...chunks]);
  const header = Buffer.alloc(8);
  header.write('RIFF', 0, 4, 'ascii');
  header.writeUInt32LE(payload.byteLength, 4);
  return new Uint8Array(Buffer.concat([header, payload]));
}

function webpChunk(type: string, data: Uint8Array): Buffer {
  const payload = Buffer.from(data);
  const chunk = Buffer.alloc(8 + payload.byteLength + (payload.byteLength & 1), 0);
  chunk.write(type, 0, 4, 'ascii');
  chunk.writeUInt32LE(payload.byteLength, 4);
  payload.copy(chunk, 8);
  return chunk;
}

function fixtureMime(bytes: Uint8Array): ImageBinaryMime {
  if (Buffer.from(bytes.subarray(0, 8)).equals(PNG_SIGNATURE)) return 'image/png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
  return 'image/webp';
}

function expectInvalid(
  bytes: Uint8Array,
  options: Partial<ImageBinaryValidationOptions> = {},
): void {
  const result = inspectImageBinary(bytes, {
    declaredMime: fixtureMime(bytes),
    maxBytes: 16 * 1024 * 1024,
    maxPixels: 20_000_000,
    maxDecodedBytes: 128 * 1024 * 1024,
    ...options,
  });
  expect(result.valid, 'reason' in result ? result.reason : undefined).toBe(false);
  expect(result).toMatchObject({ valid: false, reason: expect.any(String) });
}

describe('image fixture builders', () => {
  it('encodes byte views without leaking bytes outside the view', () => {
    const backing = Uint8Array.from([0xaa, 0x10, 0x20, 0x30, 0xbb]);
    expect(imageBytesToBase64(backing.subarray(1, 4))).toBe('ECAw');
  });
});

describe('inspectImageBinary valid metadata', () => {
  it.each([
    { colorType: 0 as const, bitDepth: 8 as const, hasAlpha: false, decodedBytes: 35 },
    { colorType: 0 as const, bitDepth: 16 as const, hasAlpha: false, decodedBytes: 70 },
    { colorType: 2 as const, bitDepth: 8 as const, hasAlpha: false, decodedBytes: 105 },
    { colorType: 2 as const, bitDepth: 16 as const, hasAlpha: false, decodedBytes: 210 },
    { colorType: 4 as const, bitDepth: 8 as const, hasAlpha: true, decodedBytes: 70 },
    { colorType: 4 as const, bitDepth: 16 as const, hasAlpha: true, decodedBytes: 140 },
    { colorType: 6 as const, bitDepth: 8 as const, hasAlpha: true, decodedBytes: 140 },
    { colorType: 6 as const, bitDepth: 16 as const, hasAlpha: true, decodedBytes: 280 },
  ])('reads PNG color type $colorType at $bitDepth-bit', ({
    colorType,
    bitDepth,
    hasAlpha,
    decodedBytes,
  }) => {
    const bytes = createPngFixture({ width: 7, height: 5, colorType, bitDepth });
    expect(inspectImageBinary(bytes, { declaredMime: 'image/png' })).toEqual({
      valid: true,
      format: 'png',
      mime: 'image/png',
      width: 7,
      height: 5,
      hasAlpha,
      byteLength: bytes.byteLength,
      decodedBytes,
    });
  });

  it('reads a complete baseline JPEG', () => {
    const bytes = createJpegFixture({ width: 37, height: 19 });
    expect(inspectImageBinary(bytes, { declaredMime: 'image/jpeg' })).toEqual({
      valid: true,
      format: 'jpeg',
      mime: 'image/jpeg',
      width: 37,
      height: 19,
      hasAlpha: false,
      byteLength: bytes.byteLength,
      decodedBytes: 37 * 19,
    });
  });

  it.each([
    { format: 'vp8' as const, alpha: false },
    { format: 'vp8l' as const, alpha: false },
    { format: 'vp8l' as const, alpha: true },
    { format: 'vp8x' as const, alpha: false },
    { format: 'vp8x' as const, alpha: true },
  ])('reads a structurally complete WebP $format alpha=$alpha', ({ format, alpha }) => {
    const bytes = createWebpFixture({ width: 31, height: 17, format, alpha });
    expect(inspectImageBinary(bytes, { declaredMime: 'image/webp' })).toEqual({
      valid: true,
      format: 'webp',
      mime: 'image/webp',
      width: 31,
      height: 17,
      hasAlpha: alpha,
      byteLength: bytes.byteLength,
      decodedBytes: 31 * 17 * (alpha ? 4 : 3),
    });
  });

  it('recognizes a PNG tRNS transparency declaration', () => {
    const bytes = createPngFixture({
      width: 3,
      height: 2,
      colorType: 2,
      transparent: true,
    });
    expect(inspectImageBinary(bytes)).toMatchObject({
      valid: true,
      format: 'png',
      hasAlpha: true,
    });
  });
});

describe('inspectImageBinary common fail-closed limits', () => {
  it.each([
    ['PNG declared as JPEG', createPngFixture({ width: 2, height: 2 }), 'image/jpeg' as const],
    ['JPEG declared as WebP', createJpegFixture({ width: 2, height: 2 }), 'image/webp' as const],
    ['WebP declared as PNG', createWebpFixture({ width: 2, height: 2 }), 'image/png' as const],
  ])('rejects MIME mismatch: %s', (_label, bytes, declaredMime) => {
    expectInvalid(bytes, { declaredMime });
  });

  it.each([
    ['PNG', createPngFixture({ width: 2, height: 2 })],
    ['JPEG', createJpegFixture({ width: 2, height: 2 })],
    ['WebP', createWebpFixture({ width: 2, height: 2 })],
  ])('rejects truncated %s containers', (_label, bytes) => {
    expectInvalid(bytes.slice(0, -1));
  });

  it.each([
    ['PNG', createPngFixture({ width: 2, height: 2 })],
    ['JPEG', createJpegFixture({ width: 2, height: 2 })],
    ['WebP', createWebpFixture({ width: 2, height: 2 })],
  ])('rejects a trailing %s polyglot payload', (_label, bytes) => {
    expectInvalid(new Uint8Array([...bytes, ...Buffer.from('<script>x</script>')]));
  });

  it('enforces raw, pixel, and decoded byte caps at the exact boundary', () => {
    const bytes = createPngFixture({ width: 3, height: 2, colorType: 6, bitDepth: 16 });
    expect(inspectImageBinary(bytes, {
      maxBytes: bytes.byteLength,
      maxPixels: 6,
      maxDecodedBytes: 48,
    })).toMatchObject({ valid: true, decodedBytes: 48 });
    expectInvalid(bytes, { maxBytes: bytes.byteLength - 1 });
    expectInvalid(bytes, { maxPixels: 5 });
    expectInvalid(bytes, { maxDecodedBytes: 47 });
  });

  it('rejects huge PNG IHDR dimensions at the pixel cap before scanline work', () => {
    const chunks = readPngChunks(createPngFixture({ width: 1, height: 1 }));
    const ihdr = chunks.find((chunk) => chunk.type === 'IHDR')!;
    const hugeHeader = Buffer.from(ihdr.data);
    hugeHeader.writeUInt32BE(1, 0);
    hugeHeader.writeUInt32BE(0x7fffffff, 4);
    const bytes = assemblePng(chunks.map((chunk) => (
      chunk.type === 'IHDR' ? pngChunk('IHDR', hugeHeader) : chunk.raw
    )));

    expect(inspectImageBinary(bytes, { maxPixels: 1 })).toEqual({
      valid: false,
      reason: 'pixel_limit_exceeded',
    });
  });
});

describe('inspectImageBinary PNG structural validation', () => {
  const valid = createPngFixture({ width: 4, height: 3, colorType: 6 });

  it('rejects a bad chunk CRC', () => {
    const bytes = Buffer.from(valid);
    const idat = readPngChunks(bytes).find((chunk) => chunk.type === 'IDAT')!;
    bytes[idat.offset + idat.raw.byteLength - 1] ^= 0xff;
    expectInvalid(bytes);
  });

  it('requires IHDR first, IDAT before IEND, and exact terminal ordering', () => {
    const chunks = readPngChunks(valid);
    const ihdr = chunks.find((chunk) => chunk.type === 'IHDR')!;
    const idat = chunks.find((chunk) => chunk.type === 'IDAT')!;
    const iend = chunks.find((chunk) => chunk.type === 'IEND')!;
    expectInvalid(assemblePng([idat.raw, ihdr.raw, iend.raw]));
  });

  it('requires multiple IDAT chunks to remain consecutive', () => {
    const chunks = readPngChunks(valid);
    const ihdr = chunks.find((chunk) => chunk.type === 'IHDR')!;
    const idat = chunks.find((chunk) => chunk.type === 'IDAT')!;
    const iend = chunks.find((chunk) => chunk.type === 'IEND')!;
    const split = Math.floor(idat.data.byteLength / 2);
    expectInvalid(assemblePng([
      ihdr.raw,
      pngChunk('IDAT', idat.data.subarray(0, split)),
      pngChunk('tEXt', Buffer.from('key\0value')),
      pngChunk('IDAT', idat.data.subarray(split)),
      iend.raw,
    ]));
  });

  it('rejects CRC-valid IDAT bytes that do not form a zlib stream', () => {
    expectInvalid(replacePngChunk(valid, 'IDAT', Buffer.from([0x78, 0x9c, 0x03])));
  });

  it('rejects CRC-valid bytes hidden after the complete zlib stream inside IDAT', () => {
    const idat = readPngChunks(valid).find((chunk) => chunk.type === 'IDAT')!;
    expectInvalid(replacePngChunk(valid, 'IDAT', Buffer.concat([
      idat.data,
      Buffer.from([0xde, 0xad, 0xbe, 0xef]),
    ])));
  });

  it('rejects an inflated scanline payload with the wrong exact length', () => {
    const idat = readPngChunks(valid).find((chunk) => chunk.type === 'IDAT')!;
    const scanlines = inflateSync(idat.data);
    expectInvalid(replacePngChunk(valid, 'IDAT', deflateSync(scanlines.subarray(0, -1))));
  });

  it('rejects a PNG scanline using an undefined filter', () => {
    const idat = readPngChunks(valid).find((chunk) => chunk.type === 'IDAT')!;
    const scanlines = inflateSync(idat.data);
    scanlines[0] = 5;
    expectInvalid(replacePngChunk(valid, 'IDAT', deflateSync(scanlines)));
  });
});

describe('inspectImageBinary JPEG structural validation', () => {
  const valid = createJpegFixture({ width: 23, height: 15 });

  it('rejects an invalid marker segment length', () => {
    const bytes = Buffer.from(valid);
    const dqtOffset = findJpegMarker(bytes, 0xdb);
    bytes.writeUInt16BE(1, dqtOffset + 2);
    expectInvalid(bytes);
  });

  it('requires a supported SOF with a nonzero component table', () => {
    expectInvalid(removeJpegSegment(valid, 0xc0));
    const bytes = Buffer.from(valid);
    const sofOffset = findJpegMarker(bytes, 0xc0);
    bytes[sofOffset + 9] = 0;
    expectInvalid(bytes);
  });

  it('requires the frame and scan to reference defined coding tables', () => {
    expectInvalid(removeJpegSegment(valid, 0xdb));
    expectInvalid(removeJpegSegment(valid, 0xc4));
  });

  it('requires SOS selectors to reference a frame component', () => {
    const bytes = Buffer.from(valid);
    const sosOffset = findJpegMarker(bytes, 0xda);
    bytes[sosOffset + 5] = 2;
    expectInvalid(bytes);
  });

  it('requires a single exact EOI terminator', () => {
    expectInvalid(valid.slice(0, -2));
  });

  it('rejects a 100x100 scan whose entropy was collapsed to one byte', () => {
    const complete = createJpegFixture({ width: 100, height: 100 });
    const source = Buffer.from(complete);
    const sosOffset = findJpegMarker(source, 0xda);
    const entropyStart = sosOffset + 2 + source.readUInt16BE(sosOffset + 2);
    const corrupt = new Uint8Array(Buffer.concat([
      source.subarray(0, entropyStart),
      Buffer.from([0x00, 0xff, 0xd9]),
    ]));

    expect(inspectImageBinary(complete)).toMatchObject({ valid: true, width: 100, height: 100 });
    expectInvalid(corrupt);
  });
});

describe('inspectImageBinary WebP structural validation', () => {
  it('requires the RIFF size to equal the complete container', () => {
    const bytes = Buffer.from(createWebpFixture({ width: 11, height: 7 }));
    bytes.writeUInt32LE(bytes.readUInt32LE(4) - 1, 4);
    expectInvalid(bytes);
  });

  it('rejects a chunk length extending beyond its RIFF boundary', () => {
    const bytes = Buffer.from(createWebpFixture({ width: 11, height: 7 }));
    bytes.writeUInt32LE(bytes.readUInt32LE(16) + 2, 16);
    expectInvalid(bytes);
  });

  it('requires odd-sized chunks to use a zero padding byte', () => {
    const bytes = Buffer.from(createWebpFixture({ width: 11, height: 7, format: 'vp8' }));
    const frame = readWebpChunks(bytes)[0]!;
    expect(frame.size & 1).toBe(1);
    bytes[frame.offset + 8 + frame.size] = 1;
    expectInvalid(bytes);
  });

  it('rejects VP8X metadata without an actual image frame', () => {
    const bytes = createWebpFixture({ width: 11, height: 7, format: 'vp8x' });
    const vp8x = readWebpChunks(bytes).find((chunk) => chunk.type === 'VP8X')!;
    expectInvalid(assembleWebp([vp8x.raw]));
  });

  it.each(['VP8 ', 'VP8L'])('rejects a header-only %s chunk with no image bitstream', (type) => {
    const source = createWebpFixture({
      width: 11,
      height: 7,
      format: type === 'VP8 ' ? 'vp8' : 'vp8l',
    });
    const frame = readWebpChunks(source)[0]!;
    const payloadStart = frame.offset + 8;
    const headerLength = type === 'VP8 ' ? 10 : 5;
    const header = Buffer.from(source.subarray(payloadStart, payloadStart + headerLength));
    if (type === 'VP8 ') header[0] = 0x10;
    expectInvalid(assembleWebp([webpChunk(type, header)]));
  });

  it('rejects the exact 32-byte VP8 whose one-byte partition cannot cover a 100x100 frame', () => {
    const corrupt = new Uint8Array(Buffer.from(
      'UklGRhgAAABXRUJQVlA4IAsAAAAwAACdASpkAGQAAAA=',
      'base64',
    ));
    expect(corrupt.byteLength).toBe(32);
    expect(imageBytesToBase64(corrupt)).toBe('UklGRhgAAABXRUJQVlA4IAsAAAAwAACdASpkAGQAAAA=');
    expectInvalid(corrupt);
  });

  it('requires an uncompressed ALPH plane to contain exactly one byte per canvas pixel', () => {
    const width = 11;
    const height = 7;
    const extended = createWebpFixture({ width, height, format: 'vp8x' });
    const lossy = createWebpFixture({ width, height, format: 'vp8' });
    const vp8x = Buffer.from(readWebpChunks(extended).find((chunk) => chunk.type === 'VP8X')!.raw);
    vp8x[8] = 0x10;
    const vp8 = readWebpChunks(lossy).find((chunk) => chunk.type === 'VP8 ')!.raw;
    const fullAlpha = Buffer.alloc(1 + (width * height), 0);

    expect(inspectImageBinary(assembleWebp([
      vp8x,
      webpChunk('ALPH', fullAlpha),
      vp8,
    ]))).toMatchObject({ valid: true, hasAlpha: true });
    expectInvalid(assembleWebp([
      vp8x,
      webpChunk('ALPH', Buffer.alloc(2, 0)),
      vp8,
    ]));
  });

  it('rejects a VP8X canvas that conflicts with the actual frame dimensions', () => {
    const bytes = Buffer.from(createWebpFixture({ width: 11, height: 7, format: 'vp8x' }));
    const vp8x = readWebpChunks(bytes).find((chunk) => chunk.type === 'VP8X')!;
    bytes[vp8x.offset + 8 + 4] += 1;
    expectInvalid(bytes);
  });
});

describe('validatePngAlphaMask', () => {
  it.each([4 as const, 6 as const])('accepts exact dimensions with PNG alpha color type %s', (colorType) => {
    const bytes = createPngFixture({
      width: 13,
      height: 9,
      colorType,
      transparent: true,
    });
    expect(validatePngAlphaMask(bytes, { width: 13, height: 9 })).toMatchObject({
      valid: true,
      format: 'png',
      mime: 'image/png',
      width: 13,
      height: 9,
      hasAlpha: true,
    });
  });

  it('rejects an exact-size PNG without alpha', () => {
    const bytes = createPngFixture({ width: 13, height: 9, colorType: 2 });
    expect(validatePngAlphaMask(bytes, { width: 13, height: 9 }).valid).toBe(false);
  });

  it.each([0 as const, 2 as const])(
    'requires an IHDR alpha channel instead of only tRNS transparency for color type %s',
    (colorType) => {
      const bytes = createPngFixture({
        width: 13,
        height: 9,
        colorType,
        transparent: true,
      });
      expect(inspectImageBinary(bytes)).toMatchObject({ valid: true, hasAlpha: true });
      expect(validatePngAlphaMask(bytes, { width: 13, height: 9 }).valid).toBe(false);
    },
  );

  it('rejects an alpha PNG with either mismatched dimension', () => {
    const bytes = createPngFixture({ width: 13, height: 9, colorType: 6, transparent: true });
    expect(validatePngAlphaMask(bytes, { width: 14, height: 9 }).valid).toBe(false);
    expect(validatePngAlphaMask(bytes, { width: 13, height: 8 }).valid).toBe(false);
  });

  it('does not accept an alpha-capable non-PNG container', () => {
    const bytes = createWebpFixture({ width: 13, height: 9, format: 'vp8l', alpha: true });
    expect(validatePngAlphaMask(bytes, { width: 13, height: 9 }).valid).toBe(false);
  });
});
