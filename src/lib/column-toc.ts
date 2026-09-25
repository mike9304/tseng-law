/**
 * "In this article" navigation for long columns.
 *
 * Both sides come from one rule, `sectionHeadings()`: the level-2 headings that
 * are direct children of the document root, in document order. The TOC parses
 * the markdown with the same remark pipeline ColumnContent renders with
 * (remark-parse + remark-gfm + remarkUnderline), and remarkColumnSectionIds
 * stamps `sec-n` on the very same nodes, so the anchors cannot drift — even for
 * builder-serialized bodies with headings inside blockquotes/lists (`> ## X`)
 * or empty headings (`##`). Ids never depend on slugifying CJK/Arabic text.
 * `src/components/__tests__/column-toc.test.tsx` renders every file-backed
 * column plus those edge cases and asserts the list and the rendered
 * <h2 id> sequence stay identical.
 */

import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { remarkUnderline } from '@/lib/builder/columns/remark-underline';

export type ColumnTocEntry = { id: string; text: string };

/** Anchor id for the n-th (1-based) section heading of a column body. */
export function columnSectionId(index: number): string {
  return `sec-${index}`;
}

type MdastNode = {
  type: string;
  depth?: number;
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown> } & Record<string, unknown>;
};

/** The single rule shared by the TOC and the rendered ids: root-level h2s, in order. */
function sectionHeadings(tree: MdastNode): MdastNode[] {
  return (tree.children ?? []).filter((node) => node.type === 'heading' && node.depth === 2);
}

export function extractColumnToc(markdown: string): ColumnTocEntry[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkUnderline as never);
  const tree = processor.runSync(processor.parse(markdown)) as unknown as MdastNode;

  return sectionHeadings(tree)
    .map((node, index) => ({
      id: columnSectionId(index + 1),
      text: toString(node as Parameters<typeof toString>[0]).replace(/\s+/g, ' ').trim(),
    }))
    // An empty heading keeps its number (so later anchors stay aligned) but gets no TOC row.
    .filter((entry) => entry.text.length > 0);
}

/**
 * Remark plugin for ColumnContent: stamps `id="sec-n"` on the section headings
 * (see sectionHeadings) while the tree is transformed. Pure, so React
 * StrictMode double renders cannot skew the numbering.
 */
export function remarkColumnSectionIds() {
  return (tree: MdastNode) => {
    sectionHeadings(tree).forEach((node, index) => {
      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, id: columnSectionId(index + 1) },
      };
    });
  };
}
