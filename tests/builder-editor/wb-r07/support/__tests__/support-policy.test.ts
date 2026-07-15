import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '..');
const pointerSource = readFileSync(path.join(root, 'real-pointer.ts'), 'utf8');
const fixtureSource = readFileSync(path.join(root, 'fixture-document.ts'), 'utf8');
const journeyRoot = path.resolve(root, '..', 'journeys');
const journeyFiles = readdirSync(journeyRoot)
  .filter((filename) => filename.endsWith('.playwright.ts'))
  .sort();

type FunctionNode =
  | ts.ArrowFunction
  | ts.ConstructorDeclaration
  | ts.FunctionDeclaration
  | ts.FunctionExpression
  | ts.GetAccessorDeclaration
  | ts.MethodDeclaration
  | ts.SetAccessorDeclaration;

interface Scope {
  readonly parent?: Scope;
  readonly varScope: boolean;
  readonly bindings: Map<string, Binding>;
  readonly callableHistory: Map<string, CallableResolution[]>;
  readonly callablePaths: Map<string, CallableResolution[]>;
  readonly nonPlainHistory: Set<string>;
  readonly plainPaths: Set<string>;
  readonly nonPlainPaths: Set<string>;
  readonly optionPaths: Map<string, Set<string>>;
}

type Binding =
  | { readonly kind: 'alias'; readonly expression: ts.Expression; readonly scope: Scope }
  | { readonly kind: 'callable'; readonly name: string; readonly owner: string }
  | { readonly kind: 'function'; readonly node: FunctionNode; readonly scope: Scope }
  | { readonly kind: 'plain'; readonly initializer: ts.ObjectLiteralExpression | ts.ArrayLiteralExpression; readonly scope: Scope; readonly forbiddenOptions: Set<string> }
  | { readonly kind: 'playwright-locator' }
  | { readonly kind: 'unknown' };

interface CallableResolution {
  readonly name: string;
  readonly owner: string;
  readonly receiver?: ResolvedExpression;
  readonly boundArguments: readonly ResolvedExpression[];
  readonly forwardingMode?: 'apply' | 'call';
  readonly localPlainOwner?: boolean;
}

interface ResolvedFunction {
  readonly node: FunctionNode;
  readonly scope: Scope;
}

const EVENT_CONSTRUCTORS = new Set([
  'Event', 'MouseEvent', 'PointerEvent', 'KeyboardEvent', 'InputEvent',
  'TouchEvent', 'WheelEvent', 'DragEvent', 'CustomEvent', 'ClipboardEvent',
  'FocusEvent', 'CompositionEvent', 'SubmitEvent',
]);

const FIXED_SLEEP_CALLS = new Set([
  'waitForTimeout', 'setTimeout', 'setInterval', 'sleep', 'delay',
]);

const FORBIDDEN_CALLS = new Set([
  ...FIXED_SLEEP_CALLS,
  'addStyleTag', 'createEvent', 'emulateMedia',
]);

const DOM_MUTATION_METHODS = new Set([
  'add', 'after', 'append', 'appendChild', 'before', 'cancel', 'finish',
  'insertAdjacentElement', 'insertAdjacentHTML', 'insertAdjacentText',
  'insertBefore', 'insertRule', 'pause', 'prepend', 'remove',
  'removeAttribute', 'removeChild', 'removeProperty', 'replaceChild',
  'replaceChildren', 'replaceSync', 'replaceWith', 'replace', 'setAttribute',
  'setProperty', 'toggle', 'toggleAttribute',
]);

const ACTION_CALLS = new Set([
  'check', 'click', 'dblclick', 'dragTo', 'hover', 'move', 'realClick',
  'realContextClick', 'realDblClick', 'realDrag', 'tap', 'uncheck',
]);

const OBJECT_TARGET_MUTATORS = new Set(['assign', 'defineProperties', 'defineProperty', 'setPrototypeOf']);
const REFLECT_TARGET_MUTATORS = new Set(['defineProperty', 'deleteProperty', 'set', 'setPrototypeOf']);

function createScope(parent?: Scope, varScope = !parent): Scope {
  return {
    parent,
    varScope,
    bindings: new Map(),
    callableHistory: new Map(),
    callablePaths: new Map(),
    nonPlainHistory: new Set(),
    plainPaths: new Set(),
    nonPlainPaths: new Set(),
    optionPaths: new Map(),
  };
}

function nearestVarScope(scope: Scope): Scope {
  let cursor = scope;
  while (!cursor.varScope && cursor.parent) cursor = cursor.parent;
  return cursor;
}

function lookupBinding(scope: Scope, name: string): Binding | undefined {
  let cursor: Scope | undefined = scope;
  while (cursor) {
    const binding = cursor.bindings.get(name);
    if (binding) return binding;
    cursor = cursor.parent;
  }
  return undefined;
}

function bindingScope(scope: Scope, name: string): Scope | undefined {
  let cursor: Scope | undefined = scope;
  while (cursor) {
    if (cursor.bindings.has(name)) return cursor;
    cursor = cursor.parent;
  }
  return undefined;
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current)
    || ts.isAsExpression(current)
    || ts.isTypeAssertionExpression(current)
    || ts.isNonNullExpression(current)
    || ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function resolveString(
  input: ts.Expression | undefined,
  scope: Scope,
  seen = new Set<Binding>(),
): string {
  if (!input) return '';
  const expression = unwrapExpression(input);
  if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return '';
    if (binding.kind === 'callable') return binding.name;
    if (binding.kind !== 'alias') return '';
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return resolveString(binding.expression, binding.scope, nextSeen);
  }
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = resolveString(expression.left, scope, seen);
    const right = resolveString(expression.right, scope, seen);
    return left && right ? `${left}${right}` : '';
  }
  if (ts.isTemplateExpression(expression)) {
    let value = expression.head.text;
    for (const span of expression.templateSpans) {
      const resolved = resolveString(span.expression, scope, seen);
      if (!resolved) return '';
      value += resolved + span.literal.text;
    }
    return value;
  }
  if (ts.isConditionalExpression(expression)) {
    const whenTrue = resolveString(expression.whenTrue, scope, seen);
    const whenFalse = resolveString(expression.whenFalse, scope, seen);
    return whenTrue && whenTrue === whenFalse ? whenTrue : '';
  }
  return '';
}

function propertyName(expression: ts.Expression, scope: Scope): string {
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  if (ts.isElementAccessExpression(expression)) return resolveString(expression.argumentExpression, scope);
  return ts.isIdentifier(expression) ? expression.text : '';
}

function declaredPropertyName(name: ts.PropertyName, scope: Scope): string {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return ts.isComputedPropertyName(name) ? resolveString(name.expression, scope) : '';
}

function possibleStrings(
  input: ts.Expression,
  scope: Scope,
  seen = new Set<Binding>(),
): Set<string> {
  const resolved = resolveString(input, scope, seen);
  if (resolved) return new Set([resolved]);
  const expression = unwrapExpression(input);
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding) || binding.kind !== 'alias') return new Set();
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return possibleStrings(binding.expression, binding.scope, nextSeen);
  }
  if (ts.isConditionalExpression(expression)) {
    return new Set([
      ...possibleStrings(expression.whenTrue, scope, seen),
      ...possibleStrings(expression.whenFalse, scope, seen),
    ]);
  }
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const values = new Set<string>();
    for (const left of possibleStrings(expression.left, scope, seen)) {
      for (const right of possibleStrings(expression.right, scope, seen)) values.add(`${left}${right}`);
    }
    return values;
  }
  return new Set();
}

function possibleDeclaredPropertyNames(name: ts.PropertyName, scope: Scope): Set<string> {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return new Set([name.text]);
  return ts.isComputedPropertyName(name) ? possibleStrings(name.expression, scope) : new Set();
}

function expressionPath(
  input: ts.Expression,
  scope: Scope,
  seen = new Set<Binding>(),
): string {
  const expression = unwrapExpression(input);
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return expression.text;
    if (binding.kind === 'alias') {
      const nextSeen = new Set(seen);
      nextSeen.add(binding);
      return expressionPath(binding.expression, binding.scope, nextSeen);
    }
    if (binding.kind === 'callable') {
      return binding.owner ? `${binding.owner}.${binding.name}` : binding.name;
    }
    return expression.text;
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const owner = expressionPath(expression.expression, scope, seen);
    const name = propertyName(expression, scope);
    return owner && name ? `${owner}.${name}` : name;
  }
  return '';
}

function callableOwnerPath(input: ts.Expression, scope: Scope, seen = new Set<Binding>()): string {
  const owner = expressionPath(input, scope, seen);
  const root = owner.split('.')[0];
  return (root === 'Function' || root === 'Object' || root === 'Reflect') && lookupBinding(scope, root)
    ? `local:${owner}`
    : owner;
}

function historicalCallablePath(input: ts.Expression, scope: Scope): readonly CallableResolution[] {
  const key = expressionPath(input, scope);
  let cursor: Scope | undefined = scope;
  while (cursor) {
    const candidates = cursor.callablePaths.get(key);
    if (candidates) return candidates;
    cursor = cursor.parent;
  }
  return [];
}

