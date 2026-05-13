'use client';

import type { BuilderCanvasRepeaterQuickEdit } from '@/lib/builder/canvas/repeater-quick-edit';
import {
  InspectorNotice,
  InspectorSection,
} from './InspectorControls';
import styles from './SandboxPage.module.css';

export default function SandboxInspectorRepeaterQuickEdit({
  quickEdit,
  disabled,
  updateNodeContent,
}: {
  quickEdit: BuilderCanvasRepeaterQuickEdit;
  disabled?: boolean;
  updateNodeContent: (nodeId: string, content: Record<string, unknown>) => void;
}) {
  if (quickEdit.kind === 'service') {
    return (
      <InspectorSection label="Repeater" title={`Service item ${quickEdit.index + 1}`}>
        <InspectorNotice tone="linked">
          이 카드의 제목과 본문을 한 번에 수정합니다. 변경 내용은 선택한 노드들과 함께 저장됩니다.
        </InspectorNotice>
        <div className={styles.inspectorFormStack} data-inspector-content-adapter="true">
          <label>
            <span>Title</span>
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
            <span>Description</span>
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
            <span>Detail link</span>
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
    <InspectorSection label="Repeater" title={`FAQ item ${quickEdit.index + 1}`}>
      <InspectorNotice tone="linked">
        이 FAQ 항목의 질문과 답변을 한 번에 수정합니다. 변경 내용은 선택한 노드들과 함께 저장됩니다.
      </InspectorNotice>
      <div className={styles.inspectorFormStack} data-inspector-content-adapter="true">
        <label>
          <span>Question</span>
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
          <span>Answer</span>
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
