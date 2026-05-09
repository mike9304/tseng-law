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
import styles from './SandboxPage.module.css';

interface InlineTextEditorProps {
  initialText: string;
  initialRichText?: BuilderRichText;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  align?: string;
  onSave: (payload: { richText: BuilderRichText; plainText: string }) => void;
  onBlur: () => void;
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
  align = 'left',
  onSave,
  onBlur,
}: InlineTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSavedSignatureRef = useRef<string | null>(null);
  const [toolbarBelow, setToolbarBelow] = useState(false);
  const [linkPickerOpen, setLinkPickerOpen] = useState(false);
  const [linkPickerValue, setLinkPickerValue] = useState<LinkValue | null>(null);
  const initialContent = (initialRichText?.doc ?? richTextFromPlainText(initialText).doc) as JSONContent;

  // Determine whether toolbar should appear below the element
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setToolbarBelow(rect.top < 50);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: '텍스트 입력...' }),
    ],
    content: initialContent,
    autofocus: 'end',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: [
          `font-size: ${fontSize}px`,
          `color: ${color}`,
          `font-weight: ${fontWeight === 'bold' ? 700 : fontWeight === 'medium' ? 500 : 400}`,
          `text-align: ${align}`,
          'outline: none',
          'min-height: 1em',
          'width: 100%',
        ].join(';'),
      },
    },
  });

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
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleSave();
        onBlur();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleSave, onBlur]);

  useEffect(() => () => {
    handleSave();
  }, [handleSave]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSave();
        onBlur();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleSave, onBlur]);

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
    [editor],
  );

  const toolbarPlacement = toolbarBelow ? 'below' : 'above';

  return (
    <div
      ref={containerRef}
      data-builder-inline-text-editor="true"
      className={styles.inlineTextEditorShell}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ── Floating Toolbar ─────────────────────────────────────── */}
      {editor ? (
        <div
          data-builder-inline-text-toolbar="true"
          role="toolbar"
          aria-label="Inline text formatting"
          className={styles.inlineTextToolbar}
          data-placement={toolbarPlacement}
        >
          {/* Bold / Italic / Underline / Strikethrough */}
          <button
            type="button"
            aria-label="Bold"
            aria-pressed={editor.isActive('bold')}
            className={toolbarButtonClassName(editor.isActive('bold'))}
            title="굵게 (Cmd+B)"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          >
            B
          </button>
          <button
            type="button"
            aria-label="Italic"
            aria-pressed={editor.isActive('italic')}
            className={toolbarButtonClassName(editor.isActive('italic'), styles.inlineTextToolbarButtonItalic)}
            title="기울임 (Cmd+I)"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          >
            I
          </button>
          <button
            type="button"
            aria-label="Underline"
            aria-pressed={editor.isActive('underline')}
            className={toolbarButtonClassName(editor.isActive('underline'), styles.inlineTextToolbarButtonUnderline)}
            title="밑줄 (Cmd+U)"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          >
            U
          </button>
          <button
            type="button"
            aria-label="Strikethrough"
            aria-pressed={editor.isActive('strike')}
            className={toolbarButtonClassName(editor.isActive('strike'), styles.inlineTextToolbarButtonStrike)}
            title="취소선"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
          >
            S
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Headings */}
          <button
            type="button"
            aria-label="Heading 1"
            aria-pressed={editor.isActive('heading', { level: 1 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 1 }))}
            title="제목 1"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
          >
            H1
          </button>
          <button
            type="button"
            aria-label="Heading 2"
            aria-pressed={editor.isActive('heading', { level: 2 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 2 }))}
            title="제목 2"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          >
            H2
          </button>
          <button
            type="button"
            aria-label="Heading 3"
            aria-pressed={editor.isActive('heading', { level: 3 })}
            className={toolbarButtonClassName(editor.isActive('heading', { level: 3 }))}
            title="제목 3"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          >
            H3
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Lists */}
          <button
            type="button"
            aria-label="Bulleted list"
            aria-pressed={editor.isActive('bulletList')}
            className={toolbarButtonClassName(editor.isActive('bulletList'))}
            title="글머리 기호 목록"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          >
            &bull;
          </button>
          <button
            type="button"
            aria-label="Numbered list"
            aria-pressed={editor.isActive('orderedList')}
            className={toolbarButtonClassName(editor.isActive('orderedList'))}
            title="번호 매기기 목록"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          >
            1.
          </button>

          <span className={styles.inlineTextToolbarDivider} />

          {/* Link */}
          <button
            type="button"
            aria-label="Link"
            aria-pressed={editor.isActive('link')}
            className={toolbarButtonClassName(editor.isActive('link'))}
            title="링크 삽입"
            onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          >
            Link
          </button>
          {linkPickerOpen ? (
            <div
              role="dialog"
              aria-label="텍스트 링크 편집"
              className={styles.inlineTextLinkPopover}
              data-placement={toolbarPlacement}
              onMouseDown={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <LinkPicker value={linkPickerValue} onChange={applyLink} />
            </div>
          ) : null}
        </div>
      ) : null}

      <EditorContent editor={editor} data-builder-inline-text-content="true" />
    </div>
  );
}
