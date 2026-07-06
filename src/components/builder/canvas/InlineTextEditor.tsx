'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

/* ── Component ──────────────────────────────────────────────────── */

export default function InlineTextEditor({
  initialText,
  initialRichText,
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
  const lastSavedSignatureRef = useRef<string | null>(null);
  const closeModeRef = useRef<'commit' | 'cancel' | null>(null);
  const isComposingRef = useRef(false);
  const pendingBlurAfterCompositionRef = useRef(false);
  const [toolbarBelow, setToolbarBelow] = useState(false);
  const [linkPickerOpen, setLinkPickerOpen] = useState(false);
  const [linkPickerValue, setLinkPickerValue] = useState<LinkValue | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const initialContent = (initialRichText?.doc ?? richTextFromPlainText(initialText).doc) as JSONContent;

  // Determine whether toolbar should appear below the element
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setToolbarBelow(rect.top < 50);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: copy.placeholder }),
    ],
    content: initialContent,
    autofocus: 'all',
    immediatelyRender: false,
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (event.key !== 'Escape') return false;
        event.preventDefault();
        closeModeRef.current = 'cancel';
        pendingBlurAfterCompositionRef.current = false;
        isComposingRef.current = false;
        onCancel?.();
        onBlur();
        return true;
      },
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

  const handleSave = useCallback(() => {
    if (closeModeRef.current === 'cancel') return;
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

  const commitAndBlur = useCallback(() => {
    closeModeRef.current = 'commit';
    if (isComposingRef.current) {
      pendingBlurAfterCompositionRef.current = true;
      editor?.view.dom.dispatchEvent(new CompositionEvent('compositionend', {
        bubbles: true,
        data: '',
      }));
      window.setTimeout(() => {
        if (!pendingBlurAfterCompositionRef.current) return;
        pendingBlurAfterCompositionRef.current = false;
        isComposingRef.current = false;
        handleSave();
        onBlur();
      }, 0);
      return;
    }
    handleSave();
    onBlur();
  }, [editor, handleSave, onBlur]);

  const cancelAndBlur = useCallback(() => {
    closeModeRef.current = 'cancel';
    pendingBlurAfterCompositionRef.current = false;
    isComposingRef.current = false;
    onCancel?.();
    onBlur();
  }, [onBlur, onCancel]);

  useEffect(() => {
    if (!editor || lastSavedSignatureRef.current) return;
    const doc = sanitizeTipTapDoc(editor.getJSON()) ?? richTextFromPlainText(editor.getText()).doc;
    const plainText = extractPlainTextFromTipTapDoc(doc);
    lastSavedSignatureRef.current = JSON.stringify({ doc, plainText });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => handleSave();
    editor.on('blur', handler);
    return () => {
      editor.off('blur', handler);
    };
  }, [editor, handleSave]);

  useEffect(() => {
    const handlePointerDownOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        commitAndBlur();
      }
    };
    document.addEventListener('pointerdown', handlePointerDownOutside, true);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside, true);
  }, [commitAndBlur]);

  useEffect(() => () => {
    if (closeModeRef.current !== 'cancel') handleSave();
  }, [handleSave]);

  useEffect(() => {
    const handleEditorKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancelAndBlur();
        return;
      }
      const target = e.target instanceof Node ? e.target : null;
      const isEditorTarget = target ? Boolean(editor?.view.dom.contains(target)) : false;
      if (
        e.key === 'Enter'
        && isEditorTarget
        && !e.shiftKey
        && !e.metaKey
        && !e.ctrlKey
        && !e.altKey
        && !e.isComposing
        && !isComposingRef.current
      ) {
        e.preventDefault();
        e.stopPropagation();
        commitAndBlur();
      }
    };
    document.addEventListener('keydown', handleEditorKeyDown, true);
    return () => document.removeEventListener('keydown', handleEditorKeyDown, true);
  }, [cancelAndBlur, commitAndBlur, editor]);

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
        if (!pendingBlurAfterCompositionRef.current) return;
        pendingBlurAfterCompositionRef.current = false;
        window.setTimeout(() => {
          handleSave();
          onBlur();
        }, 0);
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
        >
          {/* Bold / Italic / Underline / Strikethrough */}
          <button
            type="button"
            aria-label={copy.boldAriaLabel}
            aria-pressed={editor.isActive('bold')}
            className={toolbarButtonClassName(editor.isActive('bold'))}
            title={copy.boldTitle}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleBold().run()); }}
          >
            B
          </button>
          <button
            type="button"
            aria-label={copy.italicAriaLabel}
            aria-pressed={editor.isActive('italic')}
            className={toolbarButtonClassName(editor.isActive('italic'), styles.inlineTextToolbarButtonItalic)}
            title={copy.italicTitle}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleItalic().run()); }}
          >
            I
          </button>
          <button
            type="button"
            aria-label={copy.underlineAriaLabel}
            aria-pressed={editor.isActive('underline')}
            className={toolbarButtonClassName(editor.isActive('underline'), styles.inlineTextToolbarButtonUnderline)}
            title={copy.underlineTitle}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleUnderline().run()); }}
          >
            U
          </button>
          <button
            type="button"
            aria-label={copy.strikethroughAriaLabel}
            aria-pressed={editor.isActive('strike')}
            className={toolbarButtonClassName(editor.isActive('strike'), styles.inlineTextToolbarButtonStrike)}
            title={copy.strikethroughTitle}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleStrike().run()); }}
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
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleHeading({ level: 1 }).run()); }}
          >
            H1
          </button>
          <button
            type="button"
            aria-label={copy.heading2AriaLabel}
            aria-pressed={editor.isActive('heading', { level: 2 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 2 }))}
            title={copy.heading2Title}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleHeading({ level: 2 }).run()); }}
          >
            H2
          </button>
          <button
            type="button"
            aria-label={copy.heading3AriaLabel}
            aria-pressed={editor.isActive('heading', { level: 3 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 3 }))}
            title={copy.heading3Title}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleHeading({ level: 3 }).run()); }}
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
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleBulletList().run()); }}
          >
            &bull;
          </button>
          <button
            type="button"
            aria-label={copy.numberedListAriaLabel}
            aria-pressed={editor.isActive('orderedList')}
            className={toolbarButtonClassName(editor.isActive('orderedList'))}
            title={copy.numberedListTitle}
            onMouseDown={(e) => { e.preventDefault(); runToolbarCommand(() => editor.chain().focus().toggleOrderedList().run()); }}
          >
            1.
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Link */}
          <button
            type="button"
            aria-label={copy.linkAriaLabel}
            aria-pressed={editor.isActive('link')}
            className={toolbarButtonClassName(editor.isActive('link'))}
            title={copy.linkTitle}
            onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
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
            type="button"
            aria-label={copy.aiAssistantAriaLabel}
            aria-expanded={aiPanelOpen}
            data-builder-inline-text-ai="true"
            className={toolbarButtonClassName(aiPanelOpen)}
            title={copy.aiAssistantTitle}
            onMouseDown={(event) => {
              event.preventDefault();
              handleSave();
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
                setAiPanelOpen(false);
              }}
              onClose={() => setAiPanelOpen(false)}
            />
          ) : null}
        </div>
      ) : null}

      <EditorContent editor={editor} data-builder-inline-text-content="true" />
    </div>
  );
}
