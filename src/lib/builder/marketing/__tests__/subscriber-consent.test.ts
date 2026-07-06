import { describe, expect, it } from 'vitest';
import {
  buildMarketingConsentRecord,
  createDoubleOptInWindow,
  isDoubleOptInExpired,
} from '../subscriber-consent';
import type { Subscriber } from '../subscriber-types';

const baseSubscriber: Subscriber = {
  subscriberId: 'sub-1',
  email: 'lead@example.test',
  status: 'pending',
  tags: [],
  preferredLocale: 'en',
  doubleOptInToken: 'tok-double',
  unsubscribeToken: 'tok-unsub',
  source: 'public-form',
  createdAt: '2026-06-19T00:00:00.000Z',
  updatedAt: '2026-06-19T00:00:00.000Z',
};

describe('subscriber consent policy', () => {
  it('builds an auditable consent record when a visitor explicitly opts in', () => {
    // Given
    const acceptedAt = '2026-06-19T10:30:00.000Z';

    // When
    const consent = buildMarketingConsentRecord({
      acceptedAt,
      source: 'footer-form',
      preferredLocale: 'en',
      ipAddress: '127.0.0.10',
      userAgent: 'vitest-browser',
      text: 'I agree to receive updates.',
    });

    // Then
    expect(consent).toEqual({
      acceptedAt,
      source: 'footer-form',
      preferredLocale: 'en',
      ipAddress: '127.0.0.10',
      userAgent: 'vitest-browser',
      text: 'I agree to receive updates.',
    });
  });

  it('creates a seven-day double opt-in verification window', () => {
    // Given
    const now = new Date('2026-06-19T00:00:00.000Z');

    // When
    const window = createDoubleOptInWindow(now);

    // Then
    expect(window).toEqual({
      createdAt: '2026-06-19T00:00:00.000Z',
      expiresAt: '2026-06-26T00:00:00.000Z',
    });
  });

  it('treats expired token windows as invalid while allowing legacy tokens without expiry', () => {
    // Given
    const now = new Date('2026-06-19T00:00:00.000Z');

    // When
    const expired = isDoubleOptInExpired(
      { ...baseSubscriber, doubleOptInTokenExpiresAt: '2026-06-18T23:59:59.000Z' },
      now,
    );
    const legacy = isDoubleOptInExpired(baseSubscriber, now);

    // Then
    expect(expired).toBe(true);
    expect(legacy).toBe(false);
  });
});
