'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  computeDocumentDiff,
  formatDocumentDiffSummary,
  summarizeDiffNode,
  summarizeDocumentDiff,
  type DocumentDiff,
  type DocumentDiffSummary,
} from '@/lib/builder/canvas/document-diff';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import type {
  CheckResult,
  PublishCheckSuite,
} from '@/lib/builder/publish-gate/gate-runner';
import {
  checkBrokenLinks,
  checkEmptyContent,
  checkFormTarget,
  checkH1Count,
  checkImageAlt,
} from '@/lib/builder/publish-gate/checks';
import ModalShell from './ModalShell';

type PublishState = 'checking' | 'ready' | 'publishing' | 'success' | 'error';

interface DraftMeta {
  revision: number;
  savedAt: string;
  updatedBy?: string;
}

type ToastTone = 'success' | 'error';

type PreflightTone = 'ok' | 'warning' | 'blocker';

interface PreflightItem {
  key: string;
  label: string;
  detail: string;
  tone: PreflightTone;
  blockerCount: number;
  warningCount: number;
}

interface PublishErrorBody {
  error?: string;
  errors?: string[];
  blockers?: CheckResult[];
  current?: { revision?: number };
}

interface ScheduledPublishJob {
  jobId: string;
  scheduledAt: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  expectedDraftRevision?: number;
}

type PublishDiffState =
  | { status: 'idle' | 'loading' }
  | { status: 'missing'; message: string }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      diff: DocumentDiff;
      summary: DocumentDiffSummary;
      publishedRevision?: number;
      publishedRevisionId: string;
      publishedSavedAt?: string;
    };

function blockerSuite(blockers: CheckResult[]): PublishCheckSuite {
  return {
    results: blockers,
    hasBlocker: blockers.some((result) => result.severity === 'blocker'),
    blockerCount: blockers.filter((result) => result.severity === 'blocker').length,
    warningCount: blockers.filter((result) => result.severity === 'warning').length,
    infoCount: blockers.filter((result) => result.severity === 'info').length,
    checkedAt: new Date().toISOString(),
  };
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  margin: '16px 0 6px',
};

const checklistGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,
  marginTop: 12,
};

function checklistCardStyle(tone: PreflightTone): React.CSSProperties {
  const palette = tone === 'blocker'
    ? { background: '#fef2f2', border: '#fca5a5', color: '#991b1b' }
    : tone === 'warning'
      ? { background: '#fffbeb', border: '#fde68a', color: '#92400e' }
      : { background: '#f0fdf4', border: '#86efac', color: '#166534' };
  return {
    minHeight: 78,
    padding: '10px 12px',
    borderRadius: 10,
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
  };
}

const checklistLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: '0.8rem',
  fontWeight: 800,
};

const checklistDetailStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: '0.72rem',
  lineHeight: 1.35,
  opacity: 0.82,
};

const checklistStatusStyle: React.CSSProperties = {
  flexShrink: 0,
  padding: '2px 7px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.68)',
  fontSize: '0.66rem',
  fontWeight: 850,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

function severityBoxStyle(sev: 'blocker' | 'warning' | 'info'): React.CSSProperties {
  if (sev === 'blocker') {
    return {
      padding: '8px 12px',
      borderRadius: 8,
      background: '#fef2f2',
      color: '#991b1b',
      fontSize: '0.82rem',
      border: '1px solid #fca5a5',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    };
  }
  if (sev === 'warning') {
    return {
      padding: '8px 12px',
      borderRadius: 8,
      background: '#fffbeb',
      color: '#92400e',
      fontSize: '0.82rem',
      border: '1px solid #fde68a',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    };
  }
  return {
    padding: '8px 12px',
    borderRadius: 8,
    background: '#eff6ff',
    color: '#1e40af',
    fontSize: '0.82rem',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  };
}

const fixButtonStyle: React.CSSProperties = {
  flexShrink: 0,
  padding: '4px 10px',
  fontSize: '0.72rem',
  fontWeight: 600,
  border: '1px solid currentColor',
  background: 'rgba(255,255,255,0.7)',
  color: 'inherit',
  borderRadius: 6,
  cursor: 'pointer',
};

const successBoxStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: 10,
  background: '#f0fdf4',
  border: '1px solid #86efac',
  color: '#166534',
  fontSize: '0.88rem',
  fontWeight: 500,
  textAlign: 'center',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 20,
  flexWrap: 'wrap',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 18px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const publishWarnButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #f59e0b',
  background: '#fff',
  color: '#92400e',
  fontSize: '0.82rem',
  fontWeight: 600,
  cursor: 'pointer',
};

