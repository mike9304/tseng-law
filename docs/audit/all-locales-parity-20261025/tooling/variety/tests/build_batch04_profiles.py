"""Explicit finite profiles implementing the pre-recorded neutral contract."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
LATIN = ['Dr', 'Prof', 'Mr', 'Ms', 'Art', 'No', 'p', 'pp', 'e.g', 'i.e']
START = r'^[\s“”"\x27«»״(\[]*'
END = r'(?=$|\s|[,،:;.!?।॥۔؟])'


def heading(aliases):
    return r'^#{1,6}[^\S\r\n]+(?:\d+[.)][^\S\r\n]+)?(?:' + aliases + r')[^\S\r\n]*[:：]?(?:[^\S\r\n]+#+)?[^\S\r\n]*$'


def opposition(negation, correction, additive, stops):
    # Anchor each match at a sentence/paragraph start so a failed additive
    # guard cannot restart after “only” and count the same additive clause.
    excluded = r'[^' + stops + r'\n]'
    return (r'(?:^|(?<=[' + stops + r'\n]))\s*(?!' + excluded + r'{0,220}(?:' + additive + r'))'
            + excluded + r'{0,220}(?:' + negation + r')\s*[,،]?\s*(?:' + correction + r')')


base = dict(review_status='AI neutral contract; coordinating review and installation pending',
            join_hyphens=False, canonical_abbreviations=True,
            question_pattern=r'[?؟]\s*["”’»›“״)]*$',
            length_unit='orthographic_words', short_threshold=8, long_threshold=32,
            provenance='METHOD-BATCH04.md; frozen tests/fixtures-batch04.json and separate MY neutral fixtures',
            abbreviations=LATIN, terminal_abbreviations=[])
profiles = {}
he_path = Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/market-expansion-20261025/work/variety-candidate/candidate/profiles/he.json')
he = json.loads(he_path.read_text())
profiles['he'] = {**base, **{k: he[k] for k in ('source_heading_pattern', 'abbreviations', 'terminal_abbreviations', 'citation_pattern', 'quote_attribution_pattern', 'contrast_patterns', 'caveat_pattern', 'hypo_pattern', 'formula_close_pattern')},
                  'register': 'Modern Hebrew, Unicode orthographic units',
                  'additional_closing_quotes': '״', 'hebrew_internal_quotes': True}
profiles['bn'] = {**base, 'register': 'Standard Bengali/Bangla',
    'source_heading_pattern': heading(r'তথ্যসূত্র|উৎস|সরকারি\s+(?:উৎস|সূত্র)'),
    'abbreviations': LATIN + ['ড', 'মো', 'পৃ'],
    'additional_sentence_terminators': '।॥', 'unspaced_sentence_terminators': '।॥',
    'quote_attribution_pattern': r'^(?:বলে|বলল|বললেন|জিজ্ঞেস\s+করল)' + END,
    'citation_pattern': r'(?:ধারা|অনুচ্ছেদ)\s*\d+',
    'contrast_patterns': [opposition('নয়', 'বরং', 'শুধু|কেবল', '.!?।॥')],
    'caveat_pattern': START + r'(?:তবে|কিন্তু|তবু)' + END,
    'hypo_pattern': START + r'(?:ধরুন|উদাহরণস্বরূপ)' + END,
    'formula_close_pattern': r'সাধারণ\s+তথ্য|প্রতিটি\s+ঘটনা\s+আলাদা'}
profiles['ur'] = {**base, 'register': 'Standard Urdu in Unicode Arabic script',
    'source_heading_pattern': heading(r'ماخذ|ذرائع|حوالہ\s+جات|سرکاری\s+ذرائع'),
    'additional_sentence_terminators': '۔؟', 'unspaced_sentence_terminators': '۔؟',
    'additional_closing_quotes': '“',
    'quote_attribution_pattern': r'^(?:(?:اس|انہوں)\s+نے\s+)?(?:کہا|پوچھا)' + END,
    'citation_pattern': r'(?:دفعہ|دفعات|آرٹیکل)\s*\d+',
    'contrast_patterns': [opposition('نہیں|نہ', 'بلکہ', 'صرف', '.!?۔؟'), r'کے\s+بجائے'],
    'caveat_pattern': START + r'(?:تاہم|لیکن|البتہ)' + END,
    'hypo_pattern': START + r'(?:فرض\s+کریں|مثال\s+کے\s+طور\s+پر)' + END,
    'formula_close_pattern': r'عمومی\s+معلومات|ہر\s+معاملہ\s+مختلف'}
profiles['fa'] = {**base, 'register': 'Modern Persian, written units retaining ZWNJ',
    'source_heading_pattern': heading(r'منابع(?:\s+رسمی)?|مآخذ'),
    'abbreviations': LATIN + ['ص', 'صص', 'ج', 'ق.م', 'هـ.ش'],
    'additional_sentence_terminators': '؟', 'unspaced_sentence_terminators': '؟',
    'quote_attribution_pattern': r'^(?:پرسید|گفت|پاسخ\s+داد)' + END,
    'citation_pattern': r'ماده(?:ٔ|\u200cی)?\s*\d+',
    'contrast_patterns': [opposition('نیست|نه', 'بلکه', 'فقط|تنها', '.!?؟'), r'به[\s\u200c]+جای'],
    'caveat_pattern': START + r'(?:با\s+این\s+حال|اما|بااین\u200cحال)' + END,
    'hypo_pattern': START + r'(?:فرض\s+کنید|برای\s+مثال)' + END,
    'formula_close_pattern': r'اطلاعات\s+(?:عمومی|کلی)|هر\s+پرونده\s+متفاوت'}
profiles['my'] = {**base, 'register': 'Modern Burmese in Unicode Myanmar; ICU wordlike unit',
    'length_unit': 'icu_dictionary_wordlike_units',
    'source_heading_pattern': heading(r'ကိုးကားချက်များ|ကိုးကားရင်းမြစ်များ|ရင်းမြစ်များ|တရားဝင်ရင်းမြစ်များ'),
    'additional_sentence_terminators': '။', 'unspaced_sentence_terminators': '။',
    'quote_attribution_pattern': r'^(?:ဟု|လို့)',
    'citation_pattern': r'ပုဒ်မ\s*\d+',
    'contrast_patterns': [r'မဟုတ်ဘဲ'],
    'caveat_pattern': START + r'(?:သို့သော်|သို့ရာတွင်|သို့ပေမယ့်)',
    'hypo_pattern': START + r'(?:ဥပမာ|ယူဆကြည့်ပါ)',
    'formula_close_pattern': r'ယေဘုယျ\s*အချက်အလက်|အထွေထွေ\s*အချက်အလက်'}
profiles['ta'] = {**base, 'register': 'Modern Tamil',
    'source_heading_pattern': heading(r'ஆதாரங்கள்|மேற்கோள்கள்|அதிகாரப்பூர்வ\s+ஆதாரங்கள்'),
    'abbreviations': LATIN + ['திரு', 'திருமதி', 'டா', 'பக்', 'தொ', 'கி.மு', 'கி.பி'],
    'additional_sentence_terminators': '।॥', 'unspaced_sentence_terminators': '।॥',
    'quote_attribution_pattern': r'^(?:என்று|எனக்)' + END,
    'citation_pattern': r'(?:சட்டப்பிரிவு|பிரிவு)\s*\d+',
    'contrast_patterns': [opposition('அல்ல', 'மாறாக', 'மட்டும்|மட்டுமல்ல', '.!?।॥'), r'பதிலாக'],
    'caveat_pattern': START + r'(?:ஆனால்|இருப்பினும்|எனினும்)' + END,
    'hypo_pattern': START + r'(?:உதாரணமாக|எடுத்துக்காட்டாக)' + END,
    'formula_close_pattern': r'பொதுவான\s+தகவல்|ஒவ்வொரு\s+வழக்கும்\s+வேறுபடும்'}
profiles['ne'] = {**base, 'register': 'Standard Nepali in Devanagari',
    'source_heading_pattern': heading(r'स्रोत(?:हरू)?|आधिकारिक\s+स्रोत(?:हरू)?|सन्दर्भ(?:हरू)?'),
    'abbreviations': LATIN + ['डा', 'प्रा', 'रु', 'सं', 'वि.सं', 'वि. सं', 'इ.सं', 'पृ'],
    'additional_sentence_terminators': '।॥', 'unspaced_sentence_terminators': '।॥',
    'quote_attribution_pattern': r'^(?:भनेर|भनी)' + END,
    'citation_pattern': r'(?:दफा|धारा|अनुच्छेद)\s*\d+',
    'contrast_patterns': [opposition('होइन', 'बरु', 'मात्र|मात्रै', '.!?।॥'), r'को\s+सट्टा'],
    'caveat_pattern': START + r'(?:तर|यद्यपि|तैपनि)' + END,
    'hypo_pattern': START + r'(?:मानौँ|मानौं|उदाहरणका\s+लागि)' + END,
    'formula_close_pattern': r'सामान्य\s+जानकारी|प्रत्येक\s+मामिला\s+फरक'}

if __name__ == '__main__':
    for locale, profile in profiles.items():
        profile.update(locale=locale, directory=f'columns-{locale}')
        (ROOT / 'profiles' / f'{locale}.json').write_text(json.dumps(profile, ensure_ascii=False, indent=2) + '\n')
