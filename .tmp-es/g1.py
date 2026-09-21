#!/usr/bin/env python3
import sys
sys.path.insert(0, "/Users/son7/Projects/tseng-law-fix-s-20260921/.tmp-es")
from apply import apply, apply_slice

# --- src/data/international-guidance-western.ts : Spanish block only (504..992)
apply_slice("src/data/international-guidance-western.ts", 504, 992, [
    # a#19 menu label
    ("menuLabel: 'Índice de páginas',", "menuLabel: 'Menú',"),
    # a#20 display-language label
    ("languageLabel: 'Idioma de visualización',", "languageLabel: 'Idioma de la página',"),
    # a#21 + ACCEPTED: grupos de trabajo -> áreas de práctica (sweep)
    ("El despacho atiende los grupos principales de trabajo según el derecho de Taiwán.",
     "El despacho atiende las principales áreas de práctica según el derecho de Taiwán."),
    ("'Si aún no tiene claro a qué grupo pertenece su asunto, la página de ',",
     "'Si aún no tiene claro a qué área pertenece su asunto, la página de ',"),
    ("heading: 'Grupos de asuntos que atendemos',", "heading: 'Áreas de práctica que atendemos',"),
    ("'El alcance del despacho cubre los seis grupos siguientes. La página «Áreas de trabajo» describe cada grupo con más detalle y señala lo que no se garantiza.',",
     "'El alcance del despacho cubre las seis áreas siguientes. La página «Áreas de trabajo» describe cada una con más detalle y señala lo que no se garantiza.',"),
    ("'Seis grupos de trabajo del despacho en Taiwán y los límites que conviene conocer de antemano.',",
     "'Las seis áreas de práctica del despacho en Taiwán y los límites que conviene conocer de antemano.',"),
    # a#22 + C calque
    ("'A continuación, los grupos que realmente atendemos y las cuestiones que suelen plantearse al inicio. Esta descripción le ayuda a valorar si su asunto entra en nuestro alcance; es información general, no el análisis jurídico de un expediente concreto.',",
     "'A continuación, los asuntos de los que nos ocupamos y las cuestiones que suelen plantearse al inicio. Esta descripción le ayuda a valorar si su asunto entra en nuestro alcance; es información general, no el análisis jurídico de un expediente concreto.',"),
    ("'Este grupo cubre conflictos contractuales,", "'Esta área cubre conflictos contractuales,"),
    ("'Este grupo cubre la extinción del contrato de trabajo,", "'Esta área cubre la extinción del contrato de trabajo,"),
    ("'En este grupo el orden de los pasos es decisivo:", "'En esta área el orden de los pasos es decisivo:"),
    ("El despacho trabaja según el derecho de Taiwán y atiende asuntos de los grupos anteriores.",
     "El despacho trabaja según el derecho de Taiwán y atiende asuntos de las áreas anteriores."),
    ("La abogada Wei Tseng (曾雋崴) acompaña a clientes de Corea, de Japón y a otros clientes internacionales en los grupos anteriores.",
     "La abogada Wei Tseng (曾雋崴) acompaña a clientes de Corea, de Japón y a otros clientes internacionales en las áreas anteriores."),
    ("Si su asunto entra en los grupos anteriores y puede hablarse en uno de los cuatro idiomas de consulta",
     "Si su asunto entra en las áreas anteriores y puede hablarse en uno de los cuatro idiomas de consulta"),
    ("'Atendemos seis grupos: inversión y constitución de sociedades en Taiwán,",
     "'Atendemos seis áreas de práctica: inversión y constitución de sociedades en Taiwán,"),
    # a#25 explotar -> gestionar
    ("constituyen o explotan una sociedad en Taiwán", "constituyen o gestionan una sociedad en Taiwán"),
    # a#23 German Ablauf calque
    ("el despacho puede trabajar con el área de contabilidad en un mismo flujo.",
     "el despacho puede trabajar de forma integrada con el área de contabilidad."),
    # a#28 stiff calque
    ("Una cifra puesta de antemano no mostraría el coste de su expediente;",
     "Un importe indicado de antemano no reflejaría el coste de su expediente;"),
    # a#29 tautology
    ("'En el formulario de contacto puede elegir «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar una vía posible de comunicación cuando exista una forma posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',",
     "'En el formulario de contacto puede elegir «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar si existe una vía de comunicación posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',"),
    # a#26 FAQ title
    ("title: 'Preguntas que se formulan a menudo',", "title: 'Preguntas frecuentes',"),
    # a#27 Ebene calque
    ("'Las preguntas siguientes se responden en el plano de la información general. La respuesta para su propio caso solo puede darse después de que un abogado revise el expediente.',",
     "'Las respuestas siguientes son información general. La respuesta para su propio caso solo puede darse después de que un abogado revise el expediente.',"),
    # a#31 exclusive consultation languages
    ("'Idioma de consulta: la consulta con un abogado se realiza en inglés, chino (中文), japonés y coreano.',",
     "'Idioma de consulta: la consulta con un abogado se realiza únicamente en inglés, chino (中文), japonés y coreano.',"),
    # ACCEPTED: egresados -> titulados
    ("se fundó en 2016 por abogados egresados de la National Taiwan University",
     "se fundó en 2016 por abogados titulados por la National Taiwan University"),
    # ACCEPTED: contador asociado -> auditor asociado
    ("description: 'Perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering.',",
     "description: 'Perfiles de los abogados, de la dirección de operaciones y del auditor asociado de Hovering.',"),
    # 戶籍 wording harmonised with 016/017 (R8)
    ("documentos del registro de hogar (戶籍)", "documentos del registro de domicilio (戶籍)"),
])

