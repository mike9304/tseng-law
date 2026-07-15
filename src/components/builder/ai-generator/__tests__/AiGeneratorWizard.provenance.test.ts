import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  classifyDraftProvenance,
  draftProvenancePolicy,
  isDraftProviderGenerated,
  parseGeneratedDraftResponse,
  parsePromptHistoryEntries,
  parsePromptHistoryEntry,
  parseRestorableDraft,
  parseServerVersionRestoreResponse,
  parseServerVersionsResponse,
  promptHistoryEntryProvenancePolicy,
} from '../AiGeneratorWizard';

type DraftInput = Parameters<typeof classifyDraftProvenance>[0];
type PolicyInput = Parameters<typeof draftProvenancePolicy>[0];
type ExpectedDraftSpec = Parameters<typeof parseGeneratedDraftResponse>[1];

function hydrate<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function draftWithContent(content: Record<string, unknown>): DraftInput {
  return hydrate({ content }) as unknown as DraftInput;
}

function richDraftWithContent(content: Record<string, unknown>): DraftInput {
  const palette = { primary: '#000', secondary: '#111', accent: '#222', background: '#fff' };
  return hydrate({
    spec: {
      industry: 'law',
      companyName: 'Rich Law',
      locale: 'ko',
      tone: 'professional',
      colorPreference: 'cool',
    },
    blueprint: {
      industry: 'law',
      sections: ['hero', 'services'],
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
    content,
    plan: {
      sitemap: [{ slug: '/', title: 'Home', purpose: 'landing', sections: ['hero'] }],
      contentPlan: [{ sectionId: 'hero', title: 'Hero', intent: 'trust' }],
      visualBrief: {
        direction: 'calm',
        imagePrompt: 'office',
        treatment: 'editorial',
        composition: 'split',
      },
      brandBrief: {
        audience: 'clients',
        goals: ['trust'],
        keywords: ['law'],
        constraints: '',
      },
    },
    generatedAt: '2026-07-13T00:00:00.000Z',
    promptVersion: 'ai-site-builder-2026-05-21-af',
    blueprintVersion: 'blueprint-library-v1',
    contentVersion: 'content-generator-v1',
    promptChangelog: [{
      version: 'ai-site-builder-2026-05-21-af',
      label: 'Current',
      summary: 'Current prompt',
      createdAt: '2026-05-21',
      changes: [],
    }],
  }) as unknown as DraftInput;
}

describe('AiGeneratorWizard draft provenance classifier', () => {
  it('classifies the exact OpenAI provider pair as verified and usable', () => {
    const draft = richDraftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
      stub: false,
    });

    expect(classifyDraftProvenance(draft)).toBe('openai-verified');
    expect(isDraftProviderGenerated(draft)).toBe(true);
  });

  it('classifies legacy localStorage entries lacking provenance as legacy-unverified and not usable', () => {
    const legacy = draftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [{ sectionId: 'services', headline: 'S', body: 'B' }],
      metaDescription: 'M',
    });

    expect(classifyDraftProvenance(legacy)).toBe('legacy-unverified');
    expect(isDraftProviderGenerated(legacy)).toBe(false);
  });

  it('classifies local-demo entries as local-demo and not usable', () => {
    const demo = draftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'local-demo',
      stub: true,
    });

    expect(classifyDraftProvenance(demo)).toBe('local-demo');
    expect(isDraftProviderGenerated(demo)).toBe(false);
  });

  it('treats stub:true as untrusted even when source is openai (exact pair required)', () => {
    const stubbyOpenAi = draftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
      stub: true,
    });

    expect(classifyDraftProvenance(stubbyOpenAi)).not.toBe('openai-verified');
    expect(isDraftProviderGenerated(stubbyOpenAi)).toBe(false);
  });

  it('treats source openai with missing stub as untrusted (exact pair required)', () => {
    const missingStub = draftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
    });

    expect(classifyDraftProvenance(missingStub)).toBe('legacy-unverified');
    expect(isDraftProviderGenerated(missingStub)).toBe(false);
  });

  it('does not infer trust from prompt version, timestamps, or content richness', () => {
    const richButUntrusted = richDraftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [{ sectionId: 'services', headline: 'S', body: 'B' }],
      metaDescription: 'M',
    });

    expect(classifyDraftProvenance(richButUntrusted)).toBe('legacy-unverified');
    expect(isDraftProviderGenerated(richButUntrusted)).toBe(false);
  });

  it('keeps a structurally complete provider draft trusted after an intentional palette customization', () => {
    const draft = richDraftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
      stub: false,
    }) as unknown as Record<string, unknown>;
    draft.palette = {
      primary: '#102a43',
      secondary: '#0f766e',
      accent: '#d6a84f',
      background: '#f6faf9',
    };

    expect(classifyDraftProvenance(draft as unknown as DraftInput)).toBe('openai-verified');
  });

  it.each([
    ['missing visual brief', (draft: Record<string, unknown>) => {
      delete ((draft.plan as Record<string, unknown>)).visualBrief;
    }],
    ['invalid generated date', (draft: Record<string, unknown>) => {
      draft.generatedAt = 'not-a-date';
    }],
    ['active version missing from changelog', (draft: Record<string, unknown>) => {
      draft.promptVersion = 'spoofed-version';
    }],
    ['missing blueprint palette', (draft: Record<string, unknown>) => {
      delete (((draft.blueprint as Record<string, unknown>).palettes as Record<string, unknown>)).warm;
    }],
  ])('does not upgrade exact provider labels when full draft integrity fails: %s', (_label, mutate) => {
    const draft = richDraftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
      stub: false,
    }) as unknown as Record<string, unknown>;
    mutate(draft);

    expect(parseRestorableDraft(draft)).toBeNull();
    expect(classifyDraftProvenance(draft as unknown as DraftInput)).toBe('legacy-unverified');
    expect(draftProvenancePolicy(draft as unknown as PolicyInput).canRestore).toBe(false);
  });

  it('classifies null and undefined drafts as legacy-unverified and not usable', () => {
    expect(classifyDraftProvenance(null)).toBe('legacy-unverified');
    expect(isDraftProviderGenerated(null)).toBe(false);
    expect(classifyDraftProvenance(undefined)).toBe('legacy-unverified');
    expect(isDraftProviderGenerated(undefined)).toBe(false);
  });

  it('does not mutate the input draft or synthesize trust', () => {
    const content = {
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
    };
    const draft = draftWithContent(content);

    const result = classifyDraftProvenance(draft);

    expect(result).toBe('legacy-unverified');
    expect((content as { source?: unknown }).source).toBeUndefined();
    expect((content as { stub?: unknown }).stub).toBeUndefined();
    expect((draft as { content: { source?: unknown } }).content.source).toBeUndefined();
    expect((draft as { content: { stub?: unknown } }).content.stub).toBeUndefined();
  });
});

