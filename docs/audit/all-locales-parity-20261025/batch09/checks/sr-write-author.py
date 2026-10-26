from pathlib import Path
from datetime import datetime, timezone
import hashlib, json
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
C=B/'checks'; R=B/'reviews'; R.mkdir(exist_ok=True)
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(n): return json.loads((C/n).read_text())
def save(p,d):
 assert not p.exists(), f'Preserve existing evidence: {p}'
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
now=datetime.now(timezone.utc).isoformat()
proof=load('sr-final-proof.json'); edits=load('sr-self-edits.json'); meta=load('sr-metadata-render.json'); inputs=load('sr-inputs.json')
# Preserve the original generated evidence; repair its misleading field name in a new, explicit current view.
current=json.loads(json.dumps(proof))
for row in current['rows']:
 row['initial_model_read_count']=row.pop('initial_human_read_count')
current['field_name_correction']={'original':'sr-final-proof.json','original_sha256':sha(C/'sr-final-proof.json'),'old_field':'initial_human_read_count','new_field':'initial_model_read_count','meaning':'The reader was this model, not a human. Counts and all arrays are unchanged. This is a label correction, not a fresh CLI run.'}
save(C/'sr-final-proof-current.json',current)
rows=current['rows']
for row in rows:
 assert sha(row['file'])==row['sha256']
 assert row['source_render_arrays_and_lengths_identical'] and row['inverse_exact']
 assert row['frontmatter_FAQ_unchanged'] and row['URL_sequence_and_numeric_tokens_unchanged']
 assert all(sum(s['units']>=32 for s in p['sentences'])<=1 for p in row['source_paragraphs'])
assert proof['current_all_files_FAIL0'] and meta['errors']==[]
input_state=[{**x,'current_sha256':sha(x['path']),'same':sha(x['path'])==x['sha256']} for x in inputs['inputs']]
assert all(x['same'] for x in input_state), 'Record input drift before freezing'
helper=Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs')
assert sha(helper)=='3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b'
paragraphs=[
'# SR 915·916·918–921 저자 기록 — 2026-10-26',
'\n모델 직접 집필 및 자체 의미·문체 검수 기록이다. 현재 6편은 파일별 shared `--lang sr` FAIL 0, 선택 구조 검사 오류 0이며, FAQ 17개와 실제 ReactMarkdown 표시문단의 238개 문장 배열을 대조했다. 사람 원어민·변호사 검수나 공개 배포 완료를 뜻하지 않는다. 독립 검수에 넘기는 시점의 동결 기록이며 미해결 자체 필수 지적은 0건이다.',
'\n## 범위와 입력',
'\n소유 범위는 batch09의 columns-sr 6편, reviews/sr-author*, checks/sr-*다. R·공유 도구·다른 작업자의 원고와 기록은 수정하지 않았다. 커밋·게시·push·공개 상태 재조회는 하지 않았다. Serbian은 최근 SR704–706과 맞춘 라틴문자·에카비아식 문장으로 작성했다. 독자의 국적을 단정하거나 대만법을 세르비아법으로 바꾸지 않았다.',
'\nB9/B8/B7 BRIEF, R AGENTS, 최근 SR704·705·706 전문과 17:05 LESSONS 전문을 이번 단계에서 읽었다. B6 정본 EN915/916·ZH918/919/920/921, facts·source-register·source-freeze·contract 및 문체 규칙은 연속 작업에서 이미 전문을 읽은 동일 SHA를 재사용했다. 27개 입력의 경로·읽기 범위·SHA는 `checks/sr-inputs.json`에 있고 동결 직전 모두 같은 SHA임을 확인했다. 홈 공통문체 경로는 존재하지 않아 프로젝트 정본과 COLUMN-VOICE-RULE을 적용했다. 최신 LESSONS SHA는 `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`이다. 이전 배치의 역사적 읽기 기록을 덮어쓰지 않았다.',
'\n이번 SR 집필에서 새 공식 웹 조회는 하지 않았다. 동결된 공식 응답 및 정본의 확인일·출처 범위를 재사용했고, 전체 416쪽 판례집을 새로 읽었다고 주장하지 않는다. 원본 6개 이미지의 실제 장면 확인은 연속 B6 작업의 동일 이미지 바이트를 재사용했다. 이 단계에서는 경로·바이트 SHA 및 alt의 장면 대응을 확인했다.',
'\n## 원고와 실제 검사',
'\n| ID | 문장 | CV | 짧은 문장 비율 / 수 | 최대 같은 문단 시작 | 같은 문장 시작 연속 | 본문 질문 | 실제 근거 |\n|---|---:|---:|---:|---:|---:|---:|---|'
]
for row in rows:
 m=row['metrics']; aid=Path(row['file']).name[:3]; short=sum(n<=8 for n in row['lengths'])
 basis='수정 5편 CLI exit 0' if aid!='921' else '최초 CLI 내 해당 파일 OK; 배치 exit 1'
 paragraphs.append(f"| {aid} | {m['sentences']} | {m['len_cv']:.3f} | {m['short_share']:.3f} / {short} | {m['top_opener_n']} | {m['consec_same_start']} | {m['questions']} | {basis} |")
