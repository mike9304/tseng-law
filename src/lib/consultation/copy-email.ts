function getRestorableFocus(node: unknown): { focus: () => void } | null {
  if (node && typeof (node as { focus?: unknown }).focus === 'function') {
    return node as { focus: () => void };
  }
  return null;
}

function detachNode(node: ChildNode) {
  if (typeof node.remove === 'function') {
    node.remove();
    return;
  }
  node.parentNode?.removeChild(node);
}

function copyEmailAddressWithExecCommand(email: string): boolean {
  const doc = typeof globalThis.document === 'undefined' ? undefined : globalThis.document;
  if (!doc || typeof doc.createElement !== 'function' || !doc.body) {
    return false;
  }

  const previousFocus = getRestorableFocus(doc.activeElement);
  const textarea = doc.createElement('textarea');
  textarea.value = email;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  try {
    doc.body.appendChild(textarea);
    textarea.select();
    return doc.execCommand('copy') === true;
  } catch {
    return false;
  } finally {
    detachNode(textarea);
    try {
      previousFocus?.focus();
    } catch {
      // The originally focused control may no longer be focusable.
    }
  }
}

export async function copyEmailAddress(email: string): Promise<boolean> {
  const writeText =
    typeof navigator !== 'undefined' ? navigator.clipboard?.writeText : undefined;

  if (typeof writeText === 'function') {
    try {
      await writeText.call(navigator.clipboard, email);
      return true;
    } catch {
      return false;
    }
  }

  try {
    return copyEmailAddressWithExecCommand(email);
  } catch {
    return false;
  }
}