describe('AiGeneratorWizard draft provenance action policy (localStorage-hydrated)', () => {
  function policyForContent(content: Record<string, unknown>) {
    const record = { content } as unknown as PolicyInput;
    const hydrated = hydrate(record);
    return draftProvenancePolicy(hydrated);
  }

  it('grants full restore/apply/save and viewOnly=false only for the exact OpenAI pair', () => {
    const policy = draftProvenancePolicy(richDraftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
      stub: false,
    }));

    expect(policy.provenance).toBe('openai-verified');
    expect(policy.canRestore).toBe(true);
    expect(policy.canApply).toBe(true);
    expect(policy.canSave).toBe(true);
    expect(policy.viewOnly).toBe(false);
  });

  it('blocks restore/apply/save and keeps viewOnly=true for a legacy record lacking provenance', () => {
    const policy = policyForContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [{ sectionId: 'services', headline: 'S', body: 'B' }],
      metaDescription: 'M',
    });

    expect(policy.provenance).toBe('legacy-unverified');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('blocks restore/apply/save and keeps viewOnly=true for a local-demo/stub record', () => {
    const policy = policyForContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'local-demo',
      stub: true,
    });

    expect(policy.provenance).toBe('local-demo');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('blocks restore/apply/save for stub:true even when source is openai', () => {
    const policy = policyForContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
      stub: true,
    });

    expect(policy.provenance).not.toBe('openai-verified');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('blocks restore/apply/save for exact openai source with missing stub', () => {
    const policy = policyForContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'openai',
    });

    expect(policy.provenance).toBe('legacy-unverified');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('blocks restore/apply/save for malformed source/stub value types', () => {
    const numericSource = policyForContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 123,
      stub: 'false',
    });
    expect(numericSource.provenance).not.toBe('openai-verified');
    expect(numericSource.canRestore).toBe(false);
    expect(numericSource.canApply).toBe(false);
    expect(numericSource.canSave).toBe(false);
    expect(numericSource.viewOnly).toBe(true);

    const objectSource = policyForContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: { provider: 'openai' },
      stub: 0,
    });
    expect(objectSource.provenance).not.toBe('openai-verified');
    expect(objectSource.canRestore).toBe(false);
    expect(objectSource.canSave).toBe(false);
    expect(objectSource.viewOnly).toBe(true);
  });

  it('blocks restore/apply/save and stays view-only for null/undefined drafts', () => {
    const nullPolicy = draftProvenancePolicy(null);
    expect(nullPolicy.provenance).toBe('legacy-unverified');
    expect(nullPolicy.canRestore).toBe(false);
    expect(nullPolicy.canApply).toBe(false);
    expect(nullPolicy.canSave).toBe(false);
    expect(nullPolicy.viewOnly).toBe(true);

    const undefinedPolicy = draftProvenancePolicy(undefined);
    expect(undefinedPolicy.provenance).toBe('legacy-unverified');
    expect(undefinedPolicy.canRestore).toBe(false);
    expect(undefinedPolicy.canSave).toBe(false);
    expect(undefinedPolicy.viewOnly).toBe(true);
  });

  it('blocks a successful server restore response carrying an untrusted draft via the shared policy', () => {
    const serverResponsePayload = hydrate({
      ok: true,
      spec: { industry: 'law', companyName: 'Tampered Law', locale: 'ko' },
      draft: {
        spec: { industry: 'law', companyName: 'Tampered Law', locale: 'ko' },
        content: {
          hero: { sectionId: 'hero', headline: 'H', body: 'B' },
          sections: [],
          metaDescription: 'M',
        },
        plan: { sitemap: [{ slug: '/', title: 'Home' }] },
      },
    });
    const restoredDraft = (serverResponsePayload as unknown as { draft: PolicyInput }).draft;

    const policy = draftProvenancePolicy(restoredDraft);

    expect(policy.provenance).not.toBe('openai-verified');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });
});

