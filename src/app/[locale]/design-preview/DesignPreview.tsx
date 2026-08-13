'use client';

import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import styles from './design-preview.module.css';

type PreviewCopy = {
  nav: {
    practice: string;
    method: string;
    offices: string;
    journal: string;
    contact: string;
  };
  eyebrow: string;
  title: string;
  lead: string;
  primary: string;
  secondary: string;
  scroll: string;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  practiceEyebrow: string;
  practiceTitle: string;
  practiceBody: string;
  courtEyebrow: string;
  courtTitle: string;
  courtBody: string;
  officeEyebrow: string;
  officeTitle: string;
  journalEyebrow: string;
  journalTitle: string;
  contactEyebrow: string;
  contactTitle: string;
  contactBody: string;
  emailLabel: string;
  sensitiveNotice: string;
  footerNote: string;
  heroAlt: string;
  heritageAlt: string;
  courtAlt: string;
};

const COPY: Record<SiteLocale, PreviewCopy> = {
  ko: {
    nav: { practice: '업무 분야', method: '업무 방식', offices: '사무소', journal: '호정 저널', contact: '이메일 상담' },
    eyebrow: 'TAIWAN · CROSS-BORDER COUNSEL',
    title: '대만에서의 중요한 결정을\n더 선명하게.',
    lead: '도시의 속도와 법의 기준을 함께 읽는 국제 업무. 한국어, 中文, English, 日本語로 대만의 다음 장면을 준비합니다.',
    primary: '증준외 대만 변호사에게 이메일 상담',
    secondary: '업무 분야 살펴보기',
    scroll: 'SCROLL TO EXPLORE',
    introEyebrow: 'A CLEARER WAY THROUGH TAIWAN',
    introTitle: '전통의 결을 존중하고,\n오늘의 언어로 답합니다.',
    introBody: '대만의 골목과 법정, 기업의 이사회까지. 호정은 현지의 맥락을 놓치지 않으면서 국제 고객이 이해할 수 있는 구조로 문제를 정리합니다.',
    practiceEyebrow: 'PRACTICE AREAS',
    practiceTitle: '필요한 순간에,\n정확한 분야의 변호사.',
    practiceBody: '초기 판단부터 실행과 분쟁 대응까지 하나의 흐름으로 설계합니다.',
    courtEyebrow: 'FROM CONTEXT TO COUNSEL',
    courtTitle: '사건의 표면보다\n결정의 구조를 봅니다.',
    courtBody: '대만의 사법·행정 환경과 비즈니스 현실을 함께 살피며, 복잡한 상황을 다음 행동으로 번역합니다.',
    officeEyebrow: 'TAIWAN, WITH LOCAL REACH',
    officeTitle: '네 개의 거점,\n하나의 기준.',
    journalEyebrow: 'HOJUNG JOURNAL',
    journalTitle: '움직이기 전에\n읽어야 할 대만 법률.',
    contactEyebrow: 'START WITH A CLEAR QUESTION',
    contactTitle: '상담의 첫 문장을\n이메일로 보내주세요.',
    contactBody: '문의 분야와 상황의 개요만 보내주시면 담당 변호사가 다음 단계를 안내합니다.',
    emailLabel: 'wei@hoveringlaw.com.tw',
    sensitiveNotice: '초기 문의에는 주민등록번호, 여권번호, 계좌번호, 신분증 원본 등 민감정보를 보내지 마세요.',
    footerNote: 'LOCAL DESIGN STUDY · NOT PUBLISHED',
    heroAlt: '대만 중앙산맥과 운해 위를 밝은 자연광으로 비행하는 항공 영상',
    heritageAlt: '현대적인 빛이 스며드는 대만 전통 삼합원',
    courtAlt: '자연광이 들어오는 대만 법정의 차분한 내부',
  },
  'zh-hant': {
    nav: { practice: '服務領域', method: '工作方式', offices: '辦公室', journal: '昊鼎專欄', contact: '寄信諮詢' },
    eyebrow: 'TAIWAN · CROSS-BORDER COUNSEL',
    title: '讓您在台灣的\n重要決策更清晰。',
    lead: '理解城市的速度，也理解法律的尺度。以中文、韓文、英文與日文，陪伴跨境企業與個人前進。',
    primary: '寄信諮詢曾雋崴律師',
    secondary: '查看服務領域',
    scroll: 'SCROLL TO EXPLORE',
    introEyebrow: 'A CLEARER WAY THROUGH TAIWAN',
    introTitle: '尊重傳統的肌理，\n用今天的語言回應。',
    introBody: '從台灣街區與法庭，到企業董事會，昊鼎在地理解脈絡，也將複雜問題整理成國際客戶能採取行動的方案。',
    practiceEyebrow: 'PRACTICE AREAS',
    practiceTitle: '在需要的時刻，\n找到精準的法律專業。',
    practiceBody: '從初步判斷到執行與爭議處理，以一條清楚的路徑陪伴您。',
    courtEyebrow: 'FROM CONTEXT TO COUNSEL',
    courtTitle: '不只看見案件表面，\n更看見決策的結構。',
    courtBody: '結合台灣司法、行政環境與商業現實，把複雜情境翻譯成下一步。',
    officeEyebrow: 'TAIWAN, WITH LOCAL REACH',
    officeTitle: '四個據點，\n同一套標準。',
    journalEyebrow: 'HOJUNG JOURNAL',
    journalTitle: '在行動之前，\n先讀懂台灣法律。',
    contactEyebrow: 'START WITH A CLEAR QUESTION',
    contactTitle: '把諮詢的第一句話\n寄給我們。',
    contactBody: '提供諮詢領域與事件概要，負責律師會回覆下一步。',
    emailLabel: 'wei@hoveringlaw.com.tw',
    sensitiveNotice: '初次聯絡請勿提供身分證字號、護照號碼、銀行帳戶資料或證件正本等敏感資訊。',
    footerNote: 'LOCAL DESIGN STUDY · NOT PUBLISHED',
    heroAlt: '在明亮自然光下飛越台灣中央山脈與雲海的空拍影像',
    heritageAlt: '現代光線映入台灣傳統三合院',
    courtAlt: '自然光映照下沉靜的台灣法庭內部',
  },
  en: {
    nav: { practice: 'Practice', method: 'Our method', offices: 'Offices', journal: 'Journal', contact: 'Email counsel' },
    eyebrow: 'TAIWAN · CROSS-BORDER COUNSEL',
    title: 'Make the next\nTaiwan decision clear.',
    lead: 'A modern law firm for cross-border work, grounded in Taiwan and fluent across Korean, Chinese, English, and Japanese.',
    primary: 'Email Attorney Tseng for Consultation',
    secondary: 'Explore practice areas',
    scroll: 'SCROLL TO EXPLORE',
    introEyebrow: 'A CLEARER WAY THROUGH TAIWAN',
    introTitle: 'Respect the texture of tradition.\nAnswer in today’s language.',
    introBody: 'From Taiwan’s streets and courtrooms to the boardroom, we turn local context into a clear path for international clients.',
    practiceEyebrow: 'PRACTICE AREAS',
    practiceTitle: 'The right counsel\nfor the moment that matters.',
    practiceBody: 'One considered path from first assessment through execution and dispute response.',
    courtEyebrow: 'FROM CONTEXT TO COUNSEL',
    courtTitle: 'Look past the surface\nto the structure of the decision.',
    courtBody: 'We read Taiwan’s legal and commercial realities together, translating complexity into the next useful move.',
    officeEyebrow: 'TAIWAN, WITH LOCAL REACH',
    officeTitle: 'Four offices.\nOne standard.',
    journalEyebrow: 'HOJUNG JOURNAL',
    journalTitle: 'Taiwan law to read\nbefore you move.',
    contactEyebrow: 'START WITH A CLEAR QUESTION',
    contactTitle: 'Send the first line\nof your question by email.',
    contactBody: 'Share the practice area and a short outline. Our attorney will guide the next step.',
    emailLabel: 'wei@hoveringlaw.com.tw',
    sensitiveNotice: 'Please do not include passport numbers, identification numbers, bank details, or original identity documents in an initial inquiry.',
    footerNote: 'LOCAL DESIGN STUDY · NOT PUBLISHED',
    heroAlt: 'Bright aerial flight over Taiwan’s Central Mountain Range and a sea of clouds',
    heritageAlt: 'A modern wash of light across a traditional Taiwan courtyard house',
    courtAlt: 'A calm Taiwan courtroom interior in soft natural light',
  },
  ja: {
    nav: { practice: '業務分野', method: '仕事の進め方', offices: '拠点', journal: 'ホジョン・ジャーナル', contact: 'メール相談' },
    eyebrow: 'TAIWAN · CROSS-BORDER COUNSEL',
    title: '台湾での大切な決断を、\nもっと明快に。',
    lead: '都市のスピードと法の基準を読み解く国際業務。韓国語・中国語・英語・日本語で台湾の次の一歩を支えます。',
    primary: '曾雋崴律師へメール相談',
    secondary: '業務分野を見る',
    scroll: 'SCROLL TO EXPLORE',
    introEyebrow: 'A CLEARER WAY THROUGH TAIWAN',
    introTitle: '伝統の質感を尊重し、\n今日の言葉で答える。',
    introBody: '台湾の街並みや法廷から企業の取締役会まで、現地の文脈を逃さず、国際クライアントが動ける形に整理します。',
    practiceEyebrow: 'PRACTICE AREAS',
    practiceTitle: '必要な瞬間に、\n正確な専門性を。',
    practiceBody: '初期判断から実行・紛争対応まで、一つの流れとして設計します。',
    courtEyebrow: 'FROM CONTEXT TO COUNSEL',
    courtTitle: '表面ではなく、\n決断の構造を見る。',
    courtBody: '台湾の司法・行政環境とビジネスの現実を併せて読み、複雑さを次の行動に翻訳します。',
    officeEyebrow: 'TAIWAN, WITH LOCAL REACH',
    officeTitle: '四つの拠点。\n一つの基準。',
    journalEyebrow: 'HOJUNG JOURNAL',
    journalTitle: '動く前に読む、\n台湾法務。',
    contactEyebrow: 'START WITH A CLEAR QUESTION',
    contactTitle: '相談の最初の一文を\nメールでお送りください。',
    contactBody: '相談分野と概要をお送りいただければ、担当弁護士が次の段階をご案内します。',
    emailLabel: 'wei@hoveringlaw.com.tw',
    sensitiveNotice: '初回のご連絡には、身分証番号・旅券番号・銀行口座情報・身分証原本などの機微情報を含めないでください。',
    footerNote: 'LOCAL DESIGN STUDY · NOT PUBLISHED',
    heroAlt: '明るい自然光の中、台湾中央山脈と雲海の上空を飛ぶ空撮映像',
    heritageAlt: '現代的な光が差し込む台湾の伝統的な三合院',
    courtAlt: '自然光に包まれた落ち着いた台湾の法廷内部',
  },
};

