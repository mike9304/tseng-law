import { describe, expect, it } from 'vitest';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { resolveButtonVariantStyles } from '@/lib/builder/site/component-variants';

describe('component variants', () => {
  it('keeps custom secondary button surfaces free of default theme border and shadow', () => {
    const styles = resolveButtonVariantStyles(
      'secondary',
      createDefaultCanvasNodeStyle({
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: 8,
      }),
    );

    expect(styles.backgroundStyle).toEqual({ background: 'rgba(255,255,255,0.14)' });
    expect(styles.color).toBe('#ffffff');
    expect(styles.border).toBe('1px solid transparent');
    expect(styles.borderColor).toBe('transparent');
    expect(styles.boxShadow).toBe('none');
    expect(styles.cssVars['--builder-button-hover-border-color']).toBe('transparent');
    expect(styles.cssVars['--builder-button-hover-box-shadow']).toBe('none');
  });
});
