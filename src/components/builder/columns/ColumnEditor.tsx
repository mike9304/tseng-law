'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import ColumnTranslationStatusAlert from '@/components/builder/translations/ColumnTranslationStatusAlert';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';

interface ColumnEditorProps {
  slug: string;
  locale: Locale;
  initialContent: {
    title: string;
    summary: string;
    bodyHtml: string;
    bodyMarkdown: string;
  };
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
}

const AUTOSAVE_DEBOUNCE_MS = 1000;

type RichTextJson = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: RichTextJson[];
};

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildAutoSummary(title: string, bodyMarkdown: string, bodyHtml: string): string {
  const plainBody = (bodyMarkdown || stripHtml(bodyHtml)).replace(/\s+/g, ' ').trim();
  const source = plainBody || title.trim();
  return source.slice(0, 180);
}

function attrString(node: RichTextJson, key: string): string {
  const value = node.attrs?.[key];
  return typeof value === 'string' ? value : '';
}

function serializeInline(nodes: RichTextJson[] | undefined): string {
  return (nodes ?? []).map(serializeMarkdownNode).join('');
}

function applyMarkdownMarks(text: string, marks: RichTextJson['marks']): string {
  return (marks ?? []).reduce((current, mark) => {
    if (mark.type === 'bold') return `**${current}**`;
    if (mark.type === 'italic') return `*${current}*`;
    if (mark.type === 'code') return `\`${current}\``;
    if (mark.type === 'link') {
      const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : '';
      return href ? `[${current}](${href})` : current;
    }
    return current;
  }, text);
}

function serializeListItem(node: RichTextJson, index?: number): string {
  const marker = typeof index === 'number' ? `${index + 1}. ` : '- ';
  const body = (node.content ?? [])
    .map(serializeMarkdownNode)
    .filter(Boolean)
    .join('\n')
    .replace(/\n/g, '\n  ');
  return `${marker}${body}`;
}

function serializeMarkdownNode(node: RichTextJson): string {
  if (node.type === 'text') return applyMarkdownMarks(node.text ?? '', node.marks);
  if (node.type === 'paragraph') return serializeInline(node.content);
  if (node.type === 'heading') {
    const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 2;
    return `${'#'.repeat(Math.max(1, Math.min(6, level)))} ${serializeInline(node.content)}`.trim();
  }
  if (node.type === 'image') {
    const src = attrString(node, 'src');
    if (!src) return '';
    const alt = attrString(node, 'alt') || attrString(node, 'title');
    return `![${alt}](${src})`;
  }
  if (node.type === 'bulletList') {
    return (node.content ?? []).map((item) => serializeListItem(item)).join('\n');
  }
  if (node.type === 'orderedList') {
    return (node.content ?? []).map((item, index) => serializeListItem(item, index)).join('\n');
  }
  if (node.type === 'listItem') return serializeListItem(node);
  if (node.type === 'blockquote') {
    return (node.content ?? [])
      .map(serializeMarkdownNode)
      .join('\n')
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');
  }
  if (node.type === 'codeBlock') return `\`\`\`\n${serializeInline(node.content)}\n\`\`\``;
  if (node.type === 'horizontalRule') return '---';
  if (node.type === 'hardBreak') return '\n';
  return (node.content ?? []).map(serializeMarkdownNode).filter(Boolean).join('\n\n');
}

function serializeEditorMarkdown(doc: RichTextJson): string {
  return (doc.content ?? []).map(serializeMarkdownNode).filter(Boolean).join('\n\n').trim();
}

export default function ColumnEditor({
  slug,
  locale,
  initialContent,
  onSaveStatus,
}: ColumnEditorProps) {
  const [title, setTitle] = useState(initialContent.title);
  const [summary, setSummary] = useState(initialContent.summary);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false);
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
    const bodyPlainText = editor.getText();
    const bodyMarkdown = serializeEditorMarkdown(editor.getJSON() as RichTextJson);
    const nextSummary = summary.trim() || buildAutoSummary(title, bodyPlainText, bodyHtml);
    const payload = JSON.stringify({ title, summary: nextSummary, bodyHtml, bodyMarkdown });
    return { payload, summary: nextSummary, bodyHtml, bodyMarkdown };
  }, [editor, title, summary]);

  const save = useCallback(async () => {
    const nextPayload = buildPayload();
    if (!nextPayload) return;
    const { payload, summary: nextSummary, bodyHtml, bodyMarkdown } = nextPayload;
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
          body: JSON.stringify({ title, summary: nextSummary, bodyHtml, bodyMarkdown }),
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
  }, [buildPayload, slug, locale, title, onSaveStatus]);

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

  const insertAssetImage = useCallback((asset: BuilderAssetListItem) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: asset.url, alt: asset.filename, title: asset.filename })
      .run();
  }, [editor]);

  return (
    <div className="column-editor-container">
      <div className="column-editor-topbar">
        <div className="column-editor-topbar-left">
          <span className="column-editor-slug">/{slug}</span>
          <span className="column-editor-locale">{locale}</span>
          <span className={`column-editor-save-state is-${saveStatus}`}>
            {saveStatus === 'saving' ? '저장 중' : saveStatus === 'error' ? '저장 실패' : '저장됨'}
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
          인용
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive('codeBlock') ? 'is-active' : ''}
        >
          코드
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          구분선
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('링크 URL:');
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          className={editor?.isActive('link') ? 'is-active' : ''}
        >
          링크
        </button>
        <button
          type="button"
          aria-label="Image"
          onClick={() => setAssetLibraryOpen(true)}
        >
          사진
        </button>
      </div>

      <EditorContent editor={editor} />
      <details
        className="column-editor-summary-details column-editor-summary-details--after"
        open={summaryOpen}
        onToggle={(event) => setSummaryOpen(event.currentTarget.open)}
      >
        <summary>
          <span>목록 설명</span>
          <strong>{summary.trim() ? '직접 입력 사용 중' : '본문 앞부분으로 자동 생성'}</strong>
        </summary>
        <label className="column-editor-field">
          <textarea
            className="column-editor-summary-input"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="비워두면 본문 앞부분으로 자동 생성됩니다."
            rows={2}
          />
          <small>티스토리처럼 제목과 본문만 쓰면 자동으로 목록 설명이 저장됩니다. 필요한 경우에만 직접 입력하세요.</small>
        </label>
      </details>
      <AssetLibraryModal
        open={assetLibraryOpen}
        locale={locale}
        selectedUrl={null}
        onClose={() => setAssetLibraryOpen(false)}
        onSelect={insertAssetImage}
      />
    </div>
  );
}
