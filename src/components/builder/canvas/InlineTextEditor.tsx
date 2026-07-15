'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import { sanitizeLinkValue, type LinkValue } from '@/lib/builder/links';
import {
  BUILDER_RICH_TEXT_FORMAT,
  type BuilderRichText,
} from '@/lib/builder/rich-text/types';
import {
  extractPlainTextFromTipTapDoc,
  richTextFromPlainText,
  sanitizeTipTapDoc,
} from '@/lib/builder/rich-text/sanitize';
import type { TextAssistantTargetLocale } from '@/lib/builder/ai-generator/text-assistant';
import type { Locale } from '@/lib/locales';
import AiTextAssistantPanel from './AiTextAssistantPanel';
import { getInlineTextEditorCopy } from './inline-text-editor-copy';
import styles from './SandboxPage.module.css';

interface InlineTextEditorProps {
  initialText: string;
  initialRichText?: BuilderRichText;
  initialCaretCoords?: { x: number; y: number } | null;
  fontSize?: number;
  color?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: string;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textDecoration?: string;
  textTransform?: string;
  align?: string;
  aiLocale?: TextAssistantTargetLocale;
  aiSiteName?: string;
  aiBrandTone?: string;
  aiElementHint?: string;
  locale?: Locale;
  onSave: (payload: { richText: BuilderRichText; plainText: string }) => void;
  onCancel?: () => void;
  onBlur: () => void;
}

function cssValue(value: string | number | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? String(value) : value;
}

function normalizeFontWeightCss(fontWeight: string | number): string {
  if (typeof fontWeight === 'number') return String(fontWeight);
  const normalized = fontWeight.trim();
  if (normalized === 'bold') return '700';
  if (normalized === 'medium') return '500';
  if (normalized === 'regular') return '400';
  return normalized || '400';
}

function toolbarButtonClassName(active: boolean, extraClass?: string): string {
  return [
    styles.inlineTextToolbarButton,
    active ? styles.inlineTextToolbarButtonActive : '',
    extraClass ?? '',
  ].filter(Boolean).join(' ');
}

export type InlineTextNestedSurface = 'link' | 'ai';
export type InlineTextKeyboardAction =
  | 'none'
  | 'commit-editor'
  | 'cancel-editor'
  | 'close-link'
  | 'close-ai';

export function resolveInlineTextKeyboardAction({
  key,
  metaKey = false,
  ctrlKey = false,
  shiftKey = false,
  altKey = false,
  isComposing = false,
  target,
  activeSurface,
}: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  isComposing?: boolean;
  target: 'editor' | 'toolbar' | InlineTextNestedSurface | 'outside';
  activeSurface: InlineTextNestedSurface | null;
}): InlineTextKeyboardAction {
  if (isComposing) return 'none';

  if (key === 'Escape') {
    if (activeSurface === 'link') return 'close-link';
    if (activeSurface === 'ai') return 'close-ai';
    return target === 'outside' ? 'none' : 'cancel-editor';
  }

  if (key === 'Tab') {
    if (target === 'link' || target === 'ai' || target === 'outside') return 'none';
    return 'commit-editor';
  }

  if (key === 'Enter' && target === 'editor' && !shiftKey && !altKey && (metaKey || ctrlKey)) {
    return 'commit-editor';
  }

  return 'none';
}

export interface InlineTextCloseController {
  commit: () => 'closed' | 'pending-composition' | 'ignored';
  cancel: () => 'closed' | 'ignored';
  compositionEnd: () => 'closed' | 'ignored';
  destroy: () => 'closed' | 'ignored';
  isClosed: () => boolean;
  getMode: () => 'commit' | 'cancel' | null;
}

