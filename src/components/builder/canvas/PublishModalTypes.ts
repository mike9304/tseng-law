import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type {
  DocumentDiff,
  DocumentDiffSummary,
} from '@/lib/builder/canvas/document-diff';
import type { CheckResult } from '@/lib/builder/publish-gate/gate-runner';

export type PublishState = 'checking' | 'ready' | 'publishing' | 'success' | 'error';

export interface DraftMeta {
  readonly revision: number;
  readonly savedAt: string;
  readonly updatedBy?: string;
}

export type ToastTone = 'success' | 'error';

export interface PublishErrorBody {
  readonly error?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly errors?: readonly string[];
  readonly blockers?: readonly CheckResult[];
  readonly current?: { readonly revision?: number };
}

export interface ScheduledPublishJob {
  readonly jobId: string;
  readonly scheduledAt: string;
  readonly status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  readonly expectedDraftRevision?: number;
}

export type PublishDiffState =
  | { readonly status: 'idle' | 'loading' }
  | { readonly status: 'missing'; readonly message: string }
  | { readonly status: 'error'; readonly message: string }
  | {
      readonly status: 'ready';
      readonly diff: DocumentDiff;
      readonly summary: DocumentDiffSummary;
      readonly publishedRevision?: number;
      readonly publishedRevisionId: string;
      readonly publishedSavedAt?: string;
    };

export interface PublishModalProps {
  readonly open: boolean;
  readonly document: BuilderCanvasDocument | null;
  readonly locale: string;
  readonly siteId: string;
  readonly activePageId?: string | null;
  readonly draftMeta?: DraftMeta | null;
  readonly onDraftSaved?: (draftMeta: DraftMeta, document?: BuilderCanvasDocument) => void;
  readonly onToast?: (message: string, tone: ToastTone) => void;
  readonly onClose: () => void;
}
