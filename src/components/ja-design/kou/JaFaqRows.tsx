import FAQAccordion from '@/components/FAQAccordion';
import type { FAQItem } from '@/data/faq-content';
import c from './JaChapters.module.css';

/** C10 よくある質問 as plain rows (CONCEPT-V2 §5 C10). Restyle only; the FAQ JSON-LD stays with HomeLegacyPage. */
export default function JaFaqRows({ items }: { items: FAQItem[] }) {
  return (
    <div className={c.faq}>
      <FAQAccordion locale="ja" items={items} id="faq" sectionClassName="section" layout="split" />
    </div>
  );
}