const SERVICES = [
  { index: '01', ko: '투자·법인설립', zh: '投資・公司設立', en: 'Investment & company setup', ja: '投資・会社設立', tone: 'sand' },
  { index: '02', ko: '민사소송·손해배상', zh: '民事訴訟・損害賠償', en: 'Civil litigation & damages', ja: '民事訴訟・損害賠償', tone: 'blue' },
  { index: '03', ko: '가사소송', zh: '家事訴訟', en: 'Family disputes', ja: '家事訴訟', tone: 'clay' },
  { index: '04', ko: '노동법·고용분쟁', zh: '勞動法・僱傭爭議', en: 'Employment & labor', ja: '労働法・雇用紛争', tone: 'mist' },
  { index: '05', ko: '형사소송', zh: '刑事訴訟', en: 'Criminal defense', ja: '刑事訴訟', tone: 'blue' },
  { index: '06', ko: '지적재산·금융분쟁', zh: '智慧財產・金融爭議', en: 'IP & financial disputes', ja: '知的財産・金融紛争', tone: 'sand' },
] as const;

const OFFICES = [
  { city: 'TAIPEI', local: { ko: '타이베이', 'zh-hant': '台北', en: 'Taipei', ja: '台北' }, note: 'North / strategy' },
  { city: 'TAICHUNG', local: { ko: '타이중', 'zh-hant': '台中', en: 'Taichung', ja: '台中' }, note: 'Central / disputes' },
  { city: 'KAOHSIUNG', local: { ko: '가오슝', 'zh-hant': '高雄', en: 'Kaohsiung', ja: '高雄' }, note: 'South / business' },
  { city: 'PINGTUNG', local: { ko: '핑둥', 'zh-hant': '屏東', en: 'Pingtung', ja: '屏東' }, note: 'South / local counsel' },
] as const;