paragraphs += [
'\n최초 6편 CLI는 exit 1이었다. 918의 `top_opener_n=3`, 919의 `len_cv=.401`이 실제 실패였고 나머지 4편은 개별 OK였다. 최초 원고와 원로그는 그대로 보존했다. 이후 의미 명료화까지 포함하여 5편에 실제 7개 치환을 했고, 변경된 915·916·918·919·920만 다시 검사하여 exit 0을 받았다. 921은 최초와 현재 SHA가 같아 최초의 해당 파일 OK를 재사용했다. 921에 새 단독 exit 0이 있었다고 말하지 않는다. 실제 호출은 2회, 파일 측정은 11회다.',
'\n명령은 `PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <대상 파일들> --lang sr`였다. 단위는 `orthographic_words`, 경계 방식은 `unicode_punctuation_with_locale_abbreviations`다. SR을 다른 언어로 분류하거나 공백·정상 서수·법률 숫자를 점수 때문에 바꾸지 않았다. 도구·프로필·임계값은 변경하지 않았다. 초기/수정 로그에 정확한 명령, stdout, stderr, exit, 원고·도구 SHA와 실제 문장 배열이 있다.',
'\n| 도구 | SHA-256 |\n|---|---|'
]
for path,h in proof['same_tool_hashes'].items(): paragraphs.append(f'| `{Path(path).name}` | `{h}` |')
paragraphs += [
'\n구조 검사 `sr-content-audit-final.json`은 실제 선택 6편·오류 0, `semanticStatus=REVIEW_REQUIRED`, `publicationReady=false`다. 이 기계 상태를 임의로 법률 승인 또는 공개 준비 완료로 바꾸지 않았다. ZH4/EN2를 분리하고 `sr:<slug>` sourceMap과 숫자 접두사를 유지한 동결 정본 별칭을 썼다. 구조 도구의 32개 REQUIRED 항목 중 이 단계에서 읽은 원고·메타·FAQ·출처·이미지·문체 범위는 아래 표에 기록하고, 전체 앱 카드·JSON-LD·피드·브라우저·공개 실응답은 후속 통합 검증 범위로 남긴다.',
'\n`sr-metadata-render.json`의 실제 ReactMarkdown+remarkGfm 출력은 915와 921에 각각 의도한 표 1개, 모든 원고에서 의도하지 않은 ordered list 0개였다. 이 출력의 `<p>` 표시텍스트를 shared 추출 배열과 대조하여 현재 238개 문장 및 길이, 문단 순서가 정확히 일치했다. 최초 240개 문장은 직접 읽었고 실제 7개 치환의 결과 문장을 다시 읽었다. 919의 의미 관계가 있는 문장 두 쌍을 연결하면서 38→36개가 되어 전체 240→238개가 됐다. 날짜, 금액의 점, 85-1·22-2, 중국어 사건번호가 잘못된 경계로 끊기거나 빠지지 않았다.',
'\n원 `sr-final-proof.json`의 `initial_human_read_count`는 생성한 필드명의 오류다. 실제 독자는 모델이며 사람 검수가 없었다. 원 증거 SHA를 보존하고 `sr-final-proof-current.json`에서 이 키만 `initial_model_read_count`로 정정했다. 수·배열·판정은 동일하고 새 CLI를 실행한 것이 아니다. 후속 검수에는 current 파일을 기준으로 쓴다.',
'\n## 실제 문장 수정과 의미 보존'
]
for edit in edits['edits']:
 paragraphs += [f"\n### {edit['id']} · {edit['article']}", '\n수정 전:\n\n> '+edit['before'], '\n수정 후:\n\n> '+edit['after'], '\n이유: '+edit['reason']+'\n\n의미 보존: '+edit['meaning_preserved']]
