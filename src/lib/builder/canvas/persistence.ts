import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { get, put } from '@vercel/blob';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  builderCanvasDocumentSchema,
  createDefaultCanvasDocument,
  normalizeCanvasDocument,
  type BuilderCanvasDocument,
  type BuilderCanvasDraftEnvelope,
} from '@/lib/builder/canvas/types';

type CanvasBackend = 'blob' | 'file';

const SANDBOX_BLOB_PREFIX = 'builder-sandbox';
const SANDBOX_FILE_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-sandbox');

function resolveCanvasBackend(): CanvasBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  return 'blob';
}

function getBlobPath(locale: Locale): string {
  return `${SANDBOX_BLOB_PREFIX}/${locale}/draft.json`;
}

function getFilePath(locale: Locale): string {
  return path.join(SANDBOX_FILE_ROOT, locale, 'draft.json');
}

function isBlobNotFound(error: unknown): boolean {
  return error instanceof Error
    && /not found|404|no such/i.test(error.message);
}

async function readBlobDraft(locale: Locale): Promise<BuilderCanvasDocument | null> {
  try {
    const result = await get(getBlobPath(locale), {
      access: 'private',
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const raw = await new Response(result.stream).text();
    return normalizeCanvasDocument(JSON.parse(raw), locale);
  } catch (error) {
    if (isBlobNotFound(error)) return null;
    throw error;
  }
}

async function readFileDraft(locale: Locale): Promise<BuilderCanvasDocument | null> {
  try {
    const raw = await readFile(getFilePath(locale), 'utf8');
    return normalizeCanvasDocument(JSON.parse(raw), locale);
  } catch (error) {
    if ((error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeBlobDraft(document: BuilderCanvasDocument): Promise<void> {
  await put(getBlobPath(document.locale), JSON.stringify(document, null, 2), {
    access: 'private',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
  });
}

async function writeFileDraft(document: BuilderCanvasDocument): Promise<void> {
  const filePath = getFilePath(document.locale);
  await mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  await writeFile(filePath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
    mode: 0o600,
  });
}

export async function readCanvasSandboxDraft(localeInput?: string): Promise<BuilderCanvasDraftEnvelope> {
  const locale = normalizeLocale(localeInput);
  const backend = resolveCanvasBackend();
  const document = backend === 'blob' ? await readBlobDraft(locale) : await readFileDraft(locale);
  if (!document) {
    return {
      backend,
      persisted: false,
      document: createDefaultCanvasDocument(locale),
    };
  }

  return {
    backend,
    persisted: true,
    document,
  };
}

export async function writeCanvasSandboxDraft(document: BuilderCanvasDocument): Promise<BuilderCanvasDraftEnvelope> {
  const normalized = builderCanvasDocumentSchema.parse({
    ...document,
    locale: normalizeLocale(document.locale),
    updatedAt: new Date().toISOString(),
  });
  const backend = resolveCanvasBackend();
  if (backend === 'blob') {
    await writeBlobDraft(normalized);
  } else {
    await writeFileDraft(normalized);
  }
  return {
    backend,
    persisted: true,
    document: normalized,
  };
}

