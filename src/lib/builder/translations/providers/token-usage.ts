import type { TranslationProviderUsage } from './types';

const TOKENS_PER_MILLION = 1_000_000;

export interface TokenCostRates {
  readonly inputUsdPerMillion: number;
  readonly outputUsdPerMillion: number;
}

function parseRate(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function openAiTranslationCostRatesFromEnv(): TokenCostRates | undefined {
  const inputUsdPerMillion = parseRate(process.env.OPENAI_TRANSLATION_INPUT_USD_PER_1M_TOKENS);
  const outputUsdPerMillion = parseRate(process.env.OPENAI_TRANSLATION_OUTPUT_USD_PER_1M_TOKENS);
  if (inputUsdPerMillion === undefined || outputUsdPerMillion === undefined) return undefined;
  return { inputUsdPerMillion, outputUsdPerMillion };
}

export function withEstimatedTokenCost(
  usage: TranslationProviderUsage,
  rates: TokenCostRates | undefined,
): TranslationProviderUsage {
  if (rates === undefined) return usage;
  const rawCostUsd = (
    (usage.promptTokens * rates.inputUsdPerMillion)
    + (usage.completionTokens * rates.outputUsdPerMillion)
  ) / TOKENS_PER_MILLION;
  const estimatedCostUsd = Math.round(rawCostUsd * TOKENS_PER_MILLION * TOKENS_PER_MILLION)
    / (TOKENS_PER_MILLION * TOKENS_PER_MILLION);
  return { ...usage, estimatedCostUsd };
}
