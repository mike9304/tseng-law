'use client';

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Locale } from '@/lib/locales';
import { getFunctionsCopy } from './functions-copy';
import { FunctionCodeEditor } from './FunctionCodeEditor';
import { FunctionEditorToolbar } from './FunctionEditorToolbar';
import { FunctionListPanel } from './FunctionListPanel';
import { FunctionMetadataForm } from './FunctionMetadataForm';
import { FunctionQuickDocs } from './FunctionQuickDocs';
import { FunctionRunLogsPanel } from './FunctionRunLogsPanel';
import {
  EDITOR_STYLE,
  PAGE_STYLE,
} from './functions-admin-styles';
import type {
  BuilderDevLogEntry,
  BuilderFunctionRecord,
  FunctionMutationResponse,
  FunctionsResponse,
  InvokeResponse,
  LogsResponse,
} from './functions-admin-types';
import { createEmptyFunctionDraft, formatFunctionResult } from './functions-admin-utils';

const SANDBOX_NOTICE_STYLE: CSSProperties = {
  margin: '0 16px 12px',
  padding: '10px 12px',
  border: '1px solid #f59e0b',
  borderRadius: 8,
  background: '#fffbeb',
  color: '#92400e',
  fontSize: 13,
  lineHeight: 1.5,
};

