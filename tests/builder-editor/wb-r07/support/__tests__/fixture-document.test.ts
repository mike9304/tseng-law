import { mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { createFixtureDocument, FixtureDocumentError, resolveFixturePath, validateFixtureDocument } from '../fixture-document';

const roots: string[] = [];
const token = 'wb_r07_fixture_token_0123456789';
function root(): string { const value = mkdtempSync(path.join(os.tmpdir(), 'wb-r07-fixture-')); roots.push(value); return realpathSync(value); }
function document(isolationRoot: string) { return createFixtureDocument({ isolationRoot, ownershipToken: token }); }
afterEach(() => { while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true }); });

describe('WB-R07 fixture isolation document', () => {
  it('builds and validates sentinel ownership without writing files', () => {
    const isolationRoot = root();
    expect(validateFixtureDocument(document(isolationRoot)).isolationRoot).toBe(isolationRoot);
  });

  it('rejects relative/missing roots and root-equal, relative, missing, and traversal paths', () => {
    const isolationRoot = root(); writeFileSync(path.join(isolationRoot, 'safe.json'), '{}');
    const built = document(isolationRoot);
    for (const candidate of ['', '.', '../outside.json', path.join(isolationRoot, 'safe.json'), 'missing.json']) expect(() => resolveFixturePath(built, candidate)).toThrow(FixtureDocumentError);
    expect(resolveFixturePath(built, 'safe.json')).toBe(realpathSync(path.join(isolationRoot, 'safe.json')));
    expect(() => createFixtureDocument({ isolationRoot: 'relative', ownershipToken: token })).toThrow(FixtureDocumentError);
    expect(() => createFixtureDocument({ isolationRoot: path.join(isolationRoot, 'missing'), ownershipToken: token })).toThrow(FixtureDocumentError);
  });

  it('rejects root, leaf, and intermediate symlink/canonical escapes', () => {
    const parent = root(); const isolationRoot = path.join(parent, 'root'); const outside = path.join(parent, 'outside');
    mkdirSync(isolationRoot); mkdirSync(outside); writeFileSync(path.join(outside, 'secret.json'), '{}');
    symlinkSync(outside, path.join(isolationRoot, 'nested')); symlinkSync(path.join(outside, 'secret.json'), path.join(isolationRoot, 'leaf.json'));
    const built = document(isolationRoot);
    expect(() => resolveFixturePath(built, 'nested/secret.json')).toThrow(FixtureDocumentError);
    expect(() => resolveFixturePath(built, 'leaf.json')).toThrow(FixtureDocumentError);
    const linkedRoot = path.join(parent, 'root-link'); symlinkSync(isolationRoot, linkedRoot);
    expect(() => createFixtureDocument({ isolationRoot: linkedRoot, ownershipToken: token })).toThrow(FixtureDocumentError);
    const ancestorLink = path.join(parent, 'ancestor-link'); symlinkSync(parent, ancestorLink);
    expect(() => createFixtureDocument({ isolationRoot: path.join(ancestorLink, 'root'), ownershipToken: token })).toThrow(FixtureDocumentError);
  });
});
