'use client';

import type {
  BuilderCanvasNode,
  BuilderDataBinding,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import {
  getBuilderBindableTarget,
  getBuilderBindableTargets,
} from '@/lib/builder/datasets';
import { resolveBuilderDatasetPreviewRecord } from '@/lib/builder/dataset-preview-binding';
import RepeaterMultiRecordPreview from '@/components/builder/canvas/RepeaterMultiRecordPreview';
import {
  getBuilderDataBindingFieldOptions,
  resolveBuilderStaleDataBindingFields,
} from '@/lib/builder/dataset-binding-validation';
import { buildRepeaterRecordComparisonModel } from './repeater-record-comparison';
import type { Locale } from '@/lib/locales';
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
import {
  getSandboxDataBindingPanelCopy,
  type DataBindingBindableNodeKind,
  type DataBindingFieldControl,
  type SandboxDataBindingPanelCopy,
} from './sandbox-data-binding-panel-copy';

function isBindableNode(node: BuilderCanvasNode): node is BuilderCanvasNode & { kind: DataBindingBindableNodeKind } {
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
  controls: readonly DataBindingFieldControl[],
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
  copy: SandboxDataBindingPanelCopy,
): string {
  if (!fieldId) return copy.fieldFallbackLabel;
  const field = getBuilderBindableTarget(targetId).filterFields.find(
    (candidate) => candidate.fieldId === fieldId
  );
  return field?.label ?? fieldId;
}

function getDatasetSortFieldLabel(
  targetId: BuilderDatasetTargetId,
  fieldId: string | undefined,
  copy: SandboxDataBindingPanelCopy,
): string {
  if (!fieldId) return copy.fieldFallbackLabel;
  const field = getBuilderBindableTarget(targetId).sortFields.find(
    (candidate) => candidate.fieldId === fieldId
  );
  return field?.label ?? fieldId;
}

function formatDatasetFilterSummary(
  targetId: BuilderDatasetTargetId,
  filters: readonly BuilderPageDatasetFilter[] | undefined,
  copy: SandboxDataBindingPanelCopy,
): string {
  const activeFilters = (filters ?? []).filter((filter) => filter.fieldId && filter.value);
  if (activeFilters.length === 0) return copy.noneSummary;
  if (activeFilters.length > 1) return copy.activeFilterSummary(activeFilters.length);

  const filter = activeFilters[0]!;
  const fieldLabel = getDatasetFilterFieldLabel(targetId, filter.fieldId, copy);
  const operatorLabel = filter.operator === 'equals' ? '=' : copy.containsOperatorLabel;
  const value = filter.value.length > 24 ? `${filter.value.slice(0, 24)}...` : filter.value;
  return `${fieldLabel} ${operatorLabel} ${value}`;
}

function formatDatasetSortSummary(
  targetId: BuilderDatasetTargetId,
  sort: readonly BuilderPageDatasetSort[] | undefined,
  copy: SandboxDataBindingPanelCopy,
): string {
  const activeSort = (sort ?? []).filter((rule) => rule.fieldId && rule.direction);
  if (activeSort.length === 0) return copy.noneSummary;
  if (activeSort.length > 1) return copy.sortRuleSummary(activeSort.length);

  const rule = activeSort[0]!;
  return `${getDatasetSortFieldLabel(targetId, rule.fieldId, copy)} ${copy.sortDirectionLabel(rule.direction)}`;
}

function readRepeaterChildMappingRows(targetId: BuilderDatasetTargetId, copy: SandboxDataBindingPanelCopy) {
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
      ? { label: copy.childMappingTextLabel, value: getDatasetFieldLabel(targetId, titleField) }
      : null,
    firstImageField
      ? { label: copy.childMappingImageSourceLabel, value: getDatasetFieldLabel(targetId, firstImageField) }
      : null,
    hrefField
      ? { label: copy.childMappingLinkLabel, value: getDatasetFieldLabel(targetId, hrefField) }
      : null,
    summaryField && summaryField !== titleField
      ? { label: copy.childMappingCopyLabel, value: getDatasetFieldLabel(targetId, summaryField) }
      : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row?.value));
}

function truncateComparisonText(value: string | undefined, copy: SandboxDataBindingPanelCopy): string {
  const text = (value ?? '').trim();
  if (!text) return copy.emptyValue;
  return text.length > 72 ? `${text.slice(0, 72)}...` : text;
}

