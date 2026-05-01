import { describe, expect, it } from 'vitest';

import {
  describeLinkScheme,
  isLinkSafe,
  sanitizeLinkValue,
} from '@/lib/builder/links';

describe('builder links', () => {
  it.each([
    ['/about', true],
    ['#anchor', true],
    ['lightbox:my-modal', true],
    ['https://example.com', true],
    ['http://example.com', true],
    ['mailto:a@b.com', true],
    ['tel:+82-1234', true],
    ['javascript:alert(1)', false],
    ['data:text/html,<h1>x</h1>', false],
    ['vbscript:msg', false],
    ['//evil.com', false],
    ['java\u0000script:alert(1)', false],
    ['', false],
    ['  ', false],
  ])('%s -> %s', (input, expected) => {
    expect(isLinkSafe(input)).toBe(expected);
  });

  it('adds noopener noreferrer for blank targets', () => {
    expect(sanitizeLinkValue({ href: 'https://example.com', target: '_blank' })).toEqual({
      href: 'https://example.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      title: undefined,
      ariaLabel: undefined,
    });
  });

  it('describes allowed schemes for UI labels', () => {
    expect(describeLinkScheme('/ko/contact')).toBe('internal');
    expect(describeLinkScheme('#contact')).toBe('anchor');
    expect(describeLinkScheme('lightbox:demo')).toBe('lightbox');
    expect(describeLinkScheme('mailto:a@b.com')).toBe('mailto');
    expect(describeLinkScheme('tel:+82-1234')).toBe('tel');
    expect(describeLinkScheme('https://example.com')).toBe('http');
    expect(describeLinkScheme('javascript:alert(1)')).toBe('invalid');
  });
});
