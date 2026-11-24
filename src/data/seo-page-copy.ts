/**
 * Search-result titles and descriptions for the priority landing pages.
 * Titles are complete (they include the brand), so they bypass the locale title template.
 * Keep claims limited to facts published on the site: see docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md.
 */
export type SeoPageCopy = { title: string; description: string };

export const SEO_PAGE_COPY: Readonly<Record<string, SeoPageCopy>> = {
  "/ko": {
    title: "대만 변호사 한국어 상담·법인설립·소송 | 법무법인 호정",
    description: "증준외 대만 변호사가 한국어로 상담합니다(TOPIK 6급). 회사 설립과 투자, 민사·형사·노동·가사 분쟁을 대만 4개 사무소에서 다룹니다. 사건 개요를 이메일로 보내면 상담을 신청할 수 있습니다.",
  },
  "/ko/taiwan-lawyer": {
    title: "대만변호사 TOPIK 6급 한국어 직접 상담 | 법무법인 호정",
    description: "TOPIK 6급을 보유한 증준외 대만 변호사와 한국어로 상담할 수 있습니다. 대만 회사 설립·투자, 민사·형사·가사 분쟁을 다루며, 상담 범위와 비용은 비용안내에서 먼저 확인할 수 있습니다. 상담은 이메일로 신청합니다.",
  },
  "/ko/taiwan-company-setup-lawyer": {
    title: "대만 법인설립 변호사 절차·비용·기간 | 법무법인 호정",
    description: "자회사·지사·연락사무소 중 사업에 맞는 형태를 대만 변호사와 한국어로 검토합니다. 회사명 예비심사, 외국인 투자 승인, 등기, 업종별 인허가와 설립 후 계약·근로·비자 문제까지 상담할 수 있습니다.",
  },
  "/ko/taiwan-litigation-lawyer": {
    title: "대만 소송 변호사 민사·형사·가사 상담 | 법무법인 호정",
    description: "대만에서 계약 분쟁, 손해배상, 교통사고, 형사 고소·경찰 조사, 이혼·상속 문제가 생겼다면 대만 변호사와 한국어로 상담할 수 있습니다. 합의 가능성과 증거 확보, 번역·송달·출입국 문제를 함께 봅니다.",
  },
  "/ko/korean-lawyer-in-taiwan": {
    title: "타이베이 한국어 가능 대만 변호사 상담 | 법무법인 호정",
    description: "법무법인 호정(Hovering International Law Firm)은 타이베이 소재 대만 로펌으로, 대만 변호사 증준외가 한국어·중국어·일본어·영어로 상담합니다. 대만 회사설립·민형사 소송·투자 자문을 다룹니다.",
  },
  "/ko/lawyers": {
    title: "증준외 대만 변호사 프로필과 담당 팀 | 법무법인 호정",
    description: "TOPIK 6급·JLPT N1을 보유한 증준외 대만 변호사의 학력과 경력을 확인할 수 있습니다. 소속 변호사와 법무전문원, 한국 사무장, 협력 회계사가 회사 설립, 소송, 인허가, 세무 업무를 나눠 맡습니다.",
  },
  "/ko/guides/taiwan-company-setup": {
    title: "대만 법인설립 가이드 2026 절차·비용 | 법무법인 호정",
    description: "대만 법인설립은 회사명 예비심사, 필요 시 외국인 투자 승인, 예비 계좌 개설, 자본금 송금, 등기 순으로 진행합니다. 자회사·지사·연락사무소의 차이와 비용·기간, 자주 묻는 질문을 비교할 수 있습니다.",
  },
  "/ko/columns": {
    title: "대만 법률 칼럼 회사·소송·노동·가사 | 법무법인 호정",
    description: "대만 회사 설립, 소송, 노동, 가사, 세무, 교통사고, 형사 문제를 주제별 칼럼으로 찾아볼 수 있습니다. 한국인과 한국 기업이 대만에서 자주 마주치는 쟁점을 법령과 공식 자료 출처와 함께 설명합니다.",
  },
  "/ja": {
    title: "台湾弁護士に日本語で相談｜会社設立・訴訟 | 昊鼎国際法律事務所",
    description: "JLPT N1を持つ台湾弁護士に日本語で相談できます。台湾での会社設立や投資、民事・労働・家事・刑事の紛争を、台湾4拠点の法律事務所が扱います。事案の概要をメールでお送りいただくと、相談をお申し込みいただけます。費用は料金案内をご覧ください。",
  },
  "/ja/taiwan-lawyer": {
    title: "台湾 弁護士 日本語｜台北の法律相談 | 昊鼎国際法律事務所",
    description: "日本企業と在台日本人の方からのご相談に、台湾弁護士が日本語で直接対応します。会社設立・投資、民事・労働・家事・刑事事件、化粧品規制（PIF）まで扱います。相談範囲と費用をご確認のうえ、日本語のメールでお問い合わせください。",
  },
  "/ja/taiwan-company-setup-lawyer": {
    title: "台湾 会社設立 弁護士｜手続き・費用・期間 | 昊鼎国際法律事務所",
    description: "子会社・支店・代表者事務所（駐在員事務所）の違いを比べ、日本企業に合う進出形態を台湾弁護士と日本語で検討できます。投資審査、銀行口座、就業許可など、必要な手続きと費用・期間をご相談いただけます。事業内容と出資構成をメールでお送りください。",
  },
  "/ja/lawyers": {
    title: "曾雋崴 台湾弁護士の学歴・経歴とチーム | 昊鼎国際法律事務所",
    description: "JLPT N1・TOPIK 6級を持つ曾雋崴 台湾弁護士の学歴と経歴を掲載しています。所属弁護士、法務専門員、韓国担当スタッフ、提携会計士が、会社設立、訴訟、許認可、外国人投資の手続きを分担します。ご相談はメールで受け付けています。",
  },
  "/en": {
    title: "English-Speaking Law Firm in Taipei, Taiwan | Hovering Law",
    description: "Taiwan attorneys advise foreign companies and individuals in English on company setup, investment, contracts, litigation, labor and family matters.",
  },
  "/en/taiwan-lawyer": {
    title: "Taiwan Lawyer for Litigation & Company Setup | Hovering Law",
    description: "Taiwan attorneys advise overseas companies and individuals in English on lawsuits, company setup, contracts and business risk. Email a short case summary.",
  },
  "/en/taiwan-company-setup-lawyer": {
    title: "Taiwan Company Setup Lawyer for Foreign Firms | Hovering Law",
    description: "Compare a Taiwan subsidiary, branch and representative office with a local attorney, then plan investment approval, registration, permits and contracts.",
  },
  "/en/lawyers": {
    title: "Taiwan Attorney Wei Tseng: Profile and Team | Hovering Law",
    description: "Attorney Wei Tseng holds TOPIK 6 and JLPT N1 and advises in English, Chinese, Korean and Japanese. See education, experience and the Taiwan legal team.",
  },
  "/vi": {
    title: "Luật sư Đài Loan: công ty, lao động, gia đình | Hovering Law",
    description: "Thông tin tiếng Việt về lập công ty, lao động, hôn nhân, hình sự ở Đài Loan. Luật sư tư vấn bằng tiếng Anh, Trung, Nhật, Hàn; có thể gửi email tiếng Việt.",
  },
  "/vi/company-setup": {
    title: "Thành lập công ty Đài Loan: luật sư tư vấn | Hovering Law",
    description: "So sánh công ty con, chi nhánh, văn phòng đại diện; xác định hồ sơ nhà đầu tư và giấy phép tại Đài Loan. Luật sư tư vấn bằng tiếng Anh, Trung, Nhật, Hàn.",
  },
  "/vi/lawyers": {
    title: "Luật sư Đài Loan Wei Tseng: hồ sơ và đội ngũ | Hovering Law",
    description: "Luật sư Wei Tseng và đội ngũ xử lý việc pháp lý tại Đài Loan cho cá nhân, doanh nghiệp. Xem học vấn, kinh nghiệm và ngôn ngữ tư vấn: Anh, Trung, Nhật, Hàn.",
  },
  "/ms": {
    title: "Peguam Taiwan: Syarikat, Buruh dan Keluarga | Hovering Law",
    description: "Maklumat bahasa Melayu tentang penubuhan syarikat, buruh, keluarga dan jenayah di Taiwan. Perundingan peguam dalam bahasa Inggeris, Cina, Jepun atau Korea.",
  },
  "/ms/services": {
    title: "Khidmat Peguam Taiwan: Enam Bidang Amalan | Hovering Law",
    description: "Syarikat dan pelaburan, sivil, keluarga dan pusaka, buruh, jenayah serta harta intelek di Taiwan. Perundingan peguam dalam Inggeris, Cina, Jepun, Korea.",
  },
  "/ms/lawyers": {
    title: "Peguam Taiwan Wei Tseng: Profil dan Pasukan | Hovering Law",
    description: "Peguam Wei Tseng dan pasukan mengendalikan hal undang-undang Taiwan untuk individu dan syarikat. Lihat pendidikan, pengalaman dan bahasa perundingan firma.",
  },
  "/zh-hant": {
    title: "台灣律師諮詢｜公司設立・訴訟・跨境法務 | 昊鼎國際法律事務所",
    description: "昊鼎國際法律事務所在台灣設有4處據點，處理公司設立、投資、民刑事訴訟、勞資與家事案件，並以中文、韓文、日文、英文提供諮詢。您可先以電子郵件寄送案件摘要，律師確認案件內容與委任範圍後，再說明後續諮詢方式與費用。如有期限，請在第一封信註明。",
  },
  "/zh-hant/taiwan-lawyer": {
    title: "台灣律師諮詢指南｜中韓日英四語法律服務 | 昊鼎國際法律事務所",
    description: "遇到公司設立、投資、民事、刑事或家事問題時，可先在此確認昊鼎律師的諮詢範圍、收費方式與聯絡管道。事務所以中文、韓文、日文、英文提供諮詢，外國客戶與跨境案件的當事人也能用熟悉的語言說明案情。事務所在台灣設有4處據點，可先以電子郵件提供案件摘要。",
  },
  "/zh-hant/taiwan-company-setup-lawyer": {
    title: "台灣公司設立律師｜投資核准・分子公司 | 昊鼎國際法律事務所",
    description: "外國企業來台設立據點前，可由律師比較子公司、分公司與代表處的責任與稅務差異，並確認投資核准、公司登記、資本匯入、營業場所與行業許可。設立後的契約與營運風險，也能以中文、韓文、日文或英文討論。請先以電子郵件提供營業內容與股東結構。",
  },
  "/ms/company-setup": {
    title: "Penubuhan Syarikat di Taiwan: Panduan Peguam | Hovering Law",
    description: "Bandingkan anak syarikat, cawangan dan pejabat perwakilan di Taiwan, serta semak dokumen pelabur dan lesen. Perundingan dalam Inggeris, Cina, Jepun, Korea.",
  },
  "/ms/debt-collection": {
    title: "Kutipan Hutang Perniagaan di Taiwan: Peguam | Hovering Law",
    description: "Semak kontrak, invois dan bukti penghantaran, kemudian nilai tuntutan atau perintah pembayaran di Taiwan. Perundingan dalam Inggeris, Cina, Jepun, Korea.",
  },
};

/** Pages whose title is spelled identically in a closely related language. */
export const LANGUAGE_NAMED_TITLE_PATHS: ReadonlySet<string> = new Set([
  "/ca/about",
  "/cs/about",
  "/cs/faq",
  "/da/about",
  "/es/about",
  "/hr/about",
  "/hr/columns",
  "/hr/columns/withdraw-capital-taiwan-company",
  "/hr/faq",
  "/hr/privacy",
  "/id/about",
  "/ms/about",
  "/nb/about",
  "/pl/about",
  "/pt/about",
  "/sk/about",
  "/sk/faq",
  "/sl/about",
  "/sr/about",
  "/sr/columns",
  "/sr/columns/withdraw-capital-taiwan-company",
  "/sr/faq",
  "/sr/privacy",
  "/sv/about",
]);
