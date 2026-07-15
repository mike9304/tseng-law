import path from 'node:path';
import { z } from 'zod';
import ts from 'typescript';

export const PRODUCTION_STUB_POLICIES = [
  'blocked',
  'explicit-opt-in',
  'intentional-fallback',
  'placeholder-only',
  'open',
] as const;

export type ProductionStubPolicy = (typeof PRODUCTION_STUB_POLICIES)[number];

export const PRODUCTION_STUB_SURFACE_KINDS = [
  'non-rendered',
  'rendered-demo',
  'rendered-placeholder',
] as const;

export type ProductionStubSurfaceKind = (typeof PRODUCTION_STUB_SURFACE_KINDS)[number];

const guardAnchorSchema = z.object({
  sourcePath: z.string().trim().min(1),
  sourcePattern: z.string().min(1),
  expectedOccurrences: z.number().int().min(1),
}).strict();

const visibleDisclosureAnchorSchema = guardAnchorSchema.extend({
  renderedSelector: z.string().trim().min(1),
  productSourcePath: z.string().trim().min(1),
  productSourcePattern: z.string().min(1),
  productExpectedOccurrences: z.number().int().min(1),
  sourceReferencePattern: z.string().min(1),
  sourceReferenceExpectedOccurrences: z.number().int().min(1),
}).strict();

const entrySchema = z.object({
  id: z.string().trim().min(1),
  category: z.string().trim().min(1),
  sourcePath: z.string().trim().min(1),
  sourcePattern: z.string().min(1),
  sourceExpectedOccurrences: z.number().int().min(1),
  occurrencePatterns: z.array(z.string().min(1)).min(1),
  expectedOccurrences: z.number().int().min(1),
  productionGuardAnchors: z.array(guardAnchorSchema),
  productionPolicy: z.enum(PRODUCTION_STUB_POLICIES),
  operationalSuccessAllowedInProduction: z.boolean(),
  surfaceKind: z.enum(PRODUCTION_STUB_SURFACE_KINDS).default('non-rendered'),
  visibleDisclosureAnchors: z.array(visibleDisclosureAnchorSchema).default([]),
  owner: z.string().trim().min(1),
  notes: z.string().trim().min(1),
}).strict();

const BROAD_MOCK_STUB_PATTERN = '(?:[Mm][Oo][Cc][Kk]|[Ss][Tt][Uu][Bb])';

const candidateInventoryEntrySchema = z.object({
  id: z.string().trim().min(1),
  category: z.string().trim().min(1),
  sourcePath: z.string().trim().min(1),
  expectedOccurrences: z.number().int().min(1),
  productionGuardAnchors: z.array(guardAnchorSchema).default([]),
  productionPolicy: z.literal('placeholder-only').optional(),
  surfaceKind: z.enum(PRODUCTION_STUB_SURFACE_KINDS).default('non-rendered'),
  visibleDisclosureAnchors: z.array(visibleDisclosureAnchorSchema).default([]),
  owner: z.string().trim().min(1),
  notes: z.string().trim().min(1),
}).strict().superRefine((candidate, context) => {
  if (candidate.productionPolicy && candidate.surfaceKind === 'non-rendered') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['productionPolicy'],
      message: 'candidate productionPolicy requires a rendered surfaceKind',
    });
  }
});

const manifestSchema = z.object({
  version: z.literal(1),
  entries: z.array(entrySchema).min(1),
  candidateInventory: z.array(candidateInventoryEntrySchema).default([]),
}).strict();

export type ProductionStubEntry = z.infer<typeof entrySchema>;
export type ProductionStubCandidateInventoryEntry = z.infer<typeof candidateInventoryEntrySchema>;
export type ProductionStubManifest = z.infer<typeof manifestSchema>;

export interface StubSourceResolution {
  readonly regularFile: boolean;
  readonly content?: string;
  readonly reason?: string;
}

export interface ProductionStubVerificationOptions {
  /** Dependency injection keeps the verifier deterministic and filesystem-free. */
  readonly resolveSource: (sourcePath: string) => StubSourceResolution;
}

