import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const scriptPath = path.join(process.cwd(), 'scripts/clean-next-build.mjs');
const tempRoots: string[] = [];

function createNextArtifacts() {
  const root = mkdtempSync(path.join(tmpdir(), 'next-clean-'));
  tempRoots.push(root);

  const productionErrorPage = path.join(root, '.next-build/server/pages/_error.js');
  const devManifest = path.join(root, '.next-dev/server/app-build-manifest.json');
  const customManifest = path.join(root, '.next-custom/server/app-build-manifest.json');

  mkdirSync(path.dirname(productionErrorPage), { recursive: true });
  mkdirSync(path.dirname(devManifest), { recursive: true });
  mkdirSync(path.dirname(customManifest), { recursive: true });

  writeFileSync(productionErrorPage, 'production error page');
  writeFileSync(devManifest, 'dev manifest');
  writeFileSync(customManifest, 'custom manifest');

  return {
    root,
    productionErrorPage,
    devManifest,
    customManifest,
  };
}

function runCleaner(cwd: string, overrides: Partial<NodeJS.ProcessEnv> = {}) {
  const env: NodeJS.ProcessEnv = { ...process.env };
  delete env.NEXT_DEV;
  delete env.NEXT_DIST_DIR;

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  }

  execFileSync(process.execPath, [scriptPath], { cwd, env, stdio: 'pipe' });
}

describe('clean-next-build', () => {
  afterEach(() => {
    while (tempRoots.length > 0) {
      const root = tempRoots.pop();
      if (root) {
        rmSync(root, { recursive: true, force: true });
      }
    }
  });

  it('cleans only the dev dist directory when NEXT_DEV is set', () => {
    const artifacts = createNextArtifacts();

    runCleaner(artifacts.root, { NEXT_DEV: '1' });

    expect(existsSync(artifacts.productionErrorPage)).toBe(true);
    expect(existsSync(artifacts.devManifest)).toBe(false);
    expect(existsSync(artifacts.customManifest)).toBe(true);
  });

  it('cleans only the production dist directory by default', () => {
    const artifacts = createNextArtifacts();

    runCleaner(artifacts.root);

    expect(existsSync(artifacts.productionErrorPage)).toBe(false);
    expect(existsSync(artifacts.devManifest)).toBe(true);
    expect(existsSync(artifacts.customManifest)).toBe(true);
  });

  it('uses NEXT_DIST_DIR ahead of the inferred dev or production dist directory', () => {
    const artifacts = createNextArtifacts();

    runCleaner(artifacts.root, { NEXT_DEV: '1', NEXT_DIST_DIR: '.next-custom' });

    expect(existsSync(artifacts.productionErrorPage)).toBe(true);
    expect(existsSync(artifacts.devManifest)).toBe(true);
    expect(existsSync(artifacts.customManifest)).toBe(false);
  });
});