function resolveCallable(
  input: ts.Expression,
  scope: Scope,
  seen = new Set<Binding>(),
): CallableResolution {
  const expression = unwrapExpression(input);
  if (ts.isConditionalExpression(expression)) {
    const whenTrue = resolveCallable(expression.whenTrue, scope, seen);
    return whenTrue.name ? whenTrue : resolveCallable(expression.whenFalse, scope, seen);
  }
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.CommaToken) {
    return resolveCallable(expression.right, scope, seen);
  }
  if (ts.isBinaryExpression(expression) && isAssignmentOperator(expression.operatorToken.kind)) {
    const right = resolveCallable(expression.right, scope, seen);
    return right.name ? right : resolveCallable(expression.left, scope, seen);
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const historical = historicalCallablePath(expression, scope)[0];
    if (historical) return historical;
    let name = propertyName(expression, scope);
    if (!name && ts.isElementAccessExpression(expression) && expression.argumentExpression) {
      const possibilities = [...possibleStrings(expression.argumentExpression, scope)];
      name = possibilities.find((candidate) => (
        FORBIDDEN_CALLS.has(candidate)
        || EVENT_CONSTRUCTORS.has(candidate)
        || ACTION_CALLS.has(candidate)
        || DOM_MUTATION_METHODS.has(candidate)
        || candidate === 'dispatchEvent'
      )) ?? possibilities[0] ?? '';
    }
    const aliasedProperty = plainPropertyInitializer(expression.expression, name, scope);
    if (aliasedProperty) {
      const resolved = resolveCallable(aliasedProperty.expression, aliasedProperty.scope, seen);
      if (resolved.name) return resolved;
    }
    return {
      name,
      owner: callableOwnerPath(expression.expression, scope, seen),
      receiver: { expression: expression.expression, scope },
      boundArguments: [],
      localPlainOwner: isProvenPlainValue(expression.expression, scope),
    };
  }
  if (ts.isCallExpression(expression)) {
    const invoked = unwrapExpression(expression.expression);
    if (ts.isPropertyAccessExpression(invoked) || ts.isElementAccessExpression(invoked)) {
      if (propertyName(invoked, scope) === 'bind') {
        const bound = resolveCallable(invoked.expression, scope, seen);
        const bindArguments = [...expression.arguments].map((argument) => ({ expression: argument, scope }));
        if (
          (bound.name === 'call' || bound.name === 'apply')
          && bound.owner === 'Function.prototype'
          && bindArguments[0]
        ) {
          const target = resolveCallable(bindArguments[0].expression, bindArguments[0].scope, seen);
          return {
            ...target,
            boundArguments: [...target.boundArguments, ...bindArguments.slice(1)],
            forwardingMode: bound.name,
          };
        }
        return {
          ...bound,
          boundArguments: [...bound.boundArguments, ...bindArguments.slice(1)],
          receiver: bindArguments[0] ?? bound.receiver,
        };
      }
    }
    const invocation = resolveInvocation(expression, scope);
    if (invocation.name === 'get' && invocation.owner === 'Reflect' && invocation.arguments[0] && invocation.arguments[1]) {
      const target = invocation.arguments[0];
      const name = resolveString(invocation.arguments[1].expression, invocation.arguments[1].scope);
      if (name) return resolveCallable(memberExpression(target.expression, name), target.scope, seen);
    }
    if (invocation.name === 'bind' && invocation.receiver && invocation.arguments[0]) {
      const target = resolveCallable(invocation.receiver.expression, invocation.receiver.scope, seen);
      return {
        ...target,
        boundArguments: [...target.boundArguments, ...invocation.arguments.slice(1)],
        receiver: invocation.arguments[0],
      };
    }
    return { name: '', owner: '', boundArguments: [] };
  }
  if (!ts.isIdentifier(expression)) return { name: '', owner: '', boundArguments: [] };
  const binding = lookupBinding(scope, expression.text);
  if (!binding) return { name: expression.text, owner: '', boundArguments: [] };
  if (seen.has(binding)) return { name: '', owner: '', boundArguments: [] };
  if (binding.kind === 'callable') return { name: binding.name, owner: binding.owner, boundArguments: [] };
  if (binding.kind !== 'alias') return { name: '', owner: '', boundArguments: [] };
  const nextSeen = new Set(seen);
  nextSeen.add(binding);
  return resolveCallable(binding.expression, binding.scope, nextSeen);
}

interface ResolvedExpression {
  readonly expression: ts.Expression;
  readonly scope: Scope;
}

function resolvePlainObject(
  input: ts.Expression,
  scope: Scope,
  seen = new Set<Binding>(),
): { readonly object: ts.ObjectLiteralExpression; readonly scope: Scope } | undefined {
  const expression = unwrapExpression(input);
  if (ts.isObjectLiteralExpression(expression)) return { object: expression, scope };
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return undefined;
    if (binding.kind === 'plain' && ts.isObjectLiteralExpression(binding.initializer)) {
      return { object: binding.initializer, scope: binding.scope };
    }
    if (binding.kind !== 'alias') return undefined;
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return resolvePlainObject(binding.expression, binding.scope, nextSeen);
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const nested = plainPropertyInitializer(expression.expression, propertyName(expression, scope), scope, seen);
    return nested ? resolvePlainObject(nested.expression, nested.scope, seen) : undefined;
  }
  return undefined;
}

function plainPropertyInitializer(
  owner: ts.Expression,
  name: string,
  scope: Scope,
  seen = new Set<Binding>(),
): ResolvedExpression | undefined {
  const resolved = resolvePlainObject(owner, scope, seen);
  if (!resolved) {
    const expression = unwrapExpression(owner);
    let array: ts.ArrayLiteralExpression | undefined;
    let arrayScope = scope;
    if (ts.isArrayLiteralExpression(expression)) {
      array = expression;
    } else if (ts.isIdentifier(expression)) {
      const binding = lookupBinding(scope, expression.text);
      if (binding?.kind === 'plain' && ts.isArrayLiteralExpression(binding.initializer)) {
        array = binding.initializer;
        arrayScope = binding.scope;
      }
    }
    if (!array || !/^\d+$/u.test(name)) return undefined;
    const element = array.elements[Number(name)];
    return element && ts.isExpression(element) && !ts.isSpreadElement(element)
      ? { expression: element, scope: arrayScope }
      : undefined;
  }
  for (const property of [...resolved.object.properties].reverse()) {
    if (ts.isSpreadAssignment(property)) {
      const nested = plainPropertyInitializer(property.expression, name, resolved.scope, seen);
      if (nested) return nested;
      continue;
    }
    if (ts.isPropertyAssignment(property) && declaredPropertyName(property.name, resolved.scope) === name) {
      return { expression: property.initializer, scope: resolved.scope };
    }
    if (ts.isShorthandPropertyAssignment(property) && property.name.text === name) {
      return { expression: property.name, scope: resolved.scope };
    }
  }
  return undefined;
}

function resolveFunction(
  input: ts.Expression | undefined,
  scope: Scope,
  seen = new Set<Binding>(),
): ResolvedFunction | undefined {
  if (!input) return undefined;
  const expression = unwrapExpression(input);
  if (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)) return { node: expression, scope };
  if (!ts.isIdentifier(expression)) return undefined;
  const binding = lookupBinding(scope, expression.text);
  if (!binding || seen.has(binding)) return undefined;
  if (binding.kind === 'function') return { node: binding.node, scope: binding.scope };
  if (binding.kind !== 'alias') return undefined;
  const nextSeen = new Set(seen);
  nextSeen.add(binding);
  return resolveFunction(binding.expression, binding.scope, nextSeen);
}

function resolveFunctionCandidates(
  input: ts.Expression | undefined,
  scope: Scope,
  seen = new Set<Binding>(),
): ResolvedFunction[] {
  if (!input) return [];
  const expression = unwrapExpression(input);
  if (ts.isConditionalExpression(expression)) {
    return [
      ...resolveFunctionCandidates(expression.whenTrue, scope, seen),
      ...resolveFunctionCandidates(expression.whenFalse, scope, seen),
    ];
  }
  if (ts.isBinaryExpression(expression)) {
    if (expression.operatorToken.kind === ts.SyntaxKind.CommaToken || isAssignmentOperator(expression.operatorToken.kind)) {
      return resolveFunctionCandidates(expression.right, scope, seen);
    }
  }
  if (ts.isCallExpression(expression)) {
    const invoked = unwrapExpression(expression.expression);
    if (
      (ts.isPropertyAccessExpression(invoked) || ts.isElementAccessExpression(invoked))
      && propertyName(invoked, scope) === 'bind'
    ) return resolveFunctionCandidates(invoked.expression, scope, seen);
  }
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return [];
    if (binding.kind === 'function') return [{ node: binding.node, scope: binding.scope }];
    if (binding.kind === 'alias') {
      const nextSeen = new Set(seen);
      nextSeen.add(binding);
      return resolveFunctionCandidates(binding.expression, binding.scope, nextSeen);
    }
  }
  const resolved = resolveFunction(expression, scope, seen);
  return resolved ? [resolved] : [];
}

function memberExpression(owner: ts.Expression, name: string): ts.Expression {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(name)
    ? ts.factory.createPropertyAccessExpression(owner, name)
    : ts.factory.createElementAccessExpression(owner, ts.factory.createStringLiteral(name));
}

function isPlaywrightLocatorExpression(input: ts.Expression, scope: Scope, seen = new Set<Binding>()): boolean {
  const expression = unwrapExpression(input);
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return false;
    if (binding.kind === 'playwright-locator') return true;
    if (binding.kind !== 'alias') return false;
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return isPlaywrightLocatorExpression(binding.expression, binding.scope, nextSeen);
  }
  if (!ts.isCallExpression(expression)) return false;
  const invoked = unwrapExpression(expression.expression);
  if (!ts.isPropertyAccessExpression(invoked) && !ts.isElementAccessExpression(invoked)) return false;
  const name = propertyName(invoked, scope);
  const owner = expressionPath(invoked.expression, scope);
  if (owner === 'page' && (name === 'locator' || name.startsWith('getBy'))) return true;
  return ['and', 'filter', 'first', 'last', 'locator', 'nth', 'or'].includes(name)
    && isPlaywrightLocatorExpression(invoked.expression, scope, seen);
}

function bindingForInitializer(
  initializer: ts.Expression,
  scope: Scope,
  type?: ts.TypeNode,
): Binding {
  if (type && /\bLocator\b/u.test(type.getText())) return { kind: 'playwright-locator' };
  const expression = unwrapExpression(initializer);
  if (ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)) {
    return { kind: 'function', node: expression, scope };
  }
  if (ts.isClassExpression(expression)) {
    const eventBase = eventBaseForClass(expression, scope);
    return eventBase
      ? { kind: 'callable', name: eventBase, owner: 'event-subclass' }
      : { kind: 'unknown' };
  }
  if (ts.isObjectLiteralExpression(expression) || ts.isArrayLiteralExpression(expression)) {
    return { kind: 'plain', initializer: expression, scope, forbiddenOptions: new Set() };
  }
  if (isPlaywrightLocatorExpression(expression, scope)) return { kind: 'playwright-locator' };
  return { kind: 'alias', expression, scope };
}

function eventBaseForClass(
  node: ts.ClassDeclaration | ts.ClassExpression,
  scope: Scope,
): string {
  const clause = node.heritageClauses?.find((item) => item.token === ts.SyntaxKind.ExtendsKeyword);
  const base = clause?.types[0]?.expression;
  if (!base) return '';
  const callable = resolveCallable(base, scope);
  return EVENT_CONSTRUCTORS.has(callable.name) ? callable.name : '';
}

function recordBindingHistory(name: string, declarationScope: Scope, binding: Binding): void {
  const callable = binding.kind === 'alias'
    ? resolveCallable(binding.expression, binding.scope)
    : binding.kind === 'callable'
      ? { name: binding.name, owner: binding.owner, boundArguments: [] }
      : undefined;
  if (callable?.name) {
    const history = declarationScope.callableHistory.get(name) ?? [];
    const key = `${callable.owner}.${callable.name}:${callable.forwardingMode ?? ''}`;
    if (!history.some((candidate) => `${candidate.owner}.${candidate.name}:${candidate.forwardingMode ?? ''}` === key)) {
      history.push(callable);
      declarationScope.callableHistory.set(name, history);
    }
  }
  const provenPlain = binding.kind === 'plain'
    || (binding.kind === 'alias' && isProvenPlainValue(binding.expression, binding.scope));
  if (!provenPlain) declarationScope.nonPlainHistory.add(name);
}

