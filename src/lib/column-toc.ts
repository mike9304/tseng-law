/**
 * "In this article" navigation for long columns.
 *
 * The list is read from the same markdown string ColumnContent renders, and
 * both sides number level-2 headings in document order (`sec-1`, `sec-2`, …),
 * so the anchor ids never depend on slugifying CJK or Arabic heading text.
 * `column-toc.test.ts` renders every file-backed column and asserts the parsed
 * list and the rendered <h2 id> sequence stay identical.
 */

export type ColumnTocEntry = { id: string; text: string };

/** Anchor id for the n-th (1-based) level-2 heading of a column body. */
export function columnSectionId(index: number): string {
  return `sec-${index}`;
}

const FENCE_RE = /^\s{0,3}(`{3,}|~{3,})/;
const ATX_H2_RE = /^\s{0,3}##(?!#)[ \t]+(.*?)[ \t]*#*[ \t]*$/;

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\+\+([^+\n]+?)\+\+/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])[*_]([^*_\n]+)[*_](?=[^\w*]|$)/g, '$1$2')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractColumnToc(markdown: string): ColumnTocEntry[] {
  const entries: ColumnTocEntry[] = [];
  let fence: string | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(FENCE_RE);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (fence === null) fence = marker[0];
      else if (marker[0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const heading = line.match(ATX_H2_RE);
    if (!heading) continue;
    entries.push({
      id: columnSectionId(entries.length + 1),
      text: stripInlineMarkdown(heading[1]),
    });
  }

  return entries;
}

type MdastNode = {
  type: string;
  depth?: number;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> } & Record<string, unknown>;
};

/**
 * Remark plugin for ColumnContent: stamps `id="sec-n"` on level-2 headings in
 * document order while the tree is transformed (pure, so React StrictMode
 * double renders cannot skew the numbering).
 */
export function remarkColumnSectionIds() {
  return (tree: MdastNode) => {
    let count = 0;
    const walk = (node: MdastNode) => {
      if (node.type === 'heading' && node.depth === 2) {
        count += 1;
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, id: columnSectionId(count) },
        };
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
