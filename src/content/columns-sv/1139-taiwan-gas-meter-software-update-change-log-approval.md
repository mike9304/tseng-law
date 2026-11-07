---
title: "Gasmätare till Taiwan: räcker en ändringslogg för att få uppdatera programvaran?"
seoTitle: "Ultraljudsgasmätare i Taiwan: programvara och elektronisk plombering"
summary: "Taiwans nya tekniska föreskrift för ultraljudsgasmätare gäller sedan den 30 oktober 2026. Den reglerar både programvarans ändringsmöjligheter efter fabriken och skyddet vid parameterändringar med elektronisk plombering. För en leverantör är det avgörande att skilja dessa krav åt innan underhållsavtalet lovar framtida uppdateringar."
published: "2026-11-06"
lastmod: "2026-11-06"
date_display: "6 november 2026"
read_time: "4 minuters läsning"
categories: ["Mätutrustning i Taiwan", "Tekniska föreskrifter"]
topic: "company"
tags: ["BSMI", "ultraljudsgasmätare", "programvara", "elektronisk plombering"]
audience: ["sv"]
author: "legal-ai-assistant"
featured_image: "https://media.tseng-law.com/images/columns/country-20261106/WORLD-sv.png"
featured_image_alt: "Ett omärkt instrument format som en gasmätare, med tom display, bredvid en stängd mapp på en tom provbänk."
featured_image_caption: "Fiktiv scen"
faq:
  - q: "Gör en elektronisk ändringslogg alla programuppdateringar tillåtna?"
    a: "Nej. Punkt 4.7.1.1 ställer ett eget krav på programvaran efter fabriken: den ska inte kunna ändras, eller bara kunna ändras när också hårdvaran eller en hårdvarukomponent ändras. Reglerna om elektronisk plombering ger ingen allmän dispens från det kravet."
  - q: "Kan leverantören själv välja elektronisk plombering utan vidare?"
    a: "De särskilda villkoren i punkt 7.1.4.1 gäller om metrologimyndigheten tillåter elektronisk plombering. Då krävs bland annat skyddad åtkomst, bekräftelse efter parameterändring och uppgifter som gör den senaste ändringen spårbar."
  - q: "Är detta fortfarande ett förslag?"
    a: "Nej. BSMI:s aktuella föreskrift CNPA 137-1 anger den 30 oktober 2026 som både offentliggörande- och tillämpningsdag. Den ska skiljas från remissförslaget från maj."
---