function bindPattern(
  pattern: ts.BindingName,
  scope: Scope,
  source: ts.Expression | undefined,
  type?: ts.TypeNode,
): void {
  if (ts.isIdentifier(pattern)) {
    const binding: Binding = source
      ? bindingForInitializer(source, scope, type)
      : type && /\bLocator\b/u.test(type.getText())
        ? { kind: 'playwright-locator' }
        : { kind: 'unknown' };
    scope.bindings.set(pattern.text, binding);
    recordBindingHistory(pattern.text, scope, binding);
    return;
  }
  if (ts.isObjectBindingPattern(pattern)) {
    for (const element of pattern.elements) {
      if (element.dotDotDotToken) {
        bindPattern(element.name, scope, undefined);
        continue;
      }
      const key = element.propertyName
        ? declaredPropertyName(element.propertyName, scope)
        : ts.isIdentifier(element.name) ? element.name.text : '';
      const childSource = source && key ? memberExpression(source, key) : undefined;
      if (ts.isIdentifier(element.name) && !childSource && key) {
        const binding: Binding = { kind: 'callable', name: key, owner: '' };
        scope.bindings.set(element.name.text, binding);
        recordBindingHistory(element.name.text, scope, binding);
      } else {
        bindPattern(element.name, scope, childSource);
      }
      if (element.initializer && ts.isIdentifier(element.name)) {
        const fallback = bindingForInitializer(element.initializer, scope);
        recordBindingHistory(element.name.text, scope, fallback);
        const current = scope.bindings.get(element.name.text);
        scope.bindings.set(element.name.text, current ? mergeAssignedBinding(current, fallback) : fallback);
      }
    }
    return;
  }
  const arraySource = source && ts.isArrayLiteralExpression(unwrapExpression(source))
    ? unwrapExpression(source) as ts.ArrayLiteralExpression
    : undefined;
  pattern.elements.forEach((element, index) => {
    if (ts.isOmittedExpression(element)) return;
    const childSource = arraySource?.elements[index];
    bindPattern(element.name, scope, childSource && ts.isExpression(childSource) ? childSource : undefined);
    if (element.initializer && ts.isIdentifier(element.name)) {
      const fallback = bindingForInitializer(element.initializer, scope);
      recordBindingHistory(element.name.text, scope, fallback);
      const current = scope.bindings.get(element.name.text);
      scope.bindings.set(element.name.text, current ? mergeAssignedBinding(current, fallback) : fallback);
    }
  });
}

function predeclare(statements: ts.NodeArray<ts.Statement>, scope: Scope): void {
  const predeclareBinding = (name: ts.BindingName): void => {
    if (ts.isIdentifier(name)) {
      scope.bindings.set(name.text, { kind: 'unknown' });
      return;
    }
    for (const element of name.elements) {
      if (!ts.isOmittedExpression(element)) predeclareBinding(element.name);
    }
  };
  for (const statement of statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      scope.bindings.set(statement.name.text, { kind: 'function', node: statement, scope });
    }
    if (ts.isClassDeclaration(statement) && statement.name) {
      const eventBase = eventBaseForClass(statement, scope);
      scope.bindings.set(statement.name.text, eventBase
        ? { kind: 'callable', name: eventBase, owner: 'event-subclass' }
        : { kind: 'unknown' });
    }
    if (ts.isVariableStatement(statement)) {
      const targetScope = statement.declarationList.flags & ts.NodeFlags.BlockScoped
        ? scope
        : nearestVarScope(scope);
      statement.declarationList.declarations.forEach((declaration) => {
        if (targetScope === scope) predeclareBinding(declaration.name);
        else {
          const declareInTarget = (name: ts.BindingName): void => {
            if (ts.isIdentifier(name)) targetScope.bindings.set(name.text, { kind: 'unknown' });
            else name.elements.forEach((element) => {
              if (!ts.isOmittedExpression(element)) declareInTarget(element.name);
            });
          };
          declareInTarget(declaration.name);
        }
      });
    }
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
    const clause = statement.importClause;
    if (clause.name) scope.bindings.set(clause.name.text, { kind: 'unknown' });
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const specifier of clause.namedBindings.elements) {
        const imported = specifier.propertyName?.text ?? specifier.name.text;
        scope.bindings.set(specifier.name.text, { kind: 'callable', name: imported, owner: 'import' });
      }
    }
  }
}

type NodeVisitor = (node: ts.Node, scope: Scope) => void;

function predeclareFunctionVars(node: ts.Node, scope: Scope): void {
  const declare = (name: ts.BindingName): void => {
    if (ts.isIdentifier(name)) {
      if (!scope.bindings.has(name.text)) scope.bindings.set(name.text, { kind: 'unknown' });
      return;
    }
    name.elements.forEach((element) => {
      if (!ts.isOmittedExpression(element)) declare(element.name);
    });
  };
  const visit = (current: ts.Node): void => {
    if (current !== node && (
      ts.isFunctionDeclaration(current)
      || ts.isFunctionExpression(current)
      || ts.isArrowFunction(current)
      || ts.isMethodDeclaration(current)
      || ts.isConstructorDeclaration(current)
      || ts.isGetAccessorDeclaration(current)
      || ts.isSetAccessorDeclaration(current)
      || ts.isClassDeclaration(current)
      || ts.isClassExpression(current)
    )) return;
    if (
      ts.isVariableDeclaration(current)
      && ts.isVariableDeclarationList(current.parent)
      && !(current.parent.flags & ts.NodeFlags.BlockScoped)
    ) declare(current.name);
    ts.forEachChild(current, visit);
  };
  visit(node);
}

function traverseFunction(resolved: ResolvedFunction, visitor: NodeVisitor): void {
  const functionScope = createScope(resolved.scope, true);
  if ('name' in resolved.node && resolved.node.name && ts.isIdentifier(resolved.node.name)) {
    functionScope.bindings.set(resolved.node.name.text, { kind: 'function', node: resolved.node, scope: resolved.scope });
  }
  for (const parameter of resolved.node.parameters) {
    bindPattern(parameter.name, functionScope, parameter.initializer, parameter.type);
    if (parameter.initializer) traverseNode(parameter.initializer, functionScope, visitor);
  }
  if (resolved.node.body) predeclareFunctionVars(resolved.node.body, functionScope);
  if (resolved.node.body) traverseNode(resolved.node.body, functionScope, visitor);
}

function traverseNode(node: ts.Node, scope: Scope, visitor: NodeVisitor): void {
  if (ts.isSourceFile(node)) {
    predeclare(node.statements, scope);
    node.statements.forEach((statement) => traverseNode(statement, scope, visitor));
    return;
  }
  if (ts.isBlock(node)) {
    const blockScope = createScope(scope);
    predeclare(node.statements, blockScope);
    node.statements.forEach((statement) => traverseNode(statement, blockScope, visitor));
    return;
  }
  if (ts.isCatchClause(node)) {
    const catchScope = createScope(scope);
    if (node.variableDeclaration) bindPattern(node.variableDeclaration.name, catchScope, undefined);
    traverseNode(node.block, catchScope, visitor);
    return;
  }
  if (ts.isClassDeclaration(node) && node.name) {
    const eventBase = eventBaseForClass(node, scope);
    if (eventBase) {
      const binding: Binding = { kind: 'callable', name: eventBase, owner: 'event-subclass' };
      scope.bindings.set(node.name.text, binding);
      recordBindingHistory(node.name.text, scope, binding);
    }
  }
  if (
    ts.isFunctionDeclaration(node)
    || ts.isFunctionExpression(node)
    || ts.isArrowFunction(node)
    || ts.isMethodDeclaration(node)
    || ts.isGetAccessorDeclaration(node)
    || ts.isSetAccessorDeclaration(node)
    || ts.isConstructorDeclaration(node)
  ) {
    visitor(node, scope);
    traverseFunction({ node, scope }, visitor);
    return;
  }
  if (ts.isForOfStatement(node) || ts.isForInStatement(node)) {
    const loopScope = createScope(scope);
    if (ts.isVariableDeclarationList(node.initializer)) {
      const declarationScope = node.initializer.flags & ts.NodeFlags.BlockScoped ? loopScope : nearestVarScope(scope);
      for (const declaration of node.initializer.declarations) {
        bindPattern(declaration.name, declarationScope, declaration.initializer, declaration.type);
        if (declaration.initializer) traverseNode(declaration.initializer, declarationScope, visitor);
      }
    } else {
      traverseNode(node.initializer, loopScope, visitor);
    }
    traverseNode(node.expression, loopScope, visitor);
    traverseNode(node.statement, loopScope, visitor);
    return;
  }
  if (ts.isForStatement(node)) {
    const loopScope = createScope(scope);
    if (node.initializer && ts.isVariableDeclarationList(node.initializer)) {
      const declarationScope = node.initializer.flags & ts.NodeFlags.BlockScoped ? loopScope : nearestVarScope(scope);
      for (const declaration of node.initializer.declarations) {
        bindPattern(declaration.name, declarationScope, declaration.initializer, declaration.type);
        if (declaration.initializer) traverseNode(declaration.initializer, declarationScope, visitor);
      }
    } else if (node.initializer) {
      traverseNode(node.initializer, loopScope, visitor);
    }
    if (node.condition) traverseNode(node.condition, loopScope, visitor);
    if (node.incrementor) traverseNode(node.incrementor, loopScope, visitor);
    traverseNode(node.statement, loopScope, visitor);
    return;
  }
  if (ts.isVariableDeclaration(node)) {
    const declarationScope = ts.isVariableDeclarationList(node.parent)
      && !(node.parent.flags & ts.NodeFlags.BlockScoped)
      ? nearestVarScope(scope)
      : scope;
    bindPattern(node.name, declarationScope, node.initializer, node.type);
    if (node.initializer) traverseNode(node.initializer, declarationScope, visitor);
    return;
  }
  visitor(node, scope);
  ts.forEachChild(node, (child) => traverseNode(child, scope, visitor));
}

function plainBindingForExpression(
  input: ts.Expression,
  scope: Scope,
  seen = new Set<Binding>(),
): Extract<Binding, { kind: 'plain' }> | undefined {
  const expression = unwrapExpression(input);
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return undefined;
    if (binding.kind === 'plain') return binding;
    if (binding.kind !== 'alias') return undefined;
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return plainBindingForExpression(binding.expression, binding.scope, nextSeen);
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const nested = plainPropertyInitializer(expression.expression, propertyName(expression, scope), scope, seen);
    return nested ? plainBindingForExpression(nested.expression, nested.scope, seen) : undefined;
  }
  return undefined;
}

function isProvenPlainValue(
  input: ts.Expression,
  scope: Scope,
  seen = new Set<Binding>(),
): boolean {
  const expression = unwrapExpression(input);
  if (ts.isObjectLiteralExpression(expression) || ts.isArrayLiteralExpression(expression)) return true;
  if (ts.isIdentifier(expression)) {
    const ownerScope = bindingScope(scope, expression.text);
    const binding = ownerScope?.bindings.get(expression.text);
    if (!ownerScope || !binding || seen.has(binding)) return false;
    if (ownerScope.nonPlainHistory.has(expression.text)) return false;
    if (binding.kind === 'plain') return true;
    if (binding.kind !== 'alias') return false;
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return isProvenPlainValue(binding.expression, binding.scope, nextSeen);
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const key = expressionPath(expression, scope);
    let cursor: Scope | undefined = scope;
    let provenPlain = false;
    while (cursor) {
      if (cursor.nonPlainPaths.has(key)) return false;
      if (cursor.plainPaths.has(key)) provenPlain = true;
      cursor = cursor.parent;
    }
    if (provenPlain) return true;
    const nested = plainPropertyInitializer(expression.expression, propertyName(expression, scope), scope, seen);
    return !!nested && isProvenPlainValue(nested.expression, nested.scope, seen);
  }
  return false;
}

