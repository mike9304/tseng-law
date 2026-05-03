import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  appendConsultationLogLine,
  deleteConsultationLogRecordsBySession,
  readConsultationLogLines,
} from '@/lib/consultation/log-storage';

const ORIGINAL_LOG_DIR = process.env.CONSULTATION_LOG_DIR;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const ORIGINAL_LOG_BACKEND = process.env.CONSULTATION_LOG_BACKEND;

let tempDir: string;

describe('consultation log storage erasure', () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'consultation-logs-'));
    process.env.CONSULTATION_LOG_DIR = tempDir;
    process.env.CONSULTATION_LOG_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    if (ORIGINAL_LOG_DIR) process.env.CONSULTATION_LOG_DIR = ORIGINAL_LOG_DIR;
    else delete process.env.CONSULTATION_LOG_DIR;
    if (ORIGINAL_BLOB_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    else delete process.env.BLOB_READ_WRITE_TOKEN;
    if (ORIGINAL_LOG_BACKEND) process.env.CONSULTATION_LOG_BACKEND = ORIGINAL_LOG_BACKEND;
    else delete process.env.CONSULTATION_LOG_BACKEND;
    await rm(tempDir, { recursive: true, force: true });
  });

  it('rewrites local event and feedback logs to remove one session only', async () => {
    await appendConsultationLogLine(
      'events',
      '2026-05-03',
      JSON.stringify({ timestamp: '2026-05-03T00:00:00.000Z', sessionId: 'delete-me', eventType: 'chat' }),
    );
    await appendConsultationLogLine(
      'events',
      '2026-05-03',
      JSON.stringify({ timestamp: '2026-05-03T00:01:00.000Z', sessionId: 'keep-me', eventType: 'chat' }),
    );
    await appendConsultationLogLine(
      'feedback',
      '2026-05-03',
      JSON.stringify({ timestamp: '2026-05-03T00:02:00.000Z', sessionId: 'delete-me', messageId: 'm1' }),
    );

    const result = await deleteConsultationLogRecordsBySession('delete-me');
    const events = await readConsultationLogLines('events', 0);
    const feedback = await readConsultationLogLines('feedback', 0);

    expect(result.totalRemoved).toBe(2);
    expect(events).toHaveLength(1);
    expect(events[0]).toContain('keep-me');
    expect(events.join('\n')).not.toContain('delete-me');
    expect(feedback).toHaveLength(0);
  });
});
