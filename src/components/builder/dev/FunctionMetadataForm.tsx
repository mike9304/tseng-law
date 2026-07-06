import type { BuilderFunctionRecord } from './functions-admin-types';
import type { FunctionsCopy } from './functions-copy';
import { FIELD_STYLE, INPUT_STYLE } from './functions-admin-styles';

interface FunctionMetadataFormProps {
  copy: FunctionsCopy;
  draft: BuilderFunctionRecord;
  onChange: (patch: Pick<BuilderFunctionRecord, 'name'> | Pick<BuilderFunctionRecord, 'slug'> | Pick<BuilderFunctionRecord, 'enabled'>) => void;
}

export function FunctionMetadataForm({ copy, draft, onChange }: FunctionMetadataFormProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, padding: 16, alignItems: 'end' }}>
      <label style={FIELD_STYLE}>
        <span>{copy.name}</span>
        <input
          value={draft.name}
          onChange={(event) => onChange({ name: event.target.value })}
          style={INPUT_STYLE}
          data-builder-dev-function-name="true"
        />
      </label>
      <label style={FIELD_STYLE}>
        <span>{copy.slug}</span>
        <input
          value={draft.slug}
          onChange={(event) => onChange({ slug: event.target.value })}
          style={INPUT_STYLE}
          data-builder-dev-function-slug="true"
        />
      </label>
      <label style={{ ...FIELD_STYLE, alignItems: 'center', flexDirection: 'row', paddingBottom: 10 }}>
        <input
          type="checkbox"
          checked={draft.enabled}
          onChange={(event) => onChange({ enabled: event.target.checked })}
          data-builder-dev-function-enabled="true"
        />
        <span>{copy.enabled}</span>
      </label>
    </div>
  );
}
