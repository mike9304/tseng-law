import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';
import {
  homeResultsButtonSurfaceIds,
  homeResultsTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';

/** Wide Miora editorial plate — used only by home `#results`. */
export const HOME_RESULTS_EDITORIAL_IMAGE_SRC =
  '/images/editorial/cross-strait-results.webp';

export const HOME_RESULTS_EDITORIAL_IMAGE_WIDTH = 2048;
export const HOME_RESULTS_EDITORIAL_IMAGE_HEIGHT = 880;

const copyByLocale = {
  ko: {
    label: '사례 분석',
    title: '한국 유학생 헬스장 부상 사건\n1심 157만 TWD 판결·항소심 화해',
    description:
      '대만 헬스장에서 트레이너의 지도를 받아 운동하던 중 다친 한국인 대학생이 손해배상을 청구한 사건입니다. 1심에서 157만 TWD의 배상을 인정하는 판결이 내려졌고, 이후 항소심에서 당사자 간 화해로 종결되었습니다.',
    summary:
      '사건 결과는 구체적인 사실관계와 증거에 따라 달라질 수 있으며, 이 사례는 과거 한 사건의 진행 경과를 소개합니다.',
    cta: '소송사례 분석 보기',
  },
  'zh-hant': {
    label: '案例解析',
    title: '韓國留學生健身房受傷案\n一審判賠157萬TWD，二審和解',
    description:
      '韓國大學生在台灣健身房接受教練指導運動時受傷，因而提起損害賠償請求。一審判決賠償157萬TWD，其後於二審由雙方和解結案。',
    summary:
      '案件結果會因具體事實與證據而異；本案例僅說明一件過往案件的處理經過。',
    cta: '查看訴訟案例',
  },
  en: {
    label: 'CASE STUDY',
    title: 'Korean Student Gym Injury Case\nTWD 1.57M Ruling, Then Appeal Settlement',
    description:
      'A Korean university student sought damages after being injured while training under an instructor’s supervision at a Taiwan gym. The first-instance court issued a TWD 1.57 million damages ruling; the case later concluded through a settlement on appeal.',
    summary:
      'Outcomes depend on the specific facts and evidence; this case study describes the course of one past matter.',
    cta: 'View Case Studies',
  },
  ja: {
    label: '事例紹介',
    title: '韓国人留学生のジム負傷事件\n一審157万TWD判決後、控訴審で和解',
    description:
      '台湾のジムでトレーナーの指導を受けて運動中に負傷した韓国人大学生が、損害賠償を請求した事例です。一審では157万TWDの損害賠償を認める判決が出され、その後、控訴審で当事者間の和解により終結しました。',
    summary:
      '結果は具体的な事実関係や証拠により異なります。本事例は、過去の一案件の経過を紹介するものです。',
    cta: '取扱事例を見る',
  },
} as const;

export default function HomeCaseResultsSplit({ locale }: { locale: SiteLocale }) {
  const copy = copyByLocale[locale];

  return (
    <section
      className="section section--dark split-section split--img-left home-results-panel home-results-panel--editorial"
      id="results"
      data-tone="dark"
    >
      <div
        className="split-image home-results-media"
        data-builder-node-key="media"
        aria-hidden="true"
      >
        <Image
          src={HOME_RESULTS_EDITORIAL_IMAGE_SRC}
          alt=""
          width={HOME_RESULTS_EDITORIAL_IMAGE_WIDTH}
          height={HOME_RESULTS_EDITORIAL_IMAGE_HEIGHT}
          sizes="(max-width: 900px) 100vw, 52vw"
          className="home-results-media-img"
        />
      </div>
      <div className="split-content home-results-content" data-builder-node-key="copy">
        <div
          className="section-label home-results-label"
          data-builder-surface-key={homeResultsTextSurfaceIds[0]}
        >
          <SurfaceText surfaceKey={homeResultsTextSurfaceIds[0]}>{copy.label}</SurfaceText>
        </div>
        <h2 className="split-title home-results-title" data-builder-surface-key={homeResultsTextSurfaceIds[1]}>
          <SurfaceText surfaceKey={homeResultsTextSurfaceIds[1]}>
            {copy.title.split('\n').map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </SurfaceText>
        </h2>
        <div className="split-divider" />
        <p className="split-text home-results-text" data-builder-surface-key={homeResultsTextSurfaceIds[2]}>
          <SurfaceText surfaceKey={homeResultsTextSurfaceIds[2]}>{copy.description}</SurfaceText>
        </p>
        <p className="split-text home-results-text" data-builder-surface-key={homeResultsTextSurfaceIds[3]}>
          <SurfaceText surfaceKey={homeResultsTextSurfaceIds[3]}>{copy.summary}</SurfaceText>
        </p>
        <SmartLink
          className="link-underline home-results-link"
          href={`/${locale}/columns`}
          data-builder-surface-key={homeResultsButtonSurfaceIds[0]}
        >
          <SurfaceText surfaceKey={homeResultsButtonSurfaceIds[0]}>{copy.cta} →</SurfaceText>
        </SmartLink>
      </div>
    </section>
  );
}
