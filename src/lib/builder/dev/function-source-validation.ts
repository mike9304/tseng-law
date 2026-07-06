export type BuilderFunctionSourceIssueCode = 'syntax' | 'banned-api';

export interface BuilderFunctionSourceIssue {
  code: BuilderFunctionSourceIssueCode;
  message: string;
  tokens: string[];
}

interface BannedTokenRule {
  token: string;
  pattern: RegExp;
}

const BANNED_IDENTIFIER_RULES: BannedTokenRule[] = [
  { token: 'process', pattern: /\bprocess\b/ },
  { token: 'require', pattern: /\brequire\s*\(/ },
  { token: 'eval', pattern: /\beval\s*\(/ },
  { token: 'fetch', pattern: /\bfetch\s*\(/ },
  { token: 'import', pattern: /\bimport\s*\(/ },
  { token: 'fs', pattern: /\bfs\s*\./ },
  { token: 'child_process', pattern: /\bchild_process\b/ },
];

const BANNED_MODULE_NAMES = new Set([
  'fs',
  'node:fs',
  'fs/promises',
  'node:fs/promises',
  'child_process',
  'node:child_process',
]);

function stripCommentsAndStrings(source: string): string {
  let output = '';
  let index = 0;

  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];

    if (current === '/' && next === '/') {
      output += '  ';
      index += 2;
      while (index < source.length && source[index] !== '\n') {
        output += ' ';
        index += 1;
      }
      continue;
    }

    if (current === '/' && next === '*') {
      output += '  ';
      index += 2;
      while (index < source.length) {
        const blockCurrent = source[index];
        const blockNext = source[index + 1];
        output += blockCurrent === '\n' ? '\n' : ' ';
        index += 1;
        if (blockCurrent === '*' && blockNext === '/') {
          output += ' ';
          index += 1;
          break;
        }
      }
      continue;
    }

    if (current === '"' || current === '\'' || current === '`') {
      const quote = current;
      output += ' ';
      index += 1;
      while (index < source.length) {
        const char = source[index];
        output += char === '\n' ? '\n' : ' ';
        index += 1;
        if (char === '\\') {
          if (index < source.length) {
            output += source[index] === '\n' ? '\n' : ' ';
            index += 1;
          }
          continue;
        }
        if (char === quote) break;
      }
      continue;
    }

    output += current;
    index += 1;
  }

  return output;
}

function compileFunctionBody(code: string): string | null {
  if (code.trim().length === 0) return null;

  try {
    Function(`"use strict";\nreturn (async function(ctx) {\n${code}\n});`);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

function collectBannedTokens(code: string): string[] {
  const tokens = new Set<string>();
  const stringLiteralModulePattern = /\b(?:require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  for (const match of code.matchAll(stringLiteralModulePattern)) {
    const moduleName = match[1]?.trim();
    if (moduleName && BANNED_MODULE_NAMES.has(moduleName)) {
      tokens.add(moduleName.startsWith('node:') ? moduleName.slice(5) : moduleName);
    }
  }

  const searchable = stripCommentsAndStrings(code);
  for (const rule of BANNED_IDENTIFIER_RULES) {
    if (rule.pattern.test(searchable)) tokens.add(rule.token);
  }

  return [...tokens].sort();
}

export function validateBuilderFunctionSource(code: string): BuilderFunctionSourceIssue[] {
  const issues: BuilderFunctionSourceIssue[] = [];
  const syntaxMessage = compileFunctionBody(code);
  if (syntaxMessage) {
    issues.push({
      code: 'syntax',
      message: `Code must be a valid JavaScript function body: ${syntaxMessage}`,
      tokens: ['syntax'],
    });
  }

  const bannedTokens = collectBannedTokens(code);
  if (bannedTokens.length > 0) {
    issues.push({
      code: 'banned-api',
      message: `Code uses blocked serverless APIs: ${bannedTokens.join(', ')}`,
      tokens: bannedTokens,
    });
  }

  return issues;
}
