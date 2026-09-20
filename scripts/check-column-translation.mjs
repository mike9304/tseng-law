#!/usr/bin/env node
/**
 * Structural isomorphism + claim-safety checker for column translations.
 *
 * Usage:
 *   node scripts/check-column-translation.mjs \
 *     --source src/content/columns/008-x.md --target <translated.md> --lang vi [--json out.json]
 *   node scripts/check-column-translation.mjs --dir src/content/columns-vi --lang vi
 *   node scripts/check-column-translation.mjs --dir … --lang vi --check nationality
 *
 * Exit 1 on any FAIL. WARN does not fail the process.
 */

import { createRequire } from 'node:module';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(scriptDirectory, '..');
export const DEFAULT_SOURCE_DIR = join(repoRoot, 'src/content/columns');

export const GUIDANCE_LANGS = ['vi', 'id', 'th', 'fil', 'ar', 'de', 'es', 'fr', 'pt', 'zh-hans', 'ms', 'ru', 'tr', 'it', 'nl', 'pl', 'hi', 'sv', 'da', 'nb', 'fi', 'cs', 'hu', 'ro', 'uk', 'el', 'he'];
export const HANZI_MIN = 5;
export const ENGLISH_WORD_MIN = 12;
export const ENGLISH_STOPWORD_MIN = 3;

const HANGUL_RE = /[가-힣]/;
const HAN_RE = /\p{Script=Han}/u;
const LATIN_LETTER_RE = /\p{Script=Latin}/u;
const LETTER_RE = /\p{L}/u;
const ZWSP = '\u200B';

const ENGLISH_STOPWORDS = new Set([
  'the', 'and', 'of', 'to', 'in', 'is', 'for', 'that', 'with', 'as', 'on',
  'are', 'this', 'was', 'be', 'by', 'or', 'an', 'from', 'at', 'which',
  'however', 'therefore', 'these', 'their', 'have', 'has', 'not', 'will',
  'can', 'into', 'than', 'then', 'also', 'only', 'when', 'after',
]);

/**
 * Forbidden-claim regexes per language.
 * Source: 번역 출처 브리프 6 — 광고/업무 확장 금지 묶음:
 *   {lang} 상담 가능 · 통역 제공 · 즉시 응답 · 성공률 · 비용/결과 보장.
 * Patterns are intentionally specific so ordinary legal-consultation wording
 * (tư vấn / konsultasi / ให้คำปรึกษา) does not false-positive.
 */
export const FORBIDDEN_PHRASES = {
  vi: [
    { id: 'vi-consult-lang', re: /tư\s*vấn\s+(bằng\s+)?tiếng\s*việt|tiếng\s*việt\s+(có\s+)?tư\s*vấn/i, note: 'vi 상담 가능' },
    { id: 'vi-interpreter', re: /có\s+(phiên|thông)\s*dịch|cung\s*cấp\s+(phiên|thông)\s*dịch|(phiên|thông)\s*dịch\s+(viên\s+)?(sẵn|có)/i, note: '통역 제공' },
    { id: 'vi-immediate', re: /phản\s*hồi\s+(ngay|tức\s*thì)|trả\s*lời\s+ngay|phản\s*hồi\s+trong\s+vài\s*phút/i, note: '즉시 응답' },
    { id: 'vi-success-rate', re: /tỷ\s*lệ\s+thành\s*công|tỷ\s*lệ\s+thắng|thắng\s*kiện\s+\d/i, note: '성공률' },
    { id: 'vi-win-100', re: /thắng\s*(kiện\s*)?100\s*%|100\s*%\s*thắng/i, note: '성공률 100%' },
    { id: 'vi-cost-guarantee', re: /đảm\s*bảo\s+(chi\s*phí|kết\s*quả|thắng)|cam\s*kết\s+(thắng|chi\s*phí|kết\s*quả)/i, note: '비용/결과 보장' },
    { id: 'vi-always-on', re: /tư\s*vấn\s*24\s*\/\s*7|luôn\s+sẵn\s+sàng\s+tư\s*vấn/i, note: '즉시/상시 상담' },
    { id: 'vi-free-consult', re: /tư\s*vấn\s+miễn\s*phí|miễn\s*phí\s+tư\s*vấn/i, note: '비용 보장(무료 상담)' },
  ],
  id: [
    { id: 'id-consult-lang', re: /konsultasi\s+(dalam\s+)?bahasa\s+indonesia|bahasa\s+indonesia\s+(tersedia\s+)?konsultasi/i, note: 'id 상담 가능' },
    { id: 'id-interpreter', re: /tersedia\s+(penerjemah|juru\s*bahasa)|layanan\s+(terjemahan|penerjemah)|interpreter\s+(disediakan|tersedia)/i, note: '통역 제공' },
    { id: 'id-immediate', re: /respon\s+segera|balasan\s+segera|langsung\s+dibalas|membalas\s+seketika/i, note: '즉시 응답' },
    { id: 'id-success-rate', re: /tingkat\s+keberhasilan|tingkat\s+kemenangan|menjamin\s+kemenangan/i, note: '성공률' },
    { id: 'id-win-100', re: /menang\s*100\s*%|100\s*%\s*menang/i, note: '성공률 100%' },
    { id: 'id-cost-guarantee', re: /jaminan\s+(biaya|hasil|kemenangan)|menjamin\s+(biaya|hasil)/i, note: '비용/결과 보장' },
    { id: 'id-always-on', re: /konsultasi\s*24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'id-free-consult', re: /konsultasi\s+gratis|gratis\s+konsultasi/i, note: '비용 보장(무료 상담)' },
  ],
  th: [
    { id: 'th-consult-lang', re: /ให้คำปรึกษา(เป็น)?ภาษาไทย|ปรึกษา(ได้)?เป็นภาษาไทย|มีคำปรึกษาภาษาไทย/i, note: 'th 상담 가능' },
    { id: 'th-interpreter', re: /มีล่าม|บริการล่าม|บริการแปล(ภาษา)?|จัดล่าม/i, note: '통역 제공' },
    { id: 'th-immediate', re: /ตอบกลับทันที|ตอบทันที|ตอบในทันที|ตอบภายในไม่กี่นาที/i, note: '즉시 응답' },
    { id: 'th-success-rate', re: /อัตราความสำเร็จ|อัตราชนะคดี|โอกาสชนะคดี/i, note: '성공률' },
    { id: 'th-win-100', re: /ชนะ\s*100\s*%|100\s*%\s*ชนะ/i, note: '성공률 100%' },
    { id: 'th-cost-guarantee', re: /รับประกัน(ค่าใช้จ่าย|ผลลัพธ์|ชนะ)|รับประกันผล/i, note: '비용/결과 보장' },
    { id: 'th-always-on', re: /ปรึกษา\s*24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'th-free-consult', re: /ปรึกษาฟรี|ให้คำปรึกษาฟรี/i, note: '비용 보장(무료 상담)' },
  ],
  fil: [
    { id: 'fil-consult-lang', re: /konsultasyon\s+sa\s+(filipino|tagalog)|filipino\s+consultation\s+available|tagalog\s+consultation\s+available/i, note: 'fil 상담 가능' },
    { id: 'fil-interpreter', re: /interpreter\s+(provided|available)|may\s+(interpreter|tagasalin)|translation\s+provided/i, note: '통역 제공' },
    { id: 'fil-immediate', re: /immediate(ly)?\s+(response|reply)|agad\s+na\s+(sagot|tugon)|instant\s+reply/i, note: '즉시 응답' },
    { id: 'fil-success-rate', re: /success\s+rate|winning\s+rate|rate\s+ng\s+tagumpay/i, note: '성공률' },
    { id: 'fil-win-100', re: /100\s*%\s*(panalo|panalo)|panalo\s*100\s*%/i, note: '성공률 100%' },
    { id: 'fil-cost-guarantee', re: /guaranteed\s+(cost|fee|result|outcome)|cost\s+guarantee|garantiya\s+sa\s+(gastos|resulta)|outcome\s+guarantee/i, note: '비용/결과 보장' },
    { id: 'fil-always-on', re: /24\s*\/\s*7\s+consult/i, note: '즉시/상시 상담' },
    { id: 'fil-free-consult', re: /libreng\s+konsultasyon|free\s+consultation/i, note: '비용 보장(무료 상담)' },
  ],
  ar: [
    { id: 'ar-consult-lang', re: /(?:و)?(?:نقدم|تتوفر|توفر)\s+(?:ال)?استشار[ةا]ت?\s+(?:باللغة\s+)?العربية|(?:و)?استشارة\s+بالعربية/u, note: 'ar 상담 가능' },
    { id: 'ar-interpreter', re: /(?:و)?(?:نوفر|يتوفر|لدينا)\s+(?:ال)?مترجم|(?:و)?خدمة\s+الترجمة\s+(?:الفورية|متاحة)/u, note: '통역 제공' },
    { id: 'ar-immediate', re: /(?:و)?رد\s+فوري|(?:و)?نرد\s+(?:فورًا|فوراً|خلال\s+دقائق)/u, note: '즉시 응답' },
    { id: 'ar-success-rate', re: /(?:و)?نسبة\s+(?:النجاح|الفوز|الربح)|(?:و)?معدل\s+(?:النجاح|الفوز)/u, note: '성공률' },
    { id: 'ar-win-100', re: /100\s*%\s*(?:فوز|نجاح)/u, note: '성공률 100%' },
    { id: 'ar-cost-guarantee', re: /(?:و)?نضمن\s+(?:الفوز|النتيجة|النتائج|التكلفة)|(?:و)?ضمان\s+(?:الفوز|النتيجة|التكلفة)/u, note: '비용/결과 보장' },
    { id: 'ar-always-on', re: /24\s*\/\s*7|(?:و)?على\s+مدار\s+الساعة/u, note: '즉시/상시 상담' },
    { id: 'ar-free-consult', re: /(?:و)?استشارة\s+مجانية|(?:و)?مجان[اً]?\s+(?:ال)?استشارة/u, note: '비용 보장(무료 상담)' },
  ],
  de: [
    { id: 'de-consult-lang', re: /Beratung auf Deutsch|deutschsprachige Beratung|Beratung in deutscher Sprache/i, note: 'de 상담 가능' },
    { id: 'de-interpreter', re: /Dolmetscher (wird |werden )?gestellt|wir stellen (einen )?Dolmetscher|Dolmetscherservice/i, note: '통역 제공' },
    { id: 'de-immediate', re: /sofortige Antwort|Antwort innerhalb von Minuten|umgehend Antwort/i, note: '즉시 응답' },
    { id: 'de-success-rate', re: /Erfolgsquote|Gewinnquote|Erfolgsrate/i, note: '성공률' },
    { id: 'de-win-100', re: /100\s*%\s*(Erfolg|Gewinn)|Gewinn\s*100\s*%/i, note: '성공률 100%' },
    { id: 'de-cost-guarantee', re: /Kosten.?garantie|Ergebnisgarantie|wir garantieren (das Ergebnis|die Kosten)/i, note: '비용/결과 보장' },
    { id: 'de-always-on', re: /Beratung\s*24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'de-free-consult', re: /kostenlose Beratung|Beratung kostenlos|gratis Beratung/i, note: '비용 보장(무료 상담)' },
  ],
  es: [
    { id: 'es-consult-lang', re: /consulta en español|asesoramiento en español|abogados que hablan español/i, note: 'es 상담 가능' },
    { id: 'es-interpreter', re: /ponemos intérprete|intérprete disponible|servicio de intérprete/i, note: '통역 제공' },
    { id: 'es-immediate', re: /respuesta inmediata|respuesta en minutos|respondemos al instante/i, note: '즉시 응답' },
    { id: 'es-success-rate', re: /tasa de éxito|tasa de ganancia|porcentaje de éxito/i, note: '성공률' },
    { id: 'es-win-100', re: /100\s*%\s*(de )?(éxito|ganancia)|éxito\s*100\s*%/i, note: '성공률 100%' },
    { id: 'es-cost-guarantee', re: /garantía de (coste|costo|resultado)|garantizamos el resultado/i, note: '비용/결과 보장' },
    { id: 'es-always-on', re: /consulta\s*24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'es-free-consult', re: /consulta gratuita|asesoramiento gratuito/i, note: '비용 보장(무료 상담)' },
  ],
  fr: [
    { id: 'fr-consult-lang', re: /consultation en français|conseil en français|avocats? francophones/i, note: 'fr 상담 가능' },
    { id: 'fr-interpreter', re: /interprète (est |sont )?fourni|nous fournissons un interprète|service d.interprète/i, note: '통역 제공' },
    { id: 'fr-immediate', re: /réponse immédiate|réponse en quelques minutes|nous répondons aussitôt/i, note: '즉시 응답' },
    { id: 'fr-success-rate', re: /taux de réussite|taux de succès|pourcentage de réussite/i, note: '성공률' },
    { id: 'fr-win-100', re: /100\s*%\s*(de )?réussite|réussite\s*100\s*%/i, note: '성공률 100%' },
    { id: 'fr-cost-guarantee', re: /garantie de (coût|résultat)|nous garantissons le résultat/i, note: '비용/결과 보장' },
    { id: 'fr-always-on', re: /consultation\s*24\s*h?\s*\/\s*24|24h\/24/i, note: '즉시/상시 상담' },
    { id: 'fr-free-consult', re: /consultation gratuite|conseil gratuit/i, note: '비용 보장(무료 상담)' },
  ],
  pt: [
    { id: 'pt-consult-lang', re: /consulta em português|assessoria em português|advogados que falam português/i, note: 'pt 상담 가능' },
    { id: 'pt-interpreter', re: /pomos intérprete|intérprete disponível|serviço de intérprete/i, note: '통역 제공' },
    { id: 'pt-immediate', re: /resposta imediata|resposta em minutos|respondemos de imediato/i, note: '즉시 응답' },
    { id: 'pt-success-rate', re: /taxa de sucesso|taxa de êxito|percentagem de sucesso/i, note: '성공률' },
    { id: 'pt-win-100', re: /100\s*%\s*(de )?(sucesso|êxito)|sucesso\s*100\s*%/i, note: '성공률 100%' },
    { id: 'pt-cost-guarantee', re: /garantia de (custo|resultado)|garantimos o resultado/i, note: '비용/결과 보장' },
    { id: 'pt-always-on', re: /consulta\s*24\s*horas|24\s*horas/i, note: '즉시/상시 상담' },
    { id: 'pt-free-consult', re: /consulta gratuita|assessoria gratuita/i, note: '비용 보장(무료 상담)' },
  ],
  'zh-hans': [
    { id: 'zh-hans-consult-lang', re: /提供中文咨询服务/u, note: 'zh-hans 중문 상담 과장 광고' },
    { id: 'zh-hans-interpreter', re: /提供口译|口译服务|安排口译/u, note: '통역 제공' },
    { id: 'zh-hans-immediate', re: /立即回复|即时回复|几分钟内回复/u, note: '즉시 응답' },
    { id: 'zh-hans-success-rate', re: /胜诉率|成功率/u, note: '성공률' },
    { id: 'zh-hans-win-100', re: /100\s*%\s*(胜诉|成功)|胜诉\s*100\s*%/u, note: '성공률 100%' },
    { id: 'zh-hans-cost-guarantee', re: /保证(费用|结果|胜诉)|结果保证/u, note: '비용/결과 보장' },
    { id: 'zh-hans-always-on', re: /24\s*小时|全天候咨询/u, note: '즉시/상시 상담' },
    { id: 'zh-hans-free-consult', re: /免费咨询/u, note: '비용 보장(무료 상담)' },
  ],
  ms: [
    { id: 'ms-consult-lang', re: /perundingan dalam (bahasa )?Melayu|konsultasi dalam (bahasa )?Melayu/i, note: 'ms 상담 가능' },
    { id: 'ms-interpreter', re: /jurubahasa disediakan|perkhidmatan jurubahasa|penterjemah disediakan/i, note: '통역 제공' },
    { id: 'ms-immediate', re: /balasan segera|jawab serta-merta|dalam beberapa minit/i, note: '즉시 응답' },
    { id: 'ms-success-rate', re: /kadar kejayaan|kadar kemenangan/i, note: '성공률' },
    { id: 'ms-win-100', re: /100\s*%\s*(kejayaan|menang)|menang\s*100\s*%/i, note: '성공률 100%' },
    { id: 'ms-cost-guarantee', re: /jaminan (kos|hasil)|menjamin (kos|hasil)/i, note: '비용/결과 보장' },
    { id: 'ms-always-on', re: /24\s*jam|perundingan 24/i, note: '즉시/상시 상담' },
    { id: 'ms-free-consult', re: /perundingan percuma|konsultasi percuma/i, note: '비용 보장(무료 상담)' },
  ],
  ru: [
    { id: 'ru-consult-lang', re: /консультация на русском|консультации на русском языке/i, note: 'ru 상담 가능' },
    { id: 'ru-interpreter', re: /предоставляем переводчика|переводчик предоставляется|услуга устного перевода/i, note: '통역 제공' },
    { id: 'ru-immediate', re: /немедленный ответ|ответ в течение минут|отвечаем сразу/i, note: '즉시 응답' },
    { id: 'ru-success-rate', re: /процент выигранных|процент успеха|успешность дел/i, note: '성공률' },
    { id: 'ru-win-100', re: /100\s*%\s*(успеха|выигрыша)|выигрыш\s*100\s*%/i, note: '성공률 100%' },
    { id: 'ru-cost-guarantee', re: /гарантия (стоимости|результата)|гарантируем результат/i, note: '비용/결과 보장' },
    { id: 'ru-always-on', re: /круглосуточно|24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'ru-free-consult', re: /бесплатн\w* консультац/i, note: '비용 보장(무료 상담)' },
  ],
  tr: [
    { id: 'tr-consult-lang', re: /Türkçe danışma|Türkçe görüşme mümkün/i, note: 'tr 상담 가능' },
    { id: 'tr-interpreter', re: /tercüman sağlanır|tercüman hizmeti|tercüman temin/i, note: '통역 제공' },
    { id: 'tr-immediate', re: /anında yanıt|dakikalar içinde yanıt|hemen cevap/i, note: '즉시 응답' },
    { id: 'tr-success-rate', re: /başarı oranı|kazanma oranı/i, note: '성공률' },
    { id: 'tr-win-100', re: /100\s*%\s*(başarı|kazanç)|başarı\s*100\s*%/i, note: '성공률 100%' },
    { id: 'tr-cost-guarantee', re: /maliyet garantisi|sonuç garantisi|sonucu garanti/i, note: '비용/결과 보장' },
    { id: 'tr-always-on', re: /7\s*\/\s*24|24 saat danışma/i, note: '즉시/상시 상담' },
    { id: 'tr-free-consult', re: /ücretsiz danışma|ücretsiz görüşme/i, note: '비용 보장(무료 상담)' },
  ],
  it: [
    { id: 'it-consult-lang', re: /consulenza in italiano|consulenza in lingua italiana/i, note: 'it 상담 가능' },
    { id: 'it-interpreter', re: /forniamo un interprete|interprete disponibile|servizio di interprete/i, note: '통역 제공' },
    { id: 'it-immediate', re: /risposta immediata|risposta in pochi minuti|rispondiamo subito/i, note: '즉시 응답' },
    { id: 'it-success-rate', re: /tasso di successo|percentuale di vittorie/i, note: '성공률' },
    { id: 'it-win-100', re: /100\s*%\s*(di )?successo|successo\s*100\s*%/i, note: '성공률 100%' },
    { id: 'it-cost-guarantee', re: /garanzia di (costo|risultato)|garantiamo il risultato/i, note: '비용/결과 보장' },
    { id: 'it-always-on', re: /consulenza\s*24\s*\/\s*7|24 ore su 24/i, note: '즉시/상시 상담' },
    { id: 'it-free-consult', re: /gratuito/i, exemptRe: /non dice che il primo colloquio è gratuito/i, note: '비용 보장(무료 상담)' },
  ],
  nl: [
    { id: 'nl-consult-lang', re: /advies in het Nederlands|consultatie in het Nederlands/i, note: 'nl 상담 가능' },
    { id: 'nl-interpreter', re: /we stellen een tolk|tolk beschikbaar|tolkendienst/i, note: '통역 제공' },
    { id: 'nl-immediate', re: /onmiddellijk antwoord|antwoord binnen minuten|we antwoorden meteen/i, note: '즉시 응답' },
    { id: 'nl-success-rate', re: /succespercentage|winstpercentage/i, note: '성공률' },
    { id: 'nl-win-100', re: /100\s*%\s*(succes|winst)|succes\s*100\s*%/i, note: '성공률 100%' },
    { id: 'nl-cost-guarantee', re: /kostengarantie|resultaatgarantie|we garanderen het resultaat/i, note: '비용/결과 보장' },
    { id: 'nl-always-on', re: /consultatie\s*24\s*\/\s*7|24 uur per dag/i, note: '즉시/상시 상담' },
    { id: 'nl-free-consult', re: /kosteloos|gratis consultatie/i, exemptRe: /zegt niet dat het eerste gesprek kosteloos is/i, note: '비용 보장(무료 상담)' },
  ],
  pl: [
    { id: 'pl-consult-lang', re: /konsultacja po polsku|porada w języku polskim/i, note: 'pl 상담 가능' },
    { id: 'pl-interpreter', re: /zapewniamy tłumacza ustnego|tłumacz ustny dostępny|usługa tłumacza ustnego/i, note: '통역 제공' },
    { id: 'pl-immediate', re: /natychmiastowa odpowiedź|odpowiedź w ciągu minut|odpowiadamy od razu/i, note: '즉시 응답' },
    { id: 'pl-success-rate', re: /wskaźnik sukcesu|procent wygranych/i, note: '성공률' },
    { id: 'pl-win-100', re: /100\s*%\s*(sukcesu|wygranych)|sukces\s*100\s*%/i, note: '성공률 100%' },
    { id: 'pl-cost-guarantee', re: /gwarancja (kosztu|wyniku)|gwarantujemy wynik/i, note: '비용/결과 보장' },
    { id: 'pl-always-on', re: /konsultacja\s*24\s*\/\s*7|całodobowo/i, note: '즉시/상시 상담' },
    { id: 'pl-free-consult', re: /bezpłatn|darmowa porada/i, exemptRe: /nie mówi,\s*że pierwsza rozmowa jest bezpłatna/i, note: '비용 보장(무료 상담)' },
  ],
  hi: [
    { id: 'hi-consult-lang', re: /हिन्दी में परामर्श|हिंदी में परामर्श|हिन्दी परामर्श संभव/i, note: 'hi 상담 가능' },
    { id: 'hi-interpreter', re: /दुभाषिया प्रदान|दुभाषिए की सेवा|अनुवादक उपलब्ध/i, note: '통역 제공' },
    { id: 'hi-immediate', re: /तुरंत उत्तर|कुछ मिनटों में उत्तर|तत्काल प्रतिक्रिया/i, note: '즉시 응답' },
    { id: 'hi-success-rate', re: /जीत की दर|सफलता दर/i, note: '성공률' },
    { id: 'hi-win-100', re: /100\s*%\s*(सफलता|जीत)|जीत\s*100\s*%/i, note: '성공률 100%' },
    { id: 'hi-cost-guarantee', re: /परिणाम की गारंटी|लागत की गारंटी|गारंटी/i, note: '비용/결과 보장' },
    { id: 'hi-always-on', re: /24 घंटे|24\s*\/\s*7/i, note: '즉시/상시 상담' },
    { id: 'hi-free-consult', re: /मुफ्त परामर्श|निःशुल्क परामर्श/i, note: '비용 보장(무료 상담)' },
  ],
  sv: [
    { id: 'sv-consult-lang', re: /rådgivning på svenska|konsultation på svenska/i, note: 'sv 상담 가능' },
    { id: 'sv-interpreter', re: /vi ställer en tolk|tolk tillgänglig|tolkservice/i, note: '통역 제공' },
    { id: 'sv-immediate', re: /omedelbart svar|svar inom minuter|vi svarar genast/i, note: '즉시 응답' },
    { id: 'sv-success-rate', re: /framgångsgrad|vinstprocent/i, note: '성공률' },
    { id: 'sv-win-100', re: /100\s*%\s*(framgång|vinst)|framgång\s*100\s*%/i, note: '성공률 100%' },
    { id: 'sv-cost-guarantee', re: /kostnadsgaranti|resultatgaranti|vi garanterar resultatet/i, note: '비용/결과 보장' },
    { id: 'sv-always-on', re: /rådgivning\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'sv-free-consult', re: /gratis konsultation|kostnadsfri rådgivning/i, note: '비용 보장(무료 상담)' },
  ],
  da: [
    { id: 'da-consult-lang', re: /rådgivning på dansk|konsultation på dansk/i, note: 'da 상담 가능' },
    { id: 'da-interpreter', re: /vi stiller en tolk|tolk tilgængelig|tolkeservice/i, note: '통역 제공' },
    { id: 'da-immediate', re: /øjeblikkeligt svar|svar inden for minutter|vi svarer med det samme/i, note: '즉시 응답' },
    { id: 'da-success-rate', re: /succesrate|gevinstprocent/i, note: '성공률' },
    { id: 'da-win-100', re: /100\s*%\s*(succes|gevinst)|succes\s*100\s*%/i, note: '성공률 100%' },
    { id: 'da-cost-guarantee', re: /omkostningsgaranti|resultatgaranti|vi garanterer resultatet/i, note: '비용/결과 보장' },
    { id: 'da-always-on', re: /rådgivning\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'da-free-consult', re: /gratis rådgivning|omkostningsfri rådgivning/i, note: '비용 보장(무료 상담)' },
  ],
  nb: [
    { id: 'nb-consult-lang', re: /rådgivning på norsk|konsultasjon på norsk/i, note: 'nb 상담 가능' },
    { id: 'nb-interpreter', re: /vi stiller en tolk|tolk tilgjengelig|tolketjeneste/i, note: '통역 제공' },
    { id: 'nb-immediate', re: /umiddelbart svar|svar innen minutter|vi svarer med en gang/i, note: '즉시 응답' },
    { id: 'nb-success-rate', re: /suksessrate|gevinstprosent/i, note: '성공률' },
    { id: 'nb-win-100', re: /100\s*%\s*(suksess|gevinst)|suksess\s*100\s*%/i, note: '성공률 100%' },
    { id: 'nb-cost-guarantee', re: /kostnadsgaranti|resultatgaranti|vi garanterer resultatet/i, note: '비용/결과 보장' },
    { id: 'nb-always-on', re: /rådgivning\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'nb-free-consult', re: /gratis konsultasjon|kostnadsfri rådgivning/i, note: '비용 보장(무료 상담)' },
  ],
  fi: [
    { id: 'fi-consult-lang', re: /neuvontaa suomeksi|konsultaatio suomeksi/i, note: 'fi 상담 가능' },
    { id: 'fi-interpreter', re: /asetamme tulkin|tulkki saatavilla|tulkkauspalvelu/i, note: '통역 제공' },
    { id: 'fi-immediate', re: /välitön vastaus|vastaus minuuteissa|vastaamme heti/i, note: '즉시 응답' },
    { id: 'fi-success-rate', re: /voittoprosentti|menestysprosentti/i, note: '성공률' },
    { id: 'fi-win-100', re: /100\s*%\s*(menestys|voitto)|voitto\s*100\s*%/i, note: '성공률 100%' },
    { id: 'fi-cost-guarantee', re: /kustannustakuu|tulostakuu|takuu/i, note: '비용/결과 보장' },
    { id: 'fi-always-on', re: /neuvonta\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'fi-free-consult', re: /ilmainen konsultaatio|maksuton neuvonta/i, note: '비용 보장(무료 상담)' },
  ],
  cs: [
    { id: 'cs-consult-lang', re: /porada v češtině|konzultace v češtině|poradenství česky/i, note: 'cs 상담 가능' },
    { id: 'cs-interpreter', re: /zajistíme tlumočníka|tlumočník k dispozici|tlumočnická služba/i, note: '통역 제공' },
    { id: 'cs-immediate', re: /okamžitá odpověď|odpovíme ihned|odpověď do minuty/i, note: '즉시 응답' },
    { id: 'cs-success-rate', re: /úspěšnost \d|míra úspěšnosti/i, note: '성공률' },
    { id: 'cs-win-100', re: /100\s*%\s*úspěch|úspěch\s*100\s*%/i, note: '성공률 100%' },
    { id: 'cs-cost-guarantee', re: /záruka nákladů|záruka výsledku|garantujeme/i, note: '비용/결과 보장' },
    { id: 'cs-always-on', re: /poradenství\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'cs-free-consult', re: /bezplatná konzultace|konzultace zdarma/i, note: '비용 보장(무료 상담)' },
  ],
  hu: [
    { id: 'hu-consult-lang', re: /tanácsadás magyarul|magyar nyelvű tanácsadás/i, note: 'hu 상담 가능' },
    { id: 'hu-interpreter', re: /tolmácsot biztosítunk|tolmács elérhető|tolmácsszolgálat/i, note: '통역 제공' },
    { id: 'hu-immediate', re: /azonnali válasz|perceken belül válaszolunk/i, note: '즉시 응답' },
    { id: 'hu-success-rate', re: /sikerességi arány|nyerési arány/i, note: '성공률' },
    { id: 'hu-win-100', re: /100\s*%\s*siker|siker\s*100\s*%/i, note: '성공률 100%' },
    { id: 'hu-cost-guarantee', re: /költséggarancia|eredménygarancia|garantáljuk/i, note: '비용/결과 보장' },
    { id: 'hu-always-on', re: /tanácsadás\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'hu-free-consult', re: /ingyenes tanácsadás|díjmentes konzultáció/i, note: '비용 보장(무료 상담)' },
  ],
  ro: [
    { id: 'ro-consult-lang', re: /consultanță în română|consultanță în limba română/i, note: 'ro 상담 가능' },
    { id: 'ro-interpreter', re: /asigurăm interpret|interpret disponibil|serviciu de interpretariat/i, note: '통역 제공' },
    { id: 'ro-immediate', re: /răspuns imediat|răspundem imediat/i, note: '즉시 응답' },
    { id: 'ro-success-rate', re: /rata de succes|procent de câștig/i, note: '성공률' },
    { id: 'ro-win-100', re: /100\s*%\s*succes|succes\s*100\s*%/i, note: '성공률 100%' },
    { id: 'ro-cost-guarantee', re: /garanție de cost|garanția rezultatului|garantăm/i, note: '비용/결과 보장' },
    { id: 'ro-always-on', re: /consultanță\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'ro-free-consult', re: /consultanță gratuită|consultație gratuită/i, note: '비용 보장(무료 상담)' },
  ],
  uk: [
    { id: 'uk-consult-lang', re: /консультація українською|консультування українською/i, note: 'uk 상담 가능' },
    { id: 'uk-interpreter', re: /надаємо перекладача|перекладач доступний|послуги перекладача/i, note: '통역 제공' },
    { id: 'uk-immediate', re: /негайна відповідь|відповідаємо одразу/i, note: '즉시 응답' },
    { id: 'uk-success-rate', re: /відсоток виграних|показник успішності/i, note: '성공률' },
    { id: 'uk-win-100', re: /100\s*%\s*успіх|успіх\s*100\s*%/i, note: '성공률 100%' },
    { id: 'uk-cost-guarantee', re: /гарантія вартості|гарантія результату|гарантуємо/i, note: '비용/결과 보장' },
    { id: 'uk-always-on', re: /консультації\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'uk-free-consult', re: /безкоштовна консультація|безоплатна консультація/i, note: '비용 보장(무료 상담)' },
  ],
  el: [
    { id: 'el-consult-lang', re: /συμβουλευτική στα ελληνικά|νομική συμβουλή στα ελληνικά/i, note: 'el 상담 가능' },
    { id: 'el-interpreter', re: /παρέχουμε διερμηνέα|διερμηνέας διαθέσιμος|υπηρεσία διερμηνείας/i, note: '통역 제공' },
    { id: 'el-immediate', re: /άμεση απάντηση|απαντούμε αμέσως/i, note: '즉시 응답' },
    { id: 'el-success-rate', re: /ποσοστό επιτυχίας|ποσοστό νικών/i, note: '성공률' },
    { id: 'el-win-100', re: /100\s*%\s*επιτυχία|επιτυχία\s*100\s*%/i, note: '성공률 100%' },
    { id: 'el-cost-guarantee', re: /εγγύηση κόστους|εγγύηση αποτελέσματος|εγγυόμαστε/i, note: '비용/결과 보장' },
    { id: 'el-always-on', re: /συμβουλευτική\s*24\s*\/\s*7|24\/7/i, note: '즉시/상시 상담' },
    { id: 'el-free-consult', re: /δωρεάν συμβουλευτική|δωρεάν νομική συμβουλή/i, note: '비용 보장(무료 상담)' },
  ],
  he: [
    { id: 'he-consult-lang', re: /ייעוץ בעברית|ייעוץ משפטי בעברית/, note: 'he 상담 가능' },
    { id: 'he-interpreter', re: /נספק מתורגמן|מתורגמן זמין|שירותי תרגום סימולטני/, note: '통역 제공' },
    { id: 'he-immediate', re: /מענה מיידי|נשיב מיד/, note: '즉시 응답' },
    { id: 'he-success-rate', re: /שיעור הצלחה|אחוזי זכייה/, note: '성공률' },
    { id: 'he-win-100', re: /100\s*%\s*הצלחה|הצלחה\s*100\s*%/, note: '성공률 100%' },
    { id: 'he-cost-guarantee', re: /ערבות לעלות|הבטחת תוצאה|אנו מבטיחים/, note: '비용/결과 보장' },
    { id: 'he-always-on', re: /ייעוץ\s*24\s*\/\s*7|24\/7/, note: '즉시/상시 상담' },
    { id: 'he-free-consult', re: /ייעוץ חינם|ייעוץ ללא תשלום/, note: '비용 보장(무료 상담)' },
  ],
};