function isAllowedClickReceiver(input: ts.Expression | undefined, scope: Scope): boolean {
  if (!input) return false;
  return expressionPath(input, scope) === 'page.mouse'
    || isPlaywrightLocatorExpression(input, scope)
    || isProvenPlainValue(input, scope);
}

function isAllowedCallableOwner(callable: CallableResolution): boolean {
  if (callable.localPlainOwner) return true;
  if (callable.owner === 'page.mouse') return true;
  return !!callable.receiver && (
    isPlaywrightLocatorExpression(callable.receiver.expression, callable.receiver.scope)
    || isProvenPlainValue(callable.receiver.expression, callable.receiver.scope)
  );
}

function isLocalPlainCallableOwner(callable: CallableResolution): boolean {
  return !!callable.localPlainOwner || !!callable.receiver
    && isProvenPlainValue(callable.receiver.expression, callable.receiver.scope);
}

function expandArgumentArray(
  input: ResolvedExpression | undefined,
  seen = new Set<Binding>(),
): ResolvedExpression[] | undefined {
  if (!input) return undefined;
  const expression = unwrapExpression(input.expression);
  if (ts.isArrayLiteralExpression(expression)) {
    const expanded: ResolvedExpression[] = [];
    for (const element of expression.elements) {
      if (ts.isOmittedExpression(element)) continue;
      if (ts.isSpreadElement(element)) {
        const nested = expandArgumentArray({ expression: element.expression, scope: input.scope }, seen);
        if (!nested) return undefined;
        expanded.push(...nested);
      } else {
        expanded.push({ expression: element, scope: input.scope });
      }
    }
    return expanded;
  }
  if (ts.isObjectLiteralExpression(expression)) {
    const lengthValue = plainPropertyInitializer(expression, 'length', input.scope, seen);
    const lengthText = lengthValue ? resolveString(lengthValue.expression, lengthValue.scope) : '';
    const length = Number(lengthText);
    if (!Number.isSafeInteger(length) || length < 0 || length > 100) return undefined;
    const expanded: ResolvedExpression[] = [];
    for (let index = 0; index < length; index += 1) {
      const value = plainPropertyInitializer(expression, String(index), input.scope, seen);
      if (!value) return undefined;
      expanded.push(value);
    }
    return expanded;
  }
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(input.scope, expression.text);
    if (!binding || seen.has(binding)) return undefined;
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    if (binding.kind === 'plain') {
      return expandArgumentArray({ expression: binding.initializer, scope: binding.scope }, nextSeen);
    }
    if (binding.kind === 'alias') {
      return expandArgumentArray({ expression: binding.expression, scope: binding.scope }, nextSeen);
    }
    return undefined;
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const nested = plainPropertyInitializer(
      expression.expression,
      propertyName(expression, input.scope),
      input.scope,
      seen,
    );
    return nested ? expandArgumentArray(nested, seen) : undefined;
  }
  return undefined;
}

function expandCallArguments(
  args: ts.NodeArray<ts.Expression>,
  scope: Scope,
): ResolvedExpression[] {
  const expanded: ResolvedExpression[] = [];
  for (const argument of args) {
    if (ts.isSpreadElement(argument)) {
      const nested = expandArgumentArray({ expression: argument.expression, scope });
      expanded.push(...(nested ?? [{ expression: argument.expression, scope }]));
    } else {
      expanded.push({ expression: argument, scope });
    }
  }
  return expanded;
}

interface InvocationResolution extends CallableResolution {
  readonly arguments: readonly ResolvedExpression[];
}

function normalizeInvocationResolution(
  resolution: InvocationResolution,
  depth = 0,
): InvocationResolution {
  if (depth >= 8) return resolution;
  if (resolution.forwardingMode) {
    const args = [...resolution.boundArguments, ...resolution.arguments];
    return normalizeInvocationResolution({
      ...resolution,
      arguments: resolution.forwardingMode === 'apply' ? expandArgumentArray(args[1]) ?? [] : args.slice(1),
      boundArguments: [],
      forwardingMode: undefined,
      receiver: args[0],
    }, depth + 1);
  }
  if (
    (resolution.name === 'call' || resolution.name === 'apply')
    && resolution.owner === 'Function.prototype'
    && resolution.receiver
  ) {
    const target = resolveCallable(resolution.receiver.expression, resolution.receiver.scope);
    const forwarded = resolution.name === 'apply'
      ? expandArgumentArray(resolution.arguments[1]) ?? []
      : resolution.arguments.slice(1);
    return normalizeInvocationResolution({
      ...target,
      arguments: [...target.boundArguments, ...forwarded],
      boundArguments: [],
      receiver: resolution.arguments[0],
    }, depth + 1);
  }
  if (resolution.name === 'apply' && resolution.owner === 'Reflect' && resolution.arguments[0]) {
    const [callable, receiver, argumentArray] = resolution.arguments;
    const target = resolveCallable(callable.expression, callable.scope);
    return normalizeInvocationResolution({
      ...target,
      arguments: [...target.boundArguments, ...(expandArgumentArray(argumentArray) ?? [])],
      boundArguments: [],
      receiver,
    }, depth + 1);
  }
  if (
    (resolution.name === 'call' || resolution.name === 'apply')
    && resolution.receiver
    && !resolution.owner.startsWith('local:')
  ) {
    const target = resolveCallable(resolution.receiver.expression, resolution.receiver.scope);
    if (target.name && (target.name !== resolution.name || target.owner !== resolution.owner)) {
      const forwarded = resolution.name === 'apply'
        ? expandArgumentArray(resolution.arguments[1]) ?? []
        : resolution.arguments.slice(1);
      return normalizeInvocationResolution({
        ...target,
        arguments: [...target.boundArguments, ...forwarded],
        boundArguments: [],
        receiver: resolution.arguments[0],
      }, depth + 1);
    }
  }
  return resolution;
}

function resolveInvocation(call: ts.CallExpression, scope: Scope): InvocationResolution {
  const callee = resolveCallable(call.expression, scope);
  const args = [...callee.boundArguments, ...expandCallArguments(call.arguments, scope)];
  if (callee.forwardingMode) {
    return normalizeInvocationResolution({
      ...callee,
      arguments: callee.forwardingMode === 'apply' ? expandArgumentArray(args[1]) ?? [] : args.slice(1),
      boundArguments: [],
      receiver: args[0],
      forwardingMode: undefined,
    });
  }
  if (callee.name === 'apply' && callee.owner === 'Reflect' && args[0]) {
    const target = resolveCallable(args[0].expression, args[0].scope);
    return normalizeInvocationResolution({
      ...target,
      arguments: [...target.boundArguments, ...(expandArgumentArray(args[2]) ?? [])],
      boundArguments: [],
      receiver: args[1],
    });
  }
  const expression = unwrapExpression(call.expression);
  if (
    (callee.name === 'call' || callee.name === 'apply')
    && (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression))
  ) {
    const target = resolveCallable(expression.expression, scope);
    if (
      (target.name === 'call' || target.name === 'apply')
      && target.owner === 'Function.prototype'
      && args[0]
    ) {
      const forwardedTarget = resolveCallable(args[0].expression, args[0].scope);
      const forwardedArguments = target.name === 'apply'
        ? expandArgumentArray(args[2]) ?? []
        : args.slice(2);
      return normalizeInvocationResolution({
        ...forwardedTarget,
        arguments: [...forwardedTarget.boundArguments, ...forwardedArguments],
        boundArguments: [],
        receiver: args[1],
      });
    }
    return normalizeInvocationResolution({
      ...target,
      arguments: [
        ...target.boundArguments,
        ...(callee.name === 'apply' ? expandArgumentArray(args[1]) ?? [] : args.slice(1)),
      ],
      boundArguments: [],
      receiver: args[0],
    });
  }
  return normalizeInvocationResolution({ ...callee, arguments: args, boundArguments: [] });
}

function historicalCallables(input: ts.Expression, scope: Scope): readonly CallableResolution[] {
  const expression = unwrapExpression(input);
  if (ts.isIdentifier(expression)) {
    return bindingScope(scope, expression.text)?.callableHistory.get(expression.text) ?? [];
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    return historicalCallablePath(expression, scope);
  }
  return [];
}

function resolveInvocationCandidates(call: ts.CallExpression, scope: Scope): InvocationResolution[] {
  const direct = resolveInvocation(call, scope);
  const rawArguments = expandCallArguments(call.arguments, scope);
  const candidates = [direct];
  for (const callable of historicalCallables(call.expression, scope)) {
    const candidate = normalizeInvocationResolution(callable.forwardingMode
      ? { ...callable, arguments: rawArguments }
      : {
          ...callable,
          arguments: [...callable.boundArguments, ...rawArguments],
          boundArguments: [],
        });
    if (!candidates.some((item) => (
      item.name === candidate.name
      && item.owner === candidate.owner
      && item.arguments.length === candidate.arguments.length
    ))) candidates.push(candidate);
  }
  return candidates;
}

function isAssignmentOperator(kind: ts.SyntaxKind): boolean {
  return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}

function evaluateMutatesDom(resolved: ResolvedFunction): boolean {
  let mutates = false;
  traverseFunction(resolved, (node, scope) => {
    if (mutates) return;
    if (ts.isBinaryExpression(node) && isAssignmentOperator(node.operatorToken.kind)) {
      recordAssignedCallableProperty(node, scope);
      recordAssignedPlainProperty(node, scope);
      updateAssignedBinding(node, scope);
      const left = unwrapExpression(node.left);
      if (
        (ts.isPropertyAccessExpression(left) || ts.isElementAccessExpression(left))
        && !isProvenPlainValue(left.expression, scope)
      ) mutates = true;
      return;
    }
    if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
      const operand = unwrapExpression(node.operand);
      if (
        (ts.isPropertyAccessExpression(operand) || ts.isElementAccessExpression(operand))
        && !isProvenPlainValue(operand.expression, scope)
      ) mutates = true;
      return;
    }
    if (ts.isDeleteExpression(node)) {
      const target = unwrapExpression(node.expression);
      if (
        (ts.isPropertyAccessExpression(target) || ts.isElementAccessExpression(target))
        && !isProvenPlainValue(target.expression, scope)
      ) mutates = true;
      return;
    }
    if (!ts.isCallExpression(node)) return;
    const target = resolveInvocation(node, scope);
    recordObjectCallableMutations(target);
    const receiver = target.receiver?.expression;
    if (
      DOM_MUTATION_METHODS.has(target.name)
      && !isAllowedClickReceiver(receiver, target.receiver?.scope ?? scope)
      && !isAllowedCallableOwner(target)
    ) {
      mutates = true;
      return;
    }
    if (
      (target.owner === 'Object' && OBJECT_TARGET_MUTATORS.has(target.name))
      || (target.owner === 'Reflect' && REFLECT_TARGET_MUTATORS.has(target.name))
    ) {
      const mutationTarget = target.arguments[0];
      if (mutationTarget && !isProvenPlainValue(mutationTarget.expression, mutationTarget.scope)) mutates = true;
    }
  });
  return mutates;
}

