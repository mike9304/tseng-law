import { appendLog } from '@/lib/builder/dev/logs-store';
import { dispatchAppHookEvent } from '@/lib/builder/apps/hook-runtime';
import type { AppHookEvent } from '@/lib/builder/apps/hooks-model';

type EditorPageSaveHookEvent = Extract<AppHookEvent, { kind: 'editor.page-save' }>;
type PublicPageRenderHookEvent = Extract<AppHookEvent, { kind: 'public.page-render' }>;
type CmsRecordCreatedHookEvent = Extract<AppHookEvent, { kind: 'cms.record-created' }>;

function dispatchLifecycleHook(event: AppHookEvent): void {
  void dispatchAppHookEvent(event).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    appendLog('app', {
      level: 'error',
      message: `lifecycle hook dispatch failed (${event.kind}): ${message}`,
      reference: `lifecycle:${event.kind}`,
    });
  });
}

export function emitEditorPageSaveHook(event: EditorPageSaveHookEvent): void {
  dispatchLifecycleHook(event);
}

export function emitPublicPageRenderHook(event: PublicPageRenderHookEvent): void {
  dispatchLifecycleHook(event);
}

export function emitCmsRecordCreatedHook(event: CmsRecordCreatedHookEvent): void {
  dispatchLifecycleHook(event);
}
