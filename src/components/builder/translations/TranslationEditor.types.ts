import type { Locale } from '@/lib/locales';
import type { AutoTranslateSourceNode } from '@/lib/builder/translations/auto-translate';
import type { ProjectedSeoValue } from '@/lib/builder/translations/seo-projection';

export interface TranslationEditorProps {
  readonly siteId: string;
  readonly pageId: string;
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly sources: AutoTranslateSourceNode[];
  readonly initialTargetValues: Record<string, string>;
  readonly targetPageReady: boolean;
  readonly initialSourceSeo: ProjectedSeoValue;
  readonly initialTargetSeo: ProjectedSeoValue;
}

export interface TranslationEditorSaveResponse {
  readonly ok?: boolean;
  readonly error?: string;
  readonly nodeUpdates?: {
    readonly appliedCount: number;
    readonly skipped: readonly { readonly nodeId: string; readonly reason: string }[];
  };
}

export interface TranslationEditorAutoTranslateResponse {
  readonly ok?: boolean;
  readonly proposals?: readonly { readonly nodeId: string; readonly text: string }[];
  readonly errors?: readonly { readonly nodeId: string; readonly error: string }[];
  readonly error?: string;
}

export interface AutoTranslateRollbackSnapshot {
  readonly values: Record<string, string>;
  readonly proposalCount: number;
}
