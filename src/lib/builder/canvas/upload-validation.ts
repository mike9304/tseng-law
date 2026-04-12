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

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUploadFile(file: File): UploadValidationResult {
  if (!file) {
    return { valid: false, error: '파일이 선택되지 않았습니다.' };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `허용되지 않는 파일 형식입니다: ${file.type}. 이미지 파일만 업로드 가능합니다 (JPEG, PNG, GIF, WebP, SVG, AVIF).`,
    };
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `허용되지 않는 확장자입니다: ${ext}`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `파일이 너무 큽니다 (${sizeMB}MB). 최대 ${MAX_FILE_SIZE_LABEL}까지 허용됩니다.`,
    };
  }

  if (file.name.length > 200) {
    return { valid: false, error: '파일명이 너무 깁니다 (최대 200자).' };
  }

  return { valid: true };
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
