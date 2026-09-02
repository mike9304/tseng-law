export type Channel =
  | 'ai'
  | 'search'
  | 'social'
  | 'referral'
  | 'internal'
  | 'direct';

export interface ClassifyInput {
  referrer?: string;
  utmSource?: string;
  firstLoad: boolean;
  siteHost?: string;
}

export interface ClassifyResult {
  channel: Channel;
  source: string | null;
  keyword: string | null;
}

interface AiSourceMatcher {
  source: string;
  hosts: readonly string[];
  utmAliases?: readonly string[];
}

interface DomainSourceMatcher {
  source: string;
  hosts: readonly string[];
}

const DEFAULT_SITE_HOST = 'tseng-law.com';

const AI_SOURCE_MATCHERS: readonly AiSourceMatcher[] = [
  {
    source: 'chatgpt',
    hosts: ['chatgpt.com', 'openai.com'],
    utmAliases: ['openai', 'chat.openai.com'],
  },
  { source: 'perplexity', hosts: ['perplexity.ai'] },
  { source: 'claude', hosts: ['claude.ai'] },
  {
    source: 'gemini',
    hosts: ['gemini.google.com', 'bard.google.com'],
    utmAliases: ['bard'],
  },
  { source: 'copilot', hosts: ['copilot.microsoft.com'] },
  { source: 'you', hosts: ['you.com'] },
  { source: 'felo', hosts: ['felo.ai'] },
  { source: 'genspark', hosts: ['genspark.ai'] },
  { source: 'liner', hosts: ['liner.com', 'getliner.com'] },
  {
    source: 'mistral',
    hosts: ['mistral.ai'],
    utmAliases: ['chat.mistral.ai'],
  },
  { source: 'grok', hosts: ['grok.com', 'x.ai'] },
  { source: 'deepseek', hosts: ['deepseek.com'] },
  { source: 'kimi', hosts: ['kimi.com', 'kimi.moonshot.cn'] },
  { source: 'chatglm', hosts: ['chatglm.cn'] },
  { source: 'qwen', hosts: ['qwen.ai', 'tongyi.aliyun.com'] },
  { source: 'meta-ai', hosts: ['meta.ai'] },
  { source: 'doubao', hosts: ['doubao.com'] },
];

const SOCIAL_SOURCE_MATCHERS: readonly DomainSourceMatcher[] = [
  { source: 'naver-blog', hosts: ['blog.naver.com'] },
  { source: 'naver-cafe', hosts: ['cafe.naver.com'] },
  { source: 'x', hosts: ['x.com', 'twitter.com', 't.co'] },
  { source: 'facebook', hosts: ['facebook.com'] },
  { source: 'instagram', hosts: ['instagram.com'] },
  { source: 'linkedin', hosts: ['linkedin.com', 'lnkd.in'] },
  { source: 'threads', hosts: ['threads.net', 'threads.com'] },
  { source: 'youtube', hosts: ['youtube.com', 'youtu.be'] },
  { source: 'band', hosts: ['band.us'] },
  { source: 'kakao', hosts: ['pf.kakao.com'] },
  { source: 'line', hosts: ['line.me'] },
  { source: 'tiktok', hosts: ['tiktok.com'] },
  { source: 'reddit', hosts: ['reddit.com'] },
];

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/\.$/, '');
}

function hostMatches(host: string, suffix: string): boolean {
  return host === suffix || host.endsWith(`.${suffix}`);
}

function brandWildcardHostMatches(host: string, brand: string): boolean {
  const labels = host.split('.');
  const brandIndex = labels.lastIndexOf(brand);
  const suffixLabelCount = labels.length - brandIndex - 1;

  return brandIndex >= 0 && suffixLabelCount >= 1 && suffixLabelCount <= 2;
}

function matchDomainSource(
  host: string,
  matchers: readonly DomainSourceMatcher[],
): string | null {
  for (const matcher of matchers) {
    if (matcher.hosts.some((suffix) => hostMatches(host, suffix))) {
      return matcher.source;
    }
  }

  return null;
}

function matchAiHost(host: string): string | null {
  return matchDomainSource(host, AI_SOURCE_MATCHERS);
}

function matchAiUtmSource(utmSource: string): string | null {
  for (const matcher of AI_SOURCE_MATCHERS) {
    const aliases = [matcher.source, ...matcher.hosts, ...(matcher.utmAliases ?? [])];
    if (aliases.includes(utmSource)) {
      return matcher.source;
    }
  }

  return null;
}