describe('AiGeneratorWizard provenance UI wiring contract', () => {
  const source = readFileSync(
    path.join(process.cwd(), 'src/components/builder/ai-generator/AiGeneratorWizard.tsx'),
    'utf8',
  );

  it('exports the shared policy helper', () => {
    expect(source).toContain('export function draftProvenancePolicy');
    expect(source).toContain('export interface DraftProvenancePolicy');
  });

  it('renders the stable provenance warning notice and data attributes', () => {
    expect(source).toContain('PROVENANCE_DRAFT_UNTRUSTED_NOTICE');
    expect(source).toContain('data-ai-generator-draft-provenance-warning');
    expect(source).toContain('data-ai-generator-draft-trusted=');
    expect(source).toContain('data-ai-generator-history-provenance-warning');
  });

  it('wires the local-history restore guard to the shared policy', () => {
    expect(source).toContain('promptHistoryEntryProvenancePolicy(entry).canRestore');
    expect(source).toContain('!entryPolicy.canRestore');
  });

  it('wires the active-draft apply and save handler guards to the shared policy', () => {
    expect(source).toContain('draftProvenancePolicy(draft).canApply');
    expect(source).toContain('draftProvenancePolicy(draft).canSave');
  });

  it('drives the active apply and save buttons from the shared policy disabled state', () => {
    expect(source).toContain('!activeDraftPolicy.canApply');
    expect(source).toContain('!activeDraftPolicy.canSave');
  });

  it('re-checks a restored server draft through the shared policy before applying it', () => {
    expect(source).toContain('parseServerVersionRestoreResponse(rawPayload, version)');
    expect(source).toContain('draftProvenancePolicy(payload.draft).canRestore === false');
  });

  it('uses fixed allowlisted notices for server restore outcomes and the stable error code', () => {
    expect(source).toContain('SERVER_RESTORE_UNTRUSTED_ERROR_CODE');
    expect(source).toContain('PROVENANCE_RESTORE_BLOCKED_NOTICE');
    expect(source).toContain('PROVENANCE_RESTORE_FAILED_NOTICE');
    expect(source).toContain("unknownField(rawPayload, 'error') === SERVER_RESTORE_UNTRUSTED_ERROR_CODE");
  });

  it('strict-parses generation, version-list, and restore JSON before setting state', () => {
    expect(source).toContain('parseGeneratedDraftResponse(rawPayload, requestedSpec');
    expect(source).toContain('parseServerVersionsResponse(rawPayload, siteId, locale)');
    expect(source).toContain('parseServerVersionRestoreResponse(rawPayload, version)');
    expect(source).not.toContain('setServerVersions(payload.versions)');
  });
});

