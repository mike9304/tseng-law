import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { appendErrorLog, listErrorLog } from '../storage';
import type { CapturedError } from '../types';

function makeError(id: string, capturedAt: string): CapturedError {
  return {
    errorId: id,
    origin: 'api',
    severity: 'error',
    message: `boom ${id}`,
    capturedAt,
    forwardedToSentry: false,
  };
}

let dir: string;
let prevPath: string | undefined;
let prevToken: string | undefined;

beforeEach(async () => {
  prevPath = process.env.BUILDER_ERROR_LOG_PATH;
  prevToken = process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BLOB_READ_WRITE_TOKEN; // file 백엔드 강제 (blob 미사용)
  dir = await mkdtemp(path.join(os.tmpdir(), 'errlog-'));
  process.env.BUILDER_ERROR_LOG_PATH = dir;
});

afterEach(async () => {
  if (prevPath === undefined) delete process.env.BUILDER_ERROR_LOG_PATH;
  else process.env.BUILDER_ERROR_LOG_PATH = prevPath;
  if (prevToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
  else process.env.BLOB_READ_WRITE_TOKEN = prevToken;
  await rm(dir, { recursive: true, force: true });
});

describe('errors/storage — BUILDER_ERROR_LOG_PATH 격리', () => {
  it('빈 격리 디렉터리는 [] 반환 (전역 runtime-data/errors 미참조)', async () => {
    expect(await listErrorLog()).toEqual([]);
  });

  it('append 는 격리 경로에 쓰고 list 로 capturedAt 정렬해 되읽는다', async () => {
    await appendErrorLog(makeError('b', '2026-06-30T12:00:00.000Z'));
    await appendErrorLog(makeError('a', '2026-06-30T10:00:00.000Z'));
    const out = await listErrorLog();
    expect(out.map((e) => e.errorId)).toEqual(['a', 'b']);
  });

  it('경로를 바꾸면 완전히 분리된다 (한 루트의 항목이 다른 루트에 안 샌다)', async () => {
    await appendErrorLog(makeError('x', '2026-06-30T10:00:00.000Z'));
    expect((await listErrorLog()).map((e) => e.errorId)).toEqual(['x']);

    const other = await mkdtemp(path.join(os.tmpdir(), 'errlog2-'));
    process.env.BUILDER_ERROR_LOG_PATH = other;
    expect(await listErrorLog()).toEqual([]);
    await rm(other, { recursive: true, force: true });
  });
});
