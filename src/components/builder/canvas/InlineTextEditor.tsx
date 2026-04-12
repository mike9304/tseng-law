'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

interface InlineTextEditorProps {
  initialText: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  align?: string;
  onSave: (html: string, plainText: string) => void;
  onBlur: () => void;
}

/* ── Toolbar styles ─────────────────────────────────────────────── */

const toolbarStyle: React.CSSProperties = {
  position: 'absolute',
  top: -44,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '4px 6px',
  background: '#fff',
  border: '1px solid #dfe5eb',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,.12)',
  zIndex: 9999,
  whiteSpace: 'nowrap' as const,
};

const toolbarBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  height: 28,
  padding: '0 6px',
  fontSize: '0.75rem',
  fontWeight: 700,
  border: '1px solid transparent',
  borderRadius: 6,
  background: 'transparent',
  color: '#334155',
  cursor: 'pointer',
  lineHeight: 1,
};

function toolbarBtnStyle(active: boolean): React.CSSProperties {
  return {
    ...toolbarBtnBase,
    background: active ? '#116dff' : 'transparent',
    color: active ? '#fff' : '#334155',
  };
}

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 20,
  background: '#dfe5eb',
  margin: '0 4px',
  flexShrink: 0,
};

/* ── Component ──────────────────────────────────────────────────── */

export default function InlineTextEditor({
  initialText,
  fontSize = 16,
  color = '#1f2937',
  fontWeight = 'regular',
  align = 'left',
  onSave,
  onBlur,
}: InlineTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toolbarBelow, setToolbarBelow] = useState(false);

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
    content: initialText.startsWith('<') ? initialText : `<p>${initialText}</p>`,
    autofocus: 'end',
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
    onSave(editor.getHTML(), editor.getText());
  }, [editor, onSave]);

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
    const url = window.prompt('URL 입력', '');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'text',
        border: '2px solid #3b82f6',
        borderRadius: 2,
        boxSizing: 'border-box',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ── Floating Toolbar ─────────────────────────────────────── */}
      {editor ? (
        <div style={{
          ...toolbarStyle,
          top: toolbarBelow ? 'auto' : -44,
          bottom: toolbarBelow ? -44 : 'auto',
        }}>
          {/* Bold / Italic / Underline / Strikethrough */}
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('bold'))}
            title="굵게 (Cmd+B)"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          >
            B
          </button>
          <button
            type="button"
            style={{ ...toolbarBtnStyle(editor.isActive('italic')), fontStyle: 'italic' }}
            title="기울임 (Cmd+I)"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          >
            I
          </button>
          <button
            type="button"
            style={{ ...toolbarBtnStyle(editor.isActive('underline')), textDecoration: 'underline' }}
            title="밑줄 (Cmd+U)"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          >
            U
          </button>
          <button
            type="button"
            style={{ ...toolbarBtnStyle(editor.isActive('strike')), textDecoration: 'line-through' }}
            title="취소선"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
          >
            S
          </button>

          <span style={dividerStyle} />

          {/* Headings */}
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('heading', { level: 1 }))}
            title="제목 1"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
          >
            H1
          </button>
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('heading', { level: 2 }))}
            title="제목 2"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          >
            H2
          </button>
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('heading', { level: 3 }))}
            title="제목 3"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
          >
            H3
          </button>

          <span style={dividerStyle} />

          {/* Lists */}
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('bulletList'))}
            title="글머리 기호 목록"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          >
            &bull;
          </button>
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('orderedList'))}
            title="번호 매기기 목록"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          >
            1.
          </button>

          <span style={dividerStyle} />

          {/* Link */}
          <button
            type="button"
            style={toolbarBtnStyle(editor.isActive('link'))}
            title="링크 삽입"
            onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          >
            Link
          </button>
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