function parseReferrer(referrer: string | undefined): URL | null {
  if (!referrer) {
    return null;
  }

  try {
    const url = new URL(referrer);
    return url.hostname ? url : null;
  } catch {
    return null;
  }
}

function extractKeyword(url: URL, params: readonly string[]): string | null {
  for (const param of params) {
    const value = url.searchParams.get(param);
    if (value !== null && value !== '') {
      return value;
    }
  }

  return null;
}

function classifySearch(
  host: string,
  referrerUrl: URL,
): Pick<ClassifyResult, 'source' | 'keyword'> | null {
  if (brandWildcardHostMatches(host, 'google')) {
    return { source: 'google', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'search.naver.com')) {
    return { source: 'naver', keyword: extractKeyword(referrerUrl, ['query']) };
  }
  if (hostMatches(host, 'bing.com')) {
    return { source: 'bing', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'search.yahoo.com') || hostMatches(host, 'yahoo.co.jp')) {
    return { source: 'yahoo', keyword: extractKeyword(referrerUrl, ['p']) };
  }
  if (hostMatches(host, 'duckduckgo.com')) {
    return { source: 'duckduckgo', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'baidu.com')) {
    return { source: 'baidu', keyword: extractKeyword(referrerUrl, ['wd', 'word']) };
  }
  if (brandWildcardHostMatches(host, 'yandex')) {
    return { source: 'yandex', keyword: extractKeyword(referrerUrl, ['text']) };
  }
  if (hostMatches(host, 'daum.net')) {
    return { source: 'daum', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'ecosia.org')) {
    return { source: 'ecosia', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'search.brave.com')) {
    return { source: 'brave', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'sogou.com')) {
    return { source: 'sogou', keyword: extractKeyword(referrerUrl, ['query']) };
  }
  if (hostMatches(host, 'so.com')) {
    return { source: 'so360', keyword: extractKeyword(referrerUrl, ['q']) };
  }
  if (hostMatches(host, 'coccoc.com')) {
    return { source: 'coccoc', keyword: extractKeyword(referrerUrl, ['query']) };
  }
  if (hostMatches(host, 'kagi.com')) {
    return { source: 'kagi', keyword: extractKeyword(referrerUrl, ['q']) };
  }

  return null;
}

function normalizeSiteHost(siteHost: string | undefined): string {
  const candidate = (siteHost ?? DEFAULT_SITE_HOST).trim().toLowerCase();

  try {
    return normalizeHost(new URL(`http://${candidate}`).hostname);
  } catch {
    return normalizeHost(candidate);
  }
}

export function classifyReferrer(input: ClassifyInput): ClassifyResult {
  if (!input.firstLoad) {
    return { channel: 'internal', source: null, keyword: null };
  }

  const normalizedUtmSource = input.utmSource?.trim().toLowerCase() || null;
  const referrerUrl = parseReferrer(input.referrer);
  const referrerHost = referrerUrl
    ? normalizeHost(referrerUrl.hostname)
    : null;

  if (normalizedUtmSource) {
    const aiSource = matchAiUtmSource(normalizedUtmSource);
    if (aiSource) {
      return { channel: 'ai', source: aiSource, keyword: null };
    }
  }

  if (referrerHost) {
    const aiSource = matchAiHost(referrerHost);
    if (aiSource) {
      return { channel: 'ai', source: aiSource, keyword: null };
    }
  }

  if (referrerHost && referrerUrl) {
    const searchResult = classifySearch(referrerHost, referrerUrl);
    if (searchResult) {
      return { channel: 'search', ...searchResult };
    }

    const socialSource = matchDomainSource(
      referrerHost,
      SOCIAL_SOURCE_MATCHERS,
    );
    if (socialSource) {
      return { channel: 'social', source: socialSource, keyword: null };
    }
  }

  if (normalizedUtmSource) {
    return {
      channel: 'referral',
      source: normalizedUtmSource,
      keyword: null,
    };
  }

  if (referrerHost) {
    const siteHost = normalizeSiteHost(input.siteHost);
    if (hostMatches(referrerHost, siteHost)) {
      return { channel: 'internal', source: null, keyword: null };
    }

    return { channel: 'referral', source: referrerHost, keyword: null };
  }

  return { channel: 'direct', source: null, keyword: null };
}