export function createInlineTextCloseController(callbacks: {
  isComposing: () => boolean;
  onSave: () => void;
  onBlur: () => void;
  onCancel?: () => void;
}): InlineTextCloseController {
  let closed = false;
  let mode: 'commit' | 'cancel' | null = null;
  let pendingCompositionCommit = false;

  const finishCommit = (notifyBlur: boolean): 'closed' | 'ignored' => {
    if (closed) return 'ignored';
    closed = true;
    pendingCompositionCommit = false;
    callbacks.onSave();
    if (notifyBlur) callbacks.onBlur();
    return 'closed';
  };

  return {
    commit() {
      if (closed) return 'ignored';
      mode = 'commit';
      if (callbacks.isComposing()) {
        pendingCompositionCommit = true;
        return 'pending-composition';
      }
      return finishCommit(true);
    },
    cancel() {
      if (closed) return 'ignored';
      closed = true;
      mode = 'cancel';
      pendingCompositionCommit = false;
      callbacks.onCancel?.();
      callbacks.onBlur();
      return 'closed';
    },
    compositionEnd() {
      if (closed || !pendingCompositionCommit || mode !== 'commit') return 'ignored';
      return finishCommit(true);
    },
    destroy() {
      if (closed || mode === 'cancel') return 'ignored';
      mode = 'commit';
      return finishCommit(false);
    },
    isClosed: () => closed,
    getMode: () => mode,
  };
}

export function isValidInlineTextCaretCoords(
  coords: { x: number; y: number } | null | undefined,
): coords is { x: number; y: number } {
  return Boolean(coords && Number.isFinite(coords.x) && Number.isFinite(coords.y));
}

/* ── Component ──────────────────────────────────────────────────── */

