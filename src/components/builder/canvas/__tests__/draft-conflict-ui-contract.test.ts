import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('draft conflict editor UI contract', () => {
  it('stops autosave/navigation and never advances authoritative meta in the conflict branch', () => {
    const hook = read('src/components/builder/canvas/hooks/useSandboxSiteState.ts');
    const exactConflictBranch = hook.slice(
      hook.indexOf('const exactConflict = readExactDraftConflict'),
      hook.indexOf("if (response.status === 401 || response.status === 403)"),
    );

    expect(hook).toContain('if (draftConflict) return undefined;');
    expect(hook).toContain('|| draftConflictRef.current');
    expect(hook).toContain('if (draftConflictRef.current) return;');
    expect(exactConflictBranch).toContain('createDraftConflictTransition({');
    expect(exactConflictBranch).toContain('setDraftConflict(transition.conflict);');
    expect(exactConflictBranch).not.toContain('setDraftMeta(');
    expect(exactConflictBranch).not.toContain('markDraftDocumentSynced(');
    expect(exactConflictBranch).not.toContain('setSyncedUpdatedAt(');
  });

  it('hard-disables page, locale, admin, publish, and scheduled-publish entry surfaces', () => {
    const page = read('src/components/builder/canvas/SandboxPage.tsx');
    const topBar = read('src/components/builder/canvas/SandboxTopBar.tsx');
    const rail = read('src/components/builder/canvas/SandboxEditorRail.tsx');

    expect(topBar).toContain('if (navigationBlockedReason) return;');
    expect(topBar).toContain('disabled={Boolean(navigationBlockedReason || !onOpenPages)}');
    expect(topBar).toContain('{onLocaleChange && !navigationBlockedReason ? (');
    expect(topBar).toContain('disabled={Boolean(navigationBlockedReason)}');
    expect(topBar).toContain("data-builder-publish-conflict-blocked={draftConflictActive ? 'true' : 'false'}");
    expect(topBar).toContain('disabled={Boolean(publishBlockedReason)}');
    expect(page).toContain('if (hasDraftConflict) {');
    expect(page).toContain('publishOpen={publishOpen && !hasDraftConflict}');
    expect(page).toContain('if (hasDraftConflict) setPublishOpen(false);');
    expect(page).toContain('onDownloadLocalBackup={handleDownloadDraftConflictRecovery}');
    expect(page).toContain('onUseServerLatest={handleUseServerDraftAfterConflict}');
    expect(rail).toContain('href={`/${locale}/admin-builder/cms`}');
    expect(rail).toContain('href={`/${locale}/admin-builder/apps`}');
    expect(rail).toContain('href={`/${locale}/admin-builder/ai-generator`}');
    expect(rail).toContain('href={`/${locale}/admin-builder/columns?new=1`}');
    expect(page).toContain('isBuilderAdminNavigationHref(href)');
    expect(page).toContain('onClickCapture={blockAdminNavigationDuringConflict}');
    expect(page).toContain('onAuxClickCapture={blockAdminNavigationDuringConflict}');
    expect(page).toContain('onContextMenuCapture={blockAdminNavigationDuringConflict}');
    expect(page).toContain('event.nativeEvent.stopImmediatePropagation();');
  });
});
