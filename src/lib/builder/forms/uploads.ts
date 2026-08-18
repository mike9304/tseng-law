import { get, put } from '@vercel/blob';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { FormSubmissionFile, FormUploadScanResult } from './form-engine';

const FORM_UPLOAD_PREFIX = 'builder-forms/uploads';
const FORM_UPLOAD_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data');
const MAX_FORM_UPLOAD_BYTES = 50 * 1024 * 1024;
const FORM_UPLOAD_URL_TTL_MS = 15 * 60 * 1000;
const FORM_UPLOAD_SIGNATURE_DOMAIN = 'tseng-law/form-upload/v1';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const EXTENSION_BY_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_BY_EXTENSION).map(([extension, mime]) => [mime, extension]),
);

export interface StoredFormUpload extends FormSubmissionFile {
  pathname: string;
}

export interface FormUploadAddress {
  locale: string;
  filename: string;
}

interface FormUploadUrlOptions {
  expiresAtSeconds?: number;
  nowMs?: number;
}

interface VerifyFormUploadSignatureOptions {
  nowMs?: number;
}

export async function saveFormUpload(input: {
  fieldId: string;
  file: File;
  locale?: string | null;
}): Promise<StoredFormUpload> {
  const validation = validateFormUpload(input.file);
  if (!validation.ok) throw new Error(validation.error);

  const locale = normalizeUploadLocale(input.locale);
  const extension = inferUploadExtension(input.file);
  const filename = `${slugifyFilename(input.file.name || input.fieldId)}-${randomUUID()}${extension}`;
  const pathname = `${FORM_UPLOAD_PREFIX}/${locale}/${filename}`;
  const content = Buffer.from(await input.file.arrayBuffer());
  const contentType = MIME_BY_EXTENSION[extension] || 'application/octet-stream';
  const scan = scanFormUpload({
    content,
    contentType,
    extension,
    filename: input.file.name || filename,
  });
  if (!scan.ok) throw new Error(scan.error);

  // Resolve and sign the public download URL before writing bytes so a
  // production deployment without signing material fails closed without
  // leaving an upload that cannot be safely returned to the caller.
  const url = buildFormUploadUrl(locale, filename);

  if (hasBlobToken()) {
    await put(pathname, content, {
      access: 'private',
      allowOverwrite: false,
      contentType,
    });
  } else {
    const resolved = resolveUploadRuntimePath(pathname);
    await mkdir(path.dirname(resolved), { recursive: true, mode: 0o700 });
    await writeFile(resolved, content, { mode: 0o600 });
  }

  return {
    fieldId: input.fieldId,
    name: input.file.name || filename,
    size: input.file.size,
    type: contentType,
    pathname,
    url,
    uploadedAt: new Date().toISOString(),
    scan: scan.result,
  };
}

export function scanFormUpload(input: {
  content: Buffer;
  contentType: string;
  extension: string;
  filename: string;
}): { ok: true; result: FormUploadScanResult } | { ok: false; error: string } {
  const issues: string[] = [];
  const extension = input.extension.toLowerCase();
  const normalizedType = input.contentType.trim().toLowerCase();
  const expectedType = MIME_BY_EXTENSION[extension];

  if (!expectedType || normalizedType !== expectedType) {
    issues.push('파일의 MIME 형식이 확장자와 일치하지 않습니다.');
  }
  if (!fileSignatureMatches(extension, input.content)) {
    issues.push('파일 내용이 확장자와 일치하지 않습니다.');
  }
  if (normalizedType === 'image/svg+xml' && containsUnsafeSvg(input.content)) {
    issues.push('SVG 파일에 허용되지 않는 활성 또는 외부 콘텐츠가 포함되어 있습니다.');
  }
  if (normalizedType === 'application/pdf' && containsUnsafePdf(input.content)) {
    issues.push('PDF 파일에 허용되지 않는 활성 콘텐츠가 포함되어 있습니다.');
  }
  if ((normalizedType === 'text/plain' || normalizedType === 'text/csv')
    && containsActiveTextMarkup(input.content)) {
    issues.push('텍스트 파일에 허용되지 않는 활성 콘텐츠가 포함되어 있습니다.');
  }

  if (issues.length > 0) {
    return { ok: false, error: issues[0] ?? '파일 보안 검사를 통과하지 못했습니다.' };
  }

  return {
    ok: true,
    result: {
      status: 'passed',
      provider: 'local-upload-scan',
      scannedAt: new Date().toISOString(),
      issues: [],
    },
  };
}