export default function InlineTextEditor({
  initialText,
  initialRichText,
  initialCaretCoords,
  fontSize = 16,
  color = '#1f2937',
  fontWeight = 'regular',
  fontFamily,
  fontStyle,
  lineHeight,
  letterSpacing,
  textDecoration,
  textTransform,
  align = 'left',
  aiLocale = 'ko',
  aiSiteName,
  aiBrandTone,
  aiElementHint,
  locale,
  onSave,
  onCancel,
  onBlur,
}: InlineTextEditorProps) {
  const copy = getInlineTextEditorCopy(locale ?? 'ko');
  const containerRef = useRef<HTMLDivElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  const lastSavedSignatureRef = useRef<string | null>(null);
  const toolbarSelectionRef = useRef<{ from: number; to: number } | null>(null);
  const isComposingRef = useRef(false);
  const [toolbarBelow, setToolbarBelow] = useState(false);
  const [linkPickerOpen, setLinkPickerOpen] = useState(false);
  const [linkPickerValue, setLinkPickerValue] = useState<LinkValue | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const initialContent = (initialRichText?.doc ?? richTextFromPlainText(initialText).doc) as JSONContent;
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // StarterKit v3 bundles both extensions. The configured instances
        // below own them so Link can keep canvas-safe openOnClick behavior.
        link: false,
        underline: false,
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: copy.placeholder }),
    ],
    [copy.placeholder],
  );

  // Determine whether toolbar should appear below the element
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setToolbarBelow(rect.top < 50);
  }, []);

  const editor = useEditor({
    extensions,
    content: initialContent,
    autofocus: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: [
          `font-size: ${fontSize}px`,
          `color: ${color}`,
          `font-weight: ${normalizeFontWeightCss(fontWeight)}`,
          fontFamily ? `font-family: ${fontFamily}` : null,
          fontStyle ? `font-style: ${fontStyle}` : null,
          lineHeight != null ? `line-height: ${cssValue(lineHeight)}` : null,
          letterSpacing != null ? `letter-spacing: ${cssValue(letterSpacing)}` : null,
          textDecoration ? `text-decoration: ${textDecoration}` : null,
          textTransform ? `text-transform: ${textTransform}` : null,
          `text-align: ${align}`,
          'outline: none',
          'min-height: 1em',
          'width: 100%',
        ].filter(Boolean).join(';'),
      },
    },
  });

  // Position the caret at the clicked coordinates instead of selecting all
  // text. A real double-click enters at the caret/word the user clicked.
  useLayoutEffect(() => {
    if (!editor) return;
    const coords = initialCaretCoords;
    if (isValidInlineTextCaretCoords(coords)) {
      try {
        const pos = editor.view.posAtCoords({ left: coords.x, top: coords.y });
        if (pos && pos.pos >= 0) {
          editor.commands.setTextSelection(pos.pos);
          editor.commands.focus();
          return;
        }
      } catch {
        // The view may not be laid out yet. Keep TipTap's current selection;
        // a valid click coordinate must never be silently replaced with "end".
      }
      editor.commands.focus();
      return;
    }
    // Context-menu/toolbar entry has no usable pointer coordinate.
    editor.commands.focus('end');
  }, [editor, initialCaretCoords]);

  const handleSave = useCallback(() => {
    if (!editor) return;
    const doc = sanitizeTipTapDoc(editor.getJSON()) ?? richTextFromPlainText(editor.getText()).doc;
    const plainText = extractPlainTextFromTipTapDoc(doc);
    const signature = JSON.stringify({ doc, plainText });
    if (signature === lastSavedSignatureRef.current) return;
    lastSavedSignatureRef.current = signature;
    onSave({
      richText: {
        format: BUILDER_RICH_TEXT_FORMAT,
        doc,
        plainText,
        html: editor.getHTML(),
      },
      plainText,
    });
  }, [editor, onSave]);

  const latestCloseCallbacksRef = useRef({ handleSave, onBlur, onCancel });
  latestCloseCallbacksRef.current = { handleSave, onBlur, onCancel };
  const closeControllerRef = useRef<InlineTextCloseController | null>(null);
  if (!closeControllerRef.current) {
    closeControllerRef.current = createInlineTextCloseController({
      isComposing: () => isComposingRef.current,
      onSave: () => latestCloseCallbacksRef.current.handleSave(),
      onBlur: () => latestCloseCallbacksRef.current.onBlur(),
      onCancel: () => latestCloseCallbacksRef.current.onCancel?.(),
    });
  }
  const closeController = closeControllerRef.current;
  const commitAndBlur = useCallback(() => closeController.commit(), [closeController]);
  const cancelAndBlur = useCallback(() => closeController.cancel(), [closeController]);

  useEffect(() => {
    if (!editor || lastSavedSignatureRef.current) return;
    const doc = sanitizeTipTapDoc(editor.getJSON()) ?? richTextFromPlainText(editor.getText()).doc;
    const plainText = extractPlainTextFromTipTapDoc(doc);
    lastSavedSignatureRef.current = JSON.stringify({ doc, plainText });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const rememberSelection = () => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        toolbarSelectionRef.current = { from, to };
        return;
      }
      if (editor.view.dom.contains(document.activeElement)) {
        toolbarSelectionRef.current = null;
      }
    };
    rememberSelection();
    editor.on('selectionUpdate', rememberSelection);
    return () => {
      editor.off('selectionUpdate', rememberSelection);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const handler = ({ event }: { event: FocusEvent }) => {
      if (closeController.isClosed()) return;
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && containerRef.current?.contains(nextTarget)) {
        const { from, to } = editor.state.selection;
        if (from !== to) toolbarSelectionRef.current = { from, to };
        return;
      }
      toolbarSelectionRef.current = null;
      commitAndBlur();
    };
    editor.on('blur', handler);
    return () => {
      editor.off('blur', handler);
    };
  }, [closeController, commitAndBlur, editor]);

  useEffect(() => {
    const handlePointerDownOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        commitAndBlur();
      }
    };
    document.addEventListener('pointerdown', handlePointerDownOutside, true);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside, true);
  }, [commitAndBlur]);

  // This cleanup is tied only to this editor instance's lifetime. Changing
  // onSave/onBlur identities or the async TipTap editor value cannot trigger it.
  useEffect(() => () => {
    closeController.destroy();
  }, [closeController]);

  const activeSurface: InlineTextNestedSurface | null = linkPickerOpen
    ? 'link'
    : aiPanelOpen
      ? 'ai'
      : null;

  const closeNestedSurface = useCallback((surface: InlineTextNestedSurface) => {
    if (surface === 'link') {
      setLinkPickerOpen(false);
    } else {
      setAiPanelOpen(false);
    }
    window.requestAnimationFrame(() => {
      (surface === 'link' ? linkButtonRef.current : aiButtonRef.current)?.focus();
    });
  }, []);

  useEffect(() => {
    const handleEditorKeyDown = (e: KeyboardEvent) => {
      const targetNode = e.target instanceof Node ? e.target : null;
      const targetElement = e.target instanceof Element ? e.target : null;
      const target = targetElement?.closest('[data-builder-link-picker="true"]')
        ? 'link'
        : targetElement?.closest('[data-builder-ai-text-panel="true"]')
          ? 'ai'
          : targetNode && editor?.view.dom.contains(targetNode)
            ? 'editor'
            : targetElement?.closest('[data-builder-inline-text-toolbar="true"]')
              ? 'toolbar'
              : 'outside';
      const action = resolveInlineTextKeyboardAction({
        key: e.key,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        isComposing: e.isComposing || isComposingRef.current,
        target,
        activeSurface,
      });

      if (action === 'close-link' || action === 'close-ai') {
        e.preventDefault();
        e.stopPropagation();
        closeNestedSurface(action === 'close-link' ? 'link' : 'ai');
        return;
      }
      if (action === 'cancel-editor') {
        e.preventDefault();
        e.stopPropagation();
        cancelAndBlur();
        return;
      }
      if (action === 'commit-editor') {
        // Keep Tab's native default action intact so the browser advances the
        // focus order after the editor closes. Mod+Enter is an explicit custom
        // shortcut, so it owns and consumes that key event.
        if (e.key !== 'Tab') {
          e.preventDefault();
          e.stopPropagation();
        }
        commitAndBlur();
      }
    };
    document.addEventListener('keydown', handleEditorKeyDown, true);
    return () => document.removeEventListener('keydown', handleEditorKeyDown, true);
  }, [activeSurface, cancelAndBlur, closeNestedSurface, commitAndBlur, editor]);

  const handleLink = useCallback(() => {
    if (!editor) return;
    const attrs = editor.getAttributes('link') as {
      href?: unknown;
      target?: unknown;
      rel?: unknown;
      title?: unknown;
    };
    const current = sanitizeLinkValue({
      href: typeof attrs.href === 'string' ? attrs.href : '',
      target: attrs.target === '_blank' ? '_blank' : '_self',
      rel: typeof attrs.rel === 'string' ? attrs.rel : undefined,
      title: typeof attrs.title === 'string' ? attrs.title : undefined,
    });
    setLinkPickerValue(current ?? { href: '', target: '_self' });
    setAiPanelOpen(false);
    setLinkPickerOpen((open) => !open);
  }, [editor]);

  const applyLink = useCallback(
    (value: LinkValue | null) => {
      if (!editor) return;
      handleSave();
      setLinkPickerValue(value);
      if (!value) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: value.href,
          target: value.target,
          rel: value.rel,
          title: value.title,
        })
        .run();
    },
    [editor, handleSave],
  );

  const runToolbarCommand = useCallback(
    (command: () => void) => {
      handleSave();
      command();
    },
    [handleSave],
  );

  const toolbarPlacement = toolbarBelow ? 'below' : 'above';

  return (
    <div
      ref={containerRef}
      data-builder-inline-text-editor="true"
      className={styles.inlineTextEditorShell}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={() => {
        isComposingRef.current = false;
        closeController.compositionEnd();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ── Floating Toolbar ─────────────────────────────────────── */}
      {editor ? (
        <div
          data-builder-inline-text-toolbar="true"
          role="toolbar"
          aria-label={copy.toolbarAriaLabel}
          className={styles.inlineTextToolbar}
          data-placement={toolbarPlacement}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            if (!(event.target instanceof HTMLButtonElement)) return;
            event.preventDefault();
            event.stopPropagation();
            if (toolbarSelectionRef.current) {
              editor.commands.setTextSelection(toolbarSelectionRef.current);
              toolbarSelectionRef.current = null;
            }
            event.target.click();
          }}
        >
          {/* Bold / Italic / Underline / Strikethrough */}
          <button
            type="button"
            aria-label={copy.boldAriaLabel}
            aria-pressed={editor.isActive('bold')}
            className={toolbarButtonClassName(editor.isActive('bold'))}
            title={copy.boldTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleBold().run())}
          >
            B
          </button>
          <button
            type="button"
            aria-label={copy.italicAriaLabel}
            aria-pressed={editor.isActive('italic')}
            className={toolbarButtonClassName(editor.isActive('italic'), styles.inlineTextToolbarButtonItalic)}
            title={copy.italicTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleItalic().run())}
          >
            I
          </button>
          <button
            type="button"
            aria-label={copy.underlineAriaLabel}
            aria-pressed={editor.isActive('underline')}
            className={toolbarButtonClassName(editor.isActive('underline'), styles.inlineTextToolbarButtonUnderline)}
            title={copy.underlineTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleUnderline().run())}
          >
            U
          </button>
          <button
            type="button"
            aria-label={copy.strikethroughAriaLabel}
            aria-pressed={editor.isActive('strike')}
            className={toolbarButtonClassName(editor.isActive('strike'), styles.inlineTextToolbarButtonStrike)}
            title={copy.strikethroughTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleStrike().run())}
          >
            S
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Headings */}
          <button
            type="button"
            aria-label={copy.heading1AriaLabel}
            aria-pressed={editor.isActive('heading', { level: 1 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 1 }))}
            title={copy.heading1Title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          >
            H1
          </button>
          <button
            type="button"
            aria-label={copy.heading2AriaLabel}
            aria-pressed={editor.isActive('heading', { level: 2 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 2 }))}
            title={copy.heading2Title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          >
            H2
          </button>
          <button
            type="button"
            aria-label={copy.heading3AriaLabel}
            aria-pressed={editor.isActive('heading', { level: 3 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 3 }))}
            title={copy.heading3Title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          >
            H3
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Lists */}
          <button
            type="button"
            aria-label={copy.bulletListAriaLabel}
            aria-pressed={editor.isActive('bulletList')}
            className={toolbarButtonClassName(editor.isActive('bulletList'))}
            title={copy.bulletListTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleBulletList().run())}
          >
            &bull;
          </button>
          <button
            type="button"
            aria-label={copy.numberedListAriaLabel}
            aria-pressed={editor.isActive('orderedList')}
            className={toolbarButtonClassName(editor.isActive('orderedList'))}
            title={copy.numberedListTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runToolbarCommand(() => editor.chain().focus().toggleOrderedList().run())}
          >
            1.
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Link */}
          <button
            ref={linkButtonRef}
            type="button"
            aria-label={copy.linkAriaLabel}
            aria-pressed={editor.isActive('link')}
            className={toolbarButtonClassName(editor.isActive('link'))}
            title={copy.linkTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleLink}
          >
            {copy.linkButtonText}
          </button>
          {linkPickerOpen ? (
            <div
              role="dialog"
              aria-label={copy.linkPopoverAriaLabel}
              className={styles.inlineTextLinkPopover}
              data-placement={toolbarPlacement}
              onMouseDown={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <LinkPicker value={linkPickerValue} onChange={applyLink} locale={locale} />
            </div>
          ) : null}

          <span className={styles.inlineTextToolbarDivider} />

          <button
            ref={aiButtonRef}
            type="button"
            aria-label={copy.aiAssistantAriaLabel}
            aria-expanded={aiPanelOpen}
            data-builder-inline-text-ai="true"
            className={toolbarButtonClassName(aiPanelOpen)}
            title={copy.aiAssistantTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              handleSave();
              setLinkPickerOpen(false);
              setAiPanelOpen((value) => !value);
            }}
          >
            AI
          </button>
          {aiPanelOpen ? (
            <AiTextAssistantPanel
              sourceText={editor?.getText() ?? ''}
              sourceLocale={aiLocale}
              siteName={aiSiteName}
              brandTone={aiBrandTone}
              elementHint={aiElementHint}
              placement={toolbarBelow ? 'above' : 'below'}
              onApply={(text) => {
                if (!editor) return;
                editor.chain().focus().setContent(text, { emitUpdate: true }).run();
                handleSave();
                closeNestedSurface('ai');
              }}
              onClose={() => closeNestedSurface('ai')}
            />
          ) : null}

          <span className={styles.inlineTextToolbarDivider} />

          <button
            type="button"
            aria-label={copy.cancelAriaLabel}
            aria-keyshortcuts="Escape"
            data-builder-inline-text-action="cancel"
            className={`${styles.inlineTextToolbarButton} ${styles.inlineTextToolbarActionButton} ${styles.inlineTextToolbarButtonCancel}`}
            title={copy.cancelTitle}
            onMouseDown={(event) => event.preventDefault()}
            onClick={cancelAndBlur}
          >
            {copy.cancelButtonText}
          </button>
          <button
            type="button"
            aria-label={copy.commitAriaLabel}
            aria-keyshortcuts="Control+Enter Meta+Enter"
            data-builder-inline-text-action="commit"
            className={`${styles.inlineTextToolbarButton} ${styles.inlineTextToolbarActionButton} ${styles.inlineTextToolbarButtonCommit}`}
            title={copy.commitTitle.replace('Enter', '⌘/Ctrl+Enter')}
            onMouseDown={(event) => event.preventDefault()}
            onClick={commitAndBlur}
          >
            {copy.commitButtonText}
          </button>
        </div>
      ) : null}

      <EditorContent editor={editor} data-builder-inline-text-content="true" />
    </div>
  );
}
