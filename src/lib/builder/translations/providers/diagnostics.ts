import { translateViaRouter } from './router';
import {
  summarizeTranslationProviderSmokeHistory,
  type TranslationProviderSmokeSummary,
} from './smoke-summary';
import type { Locale } from '@/lib/locales';

export const translationProviderDiagnosticIds = ['openai', 'deepl'] as const;

export type TranslationProviderDiagnosticId = (typeof translationProviderDiagnosticIds)[number];

export type TranslationProviderReadinessStatus = 'pass' | 'warn' | 'fail';

export interface TranslationProviderReadinessCheck {
  readonly id: string;
  readonly provider: TranslationProviderDiagnosticId | 'router';
  readonly status: TranslationProviderReadinessStatus;
  readonly label: string;
  readonly detail: string;
}

export interface TranslationProviderReadinessProvider {
  readonly id: TranslationProviderDiagnosticId;
  readonly configured: boolean;
  readonly selected: boolean;
  readonly secretName: string;
  readonly model?: string;
  readonly endpoint?: string;
}

export interface TranslationProviderReadinessReport {
  readonly ok: boolean;
  readonly production: boolean;
  readonly selectedProvider: TranslationProviderDiagnosticId | 'mock';
  readonly providers: readonly TranslationProviderReadinessProvider[];
  readonly checks: readonly TranslationProviderReadinessCheck[];
  readonly smokeHistory: readonly TranslationProviderSmokeHistoryEntry[];
  readonly smokeSummary: TranslationProviderSmokeSummary;
}

export interface TranslationProviderSmokeInput {
  readonly provider: TranslationProviderDiagnosticId;
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly sourceText: string;
}

export interface TranslationProviderSmokeResult {
  readonly ok: boolean;
  readonly provider: TranslationProviderDiagnosticId;
  readonly status: 'pass' | 'fail' | 'unconfigured';
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly durationMs: number;
  readonly translatedTextPreview?: string;
  readonly reason?: string;
  readonly error?: string;
}

export interface TranslationProviderSmokeHistoryEntry extends TranslationProviderSmokeResult {
  readonly checkedAt: string;
}

type TranslationProviderEnv = Readonly<Record<string, string | undefined>>;

const MAX_SMOKE_HISTORY = 5;
let smokeHistory: readonly TranslationProviderSmokeHistoryEntry[] = [];

function present(env: TranslationProviderEnv, key: string): boolean {
  return Boolean(env[key]?.trim());
}

function configuredProvider(env: TranslationProviderEnv): TranslationProviderDiagnosticId | 'mock' {
  const requested = env.TRANSLATION_PROVIDER?.trim().toLowerCase();
  if (requested === 'mock') return 'mock';
  if (requested === 'openai' || requested === 'deepl') {
    return present(env, requested === 'openai' ? 'OPENAI_API_KEY' : 'DEEPL_API_KEY') ? requested : 'mock';
  }
  if (present(env, 'OPENAI_API_KEY')) return 'openai';
  if (present(env, 'DEEPL_API_KEY')) return 'deepl';
  return 'mock';
}

function providerRows(
  env: TranslationProviderEnv,
  selectedProvider: TranslationProviderDiagnosticId | 'mock',
): readonly TranslationProviderReadinessProvider[] {
  return [
    {
      id: 'openai',
      configured: present(env, 'OPENAI_API_KEY'),
      selected: selectedProvider === 'openai',
      secretName: 'OPENAI_API_KEY',
      model: env.OPENAI_TRANSLATION_MODEL?.trim() || env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
    },
    {
      id: 'deepl',
      configured: present(env, 'DEEPL_API_KEY'),
      selected: selectedProvider === 'deepl',
      secretName: 'DEEPL_API_KEY',
      endpoint: env.DEEPL_API_KEY?.trim().endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com',
    },
  ];
}

function providerSecretCheck(provider: TranslationProviderReadinessProvider): TranslationProviderReadinessCheck {
  return {
    id: `${provider.id}_secret`,
    provider: provider.id,
    status: provider.configured ? 'pass' : 'warn',
    label: `${provider.id} secret`,
    detail: provider.configured
      ? `${provider.secretName} is present.`
      : `${provider.secretName} is missing; ${provider.id} smoke tests cannot run.`,
  };
}

