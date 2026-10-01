import { buildCustomRoute } from 'next/dist/server/lib/router-utils/filesystem';
import { NextRequest } from 'next/server';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { config as middlewareConfig, middleware } from '@/middleware';
import { ROUTED_PUBLIC_LOCALES } from '@/lib/public-guidance';
import {
  ROOT_FALLBACK_LOCALE,
  localeForLanguageTag,
  negotiateRootLocale,
} from '@/lib/root-locale-negotiation';

type RedirectRule = { source: string; destination: string; permanent?: boolean; statusCode?: number };

let redirectRules: RedirectRule[];

beforeAll(async () => {
  const configUrl = new URL('../../../next.config.mjs', import.meta.url).href;
  const { default: config } = (await import(configUrl)) as {
    default: { redirects(): Promise<RedirectRule[]> };
  };
  redirectRules = await config.redirects();
});

describe('root locale negotiation', () => {
  it('keeps /ko for visitors and crawlers that send no usable language', () => {
    expect(ROOT_FALLBACK_LOCALE).toBe('ko');
    for (const header of [null, undefined, '', '*', ' , ;q=0.5', 'sw-KE', 'xx;q=1']) {
      expect(negotiateRootLocale(header)).toBe('ko');
    }
  });

  it.each([
    ['ko-KR,ko;q=0.9,en;q=0.8', 'ko'],
    ['zh-TW,zh;q=0.9,en-US;q=0.8', 'zh-hant'],
    ['zh-HK', 'zh-hant'],
    ['zh-MO', 'zh-hant'],
    ['zh-Hant-TW', 'zh-hant'],
    ['zh', 'zh-hant'],
    ['zh-CN,zh;q=0.9', 'zh-hans'],
    ['zh-SG', 'zh-hans'],
    ['zh-Hans', 'zh-hans'],
    ['ja-JP,ja;q=0.9', 'ja'],
    ['en-US,en;q=0.9', 'en'],
    ['en-GB', 'en'],
    ['vi-VN,vi;q=0.9', 'vi'],
    ['fr-FR,fr;q=0.9', 'fr'],
    ['pt-BR', 'pt'],
    ['de_DE', 'de'],
    ['nb-NO', 'nb'],
    ['no', 'nb'],
    ['nn', 'nb'],
    ['tl', 'fil'],
    ['iw', 'he'],
    ['in', 'id'],
  ])('maps %s to /%s', (header, expected) => {
    expect(negotiateRootLocale(header)).toBe(expected);
  });

  it('follows q-values, skips q=0 and languages the site does not publish', () => {
    expect(negotiateRootLocale('en;q=0.5,ja;q=0.8')).toBe('ja');
    expect(negotiateRootLocale('ja;q=0,en')).toBe('en');
    expect(negotiateRootLocale('sw-KE,en;q=0.5')).toBe('en');
    expect(negotiateRootLocale('ko;q=0.7,zh-TW;q=0.7')).toBe('ko');
    expect(negotiateRootLocale('en;q=abc,ja;q=0.1')).toBe('ja');
  });

  it('never resolves header text to inherited object properties (Astra P1)', () => {
    for (const tag of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'valueOf', 'prototype']) {
      expect(localeForLanguageTag(tag)).toBeNull();
      expect(negotiateRootLocale(tag)).toBe('ko');
    }
    expect(negotiateRootLocale('constructor,en;q=0.8')).toBe('en');
    expect(negotiateRootLocale('__proto__;q=1,ja;q=0.5')).toBe('ja');
  });

  it('maps every published locale code to itself', () => {
    for (const locale of ROUTED_PUBLIC_LOCALES) {
      expect(localeForLanguageTag(locale)).toBe(locale);
    }
  });
});

describe('bare-domain redirect wiring', () => {
  function rootRequest(acceptLanguage?: string, search = '') {
    const headers = new Headers();
    if (acceptLanguage) headers.set('accept-language', acceptLanguage);
    return new NextRequest(`https://tseng-law.com/${search}`, { headers });
  }

  it('answers / with a temporary, per-visitor, uncacheable redirect', async () => {
    const response = await middleware(rootRequest('zh-TW,zh;q=0.9'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://tseng-law.com/zh-hant');
    expect(response.headers.get('vary')).toContain('Accept-Language');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('sends visitors without a language to /ko and keeps the query string', async () => {
    const plain = await middleware(rootRequest());
    expect(plain.headers.get('location')).toBe('https://tseng-law.com/ko');
    const tagged = await middleware(rootRequest('ja-JP', '?utm_source=line'));
    expect(tagged.headers.get('location')).toBe('https://tseng-law.com/ja?utm_source=line');
  });

  it('redirects a prototype-name header to a published locale, never to a function body', async () => {
    const response = await middleware(rootRequest('constructor,en;q=0.8'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://tseng-law.com/en');
    const fallback = await middleware(rootRequest('constructor'));
    expect(fallback.headers.get('location')).toBe('https://tseng-law.com/ko');
  });

  it('runs middleware for / on the apex and www hosts (compiled matcher)', () => {
    for (const host of ['tseng-law.com', 'www.tseng-law.com']) {
      expect(
        unstable_doesMiddlewareMatch({ config: middlewareConfig, url: `https://${host}/`, headers: { host } }),
      ).toBe(true);
    }
    expect(unstable_doesMiddlewareMatch({ config: middlewareConfig, url: 'https://tseng-law.com/zh-hant' })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config: middlewareConfig, url: 'https://tseng-law.com/_next/static/x.js' })).toBe(false);
  });

  it('no longer pins / to /ko in next.config, so middleware decides', () => {
    const rootRules = redirectRules.filter((rule) => buildCustomRoute('redirect', rule).match('/'));
    for (const rule of rootRules) {
      // Only the www → apex host rule may still match `/`.
      expect(rule.destination).toBe('https://tseng-law.com/:path*');
    }
    expect(redirectRules.some((rule) => rule.source === '/' && rule.destination === '/ko')).toBe(false);
  });
});