paragraphs += [
'\nMONOTONY: 문단 시작 반복 — 918의 `U [rezultatima kontrole ugovora…]` — 소비자 당국을 주어로 세워 행위와 주체를 직접 연결했다. 같은 문단 시작 3→2로 닫았다.',
'\nMONOTONY: 중간 길이의 시간순서·조문 문장 반복 — 919 S05/S06의 세 문장 나열 — 실제 선후관계 및 동일 조문의 적용 범위를 연결하고 법원의 평가를 별도 결과문으로 유지했다. 919 CV .401→.476이며 사실을 삭제하거나 의미 없는 문장을 추가하지 않았다. 현재 자체 검토에서 미해결 MONOTONY 반려 사항은 없다.',
'\n`sr-self-edits.json`에는 각 치환의 상태 전후 SHA와 실제 diff가 있다. 현재 6편에서 치환을 역순으로 되돌리면 `sr-initial-manuscripts.json`의 원래 6편 바이트와 SHA가 모두 복원된다. 921은 그대로다. 전체 frontmatter·FAQ, URL 순서, 숫자 토큰은 6편 모두 초기값과 같다.',
'\n## 법률·독자 범위와 FAQ 직접 대조',
'\n| ID | 본문·제목·요약·FAQ에서 확인한 조건 |\n|---|---|',
'| 915 | 제85-1조의 공사 또는 기술용역, 바로 그 분쟁에 관한 권고 또는 제안, 발주기관의 불동의로 조정 실패라는 결합 조건을 유지했다. 별도 중재합의가 있을 수 있으며 장비구매·모든 공공계약에 자동 적용하지 않는다. 이 사건의 시공사 상고 기각·중재판정 취소 확정, 시간 연장과 돈 청구의 대상 차이, 하급심 법령 설명 정정과 결론 유지가 남아 있다. 미국 공급자의 대만 전력·망 조달 기회와 예정된 2026/2027 일정을 설명하며 개별 입찰 개방·자격·수주를 보장하지 않는다. FAQ 2개를 보존했다. |',
'| 916 | 현행 회사법154조의 법인격 남용→특정 채무 발생→현저히 상환 곤란→중대하여 주주 책임이 필요한 사정이라는 누적 조건을 보존했다. 외국 주주 지위·미지급 채무·오염 자체만으로 책임이 생긴다고 쓰지 않았다. 246명 관련 파기환송과 262명 관련 상고 기각을 원청구 전부 배척으로 바꾸지 않았고, 현행154조만으로 과거 모든 행위의 법적 근거를 설명하지 않았다. 미국·대만 투자 의향, 미국 민간 파트너, 적용법 조건을 유지했다. 미국 정책을 세르비아 국민의 혜택·자격으로 치환하지 않았다. FAQ의 화학물질 노출 대상은 명시했다. |',
'| 918 | 미완공 분양주택, 물·전기·승강기 및 보수 미완료, 2019년2월23일 편지, 8월 출입과 실제 인도 구별, 11월5일 대출금/11월28일 보증서 등 사건 순서를 보존했다. 사용허가증을 기산점으로 하는 계약4개월·현행6개월 통지의무, 구매자의 별도 의무를 구분한다. 시행사 항소와 추가청구 불인용 및 상소불가를 설명하며 절차 허가 거절로 바꾸지 않았다. 2025년 계약검사·2026년9월18일 중앙은행 자료를 2022년 판결에 소급하지 않았다. 분원은 지리적 `ogranak`으로 표기했다. |',
'| 919 | 공무원 해직과 동시 두 중대 징계 기록의 원처분·복심결정 취소, 상소가능, 실제 복직 미확인과 괴롭힘 부재 단정 금지를 보존했다. 사전 발표→상급기관→소속기관 순서, 진술기회·보고서 모순·사후 답변의 치유 불가를 구분했다. 민간 고용주의 2026년7월1일 신제도는 별도 근거이며22-2조 조사 또는 조율의 공정성, 조사 시 진술·방어·회피, 신고 접수 시 재발방지 조치·필요에 따른 상담/지원/보호·조사, 신고인이 원하면 조율 가능/불성립 시 조사 계속을 유지했다. 재발 자체가 없을 결과를 보장하는 의무로 쓰지 않았다. |',
'| 920 | 공용 벽·천장·전기함과 세대계량기의 사용 관계를 설명하며 계량기 소유권 판단을 추가하지 않았다. 법11조 소유자 회의, 규약15조 관리위원회 동의 및 전력공사 안전조건을 구별한다.6조1항5호 위반과 조정 후 불이행에 따른6조3항 법원청구 가능,1항4호 적용 여부의 법원 판단을 당사자 주장과 바꾸지 않았다. 전원차단·잠금·열쇠 주장만으로 결론이 바뀌지 않는다.2026년5월29일 공용전선로 보조금과9월30일 종료일은 모든 충전기 승인·현재 신청 가능으로 확대하지 않았다. 필요한 동의와 착공을 연결하고 후속 확정 여부는 미확인으로 남겼다. |',
'| 921 | 243,548대만달러는 청구액이며 지급액이 아니다. 남은 금화의 대인게임 칩 기능과 미사용 유료포인트를 구별하며 전량 소진으로 바꾸지 않았다. 해당 게임의 현금 전환 조건을 일반 게임 불법성으로 확대하지 않는다. 원고가 계약 종료를 선택한 사건을 모든 운영자 정지 조치의 적법성으로 바꾸지 않는다. 미사용 조건은 유료포인트와 게임요금 양쪽에 적용하며 계약종료부터30일 또는 쌍방합의의 다른 처리, 서비스 개시 후7일 서면 무이유·무비용 해지와 미사용포인트 반환, 기록 최소30일 보존·요청 후7일 제공을 보존했다. 운영자 자료만을 독점 증거로 삼지 않는 것이 자료 배제는 아니다.2023년 약관과2021년 사건,2025년 최초민원2위/건수감소와2026년5월7일 발표를 구별했다. |',
'\nFAQ 17개 전체를 정본 질문 취지와 답변 조건에 대조했다. 본문을 보완하는 답변에서 의무·가능·기간을 새로 만들거나 줄이지 않았다. 각 원고의 공식 URL은 915/916/918/919/920/921 순서로 4/3/4/4/4/4개가 본문과 출처 꼬리에 각각 존재한다. 동일 URL의 문서 간 중복을 제외하지 않은 편별 합계는23개다. source-register의 공식자료 범위와 알려진 확정/상소 범위를 유지했다.',
'\n## 메타·이미지·연락 경로',
'\n모든 원고의 published/lastmod는2026-10-26, 표시 날짜는 `26. oktobra 2026.`, audience는 `["sr"]`, 내부 author는 `legal-ai-assistant`다. topic은915/918/920/921 litigation,916 company,919 labor다. 공개 본문에 내부 작성자명·AI 또는 변호사 감수 주장을 새로 노출하지 않았고 내부 AI 표기는 보존했다. 굵은 Markdown·HTML 우회 강조가 없으며 캡션은 정확히 `Izmišljeni prizor`다.',
'\n원본 이미지 `/images/columns/<ID>-case-trends-20261025.webp` 6개의 바이트 SHA와 alt를 실제 장면에 대조했다.915의 안전모·설계도·교량,916의 토양병·노트·접이식 탁자·공장,918의 서류·빈 봉투·상자,919의 원탁·무표지 파일·세 의자,920의 기둥·충전기·차량·상부 배선,921의 컨트롤러·게임토큰·노트를 설명한다. 실제 사건 사진·당사자 장면처럼 주장하지 않는다.',
'\n915/916의 `/en/contact`는 `kontakt stranice na engleskom`으로 표시했다.916의 기존 `/sr/columns/taiwan-company-subsidiary-vs-branch`는 R004에서 존재를 확인했다.918–921의 사무실 이메일은 원래 주소 그대로이며 무리한 서류·비밀번호 전송을 요구하지 않는다. 세르비아어 상담 가능 여부를 보장하지 않았다. 공용 연락처·본문 내부링크 존재의 구조 검사는 오류0이며 외부 링크의 새 실응답200을 주장하지 않는다.',
'\n## 규칙5절 자기 점검',
'\n| 항목 | 직접 확인 및 근거 |\n|---|---|',
'| 1 실제 CLI FAIL0 | 현재6개 파일별0. 초기918/919 실패 보존, 수정5편 exit0, 동일921은 기존 개별OK 재사용. 도구 전체 exit를 숨기지 않았다. |',
'| 2 도입 다양성 | 915 독자의 질문,916 실사자료에 관한 사실,918 미완공 주택 장면,919 판결 결과,920 배선 경로 장면,921 청구액이다. 장면형은2/6 이하, 단일형은 절반을 넘지 않는다. 최근SR704의 날짜/첫ARC,705의 입국유형 질문,706의 체류근거 소멸 도입·제목·결말과 비교했고 같은 예고형/훈계형 틀을 붙이지 않았다. |',
'| 3 짧고 긴 문장 | 짧은 완결문은8/6/10/8/10/12개다. 긴 조건문은 문단당 최대1개이며 연속 긴 문장 없음. 915 `Odluka je kasnije poništena.`,916 `Uslovi se primenjuju zajedno.`,918 `Priključci su stigli kasnije.`,919 `Zaštita ne čeka konačan nalaz.`,920 `Odatle je veza vodila do stanarevog brojila.`,921 `Zahtev nije usvojen.`처럼 실제 뜻을 가진 문장이다. |',
'| 4 시작어 | 실제 문단 시작 배열을 세로로 읽었다. 최대1/1/2/2/2/1회이고 같은 시작 연속은1/0/0/0/0/0회다. 초기918의 U3회는 주체를 직접 밝히는 수정으로 닫았다. |',
'| 5 인용 리듬 | 조문을 주어로 하는 조건문과 사건 결과·자료 흐름·독자의 질문을 섞었다. 문장 끝 괄호인용 비율0, 인용 없는 문단이 각 편 존재하며 주장→조문→다만을3문단 연속 복제하지 않았다. 출처 링크를 삭제하지 않았다. |',
'| 6 대비·반박 | 프로그램의 contrast0을 자연어 의미의 완전한 증명으로 삼지 않았다. 판결의 취소/무죄 판단, 환송/청구 기각, 청구액/지급액 등 정확성에 필요한 범위 구분은 유지하고 독자가 하지 않은 주장을 새로 만들어 반박하지 않았다. |',
'| 7 실질 결말 | 915의 시간·금전청구 문서 순서,916의 발견·대응·자산처분 연결,918의 세 종류 편지 구분,919의 통지·답변·증거 채택 이유,920의 동의·착공·비용분담,921의 입금·전환·사용 흐름으로 끝낸다. 그 뒤 확인일/적용범위/공식출처는 규칙의 필요한 구조 꼬리 예외로 보존했다. 판촉 보장이나 같은 결론 복사는 없다. |',
'| 8 문체·표기 | Serbian Latin script와 독자용 문장 유지. ko/ja 혼용 규칙은 해당 없음. 공개 굵은 강조·지어낸1인칭·명령형 체크리스트 제목·공개 저자소개 없음. 외국 기관 약어·정식 사건번호는 의미상 필요해 보존했다. |',
'| 9 손실 없음 | 실제7개 치환 전후 숫자 토큰/URL 순서/FM·FAQ가 모두 같고6개 원본 SHA 역복원 일치. 출처·법적조건·가상캡션 보존이 문체 수치보다 우선했다. |',
'\n## 최종 SHA와 한계',
'\n| 원고 | SHA-256 |\n|---|---|'
]
for row in rows: paragraphs.append(f"| `{Path(row['file']).name}` | `{row['sha256']}` |")
paragraphs += [
'\n원고는 위 SHA에서 동결했다. `sr-final-manifest.json`이 저자 기록·입력·원고·현재 증거를 바인딩한다. 실제 구조/문장 검사·모델 자체 의미 검수와 독립 검수·사람 원어민/법률 승인·공개 게시는 각각 별개다. 이 기록은 후자의 승인을 주장하지 않는다. 새 전체 테스트/빌드나 브라우저·JSON-LD·카드·피드 검증은 실행하지 않았으며 후속 통합 범위로 남긴다.',
'\n보조 읽기 명령에서 공용 구조 도구 경로를 `scripts/columns/content-audit-lib.mjs`로 잘못 추정해 FileNotFoundError가1회 났다. 실제 sr-audit.mjs import를 읽어 `docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs`를 확인하고 SHA를 대조했다. 이미 수행한 실제 구조 검사에는 이 잘못된 경로를 사용하지 않았으며 해당 오류를 통과로 기록하지 않았다.',
f'\n기록 생성 UTC: {now}'
]
# Short example must be an actual current sentence, rather than a reconstructed quote.
all_text='\n'.join(s for row in rows for s in row['actual_source_sentences'])
if 'Zaštita ne čeka konačan nalaz.' not in all_text:
 actual=next(s for row in rows if Path(row['file']).name.startswith('919-') for s,l in zip(row['actual_source_sentences'],row['lengths']) if l<=8 and s.startswith('Žalba'))
 paragraphs=[x.replace('Zaštita ne čeka konačan nalaz.',actual) for x in paragraphs]