describe('AiGeneratorWizard localStorage history structural parser (parsePromptHistoryEntry)', () => {
  type Json = Record<string, unknown>;

  const BASE_ENTRY = {
    id: 'entry-openai-1',
    createdAt: '2026-07-13T00:00:00.000Z',
    spec: { industry: 'law', companyName: 'Trust Law', locale: 'ko' },
    draft: {
      spec: { industry: 'law', companyName: 'Trust Law', locale: 'ko' },
      blueprint: {
        industry: 'law',
        sections: ['hero', 'about', 'services', 'contact'],
        heroHeadlineHint: 'Trust first',
        palettes: {
          cool: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
          warm: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
          neutral: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
          'high-contrast': { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
          pastel: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
        },
      },
      palette: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
      content: {
        hero: { sectionId: 'hero', headline: '신뢰의 시작', body: 'Hero body' },
        sections: [{ sectionId: 'about', headline: 'About', body: 'About body' }],
        metaDescription: 'Meta description',
        source: 'openai',
        stub: false,
      },
      plan: {
        sitemap: [{ title: 'Home', slug: '/', purpose: 'landing', sections: ['hero'] }],
        contentPlan: [{ sectionId: 'about', title: 'About', intent: 'trust' }],
        visualBrief: {
          direction: 'calm',
          imagePrompt: 'hero image',
          treatment: 'editorial',
          composition: 'split',
        },
        brandBrief: {
          audience: 'clients',
          goals: ['trust'],
          keywords: ['law'],
          constraints: 'mobile-first',
        },
      },
      generatedAt: '2026-07-13T00:00:00.000Z',
      promptVersion: 'ai-site-builder-2026-05-21-af',
      blueprintVersion: 'blueprint-library-v1',
      contentVersion: 'content-generator-v1',
      promptChangelog: [
        {
          version: 'ai-site-builder-2026-05-21-af',
          label: 'L',
          summary: 'S',
          createdAt: '2026-05-21',
          changes: ['c1'],
        },
      ],
    },
  };

  function cloneEntry(): Json {
    return hydrate(BASE_ENTRY) as unknown as Json;
  }

  function cloneEntryWithContent(content: Record<string, unknown>): Json {
    const entry = cloneEntry();
    (entry.draft as Json).content = hydrate(content);
    return entry;
  }

  function expectEntryRejected(mutate: (entry: Json) => void): void {
    const entry = cloneEntry();
    mutate(entry);
    expect(parsePromptHistoryEntry(entry)).toBeNull();
  }

  it('parses a complete provider-labelled entry but keeps user-controlled local history view-only', () => {
    const entry = cloneEntry();
    const parsed = parsePromptHistoryEntry(JSON.parse(JSON.stringify(entry)));

    expect(parsed).not.toBeNull();
    const spec = (parsed as unknown as Json).spec as Json;
    expect(spec.tone).toBe('professional');
    expect(spec.colorPreference).toBe('cool');
    expect(spec.locale).toBe('ko');
    const draftSpec = ((parsed as unknown as Json).draft as Json).spec as Json;
    expect(draftSpec.tone).toBe('professional');
    expect(draftSpec.colorPreference).toBe('cool');
    expect(draftSpec.locale).toBe('ko');

    const policy = draftProvenancePolicy((parsed as unknown as Json).draft as PolicyInput);
    expect(policy.provenance).toBe('openai-verified');
    expect(policy.canRestore).toBe(true);
    expect(policy.canApply).toBe(true);
    expect(policy.canSave).toBe(true);
    expect(policy.viewOnly).toBe(false);
    const historyPolicy = promptHistoryEntryProvenancePolicy(parsed!);
    expect(historyPolicy.provenance).toBe('legacy-unverified');
    expect(historyPolicy.canRestore).toBe(false);
    expect(historyPolicy.canApply).toBe(false);
    expect(historyPolicy.canSave).toBe(false);
    expect(historyPolicy.viewOnly).toBe(true);
  });

  it.each([
    ['invalid history date', (entry: Json) => { entry.createdAt = 'not-a-date'; }],
    ['outer/draft spec mismatch', (entry: Json) => {
      (entry.spec as Json).companyName = 'Spoofed outer label';
    }],
  ])('keeps %s visible but never restores it', (_label, mutate) => {
    const entry = cloneEntry();
    mutate(entry);

    const parsed = parsePromptHistoryEntry(entry);

    expect(parsed).not.toBeNull();
    expect(promptHistoryEntryProvenancePolicy(parsed!).provenance).toBe('legacy-unverified');
    expect(promptHistoryEntryProvenancePolicy(parsed!).canRestore).toBe(false);
  });

  it('keeps a structurally valid legacy/unlabelled entry visible but view-only', () => {
    const entry = cloneEntryWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [{ sectionId: 'services', headline: 'S', body: 'B' }],
      metaDescription: 'M',
    });

    const parsed = parsePromptHistoryEntry(JSON.parse(JSON.stringify(entry)));

    expect(parsed).not.toBeNull();
    const policy = draftProvenancePolicy((parsed as unknown as Json).draft as PolicyInput);
    expect(policy.provenance).toBe('legacy-unverified');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('keeps a structurally valid local-demo entry visible but view-only', () => {
    const entry = cloneEntryWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 'local-demo',
      stub: true,
    });

    const parsed = parsePromptHistoryEntry(JSON.parse(JSON.stringify(entry)));

    expect(parsed).not.toBeNull();
    const policy = draftProvenancePolicy((parsed as unknown as Json).draft as PolicyInput);
    expect(policy.provenance).toBe('local-demo');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('keeps an entry with malformed source/stub label types parseable but untrusted (no upgrade, no synthesis)', () => {
    const entry = cloneEntryWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
      source: 123,
      stub: 'false',
    });

    const parsed = parsePromptHistoryEntry(JSON.parse(JSON.stringify(entry)));

    expect(parsed).not.toBeNull();
    const content = ((parsed as unknown as Json).draft as Json).content as Json;
    expect(content.source).toBe(123);
    expect(content.stub).toBe('false');
    const policy = draftProvenancePolicy((parsed as unknown as Json).draft as PolicyInput);
    expect(policy.provenance).not.toBe('openai-verified');
    expect(policy.canRestore).toBe(false);
    expect(policy.canApply).toBe(false);
    expect(policy.canSave).toBe(false);
    expect(policy.viewOnly).toBe(true);
  });

  it('returns null when draft.palette is missing', () => {
    expectEntryRejected((entry) => {
      delete (entry.draft as Json).palette;
    });
  });

  it('returns null when plan.contentPlan is missing', () => {
    expectEntryRejected((entry) => {
      delete ((entry.draft as Json).plan as Json).contentPlan;
    });
  });

  it('returns null when plan.visualBrief is missing', () => {
    expectEntryRejected((entry) => {
      delete ((entry.draft as Json).plan as Json).visualBrief;
    });
  });

  it('returns null when plan.brandBrief is missing', () => {
    expectEntryRejected((entry) => {
      delete ((entry.draft as Json).plan as Json).brandBrief;
    });
  });

  it('returns null when a sitemap page is missing slug', () => {
    expectEntryRejected((entry) => {
      const sitemap = ((entry.draft as Json).plan as Json).sitemap as Json[];
      const [first] = sitemap;
      delete (first as Json).slug;
    });
  });

  it('returns null when a sitemap page sections field is the wrong type', () => {
    expectEntryRejected((entry) => {
      const sitemap = ((entry.draft as Json).plan as Json).sitemap as Json[];
      (sitemap[0] as Json).sections = 'hero';
    });
  });

  it('returns null when hero body is the wrong type', () => {
    expectEntryRejected((entry) => {
      (((entry.draft as Json).content as Json).hero as Json).body = 123;
    });
  });

  it('returns null when a section body is the wrong type', () => {
    expectEntryRejected((entry) => {
      const sections = ((entry.draft as Json).content as Json).sections as Json[];
      (sections[0] as Json).body = { text: 'not a string' };
    });
  });

  it('returns null when promptChangelog is the wrong type', () => {
    expectEntryRejected((entry) => {
      (entry.draft as Json).promptChangelog = 'not-an-array';
    });
  });

  it('returns null when promptChangelog entries miss required fields', () => {
    expectEntryRejected((entry) => {
      (entry.draft as Json).promptChangelog = [{ version: 'v1' }];
    });
  });

  it('returns null for an invalid spec (unknown industry)', () => {
    expectEntryRejected((entry) => {
      (entry.spec as Json).industry = 'not-a-real-industry';
      ((entry.draft as Json).spec as Json).industry = 'not-a-real-industry';
    });
  });

  it('returns null for a malicious self-labelled openai/stub:false object missing required structure', () => {
    const malicious = hydrate({
      id: 'evil',
      createdAt: '2026-07-13T00:00:00.000Z',
      spec: { industry: 'law', companyName: 'Tampered', locale: 'ko' },
      draft: {
        spec: { industry: 'law', companyName: 'Tampered', locale: 'ko' },
        blueprint: { heroHeadlineHint: 'Trust' },
        content: {
          hero: { sectionId: 'hero', headline: 'H', body: 'B' },
          sections: [],
          metaDescription: 'M',
          source: 'openai',
          stub: false,
        },
        plan: { sitemap: [{ slug: '/', title: 'Home' }] },
      },
    });

    expect(parsePromptHistoryEntry(malicious)).toBeNull();
  });

  it('parsePromptHistoryEntries maps valid entries, drops invalid ones, and caps at 6', () => {
    const valid = cloneEntry();
    const legacyEntry = cloneEntryWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
    });
    const broken = hydrate({ id: 'broken', notADraft: true });

    const repeated = [
      ...Array.from({ length: 7 }, (_, index) => hydrate({ ...BASE_ENTRY, id: `e-${index}` })),
      broken,
      legacyEntry,
      valid,
    ];

    const parsed = parsePromptHistoryEntries(repeated);

    expect(parsed.length).toBe(6);
    expect(parsed.every((entry) => typeof entry.id === 'string')).toBe(true);
    expect(parsed.some((entry) => entry.id === 'broken')).toBe(false);
    const ids = parsed.map((entry) => entry.id);
    expect(ids).toContain('e-0');
    expect(ids).toContain('e-5');
    expect(ids).not.toContain('e-6');
  });

  it('does not mutate or synthesize content.source/content.stub on parse', () => {
    const entry = cloneEntryWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [],
      metaDescription: 'M',
    });
    const raw = JSON.parse(JSON.stringify(entry));
    const content = (raw.draft as Json).content as Json;
    expect(content.source).toBeUndefined();
    expect(content.stub).toBeUndefined();

    const parsed = parsePromptHistoryEntry(raw);
    expect(parsed).not.toBeNull();
    const parsedContent = ((parsed as unknown as Json).draft as Json).content as Json;
    expect(parsedContent.source).toBeUndefined();
    expect(parsedContent.stub).toBeUndefined();
  });
});

