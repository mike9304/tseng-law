'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { FAQItem } from '@/data/faq-content';
import SectionLabel from '@/components/SectionLabel';

export default function FAQAccordion({
  locale,
  items,
  id,
  sectionClassName,
  tone = 'light'
}: {
  locale: Locale;
  items: FAQItem[];
  id?: string;
  sectionClassName?: string;
  tone?: 'light' | 'dark';
}) {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const sectionTitle = locale === 'ko' ? '자주 묻는 질문' : locale === 'zh-hant' ? '常見問題' : 'Frequently Asked Questions';
  const sectionClass = sectionClassName ?? 'section';

  return (
    <section className={sectionClass} id={id} data-tone={tone}>
      <div className="container">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="section-title">{sectionTitle}</h2>
        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${locale}-faq-${index}-button`;
            const panelId = `${locale}-faq-${index}-panel`;

            return (
              <article key={item.question} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <h3 className="faq-question">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-arrow" aria-hidden>
                      ▸
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={`faq-answer-wrap${isOpen ? ' is-open' : ''}`}
                  role="region"
                  aria-labelledby={buttonId}
                >
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
