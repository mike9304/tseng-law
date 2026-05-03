'use client';

import { useState } from 'react';
import { defineComponent } from '../define';
import FaqListInspector from './Inspector';
import styles from './FaqList.module.css';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqListContent {
  items: FaqItem[];
}

function FaqListRender({ node }: { node: { content: FaqListContent } }) {
  const { items = [] } = node.content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) {
    return (
      <div className="builder-widget-empty">
        FAQ List
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={styles.item}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={`${styles.question} builder-widget-focusable`}
            >
              <span>{item.question}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default defineComponent({
  kind: 'faqList',
  displayName: 'faqList',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    items: [] as FaqItem[],
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: FaqListRender,
  Inspector: FaqListInspector,
});
