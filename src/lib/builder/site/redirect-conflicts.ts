import type { SiteRedirect } from './types';

export type RedirectConflictCode = 'wildcard-overlap';

export interface RedirectConflictDiagnostic {
  readonly code: RedirectConflictCode;
  readonly conflictingRedirectId: string;
  readonly conflictingFrom: string;
}

function wildcardPrefix(source: string): string | null {
  if (!source.endsWith('/*')) return null;
  return source.slice(0, -1);
}

function wildcardPrefixesOverlap(left: string, right: string): boolean {
  return left.startsWith(right) || right.startsWith(left);
}

export function findWildcardRedirectOverlap(
  input: {
    readonly from: string;
    readonly isActive?: boolean;
  },
  existing: readonly SiteRedirect[],
  ignoreId?: string,
): RedirectConflictDiagnostic | null {
  if (input.isActive === false) return null;
  const prefix = wildcardPrefix(input.from);
  if (!prefix) return null;

  const conflict = existing.find((redirect) => {
    if (redirect.redirectId === ignoreId) return false;
    if (!redirect.isActive) return false;
    if (redirect.from === input.from) return false;
    const existingPrefix = wildcardPrefix(redirect.from);
    return Boolean(existingPrefix && wildcardPrefixesOverlap(prefix, existingPrefix));
  });

  if (!conflict) return null;
  return {
    code: 'wildcard-overlap',
    conflictingRedirectId: conflict.redirectId,
    conflictingFrom: conflict.from,
  };
}
