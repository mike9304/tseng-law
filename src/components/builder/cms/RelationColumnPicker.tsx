'use client';

import { useMemo, useState, type KeyboardEvent } from 'react';
import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import {
  bulkActionsStyle,
  fieldsetStyle,
  helperTextStyle,
  inputStyle,
  relationActionsStyle,
  searchRowStyle,
  selectedOnlyStyle,
  undoButtonStyle,
  utilityButtonStyle,
} from './SourceRecordRelationPickerStyles';
import {
  dataFlag,
  dataFlags,
  type RelationColumnPickerCopy,
  type RelationColumnPickerDataAttributes,
} from './RelationColumnPickerAttributes';
import { RelationColumnPickerList } from './RelationColumnPickerList';
import { RelationColumnPickerSelectedChips } from './RelationColumnPickerSelectedChips';
import {
  getRelationColumnPickerShortcut,
  relationColumnPickerShortcuts,
  type RelationColumnPickerShortcut,
} from './RelationColumnPickerShortcuts';

type RelationColumnPickerProps = {
  readonly columnOptions: readonly BuilderCollectionRecordRelationOption[];
  readonly columnSlugs: readonly string[];
  readonly copy: RelationColumnPickerCopy;
  readonly dataAttributes: RelationColumnPickerDataAttributes;
  readonly disabled: boolean;
  readonly onColumnSlugsChange: (columnSlugs: readonly string[]) => void;
};