export default function FunctionsAdmin({ locale }: { locale: Locale }) {
  const copy = getFunctionsCopy(locale);
  const [functions, setFunctions] = useState<BuilderFunctionRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [draft, setDraft] = useState<BuilderFunctionRecord>(() => createEmptyFunctionDraft());
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [invokeResult, setInvokeResult] = useState('');
  const [logs, setLogs] = useState<BuilderDevLogEntry[]>([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [aiUndoCode, setAiUndoCode] = useState<string | null>(null);

  const selectedFunction = useMemo(
    () => functions.find((entry) => entry.id === selectedId) ?? null,
    [functions, selectedId],
  );
  const invokePath = `/api/builder/dev/functions/${draft.slug || '{slug}'}/invoke`;
  const curlExample = `curl -X POST ${invokePath}`;

  const dirty = selectedFunction
    ? (
      selectedFunction.name !== draft.name
      || selectedFunction.slug !== draft.slug
      || selectedFunction.code !== draft.code
      || selectedFunction.enabled !== draft.enabled
    )
    : Boolean(draft.name.trim() || draft.slug.trim() || draft.code.trim());

  const loadFunctions = useCallback(async () => {
    setError('');
    const response = await fetch('/api/builder/dev/functions', { cache: 'no-store' });
    const body = (await response.json().catch(() => null)) as FunctionsResponse | null;
    if (!response.ok || !body || body.ok !== true) {
      setError(body && body.ok === false ? body.error ?? '함수 목록을 불러오지 못했습니다.' : '함수 목록을 불러오지 못했습니다.');
      return;
    }
    setFunctions(body.functions);
    if (!selectedId && body.functions[0]) {
      setSelectedId(body.functions[0].id);
      setDraft(body.functions[0]);
    }
  }, [selectedId]);

  const loadLogs = useCallback(async () => {
    const response = await fetch('/api/builder/dev/logs?source=function&limit=8', { cache: 'no-store' });
    const body = (await response.json().catch(() => null)) as LogsResponse | null;
    if (response.ok && body?.ok === true) {
      setLogs(body.entries);
    }
  }, []);

  useEffect(() => {
    void loadFunctions();
    void loadLogs();
  }, [loadFunctions, loadLogs]);

  const startNew = useCallback(() => {
    const next = createEmptyFunctionDraft();
    setSelectedId('');
    setDraft(next);
    setInvokeResult('');
    setAssistantOpen(false);
    setAiUndoCode(null);
    setStatus(copy.newFunctionStatus);
    setError('');
  }, [copy.newFunctionStatus]);

  const selectFunction = useCallback((entry: BuilderFunctionRecord) => {
    setSelectedId(entry.id);
    setDraft(entry);
    setInvokeResult('');
    setAssistantOpen(false);
    setAiUndoCode(null);
    setStatus('');
    setError('');
  }, []);

  const saveFunction = useCallback(async () => {
    setPending(true);
    setStatus('');
    setError('');
    try {
      const response = await fetch(selectedId ? `/api/builder/dev/functions/${encodeURIComponent(selectedId)}` : '/api/builder/dev/functions', {
        method: selectedId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          slug: draft.slug,
          code: draft.code,
          enabled: draft.enabled,
        }),
      });
      const body = (await response.json().catch(() => null)) as FunctionMutationResponse | null;
      if (!response.ok || !body || body.ok !== true) {
        const message = body && body.ok === false
          ? body.issue?.message ?? body.error ?? copy.saveError
          : copy.saveError;
        setError(message);
        return;
      }
      setDraft(body.function);
      setAiUndoCode(null);
      setSelectedId(body.function.id);
      setFunctions((current) => {
        const index = current.findIndex((entry) => entry.id === body.function.id);
        if (index === -1) return [...current, body.function].sort((a, b) => a.slug.localeCompare(b.slug));
        const next = [...current];
        next[index] = body.function;
        return next.sort((a, b) => a.slug.localeCompare(b.slug));
      });
      setStatus(copy.saveSuccess);
    } finally {
      setPending(false);
    }
  }, [copy.saveError, copy.saveSuccess, draft.code, draft.enabled, draft.name, draft.slug, selectedId]);

  const undoAiApply = useCallback(() => {
    if (aiUndoCode === null) return;
    setDraft((current) => ({ ...current, code: aiUndoCode }));
    setAiUndoCode(null);
    setStatus(copy.undoAiSuccess);
  }, [aiUndoCode, copy.undoAiSuccess]);

  const invokeFunction = useCallback(async () => {
    if (!selectedId) {
      setError(copy.saveBeforeInvoke);
      return;
    }
    setPending(true);
    setStatus('');
    setError('');
    setInvokeResult('');
    try {
      const response = await fetch(`/api/builder/dev/functions/${encodeURIComponent(selectedId)}/invoke`, {
        method: 'POST',
      });
      const body = (await response.json().catch(() => null)) as InvokeResponse | null;
      if (!response.ok || !body || body.ok !== true) {
        setError(body && body.ok === false ? body.error ?? copy.invokeError : copy.invokeError);
        return;
      }
      setInvokeResult(formatFunctionResult(body.result));
      setStatus(copy.invokeSuccess(body.logs.length));
      await loadLogs();
    } finally {
      setPending(false);
    }
  }, [copy, loadLogs, selectedId]);

  const deleteFunction = useCallback(async () => {
    if (!selectedId) return;
    setPending(true);
    setError('');
    setStatus('');
    try {
      const response = await fetch(`/api/builder/dev/functions/${encodeURIComponent(selectedId)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setError(copy.deleteError);
        return;
      }
      setFunctions((current) => current.filter((entry) => entry.id !== selectedId));
      startNew();
      setStatus(copy.deleteSuccess);
    } finally {
      setPending(false);
    }
  }, [copy.deleteError, copy.deleteSuccess, selectedId, startNew]);

  return (
    <div style={PAGE_STYLE} data-builder-dev-functions-admin="true">
      <FunctionListPanel
        copy={copy}
        functions={functions}
        locale={locale}
        selectedId={selectedId}
        onCreate={startNew}
        onSelect={selectFunction}
      />

      <section style={EDITOR_STYLE} aria-label={copy.editFunction}>
        <p
          role="status"
          aria-label={copy.sandboxNotice}
          data-builder-dev-disclosure="function-sandbox"
          style={SANDBOX_NOTICE_STYLE}
        >
          <strong>DEMO</strong>
          <span style={{ marginLeft: 6 }}>{copy.sandboxNotice}</span>
        </p>

        <FunctionEditorToolbar
          aiUndoAvailable={aiUndoCode !== null}
          copy={copy}
          dirty={dirty}
          pending={pending}
          selected={Boolean(selectedId)}
          onDelete={deleteFunction}
          onInvoke={invokeFunction}
          onSave={saveFunction}
          onToggleAssistant={() => setAssistantOpen((open) => !open)}
          onUndoAi={undoAiApply}
        />

        <FunctionMetadataForm
          copy={copy}
          draft={draft}
          onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
        />

        <FunctionQuickDocs copy={copy} curlExample={curlExample} invokePath={invokePath} locale={locale} />

        <FunctionCodeEditor
          assistantOpen={assistantOpen}
          code={draft.code}
          copy={copy}
          locale={locale}
          slug={draft.slug}
          onApplyAiFix={(nextCode) => {
            setAiUndoCode(draft.code);
            setDraft((current) => ({ ...current, code: nextCode }));
            setStatus(copy.aiApplySuccess);
          }}
          onChangeCode={(nextCode) => {
            setAiUndoCode(null);
            setDraft((current) => ({ ...current, code: nextCode }));
          }}
          onCloseAssistant={() => setAssistantOpen(false)}
        />

        {error ? <p role="alert" style={{ margin: '0 16px 12px', color: '#b91c1c', fontSize: 13 }}>{error}</p> : null}
        {status ? <p style={{ margin: '0 16px 12px', color: '#047857', fontSize: 13 }} data-builder-dev-function-status="true">{status}</p> : null}

        <FunctionRunLogsPanel copy={copy} invokeResult={invokeResult} logs={logs} />
      </section>
    </div>
  );
}