export default function SandboxDataBindingPanel({
  node,
  childNodes = [],
  childNodeCount = 0,
  disabled = false,
  locale = 'ko',
  onApplyRepeaterChildBindings,
  onUpdateDataBinding,
  previewRecordIndexOverride,
}: {
  node: BuilderCanvasNode;
  childNodes?: readonly BuilderCanvasNode[];
  childNodeCount?: number;
  disabled?: boolean;
  locale?: Locale;
  onApplyRepeaterChildBindings?: (targetId: BuilderDatasetTargetId) => void;
  onUpdateDataBinding: (dataBinding: BuilderDataBinding | undefined) => void;
  previewRecordIndexOverride?: number;
}) {
  const previewTargets = useBuilderDatasetPreviewTargets();
  const copy = getSandboxDataBindingPanelCopy(locale);

  if (!isBindableNode(node)) return null;

  const targets = getBuilderBindableTargets('home');
  const activeBinding = node.dataBinding;
  const targetId = activeBinding?.targetId ?? targets[0]?.targetId;
  if (!targetId) return null;

  const enabled = Boolean(activeBinding);
  const binding = normalizeBinding(activeBinding, targetId);
  const controls = copy.fieldControlsByKind[node.kind];
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
  const repeaterPreviewLoading = isRepeaterContainer && enabled && !previewTarget;
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
    ? readRepeaterChildMappingRows(binding.targetId, copy)
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
  const repeaterComparisonModel = isRepeaterContainer && enabled && !hasInheritedPreviewRecord
    ? buildRepeaterRecordComparisonModel({
        childNodes,
        containerFields: binding.fields,
        currentIndex: recordNumber - 1,
        emptyValue: copy.emptyValue,
        records: previewRecords,
        resolveFieldLabel: (fieldId) => getDatasetFieldLabel(binding.targetId, fieldId),
        targetId: binding.targetId,
      })
    : { rows: [], fieldSummary: '' };
  const repeaterComparisonRows = repeaterComparisonModel.rows;
  const repeaterComparisonFieldLabel =
    repeaterComparisonModel.fieldSummary || copy.repeaterComparisonPrimaryFallback;
  const repeaterPreviewActiveRecordId = previewRecords[recordNumber - 1]?.recordId ?? previewRecords[0]?.recordId ?? '';

  const updateBinding = (next: BuilderDataBinding) => {
    onUpdateDataBinding({
      targetId: next.targetId,
      recordIndex: Math.max(0, Math.min(recordMax - 1, Math.trunc(next.recordIndex ?? 0))),
      fields: Object.fromEntries(
        Object.entries(next.fields).filter(([, value]) => Boolean(value)),
      ) as BuilderDataBindingFieldMap,
    });
  };
  const handleRepeaterPreviewChange = (recordId: string) => {
    const nextIndex = previewRecords.findIndex((record) => record.recordId === recordId);
    if (nextIndex < 0) return;
    updateBinding({
      ...binding,
      recordIndex: nextIndex,
    });
  };

  return (
    <InspectorSection label={copy.sectionLabel} title={copy.sectionTitle}>
      <div data-builder-data-binding-panel="true" data-builder-data-binding-enabled={enabled ? 'true' : 'false'}>
        <InspectorNotice tone={hasStaleFieldRows ? 'detached' : enabled ? 'linked' : 'neutral'}>
          {hasStaleFieldRows
            ? copy.staleNotice
            : enabled
              ? copy.enabledNotice
              : copy.disabledNotice}
        </InspectorNotice>

        {enabled ? (
          <div className="insp-data-source-summary" data-builder-data-source-summary="true">
            <span>{copy.connectedTo(targetDefinition.title)}</span>
            <span>{copy.collectionSummary(sourceCollectionId)}</span>
            <span>{copy.limitSummary(sourceLimit)}</span>
            <span>{copy.filterSummary(formatDatasetFilterSummary(binding.targetId, sourceFilters, copy))}</span>
            <span>{copy.sortSummary(formatDatasetSortSummary(binding.targetId, sourceSort, copy))}</span>
            <span>{copy.publishedRuntimeApplied}</span>
          </div>
        ) : null}

        {hasStaleFieldRows ? (
          <div
            className="insp-data-binding-warning"
            data-builder-data-binding-warning="true"
            role="status"
          >
            <strong>{copy.staleWarningTitle}</strong>
            <span>{copy.staleWarningBody}</span>
            <ul>
              {staleFieldRows.map((row) => (
                <li key={row.key}>
                  {row.label}: <code>{row.fieldId}</code>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <LabeledRow label={copy.useDataLabel} hint={copy.useDataHint}>
          <ToggleRow
            checked={enabled}
            disabled={disabled}
            ariaLabel={copy.toggleBindingAriaLabel}
            onChange={(next) => {
              onUpdateDataBinding(next ? binding : undefined);
            }}
          />
        </LabeledRow>

        <LabeledRow label={copy.datasetLabel} hint={copy.datasetHint}>
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

        {enabled && previewRecords.length > 0 ? (
          <LabeledRow
            label={copy.previewLabel}
            hint={copy.previewHint}
            helper={enabled ? copy.previewHelper : undefined}
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

        <LabeledRow label={copy.recordLabel} hint={copy.recordHint}>
          <NumberStepper
            value={recordNumber}
            min={1}
            max={recordMax}
            disabled={disabled || !enabled || hasInheritedPreviewRecord}
            ariaLabel={copy.recordNumberAriaLabel}
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
                ? copy.previewModeInherited
                : copy.previewModeDirect}
            </span>
            <div className="insp-data-preview-meta">
              <span data-builder-data-record-position="true">
                {copy.recordPosition(recordNumber, previewRecords.length || recordMax)}
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
                    <dd>{row.value || copy.emptyValue}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : enabled && previewTarget ? (
          <InspectorNotice tone="neutral">
            {copy.noSampleRecordsNotice}
          </InspectorNotice>
        ) : null}

        {isRepeaterContainer ? (
          <RepeaterMultiRecordPreview
            loading={repeaterPreviewLoading}
            records={previewRecords}
            title={copy.repeaterPreviewTitle}
            description={enabled
              ? copy.repeaterPreviewEnabledDescription
              : copy.repeaterPreviewDisabledDescription}
            initialActiveRecordId={repeaterPreviewActiveRecordId}
            onActiveRecordChange={handleRepeaterPreviewChange}
            labels={{
              loadingStatus: copy.repeaterPreviewLoadingStatus,
              loadingListAriaLabel: copy.repeaterPreviewLoadingAriaLabel,
              emptyMessage: copy.repeaterPreviewEmptyMessage,
              visibleRecordSummary: copy.repeaterPreviewVisibleSummary,
              switcherAriaLabel: copy.repeaterPreviewSwitcherAriaLabel,
            }}
          />
        ) : null}

        {repeaterComparisonRows.length > 0 ? (
          <div
            className="insp-repeater-record-compare"
            data-builder-repeater-record-comparison="true"
            aria-label={copy.repeaterComparisonAriaLabel}
          >
            <div className="insp-repeater-record-compare-head">
              <strong>{copy.repeaterComparisonTitle}</strong>
              <span>{repeaterComparisonFieldLabel}</span>
            </div>
            {repeaterComparisonRows.map(({ fields, index, record }) => {
              const selectedRow = index === recordNumber - 1;
              const primaryField = fields[0];
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
                  <strong>{truncateComparisonText(record.primaryLabel, copy)}</strong>
                  <small>
                    {primaryField
                      ? `${primaryField.label}: ${truncateComparisonText(primaryField.value, copy)}`
                      : truncateComparisonText(record.primaryLabel, copy)}
                  </small>
                  {fields.length > 0 ? (
                    <div
                      className="insp-repeater-record-compare-fields"
                      data-builder-repeater-record-comparison-fields="true"
                    >
                      {fields.map((field) => (
                        <div
                          key={field.fieldId}
                          data-builder-repeater-record-comparison-field="true"
                          data-builder-repeater-record-comparison-field-id={field.fieldId}
                        >
                          <em>{field.label}</em>
                          <b>{truncateComparisonText(field.value, copy)}</b>
                        </div>
                      ))}
                    </div>
                  ) : null}
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
                  <option value="">{copy.notBoundOption}</option>
                  {selectedFieldIsStale ? (
                    <option value={selectedFieldId}>
                      {copy.missingFieldOption(selectedFieldId)}
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
                ? copy.repeaterTemplateReadyNotice(effectiveChildNodeCount)
                : copy.repeaterTemplateEmptyNotice}
            </InspectorNotice>
            {enabled && effectiveChildNodeCount > 0 ? (
              <div
                className="insp-repeater-binding-status"
                data-builder-repeater-binding-status="true"
              >
                <span>
                  {hasBoundChildTemplate
                    ? copy.repeaterTemplateBoundStatus(boundChildNodeCount)
                    : copy.repeaterTemplateUnboundStatus}
                </span>
                <small>{targetDefinition.title}</small>
              </div>
            ) : null}
            {repeaterChildMappingRows.length > 0 ? (
              <dl
                className="insp-repeater-binding-map"
                data-builder-repeater-binding-map="true"
                aria-label={copy.repeaterChildBindingMapAriaLabel}
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
              {hasBoundChildTemplate ? copy.replaceChildTemplateBindingsLabel : copy.bindChildTemplateLabel}
            </button>
          </div>
        ) : null}
      </div>
    </InspectorSection>
  );
}