describe('AiGeneratorWizard localStorage history hydration wiring', () => {
  const source = readFileSync(
    path.join(process.cwd(), 'src/components/builder/ai-generator/AiGeneratorWizard.tsx'),
    'utf8',
  );

  it('exports the structural parser and array hydration helper', () => {
    expect(source).toContain('export function parsePromptHistoryEntry');
    expect(source).toContain('export function parsePromptHistoryEntries');
  });

  it('hydrates localStorage history through parsePromptHistoryEntries instead of the permissive guard', () => {
    expect(source).toContain('parsePromptHistoryEntries(parsed)');
    expect(source).not.toContain('isPromptHistoryEntry');
  });
});

describe('AiGeneratorWizard untrusted network response parsing', () => {
  function trustedDraft(): Record<string, unknown> {
    return richDraftWithContent({
      hero: { sectionId: 'hero', headline: 'H', body: 'B' },
      sections: [{ sectionId: 'services', headline: 'S', body: 'B' }],
      metaDescription: 'M',
      source: 'openai',
      stub: false,
    }) as unknown as Record<string, unknown>;
  }

  function summaryFor(draft: Record<string, unknown>) {
    const spec = draft.spec as Record<string, unknown>;
    return {
      id: 'ver_1',
      siteId: 'builder-alpha',
      createdAt: '2026-07-13T00:00:01.000Z',
      createdBy: 'admin',
      companyName: String(spec.companyName),
      industry: 'law' as const,
      locale: 'ko' as const,
      promptVersion: String(draft.promptVersion),
      pageCount: 1,
      sectionCount: 1,
      heroHeadline: 'H',
      provenance: 'openai-verified' as const,
      restorable: true,
      provenanceWarning: 'verified',
    };
  }

  function restorePayload(draft: Record<string, unknown>) {
    const summary = summaryFor(draft);
    const spec = draft.spec;
    const version = {
      id: summary.id,
      siteId: summary.siteId,
      createdAt: summary.createdAt,
      createdBy: summary.createdBy,
      promptVersion: summary.promptVersion,
      spec,
      draft,
    };
    return {
      summary,
      payload: {
        ok: true,
        siteId: summary.siteId,
        version,
        spec,
        draft,
      },
    };
  }

  it('accepts a complete generated draft response and rejects missing nested briefs before state', () => {
    const draft = trustedDraft();
    const expectedSpec = draft.spec as ExpectedDraftSpec;
    const expectedPromptVersion = String(draft.promptVersion);
    expect(parseGeneratedDraftResponse(
      { ok: true, cached: false, draft },
      expectedSpec,
      expectedPromptVersion,
    )).not.toBeNull();

    const malformed = hydrate(draft);
    delete ((malformed.plan as Record<string, unknown>).brandBrief);
    expect(parseGeneratedDraftResponse(
      { ok: true, draft: malformed },
      expectedSpec,
      expectedPromptVersion,
    )).toBeNull();
  });

  it.each([
    ['different requested spec', (draft: Record<string, unknown>) => {
      (draft.spec as Record<string, unknown>).companyName = 'Cross-site Spoof';
    }],
    ['different requested prompt version', (draft: Record<string, unknown>) => {
      draft.promptVersion = 'different-prompt';
      draft.promptChangelog = [{
        version: 'different-prompt',
        label: 'spoof',
        summary: 'spoof',
        createdAt: '2026-05-21',
        changes: [],
      }];
    }],
  ])('rejects a structurally valid generation response not bound to request context: %s', (_label, mutate) => {
    const expected = trustedDraft();
    const responseDraft = hydrate(expected);
    mutate(responseDraft);

    expect(parseGeneratedDraftResponse(
      { ok: true, draft: responseDraft },
      expected.spec as ExpectedDraftSpec,
      String(expected.promptVersion),
    )).toBeNull();
  });

  it.each([
    ['missing visual brief', (payload: Record<string, unknown>) => {
      const draft = payload.draft as Record<string, unknown>;
      delete ((draft.plan as Record<string, unknown>).visualBrief);
    }],
    ['invalid draft date', (payload: Record<string, unknown>) => {
      (payload.draft as Record<string, unknown>).generatedAt = '2026-99-99';
    }],
    ['record timestamp predates draft', (payload: Record<string, unknown>) => {
      ((payload.version as Record<string, unknown>)).createdAt = '2026-07-12T23:59:59.000Z';
    }],
    ['record/draft version mismatch', (payload: Record<string, unknown>) => {
      ((payload.version as Record<string, unknown>)).promptVersion = 'spoofed-version';
    }],
    ['source/stub spoof types', (payload: Record<string, unknown>) => {
      const content = ((payload.draft as Record<string, unknown>).content as Record<string, unknown>);
      content.source = { provider: 'openai' };
      content.stub = 0;
    }],
  ])('rejects restore payload integrity failure before state: %s', (_label, mutate) => {
    const draft = trustedDraft();
    const { summary, payload } = restorePayload(draft);
    const tampered = hydrate(payload) as unknown as Record<string, unknown>;
    mutate(tampered);

    expect(parseServerVersionRestoreResponse(tampered, summary)).toBeNull();
  });

  it('accepts only a fully consistent restore response', () => {
    const draft = trustedDraft();
    const { summary, payload } = restorePayload(draft);

    expect(parseServerVersionRestoreResponse(payload, summary)).not.toBeNull();
  });

  it('keeps an invalid-date server summary visible but downgrades it to blocked legacy', () => {
    const draft = trustedDraft();
    const summary = { ...summaryFor(draft), createdAt: 'not-a-date' };

    const versions = parseServerVersionsResponse(
      { ok: true, siteId: 'builder-alpha', versions: [summary] },
      'builder-alpha',
      'ko',
    );

    expect(versions).toHaveLength(1);
    expect(versions?.[0]?.provenance).toBe('legacy-unverified');
    expect(versions?.[0]?.restorable).toBe(false);
  });

  it.each([
    ['cross-site payload', 'builder-other', 'ko'],
    ['cross-locale row', 'builder-alpha', 'en'],
  ])('rejects version summaries not bound to the active site/locale: %s', (_label, rowSiteId, rowLocale) => {
    const draft = trustedDraft();
    const summary = {
      ...summaryFor(draft),
      siteId: rowSiteId,
      locale: rowLocale,
    };

    expect(parseServerVersionsResponse(
      { ok: true, siteId: rowSiteId, versions: [summary] },
      'builder-alpha',
      'ko',
    )).toBeNull();
  });
});
