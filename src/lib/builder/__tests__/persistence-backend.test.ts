import { afterEach, describe, expect, it, vi } from 'vitest';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';

describe('builder snapshot persistence backend', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses file storage in local development even when a Blob token is present', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_test');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '');
    vi.stubEnv('BUILDER_SNAPSHOT_BACKEND', '');
    vi.stubEnv('BUILDER_SITE_BACKEND', '');
    vi.stubEnv('CONSULTATION_LOG_BACKEND', '');
    vi.stubEnv('NODE_ENV', 'development');

    const result = await readBuilderPageSnapshot('home', 'draft', 'ko');

    expect(result.backend).toBe('file');
  });

  it('honors the snapshot-local backend override when Blob is explicitly enabled', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_test');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    vi.stubEnv('BUILDER_SNAPSHOT_BACKEND', 'local');
    vi.stubEnv('NODE_ENV', 'development');

    const result = await readBuilderPageSnapshot('home', 'draft', 'ko');

    expect(result.backend).toBe('file');
  });
});
