import type { ThemeBindingIndicator } from '@/lib/builder/site/theme-bindings';
import styles from './ThemeBindingBadge.module.css';

export default function ThemeBindingBadge({
  indicator,
  border = 'default',
  disabled,
  onClick,
  showDot = false,
  textCase = 'uppercase',
}: {
  indicator: ThemeBindingIndicator;
  border?: 'default' | 'none';
  disabled?: boolean;
  onClick?: () => void;
  showDot?: boolean;
  textCase?: 'uppercase' | 'normal';
}) {
  const content = (
    <>
      {showDot ? <span className={styles.dot} aria-hidden /> : null}
      {indicator.label}
    </>
  );

  if (onClick || disabled !== undefined) {
    return (
      <button
        type="button"
        title={indicator.title}
        className={styles.badge}
        data-theme-binding-tone={indicator.tone}
        data-theme-binding-case={textCase}
        data-theme-binding-border={border}
        data-theme-binding-interactive={onClick ? 'true' : undefined}
        disabled={disabled}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      title={indicator.title}
      className={styles.badge}
      data-theme-binding-tone={indicator.tone}
      data-theme-binding-case={textCase}
      data-theme-binding-border={border}
    >
      {content}
    </span>
  );
}
