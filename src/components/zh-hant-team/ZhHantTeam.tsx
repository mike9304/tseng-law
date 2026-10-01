import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import styles from './ZhHantTeam.module.css';

/** zh-hant team section: the shared AttorneyProfileSection inside the #team wrapper that carries the zh-hant styling. */
export default function ZhHantTeam({ showIntro = true }: { showIntro?: boolean }) {
  return (
    <div id="team" className={styles.team}>
      <AttorneyProfileSection locale="zh-hant" showIntro={showIntro} />
    </div>
  );
}
