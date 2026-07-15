import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import DraftConflictBanner from '../DraftConflictBanner';
import { getDraftConflictCopy } from '../SandboxPageChrome';
import type { DraftConflict } from '../hooks/useSandboxSiteState';

const conflict: DraftConflict = {
  errorCode: 'draft_conflict',
  pageId: 'page-about',
  locale: 'en',
  expectedRevision: 7,
  currentRevision: 8,
  currentSavedAt: '2026-07-13T01:02:03.000Z',
  canSaveLocalVersion: false,
  localRecovery: {
    capturedAt: '2026-07-13T01:03:00.000Z',
    filename: 'builder-local-draft-page-about-en.json',
    serializedDocument: '{"version":1}',
    byteLength: 13,
    checksumSha256: 'a'.repeat(64),
    document: {
      version: 1,
      locale: 'en',
      updatedAt: '2026-07-13T01:03:00.000Z',
      updatedBy: 'admin',
      stageWidth: 1280,
      stageHeight: 900,
      nodes: [],
    },
  },
};

describe('DraftConflictBanner', () => {
  it('renders accessible conflict details and all three explicit actions', () => {
    const html = renderToStaticMarkup(
      <DraftConflictBanner
        conflict={conflict}
        copy={getDraftConflictCopy('en')}
        locale="en"
        onDownloadLocalBackup={vi.fn(async () => true)}
        onUseServerLatest={vi.fn(async () => true)}
      />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="assertive"');
    expect(html).toContain('aria-labelledby=');
    expect(html).toContain('aria-describedby=');
    expect(html).toContain('data-builder-draft-conflict="true"');
    expect(html).toContain('Locally expected revision');
    expect(html).toContain('Current server revision');
    expect(html).toContain('Locally expected revision: 7');
    expect(html).toContain('Current server revision: 8');
    expect(html).toContain('builder-local-draft-page-about-en.json');
    expect(html).toContain('data-builder-draft-conflict-checksum="sha256"');
    expect(html).toContain('a'.repeat(64));
    expect(html).toContain('data-builder-draft-conflict-action="server-latest"');
    expect(html).toContain('data-builder-draft-conflict-action="save-local"');
    expect(html).toContain('data-builder-draft-conflict-action="download-local"');
    expect(html).toContain('Save my version</button>');
    expect(html).toMatch(/disabled=""[^>]*data-builder-draft-conflict-action="save-local"/);
    expect(html).toContain('idempotency key');
  });
});
