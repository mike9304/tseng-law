'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
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

  return (
    <div
      ref={containerRef}
      style={{
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
      <EditorContent editor={editor} />
    </div>
  );
}
