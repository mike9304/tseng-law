#!/usr/bin/env python3
"""Independent expected arrays; no candidate or target-article imports."""
import datetime
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
fixtures = []

def add(lang, kind, name, text, expected, note=''):
    fixtures.append(dict(id=f'{lang}-{kind}-{name}', locale=lang, kind=kind,
                         text=text, expected=expected, note=note))

def sentence(lang, name, *parts):
    add(lang, 'sentences', name, ' '.join(parts), list(parts))

for lang, parts in {
    'fil': ['Nasa mesa ang liham.', 'May kopya ang opisina.'],
    'he': ['המכתב נמצא על השולחן.', 'עותק נשמר במשרד.'],
    'nl': ['De brief ligt op tafel.', 'Het kantoor bewaart een kopie.'],
    'pl': ['List leży na stole.', 'Biuro przechowuje kopię.'],
    'cs': ['Dopis leží na stole.', 'Kancelář má kopii.'],
    'lt': ['Laiškas guli ant stalo.', 'Biuras saugo kopiją.'],
}.items():
    sentence(lang, 'plain', *parts)

sentence('fil', 'titles', 'Kinausap ni Dr. Reyes si Bb. Cruz.', 'Bumalik sila bukas.')
sentence('fil', 'citation', 'Nasa art. 5 ng Batas Blg. 12 ang tala.', 'May hiwalay na kopya.')
sentence('fil', 'decimal', 'Nakatala ang halagang 1,250.50 piso.', 'May resibo rin.')
sentence('fil', 'terminal-abbreviation', 'May mga resibo, liham, atbp.', 'Nasa mesa ang folder.')
sentence('fil', 'abbreviation-middle', 'May mga resibo, liham, atbp. sa folder.', 'Kumpleto ang tala.')
sentence('fil', 'quote-attribution', '“Handa na ba?” tanong niya.', 'Sumagot ang kawani.')
sentence('fil', 'quote-new-sentence', '“Handa na ba?”', 'Sumagot ang kawani.')
sentence('fil', 'ellipsis', 'Sandali...', 'Bukas ang opisina.')

sentence('he', 'gershayim', 'עו״ד לוי קיבל את המכתב.', 'העותק נשמר.')
sentence('he', 'ascii-gershayim', 'עו"ד לוי קיבל את המכתב.', 'העותק נשמר.')
sentence('he', 'geresh-name', 'ג׳ורג׳ הגיע למשרד.', 'הדלת הייתה פתוחה.')
sentence('he', 'decimal', 'הסכום הוא 1,250.50 ש״ח.', 'הקבלה נשמרה.')
sentence('he', 'citation', 'ההפניה היא לסעיף 5 לחוק.', 'המסמך מצורף.')
sentence('he', 'quote-attribution', '"מי חתם?" שאל העובד.', 'המנהל השיב.')
sentence('he', 'quote-new-sentence', '"מי חתם?"', 'העובד חזר לחדר.')
sentence('he', 'punctuation', 'מי חתם?', 'העותק כאן!', 'אפשר לבדוק.')

sentence('nl', 'title', 'Mr. De Vries las de brief.', 'Daarna belde zij terug.')
sentence('nl', 'citation', 'Zie art. 5, lid 2.', 'Daarna volgt de bijlage.')
sentence('nl', 'decimal', 'Het bedrag is 1.250,50 euro.', 'De factuur ligt klaar.')
sentence('nl', 'terminal-abbreviation', 'Het dossier bevat facturen enz.', 'De map blijft hier.')
sentence('nl', 'abbreviation-middle', 'Het dossier bevat facturen enz. in een map.', 'Die map blijft hier.')
sentence('nl', 'multi-abbreviation', 'Het pakket bevat o.a. facturen en brieven.', 'De lijst is compleet.')
sentence('nl', 'quote-attribution', '“Wie heeft getekend?” vroeg hij.', 'De medewerker antwoordde.')
sentence('nl', 'quote-new-sentence', '“Wie heeft getekend?”', 'De medewerker liep weg.')

