import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import type { AnyExtension } from '@tiptap/core';

/**
 * Canonical TipTap extension list for the column editor.
 * Extracted for unit tests (Underline registration, history via StarterKit).
 */
export function createColumnEditorExtensions(placeholder: string): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } },
    }),
    Underline,
    Image,
    Placeholder.configure({ placeholder }),
  ];
}

export function columnEditorExtensionNames(placeholder = 'body'): string[] {
  return createColumnEditorExtensions(placeholder).map((extension) => extension.name);
}
