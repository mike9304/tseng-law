import type { BuilderMobileBottomBar, BuilderTheme } from '@/lib/builder/site/types';

export default function MobileBottomBar({
  config,
  theme,
}: {
  config?: BuilderMobileBottomBar;
  theme?: BuilderTheme;
}) {
  const actions = (config?.actions ?? []).filter((action) => action.label.trim() && action.href.trim());
  if (!config?.enabled || actions.length === 0) return null;

  const primary = theme?.colors.primary || '#116dff';
  const background = theme?.colors.background || '#ffffff';
  const text = theme?.colors.text || '#111827';
  const muted = theme?.colors.muted || '#f3f4f6';
  const radius = theme?.radii.md ?? 8;

  return (
    <>
      <div className="builder-mobile-bottom-bar-spacer" aria-hidden />
      <nav
        className="builder-mobile-bottom-bar"
        data-builder-mobile-bottom-bar="true"
        aria-label="Mobile quick actions"
        style={{
          ['--builder-mobile-bar-primary' as string]: primary,
          ['--builder-mobile-bar-bg' as string]: background,
          ['--builder-mobile-bar-text' as string]: text,
          ['--builder-mobile-bar-muted' as string]: muted,
          ['--builder-mobile-bar-radius' as string]: `${radius}px`,
        }}
      >
        {actions.map((action, index) => (
          <a
            key={action.id || `${action.kind}-${index}`}
            href={action.href}
            data-builder-mobile-bottom-action={action.kind}
          >
            {action.label}
          </a>
        ))}
      </nav>
    </>
  );
}
