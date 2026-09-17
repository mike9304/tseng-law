import type { SemiconductorDraftRecord } from '@/lib/semiconductor-drafts';

export default function DraftStatusBanner({
  record,
}: {
  record: SemiconductorDraftRecord;
}) {
  return (
    <aside className="semi-draft-banner" aria-label="초안 검수 상태">
      <p className="semi-draft-banner-kicker">비공개 초안 · 공개 발행 금지</p>
      <p>
        검토 상태 <strong>변호사 검수 대기</strong>
        <span aria-hidden="true"> · </span>
        작성자 미기록
        <span aria-hidden="true"> · </span>
        변호사 검수일 미기록
        <span aria-hidden="true"> · </span>
        발행일 미기록
      </p>
      <p>
        공식자료 열람일 {record.sourceCheckedAt ?? '미기록'}
        {record.sourceConsolidationCutoff ? (
          <>
            <span aria-hidden="true"> · </span>
            법규자료 정리 기준일 {record.sourceConsolidationCutoff}
          </>
        ) : null}
        . 열람일을 검수일로 표시하지 않습니다.
      </p>
    </aside>
  );
}