# --- src/data/international-guidance-team.ts : es block only
apply("src/data/international-guidance-team.ts", [
    ("fullProfileLabel: 'Perfil completo (English)',", "fullProfileLabel: 'Perfil completo (en inglés)',"),
    ("      'Perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering.',",
     "      'Perfiles de los abogados, de la dirección de operaciones y del auditor asociado de Hovering.',"),
    ("    partnerTitle: 'Contador asociado',", "    partnerTitle: 'Auditor asociado',"),
    ("      'tseng-junwei': 'Abogada directora en Taiwán (Managing Attorney)',",
     "      'tseng-junwei': 'Abogada directora en Taiwán',"),
    ("      'chang-rongxuan': 'Abogado en Taiwán (Taiwan Attorney)',",
     "      'chang-rongxuan': 'Abogado en Taiwán',"),
    ("      'son-jungmin': 'Dirección de operaciones de Corea (Korea Operations Manager)',",
     "      'son-jungmin': 'Dirección de operaciones de Corea',"),
    ("      'huang-shengping': 'Contador asociado (Partner CPA)',",
     "      'huang-shengping': 'Auditor asociado',"),
    # a#30 keep the byte-identical preserved term, add the Spanish reading
    ("'Representó a un estudiante coreano en una reclamación de daños por una lesión en un gimnasio y obtuvo una sentencia de primera instancia de TWD 1.57M.',",
     "'Representó a un estudiante coreano en una reclamación de daños por una lesión en un gimnasio y obtuvo una sentencia de primera instancia de TWD 1.57M (1,57 millones de dólares taiwaneses).',"),
])

# --- offices
apply("src/data/international-guidance-offices.ts", [
    ("    websiteLabel: 'Sitio oficial',", "    websiteLabel: 'Sitio web oficial',"),
])

# --- answers (es block)
apply("src/data/international-guidance-answers.ts", [
    ("'El despacho atiende seis grupos de trabajo según el derecho de Taiwán: inversión y constitución de sociedades, litigios civiles y daños, matrimonio, familia y sucesiones, laboral, penal y propiedad intelectual. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía. La consulta se realiza en inglés, chino, japonés y coreano.',",
     "'El despacho atiende seis áreas de práctica según el derecho de Taiwán: inversión y constitución de sociedades, litigios civiles y daños, matrimonio, familia y sucesiones, laboral, penal y propiedad intelectual. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',"),
    ("fundado en 2016 por egresados de la National Taiwan University (國立臺灣大學)",
     "fundado en 2016 por titulados de la National Taiwan University (國立臺灣大學)"),
    ("El despacho no promete un resultado. La consulta se realiza en inglés, chino, japonés y coreano.',",
     "El despacho no promete un resultado. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',"),
    ("'Esta página muestra los perfiles de los abogados, de la dirección de operaciones y del contador asociado de Hovering. La abogada Wei Tseng (曾雋崴) está habilitada para ejercer en Taiwán y es la abogada directora del despacho; trabaja con clientes de Corea, de Japón y con otros clientes internacionales. La consulta se realiza en inglés, chino, japonés y coreano.',",
     "'Esta página muestra los perfiles de los abogados, de la dirección de operaciones y del auditor asociado de Hovering. La abogada Wei Tseng (曾雋崴) está habilitada para ejercer en Taiwán y es la abogada directora del despacho; trabaja con clientes de Corea, de Japón y con otros clientes internacionales. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',"),
    ("pueden surgir tasas judiciales o administrativas. La consulta se realiza en inglés, chino, japonés y coreano.',",
     "pueden surgir tasas judiciales o administrativas. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',"),
    ("El despacho no promete un plazo de respuesta y no confirma una cita a través de esta página. La consulta se realiza en inglés, chino, japonés y coreano.',",
     "El despacho no promete un plazo de respuesta y no confirma una cita a través de esta página. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',"),
    ("'Esta parte responde a preguntas frecuentes en el plano de la información general: los seis grupos de trabajo, la preparación antes del contacto, el modo de fijar los honorarios y el significado de enviar un mensaje. Una solicitud enviada espera la revisión de un abogado; no es asesoramiento jurídico, no es una cita y no crea una relación entre abogado y cliente. La consulta se realiza en inglés, chino, japonés y coreano.',",
     "'Esta parte responde a preguntas frecuentes como información general: las seis áreas de práctica, la preparación antes del contacto, el modo de fijar los honorarios y el significado de enviar un mensaje. Una solicitud enviada espera la revisión de un abogado; no es asesoramiento jurídico, no es una cita y no crea una relación entre abogado y cliente. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',"),
])

# --- inquiry copy (es block)
apply("src/data/international-inquiry-copy.ts", [
    ("      'La consulta se realiza en cuatro idiomas: inglés, chino (中文), japonés y coreano.',",
     "      'La consulta se realiza únicamente en cuatro idiomas: inglés, chino (中文), japonés y coreano.',"),
    ("      'Si no puede usar ninguno de esos cuatro idiomas, elija «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar una vía posible de comunicación cuando exista una forma posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',",
     "      'Si no puede usar ninguno de esos cuatro idiomas, elija «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar si existe una vía de comunicación posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',"),
])

# --- llms-txt (es notice)
apply("src/lib/llms-txt.ts", [
    ("      'El archivo llms.txt es solo un mapa para localizar páginas públicas; no promete posición en buscadores, respaldo, recomendación de IA ni visibilidad.',",
     "      'El archivo llms.txt es solo un mapa para localizar páginas públicas; no promete posicionamiento en buscadores, respaldo, recomendación por parte de una inteligencia artificial ni visibilidad garantizada.',"),
])
print("GUIDANCE DONE")
