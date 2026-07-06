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

function draftFor(companyName: string, pages: readonly string[]): GeneratedSiteDraft {
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
    promptVersion: 'ai-site-builder-2026-05-21-af',
    blueprintVersion: 'blueprint-test',
    contentVersion: 'content-test',
    promptChangelog: [],
  };
}

describe('AI intake versions store', () => {
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
      draft: draftFor('Second Law', ['Home', 'Contact']),
      promptVersion: 'v2',
    }, { cap: 2, now: () => '2026-07-03T00:01:00.000Z' });
    await appendAiIntakeVersion({
      siteId: 'builder-alpha',
      createdBy: 'admin',
      spec: specFor('Third Law', ['Home', 'FAQ']),
      draft: draftFor('Third Law', ['Home', 'FAQ']),
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
        draft: draftFor(companyName, ['Home']),
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
      draft: draftFor('After Law', ['Home', 'Contact']),
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
});