function publishButtonStyle(enabled: boolean): React.CSSProperties {
  return {
    padding: '8px 20px',
    borderRadius: 8,
    border: 'none',
    background: enabled ? '#123b63' : '#94a3b8',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.6,
  };
}

const schedulePanelStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #dbeafe',
  background: '#eff6ff',
  display: 'grid',
  gap: 8,
};

const publishDiffPanelStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #c7d2fe',
  background: '#f8fafc',
  display: 'grid',
  gap: 10,
};

const publishDiffStatRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 8,
};

const publishDiffStatStyle = (color: string): React.CSSProperties => ({
  padding: '4px 8px',
  borderRadius: 999,
  background: '#fff',
  border: '1px solid #e2e8f0',
  color,
  fontSize: '0.72rem',
  fontWeight: 850,
});

const publishDiffListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 4,
};

const publishDiffItemStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 7,
  background: '#fff',
  border: '1px solid #e2e8f0',
  color: '#334155',
  fontSize: '0.74rem',
  lineHeight: 1.35,
};

const scheduleRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const scheduleInputStyle: React.CSSProperties = {
  flex: '1 1 190px',
  minWidth: 0,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #bfdbfe',
  background: '#fff',
  color: '#0f172a',
  fontSize: '0.82rem',
};

const scheduleButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid #2563eb',
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer',
};

function toLocalDateTimeInput(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function defaultScheduleInput(): string {
  return toLocalDateTimeInput(new Date(Date.now() + 60 * 60 * 1000));
}

function formatScheduledAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function severityIcon(sev: 'blocker' | 'warning' | 'info'): string {
  if (sev === 'blocker') return '✕';
  if (sev === 'warning') return '!';
  return 'ℹ';
}

function itemTone(results: CheckResult[]): PreflightTone {
  if (results.some((result) => result.severity === 'blocker')) return 'blocker';
  if (results.some((result) => result.severity === 'warning')) return 'warning';
  return 'ok';
}

function itemStatus(item: PreflightItem): string {
  if (item.tone === 'blocker') return `${item.blockerCount} blocker`;
  if (item.tone === 'warning') return `${item.warningCount} warning`;
  return 'Passed';
}

function buildPreflightItems(suite: PublishCheckSuite | null): PreflightItem[] {
  const results = suite?.results ?? [];
  const imageResults = results.filter((result) =>
    result.category === 'images'
    || (result.category === 'accessibility' && result.id.startsWith('image-')),
  );
  const linkResults = results.filter((result) => result.category === 'links');
  const seoResults = results.filter((result) => result.category === 'seo');
  const formResults = results.filter((result) => result.category === 'forms');

  return [
    {
      key: 'images',
      label: 'Images',
      detail: '빈 alt 이미지 / 비어 있는 이미지 소스',
      tone: itemTone(imageResults),
      blockerCount: imageResults.filter((result) => result.severity === 'blocker').length,
      warningCount: imageResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'links',
      label: 'Links',
      detail: '빈 링크 / 잘못된 URL / 없는 내부 경로',
      tone: itemTone(linkResults),
      blockerCount: linkResults.filter((result) => result.severity === 'blocker').length,
      warningCount: linkResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'seo',
      label: 'SEO',
      detail: 'title / description 누락 및 권장 길이',
      tone: itemTone(seoResults),
      blockerCount: seoResults.filter((result) => result.severity === 'blocker').length,
      warningCount: seoResults.filter((result) => result.severity === 'warning').length,
    },
    {
      key: 'forms',
      label: 'Forms',
      detail: 'form action / email / webhook 대상',
      tone: itemTone(formResults),
      blockerCount: formResults.filter((result) => result.severity === 'blocker').length,
      warningCount: formResults.filter((result) => result.severity === 'warning').length,
    },
  ];
}

function CheckListItem({
  result,
  onFix,
}: {
  result: CheckResult;
  onFix?: (nodeId: string) => void;
}): JSX.Element {
  const firstNode = result.affectedNodeIds?.[0];
  return (
    <li style={severityBoxStyle(result.severity)}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700 }}>{severityIcon(result.severity)}</span>
          <span style={{ fontWeight: 600 }}>{result.message}</span>
        </div>
        {result.fixHint ? (
          <div style={{ marginTop: 4, opacity: 0.8, fontSize: '0.74rem' }}>
            ↳ {result.fixHint}
          </div>
        ) : null}
      </div>
      {firstNode && onFix ? (
        <button
          type="button"
          style={fixButtonStyle}
          onClick={() => onFix(firstNode)}
          aria-label="Fix this issue"
        >
          Fix
        </button>
      ) : null}
    </li>
  );
}