export interface ProductionStubEntryVerification {
  readonly entry: ProductionStubEntry;
  readonly effectivePolicy: ProductionStubPolicy;
  readonly sourceMatched: boolean;
  readonly reasons: readonly string[];
}

export interface ProductionStubVerification {
  readonly valid: boolean;
  readonly gatePassed: boolean;
  readonly errors: readonly string[];
  readonly entries: readonly ProductionStubEntryVerification[];
}

export interface ProductionStubOccurrence {
  readonly sourcePath: string;
  readonly line: number;
  readonly text: string;
  readonly mappedEntryIds: readonly string[];
}

export interface ProductionStubReport {
  readonly schemaVersion: 1;
  readonly generatedAt: string;
  readonly gatePassed: boolean;
  readonly summary: {
    readonly registered: number;
    readonly sourceMatched: number;
    readonly open: number;
    readonly mappedOccurrences: number;
    readonly unmappedOccurrences: number;
  };
  readonly errors: readonly string[];
  readonly entries: readonly ProductionStubEntryVerification[];
  readonly mappedOccurrences: readonly ProductionStubOccurrence[];
  readonly unmappedOccurrences: readonly ProductionStubOccurrence[];
}

export function parseProductionStubManifest(input: string | unknown): ProductionStubManifest {
  const value = typeof input === 'string' ? JSON.parse(input) as unknown : input;
  return manifestSchema.parse(value);
}

function expandedManifestEntries(manifest: ProductionStubManifest): readonly ProductionStubEntry[] {
  return [
    ...manifest.entries,
    ...manifest.candidateInventory.map((candidate): ProductionStubEntry => ({
      id: candidate.id,
      category: candidate.category,
      sourcePath: candidate.sourcePath,
      sourcePattern: BROAD_MOCK_STUB_PATTERN,
      sourceExpectedOccurrences: candidate.expectedOccurrences,
      occurrencePatterns: [BROAD_MOCK_STUB_PATTERN],
      expectedOccurrences: candidate.expectedOccurrences,
      productionGuardAnchors: candidate.productionGuardAnchors,
      productionPolicy: candidate.productionPolicy ?? 'open',
      operationalSuccessAllowedInProduction: false,
      surfaceKind: candidate.surfaceKind,
      visibleDisclosureAnchors: candidate.visibleDisclosureAnchors,
      owner: candidate.owner,
      notes: candidate.notes,
    })),
  ];
}

function hasTraversalOrEscape(sourcePath: string): boolean {
  if (sourcePath.startsWith('/') || /^[A-Za-z]:[\\/]/u.test(sourcePath)) return true;
  const parts = sourcePath.split(/[\\/]+/u);
  return parts.includes('..') || parts.includes('.') || parts.some((part) => part.length === 0);
}

function compilePattern(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern, 'mu');
  } catch {
    return null;
  }
}