sentence('pl', 'title', 'Prof. Nowak przeczytał list.', 'Potem odłożył dokument.')
sentence('pl', 'citation', 'Zob. art. 5 ust. 1.', 'Potem sprawdź załącznik.')
sentence('pl', 'decimal', 'Kwota wynosi 1.250,50 zł.', 'Potwierdzenie jest w teczce.')
sentence('pl', 'terminal-abbreviation', 'Spis zawiera listy itd.', 'Kolejna strona jest pusta.')
sentence('pl', 'abbreviation-middle', 'Spis zawiera listy itd. w jednej teczce.', 'Teczka jest tutaj.')
sentence('pl', 'year-terminal', 'Dokument pochodzi z 2025 r.', 'Kolejny list jest nowszy.')
sentence('pl', 'year-middle', 'Dokument powstał w 2025 r. w Warszawie.', 'Kopia jest tutaj.')
sentence('pl', 'example', 'Termin podano np. jako 30 dni.', 'Dopisano go ręcznie.')
sentence('pl', 'quote-attribution', '„Kto podpisał?” zapytał pracownik.', 'Odpowiedź zapisano.')

sentence('cs', 'named-date', 'Záznam vznikl 1. ledna 2026.', 'Další list přišel později.')
sentence('cs', 'numeric-date', 'Dopis přišel 25. 10. 2026.', 'Odpověď je přiložena.')
sentence('cs', 'date-no-year', 'Termín je 25. října.', 'Další datum není uvedeno.')
sentence('cs', 'citation', 'Viz čl. 5 odst. 1.', 'Kopie je přiložena.')
sentence('cs', 'title', 'Ing. Novák podepsal dopis.', 'Kopie zůstala v kanceláři.')
sentence('cs', 'company-abbreviation', 'Společnost Alfa, s. r. o., zaslala dopis.', 'Kopie je v archivu.')
sentence('cs', 'terminal-abbreviation', 'Seznam obsahuje dopisy atd.', 'Další list chybí.')
sentence('cs', 'ordinal-not-date', 'Jde o 2. čtení návrhu.', 'Termín je znám.')
sentence('cs', 'integer-at-end', 'Číslo spisu je 2.', 'Další položka je prázdná.')
sentence('cs', 'decimal', 'Cena činí 1.250,50 Kč.', 'Účet je přiložen.')
sentence('cs', 'quote-attribution', '„Kdo podepsal?“ zeptal se pracovník.', 'Odpověď zapsal.')

sentence('lt', 'date', 'Laiškas gautas 2026 m. spalio 25 d. ryte.', 'Kopija išsaugota.')
sentence('lt', 'title', 'Sąrašą patikrino dr. Jonas.', 'Kopija liko biure.')
sentence('lt', 'multi-abbreviation', 'Tai, t. y. kopija, liko biure.', 'Originalas išsiųstas.')
sentence('lt', 'example-capital', 'Kopija saugoma kitur, pvz. Vilniuje.', 'Originalas liko čia.')
sentence('lt', 'terminal-abbreviation', 'Sąraše yra laiškai ir t. t.', 'Kitas lapas tuščias.')
sentence('lt', 'abbreviation-middle', 'Laiškai ir t. t. sudėti į aplanką.', 'Jis yra čia.')
sentence('lt', 'year-terminal', 'Dokumentas gautas 2026 m.', 'Kitas laiškas gautas vėliau.')
sentence('lt', 'citation', 'Nurodytas 5 str. 1 d. tekstas.', 'Kopija pridėta.')
sentence('lt', 'decimal', 'Suma yra 1.250,50 euro.', 'Kvitas išsaugotas.')
sentence('lt', 'quote-attribution', '„Kas pasirašė?“ paklausė darbuotojas.', 'Atsakymas užrašytas.')

