import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const commerceDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const permissionGate = "await requireBuilderPagePermission('view-commerce')";
const storeReadCall = /\b(?:read|list|load)[A-Z][A-Za-z0-9_]*\s*\(/g;

function findPageFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__') return [];
      return findPageFiles(path);
    }
    return entry.name === 'page.tsx' ? [path] : [];
  });
}

describe('commerce page permission inventory', () => {
  it('guards every store-reading page before its first read, list, or load call', () => {
    const pageFiles = findPageFiles(commerceDirectory).sort();

    expect(pageFiles.map((path) => relative(commerceDirectory, path))).toEqual([
      'currency/page.tsx',
      'documents/page.tsx',
      'notifications/page.tsx',
      'orders/page.tsx',
      'page.tsx',
      'payments/page.tsx',
      'products/page.tsx',
      'shipping/page.tsx',
      'tax/page.tsx',
      'webhooks/page.tsx',
    ]);

    for (const pageFile of pageFiles) {
      const relativePath = relative(commerceDirectory, pageFile);
      const source = readFileSync(pageFile, 'utf8');

      if (relativePath === 'products/page.tsx') {
        expect(source.trim()).toBe("export { default } from '../page';");
        const targetSource = readFileSync(join(commerceDirectory, 'page.tsx'), 'utf8');
        expect(targetSource.indexOf(permissionGate)).toBeGreaterThanOrEqual(0);
        continue;
      }

      const firstStoreRead = source.search(storeReadCall);
      expect(firstStoreRead, `${relativePath} must read commerce state`).toBeGreaterThanOrEqual(0);

      const gatePosition = source.indexOf(permissionGate);
      expect(gatePosition, `${relativePath} is missing the view-commerce page gate`).toBeGreaterThanOrEqual(0);
      expect(
        gatePosition,
        `${relativePath} must authorize before its first store read`,
      ).toBeLessThan(firstStoreRead);
    }
  });
});
