'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import ColumnTranslationStatusAlert from '@/components/builder/translations/ColumnTranslationStatusAlert';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import { getColumnEditCopy } from '@/components/builder/columns/column-edit-copy';
import {
  executeColumnPublish,
  executeColumnSave,
  InflightSaveCoordinator,
  mapColumnMutationError,
  readMutationErrorBody,
  withPublishBusyLock,
  type SaveOutcome,
} from '@/components/builder/columns/column-editor-ops';
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
  const copy = getColumnEditCopy(locale);
  const [title, setTitle] = useState(initialContent.title);
  const [summary, setSummary] = useState(initialContent.summary);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [busy, setBusy] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const hydratedRef = useRef(false);
  const saveCoordinatorRef = useRef(new InflightSaveCoordinator());
  const publishBusyRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } },
      }),
      Image,
      Placeholder.configure({ placeholder: copy.editor.bodyPlaceholder }),
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
    const body = { title, summary: nextSummary, bodyHtml, bodyMarkdown };
    const payload = JSON.stringify(body);
    return { payload, body, summary: nextSummary, bodyHtml, bodyMarkdown };
  }, [editor, title, summary]);

  const mapSaveHttpError = useCallback(async (res: Response) => {
    const body = await readMutationErrorBody(res);
    return mapColumnMutationError(
      {
        kind: 'save',
        status: res.status,
        error: body.error,
        errorCode: body.errorCode,
      },
      copy.editor.saveAlerts,
    );
  }, [copy.editor.saveAlerts]);

  const mapPublishHttpError = useCallback(async (res: Response) => {
    const body = await readMutationErrorBody(res);
    return mapColumnMutationError(
      {
        kind: 'publish',
        status: res.status,
        error: body.error,
        errorCode: body.errorCode,
      },
      copy.editor.publishAlerts,
    );
  }, [copy.editor.publishAlerts]);

  const cancelDebounce = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  }, []);

  const save = useCallback(async (options?: { manageBusy?: boolean }): Promise<SaveOutcome> => {
    const manageBusy = options?.manageBusy !== false;
    const nextPayload = buildPayload();
    if (!nextPayload) return { status: 'noop' };
    const { payload, body } = nextPayload;

    if (!hydratedRef.current) {
      lastSavedRef.current = payload;
      hydratedRef.current = true;
      return { status: 'success', payloadKey: payload };
    }

    return saveCoordinatorRef.current.run(payload, async () => {
      // Re-check after joining / waiting — another flight may have saved this payload.
      if (payload === lastSavedRef.current) {
        return { status: 'noop' };
      }

      if (manageBusy) setBusy(true);
      setSaveStatus('saving');
      onSaveStatus?.('saving');

      const outcome = await executeColumnSave({
        payloadKey: payload,
        lastSavedKey: lastSavedRef.current,
        hydrated: true,
        skipIfUnchanged: true,
        request: () => fetch(
          `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          },
        ),
        mapHttpError: mapSaveHttpError,
        mapNetworkError: () => copy.editor.saveAlerts.networkError,
      });

      if (outcome.status === 'success') {
        lastSavedRef.current = outcome.payloadKey;
        setSaveStatus('saved');
        onSaveStatus?.('saved');
      } else if (outcome.status === 'error') {
        setSaveStatus('error');
        onSaveStatus?.('error');
      } else {
        setSaveStatus('saved');
        onSaveStatus?.('saved');
      }

      if (manageBusy) setBusy(false);
      return outcome;
    });
  }, [buildPayload, slug, locale, onSaveStatus, mapSaveHttpError, copy.editor.saveAlerts.networkError]);

  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void save();
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
    await withPublishBusyLock(
      {
        isBusy: () => publishBusyRef.current,
        setBusy: (next) => {
          publishBusyRef.current = next;
          setBusy(next);
        },
      },
      async () => {
        setSaveStatus('saving');
        onSaveStatus?.('saving');

        const result = await executeColumnPublish({
          cancelDebounce,
          isPublishBusy: false,
          // Publish owns busy UI for the whole save→publish sequence.
          ensureSaved: () => save({ manageBusy: false }),
          requestPublish: () => fetch(
            `/api/builder/columns/${encodeURIComponent(slug)}/publish?locale=${encodeURIComponent(locale)}`,
            { method: 'POST' },
          ),
          mapHttpError: mapPublishHttpError,
          mapNetworkError: () => copy.editor.publishAlerts.networkError,
        });

        if (result.status === 'success') {
          setSaveStatus('saved');
          onSaveStatus?.('saved');
          const redirectCount = result.data.slugRedirect?.redirects?.length
            ?? (result.data.slugRedirect?.redirect ? 1 : 0);
          const redirectCopy = redirectCount > 0
            ? copy.editor.publishAlerts.redirect(redirectCount)
            : result.data.slugRedirect?.status === 'skipped'
              ? copy.editor.publishAlerts.redirectSkipped(result.data.slugRedirect.skipReason ?? 'no change')
              : '';
          alert(`${copy.editor.publishAlerts.success}${redirectCopy}`);
        } else if (result.status === 'save_failed' || result.status === 'error') {
          alert(result.message);
          setSaveStatus('error');
          onSaveStatus?.('error');
        }
      },
    );
  }, [
    cancelDebounce,
    save,
    slug,
    locale,
    onSaveStatus,
    mapPublishHttpError,
    copy.editor.publishAlerts,
  ]);

  const handleManualSave = useCallback(async () => {
    cancelDebounce();
    const outcome = await save();
    if (outcome.status === 'error') {
      alert(outcome.message);
    }
  }, [cancelDebounce, save]);

  const insertAssetImage = useCallback((asset: BuilderAssetListItem) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: asset.url, alt: asset.filename, title: asset.filename })
      .run();
  }, [editor]);

  const controlsDisabled = busy || publishBusyRef.current;

  return (
    <div className="column-editor-container">
      <div className="column-editor-topbar">
        <div className="column-editor-topbar-left">
          <span className="column-editor-slug">/{slug}</span>
          <span className="column-editor-locale">{locale}</span>
          <span className={`column-editor-save-state is-${saveStatus}`}>
            {saveStatus === 'saving'
              ? copy.editor.saveStateSaving
              : saveStatus === 'error'
                ? copy.editor.saveStateError
                : copy.editor.saveStateSaved}
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
            {copy.editor.publicPage}
          </a>
          <button
            type="button"
            className="column-editor-btn-save"
            onClick={() => { void handleManualSave(); }}
            disabled={controlsDisabled}
          >
            {copy.editor.save}
          </button>
          <button
            type="button"
            className="column-editor-btn-publish"
            onClick={() => { void handlePublish(); }}
            disabled={controlsDisabled}
          >
            {copy.editor.publish}
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
            placeholder={copy.editor.titlePlaceholder}
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
          {copy.editor.toolbarButtons.blockquote}
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive('codeBlock') ? 'is-active' : ''}
        >
          {copy.editor.toolbarButtons.codeBlock}
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          {copy.editor.toolbarButtons.horizontalRule}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt(copy.editor.linkPrompt);
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          className={editor?.isActive('link') ? 'is-active' : ''}
        >
          {copy.editor.toolbarButtons.link}
        </button>
        <button
          type="button"
          aria-label={copy.editor.imageButtonAria}
          onClick={() => setAssetLibraryOpen(true)}
        >
          {copy.editor.imageButton}
        </button>
      </div>

      <EditorContent editor={editor} />
      <details
        className="column-editor-summary-details column-editor-summary-details--after"
        open={summaryOpen}
        onToggle={(event) => setSummaryOpen(event.currentTarget.open)}
      >
        <summary>
          <span>{copy.editor.summary.label}</span>
          <strong>{summary.trim() ? copy.editor.summary.direct : copy.editor.summary.auto}</strong>
        </summary>
        <label className="column-editor-field">
          <textarea
            className="column-editor-summary-input"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={copy.editor.summary.placeholder}
            rows={2}
          />
          <small>{copy.editor.summary.help}</small>
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
