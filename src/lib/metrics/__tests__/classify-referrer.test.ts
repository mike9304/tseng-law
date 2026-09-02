import { describe, expect, it } from 'vitest';

import {
  classifyReferrer,
  type ClassifyInput,
  type ClassifyResult,
} from '@/lib/metrics/classify-referrer';

interface ClassificationCase {
  name: string;
  input: ClassifyInput;
  expected: ClassifyResult;
}

const cases: ClassificationCase[] = [
  {
    name: 'classifies a ChatGPT referrer as AI',
    input: { referrer: 'https://chatgpt.com/c/abc', firstLoad: true },
    expected: { channel: 'ai', source: 'chatgpt', keyword: null },
  },
  {
    name: 'classifies the ChatGPT UTM domain case-insensitively',
    input: { utmSource: 'ChatGPT.COM', firstLoad: true },
    expected: { channel: 'ai', source: 'chatgpt', keyword: null },
  },
  {
    name: 'classifies Perplexity as AI',
    input: { referrer: 'https://www.perplexity.ai/search/x', firstLoad: true },
    expected: { channel: 'ai', source: 'perplexity', keyword: null },
  },
  {
    name: 'classifies Gemini before Google search',
    input: { referrer: 'https://gemini.google.com/app/x', firstLoad: true },
    expected: { channel: 'ai', source: 'gemini', keyword: null },
  },
  {
    name: 'classifies Grok x.ai as AI',
    input: { referrer: 'https://x.ai/news', firstLoad: true },
    expected: { channel: 'ai', source: 'grok', keyword: null },
  },
  {
    name: 'classifies a Google result with no keyword',
    input: { referrer: 'https://www.google.com/', firstLoad: true },
    expected: { channel: 'search', source: 'google', keyword: null },
  },
  {
    name: 'classifies a Google ccTLD subdomain',
    input: { referrer: 'https://news.google.co.uk/', firstLoad: true },
    expected: { channel: 'search', source: 'google', keyword: null },
  },
  {
    name: 'decodes a Korean Naver query',
    input: {
      referrer:
        'https://search.naver.com/search.naver?query=%EB%8C%80%EB%A7%8C+%EB%B3%80%ED%98%B8%EC%82%AC',
      firstLoad: true,
    },
    expected: { channel: 'search', source: 'naver', keyword: '대만 변호사' },
  },
  {
    name: 'extracts a Bing q parameter',
    input: { referrer: 'https://www.bing.com/search?q=Taiwan+law', firstLoad: true },
    expected: { channel: 'search', source: 'bing', keyword: 'Taiwan law' },
  },
  {
    name: 'extracts a Baidu wd parameter',
    input: { referrer: 'https://www.baidu.com/s?wd=%E5%BE%8B%E5%B8%AB', firstLoad: true },
    expected: { channel: 'search', source: 'baidu', keyword: '律師' },
  },
  {
    name: 'falls back to the Baidu word parameter',
    input: { referrer: 'https://www.baidu.com/s?wd=&word=lawyer', firstLoad: true },
    expected: { channel: 'search', source: 'baidu', keyword: 'lawyer' },
  },
  {
    name: 'extracts a Yandex text parameter',
    input: { referrer: 'https://yandex.ru/search/?text=lawyer', firstLoad: true },
    expected: { channel: 'search', source: 'yandex', keyword: 'lawyer' },
  },
  {
    name: 'extracts a Daum q parameter',
    input: { referrer: 'https://search.daum.net/search?q=lawyer', firstLoad: true },
    expected: { channel: 'search', source: 'daum', keyword: 'lawyer' },
  },
  {
    name: 'classifies Naver Blog as social',
    input: { referrer: 'https://m.blog.naver.com/post/1', firstLoad: true },
    expected: { channel: 'social', source: 'naver-blog', keyword: null },
  },
  {
    name: 'classifies Naver Cafe as social',
    input: { referrer: 'https://cafe.naver.com/community', firstLoad: true },
    expected: { channel: 'social', source: 'naver-cafe', keyword: null },
  },
  {
    name: 'classifies t.co as X social traffic',
    input: { referrer: 'https://t.co/short', firstLoad: true },
    expected: { channel: 'social', source: 'x', keyword: null },
  },
  {
    name: 'classifies youtu.be as YouTube social traffic',
    input: { referrer: 'https://youtu.be/video', firstLoad: true },
    expected: { channel: 'social', source: 'youtube', keyword: null },
  },
  {
    name: 'classifies an arbitrary external domain as referral',
    input: { referrer: 'https://news.example.com/article', firstLoad: true },
    expected: { channel: 'referral', source: 'news.example.com', keyword: null },
  },
  {
    name: 'uses an unmatched UTM source for referral attribution',
    input: { utmSource: 'Newsletter', firstLoad: true },
    expected: { channel: 'referral', source: 'newsletter', keyword: null },
  },
  {
    name: 'treats SPA navigation as internal before all attribution rules',
    input: {
      referrer: 'https://chatgpt.com/',
      utmSource: 'newsletter',
      firstLoad: false,
    },
    expected: { channel: 'internal', source: null, keyword: null },
  },
  {
    name: 'classifies a site subdomain referrer as internal',
    input: { referrer: 'https://blog.tseng-law.com/post', firstLoad: true },
    expected: { channel: 'internal', source: null, keyword: null },
  },
  {
    name: 'supports a custom site host',
    input: {
      referrer: 'https://preview.example.com/page',
      firstLoad: true,
      siteHost: 'example.com',
    },
    expected: { channel: 'internal', source: null, keyword: null },
  },
  {
    name: 'classifies an empty referrer as direct',
    input: { referrer: '', firstLoad: true },
    expected: { channel: 'direct', source: null, keyword: null },
  },
  {
    name: 'ignores an unparseable referrer',
    input: { referrer: 'not a valid URL', firstLoad: true },
    expected: { channel: 'direct', source: null, keyword: null },
  },
  {
    name: 'does not misclassify fakegoogle.com as Google',
    input: { referrer: 'https://fakegoogle.com/search?q=law', firstLoad: true },
    expected: { channel: 'referral', source: 'fakegoogle.com', keyword: null },
  },
  {
    name: 'does not misclassify a domain after google.com as Google',
    input: { referrer: 'https://google.com.evil.example/search?q=law', firstLoad: true },
    expected: {
      channel: 'referral',
      source: 'google.com.evil.example',
      keyword: null,
    },
  },
  {
    name: 'classifies a Facebook redirect subdomain as social',
    input: { referrer: 'https://l.facebook.com/l.php', firstLoad: true },
    expected: { channel: 'social', source: 'facebook', keyword: null },
  },
  {
    name: 'classifies a LinkedIn short link as social',
    input: { referrer: 'https://lnkd.in/abc', firstLoad: true },
    expected: { channel: 'social', source: 'linkedin', keyword: null },
  },
  {
    name: 'gives recognized AI UTM attribution priority over a search referrer',
    input: {
      referrer: 'https://www.google.com/',
      utmSource: 'OPENAI',
      firstLoad: true,
    },
    expected: { channel: 'ai', source: 'chatgpt', keyword: null },
  },
];

describe('classifyReferrer', () => {
  it.each(cases)('$name', ({ input, expected }) => {
    expect(classifyReferrer(input)).toEqual(expected);
  });
});
