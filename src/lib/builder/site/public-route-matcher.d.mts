export type OwnershipToken = { literal: string } | { param: string } | { catchAll: string } | { optionalCatchAll: string };
export interface OwnershipRule { id: string; owner: 'native' | 'builder'; segments: OwnershipToken[] }
export function compileOwnershipRules(config: { locales: readonly string[]; rules: OwnershipRule[] }): (candidate: { locale: string; path: string }) => { owner: 'native' | 'builder' | null; ruleId: string | null; reason: string };
