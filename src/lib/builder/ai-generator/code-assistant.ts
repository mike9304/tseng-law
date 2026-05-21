/**
 * F94 — Code assistant prompt + schema.
 *
 * Builds prompts for explain / fix / optimize / comment actions over a
 * snippet of JavaScript or TypeScript code. The LLM is asked to return
 * a JSON object so the route can compute a unified diff ourselves
 * (we don't trust LLMs to emit valid hunk headers).
 */

import { z } from 'zod';

export const CODE_ASSISTANT_ACTIONS = [
  'explain',
  'fix',
  'optimize',
  'comment',
] as const;

export type CodeAssistantAction = (typeof CODE_ASSISTANT_ACTIONS)[number];

export const CODE_ASSISTANT_LANGUAGES = ['js', 'ts'] as const;
export type CodeAssistantLanguage = (typeof CODE_ASSISTANT_LANGUAGES)[number];

export const CODE_MAX_LENGTH = 20_000;

export const codeAssistantSchema = z.object({
  code: z.string().min(1).max(CODE_MAX_LENGTH),
  action: z.enum(CODE_ASSISTANT_ACTIONS),
  language: z.enum(CODE_ASSISTANT_LANGUAGES).default('ts'),
  context: z.string().trim().max(2000).optional(),
});

export type CodeAssistantInput = z.infer<typeof codeAssistantSchema>;

export const codeAssistantResponseSchema = z.object({
  explanation: z.string().trim().min(1).max(6000),
  fixedCode: z.string().max(CODE_MAX_LENGTH).optional().nullable(),
});

export type CodeAssistantLlmResponse = z.infer<typeof codeAssistantResponseSchema>;

const ACTION_DIRECTIVE: Record<CodeAssistantAction, string> = {
  explain:
    'Explain what the given code does in clear, concise sentences. Highlight the entry points, side effects, and any subtle behavior. Do not propose changes. Leave fixedCode null.',
  fix:
    'Identify any bugs, broken logic, or unsafe patterns in the given code. Return the corrected code in fixedCode. Keep the original style and module structure. Only change what is necessary.',
  optimize:
    'Suggest an optimized version of the given code, focusing on readability and runtime efficiency for a Node serverless function. Return the rewritten code in fixedCode. Do not change observable behavior.',
  comment:
    'Add explanatory comments to the given code so a teammate can quickly understand it. Return the commented version in fixedCode. Preserve all logic exactly.',
};

export function languageLabel(language: CodeAssistantLanguage): string {
  return language === 'js' ? 'JavaScript' : 'TypeScript';
}

export function buildCodeAssistantPrompt(input: CodeAssistantInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const directive = ACTION_DIRECTIVE[input.action];
  const systemLines = [
    'You are an expert code reviewer working inside a serverless function editor in a Wix-style website builder.',
    'The user authors small Node-style functions invoked via `new Function(...)` with a `ctx` arg providing `{ now, log }`.',
    'You MUST respond with valid JSON in this exact shape: { "explanation": string, "fixedCode": string | null }.',
    'Never include markdown fences, prose outside the JSON, or partial code.',
    'When fixedCode is set, it must be a complete drop-in replacement for the user-supplied code, in the SAME language.',
    `Source language: ${languageLabel(input.language)}.`,
  ];

  const userLines = [
    directive,
    '',
    'Source code:',
    '"""',
    input.code,
    '"""',
  ];
  if (input.context && input.context.trim()) {
    userLines.push('', `Editor context: ${input.context.trim()}`);
  }
  userLines.push('', 'Return only the JSON object.');

  return {
    systemPrompt: systemLines.join('\n'),
    userPrompt: userLines.join('\n'),
  };
}

/**
 * Lightweight unified-diff generator with single hunk per file.
 * We deliberately avoid an `npm` dep — this hunk is good enough for
 * the in-editor diff view, not for piping into `git apply`.
 */
export function buildUnifiedDiff(before: string, after: string, filename = 'function.ts'): string {
  if (before === after) return '';
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const header = [
    `--- a/${filename}`,
    `+++ b/${filename}`,
    `@@ -1,${beforeLines.length} +1,${afterLines.length} @@`,
  ];
  const body: string[] = [];
  for (const line of beforeLines) body.push(`-${line}`);
  for (const line of afterLines) body.push(`+${line}`);
  return [...header, ...body].join('\n');
}

export function describeCodeAction(action: CodeAssistantAction): string {
  switch (action) {
    case 'explain':
      return 'Explain';
    case 'fix':
      return 'Fix bugs';
    case 'optimize':
      return 'Optimize';
    case 'comment':
      return 'Add comments';
    default:
      return 'Explain';
  }
}