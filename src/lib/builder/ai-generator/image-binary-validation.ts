import { inflateSync } from 'node:zlib';

export type ImageBinaryFormat = 'png' | 'jpeg' | 'webp';
export type ImageBinaryMime = 'image/png' | 'image/jpeg' | 'image/webp';

export type ImageBinaryValidationOptions = {
  declaredMime?: ImageBinaryMime;
  maxBytes?: number;
  maxPixels?: number;
  maxDecodedBytes?: number;
};

export type PngAlphaMaskValidationOptions = Omit<ImageBinaryValidationOptions, 'declaredMime'> & {
  width: number;
  height: number;
};

export type ImageBinaryValidationSuccess = {
  valid: true;
  format: ImageBinaryFormat;
  mime: ImageBinaryMime;
  width: number;
  height: number;
  hasAlpha: boolean;
  byteLength: number;
  decodedBytes: number;
};

export type ImageBinaryValidationFailure = {
  valid: false;
  reason: string;
};

export type ImageBinaryValidationResult =
  | ImageBinaryValidationSuccess
  | ImageBinaryValidationFailure;

type ParsedImage = {
  width: number;
  height: number;
  hasAlpha: boolean;
  decodedBytes: number;
};

type ParseResult = ParsedImage | ImageBinaryValidationFailure;

type ResolvedImageBinaryValidationOptions = {
  declaredMime?: ImageBinaryMime;
  maxBytes: number;
  maxPixels: number;
  maxDecodedBytes: number;
};

const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_BITS_PER_PIXEL: Readonly<Record<number, number>> = {
  0: 1,
  2: 3,
  3: 1,
  4: 2,
  6: 4,
};
const PNG_SINGLETON_CHUNKS = new Set([
  'PLTE', 'cHRM', 'gAMA', 'iCCP', 'sBIT', 'sRGB', 'bKGD', 'hIST', 'tRNS', 'pHYs', 'tIME',
]);
const PNG_KNOWN_CRITICAL_CHUNKS = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND']);
const MAX_CONTAINER_CHUNKS = 100_000;
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;
const DEFAULT_MAX_PIXELS = 16_777_216;
const DEFAULT_MAX_DECODED_BYTES = 64 * 1024 * 1024;

const MIME_BY_FORMAT: Readonly<Record<ImageBinaryFormat, ImageBinaryMime>> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

function failure(reason: string): ImageBinaryValidationFailure {
  return { valid: false, reason };
}

function isFailure(value: ParseResult): value is ImageBinaryValidationFailure {
  return 'valid' in value;
}

function readUint16BigEndian(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] * 0x100) + bytes[offset + 1];
}

function readUint16LittleEndian(bytes: Uint8Array, offset: number): number {
  return bytes[offset] + (bytes[offset + 1] * 0x100);
}

function readUint24LittleEndian(bytes: Uint8Array, offset: number): number {
  return bytes[offset] + (bytes[offset + 1] * 0x100) + (bytes[offset + 2] * 0x1_0000);
}

function readUint32BigEndian(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset] * 0x1_000000)
    + (bytes[offset + 1] * 0x1_0000)
    + (bytes[offset + 2] * 0x100)
    + bytes[offset + 3]
  );
}

function readUint32LittleEndian(bytes: Uint8Array, offset: number): number {
  return (
    bytes[offset]
    + (bytes[offset + 1] * 0x100)
    + (bytes[offset + 2] * 0x1_0000)
    + (bytes[offset + 3] * 0x1_000000)
  );
}

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  let value = '';
  for (let index = offset; index < offset + length; index += 1) {
    value += String.fromCharCode(bytes[index]);
  }
  return value;
}

function matches(bytes: Uint8Array, offset: number, expected: Uint8Array): boolean {
  if (offset < 0 || offset + expected.length > bytes.length) return false;
  for (let index = 0; index < expected.length; index += 1) {
    if (bytes[offset + index] !== expected[index]) return false;
  }
  return true;
}

function isPositiveSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function validOptions(options: ResolvedImageBinaryValidationOptions): boolean {
  return (
    (options.declaredMime === undefined || Object.values(MIME_BY_FORMAT).includes(options.declaredMime))
    && isPositiveSafeInteger(options.maxBytes)
    && isPositiveSafeInteger(options.maxPixels)
    && isPositiveSafeInteger(options.maxDecodedBytes)
  );
}

function validatePixelDimensions(
  width: number,
  height: number,
  maxPixels: number,
): { pixels: number } | ImageBinaryValidationFailure {
  if (!isPositiveSafeInteger(width) || !isPositiveSafeInteger(height)) {
    return failure('invalid_dimensions');
  }
  if (width > Math.floor(maxPixels / height)) {
    return failure('pixel_limit_exceeded');
  }
  const pixels = width * height;
  if (!Number.isSafeInteger(pixels)) return failure('pixel_limit_exceeded');
  return { pixels };
}

