import type { Locale } from '@/lib/locales';
import type { TranslationProviderBatchProgress } from '@/lib/builder/translations/providers/types';
import type { TranslationManagerPayload, TranslationStatus } from '@/lib/builder/translations/types';

export type StatusFilter = 'all' | TranslationStatus;

export interface ApiPayload {
  readonly ok?: boolean;
  readonly error?: string;
  readonly text?: string;
  readonly payload?: TranslationManagerPayload;
}

export interface BatchResult {
  readonly key: string;
  readonly ok: boolean;
  readonly text?: string;
  readonly error?: string;
}

export interface BatchApiPayload {
  readonly ok?: boolean;
  readonly error?: string;
  readonly results?: readonly BatchResult[];
  readonly summary?: TranslationProviderBatchProgress;
}

export type TranslationBatchProgressStage = 'translating' | 'saving';

export interface TranslationBatchProgressState {
  readonly locale: Locale;
  readonly total: number;
  readonly saved: number;
  readonly failed: number;
  readonly stage: TranslationBatchProgressStage;
  readonly summary?: TranslationProviderBatchProgress;
}