function routerCheck(selectedProvider: TranslationProviderDiagnosticId | 'mock', production: boolean): TranslationProviderReadinessCheck {
  if (selectedProvider !== 'mock') {
    return {
      id: 'router_provider',
      provider: 'router',
      status: 'pass',
      label: 'Router provider',
      detail: `Translation router will prefer ${selectedProvider}.`,
    };
  }
  return {
    id: 'router_provider',
    provider: 'router',
    status: production ? 'fail' : 'warn',
    label: 'Router provider',
    detail: production
      ? 'Production translation fails closed because no configured real provider is selected; requests return unconfigured.'
      : 'Router uses mock translation for local and demo environments.',
  };
}

function redactConfiguredSecrets(value: string, env: TranslationProviderEnv): string {
  let redacted = value;
  for (const secretName of ['OPENAI_API_KEY', 'DEEPL_API_KEY'] as const) {
    const secret = env[secretName]?.trim();
    if (secret) redacted = redacted.split(secret).join(`[redacted:${secretName}]`);
  }
  return redacted.slice(0, 180);
}

export function buildTranslationProviderReadinessReport(
  env: TranslationProviderEnv = process.env,
): TranslationProviderReadinessReport {
  const production = env.NODE_ENV === 'production';
  const selectedProvider = configuredProvider(env);
  const providers = providerRows(env, selectedProvider);
  const checks = [
    ...providers.map(providerSecretCheck),
    routerCheck(selectedProvider, production),
  ];

  return {
    ok: checks.every((check) => check.status !== 'fail'),
    production,
    selectedProvider,
    providers,
    checks,
    smokeHistory,
    smokeSummary: summarizeTranslationProviderSmokeHistory(smokeHistory, translationProviderDiagnosticIds),
  };
}

export function recordTranslationProviderSmokeResult(
  smoke: TranslationProviderSmokeResult,
  checkedAt: Date = new Date(),
): TranslationProviderSmokeHistoryEntry {
  const entry = {
    checkedAt: checkedAt.toISOString(),
    ok: smoke.ok,
    provider: smoke.provider,
    status: smoke.status,
    sourceLocale: smoke.sourceLocale,
    targetLocale: smoke.targetLocale,
    durationMs: smoke.durationMs,
    ...(smoke.translatedTextPreview === undefined ? {} : { translatedTextPreview: smoke.translatedTextPreview }),
    ...(smoke.reason === undefined ? {} : { reason: smoke.reason }),
    ...(smoke.error === undefined ? {} : { error: smoke.error }),
  } satisfies TranslationProviderSmokeHistoryEntry;
  smokeHistory = [entry, ...smokeHistory].slice(0, MAX_SMOKE_HISTORY);
  return entry;
}

export function clearTranslationProviderSmokeHistory(): void {
  smokeHistory = [];
}

export async function runTranslationProviderSmoke(
  input: TranslationProviderSmokeInput,
  env: TranslationProviderEnv = process.env,
): Promise<TranslationProviderSmokeResult> {
  const startedAt = Date.now();
  const configured = input.provider === 'openai'
    ? present(env, 'OPENAI_API_KEY')
    : present(env, 'DEEPL_API_KEY');

  if (!configured) {
    return {
      ok: false,
      provider: input.provider,
      status: 'unconfigured',
      sourceLocale: input.sourceLocale,
      targetLocale: input.targetLocale,
      durationMs: Date.now() - startedAt,
      reason: 'unconfigured',
    };
  }

  const result = await translateViaRouter({
    sourceLocale: input.sourceLocale,
    targetLocale: input.targetLocale,
    sourceText: input.sourceText,
    preferProvider: input.provider,
  });
  const durationMs = Date.now() - startedAt;

  if (result.ok) {
    return {
      ok: true,
      provider: input.provider,
      status: 'pass',
      sourceLocale: input.sourceLocale,
      targetLocale: input.targetLocale,
      durationMs,
      translatedTextPreview: result.text.slice(0, 120),
    };
  }

  return {
    ok: false,
    provider: input.provider,
    status: result.reason === 'unconfigured' ? 'unconfigured' : 'fail',
    sourceLocale: input.sourceLocale,
    targetLocale: input.targetLocale,
    durationMs,
    reason: result.reason,
    ...(result.error ? { error: redactConfiguredSecrets(result.error, env) } : {}),
  };
}
