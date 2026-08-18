import { describe, expect, it } from 'vitest';
import { sanitizeNotificationLink } from '../notification-link';

describe('sanitizeNotificationLink', () => {
  it.each([
    '/ko',
    '/ko/admin-builder/translations?sourceLocale=ko&category=pages#review',
    '/search?q=%ED%83%80%EC%9D%B4%EB%B2%A0%EC%9D%B4#results',
  ])('preserves a legitimate internal path: %s', (link) => {
    expect(sanitizeNotificationLink(link)).toBe(link);
  });

  it.each([
    '',
    ' /ko',
    '/ko ',
    'ko/admin-builder',
    '//evil.example/path',
    '\\\\evil.example\\path',
    '/\\evil.example/path',
    'https://evil.example/path',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    '/%2f%2fevil.example/path',
    '/%252f%252fevil.example/path',
    '/%255cevil.example/path',
    '/%0ajavascript:alert(1)',
    '/%C2%85javascript:alert(1)',
    '/bad%',
  ])('rejects an unsafe or malformed path: %s', (link) => {
    expect(sanitizeNotificationLink(link)).toBeNull();
  });

  it('rejects non-string and overlong values', () => {
    expect(sanitizeNotificationLink(undefined)).toBeNull();
    expect(sanitizeNotificationLink({ path: '/ko' })).toBeNull();
    expect(sanitizeNotificationLink(`/${'a'.repeat(500)}`)).toBeNull();
  });
});
