import { deflateSync } from 'node:zlib';

export type PngFixtureColorType = 0 | 2 | 4 | 6;
export type PngFixtureBitDepth = 8 | 16;

export interface PngFixtureOptions {
  width: number;
  height: number;
  colorType?: PngFixtureColorType;
  bitDepth?: PngFixtureBitDepth;
  transparent?: boolean;
}

export interface JpegFixtureOptions {
  width: number;
  height: number;
}

export interface WebpFixtureOptions {
  width: number;
  height: number;
  format?: 'vp8' | 'vp8l' | 'vp8x';
  alpha?: boolean;
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CRC32_TABLE = createCrc32Table();

function createCrc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let value = 0; value < 256; value += 1) {
    let crc = value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) === 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    table[value] = crc >>> 0;
  }
  return table;
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC32_TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function assertIntegerInRange(
  value: number,
  minimum: number,
  maximum: number,
  label: string,
): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${label} must be an integer from ${minimum} through ${maximum}`);
  }
}

function pngChunk(type: string, data: Uint8Array): Buffer {
  if (!/^[A-Za-z]{4}$/.test(type)) {
    throw new Error(`Invalid PNG chunk type: ${type}`);
  }
  const typeBytes = Buffer.from(type, 'ascii');
  const payload = Buffer.from(data);
  const chunk = Buffer.allocUnsafe(12 + payload.byteLength);
  chunk.writeUInt32BE(payload.byteLength, 0);
  typeBytes.copy(chunk, 4);
  payload.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBytes, payload])), 8 + payload.byteLength);
  return chunk;
}

function pngSamples(
  colorType: PngFixtureColorType,
  bitDepth: PngFixtureBitDepth,
  transparent: boolean,
): { pixel: Buffer; transparency: Buffer | null } {
  const bytesPerSample = bitDepth / 8;
  const maximum = bitDepth === 8 ? 0xff : 0xffff;
  const colors = colorType === 0 || colorType === 4
    ? [bitDepth === 8 ? 0x7f : 0x7f7f]
    : bitDepth === 8
      ? [0x21, 0x65, 0xa9]
      : [0x2121, 0x6565, 0xa9a9];
  const samples = colorType === 4 || colorType === 6
    ? [...colors, transparent ? 0 : maximum]
    : colors;
  const pixel = Buffer.allocUnsafe(samples.length * bytesPerSample);

  samples.forEach((sample, index) => {
    if (bitDepth === 8) {
      pixel[index] = sample;
    } else {
      pixel.writeUInt16BE(sample, index * 2);
    }
  });

  if (!transparent || colorType === 4 || colorType === 6) {
    return { pixel, transparency: null };
  }

  const transparency = Buffer.allocUnsafe(colors.length * 2);
  colors.forEach((sample, index) => transparency.writeUInt16BE(sample, index * 2));
  return { pixel, transparency };
}

/**
 * Builds a complete, non-interlaced PNG with real filtered scanlines, zlib data,
 * per-chunk CRCs, and no bytes after IEND.
 */
export function createPngFixture(options: PngFixtureOptions): Uint8Array {
  const {
    width,
    height,
    colorType = 6,
    bitDepth = 8,
    transparent = false,
  } = options;
  assertIntegerInRange(width, 1, 0x7fffffff, 'PNG width');
  assertIntegerInRange(height, 1, 0x7fffffff, 'PNG height');

  const channels = colorType === 0 ? 1 : colorType === 2 ? 3 : colorType === 4 ? 2 : 4;
  const bytesPerPixel = channels * (bitDepth / 8);
  const rowBytes = width * bytesPerPixel;
  const decodedLength = height * (rowBytes + 1);
  if (!Number.isSafeInteger(rowBytes) || !Number.isSafeInteger(decodedLength)) {
    throw new RangeError('PNG decoded fixture size exceeds the safe integer range');
  }

  const { pixel, transparency } = pngSamples(colorType, bitDepth, transparent);
  const row = Buffer.allocUnsafe(rowBytes + 1);
  row[0] = 0;
  for (let offset = 1; offset < row.byteLength; offset += pixel.byteLength) {
    pixel.copy(row, offset);
  }

  const scanlines = Buffer.allocUnsafe(decodedLength);
  for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
    row.copy(scanlines, rowIndex * row.byteLength);
  }

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = bitDepth;
  ihdr[9] = colorType;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const chunks = [pngChunk('IHDR', ihdr)];
  if (transparency !== null) {
    chunks.push(pngChunk('tRNS', transparency));
  }
  chunks.push(pngChunk('IDAT', deflateSync(scanlines, { level: 9 })));
  chunks.push(pngChunk('IEND', Buffer.alloc(0)));
  return new Uint8Array(Buffer.concat([PNG_SIGNATURE, ...chunks]));
}

function jpegSegment(marker: number, body: Uint8Array): Buffer {
  const payload = Buffer.from(body);
  const segment = Buffer.allocUnsafe(payload.byteLength + 4);
  segment[0] = 0xff;
  segment[1] = marker;
  segment.writeUInt16BE(payload.byteLength + 2, 2);
  payload.copy(segment, 4);
  return segment;
}

function createJpegEntropy(width: number, height: number): Buffer {
  // Each grayscale 8x8 MCU uses the one-bit DC-0 code followed by the one-bit
  // AC-EOB code from the deliberately minimal Huffman tables below.
  const blockCount = Math.ceil(width / 8) * Math.ceil(height / 8);
  const bitCount = blockCount * 2;
  const byteCount = Math.ceil(bitCount / 8);
  const entropy = Buffer.alloc(byteCount, 0);
  const paddingBits = byteCount * 8 - bitCount;
  if (paddingBits > 0) {
    entropy[byteCount - 1] = (1 << paddingBits) - 1;
  }

  const stuffed: number[] = [];
  for (const byte of entropy) {
    stuffed.push(byte);
    if (byte === 0xff) stuffed.push(0x00);
  }
  return Buffer.from(stuffed);
}

/** Builds a complete baseline grayscale JPEG with a valid one-scan entropy stream. */
export function createJpegFixture(options: JpegFixtureOptions): Uint8Array {
  const { width, height } = options;
  assertIntegerInRange(width, 1, 0xffff, 'JPEG width');
  assertIntegerInRange(height, 1, 0xffff, 'JPEG height');

  const app0 = jpegSegment(0xe0, Buffer.from([
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x01,
    0x00,
    0x00, 0x01,
    0x00, 0x01,
    0x00, 0x00,
  ]));
  const dqt = jpegSegment(0xdb, Buffer.from([0x00, ...new Array<number>(64).fill(1)]));
  const sof0 = jpegSegment(0xc0, Buffer.from([
    0x08,
    (height >>> 8) & 0xff, height & 0xff,
    (width >>> 8) & 0xff, width & 0xff,
    0x01,
    0x01, 0x11, 0x00,
  ]));
  const dcCounts = [1, ...new Array<number>(15).fill(0)];
  const acCounts = [1, ...new Array<number>(15).fill(0)];
  const dht = jpegSegment(0xc4, Buffer.from([
    0x00, ...dcCounts, 0x00,
    0x10, ...acCounts, 0x00,
  ]));
  const sos = jpegSegment(0xda, Buffer.from([
    0x01,
    0x01, 0x00,
    0x00, 0x3f, 0x00,
  ]));

  return new Uint8Array(Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    app0,
    dqt,
    sof0,
    dht,
    sos,
    createJpegEntropy(width, height),
    Buffer.from([0xff, 0xd9]),
  ]));
}

function writeUInt24LE(buffer: Buffer, value: number, offset: number): void {
  buffer[offset] = value & 0xff;
  buffer[offset + 1] = (value >>> 8) & 0xff;
  buffer[offset + 2] = (value >>> 16) & 0xff;
}

function webpChunk(type: 'VP8 ' | 'VP8L' | 'VP8X' | 'ALPH', data: Uint8Array): Buffer {
  const payload = Buffer.from(data);
  const padding = payload.byteLength & 1;
  const chunk = Buffer.allocUnsafe(8 + payload.byteLength + padding);
  chunk.write(type, 0, 4, 'ascii');
  chunk.writeUInt32LE(payload.byteLength, 4);
  payload.copy(chunk, 8);
  if (padding === 1) chunk[chunk.byteLength - 1] = 0;
  return chunk;
}

function createVp8Payload(width: number, height: number): Buffer {
  // A key-frame tag with a one-byte first partition, followed by the required
  // start code and 14-bit frame dimensions. Inspectors can therefore verify
  // the frame rather than trusting RIFF/VP8X metadata alone.
  const firstPartitionLength = 1;
  const frameTag = (firstPartitionLength << 5) | 0x10;
  return Buffer.from([
    frameTag & 0xff,
    (frameTag >>> 8) & 0xff,
    (frameTag >>> 16) & 0xff,
    0x9d, 0x01, 0x2a,
    width & 0xff, (width >>> 8) & 0x3f,
    height & 0xff, (height >>> 8) & 0x3f,
    0x00,
  ]);
}

function createVp8lPayload(width: number, height: number, alpha: boolean): Buffer {
  const header = (
    (width - 1)
    | ((height - 1) << 14)
    | (alpha ? 0x10000000 : 0)
  ) >>> 0;
  const imageBits: number[] = [];
  const writeBits = (value: number, count: number) => {
    for (let bit = 0; bit < count; bit += 1) imageBits.push((value >>> bit) & 1);
  };
  const writeSingleSymbolTree = (symbol: number) => {
    writeBits(1, 1); // simple Huffman code
    writeBits(0, 1); // one symbol
    if (symbol <= 1) {
      writeBits(0, 1);
      writeBits(symbol, 1);
    } else {
      writeBits(1, 1);
      writeBits(symbol, 8);
    }
  };

  // No transforms, color cache, or meta-Huffman image. Five single-leaf trees
  // synthesize a black literal for every pixel without any trailing LZ data.
  writeBits(0, 1);
  writeBits(0, 1);
  writeBits(0, 1);
  writeSingleSymbolTree(0); // green
  writeSingleSymbolTree(0); // red
  writeSingleSymbolTree(0); // blue
  writeSingleSymbolTree(alpha ? 0 : 0xff);
  writeSingleSymbolTree(0); // distance

  const payload = Buffer.alloc(5 + Math.ceil(imageBits.length / 8), 0);
  payload[0] = 0x2f;
  payload.writeUInt32LE(header, 1);
  imageBits.forEach((bit, index) => {
    payload[5 + Math.floor(index / 8)] |= bit << (index % 8);
  });
  return payload;
}

/**
 * Builds a complete RIFF WebP. Extended fixtures contain a matching lossless
 * frame (including inline alpha when requested), never a metadata-only VP8X.
 */
export function createWebpFixture(options: WebpFixtureOptions): Uint8Array {
  const {
    width,
    height,
    format = 'vp8l',
    alpha = false,
  } = options;
  const maximumDimension = format === 'vp8' ? 0x3fff : 0x4000;
  assertIntegerInRange(width, 1, maximumDimension, 'WebP width');
  assertIntegerInRange(height, 1, maximumDimension, 'WebP height');
  if (format === 'vp8' && alpha) {
    throw new Error('Lossy VP8 alpha requires the vp8x extended format');
  }

  let chunks: Buffer[];
  if (format === 'vp8') {
    chunks = [webpChunk('VP8 ', createVp8Payload(width, height))];
  } else if (format === 'vp8l') {
    chunks = [webpChunk('VP8L', createVp8lPayload(width, height, alpha))];
  } else {
    const vp8x = Buffer.alloc(10, 0);
    vp8x[0] = alpha ? 0x10 : 0;
    writeUInt24LE(vp8x, width - 1, 4);
    writeUInt24LE(vp8x, height - 1, 7);
    chunks = [webpChunk('VP8X', vp8x)];
    chunks.push(webpChunk('VP8L', createVp8lPayload(width, height, alpha)));
  }

  const riffPayload = Buffer.concat([Buffer.from('WEBP', 'ascii'), ...chunks]);
  const header = Buffer.allocUnsafe(8);
  header.write('RIFF', 0, 4, 'ascii');
  header.writeUInt32LE(riffPayload.byteLength, 4);
  return new Uint8Array(Buffer.concat([header, riffPayload]));
}

export function imageBytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
}