function forbiddenOptions(
  input: ts.Expression | undefined,
  scope: Scope,
  seen = new Set<Binding>(),
): Set<string> {
  const found = new Set<string>();
  if (!input) return found;
  const expression = unwrapExpression(input);
  const optionPath = expressionPath(expression, scope);
  let optionScope: Scope | undefined = scope;
  while (optionScope) {
    optionScope.optionPaths.get(optionPath)?.forEach((name) => found.add(name));
    optionScope = optionScope.parent;
  }
  if (ts.isIdentifier(expression)) {
    const binding = lookupBinding(scope, expression.text);
    if (!binding || seen.has(binding)) return found;
    if (binding.kind === 'plain') {
      binding.forbiddenOptions.forEach((name) => found.add(name));
      const nested = forbiddenOptions(binding.initializer, binding.scope, new Set([...seen, binding]));
      nested.forEach((name) => found.add(name));
    } else if (binding.kind === 'alias') {
      const nested = forbiddenOptions(binding.expression, binding.scope, new Set([...seen, binding]));
      nested.forEach((name) => found.add(name));
    }
    return found;
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const nested = plainPropertyInitializer(expression.expression, propertyName(expression, scope), scope, seen);
    if (nested) forbiddenOptions(nested.expression, nested.scope, seen).forEach((name) => found.add(name));
    return found;
  }
  if (ts.isArrayLiteralExpression(expression)) {
    for (const element of expression.elements) {
      if (ts.isOmittedExpression(element)) continue;
      forbiddenOptions(
        ts.isSpreadElement(element) ? element.expression : element,
        scope,
        seen,
      ).forEach((name) => found.add(name));
    }
    return found;
  }
  if (ts.isObjectLiteralExpression(expression)) {
    for (const property of expression.properties) {
      if (ts.isSpreadAssignment(property)) {
        forbiddenOptions(property.expression, scope, seen).forEach((name) => found.add(name));
        continue;
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        if (property.name.text === 'force' || property.name.text === 'trial') found.add(property.name.text);
        continue;
      }
      if (
        ts.isPropertyAssignment(property)
        || ts.isMethodDeclaration(property)
        || ts.isGetAccessorDeclaration(property)
        || ts.isSetAccessorDeclaration(property)
      ) {
        possibleDeclaredPropertyNames(property.name, scope).forEach((name) => {
          if (name === 'force' || name === 'trial') found.add(name);
        });
      }
    }
    return found;
  }
  if (ts.isConditionalExpression(expression)) {
    forbiddenOptions(expression.whenTrue, scope, seen).forEach((name) => found.add(name));
    forbiddenOptions(expression.whenFalse, scope, seen).forEach((name) => found.add(name));
  }
  if (ts.isCallExpression(expression)) {
    const invocation = resolveInvocation(expression, scope);
    if (invocation.name === 'assign' && invocation.owner === 'Object') {
      invocation.arguments.forEach((argument) => {
        forbiddenOptions(argument.expression, argument.scope, seen).forEach((name) => found.add(name));
      });
    }
  }
  return found;
}

function rootIdentifier(input: ts.Expression): ts.Identifier | undefined {
  let expression = unwrapExpression(input);
  while (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    expression = unwrapExpression(expression.expression);
  }
  return ts.isIdentifier(expression) ? expression : undefined;
}

function recordOptionPath(input: ts.Expression, scope: Scope, name: string): void {
  if (name !== 'force' && name !== 'trial') return;
  const key = expressionPath(input, scope);
  if (!key) return;
  const root = rootIdentifier(input);
  const ownerScope = root ? bindingScope(scope, root.text) ?? scope : scope;
  const options = ownerScope.optionPaths.get(key) ?? new Set<string>();
  options.add(name);
  ownerScope.optionPaths.set(key, options);
}

function markAssignedOption(node: ts.BinaryExpression, scope: Scope): void {
  if (!isAssignmentOperator(node.operatorToken.kind)) return;
  const left = unwrapExpression(node.left);
  if (!ts.isPropertyAccessExpression(left) && !ts.isElementAccessExpression(left)) return;
  const names = ts.isPropertyAccessExpression(left)
    ? new Set([left.name.text])
    : left.argumentExpression ? possibleStrings(left.argumentExpression, scope) : new Set<string>();
  names.forEach((name) => {
    if (name !== 'force' && name !== 'trial') return;
    plainBindingForExpression(left.expression, scope)?.forbiddenOptions.add(name);
    recordOptionPath(left.expression, scope, name);
  });
}

function recordAssignedCallableProperty(node: ts.BinaryExpression, scope: Scope): void {
  if (!isAssignmentOperator(node.operatorToken.kind)) return;
  const left = unwrapExpression(node.left);
  if (!ts.isPropertyAccessExpression(left) && !ts.isElementAccessExpression(left)) return;
  const callable = resolveCallable(node.right, scope);
  if (!callable.name) return;
  recordCallablePath(left, scope, callable);
}

function recordAssignedPlainProperty(node: ts.BinaryExpression, scope: Scope): void {
  if (!isAssignmentOperator(node.operatorToken.kind)) return;
  const left = unwrapExpression(node.left);
  if (!ts.isPropertyAccessExpression(left) && !ts.isElementAccessExpression(left)) return;
  const key = expressionPath(left, scope);
  if (!key) return;
  const root = rootIdentifier(left);
  const ownerScope = root ? bindingScope(scope, root.text) ?? scope : scope;
  if (isProvenPlainValue(node.right, scope)) ownerScope.plainPaths.add(key);
  else ownerScope.nonPlainPaths.add(key);
}

function recordCallablePath(
  member: ts.Expression,
  scope: Scope,
  callable: CallableResolution,
): void {
  const key = expressionPath(member, scope);
  if (!key) return;
  const root = rootIdentifier(member);
  const ownerScope = root ? bindingScope(scope, root.text) ?? scope : scope;
  const history = ownerScope.callablePaths.get(key) ?? [];
  if (!history.some((candidate) => candidate.name === callable.name && candidate.owner === callable.owner)) {
    history.push(callable);
    ownerScope.callablePaths.set(key, history);
  }
}

function recordObjectCallableMutations(target: InvocationResolution): void {
  const mutationTarget = target.arguments[0];
  if (!mutationTarget) return;
  if (target.name === 'assign' && target.owner === 'Object') {
    for (const source of target.arguments.slice(1)) {
      const resolved = resolvePlainObject(source.expression, source.scope);
      if (!resolved) continue;
      for (const property of resolved.object.properties) {
        let name = '';
        let value: ts.Expression | undefined;
        if (ts.isPropertyAssignment(property)) {
          name = declaredPropertyName(property.name, resolved.scope);
          value = property.initializer;
        } else if (ts.isShorthandPropertyAssignment(property)) {
          name = property.name.text;
          value = property.name;
        }
        if (!name || !value) continue;
        const callable = resolveCallable(value, resolved.scope);
        if (callable.name) {
          recordCallablePath(memberExpression(mutationTarget.expression, name), mutationTarget.scope, callable);
        }
      }
    }
  }
  if (
    target.name === 'defineProperty'
    && (target.owner === 'Object' || target.owner === 'Reflect')
    && target.arguments[1]
    && target.arguments[2]
  ) {
    const name = resolveString(target.arguments[1].expression, target.arguments[1].scope);
    const descriptor = target.arguments[2];
    const value = plainPropertyInitializer(descriptor.expression, 'value', descriptor.scope);
    if (name && value) {
      const callable = resolveCallable(value.expression, value.scope);
      if (callable.name) {
        recordCallablePath(memberExpression(mutationTarget.expression, name), mutationTarget.scope, callable);
      }
    }
  }
  if (target.name === 'defineProperties' && target.owner === 'Object' && target.arguments[1]) {
    const descriptors = target.arguments[1];
    const resolved = resolvePlainObject(descriptors.expression, descriptors.scope);
    if (resolved) {
      for (const property of resolved.object.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const name = declaredPropertyName(property.name, resolved.scope);
        const value = plainPropertyInitializer(property.initializer, 'value', resolved.scope);
        if (!name || !value) continue;
        const callable = resolveCallable(value.expression, value.scope);
        if (callable.name) {
          recordCallablePath(memberExpression(mutationTarget.expression, name), mutationTarget.scope, callable);
        }
      }
    }
  }
  if (
    target.name === 'set'
    && target.owner === 'Reflect'
    && target.arguments[1]
    && target.arguments[2]
  ) {
    const name = resolveString(target.arguments[1].expression, target.arguments[1].scope);
    const value = target.arguments[2];
    const callable = resolveCallable(value.expression, value.scope);
    if (name && callable.name) {
      recordCallablePath(memberExpression(mutationTarget.expression, name), mutationTarget.scope, callable);
    }
  }
}

function bindingRisk(binding: Binding): number {
  if (binding.kind === 'plain') {
    return binding.forbiddenOptions.size > 0
      || forbiddenOptions(binding.initializer, binding.scope).size > 0
      ? 2
      : 0;
  }
  if (binding.kind !== 'alias' && binding.kind !== 'callable') return 0;
  const callable = binding.kind === 'callable'
    ? { name: binding.name, owner: binding.owner }
    : resolveCallable(binding.expression, binding.scope);
  return FORBIDDEN_CALLS.has(callable.name)
    || EVENT_CONSTRUCTORS.has(callable.name)
    || DOM_MUTATION_METHODS.has(callable.name)
    || callable.name === 'click'
    || callable.name === 'dispatchEvent'
    ? 2
    : 0;
}

function mergeAssignedBinding(existing: Binding, next: Binding): Binding {
  if (existing.kind === 'plain' && next.kind === 'plain') {
    next.forbiddenOptions.forEach((name) => existing.forbiddenOptions.add(name));
    forbiddenOptions(next.initializer, next.scope).forEach((name) => existing.forbiddenOptions.add(name));
    return existing;
  }
  return bindingRisk(next) > bindingRisk(existing) ? next : existing;
}

function updateAssignedBinding(node: ts.BinaryExpression, scope: Scope): void {
  if (!isAssignmentOperator(node.operatorToken.kind)) return;
  const assign = (target: ts.Expression, source: ts.Expression): void => {
    const left = unwrapExpression(target);
    if (ts.isIdentifier(left)) {
      const targetScope = bindingScope(scope, left.text);
      if (!targetScope) return;
      const current = targetScope.bindings.get(left.text);
      const next = bindingForInitializer(source, scope);
      recordBindingHistory(left.text, targetScope, next);
      targetScope.bindings.set(left.text, current ? mergeAssignedBinding(current, next) : next);
      return;
    }
    if (ts.isObjectLiteralExpression(left)) {
      for (const property of left.properties) {
        if (ts.isShorthandPropertyAssignment(property)) {
          assign(property.name, memberExpression(source, property.name.text));
        } else if (ts.isPropertyAssignment(property)) {
          const name = declaredPropertyName(property.name, scope);
          if (name) assign(property.initializer, memberExpression(source, name));
        }
      }
      return;
    }
    if (ts.isArrayLiteralExpression(left)) {
      left.elements.forEach((element, index) => {
        if (ts.isExpression(element) && !ts.isOmittedExpression(element)) {
          assign(element, memberExpression(source, String(index)));
        }
      });
    }
  };
  assign(node.left, node.right);
}

