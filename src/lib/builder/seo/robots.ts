import type { MetadataRoute } from 'next';

interface RobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

function appendString(current: string | string[] | undefined, value: string): string | string[] {
  if (!current) return value;
  return Array.isArray(current) ? [...current, value] : [current, value];
}

function cleanLine(line: string): string {
  return line.replace(/#.*/, '').trim();
}

export function parseCustomRobotsTxt(
  source: string,
  fallbackSitemap: string,
): MetadataRoute.Robots {
  const rules: RobotsRule[] = [];
  const sitemaps: string[] = [];
  let current: RobotsRule | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = cleanLine(rawLine);
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (!value && key !== 'disallow') continue;

    if (key === 'user-agent') {
      if (current && (current.allow || current.disallow || current.crawlDelay)) {
        rules.push(current);
        current = null;
      }
      if (!current) current = { userAgent: value };
      else current.userAgent = appendString(current.userAgent, value);
      continue;
    }

    if (key === 'sitemap') {
      if (value) sitemaps.push(value);
      continue;
    }

    if (!current) current = { userAgent: '*' };

    if (key === 'allow') {
      current.allow = appendString(current.allow, value);
    } else if (key === 'disallow') {
      current.disallow = appendString(current.disallow, value || '');
    } else if (key === 'crawl-delay') {
      const delay = Number(value);
      if (Number.isFinite(delay) && delay >= 0) current.crawlDelay = delay;
    }
  }

  if (current) rules.push(current);

  const finalRules: RobotsRule[] = rules.length > 0 ? rules : [{ userAgent: '*', allow: '/' }];
  return {
    rules: finalRules,
    sitemap: sitemaps.length > 0 ? sitemaps : fallbackSitemap,
  };
}
