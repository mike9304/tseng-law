'use client';

import { useState } from 'react';
import { defineComponent } from '../define';

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
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f1f5f9',
          border: '2px dashed #cbd5e1',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 13,
        }}
      >
        FAQ List
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: '#0f172a',
                textAlign: 'left',
              }}
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
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '0 16px 14px',
                  fontSize: 14,
                  color: '#64748b',
                  lineHeight: 1.6,
                }}
              >
                {item.answer}
              </div>
            )}
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
});
