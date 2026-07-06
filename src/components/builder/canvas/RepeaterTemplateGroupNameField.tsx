import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { RepeaterTemplateCopy } from './repeater-template-copy';
import styles from './RepeaterTemplateGroupNameField.module.css';

export interface RepeaterTemplateGroupNameFieldProps {
  readonly copy: RepeaterTemplateCopy['childBadge'];
  readonly groupName: string;
  readonly recordNumber: number;
  readonly onRenameGroup: (name: string) => void;
}

export function RepeaterTemplateGroupNameField({
  copy,
  groupName,
  recordNumber,
  onRenameGroup,
}: RepeaterTemplateGroupNameFieldProps) {
  const [draft, setDraft] = useState(groupName);

  useEffect(() => {
    setDraft(groupName);
  }, [groupName]);

  const commitDraft = () => {
    const nextName = draft.trim();
    if (!nextName) {
      setDraft(groupName);
      return;
    }
    if (nextName === groupName) {
      setDraft(groupName);
      return;
    }
    setDraft(nextName);
    onRenameGroup(nextName);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    commitDraft();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key !== 'Escape') return;
    event.preventDefault();
    setDraft(groupName);
  };

  return (
    <form className={styles.repeaterTemplateGroupNameForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.repeaterTemplateGroupNameInput}
        data-builder-repeater-template-child-group-name="true"
        aria-label={copy.renameGroupAriaLabel(recordNumber)}
        placeholder={copy.renameGroupPlaceholder}
        maxLength={120}
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onBlur={commitDraft}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
}
