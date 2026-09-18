/**
 * Answer-first summary blocks for the five guidance languages.
 *
 * These blocks exist so that a generative engine quoting one of the guidance
 * pages quotes a short, self-contained, accurate paragraph instead of stitching
 * one together from the body copy. Every sentence below restates a fact that is
 * already published in `guidanceContent[locale].pages[key]`; nothing here adds a
 * new legal statement, a figure, a promise, or a case outcome.
 *
 * Language contract (identical to the guidance pages themselves): the page is
 * written in the guidance language, but a consultation with an attorney is held
 * only in English, Chinese, Japanese and Korean. No answer below names the
 * guidance language at all, so no sentence can be read as an offer of a
 * consultation, interpreting, or support in Vietnamese, Indonesian, Thai,
 * Filipino or Arabic.
 *
 * The content module (`international-guidance-content.ts`) is intentionally not
 * touched by this file: only its two types are imported.
 */

import type {
  GuidanceLocale,
  GuidancePageKey,
} from '@/data/international-guidance-content';

export interface GuidanceAnswer {
  /**
   * 40–80 words (Thai: 120–400 characters) restating the page in one block:
   * the direct answer, one sentence on the consultation languages.
   */
  answer: string;
  /**
   * One or two supporting links. Site-internal paths only, each one an existing
   * guidance route in the same language.
   */
  sources: string[];
}

export const guidanceAnswers: Record<
  GuidanceLocale,
  Partial<Record<GuidancePageKey, GuidanceAnswer>>
