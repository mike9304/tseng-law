import { createHash, randomUUID } from 'crypto';
import {
  access,
  link,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  symlink,
  writeFile,
} from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteBuilderImageAsset,
  listBuilderImageAssets,
  readBuilderImageAsset,
  readBuilderAssetLibraryState,
  uploadBuilderImageAsset,
  writeBuilderAssetLibraryState,
} from '@/lib/builder/assets';
import {
  SafeLocalFsSafetyError,
  _setSafeLocalFsHookForTests,
  type SafeLocalFsTestHookStage,
} from '@/lib/builder/storage/safe-local-fs';

let tempRoot: string | null = null;
let originalBlobToken: string | undefined;
let originalAssetsRoot: string | undefined;
let originalQaIsolationRoot: string | undefined;

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-assets-root-'));
  originalBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  originalAssetsRoot = process.env.BUILDER_ASSETS_ROOT;
  originalQaIsolationRoot = process.env.BUILDER_QA_ISOLATION_ROOT;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BUILDER_ASSETS_ROOT;
  delete process.env.BUILDER_QA_ISOLATION_ROOT;
});

afterEach(async () => {
  vi.restoreAllMocks();
  _setSafeLocalFsHookForTests(null);
  if (originalBlobToken === undefined) {
    delete process.env.BLOB_READ_WRITE_TOKEN;
  } else {
    process.env.BLOB_READ_WRITE_TOKEN = originalBlobToken;
  }
  if (originalQaIsolationRoot === undefined) {
    delete process.env.BUILDER_QA_ISOLATION_ROOT;
  } else {
    process.env.BUILDER_QA_ISOLATION_ROOT = originalQaIsolationRoot;
  }
  if (originalAssetsRoot === undefined) {
    delete process.env.BUILDER_ASSETS_ROOT;
  } else {
    process.env.BUILDER_ASSETS_ROOT = originalAssetsRoot;
  }
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
  tempRoot = null;
});

function imageFile(name: string, content: string): File {
  return new File([Buffer.from(content)], name, { type: 'image/png' });
}

