import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import {
  createProductionStubReport,
  executableProductionSource,
  mapProductionStubOccurrences,
  parseProductionStubManifest,
  renderProductionStubReport,
  verifyProductionStubRegistry,
  type ProductionStubManifest,
  type ProductionStubOccurrence,
  type StubSourceResolution,
} from '../src/lib/builder/audit/production-stub-registry';

interface CliOptions {
  readonly manifest: string;
  readonly repositoryRoot: string;
  readonly outputDir: string;
  readonly dryRun: boolean;
  readonly check: boolean;
  readonly help: boolean;
}

// AST/token classification below is the primary mock/stub detector. This
// reviewed list covers high-risk behavior that may not spell either token.
const NON_TOKEN_HIGH_RISK_PATTERN = [
  'mailchimp-stub',
  'checkInMemoryRateLimit',
  'external embed placeholder',
  'send-email-stub',
  "case\\s+['\"]simulate-email['\"]",
  'fallbackSection\\(',
  'accepting unsigned[^\\n]*dev',
  'code-body-stored-as-stub',
].join('|');

const ROOT_SCAN_CANDIDATES = [
  '.',
] as const;

const RG_SCAN_GLOBS = [
  '**/*.{ts,tsx,js,jsx,mjs,cjs,mts,cts,json,sh,bash,zsh}',
  '!**/__tests__/**',
  '!**/tests/**',
  '!**/__mocks__/**',
  '!**/__fixtures__/**',
  '!**/fixtures/**',
  '!**/*.test.*',
  '!**/*.spec.*',
  '!**/*.stories.*',
  '!**/*.story.*',
  '!**/*.snap',
  '!**/generated/**',
  '!**/.generated/**',
  '!**/evidence/**',
  '!**/.omo/**',
  '!**/.next/**',
  '!**/coverage/**',
  '!**/dist/**',
  '!**/node_modules/**',
  '!**/runtime-data/**',
  '!**/tmp/**',
  '!**/.tmp/**',
  '!**/test-results/**',
  '!**/playwright-report/**',
  '!**/storybook-static/**',
] as const;

function isExcludedProductionScanPath(sourcePath: string): boolean {
  const normalized = sourcePath.split(path.sep).join('/');
  // These exact paths are verification infrastructure, not production
  // success paths. Avoid a broad filename rule: a newly added script called
  // `smoke-deploy.sh`, for example, must still fail the gate until reviewed.
  return normalized === 'AGENT-STATE.json'
    || normalized.startsWith('docs/')
    || normalized.startsWith('src/lib/builder/audit/')
    || normalized === 'src/lib/builder/security/qa-runtime-attestation.ts'
    || normalized === 'scripts/qa-runtime-isolation-contract.mjs'
    || normalized === 'scripts/start-qa-server.sh'
    || normalized === 'scripts/run-production-stub-registry.ts'
    || normalized === 'scripts/run-production-stub-registry.mjs';
}

