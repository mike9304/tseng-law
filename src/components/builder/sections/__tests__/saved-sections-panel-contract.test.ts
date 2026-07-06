import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('saved sections panel contract', () => {
  it('keeps saved-section insertion wired to draft saving and extracted card chrome', () => {
    const panel = read('src/components/builder/sections/SavedSectionsPanel.tsx');
    const card = read('src/components/builder/sections/SavedSectionCard.tsx');

    expect(panel).toContain("import SavedSectionCard from './SavedSectionCard';");
    expect(panel).toContain('data-builder-saved-section-library="true"');
    expect(panel).toContain('const setDraftSaveState = useBuilderCanvasStore((s) => s.setDraftSaveState);');
    expect(panel).toContain('const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);');
    expect(panel).toContain('setSelectedNodeId(result.rootNodeId);');
    expect(panel).toContain("setDraftSaveState('saving');");
    expect(panel).not.toContain('catch {');
    expect(panel).not.toContain('style={');
    expect(panel).not.toContain('React.CSSProperties');

    expect(card).toContain("import EditorChromeIcon from '@/components/builder/canvas/EditorChromeIcon';");
    expect(card).toContain("import styles from './SectionLibraryPanel.module.css';");
    expect(card).toContain('className={styles.savedCard}');
    expect(card).toContain('<EditorChromeIcon name="duplicate" />');
    expect(card).toContain('<EditorChromeIcon name="text" />');
    expect(card).toContain('<EditorChromeIcon name="trash" />');
    expect(card).not.toContain('style={');
    expect(card).not.toContain('React.CSSProperties');
  });
});
