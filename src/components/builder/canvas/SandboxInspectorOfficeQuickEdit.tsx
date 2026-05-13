'use client';

import {
  googleMapsSearchUrl,
  getOfficeLocationPresets,
  labelPrefix,
  labelValueAfterColon,
  readButtonHref,
  readButtonLabel,
  readMapAddress,
  readMapZoom,
  readNodeText,
  telHrefFromPhone,
  type OfficeNodeGroup,
} from '@/lib/builder/canvas/office-locations';
import { InspectorSection, LabeledRow, NumberStepper } from './InspectorControls';
import nodeQuickStyles from './CanvasNodeQuickPanels.module.css';
import styles from './SandboxPage.module.css';

type UpdateNodeContent = (
  nodeId: string,
  content: Record<string, unknown>,
  mode?: 'commit' | 'transient',
) => void;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function SandboxInspectorOfficeQuickEdit({
  officeQuickEdit,
  builderLocale,
  disabled,
  updateNodeContent,
}: {
  officeQuickEdit: OfficeNodeGroup;
  builderLocale: string;
  disabled: boolean;
  updateNodeContent: UpdateNodeContent;
}) {
  const address = readMapAddress(officeQuickEdit.mapNode);
  const phoneLabel = readButtonLabel(officeQuickEdit.phoneNode);
  const phonePrefix = labelPrefix(phoneLabel, 'TEL');
  const faxLabel = readNodeText(officeQuickEdit.faxNode);
  const faxPrefix = labelPrefix(faxLabel, 'FAX');
  const generatedMapUrl = googleMapsSearchUrl(address);
  const officePresets = getOfficeLocationPresets(builderLocale);

  return (
    <InspectorSection label="Office sync" title="Wix-style location settings">
      <div className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>사무소 프리셋</span>
        <div className={nodeQuickStyles.nodeMapPresetGrid}>
          {officePresets.map((preset) => (
            <button
              key={preset.title}
              type="button"
              className={`${nodeQuickStyles.nodeMapPresetButton} ${
                address === preset.address ? nodeQuickStyles.nodeMapPresetButtonActive : ''
              }`}
              aria-pressed={address === preset.address}
              aria-label={`${preset.title} office map preset`}
              disabled={disabled}
              onClick={() => {
                updateNodeContent(officeQuickEdit.mapNode.id, {
                  address: preset.address,
                  zoom: 16,
                });
                if (officeQuickEdit.addressNode) {
                  updateNodeContent(officeQuickEdit.addressNode.id, { text: preset.address });
                }
                if (officeQuickEdit.mapLinkNode) {
                  updateNodeContent(officeQuickEdit.mapLinkNode.id, { href: preset.mapsUrl });
                }
                if (officeQuickEdit.titleNode) {
                  updateNodeContent(officeQuickEdit.titleNode.id, { text: preset.title });
                }
                if (officeQuickEdit.phoneNode) {
                  updateNodeContent(officeQuickEdit.phoneNode.id, {
                    label: `${phonePrefix}: ${preset.phone}`,
                    href: telHrefFromPhone(preset.phone),
                  });
                }
                if (officeQuickEdit.faxNode && preset.fax) {
                  updateNodeContent(officeQuickEdit.faxNode.id, {
                    text: `${faxPrefix}: ${preset.fax}`,
                  });
                }
              }}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>사무소명</span>
        <input
          className={styles.inspectorInput}
          type="text"
          aria-label="Office title synced value"
          value={readNodeText(officeQuickEdit.titleNode)}
          disabled={disabled || !officeQuickEdit.titleNode}
          onChange={(event) => {
            if (!officeQuickEdit.titleNode) return;
            updateNodeContent(officeQuickEdit.titleNode.id, { text: event.target.value });
          }}
        />
      </div>
      <div className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>주소</span>
        <textarea
          className={styles.inspectorTextarea}
          rows={2}
          aria-label="Office address synced value"
          value={address}
          disabled={disabled}
          onChange={(event) => {
            const nextAddress = event.target.value;
            updateNodeContent(officeQuickEdit.mapNode.id, { address: nextAddress });
            if (officeQuickEdit.addressNode) {
              updateNodeContent(officeQuickEdit.addressNode.id, { text: nextAddress });
            }
            if (officeQuickEdit.mapLinkNode) {
              updateNodeContent(officeQuickEdit.mapLinkNode.id, {
                href: googleMapsSearchUrl(nextAddress),
              });
            }
          }}
        />
      </div>
      <div className={styles.inspectorFieldGrid}>
        <LabeledRow label="Zoom">
          <NumberStepper
            value={readMapZoom(officeQuickEdit.mapNode)}
            min={1}
            max={20}
            step={1}
            disabled={disabled}
            ariaLabel="Office map zoom"
            onChange={(nextValue) => {
              updateNodeContent(officeQuickEdit.mapNode.id, {
                zoom: clampNumber(Math.round(nextValue), 1, 20),
              });
            }}
          />
        </LabeledRow>
        <LabeledRow label="전화">
          <input
            className={styles.inspectorInput}
            type="text"
            aria-label="Office phone synced value"
            value={labelValueAfterColon(phoneLabel)}
            disabled={disabled || !officeQuickEdit.phoneNode}
            onChange={(event) => {
              if (!officeQuickEdit.phoneNode) return;
              const nextPhone = event.target.value;
              updateNodeContent(officeQuickEdit.phoneNode.id, {
                label: `${phonePrefix}: ${nextPhone}`,
                href: telHrefFromPhone(nextPhone),
              });
            }}
          />
        </LabeledRow>
      </div>
      {officeQuickEdit.faxNode ? (
        <div className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>팩스</span>
          <input
            className={styles.inspectorInput}
            type="text"
            aria-label="Office fax synced value"
            value={labelValueAfterColon(faxLabel)}
            disabled={disabled}
            onChange={(event) => {
              if (!officeQuickEdit.faxNode) return;
              updateNodeContent(officeQuickEdit.faxNode.id, {
                text: `${faxPrefix}: ${event.target.value}`,
              });
            }}
          />
        </div>
      ) : null}
      {officeQuickEdit.mapLinkNode ? (
        <div className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>길찾기 URL</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              className={styles.inspectorInput}
              type="url"
              aria-label="Office map URL"
              value={readButtonHref(officeQuickEdit.mapLinkNode)}
              disabled={disabled}
              onChange={(event) => {
                if (!officeQuickEdit.mapLinkNode) return;
                updateNodeContent(officeQuickEdit.mapLinkNode.id, { href: event.target.value });
              }}
            />
            <button
              type="button"
              className={styles.panelHeaderButton}
              disabled={disabled || !generatedMapUrl}
              onClick={() => {
                if (!officeQuickEdit.mapLinkNode || !generatedMapUrl) return;
                updateNodeContent(officeQuickEdit.mapLinkNode.id, { href: generatedMapUrl });
              }}
            >
              주소로 생성
            </button>
          </div>
        </div>
      ) : null}
    </InspectorSection>
  );
}