En logg över parameterändringar ger inte ensam rätt att uppdatera en ultraljudsgasmätares programvara. [BSMI:s nya föreskrift CNPA 137-1](https://www.bsmi.gov.tw/wSite/laws/review.jsp?lawId=52c50c90a181e9dc01a1a011a7740173) ställer egna krav på programvaran efter fabriken och särskilda villkor för elektronisk plombering.

Föreskriften gäller sedan den 30 oktober 2026. För ett svenskt företag som levererar utrustningen till Taiwan behöver ett löfte om framtida underhåll passa den program- och hårdvarukonstruktion som faktiskt ska bedömas.

## Vilka mätare omfattas?

[Avsnitt 1](https://www.bsmi.gov.tw/wSite/laws/review.jsp?lawId=52c50c90a181e9dc01a1a011a7740173) omfattar batteridrivna ultraljudsmätare för hushållens naturgas eller gasol och tillagda elektroniska anordningar som påverkar mätprestandan. Mätprincipen bygger på skillnaden i ultraljudets gångtid med och mot flödet.

Omfattningen anger noggrannhetsklasserna 1,0 och 1,5 samt högsta arbetstryck på 10 kPa övertryck. Största flödet är 2,5–16 kubikmeter per timme. Omgivningstemperaturen är −5 till +55 grader Celsius. Alla industriella flödesmätare omfattas inte.

## Programversionen hör till underlaget

[Punkt 4.7.1.1](https://www.bsmi.gov.tw/wSite/laws/review.jsp?lawId=52c50c90a181e9dc01a1a011a7740173) kräver att de rättsligt relevanta programdelarna eller programkomponenterna identifieras genom version eller annan beteckning, med uppgifter i typgodkännandet, där även identifieringsmetoden ska framgå.

Efter fabriken ska tillämpningsprogramvaran inte kunna ändras, eller bara kunna ändras när hårdvaran eller en hårdvarukomponent också ändras. Att en kund har beställt en ny funktion avgör alltså inte om konstruktionen uppfyller föreskriften.

Enligt punkt 4.7.1.3 ska obehöriga ändringar av de rättsligt relevanta delarna förhindras, och lämplig plombering ska hindra obehöriga ingrepp eller göra dem uppenbara. Ett avtal om vem som får beställa service beskriver inte ensamt det tekniska skyddet.

## Elektronisk plombering har en egen tröskel

Kan ett lösenord och en historik ersätta alla andra begränsningar? [Punkt 7.1.4.1](https://www.bsmi.gov.tw/wSite/laws/review.jsp?lawId=52c50c90a181e9dc01a1a011a7740173) utgår från att metrologimyndigheten tillåter elektronisk plombering. Skyddad åtkomst till inställningsläget får då ges endast åt behöriga personer, exempelvis genom lösenord eller en särskild fysisk nyckel.

Har ingen parameter ändrats får mätaren återgå till plomberat läge utan ytterligare villkor, medan en faktisk parameterändring kräver bekräftelse före återgången. Inställningsläget ska vara tydligt identifierbart, eller så ska mätaren inte kunna fungera i det läget; läget ska bestå tills föreskriven återgång sker.

Loggen ska göra den senaste ändringen spårbar. [Samma punkt](https://www.bsmi.gov.tw/wSite/record/file_actData.jsp?filename=f1793610272252.pdf&fileuuid=130255), på PDF-sida 14, anger den behöriga personens identitet och antingen en händelseräknare eller datum och tid från den inbyggda klockan. Tidigare parametervärde och totalt händelseantal ska sparas. Finns plats för flera ändringar och äldre uppgifter måste raderas för en ny, ska den äldsta posten tas bort.

Detta är villkor för parameteråtkomst och spårbarhet. Programvarukravet i avsnitt 4.7 gäller fortfarande.

## Underhållslöftet behöver ange vilken ändring som avses

Ett serviceavtal kan skilja mellan byte av en komponent, ändring av en mätparameter och ändring av tillämpningsprogramvaran. Annars kan samma ord, ”uppdatering”, betyda olika saker för kunden, utvecklaren och den som tar fram typunderlaget.

[Avsnitt 9.2](https://www.bsmi.gov.tw/wSite/laws/review.jsp?lawId=52c50c90a181e9dc01a1a011a7740173) kräver bland annat hårdvaru- och programversioner när det är tillämpligt, en beskrivning av programarkitektur och funktion samt plomberingens utförande och placering eller andra skyddsmetoder. Bruksanvisningen ska vara på traditionell kinesiska. Tillverkaren ska bifoga den enligt avsnitt 6.1. Ett supportlöfte behöver därför kunna jämföras med mer än produktens försäljningsnamn.

Vid juridisk granskning av leverans- och serviceavtalet kan den aktuella konstruktionen och den planerade ändringen beskrivas för [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw), 昊鼎國際法律事務所, 103 臺北市大同區承德路一段35號7樓之2. Den tekniska bedömningen behöver göras av lämplig sakkunnig; avtalet behöver visa vilken version, komponent och parameter som underhållslöftet faktiskt gäller.

## Officiella källor

Kontrollerade den 6 november 2026. Beskrivningen avser den publicerade föreskriften, inte ett beviljat typgodkännande för någon viss leverantör. Bilden visar en fiktiv scen.

- [BSMI, 超音波氣量計型式認證技術規範, CNPA 137-1, första utgåvan, 30 oktober 2026](https://www.bsmi.gov.tw/wSite/laws/review.jsp?lawId=52c50c90a181e9dc01a1a011a7740173), särskilt avsnitt 1, 4.7, 6.1, 7.1.4 och 9.2.
- [BSMI:s officiella PDF](https://www.bsmi.gov.tw/wSite/record/file_actData.jsp?filename=f1793610272252.pdf&fileuuid=130255), dateringen på första sidan och programvara samt plombering på sidorna 12–14.
