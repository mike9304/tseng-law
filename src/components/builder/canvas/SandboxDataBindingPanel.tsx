'use client';

import type {
  BuilderCanvasNode,
  BuilderDataBinding,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import {
  getBuilderBindableTarget,
  getBuilderBindableTargets,
  type BuilderDatasetSampleRecord,
} from '@/lib/builder/datasets';
import { resolveBuilderDatasetPreviewRecord } from '@/lib/builder/dataset-preview-binding';
import {
  getBuilderDataBindingFieldOptions,
  resolveBuilderStaleDataBindingFields,
} from '@/lib/builder/dataset-binding-validation';
import type {
  BuilderDatasetTargetId,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
import {
  InspectorNotice,
  InspectorSection,
  LabeledRow,
  NumberStepper,
  ToggleRow,
} from './InspectorControls';
import { useBuilderDatasetPreviewTargets } from './BuilderDatasetPreviewContext';

type BindableNodeKind = 'text' | 'heading' | 'image' | 'button' | 'gallery' | 'container';

interface BindingFieldControl {
  key: keyof BuilderDataBindingFieldMap;
  label: string;
  hint: string;
}

const FIELD_CONTROLS_BY_KIND: Record<BindableNodeKind, BindingFieldControl[]> = {
  text: [
    { key: 'text', label: 'Text', hint: 'content' },
    { key: 'href', label: 'Link', hint: 'href' },
  ],
  heading: [
    { key: 'text', label: 'Text', hint: 'content' },
  ],
  image: [
    { key: 'src', label: 'Image', hint: 'src' },
    { key: 'alt', label: 'Alt', hint: 'text' },
    { key: 'href', label: 'Link', hint: 'href' },
  ],
  gallery: [
    { key: 'src', label: 'Images', hint: 'src' },
    { key: 'alt', label: 'Alt', hint: 'text' },
    { key: 'caption', label: 'Caption', hint: 'text' },
  ],
  container: [
    { key: 'title', label: 'Item title', hint: 'text' },
    { key: 'description', label: 'Item copy', hint: 'text' },
    { key: 'src', label: 'Item image', hint: 'src' },
  ],
  button: [
    { key: 'label', label: 'Label', hint: 'text' },
    { key: 'href', label: 'Link', hint: 'href' },
  ],
};

function isBindableNode(node: BuilderCanvasNode): node is BuilderCanvasNode & { kind: BindableNodeKind } {
  return (
    node.kind === 'text'
    || node.kind === 'heading'
    || node.kind === 'image'
    || node.kind === 'button'
    || node.kind === 'gallery'
    || (node.kind === 'container' && node.content.layoutMode === 'repeater')
  );
}

function emptyBinding(targetId: BuilderDatasetTargetId): BuilderDataBinding {
  return {
    targetId,
    recordIndex: 0,
    fields: {},
  };
}

function normalizeBinding(
  current: BuilderDataBinding | undefined,
  targetId: BuilderDatasetTargetId
): BuilderDataBinding {
  return current?.targetId === targetId
    ? {
        targetId,
        recordIndex: current.recordIndex ?? 0,
        fields: { ...current.fields },
      }
    : emptyBinding(targetId);
}

function fieldSelectOptions(
  targetId: BuilderDatasetTargetId,
  controlKey: keyof BuilderDataBindingFieldMap
) {
  return getBuilderDataBindingFieldOptions(targetId, controlKey);
}

function getDatasetFieldLabel(
  targetId: BuilderDatasetTargetId,
  fieldId: string | undefined,
): string | null {
  if (!fieldId) return null;
  const field = getBuilderBindableTarget(targetId).bindableFields.find(
    (candidate) => candidate.fieldId === fieldId
  );
  return field?.label ?? fieldId;
}

function resolveStaleFieldRows(
  node: BuilderCanvasNode,
  targetId: BuilderDatasetTargetId,
  fields: BuilderDataBindingFieldMap,
  controls: readonly BindingFieldControl[],
) {
  const labelsByKey = new Map(controls.map((control) => [control.key, control.label] as const));
  return resolveBuilderStaleDataBindingFields({
    ...node,
    dataBinding: {
      targetId,
      recordIndex: node.dataBinding?.recordIndex ?? 0,
      fields,
    },
  }).map((row) => ({
    key: row.key,
    label: labelsByKey.get(row.key) ?? String(row.key),
    fieldId: row.fieldId,
  }));
}

function getDatasetFilterFieldLabel(
  targetId: BuilderDatasetTargetId,
  fieldId: string | undefined,
): string {
  if (!fieldId) return 'field';
  const field = getBuilderBindableTarget(targetId).filterFields.find(
    (candidate) => candidate.fieldId === fieldId
  );
  return field?.label ?? fieldId;
}

function getDatasetSortFieldLabel(
  targetId: BuilderDatasetTargetId,
  fieldId: string | undefined,
): string {
  if (!fieldId) return 'field';
  const field = getBuilderBindableTarget(targetId).sortFields.find(
    (candidate) => candidate.fieldId === fieldId
  );
  return field?.label ?? fieldId;
}

function formatDatasetFilterSummary(
  targetId: BuilderDatasetTargetId,
  filters: readonly BuilderPageDatasetFilter[] | undefined,
): string {
  const activeFilters = (filters ?? []).filter((filter) => filter.fieldId && filter.value);
  if (activeFilters.length === 0) return 'none';
  if (activeFilters.length > 1) return `${activeFilters.length} active`;

  const filter = activeFilters[0]!;
  const fieldLabel = getDatasetFilterFieldLabel(targetId, filter.fieldId);
  const operatorLabel = filter.operator === 'equals' ? '=' : 'contains';
  const value = filter.value.length > 24 ? `${filter.value.slice(0, 24)}...` : filter.value;
  return `${fieldLabel} ${operatorLabel} ${value}`;
}

function formatDatasetSortSummary(
  targetId: BuilderDatasetTargetId,
  sort: readonly BuilderPageDatasetSort[] | undefined,
): string {
  const activeSort = (sort ?? []).filter((rule) => rule.fieldId && rule.direction);
  if (activeSort.length === 0) return 'none';
  if (activeSort.length > 1) return `${activeSort.length} rules`;

  const rule = activeSort[0]!;
  return `${getDatasetSortFieldLabel(targetId, rule.fieldId)} ${rule.direction.toUpperCase()}`;
}

function readRepeaterChildMappingRows(targetId: BuilderDatasetTargetId) {
  const target = getBuilderBindableTarget(targetId);
  const fieldsById = new Map(target.bindableFields.map((field) => [field.fieldId, field] as const));
  const firstTextField = target.bindableFields.find((field) => (field.valueKind ?? 'text') === 'text')?.fieldId;
  const firstImageField = target.bindableFields.find((field) => field.valueKind === 'image')?.fieldId;
  const hrefField = fieldsById.has('href')
    ? 'href'
    : target.bindableFields.find((field) => field.valueKind === 'url')?.fieldId;
  const titleField = fieldsById.has('title') ? 'title' : firstTextField;
  const summaryField = fieldsById.has('summary')
    ? 'summary'
    : fieldsById.has('description')
      ? 'description'
      : titleField;

  return [
    titleField
      ? { label: 'Text / heading / button label', value: getDatasetFieldLabel(targetId, titleField) }
      : null,
    firstImageField
      ? { label: 'Image source', value: getDatasetFieldLabel(targetId, firstImageField) }
      : null,
    hrefField
      ? { label: 'Button / image link', value: getDatasetFieldLabel(targetId, hrefField) }
      : null,
    summaryField && summaryField !== titleField
      ? { label: 'Card copy / gallery caption', value: getDatasetFieldLabel(targetId, summaryField) }
      : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row?.value));
}

function resolveRepeaterComparisonWindow(
  records: readonly BuilderDatasetSampleRecord[],
  currentIndex: number,
): Array<{ index: number; record: BuilderDatasetSampleRecord }> {
  if (records.length <= 1) return [];
  const windowSize = Math.min(3, records.length);
  const start = Math.min(
    Math.max(0, currentIndex - 1),
    Math.max(0, records.length - windowSize),
  );
  return records.slice(start, start + windowSize).map((record, offset) => ({
    index: start + offset,
    record,
  }));
}

function truncateComparisonText(value: string | undefined): string {
  const text = (value ?? '').trim();
  if (!text) return 'Empty';
  return text.length > 72 ? `${text.slice(0, 72)}...` : text;
}

export default function SandboxDataBindingPanel({
  node,
  childNodes = [],
  childNodeCount = 0,
  disabled = false,
  onApplyRepeaterChildBindings,
  onUpdateDataBinding,
  previewRecordIndexOverride,
}: {
  node: BuilderCanvasNode;
  childNodes?: readonly BuilderCanvasNode[];
  childNodeCount?: number;
  disabled?: boolean;
  onApplyRepeaterChildBindings?: (targetId: BuilderDatasetTargetId) => void;
  onUpdateDataBinding: (dataBinding: BuilderDataBinding | undefined) => void;
  previewRecordIndexOverride?: number;
}) {
  const previewTargets = useBuilderDatasetPreviewTargets();

  if (!isBindableNode(node)) return null;

  const targets = getBuilderBindableTargets('home');
  const activeBinding = node.dataBinding;
  const targetId = activeBinding?.targetId ?? targets[0]?.targetId;
  if (!targetId) return null;

  const enabled = Boolean(activeBinding);
  const binding = normalizeBinding(activeBinding, targetId);
  const controls = FIELD_CONTROLS_BY_KIND[node.kind];
  const isRepeaterContainer = node.kind === 'container' && node.content.layoutMode === 'repeater';
  const targetDefinition = getBuilderBindableTarget(binding.targetId);
  const previewTarget = previewTargets.find((target) => target.targetId === binding.targetId);
  const sourceCollectionId = previewTarget?.collectionId ?? targetDefinition.defaultCollectionId;
  const sourceLimit = typeof previewTarget?.limit === 'number'
    ? previewTarget.limit
    : targetDefinition.defaultLimit;
  const sourceFilters = previewTarget?.filters ?? [];
  const sourceSort = previewTarget?.sort ?? targetDefinition.defaultSort ?? [];
  const previewRecords = previewTarget?.records ?? [];
  const recordMax = Math.max(1, previewRecords.length || 51);
  const hasInheritedPreviewRecord = typeof previewRecordIndexOverride === 'number';
  const previewRecordBinding = hasInheritedPreviewRecord
    ? {
        ...binding,
        recordIndex: previewRecordIndexOverride,
      }
    : binding;
  const recordNumber = Math.max(1, Math.min(recordMax, Math.trunc(previewRecordBinding.recordIndex ?? 0) + 1));
  const previewRecord = enabled ? resolveBuilderDatasetPreviewRecord(previewTargets, previewRecordBinding) : null;
  const staleFieldRows = enabled
    ? resolveStaleFieldRows(node, binding.targetId, binding.fields, controls)
    : [];
  const hasStaleFieldRows = staleFieldRows.length > 0;
  const repeaterChildMappingRows = isRepeaterContainer
    ? readRepeaterChildMappingRows(binding.targetId)
    : [];
  const effectiveChildNodeCount = childNodes.length || childNodeCount;
  const boundChildNodeCount = isRepeaterContainer
    ? childNodes.filter((childNode) => childNode.dataBinding?.targetId === binding.targetId).length
    : 0;
  const hasBoundChildTemplate = boundChildNodeCount > 0;
  const boundPreviewRows = previewRecord
    ? controls
        .map((control) => {
          const fieldId = binding.fields[control.key];
          if (!fieldId) return null;
          return {
            key: String(control.key),
            label: control.label,
            value: previewRecord.fieldValues[fieldId] ?? '',
          };
        })
        .filter((row): row is { key: string; label: string; value: string } => row !== null)
    : [];
  const repeaterComparisonFieldId = isRepeaterContainer
    ? binding.fields.title ?? binding.fields.text ?? binding.fields.label ?? binding.fields.description
    : undefined;
  const repeaterComparisonFieldLabel = repeaterComparisonFieldId
    ? getDatasetFieldLabel(binding.targetId, repeaterComparisonFieldId) ?? repeaterComparisonFieldId
    : 'Primary';
  const repeaterComparisonRows = isRepeaterContainer && enabled && !hasInheritedPreviewRecord
    ? resolveRepeaterComparisonWindow(previewRecords, recordNumber - 1)
    : [];

  const updateBinding = (next: BuilderDataBinding) => {
    onUpdateDataBinding({
      targetId: next.targetId,
      recordIndex: Math.max(0, Math.min(recordMax - 1, Math.trunc(next.recordIndex ?? 0))),
      fields: Object.fromEntries(
        Object.entries(next.fields).filter(([, value]) => Boolean(value)),
      ) as BuilderDataBindingFieldMap,
    });
  };

  return (
    <InspectorSection label="Data" title="Field binding">
      <div data-builder-data-binding-panel="true" data-builder-data-binding-enabled={enabled ? 'true' : 'false'}>
        <InspectorNotice tone={hasStaleFieldRows ? 'detached' : enabled ? 'linked' : 'neutral'}>
          {hasStaleFieldRows
            ? 'Dataset binding needs attention before publishing.'
            : enabled
              ? 'This element uses dataset fields at publish/runtime.'
              : 'Bind this element to home insights or service records.'}
        </InspectorNotice>

        {enabled ? (
          <div className="insp-data-source-summary" data-builder-data-source-summary="true">
            <span>Connected to: {targetDefinition.title}</span>
            <span>Collection: {sourceCollectionId}</span>
            <span>Limit: {sourceLimit ?? 'all'}</span>
            <span>Filter: {formatDatasetFilterSummary(binding.targetId, sourceFilters)}</span>
            <span>Sort: {formatDatasetSortSummary(binding.targetId, sourceSort)}</span>
            <span>Published runtime: applied</span>
          </div>
        ) : null}

        {hasStaleFieldRows ? (
          <div
            className="insp-data-binding-warning"
            data-builder-data-binding-warning="true"
            role="status"
          >
            <strong>Missing or incompatible field</strong>
            <span>Choose a replacement field below, or set the row to Not bound.</span>
            <ul>
              {staleFieldRows.map((row) => (
                <li key={row.key}>
                  {row.label}: <code>{row.fieldId}</code>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <LabeledRow label="Use data" hint="dataset">
          <ToggleRow
            checked={enabled}
            disabled={disabled}
            ariaLabel="Toggle dataset field binding"
            onChange={(next) => {
              onUpdateDataBinding(next ? binding : undefined);
            }}
          />
        </LabeledRow>

        <LabeledRow label="Dataset" hint="source">
          <select
            className="insp-select"
            data-builder-data-binding-target="true"
            value={binding.targetId}
            disabled={disabled || !enabled}
            onChange={(event) => {
              const nextTarget = event.target.value as BuilderDatasetTargetId;
              onUpdateDataBinding(emptyBinding(nextTarget));
            }}
          >
            {targets.map((target) => (
              <option key={target.targetId} value={target.targetId}>
                {target.title}
              </option>
            ))}
          </select>
        </LabeledRow>

        {previewRecords.length > 0 ? (
          <LabeledRow
            label="Preview"
            hint="record"
            helper={enabled ? 'Switches only the editor preview record. It does not edit CMS data.' : undefined}
          >
            <select
              className="insp-select"
              data-builder-data-record-select="true"
              value={previewRecords[recordNumber - 1]?.recordId ?? ''}
              disabled={disabled || !enabled || hasInheritedPreviewRecord}
              onChange={(event) => {
                const nextIndex = previewRecords.findIndex(
                  (record) => record.recordId === event.target.value
                );
                if (nextIndex < 0) return;
                updateBinding({
                  ...binding,
                  recordIndex: nextIndex,
                });
              }}
            >
              {previewRecords.map((record, index) => (
                <option key={record.recordId} value={record.recordId}>
                  {index + 1}. {record.primaryLabel}
                </option>
              ))}
            </select>
          </LabeledRow>
        ) : null}

        <LabeledRow label="Record" hint="row">
          <NumberStepper
            value={recordNumber}
            min={1}
            max={recordMax}
            disabled={disabled || !enabled || hasInheritedPreviewRecord}
            ariaLabel="Dataset record number"
            onChange={(value) => {
              updateBinding({
                ...binding,
                recordIndex: Math.max(0, Math.min(recordMax - 1, Math.trunc(value) - 1)),
              });
            }}
          />
        </LabeledRow>

        {enabled && previewRecord ? (
          <div className="insp-data-preview" data-builder-data-record-preview="true">
            <span className="insp-data-preview-mode" data-builder-data-preview-mode="true">
              {hasInheritedPreviewRecord
                ? 'Previewing CMS record data inherited from the parent repeater. Template content remains editable; record data is read-only here.'
                : 'Previewing CMS record data. Template content remains editable; record data is read-only here.'}
            </span>
            <div className="insp-data-preview-meta">
              <span data-builder-data-record-position="true">
                Record {recordNumber} of {previewRecords.length || recordMax}
              </span>
              <span>{previewTarget?.title ?? binding.targetId}</span>
            </div>
            <strong data-builder-data-preview-primary="true">{previewRecord.primaryLabel}</strong>
            <p data-builder-data-preview-secondary="true">{previewRecord.secondaryLabel}</p>
            <small data-builder-data-preview-route="true">{previewRecord.routePath}</small>
            {boundPreviewRows.length > 0 ? (
              <dl data-builder-data-field-preview="true">
                {boundPreviewRows.map((row) => (
                  <div key={row.key}>
                    <dt>{row.label}</dt>
                    <dd>{row.value || 'Empty'}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : enabled && previewTarget ? (
          <InspectorNotice tone="neutral">
            No sample records are available for this dataset preview.
          </InspectorNotice>
        ) : null}

        {repeaterComparisonRows.length > 0 ? (
          <div
            className="insp-repeater-record-compare"
            data-builder-repeater-record-comparison="true"
            aria-label="Repeater record comparison"
          >
            <div className="insp-repeater-record-compare-head">
              <strong>Record comparison</strong>
              <span>{repeaterComparisonFieldLabel}</span>
            </div>
            {repeaterComparisonRows.map(({ index, record }) => {
              const selectedRow = index === recordNumber - 1;
              const comparisonValue = repeaterComparisonFieldId
                ? record.fieldValues[repeaterComparisonFieldId]
                : record.primaryLabel;
              return (
                <button
                  key={record.recordId}
                  type="button"
                  className="insp-repeater-record-compare-row"
                  data-builder-repeater-record-comparison-row="true"
                  data-builder-repeater-record-comparison-current={selectedRow ? 'true' : undefined}
                  aria-pressed={selectedRow}
                  disabled={disabled}
                  onClick={() => {
                    updateBinding({
                      ...binding,
                      recordIndex: index,
                    });
                  }}
                >
                  <span>{index + 1}</span>
                  <strong>{truncateComparisonText(record.primaryLabel)}</strong>
                  <small>{truncateComparisonText(comparisonValue)}</small>
                </button>
              );
            })}
          </div>
        ) : null}

        {controls.map((control) => (
          <LabeledRow key={control.key} label={control.label} hint={control.hint}>
            {(() => {
              const selectedFieldId = binding.fields[control.key] ?? '';
              const options = fieldSelectOptions(binding.targetId, control.key);
              const selectedFieldIsStale = Boolean(
                selectedFieldId && !options.some((field) => field.fieldId === selectedFieldId)
              );
              return (
                <select
                  className="insp-select"
                  data-builder-data-binding-field={control.key}
                  data-builder-data-binding-stale-field={selectedFieldIsStale ? 'true' : undefined}
                  value={selectedFieldId}
                  disabled={disabled || !enabled}
                  onChange={(event) => {
                    const value = event.target.value;
                    const nextFields = { ...binding.fields };
                    if (value) {
                      nextFields[control.key] = value;
                    } else {
                      delete nextFields[control.key];
                    }
                    updateBinding({
                      ...binding,
                      fields: nextFields,
                    });
                  }}
                >
                  <option value="">Not bound</option>
                  {selectedFieldIsStale ? (
                    <option value={selectedFieldId}>
                      Missing field: {selectedFieldId}
                    </option>
                  ) : null}
                  {options.map((field) => (
                    <option key={field.fieldId} value={field.fieldId}>
                      {field.label}
                    </option>
                  ))}
                </select>
              );
            })()}
          </LabeledRow>
        ))}

        {isRepeaterContainer ? (
          <div className="insp-repeater-authoring" data-builder-repeater-binding-authoring="true">
            <InspectorNotice tone={effectiveChildNodeCount > 0 ? 'linked' : 'neutral'}>
              {effectiveChildNodeCount > 0
                ? `This repeater has ${effectiveChildNodeCount} template child${effectiveChildNodeCount === 1 ? '' : 'ren'} ready for dataset binding.`
                : 'Add child elements inside this repeater to create a repeatable template.'}
            </InspectorNotice>
            {enabled && effectiveChildNodeCount > 0 ? (
              <div
                className="insp-repeater-binding-status"
                data-builder-repeater-binding-status="true"
              >
                <span>
                  {hasBoundChildTemplate
                    ? `${boundChildNodeCount} template child${boundChildNodeCount === 1 ? '' : 'ren'} bound`
                    : 'No template children bound yet'}
                </span>
                <small>{targetDefinition.title}</small>
              </div>
            ) : null}
            {repeaterChildMappingRows.length > 0 ? (
              <dl
                className="insp-repeater-binding-map"
                data-builder-repeater-binding-map="true"
                aria-label="Repeater child binding map"
              >
                {repeaterChildMappingRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <button
              type="button"
              className="insp-action-button"
              data-builder-repeater-bind-children="true"
              disabled={disabled || !enabled || effectiveChildNodeCount === 0 || !onApplyRepeaterChildBindings}
              onClick={() => onApplyRepeaterChildBindings?.(binding.targetId)}
            >
              {hasBoundChildTemplate ? 'Replace child template bindings' : 'Bind child template'}
            </button>
          </div>
        ) : null}
      </div>
    </InspectorSection>
  );
}
