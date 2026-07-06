import { describe, expect, it } from 'vitest';
import {
  buildCmsDynamicItemRouteMutationBody,
  cmsDynamicItemRouteMutationSupportsSlugOptions,
  getCmsDynamicItemRouteMutationCopy,
  getCmsDynamicItemRouteMutationDataAttributes,
} from '@/components/builder/cms/cms-dynamic-item-route-mutation-config';

describe('cms dynamic item route mutation config', () => {
  it('maps delete archived routes to the delete bulk action', () => {
    expect(buildCmsDynamicItemRouteMutationBody({
      kind: 'delete-archived',
      recordIds: ['archived-id'],
      slugField: 'slug',
      sourceFieldKey: '',
      slugPattern: '',
      slugConflictRule: 'next-available',
    })).toEqual({
      action: 'delete',
      recordIds: ['archived-id'],
    });
  });

  it('maps restore deleted routes to the deleted-record restore bulk action', () => {
    expect(buildCmsDynamicItemRouteMutationBody({
      kind: 'restore-deleted',
      recordIds: ['deleted-id'],
      slugField: 'slug',
      sourceFieldKey: '',
      slugPattern: '',
      slugConflictRule: 'next-available',
    })).toEqual({
      action: 'restore-deleted',
      recordIds: ['deleted-id'],
    });
  });

  it('maps restore archived routes to the draft bulk action', () => {
    expect(buildCmsDynamicItemRouteMutationBody({
      kind: 'restore-archived',
      recordIds: ['archived-id'],
      slugField: 'slug',
      sourceFieldKey: '',
      slugPattern: '',
      slugConflictRule: 'next-available',
    })).toEqual({
      action: 'draft',
      recordIds: ['archived-id'],
    });
  });

  it('exposes a stable restore archived route data attribute and copy', () => {
    expect(getCmsDynamicItemRouteMutationDataAttributes('restore-archived', 'page-1')).toEqual({
      'data-cms-dynamic-item-restore-archived': 'page-1',
    });
    expect(getCmsDynamicItemRouteMutationCopy('restore-archived', 2, 'slug')).toMatchObject({
      idleLabel: 'Restore (2)',
      error: 'Failed to restore archived records.',
    });
  });

  it('exposes a stable delete archived route data attribute and copy', () => {
    expect(getCmsDynamicItemRouteMutationDataAttributes('delete-archived', 'page-1')).toEqual({
      'data-cms-dynamic-item-delete-archived': 'page-1',
    });
    expect(getCmsDynamicItemRouteMutationCopy('delete-archived', 2, 'slug')).toMatchObject({
      idleLabel: 'Trash archived (2)',
      error: 'Failed to move archived records to trash.',
    });
  });

  it('exposes a stable restore deleted route data attribute and copy', () => {
    expect(getCmsDynamicItemRouteMutationDataAttributes('restore-deleted', 'page-1')).toEqual({
      'data-cms-dynamic-item-restore-deleted': 'page-1',
    });
    expect(getCmsDynamicItemRouteMutationCopy('restore-deleted', 2, 'slug')).toMatchObject({
      idleLabel: 'Restore deleted (2)',
      error: 'Failed to restore deleted records.',
    });
  });

  it('keeps restore archived routes out of slug repair options', () => {
    expect(cmsDynamicItemRouteMutationSupportsSlugOptions('restore-archived')).toBe(false);
  });

  it('keeps delete archived routes out of slug repair options', () => {
    expect(cmsDynamicItemRouteMutationSupportsSlugOptions('delete-archived')).toBe(false);
  });

  it('keeps restore deleted routes out of slug repair options', () => {
    expect(cmsDynamicItemRouteMutationSupportsSlugOptions('restore-deleted')).toBe(false);
  });
});