const JOURNAL_CARDS = [
  { no: '01', date: '2025.09.13', ko: '대만 법인 설립, 처음부터 놓치지 말아야 할 세 가지', zh: '在台灣設立公司時不可忽略的三個重點', en: 'Three decisions to make before setting up in Taiwan', ja: '台湾で会社を設立する前に決める三つのこと' },
  { no: '02', date: '2025.08.29', ko: '대만에서 계약 분쟁이 시작되기 전 확인할 것', zh: '台灣契約爭議開始前應先確認的事項', en: 'What to check before a contract dispute begins', ja: '契約紛争が始まる前に確認したいこと' },
  { no: '03', date: '2025.07.18', ko: '한국 기업의 대만 진출과 현지 고용의 기준', zh: '韓國企業進入台灣市場與在地僱傭的標準', en: 'The local employment decisions behind a Taiwan entry', ja: '韓国企業の台湾進出と現地雇用の基準' },
] as const;

function textForLocale(item: { ko: string; zh: string; en: string; ja: string }, locale: SiteLocale) {
  return locale === 'zh-hant' ? item.zh : item[locale];
}

function consultationSubject(locale: SiteLocale) {
  return locale === 'zh-hant'
    ? '【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢'
    : locale === 'en'
      ? '[tseng-law.com Consultation] Taiwan Legal and Corporate Services'
      : locale === 'ja'
        ? '[tseng-law.com相談] 台湾法務・企業サービスのご相談'
        : '[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담';
}

