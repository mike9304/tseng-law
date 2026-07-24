'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
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
import { createColumnEditorExtensions } from '@/components/builder/columns/column-editor-extensions';
import {
  serializeEditorMarkdown,
  type RichTextJson,
} from '@/lib/builder/columns/serialize-markdown';
import { resolveTypography } from '@/lib/builder/columns/typography';
import type { ColumnTypography } from '@/lib/builder/columns/types';
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
  initialTypography?: ColumnTypography | null;
  typography?: ColumnTypography | null;
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
}

const AUTOSAVE_DEBOUNCE_MS = 1000;

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildAutoSummary(title: string, bodyMarkdown: string, bodyHtml: string): string {
  const plainBody = (bodyMarkdown || stripHtml(bodyHtml)).replace(/\s+/g, ' ').trim();
  const source = plainBody || title.trim();
  return source.slice(0, 180);
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={active ? 'is-active' : ''}
      aria-pressed={typeof active === 'boolean' ? active : undefined}
      aria-label={ariaLabel ?? label}
    >
      {label}
    </button>
  );
}

export default function ColumnEditor({
  slug,
  locale,
  initialContent,
  initialTypography,
  typography,
  onSaveStatus,
}: ColumnEditorProps) {
  const copy = getColumnEditCopy(locale);
  const [title, setTitle] = useState(initialContent.title);
  const [summary, setSummary] = useState(initialContent.summary);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');
  const [busy, setBusy] = useState(false);
  const [, setSelectionTick] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const hydratedRef = useRef(false);
  const saveCoordinatorRef = useRef(new InflightSaveCoordinator());
  const publishBusyRef = useRef(false);

  const resolvedTypography = useMemo(
    () => resolveTypography(locale, typography ?? initialTypography),
    [locale, typography, initialTypography],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createColumnEditorExtensions(copy.editor.bodyPlaceholder),
    content: initialContent.bodyHtml || '<p></p>',
    editorProps: {
      attributes: {
        class: `column-editor-body ${resolvedTypography.className}`,
        style: Object.entries(resolvedTypography.cssVars)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; '),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const root = editor.view.dom as HTMLElement;
    // Replace prior typography classes while keeping editor chrome classes.
    Array.from(root.classList)
      .filter((name) => name.startsWith('column-typo--'))
      .forEach((name) => root.classList.remove(name));
    root.classList.add(resolvedTypography.className);
    Object.entries(resolvedTypography.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [editor, resolvedTypography]);

  useEffect(() => {
    if (!editor) return;
    const bump = () => setSelectionTick((value) => value + 1);
    editor.on('selectionUpdate', bump);
    editor.on('transaction', bump);
    return () => {
      editor.off('selectionUpdate', bump);
      editor.off('transaction', bump);
    };
  }, [editor]);

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

      <div className="column-editor-toolbar" role="toolbar" aria-label={copy.editor.toolbarAria}>
        <ToolbarButton
          label="P"
          active={Boolean(editor?.isActive('paragraph'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        />
        <ToolbarButton
          label="H1"
          active={Boolean(editor?.isActive('heading', { level: 1 }))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarButton
          label="H2"
          active={Boolean(editor?.isActive('heading', { level: 2 }))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={Boolean(editor?.isActive('heading', { level: 3 }))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="B"
          active={Boolean(editor?.isActive('bold'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          ariaLabel={copy.editor.toolbarButtons.bold}
        />
        <ToolbarButton
          label="I"
          active={Boolean(editor?.isActive('italic'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          ariaLabel={copy.editor.toolbarButtons.italic}
        />
        <ToolbarButton
          label="U"
          active={Boolean(editor?.isActive('underline'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          ariaLabel={copy.editor.toolbarButtons.underline}
        />
        <ToolbarButton
          label="-"
          active={Boolean(editor?.isActive('bulletList'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="1."
          active={Boolean(editor?.isActive('orderedList'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label={copy.editor.toolbarButtons.blockquote}
          active={Boolean(editor?.isActive('blockquote'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label={copy.editor.toolbarButtons.codeBlock}
          active={Boolean(editor?.isActive('codeBlock'))}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          label={copy.editor.toolbarButtons.horizontalRule}
          disabled={controlsDisabled}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        />
        <ToolbarButton
          label={copy.editor.toolbarButtons.link}
          active={Boolean(editor?.isActive('link'))}
          disabled={controlsDisabled}
          onClick={() => {
            const url = prompt(copy.editor.linkPrompt);
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
        />
        <ToolbarButton
          label={copy.editor.imageButton}
          disabled={controlsDisabled}
          onClick={() => setAssetLibraryOpen(true)}
          ariaLabel={copy.editor.imageButtonAria}
        />
        <ToolbarButton
          label={copy.editor.toolbarButtons.undo}
          disabled={controlsDisabled || !editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        />
        <ToolbarButton
          label={copy.editor.toolbarButtons.redo}
          disabled={controlsDisabled || !editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        />
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
