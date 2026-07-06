import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SitesPanel from '@/components/builder/workspace/SitesPanel';
import { getWorkspaceCopy } from '@/lib/builder/workspace/workspace-copy';

describe('SitesPanel', () => {
  it('renders an editor deep link for each registered workspace site', () => {
    const html = renderToStaticMarkup(
      <SitesPanel
        locale="ko"
        copy={getWorkspaceCopy('ko').sites}
        initialSites={[
          {
            siteId: 'workspace-site-b',
            name: 'Workspace Site B',
            accountId: 'workspace-1',
            role: 'editor',
            createdAt: '2026-06-21T00:00:00.000Z',
          },
        ]}
      />,
    );

    expect(html).toContain('href="/ko/admin-builder?siteId=workspace-site-b"');
    expect(html).toContain('data-site-open-editor="workspace-site-b"');
    expect(html).toContain('편집기 열기');
  });
});