function consultationHref(copy: PreviewCopy, locale: SiteLocale) {
  return `mailto:${copy.emailLabel}?subject=${encodeURIComponent(consultationSubject(locale))}`;
}

function EmailLink({ copy, locale, className }: { copy: PreviewCopy; locale: SiteLocale; className?: string }) {
  return <a className={className} href={consultationHref(copy, locale)} aria-label={copy.primary}>{copy.emailLabel}</a>;
}

export default function DesignPreview({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale];

  return (
    <main className={styles.preview} data-design-preview="local-only">
      <div className={styles.localRibbon} role="status">
        <span>LOCAL DESIGN STUDY</span>
        <span>·</span>
        <span>NOT PUBLISHED</span>
        <span className={styles.ribbonLocale}>{locale.toUpperCase()}</span>
      </div>

      <header className={styles.nav}>
        <a className={styles.wordmark} href="#top" aria-label="Hovering International Law Firm">
          <Image src="/images/brand/hovering-seal-red.png" alt="" width={42} height={40} priority />
          <span><strong>HOJUNG</strong><small>INTERNATIONAL LAW FIRM</small></span>
        </a>
        <nav className={styles.navLinks} aria-label="Preview navigation">
          <a href="#practice">{copy.nav.practice}</a>
          <a href="#method">{copy.nav.method}</a>
          <a href="#offices">{copy.nav.offices}</a>
          <a href="#journal">{copy.nav.journal}</a>
        </nav>
        <a className={styles.navCta} href="#consultation">{copy.nav.contact}<span aria-hidden="true">↗</span></a>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="preview-title">
        <video className={styles.heroVideo} autoPlay muted loop playsInline preload="metadata" poster="/images/editorial/taiwan-central-mountains-cloud-flight-v2.webp" aria-hidden="true">
          <source src="/videos/taiwan-central-mountains-cloud-flight-v2.webm" type="video/webm" />
          <source src="/videos/taiwan-central-mountains-cloud-flight-v2.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroWash} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 id="preview-title">{copy.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p className={styles.heroLead}>{copy.lead}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href={consultationHref(copy, locale)}>{copy.primary}<span aria-hidden="true">↗</span></a>
            <a className={styles.ghostButton} href="#practice">{copy.secondary}<span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className={styles.heroAside}>
          <div className={styles.heroAsideRule} />
          <p>01 / 06</p>
          <strong>TAIWAN<br />IN MOTION</strong>
          <span>Law, culture, and the next decision.</span>
        </div>
        <a className={styles.scrollCue} href="#intro"><span>{copy.scroll}</span><i aria-hidden="true" /></a>
      </section>

      <section className={styles.signalBar} aria-label="Languages and locations">
        <span>SEOUL</span><i /> <span>TAIPEI</span><i /> <span>TAICHUNG</span><i /> <span>KAOHSIUNG</span><i /> <span>KR · 中文 · EN · JP</span>
      </section>

      <section className={`${styles.intro} ${styles.section}`} id="intro">
        <div className={styles.sectionMeta}><span>02</span><span>{copy.introEyebrow}</span></div>
        <div className={styles.introGrid}>
          <h2>{copy.introTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
          <div className={styles.introBody}><p>{copy.introBody}</p><a className={styles.textLink} href="#method">{copy.nav.method}<span aria-hidden="true">↗</span></a></div>
        </div>
        <div className={styles.introImage}><Image src="/images/editorial/taiwan-sanheyuan-modern-daylight-v2.webp" alt={copy.heritageAlt} fill sizes="(max-width: 900px) 100vw, 86vw" /></div>
        <div className={styles.imageCaption}><span>FORM / LIGHT / CONTEXT</span><span>TAIWAN · 2026</span></div>
      </section>

      <section className={`${styles.practice} ${styles.section}`} id="practice">
        <div className={styles.sectionMeta}><span>03</span><span>{copy.practiceEyebrow}</span></div>
        <div className={styles.practiceHeading}><h2>{copy.practiceTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{copy.practiceBody}</p></div>
        <div className={styles.serviceGrid}>
          {SERVICES.map((service) => (
            <a className={`${styles.serviceCard} ${styles[`tone-${service.tone}`]}`} href="#consultation" key={service.index}>
              <span className={styles.cardIndex}>{service.index}</span>
              <span className={styles.cardMark} aria-hidden="true">↗</span>
              <h3>{textForLocale(service, locale)}</h3>
              <p>{locale === 'en' ? 'A clear, local route from assessment to action.' : locale === 'zh-hant' ? '從判斷到行動，提供清楚的在地路徑。' : locale === 'ja' ? '判断から実行まで、現地の道筋を明確に。' : '판단부터 실행까지, 현지의 경로를 선명하게.'}</p>
              <span className={styles.cardLink}>{locale === 'en' ? 'View area' : locale === 'zh-hant' ? '查看領域' : locale === 'ja' ? '詳しく見る' : '자세히 보기'} <span aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className={`${styles.method} ${styles.section}`} id="method">
        <div className={styles.sectionMeta}><span>04</span><span>{copy.courtEyebrow}</span></div>
        <div className={styles.methodFrame}>
          <div className={styles.methodCopy}><p className={styles.eyebrow}>{copy.courtEyebrow}</p><h2>{copy.courtTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{copy.courtBody}</p><a className={styles.lightLink} href="#consultation">{copy.primary}<span aria-hidden="true">↗</span></a></div>
          <div className={styles.methodMedia}><video autoPlay muted loop playsInline preload="metadata" poster="/images/editorial/taiwan-courtroom-calm-daylight-v2.webp" aria-label={copy.courtAlt}><source src="/videos/taiwan-courtroom-calm-daylight-v2.webm" type="video/webm" /><source src="/videos/taiwan-courtroom-calm-daylight-v2.mp4" type="video/mp4" /></video><span>READ THE ROOM / READ THE RULE</span></div>
        </div>
      </section>

      <section className={`${styles.offices} ${styles.section}`} id="offices">
        <div className={styles.sectionMeta}><span>05</span><span>{copy.officeEyebrow}</span></div>
        <div className={styles.officeHeading}><h2>{copy.officeTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{locale === 'en' ? 'Local reach for work that crosses borders.' : locale === 'zh-hant' ? '為跨境工作提供在地的觸角。' : locale === 'ja' ? '国境を越える仕事を、現地の距離感で。' : '국경을 넘는 업무를 현지의 거리감으로.'}</p></div>
        <div className={styles.officeList}>
          {OFFICES.map((office, index) => <a className={styles.officeRow} href="#consultation" key={office.city}><span>0{index + 1}</span><strong>{office.city}</strong><b>{office.local[locale]}</b><small>{office.note}</small><i aria-hidden="true">↗</i></a>)}
        </div>
      </section>

      <section className={`${styles.journal} ${styles.section}`} id="journal">
        <div className={styles.sectionMeta}><span>06</span><span>{copy.journalEyebrow}</span></div>
        <div className={styles.journalHeading}><h2>{copy.journalTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><a className={styles.textLink} href="#consultation">{locale === 'en' ? 'See all articles' : locale === 'zh-hant' ? '查看全部文章' : locale === 'ja' ? '記事をすべて見る' : '전체 칼럼 보기'}<span aria-hidden="true">↗</span></a></div>
        <div className={styles.journalGrid}>
          {JOURNAL_CARDS.map((article) => <a className={styles.journalCard} href="#consultation" key={article.no}><span className={styles.cardIndex}>{article.no}</span><time>{article.date}</time><h3>{textForLocale(article, locale)}</h3><span className={styles.cardLink}>{locale === 'en' ? 'Read' : locale === 'zh-hant' ? '閱讀' : locale === 'ja' ? '読む' : '읽기'} <span aria-hidden="true">→</span></span></a>)}
        </div>
      </section>

      <section className={styles.consultation} id="consultation">
        <div className={styles.consultationNoise} aria-hidden="true" />
        <div className={styles.sectionMeta}><span>07</span><span>{copy.contactEyebrow}</span></div>
        <div className={styles.consultationGrid}><h2>{copy.contactTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><div><p>{copy.contactBody}</p><a className={styles.consultationEmail} href={consultationHref(copy, locale)} aria-label={copy.primary}><span>{copy.emailLabel}</span><b>↗</b></a><p className={styles.sensitiveNotice}>{copy.sensitiveNotice}</p></div></div>
        <div className={styles.consultationFooter}><span>HOVERING INTERNATIONAL LAW FIRM</span><EmailLink copy={copy} locale={locale} className={styles.footerEmail} /><span>{copy.footerNote}</span></div>
      </section>

      <footer className={styles.footer}><div><Image src="/images/brand/hovering-seal-red.png" alt="" width={46} height={44} /><strong>HOJUNG</strong></div><p>© 2026 Hovering International Law Firm · Local preview only</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
