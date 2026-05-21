export const AI_GENERATOR_PROMPT_VERSION = 'ai-site-builder-2026-05-21-af';
export const AI_GENERATOR_BLUEPRINT_VERSION = 'blueprint-library-v1';
export const AI_GENERATOR_CONTENT_VERSION = 'content-generator-v1';

export interface GeneratedPromptVersionEntry {
  version: string;
  label: string;
  summary: string;
  createdAt: string;
  changes: string[];
}

export const AI_GENERATOR_PROMPT_CHANGELOG: GeneratedPromptVersionEntry[] = [
  {
    version: AI_GENERATOR_PROMPT_VERSION,
    label: 'Responsive draft review',
    summary: 'Adds apply review metadata, page-level responsive preview, and prompt-version cache isolation.',
    createdAt: '2026-05-21',
    changes: [
      'Apply review summary before draft creation',
      'Desktop/Mobile generated draft preview frame',
      'Prompt-version-aware draft cache key',
    ],
  },
  {
    version: 'ai-site-builder-2026-05-21-ae',
    label: 'Apply review baseline',
    summary: 'Keeps the previous apply-review prompt profile available for rollback review and draft comparison.',
    createdAt: '2026-05-21',
    changes: [
      'Page and section apply review summary',
      'Single and sitemap draft creation guards',
      'Navigation impact preview before apply',
    ],
  },
];

export function isSupportedAiGeneratorPromptVersion(version: string): boolean {
  return AI_GENERATOR_PROMPT_CHANGELOG.some((entry) => entry.version === version);
}

export function resolveAiGeneratorPromptVersion(version?: string): string {
  if (version && isSupportedAiGeneratorPromptVersion(version)) return version;
  return AI_GENERATOR_PROMPT_VERSION;
}