function auditSource(source: string, filename: string): { violations: string[]; elementFromPointCalls: number } {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.ES2020, true);
  const rootScope = createScope();
  const found = new Set<string>();
  let elementFromPointCalls = 0;
  const add = (violation: string): void => { found.add(violation); };

  traverseNode(tree, rootScope, (node, scope) => {
    if (ts.isBinaryExpression(node)) {
      markAssignedOption(node, scope);
      recordAssignedCallableProperty(node, scope);
      recordAssignedPlainProperty(node, scope);
      updateAssignedBinding(node, scope);
    }

    if (ts.isNewExpression(node)) {
      const candidates = [resolveCallable(node.expression, scope), ...historicalCallables(node.expression, scope)];
      for (const callable of candidates) {
        if (EVENT_CONSTRUCTORS.has(callable.name)) add(`constructed:${callable.name}`);
      }
      return;
    }

    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const callable = resolveCallable(node, scope);
      const directCall = ts.isCallExpression(node.parent) && node.parent.expression === node;
      if (callable.name === 'dispatchEvent' && !directCall && !isAllowedCallableOwner(callable)) add('alias:dispatchEvent');
      if (callable.name === 'click' && !directCall && !isAllowedCallableOwner(callable)) add('dom-click-alias');
      return;
    }

    if (!ts.isCallExpression(node)) return;
    const targets = resolveInvocationCandidates(node, scope);
    if (targets.some((target) => target.name === 'elementFromPoint' && target.owner === 'document')) {
      elementFromPointCalls += 1;
    }
    for (const target of targets) {
      recordObjectCallableMutations(target);
      const receiver = target.receiver;
      if (target.name === 'dispatchEvent' && !isLocalPlainCallableOwner(target)) add('call:dispatchEvent');
      const testTimeoutConfiguration = target.name === 'setTimeout'
        && (target.owner === 'test' || target.owner.endsWith('.test'));
      if (
        FORBIDDEN_CALLS.has(target.name)
        && !testTimeoutConfiguration
        && !isLocalPlainCallableOwner(target)
      ) add(`call:${target.name}`);
      if (
        target.name === 'click'
        && !isAllowedClickReceiver(receiver?.expression, receiver?.scope ?? scope)
        && !isAllowedCallableOwner(target)
      ) add('dom-click');

      if (target.name === 'construct' && target.owner === 'Reflect' && target.arguments[0]) {
        const constructor = target.arguments[0];
        const constructors = [
          resolveCallable(constructor.expression, constructor.scope),
          ...historicalCallables(constructor.expression, constructor.scope),
        ];
        constructors.forEach((constructed) => {
          if (EVENT_CONSTRUCTORS.has(constructed.name)) add(`constructed:${constructed.name}`);
        });
      }

      if (EVENT_CONSTRUCTORS.has(target.name) && !isLocalPlainCallableOwner(target)) {
        add(`constructed:${target.name}`);
      }

      if (target.name === 'evaluate' || target.name === 'evaluateAll' || target.name === 'evaluateHandle') {
        const firstArgument = target.arguments[0];
        const callbacks = resolveFunctionCandidates(firstArgument?.expression, firstArgument?.scope ?? scope);
        if (callbacks.some(evaluateMutatesDom)) add('evaluate-mutation');
      }

      if (ACTION_CALLS.has(target.name) && !isLocalPlainCallableOwner(target)) {
        for (const argument of target.arguments) {
          forbiddenOptions(argument.expression, argument.scope).forEach((name) => add(`option:${name}`));
        }
      }

      if (target.name === 'assign' && target.owner === 'Object' && target.arguments[0]) {
        const assignTarget = target.arguments[0];
        const targetBinding = plainBindingForExpression(assignTarget.expression, assignTarget.scope);
        if (targetBinding) {
          target.arguments.slice(1).forEach((argument) => {
            forbiddenOptions(argument.expression, argument.scope).forEach((name) => {
              targetBinding.forbiddenOptions.add(name);
              recordOptionPath(assignTarget.expression, assignTarget.scope, name);
            });
          });
        } else {
          target.arguments.slice(1).forEach((argument) => {
            forbiddenOptions(argument.expression, argument.scope).forEach((name) => {
              recordOptionPath(assignTarget.expression, assignTarget.scope, name);
            });
          });
        }
      }

      if (
        target.name === 'defineProperty'
        && (target.owner === 'Object' || target.owner === 'Reflect')
        && target.arguments[0]
        && target.arguments[1]
      ) {
        const defineTarget = target.arguments[0];
        const property = target.arguments[1];
        const name = resolveString(property.expression, property.scope);
        if (name === 'force' || name === 'trial') {
          plainBindingForExpression(defineTarget.expression, defineTarget.scope)?.forbiddenOptions.add(name);
          recordOptionPath(defineTarget.expression, defineTarget.scope, name);
        }
      }
      if (target.name === 'defineProperties' && target.owner === 'Object' && target.arguments[0] && target.arguments[1]) {
        const defineTarget = target.arguments[0];
        const descriptors = target.arguments[1];
        const resolved = resolvePlainObject(descriptors.expression, descriptors.scope);
        resolved?.object.properties.forEach((property) => {
          if (!ts.isPropertyAssignment(property)) return;
          possibleDeclaredPropertyNames(property.name, resolved.scope).forEach((name) => {
            if (name === 'force' || name === 'trial') {
              plainBindingForExpression(defineTarget.expression, defineTarget.scope)?.forbiddenOptions.add(name);
              recordOptionPath(defineTarget.expression, defineTarget.scope, name);
            }
          });
        });
      }
      if (target.name === 'set' && target.owner === 'Reflect' && target.arguments[0] && target.arguments[1]) {
        const setTarget = target.arguments[0];
        const property = target.arguments[1];
        const name = resolveString(property.expression, property.scope);
        recordOptionPath(setTarget.expression, setTarget.scope, name);
      }
    }
  });

  return { violations: [...found].sort(), elementFromPointCalls };
}