function scriptKindFor(sourcePath: string): ts.ScriptKind {
  const lower = sourcePath.toLowerCase();
  if (lower.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (lower.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (lower.endsWith('.js') || lower.endsWith('.mjs') || lower.endsWith('.cjs')) return ts.ScriptKind.JS;
  if (lower.endsWith('.json')) return ts.ScriptKind.JSON;
  return ts.ScriptKind.TS;
}

/**
 * Preserve executable tokens and source positions while replacing comments
 * with spaces. TypeScript's parser supplies regex/template context, avoiding
 * the `/[/*]/` ambiguity that defeats hand-written slash scanners.
 */
export function executableProductionSource(sourcePath: string, source: string): string {
  // Shell/config comments are deliberately left visible: without a real shell
  // parser, failing closed on a suspicious comment is safer than a hand-rolled
  // lexer hiding executable syntax. JS/TS/JSON use the compiler parser below.
  if (!/\.(?:[cm]?[jt]sx?|json)$/iu.test(sourcePath)) return source;
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(sourcePath),
  );
  const chars: string[] = source.split('').map((character) => (
    character === '\n' || character === '\r' ? character : ' '
  ));
  const visit = (node: ts.Node): void => {
    if (ts.isJSDoc(node)) return;
    const children = node.getChildren(sourceFile);
    if (children.length === 0) {
      const start = node.getStart(sourceFile, false);
      const end = node.getEnd();
      for (let index = start; index < end; index += 1) chars[index] = source[index] ?? '';
      return;
    }
    children.forEach(visit);
  };
  visit(sourceFile);
  return chars.join('');
}

function countPatternMatches(pattern: string, source: string): number | null {
  let compiled: RegExp;
  try {
    compiled = new RegExp(pattern, 'gmu');
  } catch {
    return null;
  }
  let count = 0;
  for (let match = compiled.exec(source); match; match = compiled.exec(source)) {
    count += 1;
    if (match[0].length === 0) compiled.lastIndex += 1;
  }
  return count;
}

interface ParsedRenderedSelector {
  readonly attributeName: string;
  readonly attributeValue?: string;
}

function parseRenderedSelector(selector: string): ParsedRenderedSelector | null {
  const match = /^\[([A-Za-z_:][A-Za-z0-9_.:-]*)(?:=(?:"([^"]*)"|'([^']*)'))?\]$/u.exec(selector.trim());
  if (!match?.[1]) return null;
  return {
    attributeName: match[1],
    ...(match[2] !== undefined || match[3] !== undefined
      ? { attributeValue: match[2] ?? match[3] ?? '' }
      : {}),
  };
}

function jsxAttributeName(attribute: ts.JsxAttribute): string {
  return attribute.name.getText();
}

function staticJsxAttributeValue(attribute: ts.JsxAttribute): string | null {
  if (!attribute.initializer) return '';
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  if (
    ts.isJsxExpression(attribute.initializer)
    && attribute.initializer.expression
    && ts.isStringLiteralLike(attribute.initializer.expression)
  ) return attribute.initializer.expression.text;
  return null;
}

interface RenderedDisclosureMatches {
  readonly count: number;
  readonly expressionReferenceCount: number;
}

function unwrapParenthesizedExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (ts.isParenthesizedExpression(current)) current = current.expression;
  return current;
}

function staticVisibleExpressionFragments(expression: ts.Expression): readonly string[] {
  const current = unwrapParenthesizedExpression(expression);
  if (ts.isStringLiteralLike(current)) return [current.text];
  if (ts.isConditionalExpression(current)) {
    return [
      ...staticVisibleExpressionFragments(current.whenTrue),
      ...staticVisibleExpressionFragments(current.whenFalse),
    ];
  }
  if (
    ts.isBinaryExpression(current)
    && current.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
  ) return staticVisibleExpressionFragments(current.right);
  return [];
}

function visibleExpressionReferenceText(
  expression: ts.Expression,
  sourceFile: ts.SourceFile,
): string | null {
  const current = unwrapParenthesizedExpression(expression);
  if (ts.isPropertyAccessExpression(current) || ts.isElementAccessExpression(current)) {
    return current.getText(sourceFile);
  }
  return null;
}

function renderedDisclosureMatches(
  sourcePath: string,
  source: string,
  selector: ParsedRenderedSelector,
  disclosurePattern: string,
): RenderedDisclosureMatches | null {
  if (!/\.(?:[cm]?[jt]sx)$/iu.test(sourcePath)) {
    return { count: 0, expressionReferenceCount: 0 };
  }
  const compiled = compilePattern(disclosurePattern);
  if (!compiled) return null;
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(sourcePath),
  );
  let count = 0;
  let expressionReferenceCount = 0;
  const inspect = (node: ts.Node): void => {
    const opening = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : null;
    if (opening) {
      const selectorAttribute = opening.attributes.properties.find((property): property is ts.JsxAttribute => (
        ts.isJsxAttribute(property)
        && jsxAttributeName(property) === selector.attributeName
        && (
          selector.attributeValue === undefined
          || staticJsxAttributeValue(property) === selector.attributeValue
        )
      ));
      if (selectorAttribute) {
        const visibleFragments: string[] = [];
        const visibleExpressionReferences: string[] = [];
        for (const property of opening.attributes.properties) {
          if (!ts.isJsxAttribute(property)) continue;
          const name = jsxAttributeName(property);
          if (name !== 'aria-label' && name !== 'aria-description' && name !== 'title') continue;
          const value = staticJsxAttributeValue(property);
          if (value !== null) visibleFragments.push(value);
        }
        if (ts.isJsxElement(node)) {
          const collectVisibleChildren = (children: readonly ts.JsxChild[]): void => {
            for (const child of children) {
              if (ts.isJsxText(child)) {
                visibleFragments.push(child.text);
                continue;
              }
              if (ts.isJsxExpression(child) && child.expression) {
                visibleFragments.push(...staticVisibleExpressionFragments(child.expression));
                const reference = visibleExpressionReferenceText(child.expression, sourceFile);
                if (reference) visibleExpressionReferences.push(reference);
                continue;
              }
              if (ts.isJsxElement(child)) {
                collectVisibleChildren(child.children);
                continue;
              }
              if (ts.isJsxFragment(child)) collectVisibleChildren(child.children);
            }
          };
          collectVisibleChildren(node.children);
        }
        const visibleSource = visibleFragments.join('\n');
        const literalMatches = countPatternMatches(disclosurePattern, visibleSource);
        if (literalMatches !== null) count += literalMatches;
        for (const reference of visibleExpressionReferences) {
          const referenceMatches = countPatternMatches(disclosurePattern, reference);
          if (referenceMatches !== null) {
            count += referenceMatches;
            expressionReferenceCount += referenceMatches;
          }
        }
      }
    }
    ts.forEachChild(node, inspect);
  };
  inspect(sourceFile);
  return { count, expressionReferenceCount };
}

