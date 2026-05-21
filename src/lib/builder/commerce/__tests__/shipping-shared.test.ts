import { describe, expect, it } from 'vitest';
import {
  availableShippingMethods,
  calculateCommerceShippingQuote,
  normalizeShippingRules,
} from '../shipping-shared';

describe('commerce shipping shared helpers', () => {
  it('selects default shipping rules and applies free shipping thresholds', () => {
    expect(calculateCommerceShippingQuote({
      method: 'standard',
      address: { country: 'TW', region: 'Taipei' },
      locale: 'ko',
      currency: 'TWD',
      discountedSubtotalCents: 10000,
    })).toMatchObject({
      method: 'standard',
      amountCents: 12000,
      ruleId: 'ship-standard-twd',
      freeShippingApplied: false,
    });

    expect(calculateCommerceShippingQuote({
      method: 'standard',
      address: { country: 'TW', region: 'Taipei' },
      locale: 'ko',
      currency: 'TWD',
      discountedSubtotalCents: 150000,
    })).toMatchObject({
      amountCents: 0,
      freeShippingApplied: true,
    });
  });

  it('normalizes and exposes pickup/local delivery methods by locale and currency', () => {
    const rules = normalizeShippingRules([
      { ruleId: 'pickup', method: 'pickup', label: 'Pickup', currency: 'TWD', country: 'TW', amountCents: 0, active: true, locale: 'ko', priority: 20, estimatedDays: '1' },
      { ruleId: 'local', method: 'local-delivery', label: 'Local', currency: 'TWD', country: 'TW', amountCents: 7000, active: true, locale: 'all', priority: 10, estimatedDays: '1-2' },
      { ruleId: 'inactive', method: 'express', label: 'Inactive', currency: 'TWD', amountCents: 9000, active: false, locale: 'all', priority: 50, estimatedDays: '1' },
    ]);

    expect(availableShippingMethods({
      address: { country: 'TW' },
      locale: 'ko',
      currency: 'TWD',
      rules,
    }).map((rule) => rule.method)).toEqual(['pickup', 'local-delivery']);

    expect(calculateCommerceShippingQuote({
      method: 'local-delivery',
      address: { country: 'TW' },
      locale: 'ko',
      currency: 'TWD',
      discountedSubtotalCents: 40000,
      rules,
    })).toMatchObject({
      method: 'local-delivery',
      amountCents: 7000,
      label: 'Local',
    });
  });
});
