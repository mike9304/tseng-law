#!/usr/bin/env node

import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, '../docs/seo/external-metrics.jsonl');

const sitemapUrl = 'https://tseng-law.com/sitemap.xml';
const naverUrl =
  'https://search.naver.com/search.naver?where=web&query=site%3Atseng-law.com';
const bingUrl = 'https://www.bing.com/search?q=site%3Atseng-law.com';
const weiWeiUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-1';

const observedPages = [
  { label: 'home', url: 'https://tseng-law.com/ko' },
  { label: 'taiwan-lawyer', url: 'https://tseng-law.com/ko/taiwan-lawyer' },
  {
    label: 'company-setup-lawyer',
    url: 'https://tseng-law.com/ko/taiwan-company-setup-lawyer',
  },
  {
    label: 'litigation-lawyer',
    url: 'https://tseng-law.com/ko/taiwan-litigation-lawyer',
  },
  {
    label: 'korean-lawyer-in-taiwan',
    url: 'https://tseng-law.com/ko/korean-lawyer-in-taiwan',
  },
  {
    label: 'column-same-group',
    url: 'https://tseng-law.com/ko/columns/taiwan-company-establishment-advanced-1',
  },
  {
    label: 'column-different-group',
    url: 'https://tseng-law.com/ko/columns/taiwan-company-establishment-basics',
  },
];

function errorMessage(error) {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return `request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`;
    }
    return error.message;
  }
  return String(error);
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      'user-agent': BROWSER_UA,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ...headers,
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  return {
    status: response.status,
    finalUrl: response.url,
    text: await response.text(),
  };
}

async function fetchRedirectChain(page) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const redirects = [];
  let currentUrl = page.url;

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
      const response = await fetch(currentUrl, {
        headers: {
          'user-agent': BROWSER_UA,
          accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'manual',
        signal: controller.signal,
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`redirect ${response.status} did not include a Location header`);
        }
        if (hop === MAX_REDIRECTS) {
          throw new Error(`redirect limit exceeded (${MAX_REDIRECTS})`);
        }

        const nextUrl = new URL(location, currentUrl).href;
        redirects.push({
          status: response.status,
          from: currentUrl,
          to: nextUrl,
        });
        currentUrl = nextUrl;
        continue;
      }

      return {
        label: page.label,
        requestedUrl: page.url,
        finalUrl: currentUrl,
        finalStatus: response.status,
        redirectHops: redirects.length,
        redirects,
        body: await response.text(),
        error: null,
      };
    }

    throw new Error(`redirect limit exceeded (${MAX_REDIRECTS})`);
  } catch (error) {
    return {
      label: page.label,
      requestedUrl: page.url,
      finalUrl: null,
      finalStatus: null,
      redirectHops: null,
      redirects,
      body: null,
      error: errorMessage(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function parseSitemap(xml) {
  const urls = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)].map((match) =>
    decodeHtml(match[1].trim()),
  );

  if (urls.length === 0) {
    throw new Error('no <loc> elements found; sitemap XML structure may have changed');
  }

  const locales = {
    ko: 0,
    en: 0,
    'zh-hant': 0,
    ja: 0,
  };

  for (const value of urls) {
    let pathname;
    try {
      pathname = new URL(value).pathname;
    } catch {
      continue;
    }

    for (const locale of Object.keys(locales)) {
      if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
        locales[locale] += 1;
      }
    }
  }

  return { total: urls.length, locales, error: null };
}

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(
    /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
  )) {
    attributes[match[1].toLowerCase()] = decodeHtml(
      match[2] ?? match[3] ?? match[4] ?? '',
    );
  }
  return attributes;
}

function canonicalFromHtml(html, baseUrl) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const relTokens = (attributes.rel ?? '').toLowerCase().split(/\s+/);
    if (relTokens.includes('canonical') && attributes.href) {
      return new URL(attributes.href, baseUrl).href;
    }
  }
  return null;
}

