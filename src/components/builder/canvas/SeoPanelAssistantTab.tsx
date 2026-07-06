'use client';

import type { BuilderSeoAssistantTask } from '@/lib/builder/seo/assistant';
import type { BuilderSeoValidationIssue } from '@/lib/builder/seo/validation';
import type { Locale } from '@/lib/locales';
import styles from './SeoPanelAssistantTab.module.css';
import {
  getSeoPanelAssistantCopy,
  getSeoPanelAssistantFieldLabel,
  isSeoPanelAssistantFailure,
} from './seo-panel-assistant-copy';

function issueTone(issue: BuilderSeoValidationIssue): 'blocker' | 'warning' | 'info' {
  if (issue.severity === 'blocker') return 'blocker';
  if (issue.severity === 'warning') return 'warning';
  return 'info';
}

interface SeoPanelAssistantTabProps {
  active: boolean;
  locale: Locale;
  focusKeyword: string;
  assistantStatus: string;
  assistantTasks: BuilderSeoAssistantTask[];
  localIssues: BuilderSeoValidationIssue[];
  onChangeFocusKeyword: (value: string) => void;
  onSaveFocusKeyword: () => void;
}

export function SeoPanelAssistantTab({
  active,
  locale,
  focusKeyword,
  assistantStatus,
  assistantTasks,
  localIssues,
  onChangeFocusKeyword,
  onSaveFocusKeyword,
}: SeoPanelAssistantTabProps) {
  const copy = getSeoPanelAssistantCopy(locale);
  const isFailure = isSeoPanelAssistantFailure(assistantStatus, copy);

  return (
    <>
      <section className={styles.section} data-active={active ? 'true' : 'false'}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleBlock}>
            <h3 className={styles.sectionTitle}>{copy.title}</h3>
            <span className={styles.helpText}>{copy.description}</span>
          </div>
          <button type="button" className={styles.ghostButton} onClick={onSaveFocusKeyword}>
            {copy.save}
          </button>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="builder-seo-focus-keyword">{copy.focusKeyword}</label>
          <input
            id="builder-seo-focus-keyword"
            type="text"
            value={focusKeyword}
            className={styles.input}
            onChange={(event) => onChangeFocusKeyword(event.target.value)}
          />
        </div>
        {assistantStatus ? (
          <div className={styles.statusText} data-tone={isFailure ? 'error' : 'success'}>
            {assistantStatus}
          </div>
        ) : null}
        {assistantTasks.length === 0 ? (
          <div className={`${styles.previewCard} ${styles.emptyCard}`}>
            {copy.empty}
          </div>
        ) : (
          <div className={styles.list}>
            {assistantTasks.map((task) => (
              <div key={task.id} className={styles.previewCard}>
                <div className={styles.taskHeader}>
                  <strong className={styles.taskTitle}>{task.label}</strong>
                  <span className={styles.helpText}>
                    {copy.taskSeverity[task.severity]} · {copy.taskStatus[task.status]}
                  </span>
                </div>
                <div className={styles.helpText}>{getSeoPanelAssistantFieldLabel(copy, task.field)}: {task.detail}</div>
                {task.applyHint ? <div className={styles.helpText}>{task.applyHint}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section} data-active={active ? 'true' : 'false'}>
        <h3 className={styles.sectionTitle}>{copy.validationTitle}</h3>
        {localIssues.length === 0 ? (
          <div className={`${styles.previewCard} ${styles.validationPass}`}>
            {copy.validationPass}
          </div>
        ) : (
          <div className={styles.list}>
            {localIssues.map((issue) => (
              <div
                key={issue.id}
                className={styles.issueCard}
                data-tone={issueTone(issue)}
              >
                <strong>
                  {copy.issueSeverity[issue.severity]} · {getSeoPanelAssistantFieldLabel(copy, issue.field)}
                </strong>
                <div>{issue.message}</div>
                {issue.fixHint ? <div>{issue.fixHint}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
