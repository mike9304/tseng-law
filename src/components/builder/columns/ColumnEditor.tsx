'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import ColumnTranslationStatusAlert from '@/components/builder/translations/ColumnTranslationStatusAlert';

interface ColumnEditorProps {
  slug: string;
  locale: string;
  initialContent: {
    title: string;
    summary: string;
    bodyHtml: string;
    bodyMarkdown: string;
  };
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
}

const AUTOSAVE_DEBOUNCE_MS = 1000;

export default function ColumnEditor({
  slug,
  locale,
  initialContent,
  onSaveStatus,
}: ColumnEditorProps) {
  const [title, setTitle] = useState(initialContent.title);
  const [summary, setSummary] = useState(initialContent.summary);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const hydratedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } }),
      Image,
      Underline,
      Placeholder.configure({ placeholder: '칼럼 본문을 여기에 작성하세요...' }),
    ],
    content: initialContent.bodyHtml || '<p></p>',
    editorProps: {
      attributes: {
        class: 'column-editor-body',
      },
    },
  });

  const buildPayload = useCallback(() => {
    if (!editor) return;
    const bodyHtml = editor.getHTML();
    const bodyMarkdown = editor.getText();
    const payload = JSON.stringify({ title, summary, bodyHtml, bodyMarkdown });
    return { payload, bodyHtml, bodyMarkdown };
  }, [editor, title, summary]);

  const save = useCallback(async () => {
    const nextPayload = buildPayload();
    if (!nextPayload) return;
    const { payload, bodyHtml, bodyMarkdown } = nextPayload;
    if (!hydratedRef.current) {
      lastSavedRef.current = payload;
      hydratedRef.current = true;
      return;
    }
    if (payload === lastSavedRef.current) return;

    setSaveStatus('saving');
    onSaveStatus?.('saving');
    try {
      const res = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, summary, bodyHtml, bodyMarkdown }),
        },
      );
      if (res.ok) {
        lastSavedRef.current = payload;
        setSaveStatus('saved');
        onSaveStatus?.('saved');
      } else {
        setSaveStatus('error');
        onSaveStatus?.('error');
      }
    } catch {
      setSaveStatus('error');
      onSaveStatus?.('error');
    }
  }, [buildPayload, slug, locale, title, summary, onSaveStatus]);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      save();
    }, AUTOSAVE_DEBOUNCE_MS);
  }, [save]);

  useEffect(() => {
    if (!editor) return;
    const nextPayload = buildPayload();
    if (nextPayload && !hydratedRef.current) {
      lastSavedRef.current = nextPayload.payload;
      hydratedRef.current = true;
    }
    const handler = () => scheduleSave();
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, buildPayload, scheduleSave]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    scheduleSave();
  }, [title, summary, scheduleSave]);

  const handlePublish = useCallback(async () => {
    await save();
    setSaveStatus('saving');
    onSaveStatus?.('saving');
    try {
      const res = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}/publish?locale=${encodeURIComponent(locale)}`,
        { method: 'POST' },
      );
      if (res.ok) {
        setSaveStatus('saved');
        onSaveStatus?.('saved');
        alert('발행 완료! AI 상담사 인덱싱이 백그라운드에서 진행됩니다.');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`발행 실패: ${(data as { error?: string }).error || res.status}`);
        setSaveStatus('error');
        onSaveStatus?.('error');
      }
    } catch {
      alert('발행 중 네트워크 오류가 발생했습니다.');
      setSaveStatus('error');
      onSaveStatus?.('error');
    }
  }, [save, slug, locale, onSaveStatus]);

  return (
    <div className="column-editor-container">
      <div className="column-editor-topbar">
        <div className="column-editor-topbar-left">
          <span className="column-editor-slug">/{slug}</span>
          <span className="column-editor-locale">{locale}</span>
          <span className={`column-editor-save-state is-${saveStatus}`}>
            {saveStatus === 'saving' ? 'Saving' : saveStatus === 'error' ? 'Save failed' : 'Saved'}
          </span>
        </div>
        <div className="column-editor-topbar-right">
          <ColumnTranslationStatusAlert slug={slug} routeLocale={locale} />
          <a
            className="column-editor-btn-save"
            href={`/${locale}/columns/${encodeURIComponent(slug)}`}
            target="_blank"
            rel="noreferrer"
          >
            공개 페이지
          </a>
          <button type="button" className="column-editor-btn-save" onClick={() => save()}>
            저장
          </button>
          <button type="button" className="column-editor-btn-publish" onClick={handlePublish}>
            발행
          </button>
        </div>
      </div>

      <div className="column-editor-fields">
        <label className="column-editor-field">
          <input
            className="column-editor-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="칼럼 제목"
          />
        </label>
        <label className="column-editor-field">
          <textarea
            className="column-editor-summary-input"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="검색 결과 / AI 상담사 참조 시 노출되는 요약"
            rows={2}
          />
        </label>
      </div>

      <div className="column-editor-toolbar">
        <button
          type="button"
          onClick={() => editor?.chain().focus().setParagraph().run()}
          className={editor?.isActive('paragraph') ? 'is-active' : ''}
        >
          P
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive('underline') ? 'is-active' : ''}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'is-active' : ''}
        >
          -
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'is-active' : ''}
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'is-active' : ''}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive('codeBlock') ? 'is-active' : ''}
        >
          Code
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          Line
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('링크 URL:');
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          className={editor?.isActive('link') ? 'is-active' : ''}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('이미지 URL:');
            if (url) editor?.chain().focus().setImage({ src: url }).run();
          }}
        >
          Img
        </button>
        <button
          type="button"
          onClick={() => {
            const html = prompt('HTML snippet:');
            if (html) editor?.chain().focus().insertContent(html).run();
          }}
        >
          HTML
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
