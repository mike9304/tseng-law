import styles from './SandboxPage.module.css';

export interface CatalogWidgetPresetLike {
  id: string;
  label: string;
  description: string;
  icon: string;
}

type CatalogWidgetSectionVariant = 'text' | 'media';

interface SandboxCatalogWidgetSectionProps<TPreset extends CatalogWidgetPresetLike> {
  categoryId: string;
  icon: string;
  name: string;
  hint: string;
  presets: TPreset[];
  isOpen: boolean;
  dataAttribute: `data-${string}`;
  onAdd: (preset: TPreset) => void;
  onToggle: () => void;
  variant?: CatalogWidgetSectionVariant;
}

export function SandboxCatalogWidgetSection<TPreset extends CatalogWidgetPresetLike>({
  categoryId,
  icon,
  name,
  hint,
  presets,
  isOpen,
  dataAttribute,
  onAdd,
  onToggle,
  variant = 'media',
}: SandboxCatalogWidgetSectionProps<TPreset>) {
  if (presets.length === 0) return null;

  const isTextVariant = variant === 'text';
  const gridClassName = isTextVariant ? styles.textWidgetGrid : styles.mediaWidgetGrid;
  const buttonClassName = isTextVariant ? styles.textWidgetPresetButton : styles.mediaWidgetPresetButton;
  const iconClassName = isTextVariant ? styles.textWidgetPresetIcon : styles.mediaWidgetPresetIcon;
  const copyClassName = isTextVariant ? styles.textWidgetPresetCopy : styles.mediaWidgetPresetCopy;

  return (
    <div className={styles.catalogCategorySection} data-builder-catalog-widget-section={categoryId}>
      <button
        type="button"
        className={`${styles.catalogCategoryButton} ${isOpen ? styles.catalogCategoryButtonOpen : ''}`}
        onClick={onToggle}
      >
        <span className={styles.catalogCategoryMeta}>
          <span className={styles.catalogCategoryIcon}>{icon}</span>
          <span className={styles.catalogCategoryTitle}>
            <span className={styles.catalogCategoryName}>{name}</span>
            <span className={styles.catalogCategoryHint}>{hint}</span>
          </span>
        </span>
        <span className={styles.catalogCategoryToggle}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div className={gridClassName}>
          {presets.map((preset) => {
            const presetDataAttribute = { [dataAttribute]: preset.id };

            return (
              <button
                key={preset.id}
                type="button"
                className={buttonClassName}
                {...presetDataAttribute}
                onClick={() => onAdd(preset)}
              >
                <span className={iconClassName}>{preset.icon}</span>
                <span className={copyClassName}>
                  <strong>{preset.label}</strong>
                  <small>{preset.description}</small>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