export async function readFormUpload(input: {
  locale: string;
  filename: string;
}): Promise<{ content: Buffer; contentType: string } | null> {
  const locale = normalizeUploadLocale(input.locale);
  const filename = normalizeServedFilename(input.filename);
  if (!filename) return null;
  const pathname = `${FORM_UPLOAD_PREFIX}/${locale}/${filename}`;

  if (hasBlobToken()) {
    try {
      const result = await get(pathname, { access: 'private', useCache: false });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      return {
        content: Buffer.from(await new Response(result.stream).arrayBuffer()),
        contentType: inferContentType(filename),
      };
    } catch {
      return null;
    }
  }

  try {
    return {
      content: await readFile(resolveUploadRuntimePath(pathname)),
      contentType: inferContentType(filename),
    };
  } catch {
    return null;
  }
}

export function resolveFormUploadSigningSecret(): string | null {
  const candidates = [
    process.env.FORM_UPLOAD_SIGNING_SECRET,
    process.env.BUILDER_ADMIN_SESSION_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.CMS_SESSION_SECRET,
  ];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) return trimmed;
  }
  return process.env.NODE_ENV === 'production' ? null : 'local-form-upload-signing-secret';
}

export function normalizeFormUploadAddress(
  localeInput: string,
  filenameInput: string,
): FormUploadAddress | null {
  const locale = localeInput.trim().toLowerCase();
  if (!/^[a-z]{2}(?:-[a-z0-9]+)?$/.test(locale)) return null;

  const filename = normalizeServedFilename(filenameInput);
  if (!filename) return null;
  return { locale, filename };
}

export function buildFormUploadUrl(
  localeInput: string,
  filenameInput: string,
  options: FormUploadUrlOptions = {},
): string {
  const address = normalizeFormUploadAddress(localeInput, filenameInput);
  if (!address) throw new Error('Invalid form upload address.');

  const secret = resolveFormUploadSigningSecret();
  if (!secret) {
    throw new Error('FORM_UPLOAD_SIGNING_SECRET is required in production.');
  }

  const nowMs = options.nowMs ?? Date.now();
  const expiresAtSeconds = options.expiresAtSeconds
    ?? Math.floor((nowMs + FORM_UPLOAD_URL_TTL_MS) / 1000);
  if (!Number.isSafeInteger(expiresAtSeconds) || expiresAtSeconds <= 0) {
    throw new Error('Invalid form upload URL expiry.');
  }
  const signature = createFormUploadSignature(address, expiresAtSeconds, secret);
  const query = new URLSearchParams({
    expires: String(expiresAtSeconds),
    signature,
  });
  return `/api/forms/uploads/${encodeURIComponent(address.locale)}/${encodeURIComponent(address.filename)}?${query.toString()}`;
}

export function createFormUploadSignature(
  address: FormUploadAddress,
  expiresAtSeconds: number,
  secret: string,
): string {
  return createHmac('sha256', secret)
    .update(signaturePayload(address, expiresAtSeconds))
    .digest('base64url');
}

export function verifyFormUploadSignature(
  input: {
    locale: string;
    filename: string;
    expires: string | null | undefined;
    signature: string | null | undefined;
  },
  options: VerifyFormUploadSignatureOptions = {},
): boolean {
  const address = normalizeFormUploadAddress(input.locale, input.filename);
  const secret = resolveFormUploadSigningSecret();
  if (!address || !secret || !input.expires || !input.signature) return false;
  if (!/^[1-9]\d{0,15}$/.test(input.expires)) return false;

  const expiresAtSeconds = Number(input.expires);
  const nowSeconds = Math.floor((options.nowMs ?? Date.now()) / 1000);
  if (!Number.isSafeInteger(expiresAtSeconds) || expiresAtSeconds <= nowSeconds) return false;

  const expected = createFormUploadSignature(address, expiresAtSeconds, secret);
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const actualBuffer = Buffer.from(input.signature, 'utf8');
  return expectedBuffer.length === actualBuffer.length
    && timingSafeEqual(expectedBuffer, actualBuffer);
}

function validateFormUpload(file: File): { ok: true } | { ok: false; error: string } {
  if (file.size <= 0) return { ok: false, error: '파일이 비어 있습니다.' };
  if (file.size > MAX_FORM_UPLOAD_BYTES) return { ok: false, error: '파일은 50MB 이하로 첨부해 주세요.' };

  const extension = inferUploadExtension(file);
  const expectedType = MIME_BY_EXTENSION[extension];
  if (!expectedType) return { ok: false, error: '허용되지 않는 파일 형식입니다.' };
  if (file.type && file.type.trim().toLowerCase() !== expectedType) {
    return { ok: false, error: '파일의 MIME 형식이 확장자와 일치하지 않습니다.' };
  }
  return { ok: true };
}

