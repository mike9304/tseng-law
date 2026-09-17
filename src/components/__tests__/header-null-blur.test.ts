import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// Execute actual Header callback/effect bodies with a bounded event/frame ledger.
// This is a unit contract, not a browser, hydration or synthetic native QA claim.
function harness() {
  const sourcePath = process.env.HEADER_QA_SOURCE ?? path.join(process.cwd(), 'src/components/Header.tsx');
  const source = readFileSync(sourcePath, 'utf8');
  const ast = ts.createSourceFile('Header.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = new Set(['megaTriggerRowRef', 'megaPanelRef', 'focusExitFrameRef', 'restoringMegaTriggerFocusRef', 'linkRefs', 'closeTimeoutRef', 'clearCloseTimeout', 'cancelFocusExitCheck', 'closeMegaMenuNow', 'containsMegaFocus', 'handleMegaFocus', 'handleMegaBlur']);
  const statements: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === 'Header') {
      for (const statement of node.body?.statements ?? []) {
        if (ts.isVariableStatement(statement) && statement.declarationList.declarations.some(d => ts.isIdentifier(d.name) && names.has(d.name.text))) statements.push(statement.getText(ast));
        if (ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression) && statement.expression.expression.getText(ast) === 'useEffect') {
          const text = statement.getText(ast);
          if (text.includes('cancelFocusExitCheck();') || text.includes('document.addEventListener("pointerdown"') || text.includes("window.addEventListener('keydown'")) statements.push(text);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  class NodeLedger {
    parent: NodeLedger | null = null;
    focusCalls = 0;
    constructor(public name: string) {}
    contains(node: NodeLedger | null): boolean { return node === this || !!node?.parent && this.contains(node.parent); }
    focus() { this.focusCalls++; documentLedger.activeElement = this; }
  }
  type EventRow = { target?: NodeLedger; relatedTarget?: NodeLedger | null; key?: string };
  function target() {
    const listeners = new Map<string, Set<(event: EventRow) => void>>();
    return { listeners, addEventListener(type: string, fn: (event: EventRow) => void) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type)!.add(fn); }, removeEventListener(type: string, fn: (event: EventRow) => void) { listeners.get(type)?.delete(fn); }, emit(type: string, event: EventRow) { for (const fn of [...listeners.get(type) ?? []]) fn(event); } };
  }
  const documentLedger = { ...target(), activeElement: new NodeLedger('body') };
  let frameId = 0;
  const frames = new Map<number, () => void>();
  const windowLedger = { ...target(), requestAnimationFrame(fn: () => void) { frames.set(++frameId, fn); return frameId; }, cancelAnimationFrame(id: number) { frames.delete(id); }, clearTimeout() {} };
  const cleanups: Array<() => void> = [];
  const effects: Array<() => void | (() => void)> = [];
  const text = `let openMenu: string | null = 'videos'; const setOpenMenu = (value: string | null) => { openMenu = value; };\n${statements.join('\n')}\nreturn { row:megaTriggerRowRef,panel:megaPanelRef,links:linkRefs,restoring:restoringMegaTriggerFocusRef,handleMegaFocus,blur:typeof handleMegaBlur==='undefined'?null:handleMegaBlur,open:()=>openMenu,reopen:()=>{openMenu='videos';},close:closeMegaMenuNow };`;
  const code = ts.transpileModule(`(function(){${text}})()`, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText;
  const api = vm.runInNewContext(code, { Node: NodeLedger, window: windowLedger, document: documentLedger, useRef: (current: unknown) => ({ current }), useCallback: (fn: unknown) => fn, useEffect: (fn: () => void | (() => void)) => effects.push(fn) });
  const row = new NodeLedger('row'), panel = new NodeLedger('videos'), trigger = new NodeLedger('trigger'), heading = new NodeLedger('h2'), link = new NodeLedger('link'), outside = new NodeLedger('outside');
  trigger.parent = row; heading.parent = panel; link.parent = panel;
  api.row.current = row; api.panel.current = panel; api.links.current.videos = trigger;
  documentLedger.activeElement = trigger;
  for (const effect of effects) { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); }
  const emit = (type: string, event: EventRow) => {
    documentLedger.emit(type, event);
    if (type === 'focusout' && api.blur) api.blur({ ...event, currentTarget: { ownerDocument: documentLedger } });
    if (type === 'keydown') windowLedger.emit(type, event);
  };
  const flush = () => { const pending = [...frames.values()]; frames.clear(); for (const fn of pending) fn(); };
  return { api, emit, flush, frames, documentLedger, windowLedger, row, panel, trigger, heading, link, outside, NodeLedger, cleanup: () => cleanups.forEach(fn => fn()) };
}

