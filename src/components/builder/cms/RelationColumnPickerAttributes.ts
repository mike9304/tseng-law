export type RelationColumnPickerCopy = {
  readonly clearSearchAriaLabel: string;
  readonly columnSearchAriaLabel: string;
  readonly emptyList: string;
  readonly emptySelectedList: string;
  readonly emptySelectedSearch: string;
  readonly legend: string;
  readonly noSelectedColumns: string;
  readonly removeColumnAriaLabel: (title: string) => string;
  readonly selectedColumnsAriaLabel: string;
};

export type RelationColumnPickerDataAttributes = {
  readonly clearSelected: readonly string[];
  readonly clearShown: string;
  readonly column: string;
  readonly columnPicker: string;
  readonly search: string;
  readonly searchClear: string;
  readonly selectShown: string;
  readonly selectedColumn: string;
  readonly selectedColumnRemove: string;
  readonly selectedColumns: string;
  readonly selectedOnly: string;
  readonly undo: readonly string[];
};

export function dataFlag(name: string): Record<string, true> {
  return { [name]: true };
}

export function dataFlags(names: readonly string[]): Record<string, true> {
  const attributes: Record<string, true> = {};
  names.forEach((name) => {
    attributes[name] = true;
  });
  return attributes;
}

export function dataValue(name: string, value: string): Record<string, string> {
  return { [name]: value };
}