/** Locale-prefix swaps that are allowed; everything else must stay byte-identical to source href. */
export const ALLOWED_HREF_TRANSFORMS = [
  { id: 'columns', from: /^\/ko\/columns(\/.*)?$/, to: (lang, m) => `/${lang}/columns${m[1] ?? ''}` },
  { id: 'contact', from: /^\/ko\/contact$/, to: (lang) => `/${lang}/contact` },
  { id: 'services', from: /^\/ko\/services$/, to: (lang) => `/${lang}/services` },
  { id: 'faq', from: /^\/ko\/faq$/, to: (lang) => `/${lang}/faq` },
  { id: 'pricing', from: /^\/ko\/pricing$/, to: (lang) => `/${lang}/pricing` },
];

export const CHECK_IDS = [
  'frontmatter',
  'headings',
  'images',
  'blocks',
  'links',
  'hangul',
  'english',
  'forbidden',
  'hanzi',
  'numbers',
  'nationality',
  'langid',
  'currency',
];

export const DEFAULT_ADAPT_DIR = '/Users/son7/Projects/tseng-law-sea-state/columns/work';

/** Reader-nationality / country terms that must not appear unless the source block already names a country. */
export const NATIONALITY_TERMS = {
  vi: ['quốc tịch Việt Nam', 'Việt Nam', 'Việt'],
  id: ['kewarganegaraan Indonesia', 'Indonesia', 'WNI'],
  th: ['สัญชาติไทย', 'คนไทย', 'ไทย'],
  fil: ['pagkamamamayang Pilipino', 'Pilipinas', 'Pilipino', 'Filipino'],
  ar: [
    'الجنسية الكورية',
    'كوريا الجنوبية',
    'كوريا',
    'الكوريون',
    'الكوريين',
    'فيتنام',
    'إندونيسيا',
    'تايلاند',
    'الفلبين',
    'اليابان',
    'الصين',
    'الولايات المتحدة',
    'أمريكا',
    'السعودية',
    'الإمارات',
    'مصر',
    'قطر',
    'الكويت',
    'البحرين',
    'عُمان',
    'عمان',
  ],
  de: ['Deutschland', 'deutsche Staatsangehörigkeit', 'deutscher Staatsangehöriger', 'deutsche Unternehmen'],
  es: ['España', 'nacionalidad española', 'empresas españolas', 'españoles'],
  fr: ['France', 'nationalité française', 'entreprises françaises', 'Français'],
  pt: ['Portugal', 'nacionalidade portuguesa', 'empresas portuguesas', 'portugueses', 'Brasil', 'brasileiros'],
  'zh-hans': ['中国国籍', '中国企业', '中国人', '大陆企业'],
  ms: ['kewarganegaraan Malaysia', 'Malaysia', 'Malaysia', 'warganegara Malaysia'],
  ru: ['Россия', 'российское гражданство', 'российские предприятия', 'россияне'],
  tr: ['Türkiye', 'Türk vatandaşlığı', 'Türk şirketleri', 'Türkler'],
  it: ['Italia', 'cittadinanza italiana', 'imprese italiane', 'italiani'],
  nl: ['Nederland', 'Nederlandse nationaliteit', 'Nederlandse ondernemingen', 'Nederlanders'],
  pl: ['Polska', 'obywatelstwo polskie', 'polskie przedsiębiorstwa', 'Polacy'],
  hi: ['भारत', 'भारतीय नागरिकता', 'भारतीय उद्यम', 'भारतीय'],
  sv: ['Sverige', 'svenskt medborgarskap', 'svenska företag', 'svenskar'],
  da: ['Danmark', 'dansk statsborgerskab', 'danske virksomheder', 'danskere'],
  nb: ['Norge', 'norsk statsborgerskap', 'norske virksomheter', 'nordmenn'],
  fi: ['Suomi', 'Suomen kansalaisuus', 'suomalaiset yritykset', 'suomalaiset'],
  cs: ['české občanství', 'Česká republika', 'český'],
  hu: ['magyar állampolgárság', 'Magyarország', 'magyar'],
  ro: ['cetățenie română', 'România', 'român'],
  uk: ['українське громадянство', 'Україна', 'український'],
  el: ['ελληνική ιθαγένεια', 'Ελλάδα', 'ελληνικ'],
  he: ['אזרחות ישראלית', 'ישראל', 'ישראלי'],
};

export const NATIONALITY_LANGUAGE_NAMES = {
  vi: [/tiếng\s*việt/giu, /ngôn\s*ngữ\s*việt(?:\s*nam)?/giu],
  id: [/bahasa\s*indonesia/gi],
  th: [/ภาษาไทย/gu],
  fil: [/wikang\s+filipino/gi, /\bsa\s+filipino\b/gi, /filipino\s+language/gi],
  ar: [/اللغة\s*العربية/gu, /بالعربية/gu, /اللغة\s*الكورية/gu, /بالكورية/gu],
  de: [/auf Deutsch/gi, /deutsche Sprache/gi, /in deutscher Sprache/gi],
  es: [/en español/gi, /idioma español/gi, /lengua española/gi],
  fr: [/en français/gi, /langue française/gi, /en langue française/gi],
  pt: [/em português/gi, /língua portuguesa/gi, /idioma português/gi],
  'zh-hans': [/用中文/gu, /中文咨询/gu, /简体中文/gu],
  ms: [/bahasa\s*melayu/gi, /dalam\s+bahasa\s+melayu/gi],
  ru: [/на русском/gi, /русском языке/gi, /по-русски/gi],
  tr: [/Türkçe/gi, /Türk dilinde/gi],
  it: [/in italiano/gi, /lingua italiana/gi, /in lingua italiana/gi],
  nl: [/in het Nederlands/gi, /Nederlandse taal/gi],
  pl: [/po polsku/gi, /w języku polskim/gi, /język polski/gi],
  hi: [/हिन्दी में/gi, /हिंदी में/gi, /हिन्दी भाषा/gi],
  sv: [/på svenska/gi, /svenska språket/gi],
  da: [/på dansk/gi, /dansk sprog/gi],
  nb: [/på norsk/gi, /norsk språk/gi],
  fi: [/suomeksi/gi, /suomen kielellä/gi],
  cs: [/v češtině/gi, /český jazyk/gi, /česky/gi],
  hu: [/magyarul/gi, /magyar nyelven/gi],
  ro: [/în română/gi, /în limba română/gi],
  uk: [/українською/gi, /українською мовою/gi],
  el: [/στα ελληνικά/gi, /ελληνική γλώσσα/gi],
  he: [/בעברית/g, /בשפה העברית/g],
};