describe('WB-R07 AST interaction policy', () => {
  it('rejects bypasses and mutations as executable syntax, not comments', () => {
    const audit = auditSource(pointerSource, 'real-pointer.ts');
    expect(audit.violations).toEqual([]);
    expect(audit.elementFromPointCalls).toBe(1);
    expect(pointerSource).toContain('intended.contains(top)');
    expect(pointerSource).toContain('await page.mouse.click');
    expect(pointerSource).toContain('await page.mouse.dblclick');
    expect(pointerSource).toContain("button: 'right'");
  });

  it('audits every canonical J01-J20 journey implementation', () => {
    expect(journeyFiles).toEqual([
      'j01-j05.playwright.ts',
      'j06-j10.playwright.ts',
      'j11-j15.playwright.ts',
      'j16-j20.playwright.ts',
    ]);
    for (const filename of journeyFiles) {
      const source = readFileSync(path.join(journeyRoot, filename), 'utf8');
      expect(auditSource(source, filename).violations, filename).toEqual([]);
    }

    const j01j05 = readFileSync(path.join(journeyRoot, 'j01-j05.playwright.ts'), 'utf8');
    const j04Block = j01j05.slice(j01j05.indexOf('test(J04.line'), j01j05.indexOf('test(J05.line'));
    expect(j04Block).toContain('safeAbortPressedPointer(page, sourcePort, sourceContext, 2)');
    expect(j04Block).toContain('annotatePointerAbortRecovery(error, recovery)');
    expect(j04Block).toMatch(/catch \(error\)[\s\S]*throw error;/u);
    expect(j04Block).not.toMatch(/if \(pressed && !released\) await page\.mouse\.up\(\)/u);
    expect(j04Block).not.toContain('pointer abort failed');

    const j06j10 = readFileSync(path.join(journeyRoot, 'j06-j10.playwright.ts'), 'utf8');
    const j07DragBlock = j06j10.slice(
      j06j10.indexOf('async function performRotationDrag'),
      j06j10.indexOf('// J08 —'),
    );
    expect(j07DragBlock).toContain('safeAbortPressedPointer(page, sourcePort, sourceContext, 12)');
    expect(j07DragBlock).toContain('annotatePointerAbortRecovery(error, recovery)');
    expect(j07DragBlock).toMatch(/catch \(error\)[\s\S]*throw error;/u);
    expect(j07DragBlock).not.toMatch(/if \(pressed && !released\)[\s\S]{0,80}await page\.mouse\.up\(\)/u);
    expect(j07DragBlock).not.toContain('pointer abort failed');
  });

  it('detects aliased, spread, computed, and dynamic syntax-level bypass attempts', () => {
    const hostile = `
      const bypass = true;
      const forceKey = 'for' + 'ce';
      const baseOptions = { [forceKey]: bypass };
      const trial = bypass;
      const options = { ...baseOptions, trial };
      const clickAlias = el['click'];
      clickAlias();
      const dispatchAlias = el.dispatchEvent;
      dispatchAlias(new DragEvent('drag'));
      const EventAlias = window.WheelEvent;
      new EventAlias('wheel');
      new CustomEvent('custom');
      const mutate = (node) => {
        node.style.color = 'red';
        node.append('mutation');
      };
      const evaluateAlias = target.evaluate;
      evaluateAlias(mutate);
      const { evaluateAll: inspectAll } = target;
      inspectAll((nodes) => nodes.forEach((node) => node.remove()));
      const { evaluateHandle: inspectHandle } = target;
      inspectHandle((node) => { node.textContent = 'mutation'; });
      const { click: destructuredClick } = el;
      destructuredClick();
      const { dispatchEvent: destructuredDispatch } = el;
      destructuredDispatch(new MouseEvent('click'));
      function destructuredParameters({ click: activate, dispatchEvent: emit }) {
        activate();
        emit(new PointerEvent('pointerdown'));
      }
      page.emulateMedia({ reducedMotion: 'reduce' });
      page.evaluate(() => document.getAnimations().forEach((animation) => Reflect.apply(animation.finish, animation, [])));
      const pause = setTimeout;
      pause(() => undefined, 100);
      locator.click(options);
    `;
    const audit = auditSource(hostile, 'hostile.ts');
    expect(audit.violations).toEqual(expect.arrayContaining([
      'dom-click',
      'dom-click-alias',
      'call:dispatchEvent',
      'constructed:WheelEvent',
      'constructed:DragEvent',
      'constructed:CustomEvent',
      'constructed:MouseEvent',
      'constructed:PointerEvent',
      'evaluate-mutation',
      'call:emulateMedia',
      'call:setTimeout',
      'option:force',
      'option:trial',
    ]));
    expect(audit.elementFromPointCalls).toBe(0);

    const nestedDestructuring = auditSource(`
      function run({ actions: { click: activate }, events: { dispatchEvent: emit } }) {
        activate();
        emit(new PointerEvent('pointerdown'));
      }
    `, 'nested-destructuring.ts');
    expect(nestedDestructuring.violations).toEqual(expect.arrayContaining([
      'dom-click',
      'call:dispatchEvent',
      'constructed:PointerEvent',
    ]));
  });

  it('tracks lexical scope and closes dynamic event, timer, and DOM mutation aliases', () => {
    const eventConstructors = auditSource(`
      const construct = Reflect.construct;
      const ClipboardCtor = ClipboardEvent;
      construct(ClipboardCtor, ['copy']);
      new FocusEvent('focus');
      new CompositionEvent('compositionstart');
      new SubmitEvent('submit');
    `, 'event-aliases.ts');
    expect(eventConstructors.violations).toEqual(expect.arrayContaining([
      'constructed:ClipboardEvent',
      'constructed:FocusEvent',
      'constructed:CompositionEvent',
      'constructed:SubmitEvent',
    ]));

    const timerAliases = auditSource(`
      const invoke = Reflect.apply;
      const wait = setTimeout;
      const nap = sleep;
      invoke(wait, globalThis, [() => undefined, 25]);
      nap(25);
    `, 'timer-aliases.ts');
    expect(timerAliases.violations).toEqual(expect.arrayContaining([
      'call:setTimeout',
      'call:sleep',
    ]));

    for (const [label, body] of [
      ['class-add', "node.classList.add('blocked')"],
      ['class-toggle', "node.classList.toggle('blocked')"],
      ['class-remove', "node.classList.remove('blocked')"],
      ['style-alias', "const style = node.style; style.opacity = '0'"],
      ['attribute-alias', "const set = Reflect.apply; set(node.setAttribute, node, ['hidden', ''])"],
      ['unknown-assignment', 'const alias = node; alias.hidden = true'],
    ] as const) {
      const audit = auditSource(`page.evaluate((node) => { ${body}; });`, `${label}.ts`);
      expect(audit.violations, label).toContain('evaluate-mutation');
    }

    const localPlainObject = auditSource(`
      page.evaluate(() => {
      const result = { count: 0, nested: { value: '' } };
      const alias = result;
      const localMethods = { click() {}, remove() {} };
      const localRemove = localMethods.remove;
      result.count = 1;
      alias.nested.value = 'safe';
      localRemove();
      return result;
      });
      const localActions = { click() {} };
      const localClick = localActions.click;
      localClick();
    `, 'local-plain-object.ts');
    expect(localPlainObject.violations).not.toContain('evaluate-mutation');

    const unrelatedForceTrial = auditSource(`
      const legalTerms = { force: 'majeure', trial: 'hearing' };
      reportTerms(legalTerms);
    `, 'unrelated-force-trial.ts');
    expect(unrelatedForceTrial.violations).not.toEqual(expect.arrayContaining([
      'option:force',
      'option:trial',
    ]));

    const shadowedAliases = auditSource(`
      const click = element.click;
      function run(click: () => void, setTimeout: () => void, ClipboardEvent: new () => object) {
        click();
        setTimeout();
        new ClipboardEvent();
      }
      {
        class FocusEvent {}
        new FocusEvent();
      }
    `, 'shadowed-aliases.ts');
    expect(shadowedAliases.violations).toEqual(['dom-click-alias']);

    const forwardedCalls = auditSource(`
      const pause = Function.prototype.call.bind(setTimeout);
      pause(globalThis, () => undefined, 25);
      const reflectedPause = Reflect.apply.bind(Reflect, setTimeout);
      reflectedPause(globalThis, [() => undefined, 25]);
      Function.prototype.call.call(el.click, el);
      Function.prototype.apply.call(el.setAttribute, el, ['hidden', '']);
      Reflect.construct.call(Reflect, ClipboardEvent, ['copy']);
      Reflect.construct.apply(Reflect, [FocusEvent, ['focus']]);
    `, 'forwarded-calls.ts');
    expect(forwardedCalls.violations).toEqual(expect.arrayContaining([
      'call:setTimeout',
      'dom-click',
      'constructed:ClipboardEvent',
      'constructed:FocusEvent',
    ]));

    const wrappedDom = auditSource(`
      page.evaluate((node) => {
        const wrap = { add: node.classList.add, click: node.click, set: node.setAttribute };
        wrap.add('blocked');
        wrap.click();
        wrap.set('hidden', '');
        node.classList.replace('before', 'after');
        const box = { node };
        box.node.style.opacity = '0';
        box.node.attributes[0].value = 'blocked';
        Object.defineProperty(box.node, 'hidden', { value: true });
        Reflect.set(box.node.style, 'display', 'none');
      });
    `, 'wrapped-dom.ts');
    expect(wrappedDom.violations).toContain('evaluate-mutation');

    const forwardedOptions = auditSource(`
      const config = { options: { force: true } };
      const args = [{ trial: true }];
      page.locator('a').locator('button').click(config.options);
      locator.click(...args);
      Reflect.apply(locator.click, locator, args);
      locator.click.bind(locator, config.options)();
      const options = {};
      Object.assign.call(Object, options, { trial: true });
      locator.click(options);
      Object.defineProperty.call(Object, options, 'force', { value: true });
      locator.click(options);
    `, 'forwarded-options.ts');
    expect(forwardedOptions.violations).toEqual(expect.arrayContaining([
      'option:force',
      'option:trial',
    ]));

    const localActionNames = auditSource(`
      const legal = { click() {} };
      legal.click({ force: 'majeure', trial: 'hearing' });
      page.evaluate(() => {
        const local = { node: { style: {} }, remove() {}, click() {} };
        local.node.style.opacity = '1';
        local.remove();
        local.click();
      });
    `, 'local-action-names.ts');
    expect(localActionNames.violations).toEqual([]);

    const reassignmentAndScopes = auditSource(`
      let wait = setTimeout;
      if (condition) wait = () => undefined;
      wait(() => undefined, 25);
      let options = { force: true };
      if (condition) options = {};
      locator.click(options);
      const OuterEvent = ClipboardEvent;
      for (const OuterEvent of []) { new OuterEvent(); }
      new OuterEvent('copy');
      try {} catch (setTimeout) { setTimeout(); }
      class Safe {
        run(setTimeout: () => void, ClipboardEvent: new () => object) {
          setTimeout();
          new ClipboardEvent();
        }
      }
    `, 'reassignment-and-scopes.ts');
    expect(reassignmentAndScopes.violations).toEqual(expect.arrayContaining([
      'call:setTimeout',
      'option:force',
      'constructed:ClipboardEvent',
    ]));
    expect(reassignmentAndScopes.violations.filter((value) => value === 'constructed:ClipboardEvent')).toHaveLength(1);

    for (const [label, source, violation] of [
      ['call-bind-timer', 'const f = Function.prototype.call.bind(setTimeout); f(globalThis, () => {}, 25);', 'call:setTimeout'],
      ['reflect-bind-timer', 'const f = Reflect.apply.bind(Reflect, setTimeout); f(globalThis, [() => {}, 25]);', 'call:setTimeout'],
      ['reflect-call-timer', 'Reflect.apply.call(Reflect, setTimeout, globalThis, [() => {}, 25]);', 'call:setTimeout'],
      ['nested-intrinsic-timer', 'Reflect.apply(Function.prototype.call, setTimeout, [globalThis, () => {}, 25]);', 'call:setTimeout'],
      ['nested-reflect-timer', 'Reflect.apply(Reflect.apply, Reflect, [setTimeout, globalThis, [() => {}, 25]]);', 'call:setTimeout'],
      ['meta-click', 'Function.prototype.call.call(el.click, el);', 'dom-click'],
      ['construct-call', "Reflect.construct.call(Reflect, ClipboardEvent, ['copy']);", 'constructed:ClipboardEvent'],
      ['construct-apply', "Reflect.construct.apply(Reflect, [FocusEvent, ['focus']]);", 'constructed:FocusEvent'],
      ['construct-bind', "Reflect.construct.bind(Reflect, CompositionEvent)(['compositionstart']);", 'constructed:CompositionEvent'],
      ['nested-reflect-construct', "const f = Reflect.apply.bind(Reflect, Reflect.construct); f(Reflect, [SubmitEvent, ['submit']]);", 'constructed:SubmitEvent'],
      ['intrinsic-bind-construct', "const f = Function.prototype.call.bind(Reflect.construct); f(Reflect, ClipboardEvent, ['copy']);", 'constructed:ClipboardEvent'],
      ['reflect-call-construct', "Reflect.apply.call(Reflect, Reflect.construct, Reflect, [FocusEvent, ['focus']]);", 'constructed:FocusEvent'],
      ['nested-call-construct', "Reflect.apply(Reflect.construct.call, Reflect.construct, [Reflect, ClipboardEvent, ['copy']]);", 'constructed:ClipboardEvent'],
      ['reflect-apply-event', "Reflect.apply(Event, null, ['type']);", 'constructed:Event'],
      ['reflect-apply-mouse-event', "Reflect.apply(MouseEvent, null, ['click']);", 'constructed:MouseEvent'],
      ['reflect-apply-custom-event', "Reflect.apply(CustomEvent, null, ['build', { detail: null }]);", 'constructed:CustomEvent'],
      ['reflect-apply-call-event', "Reflect.apply.call(Reflect, Event, null, ['type']);", 'constructed:Event'],
      ['reflect-apply-bind-event', "Reflect.apply.bind(Reflect, MouseEvent)(null, ['click']);", 'constructed:MouseEvent'],
      ['direct-call-event', "Event('type');", 'constructed:Event'],
      ['nested-reflect-apply-event', "Reflect.apply(Reflect.apply, Reflect, [Event, null, ['type']]);", 'constructed:Event'],
    ] as const) {
      expect(auditSource(source, `${label}.ts`).violations, label).toContain(violation);
    }

    for (const [label, body] of [
      ['wrapped-class', "const wrap = { add: node.classList.add }; wrap.add('x')"],
      ['wrapped-attribute', "const wrap = { set: node.setAttribute }; wrap.set('hidden', '')"],
      ['class-replace', "node.classList.replace('a', 'b')"],
      ['nested-style', "const box = { node }; box.node.style.opacity = '0'"],
      ['nested-attributes', "const box = { node }; box.node.attributes[0].value = 'x'"],
      ['define-property', "Object.defineProperty(node, 'hidden', { value: true })"],
      ['reflect-set', "Reflect.set(node.style, 'opacity', '0')"],
      ['reflect-define', "Reflect.apply(Object.defineProperty, Object, [node, 'hidden', { value: true }])"],
      ['reflect-define-direct', "Reflect.defineProperty(node, 'hidden', { value: true })"],
      ['intrinsic-bind-evaluate', "const f = Function.prototype.call.bind(page.evaluate); f(page, (node) => { node.hidden = true; })"],
      ['reflect-call-evaluate', "Reflect.apply.call(Reflect, page.evaluate, page, [(node) => { node.hidden = true; }])"],
    ] as const) {
      const result = auditSource(`page.evaluate((node) => { ${body}; });`, `${label}.ts`);
      expect(result.violations, label).toContain('evaluate-mutation');
    }

    for (const [label, source, violation] of [
      ['destructure-default-timer', "const { wait = setTimeout } = {}; wait(() => {}, 25);", 'call:setTimeout'],
      ['destructure-default-event', "const [Ctor = ClipboardEvent] = []; new Ctor('copy');", 'constructed:ClipboardEvent'],
      ['bind-call-timer', "const wait = Function.prototype.bind.call(setTimeout, globalThis); wait(() => {}, 25);", 'call:setTimeout'],
      ['bind-call-event', "const Ctor = Function.prototype.bind.call(ClipboardEvent, null); new Ctor('copy');", 'constructed:ClipboardEvent'],
      ['reflect-get-click', "Reflect.apply(Reflect.get(el, 'click'), el, []);", 'dom-click'],
      ['reflect-get-event', "const Ctor = Reflect.get(globalThis, 'ClipboardEvent'); new Ctor('copy');", 'constructed:ClipboardEvent'],
      ['conditional-timer', "const wait = condition ? setTimeout : (() => {}); wait(() => {}, 25);", 'call:setTimeout'],
      ['logical-timer', "let wait; wait ||= setTimeout; wait(() => {}, 25);", 'call:setTimeout'],
      ['inline-event-assignment', "let Ctor; new (Ctor = ClipboardEvent)('copy');", 'constructed:ClipboardEvent'],
      ['destructure-assignment', "let wait; ({ wait } = { wait: setTimeout }); wait(() => {}, 25);", 'call:setTimeout'],
      ['sequence-timer', "const wait = (0, setTimeout); wait(() => {}, 25);", 'call:setTimeout'],
      ['computed-click', "const key = condition ? 'focus' : 'click'; el[key]();", 'dom-click'],
      ['computed-timer', "const key = condition ? 'queueMicrotask' : 'setTimeout'; globalThis[key](() => {}, 25);", 'call:setTimeout'],
      ['event-subclass', "class Synthetic extends Event {} new Synthetic('synthetic');", 'constructed:Event'],
    ] as const) {
      expect(auditSource(source, `${label}.ts`).violations, label).toContain(violation);
    }

    const boundEvaluate = auditSource("page.evaluate(((node) => { node.hidden = true; }).bind(null));", 'bound-evaluate.ts');
    expect(boundEvaluate.violations).toContain('evaluate-mutation');
    const conditionalEvaluate = auditSource("page.evaluate(condition ? ((node) => { node.hidden = true; }) : (() => {}));", 'conditional-evaluate.ts');
    expect(conditionalEvaluate.violations).toContain('evaluate-mutation');

    const advancedOptions = auditSource(`
      const locator: Locator = page.locator('button');
      const key = condition ? 'force' : 'safe';
      locator.click({ [key]: true });
      Reflect.apply(locator.click, locator, { 0: { trial: true }, length: 1 });
      const options = {};
      Object.defineProperties(options, { force: { value: true } });
      locator.click(options);
    `, 'advanced-options.ts');
    expect(advancedOptions.violations).toEqual(expect.arrayContaining(['option:force', 'option:trial']));

    for (const [label, source, violation] of [
      ['property-timer-to-event', "const box = {}; box.f = setTimeout; if (condition) box.f = ClipboardEvent; new box.f('copy');", 'constructed:ClipboardEvent'],
      ['property-event-to-timer', "const box = {}; box.f = ClipboardEvent; if (condition) box.f = setTimeout; box.f(() => {}, 25);", 'call:setTimeout'],
    ] as const) {
      expect(auditSource(source, `${label}.ts`).violations, label).toContain(violation);
    }

    const localCallMeta = auditSource(`
      const local = { click() {} };
      local.click.call(null, { force: 'majeure', trial: 'hearing' });
    `, 'local-call-meta.ts');
    expect(localCallMeta.violations).toEqual([]);

    for (const [label, source, violation] of [
      ['nested-options', "const config = { options: { force: true } }; locator.click(config.options);", 'option:force'],
      ['spread-options', "const args = [{ trial: true }]; locator.click(...args);", 'option:trial'],
      ['reflect-options', "const args = [{ force: true }]; Reflect.apply(locator.click, locator, args);", 'option:force'],
      ['bind-options', "const options = { trial: true }; locator.click.bind(locator, options)();", 'option:trial'],
      ['assign-call-options', "const options = {}; Object.assign.call(Object, options, { force: true }); locator.click(options);", 'option:force'],
      ['define-call-options', "const options = {}; Object.defineProperty.call(Object, options, 'trial', { value: true }); locator.click(options);", 'option:trial'],
      ['intrinsic-bind-options', "const f = Function.prototype.call.bind(locator.click); f(locator, { force: true });", 'option:force'],
      ['reflect-call-options', "Reflect.apply.call(Reflect, locator.click, locator, [{ trial: true }]);", 'option:trial'],
      ['danger-to-safe', "let options = { force: true }; if (condition) options = {}; locator.click(options);", 'option:force'],
      ['safe-to-danger', "let wait = () => {}; if (condition) wait = setTimeout; wait(() => {}, 25);", 'call:setTimeout'],
      ['timer-to-event', "let f = setTimeout; if (condition) f = ClipboardEvent; new f('copy');", 'constructed:ClipboardEvent'],
      ['event-to-timer', "let f = ClipboardEvent; if (condition) f = setTimeout; f(() => {}, 25);", 'call:setTimeout'],
      ['reflect-set-options', "const options = {}; Reflect.set(options, 'force', true); locator.click(options);", 'option:force'],
      ['reflect-define-options', "const options = {}; Reflect.defineProperty(options, 'trial', { value: true }); locator.click(options);", 'option:trial'],
      ['nested-write-options', "const config = { options: {} }; config.options.force = true; locator.click(config.options);", 'option:force'],
      ['nested-assign-options', "const config = { options: {} }; Object.assign(config.options, { trial: true }); locator.click(config.options);", 'option:trial'],
      ['var-loop-timer', "for (var wait = setTimeout; false;) {} wait(() => {}, 25);", 'call:setTimeout'],
      ['var-block-timer', "if (condition) { var wait = setTimeout; } wait(() => {}, 25);", 'call:setTimeout'],
    ] as const) {
      expect(auditSource(source, `${label}.ts`).violations, label).toContain(violation);
    }

    for (const [label, source] of [
      ['catch-shadow', 'try {} catch (setTimeout) { setTimeout(); }'],
      ['loop-shadow', 'for (const ClipboardEvent of []) { new ClipboardEvent(); }'],
      ['method-shadow', 'class Safe { run(setTimeout: () => void, ClipboardEvent: new () => object) { setTimeout(); new ClipboardEvent(); } }'],
      ['local-click-options', "const legal = { click() {} }; legal.click({ force: 'majeure', trial: 'hearing' });"],
      ['local-policy-names', `
        const local = { setTimeout() {}, sleep() {}, dispatchEvent() {}, emulateMedia() {} };
        const emit = local.dispatchEvent;
        local.setTimeout();
        local.sleep();
        local.emulateMedia();
        emit();
      `],
      ['shadowed-intrinsics', `
        function safe(Reflect: { apply(...args: unknown[]): void }, Object: { assign(...args: unknown[]): void }, Function: { prototype: { call: { bind(...args: unknown[]): () => void } } }) {
          Reflect.apply(setTimeout, globalThis, [() => {}, 25]);
          Object.assign({}, { force: true });
          Function.prototype.call.bind(setTimeout)();
        }
      `],
      ['hoisted-var-shadow', `
        function safe() {
          setTimeout();
          if (condition) { var setTimeout = () => undefined; }
          setTimeout();
        }
      `],
      ['shadowed-event-subclass', 'class Event {} class Synthetic extends Event {} new Synthetic();'],
      ['benign-reflect-apply', "const local = { finish() {} }; Reflect.apply(local.finish, local, []);"],
      ['local-event-method-apply', "const local = { Event() {} }; Reflect.apply(local.Event, local, []);"],
    ] as const) {
      expect(auditSource(source, `${label}.ts`).violations, label).toEqual([]);
    }

    const chainedLocator = auditSource("page.locator('a').locator('button').click({ force: true });", 'chained-locator.ts');
    expect(chainedLocator.violations).toContain('option:force');
    expect(chainedLocator.violations).not.toContain('dom-click');

    const reassignedDom = auditSource(`
      page.evaluate((node) => {
        let value = {};
        if (condition) value = node;
        value.hidden = true;
      });
    `, 'reassigned-dom.ts');
    expect(reassignedDom.violations).toContain('evaluate-mutation');

    const destructuredDomCallable = auditSource(`
      page.evaluate((node) => {
        let add = () => {};
        ({ add } = { add: node.classList.add });
        add('blocked');
      });
    `, 'destructured-dom-callable.ts');
    expect(destructuredDomCallable.violations).toContain('evaluate-mutation');

    const assignedCallableProperty = auditSource(`
      page.evaluate((node) => {
        const wrap = {};
        wrap.add = node.classList.add;
        wrap.add('blocked');
      });
    `, 'assigned-callable-property.ts');
    expect(assignedCallableProperty.violations).toContain('evaluate-mutation');

    for (const [label, body] of [
      ['assigned-callable-object', "Object.assign(wrap, { add: node.classList.add }); wrap.add('blocked')"],
      ['defined-callable-object', "Object.defineProperty(wrap, 'add', { value: node.classList.add }); wrap.add('blocked')"],
      ['reflected-callable-object', "Reflect.set(wrap, 'add', node.classList.add); wrap.add('blocked')"],
      ['reflected-defined-callable-object', "Reflect.defineProperty(wrap, 'add', { value: node.classList.add }); wrap.add('blocked')"],
    ] as const) {
      const result = auditSource(`page.evaluate((node) => { const wrap = {}; ${body}; });`, `${label}.ts`);
      expect(result.violations, label).toContain('evaluate-mutation');
    }
  });

  it('allows only read-only filesystem imports in fixture support', () => {
    const tree = ts.createSourceFile('fixture-document.ts', fixtureSource, ts.ScriptTarget.ES2020, true);
    const imports = tree.statements.filter(ts.isImportDeclaration).filter((node) => node.moduleSpecifier.getText(tree) === "'node:fs'");
    expect(imports).toHaveLength(1);
    const names = imports[0]!.importClause?.namedBindings && ts.isNamedImports(imports[0]!.importClause.namedBindings)
      ? imports[0]!.importClause.namedBindings.elements.map((item) => item.name.text).sort() : [];
    expect(names).toEqual(['existsSync', 'lstatSync', 'realpathSync', 'statSync']);
    expect(fixtureSource).not.toMatch(/\b(?:writeFile|mkdir|rename|unlink|rmSync)\b/u);
  });
});
