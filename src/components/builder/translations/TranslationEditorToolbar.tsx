import type { Locale } from '@/lib/locales';
import type { TranslationCopy } from './translation-copy';
import {
  btnPrimary,
  btnSecondary,
  editorToolbarStyle,
  statusErrorStyle,
  statusSuccessStyle,
  statusWarningStyle,
} from './TranslationEditor.styles';

interface TranslationEditorToolbarProps {
  readonly autoBusy: boolean;
  readonly saving: boolean;
  readonly sourcesCount: number;
  readonly targetPageReady: boolean;
  readonly targetLocale: Locale;
  readonly notice: string;
  readonly error: string;
  readonly rollbackAvailable: boolean;
  readonly copy: TranslationCopy;
  readonly onAutoTranslate: () => void;
  readonly onSave: () => void;
  readonly onRollback: () => void;
}

export function TranslationEditorToolbar({
  autoBusy,
  saving,
  sourcesCount,
  targetPageReady,
  targetLocale,
  notice,
  error,
  rollbackAvailable,
  copy,
  onAutoTranslate,
  onSave,
  onRollback,
}: TranslationEditorToolbarProps) {
  return (
    <div style={editorToolbarStyle}>
      <button
        type="button"
        onClick={onAutoTranslate}
        disabled={autoBusy || sourcesCount === 0}
        style={btnSecondary}
      >
        {autoBusy ? copy.editorSaving : copy.editorAutoTranslatePage}
      </button>
      {rollbackAvailable ? (
        <button
          type="button"
          onClick={onRollback}
          disabled={autoBusy}
          style={btnSecondary}
          data-translation-auto-rollback="true"
        >
          {copy.editorRevertAutoTranslate}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        style={btnPrimary}
      >
        {saving ? copy.editorSaving : copy.editorSaveTranslation}
      </button>
      {!targetPageReady && (
        <span style={statusWarningStyle}>
          {copy.editorTargetPageMissing} <code>{targetLocale}</code>
        </span>
      )}
      {notice ? (
        <span style={statusSuccessStyle}>{notice}</span>
      ) : null}
      {error ? (
        <span style={statusErrorStyle}>{error}</span>
      ) : null}
    </div>
  );
}
