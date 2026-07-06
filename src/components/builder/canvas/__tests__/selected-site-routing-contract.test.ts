import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('selected workspace site routing contract', () => {
  it('keeps the editor client APIs scoped to the selected site id', () => {
    const builderPage = read('src/app/(builder)/[locale]/admin-builder/page.tsx');
    const sandboxPage = read('src/components/builder/canvas/SandboxPage.tsx');
    const sandboxState = read('src/components/builder/canvas/hooks/useSandboxSiteState.ts');
    const workspace = read('src/components/builder/canvas/SandboxEditorWorkspace.tsx');
    const workspaceTypes = read('src/components/builder/canvas/SandboxEditorWorkspace.types.ts');
    const rail = read('src/components/builder/canvas/SandboxEditorRail.tsx');
    const pageSwitcher = read('src/components/builder/canvas/PageSwitcher.tsx');
    const topBar = read('src/components/builder/canvas/SandboxTopBar.tsx');
    const localeSwitcher = read('src/components/builder/canvas/LocaleSwitcher.tsx');
    const modalsRoot = read('src/components/builder/canvas/SandboxModalsRoot.tsx');
    const moveModal = read('src/components/builder/canvas/MoveToPageModal.tsx');
    const publishChecks = read('src/components/builder/canvas/usePublishChecks.ts');

    expect(builderPage).toContain('siteId={siteId}');
    expect(sandboxPage).toContain('siteId: string;');
    expect(sandboxPage).toContain('siteId,');
    expect(sandboxPage).toContain('useSandboxSiteState({');
    expect(sandboxPage).toContain('new URLSearchParams({ locale, siteId }).toString()');
    expect(sandboxPage).toContain('new URLSearchParams({ siteId, pageId: activePageId }).toString()');
    expect(sandboxPage).not.toContain("siteId: 'default'");
    expect(sandboxPage).not.toContain('siteId=default');

    expect(workspaceTypes).toContain('siteId: string;');
    expect(workspace).toContain('siteId,');
    expect(workspace).toContain('siteId={siteId}');
    expect(rail).toContain('siteId: string;');
    expect(rail).toContain('siteId={siteId}');
    expect(pageSwitcher).toContain('siteScopedQuery(locale, siteId)');
    expect(pageSwitcher).toContain('siteId: string;');
    expect(pageSwitcher).toContain("body: JSON.stringify({\n          siteId,\n          locale,");
    expect(pageSwitcher).not.toContain("fetch(`/api/builder/site/pages?locale=${locale}`");
    expect(pageSwitcher).not.toContain("fetch('/api/builder/site/pages'");
    expect(pageSwitcher).not.toContain('siteId=default');

    expect(topBar).toContain('siteId: string;');
    expect(topBar).toContain('siteId={siteId}');
    expect(localeSwitcher).toContain('siteId: string;');
    expect(localeSwitcher).toContain("new URLSearchParams({ locale: currentLocale, siteId }).toString()");
    expect(localeSwitcher).toContain("new URLSearchParams({ locale, siteId }).toString()");
    expect(localeSwitcher).toContain('siteId,');
    expect(localeSwitcher).not.toContain('`/api/builder/site/pages/${activePageId}/linked`,');

    expect(sandboxState).toContain('siteScopedQuery(locale, siteId)');
    expect(sandboxState).toContain('body: JSON.stringify({ siteId, expectedRevision, document: nextDocument })');
    expect(sandboxState).toContain("body: JSON.stringify({\n        siteId,\n        locale,");
    expect(sandboxState).not.toContain("siteId: 'default'");
    expect(sandboxState).not.toContain('siteId=default');

    expect(modalsRoot).toContain('siteId={siteId}');
    expect(moveModal).toContain('body: JSON.stringify({\n            siteId,');
    expect(publishChecks).toContain('siteId,');
    expect(publishChecks).not.toContain("siteId: 'default'");
  });
});
