export type FormConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FormFieldCondition {
  fieldName: string;
  operator: FormConditionOperator;
  value?: string;
}

export type FormValues = Record<string, string | string[] | undefined>;

function toText(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(',');
  return value ?? '';
}

export function evaluateFormFieldCondition(
  condition: FormFieldCondition | undefined,
  values: FormValues,
): boolean {
  if (!condition) return true;

  const actualValue = values[condition.fieldName];
  const actual = toText(actualValue);
  const expected = condition.value ?? '';

  switch (condition.operator) {
    case 'equals':
      return Array.isArray(actualValue) ? actualValue.includes(expected) : actual === expected;
    case 'notEquals':
      return Array.isArray(actualValue) ? !actualValue.includes(expected) : actual !== expected;
    case 'contains':
      return actual.includes(expected);
    case 'isEmpty':
      return actual.trim().length === 0;
    case 'isNotEmpty':
      return actual.trim().length > 0;
    default:
      return true;
  }
}
