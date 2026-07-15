import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

const ORIGINAL_CWD = process.cwd();
const ORIGINAL_ENV = { ...process.env };

let tmpRoot = '';

beforeEach(async () => {
  vi.resetModules();
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-integrations-model-'));
  process.chdir(tmpRoot);
  process.env = { ...ORIGINAL_ENV, CRM_BACKEND: 'local' };
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  process.env = { ...ORIGINAL_ENV };
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('CRM integration storage compatibility', () => {
  it('normalizes legacy Mailchimp storage records and migrates them on the next write', async () => {
    const storageDir = path.join(tmpRoot, 'runtime-data', 'crm');
    const storagePath = path.join(storageDir, 'integrations.json');
    await fs.mkdir(storageDir, { recursive: true });
    await fs.writeFile(storagePath, JSON.stringify({
      version: 1,
      updatedAt: '2026-06-18T00:00:00.000Z',
      integrations: [{
        id: 'legacy-mailchimp',
        kind: 'mailchimp-stub',
        settings: { audienceId: 'aud_123' },
        enabled: true,
        createdAt: '2026-06-18T00:00:00.000Z',
      }],
    }));

    const { mutateIntegrations, readIntegrations } = await import('../integrations-model');
    expect(await readIntegrations()).toMatchObject([{ id: 'legacy-mailchimp', kind: 'mailchimp' }]);

    await mutateIntegrations((current) => ({ next: current, result: null }));

    const persisted = JSON.parse(await fs.readFile(storagePath, 'utf8')) as {
      integrations: Array<{ kind: string }>;
    };
    expect(persisted.integrations).toMatchObject([{ kind: 'mailchimp' }]);
    expect(JSON.stringify(persisted)).not.toContain('mailchimp-stub');
  });
});