describe('Header pointer provenance and null-relatedTarget dismissal', () => {
  it('keeps a real inside heading gesture open when focus falls to BODY', () => {
    const h = harness(); h.emit('pointerdown', { target: h.heading }); h.documentLedger.activeElement = new h.NodeLedger('body');
    h.emit('focusout', { target: h.trigger, relatedTarget: null }); h.emit('pointerup', { target: h.heading }); h.flush(); h.flush();
    expect(h.api.open()).toBe('videos'); expect(h.heading.focusCalls).toBe(0); h.cleanup();
  });
  it('invalidates pointer intent on same-frame Tab before a genuine null exit', () => {
    const h = harness(); h.emit('pointerdown', { target: h.heading }); h.emit('pointerup', { target: h.heading });
    h.emit('keydown', { key: 'Tab' }); h.documentLedger.activeElement = new h.NodeLedger('body'); h.emit('focusout', { target: h.trigger, relatedTarget: null }); h.flush();
    expect(h.api.open()).toBeNull(); h.cleanup();
  });
  it('does not let an old pointer-end frame clear a new inside gesture', () => {
    const h = harness(); h.emit('pointerdown', { target: h.heading }); h.emit('pointerup', { target: h.heading }); h.emit('pointerdown', { target: h.heading }); h.flush();
    h.documentLedger.activeElement = new h.NodeLedger('body'); h.emit('focusout', { target: h.trigger, relatedTarget: null }); h.flush(); expect(h.api.open()).toBe('videos'); h.cleanup();
  });
  it('retains inside traversal but dismisses actual outside focus without stealing it', () => {
    const h = harness(); h.emit('focusout', { target: h.trigger, relatedTarget: h.link }); expect(h.api.open()).toBe('videos');
    h.documentLedger.activeElement = h.outside; h.emit('focusout', { target: h.link, relatedTarget: h.outside }); h.emit('focusin', { target: h.outside });
    expect(h.api.open()).toBeNull(); expect(h.documentLedger.activeElement).toBe(h.outside); h.cleanup();
  });
  it('dismisses outside pointer even if it cannot receive focus', () => {
    const h = harness(); h.emit('pointerdown', { target: h.outside }); expect(h.api.open()).toBeNull(); h.cleanup();
  });
  it('uses live active-panel refs after a panel switch', () => {
    const h = harness(); const next = new h.NodeLedger('next-panel'); h.api.panel.current = next;
    h.emit('pointerdown', { target: next }); h.documentLedger.activeElement = new h.NodeLedger('body'); h.emit('focusout', { target: h.trigger, relatedTarget: null }); h.flush(); expect(h.api.open()).toBe('videos');
    h.emit('keydown', { key: 'Tab' }); h.emit('focusout', { target: next, relatedTarget: h.outside }); expect(h.api.open()).toBeNull(); h.cleanup();
  });
  it('does not retain a dismissed guard across same-batch same-key reopening', () => {
    const h = harness(); h.emit('pointerdown', { target: h.outside }); h.api.reopen(); h.emit('pointerdown', { target: h.outside }); expect(h.api.open()).toBeNull(); h.cleanup();
  });
  it('preserves conditional Escape restoration and its suppression guard', () => {
    const h = harness(); h.documentLedger.activeElement = h.link;
    let suppressed = false; h.trigger.focus = () => { suppressed = h.api.restoring.current; h.documentLedger.activeElement = h.trigger; };
    h.emit('keydown', { key: 'Escape' }); expect(h.api.open()).toBeNull(); expect(suppressed).toBe(true); expect(h.api.restoring.current).toBe(false);
    h.api.reopen(); h.documentLedger.activeElement = h.outside; h.emit('keydown', { key: 'Escape' }); expect(h.documentLedger.activeElement).toBe(h.outside); h.cleanup();
  });
  it('cancels pending pointer frames and removes all listeners on cleanup', () => {
    const h = harness(); h.emit('pointerdown', { target: h.heading }); h.emit('pointerup', { target: h.heading }); h.cleanup();
    expect(h.frames.size).toBe(0); expect([...h.documentLedger.listeners.values()].every(set => set.size === 0)).toBe(true); expect([...h.windowLedger.listeners.values()].every(set => set.size === 0)).toBe(true);
  });
});
