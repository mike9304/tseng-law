import { expect, it } from 'vitest';
import { listComponents } from '../registry';
import { getPublicComponent } from '../public-registry';

it('uses the exact same renderer for all 83 editor widget kinds', () => {
  const definitions = listComponents();
  expect(definitions).toHaveLength(83);
  for (const definition of definitions) {
    expect(getPublicComponent(definition.kind)?.Render, definition.kind).toBe(definition.Render);
  }
  for (const kind of ['unknown-widget', 'constructor', '__proto__', 'toString']) {
    expect(getPublicComponent(kind)).toBeUndefined();
  }
});