function sameScriptModulePath(left: string, right: string): boolean {
  const withoutScriptExtension = (value: string): string => value.replace(/\.[cm]?[jt]sx?$/iu, '');
  return withoutScriptExtension(left) === withoutScriptExtension(right);
}

function sourceDirectlyReferencesTarget(
  sourcePath: string,
  source: string,
  targetPath: string,
): boolean {
  const withoutScriptExtension = (value: string): string => value.replace(/\.[cm]?[jt]sx?$/iu, '');
  if (sameScriptModulePath(sourcePath, targetPath)) return true;
  if (!/\.(?:[cm]?[jt]sx?)$/iu.test(sourcePath)) return false;
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(sourcePath),
  );
  let referenced = false;
  const visit = (node: ts.Node): void => {
    if (referenced) return;
    const moduleSpecifier = (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      && node.moduleSpecifier
      && ts.isStringLiteralLike(node.moduleSpecifier)
    ) ? node.moduleSpecifier.text : null;
    if (moduleSpecifier?.startsWith('.') || moduleSpecifier?.startsWith('@/')) {
      const resolved = moduleSpecifier.startsWith('@/')
        ? path.posix.normalize(path.posix.join('src', moduleSpecifier.slice(2)))
        : path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), moduleSpecifier));
      const normalizedTarget = withoutScriptExtension(targetPath);
      referenced = withoutScriptExtension(resolved) === normalizedTarget
        || `${withoutScriptExtension(resolved)}/index` === normalizedTarget;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return referenced;
}

function collectPatternMatchRanges(pattern: string, source: string): ReadonlySet<string> | null {
  let compiled: RegExp;
  try {
    compiled = new RegExp(pattern, 'gmu');
  } catch {
    return null;
  }
  const ranges = new Set<string>();
  for (let match = compiled.exec(source); match; match = compiled.exec(source)) {
    ranges.add(`${match.index}:${match.index + match[0].length}`);
    if (match[0].length === 0) compiled.lastIndex += 1;
  }
  return ranges;
}

