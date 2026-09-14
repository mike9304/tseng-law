import { createHash, randomUUID } from 'node:crypto';
import { lstat, mkdir, mkdtemp, open as fsOpen, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobNotFoundError, BlobPreconditionFailedError } from '@vercel/blob';

vi.mock('@vercel/blob', async () => {
  const actual = await vi.importActual<typeof import('@vercel/blob')>('@vercel/blob');
  return {
    ...actual,
    put: vi.fn(),
    get: vi.fn(),
  };
});

vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
  return {
    ...actual,
    open: vi.fn(actual.open),
  };
});

import { get as blobGet, put as blobPut } from '@vercel/blob';
import {
  InternationalInquiryInvalidInputError,
  InternationalInquiryNotFoundError,
  InternationalInquiryStorageUnavailableError,
  createInternationalInquiry,
  createInternationalInquiryStore,
  markInternationalInquiryNotified,
  readInternationalInquiry,
} from '@/lib/consultation/international-inquiry-store';

const putMock = vi.mocked(blobPut);
const getMock = vi.mocked(blobGet);
const fsOpenMock = vi.mocked(fsOpen);

const ENV_KEYS = [
  'INTERNATIONAL_INQUIRY_DIR',
  'BLOB_READ_WRITE_TOKEN',
  'VERCEL',
  'VERCEL_URL',
] as const;

const UNICODE_TEXT = '  สวัสดี  xin chào  你好\n\tline  ';

let envSnapshot: Record<(typeof ENV_KEYS)[number], string | undefined>;
let tempDir: string;
let extraDirs: string[];

function requestKey(requestId: string): string {
  return createHash('sha256').update(requestId.toLowerCase(), 'utf8').digest('hex');
}

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    requestId: randomUUID(),
    name: 'Alice Kim',
    email: 'alice@example.test',
    uiLocale: 'ko' as const,
    originalLanguage: 'ko',
    preferredConsultationLanguage: 'ko' as const,
    originalText: '상담 요청합니다.',
    consent: true as const,
    ...overrides,
  };
}

function rawPath(requestId: string): string {
  return path.join(tempDir, 'raw', `${requestKey(requestId)}.json`);
}

function notifyPath(requestId: string): string {
  return path.join(tempDir, 'notify', `${requestKey(requestId)}.json`);
}

function blobGetResult(body: string, etag = 'etag-1') {
  return {
    statusCode: 200 as const,
    stream: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(body));
        controller.close();
      },
    }),
    headers: new Headers(),
    blob: {
      etag,
      url: 'https://blob.example/international-inquiries/raw/x.json',
      downloadUrl: 'https://blob.example/international-inquiries/raw/x.json',
      pathname: 'international-inquiries/raw/x.json',
      contentDisposition: '',
      cacheControl: '',
      uploadedAt: new Date(),
      contentType: 'application/json',
      size: body.length,
    },
  };
}

function installMemoryBlob() {
  const blobs = new Map<string, { body: string; etag: string }>();
  putMock.mockImplementation(async (pathname, body, options) => {
    if (options?.access !== 'private') {
      throw new Error('blob access must be private');
    }
    if (options?.addRandomSuffix !== false) {
      throw new Error('blob suffix must be disabled');
    }
    if (options?.allowOverwrite) {
      throw new BlobPreconditionFailedError();
    }
    if (blobs.has(pathname)) throw new BlobPreconditionFailedError();
    const stored = typeof body === 'string' ? body : String(body);
    const etag = `etag-${blobs.size + 1}`;
    blobs.set(pathname, { body: stored, etag });
    return {
      url: `https://blob.example/${pathname}`,
      downloadUrl: `https://blob.example/${pathname}`,
      pathname,
      contentType: 'application/json',
      contentDisposition: '',
      size: stored.length,
      uploadedAt: new Date(),
      etag,
    } as never;
  });
  getMock.mockImplementation(async (pathname) => {
    const found = blobs.get(pathname);
    if (!found) return null;
    return blobGetResult(found.body, found.etag) as never;
  });
  return blobs;
}

