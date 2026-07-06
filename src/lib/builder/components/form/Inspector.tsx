import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormCanvasNode } from '@/lib/builder/canvas/types';
import { FORM_KO_DEFAULTS, getFormControlsCopy, localizedFormControlText } from './form-controls-copy';
import styles from './FormInspector.module.css';
import {
  DEFAULT_FLEX,
  DEFAULT_GRID,
  type ContainerLayoutMode,
  type FlexConfig,
  type GridConfig,
} from '@/lib/builder/canvas/layout-modes';

export default function FormInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const formNode = node as BuilderFormCanvasNode;
  const content = formNode.content;
  const layoutMode: ContainerLayoutMode = content.layoutMode ?? 'absolute';
  const flexConfig: FlexConfig = content.flexConfig ?? DEFAULT_FLEX;
  const gridConfig: GridConfig = content.gridConfig ?? DEFAULT_GRID;
  const copy = getFormControlsCopy(locale ?? 'en');
  const successMessage = localizedFormControlText(
    content.successMessage,
    copy.formDefaults.successMessage,
    FORM_KO_DEFAULTS.successMessage,
  );

  return (
    <div className={styles.root} data-builder-form-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.formNameLabel}</span>
        <input
          className={styles.control}
          type="text"
          value={content.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
          placeholder={copy.formInspector.formNamePlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.submitToLabel}</span>
        <select
          className={styles.control}
          value={content.submitTo}
          disabled={disabled}
          onChange={(event) => onUpdate({ submitTo: event.target.value })}
        >
          <option value="storage">{copy.formInspector.storageLabel}</option>
          <option value="email">{copy.formInspector.emailLabel}</option>
          <option value="webhook">{copy.formInspector.webhookLabel}</option>
        </select>
      </label>
      {content.submitTo === 'email' ? (
        <label className={styles.field}>
          <span className={styles.label}>{copy.formInspector.targetEmailLabel}</span>
          <input
            className={styles.control}
            type="email"
            value={content.targetEmail ?? ''}
            disabled={disabled}
            onChange={(event) => onUpdate({ targetEmail: event.target.value || undefined })}
            placeholder={copy.formInspector.targetEmailPlaceholder}
          />
        </label>
      ) : null}
      {content.submitTo === 'webhook' ? (
        <label className={styles.field}>
          <span className={styles.label}>{copy.formInspector.webhookUrlLabel}</span>
          <input
            className={styles.control}
            type="url"
            value={content.webhookUrl ?? ''}
            disabled={disabled}
            onChange={(event) => onUpdate({ webhookUrl: event.target.value || undefined })}
            placeholder={copy.formInspector.webhookUrlPlaceholder}
          />
        </label>
      ) : null}
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.successMessageLabel}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          value={successMessage}
          rows={2}
          disabled={disabled}
          onChange={(event) => onUpdate({ successMessage: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.redirectUrlLabel}</span>
        <input
          className={styles.control}
          type="text"
          value={content.redirectUrl ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ redirectUrl: event.target.value })}
          placeholder={copy.formInspector.redirectUrlPlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.captchaLabel}</span>
        <select
          className={styles.control}
          value={content.captcha ?? 'none'}
          disabled={disabled}
          onChange={(event) => onUpdate({ captcha: event.target.value })}
        >
          <option value="none">{copy.formInspector.noneLabel}</option>
          <option value="hcaptcha">hCaptcha</option>
          <option value="turnstile">Turnstile</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.stepsJsonLabel}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={4}
          value={JSON.stringify(content.steps ?? [], null, 2)}
          disabled={disabled}
          onChange={(event) => {
            try {
              const parsed = JSON.parse(event.target.value) as unknown;
              onUpdate({ steps: Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined });
            } catch {
              // Keep the last valid value while the admin is typing.
            }
          }}
          placeholder={copy.formInspector.stepsJsonPlaceholder}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={content.autoReplyEnabled ?? false}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoReplyEnabled: event.target.checked })}
        />
        <span>{copy.formInspector.autoReplyLabel}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.formInspector.autoReplyTemplateLabel}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={3}
          value={content.autoReplyTemplate ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoReplyTemplate: event.target.value })}
          placeholder={copy.formDefaults.autoReplyTemplatePlaceholder}
        />
      </label>

      <span className={styles.sectionLabel}>{copy.formInspector.layoutModeLabel}</span>
      <select
        className={styles.control}
        value={layoutMode}
        disabled={disabled}
        onChange={(event) => {
          const mode = event.target.value as ContainerLayoutMode;
          const patch: Record<string, unknown> = { layoutMode: mode };
          if (mode === 'flex' && !content.flexConfig) {
            patch.flexConfig = { ...DEFAULT_FLEX };
          }
          if (mode === 'grid' && !content.gridConfig) {
            patch.gridConfig = { ...DEFAULT_GRID };
          }
          onUpdate(patch);
        }}
      >
        <option value="absolute">{copy.formInspector.absoluteLabel}</option>
        <option value="flex">{copy.formInspector.flexLabel}</option>
        <option value="grid">{copy.formInspector.gridLabel}</option>
      </select>

      {layoutMode === 'flex' ? (
        <>
          <span className={styles.sectionLabel}>{copy.formInspector.flexSettingsLabel}</span>
          <label className={styles.field}>
            <span className={styles.label}>{copy.formInspector.directionLabel}</span>
            <select
              className={styles.control}
              value={flexConfig.direction}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({
                  flexConfig: { ...flexConfig, direction: event.target.value as FlexConfig['direction'] },
                })
              }
            >
              <option value="row">{copy.formInspector.rowLabel}</option>
              <option value="column">{copy.formInspector.columnLabel}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.formInspector.gapLabel}</span>
            <input
              className={styles.control}
              type="number"
              min={0}
              max={200}
              value={flexConfig.gap}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ flexConfig: { ...flexConfig, gap: Number(event.target.value) } })
              }
            />
          </label>
        </>
      ) : null}

      {layoutMode === 'grid' ? (
        <>
          <span className={styles.sectionLabel}>{copy.formInspector.gridSettingsLabel}</span>
          <label className={styles.field}>
            <span className={styles.label}>{copy.formInspector.columnsLabel}</span>
            <input
              className={styles.control}
              type="number"
              min={1}
              max={12}
              value={gridConfig.columns}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ gridConfig: { ...gridConfig, columns: Number(event.target.value) } })
              }
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.formInspector.rowGapLabel}</span>
            <input
              className={styles.control}
              type="number"
              min={0}
              max={200}
              value={gridConfig.rowGap}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ gridConfig: { ...gridConfig, rowGap: Number(event.target.value) } })
              }
            />
          </label>
        </>
      ) : null}
    </div>
  );
}
