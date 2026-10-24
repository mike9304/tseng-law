# 2026-10-24 KST 실제 공개된 Codex 칼럼 재확인

확인 범위는 KST 2026-10-24 00:00부터 2026-10-24 15:45:06 KST까지입니다. 원고의 `published` 날짜, 파일 수정 시각, 실제 공개 시각을 구분했습니다. 이 문서는 목록·공개 상태 조사이며 원고를 수정하거나 게시하지 않았습니다.

**오늘 공개된 Codex 칼럼은 87편입니다. 시장별 9언어 45편과 ARC·비자 14언어 42편입니다.** 포르투갈어는 694–698번 5편과 ARC 704–706번 3편, 총 8편입니다. 오늘 공개된 일본어 711–720번 10편은 작업 기록이 Claude Code 구현으로 명시한 별도 배치이며 이 87편에 넣지 않았습니다.

- 현재 GitHub main·공개 build-info: `d7e50c49a348d14302d09cea5868506cd1e684db`. 공개 조사 전후 커밋 동일, 마지막 원격 확인 2026-10-24 15:47:04 KST.
- 87/87 HTTP 200, 87/87 사이트맵 존재, 제목·canonical 모두 일치. 87/87 main 원고 SHA가 최초 공개 원고 manifest와 일치하며 실제 공개 본문과 출처 링크도 원본과 같습니다.
- 52편은 현재 기본 placeholder: ARC 42편 전부 + 독일어 679–683 + 스페인어 689–693. 나머지 시장 35편에는 대표 이미지가 있습니다. 실제 대표 이미지 URL은 22개이며 이미지 URL HEAD는 전부 HTTP 200입니다. 이미지의 시각적 적합성 평가는 이 조사에 포함하지 않았습니다.
- 시장 25편의 검수된 후속 문장 수정본은 여전히 미게시입니다. 최신 보관 tip `f4ed7150d6b204293f51d8443f2ae0a9957fc1c5`는 main의 조상이 아니며 수정 25편의 SHA가 현재 main과 다릅니다. 포르투갈어 수정 대상은 **697·698**입니다. ARC 42편의 이번 문체·이미지 재수정도 조사 시점에는 공개되지 않았습니다.
- 18개 시장 페이지는 ARC 게시 후 자동 추천 칼럼 영역만 바뀌었습니다. `<section data-recommended-for-you="column">`만 제외한 본문 HTML은 동일합니다. 나머지 69개는 추천을 포함한 기사 텍스트·링크까지 동일합니다. 이를 원문 개정으로 세지 않았습니다.

## 날짜와 배치 구분

| 배치 | 원고 published | 공개·배포 완료 근거(KST) | 편수 | 귀속 근거 |
|---|---|---|---:|---|
| 시장 659–703 | 2026-10-23 | Air 완료 10-24 02:21:01; 45편 본문 공개 확인 02:28:16 | 45 | Codex 브랜치·공통 브리프·인수 기록·45편 manifest와 공개 readback의 동일 경로·SHA |
| 국가별 목록 변경 | 해당 없음 | Air 완료 10-24 02:51:31; 목록 확인 03:01:52 | 신규 0 | `048d9c61`는 기존 45편 노출 구조 변경 |
| ARC 704–706 × 14언어 | 2026-10-24 | Sites 성공 11:59:13; Air 완료 11:59:52; 42편 공개 확인 12:04:08 | 42 | 해당 Codex 작업 BRIEF·publication-verification·공개 원고 SHA |
| 일본어 711–720 | 2026-10-24 | Air 완료 10-24 13:03:16; GOAL의 10편 실서버 검증 및 이번 HTTP 확인 | 10 | `tseng-ja-gap-20261024/GOAL.md`가 구현 Claude Code라고 명시 |
| 한국어 ISSUE-20261022-19 | 2026-10-22 | `d7e50c49` 공개 확인 15:39:41; Air 완료 15:39:55 | 이슈 1 | 칼럼이 아닌 이슈 게시판. 구현 도구 귀속은 이번 조사에서 미확정 |

Air 완료 시각은 배포 완료 영수증 시각이며 CDN의 정확한 전환 순간을 뜻하지 않습니다. 원고 `published: 2026-10-23`인 시장 45편도 실제 공개가 10월 24일이므로 오늘 범위에 포함했습니다. 707–710은 일본어 작업 GOAL에 의도적으로 비워 둔 번호로 기록돼 있습니다.

## 언어별 합계

