import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceMissingError,
} from '../../storage/persistence-errors';
import type { VersionedJsonStore } from '../../storage/versioned-json-store';
import type {
  BuilderNotification,
  BuilderNotificationInboxFile,
} from '../notification-model';
import {
  __resetNotificationStorageRootForTests,
  __setNotificationStorageRootForTests,
  __setNotificationVersionedStoreForTests,
  createNotification,
  listNotifications,
} from '../notification-store';

function inbox(notifications: BuilderNotification[]): BuilderNotificationInboxFile {
  return {
    version: 1,
    updatedAt: new Date(0).toISOString(),
    notifications,
  };
}

function externalNotification(id: string, subject: string): BuilderNotification {
  return {
    id,
    kind: 'publish',
    subject,
    body: '',
    audience: {},
    createdAt: new Date(0).toISOString(),
  };
}

class ContendedInboxStore implements VersionedJsonStore<BuilderNotificationInboxFile> {
  private record: BuilderNotificationInboxFile | null;
  private revision = 0;
  createCalls = 0;
  compareAndSetCalls = 0;
  conflictOnFirstCreate = false;
  conflictOnFirstCompareAndSet = false;
  private synchronizeFirstTwoReads = false;
  private readCalls = 0;
  private releaseSynchronizedReads: (() => void) | null = null;
  private synchronizedReads = Promise.resolve();

  constructor(initial: BuilderNotificationInboxFile | null = null) {
    this.record = initial;
  }

  async read(): Promise<{ value: BuilderNotificationInboxFile; version: string }> {
    if (!this.record) throw new PersistenceMissingError('missing inbox');
    const snapshot = { value: this.record, version: this.version() };
    this.readCalls += 1;
    if (this.synchronizeFirstTwoReads && this.readCalls <= 2) {
      if (this.readCalls === 2) {
        this.releaseSynchronizedReads?.();
      }
      await this.synchronizedReads;
    }
    return snapshot;
  }

  async create(
    _key: string,
    value: BuilderNotificationInboxFile,
  ): Promise<{ value: BuilderNotificationInboxFile; version: string }> {
    this.createCalls += 1;
    if (this.conflictOnFirstCreate && this.createCalls === 1) {
      this.record = inbox([externalNotification('external-create', 'other writer')]);
      this.revision += 1;
      throw new PersistenceConflictError('created by another writer');
    }
    if (this.record) throw new PersistenceConflictError('inbox already exists');
    this.record = value;
    this.revision += 1;
    return { value, version: this.version() };
  }

  async compareAndSet(
    _key: string,
    expectedVersion: string,
    value: BuilderNotificationInboxFile,
  ): Promise<{ value: BuilderNotificationInboxFile; version: string }> {
    this.compareAndSetCalls += 1;
    if (this.conflictOnFirstCompareAndSet && this.compareAndSetCalls === 1) {
      this.record = inbox([
        externalNotification('external-cas', 'concurrent writer'),
        ...(this.record?.notifications ?? []),
      ]);
      this.revision += 1;
      throw new PersistenceConflictError('changed by another writer');
    }
    if (!this.record || expectedVersion !== this.version()) {
      throw new PersistenceConflictError('stale version');
    }
    this.record = value;
    this.revision += 1;
    return { value, version: this.version() };
  }

  async compareAndDelete(): Promise<void> {
    throw new Error('not used');
  }

  synchronizeInitialReads(): void {
    this.synchronizeFirstTwoReads = true;
    this.synchronizedReads = new Promise<void>((resolve) => {
      this.releaseSynchronizedReads = resolve;
    });
  }

  private version(): string {
    return `v${this.revision}`;
  }
}

describe('notification inbox CAS persistence', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    __resetNotificationStorageRootForTests();
  });

  it('retries a missing-inbox create conflict and retains both writers', async () => {
    const store = new ContendedInboxStore();
    store.conflictOnFirstCreate = true;
    __setNotificationVersionedStoreForTests(store);

    await createNotification({ kind: 'publish', subject: 'this writer', body: '' });

    expect((await listNotifications()).map((notification) => notification.subject).sort()).toEqual([
      'other writer',
      'this writer',
    ]);
    expect(store.createCalls).toBe(1);
    expect(store.compareAndSetCalls).toBe(1);
  });

  it('reloads and reapplies an update after a conditional-write conflict', async () => {
    const store = new ContendedInboxStore(inbox([externalNotification('initial', 'initial writer')]));
    store.conflictOnFirstCompareAndSet = true;
    __setNotificationVersionedStoreForTests(store);

    await createNotification({ kind: 'publish', subject: 'this writer', body: '' });

    expect((await listNotifications()).map((notification) => notification.subject).sort()).toEqual([
      'concurrent writer',
      'initial writer',
      'this writer',
    ]);
    expect(store.compareAndSetCalls).toBe(2);
  });

  it('retains both concurrent production writers after the losing CAS retries', async () => {
    const store = new ContendedInboxStore(inbox([externalNotification('initial', 'initial writer')]));
    store.synchronizeInitialReads();
    __setNotificationVersionedStoreForTests(store);
    vi.stubEnv('NODE_ENV', 'production');

    try {
      await Promise.all([
        createNotification({ kind: 'publish', subject: 'writer one', body: '' }),
        createNotification({ kind: 'publish', subject: 'writer two', body: '' }),
      ]);
    } finally {
      vi.unstubAllEnvs();
    }

    expect((await listNotifications()).map((notification) => notification.subject).sort()).toEqual([
      'initial writer',
      'writer one',
      'writer two',
    ]);
    expect(store.compareAndSetCalls).toBe(3);
  });

  it('fails closed in production without a Blob token and never creates local persistence', async () => {
    const tempRoot = await mkdtemp(path.join(tmpdir(), 'tseng-notification-production-'));
    __setNotificationStorageRootForTests(path.join(tempRoot, 'notifications'));
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');

    try {
      await expect(createNotification({ kind: 'publish', subject: 'blocked', body: '' }))
        .rejects.toBeInstanceOf(PersistenceBackendUnavailableError);
      await expect(access(path.join(tempRoot, 'notifications', '.notification-cas-v1')))
        .rejects.toMatchObject({ code: 'ENOENT' });
      await expect(access(path.join(tempRoot, 'notifications', 'inbox.json')))
        .rejects.toMatchObject({ code: 'ENOENT' });
    } finally {
      vi.unstubAllEnvs();
      await rm(tempRoot, { recursive: true, force: true });
    }
  });

  it('bootstraps the legacy local inbox into the local CAS store', async () => {
    const tempRoot = await mkdtemp(path.join(tmpdir(), 'tseng-notification-legacy-'));
    const notificationsRoot = path.join(tempRoot, 'notifications');
    await mkdir(notificationsRoot, { recursive: true });
    await writeFile(
      path.join(notificationsRoot, 'inbox.json'),
      JSON.stringify(inbox([externalNotification('legacy', 'legacy notification')])),
      'utf8',
    );
    __setNotificationStorageRootForTests(notificationsRoot);

    try {
      expect((await listNotifications()).map((notification) => notification.subject)).toEqual([
        'legacy notification',
      ]);
      await expect(access(path.join(notificationsRoot, '.notification-cas-v1'))).resolves.toBeUndefined();
    } finally {
      await rm(tempRoot, { recursive: true, force: true });
    }
  });
});
