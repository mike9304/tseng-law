import { describe, expect, it, vi } from 'vitest';
import { createInlineTextCloseController } from '../InlineTextEditor';

function makeController() {
  let composing = false;
  const onSave = vi.fn();
  const onBlur = vi.fn();
  const onCancel = vi.fn();
  const controller = createInlineTextCloseController({
    isComposing: () => composing,
    onSave,
    onBlur,
    onCancel,
  });
  return {
    controller,
    onSave,
    onBlur,
    onCancel,
    setComposing: (value: boolean) => { composing = value; },
  };
}

describe('InlineTextEditor close controller', () => {
  it('commits and closes exactly once across competing exit paths', () => {
    const { controller, onSave, onBlur, onCancel } = makeController();

    expect(controller.commit()).toBe('closed');
    expect(controller.commit()).toBe('ignored');
    expect(controller.cancel()).toBe('ignored');
    expect(controller.destroy()).toBe('ignored');

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(controller.getMode()).toBe('commit');
  });

  it('cancels without saving and ignores later unmount cleanup', () => {
    const { controller, onSave, onBlur, onCancel } = makeController();

    expect(controller.cancel()).toBe('closed');
    expect(controller.destroy()).toBe('ignored');

    expect(onSave).not.toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(controller.getMode()).toBe('cancel');
  });

  it('waits for the browser composition end and never closes synthetically', () => {
    const { controller, onSave, onBlur, setComposing } = makeController();
    setComposing(true);

    expect(controller.commit()).toBe('pending-composition');
    expect(onSave).not.toHaveBeenCalled();
    expect(onBlur).not.toHaveBeenCalled();
    expect(controller.isClosed()).toBe(false);

    setComposing(false);
    expect(controller.compositionEnd()).toBe('closed');
    expect(controller.compositionEnd()).toBe('ignored');
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('saves once on true editor destruction without firing a stale blur', () => {
    const { controller, onSave, onBlur } = makeController();

    expect(controller.destroy()).toBe('closed');
    expect(controller.destroy()).toBe('ignored');

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onBlur).not.toHaveBeenCalled();
  });
});
