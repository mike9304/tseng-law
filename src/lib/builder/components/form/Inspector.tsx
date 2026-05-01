import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormCanvasNode } from '@/lib/builder/canvas/types';
import {
  DEFAULT_FLEX,
  DEFAULT_GRID,
  type ContainerLayoutMode,
  type FlexConfig,
  type GridConfig,
} from '@/lib/builder/canvas/layout-modes';

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginTop: 12,
  marginBottom: 4,
  display: 'block',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
};

export default function FormInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const formNode = node as BuilderFormCanvasNode;
  const content = formNode.content;
  const layoutMode: ContainerLayoutMode = content.layoutMode ?? 'absolute';
  const flexConfig: FlexConfig = content.flexConfig ?? DEFAULT_FLEX;
  const gridConfig: GridConfig = content.gridConfig ?? DEFAULT_GRID;

  return (
    <>
      <label>
        <span>Form name (식별자)</span>
        <input
          type="text"
          value={content.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
          placeholder="contact-form"
        />
      </label>
      <label>
        <span>Submit to</span>
        <select
          style={selectStyle}
          value={content.submitTo}
          disabled={disabled}
          onChange={(event) => onUpdate({ submitTo: event.target.value })}
        >
          <option value="storage">Storage (저장만)</option>
          <option value="email">Email</option>
          <option value="webhook">Webhook</option>
        </select>
      </label>
      {content.submitTo === 'email' ? (
        <label>
          <span>Target email</span>
          <input
            type="email"
            value={content.targetEmail ?? ''}
            disabled={disabled}
            onChange={(event) => onUpdate({ targetEmail: event.target.value || undefined })}
            placeholder="contact@example.com"
          />
        </label>
      ) : null}
      {content.submitTo === 'webhook' ? (
        <label>
          <span>Webhook URL</span>
          <input
            type="url"
            value={content.webhookUrl ?? ''}
            disabled={disabled}
            onChange={(event) => onUpdate({ webhookUrl: event.target.value || undefined })}
            placeholder="https://example.com/webhook"
          />
        </label>
      ) : null}
      <label>
        <span>Success message</span>
        <textarea
          value={content.successMessage}
          rows={2}
          disabled={disabled}
          onChange={(event) => onUpdate({ successMessage: event.target.value })}
        />
      </label>
      <label>
        <span>Redirect URL (선택)</span>
        <input
          type="text"
          value={content.redirectUrl ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ redirectUrl: event.target.value })}
          placeholder="/thank-you"
        />
      </label>
      <label>
        <span>Captcha</span>
        <select
          style={selectStyle}
          value={content.captcha ?? 'none'}
          disabled={disabled}
          onChange={(event) => onUpdate({ captcha: event.target.value })}
        >
          <option value="none">None</option>
          <option value="hcaptcha">hCaptcha</option>
          <option value="turnstile">Turnstile</option>
        </select>
      </label>
      <label>
        <span>Steps JSON (선택)</span>
        <textarea
          rows={4}
          value={JSON.stringify(content.steps ?? [], null, 2)}
          disabled={disabled}
          onChange={(event) => {
            try {
              const parsed = JSON.parse(event.target.value) as unknown;
              onUpdate({ steps: Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined });
            } catch {
              // Keep the last valid value while the admin is typing.
            }
          }}
          placeholder='[{"id":"step-1","title":"Step 1","fieldNodeIds":["form-input-abc"]}]'
        />
      </label>
      <label>
        <span>Auto reply</span>
        <input
          type="checkbox"
          checked={content.autoReplyEnabled ?? false}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoReplyEnabled: event.target.checked })}
        />
      </label>
      <label>
        <span>Auto reply template</span>
        <textarea
          rows={3}
          value={content.autoReplyTemplate ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ autoReplyTemplate: event.target.value })}
          placeholder="문의가 접수되었습니다. 곧 연락드리겠습니다."
        />
      </label>

      <span style={sectionLabelStyle}>Layout Mode</span>
      <select
        style={selectStyle}
        value={layoutMode}
        disabled={disabled}
        onChange={(event) => {
          const mode = event.target.value as ContainerLayoutMode;
          const patch: Record<string, unknown> = { layoutMode: mode };
          if (mode === 'flex' && !content.flexConfig) {
            patch.flexConfig = { ...DEFAULT_FLEX };
          }
          if (mode === 'grid' && !content.gridConfig) {
            patch.gridConfig = { ...DEFAULT_GRID };
          }
          onUpdate(patch);
        }}
      >
        <option value="absolute">Absolute</option>
        <option value="flex">Flex</option>
        <option value="grid">Grid</option>
      </select>

      {layoutMode === 'flex' ? (
        <>
          <span style={sectionLabelStyle}>Flex Settings</span>
          <label>
            <span>Direction</span>
            <select
              style={selectStyle}
              value={flexConfig.direction}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({
                  flexConfig: { ...flexConfig, direction: event.target.value as FlexConfig['direction'] },
                })
              }
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
            </select>
          </label>
          <label>
            <span>Gap</span>
            <input
              type="number"
              min={0}
              max={200}
              value={flexConfig.gap}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ flexConfig: { ...flexConfig, gap: Number(event.target.value) } })
              }
            />
          </label>
        </>
      ) : null}

      {layoutMode === 'grid' ? (
        <>
          <span style={sectionLabelStyle}>Grid Settings</span>
          <label>
            <span>Columns</span>
            <input
              type="number"
              min={1}
              max={12}
              value={gridConfig.columns}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ gridConfig: { ...gridConfig, columns: Number(event.target.value) } })
              }
            />
          </label>
          <label>
            <span>Row gap</span>
            <input
              type="number"
              min={0}
              max={200}
              value={gridConfig.rowGap}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ gridConfig: { ...gridConfig, rowGap: Number(event.target.value) } })
              }
            />
          </label>
        </>
      ) : null}
    </>
  );
}