function validateDimensions(
  width: number,
  height: number,
  options: Pick<ResolvedImageBinaryValidationOptions, 'maxPixels' | 'maxDecodedBytes'>,
  bytesPerPixel: number,
  decodedBytesOverride?: number,
): { decodedBytes: number } | ImageBinaryValidationFailure {
  if (
    !Number.isFinite(bytesPerPixel)
    || bytesPerPixel <= 0
  ) {
    return failure('invalid_dimensions');
  }
  const dimensions = validatePixelDimensions(width, height, options.maxPixels);
  if ('valid' in dimensions) return dimensions;
  const { pixels } = dimensions;
  const decodedBytes = decodedBytesOverride ?? pixels * bytesPerPixel;
  if (!Number.isSafeInteger(pixels) || !Number.isFinite(decodedBytes) || decodedBytes > options.maxDecodedBytes) {
    return failure('decoded_byte_limit_exceeded');
  }

  return { decodedBytes };
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let value = 0; value < 256; value += 1) {
    let crc = value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = ((crc & 1) !== 0 ? 0xedb8_8320 ^ (crc >>> 1) : crc >>> 1) >>> 0;
    }
    table[value] = crc;
  }
  return table;
})();

function crc32(bytes: Uint8Array, start: number, end: number): number {
  let crc = 0xffff_ffff;
  for (let index = start; index < end; index += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffff_ffff) >>> 0;
}

function validPngChunkType(bytes: Uint8Array, offset: number): boolean {
  for (let index = 0; index < 4; index += 1) {
    const value = bytes[offset + index];
    const isLetter = (value >= 65 && value <= 90) || (value >= 97 && value <= 122);
    if (!isLetter) return false;
  }
  return bytes[offset + 2] >= 65 && bytes[offset + 2] <= 90;
}

function validPngBitDepth(colorType: number, bitDepth: number): boolean {
  if (colorType === 0) return [1, 2, 4, 8, 16].includes(bitDepth);
  if (colorType === 2 || colorType === 4 || colorType === 6) return [8, 16].includes(bitDepth);
  if (colorType === 3) return [1, 2, 4, 8].includes(bitDepth);
  return false;
}

function pngSampleInRange(bytes: Uint8Array, offset: number, bitDepth: number): boolean {
  const sample = readUint16BigEndian(bytes, offset);
  const maximum = bitDepth === 16 ? 0xffff : (2 ** bitDepth) - 1;
  return sample <= maximum;
}

function validatePngAncillaryChunk(
  bytes: Uint8Array,
  type: string,
  dataStart: number,
  length: number,
  bitDepth: number,
  colorType: number,
  paletteEntries: number | null,
): ImageBinaryValidationFailure | null {
  if (type === 'cHRM' && length !== 32) return failure('invalid_png_chrm');
  if (type === 'gAMA' && (length !== 4 || readUint32BigEndian(bytes, dataStart) === 0)) {
    return failure('invalid_png_gamma');
  }
  if (type === 'sRGB' && (length !== 1 || bytes[dataStart] > 3)) return failure('invalid_png_srgb');
  if (type === 'iCCP') {
    if (length < 4) return failure('invalid_png_iccp');
    let separator = -1;
    for (let index = 0; index < Math.min(length, 80); index += 1) {
      if (bytes[dataStart + index] === 0) {
        separator = index;
        break;
      }
    }
    if (separator < 1 || separator > 79 || separator + 2 >= length || bytes[dataStart + separator + 1] !== 0) {
      return failure('invalid_png_iccp');
    }
  }
  if (type === 'sBIT') {
    const expectedLength = colorType === 0 ? 1 : colorType === 2 || colorType === 3 ? 3 : colorType === 4 ? 2 : 4;
    const maximum = colorType === 3 ? 8 : bitDepth;
    if (length !== expectedLength) return failure('invalid_png_sbit');
    for (let index = 0; index < length; index += 1) {
      const value = bytes[dataStart + index];
      if (value === 0 || value > maximum) return failure('invalid_png_sbit');
    }
  }
  if (type === 'bKGD') {
    const expectedLength = colorType === 3 ? 1 : colorType === 0 || colorType === 4 ? 2 : 6;
    if (length !== expectedLength) return failure('invalid_png_background');
    if (colorType === 3 && (paletteEntries === null || bytes[dataStart] >= paletteEntries)) {
      return failure('invalid_png_background');
    }
  }
  if (type === 'hIST' && (paletteEntries === null || length !== paletteEntries * 2)) {
    return failure('invalid_png_histogram');
  }
  if (type === 'pHYs' && (length !== 9 || bytes[dataStart + 8] > 1)) return failure('invalid_png_phys');
  if (type === 'tIME') {
    if (length !== 7) return failure('invalid_png_time');
    const month = bytes[dataStart + 2];
    const day = bytes[dataStart + 3];
    const hour = bytes[dataStart + 4];
    const minute = bytes[dataStart + 5];
    const second = bytes[dataStart + 6];
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 60) {
      return failure('invalid_png_time');
    }
  }
  return null;
}

function pngPassSize(fullSize: number, start: number, step: number): number {
  if (fullSize <= start) return 0;
  return Math.floor((fullSize - start + step - 1) / step);
}

type PngPassDescriptor = {
  rowBytes: number;
  rowCount: number;
};