function productionScriptEntrypoints(repositoryRoot: string): ReadonlySet<string> {
  const packagePath = path.join(repositoryRoot, 'package.json');
  if (!existsSync(packagePath)) return new Set();
  try {
    const parsed = JSON.parse(readFileSync(packagePath, 'utf8')) as { scripts?: Record<string, unknown> };
    const scripts = parsed.scripts ?? {};
    const queue = ['start', 'prestart', 'poststart', 'build', 'prebuild', 'postbuild', 'vercel-build', 'postinstall'];
    const visited = new Set<string>();
    const entrypoints = new Set<string>();
    while (queue.length > 0) {
      const scriptName = queue.shift();
      if (!scriptName || visited.has(scriptName)) continue;
      visited.add(scriptName);
      const command = scripts[scriptName];
      if (typeof command !== 'string') continue;
      for (const match of command.matchAll(/(?:npm|pnpm|yarn)\s+(?:run\s+)?([A-Za-z0-9:_-]+)/gu)) {
        if (match[1] && !visited.has(match[1])) queue.push(match[1]);
      }
      for (const match of command.matchAll(/(?:^|[\s"'`])(?:\.\/)?(scripts\/[A-Za-z0-9._/-]+)/gu)) {
        if (match[1]) entrypoints.add(match[1]);
      }
    }
    return entrypoints;
  } catch {
    // Malformed package metadata should not create a scan exclusion.
    return new Set();
  }
}

function isKnownNonOperationalOccurrence(
  sourcePath: string,
  line: string,
  productionEntrypoints: ReadonlySet<string>,
): boolean {
  // This legacy PATCH route records translation provenance selected by an
  // authenticated editor. It never dispatches a provider or manufactures a
  // translation result, so its `mock` value is a data label rather than a
  // production success-path stub. Keep the exception exact and line-scoped.
  if (
    sourcePath === 'src/app/api/builder/translations/route.ts'
    && /value === 'ai-openai' \|\| value === 'ai-deepl' \|\| value === 'mock'/u.test(line)
  ) return true;
  if (
    sourcePath === 'scripts/run-builder-smoke.sh'
    && !productionEntrypoints.has(sourcePath)
    && /(?:BOOKING_PAYMENT_ALLOW_STUB|BUILDER_ZOOM_MOCK_ALLOW)=1/u.test(line)
  ) return true;
  if (
    sourcePath === 'package.json'
    && /"check:r02-stubs"\s*:\s*"node scripts\/run-production-stub-registry\.mjs --check"/u.test(line)
  ) return true;
  if (/\b(?:no|not|does not|do not)\b[^'"\n]{0,120}\bfake\b/iu.test(line)) return true;
  if (/\bstub\s*(?::\s*false|(?:===|!==)\s*false)\b/u.test(line)) return true;
  if (
    sourcePath === 'src/components/builder/canvas/ImageEditDialog.tsx'
    && /const stub = value\.stub;/u.test(line)
  ) return true;
  return false;
}

function usage(): string {
  return [
    'Usage: node scripts/run-production-stub-registry.mjs [options]',
    '  --manifest <path>          Registry JSON (default: docs/stub-registry/production-stubs.json)',
    '  --repository-root <path>   Source root (default: current directory)',
    '  --output-dir <path>        Output directory (default: .omo/evidence/stub-registry)',
    '  --dry-run                  Print JSON and Markdown; write no files',
    '  --check                    Print a deterministic gate summary; write no files',
  ].join('\n');
}

function takeValue(argv: readonly string[], index: number, flag: string): readonly [string, number] {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value\n\n${usage()}`);
  return [value, index + 1];
}

function parseArgs(argv: readonly string[]): CliOptions {
  const cwd = process.cwd();
  let manifest = path.join(cwd, 'docs/stub-registry/production-stubs.json');
  let repositoryRoot = cwd;
  let outputDir = path.join(cwd, '.omo/evidence/stub-registry');
  let outputWasExplicit = false;
  let dryRun = false;
  let check = false;
  let help = false;
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === '--dry-run') {
      dryRun = true;
    } else if (flag === '--check') {
      check = true;
    } else if (flag === '--help' || flag === '-h') {
      help = true;
    } else if (flag === '--manifest') {
      const [value, next] = takeValue(argv, index, flag);
      manifest = path.resolve(cwd, value);
      index = next;
    } else if (flag === '--repository-root') {
      const [value, next] = takeValue(argv, index, flag);
      repositoryRoot = path.resolve(cwd, value);
      index = next;
    } else if (flag === '--output-dir') {
      const [value, next] = takeValue(argv, index, flag);
      outputDir = path.resolve(cwd, value);
      outputWasExplicit = true;
      index = next;
    } else {
      throw new Error(`unknown option ${flag}\n\n${usage()}`);
    }
  }
  if (dryRun && check) throw new Error('--dry-run and --check are mutually exclusive');
  if (!outputWasExplicit) outputDir = path.join(repositoryRoot, '.omo/evidence/stub-registry');
  return { manifest, repositoryRoot, outputDir, dryRun, check, help };
}

function isWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

export function resolveSourceWithinRoot(repositoryRoot: string, sourcePath: string): StubSourceResolution {
  if (path.isAbsolute(sourcePath) || sourcePath.split(/[\\/]+/u).includes('..')) {
    return { regularFile: false, reason: 'source_path_escape' };
  }
  try {
    const root = realpathSync(repositoryRoot);
    const candidate = realpathSync(path.resolve(root, sourcePath));
    if (!isWithin(root, candidate)) return { regularFile: false, reason: 'source_path_escape' };
    if (!statSync(candidate).isFile()) return { regularFile: false, reason: 'source_not_regular_file' };
    return { regularFile: true, content: readFileSync(candidate, 'utf8') };
  } catch {
    return { regularFile: false, reason: 'source_not_regular_file' };
  }
}

interface RgJsonMatch {
  readonly type?: string;
  readonly data?: {
    readonly path?: { readonly text?: string };
    readonly line_number?: number;
    readonly lines?: { readonly text?: string };
  };
}

function propertyName(node: ts.ObjectLiteralElementLike): string | null {
  if (!('name' in node) || !node.name) return null;
  if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) return node.name.text;
  return null;
}

function containsMeaningfulSyntheticVariant(value: string): boolean {
  const segmented = value
    .replace(/([a-z0-9])([A-Z])/gu, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/gu, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);
  return segmented.includes('mock') || segmented.includes('stub') || segmented.includes('fake');
}

function isTypeOnlyCandidate(node: ts.Node): boolean {
  for (let current: ts.Node | undefined = node; current; current = current.parent) {
    if (
      ts.isTypeNode(current)
      || ts.isInterfaceDeclaration(current)
      || ts.isTypeAliasDeclaration(current)
      || ts.isTypeParameterDeclaration(current)
      || ts.isPropertySignature(current)
      || ts.isMethodSignature(current)
      || ts.isCallSignatureDeclaration(current)
      || ts.isConstructSignatureDeclaration(current)
      || ts.isIndexSignatureDeclaration(current)
      || ts.isImportTypeNode(current)
      || ts.isImportDeclaration(current)
      || ts.isExportDeclaration(current)
      || (ts.isImportClause(current) && current.isTypeOnly)
      || (ts.isImportSpecifier(current) && current.isTypeOnly)
      || (ts.isExportSpecifier(current) && current.isTypeOnly)
    ) return true;
    if (ts.isStatement(current) || ts.isSourceFile(current)) break;
  }
  return false;
}

function mockStubCandidateText(node: ts.Node): string | null {
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node) || ts.isStringLiteralLike(node)) {
    return node.text;
  }
  if (ts.isJsxText(node)) {
    return node.text;
  }
  if (
    node.kind === ts.SyntaxKind.TemplateHead
    || node.kind === ts.SyntaxKind.TemplateMiddle
    || node.kind === ts.SyntaxKind.TemplateTail
  ) {
    const text = (node as ts.Node & { readonly text?: unknown }).text;
    return typeof text === 'string' ? text : null;
  }
  return null;
}

function semanticMockStubOccurrences(
  sourcePath: string,
  source: string,
): readonly Omit<ProductionStubOccurrence, 'mappedEntryIds'>[] {
  if (!/\.(?:[cm]?[jt]sx?|json)$/iu.test(sourcePath)) {
    return source.split(/\r?\n/u).flatMap((text, index) => {
      if (/^\s*#/u.test(text)) return [];
      const tokens = text.match(/[A-Za-z0-9_$-]+/gu) ?? [];
      if (!tokens.some(containsMeaningfulSyntheticVariant)) return [];
      return [{ sourcePath, line: index + 1, text }];
    });
  }

  const lower = sourcePath.toLowerCase();
  const scriptKind = lower.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : lower.endsWith('.jsx')
      ? ts.ScriptKind.JSX
      : lower.endsWith('.js') || lower.endsWith('.mjs') || lower.endsWith('.cjs')
        ? ts.ScriptKind.JS
        : lower.endsWith('.json')
          ? ts.ScriptKind.JSON
          : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, scriptKind);
  const sourceLines = source.split(/\r?\n/u);
  const result = new Map<string, Omit<ProductionStubOccurrence, 'mappedEntryIds'>>();
  const addNode = (node: ts.Node): void => {
    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false)).line + 1;
    const occurrence = { sourcePath, line, text: sourceLines[line - 1] ?? '' };
    result.set(`${sourcePath}:${line}:${occurrence.text}`, occurrence);
  };
  const constantString = (node: ts.Expression): string | null => {
    if (ts.isStringLiteralLike(node)) return node.text;
    if (
      ts.isBinaryExpression(node)
      && node.operatorToken.kind === ts.SyntaxKind.PlusToken
    ) {
      const left = constantString(node.left);
      const right = constantString(node.right);
      return left === null || right === null ? null : `${left}${right}`;
    }
    return null;
  };
  const visit = (node: ts.Node): void => {
    const candidate = mockStubCandidateText(node);
    if (candidate && containsMeaningfulSyntheticVariant(candidate) && !isTypeOnlyCandidate(node)) {
      addNode(node);
    }
    if (ts.isBinaryExpression(node) && !isTypeOnlyCandidate(node)) {
      const folded = constantString(node);
      if (folded && containsMeaningfulSyntheticVariant(folded)) addNode(node);
    }
    if (
      ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && /^contingency[A-Za-z0-9_$]*$/u.test(node.expression.text)
    ) addNode(node);
    if (ts.isObjectLiteralExpression(node)) {
      const hasTrueProperty = (name: string): boolean => node.properties.some((property) => (
        ts.isPropertyAssignment(property)
        && propertyName(property) === name
        && isTrueLiteral(property.initializer)
      ));
      if (hasTrueProperty('success') && hasTrueProperty('degraded')) addNode(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return [...result.values()];
}

function isTrueLiteral(node: ts.Expression | undefined): boolean {
  return node?.kind === ts.SyntaxKind.TrueKeyword;
}

function isFunctionScope(node: ts.Node): node is ts.FunctionLikeDeclaration {
  return ts.isFunctionDeclaration(node)
    || ts.isFunctionExpression(node)
    || ts.isArrowFunction(node)
    || ts.isMethodDeclaration(node);
}

function fallbackIdentifierForCall(node: ts.CallExpression): string | null {
  if (!ts.isIdentifier(node.expression)) return null;
  return /^fallback[A-Za-z0-9_$]*$/u.test(node.expression.text) ? node.expression.text : null;
}

function semanticFallbackSuccessOccurrences(
  sourcePath: string,
  source: string,
): readonly Omit<ProductionStubOccurrence, 'mappedEntryIds'>[] {
  if (!/\.(?:[cm]?[jt]sx?)$/iu.test(sourcePath)) return [];
  const lower = sourcePath.toLowerCase();
  const scriptKind = lower.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : lower.endsWith('.jsx')
      ? ts.ScriptKind.JSX
      : lower.endsWith('.js') || lower.endsWith('.mjs') || lower.endsWith('.cjs')
        ? ts.ScriptKind.JS
        : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, scriptKind);
  const sourceLines = source.split(/\r?\n/u);
  const result = new Map<string, Omit<ProductionStubOccurrence, 'mappedEntryIds'>>();
  const addNode = (node: ts.Node): void => {
    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false)).line + 1;
    const occurrence = {
      sourcePath,
      line,
      text: sourceLines[line - 1] ?? '',
    };
    result.set(`${sourcePath}:${line}:${occurrence.text}`, occurrence);
  };

  const inspectScope = (scope: ts.FunctionLikeDeclaration): void => {
    const fallbackCalls: ts.CallExpression[] = [];
    const usedFallbackTrueNodes: ts.Node[] = [];
    const successObjects: ts.ObjectLiteralExpression[] = [];
    const successUsedFallbackNodes: ts.Node[] = [];
    const visitWithinScope = (node: ts.Node): void => {
      if (node !== scope && isFunctionScope(node)) return;
      if (ts.isCallExpression(node) && fallbackIdentifierForCall(node)) fallbackCalls.push(node);
      if (
        ts.isBinaryExpression(node)
        && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && ts.isIdentifier(node.left)
        && node.left.text === 'usedFallback'
        && isTrueLiteral(node.right)
      ) usedFallbackTrueNodes.push(node);
      if (
        ts.isVariableDeclaration(node)
        && ts.isIdentifier(node.name)
        && node.name.text === 'usedFallback'
        && isTrueLiteral(node.initializer)
      ) usedFallbackTrueNodes.push(node);
      if (ts.isObjectLiteralExpression(node)) {
        const hasOkTrue = node.properties.some((property) => (
          ts.isPropertyAssignment(property)
          && propertyName(property) === 'ok'
          && isTrueLiteral(property.initializer)
        ));
        if (hasOkTrue) {
          successObjects.push(node);
          for (const property of node.properties) {
            if (
              (ts.isShorthandPropertyAssignment(property) && property.name.text === 'usedFallback')
              || (
                ts.isPropertyAssignment(property)
                && propertyName(property) === 'usedFallback'
                && isTrueLiteral(property.initializer)
              )
            ) successUsedFallbackNodes.push(property);
          }
        }
      }
      ts.forEachChild(node, visitWithinScope);
    };
    if (scope.body) visitWithinScope(scope.body);
    if (successObjects.length === 0) return;
    const directSuccessFallbackCalls = fallbackCalls.filter((call) => successObjects.some((object) => (
      call.getStart(sourceFile, false) >= object.getStart(sourceFile, false)
      && call.getEnd() <= object.getEnd()
    )));
    directSuccessFallbackCalls.forEach(addNode);
    const successDeclaresTrue = successUsedFallbackNodes.some((node) => (
      ts.isPropertyAssignment(node) && isTrueLiteral(node.initializer)
    ));
    if (successUsedFallbackNodes.length > 0 && (successDeclaresTrue || usedFallbackTrueNodes.length > 0)) {
      fallbackCalls.forEach(addNode);
      usedFallbackTrueNodes.forEach(addNode);
      successUsedFallbackNodes.forEach(addNode);
    }
  };

  const collectScopes = (node: ts.Node): void => {
    if (isFunctionScope(node)) inspectScope(node);
    ts.forEachChild(node, collectScopes);
  };
  collectScopes(sourceFile);
  return [...result.values()];
}

function runRg(repositoryRoot: string, pattern: string, targets: readonly string[]): readonly Omit<ProductionStubOccurrence, 'mappedEntryIds'>[] {
  if (targets.length === 0) return [];
  let output = '';
  try {
    output = execFileSync('rg', [
      '--json',
      '--line-number',
      ...RG_SCAN_GLOBS.flatMap((glob) => ['--glob', glob]),
      '--regexp', pattern,
      '--',
      ...targets,
    ], { cwd: repositoryRoot, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 });
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? (error as { status?: number }).status : undefined;
    if (status === 1) return [];
    throw error;
  }
  const matches: Array<Omit<ProductionStubOccurrence, 'mappedEntryIds'>> = [];
  for (const line of output.split('\n')) {
    if (!line) continue;
    const event = JSON.parse(line) as RgJsonMatch;
    if (event.type !== 'match') continue;
    const sourcePath = event.data?.path?.text;
    const lineNumber = event.data?.line_number;
    const text = event.data?.lines?.text;
    if (sourcePath && typeof lineNumber === 'number' && typeof text === 'string') {
      const normalizedSourcePath = sourcePath.split(path.sep).join('/').replace(/^\.\//u, '');
      matches.push({ sourcePath: normalizedSourcePath, line: lineNumber, text: text.replace(/\r?\n$/u, '') });
    }
  }
  return matches;
}

function listProductionScanFiles(repositoryRoot: string, targets: readonly string[]): readonly string[] {
  if (targets.length === 0) return [];
  let output = '';
  try {
    output = execFileSync('rg', [
      '--files',
      ...RG_SCAN_GLOBS.flatMap((glob) => ['--glob', glob]),
      '--',
      ...targets,
    ], { cwd: repositoryRoot, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 });
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? (error as { status?: number }).status : undefined;
    if (status === 1) return [];
    throw error;
  }
  return [...new Set(output.split(/\r?\n/u)
    .filter(Boolean)
    .map((sourcePath) => sourcePath.split(path.sep).join('/').replace(/^\.\//u, '')))]
    .sort();
}

export function scanHighRiskOccurrences(
  repositoryRoot: string,
  manifest: ProductionStubManifest,
  excludedSourcePaths: ReadonlySet<string> = new Set(),
): readonly ProductionStubOccurrence[] {
  const scanTargets = ROOT_SCAN_CANDIDATES.filter((candidate) => existsSync(path.join(repositoryRoot, candidate)));
  const productionEntrypoints = productionScriptEntrypoints(repositoryRoot);
  const productionFiles = listProductionScanFiles(repositoryRoot, scanTargets)
    .filter((sourcePath) => !excludedSourcePaths.has(sourcePath))
    .filter((sourcePath) => !isExcludedProductionScanPath(sourcePath));
  const sourceCache = new Map<string, readonly string[]>();
  const reviewedShapes = runRg(repositoryRoot, NON_TOKEN_HIGH_RISK_PATTERN, scanTargets)
    .filter((occurrence) => !excludedSourcePaths.has(occurrence.sourcePath))
    .filter((occurrence) => !isExcludedProductionScanPath(occurrence.sourcePath))
    .filter((occurrence) => {
      let sanitizedLines = sourceCache.get(occurrence.sourcePath);
      if (!sanitizedLines) {
        const source = readFileSync(path.join(repositoryRoot, occurrence.sourcePath), 'utf8');
        sanitizedLines = executableProductionSource(occurrence.sourcePath, source).split(/\r?\n/u);
        sourceCache.set(occurrence.sourcePath, sanitizedLines);
      }
      const sanitizedLine = sanitizedLines[occurrence.line - 1] ?? '';
      return new RegExp(NON_TOKEN_HIGH_RISK_PATTERN, 'u').test(sanitizedLine);
    })
    .filter((occurrence) => !isKnownNonOperationalOccurrence(
      occurrence.sourcePath,
      occurrence.text,
      productionEntrypoints,
    ));
  const tokenAware = productionFiles.flatMap((sourcePath) => {
    const source = readFileSync(path.join(repositoryRoot, sourcePath), 'utf8');
    return semanticMockStubOccurrences(sourcePath, source)
      .filter((occurrence) => !isKnownNonOperationalOccurrence(
        occurrence.sourcePath,
        occurrence.text,
        productionEntrypoints,
      ));
  });
  const semantic = productionFiles.flatMap((sourcePath) => {
    const source = readFileSync(path.join(repositoryRoot, sourcePath), 'utf8');
    return semanticFallbackSuccessOccurrences(sourcePath, source);
  });
  const raw = [...new Map(
    [...reviewedShapes, ...tokenAware, ...semantic].map((occurrence) => [
      `${occurrence.sourcePath}:${occurrence.line}:${occurrence.text}`,
      occurrence,
    ]),
  ).values()].sort((left, right) => {
    if (left.sourcePath !== right.sourcePath) return left.sourcePath < right.sourcePath ? -1 : 1;
    if (left.line !== right.line) return left.line - right.line;
    if (left.text === right.text) return 0;
    return left.text < right.text ? -1 : 1;
  });
  const bounded = raw.slice(0, 1_000);
  if (raw.length > bounded.length) {
    bounded.push({
      sourcePath: '<scan>',
      line: 0,
      text: `high-risk scan truncated after ${bounded.length} of ${raw.length} matches`,
    });
  }
  return mapProductionStubOccurrences(bounded, manifest);
}

function assertSafeOutput(repositoryRoot: string, outputDir: string): void {
  const runtimeData = path.resolve(repositoryRoot, 'runtime-data');
  const resolvedOutput = path.resolve(outputDir);
  if (isWithin(runtimeData, resolvedOutput)) throw new Error('refusing to write registry evidence inside runtime-data');
}

export async function runProductionStubRegistryCli(argv = process.argv.slice(2)): Promise<number> {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(usage());
    return 0;
  }
  const manifest = parseProductionStubManifest(readFileSync(options.manifest, 'utf8'));
  const verification = verifyProductionStubRegistry(manifest, {
    resolveSource: (sourcePath) => resolveSourceWithinRoot(options.repositoryRoot, sourcePath),
  });
  const manifestRelativePath = path.relative(options.repositoryRoot, options.manifest).split(path.sep).join('/');
  const excludedSourcePaths = isWithin(options.repositoryRoot, options.manifest)
    ? new Set([manifestRelativePath])
    : new Set<string>();
  const occurrences = scanHighRiskOccurrences(options.repositoryRoot, manifest, excludedSourcePaths);
  const report = createProductionStubReport(verification, occurrences);
  const markdown = renderProductionStubReport(report);

  if (options.check) {
    const openIds = report.entries
      .filter((row) => row.effectivePolicy === 'open')
      .map((row) => row.entry.id)
      .sort();
    console.log([
      `R02 production stub gate: ${report.gatePassed ? 'PASS' : 'FAIL'}`,
      `registered=${report.summary.registered} sourceMatched=${report.summary.sourceMatched} open=${report.summary.open} mapped=${report.summary.mappedOccurrences} unmapped=${report.summary.unmappedOccurrences}`,
      `openIds=${openIds.join(',') || 'none'}`,
    ].join('\n'));
  } else if (options.dryRun) {
    console.log(JSON.stringify(report, null, 2));
    console.log(markdown);
  } else {
    assertSafeOutput(options.repositoryRoot, options.outputDir);
    mkdirSync(options.outputDir, { recursive: true });
    writeFileSync(path.join(options.outputDir, 'production-stub-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    writeFileSync(path.join(options.outputDir, 'production-stub-report.md'), markdown, 'utf8');
    console.log(`Production stub registry report written to ${options.outputDir}`);
    console.log(`Production stub gate: ${report.gatePassed ? 'PASS' : 'FAIL'}`);
  }
  return report.gatePassed ? 0 : 2;
}

async function main(): Promise<void> {
  try {
    process.exitCode = await runProductionStubRegistryCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (
  process.env.PRODUCTION_STUB_REGISTRY_CLI === '1'
  || (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
) void main();