for lang, text, expected in [
    ('fil', 'siya’y pag-ibig araw-araw', ['siya’y', 'pag', 'ibig', 'araw', 'araw']),
    ('fil', "ako'y narito", ["ako'y", 'narito']),
    ('fil', '₱1,250.50 at 8-12 araw', ['1,250.50', 'at', '8', '12', 'araw']),
    ('fil', 'Artikulo 5(1), Blg. 12.', ['Artikulo', '5', '1', 'Blg', '12']),
    ('fil', 'tao\u0301 opisina', ['tao\u0301', 'opisina']),
    ('he', 'עו״ד בע״מ', ['עו״ד', 'בע״מ']),
    ('he', 'עו"ד בע"מ', ['עו"ד', 'בע"מ']),
    ('he', 'ג׳ורג׳ פרופ׳', ['ג׳ורג׳', 'פרופ׳']),
    ('he', "ג'ורג' פרופ'", ["ג'ורג'", "פרופ'"]),
    ('he', 'בית־משפט שָׁלוֹם', ['בית', 'משפט', 'שָׁלוֹם']),
    ('he', '₪1,250.50 ו־8-12 ימים', ['1,250.50', 'ו', '8', '12', 'ימים']),
    ('he', '"שלום" "עולם"', ['שלום', 'עולם']),
    ('nl', "zo'n cliënt e-mail", ["zo'n", 'cliënt', 'e', 'mail']),
    ('nl', '€1.250,50 en 8-12 dagen', ['1.250,50', 'en', '8', '12', 'dagen']),
    ('nl', 'art. 5 lid 2', ['art', '5', 'lid', '2']),
    ('nl', 'coo\u0308peratie', ['coo\u0308peratie']),
    ('pl', 'zażółć gęślą jaźń', ['zażółć', 'gęślą', 'jaźń']),
    ('pl', '1 250,50 zł; 8-12 dni', ['1', '250,50', 'zł', '8', '12', 'dni']),
    ('pl', 'art. 5 ust. 1 pkt 2', ['art', '5', 'ust', '1', 'pkt', '2']),
    ('pl', 'polsko-tajwański projekt', ['polsko', 'tajwański', 'projekt']),
    ('cs', 'český návrh řízení', ['český', 'návrh', 'řízení']),
    ('cs', '1. 2. 2026 a 1.250,50 Kč', ['1', '2', '2026', 'a', '1.250,50', 'Kč']),
    ('cs', '§ 5 odst. 1 písm. a)', ['5', 'odst', '1', 'písm', 'a']),
    ('cs', 'česko-tchajwanský projekt', ['česko', 'tchajwanský', 'projekt']),
    ('lt', 'ąžuolas įmonė užsienyje', ['ąžuolas', 'įmonė', 'užsienyje']),
    ('lt', '2026 m. spalio 25 d.', ['2026', 'm', 'spalio', '25', 'd']),
    ('lt', '1 250,50 Eur; 8-12 dienų', ['1', '250,50', 'Eur', '8', '12', 'dienų']),
    ('lt', 't. y. 5 str. 1 d.', ['t', 'y', '5', 'str', '1', 'd']),
    ('lt', 'Lietuvos-Taivano ryšys', ['Lietuvos', 'Taivano', 'ryšys']),
]:
    add(lang, 'words', str(sum(f['locale'] == lang and f['kind'] == 'words' for f in fixtures) + 1), text, expected,
        'Declared orthographic units, not morphemes; hyphens split, whitespace separates numbers.')

headings = {
    'fil': (['## Mga sanggunian', '### Sanggunian', '## Mga opisyal na sanggunian'],
            ['## Mga sanggunian ng puhunan', '## Batayang legal ng paghahabol', 'Mga sanggunian']),
    'he': (['## מקורות', '### מקורות רשמיים', '## אסמכתאות'],
           ['## מקורות המימון', '## מקורות הסמכות של החברה', 'מקורות']),
    'nl': (['## Bronnen', '### Officiële bronnen', '## Referenties'],
           ['## Bronnen van financiering', '## Juridische grondslag van de vordering', 'Bronnen']),
    'pl': (['## Źródła', '### Źródła urzędowe', '## Oficjalne źródła'],
           ['## Źródła finansowania', '## Podstawa prawna roszczenia', 'Źródła']),
    'cs': (['## Zdroje', '### Oficiální zdroje', '## Prameny'],
           ['## Zdroje financování', '## Právní základ nároku', 'Zdroje']),
    'lt': (['## Šaltiniai', '### Oficialūs šaltiniai', '## Naudoti šaltiniai'],
           ['## Finansavimo šaltiniai', '## Teisinis reikalavimo pagrindas', 'Šaltiniai']),
}
for lang, (positives, negatives) in headings.items():
    for n, text in enumerate(positives, 1):
        add(lang, 'source_heading', f'positive-{n}', text, True)
    for n, text in enumerate(negatives, 1):
        add(lang, 'source_heading', f'negative-{n}', text, False)