function expectedPngScanlines(
  width: number,
  height: number,
  bitDepth: number,
  colorType: number,
  interlace: number,
): { length: number; packedSampleBytes: number; passes: PngPassDescriptor[] } | null {
  const channels = PNG_BITS_PER_PIXEL[colorType];
  if (!channels) return null;
  const bitsPerPixel = channels * bitDepth;
  const passes = interlace === 0
    ? [[0, 0, 1, 1] as const]
    : [
        [0, 0, 8, 8] as const,
        [4, 0, 8, 8] as const,
        [0, 4, 4, 8] as const,
        [2, 0, 4, 4] as const,
        [0, 2, 2, 4] as const,
        [1, 0, 2, 2] as const,
        [0, 1, 1, 2] as const,
      ];

  let length = 0;
  let packedSampleBytes = 0;
  const descriptors: PngPassDescriptor[] = [];
  for (const [startX, startY, stepX, stepY] of passes) {
    const passWidth = pngPassSize(width, startX, stepX);
    const passHeight = pngPassSize(height, startY, stepY);
    if (passWidth === 0 || passHeight === 0) continue;
    const rowBytes = Math.ceil((passWidth * bitsPerPixel) / 8);
    if (!Number.isSafeInteger(rowBytes) || rowBytes < 1) return null;
    const passLength = (rowBytes + 1) * passHeight;
    const passSampleBytes = rowBytes * passHeight;
    if (!Number.isSafeInteger(passLength) || !Number.isSafeInteger(passSampleBytes)) return null;
    length += passLength;
    packedSampleBytes += passSampleBytes;
    if (!Number.isSafeInteger(length) || !Number.isSafeInteger(packedSampleBytes)) return null;
    descriptors.push({ rowBytes, rowCount: passHeight });
  }
  return { length, packedSampleBytes, passes: descriptors };
}

