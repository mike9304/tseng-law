import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';

let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-intake-version-test-'));
  process.env.BUILDER_AI_INTAKE_ROOT = tmpRoot;
});

afterEach(async () => {
  delete process.env.BUILDER_AI_INTAKE_ROOT;
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

function specFor(companyName: string, pages: readonly string[]): SiteSpec {
  return {
    industry: 'law',
    companyName,
    desiredPages: [...pages],
    goals: ['상담 전환'],
    brandKeywords: ['대만 법률'],
    tone: 'professional',
    colorPreference: 'cool',
    locale: 'ko',
  };
}

function draftFor(
  companyName: string,
  pages: readonly string[],
  promptVersion = 'v1',
): GeneratedSiteDraft {
  const spec = specFor(companyName, pages);
  const palette = { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' };
  return {
    spec,
    blueprint: {
      industry: 'law',
      sections: ['hero', 'services', 'contact'],
      heroHeadlineHint: 'Trust first',
      palettes: {
        cool: palette,
        warm: palette,
        neutral: palette,
        'high-contrast': palette,
        pastel: palette,
      },
    },
    palette,
    content: {
      hero: {
        sectionId: 'hero',
        headline: `${companyName} headline`,
        body: '대만 법률 상담을 빠르게 시작하세요.',
        ctaLabel: '문의하기',
      },
      sections: [
        { sectionId: 'services', headline: 'Services', body: 'Core services' },
        { sectionId: 'contact', headline: 'Contact', body: 'Contact us' },
      ],
      metaDescription: `${companyName} 설명`,
      source: 'openai' as const,
      stub: false,
    },
    plan: {
      sitemap: pages.map((title, index) => ({
        title,
        slug: index === 0 ? '/' : `/${title.toLowerCase()}`,
        purpose: `${title} purpose`,
        sections: ['hero', 'services'],
      })),
      contentPlan: [
        { sectionId: 'hero', title: 'Hero', intent: 'Positioning' },
      ],
      visualBrief: {
        direction: 'professional legal editorial',
        imagePrompt: 'office scene',
        treatment: 'documentary',
        composition: 'split',
      },
      brandBrief: {
        audience: '대만 진출 기업',
        goals: ['상담 전환'],
        keywords: ['대만 법률'],
        constraints: '',
      },
    },
    generatedAt: '2026-07-03T00:00:00.000Z',
    promptVersion,
    blueprintVersion: 'blueprint-test',
    contentVersion: 'content-test',
    promptChangelog: [{
      version: promptVersion,
      label: 'Test prompt',
      summary: 'Test prompt version',
      createdAt: '2026-07-03',
      changes: [],
    }],
  };
}

function untrustedDraft(companyName: string, pages: readonly string[]): GeneratedSiteDraft {
  const trusted = draftFor(companyName, pages);
  const content = { ...trusted.content };
  delete (content as { source?: unknown }).source;
  delete (content as { stub?: unknown }).stub;
  return { ...trusted, content };
}

function localDemoDraft(companyName: string, pages: readonly string[]): GeneratedSiteDraft {
  const trusted = draftFor(companyName, pages);
  return {
    ...trusted,
    content: { ...trusted.content, source: 'local-demo' as const, stub: true },
  };
}

describe('AI intake versions store', () => {
  it('exports the stable restore error code and a fixed allowlisted blocked message', async () => {
    const {
      AI_INTAKE_RESTORE_ERROR_CODE,
      AI_INTAKE_RESTORE_BLOCKED_MESSAGE,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    expect(AI_INTAKE_RESTORE_ERROR_CODE).toBe('intake_version_untrusted');
    expect(AI_INTAKE_RESTORE_BLOCKED_MESSAGE).toBe(
      '출처가 검증된 OpenAI 생성 결과만 복원할 수 있습니다. 이 기록은 미리보기/이력 용도입니다.',
    );
  });

  it('appends versions, lists newest first, and caps the site ledger', async () => {
    const {
      appendAiIntakeVersion,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    const first = await appendAiIntakeVersion({
      siteId: 'builder-alpha',
      createdBy: 'admin',
      spec: specFor('First Law', ['Home']),
      draft: draftFor('First Law', ['Home']),
      promptVersion: 'v1',
    }, { cap: 2, now: () => '2026-07-03T00:00:00.000Z' });
    const second = await appendAiIntakeVersion({
      siteId: 'builder-alpha',
      createdBy: 'admin',
      spec: specFor('Second Law', ['Home', 'Contact']),
      draft: draftFor('Second Law', ['Home', 'Contact'], 'v2'),
      promptVersion: 'v2',
    }, { cap: 2, now: () => '2026-07-03T00:01:00.000Z' });
    await appendAiIntakeVersion({
      siteId: 'builder-alpha',
      createdBy: 'admin',
      spec: specFor('Third Law', ['Home', 'FAQ']),
      draft: draftFor('Third Law', ['Home', 'FAQ'], 'v3'),
      promptVersion: 'v3',
    }, { cap: 2, now: () => '2026-07-03T00:02:00.000Z' });

    const versions = await listAiIntakeVersions('builder-alpha');

    expect(versions).toHaveLength(2);
    expect(versions.map((version) => version.promptVersion)).toEqual(['v3', 'v2']);
    expect(versions.map((version) => version.id)).not.toContain(first.id);
    expect(versions[1]?.id).toBe(second.id);
    expect(versions[0]).toEqual(expect.objectContaining({
      companyName: 'Third Law',
      pageCount: 2,
      sectionCount: 2,
      heroHeadline: 'Third Law headline',
    }));
  });

  it('preserves concurrent appends without clobbering earlier versions', async () => {
    const {
      appendAiIntakeVersion,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    await Promise.all(['A Law', 'B Law', 'C Law'].map((companyName) => (
      appendAiIntakeVersion({
        siteId: 'builder-alpha',
        createdBy: 'admin',
        spec: specFor(companyName, ['Home']),
        draft: draftFor(companyName, ['Home'], companyName),
        promptVersion: companyName,
      }, { cap: 10 })
    )));

    const versions = await listAiIntakeVersions('builder-alpha');

    expect(versions.map((version) => version.companyName).sort()).toEqual(['A Law', 'B Law', 'C Law']);
  });

  it('diffs spec fields and draft summary changes between two versions', async () => {
    const { diffAiIntakeVersions } = await import('@/lib/builder/ai-generator/intake-versions-store');
    const before = {
      id: 'v-before',
      siteId: 'default',
      createdAt: '2026-07-03T00:00:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v1',
      spec: specFor('Before Law', ['Home']),
      draft: draftFor('Before Law', ['Home']),
    };
    const after = {
      ...before,
      id: 'v-after',
      promptVersion: 'v2',
      spec: specFor('After Law', ['Home', 'Contact']),
      draft: draftFor('After Law', ['Home', 'Contact'], 'v2'),
    };

    const diff = diffAiIntakeVersions(before, after);

    expect(diff.specChanges).toContainEqual(expect.objectContaining({
      field: 'companyName',
      before: 'Before Law',
      after: 'After Law',
    }));
    expect(diff.draftChanges).toContainEqual(expect.objectContaining({
      field: 'pageCount',
      before: 1,
      after: 2,
    }));
    expect(diff.isEmpty).toBe(false);
  });

  it('normalizes the legacy default site id to the canonical builder site id', async () => {
    const {
      appendAiIntakeVersion,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    const record = await appendAiIntakeVersion({
      siteId: 'default',
      createdBy: 'admin',
      spec: specFor('Canonical Law', ['Home']),
      draft: draftFor('Canonical Law', ['Home']),
      promptVersion: 'v1',
    });
    const versions = await listAiIntakeVersions('tseng-law-main-site');

    expect(record.siteId).toBe('tseng-law-main-site');
    expect(versions).toHaveLength(1);
    expect(versions[0]?.companyName).toBe('Canonical Law');
  });

  it('does not overwrite an unreadable site ledger during append', async () => {
    const {
      appendAiIntakeVersion,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');
    const ledgerPath = path.join(tmpRoot, 'builder-alpha', 'versions.json');
    await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
    await fs.writeFile(ledgerPath, '{not-json', 'utf8');

    await expect(appendAiIntakeVersion({
      siteId: 'builder-alpha',
      createdBy: 'admin',
      spec: specFor('Blocked Law', ['Home']),
      draft: draftFor('Blocked Law', ['Home']),
      promptVersion: 'v1',
    })).rejects.toThrow(/unreadable/);
    await expect(fs.readFile(ledgerPath, 'utf8')).resolves.toBe('{not-json');
  });

  it('accepts and preserves the exact OpenAI provider provenance on append', async () => {
    const {
      appendAiIntakeVersion,
      getAiIntakeVersion,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    const appended = await appendAiIntakeVersion({
      siteId: 'builder-provenance',
      createdBy: 'admin',
      spec: specFor('OpenAI Law', ['Home']),
      draft: draftFor('OpenAI Law', ['Home']),
      promptVersion: 'v1',
    });

    expect(appended.draft.content.source).toBe('openai');
    expect(appended.draft.content.stub).toBe(false);
    const stored = await getAiIntakeVersion('builder-provenance', appended.id);
    expect(stored?.draft.content.source).toBe('openai');
    expect(stored?.draft.content.stub).toBe(false);
  });

  it('rejects a draft missing provenance labels on append without mutating the ledger', async () => {
    const {
      appendAiIntakeVersion,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    const seeded = await appendAiIntakeVersion({
      siteId: 'builder-reject',
      createdBy: 'admin',
      spec: specFor('Seed Law', ['Home']),
      draft: draftFor('Seed Law', ['Home']),
      promptVersion: 'v1',
    });

    await expect(appendAiIntakeVersion({
      siteId: 'builder-reject',
      createdBy: 'admin',
      spec: specFor('Untrusted Law', ['Home']),
      draft: untrustedDraft('Untrusted Law', ['Home']),
      promptVersion: 'v2',
    })).rejects.toThrow(/untrusted/);

    const versions = await listAiIntakeVersions('builder-reject');
    expect(versions).toHaveLength(1);
    expect(versions[0]?.companyName).toBe('Seed Law');
    expect(versions.map((version) => version.id)).toEqual([seeded.id]);
  });

  it('rejects local-demo and stub drafts on append', async () => {
    const {
      appendAiIntakeVersion,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');

    await expect(appendAiIntakeVersion({
      siteId: 'builder-demo',
      createdBy: 'admin',
      spec: specFor('Demo Law', ['Home']),
      draft: localDemoDraft('Demo Law', ['Home']),
      promptVersion: 'v1',
    })).rejects.toThrow(/untrusted/);

    const stubbyDraft = draftFor('Stubby Law', ['Home']);
    (stubbyDraft.content as { stub?: unknown }).stub = true;
    await expect(appendAiIntakeVersion({
      siteId: 'builder-demo',
      createdBy: 'admin',
      spec: specFor('Stubby Law', ['Home']),
      draft: stubbyDraft,
      promptVersion: 'v1',
    })).rejects.toThrow(/untrusted/);

    const versions = await listAiIntakeVersions('builder-demo');
    expect(versions).toHaveLength(0);
  });

  it('lists, gets, and diffs legacy on-disk records with computed untrusted provenance', async () => {
    const {
      listAiIntakeVersions,
      getAiIntakeVersion,
      diffAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');
    const ledgerPath = path.join(tmpRoot, 'builder-legacy', 'versions.json');
    await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
    const beforeRecord = {
      id: 'ver_legacy_before',
      siteId: 'builder-legacy',
      createdAt: '2026-07-03T00:00:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v0',
      spec: specFor('Legacy Before Law', ['Home']),
      draft: untrustedDraft('Legacy Before Law', ['Home']),
    };
    const afterRecord = {
      id: 'ver_legacy_after',
      siteId: 'builder-legacy',
      createdAt: '2026-07-03T00:01:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v0',
      spec: specFor('Legacy After Law', ['Home', 'Contact']),
      draft: untrustedDraft('Legacy After Law', ['Home', 'Contact']),
    };
    await fs.writeFile(
      ledgerPath,
      JSON.stringify({ version: 1, versions: [afterRecord, beforeRecord] }, null, 2),
      'utf8',
    );

    const versions = await listAiIntakeVersions('builder-legacy');
    expect(versions).toHaveLength(2);
    for (const summary of versions) {
      expect(summary.provenance).toBe('legacy-unverified');
      expect(summary.restorable).toBe(false);
      expect(summary.provenanceWarning).toMatch(/검증되지 않았습니다/);
    }
    expect(versions.map((version) => version.companyName).sort()).toEqual([
      'Legacy After Law',
      'Legacy Before Law',
    ]);

    const stored = await getAiIntakeVersion('builder-legacy', 'ver_legacy_before');
    expect(stored?.draft.content).not.toMatchObject({ source: 'openai' });
    expect((stored?.draft.content as { source?: unknown }).source ?? 'missing').not.toBe('openai');

    const diff = diffAiIntakeVersions(beforeRecord, afterRecord);
    expect(diff.isEmpty).toBe(false);
    expect(diff.specChanges).toContainEqual(expect.objectContaining({
      field: 'companyName',
      before: 'Legacy Before Law',
      after: 'Legacy After Law',
    }));
    expect(diff.draftChanges).toContainEqual(expect.objectContaining({
      field: 'pageCount',
      before: 1,
      after: 2,
    }));
  });

  it('keeps self-labelled but malformed ledger rows visible and blocks every restore path', async () => {
    const {
      getAiIntakeVersion,
      isIntakeVersionRestorable,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');
    const ledgerPath = path.join(tmpRoot, 'builder-adversarial', 'versions.json');
    await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
    const baseRecord = {
      id: 'ver_base',
      siteId: 'builder-adversarial',
      createdAt: '2026-07-03T00:00:01.000Z',
      createdBy: 'admin',
      promptVersion: 'v1',
      spec: specFor('Spoof Law', ['Home']),
      draft: draftFor('Spoof Law', ['Home']),
    };
    const cases: Array<[string, (record: Record<string, unknown>) => void]> = [
      ['missing-blueprint', (record) => { delete (record.draft as Record<string, unknown>).blueprint; }],
      ['missing-palette', (record) => { delete (record.draft as Record<string, unknown>).palette; }],
      ['missing-visual-brief', (record) => {
        const draft = record.draft as Record<string, unknown>;
        delete ((draft.plan as Record<string, unknown>)).visualBrief;
      }],
      ['missing-brand-brief', (record) => {
        const draft = record.draft as Record<string, unknown>;
        delete ((draft.plan as Record<string, unknown>)).brandBrief;
      }],
      ['record-version-mismatch', (record) => { record.promptVersion = 'v2'; }],
      ['invalid-record-date', (record) => { record.createdAt = 'not-a-date'; }],
      ['record-predates-draft', (record) => { record.createdAt = '2026-07-02T23:59:59.000Z'; }],
      ['invalid-draft-date', (record) => {
        (record.draft as Record<string, unknown>).generatedAt = '2026-99-99';
      }],
      ['wrong-ledger-site', (record) => { record.siteId = 'different-site'; }],
      ['spoofed-label-types', (record) => {
        const content = ((record.draft as Record<string, unknown>).content as Record<string, unknown>);
        content.source = { provider: 'openai' };
        content.stub = 0;
      }],
    ];
    const versions = cases.map(([id, mutate]) => {
      const record = JSON.parse(JSON.stringify({ ...baseRecord, id: `ver_${id}` })) as Record<string, unknown>;
      mutate(record);
      return record;
    });
    await fs.writeFile(ledgerPath, JSON.stringify({ version: 1, versions }), 'utf8');

    const summaries = await listAiIntakeVersions('builder-adversarial');

    expect(summaries).toHaveLength(cases.length);
    expect(summaries.every((summary) => summary.restorable === false)).toBe(true);
    expect(summaries.every((summary) => summary.provenance === 'legacy-unverified')).toBe(true);
    for (const [id] of cases) {
      const record = await getAiIntakeVersion('builder-adversarial', `ver_${id}`);
      expect(record).not.toBeNull();
      expect(isIntakeVersionRestorable(record, 'builder-adversarial')).toBe(false);
    }
  });

  it('salvages recoverable top-level legacy corruption without hiding valid rows', async () => {
    const {
      getAiIntakeVersion,
      isIntakeVersionRestorable,
      listAiIntakeVersions,
    } = await import('@/lib/builder/ai-generator/intake-versions-store');
    const ledgerPath = path.join(tmpRoot, 'builder-salvage', 'versions.json');
    await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
    const validSpec: SiteSpec = { ...specFor('Valid Law', ['Home']), locale: 'en' };
    const validDraft: GeneratedSiteDraft = {
      ...draftFor('Valid Law', ['Home']),
      spec: validSpec,
    };
    const validRecord = {
      id: 'ver_valid',
      siteId: 'builder-salvage',
      createdAt: '2026-07-03T00:00:01.000Z',
      createdBy: 'admin',
      promptVersion: 'v1',
      spec: validSpec,
      draft: validDraft,
    };
    const malformedRecord = {
      createdAt: 123,
      promptVersion: 'v1',
      spec: null,
      draft: null,
    };
    const otherwiseValidRecovered = JSON.parse(JSON.stringify({
      ...validRecord,
      id: 'ver_recovered',
    })) as Record<string, unknown>;
    delete otherwiseValidRecovered.createdBy;
    await fs.writeFile(
      ledgerPath,
      JSON.stringify({
        version: 1,
        versions: [malformedRecord, otherwiseValidRecovered, validRecord],
      }),
      'utf8',
    );

    const versions = await listAiIntakeVersions('builder-salvage', { locale: 'en' });

    expect(versions).toHaveLength(3);
    expect(versions).toContainEqual(expect.objectContaining({
      id: 'ver_valid',
      companyName: 'Valid Law',
      restorable: true,
      provenance: 'openai-verified',
    }));
    const malformed = versions.find((version) => version.id.startsWith('legacy-malformed-'));
    expect(malformed).toEqual(expect.objectContaining({
      locale: 'en',
      companyName: 'Legacy AI draft',
      restorable: false,
      provenance: 'legacy-unverified',
    }));
    const recovered = versions.find((version) => version.id === 'ver_recovered');
    expect(recovered).toEqual(expect.objectContaining({
      restorable: false,
      provenance: 'legacy-unverified',
    }));
    const recoveredRecord = await getAiIntakeVersion('builder-salvage', 'ver_recovered');
    expect(recoveredRecord).toEqual(expect.objectContaining({ ledgerIntegrity: 'malformed' }));
    expect(isIntakeVersionRestorable(recoveredRecord, 'builder-salvage')).toBe(false);
    expect(isIntakeVersionRestorable(malformedRecord, 'builder-salvage')).toBe(false);
  });

  it.each([
    ['missing nested plan brief', (draft: GeneratedSiteDraft) => {
      delete (draft.plan as unknown as Record<string, unknown>).visualBrief;
    }, undefined],
    ['record/draft version mismatch', (draft: GeneratedSiteDraft) => {
      draft.promptVersion = 'different-version';
    }, undefined],
    ['invalid draft date', (draft: GeneratedSiteDraft) => {
      draft.generatedAt = 'not-a-date';
    }, undefined],
    ['invalid record date', (_draft: GeneratedSiteDraft) => {}, 'not-a-date'],
    ['record date before draft generation', (_draft: GeneratedSiteDraft) => {}, '2026-07-02T23:59:59.000Z'],
  ])('rejects exact OpenAI labels when append integrity fails: %s', async (_label, mutate, now) => {
    const { appendAiIntakeVersion, listAiIntakeVersions } = await import(
      '@/lib/builder/ai-generator/intake-versions-store'
    );
    const draft = draftFor('Adversarial Append Law', ['Home']);
    mutate(draft);

    await expect(appendAiIntakeVersion({
      siteId: 'builder-append-adversarial',
      createdBy: 'admin',
      spec: specFor('Adversarial Append Law', ['Home']),
      draft,
      promptVersion: 'v1',
    }, now ? { now: () => now } : {})).rejects.toThrow(/untrusted/);
    await expect(listAiIntakeVersions('builder-append-adversarial')).resolves.toEqual([]);
  });
});
