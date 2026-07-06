/**
 * F94 — Code assistant prompt + schema.
 *
 * Builds prompts for explain / fix / optimize / comment actions over a
 * snippet of code. The LLM is asked to return
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

export const CODE_ASSISTANT_LANGUAGES = ['js', 'ts', 'tsx', 'jsx', 'json', 'html', 'css', 'bash', 'text'] as const;
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

function isNodeFunctionLanguage(language: CodeAssistantLanguage): boolean {
  return language === 'js' || language === 'ts' || language === 'tsx' || language === 'jsx';
}

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
  switch (language) {
    case 'js':
      return 'JavaScript';
    case 'ts':
      return 'TypeScript';
    case 'tsx':
      return 'TSX';
    case 'jsx':
      return 'JSX';
    case 'json':
      return 'JSON';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'bash':
      return 'Bash';
    case 'text':
      return 'Plain text';
    default:
      return language;
  }
}

export function buildCodeAssistantPrompt(input: CodeAssistantInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const directive = ACTION_DIRECTIVE[input.action];
  const systemLines = [
    'You are an expert code reviewer working inside a Wix-style website builder.',
    isNodeFunctionLanguage(input.language)
      ? 'The user authors small Node-style functions invoked via `new Function(...)` with a `ctx` arg providing `{ now, log }`.'
      : 'The user authors code snippets inside the builder canvas or editor and may not be working in Node.',
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

type DiffOp =
  | { type: 'equal'; line: string }
  | { type: 'delete'; line: string }
  | { type: 'insert'; line: string };

export type UnifiedDiffLine =
  | { type: 'context'; text: string }
  | { type: 'delete'; text: string }
  | { type: 'insert'; text: string };

export interface UnifiedDiffHunk {
  id: string;
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: UnifiedDiffLine[];
}

export interface UnifiedDiffResult {
  text: string;
  hunks: UnifiedDiffHunk[];
}

const DIFF_CONTEXT_LINES = 2;
const LCS_CELL_LIMIT = 200_000;

function splitDiffLines(value: string): string[] {
  return value === '' ? [] : value.split('\n');
}

function buildFallbackDiffOps(beforeLines: string[], afterLines: string[]): DiffOp[] {
  let prefix = 0;
  while (
    prefix < beforeLines.length
    && prefix < afterLines.length
    && beforeLines[prefix] === afterLines[prefix]
  ) {
    prefix += 1;
  }

  let suffix = 0;
  while (
    suffix + prefix < beforeLines.length
    && suffix + prefix < afterLines.length
    && beforeLines[beforeLines.length - 1 - suffix] === afterLines[afterLines.length - 1 - suffix]
  ) {
    suffix += 1;
  }

  const ops: DiffOp[] = [];
  beforeLines.slice(0, prefix).forEach((line) => ops.push({ type: 'equal', line }));
  beforeLines.slice(prefix, beforeLines.length - suffix).forEach((line) => ops.push({ type: 'delete', line }));
  afterLines.slice(prefix, afterLines.length - suffix).forEach((line) => ops.push({ type: 'insert', line }));
  beforeLines.slice(beforeLines.length - suffix).forEach((line) => ops.push({ type: 'equal', line }));
  return ops;
}

function buildLcsDiffOps(beforeLines: string[], afterLines: string[]): DiffOp[] {
  const beforeLength = beforeLines.length;
  const afterLength = afterLines.length;
  if (beforeLength * afterLength > LCS_CELL_LIMIT) {
    return buildFallbackDiffOps(beforeLines, afterLines);
  }

  const table = Array.from(
    { length: beforeLength + 1 },
    () => new Uint32Array(afterLength + 1),
  );

  for (let oldIndex = beforeLength - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = afterLength - 1; newIndex >= 0; newIndex -= 1) {
      table[oldIndex][newIndex] = beforeLines[oldIndex] === afterLines[newIndex]
        ? table[oldIndex + 1][newIndex + 1] + 1
        : Math.max(table[oldIndex + 1][newIndex], table[oldIndex][newIndex + 1]);
    }
  }

  const ops: DiffOp[] = [];
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < beforeLength && newIndex < afterLength) {
    if (beforeLines[oldIndex] === afterLines[newIndex]) {
      ops.push({ type: 'equal', line: beforeLines[oldIndex] });
      oldIndex += 1;
      newIndex += 1;
    } else if (table[oldIndex + 1][newIndex] >= table[oldIndex][newIndex + 1]) {
      ops.push({ type: 'delete', line: beforeLines[oldIndex] });
      oldIndex += 1;
    } else {
      ops.push({ type: 'insert', line: afterLines[newIndex] });
      newIndex += 1;
    }
  }
  while (oldIndex < beforeLength) {
    ops.push({ type: 'delete', line: beforeLines[oldIndex] });
    oldIndex += 1;
  }
  while (newIndex < afterLength) {
    ops.push({ type: 'insert', line: afterLines[newIndex] });
    newIndex += 1;
  }
  return ops;
}

function consumesOldLine(op: DiffOp): boolean {
  return op.type !== 'insert';
}

function consumesNewLine(op: DiffOp): boolean {
  return op.type !== 'delete';
}

function hunkMetadata(ops: DiffOp[], startIndex: number, endIndex: number): Omit<UnifiedDiffHunk, 'id' | 'lines'> {
  const beforeOldCount = ops.slice(0, startIndex).filter(consumesOldLine).length;
  const beforeNewCount = ops.slice(0, startIndex).filter(consumesNewLine).length;
  const hunkOps = ops.slice(startIndex, endIndex + 1);
  const oldCount = hunkOps.filter(consumesOldLine).length;
  const newCount = hunkOps.filter(consumesNewLine).length;
  const oldStart = oldCount === 0 ? beforeOldCount : beforeOldCount + 1;
  const newStart = newCount === 0 ? beforeNewCount : beforeNewCount + 1;
  return { oldStart, oldCount, newStart, newCount };
}

function hunkHeader(hunk: Pick<UnifiedDiffHunk, 'newCount' | 'newStart' | 'oldCount' | 'oldStart'>): string {
  return `@@ -${hunk.oldStart},${hunk.oldCount} +${hunk.newStart},${hunk.newCount} @@`;
}

function toUnifiedDiffLine(op: DiffOp): UnifiedDiffLine {
  if (op.type === 'equal') return { type: 'context', text: op.line };
  return { type: op.type, text: op.line };
}

function renderDiffLine(line: UnifiedDiffLine): string {
  if (line.type === 'context') return ` ${line.text}`;
  if (line.type === 'delete') return `-${line.text}`;
  return `+${line.text}`;
}

/**
 * Lightweight semantic unified-diff generator for the in-editor review.
 * It emits focused hunks with nearby context, using an LCS pass for normal
 * snippets and a bounded prefix/suffix fallback for very large inputs.
 */
