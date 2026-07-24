export type RichTextJson = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: RichTextJson[];
};

function attrString(node: RichTextJson, key: string): string {
  const value = node.attrs?.[key];
  return typeof value === 'string' ? value : '';
}

function serializeInline(nodes: RichTextJson[] | undefined): string {
  return (nodes ?? []).map(serializeMarkdownNode).join('');
}

/**
 * Apply markdown marks. Underline uses `++text++` (public path maps via remark plugin).
 * Mark order: code → bold → italic → underline → link (outermost last for nesting stability).
 */
export function applyMarkdownMarks(text: string, marks: RichTextJson['marks']): string {
  const list = marks ?? [];
  let current = text;

  const has = (type: string) => list.some((mark) => mark.type === type);
  if (has('code')) current = `\`${current}\``;
  if (has('bold')) current = `**${current}**`;
  if (has('italic')) current = `*${current}*`;
  if (has('underline')) current = `++${current}++`;

  const link = list.find((mark) => mark.type === 'link');
  if (link) {
    const href = typeof link.attrs?.href === 'string' ? link.attrs.href : '';
    if (href) current = `[${current}](${href})`;
  }

  return current;
}

function serializeListItem(node: RichTextJson, index?: number): string {
  const marker = typeof index === 'number' ? `${index + 1}. ` : '- ';
  const body = (node.content ?? [])
    .map(serializeMarkdownNode)
    .filter(Boolean)
    .join('\n')
    .replace(/\n/g, '\n  ');
  return `${marker}${body}`;
}

export function serializeMarkdownNode(node: RichTextJson): string {
  if (node.type === 'text') return applyMarkdownMarks(node.text ?? '', node.marks);
  if (node.type === 'paragraph') return serializeInline(node.content);
  if (node.type === 'heading') {
    const level = typeof node.attrs?.level === 'number' ? node.attrs.level : 2;
    return `${'#'.repeat(Math.max(1, Math.min(6, level)))} ${serializeInline(node.content)}`.trim();
  }
  if (node.type === 'image') {
    const src = attrString(node, 'src');
    if (!src) return '';
    const alt = attrString(node, 'alt') || attrString(node, 'title');
    return `![${alt}](${src})`;
  }
  if (node.type === 'bulletList') {
    return (node.content ?? []).map((item) => serializeListItem(item)).join('\n');
  }
  if (node.type === 'orderedList') {
    return (node.content ?? []).map((item, index) => serializeListItem(item, index)).join('\n');
  }
  if (node.type === 'listItem') return serializeListItem(node);
  if (node.type === 'blockquote') {
    return (node.content ?? [])
      .map(serializeMarkdownNode)
      .join('\n')
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');
  }
  if (node.type === 'codeBlock') return `\`\`\`\n${serializeInline(node.content)}\n\`\`\``;
  if (node.type === 'horizontalRule') return '---';
  if (node.type === 'hardBreak') return '\n';
  return (node.content ?? []).map(serializeMarkdownNode).filter(Boolean).join('\n\n');
}

export function serializeEditorMarkdown(doc: RichTextJson): string {
  return (doc.content ?? []).map(serializeMarkdownNode).filter(Boolean).join('\n\n').trim();
}
