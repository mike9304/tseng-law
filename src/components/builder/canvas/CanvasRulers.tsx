'use client';

import styles from './SandboxPage.module.css';

type CanvasRulersProps = {
  stageHeight: number;
  stageWidth: number;
};

export default function CanvasRulers({ stageHeight, stageWidth }: CanvasRulersProps) {
  return (
    <>
      <div className={styles.topRuler} aria-hidden>
        {Array.from({ length: Math.floor(stageWidth / 40) + 1 }).map((_, index) => (
          <span
            key={`top-${index}`}
            className={styles.rulerMark}
            style={{ left: `${index * 40}px` }}
          >
            {index * 40}
          </span>
        ))}
      </div>
      <div className={styles.leftRuler} aria-hidden>
        {Array.from({ length: Math.floor(stageHeight / 40) + 1 }).map((_, index) => (
          <span
            key={`left-${index}`}
            className={`${styles.rulerMark} ${styles.rulerMarkVertical}`}
            style={{ top: `${index * 40}px` }}
          >
            {index * 40}
          </span>
        ))}
      </div>
    </>
  );
}
