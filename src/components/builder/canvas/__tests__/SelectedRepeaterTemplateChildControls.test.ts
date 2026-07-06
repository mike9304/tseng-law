import { describe, expect, it } from 'vitest';
import { resolveRepeaterTemplateLockTargetIds } from '../SelectedRepeaterTemplateChildControls';

describe('SelectedRepeaterTemplateChildControls', () => {
  it('locks a selected group together with its active repeater template descendants', () => {
    expect(resolveRepeaterTemplateLockTargetIds('template-group', [
      'template-title',
      'template-button',
    ])).toEqual(['template-group', 'template-title', 'template-button']);
  });

  it('does not duplicate the current child when it is already the active repeater template field', () => {
    expect(resolveRepeaterTemplateLockTargetIds('template-title', ['template-title'])).toEqual(['template-title']);
  });
});
