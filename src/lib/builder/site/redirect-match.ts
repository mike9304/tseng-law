import type { SiteRedirect } from './types';

function wildcardPrefix(pattern: string): string | null {
  if (!pattern.endsWith('/*')) return null;
  return pattern.slice(0, -1);
}

function applyWildcardTarget(to: string, suffix: string): string {
  if (!to.endsWith('/*')) return to;
  return `${to.slice(0, -1)}${suffix}`;
}

/**
 * Resolve the best redirect rule for a path.
 *
 * Exact rules win first. If no exact rule matches, trailing `/*` sources
 * act as prefix redirects and can preserve the matched suffix when the
 * destination also ends in `/*`.
 */
export function findRedirectMatch(
  path: string,
  rules: SiteRedirect[],
): SiteRedirect | null {
  if (!path.startsWith('/')) return null;

  for (const rule of rules) {
    if (!rule.isActive) continue;
    if (rule.from === path) return rule;
  }

  const wildcardMatches = rules
    .map((rule) => {
      if (!rule.isActive) return null;
      const prefix = wildcardPrefix(rule.from);
      if (!prefix || !path.startsWith(prefix)) return null;
      const suffix = path.slice(prefix.length);
      if (!suffix) return null;
      return {
        rule,
        prefixLength: prefix.length,
        to: applyWildcardTarget(rule.to, suffix),
      };
    })
    .filter((match): match is { rule: SiteRedirect; prefixLength: number; to: string } => Boolean(match))
    .sort((left, right) => right.prefixLength - left.prefixLength);

  const wildcard = wildcardMatches[0];
  if (wildcard) {
    return {
      ...wildcard.rule,
      to: wildcard.to,
    };
  }

  return null;
}