function fileSignatureMatches(extension: string, content: Buffer): boolean {
  if (extension === '.png') return content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (extension === '.jpg' || extension === '.jpeg') {
    return content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  }
  if (extension === '.gif') {
    const header = content.subarray(0, 6).toString('ascii');
    return header === 'GIF87a' || header === 'GIF89a';
  }
  if (extension === '.webp') {
    return content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  if (extension === '.avif') {
    if (content.subarray(4, 8).toString('ascii') !== 'ftyp') return false;
    const brands = content.subarray(8, Math.min(content.length, 40)).toString('ascii');
    return brands.includes('avif') || brands.includes('avis');
  }
  if (extension === '.svg') {
    const source = decodeUtf8(content);
    return source !== null && /^(?:\uFEFF|\s)*(?:<\?xml[\s\S]*?\?>\s*)?<svg(?:\s|>)/i.test(source);
  }
  if (extension === '.pdf') return content.subarray(0, 5).toString('ascii') === '%PDF-';
  if (extension === '.txt' || extension === '.csv') return decodeUtf8(content) !== null;
  if (extension === '.doc') {
    return content.subarray(0, 8).equals(
      Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
    );
  }
  if (extension === '.docx') {
    return content.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  }
  return false;
}

function containsUnsafeSvg(content: Buffer): boolean {
  const source = decodeUtf8(content);
  if (source === null) return true;

  if (/<(?:script|foreignobject|iframe|object|embed|a|form|input|button|textarea|select|audio|video|animate|animatemotion|animatetransform|set)(?:\s|>)/i.test(source)) {
    return true;
  }
  if (/<style(?:\s|>)/i.test(source) || /\sstyle\s*=/i.test(source) || /@import\b/i.test(source)) {
    return true;
  }
  if (/\son[a-z]+\s*=/i.test(source) || /(?:javascript|vbscript)\s*:/i.test(source)) {
    return true;
  }
  if (/<!doctype\b|<!entity\b|<\?xml-stylesheet\b/i.test(source)) {
    return true;
  }

  for (const match of source.matchAll(/\s(?:href|xlink:href|src)\s*=\s*(['"])(.*?)\1/gi)) {
    const value = match[2]?.trim() ?? '';
    if (value && !value.startsWith('#')) return true;
  }
  for (const match of source.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    const value = match[2]?.trim() ?? '';
    if (!value.startsWith('#')) return true;
  }
  return false;
}

function containsUnsafePdf(content: Buffer): boolean {
  const source = content.toString('latin1');
  return /\/(?:JavaScript|JS|OpenAction|AA|Launch|RichMedia|EmbeddedFile)\b/i.test(source);
}

function containsActiveTextMarkup(content: Buffer): boolean {
  const source = decodeUtf8(content);
  if (source === null) return true;
  return /<(?:!doctype\s+html|html|script|iframe|object|embed|svg|meta)(?:\s|>)/i.test(source)
    || /(?:javascript|vbscript)\s*:/i.test(source);
}

function decodeUtf8(content: Buffer): string | null {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(content);
  } catch {
    return null;
  }
}

function inferUploadExtension(file: File): string {
  const fromName = path.extname(file.name || '').toLowerCase();
  if (fromName && MIME_BY_EXTENSION[fromName]) return fromName;
  return EXTENSION_BY_MIME[file.type] || '.bin';
}

function inferContentType(filename: string): string {
  return MIME_BY_EXTENSION[path.extname(filename).toLowerCase()] || 'application/octet-stream';
}

function normalizeUploadLocale(input: string | null | undefined): string {
  const raw = (input || 'ko').trim().toLowerCase();
  return /^[a-z]{2}(?:-[a-z0-9]+)?$/.test(raw) ? raw : 'ko';
}

function normalizeServedFilename(input: string): string | null {
  const basename = path.basename(input);
  if (!basename || basename !== input || basename === '.' || basename === '..') return null;
  if (!/^[a-z0-9][a-z0-9._-]{0,199}$/i.test(basename)) return null;
  return basename;
}

function slugifyFilename(name: string): string {
  const withoutExtension = name.replace(/\.[^.]+$/, '');
  const slug = withoutExtension
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 64);
  return slug || 'form-upload';
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function signaturePayload(address: FormUploadAddress, expiresAtSeconds: number): Buffer {
  return Buffer.from(
    JSON.stringify([
      FORM_UPLOAD_SIGNATURE_DOMAIN,
      address.locale,
      address.filename,
      expiresAtSeconds,
    ]),
    'utf8',
  );
}

function resolveUploadRuntimePath(pathname: string): string {
  const candidate = path.resolve(path.join(FORM_UPLOAD_RUNTIME_ROOT, pathname));
  const root = path.resolve(FORM_UPLOAD_RUNTIME_ROOT);
  // Belt-and-braces against path traversal: even if upstream filename
  // normalization is bypassed, the resolved path must remain inside the
  // upload root. Otherwise refuse.
  if (candidate !== root && !candidate.startsWith(root + path.sep)) {
    throw new Error('Refusing to resolve upload outside the upload root');
  }
  return candidate;
}
