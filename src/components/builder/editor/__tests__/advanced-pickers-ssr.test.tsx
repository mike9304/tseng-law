import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import ColorPickerAdvanced from '../ColorPickerAdvanced';
import FontPickerAdvanced from '../FontPickerAdvanced';

describe('advanced picker SSR rendering', () => {
  test('renders without useLayoutEffect server warnings', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      expect(renderToStaticMarkup(
        <ColorPickerAdvanced value="#123b63" onChange={() => {}} />,
      )).toContain('data-color-picker-advanced');
      expect(renderToStaticMarkup(
        <FontPickerAdvanced value="system-ui" onChange={() => {}} />,
      )).toContain('data-font-picker');

      const messages = consoleError.mock.calls.flat().map(String);
      expect(messages).not.toContainEqual(expect.stringContaining(
        'useLayoutEffect does nothing on the server',
      ));
    } finally {
      consoleError.mockRestore();
    }
  });
});
