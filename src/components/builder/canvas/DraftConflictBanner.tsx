'use client';

import { useId, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { DraftConflict } from './hooks/useSandboxSiteState';
import {
  conflictActionsStyle,
  conflictBannerStyle,
  conflictDetailsStyle,
  conflictDisabledButtonStyle,
  conflictReloadButtonStyle,
  type DraftConflictCopy,
} from './SandboxPageChrome';

function revisionLabel(value: number | null, unknownValue: string): string {
  return value === null ? unknownValue : String(value);
}

export function formatDraftConflictSavedAt(
  value: string | undefined,
  locale: Locale,
  unknownValue: string,
): string {
  if (!value) return unknownValue;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const language = locale === 'zh-hant' ? 'zh-TW' : locale;
  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

export default function DraftConflictBanner({
  conflict,
  copy,
  locale,
  onDownloadLocalBackup,
  onUseServerLatest,
}: {
  conflict: DraftConflict;
  copy: DraftConflictCopy;
  locale: Locale;
  onDownloadLocalBackup: () => Promise<boolean>;
  onUseServerLatest: () => Promise<boolean>;
}) {
  const headingId = useId();
  const descriptionId = useId();
  const unavailableReasonId = useId();
  const [pendingAction, setPendingAction] = useState<'download' | 'server' | null>(null);

  const runAction = async (
    action: 'download' | 'server',
    handler: () => Promise<boolean>,
  ) => {
    if (pendingAction) return;
    setPendingAction(action);
    try {
      await handler();
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <section
      style={conflictBannerStyle}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      data-builder-draft-conflict="true"
    >
      <div>
        <h2 id={headingId} style={{ margin: 0, fontSize: '0.95rem' }}>
          {copy.heading}
        </h2>
        <p id={descriptionId} style={{ margin: '4px 0 0' }}>
          {copy.message}
        </p>
      </div>

      <div style={conflictDetailsStyle} data-builder-draft-conflict-details="true">
        <span>
          {copy.expectedRevisionLabel}: {revisionLabel(conflict.expectedRevision, copy.unknownValue)}
        </span>
        <span>
          {copy.currentRevisionLabel}: {revisionLabel(conflict.currentRevision, copy.unknownValue)}
        </span>
        <span>
          {copy.currentSavedAtLabel}: {formatDraftConflictSavedAt(
            conflict.currentSavedAt,
            locale,
            copy.unknownValue,
          )}
        </span>
        <span>
          {copy.recoveryLabel}: {conflict.localRecovery.filename} · {conflict.localRecovery.byteLength}{' '}
          {copy.recoveryBytesLabel}
        </span>
        <span style={{ overflowWrap: 'anywhere' }}>
          {copy.recoveryChecksumLabel}:{' '}
          <code data-builder-draft-conflict-checksum="sha256">
            {conflict.localRecovery.checksumSha256}
          </code>
        </span>
      </div>

      <p style={{ margin: 0, fontSize: '0.76rem', fontWeight: 500 }}>
        {copy.serverLatestDescription}
      </p>

      <div style={conflictActionsStyle} aria-label={copy.heading}>
        <button
          type="button"
          style={conflictReloadButtonStyle}
          disabled={pendingAction !== null}
          data-builder-draft-conflict-action="server-latest"
          onClick={() => void runAction('server', onUseServerLatest)}
        >
          {pendingAction === 'server' ? copy.serverPendingLabel : copy.serverLatestLabel}
        </button>
        <button
          type="button"
          style={conflictDisabledButtonStyle}
          disabled={!conflict.canSaveLocalVersion}
          aria-describedby={unavailableReasonId}
          data-builder-draft-conflict-action="save-local"
          title={copy.saveLocalUnavailableReason}
        >
          {copy.saveLocalLabel}
        </button>
        <button
          type="button"
          style={conflictReloadButtonStyle}
          disabled={pendingAction !== null}
          data-builder-draft-conflict-action="download-local"
          onClick={() => void runAction('download', onDownloadLocalBackup)}
        >
          {pendingAction === 'download' ? copy.downloadPendingLabel : copy.downloadLocalLabel}
        </button>
      </div>

      <p id={unavailableReasonId} style={{ margin: 0, fontSize: '0.72rem', fontWeight: 500 }}>
        {copy.saveLocalUnavailableReason}
      </p>
    </section>
  );
}
