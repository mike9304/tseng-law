import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import c from './JaChapters.module.css';

/** C7 「事例紹介」: one past case, as type, its caveat at full size (CONCEPT-V2 §5 C7). No media on ja (L5, D6). */
export default function JaCase() {
  return (
    <div className={c.case}>
      <HomeCaseResultsSplit locale="ja" presentation="editorial" media={null} />
    </div>
  );
}