function expectNoRawContent(error: unknown, input: ReturnType<typeof validInput>) {
  const serialized = JSON.stringify(error, Object.getOwnPropertyNames(error as object));
  expect(error).toBeInstanceOf(Error);
  expect((error as Error).message).not.toContain(input.originalText);
  expect((error as Error).message).not.toContain(input.email);
  expect((error as Error).message).not.toContain(input.name);
  expect(serialized).not.toContain(input.originalText);
  expect(serialized).not.toContain(input.email);
}

describe('international inquiry store', () => {
  beforeEach(async () => {
    envSnapshot = {
      INTERNATIONAL_INQUIRY_DIR: process.env.INTERNATIONAL_INQUIRY_DIR,
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
      VERCEL: process.env.VERCEL,
      VERCEL_URL: process.env.VERCEL_URL,
    };
    for (const key of ENV_KEYS) delete process.env[key];
    extraDirs = [];
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'intl-inquiry-'));
    process.env.INTERNATIONAL_INQUIRY_DIR = tempDir;
    putMock.mockReset();
    getMock.mockReset();
  });

  afterEach(async () => {
    for (const key of ENV_KEYS) {
      const value = envSnapshot[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(tempDir, { recursive: true, force: true });
    await Promise.all(extraDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  });

  describe('local filesystem', () => {
    it('persists schemaVersion 1 records with verbatim Unicode/newlines before returning created', async () => {
      const input = validInput({
        originalLanguage: '  th / vi  ',
        originalText: UNICODE_TEXT,
        preferredConsultationLanguage: 'needs-method-confirmation',
        uiLocale: 'vi',
      });
      const outcome = await createInternationalInquiry(input);
      expect(outcome.kind).toBe('created');
      if (outcome.kind === 'conflict') throw new Error('expected created');
      expect(outcome.notification).toBe('pending');
      expect(outcome.record.schemaVersion).toBe(1);
      expect(outcome.record.payload.originalText).toBe(UNICODE_TEXT);
      expect(outcome.record.payload.originalLanguage).toBe('th / vi');
      expect(outcome.record.payload.requestId).toBe(input.requestId.toLowerCase());
      expect(outcome.record).not.toHaveProperty('ip');
      expect(outcome.record).not.toHaveProperty('userAgent');

      const stored = JSON.parse(await readFile(rawPath(input.requestId), 'utf8')) as {
        schemaVersion: number;
        payload: { originalText: string };
        notification?: unknown;
      };
      expect(stored.schemaVersion).toBe(1);
      expect(stored.payload.originalText).toBe(UNICODE_TEXT);
      expect(stored).not.toHaveProperty('notification');
      expect(Object.keys(stored).sort()).toEqual([
        'intakeId',
        'payload',
        'payloadSha256',
        'receivedAt',
        'schemaVersion',
      ]);

      const rawStats = await lstat(rawPath(input.requestId));
      const dirStats = await lstat(path.join(tempDir, 'raw'));
      expect(rawStats.mode & 0o777).toBe(0o600);
      expect(dirStats.mode & 0o777).toBe(0o700);
      expect(rawPath(input.requestId)).not.toContain(input.originalText);
      expect(rawPath(input.requestId)).not.toContain(input.email);
    });

    it('returns existing for the same request and identical payload, conflict when payload changes', async () => {
      const requestId = randomUUID();
      const first = await createInternationalInquiry(validInput({ requestId, originalText: UNICODE_TEXT }));
      const second = await createInternationalInquiry(validInput({ requestId, originalText: UNICODE_TEXT }));
      const conflict = await createInternationalInquiry(
        validInput({ requestId, originalText: `${UNICODE_TEXT}changed` }),
      );

      expect(first.kind).toBe('created');
      expect(second.kind).toBe('existing');
      expect(conflict).toEqual({ kind: 'conflict' });
      if (first.kind === 'conflict' || second.kind === 'conflict') throw new Error('expected records');
      expect(second.record.intakeId).toBe(first.record.intakeId);
      expect(second.record.payload.originalText).toBe(UNICODE_TEXT);
    });

    it('deduplicates concurrent identical creates on real files without a memory map', async () => {
      const input = validInput({ originalText: UNICODE_TEXT });
      const results = await Promise.all(
        Array.from({ length: 8 }, () => createInternationalInquiry(input)),
      );
      const created = results.filter((result) => result.kind === 'created');
      const existing = results.filter((result) => result.kind === 'existing');
      expect(created).toHaveLength(1);
      expect(existing).toHaveLength(7);
      expect(results.some((result) => result.kind === 'conflict')).toBe(false);

      const store = createInternationalInquiryStore();
      const reread = await store.read(input.requestId);
      expect(reread?.record.payload.originalText).toBe(UNICODE_TEXT);
      expect(reread?.notification).toBe('pending');
    });

    it('reads verbatim payload from a new repository instance after module reload', async () => {
      const input = validInput({ originalText: UNICODE_TEXT });
      const created = await createInternationalInquiry(input);
      expect(created.kind).toBe('created');

      vi.resetModules();
      const reloaded = await import('@/lib/consultation/international-inquiry-store');
      const fromReload = await reloaded.readInternationalInquiry(input.requestId);
      expect(fromReload?.record.payload.originalText).toBe(UNICODE_TEXT);
      if (created.kind !== 'conflict') {
        expect(fromReload?.record.intakeId).toBe(created.record.intakeId);
      }
      expect(fromReload?.notification).toBe('pending');
    });

    it('keeps the original payload bytes unchanged when writing an immutable notified receipt', async () => {
      const input = validInput({ originalText: UNICODE_TEXT });
      const created = await createInternationalInquiry(input);
      expect(created.kind).toBe('created');
      const before = await readFile(rawPath(input.requestId));
      const marked = await markInternationalInquiryNotified(input.requestId);
      const after = await readFile(rawPath(input.requestId));
      const again = await markInternationalInquiryNotified(input.requestId);

      expect(after.equals(before)).toBe(true);
      expect(marked.notification).toBe('sent');
      expect(again.notification).toBe('sent');
      expect(marked.record.payload.originalText).toBe(UNICODE_TEXT);
      const receipt = JSON.parse(await readFile(notifyPath(input.requestId), 'utf8')) as {
        kind: string;
        payloadSha256: string;
      };
      expect(receipt.kind).toBe('notified');
      if (created.kind !== 'conflict') {
        expect(receipt.payloadSha256).toBe(created.record.payloadSha256);
      }
      expect(JSON.parse(after.toString('utf8'))).not.toHaveProperty('notification');
    });

    it('does not treat a missing inquiry as found and does not follow a raw symlink', async () => {
      const missing = await readInternationalInquiry(randomUUID());
      expect(missing).toBeNull();

      const outsideRoot = await mkdtemp(path.join(os.tmpdir(), 'intl-inquiry-outside-'));
      extraDirs.push(outsideRoot);
      const outsideFile = path.join(outsideRoot, 'secret.txt');
      await writeFile(outsideFile, 'outside-secret-do-not-copy', 'utf8');
      const input = validInput({ originalText: UNICODE_TEXT });
      await mkdir(path.join(tempDir, 'raw'), { recursive: true, mode: 0o700 });
      await symlink(outsideFile, rawPath(input.requestId));

      await expect(createInternationalInquiry(input)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );
      await expect(readInternationalInquiry(input.requestId)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );
      expect(await readFile(outsideFile, 'utf8')).toBe('outside-secret-do-not-copy');
    });

    it('rejects a raw or notify parent-directory symlink without reading a cross-root record', async () => {
      const outsideRoot = await mkdtemp(path.join(os.tmpdir(), 'intl-inquiry-outside-parent-'));
      extraDirs.push(outsideRoot);
      const input = validInput({ originalText: UNICODE_TEXT });
      const payload = {
        requestId: input.requestId.toLowerCase(),
        name: input.name,
        email: input.email,
        uiLocale: input.uiLocale,
        originalLanguage: input.originalLanguage,
        preferredConsultationLanguage: input.preferredConsultationLanguage,
        originalText: UNICODE_TEXT,
        consent: true as const,
      };
      const digest = createHash('sha256').update(JSON.stringify(payload), 'utf8').digest('hex');
      const outsideRaw = path.join(outsideRoot, 'raw');
      await mkdir(outsideRaw, { recursive: true, mode: 0o700 });
      await writeFile(
        path.join(outsideRaw, `${requestKey(input.requestId)}.json`),
        JSON.stringify({
          schemaVersion: 1,
          intakeId: randomUUID(),
          receivedAt: '2026-09-08T00:00:00.000Z',
          payload,
          payloadSha256: digest,
        }),
        { encoding: 'utf8', mode: 0o600 },
      );
      await symlink(outsideRaw, path.join(tempDir, 'raw'));

      try {
        await readInternationalInquiry(input.requestId);
        throw new Error('expected storage unavailable');
      } catch (error) {
        expect(error).toBeInstanceOf(InternationalInquiryStorageUnavailableError);
        expectNoRawContent(error, input);
      }
      const outsideRawRecord = JSON.parse(
        await readFile(path.join(outsideRaw, `${requestKey(input.requestId)}.json`), 'utf8'),
      ) as { payload: { originalText: string } };
      expect(outsideRawRecord.payload.originalText).toBe(UNICODE_TEXT);

      await rm(path.join(tempDir, 'raw'));
      const created = await createInternationalInquiry(input);
      expect(created.kind).toBe('created');
      if (created.kind === 'conflict') throw new Error('expected created');

      const outsideNotify = path.join(outsideRoot, 'notify');
      await mkdir(outsideNotify, { recursive: true, mode: 0o700 });
      await writeFile(
        path.join(outsideNotify, `${requestKey(input.requestId)}.json`),
        JSON.stringify({
          schemaVersion: 1,
          kind: 'notified',
          requestKey: requestKey(input.requestId),
          intakeId: created.record.intakeId,
          payloadSha256: created.record.payloadSha256,
          notifiedAt: '2026-09-08T00:00:00.000Z',
        }),
        { encoding: 'utf8', mode: 0o600 },
      );
      await symlink(outsideNotify, path.join(tempDir, 'notify'));

      try {
        await readInternationalInquiry(input.requestId);
        throw new Error('expected storage unavailable');
      } catch (error) {
        expect(error).toBeInstanceOf(InternationalInquiryStorageUnavailableError);
        expectNoRawContent(error, input);
      }
      expect(
        await readFile(path.join(outsideNotify, `${requestKey(input.requestId)}.json`), 'utf8'),
      ).toContain('notified');
    });

    it('rejects an oversized regular raw file before reading it', async () => {
      const input = validInput({ originalText: UNICODE_TEXT });
      await mkdir(path.join(tempDir, 'raw'), { recursive: true, mode: 0o700 });
      await writeFile(rawPath(input.requestId), 'x'.repeat(80_001), { encoding: 'utf8', mode: 0o600 });
      await expect(readInternationalInquiry(input.requestId)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );
    });

    it('throws unavailable when publication-directory sync fails, keeps the linked record, and retries', async () => {
      const actual = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
      const input = validInput({ originalText: UNICODE_TEXT });
      let failPublicationDirectorySync = true;
      fsOpenMock.mockImplementation(async (file, flags, mode) => {
        const handle = await actual.open(file as never, flags as never, mode as never);
        if (!failPublicationDirectorySync) return handle;
        const pathname = typeof file === 'string' ? file : String(file);
        let isDirectory = false;
        try {
          isDirectory = (await lstat(pathname)).isDirectory();
        } catch {
          isDirectory = false;
        }
        if (!isDirectory) return handle;
        Object.defineProperty(handle, 'sync', {
          configurable: true,
          value: async () => {
            const error = Object.assign(new Error('injected publication-directory fsync failure'), {
              code: 'EIO',
            });
            throw error;
          },
        });
        return handle;
      });

      try {
        try {
          await createInternationalInquiry(input);
          throw new Error('expected storage unavailable');
        } catch (error) {
          expect(error).toBeInstanceOf(InternationalInquiryStorageUnavailableError);
          expectNoRawContent(error, input);
        }
        const stored = JSON.parse(await readFile(rawPath(input.requestId), 'utf8')) as {
          payload: { originalText: string };
        };
        expect(stored.payload.originalText).toBe(UNICODE_TEXT);

        failPublicationDirectorySync = false;
        const retried = await createInternationalInquiry(input);
        expect(retried.kind).toBe('existing');
        if (retried.kind !== 'existing') throw new Error('expected existing');
        expect(retried.record.payload.originalText).toBe(UNICODE_TEXT);
        expect(retried.notification).toBe('pending');
      } finally {
        fsOpenMock.mockImplementation(actual.open);
      }
    });

    it('throws unavailable for a corrupt record without treating it as absent', async () => {
      const input = validInput();
      await mkdir(path.join(tempDir, 'raw'), { recursive: true, mode: 0o700 });
      await writeFile(rawPath(input.requestId), '{not-json', { encoding: 'utf8', mode: 0o600 });
      await expect(readInternationalInquiry(input.requestId)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );
    });

    it('throws a typed storage error when the configured root cannot hold records', async () => {
      const fileRoot = path.join(tempDir, 'not-a-directory');
      await writeFile(fileRoot, 'blocked', 'utf8');
      process.env.INTERNATIONAL_INQUIRY_DIR = fileRoot;
      const input = validInput({ originalText: UNICODE_TEXT });
      try {
        await createInternationalInquiry(input);
        throw new Error('expected storage unavailable');
      } catch (error) {
        expect(error).toBeInstanceOf(InternationalInquiryStorageUnavailableError);
        expectNoRawContent(error, input);
      }
    });

    it('rejects invalid input and a Vercel runtime without a blob token', async () => {
      await expect(createInternationalInquiry(validInput({ originalText: '   \n' }))).rejects.toBeInstanceOf(
        InternationalInquiryInvalidInputError,
      );
      await expect(createInternationalInquiry(validInput({ email: 'not-an-email' }))).rejects.toBeInstanceOf(
        InternationalInquiryInvalidInputError,
      );
      await expect(createInternationalInquiry(validInput({ name: 'n'.repeat(121) }))).rejects.toBeInstanceOf(
        InternationalInquiryInvalidInputError,
      );
      await expect(markInternationalInquiryNotified(randomUUID())).rejects.toBeInstanceOf(
        InternationalInquiryNotFoundError,
      );

      process.env.VERCEL = '1';
      delete process.env.BLOB_READ_WRITE_TOKEN;
      const input = validInput({ originalText: UNICODE_TEXT });
      await expect(createInternationalInquiry(input)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );
      expect(putMock).not.toHaveBeenCalled();
      expect(getMock).not.toHaveBeenCalled();
    });
  });

  describe('mocked blob transport', () => {
    it('creates, deduplicates, conflicts, and notifies through mocked private blob puts', async () => {
      // Mocked @vercel/blob transport only. This does not verify the production provider.
      process.env.VERCEL = '1';
      process.env.BLOB_READ_WRITE_TOKEN = 'test-international-inquiry-blob-token';
      installMemoryBlob();
      const requestId = randomUUID();
      const input = validInput({ requestId, originalText: UNICODE_TEXT });

      const created = await createInternationalInquiry(input);
      const existing = await createInternationalInquiry(input);
      const conflict = await createInternationalInquiry(
        validInput({ requestId, originalText: `${UNICODE_TEXT}x` }),
      );
      const marked = await markInternationalInquiryNotified(requestId);
      const reread = await readInternationalInquiry(requestId);

      expect(created.kind).toBe('created');
      expect(existing.kind).toBe('existing');
      expect(conflict).toEqual({ kind: 'conflict' });
      expect(marked.notification).toBe('sent');
      expect(reread?.notification).toBe('sent');
      expect(reread?.record.payload.originalText).toBe(UNICODE_TEXT);

      expect(putMock.mock.calls.length).toBeGreaterThanOrEqual(2);
      const rawPuts = putMock.mock.calls.filter(([pathname]) => pathname.includes('/raw/'));
      const notifyPuts = putMock.mock.calls.filter(([pathname]) => pathname.includes('/notify/'));
      expect(rawPuts.length).toBeGreaterThanOrEqual(1);
      expect(notifyPuts.length).toBeGreaterThanOrEqual(1);
      expect(
        rawPuts.some(([, body]) => {
          const parsed = JSON.parse(String(body)) as { payload?: { originalText?: string } };
          return parsed.payload?.originalText === UNICODE_TEXT;
        }),
      ).toBe(true);
      for (const [pathname, body, options] of putMock.mock.calls) {
        expect(pathname).toMatch(/^international-inquiries\/(raw|notify)\/[a-f0-9]{64}\.json$/);
        expect(pathname).not.toContain(input.originalText);
        expect(pathname).not.toContain(input.email);
        expect(options).toEqual(expect.objectContaining({
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: false,
          contentType: 'application/json',
        }));
        const parsed = JSON.parse(String(body)) as { payload?: { originalText?: string } };
        expect(parsed).not.toHaveProperty('ip');
        if (pathname.includes('/notify/')) {
          expect(String(body)).not.toContain('Alice Kim');
          expect(parsed).not.toHaveProperty('payload');
        }
      }
      expect(putMock.mock.calls.some((call) => call[2]?.allowOverwrite === true)).toBe(false);
    });

    it('compares digests after a precondition and does not treat read failures as absent', async () => {
      // Mocked transport only; production Blob credentials are not used.
      process.env.VERCEL_URL = 'https://example.vercel.app';
      process.env.BLOB_READ_WRITE_TOKEN = 'test-international-inquiry-blob-token';
      const input = validInput({ originalText: UNICODE_TEXT });
      const stored = {
        schemaVersion: 1,
        intakeId: randomUUID(),
        receivedAt: '2026-09-08T00:00:00.000Z',
        payload: {
          requestId: input.requestId.toLowerCase(),
          name: input.name,
          email: input.email,
          uiLocale: input.uiLocale,
          originalLanguage: input.originalLanguage,
          preferredConsultationLanguage: input.preferredConsultationLanguage,
          originalText: UNICODE_TEXT,
          consent: true,
        },
        payloadSha256: createHash('sha256').update(JSON.stringify({
          requestId: input.requestId.toLowerCase(),
          name: input.name,
          email: input.email,
          uiLocale: input.uiLocale,
          originalLanguage: input.originalLanguage,
          preferredConsultationLanguage: input.preferredConsultationLanguage,
          originalText: UNICODE_TEXT,
          consent: true,
        }), 'utf8').digest('hex'),
      };

      putMock.mockRejectedValueOnce(new BlobPreconditionFailedError());
      getMock.mockResolvedValueOnce(blobGetResult(JSON.stringify(stored)) as never);
      getMock.mockResolvedValueOnce(null);
      const existing = await createInternationalInquiry(input);
      expect(existing.kind).toBe('existing');
      if (existing.kind !== 'existing') throw new Error('expected existing');
      expect(existing.record.intakeId).toBe(stored.intakeId);
      expect(existing.notification).toBe('pending');

      putMock.mockRejectedValueOnce(new BlobPreconditionFailedError());
      getMock.mockRejectedValueOnce(new Error('socket hang up'));
      try {
        await createInternationalInquiry(input);
        throw new Error('expected unavailable');
      } catch (error) {
        expect(error).toBeInstanceOf(InternationalInquiryStorageUnavailableError);
        expectNoRawContent(error, input);
      }

      putMock.mockRejectedValueOnce(new BlobPreconditionFailedError());
      getMock.mockResolvedValueOnce(null);
      await expect(createInternationalInquiry(input)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );

      getMock.mockRejectedValueOnce(new Error('ECONNRESET'));
      await expect(readInternationalInquiry(input.requestId)).rejects.toBeInstanceOf(
        InternationalInquiryStorageUnavailableError,
      );

      getMock.mockRejectedValueOnce(new BlobNotFoundError());
      expect(await readInternationalInquiry(input.requestId)).toBeNull();
    });
  });
});
