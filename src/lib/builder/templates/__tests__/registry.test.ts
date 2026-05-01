import { readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { builderCanvasDocumentSchema } from '@/lib/builder/canvas/types';
import {
  getAllTemplates,
  getTemplateCatalog,
  getTemplateCategories,
} from '@/lib/builder/templates/registry';

const XFAIL_TEMPLATES = new Map<string, string>();

describe('template registry', () => {
  const all = getAllTemplates();

  it('returns 170 active templates', () => {
    expect(all).toHaveLength(170);
  });

  it('has 17 active categories', () => {
    const cats = getTemplateCategories();
    expect(cats).toHaveLength(17);
  });

  it('has 10 templates per category', () => {
    const byCat = new Map<string, number>();
    for (const t of all) byCat.set(t.category, (byCat.get(t.category) ?? 0) + 1);
    for (const [cat, count] of byCat) {
      expect(count, `category ${cat}`).toBe(10);
    }
  });

  it('has unique template ids', () => {
    const ids = all.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('disk exports match registry', () => {
    const templateRoot = join(process.cwd(), 'src/lib/builder/templates');
    const diskIds = getTemplateCategories()
      .flatMap((cat) =>
        readdirSync(join(templateRoot, cat.id))
          .filter((file) => file.endsWith('.ts'))
          .map((file) => basename(file, '.ts')),
      )
      .sort();
    const registryIds = all.map((t) => t.id).sort();
    const catalogIds = getTemplateCatalog().map((t) => t.id).sort();

    expect(diskIds).toHaveLength(170);
    expect(registryIds).toEqual(diskIds);
    expect(catalogIds).toEqual(registryIds);
  });

  describe('per-template document validation', () => {
    for (const t of all) {
      it(`${t.id} canvas document parses`, () => {
        const result = builderCanvasDocumentSchema.safeParse(t.document);
        const expectedFailure = XFAIL_TEMPLATES.get(t.id);
        if (expectedFailure) {
          if (result.success) {
            throw new Error(`Template ${t.id} is listed as XFAIL but now parses: ${expectedFailure}`);
          }
          expect(
            result.error.issues.some((issue) => issue.path.join('.')?.endsWith('style.borderRadius')),
            `${t.id} xfail reason changed: ${expectedFailure}`,
          ).toBe(true);
          return;
        }
        if (!result.success) {
          console.error(`Template ${t.id} validation errors:`, result.error.issues.slice(0, 3));
        }
        expect(result.success).toBe(true);
      });

      it(`${t.id} node ids unique + parent refs valid`, () => {
        const nodes = t.document.nodes;
        const ids = new Set<string>();
        const dupes: string[] = [];
        for (const n of nodes) {
          if (ids.has(n.id)) dupes.push(n.id);
          ids.add(n.id);
        }
        expect(dupes, `${t.id} duplicate ids`).toEqual([]);

        for (const n of nodes) {
          if (n.parentId) {
            expect(ids.has(n.parentId), `${t.id} node ${n.id} parent ${n.parentId} missing`).toBe(true);
          }
        }
      });
    }
  });
});