| 언어 | 시장 | ARC | Codex 합계 | 현재 placeholder | 시장 미게시 문장 수정 |
|---|---:|---:|---:|---:|---:|
| ko | 0 | 3 | 3 | 3 | 0 |
| en | 0 | 3 | 3 | 3 | 0 |
| ja | 0 | 3 | 3 | 3 | 0 |
| vi | 0 | 3 | 3 | 3 | 0 |
| zh-hant | 0 | 3 | 3 | 3 | 0 |
| th | 5 | 3 | 8 | 3 | 4 |
| id | 5 | 3 | 8 | 3 | 1 |
| hi | 5 | 3 | 8 | 3 | 5 |
| fr | 5 | 3 | 8 | 3 | 2 |
| de | 5 | 3 | 8 | 8 | 3 |
| it | 5 | 3 | 8 | 3 | 4 |
| es | 5 | 3 | 8 | 8 | 4 |
| pt | 5 | 3 | 8 | 3 | 2 |
| ar | 5 | 3 | 8 | 3 | 0 |
| **합계** | **45** | **42** | **87** | **52** | **25** |

## 시장 칼럼 45편: 이번 요청의 추가 확인 대상

아래 45편은 모두 원고 날짜 2026-10-23, 최초 배포 완료 2026-10-24 02:21:01 KST입니다. 모든 URL은 이번 조사에서 HTTP 200·사이트맵 존재·원본 본문 보존을 확인했습니다. “이전 후속 수정 없음”은 과거 문장 검사에 따른 25편 수정 배치의 대상이 아니었다는 뜻이며 이번 사용자 문체 재검수를 통과했다는 뜻은 아닙니다.