function parsePng(bytes: Uint8Array, options: ResolvedImageBinaryValidationOptions): ParseResult {
  if (!matches(bytes, 0, PNG_SIGNATURE)) return failure('invalid_png_signature');

  let offset = PNG_SIGNATURE.length;
  let chunks = 0;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = -1;
  let interlace = -1;
  let decodedBytes = 0;
  let sawHeader = false;
  let sawImageData = false;
  let sawImageEnd = false;
  let imageDataEnded = false;
  let paletteEntries: number | null = null;
  let hasTransparencyChunk = false;
  let sawIccp = false;
  let sawSrgb = false;
  const seenSingletons = new Set<string>();
  const imageDataParts: Uint8Array[] = [];
  let imageDataLength = 0;

  while (offset < bytes.length) {
    chunks += 1;
    if (chunks > MAX_CONTAINER_CHUNKS) return failure('too_many_png_chunks');
    if (offset + 12 > bytes.length) return failure('truncated_png_chunk');

    const length = readUint32BigEndian(bytes, offset);
    const typeOffset = offset + 4;
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const chunkEnd = dataEnd + 4;
    if (!Number.isSafeInteger(chunkEnd) || dataEnd < dataStart || chunkEnd > bytes.length) {
      return failure('invalid_png_chunk_bounds');
    }
    if (!validPngChunkType(bytes, typeOffset)) return failure('invalid_png_chunk_type');

    const type = ascii(bytes, typeOffset, 4);
    const expectedCrc = readUint32BigEndian(bytes, dataEnd);
    if (crc32(bytes, typeOffset, dataEnd) !== expectedCrc) return failure('invalid_png_crc');
    if ((bytes[typeOffset] & 0x20) === 0 && !PNG_KNOWN_CRITICAL_CHUNKS.has(type)) {
      return failure('unknown_png_critical_chunk');
    }
    if (PNG_SINGLETON_CHUNKS.has(type)) {
      if (seenSingletons.has(type)) return failure('duplicate_png_chunk');
      seenSingletons.add(type);
    }

    if (!sawHeader && type !== 'IHDR') return failure('png_header_not_first');
    if (sawImageEnd) return failure('png_data_after_end');
    if (sawImageData && type !== 'IDAT') imageDataEnded = true;

    if (type === 'IHDR') {
      if (sawHeader || chunks !== 1 || length !== 13) return failure('invalid_png_header');
      width = readUint32BigEndian(bytes, dataStart);
      height = readUint32BigEndian(bytes, dataStart + 4);
      bitDepth = bytes[dataStart + 8];
      colorType = bytes[dataStart + 9];
      const compression = bytes[dataStart + 10];
      const filter = bytes[dataStart + 11];
      interlace = bytes[dataStart + 12];
      if (
        !validPngBitDepth(colorType, bitDepth)
        || compression !== 0
        || filter !== 0
        || (interlace !== 0 && interlace !== 1)
      ) {
        return failure('unsupported_png_header');
      }
      const pixelDimensions = validatePixelDimensions(width, height, options.maxPixels);
      if ('valid' in pixelDimensions) return pixelDimensions;
      const channels = PNG_BITS_PER_PIXEL[colorType];
      const scanlines = expectedPngScanlines(width, height, bitDepth, colorType, interlace);
      if (!scanlines) return failure('invalid_png_scanline_size');
      const dimensions = validateDimensions(
        width,
        height,
        options,
        channels * (bitDepth / 8),
        scanlines.packedSampleBytes,
      );
      if ('valid' in dimensions) return dimensions;
      decodedBytes = dimensions.decodedBytes;
      sawHeader = true;
    } else if (type === 'PLTE') {
      if (sawImageData || colorType === 0 || colorType === 4 || length === 0 || length % 3 !== 0 || length > 768) {
        return failure('invalid_png_palette');
      }
      paletteEntries = length / 3;
      if (colorType === 3 && paletteEntries > 2 ** bitDepth) return failure('invalid_png_palette');
    } else if (type === 'IDAT') {
      if (imageDataEnded || (colorType === 3 && paletteEntries === null)) return failure('invalid_png_image_data_order');
      sawImageData = true;
      imageDataLength += length;
      if (!Number.isSafeInteger(imageDataLength) || imageDataLength > bytes.length) {
        return failure('invalid_png_image_data_length');
      }
      if (length > 0) imageDataParts.push(bytes.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      if (length !== 0 || !sawImageData || chunkEnd !== bytes.length) return failure('invalid_png_end');
      sawImageEnd = true;
    } else if (type === 'tRNS') {
      if (sawImageData || colorType === 4 || colorType === 6) return failure('invalid_png_transparency');
      if (colorType === 0) {
        if (length !== 2 || !pngSampleInRange(bytes, dataStart, bitDepth)) return failure('invalid_png_transparency');
      } else if (colorType === 2) {
        if (length !== 6) return failure('invalid_png_transparency');
        for (let sample = 0; sample < 3; sample += 1) {
          if (!pngSampleInRange(bytes, dataStart + (sample * 2), bitDepth)) return failure('invalid_png_transparency');
        }
      } else if (colorType === 3) {
        if (paletteEntries === null || length < 1 || length > paletteEntries) return failure('invalid_png_transparency');
      } else {
        return failure('invalid_png_transparency');
      }
      hasTransparencyChunk = true;
    } else {
      const beforePaletteAndData = new Set(['cHRM', 'gAMA', 'iCCP', 'sBIT', 'sRGB']);
      if (beforePaletteAndData.has(type) && (paletteEntries !== null || sawImageData)) {
        return failure('invalid_png_chunk_order');
      }
      if ((type === 'bKGD' || type === 'hIST') && sawImageData) return failure('invalid_png_chunk_order');
      if (type === 'hIST' && paletteEntries === null) return failure('invalid_png_chunk_order');
      if (type === 'pHYs' && sawImageData) return failure('invalid_png_chunk_order');
      if (type === 'iCCP') sawIccp = true;
      if (type === 'sRGB') sawSrgb = true;
      if (sawIccp && sawSrgb) return failure('conflicting_png_color_profiles');
      const ancillaryFailure = validatePngAncillaryChunk(
        bytes,
        type,
        dataStart,
        length,
        bitDepth,
        colorType,
        paletteEntries,
      );
      if (ancillaryFailure) return ancillaryFailure;
    }

    offset = chunkEnd;
  }

  if (!sawHeader || !sawImageData || !sawImageEnd || imageDataLength === 0) {
    return failure('incomplete_png');
  }
  if (colorType === 3 && paletteEntries === null) return failure('missing_png_palette');

  const scanlines = expectedPngScanlines(width, height, bitDepth, colorType, interlace);
  if (!scanlines || scanlines.length < 1) return failure('invalid_png_scanline_size');

  let inflated: Buffer;
  try {
    const compressed = Buffer.concat(imageDataParts.map((part) => Buffer.from(part)), imageDataLength);
    // @types/node documents `info` but does not overload the synchronous return type.
    const result = inflateSync(
      compressed,
      { maxOutputLength: scanlines.length, info: true },
    ) as unknown as { buffer: Buffer; engine: { bytesWritten: number } };
    if (result.engine.bytesWritten !== compressed.byteLength) return failure('trailing_png_compressed_data');
    inflated = result.buffer;
  } catch {
    return failure('invalid_png_compression');
  }
  if (inflated.byteLength !== scanlines.length) return failure('invalid_png_scanline_length');
  let scanlineOffset = 0;
  for (const pass of scanlines.passes) {
    for (let row = 0; row < pass.rowCount; row += 1) {
      if (inflated[scanlineOffset] > 4) return failure('invalid_png_filter');
      scanlineOffset += pass.rowBytes + 1;
    }
  }
  if (scanlineOffset !== inflated.byteLength) return failure('invalid_png_scanline_length');

  return {
    width,
    height,
    hasAlpha: colorType === 4 || colorType === 6 || hasTransparencyChunk,
    decodedBytes,
  };
}

function isJpegSofMarker(marker: number): boolean {
  return marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
}

function parseJpegQuantizationTables(
  bytes: Uint8Array,
  start: number,
  end: number,
  definedTables: Set<number>,
): ImageBinaryValidationFailure | null {
  let offset = start;
  let tables = 0;
  while (offset < end) {
    const tableInfo = bytes[offset];
    const precision = tableInfo >>> 4;
    const identifier = tableInfo & 0x0f;
    if (precision > 1 || identifier > 3) return failure('invalid_jpeg_quantization_table');
    const tableLength = 1 + (precision === 0 ? 64 : 128);
    if (offset + tableLength > end) return failure('invalid_jpeg_quantization_table');
    definedTables.add(identifier);
    offset += tableLength;
    tables += 1;
  }
  return tables > 0 && offset === end ? null : failure('invalid_jpeg_quantization_table');
}

function parseJpegHuffmanTables(
  bytes: Uint8Array,
  start: number,
  end: number,
  definedDcTables: Set<number>,
  definedAcTables: Set<number>,
): ImageBinaryValidationFailure | null {
  let offset = start;
  let tables = 0;
  while (offset < end) {
    if (offset + 17 > end) return failure('invalid_jpeg_huffman_table');
    const tableInfo = bytes[offset];
    const tableClass = tableInfo >>> 4;
    const identifier = tableInfo & 0x0f;
    if (tableClass > 1 || identifier > 3) return failure('invalid_jpeg_huffman_table');
    let symbols = 0;
    for (let index = 1; index <= 16; index += 1) symbols += bytes[offset + index];
    if (symbols > 256 || offset + 17 + symbols > end) return failure('invalid_jpeg_huffman_table');
    (tableClass === 0 ? definedDcTables : definedAcTables).add(identifier);
    offset += 17 + symbols;
    tables += 1;
  }
  return tables > 0 && offset === end ? null : failure('invalid_jpeg_huffman_table');
}

type JpegFrameComponent = {
  horizontalSampling: number;
  verticalSampling: number;
};

function jpegScanBlockCount(
  width: number,
  height: number,
  frameComponents: ReadonlyMap<number, JpegFrameComponent>,
  scanComponentIds: readonly number[],
): number | null {
  if (frameComponents.size === 0 || scanComponentIds.length === 0) return null;
  let maximumHorizontal = 0;
  let maximumVertical = 0;
  for (const component of frameComponents.values()) {
    maximumHorizontal = Math.max(maximumHorizontal, component.horizontalSampling);
    maximumVertical = Math.max(maximumVertical, component.verticalSampling);
  }
  if (maximumHorizontal === 0 || maximumVertical === 0) return null;

  let blockCount: number;
  if (scanComponentIds.length === 1) {
    const component = frameComponents.get(scanComponentIds[0]);
    if (!component) return null;
    const columns = Math.ceil((width * component.horizontalSampling) / (8 * maximumHorizontal));
    const rows = Math.ceil((height * component.verticalSampling) / (8 * maximumVertical));
    blockCount = columns * rows;
  } else {
    const mcuColumns = Math.ceil(width / (8 * maximumHorizontal));
    const mcuRows = Math.ceil(height / (8 * maximumVertical));
    let blocksPerMcu = 0;
    for (const identifier of scanComponentIds) {
      const component = frameComponents.get(identifier);
      if (!component) return null;
      blocksPerMcu += component.horizontalSampling * component.verticalSampling;
    }
    blockCount = mcuColumns * mcuRows * blocksPerMcu;
  }
  return Number.isSafeInteger(blockCount) && blockCount > 0 ? blockCount : null;
}

function parseJpeg(bytes: Uint8Array, options: ResolvedImageBinaryValidationOptions): ParseResult {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return failure('invalid_jpeg_signature');

  let offset = 2;
  let width = 0;
  let height = 0;
  let decodedBytes = 0;
  let frameMarker = -1;
  let frameComponents = new Map<number, JpegFrameComponent>();
  let sawScan = false;
  let sawEntropy = false;
  let sawEnd = false;
  const definedQuantizationTables = new Set<number>();
  const definedDcTables = new Set<number>();
  const definedAcTables = new Set<number>();
  const requiredQuantizationTables = new Set<number>();

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) return failure('invalid_jpeg_marker_boundary');
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) return failure('truncated_jpeg_marker');
    const marker = bytes[offset];
    offset += 1;

    if (marker === 0x00) return failure('invalid_jpeg_stuffing');
    if (marker === 0xd9) {
      if (!sawScan || !sawEntropy || offset !== bytes.length) return failure('invalid_jpeg_end');
      sawEnd = true;
      break;
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      return failure('unexpected_jpeg_standalone_marker');
    }
    if (offset + 2 > bytes.length) return failure('truncated_jpeg_segment');
    const segmentLength = readUint16BigEndian(bytes, offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) return failure('invalid_jpeg_segment_bounds');
    const dataStart = offset + 2;
    const dataEnd = offset + segmentLength;

    if (isJpegSofMarker(marker)) {
      if (![0xc0, 0xc1, 0xc2].includes(marker) || frameMarker !== -1) return failure('unsupported_jpeg_frame');
      if (segmentLength < 11) return failure('invalid_jpeg_frame');
      const precision = bytes[dataStart];
      height = readUint16BigEndian(bytes, dataStart + 1);
      width = readUint16BigEndian(bytes, dataStart + 3);
      const componentCount = bytes[dataStart + 5];
      if (precision !== 8 || ![1, 3, 4].includes(componentCount) || segmentLength !== 8 + (componentCount * 3)) {
        return failure('unsupported_jpeg_frame');
      }
      frameComponents = new Map<number, JpegFrameComponent>();
      for (let component = 0; component < componentCount; component += 1) {
        const componentOffset = dataStart + 6 + (component * 3);
        const identifier = bytes[componentOffset];
        const sampling = bytes[componentOffset + 1];
        const horizontal = sampling >>> 4;
        const vertical = sampling & 0x0f;
        const quantizationTable = bytes[componentOffset + 2];
        if (
          frameComponents.has(identifier)
          || horizontal < 1
          || horizontal > 4
          || vertical < 1
          || vertical > 4
          || quantizationTable > 3
        ) {
          return failure('invalid_jpeg_frame_components');
        }
        frameComponents.set(identifier, {
          horizontalSampling: horizontal,
          verticalSampling: vertical,
        });
        requiredQuantizationTables.add(quantizationTable);
      }
      const dimensions = validateDimensions(width, height, options, componentCount);
      if ('valid' in dimensions) return dimensions;
      decodedBytes = dimensions.decodedBytes;
      frameMarker = marker;
    } else if (marker === 0xda) {
      if (frameMarker === -1 || segmentLength < 8) return failure('jpeg_scan_without_frame');
      const componentCount = bytes[dataStart];
      if (
        componentCount < 1
        || componentCount > frameComponents.size
        || segmentLength !== 6 + (componentCount * 2)
      ) {
        return failure('invalid_jpeg_scan');
      }
      const scanComponents = new Set<number>();
      const scanComponentIds: number[] = [];
      const scanTableSelectors: Array<{ dc: number; ac: number }> = [];
      for (let component = 0; component < componentCount; component += 1) {
        const componentOffset = dataStart + 1 + (component * 2);
        const identifier = bytes[componentOffset];
        const tables = bytes[componentOffset + 1];
        const dcTable = tables >>> 4;
        const acTable = tables & 0x0f;
        if (
          !frameComponents.has(identifier)
          || scanComponents.has(identifier)
          || dcTable > 3
          || acTable > 3
        ) {
          return failure('invalid_jpeg_scan_components');
        }
        scanComponents.add(identifier);
        scanComponentIds.push(identifier);
        scanTableSelectors.push({ dc: dcTable, ac: acTable });
      }
      for (const table of requiredQuantizationTables) {
        if (!definedQuantizationTables.has(table)) return failure('missing_jpeg_quantization_table');
      }
      const spectralStart = bytes[dataEnd - 3];
      const spectralEnd = bytes[dataEnd - 2];
      const approximation = bytes[dataEnd - 1];
      if (frameMarker === 0xc0 || frameMarker === 0xc1) {
        if (
          spectralStart !== 0
          || spectralEnd !== 63
          || approximation !== 0
          || scanTableSelectors.some(({ dc, ac }) => !definedDcTables.has(dc) || !definedAcTables.has(ac))
        ) {
          return failure('invalid_jpeg_sequential_scan');
        }
      } else {
        const successiveHigh = approximation >>> 4;
        const successiveLow = approximation & 0x0f;
        if (
          spectralStart > spectralEnd
          || spectralEnd > 63
          || (spectralStart === 0 && spectralEnd !== 0)
          || (spectralStart > 0 && componentCount !== 1)
          || successiveHigh > 13
          || successiveLow > 13
          || (successiveHigh !== 0 && successiveHigh !== successiveLow + 1)
          || (spectralStart === 0
            ? scanTableSelectors.some(({ dc }) => !definedDcTables.has(dc))
            : scanTableSelectors.some(({ ac }) => !definedAcTables.has(ac)))
        ) {
          return failure('invalid_jpeg_progressive_scan');
        }
      }

      const scanBlockCount = jpegScanBlockCount(width, height, frameComponents, scanComponentIds);
      if (scanBlockCount === null) return failure('invalid_jpeg_scan_geometry');
      const minimumEntropyBits = frameMarker === 0xc0 || frameMarker === 0xc1
        ? scanBlockCount * 2
        : spectralStart === 0
          ? scanBlockCount
          : Math.max(1, Math.ceil(scanBlockCount / 32_767));
      if (!Number.isSafeInteger(minimumEntropyBits)) return failure('invalid_jpeg_scan_geometry');

      offset = dataEnd;
      let entropyByteCount = 0;
      let nextMarkerOffset = -1;
      while (offset < bytes.length) {
        if (bytes[offset] !== 0xff) {
          entropyByteCount += 1;
          offset += 1;
          continue;
        }
        const markerStart = offset;
        while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
        if (offset >= bytes.length) return failure('truncated_jpeg_entropy');
        const entropyMarker = bytes[offset];
        if (entropyMarker === 0x00) {
          if (offset - markerStart !== 1) return failure('invalid_jpeg_entropy_stuffing');
          entropyByteCount += 1;
          offset += 1;
          continue;
        }
        if (entropyMarker >= 0xd0 && entropyMarker <= 0xd7) {
          offset += 1;
          continue;
        }
        nextMarkerOffset = markerStart;
        break;
      }
      if (
        entropyByteCount === 0
        || entropyByteCount * 8 < minimumEntropyBits
        || nextMarkerOffset < 0
      ) {
        return failure('insufficient_jpeg_entropy');
      }
      sawScan = true;
      sawEntropy = true;
      offset = nextMarkerOffset;
      continue;
    } else if (marker === 0xdb) {
      const tableFailure = parseJpegQuantizationTables(bytes, dataStart, dataEnd, definedQuantizationTables);
      if (tableFailure) return tableFailure;
    } else if (marker === 0xc4) {
      const tableFailure = parseJpegHuffmanTables(
        bytes,
        dataStart,
        dataEnd,
        definedDcTables,
        definedAcTables,
      );
      if (tableFailure) return tableFailure;
    } else if (marker === 0xdd) {
      if (segmentLength !== 4) return failure('invalid_jpeg_restart_interval');
    } else if (marker === 0xc8 || marker === 0xcc || marker === 0xdc || marker === 0xde || marker === 0xdf) {
      return failure('unsupported_jpeg_coding');
    } else if (!((marker >= 0xe0 && marker <= 0xef) || marker === 0xfe)) {
      return failure('unsupported_jpeg_marker');
    }

    offset = dataEnd;
  }

  if (!sawEnd || frameMarker === -1 || !sawScan || !sawEntropy) return failure('incomplete_jpeg');
  return { width, height, hasAlpha: false, decodedBytes };
}

