import { describe, expect, it } from 'vitest';
import { resolveSafeNextPath } from '@/lib/safe-next';

describe('resolveSafeNextPath', () => {
  it('allows root-relative paths inside the current locale', () => {
    expect(resolveSafeNextPath('ko', '/ko/account/bookings?tab=upcoming#top')).toBe('/ko/account/bookings?tab=upcoming#top');
    expect(resolveSafeNextPath('zh-hant', '/zh-hant/account')).toBe('/zh-hant/account');
    expect(resolveSafeNextPath('en', '/en')).toBe('/en');
    expect(resolveSafeNextPath('ja', '/ja/account')).toBe('/ja/account');
    expect(resolveSafeNextPath('ko', '/ko/search?q=https%3A%2F%2Fexample.com')).toBe('/ko/search?q=https%3A%2F%2Fexample.com');
  });

  it('uses the locale root as the exact fallback', () => {
    expect(resolveSafeNextPath('ko')).toBe('/ko');
    expect(resolveSafeNextPath('zh-hant', '')).toBe('/zh-hant');
    expect(resolveSafeNextPath('en', [])).toBe('/en');
    expect(resolveSafeNextPath('ja')).toBe('/ja');
  });

  it.each([
    'https://evil.example/ko/account',
    'http://evil.example/ko/account',
    'https://tseng-law.com/ko/account',
    'https://safe-next.invalid/ko/account',
    '//evil.example/ko/account',
    '///evil.example/ko/account',
    '\\\\evil.example\\ko\\account',
    '/\\evil.example/ko/account',
    '/ko\\account',
    '/ko/%5caccount',
  ])('rejects absolute, protocol-relative, or backslash target %j', (target) => {
    expect(resolveSafeNextPath('ko', target)).toBe('/ko');
  });

  it.each([
    '/%2f%2fevil.example',
    '/%252f%252fevil.example',
    '%2F%2Fevil.example',
    '%252F%252Fevil.example',
    '/ko/%2F%2Fevil.example',
    '/ko/%252F%252Fevil.example',
  ])('rejects encoded protocol-relative target %j', (target) => {
    expect(resolveSafeNextPath('ko', target)).toBe('/ko');
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,evil',
    'vbscript:msgbox(1)',
    'ko/account',
    './ko/account',
    '?next=/ko/account',
  ])('rejects non-root-relative target %j', (target) => {
    expect(resolveSafeNextPath('ko', target)).toBe('/ko');
  });

  it.each([
    '/en/account',
    '/zh-hant/account',
    '/korean/account',
    '/KO/account',
    '/ko-other/account',
    '/ko/../en/account',
  ])('rejects a target outside the current locale %j', (target) => {
    expect(resolveSafeNextPath('ko', target)).toBe('/ko');
  });

  it.each([
    '/ko/account\r\nLocation: https://evil.example',
    '/ko/account\u0000',
    '/ko/account\u007f',
    '/ko/account\u0085',
    '/ko/account\u2028evil',
    '/ko/%0d%0aLocation%3a%20https%3a%2f%2fevil.example',
    '/ko/%250d%250aLocation%253a%2520evil',
  ])('rejects raw or encoded control characters %j', (target) => {
    expect(resolveSafeNextPath('ko', target)).toBe('/ko');
  });

  it.each([
    '/ko/%',
    '/ko/%zz',
    '/ko/%E0%A4%A',
    '/ko/\ud800',
  ])('rejects malformed targets %j', (target) => {
    expect(resolveSafeNextPath('ko', target)).toBe('/ko');
  });

  it('rejects ambiguous array query values instead of selecting one', () => {
    expect(resolveSafeNextPath('ko', ['/ko/account'])).toBe('/ko');
    expect(resolveSafeNextPath('ko', ['/ko/account', 'https://evil.example'])).toBe('/ko');
  });
});
