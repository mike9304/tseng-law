import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EDITOR_PREFS,
  normalizeEditorPreferences,
} from '../editor-prefs';

describe('editor preferences normalization', () => {
  it('deep-fills missing nested preference fields from defaults', () => {
    const prefs = normalizeEditorPreferences({
      theme: 'dark',
      pixelGrid: { enabled: true },
      rulers: { enabled: false },
      outline: { enabled: true },
      alignDistribute: { showMatrix: false },
    });

    expect(prefs).toMatchObject({
      theme: 'dark',
      pixelGrid: {
        enabled: true,
        size: DEFAULT_EDITOR_PREFS.pixelGrid.size,
        color: DEFAULT_EDITOR_PREFS.pixelGrid.color,
        opacity: DEFAULT_EDITOR_PREFS.pixelGrid.opacity,
      },
      rulers: {
        enabled: false,
        unit: DEFAULT_EDITOR_PREFS.rulers.unit,
      },
      outline: {
        enabled: true,
        hideContent: DEFAULT_EDITOR_PREFS.outline.hideContent,
      },
      alignDistribute: {
        showMatrix: false,
        guideTolerancePx: DEFAULT_EDITOR_PREFS.alignDistribute.guideTolerancePx,
      },
    });
  });

  it('rejects invalid arrays and clamps numeric editor controls', () => {
    const prefs = normalizeEditorPreferences({
      theme: 'neon',
      pixelGrid: { enabled: true, size: 999, color: '', opacity: -25 },
      referenceGuides: [
        { id: 'valid-guide', axis: 'vertical', position: 144 },
        { id: 'bad-axis', axis: 'diagonal', position: 100 },
        { id: 'bad-position', axis: 'horizontal', position: '100' },
      ],
      customKeybindings: [
        { action: 'duplicate', combo: 'Mod+D' },
        { action: 'broken' },
      ],
      comments: [
        { id: 'comment-1', nodeId: 'node-1', author: 'Codex', body: 'Check spacing', createdAt: '2026-05-13T00:00:00.000Z' },
        { id: 'comment-2', nodeId: 'node-2', body: 'Missing author', createdAt: '2026-05-13T00:00:00.000Z' },
      ],
      componentLibrary: [
        { id: 'component-1', name: 'CTA', nodeJson: '{}', createdAt: '2026-05-13T00:00:00.000Z' },
        { id: 'component-2', name: 'Broken', createdAt: '2026-05-13T00:00:00.000Z' },
      ],
      alignDistribute: { guideTolerancePx: 0 },
    });

    expect(prefs.theme).toBe(DEFAULT_EDITOR_PREFS.theme);
    expect(prefs.pixelGrid.size).toBe(80);
    expect(prefs.pixelGrid.color).toBe(DEFAULT_EDITOR_PREFS.pixelGrid.color);
    expect(prefs.pixelGrid.opacity).toBe(0);
    expect(prefs.alignDistribute.guideTolerancePx).toBe(1);
    expect(prefs.referenceGuides).toEqual([{ id: 'valid-guide', axis: 'vertical', position: 144 }]);
    expect(prefs.customKeybindings).toEqual([{ action: 'duplicate', combo: 'Mod+D' }]);
    expect(prefs.comments).toHaveLength(1);
    expect(prefs.componentLibrary).toHaveLength(1);
  });
});
