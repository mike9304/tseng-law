'use client';

import { useMemo } from 'react';
import {
  BUILDER_BUILT_IN_SECTION_TEMPLATE_DRAG_MIME,
  encodeBuiltInSectionTemplateDragData,
} from '@/components/builder/canvas/canvasCatalogDrop';
import type { Locale } from '@/lib/locales';
import type { BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import { buildSavedSectionThumbnailSvg } from '@/lib/builder/sections/thumbnail';
import { getBuiltInSectionsPanelCopy, getBuiltInSectionTemplateDisplayCopy } from './section-panel-copy';
import styles from './SectionLibraryPanel.module.css';

export function SectionTemplateCard({
  locale = 'ko',
  template,
  onClick,
}: {
  locale?: Locale;
  template: BuiltInSectionTemplate;
  onClick: () => void;
}) {
  const copy = getBuiltInSectionsPanelCopy(locale);
  const templateCopy = getBuiltInSectionTemplateDisplayCopy(template, locale);
  const addTitle = copy.addTemplateTitle(templateCopy.name);
  const svg = useMemo(
    () => buildSavedSectionThumbnailSvg(template.nodes, template.rootNodeId, 200, 70),
    [template.nodes, template.rootNodeId],
  );

  return (
    <button
      type="button"
      className={styles.templateCard}
      data-builder-built-in-section-template={template.id}
      data-builder-built-in-section-category={template.category}
      title={addTitle}
      aria-label={addTitle}
      draggable
      onClick={onClick}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          BUILDER_BUILT_IN_SECTION_TEMPLATE_DRAG_MIME,
          encodeBuiltInSectionTemplateDragData(template),
        );
        event.dataTransfer.effectAllowed = 'copy';
      }}
    >
      <div
        className={styles.templateThumbnail}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span className={styles.templateName}>{templateCopy.name}</span>
      <span className={styles.templateDescription}>{templateCopy.description}</span>
      <span className={styles.templateMeta}>{templateCopy.thumbnailHint}</span>
    </button>
  );
}