function validFourCc(bytes: Uint8Array, offset: number): boolean {
  for (let index = 0; index < 4; index += 1) {
    const value = bytes[offset + index];
    if (value < 0x20 || value > 0x7e) return false;
  }
  return true;
}

function parseVp8Frame(bytes: Uint8Array, start: number, length: number): ParseResult {
  if (length <= 10) return failure('truncated_webp_vp8_frame');
  const frameTag = bytes[start] + (bytes[start + 1] * 0x100) + (bytes[start + 2] * 0x1_0000);
  const version = (frameTag >>> 1) & 0x07;
  const showFrame = (frameTag >>> 4) & 0x01;
  const firstPartitionLength = frameTag >>> 5;
  if (
    (frameTag & 0x01) !== 0
    || version > 3
    || showFrame !== 1
    || firstPartitionLength === 0
    || firstPartitionLength > length - 10
    || bytes[start + 3] !== 0x9d
    || bytes[start + 4] !== 0x01
    || bytes[start + 5] !== 0x2a
  ) {
    return failure('invalid_webp_vp8_frame');
  }
  const width = readUint16LittleEndian(bytes, start + 6) & 0x3fff;
  const height = readUint16LittleEndian(bytes, start + 8) & 0x3fff;
  if (width === 0 || height === 0) return failure('invalid_webp_vp8_dimensions');
  const macroblockCount = Math.ceil(width / 16) * Math.ceil(height / 16);
  // Every key-frame macroblock contributes at least its luma and chroma mode decisions.
  const minimumFirstPartitionBytes = Math.ceil((macroblockCount * 2) / 8);
  if (firstPartitionLength < minimumFirstPartitionBytes) {
    return failure('insufficient_webp_vp8_partition');
  }
  return { width, height, hasAlpha: false, decodedBytes: 0 };
}

