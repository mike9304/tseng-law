# C7 fix1 notes — taiwan-vat-foreign-digital-services-registration

작성: 2026-10-06. 대상: drafts/C7/{ko,ja,en,zh-hant}.md. 반영한 피드백: reviews/C7/voice-grok.md (ko 7건, ja 4건, en 7건, zh-hant 지적 없음). lint는 수정 전에도 네 파일 모두 OK였고 수정 후에도 OK다(맨 아래 출력).

법적 사실·숫자·조건·인용·링크는 바꾸지 않았다. 문장을 고친 곳의 근거 조문은 오늘 다시 열어 문구를 대조했다.
- 跨境電子勞務交易課徵營業稅規範 第2點(一)2, 第2點(二)1, 第5點(三) — https://law-out.mof.gov.tw/LawContent.aspx?id=GL010236 (修正日期 民國114年4月7日)
- 稅籍登記規則 第14條 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340087&flno=14
- 재정부 세무포털 영문 페이지의 공지 "shall issue cloud invoices by January 1st, 2020 at the latest" — https://www.etax.nat.gov.tw/etwmain/en/cbec-tax-area/business-tax
- 영업세법 第45條·第51條, 施行細則 第38-3條 — research/C7-statutes.md의 조문
확인은 WebFetch(페이지를 텍스트로 변환한 결과)로 했다. 글자 단위 원문 대조가 필요하면 위 URL을 직접 열어야 한다.

## ko

1. 「대만에 주소나 거소가 있는 개인이 기본이고, …경우가 포함됩니다.」
   → 수정. 「기본은 대만에 주소나 거소가 있는 개인입니다. 구매에 쓴 기기가 … 알 수 있는 경우도 포함됩니다.」 검수자 안 그대로. 주소·거소 원칙과 기기 설치, 국가번호 886, 청구지 주소·결제 계좌·IP·SIM 세 경우는 그대로다(規範 第2點(二)1).

2. 「(문11)」, 「문답 자료 문15」
   → 수정. 「(질문 11)」, 「문답 자료의 질문 15」. 번호와 연결 내용은 그대로다.

3. 「가령 서울의 게임 개발사가 … 받았다고 하겠습니다.」
   → 일부만 반영. 검수자 안(「…받았습니다.」)은 쓰지 않았다. 「가령」을 빼고 과거형 평서문으로 쓰면 실제 사건처럼 읽혀 brief-BATCH 하드 룰 7(가정 사례는 가령/Suppose 등으로 가정임이 드러나야 한다)에 어긋난다. 강의 말투라는 지적은 맞으므로 「~다고 하겠습니다」를 없애고 문단 순서를 바꿨다. 가격·매출액 규칙(제32조 제2항, 제16조)을 먼저 쓰고, 「가령 서울의 게임 개발사가 … 126만 대만달러를 받았다면, 매출액은 126만 ÷ 1.05 = 120만 대만달러, 매출세액은 120만 × 5% = 6만 대만달러입니다.」로 이었다. 서울의 게임 개발사, 자체 웹 상점, 대만 이용자, 1년, 영업세 포함 126만 대만달러, 산식, 등록 대상이라는 결론은 그대로다.

4. 「매입 증빙의 세액은 대만 개인 대상 전자서비스 판매에만 쓴 것이면 공제할 수 있습니다」
   → 수정. 「매입 증빙의 세액은, 그 매입분을 대만 개인 대상 전자서비스 판매에만 썼다면 공제할 수 있습니다」. 무엇을 판매에 썼는지를 「그 매입분」으로 밝혔다. 검수자 안의 「그 매입을 … 쓴 것이면」은 「매입을 쓰다」가 어색해 세무 문서에서 쓰는 「매입분」으로 바꿨다. 「증빙에 적힌」은 넣지 않았다(뜻이 같고 ko 본문이 상한 3,500자에 가깝다). 전용 사용 조건과 「공제할 수 있습니다」의 강도는 그대로다(施行細則 第38-3條, 規範 第5點(三)).

5. 「중구 국세국」(표와 참고 자료 두 곳)
   → 수정. 두 곳 모두 「중구국세국(中區國稅局)」. 기관, 날짜(2026년 7월 10일), 링크는 그대로다.

6. 「실물 이용 장소가 없는 서비스」
   → 수정. 「물리적인 이용 장소가 없는 서비스」. 검수자 안은 「물리적인 사용 장소」였는데, 서비스에는 「이용」이 더 자연스러워 「이용」을 남겼다. 원문은 「無實體使用地點」.

7. 「회차마다 다시 물릴 수 있습니다」
   → 수정하되 검수자 안과 다르게 썼다. 「그때마다 다시 물릴 수 있습니다」. 검수자 안 「횟수마다」는 한국어로 쓰지 않는 결합이다. 제45조의 「屆期仍未補辦者，得按次處罰」(기한이 지나도 등록하지 않을 때마다 다시 물릴 수 있음)와 재량(「수 있습니다」)은 그대로다.

검수 지적 밖에서 고친 것 한 곳: 비교표 마지막 행과 「## 앱 마켓 같은 플랫폼을 거쳐 팔 때」 사이에 빈 줄이 없어 한 줄 넣었다(ja·en과 같은 형식). 문구 변화 없음.

## ja

1. 「台湾に住所または居所がある個人が基本で、…」
   → 수정. 「基本となるのは、台湾に住所または居所がある個人です。購入に使った端末の…場合も含まれます。」 검수자 안 그대로.

2. 「…証明書類に、…認証または公証を受けて提出し」
   → 수정. 「…証明書類について、現地の政府機関、裁判所、台湾の在外公館などによる認証または公証を受けたうえで提出し、…」. 조사를 「について」로 고치고, 인증을 받은 뒤 제출하는 순서가 보이게 「受けたうえで」로 썼다. 인증·공증 주체, 번역문 요건, 다음 문장(일본어 서류에는 번역문 필요)은 그대로다(稅籍登記規則 第14條).