export const SOURCE_LANGUAGE_NAME_RE = /한국어|베트남어|인도네시아어|태국어|필리핀어|영어|일본어|중국어|타이완어|대만어/g;

export const SOURCE_NATIONALITY_RE = /대한민국|한국인|한국적|한국|베트남인|베트남|인도네시아인|인도네시아|태국인|태국|필리핀인|필리핀|일본인|일본|중국인|중국|미국인|미국|국적|국민/;

/**
 * Thousand-separator convention for leftover numerals after 만/日期 consumption.
 * Ground (WO-G24 + live SEA columns): id/vi legal TWD amounts use EU/SEA dots
 * (`40.000`, `1.000.000`); th/fil use English commas (`40,000`, `1,000,000`);
 * ko uses commas plus 만/억 (`2,000만`, `1,000,000`). Prefer noise over misses.
 */
export const NUMBER_THOUSAND_STYLE = {
  ko: 'comma',
  vi: 'dot',
  id: 'dot',
  th: 'comma',
  fil: 'comma',
  ar: 'comma',
  de: 'dot',
  es: 'dot',
  fr: 'dot',
  pt: 'dot',
  'zh-hans': 'comma',
  ms: 'dot',
  ru: 'dot',
  tr: 'dot',
  it: 'dot',
  nl: 'dot',
  pl: 'dot',
  hi: 'comma',
  sv: 'dot',
  da: 'dot',
  nb: 'dot',
  fi: 'dot',
  cs: 'dot',
  hu: 'dot',
  ro: 'dot',
  uk: 'dot',
  el: 'dot',
  he: 'comma',
};

/**
 * Sino-Korean / Han unit multipliers applied on both source and target
 * (translations often keep 萬/億 inside 병기). Ground: WO-G24 examples
 * `4만`→40000, `157만`→1570000, `2,000만`→20000000; column 004 `20억` ↔
 * id `TWD 2.000.000.000`. 억 is included to avoid false FAILs on correctly
 * expanded 억 amounts; omitting it would miss less but yell more on every
 * 억 sentence — still prefer matching the unit the translator expanded.
 */
export const SINO_UNIT_MULTIPLIERS = [
  { unit: /억|億/u, factor: 100_000_000, name: 'eok' },
  { unit: /만|萬/u, factor: 10_000, name: 'man' },
];

/**
 * Frontmatter keys excluded from number extraction.
 * Ground: url/lastmod/featured_image are already byte-compared in checkFrontmatter
 * and inject path/ISO digits that are not legal quantities. read_time is
 * recomputed per language (006: ko `2분` vs vi `4 phút`) and is not a claim.
 */
export const NUMBER_SKIP_FRONTMATTER_KEYS = ['url', 'lastmod', 'featured_image', 'read_time'];

/**
 * Per-language values dropped after normalization. Empty on purpose — WO-G24
 * says prefer noise over misses. Add a cited false-positive here, not a regex
 * that swallows article numbers or fines.
 */
export const NUMBER_LANG_EXCEPTIONS = {
  ko: [],
  vi: [],
  id: [],
  th: [],
  fil: [],
  ar: [],
  de: [],
  es: [],
  fr: [],
  pt: [],
};

/** Thai พ.ศ. year minus this offset is Gregorian. ค.ศ. is already Gregorian. */
export const THAI_BUDDHIST_ERA_OFFSET = 543;

/**
 * Large-unit words that multiply a preceding digit/decimal (`1.57 milyon` → 1570000).
 * Longer spellings first (milyong before milyon). Isolated unit with no coefficient
 * is NOT a value — leftover hits become 수사 미해석 WARN.
 */
export const MAGNITUDE_WORDS = {
  ko: [],
  vi: [
    { word: 'tỷ', factor: 1_000_000_000 },
    { word: 'triệu', factor: 1_000_000 },
    { word: 'nghìn', factor: 1_000 },
    { word: 'ngàn', factor: 1_000 },
    { word: 'trăm', factor: 100 },
  ],
  id: [
    { word: 'miliar', factor: 1_000_000_000 },
    { word: 'juta', factor: 1_000_000 },
    { word: 'ribu', factor: 1_000 },
    { word: 'ratus', factor: 100 },
  ],
  th: [
    { word: 'ล้าน', factor: 1_000_000 },
    { word: 'แสน', factor: 100_000 },
    { word: 'หมื่น', factor: 10_000 },
    { word: 'พัน', factor: 1_000 },
    { word: 'ร้อย', factor: 100 },
  ],
  fil: [
    { word: 'bilyon', factor: 1_000_000_000 },
    { word: 'milyong', factor: 1_000_000 },
    { word: 'milyon', factor: 1_000_000 },
    { word: 'libong', factor: 1_000 },
    { word: 'libo', factor: 1_000 },
    { word: 'daan', factor: 100 },
  ],
  ar: [
    { word: 'مليار', factor: 1_000_000_000 },
    { word: 'مليون', factor: 1_000_000 },
    { word: 'ألف', factor: 1_000 },
    { word: 'مئة', factor: 100 },
    { word: 'مائة', factor: 100 },
  ],
  de: [
    { word: 'milliarden', factor: 1_000_000_000 },
    { word: 'milliarde', factor: 1_000_000_000 },
    { word: 'millionen', factor: 1_000_000 },
    { word: 'million', factor: 1_000_000 },
    { word: 'tausend', factor: 1_000 },
  ],
  es: [
    { word: 'mil millones', factor: 1_000_000_000 },
    { word: 'millones', factor: 1_000_000 },
    { word: 'millón', factor: 1_000_000 },
    { word: 'millon', factor: 1_000_000 },
    { word: 'mil', factor: 1_000 },
  ],
  fr: [
    { word: 'milliards', factor: 1_000_000_000 },
    { word: 'milliard', factor: 1_000_000_000 },
    { word: 'millions', factor: 1_000_000 },
    { word: 'million', factor: 1_000_000 },
    { word: 'mille', factor: 1_000 },
  ],
  pt: [
    { word: 'mil milhões', factor: 1_000_000_000 },
    { word: 'milhoes', factor: 1_000_000 },
    { word: 'milhões', factor: 1_000_000 },
    { word: 'milhão', factor: 1_000_000 },
    { word: 'milhao', factor: 1_000_000 },
    { word: 'mil', factor: 1_000 },
  ],
};

/** Approximation markers: do not emit a number; the adjacent numeral still does. */
export const APPROX_MARKERS = {
  ko: ['약', '여', '남짓', '가량', '정도'],
  vi: ['khoảng', 'xấp xỉ', 'gần', 'khoảng chừng'],
  id: ['sekitar', 'kira-kira', 'kurang lebih', 'hampir'],
  th: ['ประมาณ', 'ราว', 'ประมาณว่า'],
  fil: ['humigit-kumulang', 'halos', 'mga'],
  de: ['etwa', 'rund', 'ungefähr', 'circa', 'zirka'],
  es: ['aproximadamente', 'cerca de', 'unos', 'unas'],
  fr: ['environ', 'près de', 'quelque', 'approximativement'],
  pt: ['aproximadamente', 'cerca de', 'uns', 'umas'],
};

/**
 * Leftover morphology that looks like a numeral construction we failed to reduce.
 * Applied only after dictionary consumption so known spellings do not warn.
 */
export const UNPARSED_NUMERAL_HINTS = {
  vi: /(?:[A-Za-z0-9]{2,})\s+(?:triệu|tỷ|nghìn|ngàn|trăm)\b|(?<!\p{L})mươi(?!\p{L})|(?<!\p{L})phần\s+(?:ba|hai|tư)(?!\p{L})/giu,
  id: /(?:[A-Za-z0-9]{2,})\s+(?:juta|miliar|ribu|ratus)\b|\b(?:belas|puluh|pertiga|perempat)\b/gi,
  th: /(?:[A-Za-z0-9]+)\s*(?:ล้าน|แสน|หมื่น|พัน|ร้อย)(?![\u0E00-\u0E7F])/gu,
  fil: /(?:[A-Za-z0-9]{2,})\s+milyon(?:g)?\b|\b(?:bilyon|katlo|labing-?\w+)\b/gi,
  ar: /(?:[\p{L}0-9]{2,})\s+(?:مليون|مليار|ألف|مئة|مائة)(?![\p{L}\p{M}])/gu,
  de: /(?:[A-Za-z0-9]{2,})\s+(?:Million(?:en)?|Milliarde(?:n)?|Tausend)\b/gi,
  es: /(?:[A-Za-z0-9]{2,})\s+(?:millones|millón|millon)\b/gi,
  fr: /(?:[A-Za-z0-9]{2,})\s+(?:million(?:s)?|milliard(?:s)?|mille)\b/gi,
  pt: /(?:[A-Za-z0-9]{2,})\s+(?:milh[oõ]es|milh[aã]o|mil)\b/gi,
};

function pushPhrase(entries, phrase, values) {
  const normalized = String(phrase).normalize('NFC').trim();
  if (!normalized || !values.length) return;
  entries.push({ phrase: normalized, values: values.slice() });
}

function compilePhrases(entries) {
  const seen = new Set();
  const out = [];
  const sorted = entries.slice().sort((a, b) => {
    const byLen = b.phrase.length - a.phrase.length;
    if (byLen) return byLen;
    const byWords = (b.phrase.match(/\s+/g) || []).length - (a.phrase.match(/\s+/g) || []).length;
    if (byWords) return byWords;
    return a.phrase.localeCompare(b.phrase);
  });
  for (const entry of sorted) {
    if (seen.has(entry.phrase)) continue;
    seen.add(entry.phrase);
    const escaped = entry.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const thai = /[\u0E00-\u0E7F]/.test(entry.phrase);
    const arabic = /[\u0600-\u06FF]/.test(entry.phrase);
    let re;
    if (thai) {
      re = new RegExp(escaped, 'gu');
    } else if (arabic) {
      // JS \b is ASCII-only. Bound Arabic spellings by a letter/mark edge
      // (space, punctuation, start/end) so عشر does not fire inside عشرون
      // and ربع does not fire inside أربعة.
      re = new RegExp(`(?<![\\p{L}\\p{M}])${escaped}(?![\\p{L}\\p{M}])`, 'gu');
    } else {
      re = new RegExp(`\\b${escaped}\\b`, 'giu');
    }
    out.push({ phrase: entry.phrase, values: entry.values, re });
  }
  return out;
}

function buildViLexicon() {
  const entries = [];
  const units = ['năm', 'tháng', 'ngày', 'tuần', 'lần', 'giờ', 'người', 'cái', 'ngành', 'nghề'];
  const scales = [['tỷ', 1_000_000_000], ['triệu', 1_000_000], ['nghìn', 1_000], ['ngàn', 1_000], ['trăm', 100]];
  const atoms = [
    ['không', 0], ['một', 1], ['hai', 2], ['ba', 3], ['bốn', 4],
    ['sáu', 6], ['bảy', 7], ['tám', 8], ['chín', 9], ['mười', 10],
  ];
  pushPhrase(entries, 'hai phần ba', [2, 3]);
  pushPhrase(entries, 'một phần ba', [1, 3]);
  pushPhrase(entries, 'một phần hai', [1, 2]);
  pushPhrase(entries, 'hai phần tư', [2, 4]);
  pushPhrase(entries, 'một nửa', [1, 2]);
  const teens = ['một', 'hai', 'ba', 'bốn', 'lăm', 'sáu', 'bảy', 'tám', 'chín'];
  teens.forEach((word, i) => {
    const n = i === 4 ? 15 : 11 + i;
    if (i === 4) pushPhrase(entries, 'mười lăm', [15]);
    else pushPhrase(entries, `mười ${word}`, [n]);
  });
  const tens = [
    ['hai mươi', 20], ['ba mươi', 30], ['bốn mươi', 40], ['năm mươi', 50],
    ['sáu mươi', 60], ['bảy mươi', 70], ['tám mươi', 80], ['chín mươi', 90],
  ];
  const ones = [
    ['mốt', 1], ['một', 1], ['hai', 2], ['ba', 3], ['bốn', 4], ['tư', 4],
    ['lăm', 5], ['năm', 5], ['sáu', 6], ['bảy', 7], ['tám', 8], ['chín', 9],
  ];
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t} ${o}`, [tv + ov]);
  }
  for (const [atom, value] of [...atoms, ['năm', 5], ['lăm', 5], ['tư', 4]]) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value >= 2 && atom !== 'năm' && atom !== 'tư') pushPhrase(entries, atom, [value]);
  }
  for (const unit of units) {
    pushPhrase(entries, `một ${unit}`, [1]);
    pushPhrase(entries, `mốt ${unit}`, [1]);
    pushPhrase(entries, `năm ${unit}`, [5]);
  }
  return compilePhrases(entries);
}

function buildIdLexicon() {
  const entries = [];
  const units = ['tahun', 'bulan', 'hari', 'minggu', 'kali', 'orang', 'bidang', 'pasal', 'buah', 'item'];
  const scales = [['miliar', 1_000_000_000], ['juta', 1_000_000], ['ribu', 1_000], ['ratus', 100]];
  const atoms = [
    ['nol', 0], ['satu', 1], ['dua', 2], ['tiga', 3], ['empat', 4], ['lima', 5],
    ['enam', 6], ['tujuh', 7], ['delapan', 8], ['sembilan', 9], ['sepuluh', 10],
  ];
  pushPhrase(entries, 'dua pertiga', [2, 3]);
  pushPhrase(entries, 'dua per tiga', [2, 3]);
  pushPhrase(entries, 'sepertiga', [1, 3]);
  pushPhrase(entries, 'se per tiga', [1, 3]);
  pushPhrase(entries, 'seperempat', [1, 4]);
  pushPhrase(entries, 'tiga perempat', [3, 4]);
  pushPhrase(entries, 'setengah', [1, 2]);
  pushPhrase(entries, 'separuh', [1, 2]);
  const teenWords = ['sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  teenWords.forEach((phrase, i) => pushPhrase(entries, phrase, [11 + i]));
  const tens = [
    ['dua puluh', 20], ['tiga puluh', 30], ['empat puluh', 40], ['lima puluh', 50],
    ['enam puluh', 60], ['tujuh puluh', 70], ['delapan puluh', 80], ['sembilan puluh', 90],
  ];
  const ones = atoms.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t} ${o}`, [tv + ov]);
  }
  pushPhrase(entries, 'seratus', [100]);
  pushPhrase(entries, 'seribu', [1000]);
  pushPhrase(entries, 'sejuta', [1_000_000]);
  pushPhrase(entries, 'setahun', [1]);
  pushPhrase(entries, 'sebulan', [1]);
  pushPhrase(entries, 'sehari', [1]);
  pushPhrase(entries, 'seminggu', [1]);
  pushPhrase(entries, 'sekali', [1]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildThLexicon() {
  const entries = [];
  const units = ['ปี', 'เดือน', 'วัน', 'สัปดาห์', 'ครั้ง', 'คน', 'ราย', 'ข้อ'];
  const scales = [['ล้าน', 1_000_000], ['แสน', 100_000], ['หมื่น', 10_000], ['พัน', 1_000], ['ร้อย', 100]];
  const atoms = [
    ['ศูนย์', 0], ['หนึ่ง', 1], ['เอ็ด', 1], ['สอง', 2], ['สาม', 3], ['สี่', 4],
    ['ห้า', 5], ['หก', 6], ['เจ็ด', 7], ['แปด', 8], ['เก้า', 9], ['สิบ', 10],
  ];
  pushPhrase(entries, 'สองในสาม', [2, 3]);
  pushPhrase(entries, 'หนึ่งในสาม', [1, 3]);
  pushPhrase(entries, 'หนึ่งในสอง', [1, 2]);
  pushPhrase(entries, 'สามในสี่', [3, 4]);
  pushPhrase(entries, 'กึ่งหนึ่ง', [1, 2]);
  pushPhrase(entries, 'ครึ่ง', [1, 2]);
  const teenOnes = ['เอ็ด', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  teenOnes.forEach((word, i) => pushPhrase(entries, `สิบ${word}`, [11 + i]));
  const tens = [
    ['ยี่สิบ', 20], ['สามสิบ', 30], ['สี่สิบ', 40], ['ห้าสิบ', 50],
    ['หกสิบ', 60], ['เจ็ดสิบ', 70], ['แปดสิบ', 80], ['เก้าสิบ', 90],
  ];
  const ones = [['เอ็ด', 1], ['หนึ่ง', 1], ['สอง', 2], ['สาม', 3], ['สี่', 4], ['ห้า', 5], ['หก', 6], ['เจ็ด', 7], ['แปด', 8], ['เก้า', 9]];
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t}${o}`, [tv + ov]);
  }
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) {
        pushPhrase(entries, `${atom}${scale}`, [value * factor]);
        pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
      }
    }
    if (value === 1) {
      for (const unit of units) {
        pushPhrase(entries, `${atom}${unit}`, [value]);
        pushPhrase(entries, `${atom} ${unit}`, [value]);
      }
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function filForms(stem) {
  const forms = new Set([stem]);
  if (/[aeiou]$/i.test(stem) || /n$/i.test(stem)) {
    forms.add(`${stem}ng`);
    if (/n$/i.test(stem)) forms.add(`${stem}g`);
  } else {
    forms.add(`${stem} na`);
  }
  return [...forms];
}

function buildFilLexicon() {
  const entries = [];
  const units = ['taon', 'buwan', 'araw', 'linggo', 'beses', 'tao', 'uri', 'item', 'araw'];
  const scales = [['bilyon', 1_000_000_000], ['milyong', 1_000_000], ['milyon', 1_000_000], ['libo', 1_000], ['daan', 100]];
  const atomPairs = [
    ['isa', 1], ['dalawa', 2], ['tatlo', 3], ['apat', 4], ['lima', 5],
    ['anim', 6], ['pito', 7], ['walo', 8], ['siyam', 9], ['sampu', 10],
  ];
  pushPhrase(entries, 'dalawang katlo', [2, 3]);
  pushPhrase(entries, 'dalawa katlo', [2, 3]);
  pushPhrase(entries, 'ikatlo', [1, 3]);
  pushPhrase(entries, 'isang ikatlo', [1, 3]);
  pushPhrase(entries, 'isang katlo', [1, 3]);
  pushPhrase(entries, 'tig-isang katlo', [1, 3]);
  pushPhrase(entries, 'kalahati', [1, 2]);
  const teens = [
    ['labing-isa', 11], ['labing isa', 11], ['labingisa', 11],
    ['labindalawa', 12], ['labin dalawa', 12],
    ['labintatlo', 13], ['labin tatlo', 13],
    ['labing-apat', 14], ['labing apat', 14],
    ['labinlima', 15], ['labin lima', 15],
    ['labing-anim', 16], ['labing anim', 16],
    ['labimpito', 17], ['labin pito', 17],
    ['labingwalo', 18], ['labing-walo', 18], ['labing walo', 18],
    ['labinsiyam', 19], ['labin siyam', 19],
  ];
  for (const [phrase, value] of teens) {
    for (const form of filForms(phrase)) pushPhrase(entries, form, [value]);
    pushPhrase(entries, phrase, [value]);
  }
  const tens = [
    ['dalawampu', 20], ['tatlumpu', 30], ['apatnapu', 40], ['limampu', 50],
    ['animnapu', 60], ['pitumpu', 70], ['walumpu', 80], ['siyamnapu', 90],
  ];
  const ones = atomPairs.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const form of filForms(t)) pushPhrase(entries, form, [tv]);
    for (const [o, ov] of ones) {
      pushPhrase(entries, `${t}'t ${o}`, [tv + ov]);
      pushPhrase(entries, `${t}t ${o}`, [tv + ov]);
      pushPhrase(entries, `${t} ${o}`, [tv + ov]);
    }
  }
  pushPhrase(entries, 'isandaan', [100]);
  pushPhrase(entries, 'isanlibo', [1000]);
  for (const [atom, value] of atomPairs) {
    const forms = filForms(atom);
    if (value >= 1) {
      for (const form of forms) {
        for (const [scale, factor] of scales) pushPhrase(entries, `${form} ${scale}`, [value * factor]);
      }
    }
    if (value === 1) {
      for (const form of forms) {
        for (const unit of units) pushPhrase(entries, `${form} ${unit}`, [value]);
      }
    }
    // Unlike vi/id/th, Filipino needs the bare 1 forms (`isa`, `isang`) in the
    // dictionary: `isang` is the normal way to write "one <noun>" for any noun,
    // including untranslated English ones outside `units` (`isang small truck`
    // = 소형 화물차 1대), and `isa` stands alone as "one" (`isa pataas` = 1명
    // 이상). `isang` doubles as the indefinite article, so the cost is an
    // occasional spurious 1 on the target side, which surfaces as a WARN
    // ("extra in translation"); a number that is missing from the target still
    // FAILs, because that comparison runs the other way.
    if (value >= 1) {
      for (const form of forms) pushPhrase(entries, form, [value]);
    }
  }
  return compilePhrases(entries);
}