signals = {
    'fil': dict(
        contrast=('Hindi ito multa kundi bayad.', 'Ang petsa ay iba sa halaga.', 'Nasa mesa ang mga papel.'),
        caveat=('Gayunman, may hiwalay na tala.', 'Subalit may ibang kopya.', 'Gayon din ang kulay ng papel.'),
        hypo=('Halimbawa, may dalawang liham.', 'Ipagpalagay na dumating ang sulat.', 'Dumating ang sulat kahapon.'),
        close=('Pangkalahatang impormasyon lamang ang paliwanag.', 'Maaaring ipadala ang tala sa email.', 'Nananatili sa folder ang huling resibo.')),
    'he': dict(
        contrast=('זה אינו קנס אלא תשלום.', 'זה לא קנס אלא תשלום.', 'המסמכים נמצאים על השולחן.'),
        caveat=('אולם יש עותק נוסף.', 'עם זאת, נותרה שאלה.', 'אולמרט הוא שם המופיע ברשימה.'),
        hypo=('נניח שהמכתב הגיע.', 'לדוגמה, יש שני מכתבים.', 'המכתב הגיע אתמול.'),
        close=('זהו מידע כללי בלבד.', 'אפשר לשלוח את המסמך בדוא״ל.', 'הקבלה האחרונה נשארה בתיק.')),
    'nl': dict(
        contrast=('Het is geen boete maar een betaling.', 'Dit is anders dan het bedrag.', 'De papieren liggen op tafel.'),
        caveat=('Echter, er is een tweede kopie.', 'Toch ontbreekt de datum.', 'Echtheid is hier de vraag.'),
        hypo=('Stel dat de brief aankomt.', 'Neem bijvoorbeeld twee brieven.', 'De brief kwam gisteren aan.'),
        close=('Dit is algemene informatie.', 'U kunt de stukken per e-mail sturen.', 'De laatste factuur blijft in de map.')),
    'pl': dict(
        contrast=('To nie kara, lecz opłata.', 'To nie kara, ale opłata.', 'Dokumenty leżą na stole.'),
        caveat=('Jednak istnieje druga kopia.', 'Mimo to brakuje daty.', 'Jednakowy kolor nie pomaga.'),
        hypo=('Załóżmy, że list dotarł.', 'Wyobraźmy sobie dwa listy.', 'List dotarł wczoraj.'),
        close=('To informacje ogólne.', 'Dokumenty można wysłać e-mailem.', 'Ostatni rachunek pozostaje w teczce.')),
    'cs': dict(
        contrast=('Nejde o pokutu, ale o platbu.', 'Není to pokuta, nýbrž platba.', 'Dokumenty leží na stole.'),
        caveat=('Nicméně existuje další kopie.', 'Avšak datum chybí.', 'Nic není uvedeno.'),
        hypo=('Předpokládejme, že dopis dorazil.', 'Například existují dva dopisy.', 'Dopis dorazil včera.'),
        close=('Jde o obecné informace.', 'Podklady lze poslat e-mailem.', 'Poslední účet zůstává ve složce.')),
    'lt': dict(
        contrast=('Tai ne bauda, o mokestis.', 'Tai ne bauda, bet mokestis.', 'Dokumentai guli ant stalo.'),
        caveat=('Tačiau yra kita kopija.', 'Vis dėlto datos nėra.', 'Taip pat yra aplankas.'),
        hypo=('Tarkime, kad laiškas atėjo.', 'Įsivaizduokite du laiškus.', 'Laiškas atėjo vakar.'),
        close=('Tai bendro pobūdžio informacija.', 'Dokumentus galima siųsti el. paštu.', 'Paskutinis kvitas lieka aplanke.')),
}
for lang, groups in signals.items():
    for group, texts in groups.items():
        for n, text in enumerate(texts, 1):
            kind = 'contrasts' if group == 'contrast' else 'signal'
            expected = (1 if n < 3 else 0) if group == 'contrast' else n < 3
            add(lang, kind, f'{group}-{n}', text, expected,
                'Selected formula detector; a negative count is not an exhaustive linguistic finding.')
            if kind == 'signal':
                fixtures[-1]['pattern_key'] = {'caveat': 'caveat_pattern', 'hypo': 'hypo_pattern', 'close': 'formula_close_pattern'}[group]