function normalizedUrl(value) {
  const url = new URL(value);
  url.hash = '';
  return url.href;
}

function hasBotChallengeMarkers(html) {
  return /captcha|arkoselabs|PoWChallengeSolver|akchal(?:-staging)?\.bing\.com|challenges\.cloudflare\.com|(?:verify|verification)[^<]{0,80}(?:human|browser|identity)/i.test(
    html,
  );
}

function isNaverLoginPage(html) {
  return /<title\b[^>]*>\s*(?:네이버\s*)?로그인|(?:id|name)\s*=\s*(?:"(?:frmNIDLogin|login_wrap)"|'(?:frmNIDLogin|login_wrap)')|nidlogin\.login|로그인이\s*(?:필요|요구)/i.test(
    html,
  );
}

function parseNaverSiteCount(html) {
  if (hasBotChallengeMarkers(html) || isNaverLoginPage(html)) {
    return { value: null, error: 'bot-challenge' };
  }

  const urls = new Set();
  const directLinkPattern =
    /href\s*=\s*(?:"|')(https:\/\/(?:www\.)?tseng-law\.com[^"'<>\\\s]*)(?:"|')/gi;

  for (const match of html.matchAll(directLinkPattern)) {
    try {
      const url = new URL(decodeHtml(match[1]));
      url.hash = '';
      urls.add(url.href);
    } catch {
      // Ignore a malformed candidate and keep parsing other result links.
    }
  }

  if (urls.size > 0) {
    return { value: urls.size, error: null };
  }

  if (/검색\s*결과가\s*없|검색결과가\s*없|no[_ -]?result/i.test(html)) {
    return { value: 0, error: null };
  }

  return {
    value: null,
    error:
      'Naver result items could not be parsed; the search HTML structure may have changed',
  };
}

function parseBingProbe(html) {
  if (hasBotChallengeMarkers(html)) {
    return { no_results: null, url_count: null, error: 'bot-challenge' };
  }

  const resultList = html.match(
    /<(ol|ul)\b(?=[^>]*(?:id|class)\s*=\s*(?:"[^"]*\bb_results\b[^"]*"|'[^']*\bb_results\b[^']*'))[^>]*>[\s\S]*?<\/\1>/i,
  )?.[0];
  if (!resultList) {
    return { no_results: null, url_count: null, error: 'bot-challenge' };
  }

  const urls = new Set();
  const directLinkPattern =
    /href\s*=\s*(?:"|')(https:\/\/(?:www\.)?tseng-law\.com[^"'<>\\\s]*)(?:"|')/gi;

  for (const match of resultList.matchAll(directLinkPattern)) {
    try {
      const url = new URL(decodeHtml(match[1]));
      url.hash = '';
      urls.add(url.href);
    } catch {
      // Ignore a malformed candidate and keep parsing other result links.
    }
  }

  if (urls.size > 0) {
    return { no_results: false, url_count: urls.size, error: null };
  }

  const noResults =
    /class\s*=\s*(?:"[^"]*\bb_no\b[^"]*"|'[^']*\bb_no\b[^']*')/i.test(
      resultList,
    ) || /there are no results for|일치하는 검색 결과가 없습니다/i.test(resultList);
  if (noResults) {
    return { no_results: true, url_count: 0, error: null };
  }

  return {
    no_results: null,
    url_count: null,
    error: 'Bing result items contained no target URLs or no-results marker',
  };
}

function visibleText(fragment) {
  return decodeHtml(
    fragment
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFC');
}

function firstKoreanFragment(html) {
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? html;
  const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];

  for (const paragraph of paragraphs) {
    const text = visibleText(paragraph[1]);
    const firstHangul = text.search(/[가-힣]/u);
    if (firstHangul < 0) {
      continue;
    }

    const candidate = text.slice(firstHangul);
    if ((candidate.match(/[가-힣]/gu) ?? []).length < 15) {
      continue;
    }

    const fragment = [...candidate].slice(0, 20).join('').trim();
    if ((fragment.match(/[가-힣]/gu) ?? []).length >= 10) {
      return fragment;
    }
  }

  throw new Error('no 20-character Korean paragraph fragment found in the tseng page');
}