3. 「…税額は、台湾域内の個人向けの電子サービス販売だけに使ったものであれば控除できます」
   → 수정. 「…税額は、その仕入れを台湾域内の個人向けの電子サービス販売だけに使った場合に控除できます」. 「その仕入れを」는 검수자 안대로 넣었고, 「使ったものであれば」는 「もの」가 다시 세액을 가리키는 것처럼 읽혀 「使った場合に」로 바꿨다. 전용 사용 조건과 「控除できます」의 강도는 그대로다.

4. 「売上を少なく申告し、または申告から漏らした場合」
   → 수정. 「売上を少なく申告した場合や売上の申告漏れがあった場合」. 검수자 안의 「申告漏れ」를 쓰되 앞의 「場合」 나열과 문법이 맞도록 두 경우를 각각 「場合」로 받았다. 과소 신고와 신고 누락 두 경우, 추징, 누락 세액의 5배 이하, 영업 정지는 그대로다(第51條 第1項 第3款 「短報或漏報銷售額」).

## en

1. "video viewing, audio broadcasting"
   → 수정. "online video, audio broadcasts". 검수자 안의 "watching video online"은 명사 나열 속의 동명사구라 다시 걸려 "online video"로 썼다. 다섯 종류(온라인 게임, 광고, 영상, 음성 방송, 영화·드라마·음악 등 콘텐츠)는 그대로다(規範 第2點(一)2 「線上遊戲、廣告、視訊瀏覽、音頻廣播、資訊內容（如電影、電視劇、音樂等）」).

2. "payment bank account"
   → 수정. "the billing address, the bank account used for payment, the IP address or the SIM card". 검수자 안 그대로.

3. "states the rate for electronic services as 5%"
   → 수정. "says the rate for electronic services is 5%". 제10조의 5%~10% 범위, 행정원이 정한다는 점, 2025년 5월 14일 발표 링크는 그대로다.

4. "Suppose a studio in Austin sells …"
   → 일부만 반영. 검수자 안("A studio in Austin sells …")은 쓰지 않았다. 가정 표시를 지우면 brief-BATCH 하드 룰 7에 어긋난다. 틀 문장이라는 지적은 받아들여, 규칙 문장(Article 32 paragraph 2, Article 16)을 앞에 두고 사례를 가정법 한 문장으로 썼다: "So if a studio in Austin sold a subscription app from its own website and collected NT$1,260,000, tax included, from users in Taiwan over a year, its sales amount would be NT$1,260,000 ÷ 1.05 = NT$1,200,000 and its output tax NT$1,200,000 × 5% = NT$60,000. With sales above the NT$600,000 threshold, the studio would have to register." if + 과거형 + would로 가정임이 드러난다. 사실 관계와 산식은 그대로이고, 등록 의무는 "would have to register"로 강도를 유지했다.

5. "gives January 1, 2020 as the latest start date"
   → 수정하되 검수자 안과 다르게 썼다. "says sellers had to start by January 1, 2020". 검수자 안의 "the latest start date"는 "가장 최근의 시작일"로도 읽힌다. 세무포털 영문 공지 "shall issue cloud invoices by January 1st, 2020 at the latest"와 같은 뜻이다. 앞 절의 발행 의무(must issue)는 그대로다.

6. "Take a service with no physical place of use, … sold on a platform run by another foreign company."
   → 수정하되 검수자 안과 다르게 썼다. 앞 문장과 합쳤다: "Point 4 of the MOF directions turns on who collects the price from the buyer when a service with no physical place of use, such as a game or an app, is sold on a platform run by another foreign company." 검수자 안의 "That split applies to …"는 앞 문장에 "split"이라는 말이 없어 지시 대상이 흐리다. 뒤의 두 문장(판매자 직접 수령, 플랫폼 수령)은 그대로다.

7. "The choice between vehicles is covered in …"
   → 수정. "Subsidiaries and branches are compared in [Entering the Taiwan Market: Key Differences Between a Subsidiary and a Branch](/en/columns/taiwan-company-subsidiary-vs-branch)." 검수자 안과 같은 내용을 짧게 썼다(en 본문이 상한 1,600단어에 가깝다). 링크와 링크 제목은 그대로다.

## zh-hant

지적 없음(VOICE OK). 수정하지 않았다.

## 보존 확인

- frontmatter(키, slug, featured_image 경로, FAQ, summary): 네 파일 모두 손대지 않았다.
- 굵은 강조, 전화번호, 주소, 변호사 검토 표시, 당사자 이름: 없음. 연락처는 이메일 한 곳 그대로.
- 판결 인용 없음(research/judgments 비어 있음).

## lint (2026-10-06, 수정 후)

```
ko       OK  [length 3496 chars (no spaces/URLs)]   (수정 전 3483, 상한 3500)
ja       OK  [length 3999 chars (no spaces/URLs)]   (수정 전 3981)
en       OK  [length 1594 words]                    (수정 전 1586, 상한 1600)
zh-hant  OK  [length 2667 chars (no spaces/URLs)]   (변경 없음)
```

명령: `python3 /Users/son7/tseng-col-1006-work/lint.py /Users/son7/tseng-col-1006-work/drafts/C7/<lang>.md <lang> taiwan-vat-foreign-digital-services-registration`

## 남은 한계

- 문체 판단은 모델이 한 것이다. 원어민 검수나 변호사 검토를 거친 것이 아니다.
- ko는 3,496자, en은 1,594단어로 상한에 가깝다. 이후 문장을 늘리는 수정은 다른 곳을 줄여야 한다.