citations = {
    'fil': ('May batayan ang tala (Artikulo 5).', 'May batayan ang tala (talahanayan 5).', 'Artikulo 5 ang tinukoy sa tala.'),
    'he': ('יש הפניה במסמך (סעיף 5).', 'יש הפניה במסמך (טבלה 5).', 'סעיף 5 מוזכר במסמך.'),
    'nl': ('De verwijzing staat vast (art. 5).', 'De verwijzing staat vast (tabel 5).', 'Artikel 5 staat in de verwijzing.'),
    'pl': ('Odesłanie jest zapisane (art. 5 ust. 1).', 'Odesłanie jest zapisane (tabela 5).', 'Artykuł 5 wskazano w dokumencie.'),
    'cs': ('Odkaz je uveden (§ 5 odst. 1).', 'Odkaz je uveden (tabulka 5).', 'Článek 5 je uveden v textu.'),
    'lt': ('Nuoroda pateikta (5 str. 1 d.).', 'Nuoroda pateikta (5 lentelė).', '5 straipsnis nurodytas tekste.'),
}
plain = {
    'fil': ['Nasa mesa ang papel.', 'May hiwalay na kopya.', 'Bukas ang pinto.', 'Dumating ang sulat.'],
    'he': ['הנייר על השולחן.', 'יש עותק נוסף.', 'הדלת פתוחה.', 'המכתב הגיע.'],
    'nl': ['Het papier ligt hier.', 'Er is een kopie.', 'De deur staat open.', 'De brief kwam aan.'],
    'pl': ['Papier leży tutaj.', 'Jest jeszcze kopia.', 'Drzwi są otwarte.', 'List już dotarł.'],
    'cs': ['Papír je zde.', 'Existuje další kopie.', 'Dveře jsou otevřené.', 'Dopis již dorazil.'],
    'lt': ['Popierius yra čia.', 'Yra kita kopija.', 'Durys yra atviros.', 'Laiškas jau atėjo.'],
}
for lang, (ending, negative, inline) in citations.items():
    for name, text, para, end in [('ending', ending, .2, .2), ('negative', negative, 0, 0), ('inline', inline, .2, 0)]:
        add(lang, 'citation_metrics', name, '\n\n'.join([text] + plain[lang]),
            {'sentences': 5, 'paras': 5, 'cite_para_share': para, 'cite_end_share': end},
            'Neutral invented grammar example, not a legal proposition or target article.')

payload = {
    'schema_version': 1,
    'prepared_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'reviewer': '/root/measure_new_locales_review',
    'independence': 'No target articles, target scores, candidate code, candidate profile files, or per-fixture candidate outputs read before freezing this file. Global original code/rules and author method description read. Author reported aggregate test counts and one Czech NFD issue by message during preparation; none of these expected arrays were derived from candidate outputs.',
    'scope': 'Independent operational expectations for a task-local six-locale measurement extension; no article certification.',
    'rules': {'short_units': 8, 'long_units': 32, 'hard_limits': 'unchanged', 'hyphens': 'split in these six profiles', 'source_tail': 'anchored standalone headings only'},
    'references': [
        {'url': 'https://www.unicode.org/reports/tr29/', 'opened': True, 'note': 'Current Unicode 18.0.0 / rev49, section 4.1.1 WB7a-c and tailoring; orthographic units are declared heuristics, not claimed full UAX conformance.'},
        {'url': 'https://prirucka.ujc.cas.cz/?id=160', 'opened': True, 'note': 'Czech authority on date/ordinal/abbreviation periods, including sentence-final abbreviations.'},
        {'url': 'https://www.vlkk.lt/konsultacijos/1120-santrumpos', 'opened': False, 'note': 'Tool returned inaccessible; Lithuanian examples are independent AI editorial judgments, not claimed verified official quotations.'},
    ],
    'fixtures': fixtures,
}
out = ROOT / 'neutral-fixtures.json'
out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
sha = hashlib.sha256(out.read_bytes()).hexdigest()
(ROOT / 'neutral-fixtures.sha256').write_text(f'{sha}  neutral-fixtures.json\n', encoding='utf-8')
print(json.dumps({'path': str(out), 'sha256': sha, 'fixtures': len(fixtures), 'locales': sorted(set(f['locale'] for f in fixtures))}))