function parseVp8lFrame(bytes: Uint8Array, start: number, length: number): ParseResult {
  if (length < 8 || bytes[start] !== 0x2f) return failure('invalid_webp_vp8l_frame');
  const bits = readUint32LittleEndian(bytes, start + 1);
  if ((bits >>> 29) !== 0) return failure('unsupported_webp_vp8l_version');
  const width = (bits & 0x3fff) + 1;
  const height = ((bits >>> 14) & 0x3fff) + 1;
  const hasAlpha = ((bits >>> 28) & 1) === 1;
  // Transforms and LZ77 can make large uniform images constant-size; the safe
  // lower bound is the three image flags plus five minimal Huffman trees.
  const pixelCount = width * height;
  if (!Number.isSafeInteger(pixelCount) || pixelCount < 1 || (length - 5) * 8 < 23) {
    return failure('insufficient_webp_vp8l_bitstream');
  }
  return { width, height, hasAlpha, decodedBytes: 0 };
}

function parseWebp(bytes: Uint8Array, options: ResolvedImageBinaryValidationOptions): ParseResult {
  if (
    bytes.length < 20
    || ascii(bytes, 0, 4) !== 'RIFF'
    || ascii(bytes, 8, 4) !== 'WEBP'
    || readUint32LittleEndian(bytes, 4) + 8 !== bytes.length
  ) {
    return failure('invalid_webp_container');
  }

  let offset = 12;
  let chunks = 0;
  let extendedWidth: number | null = null;
  let extendedHeight: number | null = null;
  let extendedFlags = 0;
  let frame: ParsedImage | null = null;
  let frameType: 'VP8 ' | 'VP8L' | null = null;
  let sawAlphaChunk = false;
  let sawIccp = false;
  let sawExif = false;
  let sawXmp = false;
  let sawImageChunk = false;
  const seenKnownChunks = new Set<string>();

  while (offset < bytes.length) {
    chunks += 1;
    if (chunks > MAX_CONTAINER_CHUNKS) return failure('too_many_webp_chunks');
    if (offset + 8 > bytes.length || !validFourCc(bytes, offset)) return failure('invalid_webp_chunk_header');
    const type = ascii(bytes, offset, 4);
    const length = readUint32LittleEndian(bytes, offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const paddedEnd = dataEnd + (length % 2);
    if (!Number.isSafeInteger(paddedEnd) || dataEnd < dataStart || paddedEnd > bytes.length) {
      return failure('invalid_webp_chunk_bounds');
    }
    if (length % 2 === 1 && bytes[dataEnd] !== 0) return failure('invalid_webp_padding');

    if (['VP8X', 'VP8 ', 'VP8L', 'ALPH', 'ICCP', 'EXIF', 'XMP '].includes(type)) {
      if (seenKnownChunks.has(type)) return failure('duplicate_webp_chunk');
      seenKnownChunks.add(type);
    }

    if (type === 'VP8X') {
      if (chunks !== 1 || length !== 10) return failure('invalid_webp_extended_header');
      extendedFlags = bytes[dataStart];
      if (
        (extendedFlags & 0xc1) !== 0
        || bytes[dataStart + 1] !== 0
        || bytes[dataStart + 2] !== 0
        || bytes[dataStart + 3] !== 0
        || (extendedFlags & 0x02) !== 0
      ) {
        return failure('unsupported_webp_extended_features');
      }
      extendedWidth = readUint24LittleEndian(bytes, dataStart + 4) + 1;
      extendedHeight = readUint24LittleEndian(bytes, dataStart + 7) + 1;
      const dimensions = validateDimensions(
        extendedWidth,
        extendedHeight,
        options,
        (extendedFlags & 0x10) !== 0 ? 4 : 3,
      );
      if ('valid' in dimensions) return dimensions;
    } else if (type === 'VP8 ' || type === 'VP8L') {
      if (sawImageChunk) return failure('multiple_webp_frames');
      if (type === 'VP8L' && sawAlphaChunk) return failure('invalid_webp_alpha_order');
      const parsedFrame = type === 'VP8 '
        ? parseVp8Frame(bytes, dataStart, length)
        : parseVp8lFrame(bytes, dataStart, length);
      if (isFailure(parsedFrame)) return parsedFrame;
      frame = parsedFrame;
      frameType = type;
      sawImageChunk = true;
    } else if (type === 'ALPH') {
      if (extendedWidth === null || sawImageChunk || length < 2) return failure('invalid_webp_alpha_chunk');
      const header = bytes[dataStart];
      if (
        (header & 0xc3) !== 0
        || ((header >>> 4) & 0x03) > 1
        || extendedHeight === null
        || length !== 1 + (extendedWidth * extendedHeight)
      ) {
        return failure('unsupported_webp_alpha_chunk');
      }
      sawAlphaChunk = true;
    } else if (type === 'ICCP') {
      if (extendedWidth === null || sawImageChunk || length === 0) return failure('invalid_webp_iccp_chunk');
      sawIccp = true;
    } else if (type === 'EXIF') {
      if (extendedWidth === null || !sawImageChunk || length === 0) return failure('invalid_webp_exif_chunk');
      sawExif = true;
    } else if (type === 'XMP ') {
      if (extendedWidth === null || !sawImageChunk || length === 0) return failure('invalid_webp_xmp_chunk');
      sawXmp = true;
    } else if (type === 'ANIM' || type === 'ANMF') {
      return failure('unsupported_animated_webp');
    } else if (extendedWidth === null) {
      return failure('unexpected_webp_chunk');
    }

    offset = paddedEnd;
  }

  if (offset !== bytes.length || !frame || !frameType) return failure('missing_webp_frame');
  if (sawAlphaChunk && frameType !== 'VP8 ') return failure('invalid_webp_alpha_frame');
  frame.hasAlpha = frame.hasAlpha || sawAlphaChunk;

  if (extendedWidth !== null && extendedHeight !== null) {
    if (frame.width !== extendedWidth || frame.height !== extendedHeight) return failure('webp_canvas_mismatch');
    const flagMatches = (flag: number, present: boolean) => ((extendedFlags & flag) !== 0) === present;
    if (
      !flagMatches(0x20, sawIccp)
      || !flagMatches(0x10, frame.hasAlpha)
      || !flagMatches(0x08, sawExif)
      || !flagMatches(0x04, sawXmp)
    ) {
      return failure('webp_feature_flag_mismatch');
    }
  } else if (sawAlphaChunk || sawIccp || sawExif || sawXmp) {
    return failure('missing_webp_extended_header');
  }

  const dimensions = validateDimensions(frame.width, frame.height, options, frame.hasAlpha ? 4 : 3);
  if ('valid' in dimensions) return dimensions;
  frame.decodedBytes = dimensions.decodedBytes;
  return frame;
}

function detectFormat(bytes: Uint8Array): ImageBinaryFormat | null {
  if (matches(bytes, 0, PNG_SIGNATURE)) return 'png';
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpeg';
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
  return null;
}

export function inspectImageBinary(
  bytes: Uint8Array,
  options: ImageBinaryValidationOptions = {},
): ImageBinaryValidationResult {
  if (!(bytes instanceof Uint8Array)) return failure('invalid_input');
  if (!options || typeof options !== 'object') return failure('invalid_options');
  const resolvedOptions: ResolvedImageBinaryValidationOptions = {
    declaredMime: options.declaredMime,
    maxBytes: options.maxBytes ?? DEFAULT_MAX_BYTES,
    maxPixels: options.maxPixels ?? DEFAULT_MAX_PIXELS,
    maxDecodedBytes: options.maxDecodedBytes ?? DEFAULT_MAX_DECODED_BYTES,
  };
  if (!validOptions(resolvedOptions)) return failure('invalid_options');
  if (bytes.byteLength === 0) return failure('empty_image');
  if (bytes.byteLength > resolvedOptions.maxBytes) return failure('raw_byte_limit_exceeded');

  const format = detectFormat(bytes);
  if (!format) return failure('unsupported_image_format');
  const mime = MIME_BY_FORMAT[format];
  if (resolvedOptions.declaredMime !== undefined && resolvedOptions.declaredMime !== mime) {
    return failure('declared_mime_mismatch');
  }

  const parsed = format === 'png'
    ? parsePng(bytes, resolvedOptions)
    : format === 'jpeg'
      ? parseJpeg(bytes, resolvedOptions)
      : parseWebp(bytes, resolvedOptions);
  if (isFailure(parsed)) return parsed;

  return {
    valid: true,
    format,
    mime,
    width: parsed.width,
    height: parsed.height,
    hasAlpha: parsed.hasAlpha,
    byteLength: bytes.byteLength,
    decodedBytes: parsed.decodedBytes,
  };
}

export function validatePngAlphaMask(
  bytes: Uint8Array,
  options: PngAlphaMaskValidationOptions,
): ImageBinaryValidationResult {
  if (!options || !isPositiveSafeInteger(options.width) || !isPositiveSafeInteger(options.height)) {
    return failure('invalid_mask_dimensions');
  }
  const inspected = inspectImageBinary(bytes, {
    declaredMime: 'image/png',
    maxBytes: options.maxBytes,
    maxPixels: options.maxPixels,
    maxDecodedBytes: options.maxDecodedBytes,
  });
  if (!inspected.valid) return inspected;
  if (inspected.width !== options.width || inspected.height !== options.height) {
    return failure('mask_dimension_mismatch');
  }
  if (!inspected.hasAlpha || (bytes[25] !== 4 && bytes[25] !== 6)) return failure('mask_missing_alpha_channel');
  return inspected;
}
