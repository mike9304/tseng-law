/**
 * Safe remark plugin: map editor `++text++` underline syntax to mdast
 * underline nodes that ReactMarkdown can render as <u>.
 * Does NOT enable rehype-raw or arbitrary HTML.
 */

type MdastText = {
  type: 'text';
  value: string;
};

type MdastNode = {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

const UNDERLINE_RE = /\+\+([^*\n]+?)\+\+/g;

/** Pure helper for tests and transformers: split `++text++` segments. */
export function splitUnderlineText(
  value: string,
): Array<{ type: 'text' | 'underline'; value: string }> {
  if (!value.includes('++')) return [{ type: 'text', value }];
  const parts: Array<{ type: 'text' | 'underline'; value: string }> = [];
  let lastIndex = 0;
  UNDERLINE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = UNDERLINE_RE.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: value.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'underline', value: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < value.length) {
    parts.push({ type: 'text', value: value.slice(lastIndex) });
  }
  return parts.length > 0 ? parts : [{ type: 'text', value }];
}

function splitTextNode(node: MdastText): MdastNode[] {
  const value = node.value ?? '';
  if (!value.includes('++')) return [node];

  return splitUnderlineText(value).map((part) => {
    if (part.type === 'text') {
      return { type: 'text', value: part.value };
    }
    return {
      type: 'underline',
      data: { hName: 'u' },
      children: [{ type: 'text', value: part.value }],
    };
  });
}

function transformNode(node: MdastNode): void {
  if (!node.children || node.children.length === 0) return;

  // Do not transform inside code / inlineCode.
  if (node.type === 'code' || node.type === 'inlineCode') return;

  const nextChildren: MdastNode[] = [];
  for (const child of node.children) {
    if (child.type === 'text' && typeof child.value === 'string') {
      nextChildren.push(...splitTextNode(child as MdastText));
    } else {
      transformNode(child);
      nextChildren.push(child);
    }
  }
  node.children = nextChildren;
}

export function remarkUnderline() {
  return (tree: MdastNode) => {
    transformNode(tree);
  };
}
