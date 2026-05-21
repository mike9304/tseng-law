import { describe, expect, it } from 'vitest';
import {
  calculateCommerceTaxQuote,
  findCommerceTaxRule,
  normalizeTaxRules,
  publicTaxRules,
} from '../tax-shared';

describe('commerce tax shared helpers', () => {
  it('calculates default country tax quotes', () => {
    expect(calculateCommerceTaxQuote({
      address: { country: 'tw', region: 'Taipei' },
      locale: 'ko',
      currency: 'TWD',
      taxableCents: 22000,
    })).toMatchObject({
      country: 'TW',
      rateBps: 500,
      amountCents: 1100,
      ruleId: 'tax-tw',
    });
  });

  it('normalizes and selects locale/region-specific rules by priority', () => {
    const rules = normalizeTaxRules([
      { ruleId: 'tw-base', label: 'TW base', country: 'tw', rateBps: 500, active: true, locale: 'all', priority: 1 },
      { ruleId: 'tw-taipei', label: 'Taipei local', country: 'tw', region: 'Taipei', rateBps: 800, active: true, locale: 'ko', priority: 20 },
      { ruleId: 'tw-inactive', label: 'Inactive', country: 'tw', rateBps: 900, active: false, locale: 'all', priority: 100 },
    ]);

    expect(publicTaxRules(rules, 'ko')).toHaveLength(2);
    expect(findCommerceTaxRule({ country: 'TW', region: 'Taipei' }, 'ko', rules)).toMatchObject({
      ruleId: 'tw-taipei',
      rateBps: 800,
    });
    expect(calculateCommerceTaxQuote({
      address: { country: 'TW', region: 'Taipei' },
      locale: 'ko',
      currency: 'TWD',
      taxableCents: 10000,
      rules,
    })).toMatchObject({
      amountCents: 800,
      label: 'Taipei local',
    });
  });
});