function pushAr(entries, phrase, values) {
  pushPhrase(entries, phrase, values);
  const trimmed = String(phrase).normalize('NFC').trim();
  if (trimmed && !trimmed.startsWith('ال')) {
    pushPhrase(entries, `ال${trimmed}`, values);
  }
}

function buildArLexicon() {
  const entries = [];
  // 서수어 폴백: 원문 '제1순위·제2종'처럼 kind 가 서수 매처에 없을 때 대상의 الأولى/الثاني 등이 숫자 n 으로 세어지게 한다.
  const ordinalWords = [['الأول', 1], ['الأولى', 1], ['أول', 1], ['أولى', 1], ['الثاني', 2], ['الثانية', 2], ['ثانٍ', 2], ['ثانية', 2], ['الثالث', 3], ['الثالثة', 3], ['ثالث', 3], ['ثالثة', 3], ['الرابع', 4], ['الرابعة', 4], ['رابع', 4], ['رابعة', 4], ['الخامس', 5], ['الخامسة', 5], ['السادس', 6], ['السادسة', 6], ['السابع', 7], ['السابعة', 7], ['الثامن', 8], ['الثامنة', 8], ['التاسع', 9], ['التاسعة', 9], ['العاشر', 10], ['العاشرة', 10]];
  for (const [w, n] of ordinalWords) pushPhrase(entries, w, [n]);
  // 쌍수(dual): 명사 자체가 2를 뜻한다 — سنتين(2년)·شهرين(2개월)·يومين(2일)·مرتين(2회) 등.
  for (const dual of ['سنتين', 'سنتان', 'عامين', 'عامان', 'شهرين', 'شهران', 'يومين', 'يومان', 'أسبوعين', 'أسبوعان', 'مرتين', 'مرتان', 'ساعتين', 'ساعتان', 'طرفين', 'طرفان']) {
    pushPhrase(entries, dual, [2]);
  }
  const units = [
    'سنة', 'سنوات', 'عام', 'أعوام', 'شهرا', 'شهر', 'أشهر', 'شهور',
    'يوما', 'يوم', 'أيام', 'أسبوعا', 'أسبوع', 'أسابيع',
    'مرة', 'مرات', 'ساعة', 'ساعات', 'شخص', 'أشخاص',
  ];
  const scales = [
    ['مليار', 1_000_000_000],
    ['مليون', 1_000_000],
    ['آلاف', 1_000],
    ['ألف', 1_000],
    ['مئة', 100],
    ['مائة', 100],
  ];
  const atoms = [
    ['صفر', 0],
    ['واحد', 1], ['واحدة', 1], ['أحد', 1], ['إحدى', 1],
    ['اثنان', 2], ['اثنين', 2], ['اثنتان', 2], ['اثنتين', 2], ['اثنا', 2], ['اثني', 2],
    ['ثلاث', 3], ['ثلاثة', 3],
    ['أربع', 4], ['أربعة', 4],
    ['خمس', 5], ['خمسة', 5],
    ['ست', 6], ['ستة', 6],
    ['سبع', 7], ['سبعة', 7],
    ['ثمان', 8], ['ثماني', 8], ['ثمانية', 8],
    ['تسع', 9], ['تسعة', 9],
    ['عشر', 10], ['عشرة', 10],
  ];
  pushAr(entries, 'ثلاثة أرباع', [3, 4]);
  pushAr(entries, 'ثلثان', [2, 3]);
  pushAr(entries, 'ثلثين', [2, 3]);
  pushAr(entries, 'نصف', [1, 2]);
  pushAr(entries, 'ثلث', [1, 3]);
  pushAr(entries, 'ربع', [1, 4]);
  const teens = [
    ['أحد عشر', 11], ['إحدى عشرة', 11],
    ['اثنا عشر', 12], ['اثني عشر', 12], ['اثنتا عشرة', 12], ['اثنتي عشرة', 12],
    ['ثلاثة عشر', 13], ['ثلاث عشرة', 13],
    ['أربعة عشر', 14], ['أربع عشرة', 14],
    ['خمسة عشر', 15], ['خمس عشرة', 15],
    ['ستة عشر', 16], ['ست عشرة', 16],
    ['سبعة عشر', 17], ['سبع عشرة', 17],
    ['ثمانية عشر', 18], ['ثماني عشرة', 18], ['ثمان عشرة', 18],
    ['تسعة عشر', 19], ['تسع عشرة', 19],
  ];
  for (const [phrase, value] of teens) pushAr(entries, phrase, [value]);
  const tens = [
    ['عشرون', 20], ['عشرين', 20],
    ['ثلاثون', 30], ['ثلاثين', 30],
    ['أربعون', 40], ['أربعين', 40],
    ['خمسون', 50], ['خمسين', 50],
    ['ستون', 60], ['ستين', 60],
    ['سبعون', 70], ['سبعين', 70],
    ['ثمانون', 80], ['ثمانين', 80],
    ['تسعون', 90], ['تسعين', 90],
  ];
  const ones = atoms.filter(([, value]) => value >= 1 && value <= 9);
  for (const [t, tv] of tens) {
    pushAr(entries, t, [tv]);
    for (const [o, ov] of ones) {
      pushAr(entries, `${o} و${t}`, [tv + ov]);
      pushAr(entries, `${o} و ${t}`, [tv + ov]);
    }
  }
  pushAr(entries, 'سنة كاملة', [1]);
  pushAr(entries, 'عام كامل', [1]);
  pushPhrase(entries, 'السنة الكاملة', [1]);
  pushPhrase(entries, 'العام الكامل', [1]);
  pushAr(entries, 'شهر كامل', [1]);
  pushAr(entries, 'يوم كامل', [1]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushAr(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) {
        pushAr(entries, `${atom} ${unit}`, [value]);
        pushAr(entries, `${unit} ${atom}`, [value]);
      }
    }
    if (value >= 2) pushAr(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildDeLexicon() {
  const entries = [];
  const units = ['Jahr', 'Jahre', 'Monat', 'Monate', 'Tag', 'Tage', 'Woche', 'Wochen', 'Mal', 'Person', 'Personen'];
  const scales = [['Milliarde', 1_000_000_000], ['Milliarden', 1_000_000_000], ['Million', 1_000_000], ['Millionen', 1_000_000], ['Tausend', 1_000]];
  const atoms = [
    ['null', 0], ['eins', 1], ['ein', 1], ['eine', 1], ['einem', 1], ['einen', 1],
    ['zwei', 2], ['drei', 3], ['vier', 4], ['fünf', 5], ['sechs', 6],
    ['sieben', 7], ['acht', 8], ['neun', 9], ['zehn', 10],
  ];
  pushPhrase(entries, 'zwei Drittel', [2, 3]);
  pushPhrase(entries, 'ein Drittel', [1, 3]);
  pushPhrase(entries, 'die Hälfte', [1, 2]);
  const teens = [
    ['elf', 11], ['zwölf', 12], ['dreizehn', 13], ['vierzehn', 14], ['fünfzehn', 15],
    ['sechzehn', 16], ['siebzehn', 17], ['achtzehn', 18], ['neunzehn', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  const tens = [
    ['zwanzig', 20], ['dreißig', 30], ['vierzig', 40], ['fünfzig', 50],
    ['sechzig', 60], ['siebzig', 70], ['achtzig', 80], ['neunzig', 90],
  ];
  const ones = atoms.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${tv === 20 || tv >= 30 ? `${o}und${t}` : `${t} ${o}`}`, [tv + ov]);
  }
  pushPhrase(entries, 'ein Jahr', [1]);
  pushPhrase(entries, 'einem Jahr', [1]);
  pushPhrase(entries, 'einen Monat', [1]);
  pushPhrase(entries, 'einem Monat', [1]);
  pushPhrase(entries, 'einen Tag', [1]);
  pushPhrase(entries, 'einem Tag', [1]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildEsLexicon() {
  const entries = [];
  const units = ['año', 'años', 'mes', 'meses', 'día', 'días', 'semana', 'semanas', 'vez', 'veces', 'persona', 'personas'];
  const scales = [['mil millones', 1_000_000_000], ['millón', 1_000_000], ['millones', 1_000_000], ['mil', 1_000]];
  const atoms = [
    ['cero', 0], ['uno', 1], ['una', 1], ['un', 1], ['dos', 2], ['tres', 3],
    ['cuatro', 4], ['cinco', 5], ['seis', 6], ['siete', 7], ['ocho', 8], ['nueve', 9], ['diez', 10],
  ];
  pushPhrase(entries, 'dos tercios', [2, 3]);
  pushPhrase(entries, 'un tercio', [1, 3]);
  pushPhrase(entries, 'la mitad', [1, 2]);
  const teens = [
    ['once', 11], ['doce', 12], ['trece', 13], ['catorce', 14], ['quince', 15],
    ['dieciséis', 16], ['diecisiete', 17], ['dieciocho', 18], ['diecinueve', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  const tens = [
    ['veinte', 20], ['treinta', 30], ['cuarenta', 40], ['cincuenta', 50],
    ['sesenta', 60], ['setenta', 70], ['ochenta', 80], ['noventa', 90],
  ];
  const ones = atoms.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t} y ${o}`, [tv + ov]);
  }
  pushPhrase(entries, 'un año', [1]);
  pushPhrase(entries, 'un mes', [1]);
  pushPhrase(entries, 'un día', [1]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildFrLexicon() {
  const entries = [];
  const units = ['an', 'ans', 'année', 'années', 'mois', 'jour', 'jours', 'semaine', 'semaines', 'fois', 'personne', 'personnes'];
  const scales = [
    ['milliard', 1_000_000_000], ['milliards', 1_000_000_000],
    ['million', 1_000_000], ['millions', 1_000_000],
    ['mille', 1_000], ['cent', 100], ['cents', 100],
  ];
  const atoms = [
    ['zéro', 0], ['zero', 0], ['un', 1], ['une', 1],
    ['deux', 2], ['trois', 3], ['quatre', 4], ['cinq', 5],
    ['six', 6], ['sept', 7], ['huit', 8], ['neuf', 9], ['dix', 10],
  ];
  pushPhrase(entries, 'deux tiers', [2, 3]);
  pushPhrase(entries, 'un tiers', [1, 3]);
  pushPhrase(entries, 'la moitié', [1, 2]);
  const teens = [
    ['onze', 11], ['douze', 12], ['treize', 13], ['quatorze', 14], ['quinze', 15],
    ['seize', 16], ['dix-sept', 17], ['dix-huit', 18], ['dix-neuf', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  const onesHyphen = atoms.filter(([, v]) => v >= 2 && v <= 9);
  pushPhrase(entries, 'vingt', [20]);
  pushPhrase(entries, 'vingt et un', [21]);
  pushPhrase(entries, 'vingt-et-un', [21]);
  for (const [o, ov] of onesHyphen) pushPhrase(entries, `vingt-${o}`, [20 + ov]);
  const regularTens = [['trente', 30], ['quarante', 40], ['cinquante', 50], ['soixante', 60]];
  for (const [t, tv] of regularTens) {
    pushPhrase(entries, t, [tv]);
    pushPhrase(entries, `${t} et un`, [tv + 1]);
    pushPhrase(entries, `${t}-et-un`, [tv + 1]);
    for (const [o, ov] of onesHyphen) pushPhrase(entries, `${t}-${o}`, [tv + ov]);
  }
  pushPhrase(entries, 'soixante-dix', [70]);
  pushPhrase(entries, 'soixante et onze', [71]);
  pushPhrase(entries, 'soixante-et-onze', [71]);
  for (const [teen, n] of [['douze', 72], ['treize', 73], ['quatorze', 74], ['quinze', 75], ['seize', 76], ['dix-sept', 77], ['dix-huit', 78], ['dix-neuf', 79]]) {
    pushPhrase(entries, `soixante-${teen}`, [n]);
  }
  pushPhrase(entries, 'quatre-vingts', [80]);
  pushPhrase(entries, 'quatre-vingt-un', [81]);
  for (const [o, ov] of onesHyphen) pushPhrase(entries, `quatre-vingt-${o}`, [80 + ov]);
  pushPhrase(entries, 'quatre-vingt-dix', [90]);
  pushPhrase(entries, 'quatre-vingt-onze', [91]);
  for (const [teen, n] of [['douze', 92], ['treize', 93], ['quatorze', 94], ['quinze', 95], ['seize', 96], ['dix-sept', 97], ['dix-huit', 98], ['dix-neuf', 99]]) {
    pushPhrase(entries, `quatre-vingt-${teen}`, [n]);
  }
  pushPhrase(entries, 'un an', [1]);
  pushPhrase(entries, 'une année', [1]);
  pushPhrase(entries, 'un mois', [1]);
  pushPhrase(entries, 'un jour', [1]);
  pushPhrase(entries, 'une semaine', [1]);
  pushPhrase(entries, 'cent', [100]);
  pushPhrase(entries, 'mille', [1_000]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildPtLexicon() {
  const entries = [];
  const units = ['ano', 'anos', 'mês', 'meses', 'mes', 'dia', 'dias', 'semana', 'semanas', 'vez', 'vezes', 'pessoa', 'pessoas'];
  const scales = [
    ['mil milhões', 1_000_000_000],
    ['milhão', 1_000_000], ['milhao', 1_000_000],
    ['milhões', 1_000_000], ['milhoes', 1_000_000],
    ['mil', 1_000], ['cem', 100], ['cento', 100],
  ];
  const atoms = [
    ['zero', 0], ['um', 1], ['uma', 1],
    ['dois', 2], ['duas', 2], ['três', 3], ['tres', 3],
    ['quatro', 4], ['cinco', 5], ['seis', 6], ['sete', 7],
    ['oito', 8], ['nove', 9], ['dez', 10],
  ];
  pushPhrase(entries, 'dois terços', [2, 3]);
  pushPhrase(entries, 'duas terças', [2, 3]);
  pushPhrase(entries, 'um terço', [1, 3]);
  pushPhrase(entries, 'a metade', [1, 2]);
  const teens = [
    ['onze', 11], ['doze', 12], ['treze', 13], ['catorze', 14], ['quatorze', 14],
    ['quinze', 15], ['dezasseis', 16], ['dezesseis', 16],
    ['dezassete', 17], ['dezessete', 17],
    ['dezoito', 18], ['dezanove', 19], ['dezenove', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  const tens = [
    ['vinte', 20], ['trinta', 30], ['quarenta', 40], ['cinquenta', 50],
    ['sessenta', 60], ['setenta', 70], ['oitenta', 80], ['noventa', 90],
  ];
  const ones = atoms.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t} e ${o}`, [tv + ov]);
  }
  pushPhrase(entries, 'um ano', [1]);
  pushPhrase(entries, 'um mês', [1]);
  pushPhrase(entries, 'um mes', [1]);
  pushPhrase(entries, 'um dia', [1]);
  pushPhrase(entries, 'uma semana', [1]);
  pushPhrase(entries, 'cem', [100]);
  pushPhrase(entries, 'cento', [100]);
  pushPhrase(entries, 'mil', [1_000]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildZhHansLexicon() {
  const entries = [];
  const atoms = [
    ['零', 0], ['一', 1], ['二', 2], ['两', 2], ['三', 3], ['四', 4],
    ['五', 5], ['六', 6], ['七', 7], ['八', 8], ['九', 9], ['十', 10],
  ];
  pushPhrase(entries, '三分之二', [2, 3]);
  pushPhrase(entries, '一半', [1, 2]);
  pushPhrase(entries, '十五', [15]);
  pushPhrase(entries, '一年', [1]);
  const scales = [['亿', 100_000_000], ['万', 10_000], ['千', 1_000], ['百', 100]];
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom}${scale}`, [value * factor]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildMsLexicon() {
  const entries = [];
  const units = ['tahun', 'bulan', 'hari', 'minggu', 'kali', 'orang'];
  const scales = [['bilion', 1_000_000_000], ['juta', 1_000_000], ['ribu', 1_000]];
  const atoms = [
    ['sifar', 0], ['satu', 1], ['dua', 2], ['tiga', 3], ['empat', 4],
    ['lima', 5], ['enam', 6], ['tujuh', 7], ['lapan', 8], ['sembilan', 9], ['sepuluh', 10],
  ];
  pushPhrase(entries, 'dua pertiga', [2, 3]);
  pushPhrase(entries, 'lima belas', [15]);
  pushPhrase(entries, 'satu tahun', [1]);
  const teens = [
    ['sebelas', 11], ['dua belas', 12], ['tiga belas', 13], ['empat belas', 14],
    ['lima belas', 15], ['enam belas', 16], ['tujuh belas', 17], ['lapan belas', 18], ['sembilan belas', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildRuLexicon() {
  const entries = [];
  const units = ['год', 'года', 'лет', 'месяц', 'месяца', 'день', 'дня', 'дней', 'неделя', 'недели'];
  const scales = [['миллиард', 1_000_000_000], ['миллиона', 1_000_000], ['миллион', 1_000_000], ['тысяч', 1_000], ['тысяча', 1_000]];
  const atoms = [
    ['ноль', 0], ['один', 1], ['одна', 1], ['два', 2], ['две', 2], ['три', 3],
    ['четыре', 4], ['пять', 5], ['шесть', 6], ['семь', 7], ['восемь', 8], ['девять', 9], ['десять', 10],
  ];
  pushPhrase(entries, 'две трети', [2, 3]);
  pushPhrase(entries, 'пятнадцать', [15]);
  pushPhrase(entries, 'один год', [1]);
  const teens = [
    ['одиннадцать', 11], ['двенадцать', 12], ['тринадцать', 13], ['четырнадцать', 14],
    ['пятнадцать', 15], ['шестнадцать', 16], ['семнадцать', 17], ['восемнадцать', 18], ['девятнадцать', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildTrLexicon() {
  const entries = [];
  const units = ['yıl', 'ay', 'gün', 'hafta', 'kez', 'kişi'];
  const scales = [['milyar', 1_000_000_000], ['milyon', 1_000_000], ['bin', 1_000]];
  const atoms = [
    ['sıfır', 0], ['bir', 1], ['iki', 2], ['üç', 3], ['dört', 4],
    ['beş', 5], ['altı', 6], ['yedi', 7], ['sekiz', 8], ['dokuz', 9], ['on', 10],
  ];
  pushPhrase(entries, 'üçte iki', [2, 3]);
  pushPhrase(entries, 'on beş', [15]);
  pushPhrase(entries, 'bir yıl', [1]);
  const teens = [
    ['on bir', 11], ['on iki', 12], ['on üç', 13], ['on dört', 14],
    ['on beş', 15], ['on altı', 16], ['on yedi', 17], ['on sekiz', 18], ['on dokuz', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildItLexicon() {
  const entries = [];
  const units = ['anno', 'anni', 'mese', 'mesi', 'giorno', 'giorni', 'settimana', 'settimane', 'volta', 'volte', 'persona', 'persone'];
  const scales = [['miliardo', 1_000_000_000], ['miliardi', 1_000_000_000], ['milione', 1_000_000], ['milioni', 1_000_000], ['mila', 1_000], ['mille', 1_000]];
  const atoms = [
    ['zero', 0], ['uno', 1], ['una', 1], ['due', 2], ['tre', 3], ['quattro', 4],
    ['cinque', 5], ['sei', 6], ['sette', 7], ['otto', 8], ['nove', 9], ['dieci', 10],
  ];
  pushPhrase(entries, 'due terzi', [2, 3]);
  pushPhrase(entries, 'quindici', [15]);
  pushPhrase(entries, 'un anno', [1]);
  const teens = [
    ['undici', 11], ['dodici', 12], ['tredici', 13], ['quattordici', 14], ['quindici', 15],
    ['sedici', 16], ['diciassette', 17], ['diciotto', 18], ['diciannove', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  const tens = [
    ['venti', 20], ['trenta', 30], ['quaranta', 40], ['cinquanta', 50],
    ['sessanta', 60], ['settanta', 70], ['ottanta', 80], ['novanta', 90],
  ];
  const ones = atoms.filter(([, v]) => v >= 1 && v <= 9);
  for (const [t, tv] of tens) {
    pushPhrase(entries, t, [tv]);
    for (const [o, ov] of ones) pushPhrase(entries, `${t}${o}`, [tv + ov]);
  }
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildNlLexicon() {
  const entries = [];
  const units = ['jaar', 'maand', 'maanden', 'dag', 'dagen', 'week', 'weken', 'keer', 'persoon', 'personen'];
  const scales = [['miljard', 1_000_000_000], ['miljoen', 1_000_000], ['duizend', 1_000]];
  const atoms = [
    ['nul', 0], ['een', 1], ['één', 1], ['twee', 2], ['drie', 3], ['vier', 4],
    ['vijf', 5], ['zes', 6], ['zeven', 7], ['acht', 8], ['negen', 9], ['tien', 10],
  ];
  pushPhrase(entries, 'twee derde', [2, 3]);
  pushPhrase(entries, 'vijftien', [15]);
  pushPhrase(entries, 'een jaar', [1]);
  const teens = [
    ['elf', 11], ['twaalf', 12], ['dertien', 13], ['veertien', 14], ['vijftien', 15],
    ['zestien', 16], ['zeventien', 17], ['achttien', 18], ['negentien', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  const tens = [
    ['twintig', 20], ['dertig', 30], ['veertig', 40], ['vijftig', 50],
    ['zestig', 60], ['zeventig', 70], ['tachtig', 80], ['negentig', 90],
  ];
  for (const [t, tv] of tens) pushPhrase(entries, t, [tv]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildPlLexicon() {
  const entries = [];
  const units = ['rok', 'lata', 'lat', 'miesiąc', 'miesiące', 'dzień', 'dni', 'tydzień', 'tygodnie', 'osoba', 'osoby'];
  const scales = [['miliard', 1_000_000_000], ['milion', 1_000_000], ['miliony', 1_000_000], ['tysiąc', 1_000], ['tysiące', 1_000]];
  const atoms = [
    ['zero', 0], ['jeden', 1], ['jedna', 1], ['dwa', 2], ['dwie', 2], ['trzy', 3],
    ['cztery', 4], ['pięć', 5], ['sześć', 6], ['siedem', 7], ['osiem', 8], ['dziewięć', 9], ['dziesięć', 10],
  ];
  pushPhrase(entries, 'dwie trzecie', [2, 3]);
  pushPhrase(entries, 'piętnaście', [15]);
  pushPhrase(entries, 'jeden rok', [1]);
  const teens = [
    ['jedenaście', 11], ['dwanaście', 12], ['trzynaście', 13], ['czternaście', 14],
    ['piętnaście', 15], ['szesnaście', 16], ['siedemnaście', 17], ['osiemnaście', 18], ['dziewiętnaście', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildHiLexicon() {
  const entries = [];
  const units = ['वर्ष', 'साल', 'माह', 'महीना', 'दिन', 'सप्ताह', 'व्यक्ति'];
  const scales = [['अरब', 1_000_000_000], ['करोड़', 10_000_000], ['लाख', 100_000], ['हज़ार', 1_000], ['हजार', 1_000]];
  const atoms = [
    ['शून्य', 0], ['एक', 1], ['दो', 2], ['तीन', 3], ['चार', 4],
    ['पाँच', 5], ['पांच', 5], ['छह', 6], ['सात', 7], ['आठ', 8], ['नौ', 9], ['दस', 10],
  ];
  pushPhrase(entries, 'दो तिहाई', [2, 3]);
  pushPhrase(entries, 'पंद्रह', [15]);
  pushPhrase(entries, 'एक वर्ष', [1]);
  const teens = [
    ['ग्यारह', 11], ['बारह', 12], ['तेरह', 13], ['चौदह', 14], ['पंद्रह', 15],
    ['सोलह', 16], ['सत्रह', 17], ['अठारह', 18], ['उन्नीस', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildSvLexicon() {
  const entries = [];
  const units = ['år', 'månad', 'månader', 'dag', 'dagar', 'vecka', 'veckor', 'gång', 'person', 'personer'];
  const scales = [['miljard', 1_000_000_000], ['miljon', 1_000_000], ['tusen', 1_000]];
  const atoms = [
    ['noll', 0], ['en', 1], ['ett', 1], ['två', 2], ['tre', 3], ['fyra', 4],
    ['fem', 5], ['sex', 6], ['sju', 7], ['åtta', 8], ['nio', 9], ['tio', 10],
  ];
  pushPhrase(entries, 'två tredjedelar', [2, 3]);
  pushPhrase(entries, 'femton', [15]);
  pushPhrase(entries, 'ett år', [1]);
  const teens = [
    ['elva', 11], ['tolv', 12], ['tretton', 13], ['fjorton', 14], ['femton', 15],
    ['sexton', 16], ['sjutton', 17], ['arton', 18], ['nitton', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildDaLexicon() {
  const entries = [];
  const units = ['år', 'måned', 'måneder', 'dag', 'dage', 'uge', 'uger', 'gang', 'person', 'personer'];
  const scales = [['milliard', 1_000_000_000], ['million', 1_000_000], ['tusind', 1_000]];
  const atoms = [
    ['nul', 0], ['en', 1], ['et', 1], ['to', 2], ['tre', 3], ['fire', 4],
    ['fem', 5], ['seks', 6], ['syv', 7], ['otte', 8], ['ni', 9], ['ti', 10],
  ];
  pushPhrase(entries, 'to tredjedele', [2, 3]);
  pushPhrase(entries, 'femten', [15]);
  pushPhrase(entries, 'et år', [1]);
  const teens = [
    ['elleve', 11], ['tolv', 12], ['tretten', 13], ['fjorten', 14], ['femten', 15],
    ['seksten', 16], ['sytten', 17], ['atten', 18], ['nitten', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildNbLexicon() {
  const entries = [];
  const units = ['år', 'måned', 'måneder', 'dag', 'dager', 'uke', 'uker', 'gang', 'person', 'personer'];
  const scales = [['milliard', 1_000_000_000], ['million', 1_000_000], ['tusen', 1_000]];
  const atoms = [
    ['null', 0], ['en', 1], ['et', 1], ['to', 2], ['tre', 3], ['fire', 4],
    ['fem', 5], ['seks', 6], ['sju', 7], ['åtte', 8], ['ni', 9], ['ti', 10],
  ];
  pushPhrase(entries, 'to tredjedeler', [2, 3]);
  pushPhrase(entries, 'femten', [15]);
  pushPhrase(entries, 'et år', [1]);
  const teens = [
    ['elleve', 11], ['tolv', 12], ['tretten', 13], ['fjorten', 14], ['femten', 15],
    ['seksten', 16], ['sytten', 17], ['atten', 18], ['nitten', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

function buildFiLexicon() {
  const entries = [];
  const units = ['vuosi', 'vuotta', 'kuukausi', 'kuukautta', 'päivä', 'päivää', 'viikko', 'viikkoa', 'henkilö', 'henkilöä'];
  const scales = [['miljardi', 1_000_000_000], ['miljoona', 1_000_000], ['tuhat', 1_000]];
  const atoms = [
    ['nolla', 0], ['yksi', 1], ['kaksi', 2], ['kolme', 3], ['neljä', 4],
    ['viisi', 5], ['kuusi', 6], ['seitsemän', 7], ['kahdeksan', 8], ['yhdeksän', 9], ['kymmenen', 10],
  ];
  pushPhrase(entries, 'kaksi kolmasosaa', [2, 3]);
  pushPhrase(entries, 'viisitoista', [15]);
  pushPhrase(entries, 'yksi vuosi', [1]);
  const teens = [
    ['yksitoista', 11], ['kaksitoista', 12], ['kolmetoista', 13], ['neljätoista', 14],
    ['viisitoista', 15], ['kuusitoista', 16], ['seitsemäntoista', 17], ['kahdeksantoista', 18], ['yhdeksäntoista', 19],
  ];
  for (const [phrase, n] of teens) pushPhrase(entries, phrase, [n]);
  for (const [atom, value] of atoms) {
    if (value >= 1) {
      for (const [scale, factor] of scales) pushPhrase(entries, `${atom} ${scale}`, [value * factor]);
    }
    if (value === 1) {
      for (const unit of units) pushPhrase(entries, `${atom} ${unit}`, [value]);
    }
    if (value >= 2) pushPhrase(entries, atom, [value]);
  }
  return compilePhrases(entries);
}

export const WORD_NUMERAL_LEXICONS = {
  vi: buildViLexicon(),
  id: buildIdLexicon(),
  th: buildThLexicon(),
  fil: buildFilLexicon(),
  ar: buildArLexicon(),
  de: buildDeLexicon(),
  es: buildEsLexicon(),
  fr: buildFrLexicon(),
  pt: buildPtLexicon(),
  'zh-hans': buildZhHansLexicon(),
  ms: buildMsLexicon(),
  ru: buildRuLexicon(),
  tr: buildTrLexicon(),
  it: buildItLexicon(),
  nl: buildNlLexicon(),
  pl: buildPlLexicon(),
  hi: buildHiLexicon(),
  sv: buildSvLexicon(),
  da: buildDaLexicon(),
  nb: buildNbLexicon(),
  fi: buildFiLexicon(),
};

export function lexiconEntryCount(lang) {
  return (WORD_NUMERAL_LEXICONS[lang] ?? []).length;
}

/**
 * Month name → 1..12. Longest keys must be matched first (built in
 * `monthNamePattern`). Mixes en/id/vi-not-used/th/fil because date_display is
 * localized (`2025년 9월 13일` / `13 September 2025` / `13 กันยายน ค.ศ. 2025`).
 */
export const DATE_MONTH_NAMES = {
  january: 1, jan: 1, januari: 1, enero: 1, januar: 1, janeiro: 1, janvier: 1, 'มกราคม': 1, 'ม.ค.': 1,
  february: 2, feb: 2, februari: 2, pebrero: 2, februar: 2, febrero: 2, fevereiro: 2, février: 2, fevrier: 2, 'กุมภาพันธ์': 2, 'ก.พ.': 2,
  march: 3, mar: 3, maret: 3, marso: 3, 'märz': 3, marzo: 3, março: 3, 'มีนาคม': 3, 'มี.ค.': 3,
  april: 4, apr: 4, abril: 4, avril: 4, 'เมษายน': 4, 'เม.ย.': 4,
  may: 5, mei: 5, mayo: 5, mai: 5, maio: 5, 'พฤษภาคม': 5, 'พ.ค.': 5,
  june: 6, jun: 6, juni: 6, hunyo: 6, junio: 6, junho: 6, juin: 6, 'มิถุนายน': 6, 'มิ.ย.': 6,
  july: 7, jul: 7, juli: 7, hulyo: 7, julio: 7, julho: 7, juillet: 7, 'กรกฎาคม': 7, 'ก.ค.': 7,
  august: 8, aug: 8, agustus: 8, agosto: 8, août: 8, aout: 8, 'สิงหาคม': 8, 'ส.ค.': 8,
  september: 9, sept: 9, sep: 9, setyembre: 9, septiembre: 9, setiembre: 9, setembro: 9, septembre: 9, 'กันยายน': 9, 'ก.ย.': 9,
  october: 10, oct: 10, oktober: 10, oktubre: 10, octubre: 10, outubro: 10, octobre: 10, 'ตุลาคม': 10, 'ต.ค.': 10,
  november: 11, nov: 11, nobyembre: 11, noviembre: 11, novembro: 11, novembre: 11, 'พฤศจิกายน': 11, 'พ.ย.': 11,
  december: 12, dec: 12, desember: 12, disyembre: 12, dezember: 12, diciembre: 12, dezembro: 12, décembre: 12, decembre: 12, 'ธันวาคม': 12, 'ธ.ค.': 12,
  gennaio: 1, febbraio: 2, aprile: 4, maggio: 5, giugno: 6, luglio: 7, settembre: 9, ottobre: 10, dicembre: 12,
  maart: 3, augustus: 8,
  stycznia: 1, lutego: 2, marca: 3, kwietnia: 4, maja: 5, czerwca: 6, lipca: 7, sierpnia: 8, września: 9, października: 10, listopada: 11, grudnia: 12,
  января: 1, февраля: 2, марта: 3, апреля: 4, июня: 6, июля: 7, августа: 8, сентября: 9, октября: 10, ноября: 11, декабря: 12,
  ocak: 1, 'şubat': 2, nisan: 4, 'mayıs': 5, haziran: 6, temmuz: 7, 'ağustos': 8, 'eylül': 9, ekim: 10, 'kasım': 11, 'aralık': 12,
  mac: 3, jun: 6, julai: 7, ogos: 8, disember: 12,
  '一月': 1, '二月': 2, '三月': 3, '四月': 4, '五月': 5, '六月': 6, '七月': 7, '八月': 8, '九月': 9, '十月': 10, '十一月': 11, '十二月': 12,
  augusti: 8, marts: 3,
  tammikuu: 1, helmikuu: 2, maaliskuu: 3, huhtikuu: 4, toukokuu: 5, kesäkuu: 6,
  heinäkuu: 7, elokuu: 8, syyskuu: 9, lokakuu: 10, marraskuu: 11, joulukuu: 12,
  'जनवरी': 1, 'फरवरी': 2, 'फ़रवरी': 2, 'मार्च': 3, 'अप्रैल': 4, 'मई': 5, 'जून': 6,
  'जुलाई': 7, 'अगस्त': 8, 'सितंबर': 9, 'अक्टूबर': 10, 'नवंबर': 11, 'दिसंबर': 12,
};

export function parseArgs(argv) {
  const out = {
    source: null,
    target: null,
    lang: null,
    dir: null,
    json: null,
    check: null,
    adaptDir: DEFAULT_ADAPT_DIR,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const take = () => {
      const value = argv[i + 1];
      if (value == null || value.startsWith('--')) {
        throw new Error(`${arg} requires a value`);
      }
      i += 1;
      return value;
    };
    if (arg === '--source') out.source = take();
    else if (arg === '--target') out.target = take();
    else if (arg === '--lang') out.lang = take();
    else if (arg === '--dir') out.dir = take();
    else if (arg === '--json') out.json = take();
    else if (arg === '--adapt-dir') out.adaptDir = take();
    else if (arg === '--check') {
      const value = take();
      out.check = out.check ?? [];
      for (const id of value.split(',').map((item) => item.trim()).filter(Boolean)) {
        if (!CHECK_IDS.includes(id)) throw new Error(`unknown check: ${id}`);
        out.check.push(id);
      }
    } else throw new Error(`unknown argument: ${arg}`);
  }
  if (!out.lang) throw new Error('--lang is required');
  if (out.dir) {
    if (out.target) throw new Error('--dir cannot be combined with --target');
  } else if (!out.source || !out.target) {
    throw new Error('either --source and --target, or --dir, is required');
  }
  return out;
}

export function parseMarkdown(raw) {
  const parsed = matter(raw);
  const data = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const rawMatter = fmMatch ? fmMatch[1] : '';
  const body = parsed.content ?? '';
  const bodyStartLine = fmMatch ? fmMatch[0].split(/\r?\n/).length : 1;
  return { data, rawMatter, body, bodyStartLine };
}

export function topLevelYamlKeys(rawMatter) {
  const keys = [];
  for (const line of rawMatter.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

export function rawYamlValue(rawMatter, key) {
  const prefix = `${key}:`;
  for (const line of rawMatter.split('\n')) {
    if (line.startsWith(prefix)) return line.slice(prefix.length).trim();
  }
  return undefined;
}

function faqItems(data) {
  return Array.isArray(data.faq) ? data.faq : [];
}

export function headingLevels(body) {
  const levels = [];
  for (const line of body.split('\n')) {
    const match = line.match(/^(#{1,6})\s+\S/);
    if (match) levels.push(match[1].length);
  }
  return levels;
}

export function extractImages(body) {
  const paths = [];
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    paths.push(match[2].trim());
  }
  return paths;
}

export function extractLinks(body) {
  const hrefs = [];
  const re = /(!)?\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    if (match[1] === '!') continue;
    hrefs.push(match[3].trim());
  }
  return hrefs;
}

export function nonEmptyBlocks(body) {
  return body
    .split(/\n[ \t]*\n/)
    .map((block) => block.replace(/\s+$/u, ''))
    .filter((block) => block.replace(/[ \t]/g, '').length > 0);
}

export function countZwsp(text) {
  return [...text].filter((ch) => ch === ZWSP).length;
}

export function countTableRows(body) {
  return body.split('\n').filter((line) => /^\s*\|/.test(line)).length;
}

export function countQuoteBlocks(body) {
  let count = 0;
  let inQuote = false;
  for (const line of body.split('\n')) {
    if (/^\s*>/.test(line)) {
      if (!inQuote) {
        count += 1;
        inQuote = true;
      }
    } else {
      inQuote = false;
    }
  }
  return count;
}

export function countListItems(body) {
  return body.split('\n').filter((line) => /^\s*(?:[-*+]|\d+\.)\s+\S/.test(line)).length;
}

export function swapAllowedHref(href, lang) {
  for (const rule of ALLOWED_HREF_TRANSFORMS) {
    const match = href.match(rule.from);
    if (match) return rule.to(lang, match);
  }
  return href;
}

export function isIllegalLocaleServicePath(href, lang) {
  return new RegExp(`^/${lang}/services/.+`).test(href);
}

function canonicalHrefSet(hrefs, lang) {
  return new Set(hrefs.map((href) => swapAllowedHref(href, lang)));
}

function sortedSet(set) {
  return [...set].sort();
}

export function findHangulHits(urlValue, body, bodyStartLine) {
  const hits = [];
  // frontmatter `url` must stay byte-identical to the source (check a), so a
  // Korean slug there is expected and is NOT a residual-Hangul defect.
  void urlValue;
  const lines = body.split('\n');
  lines.forEach((line, index) => {
    if (HANGUL_RE.test(line)) {
      hits.push({ line: bodyStartLine + index, text: line });
    }
  });
  return hits;
}

function latinOnlyLetters(text) {
  const letters = [...text].filter((ch) => LETTER_RE.test(ch));
  if (letters.length === 0) return false;
  return letters.every((ch) => LATIN_LETTER_RE.test(ch));
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function englishStopwordCount(text) {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[^a-z']/g, ''))
    .filter((word) => ENGLISH_STOPWORDS.has(word)).length;
}

export function findEnglishSentences(body, bodyStartLine) {
  const hits = [];
  const lines = body.split('\n');
  const chunks = [];
  let buf = '';
  let startLine = bodyStartLine;

  const flush = (endLine) => {
    const text = buf.trim();
    if (text) chunks.push({ text, line: startLine, endLine });
    buf = '';
  };

  lines.forEach((line, index) => {
    const fileLine = bodyStartLine + index;
    if (line.trim() === '') {
      flush(fileLine - 1);
      startLine = fileLine + 1;
      return;
    }
    if (!buf) startLine = fileLine;
    buf = buf ? `${buf} ${line}` : line;
    const parts = buf.split(/(?<=[.!?。！？])\s+/);
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i += 1) {
        chunks.push({ text: parts[i].trim(), line: startLine, endLine: fileLine });
      }
      buf = parts[parts.length - 1];
      startLine = fileLine;
    }
  });
  flush(bodyStartLine + lines.length - 1);

  for (const chunk of chunks) {
    if (wordCount(chunk.text) < ENGLISH_WORD_MIN) continue;
    if (!latinOnlyLetters(chunk.text)) continue;
    if (englishStopwordCount(chunk.text) < ENGLISH_STOPWORD_MIN) continue;
    hits.push(chunk);
  }
  return hits;
}

export function findForbiddenHits(body, lang, bodyStartLine) {
  const patterns = FORBIDDEN_PHRASES[lang] ?? [];
  const hits = [];
  const lines = body.split('\n');
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      pattern.re.lastIndex = 0;
      if (!pattern.re.test(line)) continue;
      pattern.re.lastIndex = 0;
      if (pattern.exemptRe) {
        pattern.exemptRe.lastIndex = 0;
        if (pattern.exemptRe.test(line)) continue;
      }
      hits.push({
        line: bodyStartLine + index,
        id: pattern.id,
        note: pattern.note,
        text: line,
      });
    }
  });
  return hits;
}

export function countHanzi(body) {
  return [...body].filter((ch) => HAN_RE.test(ch)).length;
}

const FULLWIDTH_DIGIT_RE = /[０-９]/g;
const THAI_DIGIT_RE = /[๐-๙]/g;

function foldDigits(text) {
  return String(text)
    .normalize('NFC')
    .replace(FULLWIDTH_DIGIT_RE, (ch) => String(ch.codePointAt(0) - 0xFF10))
    .replace(THAI_DIGIT_RE, (ch) => String(ch.codePointAt(0) - 0x0E50));
}

function translatableText(parsed) {
  const skip = new Set(NUMBER_SKIP_FRONTMATTER_KEYS);
  const parts = [];
  const data = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
  for (const [key, value] of Object.entries(data)) {
    if (skip.has(key) || key === 'faq' || key === 'categories') continue;
    if (typeof value === 'string') parts.push(value);
  }
  for (const item of faqItems(data)) {
    if (item && typeof item.q === 'string') parts.push(item.q);
    if (item && typeof item.a === 'string') parts.push(item.a);
  }
  parts.push(parsed.body ?? '');
  return parts.join('\n');
}

function stripStructuralNoise(text) {
  let s = String(text);
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, (match) => {
    const alt = match.match(/^!\[([^\]]*)\]/);
    return alt ? alt[1] : ' ';
  });
  s = s.replace(/(?<!!)\[([^\]]*)\]\([^)]+\)/g, '$1');
  s = s.replace(/\bhttps?:\/\/[^\s)]+/gi, ' ');
  s = s.replace(/\bwww\.[^\s)]+/gi, ' ');
  // Do not treat German "13. September 2025" (date_display at line start) as a
  // markdown ordered-list marker. List items still lose their "1. " prefix
  // because the following token is not a month name.
  const monthAlt = Object.keys(DATE_MONTH_NAMES)
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  s = s.replace(new RegExp(`(^|\\n)[ \\t]*\\d+\\.[ \\t]+(?!(?:${monthAlt}))`, 'giu'), '$1');
  return s;
}

function isInHanzi(text, start, end) {
  const left = text.slice(Math.max(0, start - 4), start);
  const right = text.slice(end, Math.min(text.length, end + 4));
  if (HAN_RE.test(left) || HAN_RE.test(right)) return true;
  const open = Math.max(text.lastIndexOf('(', start), text.lastIndexOf('（', start));
  if (open < 0) return false;
  const closeCandidates = [text.indexOf(')', start), text.indexOf('）', start)]
    .filter((index) => index >= end);
  if (closeCandidates.length === 0) return false;
  const inner = text.slice(open, Math.min(...closeCandidates) + 1);
  return HAN_RE.test(inner);
}

function monthNamePattern() {
  const names = Object.keys(DATE_MONTH_NAMES).sort((a, b) => b.length - a.length);
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(?:${escaped.join('|')})`, 'giu');
}

let CACHED_MONTH_RE;
function monthNameRe() {
  if (!CACHED_MONTH_RE) CACHED_MONTH_RE = monthNamePattern();
  return CACHED_MONTH_RE;
}

function monthNumber(name) {
  return DATE_MONTH_NAMES[name.toLowerCase()] ?? DATE_MONTH_NAMES[name] ?? null;
}

function parseGroupedInteger(raw) {
  const digits = String(raw).replace(/[.,\s]/g, '');
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

function pushToken(tokens, value, inHanzi, lang) {
  if (value == null || !Number.isFinite(value)) return;
  const exceptions = NUMBER_LANG_EXCEPTIONS[lang] ?? [];
  if (exceptions.includes(value)) return;
  tokens.push({ value, inHanzi: Boolean(inHanzi) });
}

function blankReplace(str, re, handler) {
  const flags = re.global ? re.flags : `${re.flags}g`;
  const globalRe = new RegExp(re.source, flags);
  return str.replace(globalRe, (...args) => {
    const match = args[0];
    const offset = args[args.length - 2];
    const groups = args.slice(1, -2);
    const keep = handler(match, groups, offset);
    if (keep === false) return match;
    return ' '.repeat(match.length);
  });
}

function parseScaleCoefficient(raw) {
  const grouped = String(raw).match(/^(\d{1,3}(?:[.,]\d{3})+)(?:[.,](\d{1,2}))?$/);
  if (grouped) {
    const n = Number.parseInt(grouped[1].replace(/[.,]/g, ''), 10);
    if (!Number.isFinite(n)) return null;
    if (grouped[2]) return n + Number.parseInt(grouped[2], 10) / 10 ** grouped[2].length;
    return n;
  }
  const dec = String(raw).match(/^(\d+)[.,](\d{1,2})$/);
  if (dec) {
    return Number.parseInt(dec[1], 10) + Number.parseInt(dec[2], 10) / 10 ** dec[2].length;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function magnitudePattern(lang) {
  const words = MAGNITUDE_WORDS[lang] ?? [];
  if (!words.length) return null;
  const body = words
    .slice()
    .sort((a, b) => b.word.length - a.word.length)
    .map((item) => item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const thai = lang === 'th';
  const arabic = lang === 'ar';
  const unit = thai || arabic ? `(?:${body})` : `(?:${body})\\b`;
  const coeff = '(\\d{1,3}(?:[.,]\\d{3})+|\\d+[.,]\\d{1,2}|\\d+)';
  const trailing = arabic ? '(?![\\p{L}\\p{M}])' : '';
  return {
    re: new RegExp(`${coeff}\\s*${unit}${trailing}`, thai || arabic ? 'gu' : 'giu'),
    factors: new Map(words.map((item) => [item.word.toLowerCase(), item.factor])),
  };
}

function collectUnparsedNumerals(s, lang) {
  const hint = UNPARSED_NUMERAL_HINTS[lang];
  if (!hint) return [];
  const flags = hint.global ? hint.flags : `${hint.flags}g`;
  const re = new RegExp(hint.source, flags);
  const found = [];
  const seen = new Set();
  let match;
  while ((match = re.exec(s)) !== null) {
    if (!match[0].trim()) continue;
    const start = Math.max(0, match.index - 16);
    const end = Math.min(s.length, match.index + match[0].length + 16);
    const snippet = s.slice(start, end).replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!snippet || seen.has(snippet)) continue;
    seen.add(snippet);
    found.push(snippet);
  }
  return found;
}

export function analyzeNumbers(text, lang = 'ko') {
  const tokens = [];
  const unparsed = [];
  let s = foldDigits(stripStructuralNoise(text));
  const style = NUMBER_THOUSAND_STYLE[lang] ?? 'comma';

  const consumeValues = (match, offset, values) => {
    const inHanzi = isInHanzi(s, offset, offset + match.length);
    for (const value of values) {
      const rounded = typeof value === 'number' && !Number.isInteger(value) && Math.abs(value) >= 1000
        ? Math.round(value)
        : value;
      pushToken(tokens, rounded, inHanzi, lang);
    }
  };

  const day = '(?:3[01]|[12]\\d|0?[1-9])';
  const mon = '(?:1[0-2]|0?[1-9])';

  s = blankReplace(s, new RegExp(`\\b((?:19|20)\\d{2})[-/.](${mon})[-/.](${day})\\b`, 'g'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
      Number.parseInt(groups[2], 10),
    ]);
  });

  s = blankReplace(s, new RegExp(`((?:19|20)\\d{2})\\s*년\\s*(${mon})\\s*월\\s*(${day})\\s*일`, 'g'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
      Number.parseInt(groups[2], 10),
    ]);
  });

  s = blankReplace(s, new RegExp(`ngày\\s*(${day})\\s*tháng\\s*(${mon})\\s*năm\\s*((?:19|20)\\d{2})`, 'gi'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
      Number.parseInt(groups[2], 10),
    ]);
  });

  s = blankReplace(s, new RegExp(`tháng\\s*(${mon})\\s*năm\\s*((?:19|20)\\d{2})`, 'gi'), (match, groups, offset) => {
    consumeValues(match, offset, [
      Number.parseInt(groups[0], 10),
      Number.parseInt(groups[1], 10),
    ]);
  });

  const month = monthNameRe().source;
  s = blankReplace(s, new RegExp(`(${day})\\s+(${month})\\s+(?:ค\\.ศ\\.\\s*|พ\\.ศ\\.\\s*)?((?:19|20)\\d{2}|25\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[1]);
    if (!monthN) return false;
    let year = Number.parseInt(groups[2], 10);
    if (/พ\.ศ\./.test(match) || year >= 2400) year -= THAI_BUDDHIST_ERA_OFFSET;
    consumeValues(match, offset, [Number.parseInt(groups[0], 10), monthN, year]);
  });

  // de: 13. September 2025
  s = blankReplace(s, new RegExp(`(${day})\\.\\s+(${month})\\s+((?:19|20)\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[1]);
    if (!monthN) return false;
    consumeValues(match, offset, [Number.parseInt(groups[0], 10), monthN, Number.parseInt(groups[2], 10)]);
  });

  // es: 13 de septiembre de 2025
  s = blankReplace(s, new RegExp(`(${day})\\s+de\\s+(${month})\\s+de\\s+((?:19|20)\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[1]);
    if (!monthN) return false;
    consumeValues(match, offset, [Number.parseInt(groups[0], 10), monthN, Number.parseInt(groups[2], 10)]);
  });

  s = blankReplace(s, new RegExp(`(${month})\\.?\\s+(${day})(?:,)?\\s+((?:19|20)\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[0]);
    if (!monthN) return false;
    consumeValues(match, offset, [monthN, Number.parseInt(groups[1], 10), Number.parseInt(groups[2], 10)]);
  });

  s = blankReplace(s, new RegExp(`(${month})\\.?\\s+(${day})(?!\\s*(?:19|20)\\d{2})`, 'giu'), (match, groups, offset) => {
    const monthN = monthNumber(groups[0]);
    if (!monthN) return false;
    consumeValues(match, offset, [monthN, Number.parseInt(groups[1], 10)]);
  });

  for (const { unit, factor } of SINO_UNIT_MULTIPLIERS) {
    const unitSrc = unit.source;
    const re = new RegExp(`(\\d{1,3}(?:[.,]\\d{3})+|\\d+)\\s*(?:${unitSrc})`, 'gu');
    s = blankReplace(s, re, (match, groups, offset) => {
      const coeff = parseGroupedInteger(groups[0]);
      if (coeff == null) return false;
      consumeValues(match, offset, [coeff * factor]);
    });
  }

  const magnitude = magnitudePattern(lang);
  if (magnitude) {
    s = blankReplace(s, magnitude.re, (match, groups, offset) => {
      const coeff = parseScaleCoefficient(groups[0]);
      if (coeff == null) return false;
      const unitRaw = match.slice(groups[0].length).trim().toLowerCase();
      const factor = magnitude.factors.get(unitRaw);
      if (!factor) return false;
      consumeValues(match, offset, [coeff * factor]);
    });
  }

  const parseGroupedToken = (match, offset) => {
    const tail = match.match(/^(\d{1,3}(?:[.,]\d{3})+)(?:[.,](\d{1,2}))?$/);
    if (!tail) return false;
    const n = Number.parseInt(tail[1].replace(/[.,]/g, ''), 10);
    const frac = tail[2];
    consumeValues(match, offset, [frac ? n + Number.parseInt(frac, 10) / 10 ** frac.length : n]);
  };
  const groupedDot = /\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?/g;
  const groupedComma = /\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?/g;
  const ordered = style === 'dot' ? [groupedDot, groupedComma] : [groupedComma, groupedDot];
  for (const re of ordered) {
    s = blankReplace(s, re, (match, _groups, offset) => parseGroupedToken(match, offset));
  }
  s = blankReplace(s, /\d+[.,]\d{1,2}(?!\d)/g, (match, _groups, offset) => {
    consumeValues(match, offset, [Number.parseFloat(match.replace(',', '.'))]);
  });

  s = blankReplace(s, /\d+/g, (match, _groups, offset) => {
    consumeValues(match, offset, [Number.parseInt(match, 10)]);
  });

  for (const entry of WORD_NUMERAL_LEXICONS[lang] ?? []) {
    s = blankReplace(s, entry.re, (match, _groups, offset) => {
      consumeValues(match, offset, entry.values);
    });
  }

  unparsed.push(...collectUnparsedNumerals(s, lang));
  return { tokens, unparsed };
}

export function extractNormalizedNumbers(text, lang = 'ko') {
  return analyzeNumbers(text, lang).tokens;
}

function countMap(tokens) {
  const map = new Map();
  for (const token of tokens) {
    map.set(token.value, (map.get(token.value) ?? 0) + 1);
  }
  return map;
}

function collapseHanziDupes(sourceCounts, targetTokens) {
  const grouped = new Map();
  for (const token of targetTokens) {
    const bucket = grouped.get(token.value) ?? { hanzi: 0, other: 0 };
    if (token.inHanzi) bucket.hanzi += 1;
    else bucket.other += 1;
    grouped.set(token.value, bucket);
  }
  const result = new Map();
  for (const key of new Set([...sourceCounts.keys(), ...grouped.keys()])) {
    const sourceN = sourceCounts.get(key) ?? 0;
    const bucket = grouped.get(key) ?? { hanzi: 0, other: 0 };
    let count = bucket.other + bucket.hanzi;
    if (count > sourceN && bucket.hanzi > 0 && sourceN > 0) {
      count = Math.max(sourceN, bucket.other);
    }
    result.set(key, count);
  }
  return result;
}

function formatNumberDiff(items) {
  return items
    .sort((a, b) => a.value - b.value)
    .map((item) => (item.count > 1 ? `${item.value}×${item.count}` : String(item.value)))
    .join(', ');
}

function pass(id, details = []) {
  return { id, status: 'PASS', details };
}

function fail(id, details) {
  return { id, status: 'FAIL', details };
}

function warn(id, details) {
  return { id, status: 'WARN', details };
}

export function checkFrontmatter(source, target) {
  const details = [];
  const sourceKeys = topLevelYamlKeys(source.rawMatter);
  const targetKeys = topLevelYamlKeys(target.rawMatter);
  if (JSON.stringify(sourceKeys) !== JSON.stringify(targetKeys)) {
    details.push(`keys/order source=[${sourceKeys.join(', ')}] target=[${targetKeys.join(', ')}]`);
  }

  for (const key of ['url', 'lastmod', 'featured_image']) {
    const sourceValue = rawYamlValue(source.rawMatter, key);
    const targetValue = rawYamlValue(target.rawMatter, key);
    if (sourceValue !== targetValue) {
      details.push(`${key} bytes differ: source=${JSON.stringify(sourceValue)} target=${JSON.stringify(targetValue)}`);
    }
  }

  const sourceFaq = faqItems(source.data);
  const targetFaq = faqItems(target.data);
  if (sourceFaq.length !== targetFaq.length) {
    details.push(`faq count ${sourceFaq.length} → ${targetFaq.length}`);
  }
  targetFaq.forEach((item, index) => {
    const q = item && typeof item.q === 'string' ? item.q.trim() : '';
    const a = item && typeof item.a === 'string' ? item.a.trim() : '';
    if (!q || !a) details.push(`faq[${index}] empty q/a`);
  });

  return details.length ? fail('frontmatter', details) : pass('frontmatter');
}

export function checkHeadings(source, target) {
  const sourceLevels = headingLevels(source.body);
  const targetLevels = headingLevels(target.body);
  const details = [];
  if (JSON.stringify(sourceLevels) !== JSON.stringify(targetLevels)) {
    details.push(`levels source=[${sourceLevels.join(',')}] target=[${targetLevels.join(',')}]`);
  }
  const h1 = targetLevels.filter((level) => level === 1).length;
  if (h1 !== 1) details.push(`H1 count ${h1} (expected 1)`);
  return details.length ? fail('headings', details) : pass('headings', [`levels=[${targetLevels.join(',')}]`]);
}

export function checkImages(source, target) {
  const sourcePaths = extractImages(source.body);
  const targetPaths = extractImages(target.body);
  const details = [];
  if (sourcePaths.length !== targetPaths.length) {
    details.push(`count ${sourcePaths.length} → ${targetPaths.length}`);
  }
  const sourceSet = new Set(sourcePaths);
  const targetSet = new Set(targetPaths);
  for (const path of sourceSet) {
    if (!targetSet.has(path)) details.push(`missing ${path}`);
  }
  for (const path of targetSet) {
    if (!sourceSet.has(path)) details.push(`extra ${path}`);
  }
  return details.length ? fail('images', details) : pass('images', [`count=${targetPaths.length}`]);
}

export function checkBlocks(source, target) {
  const details = [];
  const sourceBlocks = nonEmptyBlocks(source.body).length;
  const targetBlocks = nonEmptyBlocks(target.body).length;
  if (sourceBlocks !== targetBlocks) details.push(`blocks ${sourceBlocks} → ${targetBlocks}`);

  const sourceTable = countTableRows(source.body);
  const targetTable = countTableRows(target.body);
  if (sourceTable !== targetTable) details.push(`table rows ${sourceTable} → ${targetTable}`);

  const sourceQuotes = countQuoteBlocks(source.body);
  const targetQuotes = countQuoteBlocks(target.body);
  if (sourceQuotes !== targetQuotes) details.push(`quote blocks ${sourceQuotes} → ${targetQuotes}`);

  const sourceLists = countListItems(source.body);
  const targetLists = countListItems(target.body);
  if (sourceLists !== targetLists) details.push(`list items ${sourceLists} → ${targetLists}`);

  const sourceZwsp = countZwsp(source.body);
  const targetZwsp = countZwsp(target.body);
  if (sourceZwsp !== targetZwsp) details.push(`ZWSP ${sourceZwsp} → ${targetZwsp}`);

  return details.length ? fail('blocks', details) : pass('blocks', [
    `blocks=${targetBlocks}`,
    `tables=${targetTable}`,
    `quotes=${targetQuotes}`,
    `lists=${targetLists}`,
    `zwsp=${targetZwsp}`,
  ]);
}

export function checkLinks(source, target, lang) {
  const sourceHrefs = extractLinks(source.body);
  const targetHrefs = extractLinks(target.body);
  const details = [];

  for (const href of targetHrefs) {
    if (isIllegalLocaleServicePath(href, lang)) {
      details.push(`non-existent path ${href}`);
    }
  }

  const expected = canonicalHrefSet(sourceHrefs, lang);
  const actual = canonicalHrefSet(targetHrefs, lang);
  const missing = sortedSet(expected).filter((href) => !actual.has(href));
  const extra = sortedSet(actual).filter((href) => !expected.has(href));
  for (const href of missing) details.push(`missing ${href}`);
  for (const href of extra) details.push(`extra/unallowed ${href}`);

  return details.length ? fail('links', details) : pass('links', [`hrefs=${targetHrefs.length}`]);
}

export function checkHangul(target) {
  const urlValue = rawYamlValue(target.rawMatter, 'url') ?? target.data.url ?? '';
  const hits = findHangulHits(urlValue, target.body, target.bodyStartLine);
  if (hits.length === 0) return pass('hangul');
  return fail(
    'hangul',
    hits.map((hit) => `L${hit.line}: ${hit.text.trim()}`),
  );
}

export function checkEnglish(target, lang) {
  const hits = findEnglishSentences(target.body, target.bodyStartLine);
  if (hits.length === 0) return pass('english');
  const details = hits.map((hit) => `L${hit.line}: ${hit.text.trim()}`);
  if (lang === 'fil') return warn('english', details);
  return fail('english', details);
}

export function checkForbidden(target, lang) {
  const hits = findForbiddenHits(target.body, lang, target.bodyStartLine);
  if (hits.length === 0) return pass('forbidden');
  return fail(
    'forbidden',
    hits.map((hit) => `L${hit.line} ${hit.id} (${hit.note}): ${hit.text.trim()}`),
  );
}

/**
 * langid — 로케일 블록에 다른 대상 언어의 고유 문자가 섞여 들어간 것을 잡는다.
 *
 * 구조적 공백이었다. 기존 `hangul`은 한글만, `english`는 영어 문장만 본다.
 * 한 로케일 파일에 다른 동남아 언어 문자열이 들어가도 어떤 항목도 실패하지
 * 않았다. 유니코드 스크립트 기준으로만 판정하며, 한자 병기는 이 사이트의
 * 관례이므로 제외한다(별도 `hanzi` 항목이 담당).
 *
 * 라틴 문자를 공유하는 id와 fil은 스크립트로 가를 수 없어 이 항목의 대상이
 * 아니다. 그쪽은 `english` 항목과 용어집 대조가 맡는다.
 */
const LANGID_SCRIPTS = [
  { id: 'thai', lang: 'th', re: /[\u0E00-\u0E7F]/u, label: '태국 문자' },
  { id: 'hangul', lang: 'ko', re: /[\uAC00-\uD7A3]/u, label: '한글' },
  { id: 'kana', lang: 'ja', re: /[\u3040-\u30FF]/u, label: '가나' },
  { id: 'arabic', lang: 'ar', re: /[؀-ۿݐ-ݿ]/u, label: '아랍 문자' },
];

// 베트남어 고유 결합 문자(다른 라틴 로케일에 나타나면 혼입)
const LANGID_VI_RE = /[\u01A0\u01A1\u01AF\u01B0\u0110\u0111\u1EA0-\u1EF9]/u;

export function findLangidHits(body, startLine, lang) {
  const hits = [];
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    // 한자 병기 괄호와 URL은 판정에서 제외한다
    const scrubbed = line
      .replace(/https?:\/\/\S+/gu, ' ')
      .replace(/\([^)]*[\u4E00-\u9FFF][^)]*\)/gu, ' ')
      .replace(/（[^）]*[\u4E00-\u9FFF][^）]*）/gu, ' ');
    for (const script of LANGID_SCRIPTS) {
      if (script.lang === lang) continue;
      const m = scrubbed.match(script.re);
      if (m) hits.push({ line: startLine + i, script: script.id, label: script.label, text: line });
    }
    if (lang !== 'vi' && LANGID_VI_RE.test(scrubbed)) {
      hits.push({ line: startLine + i, script: 'vi', label: '베트남어 고유 문자', text: line });
    }
  }
  return hits;
}

export function checkLangid(target, lang) {
  const hits = findLangidHits(target.body, target.bodyStartLine, lang);
  if (hits.length === 0) return pass('langid');
  // 총괄 판정(GOAL-4 P3): 현 코퍼스 68편에 오탐 0이므로 WARN이 아니라 FAIL로 둔다.
  // 다른 대상 언어의 고유 문자가 들어오는 것은 정상적인 번역 결과가 아니다.
  return fail(
    'langid',
    hits.map((hit) => `L${hit.line} ${hit.label} 혼입: ${hit.text.trim().slice(0, 90)}`),
  );
}

/**
 * currency — 통화 단위가 한정어 없이 쓰인 곳을 잡는다.
 *
 * 총괄 지시(GOAL-4 lead4-4 §2-3)로 신설. 003 ko가 대만 元의 역어로 「원」을
 * 한정어 없이 써서 한국 독자에게 원화로 읽히던 것이 실례다. 숫자는 조문과
 * 같으므로 `numbers` 항목이 잡지 못하고, 통화 한정어의 부재는 형식 문제라
 * 별도 레인이 필요하다.
 *
 * 한국어는 「원」 앞 12자 이내에 대만 통화를 가리키는 말이 있어야 한다.
 * 다른 언어는 TWD·NT$·新臺幣 같은 명시 표기를 쓰므로 대상이 아니다.
 */
const CURRENCY_KO_QUALIFIERS = /(신타이완달러|신대만달러|대만달러|대만|타이완|TWD|NT\$|新臺幣|新台幣)/u;

export function findCurrencyHits(body, startLine, lang) {
  if (lang !== 'ko') return [];
  const hits = [];
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!/[\d][\d,.]*\s*(?:만|억)?\s*원/u.test(line)) continue;
    // 문장 단위로 본다. 열거문("1,000원, 2,000원 또는 3,000원")에서 한정어가
    // 앞머리에만 오는 것이 정상이므로 고정 폭 창으로는 판정할 수 없다.
    for (const sentence of line.split(/(?<=[.。!?])\s+/u)) {
      if (!/[\d][\d,.]*\s*(?:만|억)?\s*원/u.test(sentence)) continue;
      if (CURRENCY_KO_QUALIFIERS.test(sentence)) continue;
      hits.push({ line: startLine + i, text: sentence.trim().slice(0, 90) });
    }
  }
  return hits;
}

export function checkCurrency(target, lang) {
  const hits = findCurrencyHits(target.body, target.bodyStartLine, lang);
  if (hits.length === 0) return pass('currency');
  return warn(
    'currency',
    hits.map((hit) => `L${hit.line} 통화 한정어 없는 「원」: …${hit.text.trim()}`),
  );
}

export function checkHanzi(target) {
  const count = countHanzi(target.body);
  if (count >= HANZI_MIN) return pass('hanzi', [`han=${count}`]);
  return warn('hanzi', [`han=${count} (min ${HANZI_MIN})`]);
}

export function checkNationality(source, target, lang, adaptLog = '') {
  const units = alignedTranslationUnits(source, target);
  const fails = [];
  const warns = [];
  for (const unit of units) {
    const hits = findNationalityHits(unit.target, lang);
    if (!hits.length) continue;
    if (sourceHasNationality(unit.source)) continue;
    const covered = adaptLogCovers(adaptLog, unit);
    const loc = typeof unit.index === 'number' ? `block[${unit.index}]` : String(unit.index);
    for (const hit of hits) {
      const line = `${hit.value} ${loc} src="${clipSentence(unit.source)}" tgt="${clipSentence(unit.target)}"`;
      if (covered) warns.push(`근거있음 ${line}`);
      else fails.push(line);
    }
  }
  if (fails.length) return fail('nationality', [...fails, ...warns]);
  if (warns.length) return warn('nationality', warns);
  return pass('nationality');
}

function clipSentence(text) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length <= 180 ? t : `${t.slice(0, 177)}...`;
}

const KO_ORDINAL_SPECS = [
  { kind: 'instance', re: /제?\s*(\d+)\s*심/g },
  { kind: 'paragraph', re: /제\s*(\d+)\s*항/g },
  { kind: 'item', re: /제\s*(\d+)\s*호/g },
  { kind: 'type', re: /제\s*(\d+)\s*종/g },
  { kind: 'party', re: /제\s*(\d+)\s*자/g },
  { kind: 'country', re: /제\s*(\d+)\s*국/g },
  { kind: 'perday', re: /(\d+)\s*일당/g },
];

const ORDINAL_WORD_N = {
  vi: { nhất: 1, một: 1, hai: 2, ba: 3, tư: 4, bốn: 4, năm: 5 },
  id: { pertama: 1, kesatu: 1, kedua: 2, ketiga: 3, keempat: 4, kelima: 5 },
  th: { หนึ่ง: 1, สอง: 2, สาม: 3, สี่: 4 },
  fil: {
    una: 1, unang: 1, first: 1,
    ikalawa: 2, pangalawa: 2, second: 2,
    ikatlo: 3, ikatlong: 3, third: 3,
  },
  de: {
    erste: 1, erster: 1, ersten: 1, erstes: 1, erstem: 1,
    zweite: 2, zweiter: 2, zweiten: 2, zweites: 2, zweitem: 2,
    dritte: 3, dritter: 3, dritten: 3, drittes: 3, drittem: 3,
    vierte: 4, vierter: 4, vierten: 4, viertes: 4,
    fünfte: 5, fünfter: 5, fünften: 5,
  },
  es: {
    primera: 1, primer: 1, primero: 1,
    segunda: 2, segundo: 2,
    tercera: 3, tercero: 3, tercer: 3,
    cuarta: 4, cuarto: 4,
    quinta: 5, quinto: 5,
  },
  fr: {
    premier: 1, première: 1, premiere: 1,
    deuxième: 2, deuxieme: 2, second: 2, seconde: 2,
    troisième: 3, troisieme: 3,
    quatrième: 4, quatrieme: 4,
  },
  pt: {
    primeiro: 1, primeira: 1,
    segundo: 2, segunda: 2,
    terceiro: 3, terceira: 3,
    quarto: 4, quarta: 4,
  },
  ar: {
    الأول: 1, الأولى: 1, أول: 1, أولى: 1,
    الثاني: 2, الثانية: 2, ثاني: 2, ثانية: 2,
    الثالث: 3, الثالثة: 3, ثالث: 3, ثالثة: 3,
    الرابع: 4, الرابعة: 4, رابع: 4, رابعة: 4,
    الخامس: 5, الخامسة: 5, خامس: 5, خامسة: 5,
    السادس: 6, السادسة: 6, سادس: 6, سادسة: 6,
    السابع: 7, السابعة: 7, سابع: 7, سابعة: 7,
    الثامن: 8, الثامنة: 8, ثامن: 8, ثامنة: 8,
    التاسع: 9, التاسعة: 9, تاسع: 9, تاسعة: 9,
    العاشر: 10, العاشرة: 10, عاشر: 10, عاشرة: 10,
  },
};

function ordinalWordN(lang, word) {
  const raw = String(word || '');
  const map = ORDINAL_WORD_N[lang] ?? {};
  if (map[raw] != null) return map[raw];
  const lower = raw.toLowerCase();
  if (map[lower] != null) return map[lower];
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function collapseOrdinalHits(hits) {
  const sorted = hits.slice().sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return (b.end - a.start) - (a.end - a.start);
  });
  const out = [];
  let lastEnd = -1;
  for (const hit of sorted) {
    if (hit.start < lastEnd) continue;
    out.push(hit);
    lastEnd = hit.end;
  }
  return out;
}

function collectRegexHits(text, re, handler) {
  const flags = re.global ? re.flags : `${re.flags}g`;
  const globalRe = new RegExp(re.source, flags);
  const hits = [];
  let match;
  while ((match = globalRe.exec(text)) !== null) {
    const hit = handler(match);
    if (hit) hits.push(hit);
  }
  return hits;
}

export function extractKoOrdinals(text) {
  const s = String(text).normalize('NFC');
  const raw = [];
  for (const spec of KO_ORDINAL_SPECS) {
    raw.push(...collectRegexHits(s, spec.re, (match) => {
      const n = Number.parseInt(match[1], 10);
      if (!Number.isFinite(n)) return null;
      return {
        kind: spec.kind,
        n,
        start: match.index,
        end: match.index + match[0].length,
        phrase: match[0].trim(),
      };
    }));
  }
  raw.push(...collectRegexHits(s, /원당\s*1일(?:로|씩)?|(?<!월\s*)(?<!\d)1일로/g, (match) => ({
    kind: 'perday',
    n: 1,
    start: match.index,
    end: match.index + match[0].length,
    phrase: match[0].trim(),
  })));
  return collapseOrdinalHits(raw);
}

function targetOrdinalSpecs(lang) {
  const viUnit = (kind) => ({
    kind,
    re: new RegExp(`\\b${kind === 'paragraph' ? 'khoản' : kind === 'item' ? 'điểm' : 'loại'}\\s+(?:thứ\\s+)?(nhất|một|hai|ba|tư|bốn|năm|\\d+)\\b`, 'giu'),
    nFrom: (match) => ordinalWordN('vi', match[1]),
  });
  const tables = {
    vi: [
      { kind: 'instance', n: 1, re: /sơ\s*thẩm/giu },
      { kind: 'instance', n: 2, re: /phúc\s*thẩm/giu },
      { kind: 'party', n: 3, re: /(?:bên|người|phía)\s+thứ\s+ba/giu },
      { kind: 'country', n: 3, re: /nước\s+thứ\s+ba|quốc\s+gia\s+thứ\s+ba/giu },
      { kind: 'perday', n: 1, re: /(?:cho\s+)?mỗi\s+ngày/giu },
      viUnit('paragraph'),
      viUnit('item'),
      viUnit('type'),
    ],
    id: [
      { kind: 'party', n: 3, re: /pihak\s+ketiga/gi },
      { kind: 'country', n: 3, re: /negara\s+ketiga/gi },
      { kind: 'instance', n: 1, re: /tingkat\s+pertama/gi },
      { kind: 'instance', n: 2, re: /tingkat\s+(?:banding|kedua)/gi },
      { kind: 'type', re: /jenis\s+(pertama|kedua|ketiga|keempat)/gi, nFrom: (match) => ordinalWordN('id', match[1]) },
      { kind: 'type', n: 2, re: /type\s*II\b/gi },
      { kind: 'paragraph', re: /ayat\s+(pertama|kedua|ketiga|\d+)/gi, nFrom: (match) => ordinalWordN('id', match[1]) },
      { kind: 'item', re: /butir\s+(pertama|kedua|ketiga|\d+)/gi, nFrom: (match) => ordinalWordN('id', match[1]) },
      { kind: 'perday', n: 1, re: /per\s+hari/gi },
    ],
    th: [
      { kind: 'instance', n: 1, re: /ชั้นต้น/g },
      { kind: 'instance', n: 2, re: /อุทธรณ์/g },
      { kind: 'paragraph', re: /วรรค(หนึ่ง|สอง|สาม)/g, nFrom: (match) => ordinalWordN('th', match[1]) },
      { kind: 'item', re: /อนุมาตรา(หนึ่ง|สอง|สาม)?/g, nFrom: (match) => ordinalWordN('th', match[1] || 'หนึ่ง') },
      { kind: 'type', re: /ประเภทที่(หนึ่ง|สอง|สาม)/g, nFrom: (match) => ordinalWordN('th', match[1]) },
      { kind: 'party', n: 3, re: /บุคคลที่สาม|บุคคลภายนอก|บุคคลที่\s*3/g },
      { kind: 'country', n: 3, re: /ประเทศที่สาม|ประเทศที่\s*3/g },
      { kind: 'perday', n: 1, re: /วันละ|ต่อวัน/g },
    ],
    fil: [
      // `isang` here is the article of the ordinal noun phrase ("isang ikatlong
      // partido" = "a third party"), not the cardinal 1, so it is swallowed by
      // the ordinal span instead of being left behind as a stray numeral.
      { kind: 'party', n: 3, re: /(?:isang\s+)?(?:ikatlong\s+(?:partido|panig)|third[-\s]party)/gi },
      { kind: 'country', n: 3, re: /(?:isang\s+)?(?:ikatlong\s+bansa|third\s+country)/gi },
      { kind: 'instance', n: 1, re: /(?:isang\s+)?first\s+instance/gi },
      { kind: 'instance', n: 2, re: /(?:isang\s+)?second\s+instance/gi },
      { kind: 'type', n: 2, re: /(?:isang\s+)?(?:type\s*II\b|ikalawang\s+uri|pangalawang\s+uri)/gi },
      { kind: 'paragraph', n: 1, re: /(?:isang\s+)?(?:unang\s+talata|talata\s+una)/gi },
      { kind: 'paragraph', n: 2, re: /(?:isang\s+)?talata\s+ikalawa/gi },
      { kind: 'perday', n: 1, re: /bawat\s+araw|kada\s+araw|per\s+day|araw\s+kada/gi },
      { kind: 'type', re: /(?:isang\s+)?\b(unang|ikalawang|ikatlong)\s+uri\b/gi, nFrom: (match) => ordinalWordN('fil', match[1]) },
    ],
    de: [
      { kind: 'instance', n: 1, re: /erstinstanzlich|erste[nrs]?\s+Instanz|Gericht\s+erster\s+Instanz/gi },
      { kind: 'instance', n: 2, re: /zweitinstanzlich|zweite[nrs]?\s+Instanz|Gericht\s+zweiter\s+Instanz/gi },
      { kind: 'party', n: 3, re: /(?:einem\s+|einer\s+|eines\s+|ein\s+|den\s+|der\s+|die\s+)?Dritt(?:e[rn]?|partei)|dritte[nrs]?\s+Partei/gi },
      { kind: 'country', n: 3, re: /Drittstaat(?:en)?|Drittland|dritte[nrs]?\s+(?:Staat|Land)/gi },
      { kind: 'type', n: 2, re: /Type\s*II\b|zweiter\s+Art|zweiten\s+Art/gi },
      { kind: 'paragraph', re: /Absatz\s+(erste[nrs]?|zweite[nrs]?|dritte[nrs]?|vierte[nrs]?|\d+)/gi, nFrom: (match) => ordinalWordN('de', match[1]) },
      { kind: 'item', re: /(?:Ziffer|Nummer)\s+(erste[nrs]?|zweite[nrs]?|dritte[nrs]?|vierte[nrs]?|\d+)/gi, nFrom: (match) => ordinalWordN('de', match[1]) },
      { kind: 'type', re: /(?:Art|Typ|Gattung)\s+(erste[nrs]?|zweite[nrs]?|dritte[nrs]?|vierte[nrs]?|\d+)/gi, nFrom: (match) => ordinalWordN('de', match[1]) },
      { kind: 'perday', n: 1, re: /pro\s+Tag|je\s+Tag|pro\s+Tagessatz/gi },
    ],
    es: [
      { kind: 'instance', n: 1, re: /primera\s+instancia/gi },
      { kind: 'instance', n: 2, re: /segunda\s+instancia/gi },
      { kind: 'party', n: 3, re: /(?:un\s+|una\s+)?tercer(?:o|a)(?:\s+(?:partido|parte))?/gi },
      { kind: 'country', n: 3, re: /tercer(?:o)?\s+pa[ií]s/gi },
      { kind: 'type', n: 2, re: /tipo\s*II\b|segunda\s+clase|tipo\s+segundo/gi },
      { kind: 'paragraph', re: /(?:p[aá]rrafo|apartado)\s+(primero|primera|segundo|segunda|tercero|tercera|cuarto|cuarta|\d+)/gi, nFrom: (match) => ordinalWordN('es', match[1]) },
      { kind: 'item', re: /(?:inciso|numeral)\s+(primero|primera|segundo|segunda|tercero|tercera|cuarto|cuarta|\d+)/gi, nFrom: (match) => ordinalWordN('es', match[1]) },
      { kind: 'type', re: /tipo\s+(primero|primera|segundo|segunda|tercero|tercera|cuarto|cuarta|\d+)/gi, nFrom: (match) => ordinalWordN('es', match[1]) },
      { kind: 'perday', n: 1, re: /por\s+d[ií]a|al\s+d[ií]a/gi },
    ],
    fr: [
      { kind: 'instance', n: 1, re: /premi[eè]re\s+instance/gi },
      { kind: 'instance', n: 2, re: /deuxi[eè]me\s+instance|seconde\s+instance/gi },
      { kind: 'party', n: 3, re: /(?:un\s+|une\s+)?tiers|troisi[eè]me\s+partie/gi },
      { kind: 'country', n: 3, re: /pays\s+tiers|troisi[eè]me\s+pays/gi },
      { kind: 'type', n: 2, re: /type\s*II\b|deuxi[eè]me\s+type/gi },
      { kind: 'paragraph', re: /(?:alinéa|paragraphe)\s+(premier|première|deuxi[eè]me|troisi[eè]me|quatri[eè]me|\d+)/gi, nFrom: (match) => ordinalWordN('fr', match[1]) },
      { kind: 'item', re: /(?:article|numéro)\s+(premier|première|deuxi[eè]me|troisi[eè]me|quatri[eè]me|\d+)/gi, nFrom: (match) => ordinalWordN('fr', match[1]) },
      { kind: 'type', re: /type\s+(premier|première|deuxi[eè]me|troisi[eè]me|quatri[eè]me|\d+)/gi, nFrom: (match) => ordinalWordN('fr', match[1]) },
      { kind: 'perday', n: 1, re: /par\s+jour|chaque\s+jour/gi },
    ],
    pt: [
      { kind: 'instance', n: 1, re: /primeira\s+instância/gi },
      { kind: 'instance', n: 2, re: /segunda\s+instância/gi },
      { kind: 'party', n: 3, re: /(?:um\s+|uma\s+)?terceir(?:o|a)(?:\s+(?:partido|parte))?/gi },
      { kind: 'country', n: 3, re: /terceir(?:o)?\s+pa[ií]s/gi },
      { kind: 'type', n: 2, re: /tipo\s*II\b|segundo\s+tipo/gi },
      { kind: 'paragraph', re: /(?:parágrafo|alínea)\s+(primeiro|primeira|segundo|segunda|terceiro|terceira|quarto|quarta|\d+)/gi, nFrom: (match) => ordinalWordN('pt', match[1]) },
      { kind: 'item', re: /(?:inciso|número)\s+(primeiro|primeira|segundo|segunda|terceiro|terceira|quarto|quarta|\d+)/gi, nFrom: (match) => ordinalWordN('pt', match[1]) },
      { kind: 'type', re: /tipo\s+(primeiro|primeira|segundo|segunda|terceiro|terceira|quarto|quarta|\d+)/gi, nFrom: (match) => ordinalWordN('pt', match[1]) },
      { kind: 'perday', n: 1, re: /por\s+dia|ao\s+dia/gi },
    ],
    ar: (() => {
      const keys = Object.keys(ORDINAL_WORD_N.ar)
        .sort((a, b) => b.length - a.length)
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
      const nFrom = (match) => ordinalWordN('ar', match[1]);
      return [
        { kind: 'party', re: new RegExp(`(?:ال)?(?:أطراف|طرف)\\s+(${keys}|\\d+)`, 'gu'), nFrom },
        { kind: 'country', re: new RegExp(`(?:ال)?(?:دول(?:ة)?|بلدان|بلاد|بلد)\\s+(${keys}|\\d+)`, 'gu'), nFrom },
        { kind: 'instance', n: 1, re: /(?:ال)?محكمة\s+(?:ال)?ابتدائي(?:ة)?|الدرجة\s+(?:ال)?أول[ىي]|أول\s+درجة/gu },
        { kind: 'instance', n: 2, re: /(?:ال)?استئناف|الدرجة\s+(?:ال)?ثاني(?:ة)?/gu },
        { kind: 'paragraph', re: new RegExp(`(?:ال)?فقرة\\s+(${keys}|\\d+)`, 'gu'), nFrom },
        { kind: 'item', re: new RegExp(`(?:ال)?بند\\s+(${keys}|\\d+)`, 'gu'), nFrom },
        { kind: 'type', re: new RegExp(`(?:ال)?(?:نوع|فئة|صنف)\\s+(${keys}|\\d+)`, 'gu'), nFrom },
        { kind: 'perday', n: 1, re: /لكل\s+يوم|في\s+(?:ال)?يوم|يومي[اً]?/gu },
      ];
    })(),
  };
  return tables[lang] ?? [];
}

export function extractTargetOrdinals(text, lang) {
  const s = String(text).normalize('NFC');
  const raw = [];
  for (const spec of targetOrdinalSpecs(lang)) {
    raw.push(...collectRegexHits(s, spec.re, (match) => {
      const n = spec.nFrom ? spec.nFrom(match) : spec.n;
      if (!Number.isFinite(n) || n < 1) return null;
      return {
        kind: spec.kind,
        n,
        start: match.index,
        end: match.index + match[0].length,
        phrase: match[0].trim(),
      };
    }));
  }
  return collapseOrdinalHits(raw);
}

function blankSpans(text, spans) {
  let s = String(text);
  const ordered = spans.slice().sort((a, b) => b.start - a.start);
  for (const span of ordered) {
    s = `${s.slice(0, span.start)}${' '.repeat(Math.max(0, span.end - span.start))}${s.slice(span.end)}`;
  }
  return s;
}

export function matchOrdinalExpressions(sourceText, targetText, lang) {
  const srcHits = extractKoOrdinals(sourceText);
  const tgtHits = extractTargetOrdinals(targetText, lang);
  const used = new Set();
  const matched = [];
  const unmatched = [];
  for (const hit of srcHits) {
    const index = tgtHits.findIndex((candidate, i) => (
      !used.has(i) && candidate.kind === hit.kind && candidate.n === hit.n
    ));
    if (index >= 0) {
      used.add(index);
      matched.push({ src: hit, tgt: tgtHits[index] });
    } else {
      unmatched.push(hit);
    }
  }
  return {
    sourceText: blankSpans(sourceText, matched.map((item) => item.src)),
    targetText: blankSpans(targetText, matched.map((item) => item.tgt)),
    unmatched,
    matched,
  };
}

/**
 * Replace every match of `patterns` with same-length spaces so later term
 * scans cannot see it. Exported so other gates (guidance-data country gate)
 * reuse the same "language-name PASS" mechanism instead of re-deriving it.
 */
export function blankRegexes(text, patterns) {
  let s = String(text);
  for (const re of patterns) {
    const flags = re.global ? re.flags : `${re.flags}g`;
    s = s.replace(new RegExp(re.source, flags), (match) => ' '.repeat(match.length));
  }
  return s;
}

export function findNationalityHits(text, lang) {
  const terms = (NATIONALITY_TERMS[lang] ?? []).slice().sort((a, b) => b.length - a.length);
  const s = blankRegexes(text, NATIONALITY_LANGUAGE_NAMES[lang] ?? []);
  const hits = [];
  const occupied = [];
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const needsBoundary = /^[A-Za-z]+$/.test(term);
    const re = needsBoundary
      ? new RegExp(`\\b${escaped}\\b`, 'gi')
      : new RegExp(escaped, 'giu');
    let match;
    while ((match = re.exec(s)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;
      if (occupied.some((span) => start < span.end && end > span.start)) continue;
      occupied.push({ start, end });
      hits.push({ value: term, start, end, phrase: match[0] });
    }
  }
  return hits;
}

export function sourceHasNationality(text) {
  const s = blankRegexes(text, [SOURCE_LANGUAGE_NAME_RE]);
  return SOURCE_NATIONALITY_RE.test(s);
}

export function adaptLogCovers(adaptLog, unit) {
  const log = String(adaptLog || '').normalize('NFC');
  if (!log.trim()) return false;
  const fragments = [unit.target, unit.source]
    .map((value) => String(value || '').normalize('NFC').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  for (const text of fragments) {
    if (text.length < 12) {
      if (log.includes(text)) return true;
      continue;
    }
    if (log.includes(text.slice(0, Math.min(40, text.length)))) return true;
    if (log.includes(text.slice(-Math.min(40, text.length)))) return true;
    for (let i = 0; i <= text.length - 16; i += 8) {
      if (log.includes(text.slice(i, i + 16))) return true;
    }
  }
  return false;
}

export function alignedTranslationUnits(source, target) {
  const units = [];
  const sourceBlocks = nonEmptyBlocks(source.body);
  const targetBlocks = nonEmptyBlocks(target.body);
  const blockCount = Math.max(sourceBlocks.length, targetBlocks.length);
  for (let i = 0; i < blockCount; i += 1) {
    units.push({ index: i, source: sourceBlocks[i] ?? '', target: targetBlocks[i] ?? '' });
  }
  const sourceFaq = faqItems(source.data);
  const targetFaq = faqItems(target.data);
  const faqCount = Math.max(sourceFaq.length, targetFaq.length);
  for (let i = 0; i < faqCount; i += 1) {
    units.push({ index: `faq[${i}].q`, source: sourceFaq[i]?.q ?? '', target: targetFaq[i]?.q ?? '' });
    units.push({ index: `faq[${i}].a`, source: sourceFaq[i]?.a ?? '', target: targetFaq[i]?.a ?? '' });
  }
  const sourceTitle = typeof source.data.title === 'string' ? source.data.title : '';
  const targetTitle = typeof target.data.title === 'string' ? target.data.title : '';
  if (sourceTitle || targetTitle) {
    units.push({ index: 'title', source: sourceTitle, target: targetTitle });
  }
  return units;
}

export function citeMissingNumbers(sourceText, targetText, lang, missingValues) {
  const quotes = [];
  const missingSet = new Set(missingValues);
  const sourceParas = String(sourceText).split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const targetParas = String(targetText).split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const limit = Math.max(sourceParas.length, targetParas.length);
  for (let i = 0; i < limit && quotes.length < 12; i += 1) {
    const src = sourceParas[i] ?? '';
    const tgt = targetParas[i] ?? '';
    const srcBag = countMap(extractNormalizedNumbers(src, 'ko'));
    const tgtBag = countMap(extractNormalizedNumbers(tgt, lang));
    const local = [];
    for (const value of missingSet) {
      if ((srcBag.get(value) ?? 0) > (tgtBag.get(value) ?? 0)) local.push(value);
    }
    if (local.length) {
      quotes.push(`[${local.join(',')}] src="${clipSentence(src)}" tgt="${clipSentence(tgt)}"`);
    }
  }
  return quotes;
}

export function checkNumbers(source, target, lang) {
  const sourceTextRaw = translatableText(source);
  const targetTextRaw = translatableText(target);
  const ordinal = matchOrdinalExpressions(sourceTextRaw, targetTextRaw, lang);
  const sourceText = ordinal.sourceText;
  const targetText = ordinal.targetText;
  const sourceAnalysis = analyzeNumbers(sourceText, 'ko');
  const targetAnalysis = analyzeNumbers(targetText, lang);
  const sourceBag = countMap(sourceAnalysis.tokens);
  const targetBag = collapseHanziDupes(sourceBag, targetAnalysis.tokens);

  const onlySource = [];
  const onlyTarget = [];
  for (const key of new Set([...sourceBag.keys(), ...targetBag.keys()])) {
    const sourceN = sourceBag.get(key) ?? 0;
    const targetN = targetBag.get(key) ?? 0;
    if (sourceN > targetN) onlySource.push({ value: key, count: sourceN - targetN });
    if (targetN > sourceN) onlyTarget.push({ value: key, count: targetN - sourceN });
  }

  const sourceTotal = [...sourceBag.values()].reduce((sum, n) => sum + n, 0);
  const targetTotal = [...targetBag.values()].reduce((sum, n) => sum + n, 0);
  const details = [];
  if (onlySource.length) {
    const n = onlySource.reduce((sum, item) => sum + item.count, 0);
    details.push(`missing from translation (${n}): ${formatNumberDiff(onlySource)}`);
  }
  if (onlyTarget.length) {
    const n = onlyTarget.reduce((sum, item) => sum + item.count, 0);
    details.push(`extra in translation (${n}): ${formatNumberDiff(onlyTarget)}`);
  }
  const unparsed = targetAnalysis.unparsed ?? [];
  if (unparsed.length) {
    details.push(`수사 미해석 (${unparsed.length}): ${unparsed.join('; ')}`);
  }
  if (ordinal.unmatched.length) {
    details.push(`수사미해석 (${ordinal.unmatched.length}): ${ordinal.unmatched.map((hit) => hit.phrase).join('; ')}`);
  }
  details.push(`sourceCount=${sourceTotal} targetCount=${targetTotal}`);
  if (onlySource.length) {
    for (const quote of citeMissingNumbers(sourceText, targetText, lang, onlySource.map((item) => item.value))) {
      details.push(quote);
    }
  }

  if (onlySource.length) return fail('numbers', details);
  if (onlyTarget.length || unparsed.length || ordinal.unmatched.length) return warn('numbers', details);
  return pass('numbers', details);
}

export function checkPair({ sourceRaw, targetRaw, sourcePath, targetPath, lang, adaptLog = '', checks }) {
  const source = parseMarkdown(sourceRaw);
  const target = parseMarkdown(targetRaw);
  const wanted = new Set(Array.isArray(checks) && checks.length ? checks : CHECK_IDS);
  const catalog = [
    ['frontmatter', () => checkFrontmatter(source, target)],
    ['headings', () => checkHeadings(source, target)],
    ['images', () => checkImages(source, target)],
    ['blocks', () => checkBlocks(source, target)],
    ['links', () => checkLinks(source, target, lang)],
    ['hangul', () => checkHangul(target)],
    ['english', () => checkEnglish(target, lang)],
    ['forbidden', () => checkForbidden(target, lang)],
    ['hanzi', () => checkHanzi(target)],
    ['numbers', () => checkNumbers(source, target, lang)],
    ['nationality', () => checkNationality(source, target, lang, adaptLog)],
    ['langid', () => checkLangid(target, lang)],
    ['currency', () => checkCurrency(target, lang)],
  ];
  const results = catalog.filter(([id]) => wanted.has(id)).map(([, run]) => run());
  const failed = results.some((check) => check.status === 'FAIL');
  return {
    ok: !failed,
    lang,
    sourcePath,
    targetPath,
    checks: results,
  };
}

export function formatPairTable(result) {
  const rows = [
    `${result.ok ? 'PASS' : 'FAIL'}  ${result.targetPath}  lang=${result.lang}`,
    'check          status  details',
    '-------------- ------  -------',
  ];
  for (const check of result.checks) {
    const first = check.details[0] ?? '';
    rows.push(`${check.id.padEnd(14)} ${check.status.padEnd(6)} ${first}`);
    if (check.status !== 'PASS') {
      for (const extra of check.details.slice(1)) {
        rows.push(`               ${''.padEnd(6)} ${extra}`);
      }
    }
  }
  return rows.join('\n');
}

async function readUtf8(path) {
  return readFile(path, 'utf8');
}

export async function checkFiles({
  sourcePath,
  targetPath,
  lang,
  adaptLog,
  adaptDir = DEFAULT_ADAPT_DIR,
  checks,
}) {
  if (!existsSync(sourcePath)) {
    return {
      ok: false,
      lang,
      sourcePath,
      targetPath,
      checks: [fail('frontmatter', [`missing source ${sourcePath}`])],
    };
  }
  if (!existsSync(targetPath)) {
    return {
      ok: false,
      lang,
      sourcePath,
      targetPath,
      checks: [fail('frontmatter', [`missing target ${targetPath}`])],
    };
  }
  const sourceRaw = await readUtf8(sourcePath);
  const targetRaw = await readUtf8(targetPath);
  let log = adaptLog ?? '';
  if (!log && adaptDir) {
    const slug = basename(targetPath, '.md');
    const adaptPath = join(adaptDir, lang, `${slug}.adapt-log.md`);
    if (existsSync(adaptPath)) log = await readUtf8(adaptPath);
  }
  return checkPair({
    sourceRaw,
    targetRaw,
    sourcePath,
    targetPath,
    lang,
    adaptLog: log,
    checks,
  });
}

export async function checkDirectory({
  dir,
  sourceDir = DEFAULT_SOURCE_DIR,
  lang,
  adaptDir = DEFAULT_ADAPT_DIR,
  checks,
}) {
  const absDir = resolve(dir);
  if (!existsSync(absDir)) {
    throw new Error(`directory not found: ${absDir}`);
  }
  const names = (await readdir(absDir)).filter((name) => name.endsWith('.md')).sort();
  const results = [];
  for (const name of names) {
    results.push(await checkFiles({
      sourcePath: join(sourceDir, name),
      targetPath: join(absDir, name),
      lang,
      adaptDir,
      checks,
    }));
  }
  return results;
}

export function summarizeResults(results) {
  const failed = results.filter((result) => !result.ok).length;
  return {
    ok: failed === 0,
    count: results.length,
    failed,
    passed: results.length - failed,
  };
}

export function formatReport(results) {
  const blocks = results.map((result) => formatPairTable(result));
  const summary = summarizeResults(results);
  blocks.push(`summary  ${summary.ok ? 'PASS' : 'FAIL'}  ${summary.passed}/${summary.count} files`);
  return blocks.join('\n\n');
}

export function toJson(results, lang) {
  const summary = summarizeResults(results);
  return {
    ok: summary.ok,
    lang,
    count: summary.count,
    passed: summary.passed,
    failed: summary.failed,
    pairs: results,
  };
}

export async function main(argv, options = {}) {
  const args = parseArgs(argv);
  const results = args.dir
    ? await checkDirectory({
      dir: args.dir,
      sourceDir: args.source ? resolve(args.source) : DEFAULT_SOURCE_DIR,
      lang: args.lang,
      adaptDir: args.adaptDir,
      checks: args.check,
    })
    : [await checkFiles({
      sourcePath: resolve(args.source),
      targetPath: resolve(args.target),
      lang: args.lang,
      adaptDir: args.adaptDir,
      checks: args.check,
    })];

  const report = formatReport(results);
  const log = options.log ?? console.log;
  log(report);

  if (args.json) {
    const jsonPath = resolve(args.json);
    await mkdir(dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(toJson(results, args.lang), null, 2)}\n`, 'utf8');
    log(`json: ${jsonPath}`);
  }

  return summarizeResults(results).ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