function isProtectedProviderCapability(entry: ProductionStubEntry): boolean {
  const sourcePath = entry.sourcePath.toLowerCase();
  if (
    /(?:^|[/_.-])(?:payment|payments|billing|commerce)(?:[/_.-]|$)/u.test(sourcePath)
    || /(?:^|[/_.-])(?:translation|translations)(?:[/_.-]|$)/u.test(sourcePath)
    || /(?:^|[/_.-])(?:meeting|meetings|zoom)(?:[/_.-]|$)/u.test(sourcePath)
    || /(?:^|[/_.-])(?:email|emails|mail|notification|notifications)(?:[/_.-]|$)/u.test(sourcePath)
  ) return true;

  const category = entry.category;
  const words = category.toLowerCase().split(/[^a-z]+/u).filter(Boolean);
  return words.some((word) => (
    word === 'payment'
    || word === 'payments'
    || word === 'billing'
    || word === 'commerce'
    || word === 'translation'
    || word === 'translations'
    || word === 'meeting'
    || word === 'meetings'
    || word === 'email'
    || word === 'emails'
  ));
}

/**
 * Pure manifest verifier. Missing or changed source is reported as OPEN instead
 * of throwing because other lanes may legitimately change the shared tree.
 */
export function verifyProductionStubRegistry(
  manifest: ProductionStubManifest,
  options: ProductionStubVerificationOptions,
): ProductionStubVerification {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const entries = expandedManifestEntries(manifest).map((entry): ProductionStubEntryVerification => {
    const reasons: string[] = [];
    let effectivePolicy = entry.productionPolicy;
    let sourceMatched = false;

    if (seenIds.has(entry.id)) {
      errors.push(`duplicate_id:${entry.id}`);
      reasons.push('duplicate_id');
    }
    seenIds.add(entry.id);

    if (hasTraversalOrEscape(entry.sourcePath)) {
      errors.push(`source_path_escape:${entry.id}`);
      reasons.push('source_path_escape');
      effectivePolicy = 'open';
    } else {
      const resolved = options.resolveSource(entry.sourcePath);
      if (!resolved.regularFile || typeof resolved.content !== 'string') {
        reasons.push(resolved.reason ?? 'source_not_regular_file');
        effectivePolicy = 'open';
      } else {
        const executableSource = executableProductionSource(entry.sourcePath, resolved.content);
        const sourcePatternCount = countPatternMatches(entry.sourcePattern, executableSource);
        if (sourcePatternCount === null) {
          errors.push(`invalid_source_pattern:${entry.id}`);
          reasons.push('invalid_source_pattern');
          effectivePolicy = 'open';
        } else if (sourcePatternCount !== entry.sourceExpectedOccurrences) {
          reasons.push(`source_pattern_count_mismatch:${entry.sourceExpectedOccurrences}:${sourcePatternCount}`);
          effectivePolicy = 'open';
        } else {
          const seenOccurrencePatterns = new Set<string>();
          const matchedOccurrenceRanges = new Set<string>();
          let allOccurrencePatternsMatched = true;
          for (const [index, occurrencePattern] of entry.occurrencePatterns.entries()) {
            if (seenOccurrencePatterns.has(occurrencePattern)) {
              errors.push(`duplicate_occurrence_pattern:${entry.id}:${index}`);
              reasons.push(`duplicate_occurrence_pattern:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
              continue;
            }
            seenOccurrencePatterns.add(occurrencePattern);
            const occurrenceRanges = collectPatternMatchRanges(occurrencePattern, executableSource);
            if (!occurrenceRanges) {
              errors.push(`invalid_occurrence_pattern:${entry.id}:${index}`);
              reasons.push(`invalid_occurrence_pattern:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
              continue;
            }
            if (occurrenceRanges.size === 0) {
              reasons.push(`occurrence_pattern_missing:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
            }
            occurrenceRanges.forEach((range) => matchedOccurrenceRanges.add(range));
          }
          if (matchedOccurrenceRanges.size !== entry.expectedOccurrences) {
            reasons.push(`occurrence_count_mismatch:${entry.expectedOccurrences}:${matchedOccurrenceRanges.size}`);
            allOccurrencePatternsMatched = false;
            effectivePolicy = 'open';
          }

          const seenGuardAnchors = new Set<string>();
          if (entry.productionPolicy !== 'open' && entry.productionGuardAnchors.length === 0) {
            errors.push(`missing_production_guard:${entry.id}`);
            reasons.push('missing_production_guard');
            allOccurrencePatternsMatched = false;
            effectivePolicy = 'open';
          }
          for (const [index, guard] of entry.productionGuardAnchors.entries()) {
            const guardKey = `${guard.sourcePath}\0${guard.sourcePattern}`;
            if (seenGuardAnchors.has(guardKey)) {
              errors.push(`duplicate_guard_anchor:${entry.id}:${index}`);
              reasons.push(`duplicate_guard_anchor:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
              continue;
            }
            seenGuardAnchors.add(guardKey);
            if (hasTraversalOrEscape(guard.sourcePath)) {
              errors.push(`guard_source_path_escape:${entry.id}:${index}`);
              reasons.push(`guard_source_path_escape:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
              continue;
            }
            const guardSource = options.resolveSource(guard.sourcePath);
            if (!guardSource.regularFile || typeof guardSource.content !== 'string') {
              reasons.push(`guard_source_not_regular_file:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
              continue;
            }
            const guardCount = countPatternMatches(
              guard.sourcePattern,
              executableProductionSource(guard.sourcePath, guardSource.content),
            );
            if (guardCount === null) {
              errors.push(`invalid_guard_pattern:${entry.id}:${index}`);
              reasons.push(`invalid_guard_pattern:${index}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
            } else if (guardCount !== guard.expectedOccurrences) {
              reasons.push(`guard_pattern_count_mismatch:${index}:${guard.expectedOccurrences}:${guardCount}`);
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
            }
          }

          if (entry.surfaceKind !== 'non-rendered') {
            if (entry.visibleDisclosureAnchors.length === 0) {
              reasons.push('missing_visible_disclosure');
              allOccurrencePatternsMatched = false;
              effectivePolicy = 'open';
            }
            const seenDisclosureAnchors = new Set<string>();
            for (const [index, disclosure] of entry.visibleDisclosureAnchors.entries()) {
              // A shared disclosure component can be truthfully consumed by
              // several distinct products. The duplicate identity therefore
              // includes the normalized productSourcePath so the same
              // disclosure/selector/pattern can be verified once per consumer,
              // while an exact duplicate mapped to the same product is rejected.
              const disclosureKey = `${disclosure.sourcePath}\0${disclosure.renderedSelector}\0${disclosure.sourcePattern}\0${disclosure.productSourcePath}`;
              if (seenDisclosureAnchors.has(disclosureKey)) {
                errors.push(`duplicate_visible_disclosure_anchor:${entry.id}:${index}`);
                reasons.push(`duplicate_visible_disclosure_anchor:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
                continue;
              }
              seenDisclosureAnchors.add(disclosureKey);
              const renderedSelector = parseRenderedSelector(disclosure.renderedSelector);
              if (!renderedSelector) {
                errors.push(`invalid_visible_disclosure_selector:${entry.id}:${index}`);
                reasons.push(`invalid_visible_disclosure_selector:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
                continue;
              }
              if (hasTraversalOrEscape(disclosure.sourcePath)) {
                errors.push(`visible_disclosure_source_path_escape:${entry.id}:${index}`);
                reasons.push(`visible_disclosure_source_path_escape:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
                continue;
              }
              if (hasTraversalOrEscape(disclosure.productSourcePath)) {
                errors.push(`visible_disclosure_product_path_escape:${entry.id}:${index}`);
                reasons.push(`visible_disclosure_product_path_escape:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
                continue;
              }
              const disclosureSource = options.resolveSource(disclosure.sourcePath);
              if (!disclosureSource.regularFile || typeof disclosureSource.content !== 'string') {
                reasons.push(`visible_disclosure_source_not_regular_file:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
                continue;
              }
              const disclosureMatches = renderedDisclosureMatches(
                disclosure.sourcePath,
                disclosureSource.content,
                renderedSelector,
                disclosure.sourcePattern,
              );
              if (disclosureMatches === null) {
                errors.push(`invalid_visible_disclosure_pattern:${entry.id}:${index}`);
                reasons.push(`invalid_visible_disclosure_pattern:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              } else if (disclosureMatches.count !== disclosure.expectedOccurrences) {
                reasons.push(disclosureMatches.count === 0
                  ? `visible_disclosure_not_rendered:${index}`
                  : `visible_disclosure_count_mismatch:${index}:${disclosure.expectedOccurrences}:${disclosureMatches.count}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              }

              if (
                disclosureMatches
                && disclosureMatches.expressionReferenceCount === 0
                && !/(?:demo|stub)/iu.test(disclosure.sourcePattern)
              ) {
                errors.push(`invalid_visible_disclosure_pattern:${entry.id}:${index}`);
                reasons.push(`invalid_visible_disclosure_pattern:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              }

              const executableDisclosureSource = executableProductionSource(
                disclosure.sourcePath,
                disclosureSource.content,
              );
              const sourceReferenceCount = countPatternMatches(
                disclosure.sourceReferencePattern,
                executableDisclosureSource,
              );
              if (sourceReferenceCount === null) {
                errors.push(`invalid_visible_disclosure_source_reference:${entry.id}:${index}`);
                reasons.push(`invalid_visible_disclosure_source_reference:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              } else if (sourceReferenceCount !== disclosure.sourceReferenceExpectedOccurrences) {
                reasons.push(`visible_disclosure_source_reference_mismatch:${index}:${disclosure.sourceReferenceExpectedOccurrences}:${sourceReferenceCount}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              }

              const productSource = options.resolveSource(disclosure.productSourcePath);
              if (!productSource.regularFile || typeof productSource.content !== 'string') {
                reasons.push(`visible_disclosure_product_source_not_regular_file:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
                continue;
              }
              const disclosureReferencesProduct = sourceDirectlyReferencesTarget(
                disclosure.sourcePath,
                disclosureSource.content,
                disclosure.productSourcePath,
              );
              const productReferencesDisclosure = sourceDirectlyReferencesTarget(
                disclosure.productSourcePath,
                productSource.content,
                disclosure.sourcePath,
              );
              const expressionReferenceUsed = (disclosureMatches?.expressionReferenceCount ?? 0) > 0;
              if (
                (!expressionReferenceUsed && !disclosureReferencesProduct && !productReferencesDisclosure)
                || (expressionReferenceUsed && !disclosureReferencesProduct)
              ) {
                reasons.push(`visible_disclosure_product_not_referenced:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              }
              if (
                expressionReferenceUsed
                && !/(?:demo|stub)/iu.test(disclosure.productSourcePattern)
              ) {
                errors.push(`invalid_visible_disclosure_product_mapping:${entry.id}:${index}`);
                reasons.push(`invalid_visible_disclosure_product_mapping:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              }
              const productCount = countPatternMatches(
                disclosure.productSourcePattern,
                executableProductionSource(disclosure.productSourcePath, productSource.content),
              );
              if (productCount === null) {
                errors.push(`invalid_visible_disclosure_product_pattern:${entry.id}:${index}`);
                reasons.push(`invalid_visible_disclosure_product_pattern:${index}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              } else if (productCount !== disclosure.productExpectedOccurrences) {
                reasons.push(`visible_disclosure_product_count_mismatch:${index}:${disclosure.productExpectedOccurrences}:${productCount}`);
                allOccurrencePatternsMatched = false;
                effectivePolicy = 'open';
              }
            }
          }
          sourceMatched = allOccurrencePatternsMatched;
        }
      }
    }

    if (
      (entry.productionPolicy === 'blocked' || entry.productionPolicy === 'placeholder-only')
      && entry.operationalSuccessAllowedInProduction
    ) {
      errors.push(`false_production_success_claim:${entry.id}`);
      reasons.push('false_production_success_claim');
      effectivePolicy = 'open';
    }

    if (
      isProtectedProviderCapability(entry)
      && entry.operationalSuccessAllowedInProduction
    ) {
      errors.push(`protected_capability_production_success_claim:${entry.id}`);
      reasons.push('protected_capability_production_success_claim');
      effectivePolicy = 'open';
    }

    if (effectivePolicy === 'open' && !reasons.includes('policy_open')) reasons.push('policy_open');
    return { entry, effectivePolicy, sourceMatched, reasons };
  });

  const gatePassed = errors.length === 0 && entries.every((row) => row.effectivePolicy !== 'open');
  return { valid: errors.length === 0, gatePassed, errors, entries };
}

export function mapProductionStubOccurrences(
  occurrences: readonly Omit<ProductionStubOccurrence, 'mappedEntryIds'>[],
  manifest: ProductionStubManifest,
): readonly ProductionStubOccurrence[] {
  return occurrences.map((occurrence) => {
    const mappedEntryIds = expandedManifestEntries(manifest)
      .filter((entry) => entry.sourcePath === occurrence.sourcePath)
      // A same-file declaration is not enough: each scan hit must match a
      // manifest-owned, line-level occurrence anchor. This prevents one broad
      // registration from hiding unrelated stubs elsewhere in the file.
      .filter((entry) => entry.occurrencePatterns.some((pattern) => {
        const compiled = compilePattern(pattern);
        return compiled?.test(occurrence.text) ?? false;
      }))
      .map((entry) => entry.id);
    return { ...occurrence, mappedEntryIds };
  });
}

export function createProductionStubReport(
  verification: ProductionStubVerification,
  occurrences: readonly ProductionStubOccurrence[],
  generatedAt = new Date(),
): ProductionStubReport {
  const mappedOccurrences = occurrences.filter((row) => row.mappedEntryIds.length > 0);
  const unmappedOccurrences = occurrences.filter((row) => row.mappedEntryIds.length === 0);
  const gatePassed = verification.gatePassed && unmappedOccurrences.length === 0;
  return {
    schemaVersion: 1,
    generatedAt: generatedAt.toISOString(),
    gatePassed,
    summary: {
      registered: verification.entries.length,
      sourceMatched: verification.entries.filter((row) => row.sourceMatched).length,
      open: verification.entries.filter((row) => row.effectivePolicy === 'open').length,
      mappedOccurrences: mappedOccurrences.length,
      unmappedOccurrences: unmappedOccurrences.length,
    },
    errors: verification.errors,
    entries: verification.entries,
    mappedOccurrences,
    unmappedOccurrences,
  };
}

export function renderProductionStubReport(report: ProductionStubReport): string {
  const lines = [
    '# Production stub registry',
    '',
    `Gate: **${report.gatePassed ? 'PASS' : 'FAIL'}**`,
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Registered: ${report.summary.registered}; source matched: ${report.summary.sourceMatched}; open: ${report.summary.open}; mapped scan hits: ${report.summary.mappedOccurrences}; unmapped high-risk hits: ${report.summary.unmappedOccurrences}.`,
    '',
    '## Registered surfaces',
    '',
    '| ID | Category | Declared policy | Effective policy | Production success | Surface | Visible disclosure | Source | Reasons |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...report.entries.map((row) => `| ${row.entry.id} | ${row.entry.category} | ${row.entry.productionPolicy} | ${row.effectivePolicy} | ${row.entry.operationalSuccessAllowedInProduction ? 'yes' : 'no'} | ${row.entry.surfaceKind} | ${row.entry.visibleDisclosureAnchors.length > 0 ? 'anchored' : row.entry.surfaceKind === 'non-rendered' ? 'n/a' : 'missing'} | \`${row.entry.sourcePath}\` | ${row.reasons.join(', ') || 'matched'} |`),
    '',
    '## Unmapped high-risk scan hits',
    '',
    ...(report.unmappedOccurrences.length === 0
      ? ['None.']
      : report.unmappedOccurrences.map((row) => `- \`${row.sourcePath}:${row.line}\` ${row.text.trim().slice(0, 240)}`)),
    '',
  ];
  return `${lines.join('\n')}\n`;
}
