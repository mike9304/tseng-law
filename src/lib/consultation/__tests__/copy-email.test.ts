import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyEmailAddress } from '@/lib/consultation/copy-email';

const EMAIL = 'wei@hoveringlaw.com.tw';

function createFallbackDocument({
  copied,
  throws = false,
}: {
  copied: boolean;
  throws?: boolean;
}) {
  const previousFocus = { focus: vi.fn() };
  const textarea = {
    value: '',
    style: {} as { position?: string; opacity?: string },
    parentNode: null as { removeChild: (node: unknown) => void } | null,
    setAttribute: vi.fn(),
    select: vi.fn(),
    remove: vi.fn(),
  };
  textarea.remove = vi.fn(() => {
    textarea.parentNode = null;
  });
  const body = {
    appendChild: vi.fn((node: typeof textarea) => {
      textarea.parentNode = {
        removeChild: vi.fn(() => {
          textarea.parentNode = null;
        }),
      };
      return node;
    }),
  };

  return {
    previousFocus,
    textarea,
    body,
    document: {
      body,
      activeElement: previousFocus,
      createElement: vi.fn(() => textarea),
      execCommand: vi.fn(() => {
        if (throws) {
          throw new Error('copy failed');
        }
        return copied;
      }),
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('copyEmailAddress', () => {
  it('returns true when clipboard writeText succeeds', async () => {
    const writeText = vi.fn(async () => undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await expect(copyEmailAddress(EMAIL)).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith(EMAIL);
  });

  it('returns false when clipboard writeText rejects without using the textarea fallback', async () => {
    const writeText = vi.fn(async () => {
      throw new Error('denied');
    });
    const createElement = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.stubGlobal('document', {
      body: {},
      createElement,
      execCommand: vi.fn(),
    });

    await expect(copyEmailAddress(EMAIL)).resolves.toBe(false);
    expect(createElement).not.toHaveBeenCalled();
  });

  it('returns true when execCommand reports a confirmed copy', async () => {
    const fallback = createFallbackDocument({ copied: true });
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', fallback.document);

    await expect(copyEmailAddress(EMAIL)).resolves.toBe(true);
    expect(fallback.textarea.value).toBe(EMAIL);
    expect(fallback.textarea.select).toHaveBeenCalledOnce();
    expect(fallback.textarea.remove).toHaveBeenCalledOnce();
    expect(fallback.previousFocus.focus).toHaveBeenCalledOnce();
    expect(fallback.textarea.parentNode).toBeNull();
  });

  it('returns false when execCommand reports failure and still restores focus', async () => {
    const fallback = createFallbackDocument({ copied: false });
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', fallback.document);

    await expect(copyEmailAddress(EMAIL)).resolves.toBe(false);
    expect(fallback.textarea.remove).toHaveBeenCalledOnce();
    expect(fallback.previousFocus.focus).toHaveBeenCalledOnce();
  });

  it('returns false and detaches the textarea when execCommand throws', async () => {
    const fallback = createFallbackDocument({ copied: false, throws: true });
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', fallback.document);

    await expect(copyEmailAddress(EMAIL)).resolves.toBe(false);
    expect(fallback.textarea.remove).toHaveBeenCalledOnce();
    expect(fallback.previousFocus.focus).toHaveBeenCalledOnce();
    expect(fallback.textarea.parentNode).toBeNull();
  });

  it('returns false when clipboard and document fallback are unsupported', async () => {
    vi.stubGlobal('navigator', {});
    vi.stubGlobal('document', undefined);

    await expect(copyEmailAddress(EMAIL)).resolves.toBe(false);
  });
});
