/**
 * Phase 3 P3-18 — Asset upload validation (security).
 *
 * Validates file type + size before uploading to Vercel Blob.
 * Prevents malicious file uploads and oversized assets.
 */

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
]);

export const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif',
]);

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_LABEL = '10MB';

const UNSAFE_SVG_SCRIPT_RE = /<\s*script\b[\s\S]*?<\s*\/\s*script\s*>/gi;
const UNSAFE_SVG_EVENT_ATTR_RE = /\s+on[a-z][\w:-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const UNSAFE_SVG_HREF_RE = /\b(?:href|xlink:href)\s*=\s*(?:"(?!#)[^"]*"|'(?!#)[^']*'|(?!#)[^\s>]+)/i;
const UNSAFE_SVG_PROTOCOL_RE = /\b(?:javascript|vbscript|data)\s*:/i;

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  code?: 'unsupported_media' | 'payload_too_large' | 'invalid_upload';
}

export function getAllowedImageTypes(): Set<string> {
  const configured = process.env.BUILDER_ASSET_ALLOWED_MIME?.trim();
  if (!configured) return ALLOWED_IMAGE_TYPES;
  const allowed = new Set(
    configured
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  return allowed.size > 0 ? allowed : ALLOWED_IMAGE_TYPES;
}

export function getMaxUploadBytes(): number {
  const configured = Number(process.env.BUILDER_ASSET_MAX_BYTES);
  if (Number.isFinite(configured) && configured > 0) {
    return Math.min(50 * 1024 * 1024, Math.trunc(configured));
  }
  return MAX_FILE_SIZE_BYTES;
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(mb >= 10 ? 0 : 1)}MB` : `${Math.round(bytes / 1024)}KB`;
}

export function validateUploadFile(file: File): UploadValidationResult {
  if (!file) {
    return { valid: false, error: '파일이 선택되지 않았습니다.', code: 'invalid_upload' };
  }

  const allowedTypes = getAllowedImageTypes();
  if (!allowedTypes.has(file.type)) {
    return {
      valid: false,
      error: `허용되지 않는 파일 형식입니다: ${file.type}. 이미지 파일만 업로드 가능합니다 (JPEG, PNG, GIF, WebP, SVG, AVIF).`,
      code: 'unsupported_media',
    };
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `허용되지 않는 확장자입니다: ${ext}`,
      code: 'unsupported_media',
    };
  }

  const maxBytes = getMaxUploadBytes();
  if (file.size > maxBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `파일이 너무 큽니다 (${sizeMB}MB). 최대 ${formatBytes(maxBytes)}까지 허용됩니다.`,
      code: 'payload_too_large',
    };
  }

  if (file.name.length > 200) {
    return { valid: false, error: '파일명이 너무 깁니다 (최대 200자).', code: 'invalid_upload' };
  }

  return { valid: true };
}

/**
 * Magic-byte (file signature) sniffing — server-side defense.
 * Client MIME (file.type)는 위조 가능. 첫 ~16 bytes로 실제 컨텐츠 검증.
 *
 * 매핑:
 *   - JPEG: FF D8 FF
 *   - PNG : 89 50 4E 47 0D 0A 1A 0A
 *   - GIF : 47 49 46 38 (37|39) 61          (GIF87a / GIF89a)
 *   - WebP: 52 49 46 46 .. .. .. .. 57 45 42 50  ("RIFF...WEBP")
 *   - AVIF: ?? ?? ?? ?? 66 74 79 70 (61|6D 69 66|...)  (ftyp avif/avis/mif1...)
 *   - SVG : "<svg" 또는 "<?xml" 시작 (text/xml)
 *
 * 참고: SVG는 엄격한 binary signature 없음. text-based이며 '<svg' 또는 '<?xml'
 * prefix 검증 + 별도 sanitize는 이 함수의 영역 밖.
 */
export type SniffedFormat = 'jpeg' | 'png' | 'gif' | 'webp' | 'avif' | 'svg' | 'unknown';

export function sniffImageMagicBytes(buffer: Uint8Array): SniffedFormat {
  if (buffer.length < 4) return 'unknown';

  const b = buffer;

  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    b.length >= 8 &&
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) return 'png';

  // GIF: 47 49 46 38 (37|39) 61
  if (
    b.length >= 6 &&
    b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 &&
    (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61
  ) return 'gif';

  // WebP: 52 49 46 46 .. .. .. .. 57 45 42 50
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return 'webp';

  // AVIF: bytes 4-7 = 'ftyp'(66 74 79 70), bytes 8-11 = 'avif' or 'avis' or 'mif1'
  if (
    b.length >= 12 &&
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 &&
    (
      (b[8] === 0x61 && b[9] === 0x76 && b[10] === 0x69 && b[11] === 0x66) ||
      (b[8] === 0x61 && b[9] === 0x76 && b[10] === 0x69 && b[11] === 0x73) ||
      (b[8] === 0x6d && b[9] === 0x69 && b[10] === 0x66 && b[11] === 0x31)
    )
  ) return 'avif';

  // SVG: text-based, 첫 non-whitespace 가 '<svg' 또는 '<?xml'
  // 안전을 위해 첫 256 bytes 만 ascii로 변환 후 검사
  try {
    const head = new TextDecoder('utf-8', { fatal: false }).decode(b.slice(0, Math.min(256, b.length)));
    const trimmed = head.trim().toLowerCase();
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<svg')) return 'svg';
  } catch {
    // 디코드 실패 = svg 아님
  }

  return 'unknown';
}

export function sanitizeSvgUploadText(svg: string): string | null {
  const trimmed = svg.trim();
  if (!/^<svg(?:\s|>)/i.test(trimmed) && !/^<\?xml[\s\S]*?<svg(?:\s|>)/i.test(trimmed)) {
    return null;
  }
  if (!/<\/svg>\s*$/i.test(trimmed)) return null;

  const withoutScripts = trimmed.replace(UNSAFE_SVG_SCRIPT_RE, '');
  const withoutEvents = withoutScripts.replace(UNSAFE_SVG_EVENT_ATTR_RE, '');
  if (UNSAFE_SVG_HREF_RE.test(withoutEvents)) return null;
  if (UNSAFE_SVG_PROTOCOL_RE.test(withoutEvents)) return null;
  if (!/<svg(?:\s|>)/i.test(withoutEvents) || !/<\/svg>\s*$/i.test(withoutEvents)) return null;
  return withoutEvents;
}

const MIME_TO_SNIFFED: Record<string, SniffedFormat> = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

/**
 * Magic-byte 검증 + MIME 일치 확인.
 * - claimed MIME 이 ALLOWED_IMAGE_TYPES에 있어야 함
 * - sniffed format 이 'unknown' 이면 안 됨
 * - claimed MIME 과 sniffed format 일치해야 함 (위조 차단)
 */
export async function validateImageBytes(
  file: File,
): Promise<UploadValidationResult & { sniffed?: SniffedFormat }> {
  const buffer = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const sniffed = sniffImageMagicBytes(buffer);

  if (sniffed === 'unknown') {
    return {
      valid: false,
      error: '파일 시그니처가 인식되지 않습니다. 손상된 파일이거나 허용된 이미지 형식이 아닙니다.',
      code: 'unsupported_media',
      sniffed,
    };
  }

  const expected = MIME_TO_SNIFFED[file.type.toLowerCase()];
  if (!expected) {
    return {
      valid: false,
      error: `허용되지 않는 MIME: ${file.type}`,
      code: 'unsupported_media',
      sniffed,
    };
  }

  if (expected !== sniffed) {
    return {
      valid: false,
      error: `MIME(${file.type})과 실제 파일 형식(${sniffed})이 일치하지 않습니다.`,
      code: 'unsupported_media',
      sniffed,
    };
  }

  if (sniffed === 'svg') {
    const safeSvg = sanitizeSvgUploadText(await file.text());
    if (!safeSvg) {
      return {
        valid: false,
        error: '안전하지 않은 SVG입니다. script, 외부 href, data/javascript URL은 업로드할 수 없습니다.',
        code: 'unsupported_media',
        sniffed,
      };
    }
  }

  return { valid: true, sniffed };
}

export function validateUploadUrl(url: string): UploadValidationResult {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: 'URL이 비어있습니다.' };
  }
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'HTTP/HTTPS URL만 허용됩니다.' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: '유효하지 않은 URL 형식입니다.' };
  }
}
