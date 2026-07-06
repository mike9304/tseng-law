import { describe, expect, it } from 'vitest';
import {
  builderCanvasDocumentSchema,
  builderCanvasNodeSchema,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { createBuilderFunction } from '@/lib/builder/dev/functions-model';
import { checkCodeSlotDeployReadiness } from '../code-slot-checks';
import { checkStaleDatasetBindings } from '../checks';
import { runAllChecks } from '../gate-runner';

function makeDocument(nodes: BuilderCanvasDocument['nodes']): BuilderCanvasDocument {
  return builderCanvasDocumentSchema.parse({
    version: 1,
    locale: 'ko',
    updatedAt: '2026-05-18T00:00:00.000Z',
    updatedBy: 'publish-gate-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes,
  });
}

function makeTextNode(fieldId: string) {
  return builderCanvasNodeSchema.parse({
    id: 'stale-text',
    kind: 'text',
    rect: { x: 0, y: 0, width: 320, height: 80 },
    zIndex: 1,
    content: {
      text: 'Placeholder',
      richText: richTextFromPlainText('Placeholder'),
      fontSize: 24,
      color: '#111827',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { text: fieldId },
    },
  });
}

function makeImageNode(fieldId: string) {
  return builderCanvasNodeSchema.parse({
    id: 'incompatible-image',
    kind: 'image',
    rect: { x: 0, y: 100, width: 320, height: 180 },
    zIndex: 2,
    content: {
      src: '/images/placeholder-image.svg',
      alt: 'Placeholder',
      fit: 'cover',
      link: null,
    },
    dataBinding: {
      targetId: 'home.insights.feed',
      fields: { src: fieldId },
    },
  });
}

function makeCodeBlockNode(
  id: string,
  functionSlug: string,
) {
  return builderCanvasNodeSchema.parse({
    id,
    kind: 'codeBlock',
    rect: { x: 0, y: 200, width: 420, height: 220 },
    zIndex: 3,
    content: {
      title: `Slot ${id}`,
      language: 'js',
      code: 'ctx.log("fallback"); return true;',
      runMode: 'function',
      functionSlug,
      showLineNumbers: true,
    },
  });
}

describe('publish gate dataset binding checks', () => {
  it('warns about missing and incompatible dataset field mappings before publish', async () => {
    const document = makeDocument([
      makeTextNode('removedTitle'),
      makeImageNode('title'),
    ]);

    const results = checkStaleDatasetBindings(document);

    expect(results).toEqual([
      expect.objectContaining({
        id: 'data-binding-stale-inventory',
        severity: 'warning',
        category: 'data',
        affectedNodeIds: ['stale-text', 'incompatible-image'],
        message: expect.stringContaining('2 elements / 2 fields'),
      }),
    ]);
    expect(results[0]?.message).toContain('stale-text text: removedTitle');
    expect(results[0]?.message).toContain('incompatible-image src: title');

    const suite = await runAllChecks(document);
    expect(suite.hasBlocker).toBe(false);
    expect(suite.results.some((result) => result.category === 'data')).toBe(true);
    expect(suite.warningCount).toBeGreaterThanOrEqual(2);
  });

  it('passes valid dataset field mappings', () => {
    const document = makeDocument([
      makeTextNode('title'),
      makeImageNode('featuredImage'),
    ]);

    expect(checkStaleDatasetBindings(document)).toEqual([]);
  });
});

describe('publish gate code slot deploy checks', () => {
  it('blocks saved-function code slots when the binding is missing or unresolved', async () => {
    const document = makeDocument([
      makeCodeBlockNode('slot-missing-binding', ''),
      makeCodeBlockNode('slot-missing-function', 'does-not-exist'),
    ]);

    const results = checkCodeSlotDeployReadiness(document, []);

    expect(results).toEqual([
      expect.objectContaining({
        id: 'code-slot-function-unselected-slot-missing-binding',
        severity: 'blocker',
        category: 'dev',
        affectedNodeIds: ['slot-missing-binding'],
      }),
      expect.objectContaining({
        id: 'code-slot-function-missing-slot-missing-function',
        severity: 'blocker',
        category: 'dev',
        affectedNodeIds: ['slot-missing-function'],
      }),
    ]);

    const suite = await runAllChecks(document);
    expect(suite.hasBlocker).toBe(true);
    expect(suite.results.some((result) => result.id === 'code-slot-function-missing-slot-missing-function'))
      .toBe(true);
  });

  it('blocks saved-function code slots when the selected function is disabled or empty', () => {
    const disabled = createBuilderFunction({
      name: 'Disabled function',
      slug: 'disabled-slot',
      code: 'return true;',
      enabled: false,
    });
    const empty = createBuilderFunction({
      name: 'Empty function',
      slug: 'empty-slot',
      code: '',
    });
    const document = makeDocument([
      makeCodeBlockNode('slot-disabled-function', disabled.slug),
      makeCodeBlockNode('slot-empty-function', empty.slug),
    ]);

    const results = checkCodeSlotDeployReadiness(document, [disabled, empty]);

    expect(results).toEqual([
      expect.objectContaining({
        id: 'code-slot-function-disabled-slot-disabled-function',
        severity: 'blocker',
        category: 'dev',
        affectedNodeIds: ['slot-disabled-function'],
      }),
      expect.objectContaining({
        id: 'code-slot-function-empty-slot-empty-function',
        severity: 'blocker',
        category: 'dev',
        affectedNodeIds: ['slot-empty-function'],
      }),
    ]);
  });

  it('blocks saved-function code slots when the function source has syntax errors or banned APIs', () => {
    const syntaxError = createBuilderFunction({
      name: 'Syntax error function',
      slug: 'syntax-error-slot',
      code: 'return ctx.now();\n}',
    });
    const bannedApi = createBuilderFunction({
      name: 'Banned API function',
      slug: 'banned-api-slot',
      code: 'const fs = require("fs"); process.exit(1); return fs;',
    });
    const document = makeDocument([
      makeCodeBlockNode('slot-syntax-error-function', syntaxError.slug),
      makeCodeBlockNode('slot-banned-api-function', bannedApi.slug),
    ]);

    const results = checkCodeSlotDeployReadiness(document, [syntaxError, bannedApi]);

    expect(results).toEqual([
      expect.objectContaining({
        id: 'code-slot-function-syntax-slot-syntax-error-function',
        severity: 'blocker',
        category: 'dev',
        affectedNodeIds: ['slot-syntax-error-function'],
      }),
      expect.objectContaining({
        id: 'code-slot-function-banned-api-slot-banned-api-function',
        severity: 'blocker',
        category: 'dev',
        affectedNodeIds: ['slot-banned-api-function'],
        message: expect.stringContaining('require'),
      }),
    ]);
  });

  it('allows safe saved-function code that only mentions banned API names in text', () => {
    const safe = createBuilderFunction({
      name: 'Safe function',
      slug: 'safe-text-slot',
      code: [
        'const label = "process the request without require(\\"fs\\")";',
        '// fetch("https://example.com") is documentation text only.',
        'return label;',
      ].join('\n'),
    });
    const document = makeDocument([
      makeCodeBlockNode('slot-safe-function', safe.slug),
    ]);

    expect(checkCodeSlotDeployReadiness(document, [safe])).toEqual([]);
  });
});