export function RelationColumnPicker({
  columnOptions,
  columnSlugs,
  copy,
  dataAttributes,
  disabled,
  onColumnSlugsChange,
}: RelationColumnPickerProps) {
  const [columnQuery, setColumnQuery] = useState('');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [undoColumnSlugs, setUndoColumnSlugs] = useState<readonly string[] | null>(null);
  const selected = useMemo(() => new Set(columnSlugs), [columnSlugs]);
  const selectedColumnOptions = useMemo(() => {
    const optionsBySlug = new Map<string, BuilderCollectionRecordRelationOption>();
    columnOptions.forEach((option) => optionsBySlug.set(option.slug, option));
    return columnSlugs.map((slug) => optionsBySlug.get(slug) ?? { slug, title: slug });
  }, [columnOptions, columnSlugs]);
  const listColumnOptions = selectedOnly ? selectedColumnOptions : columnOptions;
  const filteredColumnOptions = useMemo(() => {
    const query = columnQuery.trim().toLocaleLowerCase('ko-KR');
    if (!query) return listColumnOptions;
    return listColumnOptions.filter((option) => (
      option.title.toLocaleLowerCase('ko-KR').includes(query) ||
      option.slug.toLocaleLowerCase('en-US').includes(query)
    ));
  }, [columnQuery, listColumnOptions]);
  const shownColumnOptions = filteredColumnOptions;
  const shownColumnSlugs = useMemo(
    () => shownColumnOptions.map((option) => option.slug),
    [shownColumnOptions],
  );
  const shownSelectedColumnSlugs = useMemo(
    () => shownColumnSlugs.filter((slug) => selected.has(slug)),
    [selected, shownColumnSlugs],
  );
  const hasUnselectedShownColumns = shownColumnSlugs.some((slug) => !selected.has(slug));
  const hasSelectedShownColumns = shownSelectedColumnSlugs.length > 0;
  const clearSearchStyle = { ...utilityButtonStyle, opacity: columnQuery ? 1 : 0.55 };
  const selectShownStyle = { ...utilityButtonStyle, opacity: hasUnselectedShownColumns ? 1 : 0.55 };
  const clearShownStyle = { ...utilityButtonStyle, opacity: hasSelectedShownColumns ? 1 : 0.55 };
  const clearSelectedStyle = { ...utilityButtonStyle, opacity: columnSlugs.length ? 1 : 0.55 };
  const undoClearStyle = { ...undoButtonStyle, opacity: undoColumnSlugs ? 1 : 0.55 };
  const emptyRelationMessage = selectedOnly
    ? (columnSlugs.length ? copy.emptySelectedSearch : copy.emptySelectedList)
    : copy.emptyList;
  const countSummary = columnQuery.trim()
    ? `${columnSlugs.length} selected · ${shownColumnOptions.length} matched`
    : `${columnSlugs.length} selected · ${shownColumnOptions.length} shown`;

  function updateColumnSlug(slug: string, checked: boolean) {
    setUndoColumnSlugs(null);
    if (checked) {
      onColumnSlugsChange([...new Set([...columnSlugs, slug])]);
      return;
    }
    onColumnSlugsChange(columnSlugs.filter((columnSlug) => columnSlug !== slug));
  }

  function replaceColumnSlugsWithUndo(nextColumnSlugs: readonly string[]) {
    setUndoColumnSlugs(columnSlugs);
    onColumnSlugsChange(nextColumnSlugs);
  }

  function selectShownColumnSlugs() {
    if (!hasUnselectedShownColumns) return;
    replaceColumnSlugsWithUndo([...new Set([...columnSlugs, ...shownColumnSlugs])]);
  }

  function clearShownColumnSlugs() {
    if (!hasSelectedShownColumns) return;
    const shownSelected = new Set(shownSelectedColumnSlugs);
    replaceColumnSlugsWithUndo(columnSlugs.filter((columnSlug) => !shownSelected.has(columnSlug)));
  }

  function clearSelectedColumnSlugs() {
    if (!columnSlugs.length) return;
    replaceColumnSlugsWithUndo([]);
  }

  function undoBulkColumnSlugs() {
    if (!undoColumnSlugs) return;
    onColumnSlugsChange(undoColumnSlugs);
    setUndoColumnSlugs(null);
  }

  function applyShortcut(shortcut: RelationColumnPickerShortcut): boolean {
    switch (shortcut) {
      case 'clearSearch':
        if (!columnQuery) return false;
        setColumnQuery('');
        return true;
      case 'clearShown':
        if (!hasSelectedShownColumns) return false;
        clearShownColumnSlugs();
        return true;
      case 'selectShown':
        if (!hasUnselectedShownColumns) return false;
        selectShownColumnSlugs();
        return true;
      case 'undo':
        if (!undoColumnSlugs) return false;
        undoBulkColumnSlugs();
        return true;
      default: {
        const exhaustive: never = shortcut;
        return exhaustive;
      }
    }
  }

  function handleShortcutKeyDown(event: KeyboardEvent<HTMLFieldSetElement>) {
    if (disabled) return;
    const shortcut = getRelationColumnPickerShortcut(event);
    if (!shortcut || !applyShortcut(shortcut)) return;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <fieldset style={fieldsetStyle} onKeyDownCapture={handleShortcutKeyDown}>
      <legend style={{ padding: 0 }}>{copy.legend}</legend>
      <div style={searchRowStyle}>
        <input
          {...dataFlag(dataAttributes.search)}
          aria-label={copy.columnSearchAriaLabel}
          style={inputStyle}
          type="search"
          value={columnQuery}
          disabled={disabled}
          placeholder="Search"
          onChange={(event) => setColumnQuery(event.target.value)}
        />
        <button
          {...dataFlag(dataAttributes.searchClear)}
          aria-label={copy.clearSearchAriaLabel}
          disabled={disabled || !columnQuery}
          style={clearSearchStyle}
          type="button"
          onClick={() => setColumnQuery('')}
        >
          Clear
        </button>
      </div>
      <div style={relationActionsStyle}>
        <label style={selectedOnlyStyle}>
          <input
            {...dataFlag(dataAttributes.selectedOnly)}
            type="checkbox"
            checked={selectedOnly}
            disabled={disabled}
            onChange={(event) => setSelectedOnly(event.target.checked)}
          />
          Selected only
        </label>
        <span style={bulkActionsStyle}>
          <button
            {...dataFlag(dataAttributes.selectShown)}
            aria-keyshortcuts={relationColumnPickerShortcuts.selectShown}
            disabled={disabled || !hasUnselectedShownColumns}
            style={selectShownStyle}
            type="button"
            onClick={selectShownColumnSlugs}
          >
            Select shown
          </button>
          <button
            {...dataFlag(dataAttributes.clearShown)}
            aria-keyshortcuts={relationColumnPickerShortcuts.clearShown}
            disabled={disabled || !hasSelectedShownColumns}
            style={clearShownStyle}
            type="button"
            onClick={clearShownColumnSlugs}
          >
            Clear shown
          </button>
          <button
            {...dataFlags(dataAttributes.clearSelected)}
            disabled={disabled || !columnSlugs.length}
            style={clearSelectedStyle}
            type="button"
            onClick={clearSelectedColumnSlugs}
          >
            Clear selected
          </button>
          <button
            {...dataFlags(dataAttributes.undo)}
            aria-keyshortcuts={relationColumnPickerShortcuts.undo}
            disabled={disabled || !undoColumnSlugs}
            style={undoClearStyle}
            type="button"
            onClick={undoBulkColumnSlugs}
          >
            Undo
          </button>
        </span>
      </div>
      <span style={helperTextStyle}>{countSummary}</span>
      <RelationColumnPickerSelectedChips
        copy={copy}
        dataAttributes={dataAttributes}
        disabled={disabled}
        selectedColumnOptions={selectedColumnOptions}
        onColumnRemove={(slug) => updateColumnSlug(slug, false)}
      />
      <RelationColumnPickerList
        columnOptions={shownColumnOptions}
        dataAttributes={dataAttributes}
        disabled={disabled}
        emptyMessage={emptyRelationMessage}
        selectedColumnSlugs={selected}
        onColumnCheckedChange={updateColumnSlug}
      />
    </fieldset>
  );
}
