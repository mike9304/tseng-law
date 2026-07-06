'use client';

/* eslint-disable @next/next/no-img-element -- Source previews accept arbitrary builder-managed image URLs. */

import type { AttorneyProfileSourceRecord } from '@/lib/builder/lawyers/source';
import { readFocalDraft, type LawyerSourceDraft } from './lawyerSourceDraft';
import { helperStyle, previewImageStyle, previewStyle } from './lawyerSourceStyles';

type LawyerSourceProfilePreviewProps = {
  readonly draft: LawyerSourceDraft;
  readonly publicPath: string;
  readonly record: AttorneyProfileSourceRecord;
};

export function LawyerSourceProfilePreview({ draft, publicPath, record }: LawyerSourceProfilePreviewProps) {
  return (
    <div style={previewStyle}>
      <img
        src={draft.image || record.image}
        alt={draft.imageAltText || record.imageAltText}
        style={{
          ...previewImageStyle,
          objectPosition: `${readFocalDraft(draft.imageFocalX) * 100}% ${readFocalDraft(draft.imageFocalY) * 100}%`,
        }}
      />
      <div>
        <strong>{draft.name || record.name}</strong>
        <p style={{ ...helperStyle, margin: '4px 0 0' }} data-lawyer-source-role-preview>
          {draft.role || record.role}
        </p>
        <p style={{ ...helperStyle, margin: '6px 0 0' }} data-lawyer-source-public-url>
          Public URL: {publicPath}
        </p>
      </div>
    </div>
  );
}
