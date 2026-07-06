import type { CodeSlotHistoryLogEntry } from './codeBlockRunModel';
import styles from './CodeBlockInspector.module.css';

interface CodeBlockStoredLogsProps {
  readonly label: string;
  readonly emptyLabel: string;
  readonly failedLabel: string;
  readonly failed: boolean;
  readonly logs: readonly CodeSlotHistoryLogEntry[];
}

export function CodeBlockStoredLogs({
  label,
  emptyLabel,
  failedLabel,
  failed,
  logs,
}: CodeBlockStoredLogsProps) {
  return (
    <div className={styles.runLogs} data-builder-code-slot-history="true">
      <span className={styles.runStatus}>{label}</span>
      {failed ? (
        <p className={styles.caption}>{failedLabel}</p>
      ) : logs.length > 0 ? (
        <ul>
          {logs.map((entry) => (
            <li key={entry.id}>
              <span className={styles.logLevel}>{entry.level}</span>
              {' '}
              {entry.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.caption}>{emptyLabel}</p>
      )}
    </div>
  );
}