author=R/'sr-author.md'; assert not author.exists(); author.write_text('\n'.join(paragraphs)+'\n')
# Final evidence closure: no public or repository mutation.
artifacts=[]
for p in sorted(C.glob('sr-*')):
 if p.is_file(): artifacts.append({'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size})
manifest={'atUTC':now,'locale':'sr','status':'AUTHOR_FROZEN_PENDING_INDEPENDENT_REVIEW','native_human_or_lawyer_approval':False,'publication_status':'NOT_DEPLOYED_BY_THIS_WORK','author':{'path':str(author),'sha256':sha(author),'bytes':author.stat().st_size},'manuscripts':[{'path':row['file'],'sha256':row['sha256'],'initial_sha256':row['initial_sha256'],'metrics':row['metrics'],'actual_cli_evidence':row['actual_cli_evidence'],'observed_batch_exit':row['observed_batch_exit'],'observed_file_status':row['observed_file_status']} for row in rows], 'inputs':input_state, 'structure_tool':{'path':str(helper),'sha256':sha(helper)}, 'evidence':artifacts,'current_proof':'checks/sr-final-proof-current.json','actual_cli_invocations':2,'actual_cli_file_measurements':11,'current_FAIL_files':0,'structural_errors':0,'semantic_tool_status':'REVIEW_REQUIRED','actual_render_segments':238,'FAQ_total':17,'exact_inverse_files':6,'actual_self_edits':7,'source_images':[x['image'] for x in meta['rows']],'limits':proof['limits']}
save(C/'sr-final-manifest.json',manifest)
print(json.dumps({'authorSHA':sha(author),'manifestSHA':sha(C/'sr-final-manifest.json'),'currentProofSHA':sha(C/'sr-final-proof-current.json'),'evidence':len(artifacts),'inputHashesMatch':len(input_state),'manuscripts':len(rows),'segments':238,'FAQ':17},ensure_ascii=False,indent=2))
