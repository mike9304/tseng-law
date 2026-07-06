import type { FunctionsCopy } from './functions-copy';
import {
  BUTTON_STYLE,
  DANGER_BUTTON_STYLE,
  PRIMARY_BUTTON_STYLE,
  TOOLBAR_STYLE,
} from './functions-admin-styles';

interface FunctionEditorToolbarProps {
  aiUndoAvailable: boolean;
  copy: FunctionsCopy;
  dirty: boolean;
  pending: boolean;
  selected: boolean;
  onDelete: () => void;
  onInvoke: () => void;
  onSave: () => void;
  onToggleAssistant: () => void;
  onUndoAi: () => void;
}

export function FunctionEditorToolbar({
  aiUndoAvailable,
  copy,
  dirty,
  pending,
  selected,
  onDelete,
  onInvoke,
  onSave,
  onToggleAssistant,
  onUndoAi,
}: FunctionEditorToolbarProps) {
  return (
    <div style={TOOLBAR_STYLE}>
      <strong style={{ fontSize: 14 }}>{selected ? copy.editFunction : copy.createFunction}</strong>
      {dirty ? <span style={{ color: '#b45309', fontSize: 12 }}>{copy.unsavedChanges}</span> : null}
      <button type="button" style={{ ...BUTTON_STYLE, marginLeft: 'auto' }} onClick={onToggleAssistant} data-builder-ai-code-open="true">
        {copy.aiCode}
      </button>
      {aiUndoAvailable ? (
        <button
          type="button"
          style={BUTTON_STYLE}
          onClick={onUndoAi}
          data-builder-dev-function-undo-ai="true"
        >
          {copy.undoAi}
        </button>
      ) : null}
      <button type="button" style={PRIMARY_BUTTON_STYLE} onClick={onSave} disabled={pending} data-builder-dev-function-save="true">
        {pending ? copy.working : copy.save}
      </button>
      <button type="button" style={BUTTON_STYLE} onClick={onInvoke} disabled={pending || !selected} data-builder-dev-function-invoke="true">
        {copy.testRun}
      </button>
      {selected ? (
        <button type="button" style={DANGER_BUTTON_STYLE} onClick={onDelete} disabled={pending}>
          {copy.delete}
        </button>
      ) : null}
    </div>
  );
}