export default function PublishModal({
  open,
  document,
  locale,
  activePageId,
  draftMeta,
  onDraftSaved,
  onToast,
  onClose,
}: {
  open: boolean;
  document: BuilderCanvasDocument | null;
  locale: string;
  activePageId?: string | null;
  draftMeta?: DraftMeta | null;
  onDraftSaved?: (draftMeta: DraftMeta, document?: BuilderCanvasDocument) => void;
  onToast?: (message: string, tone: ToastTone) => void;
  onClose: () => void;
}) {
  const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);
  const [publishState, setPublishState] = useState<PublishState>('checking');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [suite, setSuite] = useState<PublishCheckSuite | null>(null);
  const [overrideWarnings, setOverrideWarnings] = useState(false);
  const [scheduledAtInput, setScheduledAtInput] = useState(defaultScheduleInput);
  const [scheduledJob, setScheduledJob] = useState<ScheduledPublishJob | null>(null);
  const [schedulePending, setSchedulePending] = useState(false);
  const [publishDiff, setPublishDiff] = useState<PublishDiffState>({ status: 'idle' });

  const runChecks = useCallback(async () => {
    if (!document) return;
    setPublishState('checking');
    setSuite(null);
    setOverrideWarnings(false);
    if (activePageId) {
      try {
        const res = await fetch('/api/builder/site/publish-checks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId: 'default',
            pageId: activePageId,
            locale,
            document,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { ok: boolean; suite?: PublishCheckSuite };
          if (data.ok && data.suite) {
            setSuite(data.suite);
            setPublishState('ready');
            return;
          }
        }
      } catch {
        // fall through to client-side fallback
      }
    }

    // Fallback — client-side checks still cover the visible preflight categories
    // when the server-side SEO/site-aware gate is temporarily unavailable.
    const fallbackResults: CheckResult[] = [
      ...checkEmptyContent(document),
      ...checkBrokenLinks(document),
      ...checkImageAlt(document),
      ...checkFormTarget(document),
      ...checkH1Count(document),
    ];
    if (activePageId) {
      fallbackResults.push({
        id: 'seo-server-check-unavailable',
        severity: 'warning',
        category: 'seo',
        message: 'SEO title/description 서버 체크를 완료하지 못했습니다.',
        fixHint: 'SEO 패널에서 title, description, canonical, OG image 를 확인하세요.',
      });
    }
    const fallbackSuite: PublishCheckSuite = {
      results: fallbackResults,
      hasBlocker: fallbackResults.some((result) => result.severity === 'blocker'),
      blockerCount: fallbackResults.filter((result) => result.severity === 'blocker').length,
      warningCount: fallbackResults.filter((result) => result.severity === 'warning').length,
      infoCount: fallbackResults.filter((result) => result.severity === 'info').length,
      checkedAt: new Date().toISOString(),
    };
    setSuite(fallbackSuite);
    setPublishState('ready');
  }, [document, activePageId, locale]);

  const loadPublishDiff = useCallback(async () => {
    if (!document || !activePageId) {
      setPublishDiff({ status: 'idle' });
      return;
    }

    setPublishDiff({ status: 'loading' });
    try {
      const pagesResponse = await fetch(
        `/api/builder/site/pages?locale=${encodeURIComponent(locale)}`,
        { credentials: 'same-origin' },
      );
      if (!pagesResponse.ok) {
        setPublishDiff({ status: 'error', message: 'published 기준 정보를 불러오지 못했습니다.' });
        return;
      }
      const pagesPayload = (await pagesResponse.json()) as { pages?: BuilderPageMeta[] };
      const pageMeta = (pagesPayload.pages ?? []).find((page) => page.pageId === activePageId);
      const revisionId = pageMeta?.publishedRevisionId;
      if (!revisionId) {
        setPublishDiff({
          status: 'missing',
          message: '아직 published baseline이 없습니다. 이번 발행이 첫 published snapshot이 됩니다.',
        });
        return;
      }

      const revisionResponse = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(activePageId)}/revisions?revisionId=${encodeURIComponent(revisionId)}`,
        { credentials: 'same-origin' },
      );
      if (!revisionResponse.ok) {
        setPublishDiff({ status: 'error', message: '마지막 published revision을 불러오지 못했습니다.' });
        return;
      }
      const revisionPayload = (await revisionResponse.json()) as { document?: BuilderCanvasDocument };
      if (!revisionPayload.document) {
        setPublishDiff({ status: 'error', message: 'published revision 문서가 비어 있습니다.' });
        return;
      }

      const diff = computeDocumentDiff(document, revisionPayload.document);
      setPublishDiff({
        status: 'ready',
        diff,
        summary: summarizeDocumentDiff(diff),
        publishedRevision: pageMeta?.publishedRevision,
        publishedRevisionId: revisionId,
        publishedSavedAt: pageMeta?.publishedSavedAt ?? pageMeta?.publishedAt,
      });
    } catch {
      setPublishDiff({ status: 'error', message: 'published diff 계산 중 네트워크 오류가 발생했습니다.' });
    }
  }, [activePageId, document, locale]);

  useEffect(() => {
    if (!open) {
      setPublishState('checking');
      setPublishError(null);
      setPublishedSlug(null);
      setSuite(null);
      setOverrideWarnings(false);
      setScheduledJob(null);
      setSchedulePending(false);
      setPublishDiff({ status: 'idle' });
      return;
    }
    void runChecks();
    void loadPublishDiff();
  }, [open, runChecks, loadPublishDiff]);

  useEffect(() => {
    if (!open || !activePageId) return;
    setScheduledAtInput(defaultScheduleInput());
    void fetch(`/api/builder/site/pages/${activePageId}/scheduled-publish?locale=${locale}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok?: boolean; job?: ScheduledPublishJob | null } | null) => {
        if (data?.ok && data.job) {
          setScheduledJob(data.job);
          setScheduledAtInput(toLocalDateTimeInput(new Date(data.job.scheduledAt)));
        }
      })
      .catch(() => undefined);
  }, [open, activePageId, locale]);

  const grouped = useMemo(() => {
    if (!suite) return { blockers: [], warnings: [], infos: [] };
    return {
      blockers: suite.results.filter((r) => r.severity === 'blocker'),
      warnings: suite.results.filter((r) => r.severity === 'warning'),
      infos: suite.results.filter((r) => r.severity === 'info'),
    };
  }, [suite]);
  const preflightItems = useMemo(() => buildPreflightItems(suite), [suite]);

  const canPublish = !!suite && !suite.hasBlocker && publishState === 'ready';
  const hasWarningsOnly = !!suite && !suite.hasBlocker && suite.warningCount > 0;
  const canSubmitPublish = canPublish && ((suite?.warningCount ?? 0) === 0 || overrideWarnings);
  const publishDiffExamples = useMemo(() => {
    if (publishDiff.status !== 'ready') return [];
    return [
      ...publishDiff.diff.added.slice(0, 2).map((node) => ({
        id: node.id,
        tone: '추가',
        detail: summarizeDiffNode(node),
      })),
      ...publishDiff.diff.removed.slice(0, 2).map((node) => ({
        id: node.id,
        tone: '삭제',
        detail: summarizeDiffNode(node),
      })),
      ...publishDiff.diff.modified.slice(0, 3).map((node) => ({
        id: node.id,
        tone: '변경',
        detail: `${node.kind} · ${node.changes.join(' · ')}`,
      })),
    ].slice(0, 5);
  }, [publishDiff]);
  const publishDiffChangedCount = publishDiff.status === 'ready'
    ? publishDiff.summary.added + publishDiff.summary.removed + publishDiff.summary.modified
    : 0;

  const handleFix = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      onClose();
    },
    [setSelectedNodeId, onClose],
  );

  const saveDraftForPublish = useCallback(async (): Promise<{
    ok: true;
    expectedDraftRevision?: number;
  } | {
    ok: false;
    message: string;
  }> => {
    if (!document || !activePageId) return { ok: false, message: '발행할 페이지가 없습니다.' };
    const saveResponse = await fetch(
      `/api/builder/site/pages/${activePageId}/draft?locale=${locale}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ expectedRevision: draftMeta?.revision, document }),
      },
    );
    if (!saveResponse.ok) {
      const errData = (await saveResponse.json().catch(() => ({}))) as { error?: string };
      return {
        ok: false,
        message: errData.error === 'draft_conflict'
          ? 'Draft가 다른 탭에서 변경되었습니다. 새로고침 후 다시 발행하세요.'
          : '발행 전 draft 저장에 실패했습니다.',
      };
    }
    const saveData = (await saveResponse.json()) as {
      draft?: DraftMeta;
      document?: BuilderCanvasDocument;
    };
    if (saveData.draft) {
      onDraftSaved?.(saveData.draft, saveData.document);
    }
    return {
      ok: true,
      expectedDraftRevision: saveData.draft?.revision ?? draftMeta?.revision,
    };
  }, [activePageId, document, draftMeta?.revision, locale, onDraftSaved]);

  const handlePublish = useCallback(async () => {
    if (!canSubmitPublish || !document) return;
    setPublishState('publishing');
    setPublishError(null);

    try {
      if (activePageId) {
        // ── Site page publish: save draft then call publish API ──
        const draftSave = await saveDraftForPublish();
        if (!draftSave.ok) {
          setPublishState('error');
          setPublishError(draftSave.message);
          onToast?.(draftSave.message, 'error');
          return;
        }

        const publishResponse = await fetch(
          `/api/builder/site/pages/${activePageId}/publish?locale=${locale}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ expectedDraftRevision: draftSave.expectedDraftRevision }),
          },
        );

        if (!publishResponse.ok) {
          const errData = (await publishResponse.json().catch(() => ({}))) as PublishErrorBody;
          let message = errData.errors?.join(', ') || errData.error || '발행 실패. 다시 시도해 주세요.';
          if (publishResponse.status === 422 && Array.isArray(errData.blockers)) {
            setSuite(blockerSuite(errData.blockers));
            message = '발행 차단 항목을 수정한 뒤 다시 시도하세요.';
          } else if (publishResponse.status === 409 || errData.error === 'draft_stale') {
            const currentRevision =
              typeof errData.current?.revision === 'number'
                ? ` 현재 revision: ${errData.current.revision}.`
                : '';
            message = `Draft가 다른 탭에서 변경되었습니다. 새로고침 후 다시 발행하세요.${currentRevision}`;
          } else if (publishResponse.status >= 500) {
            message = '발행 실패. 다시 시도해 주세요.';
          }
          setPublishState('error');
          setPublishError(message);
          onToast?.(message, 'error');
          return;
        }

        const result = (await publishResponse.json()) as { ok: boolean; slug?: string };
        setPublishState('success');
        const slug = result.slug ?? '';
        setPublishedSlug(buildSitePagePath(locale, slug));
        onToast?.('발행 완료', 'success');
        onClose();
      } else {
        // ── Legacy sandbox publish fallback ──
        const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ document }),
        });

        if (!response.ok) {
          setPublishState('error');
          setPublishError('Failed to save draft before publish.');
          return;
        }

        setPublishState('success');
        setPublishedSlug(`/p/sandbox`);
      }
    } catch {
      onToast?.('발행 중 네트워크 오류가 발생했습니다.', 'error');
      setPublishState('error');
      setPublishError('발행 중 네트워크 오류가 발생했습니다.');
    }
  }, [canSubmitPublish, document, locale, activePageId, onToast, onClose, saveDraftForPublish]);

  const handleSchedulePublish = useCallback(async () => {
    if (!canSubmitPublish || !document || !activePageId) return;
    const scheduledMs = Date.parse(scheduledAtInput);
    if (!Number.isFinite(scheduledMs) || scheduledMs <= Date.now()) {
      const message = '현재 이후 시간으로 예약해 주세요.';
      setPublishError(message);
      setPublishState('error');
      onToast?.(message, 'error');
      return;
    }

    setSchedulePending(true);
    setPublishError(null);
    try {
      const draftSave = await saveDraftForPublish();
      if (!draftSave.ok) {
        setPublishState('error');
        setPublishError(draftSave.message);
        onToast?.(draftSave.message, 'error');
        return;
      }
      const response = await fetch(
        `/api/builder/site/pages/${activePageId}/scheduled-publish?locale=${locale}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            locale,
            scheduledAt: new Date(scheduledMs).toISOString(),
            expectedDraftRevision: draftSave.expectedDraftRevision,
          }),
        },
      );
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        job?: ScheduledPublishJob;
        error?: string;
      };
      if (!response.ok || !data.ok || !data.job) {
        const message = data.error || '예약 발행 저장에 실패했습니다.';
        setPublishState('error');
        setPublishError(message);
        onToast?.(message, 'error');
        return;
      }
      setScheduledJob(data.job);
      setPublishState('ready');
      onToast?.('예약 발행 저장 완료', 'success');
    } catch {
      const message = '예약 발행 저장 중 네트워크 오류가 발생했습니다.';
      setPublishState('error');
      setPublishError(message);
      onToast?.(message, 'error');
    } finally {
      setSchedulePending(false);
    }
  }, [
    activePageId,
    canSubmitPublish,
    document,
    locale,
    onToast,
    saveDraftForPublish,
    scheduledAtInput,
  ]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Publish Page"
      subtitle={activePageId ? `revision ${draftMeta?.revision ?? 0} 기준 발행 예정` : undefined}
      size="md"
    >

          {publishState === 'checking' && (
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 12 }}>
              발행 가능 여부 확인 중...
            </p>
          )}

          {publishState !== 'checking' && suite && (
            <>
              <p style={sectionTitleStyle}>
                Automatic preflight checklist
              </p>
              <div style={checklistGridStyle}>
                {preflightItems.map((item) => (
                  <div key={item.key} style={checklistCardStyle(item.tone)}>
                    <div style={checklistLabelStyle}>
                      <span>{item.label}</span>
                      <span style={checklistStatusStyle}>{itemStatus(item)}</span>
                    </div>
                    <div style={checklistDetailStyle}>{item.detail}</div>
                  </div>
                ))}
              </div>

              {activePageId ? (
                <div style={publishDiffPanelStyle}>
                  <div style={checklistLabelStyle}>
                    <span>Draft vs published</span>
                    <span style={checklistStatusStyle}>
                      {publishDiff.status === 'ready'
                        ? formatDocumentDiffSummary(publishDiff.summary)
                        : publishDiff.status === 'loading'
                          ? '계산 중'
                          : publishDiff.status === 'missing'
                            ? '첫 발행'
                            : publishDiff.status === 'error'
                              ? '확인 필요'
                              : '대기'}
                    </span>
                  </div>

                  {publishDiff.status === 'ready' ? (
                    <>
                      <div style={publishDiffStatRowStyle}>
                        <span style={publishDiffStatStyle('#16a34a')}>+ 추가됨 {publishDiff.summary.added}</span>
                        <span style={publishDiffStatStyle('#dc2626')}>- 삭제됨 {publishDiff.summary.removed}</span>
                        <span style={publishDiffStatStyle('#ca8a04')}>~ 변경됨 {publishDiff.summary.modified}</span>
                        <span style={{ ...checklistDetailStyle, marginTop: 0 }}>
                          published v{publishDiff.publishedRevision ?? '?'}
                          {publishDiff.publishedSavedAt ? ` · ${formatScheduledAt(publishDiff.publishedSavedAt)}` : ''}
                        </span>
                      </div>
                      {publishDiffChangedCount === 0 ? (
                        <div style={checklistDetailStyle}>
                          마지막 published revision과 현재 draft가 동일합니다.
                        </div>
                      ) : (
                        <ul style={publishDiffListStyle} aria-label="Draft vs published changed nodes">
                          {publishDiffExamples.map((item) => (
                            <li key={`${item.tone}-${item.id}`} style={publishDiffItemStyle}>
                              <strong>{item.tone}</strong>{' '}
                              <code>{item.id}</code> · {item.detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <div style={checklistDetailStyle}>
                      {publishDiff.status === 'loading'
                        ? '마지막 published revision과 현재 draft 차이를 계산 중입니다.'
                        : publishDiff.status === 'missing' || publishDiff.status === 'error'
                          ? publishDiff.message
                          : 'published 기준이 준비되면 발행 전 변경 요약이 표시됩니다.'}
                    </div>
                  )}
                </div>
              ) : null}

              {grouped.blockers.length > 0 && (
                <>
                  <p style={{ ...sectionTitleStyle, color: '#991b1b' }}>
                    Blocker ({grouped.blockers.length}) — 발행 차단
                  </p>
                  <ul style={listStyle}>
                    {grouped.blockers.map((r) => (
                      <CheckListItem key={r.id} result={r} onFix={handleFix} />
                    ))}
                  </ul>
                </>
              )}

              {grouped.warnings.length > 0 && (
                <>
                  <p style={{ ...sectionTitleStyle, color: '#92400e' }}>
                    Warning ({grouped.warnings.length})
                  </p>
                  <ul style={listStyle}>
                    {grouped.warnings.map((r) => (
                      <CheckListItem key={r.id} result={r} onFix={handleFix} />
                    ))}
                  </ul>
                </>
              )}

              {grouped.infos.length > 0 && (
                <>
                  <p style={{ ...sectionTitleStyle, color: '#1e40af' }}>
                    Info ({grouped.infos.length})
                  </p>
                  <ul style={listStyle}>
                    {grouped.infos.map((r) => (
                      <CheckListItem key={r.id} result={r} onFix={handleFix} />
                    ))}
                  </ul>
                </>
              )}

              {suite.results.length === 0 && publishState === 'ready' && (
                <p style={{ ...sectionTitleStyle, color: '#166534' }}>
                  모든 검사 통과 — 발행 가능
                </p>
              )}

              {activePageId ? (
                <div style={schedulePanelStyle}>
                  <div style={{ ...checklistLabelStyle, color: '#1e40af' }}>
                    <span>예약 발행</span>
                    {scheduledJob ? (
                      <span style={checklistStatusStyle}>{scheduledJob.status}</span>
                    ) : null}
                  </div>
                  <div style={scheduleRowStyle}>
                    <input
                      type="datetime-local"
                      value={scheduledAtInput}
                      onChange={(event) => setScheduledAtInput(event.target.value)}
                      style={scheduleInputStyle}
                      aria-label="Scheduled publish time"
                    />
                    <button
                      type="button"
                      style={{
                        ...scheduleButtonStyle,
                        opacity: canSubmitPublish && !schedulePending ? 1 : 0.55,
                        cursor: canSubmitPublish && !schedulePending ? 'pointer' : 'not-allowed',
                      }}
                      disabled={!canSubmitPublish || schedulePending}
                      onClick={handleSchedulePublish}
                    >
                      {schedulePending ? '예약 중...' : '예약'}
                    </button>
                  </div>
                  {scheduledJob ? (
                    <div style={{ ...checklistDetailStyle, color: '#1e40af' }}>
                      {formatScheduledAt(scheduledJob.scheduledAt)} 발행 대기
                      {scheduledJob.expectedDraftRevision ? ` · draft v${scheduledJob.expectedDraftRevision}` : ''}
                    </div>
                  ) : (
                    <div style={{ ...checklistDetailStyle, color: '#1e40af' }}>
                      예약 시점의 draft revision이 고정되고, cron runner가 시간이 지나면 자동 발행합니다.
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}

          {publishState === 'success' && publishedSlug && (
            <div style={{ ...successBoxStyle, marginTop: 16 }}>
              발행 완료!{' '}
              <a
                href={publishedSlug}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#123b63', fontWeight: 700, textDecoration: 'underline' }}
              >
                {publishedSlug} 에서 보기
              </a>
            </div>
          )}

          {publishState === 'error' && publishError && (
            <div style={{ ...severityBoxStyle('blocker'), marginTop: 12 }}>
              {publishError}
            </div>
          )}

      <div style={buttonRowStyle}>
        <button type="button" style={cancelButtonStyle} onClick={onClose}>
          {publishState === 'success' ? '닫기' : '취소'}
        </button>

        {publishState !== 'success' && hasWarningsOnly && !overrideWarnings && (
          <button
            type="button"
            style={publishWarnButtonStyle}
            onClick={() => setOverrideWarnings(true)}
          >
            경고 무시하고 발행
          </button>
        )}

        {publishState !== 'success' && (
          <button
            type="button"
            style={publishButtonStyle(canSubmitPublish)}
            disabled={
              !canSubmitPublish ||
              publishState !== 'ready' ||
              ((suite?.warningCount ?? 0) > 0 && !overrideWarnings)
            }
            onClick={handlePublish}
          >
            {publishState === 'publishing' ? '발행 중...' : '발행'}
          </button>
        )}
      </div>
    </ModalShell>
  );
}
