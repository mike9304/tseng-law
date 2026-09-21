#!/usr/bin/env python3
import sys
sys.path.insert(0, "/Users/son7/Projects/tseng-law-fix-s-20260921/.tmp-es")
from apply import apply, apply_slice

# --- team.ts : es copy block (295..325) and es bios (1573..1640)
apply_slice("src/data/international-guidance-team.ts", 295, 325, [
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
])
apply("src/data/international-guidance-team.ts", [
    ("'Representó a un estudiante coreano en una reclamación de daños por una lesión en un gimnasio y obtuvo una sentencia de primera instancia de TWD 1.57M.',",
     "'Representó a un estudiante coreano en una reclamación de daños por una lesión en un gimnasio y obtuvo una sentencia de primera instancia de TWD 1.57M (1,57 millones de dólares taiwaneses).',"),
])

apply("src/data/international-guidance-offices.ts", [
    ("    websiteLabel: 'Sitio oficial',", "    websiteLabel: 'Sitio web oficial',"),
])

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

apply("src/data/international-inquiry-copy.ts", [
    ("      'La consulta se realiza en cuatro idiomas: inglés, chino (中文), japonés y coreano.',",
     "      'La consulta se realiza únicamente en cuatro idiomas: inglés, chino (中文), japonés y coreano.',"),
    ("      'Si no puede usar ninguno de esos cuatro idiomas, elija «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar una vía posible de comunicación cuando exista una forma posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',",
     "      'Si no puede usar ninguno de esos cuatro idiomas, elija «Hace falta confirmar la forma de comunicarse». Responderemos para comprobar si existe una vía de comunicación posible; no se garantiza el servicio en otro idioma y no se promete un plazo de respuesta.',"),
])

apply("src/lib/llms-txt.ts", [
    ("      'El archivo llms.txt es solo un mapa para localizar páginas públicas; no promete posición en buscadores, respaldo, recomendación de IA ni visibilidad.',",
     "      'El archivo llms.txt es solo un mapa para localizar páginas públicas; no promete posicionamiento en buscadores, respaldo, recomendación por parte de una inteligencia artificial ni visibilidad garantizada.',"),
])
print("GUIDANCE PART 2 DONE")