function checksum(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function injectOnce(
  expectedStage: SafeLocalFsTestHookStage,
  injection: (absolutePath: string) => void | Promise<void>,
): void {
  let injected = false;
  _setSafeLocalFsHookForTests(async (stage, absolutePath) => {
    if (!injected && stage === expectedStage) {
      injected = true;
      await injection(absolutePath);
    }
  });
}

describe.sequential('builder asset filesystem root', () => {
  it('uses a trimmed absolute BUILDER_ASSETS_ROOT for file writes and reads only', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const isolatedRoot = path.join(tempRoot, 'isolated-assets');
    const uniqueName = `qa-${randomUUID()}.png`;
    process.env.BUILDER_ASSETS_ROOT = `  ${isolatedRoot}  `;

    const uploaded = await uploadBuilderImageAsset({
      locale: 'ko',
      file: imageFile(uniqueName, 'isolated-asset-content'),
    });

    const isolatedFile = path.join(
      isolatedRoot,
      'builder',
      'assets',
      'ko',
      uploaded.filename,
    );
    await expect(readFile(isolatedFile, 'utf8')).resolves.toBe('isolated-asset-content');
    await expect(readBuilderImageAsset({
      locale: 'ko',
      assetPath: [uploaded.filename],
    })).resolves.toMatchObject({
      backend: 'file',
      content: Buffer.from('isolated-asset-content'),
      contentType: 'image/png',
    });
    await expect(listBuilderImageAssets({ locale: 'ko' })).resolves.toEqual([
      expect.objectContaining({ filename: uploaded.filename, backend: 'file' }),
    ]);
    await writeBuilderAssetLibraryState({
      locale: 'ko',
      library: { tags: ['hero', 'qa-safe'] },
    });
    await expect(readBuilderAssetLibraryState({ locale: 'ko' })).resolves.toMatchObject({
      tags: expect.arrayContaining(['hero', 'qa-safe']),
    });

    const canonicalCandidate = path.join(
      process.cwd(),
      'runtime-data',
      'builder-assets',
      'builder',
      'assets',
      'ko',
      uploaded.filename,
    );
    await expect(access(canonicalCandidate)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('rejects a relative or blank BUILDER_ASSETS_ROOT with a clear error', async () => {
    process.env.BUILDER_ASSETS_ROOT = 'relative/assets';
    await expect(listBuilderImageAssets({ locale: 'ko' })).rejects.toThrow(
      'BUILDER_ASSETS_ROOT must be an absolute path.',
    );

    process.env.BUILDER_ASSETS_ROOT = '   ';
    await expect(readBuilderAssetLibraryState({ locale: 'ko' })).rejects.toThrow(
      'BUILDER_ASSETS_ROOT must be an absolute path.',
    );
  });

  it('keeps the default process.cwd()/runtime-data/builder-assets behavior in an isolated cwd', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const isolatedCwd = path.join(tempRoot, 'cwd');
    vi.spyOn(process, 'cwd').mockReturnValue(isolatedCwd);

    const uploaded = await uploadBuilderImageAsset({
      locale: 'en',
      file: imageFile('default-root.png', 'default-root-content'),
    });

    const expectedFile = path.join(
      isolatedCwd,
      'runtime-data',
      'builder-assets',
      'builder',
      'assets',
      'en',
      uploaded.filename,
    );
    await expect(readFile(expectedFile, 'utf8')).resolves.toBe('default-root-content');
    await expect(readBuilderImageAsset({
      locale: 'en',
      assetPath: [uploaded.filename],
    })).resolves.toMatchObject({
      backend: 'file',
      content: Buffer.from('default-root-content'),
    });
  });

  it('rejects traversal-shaped asset route input before any filesystem access', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    process.env.BUILDER_ASSETS_ROOT = tempRoot;
    const outside = path.join(tempRoot, '..', `escaped-${randomUUID()}.png`);

    await expect(readBuilderImageAsset({
      locale: 'ko',
      assetPath: ['../escaped.png'],
    })).resolves.toBeNull();
    await expect(access(outside)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('physically confines QA assets to the attested isolation root', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const isolationRootInput = path.join(tempRoot, 'qa-isolation');
    const outsideRoot = path.join(tempRoot, 'outside-assets');
    const sentinel = path.join(outsideRoot, 'sentinel.txt');
    await mkdir(isolationRootInput);
    await mkdir(outsideRoot);
    await writeFile(sentinel, 'outside sentinel', 'utf8');
    const before = checksum(await readFile(sentinel));
    const isolationRoot = await realpath(isolationRootInput);

    process.env.BUILDER_QA_ISOLATION_ROOT = isolationRoot;
    process.env.BUILDER_ASSETS_ROOT = outsideRoot;

    await expect(listBuilderImageAssets({ locale: 'ko' })).rejects.toThrow(
      'BUILDER_ASSETS_ROOT must remain physically within BUILDER_QA_ISOLATION_ROOT.',
    );
    expect(checksum(await readFile(sentinel))).toBe(before);

    const linkedAssetsRoot = path.join(isolationRoot, 'linked-assets');
    await symlink(outsideRoot, linkedAssetsRoot, 'dir');
    process.env.BUILDER_ASSETS_ROOT = linkedAssetsRoot;
    await expect(listBuilderImageAssets({ locale: 'ko' })).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    expect(checksum(await readFile(sentinel))).toBe(before);

    const isolationAlias = path.join(tempRoot, 'qa-isolation-alias');
    await symlink(isolationRoot, isolationAlias, 'dir');
    process.env.BUILDER_QA_ISOLATION_ROOT = isolationAlias;
    process.env.BUILDER_ASSETS_ROOT = path.join(isolationAlias, 'builder-assets');
    await expect(listBuilderImageAssets({ locale: 'ko' })).rejects.toThrow(
      'BUILDER_QA_ISOLATION_ROOT must use its attested physical path.',
    );
    expect(checksum(await readFile(sentinel))).toBe(before);
  });

  it('rejects a symlink ancestor inside the asset root without reading outside', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const assetRoot = path.join(tempRoot, 'asset-root');
    const outsideRoot = path.join(tempRoot, 'outside');
    const sentinel = path.join(outsideRoot, 'assets', 'ko', 'outside.png');
    await mkdir(assetRoot);
    await mkdir(path.dirname(sentinel), { recursive: true });
    await writeFile(sentinel, 'outside sentinel', 'utf8');
    const before = checksum(await readFile(sentinel));
    await symlink(outsideRoot, path.join(assetRoot, 'builder'), 'dir');
    process.env.BUILDER_ASSETS_ROOT = assetRoot;

    await expect(readBuilderImageAsset({
      locale: 'ko',
      assetPath: ['outside.png'],
    })).rejects.toMatchObject({ code: 'symlink_rejected' });
    expect(checksum(await readFile(sentinel))).toBe(before);
  });

  it('rejects symlink asset leaves for read, list, library read, and delete', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const assetRoot = path.join(tempRoot, 'asset-root');
    const localeRoot = path.join(assetRoot, 'builder', 'assets', 'ko');
    const outsideRoot = path.join(tempRoot, 'outside');
    const sentinel = path.join(outsideRoot, 'sentinel.png');
    await mkdir(localeRoot, { recursive: true });
    await mkdir(outsideRoot);
    await writeFile(sentinel, 'outside sentinel', 'utf8');
    const before = checksum(await readFile(sentinel));
    await symlink(sentinel, path.join(localeRoot, 'symlink.png'));
    await symlink(sentinel, path.join(localeRoot, '__library.json'));
    process.env.BUILDER_ASSETS_ROOT = assetRoot;

    await expect(readBuilderImageAsset({
      locale: 'ko',
      assetPath: ['symlink.png'],
    })).rejects.toMatchObject({ code: 'symlink_rejected' });
    await expect(listBuilderImageAssets({ locale: 'ko' })).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    await expect(deleteBuilderImageAsset({
      locale: 'ko',
      filename: 'symlink.png',
    })).rejects.toMatchObject({ code: 'symlink_rejected' });
    await expect(readBuilderAssetLibraryState({ locale: 'ko' })).rejects.toMatchObject({
      code: 'symlink_rejected',
    });
    expect(checksum(await readFile(sentinel))).toBe(before);
  });

  it('rejects hard-linked image and library leaves for every local operation', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const assetRoot = path.join(tempRoot, 'asset-root');
    const localeRoot = path.join(assetRoot, 'builder', 'assets', 'ko');
    const outsideRoot = path.join(tempRoot, 'outside');
    const sentinel = path.join(outsideRoot, 'sentinel.png');
    await mkdir(localeRoot, { recursive: true });
    await mkdir(outsideRoot);
    await writeFile(sentinel, 'outside hardlink sentinel', 'utf8');
    const before = checksum(await readFile(sentinel));
    await link(sentinel, path.join(localeRoot, 'hardlink.png'));
    await link(sentinel, path.join(localeRoot, '__library.json'));
    process.env.BUILDER_ASSETS_ROOT = assetRoot;

    await expect(readBuilderImageAsset({
      locale: 'ko',
      assetPath: ['hardlink.png'],
    })).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(listBuilderImageAssets({ locale: 'ko' })).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(deleteBuilderImageAsset({
      locale: 'ko',
      filename: 'hardlink.png',
    })).rejects.toMatchObject({ code: 'hardlink_rejected' });
    await expect(readBuilderAssetLibraryState({ locale: 'ko' })).rejects.toMatchObject({
      code: 'hardlink_rejected',
    });
    await expect(writeBuilderAssetLibraryState({
      locale: 'ko',
      library: { tags: ['must-not-overwrite'] },
    })).rejects.toMatchObject({ code: 'hardlink_rejected' });
    expect(checksum(await readFile(sentinel))).toBe(before);
  });

  it('fails closed if the asset root is swapped after read preflight', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const assetRoot = path.join(tempRoot, 'asset-root');
    const parkedRoot = path.join(tempRoot, 'asset-root-parked');
    const outsideRoot = path.join(tempRoot, 'outside');
    const filename = 'inside.png';
    await mkdir(path.join(assetRoot, 'builder', 'assets', 'ko'), { recursive: true });
    const outsideTarget = path.join(outsideRoot, 'builder', 'assets', 'ko', filename);
    await mkdir(path.dirname(outsideTarget), { recursive: true });
    await writeFile(path.join(assetRoot, 'builder', 'assets', 'ko', filename), 'inside', 'utf8');
    await writeFile(outsideTarget, 'outside read sentinel', 'utf8');
    const before = checksum(await readFile(outsideTarget));
    process.env.BUILDER_ASSETS_ROOT = assetRoot;

    injectOnce('after-preflight-before-open', async () => {
      await rename(assetRoot, parkedRoot);
      await symlink(outsideRoot, assetRoot, 'dir');
    });

    await expect(readBuilderImageAsset({
      locale: 'ko',
      assetPath: [filename],
    })).rejects.toBeInstanceOf(SafeLocalFsSafetyError);
    expect(checksum(await readFile(outsideTarget))).toBe(before);
  });

  it('fails closed if the asset root is swapped after write preflight', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const assetRoot = path.join(tempRoot, 'asset-root');
    const parkedRoot = path.join(tempRoot, 'asset-root-parked');
    const outsideRoot = path.join(tempRoot, 'outside');
    await mkdir(path.join(assetRoot, 'builder', 'assets', 'ko'), { recursive: true });
    const outsideLocaleRoot = path.join(outsideRoot, 'builder', 'assets', 'ko');
    await mkdir(outsideLocaleRoot, { recursive: true });
    const sentinel = path.join(outsideLocaleRoot, 'sentinel.txt');
    await writeFile(sentinel, 'outside sentinel', 'utf8');
    const before = checksum(await readFile(sentinel));
    process.env.BUILDER_ASSETS_ROOT = assetRoot;

    injectOnce('after-preflight-before-open', async () => {
      await rename(assetRoot, parkedRoot);
      await symlink(outsideRoot, assetRoot, 'dir');
    });

    await expect(uploadBuilderImageAsset({
      locale: 'ko',
      file: imageFile('race.png', 'must stay inside'),
    })).rejects.toBeInstanceOf(SafeLocalFsSafetyError);
    expect(checksum(await readFile(sentinel))).toBe(before);
    await expect(readdir(outsideLocaleRoot)).resolves.toEqual(['sentinel.txt']);
  });

  it('fails closed if the asset root is swapped after list or delete preflight', async () => {
    if (!tempRoot) throw new Error('Expected a temporary root.');
    const outsideRoot = path.join(tempRoot, 'outside');
    await mkdir(outsideRoot);

    for (const operation of ['list', 'delete'] as const) {
      const assetRoot = path.join(tempRoot, `asset-root-${operation}`);
      const parkedRoot = path.join(tempRoot, `asset-root-${operation}-parked`);
      const filename = `${operation}.png`;
      await mkdir(path.join(assetRoot, 'builder', 'assets', 'ko'), { recursive: true });
      await writeFile(path.join(assetRoot, 'builder', 'assets', 'ko', filename), 'inside', 'utf8');
      const outsideTarget = path.join(outsideRoot, 'builder', 'assets', 'ko', filename);
      await mkdir(path.dirname(outsideTarget), { recursive: true });
      await writeFile(outsideTarget, `outside ${operation} sentinel`, 'utf8');
      const before = checksum(await readFile(outsideTarget));
      process.env.BUILDER_ASSETS_ROOT = assetRoot;

      injectOnce(
        operation === 'list'
          ? 'after-preflight-before-directory-io'
          : 'after-preflight-before-unlink',
        async () => {
          await rename(assetRoot, parkedRoot);
          await symlink(outsideRoot, assetRoot, 'dir');
        },
      );

      const result = operation === 'list'
        ? listBuilderImageAssets({ locale: 'ko' })
        : deleteBuilderImageAsset({ locale: 'ko', filename });
      await expect(result).rejects.toBeInstanceOf(SafeLocalFsSafetyError);
      expect(checksum(await readFile(outsideTarget))).toBe(before);
      _setSafeLocalFsHookForTests(null);
    }
  });
});
