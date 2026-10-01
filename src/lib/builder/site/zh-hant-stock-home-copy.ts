import type { FAQItem } from '@/data/faq-content';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

/** Read text only after the caller admits the exact July stock fingerprint.
 * The redesign moves existing copy; it never replaces its legal conditions. */
export function readZhHantStockHomeCopy(canvas: BuilderCanvasDocument): {
  attorneyIntro?: string;
  faqItems: FAQItem[];
} {
  const nodes = new Map(canvas.nodes.map((node) => [node.id, node]));
  const text = (id: string) => {
    const node = nodes.get(id);
    return node?.kind === 'text' ? node.content.text : undefined;
  };
  const faqItems: FAQItem[] = [];
  for (const node of canvas.nodes) {
    const match = /^home-faq-item-(\d+)-question-text$/.exec(node.id);
    if (!match) continue;
    const question = text(node.id);
    const answer = text(`home-faq-item-${match[1]}-answer`);
    if (question !== undefined && answer !== undefined) faqItems.push({ question, answer });
  }
  return { attorneyIntro: text('home-attorney-intro-1'), faqItems };
}
