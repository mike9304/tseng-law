import { get, put } from '@vercel/blob';
import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { FormSubmissionFile, FormUploadScanResult } from './form-engine';

const FORM_UPLOAD_PREFIX = 'builder-forms/uploads';
const FORM_UPLOAD_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data');
const MAX_FORM_UPLOAD_BYTES = 50 * 1024 * 1024;

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
  const contentType = input.file.type || MIME_BY_EXTENSION[extension] || 'application/octet-stream';
  const scan = scanFormUpload({
    content,
    contentType,
    extension,
    filename: input.file.name || filename,
  });
  if (!scan.ok) throw new Error(scan.error);

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
    url: buildFormUploadUrl(locale, filename),
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
  const normalizedType = input.contentType.toLowerCase();

  if (!fileSignatureMatches(input.extension, input.content)) {
    issues.push('파일 내용이 확장자와 일치하지 않습니다.');
  }
  if (normalizedType === 'image/svg+xml' && containsUnsafeSvg(input.content)) {
    issues.push('SVG 파일에 허용되지 않는 스크립트가 포함되어 있습니다.');
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

export function buildFormUploadUrl(locale: string, filename: string): string {
  return `/api/forms/uploads/${encodeURIComponent(locale)}/${encodeURIComponent(filename)}`;
}

function validateFormUpload(file: File): { ok: true } | { ok: false; error: string } {
  if (file.size <= 0) return { ok: false, error: '파일이 비어 있습니다.' };
  if (file.size > MAX_FORM_UPLOAD_BYTES) return { ok: false, error: '파일은 50MB 이하로 첨부해 주세요.' };

  const extension = inferUploadExtension(file);
  if (!MIME_BY_EXTENSION[extension]) return { ok: false, error: '허용되지 않는 파일 형식입니다.' };
  if (file.type && !MIME_BY_EXTENSION[extension] && !EXTENSION_BY_MIME[file.type]) {
    return { ok: false, error: '허용되지 않는 파일 형식입니다.' };
  }
  return { ok: true };
}

function fileSignatureMatches(extension: string, content: Buffer): boolean {
  if (extension === '.png') return content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (extension === '.jpg' || extension === '.jpeg') return content[0] === 0xff && content[1] === 0xd8;
  if (extension === '.gif') {
    const header = content.subarray(0, 6).toString('ascii');
    return header === 'GIF87a' || header === 'GIF89a';
  }
  if (extension === '.webp') {
    return content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  if (extension === '.avif') return content.subarray(4, 12).toString('ascii').includes('ftyp');
  if (extension === '.pdf') return content.subarray(0, 5).toString('ascii') === '%PDF-';
  return true;
}

function containsUnsafeSvg(content: Buffer): boolean {
  const source = content.toString('utf8').toLowerCase();
  return /<script[\s>]/.test(source) || /\son[a-z]+\s*=/.test(source) || /javascript\s*:/i.test(source);
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
  return basename && basename === input ? basename : null;
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