export function buildUnifiedDiffResult(before: string, after: string, filename = 'function.ts'): UnifiedDiffResult {
  if (before === after) return { text: '', hunks: [] };
  const beforeLines = splitDiffLines(before);
  const afterLines = splitDiffLines(after);
  const ops = buildLcsDiffOps(beforeLines, afterLines);
  const changeIndexes = ops
    .map((op, index) => (op.type === 'equal' ? -1 : index))
    .filter((index) => index >= 0);
  if (changeIndexes.length === 0) return { text: '', hunks: [] };

  const ranges: Array<{ end: number; start: number }> = [];
  let start = Math.max(0, changeIndexes[0] - DIFF_CONTEXT_LINES);
  let end = changeIndexes[0];
  for (const changeIndex of changeIndexes.slice(1)) {
    if (changeIndex <= end + (DIFF_CONTEXT_LINES * 2) + 1) {
      end = changeIndex;
      continue;
    }
    ranges.push({ start, end: Math.min(ops.length - 1, end + DIFF_CONTEXT_LINES) });
    start = Math.max(0, changeIndex - DIFF_CONTEXT_LINES);
    end = changeIndex;
  }
  ranges.push({ start, end: Math.min(ops.length - 1, end + DIFF_CONTEXT_LINES) });

  const hunks = ranges.map((range, index) => {
    const metadata = hunkMetadata(ops, range.start, range.end);
    return {
      id: `hunk-${index + 1}-${metadata.oldStart}-${metadata.newStart}`,
      ...metadata,
      lines: ops.slice(range.start, range.end + 1).map(toUnifiedDiffLine),
    };
  });
  const body: string[] = [
    `--- a/${filename}`,
    `+++ b/${filename}`,
  ];
  for (const hunk of hunks) {
    body.push(hunkHeader(hunk));
    for (const line of hunk.lines) {
      body.push(renderDiffLine(line));
    }
  }
  return { text: body.join('\n'), hunks };
}

export function buildUnifiedDiff(before: string, after: string, filename = 'function.ts'): string {
  return buildUnifiedDiffResult(before, after, filename).text;
}

export function applySelectedDiffHunks(
  source: string,
  hunks: UnifiedDiffHunk[],
  selectedHunkIds: readonly string[],
): string | null {
  if (selectedHunkIds.length === 0) return null;
  const selected = new Set(selectedHunkIds);
  const sourceLines = splitDiffLines(source);
  const orderedHunks = hunks
    .filter((hunk) => selected.has(hunk.id))
    .sort((a, b) => b.oldStart - a.oldStart);

  if (orderedHunks.length !== selected.size) return null;

  for (const hunk of orderedHunks) {
    const startIndex = hunk.oldStart === 0 ? 0 : hunk.oldStart - 1;
    const oldLines = hunk.lines
      .filter((line) => line.type !== 'insert')
      .map((line) => line.text);
    const newLines = hunk.lines
      .filter((line) => line.type !== 'delete')
      .map((line) => line.text);
    const currentLines = sourceLines.slice(startIndex, startIndex + oldLines.length);
    if (
      currentLines.length !== oldLines.length
      || currentLines.some((line, index) => line !== oldLines[index])
    ) {
      return null;
    }
    sourceLines.splice(startIndex, oldLines.length, ...newLines);
  }

  return sourceLines.join('\n');
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
