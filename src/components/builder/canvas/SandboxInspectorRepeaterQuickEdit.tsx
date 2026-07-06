'use client';

import type { BuilderCanvasRepeaterQuickEdit } from '@/lib/builder/canvas/repeater-quick-edit';
import type { Locale } from '@/lib/locales';
import {
  InspectorNotice,
  InspectorSection,
} from './InspectorControls';
import styles from './SandboxPage.module.css';
import { getSandboxInspectorRepeaterQuickEditCopy } from './sandbox-inspector-repeater-quick-edit-copy';

export default function SandboxInspectorRepeaterQuickEdit({
  quickEdit,
  disabled,
  locale = 'ko',
  updateNodeContent,
}: {
  quickEdit: BuilderCanvasRepeaterQuickEdit;
  disabled?: boolean;
  locale?: Locale;
  updateNodeContent: (nodeId: string, content: Record<string, unknown>) => void;
}) {
  const copy = getSandboxInspectorRepeaterQuickEditCopy(locale);
  const itemNumber = quickEdit.index + 1;

  if (quickEdit.kind === 'service') {
    return (
      <InspectorSection label={copy.sectionLabel} title={copy.serviceTitle(itemNumber)}>
        <InspectorNotice tone="linked">
          {copy.serviceNotice}
        </InspectorNotice>
        <div className={styles.inspectorFormStack} data-inspector-content-adapter="true">
          <label>
            <span>{copy.serviceTitleLabel}</span>
            <input
              type="text"
              value={quickEdit.title}
              disabled={disabled || !quickEdit.titleNodeId}
              data-builder-repeater-field="service-title"
              onChange={(event) => {
                if (!quickEdit.titleNodeId) return;
                const nextTitle = event.currentTarget.value;
                updateNodeContent(quickEdit.titleNodeId, { text: nextTitle });
                if (quickEdit.iconNodeId) {
                  updateNodeContent(quickEdit.iconNodeId, { alt: nextTitle });
                }
              }}
            />
          </label>
          <label>
            <span>{copy.serviceDescriptionLabel}</span>
            <textarea
              rows={3}
              value={quickEdit.description}
              disabled={disabled || !quickEdit.descriptionNodeId}
              data-builder-repeater-field="service-description"
              onChange={(event) => {
                if (!quickEdit.descriptionNodeId) return;
                updateNodeContent(quickEdit.descriptionNodeId, { text: event.currentTarget.value });
              }}
            />
          </label>
          <label>
            <span>{copy.serviceDetailLinkLabel}</span>
            <input
              type="text"
              value={quickEdit.href}
              disabled={disabled || !quickEdit.linkNodeId}
              data-builder-repeater-field="service-href"
              onChange={(event) => {
                if (!quickEdit.linkNodeId) return;
                updateNodeContent(quickEdit.linkNodeId, { href: event.currentTarget.value });
              }}
            />
          </label>
        </div>
      </InspectorSection>
    );
  }

  return (
    <InspectorSection label={copy.sectionLabel} title={copy.faqTitle(itemNumber)}>
      <InspectorNotice tone="linked">
        {copy.faqNotice}
      </InspectorNotice>
      <div className={styles.inspectorFormStack} data-inspector-content-adapter="true">
        <label>
          <span>{copy.faqQuestionLabel}</span>
          <input
            type="text"
            value={quickEdit.question}
            disabled={disabled || !quickEdit.questionNodeId}
            data-builder-repeater-field="faq-question"
            onChange={(event) => {
              if (!quickEdit.questionNodeId) return;
              updateNodeContent(quickEdit.questionNodeId, { text: event.currentTarget.value });
            }}
          />
        </label>
        <label>
          <span>{copy.faqAnswerLabel}</span>
          <textarea
            rows={4}
            value={quickEdit.answer}
            disabled={disabled || !quickEdit.answerNodeId}
            data-builder-repeater-field="faq-answer"
            onChange={(event) => {
              if (!quickEdit.answerNodeId) return;
              updateNodeContent(quickEdit.answerNodeId, { text: event.currentTarget.value });
            }}
          />
        </label>
      </div>
    </InspectorSection>
  );
}