function decodeJavaScriptEscapes(value) {
  return value
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/\\u([0-9a-f]{4})/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/\\\//g, '/')
    .replace(/\\[nrt]/g, ' ');
}

function normalizedProbeText(value) {
  return decodeHtml(decodeJavaScriptEscapes(value))
    .normalize('NFC')
    .replace(/[^가-힣0-9a-z]+/giu, '');
}

function metricError(error) {
  return { value: null, error: errorMessage(error) };
}

async function main() {
  const sitemapPromise = fetchText(sitemapUrl);
  const chainPromise = Promise.all(observedPages.map(fetchRedirectChain));
  const naverPromise = fetchText(naverUrl, {
    'accept-language': 'ko-KR,ko;q=0.9,en;q=0.7',
  });
  const bingPromise = fetchText(bingUrl, {
    'accept-language': 'en-US,en;q=0.9',
  });
  const weiWeiPromise = fetchText(weiWeiUrl, {
    'accept-language': 'ko-KR,ko;q=0.9,en;q=0.7',
  });

  const [sitemapResult, chains, naverResult, bingResult, weiWeiResult] =
    await Promise.all([
      sitemapPromise.catch((error) => ({ error })),
      chainPromise,
      naverPromise.catch((error) => ({ error })),
      bingPromise.catch((error) => ({ error })),
      weiWeiPromise.catch((error) => ({ error })),
    ]);

  let sitemapUrlCount;
  if ('error' in sitemapResult) {
    sitemapUrlCount = { total: null, locales: null, error: errorMessage(sitemapResult.error) };
  } else {
    try {
      sitemapUrlCount = parseSitemap(sitemapResult.text);
      if (sitemapResult.status < 200 || sitemapResult.status >= 300) {
        throw new Error(`sitemap returned HTTP ${sitemapResult.status}`);
      }
    } catch (error) {
      sitemapUrlCount = { total: null, locales: null, error: errorMessage(error) };
    }
  }

  const httpChain = chains.map(({ body: _body, ...chain }) => chain);

  const canonicalOk = chains.map((chain) => {
    if (chain.error || !chain.body || !chain.finalUrl) {
      return {
        label: chain.label,
        url: chain.requestedUrl,
        canonical: null,
        ok: null,
        error: chain.error ?? 'page body was unavailable',
      };
    }

    try {
      const canonical = canonicalFromHtml(chain.body, chain.finalUrl);
      if (!canonical) {
        throw new Error('rel=canonical was not found');
      }
      return {
        label: chain.label,
        url: chain.requestedUrl,
        canonical,
        ok: normalizedUrl(canonical) === normalizedUrl(chain.finalUrl),
        error: null,
      };
    } catch (error) {
      return {
        label: chain.label,
        url: chain.requestedUrl,
        canonical: null,
        ok: null,
        error: errorMessage(error),
      };
    }
  });

  let naverSiteCount;
  if ('error' in naverResult) {
    naverSiteCount = metricError(naverResult.error);
  } else if (naverResult.status < 200 || naverResult.status >= 300) {
    naverSiteCount = metricError(new Error(`Naver returned HTTP ${naverResult.status}`));
  } else {
    naverSiteCount = parseNaverSiteCount(naverResult.text);
  }

  let bingProbe;
  if ('error' in bingResult) {
    bingProbe = {
      no_results: null,
      url_count: null,
      error: errorMessage(bingResult.error),
    };
  } else if (bingResult.status < 200 || bingResult.status >= 300) {
    bingProbe = {
      no_results: null,
      url_count: null,
      error: `Bing returned HTTP ${bingResult.status}`,
    };
  } else {
    bingProbe = parseBingProbe(bingResult.text);
  }

  let weiWeiDuplicateProbe;
  const advancedPage = chains.find((chain) => chain.label === 'column-same-group');
  if (!advancedPage?.body) {
    weiWeiDuplicateProbe = {
      fragment: null,
      matched: null,
      error: advancedPage?.error ?? 'tseng advanced-1 page body was unavailable',
    };
  } else if ('error' in weiWeiResult) {
    weiWeiDuplicateProbe = {
      fragment: null,
      matched: null,
      error: errorMessage(weiWeiResult.error),
    };
  } else if (weiWeiResult.status < 200 || weiWeiResult.status >= 300) {
    weiWeiDuplicateProbe = {
      fragment: null,
      matched: null,
      error: `wei-wei returned HTTP ${weiWeiResult.status}`,
    };
  } else {
    try {
      const fragment = firstKoreanFragment(advancedPage.body);
      const needle = normalizedProbeText(fragment);
      if (needle.length < 10) {
        throw new Error('normalized Korean fragment was too short to compare safely');
      }
      weiWeiDuplicateProbe = {
        fragment,
        matched: normalizedProbeText(weiWeiResult.text).includes(needle),
        error: null,
      };
    } catch (error) {
      weiWeiDuplicateProbe = {
        fragment: null,
        matched: null,
        error: errorMessage(error),
      };
    }
  }

  const snapshot = {
    date: new Date().toISOString(),
    sitemap_url_count: sitemapUrlCount,
    http_chain: httpChain,
    canonical_ok: canonicalOk,
    naver_site_count: naverSiteCount,
    bing_probe: bingProbe,
    wei_wei_duplicate_probe: weiWeiDuplicateProbe,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await appendFile(outputPath, `${JSON.stringify(snapshot)}\n`, 'utf8');

  const chainSuccesses = httpChain.filter((item) => item.finalStatus !== null).length;
  const redirectCount = httpChain.reduce(
    (sum, item) => sum + (item.redirectHops ?? 0),
    0,
  );
  const canonicalSuccesses = canonicalOk.filter((item) => item.ok === true).length;
  const canonicalMeasured = canonicalOk.filter((item) => item.ok !== null).length;

  console.log(`SEO external snapshot: ${snapshot.date}`);
  console.table([
    {
      measurement: 'sitemap_url_count',
      value:
        sitemapUrlCount.total === null
          ? 'null'
          : `${sitemapUrlCount.total} (${Object.entries(sitemapUrlCount.locales)
              .map(([locale, count]) => `${locale}:${count}`)
              .join(', ')})`,
      error: sitemapUrlCount.error ?? '',
    },
    {
      measurement: 'http_chain',
      value: `${chainSuccesses}/${httpChain.length} measured; ${redirectCount} redirect hops`,
      error: httpChain
        .filter((item) => item.error)
        .map((item) => `${item.label}: ${item.error}`)
        .join('; '),
    },
    {
      measurement: 'canonical_ok',
      value: `${canonicalSuccesses}/${canonicalMeasured} self-referencing`,
      error: canonicalOk
        .filter((item) => item.error)
        .map((item) => `${item.label}: ${item.error}`)
        .join('; '),
    },
    {
      measurement: 'naver_site_count',
      value: naverSiteCount.value ?? 'null',
      error: naverSiteCount.error ?? '',
    },
    {
      measurement: 'bing_probe',
      value: bingProbe.no_results ?? 'null',
      error: bingProbe.error ?? '',
    },
    {
      measurement: 'wei_wei_duplicate_probe',
      value: weiWeiDuplicateProbe.matched ?? 'null',
      error: weiWeiDuplicateProbe.error ?? '',
    },
  ]);
  console.log(`Appended: ${outputPath}`);
}

main().catch((error) => {
  console.error(`Snapshot failed before append: ${errorMessage(error)}`);
  process.exitCode = 1;
});
