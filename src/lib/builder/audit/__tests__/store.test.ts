import { mkdtemp, readFile, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { writeAuditEvent } from '@/lib/builder/audit/store';
import type { AuditEvent } from '@/lib/builder/audit/types';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'builder-audit-'));
  process.env.BUILDER_AUDIT_LOG_PATH = path.join(tempDir, 'nested', 'builder-audit.jsonl');
});

afterEach(async () => {
  delete process.env.BUILDER_AUDIT_LOG_PATH;
  vi.restoreAllMocks();
  await rm(tempDir, { recursive: true, force: true });
});

describe('writeAuditEvent', () => {
  it('appends event to JSONL', async () => {
    const first = createEvent('asset-1');
    const second = createEvent('asset-2');

    await writeAuditEvent(first);
    await writeAuditEvent(second);

    const content = await readFile(process.env.BUILDER_AUDIT_LOG_PATH!, 'utf8');
    const lines = content.trim().split('\n').map((line) => JSON.parse(line) as AuditEvent);

    expect(lines).toEqual([first, second]);
  });

  it('rejects event with FORBIDDEN_KEYS', async () => {
    await expect(
      writeAuditEvent({
        ...createEvent('asset-1'),
        body: 'leak',
      } as unknown as AuditEvent),
    ).rejects.toThrow(/forbidden/i);
  });

  it('does not throw on disk error', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    process.env.BUILDER_AUDIT_LOG_PATH = tempDir;

    await expect(writeAuditEvent(createEvent('asset-1'))).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      '[builder-audit] failed to append audit event',
      expect.objectContaining({ type: 'asset.upload' }),
    );
  });
});

function createEvent(assetId: string): AuditEvent {
  return {
    type: 'asset.upload',
    at: '2026-05-01T00:00:00.000Z',
    actorRef: 'admin',
    assetId,
    mime: 'image/png',
    size: 12,
  };
}
