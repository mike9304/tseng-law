import { describe, expect, it } from 'vitest';
import {
  columnEditorExtensionNames,
  createColumnEditorExtensions,
} from '@/components/builder/columns/column-editor-extensions';

describe('column editor extensions (operations registry)', () => {
  it('registers Underline and history-capable StarterKit', () => {
    const names = columnEditorExtensionNames('placeholder');
    expect(names).toContain('underline');
    expect(names).toContain('starterKit');
    // StarterKit includes history; undo/redo toolbar depends on it.
    const extensions = createColumnEditorExtensions('placeholder');
    const starter = extensions.find((ext) => ext.name === 'starterKit');
    expect(starter).toBeTruthy();
    expect(extensions.some((ext) => ext.name === 'underline')).toBe(true);
    expect(extensions.some((ext) => ext.name === 'image')).toBe(true);
  });
});
