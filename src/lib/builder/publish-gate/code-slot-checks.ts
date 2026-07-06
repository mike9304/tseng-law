import type { BuilderCanvasDocument, BuilderCodeBlockCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderServerlessFunction } from '@/lib/builder/dev/functions-model';
import { validateBuilderFunctionSource } from '@/lib/builder/dev/function-source-validation';
import type { CheckResult } from './checks';

function codeSlotNodes(doc: BuilderCanvasDocument): BuilderCodeBlockCanvasNode[] {
  return doc.nodes.filter((node): node is BuilderCodeBlockCanvasNode => node.kind === 'codeBlock');
}

function findFunction(
  functions: readonly BuilderServerlessFunction[],
  slugOrId: string,
): BuilderServerlessFunction | null {
  return functions.find((entry) => entry.slug === slugOrId || entry.id === slugOrId) ?? null;
}

export function checkCodeSlotDeployReadiness(
  doc: BuilderCanvasDocument,
  functions: readonly BuilderServerlessFunction[],
): CheckResult[] {
  const results: CheckResult[] = [];

  for (const node of codeSlotNodes(doc)) {
    const runMode = node.content.runMode ?? 'inline';
    if (runMode !== 'function') continue;

    const functionSlug = (node.content.functionSlug ?? '').trim();
    if (!functionSlug) {
      results.push({
        id: `code-slot-function-unselected-${node.id}`,
        severity: 'blocker',
        category: 'dev',
        message: `Code slot ${node.content.title || node.id} has no saved function selected.`,
        affectedNodeIds: [node.id],
        fixHint: 'Content inspector에서 실행 모드를 저장 함수로 유지하려면 함수를 선택하세요.',
      });
      continue;
    }

    const fn = findFunction(functions, functionSlug);
    if (!fn) {
      results.push({
        id: `code-slot-function-missing-${node.id}`,
        severity: 'blocker',
        category: 'dev',
        message: `Code slot ${node.content.title || node.id} references missing function "${functionSlug}".`,
        affectedNodeIds: [node.id],
        fixHint: '저장 함수를 다시 선택하거나 Developer Functions에서 해당 slug의 함수를 만드세요.',
      });
      continue;
    }

    if (!fn.enabled) {
      results.push({
        id: `code-slot-function-disabled-${node.id}`,
        severity: 'blocker',
        category: 'dev',
        message: `Code slot ${node.content.title || node.id} is bound to disabled function "${fn.slug}".`,
        affectedNodeIds: [node.id],
        fixHint: 'Developer Functions에서 함수를 활성화하거나 다른 함수를 선택하세요.',
      });
      continue;
    }

    if (fn.code.trim().length === 0) {
      results.push({
        id: `code-slot-function-empty-${node.id}`,
        severity: 'blocker',
        category: 'dev',
        message: `Code slot ${node.content.title || node.id} is bound to empty function "${fn.slug}".`,
        affectedNodeIds: [node.id],
        fixHint: 'Developer Functions에서 함수 코드를 작성한 뒤 다시 발행하세요.',
      });
      continue;
    }

    const sourceIssues = validateBuilderFunctionSource(fn.code);
    const syntaxIssue = sourceIssues.find((issue) => issue.code === 'syntax');
    if (syntaxIssue) {
      results.push({
        id: `code-slot-function-syntax-${node.id}`,
        severity: 'blocker',
        category: 'dev',
        message: `Code slot ${node.content.title || node.id} is bound to invalid function "${fn.slug}". ${syntaxIssue.message}`,
        affectedNodeIds: [node.id],
        fixHint: 'Developer Functions에서 저장 함수의 문법 오류를 수정한 뒤 다시 발행하세요.',
      });
    }

    const bannedIssue = sourceIssues.find((issue) => issue.code === 'banned-api');
    if (bannedIssue) {
      results.push({
        id: `code-slot-function-banned-api-${node.id}`,
        severity: 'blocker',
        category: 'dev',
        message: `Code slot ${node.content.title || node.id} is bound to function "${fn.slug}" with blocked APIs: ${bannedIssue.tokens.join(', ')}.`,
        affectedNodeIds: [node.id],
        fixHint: '저장 함수에서는 ctx.now(), ctx.log/info/warn/error 같은 안전한 ctx API만 사용하세요.',
      });
    }
  }

  return results;
}