> = {
  vi: {
    services: {
      answer:
        'Văn phòng nhận sáu nhóm công việc theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, tranh chấp dân sự và bồi thường, hôn nhân, gia đình và thừa kế, tranh chấp lao động, hình sự và sở hữu trí tuệ. Phạm vi từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi. Tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm là văn phòng luật tại Đài Loan, thành lập năm 2016 bởi luật sư Đại học Quốc lập Đài Loan (國立臺灣大學), cơ sở tại Đài Bắc, Cao Hùng, Đài Trung và Bình Đông. Từ 2020 có bộ phận kế toán; cơ sở Đài Trung phụ trách việc liên quan đến Hàn Quốc, Nhật Bản. Văn phòng không cam kết kết quả. Tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/lawyers', '/vi/services'],
    },
    lawyers: {
      answer:
        'Trang này giới thiệu các luật sư, quản lý nghiệp vụ và kế toán viên hợp tác của Hovering. Luật sư Wei Tseng (曾雋崴) có tư cách hành nghề tại Đài Loan và là luật sư điều hành của văn phòng, làm việc với khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế. Việc tư vấn của văn phòng được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/about', '/vi/contact'],
    },
    pricing: {
      answer:
        'Trang này không công bố bảng giá. Phạm vi công việc được xác định từ tóm tắt quý vị gửi, sau đó mức phí và cách tính được xác nhận trước khi bắt đầu. Buổi tư vấn có thể là dịch vụ có thu phí. Ngoài thù lao luật sư có thể có khoản nộp cho tòa án hoặc cơ quan nhà nước. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/faq'],
    },
    contact: {
      answer:
        'Hãy gửi tóm tắt qua biểu mẫu liên hệ: chuyện gì đã xảy ra, cần hỗ trợ gì, vụ việc liên quan đến Đài Loan ra sao và thời hạn nếu có. Bước đầu chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ. Văn phòng không cam kết thời gian phản hồi, không xác nhận lịch hẹn qua trang này. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/pricing'],
    },
    faq: {
      answer:
        'Phần hỏi đáp trả lời ở mức thông tin chung: sáu nhóm công việc, cách chuẩn bị tóm tắt, chi phí và ý nghĩa của việc gửi yêu cầu. Yêu cầu đã gửi đang chờ luật sư xem xét; không phải ý kiến pháp lý, không phải lịch hẹn, và không tạo lập quan hệ giữa luật sư và khách hàng. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/services'],
    },
  },
  id: {
    services: {
      answer:
        'Kantor menangani enam kelompok perkara berdasarkan hukum Taiwan: investasi dan pendirian perusahaan di Taiwan, sengketa perdata dan ganti rugi, perkara perkawinan, keluarga, dan waris, sengketa ketenagakerjaan, perkara pidana, serta kekayaan intelektual. Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm adalah kantor advokat di Taiwan yang didirikan pada 2016 oleh para advokat lulusan Universitas Nasional Taiwan (國立臺灣大學), dengan kantor di Taipei, Kaohsiung, Taichung, dan Pingtung. Sejak 2020 kantor juga memiliki bagian akuntansi, dan kantor Taichung menangani urusan yang berkaitan dengan Korea dan Jepang. Hasil setiap perkara bergantung pada faktanya, sehingga kami tidak menjanjikan hasil. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/lawyers', '/id/services'],
    },
    lawyers: {
      answer:
        'Halaman ini memuat profil para advokat, manajer operasional, dan akuntan mitra Hovering. Wei Tseng (曾雋崴) adalah advokat berizin praktik di Taiwan dan advokat pengelola di Hovering International Law Firm, yang bekerja untuk klien dari Korea, Jepang, dan klien internasional lainnya. Konsultasi di kantor dilayani dalam empat bahasa: bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/about', '/id/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak memuat daftar tarif. Lingkup pekerjaan ditetapkan lebih dulu berdasarkan ringkasan yang Anda kirim, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai. Pertemuan dengan advokat dapat merupakan layanan berbayar, dan selain honorarium advokat dapat timbul pungutan untuk pengadilan atau instansi pemerintah. Konsultasi dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/faq'],
    },
    contact: {
      answer:
        'Kirimkan ringkasan melalui formulir kontak: apa yang terjadi, bantuan apa yang Anda perlukan, apa kaitan perkara itu dengan Taiwan, dan tenggat waktu jika Anda mengetahuinya. Pada tahap awal Anda belum perlu mengirim dokumen identitas atau seluruh bukti. Kantor tidak menjanjikan waktu balasan dan tidak memastikan janji temu melalui halaman ini. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/pricing'],
    },
    faq: {
      answer:
        'Bagian tanya jawab menjelaskan pada tingkat keterangan umum: enam kelompok perkara, persiapan sebelum menghubungi kantor, cara biaya ditetapkan, dan arti dari mengirim permintaan. Permintaan yang terkirim berarti permintaan yang menunggu ditinjau advokat; itu bukan nasihat hukum, bukan janji temu, dan tidak membentuk hubungan antara advokat dan klien. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/services'],
    },
  },
  th: {
    services: {
      answer:
        'สำนักงานรับดำเนินการงาน 6 กลุ่มภายใต้กฎหมายไต้หวัน ได้แก่ การลงทุนและการจัดตั้งบริษัทในไต้หวัน ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน คดีการสมรส ครอบครัว และมรดก ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm เป็นสำนักงานกฎหมายในไต้หวัน ก่อตั้งขึ้นในปี 2016 โดยกลุ่มทนายความที่จบการศึกษาจากมหาวิทยาลัยแห่งชาติไต้หวัน (國立臺灣大學) มีที่ทำการที่ไทเป เกาสง ไถจง และผิงตง และมีส่วนงานบัญชีตั้งแต่ปี 2020 โดยสาขาไถจงรับงานที่เกี่ยวข้องกับเกาหลีและญี่ปุ่น ทั้งนี้ เราไม่รับประกันผล การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/lawyers', '/th/services'],
    },
    lawyers: {
      answer:
        'หน้านี้แนะนำประวัติของทนายความ ผู้จัดการงาน และผู้สอบบัญชีพันธมิตรของ Hovering โดย Wei Tseng (曾雋崴) เป็นทนายความที่มีคุณสมบัติประกอบวิชาชีพในไต้หวัน และเป็นทนายความผู้บริหารของสำนักงาน ทำงานให้แก่ลูกความชาวเกาหลี ชาวญี่ปุ่น และลูกความต่างชาติรายอื่น การให้คำปรึกษาของสำนักงานดำเนินการใน 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/about', '/th/contact'],
    },
    pricing: {
      answer:
        'หน้านี้ไม่แสดงอัตราค่าบริการ สำนักงานจะกำหนดขอบเขตงานก่อนจากสรุปเรื่องที่ท่านส่งมา จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน การพบทนายความอาจเป็นบริการที่มีค่าใช้จ่าย และนอกจากค่าทนายความยังอาจมีค่าธรรมเนียมที่ต้องชำระต่อศาลหรือหน่วยงานของรัฐ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/faq'],
    },
    contact: {
      answer:
        'โปรดส่งสรุปเรื่องผ่านแบบฟอร์มติดต่อ โดยระบุว่าเกิดอะไรขึ้น ท่านต้องการความช่วยเหลือด้านใด เรื่องนี้เกี่ยวข้องกับไต้หวันอย่างไร และมีกำหนดเวลาหรือไม่ ในขั้นแรกยังไม่จำเป็นต้องส่งเอกสารแสดงตนหรือพยานหลักฐานทั้งหมด สำนักงานไม่รับประกันระยะเวลาตอบกลับและไม่ได้ยืนยันการนัดหมายผ่านหน้านี้ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/pricing'],
    },
    faq: {
      answer:
        'ส่วนคำถามที่พบบ่อยตอบไว้ในระดับข้อมูลทั่วไป ทั้งกลุ่มงาน 6 กลุ่ม การเตรียมตัวก่อนติดต่อ วิธีกำหนดค่าใช้จ่าย และความหมายของการส่งเรื่องเข้ามา เรื่องที่ส่งแล้วคือเรื่องที่รอทนายความตรวจสอบ ไม่ใช่ความเห็นทางกฎหมาย ไม่ใช่การนัดหมาย และไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/services'],
    },
  },
  fil: {
    services: {
      answer:
        'Anim na pangkat ng usapin ang hinahawakan ng tanggapan sa ilalim ng batas ng Taiwan: pamumuhunan at pagtatatag ng kompanya sa Taiwan, sibil na hidwaan at danyos, usaping pag-aasawa, pampamilya, at pagmamana, hidwaan sa paggawa, usaping kriminal, at intelektuwal na ari-arian. Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala ninyo. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/faq', '/fil/contact'],
    },
    about: {
      answer:
        'Ang Hovering International Law Firm ay tanggapan ng mga abogado sa Taiwan na itinatag noong 2016 ng mga abogadong nagmula sa National Taiwan University (國立臺灣大學), na may mga tanggapan sa Taipei, Kaohsiung, Taichung, at Pingtung. Mula noong 2020 ay may bahagi rin itong pang-akawnting, at hinahawakan ng tanggapan sa Taichung ang gawaing may kaugnayan sa Korea at Japan. Wala kaming ipinapangakong resulta. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/lawyers', '/fil/services'],
    },
    lawyers: {
      answer:
        'Inilalahad ng pahinang ito ang mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong akawntant ng Hovering. Si Wei Tseng (曾雋崴) ay abogadang kwalipikadong magpraktis sa Taiwan at ang namamahalang abogada ng tanggapan, na gumagawa para sa mga kliyenteng Koreano, Hapon, at iba pang dayuhang kliyente. Isinasagawa ang konsultasyon sa tanggapan sa apat na wika: Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/about', '/fil/contact'],
    },
    pricing: {
      answer:
        'Walang listahan ng presyo sa pahinang ito. Itinatakda muna ang saklaw ng trabaho batay sa buod na ipinadala ninyo, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho. Maaaring bayad na serbisyo ang pagharap sa abogado, at maaari ring may singil na babayaran sa korte o sa ahensiya ng pamahalaan. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/contact', '/fil/faq'],
    },
    contact: {
      answer:
        'Ipadala ang buod sa pamamagitan ng form ng kontak: kung ano ang nangyari, anong tulong ang kailangan ninyo, ano ang kaugnayan ng usapin sa Taiwan, at kung may takdang petsa na alam ninyo. Sa unang yugto ay hindi pa ninyo kailangang ipadala ang mga dokumento ng pagkakakilanlan o ang buong ebidensiya. Walang ipinapangakong panahon ng pagsagot at walang kinukumpirmang appointment dito. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/faq', '/fil/pricing'],
    },
    faq: {
      answer:
        'Sinasagot ng bahaging ito ang mga madalas itanong sa antas ng pangkalahatang impormasyon: ang anim na pangkat ng usapin, ang paghahanda bago makipag-ugnayan, ang pagtatakda ng bayarin, at ang kahulugan ng pagpapadala ng mensahe. Ang naipadalang mensahe ay naghihintay pa ng pagsusuri ng abogado; hindi ito legal na payo, hindi ito appointment, at hindi ito bumubuo ng ugnayan ng abogado at kliyente. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/contact', '/fil/services'],
    },
  },
  ar: {
    services: {
      answer:
        'يتولّى المكتب ست مجموعات من القضايا وفق القانون التايواني: الاستثمار وتأسيس الشركات في تايوان، والمنازعات المدنية ودعاوى التعويض، وقضايا الزواج والأسرة والميراث، ومنازعات العمل، والقضايا الجزائية، والملكية الفكرية. ويُؤكَّد نطاق كل قضية على حدة بعد مراجعة المحامي لما ترسله. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/faq', '/ar/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm مكتب محاماة في تايوان، تأسّس عام 2016 على يد محامين من خرّيجي الجامعة الوطنية التايوانية (國立臺灣大學)، وله مكاتب في تايبيه وكاوهسيونغ وتايتشونغ وبينغتونغ. ومنذ عام 2020 يضم قسمًا للمحاسبة، ويتولّى مكتب تايتشونغ الأعمال المتصلة بكوريا واليابان. ولا يقدّم المكتب أي التزام بالنتيجة. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/lawyers', '/ar/services'],
    },
    lawyers: {
      answer:
        'تعرض هذه الصفحة ملفات المحامين ومديري الأعمال والمحاسب الشريك في Hovering. والمحامية Wei Tseng (曾雋崴) محامية مؤهَّلة لمزاولة المهنة في تايوان والمحامية المديرة في المكتب، وتعمل مع العملاء من كوريا واليابان وسائر العملاء الدوليين. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/about', '/ar/contact'],
    },
    pricing: {
      answer:
        'لا تنشر هذه الصفحة قائمة أسعار. يُحدَّد نطاق العمل أولًا من الملخّص الذي ترسله، ثم تُؤكَّد معك الأتعاب وطريقة احتسابها قبل بدء العمل. وقد تكون الجلسة مع المحامي خدمة بمقابل، وقد تنشأ إلى جانب أتعاب المحاماة مبالغ تُدفَع للمحكمة أو لجهة حكومية. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/contact', '/ar/faq'],
    },
    contact: {
      answer:
        'أرسل ملخّصك عبر نموذج التواصل: ما الذي حدث، وما المساعدة التي تحتاج إليها، وما صلة القضية بتايوان، والمواعيد إن كنت تعرفها. ولا حاجة في المرحلة الأولى إلى إرسال وثائق الهوية أو ملف الأدلة كاملًا. ولا يلتزم المكتب بمدة للرد، ولا يؤكّد المواعيد عبر هذه الصفحة. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/faq', '/ar/pricing'],
    },
    faq: {
      answer:
        'يجيب قسم الأسئلة الشائعة على مستوى المعلومات العامة: مجموعات العمل الست، وكيفية تحضير الملخّص، وطريقة تحديد التكلفة، ومعنى إرسال الطلب. والطلب المُرسَل ينتظر مراجعة المحامي؛ فهو ليس رأيًا قانونيًا، وليس موعدًا مؤكّدًا، ولا يُنشئ علاقة بين المحامي والموكّل. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/contact', '/ar/services'],
    },
  },
  de: {
    services: {
      answer:
        'Die Kanzlei bearbeitet sechs Tätigkeitsgruppen nach taiwanischem Recht: Investition und Gesellschaftsgründung, Zivilsachen und Schadensersatz, Ehe, Familie und Erbrecht, Arbeitsrecht, Strafsachen und geistiges Eigentum. Der Umfang jeder Sache wird gesondert bestätigt, nachdem eine Anwältin oder ein Anwalt den Inhalt geprüft hat. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/faq', '/de/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ist eine Anwaltskanzlei in Taiwan, 2016 gegründet von Absolventinnen und Absolventen der National Taiwan University (國立臺灣大學), mit Büros in Taipeh, Kaohsiung, Taichung und Pingtung. Seit 2020 gibt es eine Buchhaltungsabteilung; das Büro Taichung bearbeitet Angelegenheiten mit Bezug zu Korea und Japan. Die Kanzlei verspricht kein Ergebnis. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/lawyers', '/de/services'],
    },
    lawyers: {
      answer:
        'Diese Seite zeigt die Profile der Anwältinnen und Anwälte, der Betriebsleitung und der Partner-Wirtschaftsprüfung von Hovering. Rechtsanwältin Wei Tseng (曾雋崴) ist in Taiwan zur anwaltlichen Tätigkeit zugelassen und geschäftsführende Anwältin der Kanzlei; sie arbeitet mit Mandanten aus Korea, Japan und anderen internationalen Mandanten. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/about', '/de/contact'],
    },
    pricing: {
      answer:
        'Diese Seite veröffentlicht keine Preisliste. Zuerst wird der Arbeitsumfang aus der von Ihnen gesendeten Zusammenfassung festgelegt, danach werden Höhe und Berechnungsweise der Kosten mit Ihnen bestätigt, bevor die Arbeit beginnt. Die Beratung durch eine Anwältin oder einen Anwalt kann entgeltlich sein; neben dem Honorar können Gerichts- oder Behördenkosten entstehen. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/contact', '/de/faq'],
    },
    contact: {
      answer:
        'Senden Sie Ihre Zusammenfassung über das Kontaktformular: was geschehen ist, welche Hilfe Sie brauchen, welchen Bezug die Sache zu Taiwan hat und die Frist, falls Sie eine kennen. In der Anfangsphase müssen Sie noch keine Ausweisdokumente oder den gesamten Beweisbestand senden. Die Kanzlei verspricht keine Antwortfrist und bestätigt keinen Termin über diese Seite. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/faq', '/de/pricing'],
    },
    faq: {
      answer:
        'Dieser Teil beantwortet häufige Fragen auf der Ebene allgemeiner Angaben: die sechs Tätigkeitsgruppen, die Vorbereitung vor dem Kontakt, die Festlegung der Kosten und die Bedeutung einer gesendeten Nachricht. Eine gesendete Anfrage wartet auf Prüfung durch eine Anwältin oder einen Anwalt; sie ist keine Rechtsberatung, kein Termin und begründet kein Mandatsverhältnis. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/contact', '/de/services'],
    },
  },
  es: {
    services: {
      answer:
        'El despacho atiende seis grupos de trabajo según el derecho de Taiwán: inversión y constitución de sociedades, litigios civiles y daños, matrimonio, familia y sucesiones, laboral, penal y propiedad intelectual. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/faq', '/es/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm es un despacho de abogados en Taiwán, fundado en 2016 por egresados de la National Taiwan University (國立臺灣大學), con oficinas en Taipéi, Kaohsiung, Taichung y Pingtung. Desde 2020 incluye un área de contabilidad, y la oficina de Taichung atiende asuntos relacionados con Corea y Japón. El despacho no promete un resultado. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/lawyers', '/es/services'],
    },
    lawyers: {
      answer:
        'Esta página muestra los perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering. La abogada Wei Tseng (曾雋崴) está habilitada para ejercer en Taiwán y es la abogada directora del despacho; trabaja con clientes de Corea, de Japón y con otros clientes internacionales. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/about', '/es/contact'],
    },
    pricing: {
      answer:
        'Esta página no publica una lista de precios. Primero se fija el alcance del trabajo a partir del resumen que usted envía, y después se confirman con usted la cuantía y el modo de cálculo antes de empezar. La consulta con un abogado puede ser un servicio de pago, y junto a los honorarios pueden surgir tasas judiciales o administrativas. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/contact', '/es/faq'],
    },
    contact: {
      answer:
        'Envíe su resumen a través del formulario de contacto: qué ocurrió, qué ayuda necesita, qué relación tiene el asunto con Taiwán y el plazo si lo conoce. En esta primera fase no hace falta enviar documentos de identidad ni el expediente completo de pruebas. El despacho no promete un plazo de respuesta y no confirma una cita a través de esta página. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/faq', '/es/pricing'],
    },
    faq: {
      answer:
        'Esta parte responde a preguntas frecuentes en el plano de la información general: los seis grupos de trabajo, la preparación antes del contacto, el modo de fijar los honorarios y el significado de enviar un mensaje. Una solicitud enviada espera la revisión de un abogado; no es asesoramiento jurídico, no es una cita y no crea una relación entre abogado y cliente. La consulta se realiza en inglés, chino, japonés y coreano.',
      sources: ['/es/contact', '/es/services'],
    },
  },
  fr: {
    services: {
      answer:
        'Le cabinet traite six groupes de travail selon le droit de Taïwan : investissement et constitution de sociétés, affaires civiles et dommages-intérêts, mariage, famille et successions, droit du travail, affaires pénales et propriété intellectuelle. L’étendue de chaque affaire est confirmée séparément après qu’une avocate ou un avocat a examiné le contenu que vous envoyez. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/faq', '/fr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm est un cabinet d’avocats à Taïwan, fondé en 2016 par des diplômées et diplômés de la National Taiwan University (國立臺灣大學), avec des bureaux à Taipei, Kaohsiung, Taichung et Pingtung. Depuis 2020 il existe un service de comptabilité ; le bureau de Taichung traite des affaires liées à la Corée et au Japon. Le cabinet ne promet pas de résultat. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/lawyers', '/fr/services'],
    },
    lawyers: {
      answer:
        'Cette page présente les profils des avocates et avocats, de la direction des opérations et de l’expertise-comptable associée de Hovering. L’avocate Wei Tseng (曾雋崴) est habilitée à exercer à Taïwan et elle est l’avocate dirigeante du cabinet ; elle travaille avec des clients de Corée, du Japon et d’autres clients internationaux. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/about', '/fr/contact'],
    },
    pricing: {
      answer:
        'Cette page ne publie pas de liste de prix. L’étendue du travail est d’abord fixée à partir du résumé que vous envoyez, puis le montant et le mode de calcul sont confirmés avec vous avant le début du travail. La consultation avec une avocate ou un avocat peut être une prestation payante ; outre les honoraires, des frais de tribunal ou d’autorité peuvent naître. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/contact', '/fr/faq'],
    },
    contact: {
      answer:
        'Envoyez votre résumé par le formulaire de contact : ce qui s’est passé, l’aide demandée, le lien avec Taïwan et le délai s’il existe. À ce stade, n’envoyez pas encore de pièces d’identité ni l’ensemble des preuves. Le cabinet ne promet pas de délai de réponse et ne confirme pas de rendez-vous par cette page. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/faq', '/fr/pricing'],
    },
    faq: {
      answer:
        'Cette partie répond à des questions fréquentes : les six groupes de travail, la préparation avant le contact, le mode de fixation des honoraires et le sens d’un message envoyé. Une demande envoyée attend l’examen d’une avocate ou d’un avocat ; ce n’est pas un avis juridique, ce n’est pas un rendez-vous, et cela ne crée pas de relation entre avocate ou avocat et client. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/contact', '/fr/services'],
    },
  },
  pt: {
    services: {
      answer:
        'O escritório trata seis grupos de trabalho segundo o direito de Taiwan: investimento e constituição de sociedades, litígios civis e indemnizações, casamento, família e sucessões, laboral, penal e propriedade intelectual. O âmbito de cada assunto confirma-se separadamente depois de uma advogada ou um advogado rever o conteúdo que envia. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/faq', '/pt/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm é um escritório de advogados em Taiwan, fundado em 2016 por diplomadas e diplomados da National Taiwan University (國立臺灣大學), com escritórios em Taipé, Kaohsiung, Taichung e Pingtung. Desde 2020 inclui uma área de contabilidade, e o escritório de Taichung trata assuntos relacionados com a Coreia e o Japão. O escritório não promete um resultado. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/lawyers', '/pt/services'],
    },
    lawyers: {
      answer:
        'Esta página mostra os perfis das advogadas e dos advogados, da direção de operações e da contabilidade associada de Hovering. A advogada Wei Tseng (曾雋崴) está habilitada a exercer em Taiwan e é a advogada diretora do escritório; trabalha com clientes da Coreia, do Japão e com outros clientes internacionais. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/about', '/pt/contact'],
    },
    pricing: {
      answer:
        'Esta página não publica uma lista de preços. Primeiro fixa-se o âmbito do trabalho a partir do resumo que envia, e depois confirmam-se consigo o montante e o modo de cálculo antes de começar. A consulta com uma advogada ou um advogado pode ser um serviço pago, e junto aos honorários podem surgir taxas judiciais ou administrativas. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/contact', '/pt/faq'],
    },
    contact: {
      answer:
        'Envie o seu resumo através do formulário de contacto: o que ocorreu, que ajuda precisa, que relação tem o assunto com Taiwan e o prazo se o conhecer. Nesta primeira fase não é preciso enviar documentos de identidade nem o processo completo de provas. O escritório não promete um prazo de resposta e não confirma uma marcação através desta página. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/faq', '/pt/pricing'],
    },
    faq: {
      answer:
        'Esta parte responde a perguntas frequentes no plano da informação geral: os seis grupos de trabalho, a preparação antes do contacto, o modo de fixar os honorários e o significado de enviar uma mensagem. Um pedido enviado espera a revisão de uma advogada ou de um advogado; não é parecer jurídico, não é uma marcação e não cria uma relação entre advogada ou advogado e cliente. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
        sources: ['/pt/contact', '/pt/services'],
    },
  },
  'zh-hans': {
    services: {
      answer:
        '事务所依台湾法律处理六组工作：投资与公司设立、民事与损害赔偿、婚姻家庭与继承、劳动、刑事与智慧财产。每一案件的范围在律师审阅您提交的内容后另行确认。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/faq', '/zh-hans/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm 是台湾律师事务所，2016 年由国立台湾大学（國立臺灣大學）出身的律师创立，办公室在台北、高雄、台中与屏东。自 2020 年起设有会计部门；台中办公室处理与韩国、日本有关的事项。事务所不承诺结果。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/lawyers', '/zh-hans/services'],
    },
    lawyers: {
      answer:
        '本页介绍 Hovering 的律师、运营主管与合作会计师。律师曾雋崴（Wei Tseng）具有台湾执业资格，为事务所主持律师，与来自韩国、日本及其他国际委托人合作。事务所的咨询以英语、中文、日语和韩语四种语言进行。',
      sources: ['/zh-hans/about', '/zh-hans/contact'],
    },
    pricing: {
      answer:
        '本页不公布价目表。工作范围先根据您提交的摘要确定，费用金额与计算方式在开始工作前与您确认。与律师的咨询可以是有偿服务。除律师酬金外，还可能产生法院或行政机关费用。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/contact', '/zh-hans/faq'],
    },
    contact: {
      answer:
        '请通过联系表单提交摘要：发生了什么、需要何种协助、事项与台湾的关联，以及期限（若有）。初期不必发送身份证件或全部证据。事务所不承诺回复时限，也不通过本页确认预约。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/faq', '/zh-hans/pricing'],
    },
    faq: {
      answer:
        '问答部分在一般说明的层面回答：六组工作、联系前如何准备、费用如何确定，以及发送请求的含义。已发送的请求正在等待律师审阅；不是法律意见，不是预约，也不成立律师与委托人关系。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/contact', '/zh-hans/services'],
    },
  },
  ms: {
    services: {
      answer:
        'Firma mengendalikan enam kumpulan kerja menurut undang-undang Taiwan: pelaburan dan penubuhan syarikat, pertikaian sivil dan ganti rugi, perkahwinan, keluarga dan pusaka, pertikaian buruh, jenayah dan harta intelek. Skop setiap hal disahkan secara berasingan selepas peguam menyemak kandungan yang anda hantar. Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/faq', '/ms/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ialah firma peguam di Taiwan, ditubuhkan pada 2016 oleh graduan National Taiwan University (國立臺灣大學), dengan pejabat di Taipei, Kaohsiung, Taichung dan Pingtung. Sejak 2020 terdapat bahagian perakaunan; pejabat Taichung mengendalikan hal yang berkaitan dengan Korea dan Jepun. Firma tidak menjanjikan hasil. Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/lawyers', '/ms/services'],
    },
    lawyers: {
      answer:
        'Halaman ini memperkenalkan peguam, pengurusan operasi dan perakaunan rakan kongsi Hovering. Peguam Wei Tseng (曾雋崴) mempunyai kelayakan untuk beramal di Taiwan dan ialah peguam pengarah firma; beliau bekerja dengan klien dari Korea, Jepun dan klien antarabangsa lain. Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/about', '/ms/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak menerbitkan senarai harga. Skop kerja ditetapkan dahulu daripada ringkasan yang anda hantar, kemudian jumlah dan cara pengiraan disahkan dengan anda sebelum kerja bermula. Perundingan dengan peguam boleh menjadi perkhidmatan berbayar; selain yuran, kos mahkamah atau pihak berkuasa boleh timbul. Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/contact', '/ms/faq'],
    },
    contact: {
      answer:
        'Hantar ringkasan melalui borang hubungan: apa yang berlaku, bantuan yang diperlukan, kaitan dengan Taiwan dan tempoh jika ada. Pada peringkat ini belum perlu menghantar dokumen pengenalan atau seluruh bukti. Firma tidak menjanjikan tempoh jawapan dan tidak mengesahkan janji temu melalui halaman ini. Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/faq', '/ms/pricing'],
    },
    faq: {
      answer:
        'Bahagian soalan menjawab pada tahap maklumat am: enam kumpulan kerja, persediaan sebelum hubungan, cara menetapkan yuran dan makna mesej yang dihantar. Permintaan yang dihantar menunggu semakan peguam; bukan nasihat undang-undang, bukan janji temu, dan tidak mewujudkan hubungan antara peguam dan klien. Perundingan dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/contact', '/ms/services'],
    },
  },
  ru: {
    services: {
      answer:
        'Фирма ведёт шесть групп работы по праву Тайваня: инвестиции и учреждение компаний, гражданские дела и возмещение вреда, брак, семья и наследство, трудовые споры, уголовные дела и интеллектуальная собственность. Объём каждого дела подтверждается отдельно после того, как адвокат рассмотрит содержание, которое Вы отправляете. Консультация проводится на английском, китайском, японском и корейском языках.',
      sources: ['/ru/faq', '/ru/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm — адвокатская фирма на Тайване, основанная в 2016 году выпускниками National Taiwan University (國立臺灣大學), с офисами Тайбэй, Гаосюн, Тайчжун и Пиндун. С 2020 года есть бухгалтерское подразделение; офис Тайчжун ведёт дела, связанные с Кореей и Японией. Фирма не обещает результата. Консультация проводится на английском, китайском, японском и корейском языках.',
      sources: ['/ru/lawyers', '/ru/services'],
    },
    lawyers: {
      answer:
        'Эта страница представляет адвокатов, руководство по операциям и партнёрскую бухгалтерию Hovering. Адвокат Вэй Цзэн (曾雋崴) уполномочена практиковать на Тайване и является руководящим адвокатом фирмы; она работает с доверителями из Кореи, Японии и другими международными доверителями. Консультация проводится на английском, китайском, японском и корейском языках.',
      sources: ['/ru/about', '/ru/contact'],
    },
    pricing: {
      answer:
        'Эта страница не публикует прейскурант. Объём работы сначала определяется по краткому изложению, которое Вы отправляете, затем размер и способ расчёта подтверждаются с Вами до начала работы. Консультация с адвокатом может быть возмездной услугой; помимо гонорара могут возникнуть судебные или административные расходы. Консультация проводится на английском, китайском, японском и корейском языках.',
      sources: ['/ru/contact', '/ru/faq'],
    },
    contact: {
      answer:
        'Отправьте краткое изложение через контактную форму: что произошло, какая помощь нужна, какая связь у дела с Тайванем и срок, если он есть. На этом этапе ещё не нужно отправлять документы, удостоверяющие личность, или все доказательства. Фирма не обещает срок ответа и не подтверждает запись через эту страницу. Консультация проводится на английском, китайском, японском и корейском языках.',
      sources: ['/ru/faq', '/ru/pricing'],
    },
    faq: {
      answer:
        'Этот раздел отвечает на частые вопросы на уровне общих сведений: шесть групп работы, подготовка до обращения, способ определения гонорара и смысл отправленного сообщения. Отправленный запрос ожидает рассмотрения адвокатом; это не юридическая консультация, не запись и не создаёт отношений между адвокатом и доверителем. Консультация проводится на английском, китайском, японском и корейском языках.',
      sources: ['/ru/contact', '/ru/services'],
    },
  },
  tr: {
    services: {
      answer:
        'Büro, Tayvan hukukuna göre altı çalışma grubu yürütür: yatırım ve şirket kuruluşu, hukuk davaları ve tazminat, evlilik, aile ve miras, iş hukuku, ceza ve fikri mülkiyet. Her işin kapsamı, bir avukat gönderdiğiniz içeriği inceledikten sonra ayrıca doğrulanır. Görüşme İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/faq', '/tr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm, 2016 yılında National Taiwan University (國立臺灣大學) mezunları tarafından kurulmuş, Taipei, Kaohsiung, Taichung ve Pingtung ofisleri olan bir Tayvan avukatlık bürosudur. 2020’den beri bir muhasebe birimi vardır; Taichung ofisi Kore ve Japonya bağlantılı işleri yürütür. Büro sonuç vaat etmez. Görüşme İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/lawyers', '/tr/services'],
    },
    lawyers: {
      answer:
        'Bu sayfa Hovering avukatlarının, operasyon yönetiminin ve ortak muhasebenin profillerini gösterir. Avukat Wei Tseng (曾雋崴) Tayvan’da meslek yürütmeye yetkilidir ve büronun yönetici avukatıdır; Kore, Japonya ve diğer uluslararası müvekkillerle çalışır. Büro bir sonuç vaat etmez. Görüşme İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/about', '/tr/contact'],
    },
    pricing: {
      answer:
        'Bu sayfa fiyat listesi yayımlamaz. Çalışma kapsamı önce gönderdiğiniz özete göre belirlenir, sonra tutar ve hesaplanma biçimi işe başlamadan önce sizinle doğrulanır. Avukatla görüşme ücretli bir hizmet olabilir; ücretin yanında mahkeme veya idare giderleri doğabilir. Görüşme İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/contact', '/tr/faq'],
    },
    contact: {
      answer:
        'Özetinizi iletişim formu üzerinden gönderin: ne olduğu, ne yardıma gereksinim duyduğunuz, işin Tayvan ile ilişkisi ve varsa süre. Bu ilk aşamada kimlik belgesi veya tüm kanıtları göndermeniz gerekmez. Büro yanıt süresi vaat etmez ve bu sayfa üzerinden randevu doğrulamaz. Görüşme İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/faq', '/tr/pricing'],
    },
    faq: {
      answer:
        'Bu bölüm sık sorulan soruları genel bilgi düzleminde yanıtlar: altı çalışma grubu, iletişimden önce hazırlık, ücretin belirlenme biçimi ve bir ileti göndermenin anlamı. Gönderilen talep bir avukatın incelemesini bekler; hukuki görüş değildir, randevu değildir ve avukat ile müvekkil arasında ilişki kurmaz. Görüşme İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/contact', '/tr/services'],
    },
  },
};