| 언어 | 번호·공개 제목 | 현재 대표 이미지 | 문장 수정본 공개 여부 |
|---|---|---|---|
| th | 659 · [เงินเดือนในไต้หวันถูกหัก: คนงานไทยตรวจสลิปกับยอดรับจริงอย่างไร](https://tseng-law.com/th/columns/thai-worker-taiwan-payslip-deductions-unpaid-salary) | [대표 이미지](https://media.tseng-law.com/images/columns/air-20261011/536-inventory-loss-wage-prededuction-taiwan.webp) | 후속 문장 수정 미게시 |
| th | 660 · [โรงงานไต้หวันปิดแต่ยังค้างค่าจ้าง: คนงานไทยขอกองทุนสำรองจ่ายได้เมื่อไร](https://tseng-law.com/th/columns/thai-worker-taiwan-factory-closure-wage-fund) | [대표 이미지](https://media.tseng-law.com/images/blog/606-taiwan-unpaid-wages-insolvent-employer-payment-fund/featured-01.webp) | 후속 문장 수정 미게시 |
| th | 661 · [ให้คนอื่นใช้บัญชีไต้หวันแล้วตำรวจเรียก: คนไทยควรเตรียมข้อเท็จจริงอะไร](https://tseng-law.com/th/columns/thai-worker-taiwan-bank-account-police-notice) | [대표 이미지](https://media.tseng-law.com/images/blog/038-taiwan-bank-account-lending-fraud-money-laundering/featured-01.webp) | 이전 후속 수정 없음 |
| th | 662 · [บาดเจ็บจากรถชนในไต้หวันก่อนกลับไทย: เอกสารที่ต้องรับต่อหลังเดินทาง](https://tseng-law.com/th/columns/thai-return-home-taiwan-traffic-injury-records) | [대표 이미지](https://media.tseng-law.com/images/blog/003-taiwan-traffic-accident-procedure/featured-01.jpg) | 후속 문장 수정 미게시 |
| th | 663 · [ลูกค้าไต้หวันรับสินค้าแล้วแต่ไม่จ่าย: ผู้ส่งออกไทยเริ่มเรียกหนี้จากใคร](https://tseng-law.com/th/columns/thai-supplier-taiwan-buyer-unpaid-invoice) | [대표 이미지](https://media.tseng-law.com/images/blog/354-unpaid-invoices-taiwan-buyer-payment-order-attachment/featured-01.webp) | 후속 문장 수정 미게시 |
| id | 664 · [Gaji pengasuh di rumah majikan Taiwan belum dibayar: dasar tuntutan dan bukti](https://tseng-law.com/id/columns/indonesian-home-caregiver-unpaid-wages-taiwan) | [대표 이미지](https://media.tseng-law.com/images/blog/ISSUE-20261021-04-caregiver-transfer-consent/featured-01.webp) | 이전 후속 수정 없음 |
| id | 665 · [Paspor ditahan agen di Taiwan: pengembalian dokumen dan sengketa biaya](https://tseng-law.com/id/columns/indonesian-worker-passport-broker-dispute-taiwan) | [대표 이미지](https://media.tseng-law.com/images/columns/20261002/vi-passport-arc-return.webp) | 이전 후속 수정 없음 |
| id | 666 · [Tawaran kerja tarik tunai di Taiwan berujung panggilan polisi: bukti dan hak pemeriksaan](https://tseng-law.com/id/columns/indonesian-worker-bank-account-cash-job-police-taiwan) | [대표 이미지](https://media.tseng-law.com/images/blog/038-taiwan-bank-account-lending-fraud-money-laundering/featured-01.webp) | 이전 후속 수정 없음 |
| id | 667 · [Cedera saat bekerja di pabrik Taiwan: bukti untuk kompensasi dan asuransi](https://tseng-law.com/id/columns/indonesian-factory-worker-injury-evidence-compensation-taiwan) | [대표 이미지](https://media.tseng-law.com/images/blog/039-taiwan-migrant-worker-occupational-injury-compensation/featured-01.webp) | 이전 후속 수정 없음 |
| id | 668 · [Mesin dari Taiwan bermasalah di pabrik Indonesia: pemberitahuan cacat dan pilihan tuntutan](https://tseng-law.com/id/columns/indonesian-buyer-taiwan-machinery-defect-notice) | [대표 이미지](https://media.tseng-law.com/images/blog/gap-columns-20261010/506-taiwan-defective-shipment-inspection-notice.webp) | 후속 문장 수정 미게시 |
| hi | 669 · [भारतीय सप्लायर का ताइवान में बकाया बिल: भुगतान की माँग कब मुकदमे में बदलनी चाहिए](https://tseng-law.com/hi/columns/indian-supplier-unpaid-taiwan-invoice) | [대표 이미지](https://media.tseng-law.com/images/blog/518-recovering-unpaid-invoices-from-taiwan-customers/featured-01.webp) | 후속 문장 수정 미게시 |
| hi | 670 · [ताइवान से खरीदी मशीन टेस्ट में फेल: भारतीय खरीदार की पहली सूचना और दावे की तारीख](https://tseng-law.com/hi/columns/indian-buyer-taiwan-machinery-defect-notice) | [대표 이미지](https://media.tseng-law.com/images/blog/gap-columns-20261010/506-taiwan-defective-shipment-inspection-notice.webp) | 후속 문장 수정 미게시 |
| hi | 671 · [ताइवान छोड़ रहे भारतीय इंजीनियर का non-compete: अगली नौकरी पर रोक और उसका मुआवज़ा](https://tseng-law.com/hi/columns/indian-engineer-taiwan-noncompete-compensation) | [대표 이미지](https://media.tseng-law.com/images/columns/20261004/ja-noncompete-hero-1600x900.webp) | 후속 문장 수정 미게시 |
| hi | 672 · [भारत लौटने से पहले ताइवान के किराये की जमा राशि: चाबी सौंपना और कटौती का हिसाब](https://tseng-law.com/hi/columns/indian-resident-taiwan-rental-deposit-handover) | [대표 이미지](https://media.tseng-law.com/images/blog/065-taiwan-rental-deposit-foreign-tenant/featured-01.webp) | 후속 문장 수정 미게시 |
| hi | 673 · [ताइवानी सप्लायर का बैंक खाता बदलने वाला ईमेल: भारतीय आयातक का पैसा गया, बिल फिर भी बाकी?](https://tseng-law.com/hi/columns/indian-importer-taiwan-supplier-bank-change-fraud) | [대표 이미지](https://media.tseng-law.com/images/columns/fraud-20261003/taiwan-supplier-bank-account-change-bec.png) | 후속 문장 수정 미게시 |
| fr | 674 · [Distributeur taïwanais : factures impayées, avoirs et retours de marchandises](https://tseng-law.com/fr/columns/france-exporter-taiwan-unpaid-invoices-credit-notes-returns) | [대표 이미지](https://media.tseng-law.com/images/blog/354-unpaid-invoices-taiwan-buyer-payment-order-attachment/featured-01.webp) | 후속 문장 수정 미게시 |
| fr | 675 · [Marque française déposée par le distributeur à Taïwan : les dates et preuves à réunir](https://tseng-law.com/fr/columns/french-brand-taiwan-trademark-registered-distributor) | [대표 이미지](https://media.tseng-law.com/images/blog/265-taiwan-distributor-registered-japanese-brand-trademark/featured-01.webp) | 이전 후속 수정 없음 |
| fr | 676 · [Fin d'une distribution à Taïwan : le sort du stock et des comptes de vente en ligne](https://tseng-law.com/fr/columns/french-supplier-taiwan-distributor-termination-stock-online-accounts) | [대표 이미지](https://media.tseng-law.com/images/blog/353-terminating-taiwan-distributor-us-exporter/featured-01.webp) | 이전 후속 수정 없음 |
| fr | 677 · [Hériter à Taïwan depuis la France : documents bancaires, procuration et bien immobilier](https://tseng-law.com/fr/columns/france-resident-heir-taiwan-bank-property-documents) | [대표 이미지](https://media.tseng-law.com/images/columns/20261003/us-inheritance-document-preparation-1600x900.webp) | 이전 후속 수정 없음 |
| fr | 678 · [Salarié français à Taïwan : salaires impayés quand l'employeur ferme](https://tseng-law.com/fr/columns/french-employee-taiwan-unpaid-wages-employer-closure) | [대표 이미지](https://media.tseng-law.com/images/blog/606-taiwan-unpaid-wages-insolvent-employer-payment-fund/featured-01.webp) | 후속 문장 수정 미게시 |
| de | 679 · [Maschine nach Taiwan geliefert, Schlussrate offen: Was FAT und SAT belegen](https://tseng-law.com/de/columns/taiwan-maschinenlieferung-fat-sat-schlusszahlung) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| de | 680 · [Fehlerhafte Bauteile aus Taiwan: Mängelanzeige vor dem endgültigen Prüfbericht](https://tseng-law.com/de/columns/taiwan-bauteile-maengelruege-pruefmuster) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 이전 후속 수정 없음 |
| de | 681 · [Werkzeuge beim Taiwan-Lieferanten: Herausgabe vor dem Produktionswechsel klären](https://tseng-law.com/de/columns/taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| de | 682 · [Gemeinsame Entwicklung in Taiwan: Wer darf CAD-Daten weitergeben und weiterverwenden?](https://tseng-law.com/de/columns/taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 이전 후속 수정 없음 |
| de | 683 · [Deutsches Urteil, Vermögen in Taiwan: Anerkennung und Vollstreckung vorbereiten](https://tseng-law.com/de/columns/deutsches-urteil-vermoegen-taiwan-vollstreckung) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| it | 684 · [Fatture insolute e collaudo contestato: il saldo dell’esportatore italiano a Taiwan](https://tseng-law.com/it/columns/italian-exporter-taiwan-unpaid-installation-balance) | [대표 이미지](https://media.tseng-law.com/images/blog/354-unpaid-invoices-taiwan-buyer-payment-order-attachment/featured-01.webp) | 이전 후속 수정 없음 |
| it | 685 · [Marchio italiano intestato al distributore di Taiwan: opposizione, prove e trasferimento](https://tseng-law.com/it/columns/italian-brand-taiwan-distributor-trademark-registration) | [대표 이미지](https://media.tseng-law.com/images/blog/265-taiwan-distributor-registered-japanese-brand-trademark/featured-01.webp) | 후속 문장 수정 미게시 |
| it | 686 · [Stampi e disegni commissionati a Taiwan: che cosa può ricevere il nuovo produttore](https://tseng-law.com/it/columns/taiwan-oem-molds-design-files-handover) | [대표 이미지](https://media.tseng-law.com/images/blog/gap-columns-20261010/505-taiwan-supplier-return-molds-test-fixtures.webp) | 후속 문장 수정 미게시 |
| it | 687 · [Erede residente in Italia e debiti a Taiwan: quando opera la rinuncia entro tre mesi](https://tseng-law.com/it/columns/italy-resident-heir-taiwan-inheritance-renunciation-debts) | [대표 이미지](https://media.tseng-law.com/images/columns/20261003/us-inheritance-document-preparation-1600x900.webp) | 후속 문장 수정 미게시 |
| it | 688 · [Convocazione a Taiwan durante una trasferta: testimone, indagato e interprete](https://tseng-law.com/it/columns/italian-business-visitor-taiwan-summons-interpreter-defense) | [대표 이미지](https://media.tseng-law.com/images/blog/033-taiwan-police-questioning-foreigner-rights/featured-01.webp) | 후속 문장 수정 미게시 |
| es | 689 · [Facturas impagadas de un cliente taiwanés: decisiones para una exportadora española](https://tseng-law.com/es/columns/spain-exporter-taiwan-unpaid-invoices) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| es | 690 · [Mercancía taiwanesa defectuosa en un almacén español: el aviso al vendedor no puede esperar al informe](https://tseng-law.com/es/columns/spain-buyer-taiwan-defective-goods-notice) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 이전 후속 수정 없음 |
| es | 691 · [Una sentencia española y bienes en Taiwán: el paso judicial que falta para cobrar](https://tseng-law.com/es/columns/spanish-judgment-taiwan-assets-enforcement) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| es | 692 · [Regresar a España con salarios pendientes en Taiwán: nóminas, jornada y reclamación](https://tseng-law.com/es/columns/return-spain-unpaid-taiwan-wages) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| es | 693 · [Separación desde España y patrimonio en Taiwán: el divorcio y los bienes requieren preguntas distintas](https://tseng-law.com/es/columns/spain-resident-taiwan-divorce-property) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 후속 문장 수정 미게시 |
| pt | 694 · [Cliente em Taiwan pede prestações: quando se extingue o crédito do exportador português?](https://tseng-law.com/pt/columns/portugal-exportador-acordo-prestacoes-taiwan) | [대표 이미지](https://media.tseng-law.com/images/columns/editorial-20261003-b04/taiwan-unpaid-invoice-settlement-release-korean.png) | 이전 후속 수정 없음 |
| pt | 695 · [O fornecedor de Taiwan mudou a conta por email: a fatura ficou paga?](https://tseng-law.com/pt/columns/portugal-fornecedor-taiwan-alteracao-conta-fraude) | [대표 이미지](https://media.tseng-law.com/images/columns/fraud-20261003/taiwan-supplier-bank-account-change-bec.png) | 이전 후속 수정 없음 |
| pt | 696 · [Sentença arbitral obtida no estrangeiro: como chegar aos bens do devedor em Taiwan](https://tseng-law.com/pt/columns/portugal-sentenca-arbitral-bens-taiwan) | [대표 이미지](https://media.tseng-law.com/images/blog/351-enforcing-us-arbitral-award-in-taiwan/featured-01.webp) | 이전 후속 수정 없음 |
| pt | 697 · [Constituir mandatário em Taiwan a partir de Portugal: poderes, notificações e documentos](https://tseng-law.com/pt/columns/portugal-mandatario-processo-civil-taiwan) | [대표 이미지](https://media.tseng-law.com/images/blog/251-taiwan-small-claims-simplified-civil-procedure/featured-01.webp) | 후속 문장 수정 미게시 |
| pt | 698 · [O contrato em Taiwan terminou e ficou salário por pagar: prova, rubricas e prazos](https://tseng-law.com/pt/columns/portugal-fim-contrato-taiwan-salarios-em-falta) | [대표 이미지](https://media.tseng-law.com/images/blog/606-taiwan-unpaid-wages-insolvent-employer-payment-fund/featured-01.webp) | 후속 문장 수정 미게시 |
| ar | 699 · [دفعة مقدمة لمورّد في تايوان بلا تسليم: مطالبة المستورد في الإمارات باستردادها](https://tseng-law.com/ar/columns/uae-importer-taiwan-supplier-advance-refund) | [대표 이미지](https://media.tseng-law.com/images/blog/354-unpaid-invoices-taiwan-buyer-payment-order-attachment/featured-01.webp) | 이전 후속 수정 없음 |
| ar | 700 · [حكم تحكيم صادر في السعودية وأصول المدين في تايوان: ملف الاعتراف والتنفيذ](https://tseng-law.com/ar/columns/saudi-arbitral-award-taiwan-assets) | [대표 이미지](https://media.tseng-law.com/images/blog/351-enforcing-us-arbitral-award-in-taiwan/featured-01.webp) | 이전 후속 수정 없음 |
| ar | 701 · [حكم مدني من الإمارات وأموال للمدين في تايوان: متى يُسمح بالتنفيذ؟](https://tseng-law.com/ar/columns/uae-court-judgment-taiwan-enforcement) | [대표 이미지](https://media.tseng-law.com/images/blog/351-enforcing-us-arbitral-award-in-taiwan/featured-01.webp) | 이전 후속 수정 없음 |
| ar | 702 · [وريث يقيم خارج تايوان: جنسية المتوفى ووثائق التركة قبل توزيع الأموال](https://tseng-law.com/ar/columns/overseas-heir-taiwan-estate-nationality-documents) | [대표 이미지](https://media.tseng-law.com/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp) | 이전 후속 수정 없음 |
| ar | 703 · [توكيل محامٍ في تايوان من الإمارات: حدود الوكالة وترجمة المستندات العربية](https://tseng-law.com/ar/columns/uae-resident-taiwan-counsel-arabic-documents) | [대표 이미지](https://media.tseng-law.com/images/blog/354-unpaid-invoices-taiwan-buyer-payment-order-attachment/featured-01.webp) | 이전 후속 수정 없음 |

## ARC·비자 42편: 기존 진행 범위

아래 42편은 원고 날짜 2026-10-24, 최초 Air 배포 완료 11:59:52 KST입니다. 조사 시점에는 모두 원본 본문과 placeholder가 공개돼 있습니다. 현재 별도 원고·이미지 수정 작업이 진행 중인 사실과 실제 게시 상태를 분리했습니다.

| 언어 | 번호·공개 제목 | 현재 대표 이미지 | 이번 수정본 |
|---|---|---|---|
| ko | 704 · [대만 첫 ARC 신청: 입국 후 기한, 준비 서류와 접수처](https://tseng-law.com/ko/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ko | 705 · [대만 취업·유학·가족 체류, 입국 전에 정할 비자 경로](https://tseng-law.com/ko/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ko | 706 · [ARC 만료 전 이사·이직·여권 변경이 생겼을 때](https://tseng-law.com/ko/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| en | 704 · [Your First Taiwan ARC: When to Apply, What to Submit and How to Collect It](https://tseng-law.com/en/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| en | 705 · [Moving to Taiwan for Work, Study or Family: Which Residence Route Fits?](https://tseng-law.com/en/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| en | 706 · [Keeping Your Taiwan ARC Current: Renewal, Address Changes and Re-entry](https://tseng-law.com/en/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ja | 704 · [台湾で初めてARCを申請するには：期限・必要書類・オンライン申請先](https://tseng-law.com/ja/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ja | 705 · [台湾へ就職・留学・家族帯同で渡航する前に：ビザと居留の経路を選ぶ](https://tseng-law.com/ja/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ja | 706 · [台湾ARCの更新・住所変更・転職と再入国：満了日以外に進む手続](https://tseng-law.com/ja/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| vi | 704 · [Xin thẻ ARC lần đầu ở Đài Loan: mốc 30 ngày và hồ sơ theo từng diện](https://tseng-law.com/vi/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| vi | 705 · [Sang Đài Loan làm việc, học hay đoàn tụ: chọn đường xin cư trú trước khi đi](https://tseng-law.com/vi/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| vi | 706 · [ARC còn hạn nhưng đã đổi việc, chuyển nhà hoặc sắp về nước](https://tseng-law.com/vi/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| zh-hant | 704 · [第一次申請外僑居留證：30日從哪天起算，文件交到哪裡](https://tseng-law.com/zh-hant/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| zh-hant | 705 · [來台工作、讀書或依親：入境前如何選擇簽證與居留路徑](https://tseng-law.com/zh-hant/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| zh-hant | 706 · [居留證還沒到期，卻已搬家或離職：ARC延期、異動與再入境](https://tseng-law.com/zh-hant/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| th | 704 · [ขอ ARC ไต้หวันครั้งแรก: วันเริ่มนับกำหนด เอกสาร และช่องทางยื่น](https://tseng-law.com/th/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| th | 705 · [ไปทำงาน เรียน หรืออยู่กับครอบครัวในไต้หวัน: เลือกวีซ่าก่อนเดินทาง](https://tseng-law.com/th/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| th | 706 · [ARC ไต้หวันยังไม่หมดอายุ แต่ย้ายบ้าน เปลี่ยนงาน หรือจะเดินทางกลับไทย](https://tseng-law.com/th/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| id | 704 · [ARC pertama di Taiwan: tenggat, berkas, dan tempat pengajuan](https://tseng-law.com/id/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| id | 705 · [Visa Taiwan untuk kerja, kuliah, kursus Mandarin, dan keluarga](https://tseng-law.com/id/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| id | 706 · [ARC Taiwan: perpanjangan, pindah kerja, perubahan alamat, dan pulang sementara](https://tseng-law.com/id/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| hi | 704 · [ताइवान में पहला ARC: आवेदन की तारीख, दस्तावेज़ और कार्ड प्राप्त करना](https://tseng-law.com/hi/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| hi | 705 · [ताइवान में नौकरी, पढ़ाई या परिवार के साथ रहने के लिए कौन-सा वीज़ा मार्ग है?](https://tseng-law.com/hi/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| hi | 706 · [ARC की अवधि बढ़ाना और नौकरी, पता या पासपोर्ट बदलने की सूचना देना](https://tseng-law.com/hi/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| fr | 704 · [Première demande d’ARC à Taïwan : délai, dossier et dépôt](https://tseng-law.com/fr/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| fr | 705 · [Études, travail ou famille à Taïwan : choisir son parcours de séjour](https://tseng-law.com/fr/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| fr | 706 · [ARC à Taïwan : renouvellement, changement de situation et retour de voyage](https://tseng-law.com/fr/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| de | 704 · [Die erste ARC in Taiwan: Antrag, Unterlagen und Abholung](https://tseng-law.com/de/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| de | 705 · [Arbeit, Studium oder Familie in Taiwan: Welcher Aufenthaltsweg passt?](https://tseng-law.com/de/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| de | 706 · [ARC verlängern: neue Arbeit, andere Adresse und Reisen aus Taiwan](https://tseng-law.com/de/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| it | 704 · [Primo ARC a Taiwan: domanda, documenti e ritiro](https://tseng-law.com/it/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| it | 705 · [Studiare, lavorare o raggiungere la famiglia a Taiwan: quale percorso di soggiorno](https://tseng-law.com/it/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| it | 706 · [Rinnovare l’ARC a Taiwan: studio, lavoro, nuovi dati e reingresso](https://tseng-law.com/it/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| es | 704 · [Primera solicitud de ARC en Taiwán: plazo, documentos y presentación](https://tseng-law.com/es/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| es | 705 · [Vivir en Taiwán por trabajo, estudios o familia: qué vía de residencia corresponde](https://tseng-law.com/es/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| es | 706 · [Renovar el ARC en Taiwán: domicilio, empleo, pasaporte y regreso después de viajar](https://tseng-law.com/es/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| pt | 704 · [Primeiro ARC em Taiwan: prazo, documentos e apresentação do pedido](https://tseng-law.com/pt/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| pt | 705 · [Trabalhar, estudar ou reunir a família em Taiwan: escolher o percurso de residência](https://tseng-law.com/pt/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| pt | 706 · [ARC em Taiwan: renovação, mudança de morada ou emprego e reentrada](https://tseng-law.com/pt/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ar | 704 · [طلب بطاقة ARC لأول مرة في تايوان: الموعد والوثائق وجهة التقديم](https://tseng-law.com/ar/columns/taiwan-arc-first-application) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ar | 705 · [العمل أو الدراسة أو الالتحاق بالأسرة في تايوان: اختيار مسار التأشيرة والإقامة](https://tseng-law.com/ar/columns/taiwan-visa-residence-work-study-family) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |
| ar | 706 · [تجديد ARC في تايوان عند تغيير العنوان أو العمل أو جواز السفر](https://tseng-law.com/ar/columns/taiwan-arc-renewal-changes-reentry) | [기본 placeholder](https://media.tseng-law.com/images/placeholder-article-hero.jpg) | 미게시 |

## 같은 날 공개됐으나 Codex 칼럼 범위에서 제외한 글

일본어 10편은 각각 HTTP 200·사이트맵 등록·대표 이미지 URL HTTP 200을 확인했습니다. Git 저자 이름이나 `author: legal-ai-assistant`만으로 구현 도구를 판단하지 않았습니다.

| 구분 | 번호·공개 제목 | 대표 이미지 | 귀속 |
|---|---|---|---|
| 일본어 칼럼 | 711 · [日本の飲食・小売チェーンが台湾で加盟店を募るとき：10日前の情報開示と価格の指定](https://tseng-law.com/ja/columns/taiwan-franchise-disclosure-japanese-restaurant-retail-chains) | [대표 이미지](https://media.tseng-law.com/images/blog/711-taiwan-franchise-disclosure-japanese-restaurant-retail-chains/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 712 · [台湾企業との合弁会社で株式の譲渡を縛るには、会社の形から選ぶ](https://tseng-law.com/ja/columns/taiwan-joint-venture-shareholders-agreement-deadlock-japanese) | [대표 이미지](https://media.tseng-law.com/images/blog/712-taiwan-joint-venture-shareholders-agreement-deadlock-japanese/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 713 · [日本の仲裁判断で台湾の財産を差し押さえるには、まず台湾の裁判所の承認が要る](https://tseng-law.com/ja/columns/japan-arbitral-award-recognition-enforcement-taiwan) | [대표 이미지](https://media.tseng-law.com/images/blog/713-japan-arbitral-award-recognition-enforcement-taiwan/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 714 · [台湾の政府調達に日本企業が入札するとき、協定の適用は招標公告で確かめる](https://tseng-law.com/ja/columns/taiwan-government-procurement-japanese-companies-gpa-bid) | [대표 이미지](https://media.tseng-law.com/images/blog/714-taiwan-government-procurement-japanese-companies-gpa-bid/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 715 · [業界団体の会合で値上げの話が出たら：台湾公平会のカルテル調査と寛恕政策](https://tseng-law.com/ja/columns/taiwan-cartel-investigation-fines-leniency-japanese-subsidiaries) | [대표 이미지](https://media.tseng-law.com/images/blog/715-taiwan-cartel-investigation-fines-leniency-japanese-subsidiaries/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 716 · [日系企業の残業代と台湾の「責任制」：課長職でも残業代が生じるとき](https://tseng-law.com/ja/columns/taiwan-overtime-pay-responsibility-system-japanese-managers) | [대표 이미지](https://media.tseng-law.com/images/blog/716-taiwan-overtime-pay-responsibility-system-japanese-managers/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 717 · [台湾子会社の輸出と出口實體管理名單：日本向けには許可免除の規定もある](https://tseng-law.com/ja/columns/taiwan-shtc-export-control-entity-list-japanese-subsidiaries) | [대표 이미지](https://media.tseng-law.com/images/blog/717-taiwan-shtc-export-control-entity-list-japanese-subsidiaries/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 718 · [台湾の取引先が重整・破産に入ったら、売掛金の申報期限は重整で最短10日、破産で最短15日](https://tseng-law.com/ja/columns/taiwan-customer-reorganization-bankruptcy-japanese-supplier-claims) | [대표 이미지](https://media.tseng-law.com/images/blog/718-taiwan-customer-reorganization-bankruptcy-japanese-supplier-claims/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 719 · [台湾の取引先から本票を受け取るとき：本票裁定で訴訟なしに執行できる範囲](https://tseng-law.com/ja/columns/taiwan-promissory-note-security-court-ruling-enforcement-japanese) | [대표 이미지](https://media.tseng-law.com/images/blog/719-taiwan-promissory-note-security-court-ruling-enforcement-japanese/featured-01.webp) | Claude Code 명시 |
| 일본어 칼럼 | 720 · [日本のサプリメントを台湾で売るときの広告規制：機能性表示の訳し方と「健康食品」の許可](https://tseng-law.com/ja/columns/taiwan-supplement-health-food-advertising-rules-japanese-brands) | [대표 이미지](https://media.tseng-law.com/images/blog/720-taiwan-supplement-health-food-advertising-rules-japanese-brands/featured-01.webp) | Claude Code 명시 |
| 한국어 이슈 | ISSUE-20261022-19 · [대만 지룽 불법촬영 수사, 귀국한 피해자의 고소 기한과 대리 고소](https://tseng-law.com/ko/columns/issues/taiwan-keelung-hidden-camera-complaint-from-korea) | 원고 featured_image 있음; 이슈용 hero 추출은 범위 밖 | 구현 도구 미확정; 칼럼 아님 |

## 조사 방법·증거·제한

- 10월 23일 이전 배포 `55fca2c9`부터 현재 main `d7e50c49`까지 `git diff --name-status … -- src/content` 결과는 신규 98경로: 칼럼 97개(87 Codex + 10 Claude), 이슈 1개입니다. 이 구간에 다른 신규 칼럼은 없습니다. 당시 커밋·Air 로그 및 이후 공개 readback을 함께 대조했습니다.
- [기계 판독 목록](today-publication-inventory.json)에 98개 글의 실제 URL, 원고 날짜, 배포 완료 시각, main SHA, 기존 공개 snapshot 경로, HTTP 확인 시각·HTML SHA, 본문 비교, 이미지 URL·HEAD 결과, 범위 구분을 기록했습니다. 이미지 포함 여부는 현재 HTML의 `img.blog-hero-img`로 판정했습니다.
- [시장 최초 공개 검증](/Users/son7/tseng-market-columns-20261023/work/checks/public-original-20261024/readback.json), [시장 후속 통합본 상태](/Users/son7/tseng-market-columns-20261023/work/terminal-handoff/RELEASE-F4ED-READY.md), [Codex 인수 증거](/Users/son7/tseng-market-columns-20261023/work/terminal-handoff/AGENT-ACK.md), [ARC 게시 증거](/Users/son7/tseng-arc-visas-20261024/outputs/publication-verification.json), [일본어 배치 귀속](/Users/son7/tseng-ja-gap-20261024/GOAL.md)를 근거로 삼았습니다.
- 시장 `LATEST.md`·`BLOCKED-STYLE-REPAIR`는 이전 시점 기록입니다. 이후 사용자 화면 확인 생략 승인 및 `f4ed7150` 준비가 있었으나 실제 main과 공개 본문에 수정이 없음을 이번 조사에서 직접 확인했습니다. 과거 브라우저 접근 제한을 현재 게시 불가 사유로 재사용하지 않았습니다.
- 이전 시장 RESULT의 “재사용 이미지 23개”는 현재 공개 결과와 맞지 않습니다. 실제 35편에 쓰인 URL은 22개입니다. source의 상대·절대 경로 별칭을 별개 이미지로 세지 않았습니다.
- web 도구로 포르투갈어 2개 URL을 열 때 접근 오류가 있었으나, 일반 TLS 검증을 유지한 curl 직접 요청은 성공했습니다. 새 DoH 결과를 명령별 `--resolve`에만 썼으며 시스템 DNS·Git 설정을 바꾸지 않았습니다. 브라우저 화면·모바일·RTL·이미지 내용의 시각적 적합성은 검사하지 않았습니다.
- 이 목록은 2026-10-24 15:45:06 KST까지의 snapshot입니다. 이후 다른 작업의 게시·수정은 반영하지 않습니다. 원고·코드·외부 게시·시장 작업의 LATEST 문서는 변경하지 않았습니다.
